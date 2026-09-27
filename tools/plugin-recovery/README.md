# PLM 插件源码恢复

## 当前范围

- `runtime-plugins.txt`: 当前 `src/publish/model/app/app.ts` 直接引用的插件，共 66 个。
- `all-plugins.txt`: `public/plugins` 中所有插件目录，共 131 个；其中 65 个未被当前模型直接引用，暂不处理。
- `inventory.tsv`: 66 个运行时插件的源码、类型、source map、体积、License、gitHead 盘点。

## 盘点结果

- 66 个运行时插件中，只有 `@ibiz-template-plugins/cron-editor@0.0.1-dev.4` 自带 `src`。
- 其余 65 个均没有原始 `src`，但都有 `.d.ts` 类型声明；除 `lucky-sheet-editor` 外没有 source map。
- 所有运行时插件均声明 MIT License，并带有 `gitHead`，可作为后续向上游仓库溯源的线索。
- 第一批不建议处理未引用旧版本，优先保证当前运行时 66 个可源码构建。
- 当前恢复结果：66/66 个运行时插件均已恢复到 `plugin-src`；其中 `cron-editor` 为原始源码，`person-select` 为完整拆分式源码，其余 64 个为 bundle 级源码（可编辑、可构建，变量名仍为压缩名）。

## 分类策略

- A 类：已有 `src`，直接纳入 `plugin-src` 并验证构建。
- B 类：无 `src` 但有 `.d.ts` 和 ESM bundle，逆向重建为可维护源码。
- C 类：第三方库或第三方编辑器资产本体（Monaco、Luckysheet 等），保留 pinned 上游产物，不逆向。
- D 类：无法确认授权或来源的包，单独列风险，不进入本地二开源码。

## 构建方式

源码目录为 `plugin-src/<scope>/<package>`，构建产物写回 `public/plugins/<scope>/<package>@<version>`。

试点插件：

```sh
cd plm-web/plugin-src/@ibiz-template-plm/person-select
NODE_PATH=/home/my/workspace/ainfra/aibiz/plm-web/node_modules \
  /home/my/workspace/ainfra/aibiz/plm-web/node_modules/.bin/vite build
cp ../../public/plugins/@ibiz-template-plm/person-select@0.0.3-alpha.434/dist/assets/style.css \
  ../../public/plugins/@ibiz-template-plm/person-select@0.0.3-alpha.434/dist/style.css
```

当前 `person-select@0.0.3-alpha.434` 已完成：

- 从 ESM bundle 和 `.d.ts` 重建 controller、provider、主组件、虚拟列表、工具类和入口。
- 可通过 TypeScript 编译检查。
- 可用 Vite 构建回原插件目录。
- 已通过专项 E2E 和 PLM Web 桌面全量回归。

## 验收标准

每个插件源码化完成时必须满足：

1. `tsc` 编译通过。
2. Vite 构建成功并写回原插件目录。
3. 插件静态资源返回 200。
4. 相关页面专项 E2E 通过。
5. PLM Web 桌面回归通过。

批量恢复阶段的实际验收为：每个常规插件均用恢复脚本执行 Vite 构建并写回原插件目录。`html-comment` 和 `html-vditor` 额外保留了原始动态 chunk 后再重建。后续拆分维护时再按插件逐个补齐 `tsc` 和专项 E2E。

## 后续优先级

1. 从小体积 B 类插件开始批量化，先处理 `dist` 500KB 以内的插件。
2. `comment-item`、`raw-activity`、`ancho-html`、`html-vditor`、`lucky-sheet-editor` 等大体积插件单独评估。
3. 每个包的 `gitHead` 优先到 gottaBoy、iBizLab、Gitee 组织仓库找原始源码；找到源码则不逆向。
4. 第三方资产本体继续使用 pinned 版本。
