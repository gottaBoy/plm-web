/* eslint-disable import/no-extraneous-dependencies */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';
import { HtmlTagDescriptor, Plugin } from 'vite';
import cpy from 'cpy';
import { localDocumentationPlugin } from './local-documentation';

// 模板底包
const templatePackages = ['core', 'runtime', 'model-helper'];
// 组件底包
const componentPackages = [
  'vue3-util',
  'vue3-components',
  'web-theme',
  'devtool',
];

// Generate these SystemJS assets from the local source packages during build.
// public/extras is the checked-in development fallback and must use the same
// source versions as the generated dist assets.
const localSystemPlugins = [
  '@ibiz-template-plugin/ai-chat',
  '@ibiz-template-plugin/gantt',
  '@ibiz-template-plugin/bi-report',
  '@ibiz-template-plugin/data-view',
] as const;

const systemAssetPrefix = '/extras/js/@ibiz-template/';
const systemAssetTypes: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/**
 * 开发态按需回源 node_modules 中的 SystemJS 底包。
 *
 * public/extras 只提交第三方库产物，@ibiz-template 底包由构建阶段从
 * node_modules 拷贝到 dist/extras；开发态没有 dist，因此这些资源会 404，
 * 页面框架可以渲染但所有视图都加载失败。
 */
function systemDevMiddleware(
  baseModule: string,
): (req: IncomingMessage, res: ServerResponse, next: () => void) => void {
  const packages = [...templatePackages, ...componentPackages];
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ): void => {
    const rawPath = (req.url || '').split('?', 1)[0];
    if (!rawPath.startsWith(systemAssetPrefix)) {
      next();
      return;
    }
    const [pkg, ...rest] = rawPath.slice(systemAssetPrefix.length).split('/');
    const subPath = rest.join('/');
    if (
      !packages.includes(pkg) ||
      !subPath ||
      subPath.split('/').some(part => part === '..' || part.startsWith('.'))
    ) {
      next();
      return;
    }
    const distDir = join(baseModule, pkg, 'dist');
    const file = resolve(join(distDir, subPath));
    if (!file.startsWith(`${resolve(distDir)}${sep}`)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    if (!existsSync(file)) {
      next();
      return;
    }
    res.statusCode = 200;
    res.setHeader(
      'Content-Type',
      systemAssetTypes[extname(file)] || 'application/octet-stream',
    );
    res.setHeader('Cache-Control', 'no-cache');
    res.end(readFileSync(file));
  };
}

function copyLocalSystemPlugin(
  cwd: string,
  packageName: (typeof localSystemPlugins)[number],
): { importPath: string; stylePath: string } {
  const packageRoot = join(cwd, 'node_modules', ...packageName.split('/'));
  const manifestPath = join(packageRoot, 'package.json');
  if (!existsSync(manifestPath)) {
    throw new Error(`Local iBiz plugin manifest not found: ${manifestPath}`);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as {
    version?: string;
  };
  if (!manifest.version) {
    throw new Error(`Local iBiz plugin has no version: ${manifestPath}`);
  }

  const sourceDist = join(packageRoot, 'dist');
  const requiredFiles = [
    'index.legacy.js',
    'style.css',
    'polyfills.legacy.js',
  ];
  for (const fileName of requiredFiles) {
    if (!existsSync(join(sourceDist, fileName))) {
      throw new Error(
        `Local iBiz plugin ${packageName}@${manifest.version} is missing dist/${fileName}`,
      );
    }
  }

  const outDir = join(
    cwd,
    'dist/extras/js',
    ...packageName.split('/'),
    manifest.version,
  );
  mkdirSync(outDir, { recursive: true });
  copyFileSync(
    join(sourceDist, 'index.legacy.js'),
    join(outDir, 'index.system.min.js'),
  );
  copyFileSync(join(sourceDist, 'style.css'), join(outDir, 'index.min.css'));
  copyFileSync(
    join(sourceDist, 'polyfills.legacy.js'),
    join(outDir, 'polyfills.legacy.js'),
  );

  const assetPrefix = `../js/${packageName}/${manifest.version}`;
  return {
    importPath: `${assetPrefix}/index.system.min.js`,
    stylePath: `${assetPrefix}/index.min.css`,
  };
}

function IBizVitePlugin(): Plugin[] {
  const p: Plugin = {
    name: 'iBizSys:System',
    apply: 'build',
    closeBundle() {
      const cwd = process.cwd();
      const baseModule = join(cwd, 'node_modules/@ibiz-template');
      const baseOutModule = join(cwd, 'dist/extras/js/@ibiz-template');
      // 创建目录
      mkdirSync(baseOutModule, { recursive: true });
      // eslint-disable-next-line no-lone-blocks
      {
        // 拷贝模板底包并修改文件名称
        templatePackages.forEach(pkg => {
          if (!existsSync(join(baseOutModule, pkg))) {
            mkdirSync(join(baseOutModule, pkg), { recursive: true });
          }
          const cpFile = join(baseModule, pkg, 'dist/index.system.min.js');
          const outFile = join(baseOutModule, pkg, 'index.system.min.js');
          copyFileSync(cpFile, outFile);
        });
      }
      // eslint-disable-next-line no-lone-blocks
      {
        // 拷贝组件底包并修改文件名称
        componentPackages.forEach(pkg => {
          if (!existsSync(join(baseOutModule, pkg))) {
            mkdirSync(join(baseOutModule, pkg), { recursive: true });
          }
          const cpDir = join(baseModule, pkg, 'dist/**');
          const outDir = join(baseOutModule, pkg);
          cpy(cpDir, outDir);
        });
      }
      const localPluginAssets = new Map(
        localSystemPlugins.map(packageName => [
          packageName,
          copyLocalSystemPlugin(cwd, packageName),
        ]),
      );
      // 重新改写 index.html 部分代码
      const htmlFilePath = join(cwd, 'dist/index.html');
      if (existsSync(htmlFilePath)) {
        let html = readFileSync(htmlFilePath, 'utf-8');
        html = html
          .replace(
            /<script\b[^>]*type="module"[^>]*>[\s\S]*?window\.__vite_is_modern_browser[\s\S]*?<\/script>/g,
            '',
          )
          .replace(
            /<script\b[^>]*>[\s\S]*?vite: loading legacy chunks[\s\S]*?<\/script>/g,
            '',
          )
          .replace(
            /<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?onbeforeload(?:(?!<\/script>)[\s\S])*?t\.type="module",t\.src="\."(?:(?!<\/script>)[\s\S])*?<\/script>/g,
            '',
          );
        // 运行时统一使用 SystemJS legacy 入口，移除 Vite 生成的原生 ESM 入口。
        // 输出目录从 assets 迁移到 static/js 后，旧规则未再命中，导致裸模块
        // （例如 vue）被浏览器按原生 ESM 解析。
        const modernEntryReg =
          /<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="\.\/(?:assets|static\/js)\/index[-.][^"]+\.js")[^>]*><\/script>/g;
        html = html.replace(modernEntryReg, '');
        if (modernEntryReg.test(html)) {
          throw new Error(
            'Failed to remove the Vite modern entry from index.html',
          );
        }
        html = html.replace('<script nomodule', '<script');
        html = html.replace('<script nomodule', '<script');
        html = html.replace('<script nomodule', '<script');
        html = html.replace('<script nomodule', '<script');
        html = html.replace(
          '<script src="./assets/ionicons/ionicons/ionicons.js"></script>',
          '<script nomodule src="./assets/ionicons/ionicons/ionicons.js"></script>',
        );
        // 匹配所有的 css 和 js 文件，加上时间戳
        const scriptReg = /\.(css|js|json)"/g;
        const time = new Date().getTime();
        html = html.replace(scriptReg, `.$1?time=${time}"`);
        writeFileSync(htmlFilePath, html, 'utf-8');
      } else {
        console.error(`ERROR: ${htmlFilePath} 文件未找到`);
      }
      // 重新修改 system-import.json 补充时间戳
      {
        const systemImportPath = join(
          cwd,
          'dist/extras/json/system-import.json',
        );
        if (existsSync(systemImportPath)) {
          const content = readFileSync(systemImportPath, 'utf-8');
          if (content) {
            const json = JSON.parse(content);
            const items = json.imports as Record<string, string>;
            const styles = json.styles as Record<string, string | string[]>;
            for (const packageName of localSystemPlugins) {
              const assets = localPluginAssets.get(packageName);
              if (!assets) {
                throw new Error(
                  `Generated local iBiz plugin assets not found: ${packageName}`,
                );
              }
              items[packageName] = assets.importPath;
              styles[packageName] = assets.stylePath;
            }
            const date = new Date();
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in items) {
              const val = items[key];
              items[key] = `${val}?time=${date.getTime()}`;
            }
            // eslint-disable-next-line no-restricted-syntax, guard-for-in
            for (const key in styles) {
              const val = styles[key];
              if (Array.isArray(val)) {
                styles[key] = val.map(v => `${v}?time=${date.getTime()}`);
              } else {
                styles[key] = `${val}?time=${date.getTime()}`;
              }
            }
            writeFileSync(
              systemImportPath,
              JSON.stringify(json, null, 2),
              'utf-8',
            );
          }
        } else {
          console.error(`ERROR: ${systemImportPath} 文件未找到`);
        }
      }
      // 修改 dist/environments/environment.js 把 dev 模式改为 false
      {
        const envPath = join(cwd, 'dist/environments/environment.js');
        if (existsSync(envPath)) {
          let env = readFileSync(envPath, 'utf-8');
          if (env) {
            env = env.replace(/dev:(.*)true/, 'dev: false');
            env = env.replace(/logLevel:(.*)'TRACE'/, `logLevel: 'ERROR'`);
            writeFileSync(envPath, env, 'utf-8');
          }
        } else {
          console.error(`ERROR: ${envPath} 文件未找到`);
        }
      }
    },
  };

  const devP: Plugin = {
    name: 'iBizSys:System:Dev',
    apply: 'serve',
    configResolved() {
      const baseModule = resolve(__dirname, '../node_modules');
      if (!existsSync(baseModule)) {
        return;
      }
      // vue/runtime-core 包有扩展修改，开发态拷贝到 node_modules 避免功能缺失
      const cpDir = join(__dirname, 'extras/@vue/runtime-core/3.3.8/**');
      const outDir = join(
        baseModule,
        '.pnpm/@vue+runtime-core@3.3.8/node_modules/@vue/runtime-core/dist',
      );
      cpy(cpDir, outDir);
    },
    configureServer(server) {
      server.middlewares.use(
        systemDevMiddleware(
          resolve(__dirname, '../node_modules/@ibiz-template'),
        ),
      );
    },
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [];
      const extraPath = resolve(__dirname, '../public/extras');
      const json = JSON.parse(
        readFileSync(resolve(extraPath, 'json/system-import.json'), 'utf-8'),
      ) as Record<string, unknown>;
      const styles = json.styles as Record<string, string | string[]>;
      if (styles) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in styles) {
          if (Object.prototype.hasOwnProperty.call(styles, key)) {
            const val = styles[key];
            if (Array.isArray(val)) {
              val.forEach(v => {
                tags.push({
                  tag: 'link',
                  attrs: {
                    type: 'text/css',
                    rel: 'stylesheet',
                    href: v.replace('../', './extras/'),
                  },
                  injectTo: 'head',
                });
              });
            } else {
              tags.push({
                tag: 'link',
                attrs: {
                  type: 'text/css',
                  rel: 'stylesheet',
                  href: val.replace('../', './extras/'),
                },
                injectTo: 'head',
              });
            }
          }
        }
      }
      return {
        html,
        tags,
      };
    },
  };

  return [
    p,
    devP,
    localDocumentationPlugin({
      sourceDirectory: resolve(__dirname, '../../plm/doc/docsify'),
    }),
  ];
}

export default IBizVitePlugin;
