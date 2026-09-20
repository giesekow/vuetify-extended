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
- `Dialogs.$previewFile(...)`
  Preferred high-level preview for saved URLs, data URLs, `Blob`s, and `File`s; it routes images, PDFs, browser content, and unsupported files automatically.
- `Dialogs.$imagePreview(...)`
  Specialized in-app image preview without `window.open(...)`.
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

- mixed or unknown file types => `Dialogs.$previewFile(...)`
- images => `Dialogs.$imagePreview(...)`
- PDFs/documents => `Dialogs.$documentPreview(...)`
- arbitrary browser-renderable content => `Dialogs.$iframe(...)`

`Dialogs.$iframe(...)` supports:

- `src` or `srcdoc`
- built-in open/download actions
- extra menu actions through `IframeOptions.actions(...)`
- `prependActions` to place custom actions before defaults
- dialog visual tuning through `IframeParams`

`Dialogs.$previewFile(...)` accepts explicit `mimeType`, `fileName`, `fileSize`, `openUrl`, and `downloadUrl` metadata. Pass protected assets as an authenticated `Blob`; an iframe or image URL cannot attach an application authorization header. Temporary object URLs are owned and released by `Dialogs`.

Preview dialogs default to `skin: 'inherit'` and use Vuetify `surface`, `background`, `on-surface`, and outline tokens. Keep that default unless a caller deliberately needs `skin: 'light'`, `skin: 'dark'`, or explicit color/style overrides. Embedded iframe/PDF content remains controlled by its source document or browser renderer.

## Sizing And Defaults

Use the shared `DialogSizeParams` properties for contained dialogs:

- `width`, `maxWidth`, `minWidth`
- `height`, `maxHeight`, `minHeight`

Confirm and info accept these as their third argument. Prompt accepts them directly in `PromptParams`. Image, iframe, document, and file preview dimensions apply when `fullscreen` is `false`.

Prefer application defaults when a project needs consistent geometry:

```ts
createVuetifyExtendedApp({
  defaults: {
    confirm: { width: 420, maxWidth: '92vw' },
    info: { width: 560, maxHeight: '75vh' },
    prompt: { width: 640 },
    imagePreview: { fullscreen: false, height: '82vh' },
    iframe: { fullscreen: false, width: 1200, height: '85vh' },
    documentPreview: { maxWidth: '94vw' },
    filePreview: { fullscreen: false, maxWidth: '94vw' },
  },
})
```

Direct equivalents are `Dialogs.setConfirmDefault`, `setInfoDefault`, `setPromptDefault`, `setImagePreviewDefault`, `setIframeDefault`, `setDocumentPreviewDefault`, and `setFilePreviewDefault`. Their second `reset` argument replaces existing defaults when `true`; otherwise defaults merge. Per-call params win.

## Review Checklist

Before finalizing a dialog-related change, check:

1. Was an existing `Dialogs` helper available instead of custom modal wiring?
2. Does cancel still resolve `undefined` where that is part of the API contract?
3. Are prompt validations still flowing through normal `Field` and `Form` logic?
4. Does preview stay inside the app unless there is a deliberate reason to leave it?
5. If iframe actions were added, do they coexist correctly with open/download actions?
6. Do contained dimensions still yield to fullscreen behavior?
