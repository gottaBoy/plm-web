#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageFile = path.join(rootDir, 'package.json');
const lockFile = path.join(rootDir, 'pnpm-lock.yaml');
const runtimePluginFile = path.join(
  rootDir,
  'tools',
  'plugin-recovery',
  'runtime-plugins.txt',
);
const sourceRoot = path.join(rootDir, 'plugin-src');
const publicRoot = path.join(rootDir, 'public', 'plugins');

const localPackages = {
  '@ibiz-template-plugin/ai-chat':
    '../ibiz-app-hub/plugins/ibiz-ai-chat',
  '@ibiz-template-plugin/bi-report':
    '../ibiz-app-hub/plugins/ibiz-bi-report',
  '@ibiz-template-plugin/data-view':
    '../ibiz-app-hub/plugins/ibiz-data-view',
  '@ibiz-template-plugin/gantt':
    '../ibiz-app-hub/plugins/ibiz-gantt',
  '@ibiz-template/core': '../ibiz-app-hub/packages/core',
  '@ibiz-template/devtool': '../ibiz-app-hub/plugins/ibiz-template-devtools',
  '@ibiz-template/model-helper': '../ibiz-app-hub/packages/model-helper',
  '@ibiz-template/runtime': '../ibiz-app-hub/packages/runtime',
  '@ibiz-template/theme': '../ibiz-app-hub/packages/theme',
  '@ibiz-template/vue3-components':
    '../ibiz-app-hub/components/ibiz-next-vue3',
  '@ibiz-template/vue3-util': '../ibiz-app-hub/packages/vue3-util',
  '@ibiz-template/web-theme': '../ibiz-app-hub/components/web-theme',
  '@ibiz/model-core': '../ibiz-app-hub/models/model-core',
  '@ibiz/rt-model-api': '../ibiz-app-hub/models/rt-model-api',
};

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function fail(message) {
  console.error(`[ibiz:versions] FAIL ${message}`);
  process.exitCode = 1;
}

function parsePluginRef(ref) {
  const slash = ref.indexOf('/');
  const at = ref.lastIndexOf('@');
  if (slash <= 0 || at <= slash + 1) {
    throw new Error(`invalid plugin reference: ${ref}`);
  }
  return {
    ref,
    scope: ref.slice(0, slash),
    name: ref.slice(slash + 1, at),
    version: ref.slice(at + 1),
  };
}

const appPackage = readJson(packageFile);
const lockText = readFileSync(lockFile, 'utf8');

for (const [name, relativePath] of Object.entries(localPackages)) {
  const expectedSpecifier = `link:${relativePath}`;
  const actualSpecifier =
    appPackage.dependencies?.[name] || appPackage.devDependencies?.[name];
  if (actualSpecifier !== expectedSpecifier) {
    fail(
      `${name} must use ${expectedSpecifier}, found ${
        actualSpecifier || 'missing'
      }`,
    );
    continue;
  }

  const sourcePackageFile = path.join(rootDir, relativePath, 'package.json');
  if (!existsSync(sourcePackageFile)) {
    fail(`${name} source package is missing: ${sourcePackageFile}`);
    continue;
  }

  const sourcePackage = readJson(sourcePackageFile);
  if (sourcePackage.name !== name) {
    fail(
      `${name} source package name mismatch: ${sourcePackage.name} at ${relativePath}`,
    );
  }
  if (!sourcePackage.version) {
    fail(`${name} source package has no version: ${relativePath}`);
  }

  const lockEntry = new RegExp(
    `['"]?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?:\\s*\\n\\s+specifier: ${expectedSpecifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\n\\s+version: ${expectedSpecifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
  );
  if (!lockEntry.test(lockText)) {
    fail(`${name} lockfile entry does not point to ${expectedSpecifier}`);
  }

  console.log(
    `[ibiz:versions] OK package ${name} ${sourcePackage.version} <- ${relativePath}`,
  );
}

const pluginLines = readFileSync(runtimePluginFile, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

for (const line of pluginLines) {
  const plugin = parsePluginRef(line);
  const sourceDir = path.join(sourceRoot, plugin.scope, plugin.name);
  const sourcePackageFile = path.join(sourceDir, 'package.json');
  const publicDir = path.join(publicRoot, plugin.ref);
  const publicPackageFile = path.join(publicDir, 'package.json');

  if (!existsSync(sourcePackageFile)) {
    fail(`plugin source package is missing: ${sourcePackageFile}`);
    continue;
  }
  if (!existsSync(publicPackageFile)) {
    fail(`plugin output package is missing: ${publicPackageFile}`);
    continue;
  }

  const sourcePackage = readJson(sourcePackageFile);
  const publicPackage = readJson(publicPackageFile);
  if (sourcePackage.name !== plugin.ref.slice(0, plugin.ref.lastIndexOf('@'))) {
    fail(`plugin source name mismatch: ${plugin.ref}`);
  }
  if (sourcePackage.version !== plugin.version) {
    fail(
      `plugin source version mismatch: ${plugin.ref}; source has ${sourcePackage.version}`,
    );
  }
  if (publicPackage.name !== sourcePackage.name) {
    fail(`plugin output name mismatch: ${plugin.ref}`);
  }
  if (publicPackage.version !== sourcePackage.version) {
    fail(`plugin output version mismatch: ${plugin.ref}`);
  }
}

for (const staleVersion of ['0.6.18', '0.7.0', '0.7.39']) {
  if (lockText.includes(staleVersion)) {
    fail(`stale iBiz version remains in pnpm-lock.yaml: ${staleVersion}`);
  }
}

if (!process.exitCode) {
  console.log(
    `[ibiz:versions] ${Object.keys(localPackages).length} local packages and ${pluginLines.length} plugins passed`,
  );
}
