import { defineConfig } from 'vite';
import libcss from 'vite-plugin-libcss';
import path from 'path';

const targetDir = path.resolve(__dirname, '../../../public/plugins/@ibiz-template-plm/resource-gantt@0.0.3-alpha.304');

export default defineConfig({
  plugins: [libcss()],
  build: {
    outDir: path.join(targetDir, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ResourceGantt',
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
        '@imengyu/vue3-context-menu',
        /^@ibiz-template(?:-[^/]+)?(?:\/[^/]+)?$/,
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
