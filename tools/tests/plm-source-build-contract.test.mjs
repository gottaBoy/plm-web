import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);
const packageJson = JSON.parse(
  readFileSync(path.join(ROOT, 'package.json'), 'utf8'),
);
const vitePlugin = readFileSync(
  path.join(ROOT, 'vite-plugins/ibiz-vite-plugin.ts'),
  'utf8',
);
const viteConfig = readFileSync(
  path.join(ROOT, 'vite.config.ts'),
  'utf8',
);
const authGuard = readFileSync(
  path.join(ROOT, 'src/guard/auth-guard/auth-guard.ts'),
  'utf8',
);
const runtimeCompat = readFileSync(
  path.join(ROOT, 'src/runtime/plm-runtime-compat.ts'),
  'utf8',
);
const versionChecker = readFileSync(
  path.join(ROOT, 'tools/check-local-ibiz-versions.mjs'),
  'utf8',
);
const aiChatPackage = JSON.parse(
  readFileSync(
    path.resolve(ROOT, '../ibiz-app-hub/plugins/ibiz-ai-chat/package.json'),
    'utf8',
  ),
);
const publicImportMap = JSON.parse(
  readFileSync(
    path.join(ROOT, 'public/extras/json/system-import.json'),
    'utf8',
  ),
);

const plugins = [
  {
    name: '@ibiz-template-plugin/ai-chat',
    source: '../ibiz-app-hub/plugins/ibiz-ai-chat',
    sourceVersion: '0.0.60',
  },
  {
    name: '@ibiz-template-plugin/gantt',
    source: '../ibiz-app-hub/plugins/ibiz-gantt',
    sourceVersion: '0.1.8-alpha.378',
  },
  {
    name: '@ibiz-template-plugin/bi-report',
    source: '../ibiz-app-hub/plugins/ibiz-bi-report',
    sourceVersion: '0.0.32',
  },
  {
    name: '@ibiz-template-plugin/data-view',
    source: '../ibiz-app-hub/plugins/ibiz-data-view',
    sourceVersion: '0.0.6',
  },
];

test('PLM links all four model plugins to local source packages', () => {
  for (const plugin of plugins) {
    assert.equal(
      packageJson.dependencies[plugin.name],
      `link:${plugin.source}`,
      `${plugin.name} must use its local source package`,
    );
    const manifest = JSON.parse(
      readFileSync(
        path.resolve(ROOT, plugin.source, 'package.json'),
        'utf8',
      ),
    );
    assert.equal(manifest.version, plugin.sourceVersion, plugin.name);
  }
});

test('PLM build has a local source-plugin build precondition', () => {
  assert.equal(
    packageJson.scripts['plugins:build:local'],
    'node tools/build-local-ibiz-plugins.mjs',
  );
  assert.match(
    packageJson.scripts.build,
    /^node tools\/build-local-ibiz-plugins\.mjs && node build\/set-version\.js && /,
    'PLM build must explicitly build local source plugins before Vite',
  );
});

test('local plugin packages expose the required SystemJS source-build inputs', () => {
  for (const plugin of plugins) {
    const dist = path.resolve(ROOT, plugin.source, 'dist');
    for (const fileName of [
      'index.legacy.js',
      'style.css',
      'polyfills.legacy.js',
    ]) {
      const file = path.join(dist, fileName);
      assert.ok(existsSync(file), `${plugin.name} missing dist/${fileName}`);
      if (fileName === 'index.legacy.js') {
        assert.match(readFileSync(file, 'utf8'), /System\.register/);
      }
    }
  }
});

test('Vite build contract copies local assets and rewrites generated extras', () => {
  assert.match(vitePlugin, /const localSystemPlugins = \[/);
  assert.match(
    vitePlugin,
    /async closeBundle\(\)/,
    'closeBundle must wait for asynchronous asset copies',
  );
  assert.match(
    vitePlugin,
    /await Promise\.all\(\s*componentPackages\.map\(async pkg => \{/,
    'component SystemJS assets must be copied before the build completes',
  );
  assert.match(
    vitePlugin,
    /async configResolved\(\)/,
    'development runtime asset copy must be awaitable',
  );
  assert.match(
    vitePlugin,
    /const cpDir = join\(__dirname, 'extras\/@vue\/runtime-core\/3\.3\.8\/\*\*'\);[\s\S]*?await cpy\(cpDir, outDir\);/,
    'development runtime asset copy must finish before the dev server continues',
  );
  assert.match(vitePlugin, /function copyLocalSystemPlugin/);
  assert.match(vitePlugin, /dist\/extras\/js/);
  assert.match(vitePlugin, /index\.legacy\.js/);
  assert.match(vitePlugin, /index\.system\.min\.js/);
  assert.match(vitePlugin, /style\.css/);
  assert.match(vitePlugin, /polyfills\.legacy\.js/);
  assert.match(vitePlugin, /items\[packageName\] = assets\.importPath/);
  assert.match(vitePlugin, /styles\[packageName\] = assets\.stylePath/);
  for (const plugin of plugins) {
    assert.match(
      vitePlugin,
      new RegExp(plugin.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('Vite build contract removes inline modern-browser bootstrap code', () => {
  assert.match(
    vitePlugin,
    /window\\.__vite_is_modern_browser/,
    'the Vite modern-browser marker must be explicitly removed',
  );
  assert.match(
    vitePlugin,
    /vite: loading legacy chunks/,
    'the Vite legacy fallback marker must be explicitly removed',
  );
  assert.match(
    vitePlugin,
    /onbeforeload[\s\S]*?t\\\.type="module",t\\\.src="\\."/,
    'the Vite module feature-detection script must be explicitly removed',
  );
});

test('PLM externalizes all four local model plugins', () => {
  const externalBlock = viteConfig.match(
    /external:\s*\[([\s\S]*?)\],\s*output:/,
  )?.[1];
  assert.ok(externalBlock, 'Vite rollup external list is missing');
  for (const plugin of plugins) {
    assert.match(
      externalBlock,
      new RegExp(plugin.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('version checker covers all four local model plugins', () => {
  for (const plugin of plugins) {
    assert.match(
      versionChecker,
      new RegExp(plugin.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('ai-chat package CSS declaration matches its source build artifact', () => {
  assert.deepEqual(aiChatPackage.styles, ['dist/style.css']);
  assert.ok(
    existsSync(
      path.resolve(ROOT, '../ibiz-app-hub/plugins/ibiz-ai-chat/dist/style.css'),
    ),
    'ai-chat source build must produce dist/style.css',
  );
  assert.equal(
    existsSync(
      path.resolve(
        ROOT,
        '../ibiz-app-hub/plugins/ibiz-ai-chat/dist/index.min.css',
      ),
    ),
    false,
    'ai-chat must not declare or require the non-existent dist/index.min.css',
  );
});

test('committed fallback import map matches local source-build versions', () => {
  for (const plugin of plugins) {
    const version = plugin.sourceVersion;
    const importPath = publicImportMap.imports[plugin.name];
    const stylePath = publicImportMap.styles[plugin.name];
    assert.match(
      importPath,
      new RegExp(
        `/${plugin.name.split('/').at(-1)}/${version}/index\\.system\\.min\\.js$`,
      ),
    );
    assert.match(
      stylePath,
      new RegExp(
        `/${plugin.name.split('/').at(-1)}/${version}/index\\.min\\.css$`,
      ),
    );
    for (const fileName of [
      'index.system.min.js',
      'index.min.css',
      'polyfills.legacy.js',
    ]) {
      assert.ok(
        existsSync(
          path.join(
            ROOT,
            'public/extras/js',
            ...plugin.name.split('/'),
            version,
            fileName,
          ),
        ),
        `${plugin.name}@${version} missing public fallback ${fileName}`,
      );
    }
  }
});

test('PLM patches only the shared runtime theme query endpoint', () => {
  assert.match(
    authGuard,
    /installPlmRuntimeCompatibility\(app\)/,
    'runtime compatibility must be installed before app hooks run',
  );
  assert.match(
    runtimeCompat,
    /LEGACY_VIEW_THEME_QUERY_PATH[\s\S]*?CURRENT_VIEW_THEME_QUERY_PATH/,
  );
  assert.match(
    runtimeCompat,
    /url === LEGACY_VIEW_THEME_QUERY_PATH/,
    'the compatibility layer must use an exact path match',
  );
  assert.match(
    runtimeCompat,
    /originalPost\.call\(net, rewritePlmRuntimeRequestPath\(url\), \.\.\.args\)/,
    'the compatibility layer must preserve post arguments and return value',
  );
  assert.match(
    runtimeCompat,
    /const patchedNets = new WeakSet<object>\(\)/,
    'the compatibility layer must be idempotent per app network instance',
  );
});

test('PLM local plugin builds use the ibiz-app-hub Corepack pnpm', () => {
  const localPluginBuild = readFileSync(
    path.join(ROOT, 'tools/build-local-ibiz-plugins.mjs'),
    'utf8',
  );
  assert.match(
    localPluginBuild,
    /const corepack = process\.platform === 'win32' \? 'corepack\.cmd' : 'corepack'/,
    'local plugin builds must invoke Corepack rather than the caller pnpm',
  );
  assert.match(
    localPluginBuild,
    /corepack,\s*\[\s*'pnpm',\s*'--filter'/,
    'Corepack must select pnpm from the ibiz-app-hub workspace',
  );
});

test('PLM Vue SystemJS runtime and PLM plugins expose defineComponent', () => {
  const vueSystem = readFileSync(
    path.join(
      ROOT,
      'public/extras/js/vue/3.3.8/vue.runtime.global.system.prod.js',
    ),
    'utf8',
  );
  assert.match(vueSystem, /defineComponent:/);

  for (const plugin of [
    [
      'list-tree',
      '0.0.3-alpha.225',
      /System\.register\("ListTree"[\s\S]*?defineComponent/,
    ],
    [
      'tab-exp-select',
      '0.0.3-dev.254',
      /System\.register\("TabExpSelect"[\s\S]*?defineComponent/,
    ],
    [
      'breadcrumb-nav-pos',
      '0.0.3-alpha.247',
      /System\.register\("BreadcrumbNavPos"[\s\S]*?defineComponent/,
    ],
  ]) {
    const [name, version, pattern] = plugin;
    const bundle = readFileSync(
      path.join(
        ROOT,
        'public/plugins/@ibiz-template-plm',
        `${name}@${version}/dist/index.legacy.js`,
      ),
      'utf8',
    );
    assert.match(bundle, pattern, `${name}@${version}`);
  }
});
