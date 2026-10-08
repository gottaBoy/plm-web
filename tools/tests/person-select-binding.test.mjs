import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const vue = require('vue');
const ramda = require('ramda');
const sourceRoot = path.join(root, 'plugin-src/@ibiz-template-plm/person-select/src');

function compile(file, imports, transformers = {}, globals = {}) {
  const source = readFileSync(path.join(sourceRoot, file), 'utf8');
  const result = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      jsxFactory: 'h',
    },
    transformers,
    reportDiagnostics: true,
  });
  assert.equal(result.diagnostics?.length || 0, 0, 'test input must compile');
  const exports = {};
  const sandbox = {
    ...globals,
    exports,
    module: { exports },
    require: name => {
      assert.ok(name in imports, `Undeclared test dependency: ${name}`);
      return imports[name];
    },
    window: {
      setTimeout: () => 1,
      clearTimeout: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  };
  vm.runInNewContext(result.outputText, sandbox, { filename: file });
  return sandbox.module.exports;
}

const controllerImports = {
  '@ibiz-template/core': { RuntimeModelError: Error },
  '@ibiz-template/runtime': {
    EditorController: class {
      handlePublicParams(_data, context, params) {
        return { context, params };
      }
    },
  },
  'qx-util': { notNilEmpty: value => value !== null && value !== undefined && value !== '' },
  ramda,
};
const { PersonelSelectController } = compile('personel-select-controller.ts', controllerImports);

// Expose closure methods through the AST without replacing their implementation.
const exposeSelection = context => source => {
  const visit = node => {
    if (ts.isMethodDeclaration(node) && node.name.getText(source) === 'setup') {
      const statements = node.body.statements.map(statement => {
        if (ts.isReturnStatement(statement) && ts.isObjectLiteralExpression(statement.expression)) {
          return ts.factory.updateReturnStatement(
            statement,
            ts.factory.updateObjectLiteralExpression(statement.expression, [
              ...statement.expression.properties,
              ts.factory.createShorthandPropertyAssignment('selectItem'),
              ts.factory.createShorthandPropertyAssignment('initSelectedItems'),
              ts.factory.createShorthandPropertyAssignment('selectedItems'),
              ts.factory.createShorthandPropertyAssignment('selectedValues'),
              ts.factory.createShorthandPropertyAssignment('activeTab'),
              ts.factory.createShorthandPropertyAssignment('searchValue'),
            ]),
          );
        }
        return statement;
      });
      return ts.factory.updateMethodDeclaration(
        node, node.modifiers, node.asteriskToken, node.name, node.questionToken,
        node.typeParameters, node.parameters, node.type,
        ts.factory.updateBlock(node.body, statements),
      );
    }
    return ts.visitEachChild(node, visit, context);
  };
  return ts.visitNode(source, visit);
};

const { PersonelSelect } = compile('personel-select.tsx', {
  vue: {
    ...vue,
    onMounted: () => {},
    onBeforeUnmount: () => {},
  },
  'lodash-es': { isArray: Array.isArray },
  ramda,
  '@ibiz-template/vue3-util': {
    getDataPickerProps: () => ({}),
    getEditorEmits: () => [],
    renderString: String,
    useNamespace: () => ({}),
  },
  './util': { Util: { calcSelItemRenderNum: () => 10 } },
  './virtual-list': { VirtualList: {} },
}, { before: [exposeSelection] });

function setup(options = {}, value = null, data = {}) {
  const controller = Object.assign(new PersonelSelectController(), {
    valueType: 'SIMPLE',
    valueItem: 'assignee_id',
    keyName: 'user_id',
    textName: 'name',
    ...options,
  });
  const props = vue.reactive({ controller, value, data, controlParams: {} });
  const events = [];
  const scope = vue.effectScope();
  const state = scope.run(() => PersonelSelect.setup(props, {
    emit: (...event) => {
      events.push(event);
      if (event[0] === 'change') {
        if (event.length === 3) props.data[event[2]] = event[1];
        else props.value = event[1];
      }
    },
  }));
  return { controller, props, events, state, dispose: () => scope.stop() };
}

const plain = value => JSON.parse(JSON.stringify(value));
const member = { id: 'member-a', user_id: 'member-a', name: 'Member A', title: 'Engineer' };

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((accept, fail) => {
    resolve = accept;
    reject = fail;
  });
  return { promise, resolve, reject };
}

// Controlled transport exercises the compiled controller, not native acceptance.
function serviceFixture() {
  const calls = [];
  const pauses = [];
  let nextError;
  const rows = Array.from({ length: 6 }, (_, index) => ({
    user_id: `member-${index}`,
    name: `Member ${index}`,
    title: 'Engineer',
  }));
  const { PersonelSelectController: Controller } = compile(
    'personel-select-controller.ts',
    controllerImports,
    {},
    {
      ibiz: {
        net: {
          async request(url, config) {
            calls.push(plain({ url, config }));
            if (nextError) {
              const error = nextError;
              nextError = undefined;
              throw error;
            }
            const params = config.data || config.params;
            const page = params.page ?? 0;
            const size = params.size;
            const pause = pauses.shift();
            if (pause) await pause.promise;
            return {
              data: rows.slice(page * size, (page + 1) * size).map(row => ({ ...row })),
              headers: { 'x-total': String(rows.length) },
            };
          },
        },
      },
    },
  );
  const controller = Object.assign(new Controller(), {
    size: 2,
    context: { product: 'product-a' },
    params: { n_status_eq: 'active' },
    userUrl: '/products/${context.product}/product_members/fetch_default',
    deptUrl: '/users/fetch_default',
    deptMethod: 'get',
    sort: 'name,asc',
    userFilterMap: { id: 'user_id', name: 'name', title: 'title', avatar: '' },
    deptFilterMap: { id: 'user_id', name: 'name', title: 'title', avatar: '' },
  });
  return {
    controller,
    calls,
    failNext(error) { nextError = error; },
    holdNext() {
      const pause = deferred();
      pauses.push(pause);
      return pause;
    },
    fixtureAcceptance: true,
    nativeAcceptance: false,
  };
}

test('user POST pagination sends consecutive pages and returns distinct members until exhausted', async () => {
  const { controller, calls } = serviceFixture();
  const members = [];
  for (let index = 0; index < 3; index += 1) {
    const response = await controller.loadMore({}, 'user', { query: 'Member' });
    members.push(...response.data);
  }
  assert.deepEqual(calls.map(call => call.config.data.page), [0, 1, 2]);
  assert.equal(new Set(members.map(row => row.id)).size, 6);
  assert.equal(controller.currentNumber, 6);
  assert.equal(controller.page, 3);
  assert.equal(await controller.loadMore({}, 'user'), undefined);
  assert.equal(calls.length, 3, 'an exhausted list must not issue another request');
  for (const call of calls) {
    assert.equal(call.url, '/products/product-a/product_members/fetch_default');
    assert.equal(call.config.method, 'post');
    assert.equal(call.config.data.size, 2);
    assert.equal(call.config.data.query, 'Member');
    assert.equal(call.config.data.sort, 'name,asc');
    assert.equal(call.config.data.n_status_eq, 'active');
  }
});

test('default empty load params still send pagination and public params', async () => {
  const { controller, calls } = serviceFixture();
  await controller.loadMore({}, 'user');
  assert.deepEqual(calls[0].config.data, {
    sort: 'name,asc',
    page: 0,
    size: 2,
    n_status_eq: 'active',
  });
});

test('department GET pages are independent from user pages and reset with a new search', async () => {
  const { controller, calls } = serviceFixture();
  await controller.loadMore({}, 'department');
  await controller.loadMore({}, 'department');
  assert.deepEqual(calls.map(call => call.config.params.page), [0, 1]);
  assert.equal(controller.deptpage, 2);
  assert.equal(controller.page, 0);
  await controller.loadMore({}, 'user');
  assert.equal(calls[2].config.data.page, 0);
  controller.resetDeptState();
  await controller.loadMore({}, 'department', { query: 'another search' });
  assert.equal(calls[3].config.params.page, 0);
  assert.equal(calls[3].config.params.query, 'another search');
  assert.equal(calls[3].config.method, 'get');
  assert.equal(controller.page, 1, 'department reset must not reset user pagination');
  controller.resetState();
  assert.equal(controller.page, 0);
  assert.equal(controller.deptpage, 0);
  assert.equal(controller.currentNumber, -1);
  assert.equal(controller.deptcurrentNumber, -1);
});

for (const tag of ['user', 'department']) {
  test(`${tag} retries the same page after transport failure without advancing state`, async () => {
    const { controller, calls, failNext } = serviceFixture();
    await controller.loadMore({}, tag);
    failNext(new Error('transport failure'));
    await assert.rejects(controller.loadMore({}, tag), /transport failure/);
    assert.equal(tag === 'user' ? controller.page : controller.deptpage, 1);
    assert.equal(tag === 'user' ? controller.currentNumber : controller.deptcurrentNumber, 2);
    await controller.loadMore({}, tag);
    assert.deepEqual(calls.map(call => (call.config.data || call.config.params).page), [0, 1, 1]);
  });
}

test('explicit service pagination remains usable for current-operator lookup', async () => {
  const { controller, calls } = serviceFixture();
  controller.deptpage = 3;
  await controller.getServiceData('department', {}, {}, {
    page: 0, size: 20, n_id_eq: 'member-0',
  });
  assert.deepEqual(calls[0].config.params, { page: 0, size: 20, n_id_eq: 'member-0' });
  assert.equal(controller.deptpage, 3);
});

for (const tag of ['user', 'department']) {
  test(`${tag} coalesces overlapping next-page requests without skipping a page`, async () => {
    const { controller, calls, holdNext } = serviceFixture();
    const pause = holdNext();
    const first = controller.loadMore({}, tag);
    const repeated = controller.loadMore({}, tag);
    const requestCount = calls.length;
    pause.resolve();
    const [firstResult, repeatedResult] = await Promise.all([first, repeated]);
    assert.equal(requestCount, 1, 'two scroll events must not send the same page twice');
    assert.deepEqual(plain(firstResult.data), plain(repeatedResult.data));
    assert.equal(tag === 'user' ? controller.page : controller.deptpage, 1);
    await controller.loadMore({}, tag);
    assert.deepEqual(calls.map(call => (call.config.data || call.config.params).page), [0, 1]);
  });

  test(`${tag} reset invalidates late results without advancing the new query`, async () => {
    const { controller, calls, holdNext } = serviceFixture();
    const pause = holdNext();
    const stale = controller.loadMore({}, tag, { query: 'old' });
    if (tag === 'user') controller.resetUserState();
    else controller.resetDeptState();
    const latest = await controller.loadMore({}, tag, { query: 'new' });
    pause.resolve();
    assert.equal(await stale, undefined, 'a reset request must not return old query rows');
    assert.equal(latest.data.length, 2);
    assert.equal(tag === 'user' ? controller.page : controller.deptpage, 1);
    assert.equal(tag === 'user' ? controller.currentNumber : controller.deptcurrentNumber, 2);
    assert.deepEqual(calls.map(call => (call.config.data || call.config.params).page), [0, 0]);
  });
}

test('search reset ignores a late component response and keeps current loading state', async t => {
  const oldRequest = deferred();
  const newRequest = deferred();
  const pending = [oldRequest, newRequest];
  const f = setup({ loadMore: () => pending.shift().promise });
  t.after(f.dispose);
  f.state.searchValue.value = 'old';
  const stale = f.state.load(true);
  f.state.searchValue.value = 'new';
  const latest = f.state.load(true);
  oldRequest.resolve({ data: [{ id: 'old', name: 'Old search result' }] });
  await stale;
  assert.deepEqual(plain(f.state.items.value), [], 'old response must not overwrite the current search');
  assert.equal(f.state.loading.value, true, 'old response must not dismiss the current loading indicator');
  newRequest.resolve({ data: [{ id: 'new', name: 'New search result' }] });
  await latest;
  assert.deepEqual(plain(f.state.items.value).map(item => item.id), ['new']);
  assert.equal(f.state.loading.value, false);
});

test('tab reset ignores late user rows after the department list has loaded', async t => {
  const oldRequest = deferred();
  const newRequest = deferred();
  const pending = [oldRequest, newRequest];
  const f = setup({ loadMore: () => pending.shift().promise });
  t.after(f.dispose);
  const stale = f.state.load(true);
  f.state.activeTab.value = 'department';
  const latest = f.state.load(true);
  newRequest.resolve({ data: [{ id: 'department', name: 'Department member' }] });
  await latest;
  oldRequest.resolve({ data: [{ id: 'user', name: 'Old user member' }] });
  await stale;
  assert.deepEqual(plain(f.state.items.value).map(item => item.id), ['department']);
  assert.equal(f.state.loading.value, false);
});

test('overlapping component scroll loads append the next page only once', async t => {
  const request = deferred();
  let calls = 0;
  const f = setup({ loadMore: () => {
    calls += 1;
    return request.promise;
  } });
  t.after(f.dispose);
  f.state.items.value = [{ id: 'first', name: 'First page member' }];
  const first = f.state.load();
  const repeated = f.state.load();
  request.resolve({ data: [{ id: 'next', name: 'Next page member' }] });
  await Promise.all([first, repeated]);
  assert.equal(calls, 1);
  assert.deepEqual(plain(f.state.items.value).map(item => item.id), ['first', 'next']);
});

test('SIMPLE initializes text independently of the hidden ID and watches ID changes', async t => {
  const f = setup({}, 'Member A', { assignee_id: 'member-a' });
  t.after(f.dispose);
  assert.deepEqual(plain(f.state.selectedValues.value), ['member-a']);
  assert.equal(f.state.valueText.value, 'Member A');
  f.props.data.assignee_id = 'member-b';
  await vue.nextTick();
  assert.deepEqual(plain(f.state.selectedValues.value), ['member-b']);
  assert.equal(f.state.valueText.value, 'Member A');
});

test('selection fills the hidden ID, display text and AC fields then ends editing', async t => {
  const f = setup({
    deACMode: {},
    dataItems: [{ id: 'assignee_title', appDEFieldId: 'title' }],
  });
  t.after(f.dispose);
  await f.state.selectItem(member);
  await vue.nextTick();
  assert.deepEqual(plain(f.events), [
    ['change', 'Engineer', 'assignee_title'],
    ['change', 'member-a', 'assignee_id'],
    ['change', 'Member A'],
    ['infoTextChange', 'Member A'],
    ['blur'],
  ]);
  assert.equal(f.props.value, 'Member A');
  assert.equal(f.props.data.assignee_id, 'member-a');
  assert.equal(f.state.valueText.value, 'Member A');
  assert.equal(f.state.modelVisible.value, false);
});

test('clear resets AC fields, hidden ID, text and selection without reopening the popup', async t => {
  const f = setup({ dataItems: [{ id: 'assignee_title' }] }, 'Member A', {
    assignee_id: 'member-a', assignee_title: 'Engineer',
  });
  t.after(f.dispose);
  let stopped = false;
  f.state.onClear({ stopPropagation() { stopped = true; } });
  await vue.nextTick();
  assert.ok(stopped);
  assert.equal(f.props.value, null);
  assert.equal(f.props.data.assignee_id, null);
  assert.equal(f.props.data.assignee_title, null);
  assert.equal(f.state.valueText.value, '');
  assert.deepEqual(plain(f.state.selectedValues.value), []);
  assert.equal(f.state.modelVisible.value, false);
});

test('multiple SIMPLE selections retain separate IDs, custom separator and toggle removal', async t => {
  const f = setup({ multiple: true, separator: ';', isAddSymbol: true });
  t.after(f.dispose);
  await f.state.selectItem(member);
  await vue.nextTick();
  await f.state.selectItem({ id: 'member-b', user_id: 'member-b', name: 'Member B' });
  await vue.nextTick();
  assert.equal(f.props.value, 'Member A;Member B');
  assert.equal(f.props.data.assignee_id, "'member-a';'member-b'");
  assert.deepEqual(plain(f.state.selectedValues.value), ['member-a', 'member-b']);
  assert.equal(f.state.valueText.value, 'Member A;Member B');
  await f.state.selectItem(member);
  await vue.nextTick();
  assert.equal(f.props.value, 'Member B');
  assert.equal(f.props.data.assignee_id, "'member-b'");
});

for (const valueType of ['OBJECT', 'OBJECTS']) {
  test(`${valueType} emits mapped objects without sharing the selected member`, async t => {
    const f = setup({
      valueType,
      objectIdField: 'user_id',
      objectNameField: 'name',
      objectValueField: 'record',
    });
    t.after(f.dispose);
    await f.state.selectItem(member);
    await vue.nextTick();
    const output = valueType === 'OBJECT' ? f.props.value : f.props.value[0];
    assert.equal(output.user_id, member.user_id);
    assert.equal(output.name, member.name);
    assert.deepEqual(plain(output.record), member);
    assert.notEqual(output.record, member);
    assert.equal(f.state.valueText.value, 'Member A');
  });

  test(`${valueType} reloads custom object fields and retains their IDs when selection changes`, async t => {
    const existing = {
      person_key: 'member-a',
      person_label: 'Member A',
      record: { ...member },
    };
    const f = setup({
      valueType,
      multiple: valueType === 'OBJECTS',
      objectIdField: 'person_key',
      objectNameField: 'person_label',
      objectValueField: 'record',
    }, valueType === 'OBJECT' ? existing : [existing]);
    t.after(f.dispose);
    assert.deepEqual(plain(f.state.selectedValues.value), ['member-a']);
    assert.equal(f.state.valueText.value, 'Member A');
    await f.state.selectItem({ id: 'member-b', user_id: 'member-b', name: 'Member B' });
    await vue.nextTick();
    const output = valueType === 'OBJECT' ? [f.props.value] : f.props.value;
    assert.deepEqual(plain(output).map(item => item.person_key), valueType === 'OBJECT' ? ['member-b'] : ['member-a', 'member-b']);
    assert.deepEqual(plain(output).map(item => item.person_label), valueType === 'OBJECT' ? ['Member B'] : ['Member A', 'Member B']);
    assert.deepEqual(existing.record, member, 'normalization must not mutate the input record');
  });
}
