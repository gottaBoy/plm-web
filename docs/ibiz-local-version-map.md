# iBiz 本地版本关系

本项目运行时使用的 iBiz 包全部来自相邻目录 `../ibiz-app-hub`，不再依赖对应 npm 包的构建产物。`package.json` 和 `pnpm-lock.yaml` 中的 `link:` 路径是本地化基线，源码包 `package.json` 中的 `version` 是实际版本。

## 应用运行时包

| 包 | 实际源码 | 当前版本 | 角色 |
| --- | --- | --- | --- |
| `@ibiz-template/core` | `../ibiz-app-hub/packages/core` | `0.7.41-alpha.78` | 核心运行时 |
| `@ibiz-template/runtime` | `../ibiz-app-hub/packages/runtime` | `0.7.41-alpha.86` | 运行时服务 |
| `@ibiz-template/model-helper` | `../ibiz-app-hub/packages/model-helper` | `0.7.41-alpha.86` | 模型辅助 |
| `@ibiz-template/vue3-util` | `../ibiz-app-hub/packages/vue3-util` | `0.7.41-alpha.86` | Vue 工具 |
| `@ibiz-template/vue3-components` | `../ibiz-app-hub/components/ibiz-next-vue3` | `0.7.41-alpha.78` | Vue 组件 |
| `@ibiz-template/theme` | `../ibiz-app-hub/packages/theme` | `0.7.39` | 基础主题 |
| `@ibiz-template/web-theme` | `../ibiz-app-hub/components/web-theme` | `3.11.0` | Web 主题 |
| `@ibiz/model-core` | `../ibiz-app-hub/models/model-core` | `0.1.84` | 模型定义 |
| `@ibiz/rt-model-api` | `../ibiz-app-hub/models/rt-model-api` | `0.2.82` | 模型运行 API |
| `@ibiz-template/devtool` | `../ibiz-app-hub/plugins/ibiz-template-devtools` | `0.0.14` | 建模/调试工具 |
| `@ibiz-template-plugin/bi-report` | `../ibiz-app-hub/plugins/ibiz-bi-report` | `0.0.32` | BI 报表插件 |
| `@ibiz-template-plugin/data-view` | `../ibiz-app-hub/plugins/ibiz-data-view` | `0.0.6` | 数据视图插件 |

`core`、`runtime`、`model-helper`、`vue3-util`、`vue3-components` 和 `devtool` 的兼容范围以源码包的 `peerDependencies` 为准。当前应用使用的是同一条 `0.7.x` 运行时线；`@ibiz/model-core@0.1.84` 和 `@ibiz/rt-model-api@0.2.82` 与这组运行时源码配套。

## PLM 插件关系

恢复的插件版本关系由以下两份文件共同确定：

- `tools/plugin-recovery/runtime-plugins.txt`：插件发布引用，格式为 `@scope/name@version`。
- `plugin-src/@scope/name/package.json`：插件本地源码和权威版本。

每个插件必须输出到同版本目录 `public/plugins/@scope/name@version`，输出目录中的 `package.json`、ES 构建、Legacy 构建和样式文件必须与源码包匹配。`pnpm plugins:check` 检查构建文件，`pnpm ibiz:versions:check` 额外检查名称和版本对应关系。

## 定位命令

```bash
pnpm ibiz:versions:check
pnpm plugins:check
pnpm install --frozen-lockfile
pnpm build
pnpm plugins:build
```

遇到 peer 依赖或运行时版本问题时，先查看本文件和对应源码包的 `package.json`，再检查 `pnpm-lock.yaml` 是否仍出现旧版本。第三方开源组件不纳入本地化版本表。
