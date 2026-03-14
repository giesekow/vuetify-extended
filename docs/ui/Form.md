# Form

Composable form container that hosts fields, action buttons, validation, save/cancel flows, and keyboard-first behavior.

## Source

- [src/ui/form.ts](../../src/ui/form.ts)

## Highlights

- Coordinates field loading, validation, save/cancel/prev/next actions, and focus handling.
- Implements built-in `Ctrl+S` / `Meta+S` and Escape behavior for reports/dialogs.

## Reference

### `FormParams`

```ts
export interface FormParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  title?: string;
  subtitle?: string;
  mode?: ReportMode;
  auto?: boolean;
  sub?: boolean;
  hideMode?: boolean;
  saveButton?: ButtonParams,
  cancelButton?: ButtonParams,
  prevButton?: ButtonParams,
  showSaveInReadonly?: boolean;
  elevation?: number;
  maxWidth?: number|string|undefined;
  minWidth?: number|string|undefined;
  maxHeight?: number|string|undefined;
  minHeight?: number|string|undefined;
  width?: number|string|undefined;
  cardClass?: string|string[];
  defaultButtonPosition?: "top"|"bottom"|"both";
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  udf?: string | string[];
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}
```

### `FormOptions`

```ts
export interface FormOptions {
  master?: Master;
  topChildren?: (props: any, context: any) => Array<Part>;
  bottomChildren?: (props: any, context: any) => Array<Part>;
  children?: (props: any, context: any) => Array<Part>;
  buttons?: (props: any, context: any) => Array<Button>;
  bottomButtons?: (props: any, context: any) => Array<Button>;
  leftButtons?: (props: any, context: any) => Array<Button>;
  bottomLeftButtons?: (props: any, context: any) => Array<Button>;
  validate?: (form: Form) => Promise<string|true|undefined|void>|string|true|undefined|void;
  saved?: (form: Form) => Promise<void>|void;
  afterSaved?: (form: Form) => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  canCancel?: (form: Form) => Promise<boolean|undefined>|boolean|undefined
  access?: (form: Form, mode: any) => Promise<boolean>|boolean;
  processUDF?: (form: Form, udfs: any[]) => Promise<any[]>;
  setup?: (form: Form) => void,
  preUDFOptions?: PartParams;
  postUDFOptions?: PartParams;
  on?: (form: Form) => OnHandler;
  removeEventListeners?: (form: Form) => Promise<void>|void
  attachEventListeners?: (form: Form) => Promise<void>|void
}
```

### `Form`

```ts
export class Form extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: FormParams, reset?: boolean)`
- `render(props: any, context: any)`
