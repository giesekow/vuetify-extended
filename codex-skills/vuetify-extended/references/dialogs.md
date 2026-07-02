# Dialogs

Use this reference when the task involves global modal flows, confirmations, prompts, progress overlays, or in-app preview dialogs.

Primary sources:

- `docs/ui/Dialogs.md`
- `src/ui/dialogs.ts`
- `src/ui/dialogform.ts`

## Non-Negotiable Rule

Prefer the shared `Dialogs` helpers over one-off custom modal implementations.

If the task is a confirmation, prompt, progress indicator, image preview, document preview, or generic iframe view, start with `Dialogs`.

## Core Helpers

- `Dialogs.$confirm(...)`
  Standard yes/no confirmation.
- `Dialogs.$info(...)`
  Informational modal content.
- `Dialogs.$success(...)`, `Dialogs.$warning(...)`, `Dialogs.$error(...)`
  Lightweight global feedback.
- `Dialogs.$showProgress(...)`, `Dialogs.$updateProgress(...)`, `Dialogs.$hideProgress()`
  Blocking long-running operation feedback.
- `Dialogs.$prompt(...)`
  Data-entry dialog that reuses the normal `Field` / `Form` / `Master` stack.
- `Dialogs.$imagePreview(...)`
  In-app image preview without `window.open(...)`.
- `Dialogs.$iframe(...)`
  Generic embedded browser-renderable content.
- `Dialogs.$documentPreview(...)`
  In-app PDF/document preview.

## Prompt Rules

`Dialogs.$prompt(...)` is the default way to ask the user for a value or a small structured payload.

Behavior:

- without `options.children`, the prompt creates one internal `Field`
- confirm resolves with that field value
- with `options.children`, the prompt creates an internal `Form`
- confirm resolves with the internal working `master.$data`
- cancel resolves `undefined`
- the prompt uses an internal working `Master`, so cancel does not mutate caller state

Use `$prompt(...)` instead of hand-rolling a `DialogForm` when the need is simple user input collection.

## Validation Boundary

Prompt validation is not special-cased. It follows the normal library stack:

1. field built-ins from `FieldParams.required` and `FieldParams.validation`
2. field custom logic from `FieldOptions.validate(field)`
3. form-wide custom logic from `FormOptions.validate(form)`
4. only a successful confirm resolves with data

If prompt behavior is changed, verify this validation chain still holds.

## Preview Rules

Prefer in-app preview helpers over new tabs/windows:

- images => `Dialogs.$imagePreview(...)`
- PDFs/documents => `Dialogs.$documentPreview(...)`
- arbitrary browser-renderable content => `Dialogs.$iframe(...)`

`Dialogs.$iframe(...)` supports:

- `src` or `srcdoc`
- built-in open/download actions
- extra menu actions through `IframeOptions.actions(...)`
- `prependActions` to place custom actions before defaults
- dialog visual tuning through `IframeParams`

## Review Checklist

Before finalizing a dialog-related change, check:

1. Was an existing `Dialogs` helper available instead of custom modal wiring?
2. Does cancel still resolve `undefined` where that is part of the API contract?
3. Are prompt validations still flowing through normal `Field` and `Form` logic?
4. Does preview stay inside the app unless there is a deliberate reason to leave it?
5. If iframe actions were added, do they coexist correctly with open/download actions?
