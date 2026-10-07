import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import {
  assertFreshOutputs,
  collectRuntimeExports,
  clearGeneratedDist,
  getPackageOutputs,
  normalizeLegacyFiles,
  normalizePublishedAliases,
  parsePackageRef,
  resolveConfiguredOutDir,
} from '../build-plugins.mjs';
import {
  assertSummary,
  compareBaseline,
  countCodes,
  parseDiagnostics,
  pluginNameFromSelector,
  selectPlugins,
} from '../ts-harness/index.mjs';

const execFileAsync = promisify(execFile);
const pluginRegression = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'plugin-regression.mjs',
);

test('parsePackageRef preserves scoped package identity and version', () => {
  assert.deepEqual(parsePackageRef('@scope/plugin@1.2.3'), {
    ref: '@scope/plugin@1.2.3',
    scope: '@scope',
    name: 'plugin',
    version: '1.2.3',
    sourceDir: path.resolve('plugin-src/@scope/plugin'),
    publicDir: path.resolve('public/plugins/@scope/plugin@1.2.3'),
  });
});

test('getPackageOutputs deduplicates module and main entries', () => {
  assert.deepEqual(
    getPackageOutputs({
      main: 'dist/index.js',
      module: 'dist/index.js',
      system: 'dist/index.legacy.js',
      styles: ['dist/style.css', 'dist/style.css'],
    }),
    ['dist/index.js', 'dist/index.legacy.js', 'dist/style.css'],
  );
});

test('published SystemJS and CSS aliases are generated from fresh build outputs', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'ibiz-plugin-alias-'));
  try {
    await writeFile(path.join(directory, 'index.legacy.js'), 'System.register([], () => ({}));');
    await writeFile(path.join(directory, 'style.css'), '.logic-tree {}');
    await normalizePublishedAliases(directory, {
      system: 'dist/index.system.min.js',
      styles: ['dist/index.min.css'],
    });
    assert.equal(
      await readFile(path.join(directory, 'index.system.min.js'), 'utf8'),
      'System.register([], () => ({}));',
    );
    assert.equal(
      await readFile(path.join(directory, 'index.min.css'), 'utf8'),
      '.logic-tree {}',
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('collectRuntimeExports ignores type-only exports', () => {
  assert.deepEqual(
    collectRuntimeExports(
      `
        export type OnlyType = string;
        export interface Contract { id: string }
        export const named = 1;
        export default {};
      `,
      'fixture.ts',
    ),
    new Set(['named', 'default']),
  );
});

test('resolveConfiguredOutDir rejects an application-level output path', () => {
  const plugin = {
    sourceDir: '/workspace/plm-web/plugin-src/@scope/plugin',
  };
  assert.equal(
    resolveConfiguredOutDir(plugin, {
      build: { outDir: '../../../public/plugins/@scope/plugin@1.0.0/dist' },
    }),
    '/workspace/plm-web/public/plugins/@scope/plugin@1.0.0/dist',
  );
  assert.notEqual(
    resolveConfiguredOutDir(plugin, {
      build: { outDir: '../../../dist' },
    }),
    '/workspace/plm-web/public/plugins/@scope/plugin@1.0.0/dist',
  );
});

test('assertFreshOutputs fails when a fresh build omitted a package entry', async () => {
  const stagingRoot = await mkdtemp(path.join(os.tmpdir(), 'aibiz-plugin-test-'));
  try {
    await mkdir(path.join(stagingRoot, 'dist'), { recursive: true });
    await writeFile(path.join(stagingRoot, 'dist/index.es.js'), 'export {};');
    await assert.rejects(
      assertFreshOutputs(
        { ref: '@scope/plugin@1.0.0' },
        {
          main: 'dist/index.es.js',
          module: 'dist/index.es.js',
          system: 'dist/index.legacy.js',
          styles: ['dist/style.css'],
        },
        path.join(stagingRoot, 'dist'),
      ),
      /fresh staging build is incomplete/,
    );
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
});

test('normalizeLegacyFiles renames only the legacy entry', async () => {
  const stagingRoot = await mkdtemp(
    path.join(os.tmpdir(), 'aibiz-plugin-legacy-test-'),
  );
  try {
    await writeFile(
      path.join(stagingRoot, 'index.legacy.es.js'),
      'System.register([]);',
    );
    await writeFile(
      path.join(stagingRoot, 'polyfills.legacy.es.js'),
      'polyfills();',
    );
    await writeFile(
      path.join(stagingRoot, 'context-menu.legacy.es.js'),
      'export default {};',
    );
    await writeFile(
      path.join(stagingRoot, 'context-menu.umd.legacy.es.js'),
      'export default {};',
    );

    await normalizeLegacyFiles(stagingRoot);

    await access(path.join(stagingRoot, 'index.legacy.js'));
    await access(path.join(stagingRoot, 'polyfills.legacy.js'));
    await access(path.join(stagingRoot, 'context-menu.legacy.es.js'));
    await access(path.join(stagingRoot, 'context-menu.umd.legacy.es.js'));
    await assert.rejects(access(path.join(stagingRoot, 'index.legacy.es.js')));
    await assert.rejects(
      access(path.join(stagingRoot, 'polyfills.legacy.es.js')),
    );
  } finally {
    await rm(stagingRoot, { recursive: true, force: true });
  }
});

test('clearGeneratedDist removes generated root files but preserves package assets', async () => {
  const distRoot = await mkdtemp(
    path.join(os.tmpdir(), 'aibiz-plugin-dist-test-'),
  );
  try {
    await mkdir(path.join(distRoot, 'types'), { recursive: true });
    await mkdir(path.join(distRoot, 'assets', 'images'), { recursive: true });
    for (const directory of ['environments', 'extras', 'model', 'plugins']) {
      await mkdir(path.join(distRoot, directory), { recursive: true });
      await writeFile(path.join(distRoot, directory, 'stale.json'), '{}');
    }
    for (const directory of ['css', 'font-awesome-4.7.0', 'iconfont', 'ionicons']) {
      await mkdir(path.join(distRoot, 'assets', directory), { recursive: true });
      await writeFile(path.join(distRoot, 'assets', directory, 'stale.css'), '.stale {}');
    }
    await writeFile(path.join(distRoot, 'index.legacy.js'), 'legacy;');
    await writeFile(path.join(distRoot, 'stale-chunk.js'), 'stale;');
    await writeFile(path.join(distRoot, 'types', 'index.d.ts'), 'export {};');
    await writeFile(
      path.join(distRoot, 'assets', 'images', 'keep.png'),
      'image',
    );
    await writeFile(path.join(distRoot, 'assets', 'style.css'), 'stale css');

    await clearGeneratedDist(distRoot);

    await assert.rejects(stat(path.join(distRoot, 'index.legacy.js')));
    await assert.rejects(stat(path.join(distRoot, 'stale-chunk.js')));
    await assert.rejects(stat(path.join(distRoot, 'assets', 'style.css')));
    for (const directory of ['environments', 'extras', 'model', 'plugins']) {
      await assert.rejects(stat(path.join(distRoot, directory)));
    }
    for (const directory of ['css', 'font-awesome-4.7.0', 'iconfont', 'ionicons']) {
      await assert.rejects(stat(path.join(distRoot, 'assets', directory)));
    }
    await stat(path.join(distRoot, 'types', 'index.d.ts'));
    await stat(path.join(distRoot, 'assets', 'images', 'keep.png'));
  } finally {
    await rm(distRoot, { recursive: true, force: true });
  }
});

test('parseDiagnostics and countCodes preserve TypeScript error contracts', () => {
  const diagnostics = parseDiagnostics(
    [
      'plugin-src/@scope/plugin/src/index.ts(4,8): error TS7006: Parameter is implicit.',
      'plugin-src/@scope/plugin/src/index.ts(8,2): error TS7006: Another error.',
    ].join('\n'),
  );
  assert.equal(diagnostics.length, 2);
  assert.deepEqual(countCodes(diagnostics), { TS7006: 2 });
});

test('compareBaseline rejects new diagnostic budget consumption', () => {
  assert.deepEqual(
    compareBaseline(
      { total: 3, codes: { TS7006: 2, TS2339: 1 } },
      { total: 2, codes: { TS7006: 2 } },
    ),
    ['total diagnostics increased from 2 to 3', 'TS2339 increased from 0 to 1'],
  );
});

test('assertSummary gives strict plugins a zero-error gate', () => {
  assert.deepEqual(
    assertSummary(
      { name: 'strict-plugin', mode: 'strict', total: 1, exitCode: 2 },
      {},
      false,
    ),
    ['strict mode requires zero diagnostics; got 1'],
  );
  assert.deepEqual(
    assertSummary(
      { name: 'strict-plugin', mode: 'strict', total: 0, exitCode: 0 },
      {},
      false,
    ),
    [],
  );
});

test('plugin selectors resolve scoped package references', () => {
  assert.equal(
    pluginNameFromSelector('@ibiz-template-plm/person-select@0.0.3-alpha.434'),
    'person-select',
  );
  assert.deepEqual(
    selectPlugins(
      { plugins: [{ name: 'person-select' }, { name: 'dynamic-column' }] },
      ['@ibiz-template-plm/person-select@0.0.3-alpha.434'],
    ),
    [{ name: 'person-select' }],
  );
});

test('plugin regression help does not become a plugin reference', async () => {
  const result = await execFileAsync(process.execPath, [pluginRegression, '--help']);
  assert.match(result.stdout, /Usage: pnpm plugin:regression/);
  assert.equal(result.stderr, '');
});

test('plugin regression rejects options and unknown refs before build or browser work', async () => {
  for (const [arg, message] of [
    ['--unknown', /Unknown option: --unknown/],
    ['@scope/plugin@1.2.3', /Plugin reference is not in the runtime catalog/],
    ['../../outside@1.2.3', /Plugin reference is not in the runtime catalog/],
  ]) {
    await assert.rejects(
      execFileAsync(process.execPath, [pluginRegression, arg]),
      (error) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr, message);
        assert.doesNotMatch(error.stdout, /\[harness\]/);
        return true;
      },
    );
  }
});
