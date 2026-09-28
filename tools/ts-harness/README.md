# Plugin TypeScript Harness

This harness checks the recovered, editable PLM plugin sources without
changing the application `tsconfig.json`.

## Commands

```bash
pnpm plugin:types
pnpm plugin:types -- @ibiz-template-plm/person-select@0.0.3-alpha.434
pnpm plugin:types:baseline
```

The four strict plugins must have zero diagnostics. The five baseline plugins
may retain their recorded diagnostics, but neither their total count nor any
TypeScript error-code count may increase.

Baseline updates are explicit and require a selector:

```bash
node tools/ts-harness/index.mjs \
  --update-baseline \
  -- @ibiz-template-plm/person-select@0.0.3-alpha.434
```

The harness currently covers the nine recovered TypeScript/TSX plugin sources
listed in `plugins.json`. Other runtime plugins remain covered by fresh
build, export-contract, HTTP asset/hash, and PLM desktop E2E checks; they are
not silently treated as TypeScript-clean.
