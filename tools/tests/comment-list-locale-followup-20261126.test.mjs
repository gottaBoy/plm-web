import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(process.env.AIBIZ_COMMENT_TOOLCHAIN_ROOT || root, 'package.json'));
const ts = require('typescript');
const vue = require('vue');
const sourceDirectory = path.join(root, 'plugin-src/@ibiz-template-plm/comment-list/src');

function loadCommentSource(language, services) {
  const modules = new Map();
  const cleanup = [];
  const imports = new Set();
  const load = file => {
    if (modules.has(file)) return modules.get(file);
    const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
      fileName: file,
      reportDiagnostics: true,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    });
    assert.equal(compiled.diagnostics?.length || 0, 0);
    const exported = {};
    const sandbox = {
      exports: exported, module: { exports: exported }, console,
      ibiz: { i18n: { getLang: () => language }, ...services },
      require(name) {
        imports.add(name);
        if (name === 'vue') return { ...vue, onBeforeUnmount: callback => cleanup.push(callback) };
        if (name === '@ibiz-template/vue3-util') return {
          getInputProps: () => ({}), getEditorEmits: () => [],
          useNamespace: () => ({ b: () => 'ibiz-comment-list', e: value => value,
            em: (...values) => values.join('-') }),
        };
        assert.ok(name.startsWith('./'), `Unexpected source import: ${name}`);
        const target = path.resolve(path.dirname(file), `${name}.ts`);
        assert.equal(path.dirname(target), sourceDirectory);
        return load(target);
      },
    };
    vm.runInNewContext(compiled.outputText, sandbox, { filename: file });
    modules.set(file, sandbox.module.exports);
    return sandbox.module.exports;
  };
  return { component: load(path.join(sourceDirectory, 'comment-list.ts')).CommentList,
    locale: load(path.join(sourceDirectory, 'comment-list.locale.ts')),
    imports, close: () => {
      for (const callback of cleanup.splice(0)) callback();
    } };
}

function nodes(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return [{ type: vue.Text, children: String(node) }];
  }
  if (!node || typeof node !== 'object') return [];
  const children = Array.isArray(node) ? node : Array.isArray(node.children)
    ? node.children : typeof node.children === 'string' ? [node.children] : [];
  return [node, ...children.flatMap(nodes)];
}
const content = node => nodes(node).filter(value => value.type === vue.Text)
  .map(value => value.children).join(' ');

test('the existing locale dependency retains year/leap-day boundaries and invalid timestamp bytes', () => {
  const { locale, close } = loadCommentSource('en-US');
  const now = new Date(2026, 0, 1, 9, 30);
  assert.equal(locale.formatCommentTime('2025-12-31 23:59:00', 'en-US', now), 'Yesterday 23:59');
  assert.equal(locale.formatCommentTime('2025-12-31 23:59:00', 'zh-CN', now), '昨天 23:59');
  assert.equal(locale.formatCommentTime('2028-02-29 12:45:00', 'en', new Date(2028, 2, 1)),
    'Yesterday 12:45');
  for (const value of ['2026-02-30 10:00:00', '2026-01-01 24:01:00', '中文🙂e\u0301\'"\\\n']) {
    assert.equal(locale.formatCommentTime(value, 'en-US', now), value);
  }
  close();
});

for (const [language, labels] of [
  ['en-US', ['Edit', 'Delete']],
  ['zh-CN', ['编辑', '删除']],
]) test(`${language}: actual comment source replaces a failed avatar and keeps other images, text and actions`, t => {
  let downloadLookups = 0;
  const removed = [], edited = [], subscribed = [], unsubscribed = [];
  const loaded = loadCommentSource(language, { util: { file: {
    calcFileUpDownUrl() {
      downloadLookups += 1;
      return { downloadUrl: '/files/%fileId%' };
    },
  } } });
  const broken = { id: 'comment-中文🙂e\u0301', create_man: 'author-broken',
    create_time: '2026-01-01 01:02:03', content: '<p>中文🙂e\u0301\'"\\\n</p>' };
  const healthy = { id: 'comment-healthy', create_man: 'author-healthy',
    create_time: '2026-01-01 02:03:04', content: '<p>Retained content</p>' };
  const comments = [broken, healthy];
  const before = structuredClone(comments);
  const controller = {
    isLocal: false, context: { srfuserid: broken.create_man }, params: {}, editorParams: {},
    operatorMap: new Map([
      [broken.create_man, { data: { label: '中文成员🙂', iconurl: '[{"id":"broken-file"}]' } }],
      [healthy.create_man, { data: { label: 'Healthy Author', iconurl: '[{"id":"healthy-file"}]' } }],
    ]),
    evt: { on: (name, handler) => subscribed.push([name, handler]),
      off: (name, handler) => unsubscribed.push([name, handler]) },
    updateComment: value => edited.push(value), deleteComment: value => removed.push(value),
  };
  const scope = vue.effectScope();
  t.after(() => { loaded.close(); scope.stop(); });
  const state = scope.run(() => loaded.component.setup({ controller, value: comments, data: {} }));
  const first = state.renderList();
  const images = nodes(first).filter(node => node.type === 'img');
  assert.equal(images.length, 2);
  assert.equal(images[0].props.src, '/files/broken-file');
  images[0].props.onError();
  const afterFailure = state.renderList();
  const retainedImages = nodes(afterFailure).filter(node => node.type === 'img');
  assert.deepEqual(retainedImages.map(node => node.props.src), ['/files/healthy-file']);
  assert.ok(content(afterFailure).includes('成员'));
  assert.ok(content(afterFailure).includes('中文成员🙂'));
  assert.equal(nodes(afterFailure).filter(node => node.props?.innerHTML === broken.content).length, 1);
  const actions = nodes(afterFailure).filter(node => node.props?.title);
  assert.deepEqual(actions.map(node => node.props.title), labels);
  actions[0].props.onClick();
  actions[1].props.onClick();
  assert.deepEqual(edited, [broken]);
  assert.deepEqual(removed, [broken]);
  state.renderList();
  assert.equal(downloadLookups, 4, 'Only the healthy file is looked up after the failed image is replaced');
  assert.deepEqual(comments, before);
  assert.ok(loaded.imports.has('./comment-list.utils'));
  assert.ok(loaded.imports.has('./comment-list.locale'));
  assert.equal(loaded.imports.has('./comment-list.controller'), false,
    'The component controller import is type-only in the executed module');
  loaded.close();
  assert.equal(unsubscribed.length, subscribed.length);
});
