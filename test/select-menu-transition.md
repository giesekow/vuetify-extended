# Per-field popup transitions

Scope: `TASK-TENANCY-P9-006`, `VER-TENANCY-006`, `VER-TENANCY-010`.
The library exposes `FieldParams.menuTransition?: string | false` and forwards it
as the Vuetify select/autocomplete `transition` prop only when specified.
Omission preserves Vuetify defaults; server menu classes, search and paging
are preserved. The table autocomplete add-item input follows the same contract.

This is a standalone upstream correction on `master`, not a NimTree submodule
release. No version bump or deployed consumer change is included. Admin PR #49
remains draft pending verification of its eventual reviewed dependency release.

## Verification

Run `npm test` for render-prop regressions, the full existing suite and generated
ESM/CommonJS builds. The regression executes the actual render methods with a
VNode recorder: 15 combinations of omitted/disabled/named transition across
select, local/server autocomplete and local/server table autocomplete. It also
checks the emitted TypeScript contract (including rejection of true), restoration to omission and retention of server menu/search/scroll props.

For browsers, install the test playground dependencies with `npm ci --prefix test`,
then run from the repository root:

```sh
FOOTER_TEST=true ./test/node_modules/.bin/vite --config test/vite.config.ts --host 127.0.0.1 --port 4193
PLAYWRIGHT_MODULE=/path/to/playwright SELECT_RESULTS=/tmp/select-transition-results.json node test/select-menu-transition.browser.cjs
```

`FOOTER_TEST=true` uses the existing HMR-disabled verification mode. Supply
`BROWSERS=chromium,firefox,webkit` (the default) and `SELECT_TEST_URL` if needed.
The browser fixture waits for native field-wrapper actionability before keyboard use and reproduces the Admin preview-values nested collection form,
including its 820px outer dialog, 680px child dialog and 4/8-column inputs. It
uses synthetic values and no backend. It opens/selects three times and saves
and closes the child for select and local/server autocomplete. Server cases
enter a search term rather than expecting options before the minimum search.

Both Playwright page errors and window error/unhandled-rejection events are
retained. No handler cancels propagation or prevents default handling. Default
transition observations are a diagnostic baseline; configured cases require
zero errors. This verifies the isolated layout and library, not the full deployed
Admin edit/save/reopen journey or stakeholder acceptance.

## Compatibility and recovery

Only the field's popup animation changes when explicitly configured. There is
no API, storage, tenant/permission, locale, migration, worker or deployment change.
Public/operator NimTree guides are unaffected until consumer adoption; the
library API guide documents the new opt-in setting. Reverting this commit
restores the previous API. Do not configure a consumer until its library contains
the option. Human review and release remain pending.

Initial runs without waiting for child-field actionability captured intermittent
ResizeObserver errors even with configured transitions. Those runs do not prove
a general fix for dialog-entry races. The retained fixture verifies interaction
once the child control is actionable; no runtime error is hidden or cancelled.
