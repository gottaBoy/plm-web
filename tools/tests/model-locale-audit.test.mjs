import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { auditModelLocale, collectModelLabels } from '../audit-model-locale.mjs';

const keys = new Set(['caption', 'text', 'placeholder']);

test('locale audit parses literal display properties without scanning scripts, IDs or comments', () => {
  const labels = collectModelLabels('fixture.ts', `
    // caption: '注释'
    export default {
      caption: '工作台', name: '标识', scriptCode: "caption: '脚本'",
      nested: { 'text': '新建', placeholder: \`输入标题\` },
      title: '未纳入的属性', captionExpression: \`动态\${name}\`,
    };
  `, keys);
  assert.deepEqual(labels.map(item => item.value), ['工作台', '新建', '输入标题']);
  assert.equal(labels[0].line, 4);
  assert.throws(() => collectModelLabels('broken.ts', 'export default {', keys),
    /Cannot parse model/);
});

test('locale audit includes entity field logic names but not entity logic behavior names', () => {
  const labels = collectModelLabels('fields.ts', `export default {
    logicName: '实体逻辑名',
    appDEFields: [{ logicName: '项目名称', id: 'name' }],
    appDELogics: [{ logicName: '行为名称' }],
  };`, keys);
  assert.deepEqual(labels.map(item => item.value), ['项目名称']);
});

test('locale audit counts duplicates, rejects inherited/empty/CJK entries and preserves missing labels', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'plm-locale-audit-'));
  try {
    mkdirSync(path.join(directory, 'views'));
    writeFileSync(path.join(directory, 'app.ts'),
      `export default { caption: '工作台', text: '新建', nested: { text: '新建' } };`);
    writeFileSync(path.join(directory, 'views/a.ts'),
      `export default { caption: '自定义', text: '空白', placeholder: '未翻译' };`);
    writeFileSync(path.join(directory, 'ignored.json'), '{}');
    const dictionary = Object.assign(Object.create({ 自定义: 'Inherited' }), {
      工作台: 'Workspace', 新建: 'New', 空白: ' ', 未翻译: '仍然中文',
    });
    const report = auditModelLocale(directory, dictionary, keys);
    assert.equal(report.files, 2);
    assert.equal(report.occurrences, 6);
    assert.equal(report.translatedOccurrences, 3);
    assert.equal(report.uniqueLabels, 5);
    assert.equal(report.translatedUniqueLabels, 2);
    assert.deepEqual(new Set(report.untranslated.map(item => item.value)),
      new Set(['自定义', '空白', '未翻译']));
    assert.ok(report.untranslated.every(item => item.firstPath === path.join('views', 'a.ts')));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
