import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const dictionary = JSON.parse(readFileSync(new URL('src/locale/en.json', root)));
const source = readFileSync(new URL('src/locale/model-locale.ts', root), 'utf8');
const exports = {};
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
    esModuleInterop: true },
}).outputText, {
  exports, require(name) {
    assert.equal(name, './en.json');
    return dictionary;
  },
});
const { normalizePlmLanguage, localizePlmModel, addPlmLanguageControl, translatePlmLabel } = exports;

test('language variants normalize to the two supported languages', () => {
  for (const lang of ['en', 'en-US', 'EN_gb']) assert.equal(normalizePlmLanguage(lang), 'en');
  for (const lang of ['zh-CN', 'zh', undefined, '', 'unknown']) {
    assert.equal(normalizePlmLanguage(lang), 'zh-CN');
  }
});

test('unknown labels never resolve to inherited dictionary properties', () => {
  for (const value of ['constructor', 'toString', '__proto__', 'hasOwnProperty']) {
    assert.equal(translatePlmLabel(value, 'en'), value);
  }
});

test('model translation preserves IDs, behavior, markup and unknown labels without mutating source', () => {
  const original = {
    id: '工作台', codeName: '工作台', caption: '工作台', title: '首页',
    controls: [{ caption: '新建', tooltip: '刷新', nextCaption: '下一步',
      ruleInfo: '请填写产品名称', codeItems: [{ text: '打开', value: '打开' }] }],
    scriptCode: 'return "工作台";', html: '<span>工作台</span>',
    data: '{"caption":"工作台"}', unknown: { caption: '用户自定义标题' },
  };
  const before = structuredClone(original);
  const result = localizePlmModel(original, 'en-US');
  assert.equal(result.id, '工作台');
  assert.equal(result.codeName, '工作台');
  assert.equal(result.caption, 'Workspace');
  assert.equal(result.title, 'Home');
  assert.equal(result.controls[0].caption, 'New');
  assert.equal(result.controls[0].nextCaption, 'Next');
  assert.equal(result.controls[0].ruleInfo, 'Enter a product name');
  assert.equal(result.controls[0].codeItems[0].text, 'Open');
  assert.equal(result.controls[0].codeItems[0].value, '打开');
  assert.equal(result.scriptCode, original.scriptCode);
  assert.equal(result.html, original.html);
  assert.equal(result.data, original.data);
  assert.equal(result.unknown.caption, '用户自定义标题');
  assert.deepEqual(original, before);
  result.controls[0].caption = 'Changed';
  assert.equal(original.controls[0].caption, '新建');
  assert.equal(localizePlmModel(original, 'zh-CN').caption, '工作台');
});

test('entity field display names translate for quick search without changing logical behavior names', () => {
  const source = {
    logicName: '项目名称',
    appDEFields: [{ id: 'name', codeName: 'name', name: 'NAME', logicName: '项目名称' },
      { id: 'identifier', logicName: '项目标识' }],
    appDELogics: [{ id: 'logic', logicName: '项目名称' }],
    quickSearchAppDEFieldIds: ['identifier', 'name'],
  };
  const translated = localizePlmModel(source, 'en');
  assert.equal(translated.appDEFields[0].logicName, 'Project Name');
  assert.equal(translated.appDEFields[1].logicName, 'Project Identifier');
  assert.equal(translated.appDEFields[0].id, 'name');
  assert.equal(translated.appDEFields[0].name, 'NAME');
  assert.equal(translated.logicName, '项目名称');
  assert.equal(translated.appDELogics[0].logicName, '项目名称');
  assert.equal(JSON.stringify(translated.quickSearchAppDEFieldIds), '["identifier","name"]');
  assert.equal(source.appDEFields[0].logicName, '项目名称');
});

test('each primary navigation and workspace label has an explicit English translation', () => {
  for (const label of ['工作台', '产品管理', '项目管理', '测试管理', '知识管理',
    '效能度量', '协作空间', '资源管理', '自动化', '智能协同', '应用市场', '二次开发',
    '首页', '仪表盘', '工时', '概览', '最近使用', '最近访问', '登录', '记住我']) {
    assert.ok(dictionary[label], label);
    assert.doesNotMatch(dictionary[label], /[\u4e00-\u9fff]/);
  }
});

test('common business and configuration commands have explicit, nonempty English labels', () => {
  for (const label of ['关联', '取消关联', '负责人标识', '选择负责人', '父工作项',
    '产品需求', '工作项类型分组', '新建类别', '关注人', '需求类型', '版本',
    '选择优先级', '查看明细', '已规划基线', '查看版本', '维护人',
    '需求来源', '选择开始时间', '选择结束时间', '执行人', '严重程度',
    '评审结果', '总登记工时', '发现', '安装', '卸载', '查看版本清单',
    '安装特定版本', '角色配置', '工时设置', '实体打印', '新建模版']) {
    assert.ok(dictionary[label]?.trim(), label);
    assert.doesNotMatch(dictionary[label], /[\u4e00-\u9fff]/);
  }
});

test('language control is inserted once without replacing existing profile or login controls', () => {
  for (const [codeName, anchor] of [['app_index_view', 'auth_userinfo'],
    ['apploginview', 'container_4']]) {
    const model = { codeName, viewLayoutPanel: { rootPanelItems: [{
      id: 'parent', panelItems: [{ id: anchor }, { id: 'next' }],
    }] } };
    addPlmLanguageControl(model);
    addPlmLanguageControl(model);
    const items = model.viewLayoutPanel.rootPanelItems[0].panelItems;
    assert.deepEqual(Array.from(items, item => item.id), [anchor, 'plm_language_switch', 'next']);
    assert.equal(items[1].rawItem.predefinedType, 'PLM_LANGUAGE_SWITCH');
  }
});

test('static model loader localizes metadata and does not patch browser DOM text', () => {
  const loader = readFileSync(new URL('src/model/model-loader.ts', root), 'utf8');
  assert.match(loader, /addPlmLanguageControl\(dsl\)/);
  assert.match(loader, /localizePlmModel\(viewModel, ibiz\.i18n\.getLang\(\)\)/);
  const component = readFileSync(new URL(
    'src/components/language-switch/language-switch.tsx', root), 'utf8');
  assert.match(component, /ibiz\.i18n\.setLang\(value\)/);
  assert.doesNotMatch(component, /switchTheme|innerHTML|textContent\s*=/);
  const install = readFileSync(new URL('src/components/index.ts', root), 'utf8');
  assert.match(install, /dayjs\.locale\(language === 'en' \? 'en' : 'zh-cn'\)/);
  assert.match(install, /locale: language === 'en' \? elementEnglish : elementChinese/);
});
