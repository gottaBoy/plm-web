import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn.js';

function extract(relative, name) {
  const source = readFileSync(new URL(relative, import.meta.url), 'utf8');
  const tree = ts.createSourceFile(relative, source, ts.ScriptTarget.Latest, true);
  let declaration;
  const visit = node => {
    if (ts.isVariableDeclaration(node) && node.name.getText(tree) === name) {
      declaration = `const ${name} = ${node.initializer.getText(tree)};`;
    }
    if (ts.isClassDeclaration(node) && node.name?.text === name) {
      declaration = node.getText(tree);
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  assert.ok(declaration, `${name} must be extracted from the actual plugin source`);
  return declaration;
}

test('resource gantt weekdays follow English variants and preserve Chinese labels', () => {
  const source = extract('../../plugin-src/@ibiz-template-plm/resource-gantt/src/index.ts', 'ke');
  let language = 'en-US';
  const context = { p: dayjs, ibiz: { i18n: { getLang: () => language } } };
  vm.runInNewContext(`${source}\nthis.format = ke;`, context);
  assert.equal(context.format('2026-11-02'), 'Mon');
  language = 'EN_gb';
  assert.equal(context.format('2026-11-03'), 'Tue');
  language = 'zh-CN';
  assert.equal(context.format('2026-11-02'), '星期一');
});

test('worklog table date generation localizes weekdays without changing dates or capacity flags', () => {
  const path = '../../plugin-src/@ibiz-template-plm/workload-table/src/index.ts';
  const source = `${extract(path, 'Mn')}\n${extract(path, 'Q')}`;
  let language = 'en';
  const context = { v: dayjs, ibiz: { i18n: { getLang: () => language } } };
  vm.runInNewContext(`${source}\nthis.calcDate = Q.calcDate.bind(Q);`, context);
  const english = context.calcDate('2026-11-01', '2026-11-02');
  assert.equal(english[0].week, 'Sun');
  assert.equal(english[0].isWeekend, true);
  assert.equal(english[1].week, 'Mon');
  assert.equal(english[1].date, '2026-11-02');
  language = 'zh-CN';
  assert.equal(context.calcDate('2026-11-02', '2026-11-02')[0].week, '周一');
});
