# Footer resize regression

## Scope and cause

AppMain's application footer previously delegated its reserved layout height to
VFooter's automatic-height observer. In WebKit, that observer updates ancestor
layout during ResizeObserver delivery and reports an undelivered-notification
loop at startup. This was reproduced in a consumer before opening any report.

AppMain now supplies an explicit layout height while retaining CSS `height:auto`
for intrinsic footer sizing. Its existing observer schedules a coalesced
requestAnimationFrame measurement, outside observer delivery. Pending work is
cancelled on removal/replacement; repeated references do not schedule a render
loop. No global observer patch, error suppression, fixed footer height, consumer
CSS override or public API change is introduced. The existing footer offset for
floating actions continues to use the same measured height.

Review risks: dynamic content/wrapping must still change reserved layout space;
shrinkage and teardown must not leave stale space. Height reservation can settle
on the following frame. No data, security policy, migration or release/version
change is included. Reverting this change restores the prior sizing behaviour.

## Repeatable checks

`npm test` runs the lifecycle regression and existing library suites, including
both builds. Generated `lib/esm` and `lib/cjs` files are retained with source.

For browser verification, install the test-app dependencies and start its Vite
server (`npm --prefix test run dev`). Install Playwright and its browser/runtime
dependencies in your test environment. Then:

```sh
node test/footer-resize.browser.cjs
```

The runner accepts `PLAYWRIGHT_MODULE` (path to an existing Playwright package),
`FOOTER_TEST_URL` (default http://localhost:4190), and `BROWSERS` (default
chromium,firefox,webkit). It exercises startup, growing/shrinking content, natural
wrapping, 320/1440px viewports, footer hide/show and application unmount. It checks
reserved layout height against actual footer height and rejects every page error.
Let Vite finish first-time dependency optimization before running the matrix;
a development-server reload is not a passing browser run.

## Consumer verification boundary

The NimTree audit-detail/filter suite has eight cases per engine, including both
menu entries, keyboard/return navigation, light/dark responsive reports,
accessibility assertions, protected reads, failure handling and export filters.
The unrepaired consumer produced a startup ResizeObserver error in both WebKit
navigation cases. The local candidate passes those cases without changing their
assertions. Consumer production pins and deployed images remain unchanged until
review, merge and release. This is a library PR, not consumer release approval.

Requested by GT on 2026-09-22 under the bounded NimTree TASK-SEC-P5-004 /
VER-SEC-009 follow-up. Human PR review remains required; implementation and local
verification were performed by Codex, not an independent reviewer.
