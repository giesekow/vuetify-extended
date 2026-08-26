---
name: vuetify-extended
description: Implement, debug, refactor, document, or bootstrap applications built with the vuetify-extended TypeScript UI library. Use when Codex works with this library's class-based primitives and runtime patterns, especially Report, Trigger, Form, Field, Collection, Selector, DialogForm, Dashboard, AppMain, AppManager, Master, Api, and setup helpers such as createVuetifyExtendedApp(...).
---

# Vuetify Extended

Use the library's existing class-based runtime model. Prefer extending the established primitives over introducing parallel patterns.

## Working Rules

- Start by identifying the correct primitive before editing code:
  - `Report` for multi-step form workflows
  - `Trigger` for search/query/result-table actions
  - `Selector` for overlay selection flows
  - `DialogForm` for modal form workflows
  - `Collection` for trigger-to-report batch/edit flows
  - `Dashboard` for read-first widget pages
  - `AppMain` and `AppManager` for shell/bootstrap/navigation
- Do not confuse top-level `Collection` with `Field type: 'collection'`. The field type is for nested `Array<Record<string, any>>` data inside a parent record.
- Preserve `Master` storage semantics. Before changing field behavior, read `references/fields.md`.
- Prefer actual runtime instances over plain config objects. This library composes `new Report(...)`, `new Form(...)`, `new Field(...)`, etc.
- When API-backed UI must be reloaded, read `docs/ui/Refreshing.md` and use the narrowest component refresh method instead of closing/reopening the screen or using `forceRender()` as an API reload.
- Use `AppManager` display methods to show runtime UI:
  - `showReport(report)`
  - `showCollection(collection)`
  - `showUI(ui)`
  - `showDialog(dialog)`
- Treat `test/src/demos.ts` as the canonical example bank for usage patterns and composition style.
- When documenting or changing public behavior, update the corresponding `docs/ui/*.md` file.

## Read These References Selectively

- For bootstrap and app startup:
  `references/bootstrap.md`
- For choosing the correct runtime primitive and showing it:
  `references/primitives.md`
- For field storage, field type expectations, media asset mode, and collection/map behavior:
  `references/fields.md`
- For global dialogs, prompts, previews, and progress overlays:
  `references/dialogs.md`
- For dashboards and widget-specific patterns:
  `references/dashboards.md`

## Default Workflow

1. Inspect the nearest existing example in `test/src/demos.ts`.
2. Inspect the primary class source in `src/ui/*.ts`.
3. Read the matching reference file from this skill.
4. Implement using the current library style, not generic Vue SFC patterns.
5. If public behavior changed, update the relevant docs file in `docs/ui/`.

## Runtime Generation

This library supports runtime-created UI objects. User or app code can construct and return real instances such as `Report`, `Trigger`, `Collection`, or `DialogForm`, then show them through `AppManager`.

Use this pattern when the task explicitly involves dynamic/custom-generated UI. Validate the returned object type before showing it.
