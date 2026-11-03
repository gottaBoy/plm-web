import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

test('embedded modeling URL conveys the selected language without changing model routes or query parameters', () => {
  const source = readFileSync(new URL('../../src/publish/model/modeling-url.ts', import.meta.url), 'utf8');
  const exports = {};
  const document = { documentElement: { lang: 'en-US' } };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, {
    exports, URL, document,
    Environment: { modelingWebUrl: 'http://127.0.0.1:32009/modeldesign/?existing=1#/psdevslnsys=real/modelingindex/-' },
  });
  const target = new URL(exports.getModelingWebUrl('entity'));
  assert.equal(target.searchParams.get('language'), 'en');
  assert.equal(target.searchParams.get('existing'), '1');
  assert.equal(target.hash, '#/psdevslnsys=real/modelingindex/-/entity');
  document.documentElement.lang = 'zh-CN';
  assert.equal(new URL(exports.getModelingWebUrl()).searchParams.get('language'), 'zh-CN');
});
