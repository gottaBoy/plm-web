import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const require = createRequire(import.meta.url);

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

test('bootstrap stylesheet imports resolve in a clean source checkout', () => {
  const filename = path.join(ROOT, 'src', 'main.ts');
  const ast = ts.createSourceFile(
    filename,
    readFileSync(filename, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const styles = ast.statements
    .filter(node => ts.isImportDeclaration(node) &&
      node.moduleSpecifier.text.endsWith('.css'))
    .map(node => node.moduleSpecifier.text);
  assert.ok(styles.length > 0);
  for (const name of styles) {
    const file = name.startsWith('@/')
      ? path.join(ROOT, 'src', name.slice(2))
      : path.resolve(path.dirname(filename), name);
    assert.ok(existsSync(file), `Bootstrap stylesheet is absent: ${name}`);
  }
});

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

test('host shares Vue and vue-router with SystemJS before bootstrapping', async () => {
  const main = readFileSync(path.join(ROOT, 'src', 'main.ts'), 'utf8');
  assert.match(main, /import \* as Vue from ['"]vue['"]/);
  assert.match(main, /import \* as VueRouter from ['"]vue-router['"]/);
  assert.match(main, /System\.set\(System\.resolve\('vue'\), Vue\)|System\.set\(vueUrl, Vue\)/);
  assert.match(main, /System\.set\(System\.resolve\('vue-router'\), VueRouter\)|System\.set\(routerUrl, VueRouter\)/);
  const ast = ts.createSourceFile('main.ts', main, ts.ScriptTarget.Latest, true);
  const bootstrap = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'bootstrap');
  assert.ok(bootstrap, 'execute the real bootstrap, including module resolution');
  const source = ts.transpileModule(`${bootstrap.getText(ast)}\nmodule.exports = bootstrap;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  for (const asyncResolve of [false, true, 'nested']) {
    const calls = [];
    const vue = {}, router = {};
    const sandbox = {
      module: { exports: {} }, Vue: vue, VueRouter: router,
      VueTextFormat: {}, gridLayout: {}, ComponentsRegister: {}, UserRegister: {},
      StaticAuthGuard: class {}, userRoutes: [],
      System: {
        resolve: name => {
          const url = `https://host.invalid/${name}`;
          if (asyncResolve === 'nested') return Promise.resolve(Promise.resolve(url));
          return asyncResolve ? Promise.resolve(url) : url;
        },
        set: (url, namespace) => {
          assert.equal(typeof url, 'string', 'System.set must never receive a Promise');
          calls.push(['set', url, namespace]);
        },
      },
      runApp: () => calls.push(['runApp']),
    };
    vm.runInNewContext(source, sandbox);
    await sandbox.module.exports();
    assert.deepEqual(calls, [
      ['set', 'https://host.invalid/vue', vue],
      ['set', 'https://host.invalid/vue-router', router],
      ['runApp'],
    ]);
  }
});

test('real SystemJS registry receives resolved namespaces before the application starts', async () => {
  const { System: system, applyImportMap, setBaseUrl } = require('systemjs');
  const registry = new system.constructor();
  const base = 'https://plm-bootstrap.invalid/';
  setBaseUrl(registry, base);
  applyImportMap(registry, {
    imports: { vue: './vue.js', 'vue-router': './vue-router.js' },
  }, base);
  const resolve = registry.resolve.bind(registry);
  registry.resolve = name => Promise.resolve(resolve(name));
  const filename = path.join(ROOT, 'src/main.ts');
  const ast = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  const bootstrap = ast.statements.find(node =>
    ts.isFunctionDeclaration(node) && node.name?.text === 'bootstrap');
  assert.ok(bootstrap);
  const output = ts.transpileModule(`${bootstrap.getText(ast)}\nmodule.exports = bootstrap;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const vue = { hostVue: {} };
  const router = { hostRouter: {} };
  let starts = 0;
  const sandbox = {
    module: { exports: {} }, System: registry, Vue: vue, VueRouter: router,
    VueTextFormat: {}, gridLayout: {}, ComponentsRegister: {}, UserRegister: {},
    StaticAuthGuard: class {}, userRoutes: [],
    runApp: () => {
      assert.equal(registry.get(`${base}vue.js`).hostVue, vue.hostVue);
      assert.equal(registry.get(`${base}vue-router.js`).hostRouter, router.hostRouter);
      starts += 1;
    },
  };
  vm.runInNewContext(output, sandbox);
  await sandbox.module.exports();
  assert.equal(starts, 1);
  assert.deepEqual([...registry.entries()].map(([url]) => url).sort(),
    [`${base}vue-router.js`, `${base}vue.js`]);
});

test('failed or non-URL SystemJS resolution cannot partially register or start the application', async () => {
  const filename = path.join(ROOT, 'src/main.ts');
  const ast = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  const bootstrap = ast.statements.find(node =>
    ts.isFunctionDeclaration(node) && node.name?.text === 'bootstrap');
  assert.ok(bootstrap);
  const output = ts.transpileModule(`${bootstrap.getText(ast)}\nmodule.exports = bootstrap;`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  for (const invalid of [undefined, null, false, {}, 42]) {
    const calls = [];
    const sandbox = {
      module: { exports: {} }, Vue: {}, VueRouter: {},
      System: {
        resolve: name => name === 'vue' ? 'https://host.invalid/vue' : Promise.resolve(invalid),
        set: () => calls.push('set'),
      },
      runApp: () => calls.push('start'),
    };
    vm.runInNewContext(output, sandbox);
    await assert.rejects(sandbox.module.exports(), /did not return a URL/);
    assert.deepEqual(calls, []);
  }
  const failure = new Error('import map failed');
  const sandbox = {
    module: { exports: {} },
    System: { resolve: () => Promise.reject(failure) },
  };
  vm.runInNewContext(output, sandbox);
  await assert.rejects(sandbox.module.exports(), error => error === failure);
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
