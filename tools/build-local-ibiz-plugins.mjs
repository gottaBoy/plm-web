#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(rootDir, '../ibiz-app-hub');
const plugins = [
  '@ibiz-template-plugin/ai-chat',
  '@ibiz-template-plugin/bi-report',
  '@ibiz-template-plugin/data-view',
  '@ibiz-template-plugin/gantt',
];
const requiredDistFiles = [
  'index.legacy.js',
  'style.css',
  'polyfills.legacy.js',
];
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

if (!existsSync(path.join(sourceRoot, 'pnpm-workspace.yaml'))) {
  throw new Error(`Local ibiz-app-hub workspace not found: ${sourceRoot}`);
}

for (const packageName of plugins) {
  const packageRoot = path.join(sourceRoot, 'plugins', `ibiz-${packageName.split('/').at(-1)}`);
  const manifestPath = path.join(packageRoot, 'package.json');
  if (!existsSync(manifestPath)) {
    throw new Error(`Local plugin manifest not found: ${manifestPath}`);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const result = spawnSync(
    pnpm,
    ['--filter', packageName, 'run', 'build'],
    {
      cwd: sourceRoot,
      env: process.env,
      stdio: 'inherit',
    },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  for (const fileName of requiredDistFiles) {
    const file = path.join(packageRoot, 'dist', fileName);
    if (!existsSync(file)) {
      throw new Error(
        `${packageName}@${manifest.version} missing dist/${fileName} after build`,
      );
    }
  }
  console.log(
    `[plugins:build:local] OK ${packageName}@${manifest.version}`,
  );
}
