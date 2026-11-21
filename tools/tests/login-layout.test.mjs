import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';
import { assertLoginLayout, loginLayoutViewports } from '../check-plm-login-layout.mjs';

const source = readFileSync(new URL('../../src/runtime/login-layout.css', import.meta.url), 'utf8');
const css = postcss.parse(source);
const declarations = selector => {
  let result;
  css.walkRules(rule => {
    if (rule.selector === selector) result = Object.fromEntries(
      rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]),
    );
  });
  return result;
};
const scope = '.ibiz-view--apploginview .pc_login_style';

test('login overrides stay scoped and install after generated styles', () => {
  css.walkRules(rule => {
    for (const selector of rule.selectors) assert.ok(selector.startsWith(scope), selector);
    rule.walkDecls(declaration => {
      assert.equal(declaration.important, undefined);
      assert.ok(!/^(?:overflow|overflow-x|text-overflow|transform)$/.test(declaration.prop),
        'Fix sizing/wrapping instead of hiding or scaling title content');
      if (declaration.prop === 'font-size') assert.match(declaration.value, /^\d+px$/);
      assert.doesNotMatch(declaration.value, /(?:\d|\.)+(?:dvh|svh|lvh|vh|vw)/);
    });
  });
  const main = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');
  assert.ok(main.indexOf("import './runtime/login-layout.css'") > main.indexOf("import '@/publish/sys.css'"));
});

test('desktop and mobile titles share fixed typography, wrapping and card-side breathing room', () => {
  assert.deepEqual(declarations(`${scope} .ibiz-panel-container--container_4`), {
    'box-sizing': 'border-box', 'min-width': '0', 'padding-inline': '24px',
  });
  assert.deepEqual(declarations(`${scope} .ibiz-panel-container--container_4 .ibiz-panel-app-title__title`), {
    'font-size': '24px', 'line-height': '1.25', 'letter-spacing': '0', 'white-space': 'normal',
    'overflow-wrap': 'anywhere', 'text-align': 'center',
  });
  assert.match(source, /min-width: 0;\s+max-width: 100%;/);
  const media = css.nodes.filter(node => node.type === 'atrule');
  assert.equal(media.length, 1);
  assert.equal(media[0].params, '(max-width: 767px)');
  assert.deepEqual(declarations(`${scope} .ibiz-panel-container--container1`), {
    right: '16px', width: 'calc(100% - 32px)', 'min-width': '0', 'border-radius': '8px',
  });
});

function layout() {
  return {
    viewport: { width: 390, height: 844, documentWidth: 390, bodyWidth: 390 },
    card: { left: 16, right: 374, top: 120, bottom: 680 },
    header: { left: 16, right: 374, top: 150, bottom: 290 },
    title: { left: 40, right: 350, top: 190, bottom: 250 },
    textRects: [{ left: 50, right: 340, top: 192, bottom: 218 }],
    controls: Object.fromEntries(['account', 'password', 'submit', 'language'].map((name, index) => [
      name, { visible: true, left: 50, right: 340, top: 310 + index * 60, bottom: 350 + index * 60 },
    ])),
    titleText: 'Product Lifecycle Management', style: { fontSize: '24px', whiteSpace: 'normal' },
  };
}

test('browser geometry contract checks actual text lines and all login controls, not just visible boxes', () => {
  assert.doesNotThrow(() => assertLoginLayout(layout(), 'en'));
  const chinese = layout();
  chinese.titleText = '软件生命周期管理系统';
  assert.doesNotThrow(() => assertLoginLayout(chinese, 'zh-CN'));
  for (const breakLayout of [
    value => { value.textRects[0].right = 400; },
    value => { value.textRects[0].left = 18; },
    value => { value.textRects[0].bottom = 300; },
    value => { value.viewport.documentWidth = 420; },
    value => { value.controls.password = null; },
    value => { value.controls.submit.bottom = 900; },
    value => { value.style.whiteSpace = 'nowrap'; },
    value => { value.style.fontSize = '30px'; },
  ]) {
    const broken = layout();
    breakLayout(broken);
    assert.throws(() => assertLoginLayout(broken, 'en'));
  }
});

test('browser matrix covers narrow/common phones, tablets, and short/wide desktop viewports', () => {
  assert.deepEqual(loginLayoutViewports.map(item => item.width), [320, 360, 390, 430, 768, 1280, 1440, 1920]);
  const checker = readFileSync(new URL('../check-plm-login-layout.mjs', import.meta.url), 'utf8');
  assert.match(checker, /createTreeWalker\(title, NodeFilter\.SHOW_TEXT\)/);
  assert.match(checker, /range\.getClientRects\(\)/);
  assert.match(checker, /for \(const language of \['zh-CN', 'en'\]\)/);
  assert.match(checker, /Build a candidate containing the current login layout source/);
  assert.match(checker, /previewSourceCss \? 'passed-source-css-preview-only'/);
});
