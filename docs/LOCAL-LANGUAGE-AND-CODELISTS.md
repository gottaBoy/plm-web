# Local Language And Code Lists

## Language Selection

The PLM sidebar and password login page provide a language menu with Chinese
(`zh-CN`) and English (`en`). Changing it uses the existing
`ibiz.i18n.setLang()` confirmation, stores `localStorage.language`, and reloads
the current URL. Authentication and business data are not reset.

`src/locale/model-locale.ts` copies application, view, entity and code-list
metadata while translating only selected display properties. It does not
translate IDs, technical field names, values, scripts, HTML or data returned by
business APIs. Original compiled models remain unchanged. English resources
are explicit entries in `src/locale/en.json`; missing labels retain their original text.
Element Plus receives the corresponding locale for its built-in controls.
Dayjs uses the same language for built-in date formatting.

`src/locale/layout-locale.ts` applies the same metadata-only translation after
the runtime fills a default layout. Those layouts are added after the model
loader and contain dialog commands such as Confirm and Cancel. The adapter
reads the current application ID at fill time, because it is not initialized
when Vue plugins are installed. Other applications, Chinese layouts and the
shared cached layout definitions are not translated or modified.

Current coverage includes the main navigation, workspace, common field labels,
commands and login text. This is not complete translation of every PLM model,
third-party plugin, business state or backend error. User-authored titles and
names intentionally remain unchanged.

The selector uses a compact, borderless trigger, a checked current language,
and a neutral popup isolated from the shared sidebar dropdown theme. The
collapsed sidebar keeps an icon-only entry. The login menu aligns to the
trigger's right edge. Native dropdown keyboard navigation and language-change
confirmation remain in place; selecting the current language is a no-op.

The four primary product/project/test-library/space list headers wrap their
search and command areas on mobile, rather than shrinking the command and
clipping its text. The shared no-data component resolves its default text
through the existing language resource and tracks explicit text/resource prop
updates. Custom business-authored empty messages are not translated.
The mobile login container also overrides the desktop minimum width so its
inputs and language menu remain inside a 390px viewport.

## Translation Audit

```sh
npm run locale:audit
```

For a machine-readable JSON report without npm's command header:

```sh
node tools/audit-model-locale.mjs
```

The audit uses the TypeScript parser and the same display-property allowlist
as the runtime translation. It reports missing literal labels with their first
model path, line and occurrence count. Comments, identifier strings and script
contents are not counted as display labels. Parse failures are errors rather
than silently reducing the inventory.

Entity-field `logicName` is translated only inside `appDEFields`, where the
runtime uses it for quick-search placeholders. Entity and action logical names
elsewhere are preserved. The audit follows that same structural restriction.

On 2026-11-02, the dictionary contains 500 explicit entries, 225 more than the
previous checkpoint. Across 3,162 static model files, 26,218 of 48,730 display
property occurrences match translated entries, representing 458 of 4,477
distinct Chinese labels. The 4,019 remaining labels include internal layout
captions; these counts are not an end-user translation percentage. Plugin
strings, HTML, dynamic API data and user-authored names are outside the audit.

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

## Expanded Review

The 2026-11-02 follow-up evidence is retained under workspace
`.artifacts/plm-language-polish-20261102/`.

This review adds English checks for all twelve primary navigation entries and
read-only configuration-dialog checks for work categories and print templates.
Language tests check popup colors, selected state, keyboard navigation,
viewport bounds, login alignment and persistence. A repeated settings-page
reload regression supplements the delayed-tree navigation check.

Diagnostic runs remain retained. `release-full/` records 132 passes and five
failures: hidden-field assertions in the two new settings checks, two canceled
animation waits, and one product-settings reload race. Settings checks also
exposed untranslated default-layout commands, which are now covered by the
layout adapter. Later focused tests passed the real product
create/edit/delete/cleanup workflow on both viewports and repeated settings
reloads. A separate mobile language test exposed an early route snapshot; it
now waits for the actual overview view and its canonical route before checking
language-switch route preservation.

The product-settings reload race was observed once and is not declared fixed
solely because subsequent runs did not reproduce it. The retained evidence and
repeated-reload regression remain relevant when changing navigation.

`verified-full/` passed 139 desktop/mobile checks, including the three
previously opt-in known-issue checks per viewport, before the last navigation,
quick-search, mobile-toolbar and empty-state additions. `publish-focused/`
retains a subsequent delivery failure: the new empty-state checks still saw
the old compiled SystemJS component bundle. All ten failures were those
empty-state checks; 51 other checks passed. Updating ESM outputs alone was
insufficient because production uses the SystemJS import map.

Changes in `ibiz-app-hub/components/ibiz-next-vue3` require rebuilding that
package before building PLM. The normal package build generates its SystemJS,
ESM, CJS and CSS outputs. PLM's Vite plugin copies the component's `dist/`
bundle into `dist/extras/js/@ibiz-template/vue3-components/`; those copied
files, not the TypeScript or ESM module alone, are what the browser loads.

From `ibiz-app-hub`, rebuild the shared component package with:

```sh
pnpm --filter @ibiz-template/vue3-components run build
```

Final retained checks:

| Check | Result | Evidence |
| --- | --- | --- |
| Frontend contracts including locale, audit and responsive rules | 103 passed, zero skips | `contracts-final-delivery.log` |
| Shared empty-state component unit tests | 2 passed | `no-data-unit.log` |
| Expanded suite before final supplemental fixes | 139 passed, zero skips/flaky cases | `verified-full/reports/test-results.json` |
| Supplemental English, responsive buttons, product CRUD, routes, code lists and height | 61 passed, zero skips/flaky cases | `final-acceptance/reports/test-results.json` |
| Last mobile-login width fix and language regression | 7 passed, zero skips/flaky cases | `login-final/reports/test-results.json` |
| Deployed app and actual SystemJS empty-state dependency graph | Local/build/served bytes match | `delivery-final.json` |

`system-release/` retains one marketplace loading timeout and 60 passes. The
marketplace check now explicitly awaits and validates its real dataset response
and allows up to 30 seconds for its loading masks, rather than assuming it
settles inside the general 10-second UI assertion timeout. No failed request is
converted to a successful empty response.

Outstanding project acceptance remains explicit:

- The notification implementation has DingTalk/WeCom paths but no Feishu
  platform adapter. This UI review does not implement or verify Feishu delivery.
- Complete business/plugin translation and the opt-in deep feature sweep
  remain open.
- Backend source-package and immutable image/hash receipt revalidation do not
  replace ordinary-user, cross-library, native-editor, full source/image closure
  or clean-restart/persistence acceptance.
