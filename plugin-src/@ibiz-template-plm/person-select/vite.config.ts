import { defineConfig } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import libcss from 'vite-plugin-libcss';
import path from 'path';

const targetDir = path.resolve(
  __dirname,
  '../../../public/plugins/@ibiz-template-plm/person-select@0.0.3-alpha.434',
);

export default defineConfig({
  plugins: [vueJsx(), libcss()],
  build: {
    outDir: path.join(targetDir, 'dist'),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'IBizPersonelSelect',
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
        '@ibiz/model-core',
      ],
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
