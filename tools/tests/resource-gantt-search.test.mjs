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
const file = path.join(root, 'plugin-src/@ibiz-template-plm/resource-gantt/src/index.ts');
const source = readFileSync(file, 'utf8');
const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
assert.equal(ast.parseDiagnostics.length, 0);

let component;
const icons = new Map();
function findComponent(node) {
  if (ts.isVariableDeclaration(node) && node.initializer &&
      ['bt', 'ze', 'Ae', 'Me'].includes(node.name.getText(ast))) {
    icons.set(node.name.getText(ast), node.initializer.getText(ast));
  }
  if (ts.isVariableDeclaration(node) && node.initializer &&
      ts.isCallExpression(node.initializer)) {
    const options = node.initializer.arguments[0];
    if (options && ts.isObjectLiteralExpression(options) &&
        options.properties.some(property =>
          ts.isPropertyAssignment(property) &&
          property.name.getText(ast) === 'name' &&
          ts.isStringLiteral(property.initializer) &&
          property.initializer.text === 'ResourceGanttColumnHead')) {
      assert.equal(component, undefined, 'the source must contain one column header');
      component = node.initializer.getText(ast);
    }
  }
  ts.forEachChild(node, findComponent);
}
findComponent(ast);
assert.ok(component, 'execute the actual source component, not a recreated implementation');
assert.equal(icons.size, 4, 'render the actual source icons');
const iconSource = [...icons].map(([name, value]) => `const ${name} = ${value};`).join('\n');
const compiled = ts.transpileModule(`${iconSource}\nmodule.exports = ${component};`, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics?.length || 0, 0);
const sandbox = {
  module: { exports: {} },
  H: vue.defineComponent,
  E: vue.ref,
  j: vue.computed,
  ot: vue.watch,
  r: vue.createVNode,
  R: name => name,
  tt: class {},
  G: () => ({
    b: value => value,
    e: value => value,
    be: (...values) => values.join('-'),
    bem: (...values) => values.join('-'),
  }),
};
vm.runInNewContext(compiled.outputText, sandbox, { filename: file });

// Controlled third-party host dependencies: these are not native browser acceptance.
function setup() {
  const props = vue.reactive({
    controller: { getNodeModel: () => undefined, state: { selectedData: [] } },
    titleData: { label: 'Members' },
    expandAll: false,
  });
  const events = [];
  const scope = vue.effectScope();
  const state = scope.run(() => sandbox.module.exports.setup(props, {
    emit: (...event) => events.push(event),
  }));
  const input = () => state.renderHeadSearch();
  const search = value => {
    input().props['onUpdate:modelValue'](value);
    input().props.onInput(value);
  };
  const open = () => state.renderContent().children[1].children[0].props.onClick({
    stopPropagation() {},
  });
  const close = () => {
    let prevented = 0;
    let stopped = 0;
    input().children.suffix().props.onClick({
      preventDefault() { prevented += 1; },
      stopPropagation() { stopped += 1; },
    });
    assert.equal(prevented, 1);
    assert.equal(stopped, 1);
  };
  return { props, state, events, input, search, open, close, dispose: () => scope.stop() };
}

test('gantt header emits the actual updated member search text', t => {
  const fixture = setup();
  t.after(fixture.dispose);
  fixture.open();
  assert.equal(fixture.state.isHeadSearch.value, true);
  fixture.search('Alice');
  assert.equal(fixture.input().props.modelValue, 'Alice');
  assert.deepEqual(fixture.events, [['headSearch', 'Alice']]);
});

test('closing gantt member search clears both the rendered query and the emitted filter', t => {
  const fixture = setup();
  t.after(fixture.dispose);
  fixture.open();
  fixture.search('missing-member');
  fixture.close();
  assert.equal(fixture.state.isHeadSearch.value, false);
  assert.deepEqual(fixture.events.at(-1), ['headSearch', '']);
  assert.equal(fixture.input().props.modelValue, '');
});

test('reopened gantt search starts empty and subsequent input emits only the new query', t => {
  const fixture = setup();
  t.after(fixture.dispose);
  fixture.open();
  fixture.search('old-query');
  fixture.close();
  fixture.open();
  assert.equal(fixture.state.isHeadSearch.value, true);
  assert.equal(fixture.input().props.modelValue, '');
  fixture.search('new-query');
  assert.equal(fixture.input().props.modelValue, 'new-query');
  assert.deepEqual(fixture.events, [
    ['headSearch', 'old-query'], ['headSearch', ''], ['headSearch', 'new-query'],
  ]);
});

test('gantt header expand and collapse emit their actual boolean state', async t => {
  const fixture = setup();
  t.after(fixture.dispose);
  fixture.state.onExpandAllChange();
  assert.equal(fixture.state.expand.value, true);
  fixture.state.onExpandAllChange();
  assert.equal(fixture.state.expand.value, false);
  assert.deepEqual(fixture.events, [['expandAllChange', true], ['expandAllChange', false]]);
  fixture.props.expandAll = true;
  await vue.nextTick();
  assert.equal(fixture.state.expand.value, true);
});
