const path = require('path');
const { defineConfig } = require('@ibiz-template/cli-core');

const rootDir = __dirname;

module.exports = defineConfig({
  cwdDir: rootDir,
  rootDir: path.resolve(rootDir, 'src'),
  bundleDir: path.resolve(rootDir, 'dist'),
  clean: false,
  external: [
    '@ibiz-template/runtime',
    '@ibiz-template/vue3-util',
    'vue',
    'lodash-es',
  ],
  module: {
    input: '**/*.{js,ts,tsx,vue}',
    ignore: ['**/*.d.ts'],
  },
  theme: {
    prefix: `@import "${path.resolve(
      rootDir,
      '../../../node_modules/@ibiz-template/theme/style/global.scss',
    )}";`,
    output: [path.resolve(rootDir, 'es'), path.resolve(rootDir, 'lib')],
  },
  bundles: [
    {
      input: 'index.ts',
      output: {
        file: path.resolve(rootDir, 'dist/index.system.min.js'),
        format: 'system',
        sourcemap: false,
      },
    },
  ],
});
