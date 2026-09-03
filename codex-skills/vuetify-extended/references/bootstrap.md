# Bootstrap

Use this reference when the task involves app startup, setup diagnostics, root mounting, or shell initialization.

## Preferred Bootstrap Path

Prefer the high-level helper in new or refactored host apps:

- `createVuetifyExtendedApp(...)`

Relevant source:

- `src/setup/index.ts`
- `docs/general-information.md`
- `docs/architecture.md`

High-level sequence:

1. optionally configure defaults with `configureVuetifyExtendedDefaults(...)`
2. call `createVuetifyExtendedApp(...)`
3. mount:
   - `bootstrap.component`
   - `bootstrap.dialogs`
   - `bootstrap.notifications`
4. optionally install `bootstrap.plugin`
5. optionally call `bootstrap.validate(...)`

Use this path when the user is building a host app from scratch or when the current bootstrap is inconsistent.

Bootstrap defaults include global dialog geometry as well as normal UI primitives. Use `confirm`, `info`, `prompt`, `imagePreview`, `iframe`, and `documentPreview` for `Dialogs` helpers; use `dialogForm` and `selector` for the corresponding class-based dialogs. Call-specific params always override these defaults.

## Low-Level Bootstrap Path

Use this only when the task explicitly needs manual setup control.

Sequence:

1. configure `Api`
   - `Api.useFeathers(...)`
   - `Api.useAxios(...)`
   - `Api.setInstance(...)`
2. call `AppManager.init()`
3. create `new AppMain(...)`
4. call `AppManager.setApp(appMain)`
5. mount:
   - `appMain.component`
   - `Dialogs.rootComponent()`
   - `Notifications.rootComponent()`

If one of these pieces is missing, expect runtime issues around navigation, dialogs, notifications, or `AppManager` display methods.

## Setup Diagnostics

Use:

- `validateVuetifyExtendedSetup(...)`

It checks:

- `Api.instance`
- `AppManager.init()`
- `AppManager.setApp(...)`
- dialog root mount
- notification root mount

If a bug smells like "nothing opens" or "dialogs do not render", check setup first.

## Practical Rules

- For new code, default to the high-level setup helper unless there is a concrete reason not to.
- If the user asks about runtime-created reports/triggers/collections, assume `AppManager` and `AppMain` must already be initialized.
- When modifying bootstrap, keep shell/header/footer behavior inside `AppMain`; do not recreate a second shell pattern around it unless the repo already does that.
