import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(process.env.AIBIZ_PERSON_TOOLCHAIN_ROOT || root, 'package.json'));
const ts = require('typescript');
const vue = require('vue');
const ramda = require('ramda');
const sourceRoot = path.join(root, 'plugin-src/@ibiz-template-plm/person-select/src');

function fixture(language, responses) {
  const pending = [...responses], calls = [], timers = new Map(), cleanup = [];
  let timerId = 0;
  const ibiz = {
    i18n: { getLang: () => language },
    net: { request: async (url, config) => {
      calls.push({ url, config: structuredClone(config) });
      assert.ok(pending.length, 'No unexpected service calls');
      return pending.shift()();
    } },
  };
  const modules = new Map();
  const load = file => {
    if (modules.has(file)) return modules.get(file);
    const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
      fileName: file, reportDiagnostics: true,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.React, jsxFactory: 'h' },
    });
    assert.equal(compiled.diagnostics?.length || 0, 0);
    const exported = {};
    const sandbox = {
      exports: exported, module: { exports: exported }, ibiz, h: vue.h, console,
      window: {
        setTimeout: callback => { timers.set(++timerId, callback); return timerId; },
        clearTimeout: id => timers.delete(id), addEventListener() {}, removeEventListener() {},
      },
      require(name) {
        if (name === 'vue') return { ...vue, onMounted() {},
          onBeforeUnmount: callback => cleanup.push(callback), resolveComponent: name => name };
        if (name === 'ramda') return ramda;
        if (name === 'lodash-es') return { isArray: Array.isArray };
        if (name === '@ibiz-template/core') return { RuntimeModelError: Error };
        if (name === 'qx-util') return { notNilEmpty: value => value !== undefined && value !== null && value !== '' };
        if (name === '@ibiz-template/runtime') return { EditorController: class {
          handlePublicParams(_data, context, params) { return { context, params }; }
        } };
        if (name === '@ibiz-template/vue3-util') return {
          getDataPickerProps: () => ({}), getEditorEmits: () => [], renderString: String,
          useNamespace: () => ({ b: value => value || 'picker', e: value => value,
            m: value => value, em: (...values) => values.join('-'),
            is: (value, enabled) => enabled ? `is-${value}` : '' }),
        };
        assert.ok(name.startsWith('./'), `Unexpected module import: ${name}`);
        const stem = path.resolve(path.dirname(file), name);
        const dependency = [`${stem}.ts`, `${stem}.tsx`].find(existsSync);
        assert.equal(path.dirname(dependency), sourceRoot);
        return load(dependency);
      },
    };
    vm.runInNewContext(compiled.outputText, sandbox, { filename: file });
    modules.set(file, sandbox.module.exports);
    return sandbox.module.exports;
  };
  const { PersonelSelectController } = load(path.join(sourceRoot, 'personel-select-controller.ts'));
  const controller = Object.assign(new PersonelSelectController(), {
    valueType: 'SIMPLE', valueItem: 'assignee_id', keyName: 'user_id', textName: 'name',
    model: {}, context: {}, params: {}, userUrl: '/fixture-people', deptUrl: '/fixture-departments',
    size: 2, isShowTab: true, enableBottomButton: false,
    userFilterMap: { id: 'user_id', name: 'name', title: 'title' },
    deptFilterMap: { id: 'user_id', name: 'name', title: 'title' },
  });
  const { PersonelSelect } = load(path.join(sourceRoot, 'personel-select.tsx'));
  const scope = vue.effectScope();
  const events = [];
  const state = scope.run(() => PersonelSelect.setup(vue.reactive({
    controller, value: null, data: {}, controlParams: {},
  }), { emit: (...event) => events.push(event) }));
  return {
    state, controller, calls, events,
    async search(value) {
      state.renderSelectInput().props['onUpdate:modelValue'](value);
      await vue.nextTick();
    },
    flushTimers() {
      const tasks = [...timers.values()];
      timers.clear();
      tasks.forEach(callback => callback());
    },
    close() { cleanup.forEach(callback => callback()); scope.stop(); timers.clear(); },
  };
}

function nodes(node) {
  if (typeof node === 'string' || typeof node === 'number') return [{ type: vue.Text, children: String(node) }];
  if (!node || typeof node !== 'object') return [];
  const children = Array.isArray(node) ? node : typeof node.children === 'string' ? [node.children]
    : Array.isArray(node.children) ? node.children : [];
  return [node, ...children.flatMap(nodes)];
}
const text = node => nodes(node).filter(value => value.type === vue.Text).map(value => value.children).join(' ');
const response = data => ({ data, total: data.length, headers: { 'x-total': String(data.length) } });
const pause = () => {
  let resolve, reject;
  const promise = new Promise((accept, fail) => { resolve = accept; reject = fail; });
  return { promise, resolve, reject };
};

for (const [language, labels] of [
  ['en-US', ['Failed to load', 'Retry', 'No Data']],
  ['zh-CN', ['加载失败', '重试', '暂无数据']],
]) test(`${language}: failed search shows a distinct retry state and retries its original Unicode query/page`, async t => {
  const row = { user_id: 'member-中文🙂e\u0301', name: '中文成员🙂e\u0301', title: '业务职位' };
  const query = '中文🙂e\u0301\'"\\\n';
  const f = fixture(language, [
    async () => { throw new Error('Controlled search failure'); },
    async () => response([row]),
  ]);
  t.after(f.close);
  await f.search(query);
  await f.state.load(true);
  const failure = f.state.renderDropModal();
  assert.ok(text(failure).includes(labels[0]));
  assert.equal(text(failure).includes(labels[2]), false, 'A failed request is not an empty dataset');
  assert.equal(f.state.loading.value, false);
  const retry = nodes(failure).find(node => node.type === 'button');
  assert.equal(text(retry), labels[1]);
  await retry.props.onClick();
  assert.equal(f.calls.length, 2);
  assert.deepEqual(f.calls.map(call => call.config.data.query), [query, query]);
  assert.deepEqual(f.calls.map(call => call.config.data.page), [0, 0]);
  assert.equal(f.controller.page, 1);
  assert.equal(f.state.items.value[0].name, row.name);
  assert.equal(f.state.items.value[0].id, row.user_id);
  assert.equal(text(f.state.renderDropModal()).includes(labels[0]), false);
  assert.equal(f.events.length, 0, 'Search failure/retry must not select a person or emit a business value');
});

test('a rejected stale query cannot replace the current pending or successful result with a retry error', async t => {
  const older = pause(), newer = pause();
  const f = fixture('en-US', [() => older.promise, () => newer.promise]);
  t.after(f.close);
  await f.search('old');
  const oldLoad = f.state.load(true);
  await f.search('new');
  const newLoad = f.state.load(true);
  older.reject(new Error('Old request failed later'));
  await oldLoad;
  assert.equal(f.state.loading.value, true);
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
  newer.resolve(response([{ user_id: 'new', name: 'New result' }]));
  await newLoad;
  assert.equal(f.state.items.value[0].name, 'New result');
  assert.equal(f.state.loading.value, false);
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
});

test('a new query clears a previous failure while loading and may complete as a genuine empty result', async t => {
  const current = pause();
  const f = fixture('en-US', [
    async () => { throw new Error('First search failed'); }, () => current.promise,
  ]);
  t.after(f.close);
  await f.search('failed');
  await f.state.load(true);
  assert.ok(text(f.state.renderDropModal()).includes('Failed to load'));
  await f.search('empty');
  const load = f.state.load(true);
  assert.ok(text(f.state.renderDropModal()).includes('Loading...'));
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
  current.resolve(response([]));
  await load;
  assert.ok(text(f.state.renderDropModal()).includes('No Data'));
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
});

test('a stale people failure cannot replace the department result after the actual tab action', async t => {
  const older = pause(), department = pause();
  const f = fixture('en-US', [() => older.promise, () => department.promise]);
  t.after(f.close);
  const oldLoad = f.state.load(true);
  const tab = nodes(f.state.renderDropModal()).find(node =>
    node.props?.class === 'select-state-select-department');
  tab.props.onClick();
  department.resolve(response([{ user_id: 'department-person', name: 'Department person' }]));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.state.items.value[0].name, 'Department person');
  older.reject(new Error('Old people request failed'));
  await oldLoad;
  assert.equal(f.state.items.value[0].name, 'Department person');
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
  assert.deepEqual(f.calls.map(call => call.url), ['/fixture-people', '/fixture-departments']);
});

test('a next-page failure retains loaded rows and retries that page without duplicates', async t => {
  const first = [{ user_id: 'member-1', name: 'Member One' }, { user_id: 'member-2', name: 'Member Two' }];
  const second = [{ user_id: 'member-3', name: 'Member Three' }];
  const f = fixture('en-US', [
    async () => ({ ...response(first), total: 3 }),
    async () => { throw new Error('Next page failed'); },
    async () => ({ ...response(second), total: 3 }),
  ]);
  t.after(f.close);
  await f.state.load(true);
  await f.state.load(false);
  assert.deepEqual(Array.from(f.state.items.value, item => item.name), ['Member One', 'Member Two']);
  assert.equal(f.controller.page, 1);
  const retry = nodes(f.state.renderDropModal()).find(node => node.type === 'button');
  assert.equal(text(retry), 'Retry');
  await retry.props.onClick();
  assert.deepEqual(f.calls.map(call => call.config.data.page), [0, 1, 1]);
  assert.deepEqual(Array.from(f.state.items.value, item => item.name),
    ['Member One', 'Member Two', 'Member Three']);
  assert.equal(f.controller.page, 2);
});

test('a successful empty search remains an empty state without a retry error', async t => {
  const f = fixture('en-US', [async () => response([])]);
  t.after(f.close);
  await f.search('no-match');
  await f.state.load(true);
  assert.ok(text(f.state.renderDropModal()).includes('No Data'));
  assert.equal(text(f.state.renderDropModal()).includes('Failed to load'), false);
  assert.equal(nodes(f.state.renderDropModal()).some(node => node.type === 'button'), false);
});
