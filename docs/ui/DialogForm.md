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
export interface DialogParams {
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

- `render(props: any, context: any)`
