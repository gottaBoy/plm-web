#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <package-scope/name@version>"
  exit 1
fi

pkg=$1
scope=${pkg%%/*}
rest=${pkg#*/}
name=${rest%@*}
version=${rest##*@}
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
src_dir="$root/plugin-src/$scope/$name"
dist_dir="$root/public/plugins/$pkg"

if [[ ! -d "$dist_dir" ]]; then
  echo "Plugin not found: $dist_dir"
  exit 1
fi

mkdir -p "$src_dir/src"
cp "$dist_dir/package.json" "$src_dir/package.json"
[[ -f "$dist_dir/README.md" ]] && cp "$dist_dir/README.md" "$src_dir/README.md"
[[ -f "$dist_dir/CHANGELOG.md" ]] && cp "$dist_dir/CHANGELOG.md" "$src_dir/CHANGELOG.md"
cp "$dist_dir/dist/index.es.js" "$src_dir/src/index.ts"
[[ -f "$dist_dir/dist/style.css" ]] && cp "$dist_dir/dist/style.css" "$src_dir/src/style.css"

if [[ ! -f "$src_dir/vite.config.ts" ]]; then
  safe_name=$(printf '%s' "$name" | tr '_' '-' | tr -cd '[:alnum:]-')
  export_name=$(printf '%s' "$safe_name" | sed -E 's/(^|-)([a-z])/\U\2/g')
  cat > "$src_dir/vite.config.ts" <<EOF
import { defineConfig } from 'vite';
import libcss from 'vite-plugin-libcss';
import path from 'path';

const targetDir = path.resolve(__dirname, '../../../public/plugins/$pkg');

export default defineConfig({
  plugins: [libcss()],
  build: {
    outDir: path.join(targetDir, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '$export_name',
      formats: ['es'],
      fileName: () => 'index.es.js',
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'ramda',
        'qx-util',
        'lodash-es',
        '@ibiz-template/core',
        '@ibiz-template/runtime',
        '@ibiz-template/vue3-util',
        '@ibiz-template/vue3-components',
        '@ibiz-template/model-helper',
        '@ibiz/model-core',
        'cherry-markdown',
        /^@ibiz-template(?:-[^/]+)?(?:\/[^/]+)?$/,
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
EOF
fi

[[ -e "$src_dir/node_modules" ]] || ln -s "$root/node_modules" "$src_dir/node_modules"
[[ -e "$src_dir/node_modules/vite-plugin-libcss" ]] || ln -s "$root/node_modules/.pnpm/node_modules/vite-plugin-libcss" "$src_dir/node_modules/vite-plugin-libcss"

cd "$src_dir"
"$root/node_modules/.bin/vite" build

if [[ -f "$dist_dir/dist/assets/style.css" && ! -f "$dist_dir/dist/style.css" ]]; then
  cp "$dist_dir/dist/assets/style.css" "$dist_dir/dist/style.css"
fi
