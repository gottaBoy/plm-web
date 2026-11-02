import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

test('mobile login overrides only the fixed-width login container', () => {
  const source = readFileSync(new URL('../../src/runtime/login-layout.css', import.meta.url), 'utf8');
  const root = postcss.parse(source);
  assert.equal(root.nodes.length, 1);
  assert.equal(root.nodes[0].params, '(max-width: 767px)');
  root.walkRules(rule => {
    assert.match(rule.selector, /\.ibiz-view--apploginview/);
    assert.match(rule.selector, /\.pc_login_style/);
    assert.match(rule.selector, /\.ibiz-panel-container--container1/);
  });
  const main = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');
  assert.match(main, /import '\.\/runtime\/login-layout\.css';/);
  assert.doesNotMatch(source, /!important|font-size|100(?:d|s|l)?vh/);
});
