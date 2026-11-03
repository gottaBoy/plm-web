import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, require) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, { exports, require });
  return exports;
}
const dictionary = JSON.parse(readFileSync(new URL('../../src/locale/en.json', import.meta.url)));
const locale = load('../../src/locale/model-locale.ts', () => dictionary);
const { installPlmCodeListLocale } = load('../../src/locale/codelist-locale.ts', () => locale);

test('main-state options translate only exact configured labels without mutating cached data or transition restrictions', async () => {
  const items = Object.freeze([
    Object.freeze({ value: '10', text: '打开', disableSelect: false, color: 'green' }),
    Object.freeze({ value: '40', text: '已完成', disableSelect: true }),
    Object.freeze({ value: '50', text: 'User-defined status', disableSelect: true }),
    Object.freeze({ value: '999', text: '打开', disableSelect: false }),
  ]);
  const args = ['state', { user: 'real' }, { state: '10' }];
  let language = 'en';
  const service = {
    setCodeList(model) { assert.equal(this, service); this.model = model; },
    async get(...actual) {
      assert.equal(this, service);
      assert.deepEqual(actual, args);
      return items;
    },
  };
  installPlmCodeListLocale(service, () => language);
  const installed = service.get;
  installPlmCodeListLocale(service, () => language);
  assert.equal(service.get, installed);
  service.setCodeList({
    id: 'state', codeName: 'states', codeListType: 'DYNAMIC', predefinedType: 'DEMAINSTATE',
    codeItems: [{ value: '10', text: 'Open' }, { value: '40', text: 'Completed' },
      { value: '50', text: 'On Hold' }],
  });
  const translated = await service.get(...args);
  assert.equal(translated[0].text, 'Open');
  assert.equal(translated[0].color, 'green');
  assert.equal(translated[1].text, 'Completed');
  assert.equal(translated[1].disableSelect, true);
  assert.equal(translated[2], items[2]);
  assert.equal(translated[3], items[3]);
  assert.equal(items[0].text, '打开');
  language = 'zh-CN';
  assert.equal(await service.get(...args), items);
  service.setCodeList({ id: 'state', codeListType: 'DYNAMIC', codeItems: [] });
  language = 'en';
  assert.equal(await service.get(...args), items);
});

test('code-list lookup failures propagate instead of becoming empty success', async () => {
  const service = { setCodeList() {}, async get() { throw new Error('Unauthorized'); } };
  installPlmCodeListLocale(service, () => 'en');
  await assert.rejects(service.get('SysOperator'), /Unauthorized/);
});
