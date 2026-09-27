# 路由导航插件

该插件分为两部分

第一部分基于数据关系栏增强，主要用于增强其对应的路由跳转功能。**该插件隶属于自定义部件绘制插件（基于数据关系栏进行扩展）**

第二部分基于数据分页栏增强，主要用于增强其对应的路由跳转功能。**该插件隶属于自定义部件绘制插件（基于数据分页栏进行扩展）**

## 页面展示

![image](./public/assets/images/scene.png)

## 功能说明

- 点击菜单项，进行路由跳转或导航

- 点击tab项，回到默认呈现视图

- 点击返回按钮，跳转到对应的视图


## 输入参数

| 属性      | 类型     | 默认值 | 说明                                                                                             |
| ----------- | -------- | ------ | ------------------------------------------------------------------------------------------------ |
| ROUTE_ITEMS | string[] | []    | 需要进行路由跳转的关系界面，未在配置数组里面的关系界面执行默认导航，数组成员项为关系界面成员标识 |
| ENABLE_BACK | boolean  | false  | 是否启用返回按钮                                                                                 |
| VIEW_ID     | string   | ---     | 返回按钮点击后，跳转视图对应的id |

## 附录

### 数据关系栏插件

```json
[
  {
    "plugintype": "CUSTOM",
    "rtobjectrepo": "@ibiz-template-plm/route-drbar@0.0.3-alpha.158",
    "codename": "UsrPFPlugin0510879890",
    "plugintag": "ROUTE_DRBAR",
    "rtobjectmode": 2,
    "rtobjectname": "ROUTE_DRBAR",
    "pssyspfpluginname": "路由drbar"
  }
]
```

### 数据分页栏插件

```json
[
  {
    "plugintype": "CUSTOM",
    "rtobjectrepo": "@ibiz-template-plm/route-drbar@0.0.3-alpha.158",
    "codename": "UsrPFPlugin0511775624",
    "plugintag": "ROUTE_DRTAB",
    "rtobjectmode": 2,
    "rtobjectname": "ROUTE_DRTAB",
    "pssyspfpluginname": "路由drtab"
  }
]
```
