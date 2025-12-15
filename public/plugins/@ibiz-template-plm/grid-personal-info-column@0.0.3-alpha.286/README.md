# 表格列人员信息

该插件基于表格列增强，主要适配属性列显示人员头像。**该插件隶属于数据表格列绘制插件（基于属性列进行扩展）**


## 页面展示

![image](./public/assets/images/scene.png)


## 功能说明

- 显示人员头像

- 可配置属性识别后台返回数据


## 输入参数

| 属性           | 类型           | 默认值                                          | 说明                                        |
| -------------- | -------------- | ---------------------------------------------- | ------------------------------------------ |
| userFilterMap  | IUserFilterMap | { id: 'assignee_id', name: 'assignee_name' }    | 人员UI转化, 根据配置的映射值获取返回的人员数据 |
| datasource  | `'ROWFIELD' \| 'ROWDATA'` | 'ROWFIELD'    | 数据来源模式：'ROWFIELD'，从当前表格列的属性值中获取数据；'ROWDATA'，从当前表格行数据中获取数据 |
| placeholder  | string | '---'    | 无人员信息时显示的占位文本 |

### IUserFilterMap

| 属性           | 类型           | 默认值          | 说明              |
| -------------- | -------------- | -------------- | ---------------- |
| id             | string         | assignee_id    | 人员主键属性名称 |
| name          | string          | assignee_name  | 人员主文本属性名称 |

### 配置示例

```
USERFILTERMAP={"id":"assignee_id","name":"assignee_name"}
```

![image](./public/assets/images/config2.png)


## 附录

### 表格列人员信息插件

```json
[
  {
    "plugintype": "GRID_COLRENDER",
    "rtobjectrepo": "@ibiz-template-plm/grid-personal-info-column@0.0.3-alpha.160",
    "codename": "UsrPFPlugin1213547294",
    "plugintag": "PERSONAL_INFO_COLUMN",
    "rtobjectmode": 2,
    "rtobjectname": "IBizGridPersonalInfoColumn",
    "pssyspfpluginname": "表格列人员信息"
  }
]
```
