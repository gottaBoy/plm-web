import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const nginx = readFileSync(new URL('../../nginx-local.conf', import.meta.url), 'utf8');

test('code lists keep their application prefix for model-aware gateway dispatch', () => {
  const block = nginx.match(/location \^~ \/api\/ibizplm__plmweb\/dictionaries\/ \{([\s\S]*?)\n    \}/)?.[1];
  assert.ok(block);
  assert.match(nginx, /set \$gateway_upstream http:\/\/ibiz-ebsx-gateway:30086;/);
  assert.match(block, /rewrite \^\/api\/\(\.\*\)\$ \/\$1 break;/);
  assert.match(block, /proxy_pass \$gateway_upstream;/);
  assert.match(block, /proxy_set_header Authorization \$http_authorization;/);
  assert.match(block, /proxy_set_header srfsystemid ibizplm;/);
  assert.doesNotMatch(block, /return 200|trymode=true|proxy_pass \$allinone_upstream/);
});
