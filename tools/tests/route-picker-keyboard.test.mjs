import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const vue = require('vue');
const file = path.join(root, 'plugin-src/@ibiz-template-plm/route-picker/src/index.ts');
const source = readFileSync(file, 'utf8');
const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
assert.equal(ast.parseDiagnostics.length, 0);
let keyboard;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'k' &&
      node.initializer && ts.isArrowFunction(node.initializer)) {
    assert.equal(keyboard, undefined, 'keyboard handler must be unique');
    keyboard = node.initializer.getText(ast);
  }
  ts.forEachChild(node, visit);
}
visit(ast);
assert.ok(keyboard, 'execute the source keyboard handler, not a recreated implementation');
const compiled = ts.transpileModule(`module.exports = ${keyboard};`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length || 0, 0);

// Closure dependency spies are unit fixtures, never native browser acceptance.
function setup(rows, selected) {
  const items = vue.ref(rows);
  const selection = vue.ref(selected);
  const commands = [];
  const sandbox = {
    module: { exports: {} },
    c: items,
    y: selection,
    e: { keyName: 'id' },
    D: (item, initial) => commands.push({ item, initial }),
  };
  vm.runInNewContext(compiled.outputText, sandbox, { filename: file });
  return { items, selection, commands, key: sandbox.module.exports };
}

const first = { id: 'product-a', name: 'Product A' };
const second = { id: 'product-b', name: 'Product B' };

test('empty search ignores keyboard movement and selection without invalidating the current item', () => {
  const fixture = setup([], first);
  for (const key of ['down', 'up', 'enter']) fixture.key(key);
  assert.equal(fixture.selection.value.id, first.id);
  assert.deepEqual(fixture.commands, []);
});

test('restoring items after empty keyboard movement keeps the dropdown selection renderable', () => {
  const fixture = setup([], first);
  fixture.key('down');
  fixture.items.value = [first, second];
  assert.equal(fixture.selection.value.id, first.id);
  fixture.key('down');
  assert.equal(fixture.selection.value.id, second.id);
  fixture.key('enter');
  assert.equal(fixture.commands[0].item.id, second.id);
  assert.equal(fixture.commands[0].initial, false);
});

test('Enter never selects a hidden item removed by the current search filter', () => {
  const fixture = setup([second], first);
  fixture.key('enter');
  assert.deepEqual(fixture.commands, []);
  fixture.key('down');
  fixture.key('enter');
  assert.equal(fixture.commands.length, 1);
  assert.equal(fixture.commands[0].item.id, second.id);
});

test('direction keys still wrap around populated products and select the visible item', () => {
  const fixture = setup([first, second], first);
  fixture.key('up');
  assert.equal(fixture.selection.value.id, second.id);
  fixture.key('down');
  assert.equal(fixture.selection.value.id, first.id);
  fixture.key('down');
  fixture.key('enter');
  assert.equal(fixture.commands[0].item.id, second.id);
});

test('Enter uses the current dataset object instead of a stale copy of the same product', () => {
  const fixture = setup([first, second], { ...first, name: 'Old product title' });
  fixture.key('enter');
  assert.equal(fixture.commands.length, 1);
  assert.equal(fixture.commands[0].item.name, first.name);
});
