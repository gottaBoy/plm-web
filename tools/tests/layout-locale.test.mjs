import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule(filename, require) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(filename, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, { exports, require });
  return exports;
}

const dictionary = JSON.parse(readFileSync(new URL('../../src/locale/en.json', import.meta.url)));
const locale = loadModule('../../src/locale/model-locale.ts', name => {
  assert.equal(name, './en.json');
  return dictionary;
});
const { installPlmLayoutLocale } = loadModule('../../src/locale/layout-locale.ts', name => {
  assert.equal(name, './model-locale');
  return locale;
});

test('default layout labels translate after filling without mutating cached layouts or behavior', () => {
  const layout = {
    rootPanelItems: [{ caption: '确定', id: '确定', scriptCode: 'return "确定";' },
      { caption: '取消', text: '名称' }],
    controls: [{ caption: '工作台' }],
  };
  let calls = 0;
  const utility = {
    fill(model) {
      assert.equal(this, utility);
      calls += 1;
      return { ...model, viewLayoutPanel: layout };
    },
  };
  let language = 'en-US';
  let appId = '';
  installPlmLayoutLocale(utility, () => appId, () => language);
  const wrapped = utility.fill;
  installPlmLayoutLocale(utility, () => appId, () => language);
  assert.equal(utility.fill, wrapped, 'installation must be idempotent');
  assert.equal(utility.fill({}).viewLayoutPanel, layout, 'uninitialized application must stay untouched');
  calls = 0;
  appId = 'plmweb';
  const input = { appId: 'plmweb', id: 'test', name: '名称' };
  const result = utility.fill(input);
  assert.equal(calls, 1);
  assert.equal(result.name, input.name);
  assert.equal(result.viewLayoutPanel.rootPanelItems[0].caption, 'Confirm');
  assert.equal(result.viewLayoutPanel.rootPanelItems[0].id, '确定');
  assert.equal(result.viewLayoutPanel.rootPanelItems[0].scriptCode, 'return "确定";');
  assert.equal(result.viewLayoutPanel.rootPanelItems[1].caption, 'Cancel');
  assert.equal(result.viewLayoutPanel.controls[0].caption, 'Workspace');
  assert.equal(layout.rootPanelItems[0].caption, '确定');
  assert.equal(input.viewLayoutPanel, undefined);
  assert.equal(utility.fill({ appId: 'other' }).viewLayoutPanel, layout);
  language = 'zh-CN';
  assert.equal(utility.fill(input).viewLayoutPanel, layout);
});

test('layout localization retains absent layouts and original fill failures', () => {
  const noLayout = { fill: model => model };
  installPlmLayoutLocale(noLayout, () => 'plmweb', () => 'en');
  const model = { appId: 'plmweb' };
  assert.equal(noLayout.fill(model), model);
  const failed = { fill() { throw new Error('layout unavailable'); } };
  installPlmLayoutLocale(failed, () => 'plmweb', () => 'en');
  assert.throws(() => failed.fill(model), /layout unavailable/);
});
