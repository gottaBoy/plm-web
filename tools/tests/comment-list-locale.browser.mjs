import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { launchChromium } from '../../../scripts/browser-launch.mjs';

const plmWeb = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workspace = path.resolve(plmWeb, '..');
const artifacts = path.join(workspace, '.artifacts');
const sourceRoot = 'plugin-src/@ibiz-template-plm/comment-list/src';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const hubRequire = createRequire(path.join(workspace, 'ibiz-app-hub/package.json'));
const webRequire = createRequire(path.join(plmWeb, 'package.json'));

function writePrivate(directory, relative, bytes) {
  assert.ok(relative && !path.isAbsolute(relative) && !relative.split('/').includes('..'));
  const file = path.join(directory, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 });
  return { path: relative, sha256: sha(bytes), bytes: Buffer.byteLength(bytes) };
}

function inventory(relative) {
  const root = path.join(plmWeb, relative);
  if (!fs.existsSync(root)) return { path: relative, exists: false, files: [] };
  const visit = (directory, prefix = '') => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      assert.equal(entry.isSymbolicLink(), false);
      const relativePath = path.posix.join(prefix, entry.name);
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return visit(file, relativePath);
      assert.equal(entry.isFile(), true);
      const bytes = fs.readFileSync(file);
      return [{ path: relativePath, sha256: sha(bytes), bytes: bytes.length }];
    }).sort((a, b) => a.path.localeCompare(b.path));
  return { path: relative, exists: true, files: visit(root) };
}

function yesterdayInSingapore() {
  const fields = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  const day = new Date(Date.UTC(Number(fields.year), Number(fields.month) - 1, Number(fields.day)) - 86400000);
  return day.toISOString().slice(0, 10);
}

const hostSource = String.raw`
export const getInputProps = () => ({
  controller: { type: Object, required: true },
  data: { type: Object, default: () => ({}) },
});
export const getEditorEmits = () => [];
export const useNamespace = name => ({
  b: () => 'ibiz-' + name,
  e: value => 'ibiz-' + name + '__' + value,
  em: (element, modifier) => 'ibiz-' + name + '__' + element + '--' + modifier,
});
`;

const entrySource = date => String.raw`
import { createApp } from 'vue';
import { CommentList } from './source/comment-list.ts';
const language = new URL(window.location.href).searchParams.get('language') || 'zh-CN';
const english = /^en(?:[-_]|$)/i.test(language);
const comments = [
  { id: 'candidate-comment-one', create_man: 'candidate-author-one',
    create_time: '${date} 10:30:00',
    content: english ? '<p>The review notes are ready.</p>' : '<p>评审记录已经整理完成。</p>' },
  { id: 'candidate-comment-two', create_man: 'candidate-author-two',
    create_time: '${date} 10:31:00', content: '<p>中文🙂 e\u0301 &amp; quotes \' " \\</p>' },
];
const before = JSON.stringify(comments);
const controller = {
  isLocal: false, context: { srfuserid: 'candidate-reader' }, params: {}, editorParams: {},
  operatorMap: new Map([
    ['candidate-author-one', { data: { label: english ? 'Review Member' : '评审成员',
      iconurl: JSON.stringify([{ id: 'data:image/png;base64,bm90LWFuLWltYWdl' }]) } }],
    ['candidate-author-two', { data: { label: english ? 'Project Member' : '项目成员',
      iconurl: JSON.stringify([{ id: './avatar.png' }]) } }],
  ]),
  evt: { on() {}, off() {} },
  updateComment() { throw new Error('Read-only source fixture'); },
  deleteComment() { throw new Error('Read-only source fixture'); },
};
window.ibiz = {
  i18n: { getLang: () => language },
  util: { file: { calcFileUpDownUrl: () => ({ downloadUrl: '%fileId%' }) } },
};
document.querySelector('h1').textContent = english ? 'Comments' : '评论';
createApp(CommentList, { controller, value: comments, data: {} }).mount('#comments');
Object.defineProperty(window, '__commentCandidateEvidence', {
  get: () => ({ controlledFixture: true, businessAcceptance: false, language,
    commentsUnchanged: before === JSON.stringify(comments), commentCount: comments.length }),
});
`;

const htmlSource = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Comments</title><link rel="stylesheet" href="./style.css">
<style>
:root{font-family:Arial,sans-serif;color:#222;background:#fff}
body{margin:24px}main{max-width:880px;margin:0 auto}h1{font-size:22px;margin:0 0 18px}
.ibiz-comment-list{width:100%;box-sizing:border-box}
.ibiz-comment-list__item--time{color:#666;font-size:13px}p{line-height:1.6}
@media(max-width:600px){body{margin:16px}.ibiz-comment-list__item--header{flex-wrap:wrap;row-gap:8px}}
</style><script defer src="./candidate.js"></script></head>
<body><main><h1>Comments</h1><div id="comments"></div></main></body></html>`;

export async function runCommentListLocaleBrowser({ output }) {
  const directory = path.resolve(output);
  assert.equal(fs.realpathSync(path.dirname(directory)), fs.realpathSync(artifacts));
  assert.match(path.basename(directory), /^comment-list-locale-browser-[A-Za-z0-9-]+$/);
  assert.equal(fs.existsSync(directory), false);
  fs.mkdirSync(directory, { mode: 0o700 });
  const report = {
    contract: 'controlled-comment-source-browser-v2', startedAt: new Date().toISOString(),
    cells: [], sourceBindings: [], hostServicesControlled: true, commentsAreFixtureProps: true,
    nativeBusinessAcceptance: false, productionPluginPublished: false, status: 'RUNNING',
  };
  const publishedScopes = [
    'public/plugins/@ibiz-template-plm/comment-list@0.0.3-alpha.189',
    'dist/plugins/@ibiz-template-plm/comment-list@0.0.3-alpha.189',
    'plugin-src/@ibiz-template-plm/comment-list/dist',
  ];
  const publishedBefore = publishedScopes.map(inventory);
  report.publishedPluginBefore = publishedBefore;
  const guard = () => {
    for (const item of report.sourceBindings) {
      assert.equal(sha(fs.readFileSync(item.original)), item.sha256);
      assert.equal(sha(fs.readFileSync(path.join(directory, item.snapshot))), item.sha256);
    }
  };
  let browser, failure;
  try {
    for (const [file, snapshot] of [
      [`${sourceRoot}/comment-list.ts`, 'source/comment-list.ts'],
      [`${sourceRoot}/comment-list.locale.ts`, 'source/comment-list.locale.ts'],
      [`${sourceRoot}/comment-list.utils.ts`, 'source/comment-list.utils.ts'],
      [`${sourceRoot}/style.css`, 'style.css'],
      ['public/assets/images/login-avatar.png', 'avatar.png'],
      ['tools/tests/comment-list-locale.browser.mjs', 'executed-runner.private.mjs'],
      ['../scripts/browser-launch.mjs', 'browser-launch.private.mjs'],
    ]) {
      const original = path.resolve(plmWeb, file);
      const bytes = fs.readFileSync(original);
      writePrivate(directory, snapshot, bytes);
      report.sourceBindings.push({ original, snapshot, sha256: sha(bytes), bytes: bytes.length });
    }
    const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: plmWeb, encoding: 'utf8' });
    assert.equal(git.status, 0);
    report.sourceHead = git.stdout.trim();
    report.fixtureDate = yesterdayInSingapore();
    writePrivate(directory, 'entry.mjs', entrySource(report.fixtureDate));
    writePrivate(directory, 'host-ui.mjs', hostSource);
    writePrivate(directory, 'index.html', htmlSource);
    const esbuild = hubRequire('esbuild');
    const { chromium } = hubRequire('playwright');
    report.toolchain = { node: process.version, esbuild: esbuild.version,
      vue: webRequire('vue/package.json').version, playwright: hubRequire('playwright/package.json').version };
    report.fullDependencySourceClosure = false;
    const build = await esbuild.build({
      absWorkingDir: workspace, entryPoints: [path.join(directory, 'entry.mjs')],
      bundle: true, write: false, outfile: path.join(directory, 'candidate.js'),
      format: 'iife', platform: 'browser', metafile: true, minify: false,
      define: { 'process.env.NODE_ENV': '"production"',
        __VUE_OPTIONS_API__: 'true', __VUE_PROD_DEVTOOLS__: 'false' },
      plugins: [{ name: 'declared-source-fixture-host', setup(builder) {
        builder.onResolve({ filter: /^vue$/ }, () => ({ path: webRequire.resolve('vue/dist/vue.esm-bundler.js') }));
        builder.onResolve({ filter: /^@ibiz-template\/vue3-util$/ },
          () => ({ path: path.join(directory, 'host-ui.mjs') }));
      } }],
    });
    for (const file of build.outputFiles) writePrivate(directory, path.relative(directory, file.path), file.contents);
    const buildInputs = Object.keys(build.metafile.inputs).map(file => {
      const original = path.resolve(workspace, file), bytes = fs.readFileSync(original);
      return { path: original, sha256: sha(bytes), bytes: bytes.length };
    });
    const outputs = ['candidate.js', 'entry.mjs', 'host-ui.mjs', 'index.html', 'style.css', 'avatar.png']
      .map(file => {
        const bytes = fs.readFileSync(path.join(directory, file));
        return { path: file, sha256: sha(bytes), bytes: bytes.length };
      });
    const candidate = { sourceBindings: report.sourceBindings, buildInputs, outputs,
      hostServicesControlled: true, commentsAreFixtureProps: true, nativeBusinessAcceptance: false };
    report.candidate = writePrivate(directory, 'candidate.private.json', json(candidate));
    const candidateGuard = () => {
      guard();
      for (const item of buildInputs) assert.equal(sha(fs.readFileSync(item.path)), item.sha256);
      for (const item of outputs) {
        assert.equal(sha(fs.readFileSync(path.join(directory, item.path))), item.sha256);
      }
    };
    candidateGuard();
    browser = await launchChromium(chromium);
    report.browserVersion = browser.version();
    for (const [language, viewportName, viewport] of [
      ['zh-CN', 'desktop', { width: 1280, height: 800 }],
      ['en-US', 'desktop', { width: 1280, height: 800 }],
      ['zh-CN', 'mobile', { width: 390, height: 844 }],
      ['en-US', 'mobile', { width: 390, height: 844 }],
    ]) {
      const cell = { language, viewportName, viewport, consoleErrors: [], pageErrors: [],
        failedRequests: [], blockedRequests: [], informationalLogs: [], contextClosed: false };
      report.cells.push(cell);
      const context = await browser.newContext({ locale: language, viewport, timezoneId: 'Asia/Singapore' });
      try {
        const page = await context.newPage();
        page.on('console', message => {
          if (message.type() === 'error') cell.consoleErrors.push(message.text());
          else cell.informationalLogs.push({ type: message.type(), text: message.text() });
        });
        page.on('pageerror', error => cell.pageErrors.push(error.message));
        page.on('requestfailed', request => cell.failedRequests.push({
          url: request.url(), failure: request.failure()?.errorText,
        }));
        await page.route('**/*', route => {
          const url = new URL(route.request().url());
          if (url.protocol === 'file:' && path.dirname(fileURLToPath(url)) === directory &&
            ['index.html', 'candidate.js', 'style.css', 'avatar.png'].includes(path.basename(url.pathname))) {
            return route.continue();
          }
          if (url.href === 'data:image/png;base64,bm90LWFuLWltYWdl') return route.continue();
          cell.blockedRequests.push({ method: route.request().method(), url: url.href });
          return route.abort();
        });
        const entry = pathToFileURL(path.join(directory, 'index.html'));
        entry.searchParams.set('language', language);
        await page.goto(entry.href);
        await page.waitForFunction(() =>
          document.querySelectorAll('.ibiz-comment-list__item').length === 2 &&
          document.querySelectorAll('.ibiz-comment-list__item--img img').length === 1 &&
          document.querySelector('.ibiz-comment-list__item--img img')?.naturalWidth > 0);
        cell.observation = await page.evaluate(() => ({
          ...window.__commentCandidateEvidence,
          visibleAvatars: document.querySelectorAll('.ibiz-comment-list__item--img img').length,
          fallback: document.querySelector('.ibiz-comment-list__item--img')?.textContent,
          authors: [...document.querySelectorAll('.ibiz-comment-list__item--label')].map(node => node.textContent),
          times: [...document.querySelectorAll('.ibiz-comment-list__item--time')].map(node => node.textContent),
          content: [...document.querySelectorAll('.ibiz-comment-list__item--content')].map(node => node.textContent),
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        }));
        assert.equal(cell.observation.commentsUnchanged, true);
        assert.equal(cell.observation.visibleAvatars, 1);
        assert.equal(cell.observation.fallback, language === 'zh-CN' ? '成员' : 'RE');
        assert.ok(cell.observation.times.every(time =>
          time.startsWith(language === 'zh-CN' ? '昨天 ' : 'Yesterday ')));
        assert.ok(cell.observation.content[1].includes('中文🙂 e\u0301 & quotes \' " \\'));
        assert.equal(cell.observation.horizontalOverflow, false);
        for (const errors of [cell.consoleErrors, cell.pageErrors, cell.failedRequests, cell.blockedRequests]) {
          assert.equal(errors.length, 0);
        }
        const screenshot = `${language}-${viewportName}.png`;
        await page.screenshot({ path: path.join(directory, screenshot), fullPage: true });
        fs.chmodSync(path.join(directory, screenshot), 0o600);
        cell.screenshot = { path: screenshot, sha256: sha(fs.readFileSync(path.join(directory, screenshot))) };
        cell.status = 'PASS_CONTROLLED_SOURCE_DOM';
        candidateGuard();
      } finally {
        await context.close();
        cell.contextClosed = true;
      }
    }
    candidateGuard();
    report.status = 'PASS_CONTROLLED_COMMENT_SOURCE_FOUR_CELLS';
  } catch (error) {
    failure = error;
    report.status = 'FAILED_CONTROLLED_COMMENT_SOURCE';
    report.failure = { name: error.name, message: error.message };
  } finally {
    try {
      if (browser) await browser.close();
      report.browserClosed = true;
      guard();
      report.sourceHashesVerifiedAfter = true;
      report.publishedPluginAfter = publishedScopes.map(inventory);
      assert.deepEqual(report.publishedPluginAfter, publishedBefore);
      report.publishedPluginScopesUnchanged = true;
    } catch (error) {
      failure ||= error;
      report.status = 'FAILED_CONTROLLED_COMMENT_SOURCE_CLEANUP';
      report.cleanupFailure = { name: error.name, message: error.message };
    }
    report.finishedAt = new Date().toISOString();
    report.receipt = 'report.private.json';
    writePrivate(directory, report.receipt, json(report));
  }
  if (failure) throw failure;
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { values } = parseArgs({ options: { output: { type: 'string' } }, strict: true });
  try {
    const report = await runCommentListLocaleBrowser({ output: values.output });
    console.log(json({ status: report.status, cells: report.cells.length,
      output: path.resolve(values.output), browserClosed: report.browserClosed }));
  } catch (error) {
    console.error(json({ status: 'FAILED_CONTROLLED_COMMENT_SOURCE', message: error.message }));
    process.exitCode = 1;
  }
}
