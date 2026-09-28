#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import process from 'node:process';
import {
  getPackageOutputs,
  loadRuntimePlugins,
  parsePackageRef,
} from './build-plugins.mjs';

const rootPath = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const e2eDir = path.join(rootPath, '..', 'plm-e2e');
const cliArgs = process.argv.slice(2);
const showHelp = cliArgs.includes('--help') || cliArgs.includes('-h');
const refs = cliArgs.filter((arg) => arg !== '--' && !arg.startsWith('-'));

function printUsage() {
  console.log(
    [
      'Usage: pnpm plugin:regression -- <scope/name@version> [scope/name@version ...]',
      '',
      'Options:',
      '  -h, --help  Show this help and exit',
    ].join('\n'),
  );
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function artifactDirectory() {
  if (process.env.PLM_E2E_ARTIFACT_DIR) {
    return path.resolve(process.env.PLM_E2E_ARTIFACT_DIR);
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(
    rootPath,
    '..',
    '.artifacts',
    'plm-plugin-regression',
    `${stamp}-${process.pid}`,
  );
}

async function run(command, args, cwd, label, extraEnv = {}) {
  const startedAt = new Date().toISOString();
  const started = Date.now();
  console.log(`\n[harness] ${label}`);
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: { ...process.env, ...extraEnv },
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${label} terminated by ${signal}`));
      } else if (code !== 0) {
        reject(new Error(`${label} exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
  return {
    label,
    startedAt,
    finishedAt: new Date().toISOString(),
    durationMs: Date.now() - started,
    status: 'passed',
  };
}

function urlFor(baseUrl, relativePath) {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(relativePath.replaceAll('\\', '/'), base).toString();
}

async function fetchBytes(url, label) {
  const response = await fetch(url);
  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}: ${url}`);
  }
  if (
    contentType.includes('text/html') ||
    /^\s*<(?:!doctype|html)\b/i.test(bytes.toString('utf8', 0, 256))
  ) {
    throw new Error(`${label} returned HTML instead of an asset: ${url}`);
  }
  return { bytes, contentType };
}

async function verifyPluginHttp(plugin, baseUrl) {
  const publicPackageFile = path.join(plugin.publicDir, 'package.json');
  const packageJson = JSON.parse(await readFile(publicPackageFile, 'utf8'));
  const manifestUrl = urlFor(baseUrl, `plugins/${plugin.ref}/package.json`);
  const manifestResponse = await fetchBytes(manifestUrl, `${plugin.ref} manifest`);
  let remotePackage;
  try {
    remotePackage = JSON.parse(manifestResponse.bytes.toString('utf8'));
  } catch {
    throw new Error(`${plugin.ref} manifest is not valid JSON: ${manifestUrl}`);
  }
  if (
    remotePackage.name !== packageJson.name ||
    remotePackage.version !== packageJson.version
  ) {
    throw new Error(
      `${plugin.ref} manifest mismatch: ${JSON.stringify({
        local: { name: packageJson.name, version: packageJson.version },
        remote: { name: remotePackage.name, version: remotePackage.version },
      })}`,
    );
  }

  const files = [];
  for (const relativeFile of getPackageOutputs(packageJson)) {
    const localFile = path.join(plugin.publicDir, relativeFile);
    const localBytes = await readFile(localFile);
    const remoteUrl = urlFor(
      baseUrl,
      `plugins/${plugin.ref}/${relativeFile}`,
    );
    const remote = await fetchBytes(
      remoteUrl,
      `${plugin.ref} ${relativeFile}`,
    );
    const localHash = sha256(localBytes);
    const remoteHash = sha256(remote.bytes);
    if (localHash !== remoteHash) {
      throw new Error(
        `${plugin.ref} HTTP hash mismatch for ${relativeFile}: local ${localHash}, remote ${remoteHash}`,
      );
    }
    files.push({
      path: relativeFile,
      bytes: localBytes.length,
      sha256: localHash,
      url: remoteUrl,
      contentType: remote.contentType,
    });
  }

  return {
    ref: plugin.ref,
    name: packageJson.name,
    version: packageJson.version,
    gitHead: packageJson.gitHead || null,
    manifest: {
      url: manifestUrl,
      sha256: sha256(manifestResponse.bytes),
    },
    files,
  };
}

async function main() {
  if (showHelp) {
    printUsage();
    return;
  }
  const unknownOption = cliArgs.find((arg) => arg.startsWith('-') && arg !== '--');
  if (unknownOption) {
    printUsage();
    throw new Error(`Unknown option: ${unknownOption}`);
  }
  if (!refs.length) {
    printUsage();
    throw new Error('At least one plugin reference is required');
  }
  const supportedRefs = new Set(loadRuntimePlugins().map((plugin) => plugin.ref));
  for (const ref of refs) {
    if (!supportedRefs.has(ref)) {
      throw new Error(`Plugin reference is not in the runtime catalog: ${ref}`);
    }
  }

  const artifactDir = artifactDirectory();
  await mkdir(artifactDir, { recursive: true });
  const baseUrl =
    process.env.PLM_E2E_BASE_URL ||
    'http://127.0.0.1:30250/ibizplm-plmweb/';
  const report = {
    status: 'running',
    startedAt: new Date().toISOString(),
    finishedAt: null,
    artifactDir,
    baseUrl,
    refs,
    stages: [],
    plugins: [],
    error: null,
  };
  const reportPath = path.join(artifactDir, 'plugin-regression.json');

  try {
    report.stages.push(
      await run(
        'pnpm',
        ['plugin:types'],
        rootPath,
        'validate plugin TypeScript diagnostics',
      ),
    );

    for (const ref of refs) {
      report.stages.push(
        await run(
          'pnpm',
          ['plugins:build:one', '--', ref],
          rootPath,
          `build ${ref}`,
        ),
      );
    }

    report.stages.push(
      await run(
        'pnpm',
        ['plugins:check'],
        rootPath,
        'validate plugin outputs and export contracts',
      ),
    );
    report.stages.push(
      await run(
        'pnpm',
        ['ibiz:versions:check'],
        rootPath,
        'validate local iBiz versions',
      ),
    );

    for (const ref of refs) {
      report.plugins.push(await verifyPluginHttp(parsePackageRef(ref), baseUrl));
    }
    report.stages.push({
      label: 'verify plugin HTTP manifests, runtime assets, styles, and hashes',
      finishedAt: new Date().toISOString(),
      status: 'passed',
      pluginCount: report.plugins.length,
    });

    const e2eArgs = [
      'exec',
      'playwright',
      'test',
      'tests/navigation.spec.ts',
      'tests/known-issues.spec.ts',
      'tests/person-select.spec.ts',
      '--project=desktop',
      '--workers=1',
    ];
    report.stages.push(
      await run(
        'pnpm',
        e2eArgs,
        e2eDir,
        'run PLM desktop smoke',
        {
          PLM_E2E_ARTIFACT_DIR: artifactDir,
          PLM_E2E_INCLUDE_KNOWN: '1',
          PLM_E2E_BASE_URL: baseUrl,
          PLM_E2E_USERNAME: process.env.PLM_E2E_USERNAME || 'aibizhi',
          PLM_E2E_PASSWORD: process.env.PLM_E2E_PASSWORD || '123456',
        },
      ),
    );
    report.status = 'passed';
  } catch (error) {
    report.status = 'failed';
    report.error = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
    };
    throw error;
  } finally {
    report.finishedAt = new Date().toISOString();
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`\n[harness] report ${reportPath}`);
  }
}

main().catch((error) => {
  console.error(`\n[harness] FAILED: ${error.message}`);
  process.exitCode = 1;
});
