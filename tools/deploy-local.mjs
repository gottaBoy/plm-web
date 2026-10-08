#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const DEFAULT_BASE_URL = 'http://127.0.0.1:30250/ibizplm-plmweb/';
const DEFAULT_CONTAINER = 'plmweb';

export function parseArgs(argv) {
  const options = {
    plugins: [],
    build: true,
    container: process.env.PLMWEB_CONTAINER || DEFAULT_CONTAINER,
    baseUrl: process.env.PLM_E2E_BASE_URL || DEFAULT_BASE_URL,
    healthTimeoutMs: 120_000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      return { ...options, help: true };
    }
    if (arg === '--no-build') {
      options.build = false;
      continue;
    }
    if (arg === '--plugin') {
      const value = argv[index + 1];
      if (!value) throw new Error('--plugin requires a plugin reference');
      options.plugins.push(...value.split(',').filter(Boolean));
      index += 1;
      continue;
    }
    if (arg === '--container' || arg === '--base-url' || arg === '--health-timeout-ms') {
      const value = argv[index + 1];
      if (!value) throw new Error(`${arg} requires a value`);
      if (arg === '--container') options.container = value;
      if (arg === '--base-url') options.baseUrl = value;
      if (arg === '--health-timeout-ms') {
        const timeout = Number(value);
        if (!Number.isFinite(timeout) || timeout <= 0) {
          throw new Error('--health-timeout-ms must be a positive number');
        }
        options.healthTimeoutMs = timeout;
      }
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  if (!options.plugins.every(ref => /^@[^/]+\/[^@]+@[^@]+$/.test(ref))) {
    throw new Error(
      'Plugin references must use scope/name@version, for example @ibiz-template-plm/resource-gantt@0.0.3-alpha.304',
    );
  }
  if (!/^https?:\/\//.test(options.baseUrl)) {
    throw new Error('--base-url must be an HTTP or HTTPS URL');
  }
  return options;
}

export function buildCommands(options) {
  const commands = [];
  if (options.build) {
    for (const ref of options.plugins) {
      commands.push({
        command: 'pnpm',
        args: ['plugins:build:one', '--', ref],
        label: `build ${ref}`,
      });
    }
    commands.push({
      command: 'pnpm',
      args: ['build'],
      label: 'build PLM web application',
    });
  }
  return commands;
}

function spawnCommand(command, args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${label} failed with exit code ${code}`));
    });
  });
}

async function waitForHealthy(options, dependencies) {
  const deadline = Date.now() + options.healthTimeoutMs;
  let lastStatus = 'unknown';
  while (Date.now() < deadline) {
    const { stdout } = await dependencies.execFile('docker', [
      'inspect',
      '--format',
      '{{.State.Health.Status}}',
      options.container,
    ]);
    lastStatus = stdout.trim();
    if (lastStatus === 'healthy') return;
    await dependencies.delay(2000);
  }
  throw new Error(
    `Container ${options.container} did not become healthy; last status: ${lastStatus}`,
  );
}

async function assertHttpOk(url, dependencies) {
  const response = await dependencies.fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.text();
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function verifyPlugins(options, dependencies) {
  for (const ref of options.plugins) {
    for (const file of ['dist/index.es.js', 'dist/index.legacy.js']) {
      const publicFile = path.join(ROOT, 'public/plugins', ref, file);
      const distFile = path.join(ROOT, 'dist/plugins', ref, file);
      const publicBytes = await dependencies.readFile(publicFile);
      const distBytes = await dependencies.readFile(distFile);
      const publicHash = sha256(publicBytes);
      const distHash = sha256(distBytes);
      if (publicHash !== distHash) {
        throw new Error(
          `Stale application build for ${ref}/${file}: public ${publicHash}, dist ${distHash}`,
        );
      }

      const url = new URL(`plugins/${ref}/${file}`, options.baseUrl);
      const remoteBytes = await assertHttpOk(url, dependencies);
      const remoteHash = sha256(remoteBytes);
      if (publicHash !== remoteHash) {
        throw new Error(
          `Container serves stale bytes for ${ref}/${file}: expected ${publicHash}, got ${remoteHash}`,
        );
      }
    }
  }
}

export async function runDeployment(options, dependencies = {}) {
  const execFile = dependencies.execFile;
  const run = dependencies.runCommand || spawnCommand;
  const delay = dependencies.delay || (ms => new Promise(resolve => setTimeout(resolve, ms)));
  const deps = {
    execFile,
    delay,
    fetch:
      dependencies.fetch ||
      (async url => fetch(url, { redirect: 'manual' })),
    readFile: dependencies.readFile || (file => readFile(file)),
  };
  if (!execFile) throw new Error('execFile dependency is required');

  for (const command of buildCommands(options)) {
    await run(command.command, command.args, command.label);
  }

  await execFile('docker', ['restart', options.container]);
  await waitForHealthy(options, deps);
  await assertHttpOk(options.baseUrl, deps);
  await verifyPlugins(options, deps);
  return {
    container: options.container,
    baseUrl: options.baseUrl,
    plugins: options.plugins,
  };
}

function printUsage() {
  console.log(`Usage: pnpm deploy:local [options]

Rebuilds selected PLM plugins, rebuilds the application, restarts the local
Docker container, waits for its health check, and verifies served plugin bytes.

Options:
  --plugin <scope/name@version>  Plugin to rebuild and verify (repeatable or comma-separated)
  --no-build                     Restart and verify existing build outputs
  --container <name>             Container name (default: plmweb)
  --base-url <url>               Local application URL (default: ${DEFAULT_BASE_URL})
  --health-timeout-ms <ms>       Container health timeout (default: 120000)
  -h, --help                     Show this help
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  const { promisify } = await import('node:util');
  const { execFile } = await import('node:child_process');
  const execFileAsync = promisify(execFile);
  const result = await runDeployment(options, { execFile: execFileAsync });
  console.log(
    `Deployed ${result.baseUrl} through container ${result.container}${
      result.plugins.length ? `; verified ${result.plugins.join(', ')}` : ''
    }`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}
