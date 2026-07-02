# Primitive Selection

Use this reference when deciding which top-level UI primitive to construct or show.

## Quick Decision Matrix

Choose the primitive by the primary user job:

- user fills in or edits one record through one or more forms => `Report`
- user searches/browses rows and runs actions on results => `Trigger`
- user must pick item(s) from an overlay and return a selection => `Selector`
- user needs a modal form without taking over the main app stack => `DialogForm`
- user needs search/browse plus report-based create/edit flow in one screen-level workflow => `Collection`
- user mainly reads KPIs, lists, metrics, or status widgets => `Dashboard`
- user mainly chooses actions/navigation entries => `Menu`

Use `Field type: 'collection'` only for nested array-object editing inside a parent form.

Do not confuse:

- top-level `new Collection(...)`
  screen-level trigger + report workflow
- `new Field({ type: 'collection', ... })`
  nested editor for `Array<Record<string, any>>` stored inside the parent `Master`

## Primary Decision Rules

- Use `Report` for multi-step or single-step form workflows with save/cancel/prev/next/finish behavior.
- Use `Trigger` for action-oriented search/query/result-table flows.
- Use `Selector` for overlay selection UX where the user picks one or more items and returns.
- Use `DialogForm` for modal form workflows that should not take over the main stack.
- Use `Collection` for flows that combine a trigger with report-based item editing.
- Use `Dashboard` for read-first pages made of widgets.
- Use `Menu` when the screen is primarily action navigation rather than data entry or reporting.

## Runtime Display Methods

Use `AppManager` methods rather than pushing ad hoc Vue components:

- `AppManager.showReport(report, params?, replace?)`
- `AppManager.showCollection(collection, params?, replace?)`
- `AppManager.showDialog(dialog, params?)`
- `AppManager.showUI(ui, params?, replace?)`

Important:

- There is a dedicated `showReport(...)`.
- There is no dedicated `showTrigger(...)`; show a `Trigger` with `showUI(...)`.
- `Dashboard` is also shown with `showUI(...)`.

## Collection Boundary

The two `collection` concepts solve different problems:

- top-level `Collection`
  - combines trigger-style listing/filtering with report-style create/edit flows
  - use when the user is managing many records as a workflow
- field type `collection`
  - edits a nested array on one parent object
  - use when one record contains child rows such as contacts, line items, addresses, attachments metadata, or other embedded objects

If the requirement is “edit an array property on the current record”, it is almost never the top-level `Collection` primitive.

## Dynamic / Generated UI

This library supports runtime construction:

- `new Report(...)`
- `new Trigger(...)`
- `new Collection(...)`
- `new DialogForm(...)`
- `new Dashboard(...)`

This is appropriate for:

- user-defined internal/custom reports
- admin-defined tools
- dynamic workflows generated from code

If the task involves executing user-provided code that returns a UI object:

1. evaluate the code in a controlled runtime
2. validate the returned type
3. route it through the correct `AppManager` method

## Canonical Example Source

Read `test/src/demos.ts` for real composition examples before designing new flows. It is the fastest way to match the repo's style.
