import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const modelPath = fileURLToPath(new URL('../../src/publish/model/entities/product.ts', import.meta.url));
const source = readFileSync(modelPath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
const exports = {};
vm.runInNewContext(compiled, { exports });
const logic = exports.default.appDEUILogics.find(item => item.id === 'remove_batch_temp');
assert.ok(logic, 'the real product member initialization logic must exist');
const code = logic.deuilogicNodes.find(item => item.logicNodeType === 'RAWJSCODE').code;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const initialize = new AsyncFunction('uiLogic', 'context', 'ibiz', code);

function serviceFixture() {
  const records = new Map([['stale', { id: 'stale' }]]);
  const deleted = [];
  let lookups = 0;
  let rejectLookup = false;
  const context = { srfappid: 'plmweb' };
  const ibiz = {
    hub: {
      getApp(appId) {
        assert.equal(appId, context.srfappid);
        return {
          deService: {
            async getService(actualContext, entity) {
              lookups += 1;
              assert.equal(actualContext, context);
              assert.equal(entity, 'plmweb.product_member');
              if (rejectLookup) throw new Error('directory unavailable');
              return {
                local: {
                  getList: () => [...records.values()],
                  async delete(_, id) {
                    await Promise.resolve();
                    deleted.push(id);
                    records.delete(id);
                  },
                },
              };
            },
          },
        };
      },
    },
  };
  return { records, deleted, context, ibiz, lookups: () => lookups, fail: value => { rejectLookup = value; } };
}

test('retreat reload preserves added members; a newly opened wizard cleans canceled members', async () => {
  const fixture = serviceFixture();
  const view = {};
  await initialize({ view }, fixture.context, fixture.ibiz);
  assert.deepEqual(fixture.deleted, ['stale']);
  fixture.records.set('selected', { id: 'selected' });
  await initialize({ view }, fixture.context, fixture.ibiz);
  assert.equal(fixture.lookups(), 1);
  assert.equal(fixture.records.has('selected'), true);
  await initialize({ view: {} }, fixture.context, fixture.ibiz);
  assert.equal(fixture.lookups(), 2);
  assert.equal(fixture.records.size, 0);
});

test('concurrent first-form events share one initialization and await its completion', async () => {
  const fixture = serviceFixture();
  const view = {};
  await Promise.all([
    initialize({ view }, fixture.context, fixture.ibiz),
    initialize({ view }, fixture.context, fixture.ibiz),
  ]);
  assert.equal(fixture.lookups(), 1);
  assert.deepEqual(fixture.deleted, ['stale']);
  assert.equal(fixture.records.size, 0);
});

test('failed initialization is reported and retryable, without marking the wizard initialized', async () => {
  const fixture = serviceFixture();
  const view = {};
  fixture.fail(true);
  await assert.rejects(initialize({ view }, fixture.context, fixture.ibiz), /directory unavailable/);
  assert.equal(view.productMemberTempInitialization, undefined);
  assert.equal(fixture.records.size, 1);
  fixture.fail(false);
  await initialize({ view }, fixture.context, fixture.ibiz);
  assert.equal(fixture.lookups(), 2);
  assert.equal(fixture.records.size, 0);
});

const memberSource = readFileSync(new URL('../../src/publish/model/entities/product-member.ts', import.meta.url), 'utf8');
const memberExports = {};
vm.runInNewContext(ts.transpileModule(memberSource, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, { exports: memberExports });
const memberLogic = memberExports.default.appDEUILogics.find(item => item.id === 'create_default_temp_members');
assert.ok(memberLogic, 'the real default member logic must exist');
const initializeMember = new AsyncFunction('uiLogic', 'context', 'ibiz',
  memberLogic.deuilogicNodes.find(item => item.logicNodeType === 'RAWJSCODE').code);

function memberFixture() {
  const records = [];
  const service = { local: { getList: () => records } };
  const context = { srfappid: 'plmweb' };
  const user = { user_id: 'demo_admin', name: 'Administrator', role_id: 'admin' };
  let creates = 0;
  let rejectCreate = false;
  const ibiz = { hub: { getApp: () => ({ deService: {
    async getService(actualContext, entity) {
      assert.equal(actualContext, context);
      assert.equal(entity, 'plmweb.product_member');
      return service;
    },
    async exec(entity, method, actualContext, data) {
      assert.equal(entity, 'plmweb.product_member');
      assert.equal(method, 'Create');
      assert.equal(actualContext, context);
      creates += 1;
      await Promise.resolve();
      if (rejectCreate) throw new Error('member create failed');
      records.push({ ...data });
    },
  } }) } };
  return { records, service, context, user, ibiz, creates: () => creates, fail: value => { rejectCreate = value; } };
}

test('member view reload does not duplicate the default user or overwrite selected members/roles', async () => {
  const fixture = memberFixture();
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  fixture.records[0].role_id = 'reader';
  fixture.records.push({ user_id: 'preview_admin', role_id: 'user' });
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.creates(), 1);
  assert.equal(fixture.records.length, 2);
  assert.equal(fixture.records[0].role_id, 'reader');
});

test('concurrent member view reloads await one real Create and retain product scoping', async () => {
  const fixture = memberFixture();
  await Promise.all([
    initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz),
    initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz),
  ]);
  assert.equal(fixture.creates(), 1);
  fixture.context.product = 'other-product';
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.creates(), 2);
  assert.equal(fixture.records[1].product_id, 'other-product');
  assert.equal(fixture.service.productDefaultMemberInitialization, undefined);
});

test('wizard draft product binding survives reload without relying on automatic parent attachment', async () => {
  const fixture = memberFixture();
  fixture.context.product = 'draft-product';
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.records[0].product_id, 'draft-product');
  fixture.records[0].role_id = 'reader';
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.creates(), 1);
  assert.equal(fixture.records[0].role_id, 'reader');
  assert.equal(fixture.user.product_id, undefined, 'logic input must not be mutated');
});

test('explicit member product binding is preserved when the context has no product', async () => {
  const fixture = memberFixture();
  fixture.user.product_id = 'member-product';
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.creates(), 1);
  assert.equal(fixture.records[0].product_id, 'member-product');
});

test('default member Create failure propagates and is retryable after clearing the pending operation', async () => {
  const fixture = memberFixture();
  fixture.fail(true);
  await assert.rejects(initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz), /member create failed/);
  assert.equal(fixture.service.productDefaultMemberInitialization, undefined);
  assert.equal(fixture.records.length, 0);
  fixture.fail(false);
  await initializeMember({ user: fixture.user }, fixture.context, fixture.ibiz);
  assert.equal(fixture.creates(), 2);
  assert.equal(fixture.records.length, 1);
});

const memberViewExports = {};
vm.runInNewContext(ts.transpileModule(readFileSync(new URL(
  '../../src/publish/model/views/product-member-assigned-grid-view.ts', import.meta.url,
), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText, { exports: memberViewExports });
const addLogic = memberViewExports.default.appViewLogics.find(item => item.id === 'newdata');
assert.equal(addLogic.logicType, 'SCRIPT', 'the toolbar must reach the actual deduplicating view logic');
assert.equal(memberViewExports.default.controls[0].detoolbarItems[0].uiactionId, 'gridview_newaction');
const addMembers = new AsyncFunction('context', 'view', 'ibiz', addLogic.scriptCode);

function selectionFixture() {
  const fixture = memberFixture();
  const result = { ok: true, data: [
    { srfkey: 'demo_admin', display_name: 'Administrator' },
    { srfkey: 'preview_admin', display_name: 'Administrator' },
    { srfkey: 'preview_admin', display_name: 'Administrator' },
  ] };
  const calls = [];
  const viewContext = {};
  const view = { getCtx: () => viewContext };
  fixture.context.clone = () => ({ ...fixture.context });
  fixture.ibiz.commands = {
    async execute(command, appViewId, context, params, options) {
      assert.equal(command, 'ibiz.app-view.open');
      assert.equal(appViewId, 'plmweb.user_choose_mpick_up_view');
      assert.notEqual(context, fixture.context);
      assert.equal(context.srfappid, fixture.context.srfappid);
      assert.equal(params.srfuf, 0);
      assert.equal(options.ctx, viewContext);
      assert.equal(options.openMode, 'POPUPMODAL');
      return result;
    },
  };
  const serviceUtil = {
    async getService(context, entity) {
      assert.equal(context, fixture.context);
      assert.equal(entity, 'plmweb.product_member');
      return fixture.service;
    },
    exec: async (entity, method, context, data) => {
      assert.equal(entity, 'plmweb.product_member');
      assert.equal(method, 'Create');
      assert.equal(context, fixture.context);
      calls.push(data);
      await Promise.resolve();
      if (fixture.rejectBatch) throw new Error('batch create failed');
      fixture.records.push(...data.map(member => ({ ...member })));
    },
  };
  fixture.ibiz.hub.getApp = () => ({ deService: serviceUtil });
  return Object.assign(fixture, { result, calls, view });
}

test('batch selection deduplicates real user IDs, preserves the default role and never mutates pickup data', async () => {
  const fixture = selectionFixture();
  fixture.records.push({ user_id: 'demo_admin', role_id: 'admin' });
  const before = JSON.stringify(fixture.result);
  assert.equal(await addMembers(fixture.context, fixture.view, fixture.ibiz), fixture.result);
  assert.deepEqual(fixture.calls, [[{ user_id: 'preview_admin', name: 'Administrator' }]]);
  assert.equal(fixture.records.length, 2, 'shared display names must not merge distinct users');
  assert.equal(fixture.records[0].role_id, 'admin');
  assert.equal(JSON.stringify(fixture.result), before);
  await addMembers(fixture.context, fixture.view, fixture.ibiz);
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.service.productDefaultMemberInitialization, undefined);
});

test('batch addition has explicit product scope and supports directory IDs when srfkey is absent', async () => {
  const fixture = selectionFixture();
  fixture.context.product = 'draft-product';
  fixture.records.push({ user_id: 'preview_admin', product_id: 'other-product' });
  fixture.result.data = [{ id: 'preview_admin', display_name: 'Administrator' }];
  await addMembers(fixture.context, fixture.view, fixture.ibiz);
  assert.deepEqual(fixture.calls, [[{
    user_id: 'preview_admin', name: 'Administrator', product_id: 'draft-product',
  }]]);
});

test('canceled and empty picker results do not access or mutate the member service', async () => {
  const fixture = selectionFixture();
  fixture.ibiz.hub.getApp = () => { throw new Error('canceled pickup must not create members'); };
  fixture.result.ok = false;
  await addMembers(fixture.context, fixture.view, fixture.ibiz);
  fixture.result.ok = true;
  fixture.result.data = [];
  await addMembers(fixture.context, fixture.view, fixture.ibiz);
  assert.deepEqual(fixture.calls, []);
});

test('concurrent selections wait for default initialization and one another before reading the cache', async () => {
  const fixture = selectionFixture();
  fixture.service.productDefaultMemberInitialization = Promise.resolve().then(() => {
    fixture.records.push({ user_id: 'demo_admin', role_id: 'admin' });
  });
  await Promise.all([
    addMembers(fixture.context, fixture.view, fixture.ibiz),
    addMembers(fixture.context, fixture.view, fixture.ibiz),
  ]);
  assert.equal(fixture.records.length, 2);
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.records[0].role_id, 'admin');
  assert.equal(fixture.service.productDefaultMemberInitialization, undefined);
});

test('batch failure and invalid user IDs fail honestly, release the pending lock and remain retryable', async () => {
  const fixture = selectionFixture();
  fixture.rejectBatch = true;
  await assert.rejects(addMembers(fixture.context, fixture.view, fixture.ibiz), /batch create failed/);
  assert.equal(fixture.records.length, 0);
  assert.equal(fixture.service.productDefaultMemberInitialization, undefined);
  fixture.rejectBatch = false;
  fixture.result.data = [{ display_name: 'Missing identity' }];
  await assert.rejects(addMembers(fixture.context, fixture.view, fixture.ibiz), /no user ID/);
  assert.equal(fixture.calls.length, 1);
  fixture.result.data = [{ id: 'preview_admin', display_name: 'Administrator' }];
  await addMembers(fixture.context, fixture.view, fixture.ibiz);
  assert.equal(fixture.records.length, 1);
});
