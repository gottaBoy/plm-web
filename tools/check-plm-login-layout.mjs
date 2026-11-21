#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createPlmCandidateServer, treeInventory } from './plm-candidate-host.mjs';
import { launchChromium } from '../../scripts/browser-launch.mjs';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.dirname(project);
const require = createRequire(path.join(workspace, 'plm-e2e/package.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const basePath = '/ibizplm-plmweb/';
const loginPath = '#/-/index/-/workspace_tab_exp_view/srfnav=dashboard/recent_custom_dashboard_view/-';
const selectors = {
  view: '.ibiz-view--apploginview',
  card: '.ibiz-view--apploginview .pc_login_style .ibiz-panel-container--container1',
  header: '.ibiz-view--apploginview .pc_login_style .ibiz-panel-container--container_4',
  title: '.ibiz-view--apploginview .pc_login_style .ibiz-panel-app-title__title',
  account: '.ibiz-panel-field--auth_userid input',
  password: '.ibiz-panel-field--auth_password input[type="password"]',
  submit: '.ibiz-panel-container--container3 button',
  language: 'button[aria-label="Language / 语言"]',
};

export const loginLayoutViewports = Object.freeze([
  { name: 'narrow-phone', width: 320, height: 740 },
  { name: 'small-phone', width: 360, height: 640 },
  { name: 'phone', width: 390, height: 844 },
  { name: 'large-phone', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'short-desktop', width: 1280, height: 720 },
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'wide-desktop', width: 1920, height: 1080 },
]);

export async function measureLoginLayout(page) {
  return page.evaluate(names => {
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { left: value.left, top: value.top, right: value.right, bottom: value.bottom,
        width: value.width, height: value.height };
    };
    const visible = element => {
      const style = getComputedStyle(element);
      const value = rect(element);
      return style.display !== 'none' && style.visibility !== 'hidden' &&
        Number(style.opacity) !== 0 && value.width > 0 && value.height > 0;
    };
    const view = document.querySelector(names.view);
    const card = document.querySelector(names.card);
    const header = document.querySelector(names.header);
    const title = document.querySelector(names.title);
    if (!view || !card || !header || !title) throw new Error('The native login title/card is missing');
    const textRects = [];
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const value of range.getClientRects()) {
        textRects.push({ left: value.left, top: value.top, right: value.right,
          bottom: value.bottom, width: value.width, height: value.height });
      }
    }
    const style = getComputedStyle(title);
    const controls = Object.fromEntries(['account', 'password', 'submit', 'language'].map(key => {
      const element = view.querySelector(names[key]);
      return [key, element ? { ...rect(element), visible: visible(element) } : null];
    }));
    return {
      viewport: { width: innerWidth, height: innerHeight,
        documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth },
      card: rect(card), header: rect(header), title: rect(title), textRects, controls,
      titleText: title.textContent.trim(),
      style: { fontSize: style.fontSize, lineHeight: style.lineHeight,
        whiteSpace: style.whiteSpace, overflowWrap: style.overflowWrap, letterSpacing: style.letterSpacing },
    };
  }, selectors);
}

export function assertLoginLayout(layout, language) {
  const tolerance = 1;
  const contains = (outer, inner) => inner.left >= outer.left - tolerance &&
    inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance &&
    inner.bottom <= outer.bottom + tolerance;
  assert.ok(layout.viewport.documentWidth <= layout.viewport.width + tolerance &&
    layout.viewport.bodyWidth <= layout.viewport.width + tolerance, 'Login page has horizontal overflow');
  assert.ok(layout.card.left >= -tolerance &&
    layout.card.right <= layout.viewport.width + tolerance, 'Login card escapes the viewport');
  assert.ok(contains(layout.card, layout.header), 'Title header escapes the login card');
  assert.ok(contains(layout.header, layout.title), 'Title element escapes its header');
  assert.ok(layout.textRects.length > 0, 'Title text has no rendered lines');
  assert.equal(layout.style.fontSize, '24px', 'Login title must use the same fixed font size');
  assert.equal(layout.style.whiteSpace, 'normal', 'Login title must allow wrapping');
  for (const line of layout.textRects) {
    assert.ok(contains(layout.title, line), 'A rendered title line is clipped by its title element');
    assert.ok(contains(layout.header, line), 'A rendered title line escapes the header');
    assert.ok(line.left >= layout.card.left + 23 && line.right <= layout.card.right - 23,
      'Title text must retain 24px of card-side breathing room');
  }
  if (language === 'en') assert.equal(layout.titleText, 'Product Lifecycle Management');
  else assert.match(layout.titleText, /生命周期管理系统/);
  for (const [name, control] of Object.entries(layout.controls)) {
    assert.ok(control?.visible, `Login ${name} control is not visible`);
    assert.ok(contains(layout.card, control), `Login ${name} control escapes the card`);
    assert.ok(control.left >= -tolerance && control.right <= layout.viewport.width + tolerance &&
      control.top >= -tolerance && control.bottom <= layout.viewport.height + tolerance,
    `Login ${name} control is outside the viewport`);
  }
}

export async function checkPlmLoginLayout({ candidate, upstream, output, previewSourceCss = false }) {
  assert.ok(candidate && upstream && output, 'candidate, upstream and a fresh private output are required');
  const destination = path.resolve(output);
  assert.equal(await realpath(path.dirname(destination)), path.join(workspace, '.artifacts'));
  const candidateRoot = await realpath(candidate);
  const dist = await realpath(path.join(candidateRoot, 'dist'));
  const receiptBytes = await readFile(path.join(candidateRoot, 'source-build.json'));
  const receipt = JSON.parse(receiptBytes);
  assert.equal(receipt.freshApplicationBuild, true);
  assert.equal(receipt.sharedDistUnchanged, true);
  assert.deepEqual(await treeInventory(dist), receipt.outputFiles, 'Candidate bytes drifted after its source build');
  const css = await readFile(path.join(project, 'src/runtime/login-layout.css'), 'utf8');
  if (!previewSourceCss) {
    const boundCss = receipt.sourceFiles.find(file => file.path === 'runtime/login-layout.css');
    assert.equal(boundCss?.sha256, hash(css), 'Build a candidate containing the current login layout source');
  }
  await mkdir(destination, { mode: 0o700 });
  const report = {
    scope: 'Native PLM pre-login layout only; no authentication/business or deployment acceptance',
    nativeAcceptance: false, sharedDeployment: false, businessWritesExecuted: false,
    previewSourceCss, candidate, cssSha256: hash(css),
    sourceBuildReceiptSha256: hash(receiptBytes),
    checkerSha256: hash(await readFile(fileURLToPath(import.meta.url))),
    cells: [], serverRequests: [], errors: [], startedAt: new Date().toISOString(),
  };
  let server, browser;
  try {
    server = await createPlmCandidateServer({
      dist, upstream, log: event => report.serverRequests.push(event),
    });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    const { chromium } = require('@playwright/test');
    browser = await launchChromium(chromium);
    for (const language of ['zh-CN', 'en']) {
      for (const viewport of loginLayoutViewports) {
        const cell = { language, viewport, pageErrors: [], consoleErrors: [], httpErrors: [],
          failedRequests: [], externalRequests: [], errors: [], closed: false };
        report.cells.push(cell);
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }, locale: language,
        });
        try {
          await context.addInitScript(language => localStorage.setItem('language', language), language);
          await context.route('**/*', route => {
            const url = new URL(route.request().url());
            if (url.origin === origin || ['data:', 'blob:'].includes(url.protocol)) return route.continue();
            cell.externalRequests.push({ method: route.request().method(), origin: url.origin, path: url.pathname });
            return route.abort('blockedbyclient');
          });
          const page = await context.newPage();
          page.on('pageerror', error => cell.pageErrors.push(error.message));
          page.on('console', message => {
            if (message.type() === 'error') cell.consoleErrors.push(message.text());
          });
          page.on('requestfailed', request => cell.failedRequests.push({
            method: request.method(), path: new URL(request.url()).pathname,
            reason: request.failure()?.errorText,
          }));
          page.on('response', response => {
            if (response.status() >= 400) cell.httpErrors.push({
              method: response.request().method(), path: new URL(response.url()).pathname, status: response.status(),
            });
          });
          await page.goto(`${origin}${basePath}${loginPath}`, { waitUntil: 'load', timeout: 60_000 });
          await page.locator(selectors.password).waitFor({ state: 'visible', timeout: 30_000 });
          await page.waitForLoadState('networkidle', { timeout: 20_000 });
          assert.equal(await page.locator('html').getAttribute('lang'), language);
          if (previewSourceCss) await page.addStyleTag({ content: css });
          await page.evaluate(() => document.fonts.ready);
          cell.layout = await measureLoginLayout(page);
          await page.screenshot({ path: path.join(destination, `${viewport.name}-${language}.png`),
            fullPage: true, animations: 'disabled' });
          assertLoginLayout(cell.layout, language);
        } catch (error) {
          cell.errors.push(error.message);
        } finally {
          try { await context.close(); cell.closed = true; }
          catch (error) { cell.errors.push(`Context close failed: ${error.message}`); }
        }
        cell.passed = cell.closed && ['pageErrors', 'consoleErrors', 'httpErrors', 'failedRequests',
          'externalRequests', 'errors'].every(key => cell[key].length === 0);
        console.log(`${viewport.name}/${language}: ${cell.passed ? 'PASS' : 'FAIL'}`);
      }
    }
  } catch (error) {
    report.errors.push(error.message);
  } finally {
    if (browser) {
      try { await browser.close(); }
      catch (error) { report.errors.push(`Browser close failed: ${error.message}`); }
    }
    if (server) await new Promise(resolve => {
      server.close(resolve);
      server.closeAllConnections();
    });
    report.finishedAt = new Date().toISOString();
    report.passed = report.errors.length === 0 && report.cells.length === 16 &&
      report.cells.every(cell => cell.passed);
    report.status = report.passed
      ? previewSourceCss ? 'passed-source-css-preview-only' : 'passed-built-candidate-login-layout-only'
      : 'failed';
    await writeFile(path.join(destination, 'report.private.json'), `${JSON.stringify(report, null, 2)}\n`,
      { flag: 'wx', mode: 0o600 });
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: {
    candidate: { type: 'string' }, upstream: { type: 'string' }, output: { type: 'string' },
    'preview-source-css': { type: 'boolean', default: false },
  } });
  checkPlmLoginLayout({ ...values, previewSourceCss: values['preview-source-css'] }).then(report => {
    console.log(JSON.stringify({ status: report.status, output: values.output,
      failed: report.cells.filter(cell => !cell.passed).map(cell => ({
        language: cell.language, viewport: cell.viewport.name, errors: cell.errors,
        consoleErrors: cell.consoleErrors, httpErrors: cell.httpErrors, pageErrors: cell.pageErrors,
      })), errors: report.errors }, null, 2));
    process.exitCode = report.passed ? 0 : 1;
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
