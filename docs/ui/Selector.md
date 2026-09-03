# Selector

Selection-oriented screen/dialog pattern for choosing one or more items from a list or service source.

## Source

- [src/ui/selector.ts](../../src/ui/selector.ts)

## Highlights

- Supports persistent selector behavior and keyboard workflow integration.
- Often used as a sub-flow inside reports, triggers, and collections.

## Reference

### `SelectorParams`

```ts
export interface SelectorParams extends DialogSizeParams {
  ref?: string;
  invisible?: boolean;
  persistent?: boolean;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  mode?: 'create'|'edit'|'display';
  cancelButton?: ButtonParams,
  saveButton?: ButtonParams,
  elevation?: number;
  selectFields?: any;
  objectType?: any;
  idField?: any;
  returnObject?: boolean;
  textField?: any;
  defaultButtonPosition?: "top"|"bottom"|"both";
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}
```

The inherited `DialogSizeParams` provides `width`, `maxWidth`, `minWidth`, `height`, `maxHeight`, and `minHeight`. Numeric dimensions are pixels; CSS-unit strings are accepted and constrained to the viewport.

### `SelectorOptions`

```ts
export interface SelectorOptions {
  cancel?: () => Promise<void>;
  access?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<boolean>|boolean;
  load?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any[]>|any[];
  query?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  format?: (item: any, items: any[], selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  selected?: (item: any, selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  setup?: (selector: Selector) => void;
  on?: (selector: Selector) => OnHandler;
}
```

### `Selector`

```ts
export class Selector extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: SelectorParams, reset?: boolean)`
- `render(props: any, context: any)`

## ID Resolution

- `SelectorParams.idField` is used first when you provide it.
- Otherwise, selector item resolution falls back to `Master.setDefault({ idField: ... })`, then `_id`, then `id`.
