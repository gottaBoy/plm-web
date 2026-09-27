# 资源甘特图

该插件基于甘特图增强，主要是将其定制化为资源甘特图的样式，通过扩展样式来丰富视觉效果，并重新定义了用户界面（UI）的逻辑。**该插件隶属于树视图绘制插件（基于甘特图进行扩展）**


## 页面展示

![scene](./public/assets/images/scene.png)


## 功能说明

- 插件采用非传统的甘特图样式，提供一套独特的视觉界面

- 滑块自定义

- 当移动或拖拽滑块时，插件将自动以天为单位进行计算，确保时间线的精度和准确性

- 基于分组属性的单元格合并

- 可以自定义显示的时间范围，按天选择自定义的特定时间段


## 输入参数

### 部件参数

| 参数              | 类型     | 默认值                         | 说明                                 |
| ----------------- | ------- | ----------------------------- | ------------------------------------ |
| SLIDERDRAGGABLE   | boolean | true                          | 是否开启滑块拖拽 |
| SLIDERSHOWCONTENT | string | "${show_identifier}  ${title}" | 滑块显示内容映射，用于滑块主信息显示，其中 title及show_identifier 为 服务端返回数据 |
| GROUPCONFIG       | IGroupConfig | {"groupField":"project_id"}    | 分组配置，用于左侧表格分组合并 |
| SLIDERLIMIT       | boolean | true                          | 滑块限制 |
| EXPANDALL         | boolean | false                         | 全部展开状态 |

#### IGroupConfig（分组配置）

| 参数              | 类型     | 默认值                         | 说明        |
| ----------------- | ------- | ----------------------------- | ----------- |
| groupField        | string  | project_id                    | 分组属性名称 |

### 部件控制器方法

以下方法可通过界面逻辑直接调用。

| 事件名            | 参数类型          | 参数默认值   | 说明              |
| ---------------- | ----------------- | ----------- | --------------- |
| setDateRange	   | IDateRange        | --      	   | 设置时间范围 |
| capacityCalcChange | ICapacityCalc   | --      	   | 容量计算切换 |
| noWeekendDays    | boolean           | --           | 不显示周六及周天 |
| showCapacityChange | boolean         | --           | 设置容量数值显示 |
| onlyTopNodesChange | boolean         | --           | 仅显示顶部节点 |
| fullscreenChange | --                | --           | 全屏切换 |


#### IDateRange（设置时间范围）

| 属性名       | 类型           | 默认值 | 描述      |
| ------------|  ------------- | ------ | -------- |
| start       | string | Date  | --      | 开始时间 |
| end         | string | Date  | --      | 结束时间 |

#### ICapacityCalc（容量计算）

| 属性名       | 类型                                                    | 默认值 | 描述      |
| ------------|  ----------------------------------------------------- | ------ | -------- |
| calcType    | WORKITEMCOUNT/ESTIMATEDWORKLOAD/REMAININGWORKLOAD      | --     | 计算类型，工作项数量（·MCOUNT），预估工时（ESTIMATEDWORKLOAD），剩余工时（REMAININGWORKLOAD） |
| fieldName   | string                                                 | --     | 属性名称 |


## 配置示例

### 滑块自定义
  - 允许通过配置选项来开启或关闭滑块的拖拽功能
  ```
  SLIDERDRAGGABLE=true
  ```
  - 允许通过模板字符串的方式配置滑块主信息显示
  ```
  SLIDERSHOWCONTENT="${show_identifier}  ${title}"
  ```

### 插件支持基于groupField属性对单元格进行合并
  ```
  GROUPCONFIG={"groupField":"project_id"}
  ```


## 附录

### 附属插件

#### 资源状态插件

该插件基于面板直接内容增强，主要是展示资源甘特容量状态：标准、饱和、超出。**该插件隶属于自定义部件绘制插件（基于面板直接内容进行扩展）**

#### 资源下拉列表

该插件基于面板直接内容增强，主要用于资源甘特容量计算切换。切换显示工作项数量、预估工时、剩余工时。**该插件隶属于自定义部件绘制插件（基于面板直接内容进行扩展）**


### 资源甘特图插件

```json
[
  {
    "plugintype": "TREE_RENDER",
    "rtobjectrepo": "@ibiz-template-plm/resource-gantt@0.0.3-alpha.60",
    "codename": "UsrPFPlugin0529272773",
    "plugintag": "RESOURCE_GANTT",
    "rtobjectmode": 2,
    "rtobjectname": "IBizResourceGanttControl",
    "pssyspfpluginname": "资源甘特图"
  }
]
```

### 资源下拉列表插件

```json
[
  {
    "plugintype": "CUSTOM",
    "codename": "UsrPFPlugin0613111608",
    "plugintag": "RESOURCE_DROPDOWN_LIST",
    "pssyspfpluginname": "资源下拉列表"
  }
]
```

### 资源状态插件

```json
[
  {
    "plugintype": "CUSTOM",
    "codename": "UsrPFPlugin0603703380",
    "plugintag": "RESOURCE_STATE",
    "pssyspfpluginname": "资源状态"
  }
]
```
