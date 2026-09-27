#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { mkdir, cp, access, readdir, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
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

async function buildVitePlugin(plugin) {
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

  await build({
    ...loaded.config,
    configFile,
    root: plugin.sourceDir,
    build: {
      ...buildConfig,
      rollupOptions: {
        ...rollupOptions,
        output,
      },
    },
    plugins: [...legacyPlugins, ...plugins],
  });
}

async function buildCronEditor(plugin) {
  if (!existsSync(ibizTempBin)) {
    fail(`ibiz-temp not found: ${ibizTempBin}`);
  }
  await runCommand(ibizTempBin, ['build', '-c'], plugin.sourceDir);
}

async function normalizeCss(plugin) {
  const assetCss = path.join(plugin.publicDir, 'dist', 'assets', 'style.css');
  const rootCss = path.join(plugin.publicDir, 'dist', 'style.css');
  if (existsSync(assetCss) && !existsSync(rootCss)) {
    await cp(assetCss, rootCss);
  }
}

async function normalizeLegacyFiles(plugin) {
  const distDir = path.join(plugin.publicDir, 'dist');
  if (!existsSync(distDir)) {
    return;
  }
  const files = await readdir(distDir);
  for (const file of files) {
    if (!file.endsWith('.legacy.es.js')) {
      continue;
    }
    const target = file.replace('.legacy.es.js', '.legacy.js');
    await rename(path.join(distDir, file), path.join(distDir, target));
  }
}

async function buildOne(plugin) {
  const packageJson = await ensurePluginLayout(plugin);
  console.log(`\n[plugins:build] ${plugin.ref}`);
  if (isCronEditor(plugin)) {
    await buildCronEditor(plugin);
  } else {
    await buildVitePlugin(plugin);
    await normalizeLegacyFiles(plugin);
    await normalizeCss(plugin);
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
  const missing = [];
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

main().catch((error) => {
  console.error(`\n[plugins] ${error.message}`);
  process.exitCode = 1;
});
