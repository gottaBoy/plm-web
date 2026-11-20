import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createPlmCandidateServer, isAllowedPlmQuery } from '../plm-candidate-host.mjs';

const candidateHostSource = readFileSync(
  new URL('../plm-candidate-host.mjs', import.meta.url),
  'utf8',
);

test('source candidate builds use the CLI entry to preserve Vite legacy terser under ESM callers', () => {
  assert.match(candidateHostSource, /node_modules\/vite\/bin\/vite\.js/);
  assert.match(candidateHostSource, /spawn\(process\.execPath/);
  assert.doesNotMatch(candidateHostSource, /await import\(['"]vite['"]\)/);
});

test('PLM candidate admits only exact bootstrap requests by default', () => {
  for (const url of [
    '/api/ibizplm__plmweb/v7/login', '/api/ibizplm__plmweb/v7/logout',
  ]) assert.equal(isAllowedPlmQuery('POST', url), true, url);
  for (const url of [
    '/api/ibizplm__plmweb/appdata',
    '/api/ibizplm__plmweb/uaa/getbydcsystem/ibizplm',
  ]) assert.equal(isAllowedPlmQuery('GET', url), true, url);
  for (const url of [
    '/api/ibizplm__plmweb/products/fetch_main',
    '/api/ibizplm__plmweb/products/id/product_index_addon_counter',
    '/api/ibizplm__other/products/fetch_main', '/api/ibizplm__plmweb/users/id',
    '/api/ibizplm__plmweb/products/id/update', '/api/ibizplm__plmweb/products/id/product_index_addon_counter_extra',
    '/api/ibizplm__plmweb/pages/id/check_access_password', '/ibizutil/upload/ibizplm',
    '/api/ibizplm__plmweb/recents/my_summary',
  ]) assert.equal(isAllowedPlmQuery('POST', url), false, url);
  for (const method of ['PUT', 'PATCH', 'DELETE']) {
    assert.equal(isAllowedPlmQuery(method, '/api/ibizplm__plmweb/products/fetch_main'), false);
  }
  for (const url of [
    '/api/ibizplm__plmweb/portal/markopendata/space/id/VIEW',
    '/api/ibizplm__plmweb/portal/asyncaction/id/cancel',
    '/api/ibizplm__plmweb/users/getdraft',
    '/api/ibizplm__plmweb/users/id',
    '/api/ibizplm__plmweb/uaa/refresh_token',
  ]) assert.equal(isAllowedPlmQuery('GET', url), false, url);
});

test('reviewed reads admit only exact methods and paths', async () => {
  const reads = [
    { method: 'POST', pathname: '/api/ibizplm__plmweb/products/fetch_main' },
    { method: 'GET', pathname: '/api/ibizplm__plmweb/spaces/plm_space' },
  ];
  assert.equal(isAllowedPlmQuery('GET', reads[1].pathname, reads), true);
  assert.equal(isAllowedPlmQuery('POST', reads[0].pathname, reads), true);
  assert.equal(isAllowedPlmQuery('GET', reads[0].pathname, reads), false);
  assert.equal(isAllowedPlmQuery('GET', `${reads[1].pathname}_other`, reads), false);
  for (const read of [
    { method: 'PUT', pathname: '/api/ibizplm__plmweb/spaces/id' },
    { method: 'GET', pathname: '/api/ibizplm__plmweb/portal/VIEW' },
    { method: 'POST', pathname: '/api/ibizplm__plmweb/spaces/save' },
    { method: 'GET', pathname: '/api/ibizplm__plmweb/spaces/%2f' },
    { method: 'GET', pathname: '/api/ibizplm__plmweb/users/getdraft' },
    { method: 'GET', pathname: '/api/ibizplm__plmweb/products/fetch_main' },
  ]) {
    assert.equal(isAllowedPlmQuery(read.method, read.pathname, [read]), false);
    await assert.rejects(createPlmCandidateServer({
      dist: path.resolve('.'), upstream: 'http://127.0.0.1:1', reviewedReads: [read],
    }), /exact, reviewed/);
  }
});

test('PLM host serves native bytes, blocks mutation/origin/path bypasses before upstream', async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'plm-host-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const dist = path.join(root, 'dist');
  await mkdir(dist);
  await writeFile(path.join(dist, 'index.html'), 'native host');
  await writeFile(path.join(root, 'secret.txt'), 'not served');
  await symlink(path.join(root, 'secret.txt'), path.join(dist, 'escape.txt'));
  const seen = [];
  const upstream = createServer((req, res) => {
    seen.push({ method: req.method, path: req.url });
    req.resume();
    res.setHeader('Content-Type', 'application/json');
    res.end('{"native":true}');
  });
  await new Promise(resolve => upstream.listen(0, '127.0.0.1', resolve));
  t.after(() => { upstream.closeAllConnections(); upstream.close(); });
  const reads = [{ method: 'POST', pathname: '/api/ibizplm__plmweb/products/fetch_main' }];
  const server = await createPlmCandidateServer({
    dist, upstream: `http://127.0.0.1:${upstream.address().port}`,
    reviewedReads: reads,
  });
  reads[0].pathname = '/api/ibizplm__plmweb/ideas/fetch_default';
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal(await (await fetch(`${base}/ibizplm-plmweb/`)).text(), 'native host');
  for (const suffix of ['missing.js', 'escape.txt', '%2e%2e%2fsecret.txt']) {
    assert.equal((await fetch(`${base}/ibizplm-plmweb/${suffix}`)).status, 404);
  }
  for (const [method, url] of [
    ['POST', '/api/ibizplm__plmweb/ideas'],
    ['PUT', '/api/ibizplm__plmweb/users/id'],
    ['POST', '/ibizutil/upload/ibizplm'],
    ['GET', '/api/ibizplm__plmweb/portal/markopendata/space/id/VIEW'],
    ['POST', '/api/ibizplm__plmweb/ideas/fetch_default'],
  ]) assert.equal((await fetch(base + url, { method })).status, 403);
  assert.equal(seen.length, 0);
  assert.equal((await fetch(`${base}/api/ibizplm__plmweb/appdata`, {
    headers: { origin: 'http://unrelated.invalid' },
  })).status, 403);
  const hostileStatus = await new Promise((resolve, reject) => {
    const req = request(`${base}/api/ibizplm__plmweb/appdata`, { headers: { host: 'unrelated.invalid' } }, res => {
      res.resume(); resolve(res.statusCode);
    });
    req.once('error', reject); req.end();
  });
  assert.equal(hostileStatus, 403);
  for (const unsafePath of [
    '/api/ignored/../ibizplm__plmweb/appdata',
    '/api/ibizplm__plmweb/products/../appdata',
    '/api/ibizplm__plmweb/products/%2e%2e/appdata',
    '//api/ibizplm__plmweb/appdata',
  ]) {
    const result = await new Promise((accept, reject) => {
      const url = new URL(base);
      const req = request({
        hostname: url.hostname, port: url.port, path: unsafePath, method: 'GET',
      }, res => { res.resume(); accept(res.statusCode); });
      req.once('error', reject);
      req.end();
    });
    assert.equal(result, 403, unsafePath);
  }
  assert.equal(seen.length, 0);
  const response = await fetch(`${base}/api/ibizplm__plmweb/products/fetch_main`, { method: 'POST', body: '{}' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { native: true });
  assert.deepEqual(seen, [{ method: 'POST', path: '/api/ibizplm__plmweb/products/fetch_main' }]);
});
