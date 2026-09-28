#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import {
  access,
  cp,
  mkdir,
  mkdtemp,
  readdir,
  rename,
  rm,
  stat,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import ts from 'typescript';
import { build, loadConfigFromFile } from 'vite';
import legacy from '@qx-chitanda/vite-plugin-lib-legacy';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, '..');
const runtimeList = path.join(
  rootDir,
  'tools',
  'plugin-recovery',
  'runtime-plugins.txt',
);
const sourceRoot = path.join(rootDir, 'plugin-src');
const publicRoot = path.join(rootDir, 'public', 'plugins');
const ibizTempBin = path.join(rootDir, 'node_modules', '.bin', 'ibiz-temp');
const forbiddenPluginOutputFiles = [
  'cas-login.html',
  'dingtalk.html',
  'favicon.ico',
  'oauth.html',
];
const forbiddenPluginOutputDirs = [
  'environments',
  'extras',
  'model',
  'plugins',
];
const forbiddenPluginAssetDirs = [
  'css',
  'font-awesome-4.7.0',
  'iconfont',
  'ionicons',
];

function fail(message) {
  throw new Error(message);
}

function parsePackageRef(value) {
  const ref = value.trim();
  const slash = ref.indexOf('/');
  const at = ref.lastIndexOf('@');
  if (slash <= 0 || at <= slash + 1) {
    fail(`Invalid plugin reference: ${ref}`);
  }

  const scope = ref.slice(0, slash);
  const name = ref.slice(slash + 1, at);
  const version = ref.slice(at + 1);
  return {
    ref,
    scope,
    name,
    version,
    sourceDir: path.join(sourceRoot, scope, name),
    publicDir: path.join(publicRoot, ref),
  };
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function loadRuntimePlugins() {
  return readFileSync(runtimeList, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parsePackageRef);
}

function isCronEditor(plugin) {
  return plugin.scope === '@ibiz-template-plugins' && plugin.name === 'cron-editor';
}

function hasLegacyPlugin(plugins = []) {
  return plugins.some((plugin) => {
    const name = typeof plugin === 'object' ? plugin.name : undefined;
    return name === 'vite:legacy' || name === 'vite:legacy-post';
  });
}

async function runCommand(command, args, cwd) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} terminated by ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function ensurePluginLayout(plugin) {
  const packageFile = path.join(plugin.sourceDir, 'package.json');
  if (!existsSync(packageFile)) {
    fail(`Source package.json not found: ${packageFile}`);
  }
  if (!existsSync(plugin.publicDir)) {
    await mkdir(plugin.publicDir, { recursive: true });
  }
  return readJson(packageFile);
}

function resolvePluginDist(plugin) {
  return path.join(plugin.publicDir, 'dist');
}

function resolveStagingOutput(stagingDist, relativeFile) {
  const normalized = relativeFile.replaceAll('\\', '/');
  const distRelative = normalized.startsWith('dist/')
    ? normalized.slice('dist/'.length)
    : normalized;
  return path.join(stagingDist, distRelative);
}

function getPackageOutputs(packageJson) {
  return [
    ...['main', 'module', 'system'].flatMap((field) =>
      packageJson[field] ? [packageJson[field]] : [],
    ),
    ...(packageJson.styles || []),
  ].filter((file, index, files) => files.indexOf(file) === index);
}

function resolveConfiguredOutDir(plugin, config) {
  const configuredOutDir = config.build?.outDir || 'dist';
  return path.resolve(plugin.sourceDir, configuredOutDir);
}

function collectRuntimeExports(sourceText, fileName) {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.ts') || fileName.endsWith('.tsx')
      ? ts.ScriptKind.TSX
      : ts.ScriptKind.JS,
  );
  const exports = new Set();
  const addExportName = (name) => {
    if (name && name !== 'undefined') {
      exports.add(name);
    }
  };

  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      addExportName('default');
      continue;
    }
    const modifiers = ts.canHaveModifiers(statement)
      ? ts.getModifiers(statement) || []
      : [];
    const isExported = modifiers.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
    if (isExported) {
      if (
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isImportDeclaration(statement)
      ) {
        continue;
      }
      const isDefault = modifiers.some(
        (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
      );
      if (isDefault) {
        addExportName('default');
      } else if (statement.name) {
        addExportName(statement.name.text);
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (ts.isIdentifier(declaration.name)) {
            addExportName(declaration.name.text);
          }
        }
      } else if (ts.isEnumDeclaration(statement)) {
        addExportName(statement.name.text);
      }
    }

    if (ts.isExportDeclaration(statement)) {
      if (statement.isTypeOnly || !statement.exportClause) {
        continue;
      }
      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          if (!element.isTypeOnly) {
            addExportName(element.name.text);
          }
        }
      } else if (ts.isNamespaceExport(statement.exportClause)) {
        addExportName(statement.exportClause.name.text);
      }
    }
  }
  return exports;
}

async function assertFreshOutputs(plugin, packageJson, stagingDist) {
  const missing = [];
  for (const relativeFile of getPackageOutputs(packageJson)) {
    const outputFile = resolveStagingOutput(stagingDist, relativeFile);
    try {
      const outputStat = await stat(outputFile);
      if (!outputStat.isFile() || outputStat.size === 0) {
        missing.push(`${relativeFile} (empty or not a file)`);
      }
    } catch {
      missing.push(`${relativeFile} (not generated in fresh staging build)`);
    }
  }
  if (missing.length) {
    fail(
      `${plugin.ref} fresh staging build is incomplete:\n${missing
        .map((item) => `  - ${item}`)
        .join('\n')}`,
    );
  }
}

async function normalizeCss(distDir) {
  const assetCss = path.join(distDir, 'assets', 'style.css');
  const rootCss = path.join(distDir, 'style.css');
  if (existsSync(assetCss)) {
    await cp(assetCss, rootCss, { force: true });
  }
}

async function clearGeneratedDist(distDir) {
  if (!existsSync(distDir)) {
    return;
  }
  const entries = await readdir(distDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      await rm(path.join(distDir, entry.name), { force: true });
    }
  }
  await rm(path.join(distDir, 'assets', 'style.css'), { force: true });
}

async function normalizeLegacyFiles(distDir) {
  const files = [
    ['index.legacy.es.js', 'index.legacy.js'],
    ['polyfills.legacy.es.js', 'polyfills.legacy.js'],
  ];
  for (const [source, target] of files) {
    const sourceFile = path.join(distDir, source);
    if (existsSync(sourceFile)) {
      await rename(sourceFile, path.join(distDir, target));
    }
  }
}

async function buildVitePlugin(plugin, packageJson) {
  const configFile = path.join(plugin.sourceDir, 'vite.config.ts');
  if (!existsSync(configFile)) {
    fail(`Vite config not found: ${configFile}`);
  }

  const loaded = await loadConfigFromFile(
    { command: 'build', mode: 'production' },
    configFile,
    plugin.sourceDir,
  );
  if (!loaded) {
    fail(`Unable to load Vite config: ${configFile}`);
  }

  const expectedDist = resolvePluginDist(plugin);
  const resolvedConfiguredOutDir = resolveConfiguredOutDir(plugin, loaded.config);
  if (path.resolve(resolvedConfiguredOutDir) !== path.resolve(expectedDist)) {
    fail(
      `${plugin.ref} vite.config outDir mismatch: expected ${expectedDist}, got ${resolvedConfiguredOutDir}`,
    );
  }

  const plugins = loaded.config.plugins || [];
  const legacyPlugins = hasLegacyPlugin(plugins)
    ? []
    : legacy({
        targets: ['defaults', 'not IE 11'],
      });

  // vite-plugin-lib-legacy derives the legacy filename from Rollup's
  // entryFileNames. Without an explicit relative name, its fallback uses the
  // absolute outDir and Rollup rejects it as an invalid output pattern.
  const buildConfig = loaded.config.build || {};
  const rollupOptions = buildConfig.rollupOptions || {};
  const normalizeOutput = (output = {}) => ({
    ...output,
    format: output.format || 'es',
    entryFileNames: output.entryFileNames || '[name].es.js',
    chunkFileNames: output.chunkFileNames || '[name].es.js',
  });
  const output = Array.isArray(rollupOptions.output)
    ? rollupOptions.output.map(normalizeOutput)
    : normalizeOutput(rollupOptions.output);

  const stagingRoot = await mkdtemp(
    path.join(os.tmpdir(), 'aibiz-plugin-build-'),
  );
  const stagingDist = path.join(stagingRoot, 'dist');
  const pluginPublicDir = path.join(plugin.sourceDir, 'public');
  try {
    await build({
      ...loaded.config,
      configFile: false,
      root: plugin.sourceDir,
      publicDir: existsSync(pluginPublicDir) ? pluginPublicDir : false,
      // Runtime plugins are loaded directly by SystemJS in the browser.
      // Replace dependency checks such as vue-router's process.env.NODE_ENV
      // references so legacy bundles do not require a Node global.
      define: {
        ...(loaded.config.define || {}),
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      build: {
        ...buildConfig,
        outDir: stagingDist,
        emptyOutDir: true,
        rollupOptions: {
          ...rollupOptions,
          output,
        },
      },
      plugins: [...legacyPlugins, ...plugins],
    });
    await normalizeLegacyFiles(stagingDist);
    await normalizeCss(stagingDist);
    await assertFreshOutputs(plugin, packageJson, stagingDist);
    await clearGeneratedDist(expectedDist);
    await mkdir(expectedDist, { recursive: true });
    await cp(stagingDist, expectedDist, {
      recursive: true,
      force: true,
    });
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
}

async function buildCronEditor(plugin) {
  if (!existsSync(ibizTempBin)) {
    fail(`ibiz-temp not found: ${ibizTempBin}`);
  }
  await runCommand(ibizTempBin, ['build', '-c'], plugin.sourceDir);
}

async function buildOne(plugin) {
  const packageJson = await ensurePluginLayout(plugin);
  console.log(`\n[plugins:build] ${plugin.ref}`);
  if (isCronEditor(plugin)) {
    await buildCronEditor(plugin);
  } else {
    await buildVitePlugin(plugin, packageJson);
  }
  return packageJson;
}

async function checkFile(file, missing) {
  try {
    await access(file);
  } catch {
    missing.push(file);
  }
}

async function checkOne(plugin) {
  const packageFile = path.join(plugin.sourceDir, 'package.json');
  const publicPackageFile = path.join(plugin.publicDir, 'package.json');
  const sourceEntry = path.join(plugin.sourceDir, 'src', 'index.ts');
  const distDir = path.join(plugin.publicDir, 'dist');
  const missing = [];
  if (!existsSync(sourceEntry)) {
    missing.push(`${sourceEntry} (source entry missing)`);
  }
  if (!existsSync(packageFile)) {
    missing.push(packageFile);
  }
  if (!existsSync(publicPackageFile)) {
    missing.push(publicPackageFile);
  }
  if (missing.length) {
    return missing;
  }

  const packageJson = readJson(packageFile);
  const outputPackage = readJson(publicPackageFile);
  if (outputPackage.name !== packageJson.name) {
    missing.push(`${publicPackageFile} (name mismatch)`);
  }
  if (outputPackage.version !== packageJson.version) {
    missing.push(`${publicPackageFile} (version mismatch)`);
  }

  const expectedFiles = [];
  for (const field of ['main', 'module', 'system']) {
    if (packageJson[field]) {
      expectedFiles.push(packageJson[field]);
    }
  }
  for (const style of packageJson.styles || []) {
    expectedFiles.push(style);
  }
  for (const relativeFile of [...new Set(expectedFiles)]) {
    await checkFile(path.join(plugin.publicDir, relativeFile), missing);
  }

  const entryFile = packageJson.module || packageJson.main;
  const sourceText = readFileSync(sourceEntry, 'utf8');
  const builtEntry = path.join(plugin.publicDir, entryFile);
  if (existsSync(builtEntry)) {
    const sourceExports = collectRuntimeExports(sourceText, sourceEntry);
    const builtExports = collectRuntimeExports(
      readFileSync(builtEntry, 'utf8'),
      builtEntry,
    );
    const missingExports = [...sourceExports].filter(
      (name) => !builtExports.has(name),
    );
    if (missingExports.length) {
      missing.push(
        `${builtEntry} (missing runtime exports: ${missingExports.join(', ')})`,
      );
    }
  }

  if (!isCronEditor(plugin) && (packageJson.styles || []).length) {
    for (const relativeFile of [
      'dist/index.es.js',
      'dist/index.legacy.js',
      'dist/polyfills.legacy.js',
      'dist/style.css',
    ]) {
      await checkFile(path.join(plugin.publicDir, relativeFile), missing);
    }
  }

  for (const file of forbiddenPluginOutputFiles) {
    if (existsSync(path.join(distDir, file))) {
      missing.push(`${path.join(distDir, file)} (unexpected application output)`);
    }
  }
  for (const directory of forbiddenPluginOutputDirs) {
    if (existsSync(path.join(distDir, directory))) {
      missing.push(
        `${path.join(distDir, directory)} (unexpected application output)`,
      );
    }
  }
  const assetsDir = path.join(distDir, 'assets');
  for (const directory of forbiddenPluginAssetDirs) {
    if (existsSync(path.join(assetsDir, directory))) {
      missing.push(
        `${path.join(assetsDir, directory)} (unexpected application asset)`,
      );
    }
  }
  return missing;
}

async function checkAll(plugins) {
  let failed = 0;
  for (const plugin of plugins) {
    const missing = await checkOne(plugin);
    if (missing.length) {
      failed += 1;
      console.error(`\n[plugins:check] FAIL ${plugin.ref}`);
      for (const file of missing) {
        console.error(`  - ${file}`);
      }
    } else {
      console.log(`[plugins:check] OK   ${plugin.ref}`);
    }
  }
  if (failed) {
    fail(`${failed} plugin(s) failed output validation`);
  }
  console.log(`\n[plugins:check] ${plugins.length} plugin(s) passed`);
}

async function main() {
  const command = process.argv[2] || 'check';
  const plugins = loadRuntimePlugins();

  if (command === 'check') {
    await checkAll(plugins);
    return;
  }

  if (command === 'build:one') {
    const ref = process.argv.slice(3).find((arg) => arg !== '--');
    if (!ref) {
      fail('Usage: pnpm plugins:build:one -- <scope/name@version>');
    }
    const plugin = parsePackageRef(ref);
    await buildOne(plugin);
    await checkAll([plugin]);
    return;
  }

  if (command === 'build' || command === 'build:from') {
    const startRef =
      command === 'build:from'
        ? process.argv.slice(3).find((arg) => arg !== '--')
        : undefined;
    if (command === 'build:from' && !startRef) {
      fail('Usage: node tools/build-plugins.mjs build:from <scope/name@version>');
    }
    let started = !startRef;
    for (const plugin of plugins) {
      if (!started && plugin.ref === startRef) {
        started = true;
      }
      if (!started) {
        continue;
      }
      await buildOne(plugin);
    }
    await checkAll(plugins);
    return;
  }

  fail(`Unknown command: ${command}`);
}

export {
  assertFreshOutputs,
  buildOne,
  checkOne,
  collectRuntimeExports,
  getPackageOutputs,
  loadRuntimePlugins,
  clearGeneratedDist,
  normalizeLegacyFiles,
  parsePackageRef,
  resolveConfiguredOutDir,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`\n[plugins] ${error.message}`);
    process.exitCode = 1;
  });
}
