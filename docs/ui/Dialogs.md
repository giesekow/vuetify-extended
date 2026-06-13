# Dialogs

Global modal/dialog manager for alerts, confirms, progress, prompts, and other blocking overlays.

## Source

- [src/ui/dialogs.ts](../../src/ui/dialogs.ts)

## Highlights

- Expose one mounted root and static helpers such as `$confirm(...)`.
- Confirm dialogs support keyboard shortcuts like Enter/Y for yes and Escape/N for no.
- `$prompt(...)` uses an internal `DialogForm`, so it supports normal `Field`, `Form`, `Part`, and `Master` behavior instead of a one-off input control.
- `$imagePreview(...)` opens an in-app zoomable image viewer with pan support.

## Reference

### `DialogOptions`

```ts
export interface DialogOptions {
  confirmColor?: string|undefined;
  successColor?: string|undefined;
  errorColor?: string|undefined;
  warningColor?: string|undefined;
  progressColor?: string|undefined;
  successTimeout?: number|undefined;
  errorTimeout?: number|undefined;
  warningTimeout?: number|undefined;
  progressSize?: number|undefined;
  progressWidth?: number|undefined;
  infoWindowWidth?: number|undefined;
  infoWindowHeight?: number|undefined;
}
```

### `PromptParams`

```ts
export interface PromptParams {
  title?: string;
  text?: string;
  type?: FieldType;
  confirmText?: string;
  cancelText?: string;
  fieldParams?: FieldParams;
  formParams?: FormParams;
  dialogParams?: DialogParams;
}
```

### `PromptOptions`

```ts
export interface PromptOptions {
  master?: Master;
  fieldOptions?: Omit<FieldOptions, 'master'>;
  children?: () => Array<Part|Field>;
  formOptions?: Omit<FormOptions, 'master'|'children'>;
  dialogOptions?: Omit<DialogFormOptions, 'master'|'form'>;
}
```

### `ImagePreviewOptions`

```ts
export interface ImagePreviewOptions {
  title?: string;
  fullscreen?: boolean;
}
```

### `Dialogs`

```ts
export class Dialogs {
  // see source for full implementation
}
```

## Key Methods

- `static rootComponent()`
- `static $confirm(text: string, title?: string): Promise<boolean>`
- `static $info(text: string, title?: string, options?: { width?: number; height?: number }): Promise<void>`
- `static $prompt(params?: PromptParams, options?: PromptOptions): Promise<any | undefined>`
- `static $imagePreview(src: string, options?: ImagePreviewOptions): Promise<void>`
- `static $warning(text: string)`
- `static $error(text: string)`
- `static $success(text: string)`
- `static $showProgress({ value, text }: any)`
- `static $updateProgress({ value, text }: any)`
- `static $hideProgress()`

## `$prompt(...)`

`Dialogs.$prompt(...)` is the bridge between the lightweight global `Dialogs` helpers and the richer `DialogForm` / `Form` / `Field` system.

It supports 2 modes:

- single-field prompt
  If `options.children` is not provided, `Dialogs` creates one internal `Field` and returns that field value when confirmed.
- form prompt
  If `options.children` is provided, `Dialogs` creates a normal internal `Form` and returns the prompt Master data object when confirmed.

In both modes:

- confirm resolves the promise
- cancel resolves `undefined`
- the dialog runs in `create` mode by default
- the prompt form uses `sub: true` and `auto: true` internally, so it does not try to save through the backend and does not show the extra “Save data?” confirmation flow

### Single-field Prompt

```ts
const value = await Dialogs.$prompt({
  title: 'Quick Label',
  text: 'Enter a short label.',
  type: 'text',
  fieldParams: {
    label: 'Label',
    required: true,
  },
})
```

Notes:

- `type` defaults to `'text'`
- `fieldParams.storage` defaults to `__promptValue`
- if you provide `fieldParams.storage`, that storage path is used for the returned value
- `fieldParams` behaves like a normal `Field` config
- `fieldOptions` behaves like normal `FieldOptions`

### Form Prompt

```ts
const value = await Dialogs.$prompt(
  {
    title: 'Schedule Reminder',
    text: 'Use a small prompt form when one value is not enough.',
    confirmText: 'Create Reminder',
  },
  {
    children: () => [
      new Field({ label: 'Title', storage: 'title', required: true }),
      new Field({ label: 'When', storage: 'when', type: 'datetime', required: true }),
      new Field({ label: 'Urgent', storage: 'urgent', type: 'boolean' }),
    ],
  },
)
```

Notes:

- when `children` is present, `Dialogs.$prompt(...)` does not create the default single field
- the returned value is `master.$data` from the internal working `Master`
- each child field should define its own `storage` if you want it included in the returned object

### Master Behavior

`PromptOptions.master` is used as an initial data source, but the prompt runs against an internal working `Master`.

That means:

- prompt edits do not mutate the caller’s `Master` while the prompt is open
- cancel is safe and resolves `undefined`
- confirm returns the final prompt value or working `master.$data`

### `formParams`, `formOptions`, and `dialogParams`

You can further tune the internal `Form` and `DialogForm`:

- `formParams`
  Controls title, subtitle, width, button config, readonly flags, layout, and other normal `FormParams`.
- `formOptions`
  Lets you plug into normal `FormOptions` behavior such as validation, top/bottom children, custom buttons, and hooks.
- `dialogParams`
  Controls dialog-level flags like `persistent` and `fullscreen`.
- `dialogOptions`
  Lets you plug into the underlying `DialogFormOptions`.

Important precedence:

- `title`, `text`, `confirmText`, and `cancelText` from `PromptParams` override the equivalent form button/title/subtitle defaults
- `options.children` takes precedence over the single-field prompt path

## `$imagePreview(...)`

`Dialogs.$imagePreview(...)` opens an in-app image viewer dialog instead of pushing the user into a new browser tab.

Features:

- zoom in / zoom out
- reset zoom
- mouse-wheel zoom
- drag/pan while zoomed in
- double-click to toggle zoom
- `Esc` to close
- `+`, `-`, and `0` keyboard shortcuts for zoom in, zoom out, and reset

Example:

```ts
await Dialogs.$imagePreview(imageUrl, {
  title: 'Profile Image',
  fullscreen: false,
})
```

Notes:

- `fullscreen` defaults to `true`
- this helper is designed for image content
- non-image document preview behavior is still handled separately by the field/document flow
