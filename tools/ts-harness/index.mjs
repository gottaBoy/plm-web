#!/usr/bin/env node

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import process from 'node:process';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, '..', '..');
const harnessDir = path.join(rootDir, 'tools', 'ts-harness');
const configPath = path.join(harnessDir, 'plugins.json');
const baselinePath = path.join(harnessDir, 'baseline.json');
const jsxShimPath = path.join(harnessDir, 'vue-jsx-shim.d.ts');

const compilerOptions = {
  target: 'ESNext',
  useDefineForClassFields: true,
  module: 'ESNext',
  moduleResolution: 'Node',
  strict: true,
  jsx: 'react-jsx',
  jsxImportSource: 'vue',
  sourceMap: true,
  resolveJsonModule: true,
  isolatedModules: true,
  esModuleInterop: true,
  experimentalDecorators: true,
  allowJs: true,
  lib: ['ESNext', 'DOM'],
  skipLibCheck: true,
};

function parseDiagnostics(output, root = rootDir) {
  const diagnostics = [];
  const pattern =
    /^(.*)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(pattern);
    if (!match) {
      continue;
    }
    const file = path.relative(root, path.resolve(root, match[1]));
    diagnostics.push({
      file: file.replaceAll(path.sep, '/'),
      line: Number(match[2]),
      column: Number(match[3]),
      code: match[4],
      message: match[5],
    });
  }
  return diagnostics;
}

function countCodes(diagnostics) {
  return diagnostics.reduce((counts, diagnostic) => {
    counts[diagnostic.code] = (counts[diagnostic.code] || 0) + 1;
    return counts;
  }, {});
}

function pluginNameFromSelector(selector) {
  const slash = selector.indexOf('/');
  if (slash < 0) {
    return selector;
  }
  const at = selector.lastIndexOf('@');
  return selector.slice(slash + 1, at > slash ? at : undefined);
}

function selectPlugins(config, selectors) {
  if (!selectors.length) {
    return config.plugins;
  }
  const selectedNames = new Set(selectors.map(pluginNameFromSelector));
  const plugins = config.plugins.filter((plugin) =>
    selectedNames.has(plugin.name),
  );
  const missing = [...selectedNames].filter(
    (name) => !plugins.some((plugin) => plugin.name === name),
  );
  if (missing.length) {
    throw new Error(
      `No TypeScript harness policy for plugin(s): ${missing.join(', ')}`,
    );
  }
  return plugins;
}

function summarize(plugin, diagnostics, exitCode) {
  return {
    name: plugin.name,
    mode: plugin.mode,
    vueCompilerTarget: plugin.vueCompilerTarget,
    exitCode,
    total: diagnostics.length,
    codes: countCodes(diagnostics),
    diagnostics,
  };
}

function compareBaseline(summary, baseline) {
  const failures = [];
  if (summary.total > baseline.total) {
    failures.push(
      `total diagnostics increased from ${baseline.total} to ${summary.total}`,
    );
  }
  const codes = new Set([
    ...Object.keys(baseline.codes || {}),
    ...Object.keys(summary.codes || {}),
  ]);
  for (const code of [...codes].sort()) {
    const actual = summary.codes[code] || 0;
    const allowed = baseline.codes?.[code] || 0;
    if (actual > allowed) {
      failures.push(`${code} increased from ${allowed} to ${actual}`);
    }
  }
  return failures;
}

function createTsConfig(plugin, tempDir) {
  const sourceDir = path.join(
    rootDir,
    'plugin-src',
    '@ibiz-template-plm',
    plugin.name,
    'src',
  );
  return {
    vueCompilerOptions: {
      target: String(plugin.vueCompilerTarget),
    },
    compilerOptions: {
      ...compilerOptions,
      baseUrl: rootDir,
      paths: {
        '@/*': ['src/*'],
      },
    },
    include: [
      path.join(sourceDir, '**/*.ts'),
      path.join(sourceDir, '**/*.tsx'),
      path.join(sourceDir, '**/*.vue'),
      jsxShimPath,
    ],
    exclude: [path.join(rootDir, 'node_modules')],
  };
}

async function runVueTsc(configPathForRun) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'pnpm',
      ['exec', 'vue-tsc', '--noEmit', '--pretty', 'false', '-p', configPathForRun],
      {
        cwd: rootDir,
        env: {
          ...process.env,
          CI: '1',
          FORCE_COLOR: '0',
          NO_COLOR: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`vue-tsc terminated by ${signal}`));
        return;
      }
      resolve({
        exitCode: code ?? 1,
        output: `${stdout}${stderr}`,
      });
    });
  });
}

async function runPlugin(plugin, tempRoot) {
  const tempDir = path.join(tempRoot, plugin.name);
  await mkdir(tempDir, { recursive: true });
  const tsConfigPath = path.join(tempDir, 'tsconfig.json');
  const tsConfig = createTsConfig(plugin, tempDir);
  await writeFile(tsConfigPath, `${JSON.stringify(tsConfig, null, 2)}\n`);
  const result = await runVueTsc(tsConfigPath);
  const diagnostics = parseDiagnostics(result.output);
  return summarize(plugin, diagnostics, result.exitCode);
}

async function loadJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

function assertSummary(summary, baseline, baselineOnly) {
  if (summary.mode === 'strict') {
    if (summary.total || summary.exitCode !== 0) {
      return [
        `strict mode requires zero diagnostics; got ${summary.total}`,
      ];
    }
    return [];
  }
  if (!baselineOnly && summary.mode !== 'baseline') {
    return [];
  }
  const failures = compareBaseline(summary, baseline[summary.name] || {});
  if (summary.exitCode === 0 && summary.total > 0) {
    failures.push('vue-tsc returned success despite parsed diagnostics');
  }
  return failures;
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const baselineOnly = args.includes('--baseline');
  const updateBaseline = args.includes('--update-baseline');
  const selectors = args.filter((arg) => !arg.startsWith('--'));
  if (updateBaseline && !selectors.length) {
    throw new Error(
      '--update-baseline requires an explicit plugin selector',
    );
  }
  const config = await loadJson(configPath);
  const baseline = await loadJson(baselinePath);
  const plugins = selectPlugins(config, selectors).filter(
    (plugin) => !baselineOnly || plugin.mode === 'baseline',
  );
  if (!plugins.length) {
    throw new Error('No TypeScript harness plugins selected');
  }
  const tempRoot = await mkdtemp(
    path.join(os.tmpdir(), 'aibiz-ts-harness-'),
  );
  const report = {
    status: 'running',
    startedAt: new Date().toISOString(),
    rootDir,
    baselineOnly,
    selectors,
    plugins: [],
  };
  try {
    for (const plugin of plugins) {
      console.log(`[plugin:types] ${plugin.name}`);
      const summary = await runPlugin(plugin, tempRoot);
      const failures =
        updateBaseline && plugin.mode === 'baseline'
          ? []
          : assertSummary(summary, baseline, baselineOnly);
      if (updateBaseline && plugin.mode === 'baseline') {
        baseline[plugin.name] = {
          total: summary.total,
          codes: summary.codes,
        };
      }
      report.plugins.push({
        ...summary,
        failures,
      });
      if (failures.length) {
        console.error(`  FAIL: ${failures.join('; ')}`);
      } else {
        console.log(`  OK: ${summary.total} diagnostic(s)`);
      }
    }
    if (updateBaseline) {
      await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
    }
    const failures = report.plugins.filter((plugin) => plugin.failures.length);
    report.status = failures.length ? 'failed' : 'passed';
    report.finishedAt = new Date().toISOString();
    const reportPath = path.join(
      rootDir,
      '.artifacts',
      'plm-ts-harness',
      `${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}.json`,
    );
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`\n[plugin:types] report ${reportPath}`);
    if (failures.length) {
      throw new Error(`${failures.length} plugin(s) failed TypeScript harness`);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

export {
  assertSummary,
  compareBaseline,
  countCodes,
  createTsConfig,
  parseDiagnostics,
  pluginNameFromSelector,
  selectPlugins,
  summarize,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`\n[plugin:types] FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
