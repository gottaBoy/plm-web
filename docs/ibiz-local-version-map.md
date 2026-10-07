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
| `@ibiz-template-plugin/ai-chat` | `../ibiz-app-hub/plugins/ibiz-ai-chat` | `0.0.60` | AI 交互插件 |
| `@ibiz-template-plugin/bi-report` | `../ibiz-app-hub/plugins/ibiz-bi-report` | `0.0.32` | BI 报表插件 |
| `@ibiz-template-plugin/data-view` | `../ibiz-app-hub/plugins/ibiz-data-view` | `0.0.6` | 数据视图插件 |
| `@ibiz-template-plugin/gantt` | `../ibiz-app-hub/plugins/ibiz-gantt` | `0.1.8-alpha.378` | 甘特图插件 |

`core`、`runtime`、`model-helper`、`vue3-util`、`vue3-components` 和 `devtool` 的兼容范围以源码包的 `peerDependencies` 为准。当前应用使用的是同一条 `0.7.x` 运行时线；`@ibiz/model-core@0.1.84` 和 `@ibiz/rt-model-api@0.2.82` 与这组运行时源码配套。

`@ibiz/rt-model-api` 同时被 `@ibizlab/template-model` 的开发期依赖引用。PLM 运行时
入口和 `node_modules/@ibiz/rt-model-api` 均指向 `../ibiz-app-hub/models/rt-model-api`；
lockfile 中保留的 `/@ibiz/rt-model-api@0.2.82` 只属于
`full-code-generator -> @ibizlab/cli -> @ibizlab/template -> @ibizlab/template-model`
这条 dev-only 代码生成链，不进入浏览器构建和运行时 import map。不要手工删除该条目，
否则可能破坏 `pnpm install --frozen-lockfile`；若要消除它，需要升级或修复
`@ibizlab/template-model` 上游依赖后重新验证生成流程。第三方开源依赖不受该规则影响。

## 建模核心插件迁移合同

建模核心插件版本以实际模型 JSON 中的 `rTObjectRepo` 为唯一精确输入，不以 PLM
当前较新版本、目录名、缓存 metadata 或近似兼容版本替代。可验证合同和校验脚本位于：

- `scripts/fixtures/modeling-core-migration-contract.json`
- `scripts/harness-modeling-core-audit.mjs`
- `scripts/harness-modeling-extension-inventory.mjs`

合同绑定了 Central 和 ModelDesign 的模型输入：

| 应用 | 模型输入 SHA-256 | 字节数 |
| --- | --- | ---: |
| Central | `11cbdd30fc1e3fc7c067b1dabc363bccd2d977c8282895bcae1f0fe36885d564` | 191718 |
| ModelDesign | `8b8ae26b2dbf50e6f0a793a820b29aabcf57f50cc076e8d40e3071f1d4a389f5` | 3221926 |

当前模型精确引用为：

- `@ibiz-template-plm/drbar-ex@0.0.3-dev.51`
- `@ibiz-template-plm/list-tree@0.0.2-dev.145`
- `@ibiz-template-plm/route-picker@0.0.2-dev.142`
- `@ibiz-template-plugin/ai-code@0.0.3-alpha.92`
- `@ibiz-template-plugin/console-terminal@0.0.3-alpha.87`
- `@ibiz-template-plugin/file-to-base64@0.1.8-alpha.165`
- `@ibiz-template-plugin/global-util-design@0.0.3-alpha.87`
- `@ibiz-template-plugin/img-to-base64@0.1.8-alpha.144`
- `@ibiz-template-plugin/layout-design@0.0.3-alpha.90`
- `@ibiz-template-plugin/logic-tree-design@0.0.3-alpha.56`
- `@ibiz-template-plugin/model-design@0.0.3-alpha.90`

截至最近一次真实审计，只有
`@ibiz-template-plugin/logic-tree-design@0.0.3-alpha.56` 发现完整精确包证据：
包文件集合指纹为
`68f39aa9112820242aeed0ca64bb3bb71de1e0a2800bbd318ae18e7ba4a6fc12`，
19 个源文件；当前目标产物指纹为
`37daa1f61e9e2e87b3b073d4c0ba9d819384bcf6e04563a4d57f2299578959dd`，
50 个文件。
这是完整精确源码/目标文件集合和独立构建回执的指纹；仍不能标记为
native runtime 已通过，因为 Central/ModelDesign 浏览器验收尚未记录。另外
四个重建映射也有指纹化构建回执，但仍标记为 `reconstructed`，不能冒充认证的
上游原始源码。`ai-code@0.0.3-alpha.141` 和 `model-design@0.0.3-alpha.122`
在 `vendor-upstream/gottaboy-plm-web/plugin-src/` 存在发布源码候选；候选观察、
指纹和阻断原因见 `scripts/fixtures/modeling-core-source-candidates.json`。
`ai-code` 独立回执没有绑定当前 `public/plugins` 目标输出，`model-design` 仍缺少
`@ibiz-template-plugin/runtime-model@0.2.2` 完整源码和构建回执。11 个 native
映射仍不得标记为完成。

本地依赖调查见 `scripts/docs/NATIVE-PLUGIN-SOURCE-AUDIT.md`：发布目标内嵌的
`runtime-model` 只有 7 个编译后 `.mjs`，缺完整包 manifest、源码和构建配置；
两份运行时 JSON 配置快照各有 1414 个文件，但候选源码尚未恢复这些资源输入。
每份快照另有 17 个 JSON 因字符串内未转义控制字符无法解析；文件集合指纹一致
不等于资源可用。审计回归只校验缺陷清单与记录一致，不代表资源或原生功能验收通过。
该插件依赖不是已经本地化的 `@ibiz/rt-model-api`，不能以模型 API 源码代替。

独立候选版本迁移生成器由主线程负责。候选构建入口、依赖版本差异与建议交接边界
见上述审计文档的 `Candidate build path` 和 `Candidate Generation Handoff`；
这些是待实现/待验证的交接要求，不是生成器已经通过或 native 迁移已经完成的证明。

构建回执必须独立记录命令、零退出码、源码/锁文件哈希和输出资产哈希。包文件指纹
不能冒充构建回执，metadata、声明文件或单个 `src` 文件也不能充当源码迁移证明。
验证命令：

```bash
cd scripts
node harness-modeling-core-audit.mjs --model-root ../vendor-upstream/ibizmodeling-standard/modelapi-core/src/main/resources/model/net/ibizsys/modeling
node harness-modeling-extension-inventory.mjs
node --test tests/harness-modeling-core-audit.test.mjs tests/harness-modeling-extension-inventory.test.mjs
```

## PLM 插件关系

恢复的插件版本关系由以下两份文件共同确定：

- `tools/plugin-recovery/runtime-plugins.txt`：插件发布引用，格式为 `@scope/name@version`。
- `plugin-src/@scope/name/package.json`：插件本地源码和权威版本。

每个插件必须输出到同版本目录 `public/plugins/@scope/name@version`，输出目录中的 `package.json`、ES 构建、Legacy 构建和样式文件必须与源码包匹配。`pnpm plugins:check` 还会检查入口 runtime exports、应用级资源污染和构建文件，`pnpm ibiz:versions:check` 额外检查名称和版本对应关系。常规插件使用临时 staging 构建后再合并产物，避免复用旧文件掩盖失败；`cron-editor` 仍走其专用 `ibiz-temp` 构建路径。

当前 73 个运行时插件的源码层级为：`cron-editor` 1 个上游原始源码，`person-select` 加本批 8 个共 9 个拆分式源码，剩余 63 个 bundle 级可编辑源码。第三方编辑器和库资产不纳入 iBiz 源码化计数。

2026-09-27 本批 8 个插件的完整回归报告：`../../.artifacts/plm-plugin-regression/2026-09-27T13-34-00-702Z-2223069/plugin-regression.json`。

PLM 使用的四个模型插件也已接入源码构建链：`pnpm build` 从
`../ibiz-app-hub/plugins/*` 生成 SystemJS 兼容产物到 `dist/extras/js`，
同时重写 import map；`public/extras` 保留同版本 fallback，开发态和生产态
不会再使用 `ai-chat@0.0.66` 等旧版本。

## 定位命令

```bash
pnpm ibiz:versions:check
pnpm plugins:check
pnpm install --frozen-lockfile
pnpm build
pnpm plugins:build
pnpm plugin:harness:test
pnpm plugin:regression -- @ibiz-template-plm/person-select@0.0.3-alpha.434
```

遇到 peer 依赖或运行时版本问题时，先查看本文件和对应源码包的 `package.json`，再检查 `pnpm-lock.yaml` 是否仍出现旧版本。第三方开源组件不纳入本地化版本表。
