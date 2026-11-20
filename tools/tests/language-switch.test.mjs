import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as Vue from 'vue';

const filename = new URL('../../src/components/language-switch/language-switch.tsx', import.meta.url);
const source = readFileSync(filename, 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.React, esModuleInterop: true,
  },
}).outputText;

function fixture(state, language = 'zh-CN') {
  const exports = {};
  const changes = [];
  vm.runInNewContext(output, {
    exports,
    require: name => {
      if (name === 'vue') return Vue;
      if (name === '@/locale/model-locale') return {
        normalizePlmLanguage: value => /^en(?:-|_|$)/i.test(value) ? 'en' : 'zh-CN',
      };
      return {};
    },
    ibiz: { i18n: { getLang: () => language, setLang: value => changes.push(value) } },
  });
  const before = Reflect.ownKeys(state);
  const model = exports.PlmLanguageSwitch.setup({
    controller: { panel: { view: { state } } },
  });
  assert.deepEqual(Reflect.ownKeys(state), before, 'reading collapse state must not mutate the view');
  return { model, changes };
}

test('login view without index collapse state keeps the language label visible', () => {
  const state = Vue.reactive({ isCreated: true });
  const { model } = fixture(state);
  assert.equal(model.collapsed.value, false);
  assert.equal(model.language, 'zh-CN');
  assert.equal(Object.hasOwn(state, 'isCollapse'), false);
});

test('index collapse state stays reactive and only the actual boolean true hides the label', () => {
  const state = Vue.reactive({ isCollapse: false });
  const { model } = fixture(state);
  assert.equal(model.collapsed.value, false);
  state.isCollapse = true;
  assert.equal(model.collapsed.value, true);
  state.isCollapse = false;
  assert.equal(model.collapsed.value, false);
  for (const value of [undefined, null, 0, 1, '', 'true', 'false']) {
    const { model: invalid } = fixture(Vue.reactive({ isCollapse: value }));
    assert.equal(invalid.collapsed.value, false);
  }
});

test('a view gaining collapse support after setup is observed without writing default state', () => {
  const state = Vue.reactive({});
  const { model } = fixture(state);
  assert.equal(model.collapsed.value, false);
  state.isCollapse = true;
  assert.equal(model.collapsed.value, true);
  delete state.isCollapse;
  assert.equal(model.collapsed.value, false);
});

test('only a different supported language invokes the existing language service', () => {
  for (const [current, expected, next] of [
    ['zh-CN', 'zh-CN', 'en'], ['en-US', 'en', 'zh-CN'],
  ]) {
    const { model, changes } = fixture({}, current);
    assert.equal(model.language, expected);
    for (const value of [expected, 'en-US', 'EN', '', null, undefined, 'other']) {
      model.change(value);
    }
    assert.deepEqual(changes, []);
    model.change(next);
    assert.deepEqual(changes, [next]);
  }
});
