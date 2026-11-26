import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const dictionary = JSON.parse(fs.readFileSync(new URL('src/locale/en.json', root), 'utf8'));

function execute(relative) {
  const filename = new URL(relative, root);
  const source = fs.readFileSync(filename, 'utf8');
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
  vm.runInNewContext(compiled.outputText, {
    exports,
    require(name) {
      assert.equal(name, './en.json');
      return dictionary;
    },
  }, { filename: filename.pathname });
  return exports;
}

const { displayKeys, localizePlmModel, translatePlmLabel } = execute('src/locale/model-locale.ts');
const plain = value => JSON.parse(JSON.stringify(value));

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function allObjects(value) {
  return value && typeof value === 'object'
    ? [value, ...Object.values(value).flatMap(allObjects)] : [];
}

function assertDisplayOnly(original, translated, inFields = false) {
  assert.deepEqual(Object.keys(translated), Object.keys(original));
  for (const [key, value] of Object.entries(original)) {
    if (Array.isArray(value)) {
      assert.equal(translated[key].length, value.length);
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          assertDisplayOnly(item, translated[key][index], key === 'appDEFields');
        } else assert.equal(translated[key][index], item);
      });
    } else if (value && typeof value === 'object') {
      assertDisplayOnly(value, translated[key]);
    } else if (typeof value === 'string' &&
      (displayKeys.has(key) || inFields && key === 'logicName')) {
      assert.equal(translated[key], translatePlmLabel(value, 'en'));
    } else {
      assert.equal(translated[key], value, `Non-display field changed: ${key}`);
    }
  }
}

function localized(relative) {
  const source = deepFreeze(execute(`src/publish/model/${relative}.ts`).default);
  const before = plain(source);
  const english = localizePlmModel(source, 'en-US');
  assertDisplayOnly(source, english);
  assert.deepEqual(plain(source), before);
  assert.deepEqual(plain(localizePlmModel(source, 'zh-CN')), before);
  return { source, english };
}

function assertActualText(relative, property, sourceText, expected) {
  const { source, english } = localized(relative);
  const paths = [];
  function visit(node, path = []) {
    if (!node || typeof node !== 'object') return;
    if (node[property] === sourceText) paths.push([...path, property]);
    for (const [key, value] of Object.entries(node)) visit(value, [...path, key]);
  }
  visit(source);
  assert.ok(paths.length > 0, `Expected actual ${property} in ${relative}: ${sourceText}`);
  for (const path of paths) {
    assert.equal(path.reduce((node, key) => node[key], english), expected);
  }
}

test('real deletion confirmations retain recoverable, irreversible and related-execution details', () => {
  for (const [entity, original, expected] of [
    ['work-item', '确认删除该工作项？（可在回收站恢复）',
      'Delete this work item? It can be restored from the recycle bin.'],
    ['idea-template', '确认删除选中模板吗？（无法恢复）',
      'Delete the selected templates? This cannot be undone.'],
    ['test-case',
      '删除测试用例会一起删除未完成测试计划内的执行用例，删除后如果想找回测试用例，可以通过测试库设置内的回收站进行恢复。',
      'Deleting test cases also deletes their executions in unfinished test plans. You can restore the test cases from the recycle bin in the test library settings.'],
  ]) assertActualText(`entities/${entity}`, 'confirmMsg', original, expected);
});

test('real baseline, sprint and relation actions keep their distinct lifecycle messages', () => {
  for (const [entity, property, original, expected] of [
    ['baseline', 'confirmMsg', '确认设立基线吗？', 'Establish this baseline?'],
    ['baseline', 'successMsg', '设立完成！', 'Baseline established'],
    ['sprint', 'confirmMsg', '确定开始该迭代？', 'Start this sprint?'],
    ['relation', 'confirmMsg', '确认取消关联？', 'Unlink this item?'],
    ['relation', 'successMsg', '取消依赖成功', 'Dependency removed'],
    ['work-item', 'confirmMsg', '确认从此迭代中移出？', 'Remove this item from the sprint?'],
    ['review-content', 'successMsg', '评审已完成', 'Review completed'],
  ]) assertActualText(`entities/${entity}`, property, original, expected);
});

test('actual execution form translates untested states, notes and save-next controls', () => {
  const { english } = localized('views/run-edit-view');
  const objects = allObjects(english);
  for (const [property, value] of [
    ['placeHolder', 'Not Yet Tested'],
    ['placeHolder', 'Not Yet Executed'],
    ['placeHolder', 'Add Execution Result Notes'],
    ['caption', 'Save and Next'],
  ]) assert.ok(objects.some(item => item[property] === value), `${property}: ${value}`);
  assertActualText('views/workload-list-view', 'emptyText',
    '当前内容未设置工时', 'No work hours have been set for this item');
});

test('real work-item conversion and test-planning choices translate labels without changing technical values', () => {
  const { source, english } = localized('entities/work-item-wizard-detail');
  for (const [original, expected] of [
    ['目标工作项状态', 'Target Work Item Status'],
    ['原工作项状态', 'Original Work Item Status'],
    ['原工作项类型', 'Original Work Item Type'],
    ['影响工作项数量', 'Affected Work Item Count'],
  ]) {
    const field = source.appDEFields.find(item => item.logicName === original);
    assert.ok(field, original);
    assert.equal(english.appDEFields.find(item => item.id === field.id).logicName, expected);
  }
  for (const [original, expected] of [
    ['选择关联项目', 'Select Linked Project'],
    ['选择关联迭代', 'Select Linked Sprint'],
    ['选择关联发布', 'Select Linked Release'],
    ['选择测试分类', 'Select Test Category'],
  ]) assertActualText('views/test-plan-quick-create-view', 'placeHolder', original, expected);
  assert.equal(dictionary['请选择重要程度'], `Select ${dictionary['重要程度']}`);
  assertActualText('views/test-case-set-level-option-view', 'placeHolder',
    '请选择重要程度', 'Select Importance');
  for (const name of [
    'test-case-person-distributions-report-view',
    'test-case-activities-status-report-view',
    'test-case-template-new-edit-view',
    'test-case-template-edit-view',
    'test-case-program-analyze-report-view',
    'test-case-case-type-report-view',
    'test-case-advanced-search-grid-pickview',
    'test-case-advanced-search-grid-view',
    'test-case-assessment-result-report-view',
    'test-case-quick-create-view',
  ]) {
    const { source, english } = localized(`views/${name}`);
    const controls = allObjects(source).filter(item =>
      item.editor?.placeHolder === '选择重要程度');
    assert.ok(controls.length > 0, name);
    for (const control of controls) {
      assert.equal(control.appDEFieldId, 'level');
      assert.equal(control.caption, '重要程度');
      assert.equal(control.editor.appCodeListId, 'plmweb.testmgmt__test_case_level');
    }
    assert.ok(allObjects(english).some(item =>
      item.editor?.placeHolder === 'Select Importance' && item.caption === 'Importance'));
  }
});

test('translated metadata does not rewrite arbitrary Unicode content or the original technical keys', () => {
  const content = '工作项 🙂 e\u0301 "quoted" \'single\' \\slash\nnext line';
  const source = deepFreeze({
    caption: '添加子工作项',
    confirmMsg: '确认取消关联？',
    id: '添加子工作项',
    codeName: '确认取消关联？',
    value: '尚未执行',
    path: '/work_items/保持原样',
    scriptCode: `return ${JSON.stringify(content)};`,
    description: content,
    data: { title_value: content },
  });
  const english = localizePlmModel(source, 'en-US');
  assert.equal(english.caption, 'Add Child Work Item');
  assert.equal(english.confirmMsg, 'Unlink this item?');
  for (const key of ['id', 'codeName', 'value', 'path', 'scriptCode', 'description']) {
    assert.equal(english[key], source[key]);
  }
  assert.deepEqual(plain(english.data), plain(source.data));
  assert.deepEqual(plain(localizePlmModel(source, 'zh-CN')), plain(source));
  assert.equal(localizePlmModel({ caption: content }, 'en').caption, content);
});
