import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

const css = postcss.parse(readFileSync(
  new URL('../../src/publish/sys.css', import.meta.url), 'utf8',
));

function declarations(selector) {
  const matches = [];
  css.walkRules(rule => {
    if (rule.selector !== selector) return;
    assert.equal(rule.parent.type, 'atrule', 'navigation adaptation must stay mobile-only');
    assert.equal(rule.parent.name, 'media');
    assert.equal(rule.parent.params, '(max-width: 767px)');
    matches.push(Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node =>
      [node.prop, { value: node.value, important: !!node.important }],
    )));
  });
  assert.equal(matches.length, 1, selector);
  return matches[0];
}

test('product relation header gives both native picker and eight-tab navigation a stable row', () => {
  const root = '.ibiz-view--product_index_view .ibiz-panel-container--view_drbar';
  assert.equal(declarations(root).height.value, '90px');
  const row = declarations(`${root} > .ibiz-row`);
  assert.deepEqual(row['flex-direction'], { value: 'column', important: true });
  const child = declarations(`${root} > .ibiz-row > .ibiz-col`);
  assert.deepEqual(child.width, { value: '100%', important: true });
  assert.equal(child['min-width'].value, '0');
  const tabs = declarations(`${root} > .ibiz-row > .ibiz-col:has(> .ibiz-panel-ctrl-pos--drbar)`);
  assert.equal(tabs['flex-basis'].value, '49px');
  assert.equal(tabs.height.important, true);
});

test('management split stacks only its own navigation and preserves usable grid height', () => {
  const root = '.ibiz-view--management_setting_view .ibiz-split-container--container_h_split';
  assert.equal(declarations(root)['min-height'].value, '520px');
  const split = `${root} > .ibiz-split-wrapper > .ibiz-split--horizontal`;
  assert.equal(declarations(split)['flex-direction'].value, 'column');
  const left = declarations(`${split} > .ibiz-split-pane--left`);
  assert.equal(left.flex.value, '0 0 144px');
  assert.equal(left.overflow.value, 'auto');
  assert.equal(left.width.important, true);
  const right = declarations(`${split} > .ibiz-split-pane--right`);
  assert.equal(right['min-height'].value, '300px');
  assert.deepEqual(right.width, { value: '100%', important: true });
  assert.equal(right['padding-left'].value, '0');
  assert.equal(declarations(`${split} > .ibiz-split-trigger-con`).display.value, 'none');
});

test('management native commands wrap alongside search without getting clipped', () => {
  const header = '.ibiz-view--management_setting_view .ibiz-panel-view-header';
  assert.equal(declarations(header).height.value, 'auto');
  assert.equal(declarations(`${header} > .ibiz-row`)['flex-direction'].value, 'column');
  const row = `${header} .ibiz-panel-container--view_header_right > .ibiz-row`;
  assert.equal(declarations(row)['flex-wrap'].value, 'wrap');
  assert.equal(declarations(row).height.value, 'auto');
  assert.equal(declarations(`${row} > .ibiz-col:has(> .ibiz-panel-container--view_searchbar)`).flex.value,
    '1 1 0');
  const toolbar = declarations(`${row} > .ibiz-col:has(> .ibiz-panel-container--view_toolbar)`);
  assert.equal(toolbar.flex.value, '0 0 108px');
  assert.equal(toolbar.width.value, '108px');
  assert.equal(toolbar['min-width'].value, '108px');
});

test('only management create dialogs constrain dimensions and keep native close controls inside', () => {
  function globalRule(selector) {
    const matches = [];
    css.walkRules(rule => {
      if (rule.selector !== selector) return;
      assert.equal(rule.parent.type, 'root');
      matches.push(Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node =>
        [node.prop, node.value],
      )));
    });
    assert.equal(matches.length, 1, selector);
    return matches[0];
  }
  const views = ['workload_type_quick_create_view', 'extend_print_templ_quick_cfg_view'];
  const roots = views.map(view => `.ibiz-modal:has(.ibiz-view--${view})`);
  const modal = globalRule(roots.join(',\n'));
  assert.equal(modal['max-width'], 'calc(100vw - 32px)');
  assert.equal(modal['max-height'], 'calc(100dvh - 32px)');
  const button = globalRule(roots.map(root =>
    `${root} .el-dialog__header .el-dialog__headerbtn`,
  ).join(',\n'));
  assert.equal(button.top, '8px');
  assert.equal(button.right, '8px');
  assert.equal(button['z-index'], '1');
  const icon = globalRule(roots.map(root =>
    `${root} .el-dialog__headerbtn .el-dialog__close`,
  ).join(',\n'));
  assert.equal(icon.color, 'var(--ibiz-color-text-2)');
});
