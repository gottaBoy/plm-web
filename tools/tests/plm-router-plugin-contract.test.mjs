import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
    name: 'tab-exp-select',
    version: '0.0.3-dev.254',
  },
  {
    name: 'breadcrumb-nav-pos',
    version: '0.0.3-alpha.247',
  },
  {
    name: 'route-picker',
    version: '0.0.3-alpha.245',
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

test('host shares Vue and vue-router with SystemJS before bootstrapping', () => {
  const main = readFileSync(path.join(ROOT, 'src', 'main.ts'), 'utf8');
  assert.match(main, /import \* as Vue from ['"]vue['"]/);
  assert.match(main, /import \* as VueRouter from ['"]vue-router['"]/);
  assert.match(main, /System\.set\(System\.resolve\('vue'\), Vue\)|System\.set\(vueUrl, Vue\)/);
  assert.match(main, /System\.set\(System\.resolve\('vue-router'\), VueRouter\)|System\.set\(routerUrl, VueRouter\)/);
  assert.ok(
    main.indexOf('System.set(routerUrl, VueRouter)') < main.indexOf('runApp(['),
    'router registration must happen before runApp',
  );
});

test('router-dependent PLM plugins externalize vue-router in source builds', () => {
  for (const plugin of plugins) {
    const config = readFileSync(
      path.join(
        ROOT,
        'plugin-src',
        '@ibiz-template-plm',
        plugin.name,
        'vite.config.ts',
      ),
      'utf8',
    );
    assert.match(
      config,
      /external:\s*\[[\s\S]*?['"]vue-router['"][\s\S]*?\]/,
      `${plugin.name} must externalize vue-router`,
    );
  }
});

test('router-dependent PLM plugin bundles use the host router instance', () => {
  for (const plugin of plugins) {
    for (const outputFile of ['dist/index.es.js', 'dist/index.legacy.js']) {
      const bundle = readPluginFile(plugin, outputFile);
      assert.match(
        bundle,
        outputFile.endsWith('index.es.js')
          ? /from ["']vue-router["']/
          : /System\.register\([^,]+,\[[^\]]*["']vue-router["']/,
        `${plugin.name} ${outputFile} must externalize vue-router`,
      );
      assert.doesNotMatch(
        bundle,
        /vue-router v\d+\.\d+\.\d+/,
        `${plugin.name} ${outputFile} must not bundle vue-router`,
      );
    }
  }
});
