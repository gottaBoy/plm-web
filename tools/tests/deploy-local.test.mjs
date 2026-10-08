import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCommands,
  parseArgs,
  runDeployment,
} from '../deploy-local.mjs';

test('parseArgs accepts repeatable plugin references and deployment overrides', () => {
  assert.deepEqual(
    parseArgs([
      '--plugin',
      '@scope/plugin@1.0.0',
      '--plugin',
      '@scope/other@2.0.0-alpha.1,@scope/third@3.0.0',
      '--container',
      'plmweb-test',
      '--base-url',
      'http://localhost:30080/ibizplm-plmweb/',
      '--health-timeout-ms',
      '250',
    ]),
    {
      plugins: [
        '@scope/plugin@1.0.0',
        '@scope/other@2.0.0-alpha.1',
        '@scope/third@3.0.0',
      ],
      build: true,
      container: 'plmweb-test',
      baseUrl: 'http://localhost:30080/ibizplm-plmweb/',
      healthTimeoutMs: 250,
    },
  );
});

test('parseArgs rejects malformed plugin references and invalid URLs', () => {
  assert.throws(
    () => parseArgs(['--plugin', '@scope/plugin']),
    /scope\/name@version/,
  );
  assert.throws(
    () => parseArgs(['--base-url', 'localhost:30250']),
    /HTTP or HTTPS/,
  );
  assert.throws(() => parseArgs(['--unknown']), /Unknown option/);
});

test('build commands rebuild plugins before the application copies public assets', () => {
  assert.deepEqual(
    buildCommands({
      build: true,
      plugins: [
        '@scope/plugin@1.0.0',
        '@scope/other@2.0.0',
      ],
    }),
    [
      {
        command: 'pnpm',
        args: ['plugins:build:one', '--', '@scope/plugin@1.0.0'],
        label: 'build @scope/plugin@1.0.0',
      },
      {
        command: 'pnpm',
        args: ['plugins:build:one', '--', '@scope/other@2.0.0'],
        label: 'build @scope/other@2.0.0',
      },
      {
        command: 'pnpm',
        args: ['build'],
        label: 'build PLM web application',
      },
    ],
  );
});

test('deployment restarts the container, waits for health, and verifies served bytes', async () => {
  const calls = [];
  const bytes = Buffer.from('fresh plugin bytes');
  const hashes = [];
  let firstHealthPoll = true;

  const result = await runDeployment(
    {
      build: true,
      plugins: ['@scope/plugin@1.0.0'],
      container: 'plmweb-test',
      baseUrl: 'http://localhost:30250/ibizplm-plmweb/',
      healthTimeoutMs: 1000,
    },
    {
      execFile: async (command, args) => {
        calls.push([command, ...args]);
        if (args[0] === 'restart') return '';
        if (args[0] === 'inspect') {
          const status = firstHealthPoll ? 'starting' : 'healthy';
          firstHealthPoll = false;
          return { stdout: status };
        }
        throw new Error(`unexpected execFile call: ${command} ${args.join(' ')}`);
      },
      runCommand: async (command, args, label) => {
        calls.push([command, ...args]);
        assert.ok(label);
      },
      delay: async ms => calls.push(['delay', ms]),
      fetch: async url => {
        calls.push(['fetch', url]);
        return {
          ok: true,
          status: 200,
          text: async () => bytes.toString('utf8'),
        };
      },
      readFile: async file => {
        calls.push(['readFile', file]);
        hashes.push(file);
        return bytes;
      },
    },
  );

  assert.equal(result.container, 'plmweb-test');
  assert.deepEqual(result.plugins, ['@scope/plugin@1.0.0']);
  assert.ok(
    calls.some(call => call[0] === 'pnpm' && call[1] === 'plugins:build:one'),
  );
  assert.ok(
    calls.findIndex(call => call[0] === 'pnpm' && call[1] === 'build') <
      calls.findIndex(call => call[0] === 'docker' && call[1] === 'restart'),
  );
  assert.ok(
    calls.some(
      call =>
        call[0] === 'fetch' &&
        call[1] instanceof URL &&
        call[1].pathname ===
          '/ibizplm-plmweb/plugins/@scope/plugin@1.0.0/dist/index.es.js',
    ),
  );
});

test('deployment fails on stale container bytes', async () => {
  await assert.rejects(
    runDeployment(
      {
        build: false,
        plugins: ['@scope/plugin@1.0.0'],
        container: 'plmweb-test',
        baseUrl: 'http://localhost:30250/ibizplm-plmweb/',
        healthTimeoutMs: 100,
      },
      {
        execFile: async (command, args) => {
          if (args[0] === 'restart') return '';
          if (args[0] === 'inspect') return { stdout: 'healthy' };
          return '';
        },
        delay: async () => {},
        fetch: async () => ({
          ok: true,
          status: 200,
          text: async () => 'stale bytes',
        }),
        readFile: async () => Buffer.from('fresh bytes'),
      },
    ),
    /Container serves stale bytes/,
  );
});
