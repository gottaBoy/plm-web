import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import libcss from 'vite-plugin-libcss';
import path from 'path';

const targetDir = path.resolve(
  __dirname,
  '../../../public/plugins/@ibiz-template-plugin/logic-tree-design@0.0.3-alpha.56',
);

export default defineConfig({
  root: __dirname,
  publicDir: false,
  plugins: [vueJsx(), libcss()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@ibiz-template/theme/style/global.scss";',
      },
    },
  },
  build: {
    outDir: path.join(targetDir, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LogicTreeDesign',
      formats: ['es'],
      fileName: () => 'index.es.js',
    },
    rollupOptions: {
      external: [
        'vue',
        'element-plus',
        'lodash-es',
        'qx-util',
        '@ibiz-template/core',
        '@ibiz-template/runtime',
        '@ibiz-template/vue3-util',
        '@ibiz/model-core',
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
