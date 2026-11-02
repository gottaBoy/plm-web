import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

test('list toolbars wrap only on mobile and within the four core all-list views', () => {
  const source = readFileSync(new URL('../../src/runtime/list-toolbar.css', import.meta.url), 'utf8');
  const style = postcss.parse(source);
  assert.equal(style.nodes.length, 1);
  assert.equal(style.nodes[0].type, 'atrule');
  assert.equal(style.nodes[0].name, 'media');
  assert.equal(style.nodes[0].params, '(max-width: 767px)');
  style.walkRules(rule => {
    for (const name of ['product', 'project', 'library', 'space']) {
      assert.ok(rule.selector.includes(`.ibiz-view--${name}_all_grid_view`));
    }
  });
  style.walkDecls(declaration => assert.equal(Boolean(declaration.important), false));
  assert.doesNotMatch(source, /position\s*:|font-size\s*:|100(?:d|s|l)?vh/);
  const main = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');
  assert.match(main, /import '\.\/runtime\/list-toolbar\.css';/);
});
