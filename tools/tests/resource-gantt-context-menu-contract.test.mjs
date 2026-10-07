import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const plugin = path.join(root, 'plugin-src/@ibiz-template-plm/resource-gantt');
const dist = path.join(root, 'public/plugins/@ibiz-template-plm/resource-gantt@0.0.3-alpha.304/dist');
const read = (file) => readFileSync(file, 'utf8');

test('resource gantt uses the shared context-menu runtime', () => {
  assert.match(read(path.join(plugin, 'vite.config.ts')), /['"]@imengyu\/vue3-context-menu['"]/);
  const source = read(path.join(plugin, 'src/index.ts'));
  assert.match(source, /typeof candidate\.showContextMenu === "function"/);
  assert.match(source, /candidate\.default/);
  assert.match(source, /candidate\.v/);
  assert.match(source, /resolveContextMenuApi\(g\)/);
  assert.match(read(path.join(dist, 'index.es.js')), /import\("@imengyu\/vue3-context-menu"\)/);
  assert.match(read(path.join(dist, 'index.legacy.js')), /(?:t|e)\.import\("@imengyu\/vue3-context-menu"\)/);
  assert.equal(
    readdirSync(dist).some((file) => /^vue3-context-menu\.umd\.(es|legacy)\.js$/.test(file)),
    false,
  );
});
