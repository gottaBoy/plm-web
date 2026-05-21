# AI代码编辑器

该插件基于代码编辑器增强，提供IBiz TS代码提示，AI对话功能和AI代码补全功能。**该插件隶属于编辑器插件（基于代码编辑器进行扩展）**

## 页面展示

![image](./public/assets/images/scene.png)

## 功能说明

### 编辑器参数

| 参数标识             | 参数说明                                                     | 值类型说明                               | 默认值               |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------- | -------------------- |
| enableEdit           | 启用编辑                                                     | boolean                                  | true                 |
| enableFullScreen     | 启用全屏功能                                                 | boolean                                  | false                |
| GLOBALVARIABLE       | 全局变量映射，格式：参数名：接口名，多个之间使用 \| 分隔     | [name]:[interface] \| [name]:[interface] | -                    |
| completionmode       | 补全模式：ai聊天，ai补全，所有                               | 'aichat' \| 'inline' \| 'all'            | all                  |
| inlinecompletionmode | ai补全模式参数，用于给ai发消息时附加的参数                   | string                                   | -                    |
| inlinetriggermode    | 行内补全触发模式: 手动 \| 自动 \| 所有，手动模式下仅alt + p 快捷建触发自动补全，自动模式下仅用户输入触发 | 'manual' \| 'auto' \|'all'               | all                  |
| envlanguag           | 编辑器环境语言: zh-cn, en .....                              | string                                   | 当前ibiz系统语言环境 |
| srfaiappendcurdata | 在打开AI功能时，该参数用于判断是否传入对象参数，主要用于在请求历史记录时，附加当前参数 | boolean | false |
| srfaiappendcurcontent | 在打开AI功能时，如果该参数存在值，会将其传入编辑内容作为用户消息，主要用于在请求历史记录后，附加当前编辑内容作为用户消息 | string | - |
| ac | 是否启用ac自填模式 | boolean | false |
|autoquestion |  用于AI聊天，AI历史数据最后一个项是用户消息（USER）时是否自动提问，默认开启 | boolean | true |
| openmode | 用于AI聊天，AI窗口的打开模式，minimize：默认最小化窗口；autoexpand：默认最小化窗口，当提问完成后自动展开窗口 | 'default' \| 'minimize' \| 'autoexpand' | default
| autoclose | 用于AI聊天，在提问完成后，设置AI窗口的自动关闭模式。其中 mode 设为 minimize 时窗口会最小化，设为 close 时窗口会直接关闭，设为 closetime 时窗口会根据 duration 配置的值延时关闭。duration配置单位为秒（s），默认值为 3 秒 | {mode:'minimize' \| 'close' \| 'closetime',duration?:number} | - |
| inlineaichatheight | 用于指定AI行内聊天框高度 | number | 300 | 
| enableaiminimize | 是否启用行内聊天框最小化功能，优先级大于全局参数enableAIMinimize | boolean | - |


## 附录

### 调度表格插件

```json
[
  {
    "plugintype": "EDITOR_CUSTOMSTYLE",
    "rtobjectrepo": "@ibiz-template-plugin/ai-code@0.0.3-alpha.125",
    "codename": "AI_CODE_TEST",
    "plugintag": "AI_CODE_TEST",
    "rtobjectmode": 2,
    "rtobjectname": "AI_CODE_TEST",
    "pssyspfpluginname": "AI代码编辑器"
  }
]
```