# 关注

该插件基于数据选择（下拉）增强，主要用于在所有人员中或登录者所在部门之中选择关注人，当前登录者能够自定义自己的关注状态。**该插件隶属于编辑器自定义绘制插件（基于数据选择（下拉）进行扩展）**


## 页面展示

![image](./public/assets/images/scene.png)


## 功能说明

### 默认支持能力
  - 关注人员超出后，超出范围会隐藏并显示 ...
  - 默认支持OBJECTS数据

### 可配置自定义请求，请求部门及人员

### 支持人员及部门的UI转化（指定自定义请求返回的数据主键及主信息，用于界面显示及抛值）

### 关注状态展示
  - 通过代码表配置关注状态，在插件中解析对应的代码表，此时需要代码表标识
  - 关注状态分为关注及不关注，该插件中根据对应状态处理成不同的样式
  - 支持选中后默认关注值，当用户选择人员后，会将默认关注值合并到选中的人员数据返回服务端

### 自定义抛值
  - 通过自填充映射将选中的关注人转为服务端存储需要的数据，解析时通过自填充映射回显
  - 指定抛值类型

### 只读识别

### 头像文件识别应用启用下载授权
- 在应用启用下载授权时，会以编辑器参数 userauthentity 与 deptauthentity 指定头像文件所关联的所属实体，同时将DEPTMAP、USERMAP中的id映射属性作为当前文件所关联的数据属性。上述实体与属性信息，将作为验证用户是否具备该头像文件下载权限的核心依据


## 输入参数

### 编辑器参数

| 参数            | 类型          | 默认值  | 说明                                                         |
| --------------- | ------------ | ------- | ------------------------------------------------------------ |
| URL             | string       | --      | 人员数据的请求URL，可通过配置${context.xxx}或者${data.xxx}来动态更新URL<br />示例：URL=projects/${context.project}/project_members/fetchdefault |
| DEPTURL         | string       | --      | 部门数据的请求URL，可通过配置${context.xxx}或者${data.xxx}来动态更新URL<br />示例：DEPTURL=/users/fetchdefault |
| SRFNAVPARAM     |              | --      | 支持配置导航参数，导航参数解析后会在人员或者部门请求时被携带上 |
| SRFNAVCTX       |              | --      | 支持配置导航上下文，导航上下文解析后会在人员或者部门的请求Url上进行匹配替换 |
| DEPTMAP         | IUserMap     | `` {"id":"id","name":"name","title":"title"} `` | 允许JSON数组对象字符串的方式，自定义部门人员的id（主键）、name（名称）、title（职称）、avatar（头像文件）的映射字段。<br />配置示例：DEPTMAP={"id":"user_id","name":"user_name","title":"_title","avatar":"icon"}|
| USERMAP         | IUserMap     | `` {"id":"id","name":"name","title":"title"} `` | 允许JSON数组对象字符串的方式，自定义人员的id（主键）、name（名称）、title（职称）、avatar（头像文件）的映射字段。<br />配置示例：USERMAP={"id":"user_id","name":"user_name","title":"_title","avatar":"icon"} |
| USERMETHOD      | post\| get   | post    | 人员请求接口的请求方式          |
| DEPTMETHOD      | post\| get   | get     | 部门请求接口的请求方式          |
| CODELISTID      | string       | --      | 代码表模板解析出来的代码表codeName <br />示例：Base__Attention_type |
| CODELISTMAP     | ICodeListMap | --      | 代码表值与关注类型的映射，定义属于不关注的代码表值及属于关注的代码表值集合。 |
| DEFAULTATNVALUE | string       | --      | 在人员或部门中选中当前登录者时，指定默认的关注类型。|
| SELFFILLMAP     | ISelfFillMap | `` {"user_id":"user_id","user_name":"name"} `` | 允许自定义关注人的【user_id】和【user_name】的映射字段，如果未配置，则会直接使用【user_id】和【name |
| VALUETYPE       | string       | OBJECTS | 值类型 |
| userauthentity | string | --- | 人员头像文件权限归属实体 |
| deptauthentity | string | --- | 部门头像文件权限归属实体 |

### IUserMap（部门人员UI转化）

| 参数           | 类型          | 默认值  | 说明                       |
| -------------- | ------------ | ------- | --------------------------- |
| id             | string       | id      | 主键，用于回显及服务端后续逻辑处理 |
| name           | string       | name    | 主信息，用于界面显示 |

### ICodeListMap（代码表值映射）

| 参数           | 类型          | 默认值  | 说明                       |
| -------------- | ------------ | ------- | --------------------------- |
| FOLLOWED       | number[]     | --      | 关注，用于放置代码表关注相关的状态值 |
| NOTFOLLOWING   | number[]     | --      | 不关注，用于放置代码表不关注相关的状态值 |

### ISelfFillMap（自填充映射）

| 参数           | 类型          | 默认值  | 说明                       |
| -------------- | ------------ | ------- | --------------------------- |
| user_id        | string       | user_id | 主键，用于抛值及回显 |
| user_name      | string       | name    | 主信息，用于界面显示 |

注：如果只想只读展示，需要在编辑器参数中设置readonly=true， 如果允许进行编辑，需要配置对应的值项。


## 配置示例

### 配置自定义请求，请求部门及人员
  - 人员请求方式
  ```
  USERMETHOD=post
  ```
  - 部门请求方式
  ```
  DEPTMETHOD=get
  ```
  - 人员数据的请求URL
  ```
  URL=projects/${context.project}/project_members/fetchdefault
  ```
  - 部门数据的请求URL
  ```
  DEPTURL=/users/fetch_default
  ```
  - 导航参数配置
  ```
  SRFNAVPARAM.n_department_id_eq=%srforgsectorid%
  ```
### 配置支持人员及部门的UI转化（指定自定义请求返回的数据主键及主信息，用于界面显示及抛值）
  - 人员转化
  ```
  USERMAP={"id":"user_id","name":"name"}
  ```
  - 部门转化
  ```
  DEPTMAP={"id":"id","name":"display_name"}
  ```
### 配置关注状态展示
  - 通过代码表配置关注状态，在插件中解析对应的代码表，此时需要代码表标识，配置如下：
  ```
  CODELISTID=Base__Attention_type
  ```
  - 关注状态分为关注及不关注，该插件中根据对应状态处理成不同的样式
  ```
  CODELISTMAP={"FOLLOWED":[20,30,40],"NOTFOLLOWING":[10]}
  ```
  - 支持选中后默认关注值，当用户选择人员后，会将默认关注值合并到选中的人员数据返回服务端
  ```
  DEFAULTATNVALUE=40
  ```
### 配置自定义抛值
  - 通过自填充映射将选中的关注人转为服务端存储需要的数据，解析时通过自填充映射回显
  ```
  SELFFILLMAP={"user_id":"user_id","user_name":"name"}
  ```
  - 指定抛值类型
  ```
  VALUETYPE=OBJECTS
  ```
### 配置只读识别
  ```
  readonly=true
  ```


## 附录

### 关注插件

```json
[
  {
    "plugintype": "EDITOR_CUSTOMSTYLE",
    "rtobjectrepo": "@ibiz-template-plm/attention@0.0.3-alpha.256",
    "codename": "UsrPFPlugin0222550318",
    "plugintag": "ATTENTION",
    "rtobjectmode": 2,
    "rtobjectname": "IBizAttention",
    "pssyspfpluginname": "关注"
  }
]
```

### 编辑器样式

```json
[
  {
    "codename": "ATTENTION_PROJECT",
    "pssyspfpluginid": "UsrPFPlugin0222550318",
    "repdefault": 0,
    "validflag": 1,
    "pssyseditorstylename": "关注（项目）",
    "ctrlparams": "URL=projects/${context.project}/project_members/fetch_default\nDEPTURL=/users/fetch_default\nSRFNAVPARAM.n_department_id_eq=%srforgsectorid%\nUSERMAP={\"id\":\"user_id\",\"name\":\"name\"}\nDEPTMAP={\"id\":\"id\",\"name\":\"display_name\"}\nUSERMETHOD=post\nDEPTMETHOD=get\nCODELISTID=Base__attention_type\nCODELISTMAP={\"FOLLOWED\":[20,30,40],\"NOTFOLLOWING\":[10]}\nDEFAULTATNVALUE=40\nSELFFILLMAP={\"user_id\":\"user_id\",\"user_name\":\"name\"}",
    "pseditortypeid": "PICKEREX_TRIGGER"
  }
]
```