import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import postcss from 'postcss';

const style = readFileSync(new URL('../../src/runtime/router-shell.css', import.meta.url), 'utf8');
const root = postcss.parse(style);

test('route wrappers preserve the parent height without viewport arithmetic or fixed panel heights', () => {
  const rules = root.nodes.filter(node => node.type === 'rule');
  assert.equal(rules.length, 1);
  assert.equal(rules[0].selector, '.ibiz-router-shell');
  const declarations = Object.fromEntries(rules[0].nodes.map(node => {
    assert.equal(node.type, 'decl');
    assert.equal(Boolean(node.important), false);
    return [node.prop, node.value];
  }));
  assert.deepEqual(declarations, {
    width: '100%',
    height: '100%',
    'min-height': '0',
  });
  assert.doesNotMatch(style, /100(?:d|s|l)?vh|position\s*:|overflow\s*:|!important/);
});

test('the static PLM entry includes the route-shell height rule', () => {
  const main = readFileSync(new URL('../../src/main.ts', import.meta.url), 'utf8');
  assert.match(main, /import '\.\/runtime\/router-shell\.css';/);
});
