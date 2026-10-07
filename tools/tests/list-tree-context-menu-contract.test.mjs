import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const plugins = [
  {
    name: 'group-tree',
    version: '0.0.3-alpha.252',
  },
  {
    name: 'list-tree',
    version: '0.0.3-alpha.225',
  },
];

function readPluginFile(plugin, relativeFile) {
  return readFileSync(
    path.join(
      ROOT,
      'public',
      'plugins',
      '@ibiz-template-plm',
      `${plugin.name}@${plugin.version}`,
      relativeFile,
    ),
    'utf8',
  );
}

test('tree plugins externalize and unwrap the context-menu runtime', () => {
  for (const plugin of plugins) {
    const pluginRoot = path.join(
      ROOT,
      'plugin-src',
      '@ibiz-template-plm',
      plugin.name,
    );
    const source = readFileSync(path.join(pluginRoot, 'src/index.ts'), 'utf8');
    const viteConfig = readFileSync(
      path.join(pluginRoot, 'vite.config.ts'),
      'utf8',
    );
    assert.match(
      viteConfig,
      /['"]@imengyu\/vue3-context-menu['"]/,
      `${plugin.name} must load context-menu from the application runtime import map`,
    );
    assert.match(source, /candidate\.default/);
    assert.match(source, /candidate\.v/);
    assert.match(source, /typeof candidate\.showContextMenu === "function"/);
    assert.match(source, /T\?\.showContextMenu\?\./.test(source)
      ? /T\?\.showContextMenu\?\./
      : /v\?\.showContextMenu/);
  }
});

test('tree plugin bundles keep context-menu as a SystemJS runtime dependency', () => {
  for (const plugin of plugins) {
    const distRoot = path.join(
      ROOT,
      'public',
      'plugins',
      '@ibiz-template-plm',
      `${plugin.name}@${plugin.version}`,
      'dist',
    );
    const esBundle = readPluginFile(plugin, 'dist/index.es.js');
    const legacyBundle = readPluginFile(plugin, 'dist/index.legacy.js');
    assert.match(esBundle, /import\("@imengyu\/vue3-context-menu"\)/);
    assert.match(
      legacyBundle,
      /(?:t|e)\.import\("@imengyu\/vue3-context-menu"\)/,
    );
    assert.match(legacyBundle, /System\.register\("/);
    const registration = legacyBundle.match(
      /System\.register\("[^"]+",\[(.*?)\]/,
    );
    assert.ok(
      registration,
      `${plugin.name} SystemJS dependency list is missing`,
    );
    assert.doesNotMatch(
      registration[1],
      /vue3-context-menu/,
      'context-menu must not be initialized as a bundled Vue UMD dependency',
    );
    assert.equal(
      readdirSync(distRoot).some((file) =>
        /^vue3-context-menu\.umd\.(es|legacy)\.js$/.test(file),
      ),
      false,
      'stale context-menu UMD chunks must not remain in the plugin output',
    );
    for (const file of [
      'index.es.js',
      'index.legacy.js',
      'polyfills.legacy.js',
      'style.css',
    ]) {
      assert.equal(existsSync(path.join(distRoot, file)), true, file);
    }
    assert.doesNotMatch(
      legacyBundle,
      /(?:^|[^\w$.])process(?:\.env)?\b/,
      `${plugin.name} legacy bundle must not require a bare process global`,
    );
  }
});
