import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const dictionary = JSON.parse(fs.readFileSync(new URL('src/locale/en.json', root), 'utf8'));
const plain = value => JSON.parse(JSON.stringify(value));

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
function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
function objects(value) {
  return value && typeof value === 'object'
    ? [value, ...Object.values(value).flatMap(objects)] : [];
}
function unchangedBehavior(source, translated, inFields = false) {
  assert.deepEqual(Object.keys(translated), Object.keys(source));
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      assert.equal(translated[key].length, value.length);
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          unchangedBehavior(item, translated[key][index], key === 'appDEFields');
        } else assert.equal(translated[key][index], item);
      });
    } else if (value && typeof value === 'object') {
      unchangedBehavior(value, translated[key]);
    } else {
      const expected = typeof value === 'string' &&
        (displayKeys.has(key) || inFields && key === 'logicName')
        ? translatePlmLabel(value, 'en') : value;
      assert.equal(translated[key], expected, `Unexpected change to ${key}`);
    }
  }
}
function models(relative) {
  const source = freeze(execute(`src/publish/model/${relative}.ts`).default);
  const before = plain(source);
  const english = localizePlmModel(source, 'en-US');
  unchangedBehavior(source, english);
  assert.deepEqual(plain(source), before);
  assert.deepEqual(plain(localizePlmModel(source, 'zh-CN')), before);
  return { source, english };
}
function actualText(relative, property, original, expected) {
  const { source, english } = models(relative);
  const paths = [];
  function visit(value, path = []) {
    if (!value || typeof value !== 'object') return;
    if (value[property] === original) paths.push([...path, property]);
    for (const [key, item] of Object.entries(value)) visit(item, [...path, key]);
  }
  visit(source);
  assert.ok(paths.length > 0, `Missing actual ${original} in ${relative}`);
  for (const path of paths) assert.equal(path.reduce((value, key) => value[key], english), expected);
}

test('actual sprint, release, library and report navigation changes labels while retaining its targets', () => {
  for (const [view, original, expected] of [
    ['sprint-pick-up-around-view', '全部迭代', 'All Sprints'],
    ['release-pick-up-around-view', '全部发布', 'All Releases'],
    ['library-details-setting-tree-exp-view', '用例模板', 'Test Case Templates'],
    ['library-details-setting-tree-exp-view', '测试库组件', 'Test Library Components'],
    ['insight-kanban-tree-exp-view', '需求报表', 'Requirement Reports'],
    ['insight-kanban-tree-exp-view', '缺陷报表', 'Bug Reports'],
    ['insight-kanban-tree-exp-view', '看板报表', 'Kanban Reports'],
    ['insight-view-config-tree-exp-view', '视图管理', 'View Management'],
    ['insight-view-config-tree-exp-view', '仪表盘模板管理', 'Dashboard Template Management'],
    ['space-config-tree-exp-view', '空间分类', 'Space Categories'],
  ]) actualText(`views/${view}`, 'text', original, expected);
});

test('review and uncategorized-case labels do not imply completed reviews or invent a module', () => {
  const { source, english } = models('views/review-idea-tree-exp-view');
  const mine = objects(source).find(item => item.text === '我评审的');
  assert.ok(mine);
  assert.equal(mine.navigateParams.find(item => item.key === 'n_stage_like').value, 'srfuserid');
  const translated = objects(english).find(item => item.id === mine.id && item.treeNodeType === 'STATIC');
  assert.equal(translated.text, 'My Reviews');
  assert.deepEqual(plain(translated.navigateParams), plain(mine.navigateParams));
  const cases = models('views/test-case-baseline-mpick-up-view');
  const noModule = objects(cases.source).find(item => item.text === '无用例模块');
  assert.ok(noModule);
  assert.equal(noModule.navigateParams.find(item => item.key === 'n_suite_id_isnull').value, '1');
  const localized = objects(cases.english).find(item => item.id === noModule.id && item.treeNodeType === 'STATIC');
  assert.equal(localized.text, 'Test Cases Without a Module');
  assert.deepEqual(plain(localized.navigateParams), plain(noModule.navigateParams));
});

test('pending, processed and closed navigation keeps three different native views', () => {
  const { english } = models('views/sys-todo-todo-tree-exp-view');
  for (const [label, target] of [
    ['Pending Items', 'plmweb.sys_todo_todo_grid_view'],
    ['Processed Items', 'plmweb.sys_todo_done_grid_view'],
    ['Closed Items', 'plmweb.sys_todo_finish_grid_view'],
  ]) {
    const node = objects(english).find(item => item.text === label && item.treeNodeType === 'STATIC');
    assert.ok(node, label);
    assert.equal(node.navAppViewId, target);
  }
});

test('actual empty states localize while dynamic code-list and agent record bindings remain intact', () => {
  for (const [model, original, expected] of [
    ['code-list/extension-de-logic-node-type-3', '无匹配节点', 'No Matching Nodes'],
    ['code-list/extension-extension-status', '(非扩展模型)', '(Not an Extension Model)'],
    ['code-list/proj-mgmt-cur-sprint', '未分配迭代工作项', 'Work Items Without a Sprint'],
    ['views/ai-agent-assignment-selector', '暂未绑定智能体', 'No agent linked'],
  ]) actualText(model, 'emptyText', original, expected);
  const { source, english } = models('code-list/proj-mgmt-cur-sprint');
  assert.equal(source.codeListType, 'DYNAMIC');
  assert.equal(english.appDEDataSetId, source.appDEDataSetId);
  assert.equal(english.appDataEntityId, 'plmweb.sprint');
  assert.equal(english.textAppDEFieldId, source.textAppDEFieldId);
  assert.equal(english.valueAppDEFieldId, source.valueAppDEFieldId);
});

test('actual ticket, requirement, topic and page messages retain specific lifecycle and recovery meanings', () => {
  for (const [entity, property, original, expected] of [
    ['ticket', 'confirmMsg', '确定归档该工单吗？', 'Archive this ticket?'],
    ['ticket', 'confirmMsg', '确定恢复所选工单吗？', 'Restore the selected tickets?'],
    ['ticket', 'confirmMsg', '确认删除该工单？（可在回收站恢复）',
      'Delete this ticket? It can be restored from the recycle bin.'],
    ['idea', 'confirmMsg', '确认归档选中需求吗？', 'Archive the selected requirements?'],
    ['idea', 'successMsg', '成功取消关联', 'Unlinked successfully'],
    ['discuss-topic', 'confirmMsg', '确认归档该话题？', 'Archive this topic?'],
    ['discuss-reply', 'confirmMsg', '确认删除此回复？', 'Delete this reply?'],
    ['shared-space', 'confirmMsg', '确认关闭共享？', 'Disable sharing?'],
    ['article-page', 'confirmMsg', '确定删除该页面吗？', 'Delete this page?'],
    ['run', 'confirmMsg', '确认移出该执行用例？', 'Remove this test execution?'],
  ]) actualText(`entities/${entity}`, property, original, expected);
});

test('business-authored labels and Unicode data are not replaced by navigation translations', () => {
  const value = '自定义空间 🙂 e\u0301 "引号" \'单引号\' \\路径\n下一行';
  const source = freeze({
    text: '全部讨论',
    emptyText: '暂未绑定智能体',
    name: '全部讨论',
    id: '全部讨论',
    value: '我评审的',
    description: value,
    scriptCode: `return ${JSON.stringify(value)};`,
    records: [{ user_title: value, state: '待处理事项' }],
  });
  const result = localizePlmModel(source, 'en');
  assert.equal(result.text, 'All Discussions');
  assert.equal(result.emptyText, 'No agent linked');
  for (const key of ['name', 'id', 'value', 'description', 'scriptCode']) {
    assert.equal(result[key], source[key]);
  }
  assert.deepEqual(plain(result.records), plain(source.records));
  assert.deepEqual(plain(localizePlmModel(source, 'zh-CN')), plain(source));
  assert.equal(localizePlmModel({ caption: value }, 'en').caption, value);
});
