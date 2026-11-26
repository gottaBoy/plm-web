import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const runtime = new URL('../ibiz-app-hub/packages/runtime/src/', root);
const dictionary = JSON.parse(readFileSync(new URL('src/locale/en.json', root), 'utf8'));

function execute(filename, require = name => {
  throw new Error(`Unexpected source dependency: ${name}`);
}) {
  const source = readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: filename.pathname,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });
  assert.deepEqual(compiled.diagnostics ?? [], []);
  const exports = {};
  vm.runInNewContext(compiled.outputText, { exports, require }, { filename: filename.pathname });
  return exports;
}

const locale = execute(new URL('src/locale/model-locale.ts', root), name => {
  assert.equal(name, './en.json');
  return dictionary;
});
const { installPlmCodeListLocale } = execute(new URL('src/locale/codelist-locale.ts', root), name => {
  assert.equal(name, './model-locale');
  return locale;
});
const { CodeListDataItem } = execute(
  new URL('service/vo/code-list-data-item/code-list-data-item.ts', runtime),
  name => {
    if (name === 'ramda') return { clone: structuredClone };
    if (name === '../../utils') return {
      fieldValueToBoolean: value => [true, 1, '1', 'true'].includes(value),
    };
    if (name === '../../../utils') return {
      ScriptFactory: { execSingleLine: () => { throw new Error('No script execution expected'); } },
    };
    if (name === '../..') return { AppDataEntity: class AppDataEntity {} };
    throw new Error(`Unexpected code-list item dependency: ${name}`);
  },
);

function codeList(name) {
  return execute(new URL(`src/publish/model/code-list/${name}.ts`, root)).default;
}

function fixture() {
  const model = codeList('proj-mgmt-project-state');
  const data = {
    id: 'pending', name: '未开始', color: '#001EFF', style: 'blue-span',
    disabled: 1, is_system: 1,
    custom_value: '中文🙂 e\u0301 "quote" \\slash\nnext',
  };
  const runtimeModel = { ...model, disableAppDEFieldId: 'disabled' };
  const item = new CodeListDataItem(runtimeModel, data, { index: 0, total: 1 });
  const items = Object.freeze([item]);
  let language = 'en';
  const service = {
    setCodeList() {},
    async get() { return items; },
  };
  installPlmCodeListLocale(service, () => language);
  service.setCodeList(locale.localizePlmModel(model, 'en'));
  return { model, data, item, items, service,
    setLanguage(value) { language = value; } };
}

test('localized native dynamic items retain the runtime prototype, source and field getters', async () => {
  const f = fixture();
  const result = await f.service.get(f.model.id);
  assert.equal(result[0].text, 'Not Started');
  assert.notEqual(result[0], f.item, 'Display adaptation must not edit the runtime cache item');
  assert.equal(Object.getPrototypeOf(result[0]), CodeListDataItem.prototype);
  assert.equal(result[0].$origin, f.data);
  assert.equal(Object.getOwnPropertyDescriptor(result[0], '$origin').enumerable, false);
  assert.equal(Object.getOwnPropertyDescriptor(result[0], 'value').get,
    Object.getOwnPropertyDescriptor(f.item, 'value').get);
  assert.equal(result[0].custom_value, f.data.custom_value);
  f.data.color = '#FF1900';
  f.data.disabled = 0;
  f.data.style = 'red-span';
  assert.equal(result[0].color, '#FF1900', 'Formatting still reads the same runtime source');
  assert.equal(result[0].disableSelect, false);
  assert.equal(result[0].textCls, 'red-span');
  assert.equal(f.item.text, '未开始');
});

test('the same raw cached items are used when switching back to Chinese', async () => {
  const f = fixture();
  const english = await f.service.get(f.model.id);
  f.setLanguage('zh-CN');
  assert.equal(await f.service.get(f.model.codeName), f.items);
  assert.equal(f.item.text, '未开始');
  assert.equal(english[0].$origin, f.data);
  f.setLanguage('en-US');
  const refreshed = await f.service.get(f.model.id);
  assert.equal(refreshed[0].text, 'Not Started');
  assert.equal(refreshed[0].$origin, f.data);
  assert.equal(f.data.name, '未开始');
});

test('custom states and people remain their original runtime objects even with translatable labels', async () => {
  const f = fixture();
  f.data.name = '客户自定义状态';
  assert.equal((await f.service.get(f.model.id))[0], f.item);
  const peopleModel = codeList('sys-operator');
  f.service.setCodeList(peopleModel);
  f.data.name = '未开始';
  assert.equal((await f.service.get(peopleModel.id))[0], f.item);
  assert.equal(f.item.text, '未开始');
  assert.equal(f.item.custom_value, f.data.custom_value);
});
