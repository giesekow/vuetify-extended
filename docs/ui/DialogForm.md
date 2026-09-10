# DialogForm

Form wrapper that runs inside a dialog surface and reuses the same field/form/button model as the rest of the library.

## Source

- [src/ui/dialogform.ts](../../src/ui/dialogform.ts)

## Highlights

- Supports params/defaults plus callback-based options.
- Works with the shared dialog stack and keyboard behavior.

## Reference

### `DialogParams`

```ts
export interface DialogSizeParams {
  width?: number|string;
  maxWidth?: number|string;
  minWidth?: number|string;
  height?: number|string;
  maxHeight?: number|string;
  minHeight?: number|string;
}

export interface DialogParams extends DialogSizeParams {
  ref?: string;
  objectType?: any;
  objectId?: any;
  invisible?: boolean;
  persistent?: boolean;
  mode?: 'create'|'edit'|'display';
  closeOnSave?: boolean;
  fullscreen?: boolean|undefined;
}
```

### `DialogFormOptions`

```ts
export interface DialogFormOptions {
  master?: Master;
  form?: (props: any, context: any) => Promise<Form|undefined>|Form|undefined;
  saved?: () => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  access?: (dialog: DialogForm, mode?: any) => Promise<boolean>|boolean;
  setup?: (dialog: DialogForm) => void;
  on?: (dialog: DialogForm) => OnHandler;
}
```

### `DialogForm`

```ts
export class DialogForm extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: DialogParams, reset?: boolean)`
- `render(props: any, context: any)`
- `show(): Promise<void>`
- `hide(): Promise<void>`
- `forceCancel(): Promise<void>`

## Close Lifecycle And Focus

`hide()` changes the dialog model to inactive and waits for Vuetify's leave
transition before resolving. Keep the `DialogForm` component mounted until the
returned promise settles. If the component is externally unmounted during the
transition, ref cleanup safely completes the pending hide.

`forceCancel()` awaits that close lifecycle before running the cancel callback
and emitting the `cancel` event. When a dialog is shown through `AppMain`, the
shell captures and restores focus. `DialogForm` deliberately does not perform a
second local restoration. Standalone prompts created by `Dialogs.$prompt(...)`
have their own equivalent focus handling in `Dialogs`.

See [Prompt teardown regression](../prompt-close-verification.md) for the
underlying Vuetify lifecycle failure and regression coverage.

## Sizing And Defaults

```ts
DialogForm.setDefault({
  maxWidth: '92vw',
  maxHeight: '85vh',
})

const dialog = new DialogForm({
  width: 760,
  height: 520,
})
```

Instance params override global defaults. The same defaults can be supplied as `defaults.dialogForm` to `createVuetifyExtendedApp(...)`.
When `fullscreen` is `true`, contained-dialog dimensions are intentionally ignored.
