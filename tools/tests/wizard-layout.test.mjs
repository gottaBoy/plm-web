import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

const root = new URL('../../', import.meta.url);
const source = readFileSync(new URL('src/runtime/wizard-layout.css', root), 'utf8');
const css = postcss.parse(source);
const views = ['product', 'project', 'library', 'space']
  .map(name => `.ibiz-view--${name}_create_wizard_view`);

test('wizard sizing and wrapping remain mobile-only and scoped to the four business creation views', () => {
  css.walkRules(rule => {
    assert.equal(rule.parent.type, 'atrule');
    assert.equal(rule.parent.name, 'media');
    assert.equal(rule.parent.params, '(max-width: 767px)');
    for (const view of views) assert.ok(rule.selector.includes(view), rule.selector);
    rule.walkDecls(declaration => {
      assert.notEqual(declaration.prop, 'transform');
      assert.ok(!declaration.value.includes('scale('));
      assert.ok(!['overflow', 'overflow-x'].includes(declaration.prop),
        'Overflow must be fixed by sizing and wrapping, not clipping');
    });
  });
  assert.match(source, /max-width: calc\(100vw - 16px\)/);
  assert.match(source, /white-space: normal/);
  assert.match(source, /overflow-wrap: anywhere/);
});

test('wizard CSS is installed after generated styles and keeps the close command within mobile dialogs', () => {
  const main = readFileSync(new URL('src/main.ts', root), 'utf8');
  assert.ok(main.indexOf("import './runtime/wizard-layout.css'") >
    main.indexOf("import '@/publish/sys.css'"));
  const matches = [];
  css.walkRules(rule => {
    if (!rule.selector.endsWith('.el-dialog__headerbtn')) return;
    matches.push(Object.fromEntries(rule.nodes.filter(node => node.type === 'decl')
      .map(node => [node.prop, node.value])));
  });
  assert.deepEqual(matches, [{ top: '4px', right: '4px', 'z-index': '5' }]);
  assert.match(source, /color: var\(--ibiz-color-text-2\)/);
});
