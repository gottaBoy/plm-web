import { defineConfig } from 'vite';
import libcss from 'vite-plugin-libcss';
import path from 'path';

const targetDir = path.resolve(__dirname, '../../../public/plugins/@ibiz-template-plm/form-data-comparison@0.0.3-alpha.407');

export default defineConfig({
  plugins: [libcss()],
  build: {
    outDir: path.join(targetDir, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FormDataComparison',
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
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
