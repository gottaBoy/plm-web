#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { appendFile, cp, mkdir, readFile, readdir, realpath, stat, writeFile } from 'node:fs/promises';
import { createServer, request as proxyRequest } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appPath = '/ibizplm-plmweb/';
const apiPrefix = '/api/ibizplm__plmweb';
const bootstrapRequests = new Set([
  `GET ${apiPrefix}/appdata`,
  `GET ${apiPrefix}/uaa/getbydcsystem/ibizplm`,
  `POST ${apiPrefix}/v7/login`,
  `POST ${apiPrefix}/v7/logout`,
]);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const mime = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.gif': 'image/gif', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.wasm': 'application/wasm',
};

export async function treeInventory(root, prefix = '') {
  const files = [];
  for (const entry of await readdir(path.join(root, prefix), { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Candidate inputs must not contain symlinks: ${relative}`);
    if (entry.isDirectory()) files.push(...await treeInventory(root, relative));
    else if (entry.isFile()) {
      const bytes = await readFile(path.join(root, relative));
      files.push({ path: relative, bytes: bytes.length, sha256: digest(bytes) });
    }
  }
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function validReadRequest({ method, pathname } = {}) {
  if (!['GET', 'POST'].includes(method) || typeof pathname !== 'string' ||
    !pathname.startsWith(`${apiPrefix}/`) || /[%\\?#\s]/.test(pathname)) return false;
  const segments = pathname.slice(apiPrefix.length + 1).split('/');
  if (segments.some(segment => !/^[a-zA-Z0-9_-]+$/.test(segment))) return false;
  if (['portal', 'uaa', 'v7', 'ibizutil', 'webhooks', 'extension'].includes(segments[0])) return false;
  const reserved = ['getdraft', 'get_draft', 'save', 'checkkey', 'check_key',
    'remove', 'create', 'update', 'delete'];
  return method === 'GET'
    ? segments.length === 2 && !reserved.includes(segments[1].toLowerCase()) &&
      !segments[1].toLowerCase().startsWith('fetch_')
    : segments.length >= 2 && /^fetch_[a-z0-9_]+$/.test(segments.at(-1));
}

export function isAllowedPlmQuery(method, pathname, reviewedReads = []) {
  if (bootstrapRequests.has(`${method} ${pathname}`)) return true;
  return reviewedReads.some(read => validReadRequest(read) &&
    read.method === method && read.pathname === pathname);
}

async function contained(root, relative) {
  const resolved = await realpath(path.resolve(root, relative));
  assert.ok(resolved.startsWith(`${root}${path.sep}`), 'File escapes candidate root');
  return resolved;
}

export async function assemblePlmHost({ output, dist, candidate, framework }) {
  const parent = await realpath(path.dirname(path.resolve(output)));
  const destination = path.join(parent, path.basename(output));
  assert.ok(!destination.startsWith(`${project}${path.sep}`), 'Host output must be outside the live project');
  const sourceDist = await realpath(dist);
  const candidateRoot = await realpath(candidate);
  const manifest = JSON.parse(await readFile(path.join(candidateRoot, 'manifest.json'), 'utf8'));
  assert.equal(manifest.deployed, false);
  assert.equal(manifest.nativeAcceptance, false);
  const before = await treeInventory(sourceDist);
  const expected = new Map(before.map(file => [file.path, file]));
  await mkdir(destination);
  const ownedDist = path.join(destination, 'dist');
  await mkdir(ownedDist);
  // Reflinks copy on write, unlike hardlinks, and cannot modify the shared dist.
  await new Promise((resolve, reject) => {
    const child = spawn('cp', ['--archive', '--reflink=auto', `${sourceDist}/.`, ownedDist], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Snapshot copy failed: ${code}`)));
  });
  const plugins = [];
  for (const plugin of manifest.plugins) {
    assert.match(plugin.key, /^[a-z]+$/);
    assert.equal(plugin.ref, `${plugin.packageJson.name}@${plugin.packageJson.version}`);
    const target = await contained(ownedDist, path.join('plugins', plugin.ref));
    const published = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'));
    assert.equal(published.name, plugin.packageJson.name);
    assert.equal(published.version, plugin.packageJson.version);
    for (const file of plugin.outputs) {
      const source = await contained(candidateRoot, path.join('candidates', plugin.key, 'dist', file.path));
      const bytes = await readFile(source);
      assert.equal(digest(bytes), file.sha256, 'Candidate file must match its manifest');
      const relative = path.posix.join('plugins', plugin.ref, 'dist', file.path);
      const targetFile = path.resolve(ownedDist, relative);
      assert.ok(targetFile.startsWith(`${target}${path.sep}`), 'Plugin output must stay inside its package');
      await mkdir(path.dirname(targetFile), { recursive: true });
      await cp(source, targetFile);
      expected.set(relative, { path: relative, bytes: bytes.length, sha256: file.sha256 });
    }
    plugins.push({ ref: plugin.ref, key: plugin.key, outputs: plugin.outputs });
  }
  const frameworks = [];
  if (framework) {
    const frameworkRoot = await realpath(framework);
    const receipt = JSON.parse(await readFile(path.join(frameworkRoot, 'framework-build.json'), 'utf8'));
    assert.equal(receipt.package.name, '@ibiz-template/vue3-util');
    assert.equal(receipt.originalDistUnchanged, true);
    const builtDist = await contained(frameworkRoot, path.relative(frameworkRoot, receipt.dist));
    const target = await contained(ownedDist, 'extras/js/@ibiz-template/vue3-util');
    for (const file of receipt.files) {
      const source = await contained(builtDist, file.path);
      const bytes = await readFile(source);
      assert.equal(digest(bytes), file.sha256, 'Framework file must match its source build receipt');
      const targetFile = path.resolve(target, file.path);
      assert.ok(targetFile.startsWith(`${target}${path.sep}`));
      await mkdir(path.dirname(targetFile), { recursive: true });
      await cp(source, targetFile);
      const relative = path.posix.join('extras/js/@ibiz-template/vue3-util', file.path);
      expected.set(relative, { path: relative, bytes: bytes.length, sha256: file.sha256 });
    }
    frameworks.push({
      package: receipt.package.name, version: receipt.package.version,
      sourceBuildReceipt: path.join(frameworkRoot, 'framework-build.json'),
      sourceBuildReceiptSha256: digest(await readFile(path.join(frameworkRoot, 'framework-build.json'))),
      files: receipt.files,
    });
  }
  const files = await treeInventory(ownedDist);
  assert.deepEqual(files, [...expected.values()].sort((a, b) => a.path.localeCompare(b.path)), 'Only declared candidate outputs may differ');
  assert.deepEqual(await treeInventory(sourceDist), before, 'Shared frontend dist must remain unchanged');
  const report = {
    status: 'assembled-not-deployed', sharedFrontendChanged: false,
    nativeAcceptance: false, backendIsolated: false, mockedRuntime: false,
    scope: 'complete PLM frontend snapshot with four plugin candidates; backend access is read-only',
    sourceDist, candidateRoot, plugins, frameworks, sourceFiles: before, files,
    artifactSha256: digest(JSON.stringify(files)),
  };
  await writeFile(path.join(destination, 'host-manifest.json'), JSON.stringify(report, null, 2), { flag: 'wx' });
  console.log(`PLM candidate assembled: ${destination}`);
  return report;
}

export async function buildPlmHostSource(output) {
  assert.ok(typeof output === 'string' && output.trim(), 'A fresh source-build output is required');
  const destination = path.join(await realpath(path.dirname(path.resolve(output))), path.basename(output));
  assert.ok(!destination.startsWith(`${project}${path.sep}`), 'Source build must be outside the live project');
  await mkdir(destination);
  const before = await treeInventory(path.join(project, 'dist'));
  const sourceBefore = await treeInventory(path.join(project, 'src'));
  // A file-based CLI avoids inheriting an ESM --input-type flag in the
  // CommonJS legacy minifier worker.
  const viteCli = path.join(project, 'node_modules/vite/bin/vite.js');
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      viteCli,
      'build',
      '--outDir',
      path.join(destination, 'dist'),
    ], { cwd: project, stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', code => code === 0
      ? resolve()
      : reject(new Error(`Vite source build exited with ${code}`)));
  });
  assert.deepEqual(await treeInventory(path.join(project, 'dist')), before, 'Source build must not modify shared dist');
  assert.deepEqual(await treeInventory(path.join(project, 'src')), sourceBefore, 'Source inputs changed during build');
  await writeFile(path.join(destination, 'source-build.json'), JSON.stringify({
    freshApplicationBuild: true, frameworkPackagesFreshlyBuilt: false,
    sharedDistUnchanged: true, sourceFiles: sourceBefore,
    sharedDistSha256: digest(JSON.stringify(before)),
    outputFiles: await treeInventory(path.join(destination, 'dist')),
  }, null, 2), { flag: 'wx' });
  console.log(`Fresh application candidate: ${destination}`);
}

export async function createPlmCandidateServer({ dist, upstream, reviewedReads = [], log = () => {} }) {
  dist = await realpath(dist);
  assert.ok(Array.isArray(reviewedReads) && reviewedReads.every(validReadRequest),
    'Candidate read requests must be exact, reviewed business read paths');
  const reads = reviewedReads.map(({ method, pathname }) => ({ method, pathname }));
  const target = new URL(upstream);
  assert.ok(target.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(target.hostname) &&
    !target.username && !target.password && target.pathname === '/' && !target.search && !target.hash,
  'Upstream must be an explicit loopback HTTP origin');
  const respond = (response, status, body) => {
    response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    response.end(JSON.stringify(body));
  };
  const server = createServer(async (request, response) => {
    let url;
    try {
      const host = new URL(`http://${request.headers.host}`);
      assert.ok(['127.0.0.1', 'localhost'].includes(host.hostname));
      assert.ok(!request.headers.origin || request.headers.origin === host.origin);
      assert.ok(request.url.startsWith('/') && !request.url.startsWith('//') &&
        !/[\\#]/.test(request.url));
      url = new URL(request.url, 'http://candidate.invalid');
      assert.equal(url.origin, 'http://candidate.invalid');
      assert.equal(request.url.split('?')[0], url.pathname, 'Normalized request paths are not admitted');
    } catch {
      respond(response, 403, { code: 'CANDIDATE_ORIGIN_DENIED' });
      return;
    }
    response.once('finish', () => { void log({ method: request.method, path: url.pathname, status: response.statusCode }); });
    if (url.pathname === '/__candidate/health') {
      respond(response, 200, {
        mockedRuntime: false, backendIsolated: false, explicitMutationsBlocked: true,
        authenticationExceptions: true, explicitBusinessReadCount: reads.length, deployed: false,
      });
      return;
    }
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ibizutil/')) {
      if (!isAllowedPlmQuery(request.method, url.pathname, reads)) {
        respond(response, 403, { code: 'CANDIDATE_READ_ONLY', message: 'Business mutations and uploads are blocked.' });
        return;
      }
      const headers = { ...request.headers };
      for (const name of ['connection', 'proxy-connection', 'keep-alive', 'te', 'trailer', 'transfer-encoding', 'upgrade']) delete headers[name];
      const address = new URL(`${url.pathname}${url.search}`, target);
      const outgoing = proxyRequest(address, { method: request.method, headers, timeout: 30_000 }, incoming => {
        const resultHeaders = { ...incoming.headers, 'cache-control': 'no-store' };
        for (const name of ['connection', 'transfer-encoding']) delete resultHeaders[name];
        response.writeHead(incoming.statusCode, resultHeaders);
        incoming.pipe(response);
      });
      outgoing.once('timeout', () => outgoing.destroy(new Error('Upstream timeout')));
      outgoing.once('error', () => {
        if (response.headersSent) response.destroy();
        else respond(response, 502, { code: 'CANDIDATE_UPSTREAM_UNAVAILABLE' });
      });
      request.pipe(outgoing);
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      respond(response, 405, { code: 'CANDIDATE_STATIC_READ_ONLY' });
      return;
    }
    if (url.pathname === '/' || url.pathname === appPath.slice(0, -1)) {
      response.writeHead(302, { Location: appPath });
      response.end();
      return;
    }
    if (!url.pathname.startsWith(appPath)) {
      respond(response, 404, { code: 'CANDIDATE_PATH_NOT_FOUND' });
      return;
    }
    try {
      const relative = decodeURIComponent(url.pathname.slice(appPath.length)) || 'index.html';
      const file = await contained(dist, relative.endsWith('/') ? `${relative}index.html` : relative);
      const info = await stat(file);
      assert.ok(info.isFile());
      response.writeHead(200, {
        'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
        'Content-Length': info.size, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      });
      if (request.method === 'HEAD') response.end();
      else createReadStream(file).on('error', () => response.destroy()).pipe(response);
    } catch {
      respond(response, 404, { code: 'CANDIDATE_ASSET_NOT_FOUND' });
    }
  });
  server.on('upgrade', (request, socket) => {
    void log({ method: 'UPGRADE', path: '/', status: 403 });
    socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
  });
  return server;
}

async function main() {
  const [command, directory, argument, sourceDist, framework] = process.argv.slice(2);
  assert.ok(directory, 'Usage: plm-candidate-host.mjs build|assemble|serve <new-artifact-dir> [candidate-dir|upstream] [source-dist] [framework-candidate]');
  const output = path.resolve(directory);
  if (command === 'build') {
    await buildPlmHostSource(output);
  } else if (command === 'assemble') {
    assert.ok(argument, 'A plugin candidate directory is required');
    await assemblePlmHost({
      output, dist: sourceDist ? path.resolve(sourceDist) : path.join(project, 'dist'),
      candidate: path.resolve(argument),
      framework: framework ? path.resolve(framework) : undefined,
    });
  } else if (command === 'serve') {
    const report = JSON.parse(await readFile(path.join(output, 'host-manifest.json'), 'utf8'));
    const dist = path.join(output, 'dist');
    assert.equal(digest(JSON.stringify(await treeInventory(dist))), report.artifactSha256, 'Host snapshot bytes changed');
    const log = event => appendFile(path.join(output, 'server-requests.jsonl'),
      `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`, { mode: 0o600 });
    const server = await createPlmCandidateServer({
      dist, upstream: argument || 'http://127.0.0.1:30250', log,
    });
    server.listen(0, '127.0.0.1', () => console.log(`PLM candidate host: http://127.0.0.1:${server.address().port}${appPath}`));
  } else throw new Error(`Unknown command: ${command}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
