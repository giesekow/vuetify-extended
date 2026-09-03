# Dialogs

Global modal/dialog manager for alerts, confirms, progress, prompts, and other blocking overlays.

## Source

- [src/ui/dialogs.ts](../../src/ui/dialogs.ts)

## Highlights

- Expose one mounted root and static helpers such as `$confirm(...)`.
- Confirm dialogs support keyboard shortcuts like Enter/Y for yes and Escape/N for no.
- Confirm, info, prompt, image preview, iframe, and document preview dialogs support typed width and height constraints.
- Each global dialog helper supports mergeable application defaults through `Dialogs.set...Default(...)` and bootstrap `defaults`.
- `$prompt(...)` uses an internal `DialogForm`, so it supports normal `Field`, `Form`, `Part`, and `Master` behavior instead of a one-off input control.
- `$imagePreview(...)` opens an in-app zoomable image viewer with pan support.
- `$iframe(...)` opens a generic embedded iframe dialog for browser-renderable content.
- `$documentPreview(...)` opens an in-app document dialog for PDFs.

## Reference

### `DialogSizeParams`

All contained dialogs use the same size contract. Numbers are interpreted as pixels by Vuetify; strings may use CSS units such as `'42rem'`, `'80vw'`, or `'70vh'`.

```ts
export interface DialogSizeParams {
  width?: number|string;
  maxWidth?: number|string;
  minWidth?: number|string;
  height?: number|string;
  maxHeight?: number|string;
  minHeight?: number|string;
}
```

`ConfirmParams` and `InfoParams` extend `DialogSizeParams` directly.

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

`infoWindowWidth` and `infoWindowHeight` remain supported for backward compatibility. Prefer `Dialogs.setInfoDefault(...)` for new code; the legacy height is treated as `maxHeight`, matching its original behavior.

### `PromptParams`

```ts
export interface PromptParams extends DialogSizeParams {
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

### `ImagePreviewParams`

```ts
export interface ImagePreviewParams extends DialogSizeParams {
  title?: string;
  fullscreen?: boolean;
}
```

`ImagePreviewOptions` remains as a deprecated type alias for source compatibility.

### `IframeParams`

```ts
export type IframeSkin = 'inherit'|'light'|'dark';

export interface IframeParams extends DialogSizeParams {
  src?: string;
  srcdoc?: string;
  title?: string;
  fullscreen?: boolean;
  openUrl?: string;
  downloadUrl?: string;
  prependActions?: boolean;
  skin?: IframeSkin;
  scrim?: string;
  backgroundColor?: string;
  toolbarBackground?: string;
  contentBackground?: string;
  textColor?: string;
  cardStyle?: any;
  toolbarStyle?: any;
  frameStyle?: any;
}
```

### `IframeOptions`

```ts
export interface IframeOptions {
  actions?: (params: IframeParams) => Promise<Button[]|undefined>|Button[]|undefined;
}
```

### `DocumentPreviewParams`

```ts
export interface DocumentPreviewParams extends Omit<IframeParams, 'src'|'srcdoc'|'openUrl'|'downloadUrl'> {}
```

### `Dialogs`

```ts
export class Dialogs {
  // see source for full implementation
}
```

## Key Methods

- `static rootComponent()`
- `static $confirm(text: UIText, title?: UIText, params?: ConfirmParams): Promise<boolean>`
- `static $info(text: UIText, title?: UIText, params?: InfoParams): Promise<void>`
- `static $prompt(params?: PromptParams, options?: PromptOptions): Promise<any | undefined>`
- `static $imagePreview(src: string, params?: ImagePreviewParams): Promise<void>`
- `static $iframe(params?: IframeParams, options?: IframeOptions): Promise<void>`
- `static $documentPreview(src: string, params?: DocumentPreviewParams, options?: IframeOptions): Promise<void>`
- `static $warning(text: string)`
- `static $error(text: string)`
- `static $success(text: string)`
- `static $showProgress({ value, text }: any)`
- `static $updateProgress({ value, text }: any)`
- `static $hideProgress()`

## Sizing

Pass size constraints as the final params object for confirm and info dialogs:

```ts
const accepted = await Dialogs.$confirm(
  'Delete this record?',
  'Confirm deletion',
  {
    width: 480,
    maxWidth: 'calc(100vw - 32px)',
    minHeight: 220,
  },
)

await Dialogs.$info('The import has completed.', 'Import', {
  width: '36rem',
  maxWidth: '90vw',
  height: 320,
})
```

Prompt sizes can be supplied directly on `PromptParams`. Existing sizes under `dialogParams` also work; direct prompt size values take precedence.

```ts
await Dialogs.$prompt({
  title: 'Update reference',
  width: 640,
  maxWidth: '92vw',
  maxHeight: '80vh',
})
```

For image, iframe, and document previews, dimensions apply only in contained mode (`fullscreen: false`). Fullscreen mode intentionally occupies the viewport and ignores contained size constraints.

## Global Defaults

Each helper has a matching default setter:

```ts
Dialogs.setConfirmDefault({ width: 420, maxWidth: '92vw' })
Dialogs.setInfoDefault({ width: 560, maxHeight: '75vh' })
Dialogs.setPromptDefault({ width: 640, maxWidth: '92vw' })
Dialogs.setImagePreviewDefault({ fullscreen: false, width: 1100, height: '82vh' })
Dialogs.setIframeDefault({ fullscreen: false, width: 1200, height: '85vh' })
Dialogs.setDocumentPreviewDefault({ fullscreen: false, maxWidth: '94vw' })
```

Defaults are merged by default. Pass `true` as the second argument to replace the previous defaults:

```ts
Dialogs.setConfirmDefault({ width: 360 }, true)
```

Call-specific params always win over defaults. Prompt defaults merge nested `fieldParams`, `formParams`, and `dialogParams`, allowing a call to override one nested property without losing unrelated defaults.

The same defaults can be configured during bootstrap:

```ts
createVuetifyExtendedApp({
  defaults: {
    confirm: { width: 420, maxWidth: '92vw' },
    info: { width: 560, maxHeight: '75vh' },
    prompt: { width: 640, maxWidth: '92vw' },
    imagePreview: { fullscreen: false, height: '82vh' },
    iframe: { fullscreen: false, width: 1200, height: '85vh' },
    documentPreview: { maxWidth: '94vw' },
  },
})
```

`DialogForm` and `Selector` are class-based dialogs rather than static `Dialogs` helpers. They accept the same six size properties through `DialogParams` and `SelectorParams`, and their existing `setDefault(...)` methods remain available through the `dialogForm` and `selector` bootstrap default keys.

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
  Controls dialog-level flags like `persistent` and `fullscreen`. It also accepts `DialogSizeParams`; direct size properties on `PromptParams` take precedence.
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
  width: 960,
  height: '80vh',
})
```

Notes:

- `fullscreen` defaults to `true`
- this helper is designed for image content
- non-image document preview behavior is still handled separately by the field/document flow

## `$documentPreview(...)`

`Dialogs.$documentPreview(...)` opens a PDF/document preview inside the app instead of using a new browser tab.

Features:

- embedded dialog viewer using the browser's built-in document/PDF renderer
- powered by the same generic iframe dialog used by `Dialogs.$iframe(...)`
- `Esc` to close
- `Open` action for browser-tab fallback
- `Download` action
- supports fullscreen and contained dialog modes

Example:

```ts
await Dialogs.$documentPreview(
  pdfUrl,
  {
    title: 'Resume',
    fullscreen: false,
    width: 1100,
    height: '85vh',
  },
)
```

Notes:

- `fullscreen` defaults to `true`
- the current implementation is aimed at PDF preview
- zoom, paging, print, and similar controls come from the embedded browser viewer when supported
- non-previewable document types can still fall back to browser open/download flows

## `$iframe(...)`

`Dialogs.$iframe(...)` is the generic embedded-content preview helper used for document previews and any other browser-renderable iframe content.

Features:

- accepts either `src` or `srcdoc`
- shows content inside an in-app dialog
- supports optional `Open` and `Download` actions
- always uses an overflow menu for toolbar actions
- supports styling the dialog shell, toolbar, content area, and iframe surface

Example:

```ts
await Dialogs.$iframe(
  {
    src: previewUrl,
    title: 'Embedded Preview',
    fullscreen: false,
    prependActions: true,
  },
  {
    actions: async (params) => [
      new Button({ text: 'About', icon: 'mdi-information-outline' }, {
        onClicked: () => {
          void Dialogs.$info(`Preview title: ${params.title || 'Embedded Preview'}`);
        },
      }),
    ],
  },
)
```

Styling notes:

- `skin` defaults to `'inherit'`
- `'inherit'` means the dialog follows the active Vuetify theme and default surface styling
- use `skin: 'dark'` for a dark dialog shell
- use `skin: 'light'` when you want to force a light presentation
- `backgroundColor`, `toolbarBackground`, `contentBackground`, and `textColor` override the selected skin
- `cardStyle`, `toolbarStyle`, and `frameStyle` provide fine-grained inline styling hooks
- `prependActions: true` inserts custom `actions(...)` before the built-in `Open` / `Download` entries
- when `prependActions` is omitted or `false`, built-in actions appear first and custom actions are appended
