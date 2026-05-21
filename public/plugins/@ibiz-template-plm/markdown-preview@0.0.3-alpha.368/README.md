# vditor富文本

## 功能说明

### 提及用户功能

| 属性名       | 描述                             | 类型       | 默认值                                 |
| ------------ | -------------------------------- | ---------- | -------------------------------------- |
| USERURL      | 请求用户列表 url                 | string     |                                        |
| USERFIELDMAP | 用户属性映射表，用于转换用户数据 | Object     | {id: 'id', name:'name', title: 'title'}                |
| USERMETHOD   | 请求用户数据方法                 | post / get | post                                   |

- 输入@单时弹出用户列表
- 支持 ac 过滤
- 支持上下选择，回车选中

### 提及工作项

| 属性名        | 描述                                 | 类型       | 默认值                                                                              |
| ------------- | ------------------------------------ | ---------- | ----------------------------------------------------------------------------------- |
| QUOTEURL      | 请求工作项列表 url                   | string     |                                                                                     |
| QUOTEFIELDMAP | 工作项属性映射表，用于转换工作项数据 | Object     | {id: 'id', name:'name', identifier: 'show_identifier',owner_subtype: 'owner_subtype',owner_id: 'owner_id',owner_type: 'owner_type',recent_parent: 'recent_parent',}                                                             |
| QUOTEMETHOD   | 请求用户数据方法                     | post / get | post                                                                                |
| QUOTEPARAMS   | 请求参数                             | Object     |                                                                                     |

- 输入#时弹出工作项列表
- 支持 ac 过滤
- 支持上下选择，回车选中

### AI询问

插件支持AI询问功能，在配置自填模式，且自填模式为AI聊天模式的情况下，评论工具栏会出现AI的图标，点击IA图标，会弹出AI聊天模态，可以与AI进行对话，同时可根据对话情况选择是否将AI回答内容回填到评论框中

### 行内ai

在配置自填模式，且自填模式为AI聊天模式的情况下，选中文本会弹出行内ai工具栏，点击ai会弹出自填模式中的界面行为组，点击执行对应界面行为。

## 逻辑节点

### 硬换行

原html格式换行格式为`<p data-block="0"></p>`，在vditor转换时其删除，需在回显时将其替换为`<p data-block="0"><wbr></p>`。

### 标题兼容

原html标题格式为`<h1>标题</h1>`，在vditor中需在回显时将其替换为`<h1 data-marker="#"><span class="vditor-ir__marker vditor-ir__marker--heading" data-type="heading-marker">#</span>标题</h1>`

## vditor打包流程

克隆项目：https://github.com/Cano1997/vditor.git
在master分支下pnpm安装依赖后pnpm build打包，将dist文件夹拷贝到packages/html-vditor/public/vditor文件下

## 基本使用

在具体项目中，先通过模型导入前端界面插件和编辑器插件，然后在具体的视图配置动态文本，然后将其编辑器类型改为 HTML 编辑框，编辑器类型选择“vditor编辑器”

## 附录

### 资料

[vditor](https://ld246.com/article/1549638745630)

### 编辑器插件

```json
[
  {
    "codename": "VDITOR",
    "pssyspfpluginid": "Ad59c857a1452e6f32e",
    "repdefault": 0,
    "validflag": 1,
    "pssyseditorstylename": "vditor编辑器",
    "pseditortypeid": "HTMLEDITOR"
  }
]
```

### 前端界面插件

```
[
  {
    "plugintype": "EDITOR_CUSTOMSTYLE",
    "rtobjectrepo": "@ibiz-template-plm/html-vditor@0.0.3-alpha.313",
    "codename": "Ad59c857a1452e6f32e",
    "plugintag": "VDITOR",
    "rtobjectmode": 2,
    "rtobjectname": "Vditor",
    "pssyspfpluginname": "vditor编辑器"
  }
]
```