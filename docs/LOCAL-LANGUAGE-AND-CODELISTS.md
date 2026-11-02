# Local Language And Code Lists

## Language Selection

The PLM sidebar and password login page provide a language menu with Chinese
(`zh-CN`) and English (`en`). Changing it uses the existing
`ibiz.i18n.setLang()` confirmation, stores `localStorage.language`, and reloads
the current URL. Authentication and business data are not reset.

`src/locale/model-locale.ts` copies application, view, entity and code-list
metadata while translating only selected display properties. It does not
translate IDs, field names, values, scripts, HTML or data returned by business
APIs. Original compiled models remain unchanged. English resources are explicit
entries in `src/locale/en.json`; missing labels retain their original text.
Element Plus receives the corresponding locale for its built-in controls.
Dayjs uses the same language for built-in date formatting.

Current coverage includes the main navigation, workspace, common field labels,
commands and login text. This is not complete translation of every PLM model,
third-party plugin, business state or backend error. User-authored titles and
names intentionally remain unchanged.

## State Code Lists

The local Nginx dictionary route must retain `ibizplm__plmweb` and pass through
the gateway. The gateway chooses between application-specific code lists and
the shared dictionary service.

For example, `ProjMgmt__scrum_state` belongs to PLM's work-item state machine.
Sending it directly to allinone searches the shared dictionary catalog and
produces `无法获取指定条件数据`. The corrected route preserves the request
parameters, authentication, real state items and transition-disabled flags.
No empty response, fabricated catalog or permission bypass is used.

`SysOperator` keeps its existing shared-dictionary contract. Its current
installation may return only the code with no items; this repair does not
claim a populated operator directory.

## Verification And Deployment

```sh
npm run plugin:harness:test
```

From `plm-e2e`, with the deployed URL selected:

```sh
PLM_E2E_BASE_URL=http://127.0.0.1:30250/ibizplm-plmweb/ \
  npm test -- tests/language-switch.spec.ts tests/codelist-routing.spec.ts \
  tests/english-product-form.spec.ts tests/workspace-height.spec.ts \
  tests/isolated-responsive-navigation.spec.ts
```

The Nginx configuration is copied into `Dockerfile.plmweb` images; restarting
the existing container updates mounted static assets but does not copy a new
Nginx config. For a configuration-only update of the existing owned frontend,
retain the old config, copy `nginx-local.conf` to
`/etc/nginx/conf.d/nginx.conf`, run `nginx -t`, then reload Nginx. Only reload
after validation; retain the original config if validation fails.
Rebuilding/recreating the frontend image also consumes this configuration.
Neither path requires restarting MySQL, UAA or the business backend.

## Verified Checkpoint

On 2026-11-02, the local PLM frontend was built and deployed. Retained evidence
is under workspace `.artifacts/plm-closeout-20261102/`:

| Check | Result | Evidence |
| --- | --- | --- |
| Frontend build | Passed | `build-release.log` |
| Frontend contracts | 94 passed, zero skips | `contracts-release.log` |
| Common desktop/mobile suite before final English-form additions | 101 passed, zero skips/flaky cases | `full/reports/test-results.json` |
| Final build: language, English form, code lists and navigation/height | 19 passed, zero skips/flaky cases | `release-focused-r2/reports/test-results.json` |
| Served HTML/CSS/JS and Nginx config identity | Matched current disk/config bytes | `delivery.json` |

The language tests cover confirmation cancellation, both directions, route
preservation, reload persistence and the unauthenticated login page.
The English product form opens and cancels without creating a product.
The code-list test verifies real enabled/disabled state-machine options,
shared-operator response compatibility and anonymous denial.

The first supplemental English-form run failed because its mobile selector
expected text in the icon-only collapsed menu. The corrected test uses the
same native mobile menu selection as the other project tests. The failed
`release-focused/` report is retained, not overwritten or relabeled.

These results do not close the independent native-editor UI, backend
source/image provenance, cross-library permission, deep-sweep or restart and
persistence gates recorded in the workspace status documentation. They also
do not establish complete English coverage for every model or plugin.
