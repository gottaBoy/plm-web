## 功能说明

### 默认模式

包括适配html数据格式、md数据格式，宽屏模式、大纲模式

编辑器参数：

| 属性名         | 描述                                           | 类型       | 默认值 |
| -------------- | ---------------------------------------------- | ---------- | ------ |
| WIDESCREENMODE | 是否默认宽屏模式，即富文本内容撑满富文本内容区 | boolean    | true   |
| SHOWWIDESCREEN | 是否显示宽屏切换图标                           | boolean    | false  |
| ENABLESHORTCUT | 是否显示快捷键指南                             | boolean    | false  |
| SHOWOUTLINE    | 是否默认显示大纲                               | boolean    | false  |
| TOOLBARALIGN   | 工具栏对齐模式                                 | left/right | left   |


数据格式：

vditor数据格式存在html格式与md格式，编辑器通过配置值项指定数据格式，如值项值为HTML，vditor按html格式抛值与解析数据，md同理

### 提及用户功能

参数格式：

> @{id,name}
>
> @{userid,name}

编辑器参数：

| 属性名       | 描述                             | 类型       | 默认值                                  |
| ------------ | -------------------------------- | ---------- | --------------------------------------- |
| USERURL      | 请求用户列表 url                 | string     |                                         |
| USERFIELDMAP | 用户属性映射表，用于转换用户数据 | Object     | {id: 'id', name:'name', title: 'title'} |
| USERMETHOD   | 请求用户数据方法                 | post / get | post                                    |


功能点：

+ 输入@时弹出用户列表
+ 支持 ac 过滤
+ 支持上下选择，回车选中
+ 气泡弹出框支持搜索
+ 兼容老富文本提及用户数据格式

逻辑链路：

+ 输入@时弹出用户列表
+ 选中用户列表项回填数据到富文本中
+ 富文本解析提及用户数据格式，并将其转换为html格式并绘制
+ 抛值时，根据当前富文本内容innerHTML反向转换为提及用户数据格式

```plain
<span contenteditable="false" class="mention" data-id="${id}">@${name}</span>
<=>
@{id,name} 
```

### 提及工作项

参数格式：

> #{id,name,identifier,owner_id,owner_type,owner_subtype,recent_parent}
>
> #{id,name,identifier,icon}

:::warning
老数据格式中存在icon字段，所以直接显示图标，目前的数据格式是根据owner_subtype字段在映射代码表中获取图标后再绘制

:::

:::warning
点击工作项跳转链接视图时，是根据owner_subtype字段跳转到重定向视图中，在重定向视图中再计算打开的链接视图，所以老数据格式是点击后不打开视图的

:::

| 属性名           | 描述                                           | 类型       | 默认值                                                       |
| ---------------- | ---------------------------------------------- | ---------- | ------------------------------------------------------------ |
| QUOTEURL         | 请求工作项列表 url                             | string     |                                                              |
| QUOTEFIELDMAP    | 工作项属性映射表，用于转换工作项数据           | Object     | {id: 'id', name:'name', identifier: 'show_identifier',owner_subtype: 'owner_subtype',owner_id: 'owner_id',owner_type: 'owner_type',recent_parent: 'recent_parent',} |
| QUOTEMETHOD      | 请求用户数据方法                               | post / get | post                                                         |
| QUOTEPARAMS      | 请求参数                                       | Object     |                                                              |
| QUOTECODELISTMAP | 工作项属性映射代码表，主要用于根据类型获取图标 | Object     |                                                              |
| LINKVIEWID       | 点击工作项调整的链接视图名称                   | string     |                                                              |


功能点：

+ 输入#时弹出工作项列表
+ 支持 ac 过滤
+ 支持上下选择，回车选中
+ 气泡弹出框支持搜索
+ 兼容老富文本提及工作项数据格式
+ 点击工作项打开LINKVIEWID视图，并将工作项数据传过去

逻辑链路：

+ 输入#时弹出用户列表
+ 选中工作项列表项回填数据到富文本中
+ 富文本解析提及工作项数据格式，并将其转换为html格式并绘制
+ 抛值时，根据当前富文本内容innerHTML反向转换为提及工作项数据格式

```plain
#{id,name,identifier,owner_id,owner_type,owner_subtype,recent_parent}
<=>
`<div class="${this.ns.e('marker')}">
  <div class="${this.ns.e('marker-icon')}">${icon}</div>
  <div class="${this.ns.e('marker-identifier')}">${
    item.identifier
  }</div>
  <div class="${this.ns.e('marker-name')}" title="${item.name}">${
    item.name
  }</div>
  </div>`
```

### AI询问

插件支持AI询问功能，在编辑器上配置自填模式，同时配置编辑器参数ac=true，且自填模式为AI聊天模式的情况下，评论工具栏会出现AI的图标，点击AI图标，会弹出AI聊天模态弹框，可以与AI进行对话，同时可根据对话情况选择是否将AI回答内容回填到评论框中

### 行内ai

在配置自填模式，且自填模式为AI聊天模式的情况下，选中文本会弹出行内ai工具栏，点击ai会弹出自填模式中的界面行为组，点击执行对应界面行为。

### 通用模板

在配置了自填模式后，在其界面行为组中添加一个用户标识为template的界面行为。工具栏中就会绘制一个通用模板图标，点击图标会执行对应界面行为。

### 折叠模式

在工作项描述中使用的可折叠、可全屏、默认只读的模式。

编辑器参数：

| 属性名           | 描述                                                         | 类型    | 默认值 |
| ---------------- | ------------------------------------------------------------ | ------- | ------ |
| enableEdit       | 是否启用编辑模式，为ture时默认只读，点击右上角编辑图标切换编辑模式 | boolean | false  |
| enableFullScreen | 是否启用全屏模式，启用时在右上角绘制全屏图标，点击全屏展开   | boolean | false  |
| MAXHEIGHT        | 富文本最大高度，超出最大高度出展开/收缩按钮                  | number  | 0      |


功能点：

+ 在初始化、数据保存时计算富文本内容高度，超出高度时绘制展开、收缩按钮
+ 编辑模式下取消编辑进行脏检查提示

### 评论模式

用于工作项中输入评论数据

功能点：

+ 支持用户输入富文本内容，数据格式为html格式，且与老格式兼容
+ 支持提及用户、提及工作项功能
+ 支持回复评论、编辑评论功能
+ 支持清空评论，且与wangeditor富文本时配置的脚本代码进行兼容

### 协同编辑功能

与wangeditor一样，使用yjs支持协同编辑功能，当多个用户编辑同一个页面富文本时，同步更改内容，并标注更改位置。

## vditor新增功能

### 字体颜色、背景颜色、字体大小

vditor富文本富文本解析引擎为lute，解析原理为将富文本解析为ast树，导致节点中携带的样式在解析转换后丢失。

插件实现逻辑为在转换前将样式替换为uuid，在lute解析转换后将uuid替换为原来的html富文本，这样html格式和md格式都可携带样式节点

### 工具栏更多模式

添加工具栏配置参数toolbarConfig.ellipsis，为true时在绘制工具栏时会按照工具栏列表计算总宽度，超出项整合到一个下拉更多项中

### 解除提及项弹框数量限制

原弹框数量超出7条后将不会绘制后续内容，现已解除该限制

### 提及项弹框添加搜索功能

在提及工作项、提及用户弹框中添加搜索框，搜索框可查询数据，同时保留原本上下选择、回车选中功能

### 多行操作功能

原加粗、斜体、列表等工具栏功能不支持选中多行时执行，现已支持该功能

### 图片工具栏

图片支持点击时弹出工具栏，可对图片宽度进行调整，也可直接删除图片

### 表格工具栏

在ir模式下，表格只有3*3选项，且无法调整行、列数量，现已在ir模式下支持表格工具栏

### 编辑模式兼容

vditor存在3中编辑模式，分别为即时渲染（ir）、所见即所得（wysiwyg）、分屏预览（sv）。这三种模式下都需支持提及用户、提及工作项、字体颜色、字体大小、背景颜色、图片宽度功能。

切换模式时不影响数据格式，同时正常回显

## 数据格式兼容

+ 硬换行

原html格式换行格式为`<p data-block="0"></p>`，在vditor转换时其删除，需在回显时将其替换为`<p data-block="0"><wbr></p>`。

+ 兼容图片格式

原html、md数据图片中可能存在图片宽度样式，需要在转换时提前宽度样式

+ 兼容标题样式
+ 兼容加粗
+ 兼容斜体
+ 兼容删除线
+ 兼容行内代码
+ 兼容代办列表
+ 兼容表格

## vditor打包流程

克隆项目：[https://github.com/Cano1997/vditor.git](https://github.com/Cano1997/vditor.git)  
在master分支下pnpm安装依赖后pnpm build打包，将dist文件夹拷贝到packages/html-vditor/public/vditor文件下

## 协同编辑

### 初始化参数

  ![initYJS](public/assets/images/inityjs.png)

  ```typescript
  vditor：Vditor实例，必传
  context: 上下文，必传
  params: 视图参数，必传
  roomName：房间名，必传
  editorId: 当前组件唯一UUID
  enableCursorSync：是否启用远程光标同步，也就是是否启用协同编辑
  userInfo:{
    // 当前用户标识，默认为实现上下文中的srfuserid
    id: string; 
    // 当前用户名称，默认为实现上下文中的srfusername
    name: string; 
    // 光标背景颜色，默认随机
    color: string;
  }
  ```
### 构建协同管理对象

  ![构建协同管理对象](public/assets/images/constructor.png)

- 首先创建一个YJS实例，并设置一个名称叫做"vditor-data" 的Map 类型的数据共享空间“collabAllData”，用来和远程进行同步，collabAllData包含两个键:
  - 一个是content,这个里面存的就是Vditor 的 HTML字符串；
  - 一个是user，值为一个对象数组，每一项都包含一个cursor:当前用户的光标数据，user:当前用户的其他数据（id,name）
  
- 观察collabAllData的变动，针对不同的字段变动采用不同的处理方式
  - content变化：更新编辑器的内容
  - user变化：重新绘制协同状态下各个协同者的光标位置等信息

  ```typescript
  private initYjsDoc(): void {
    // 创建 Yjs 文档
    this.yDoc = new Y.Doc();

    const collabAllData = this.yDoc.getMap('vditor-data');

    collabAllData.observe(event => {
      const changedKeys = event.changes.keys;
      // 按需处理不同字段的变更，实现精准响应
      this.handleCollabDataChange(changedKeys, collabAllData);
    });
  }
  ```
- 在YJS初始化完成后，需要对Vditor输入元素进行监听，用于后续数据变化后调用YJS进行数据同步

  ![绑定Vditor](public/assets/images/bindvditor.png)

### 初始化管理对象

- 调用协同管理器创建/获取房间

  ![createroom](public/assets/images/createroom.png)

- 在房间初始化完成后，需要房间链接提供者（connectionProvider）监听前后端链接完成状态，在链接完成之后针对后端返回的用户数据决定如何初始化数据
  - 如果存在别的用户，那么自己是后来者，将服务器端最新的数据覆盖掉本地的数据，保持协同数据一致
  - 如果不存在别的用户，那么自己是先手，将本地数据上传给服务器，并等待其他用户加入

  ![initdata](public/assets/images/initdata.png)

- 针对Vditor的变化，在值变化时将变化后的值给到YJS，也就是将最新的值存入collabAllData的content属性中，YJS会自动同步最新的值到远程其他客户端，在点击等操作时，将最新的数据存入user属性中，同步当前操作者的光标等状态信息到其他客户端
  - 编辑器值变化触发
  ![编辑器值变化触发](public/assets/images/editorchange.png)

  - YJS数据变化触发
  ![YJS数据变化触发](public/assets/images/yjschange.png)

- 同步数据到服务器使用的是请求，在服务器端同步数据到本地使用MQTT（这一块逻辑复用的是之前html-comment里面封装的逻辑）


## 基本使用

在具体项目中，先通过模型导入前端界面插件和编辑器插件，然后在具体的视图配置动态文本，然后将其编辑器类型改为 HTML 编辑框，编辑器类型选择“vditor编辑器”

## 附录

### 资料

官网：[https://b3log.org/vditor/demo/index.html](https://b3log.org/vditor/demo/index.html)

官网api: [https://ld246.com/article/1549638745630#methods](https://ld246.com/article/1549638745630#methods)

源码：[https://github1s.com/Vanessa219/vditor/blob/master/src/index.ts](https://github1s.com/Vanessa219/vditor/blob/master/src/index.ts)

lute源码： [https://github1s.com/88250/lute/tree/master](https://github1s.com/88250/lute/tree/master)

自定义渲染：[https://ld246.com/article/1588412297062/comment/1721802232269](https://ld246.com/article/1588412297062/comment/1721802232269)

markdown解析原理：[https://ld246.com/article/1587637426085](https://ld246.com/article/1587637426085)

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

```plain
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

