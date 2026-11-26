import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { launchChromium } from '../../../scripts/browser-launch.mjs';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const workspace = path.resolve(web, '..');
const artifacts = path.join(workspace, '.artifacts');
const sourceRoot = 'plugin-src/@ibiz-template-plm/person-select/src';
const webRequire = createRequire(path.join(web, 'package.json'));
const hubRequire = createRequire(path.join(workspace, 'ibiz-app-hub/package.json'));
const sha = value => createHash('sha256').update(value).digest('hex');
const json = value => `${JSON.stringify(value, null, 2)}\n`;

function write(directory, relative, bytes) {
  assert.ok(relative && !path.isAbsolute(relative) && !relative.split('/').includes('..'));
  const file = path.join(directory, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  fs.writeFileSync(file, bytes, { mode: 0o600, flag: 'wx' });
  return { path: relative, sha256: sha(bytes), bytes: Buffer.byteLength(bytes) };
}

function inventory(relative) {
  const root = path.join(web, relative);
  if (!fs.existsSync(root)) return { path: relative, exists: false, files: [] };
  const visit = (directory, prefix = '') => fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      assert.equal(entry.isSymbolicLink(), false);
      const name = path.posix.join(prefix, entry.name), file = path.join(directory, entry.name);
      if (entry.isDirectory()) return visit(file, name);
      assert.equal(entry.isFile(), true);
      const bytes = fs.readFileSync(file);
      return [{ path: name, sha256: sha(bytes), bytes: bytes.length }];
    }).sort((a, b) => a.path.localeCompare(b.path));
  return { path: relative, exists: true, files: visit(root) };
}

const hostSource = String.raw`
export const getDataPickerProps = () => ({ value: null });
export const getEditorEmits = () => ['change', 'infoTextChange', 'focus', 'blur'];
export const renderString = value => String(value ?? '');
export const useNamespace = name => ({
  b: suffix => 'ibiz-' + name + (suffix ? '-' + suffix : ''),
  e: value => 'ibiz-' + name + '__' + value,
  m: value => 'ibiz-' + name + '--' + value,
  is: (value, enabled) => enabled ? 'is-' + value : '',
});
export class EditorController {
  handlePublicParams(_data, context, params) { return { context, params }; }
}
export class RuntimeModelError extends Error {}
export const getDeACMode = () => { throw new Error('Unexpected fixture AC lookup'); };
export const OpenAppViewCommand = { TAG: 'fixture-not-used' };
export const UIActionUtil = { execAndResolved() { throw new Error('Unexpected fixture action'); } };
`;

const entrySource = String.raw`
import { createApp } from 'vue';
import { ElInput, ElPopover } from 'element-plus';
import { PersonelSelect } from './source/personel-select.tsx';
import { PersonelSelectController } from './source/personel-select-controller.ts';
const language = new URL(window.location.href).searchParams.get('language') || 'zh-CN';
const english = /^en(?:[-_]|$)/i.test(language);
const calls = [], events = [], attempts = new Map();
let staleFailureSettled = false;
const failureQuery = '故障🙂e\u0301\'"\\';
const resultName = '中文成员🙂e\u0301';
const data = { assignee_id: 'fixture-existing-member' };
const original = JSON.stringify(data);
window.ibiz = {
  i18n: { getLang: () => language },
  net: { request: async (url, config) => {
    const params = structuredClone(config.data || config.params);
    const key = JSON.stringify([url, params.query || '', params.page]);
    const count = (attempts.get(key) || 0) + 1;
    attempts.set(key, count);
    calls.push({ url, params, attempt: count });
    if (params.query === 'slow') {
      await new Promise(resolve => setTimeout(resolve, 1800));
      staleFailureSettled = true;
      throw new Error('Controlled stale search failure');
    }
    await new Promise(resolve => setTimeout(resolve, 30));
    if (params.query === failureQuery && count === 1) throw new Error('Controlled search failure');
    const rows = params.query === 'empty' ? [] : [{
      user_id: params.query === 'latest' ? 'fixture-latest' : 'fixture-result',
      name: url === '/fixture-departments'
        ? (english ? 'Engineering Department' : '研发部门')
        : params.query === 'latest' ? (english ? 'Latest result' : '最新结果')
          : params.query === failureQuery ? resultName : (english ? 'Initial member' : '初始成员'),
      title: english ? 'Engineer' : '工程师',
    }];
    return { data: rows, total: rows.length, headers: { 'x-total': String(rows.length) } };
  } },
};
const controller = Object.assign(new PersonelSelectController(), {
  valueType: 'SIMPLE', valueItem: 'assignee_id', keyName: 'user_id', textName: 'name',
  model: {}, context: {}, params: {}, userUrl: '/fixture-people', deptUrl: '/fixture-departments',
  size: 2, isShowTab: true, enableBottomButton: false,
  userFilterMap: { id: 'user_id', name: 'name', title: 'title' },
  deptFilterMap: { id: 'user_id', name: 'name', title: 'title' },
});
document.querySelector('h1').textContent = english ? 'Assignee' : '负责人';
const app = createApp(PersonelSelect, {
  controller, value: english ? 'Assigned member' : '已分配成员', data, controlParams: {},
  onChange: (...args) => events.push(['change', ...args]),
});
app.component('ElInput', ElInput);
app.component('ElPopover', ElPopover);
app.mount('#picker');
Object.defineProperty(window, '__personCandidateEvidence', { get: () => ({
  controlledService: true, nativeBusinessAcceptance: false, language, calls, events,
  dataUnchanged: original === JSON.stringify(data), failureQuery, resultName, staleFailureSettled,
}) });
`;

const htmlSource = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Assignee</title><link rel="stylesheet" href="./element.css"><link rel="stylesheet" href="./plugin.css">
<style>
:root{font-family:Arial,sans-serif;color:#222;background:#fff;--ibiz-height-control-default:32px;
--ibiz-color-primary:#146b48;--ibiz-color-primary-active:#e0f3e9;--ibiz-color-primary-active-text:#164d35;
--ibiz-color-fill-1:#f0f0f0;--ibiz-color-bg-1:#fff;--ibiz-color-border:#ddd}
body{margin:24px}main{max-width:880px;margin:0 auto}h1{font-size:22px;margin:0 0 18px}
#picker{width:300px;max-width:100%;padding:12px;border:1px solid #ddd;box-sizing:border-box}
@media(max-width:600px){body{margin:16px}}
</style><script defer src="./candidate.js"></script></head>
<body><main><h1>Assignee</h1><div id="picker"></div></main></body></html>`;

export async function runPersonSelectFollowupBrowser({ output }) {
  const directory = path.resolve(output);
  assert.equal(fs.realpathSync(path.dirname(directory)), fs.realpathSync(artifacts));
  assert.match(path.basename(directory), /^person-select-browser-[A-Za-z0-9-]+$/);
  assert.equal(fs.existsSync(directory), false);
  fs.mkdirSync(directory, { mode: 0o700 });
  const report = { contract: 'person-select-source-browser-v1', startedAt: new Date().toISOString(),
    sourceBindings: [], cells: [], controlledHostServices: true, nativeBusinessAcceptance: false,
    publishedPluginChanged: false, status: 'RUNNING', fullDependencySourceClosure: false };
  const scopes = [
    'public/plugins/@ibiz-template-plm/person-select@0.0.3-alpha.434',
    'dist/plugins/@ibiz-template-plm/person-select@0.0.3-alpha.434',
    'plugin-src/@ibiz-template-plm/person-select/dist',
  ];
  report.publishedBefore = scopes.map(inventory);
  const guard = () => {
    for (const item of report.sourceBindings) {
      assert.equal(sha(fs.readFileSync(item.original)), item.originalSha256);
      assert.equal(sha(fs.readFileSync(path.join(directory, item.snapshot))), item.sha256);
    }
  };
  let browser, failure;
  try {
    const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: web, encoding: 'utf8' });
    assert.equal(git.status, 0);
    report.sourceHead = git.stdout.trim();
    for (const [relative, snapshot, fromHead = false] of [
      [`${sourceRoot}/personel-select.tsx`, 'source/personel-select.tsx'],
      [`${sourceRoot}/personel-select-controller.ts`, 'source/personel-select-controller.ts'],
      [`${sourceRoot}/personel-select.locale.ts`, 'source/personel-select.locale.ts'],
      [`${sourceRoot}/util.ts`, 'source/util.ts', true],
      [`${sourceRoot}/virtual-list.tsx`, 'source/virtual-list.tsx', true],
      [`${sourceRoot}/types.d.ts`, 'source/types.d.ts', true],
      [`${sourceRoot}/assets/styles/style.css`, 'plugin.css'],
      ['tools/tests/person-select-followup.browser.mjs', 'executed-runner.private.mjs'],
      ['../scripts/browser-launch.mjs', 'browser-launch.private.mjs'],
    ]) {
      const original = path.resolve(web, relative), current = fs.readFileSync(original);
      let bytes = current;
      if (fromHead) {
        const result = spawnSync('git', ['show', `${report.sourceHead}:${relative}`], { cwd: web, maxBuffer:4 * 1024 * 1024 });
        assert.equal(result.status, 0);
        bytes = result.stdout;
      }
      write(directory, snapshot, bytes);
      report.sourceBindings.push({ original, snapshot, sha256: sha(bytes),
        originalSha256: sha(current), source: fromHead ? 'git-head' : 'reviewed-current-candidate' });
    }
    write(directory, 'element.css', fs.readFileSync(webRequire.resolve('element-plus/dist/index.css')));
    write(directory, 'host.mjs', hostSource);
    write(directory, 'entry.mjs', entrySource);
    write(directory, 'index.html', htmlSource);
    write(directory, 'vue-jsx.mjs', "export { h } from 'vue';\n");
    const esbuild = hubRequire('esbuild'), { chromium } = hubRequire('playwright');
    report.toolchain = { node: process.version, esbuild: esbuild.version,
      vue: webRequire('vue/package.json').version, elementPlus: webRequire('element-plus/package.json').version };
    const build = await esbuild.build({
      absWorkingDir: workspace, entryPoints: [path.join(directory, 'entry.mjs')], bundle: true,
      write: false, outfile: path.join(directory, 'candidate.js'), platform: 'browser',
      format: 'iife', metafile: true, minify: false, jsxFactory: 'h',
      inject: [path.join(directory, 'vue-jsx.mjs')],
      define: { 'process.env.NODE_ENV': '"production"', __VUE_OPTIONS_API__: 'true', __VUE_PROD_DEVTOOLS__: 'false' },
      plugins: [{ name: 'declared-person-selector-host', setup(builder) {
        builder.onResolve({ filter: /^vue$/ }, () => ({ path: webRequire.resolve('vue/dist/vue.esm-bundler.js') }));
        builder.onResolve({ filter: /^element-plus$/ }, () => ({
          path: path.resolve(path.dirname(webRequire.resolve('element-plus')), '../es/index.mjs'),
        }));
        builder.onResolve({ filter: /^(?:ramda|lodash-es|qx-util)$/ }, args => ({ path: webRequire.resolve(args.path) }));
        builder.onResolve({ filter: /^@ibiz-template\/(?:vue3-util|runtime|core)$/ },
          () => ({ path: path.join(directory, 'host.mjs') }));
      } }],
    });
    for (const file of build.outputFiles) write(directory, path.relative(directory, file.path), file.contents);
    const inputs = Object.keys(build.metafile.inputs).map(relative => {
      const file = path.resolve(workspace, relative), bytes = fs.readFileSync(file);
      return { file, sha256: sha(bytes), bytes: bytes.length };
    });
    const files = ['candidate.js', 'element.css', 'plugin.css', 'index.html', 'entry.mjs', 'host.mjs', 'vue-jsx.mjs']
      .map(relative => ({ path: relative, sha256: sha(fs.readFileSync(path.join(directory, relative))) }));
    report.candidate = write(directory, 'candidate.private.json', json({ sourceBindings: report.sourceBindings,
      inputs, files, controlledHostServices: true, nativeBusinessAcceptance: false }));
    const candidateGuard = () => {
      guard();
      for (const item of inputs) assert.equal(sha(fs.readFileSync(item.file)), item.sha256);
      for (const item of files) assert.equal(sha(fs.readFileSync(path.join(directory, item.path))), item.sha256);
    };
    candidateGuard();
    browser = await launchChromium(chromium);
    report.browserVersion = browser.version();
    for (const [language, viewportName, viewport] of [
      ['zh-CN', 'desktop', { width: 1280, height: 800 }], ['en-US', 'desktop', { width: 1280, height: 800 }],
      ['zh-CN', 'mobile', { width: 390, height: 844 }], ['en-US', 'mobile', { width: 390, height: 844 }],
    ]) {
      const cell = { language, viewportName, viewport, consoleErrors: [], pageErrors: [],
        failedRequests: [], blockedRequests: [], screenshots: [], contextClosed: false };
      report.cells.push(cell);
      const context = await browser.newContext({ locale: language, viewport });
      try {
        const page = await context.newPage();
        page.on('console', message => { if (message.type() === 'error') cell.consoleErrors.push(message.text()); });
        page.on('pageerror', error => cell.pageErrors.push(error.message));
        page.on('requestfailed', request => cell.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
        await page.route('**/*', route => {
          const url = new URL(route.request().url());
          if (url.protocol === 'file:' && path.dirname(fileURLToPath(url)) === directory &&
            ['index.html', 'candidate.js', 'element.css', 'plugin.css'].includes(path.basename(url.pathname))) {
            return route.continue();
          }
          cell.blockedRequests.push({ url: url.href, method: route.request().method() });
          return route.abort();
        });
        const entry = pathToFileURL(path.join(directory, 'index.html'));
        entry.searchParams.set('language', language);
        await page.goto(entry.href);
        await page.locator('.ibiz-picker-dropdown__select-value').click();
        const input = page.getByPlaceholder(language === 'zh-CN' ? '搜索' : 'Search');
        await input.waitFor({ state: 'visible' });
        await page.getByText(language === 'zh-CN' ? '初始成员' : 'Initial member', { exact: true }).waitFor();
        const fixture = await page.evaluate(() => window.__personCandidateEvidence);
        await input.fill(fixture.failureQuery);
        await page.getByRole('alert').waitFor();
        assert.equal(await page.getByRole('alert').textContent(), language === 'zh-CN' ? '加载失败' : 'Failed to load');
        assert.equal(await page.getByText(language === 'zh-CN' ? '暂无数据' : 'No Data', { exact: true }).count(), 0);
        cell.failureGeometry = await page.evaluate(() => {
          const rect = element => {
            const value = element.getBoundingClientRect();
            return { x: value.x, y: value.y, width: value.width, height: value.height,
              right: value.right, bottom: value.bottom };
          };
          const alert = document.querySelector('[role="alert"]');
          const button = alert.parentElement.querySelector('button');
          const people = document.querySelector('.ibiz-picker-dropdown__select-state-select-personel');
          const department = document.querySelector('.ibiz-picker-dropdown__select-state-select-department');
          return { alert: rect(alert), retry: rect(button), people: rect(people), department: rect(department),
            popup: rect(document.querySelector('.ibiz-picker-dropdown-person-select')),
            horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
            viewport: { width: window.innerWidth, height: window.innerHeight } };
        });
        assert.ok(cell.failureGeometry.alert.right <= cell.failureGeometry.retry.x);
        assert.ok(Math.abs(cell.failureGeometry.people.y - cell.failureGeometry.department.y) < 1);
        assert.ok(cell.failureGeometry.people.right <= cell.failureGeometry.department.x + 1);
        assert.ok(cell.failureGeometry.popup.x >= 0);
        assert.ok(cell.failureGeometry.popup.right <= viewport.width);
        assert.ok(cell.failureGeometry.popup.bottom <= viewport.height);
        assert.equal(cell.failureGeometry.horizontalOverflow, false);
        const screenshot = async stage => {
          const name = `${language}-${viewportName}-${stage}.png`;
          await page.screenshot({ path: path.join(directory, name), fullPage: true });
          fs.chmodSync(path.join(directory, name), 0o600);
          cell.screenshots.push({ path: name, sha256: sha(fs.readFileSync(path.join(directory, name))) });
        };
        await screenshot('failure');
        await page.getByRole('button', { name: language === 'zh-CN' ? '重试' : 'Retry', exact: true }).click();
        await page.getByText(fixture.resultName, { exact: true }).waitFor();
        await screenshot('recovered');
        await input.fill('empty');
        await page.getByText(language === 'zh-CN' ? '暂无数据' : 'No Data', { exact: true }).waitFor();
        assert.equal(await page.getByRole('alert').count(), 0);
        await input.fill('slow');
        await page.waitForFunction(() => window.__personCandidateEvidence.calls.some(call => call.params.query === 'slow'));
        await input.fill('latest');
        await page.getByText(language === 'zh-CN' ? '最新结果' : 'Latest result', { exact: true }).waitFor();
        await page.waitForFunction(() => window.__personCandidateEvidence.staleFailureSettled);
        assert.equal(await page.getByRole('alert').count(), 0);
        await page.locator('.ibiz-picker-dropdown__select-state-select-department').click();
        await page.getByText(language === 'zh-CN' ? '研发部门' : 'Engineering Department', { exact: true }).waitFor();
        cell.observation = await page.evaluate(() => ({
          ...window.__personCandidateEvidence,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        }));
        const retries = cell.observation.calls.filter(call => call.params.query === fixture.failureQuery);
        assert.equal(retries.length, 2);
        assert.deepEqual(retries.map(call => call.params.page), [0, 0]);
        assert.equal(cell.observation.dataUnchanged, true);
        assert.equal(cell.observation.events.length, 0);
        assert.equal(cell.observation.horizontalOverflow, false);
        for (const errors of [cell.consoleErrors, cell.pageErrors, cell.failedRequests, cell.blockedRequests]) {
          assert.equal(errors.length, 0);
        }
        candidateGuard();
        cell.status = 'PASS_CONTROLLED_SEARCH_FAILURE_RETRY_EMPTY_AND_STALE';
      } finally {
        await context.close();
        cell.contextClosed = true;
      }
    }
    candidateGuard();
    report.status = 'PASS_CONTROLLED_PERSON_SELECTOR_FOUR_CELLS';
  } catch (error) {
    failure = error;
    report.status = 'FAILED_CONTROLLED_PERSON_SELECTOR';
    report.failure = { name: error.name, message: error.message };
  } finally {
    try {
      if (browser) await browser.close();
      report.browserClosed = true;
      guard();
      report.sourceHashesVerifiedAfter = true;
      report.publishedAfter = scopes.map(inventory);
      assert.deepEqual(report.publishedAfter, report.publishedBefore);
      report.publishedPluginScopesUnchanged = true;
    } catch (error) {
      failure ||= error;
      report.status = 'FAILED_CONTROLLED_PERSON_SELECTOR_CLEANUP';
      report.cleanupFailure = { name: error.name, message: error.message };
    }
    report.finishedAt = new Date().toISOString();
    write(directory, 'report.private.json', json(report));
  }
  if (failure) throw failure;
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { values } = parseArgs({ options: { output: { type: 'string' } }, strict: true });
  try {
    const report = await runPersonSelectFollowupBrowser({ output: values.output });
    console.log(json({ status: report.status, cells: report.cells.length,
      output: path.resolve(values.output), browserClosed: report.browserClosed }));
  } catch (error) {
    console.error(json({ status: 'FAILED_CONTROLLED_PERSON_SELECTOR', message: error.message }));
    process.exitCode = 1;
  }
}
