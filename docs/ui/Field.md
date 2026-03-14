# Field

Most flexible input/display primitive in the library. `Field` covers text inputs, selects, editors, tables, charts, maps, collections, messaging UI, and file/image/document display.

## Source

- [src/ui/field.ts](../../src/ui/field.ts)

## Highlights

- `Field` is heavily type-driven: the same class adapts behavior based on `params.type`.
- Widget rendering is split across `field-rich-widgets.ts` and `field-table-widgets.ts` for heavier types.
- Common params/options apply across many types, while some are only meaningful for specific families such as messaging, charts, maps, or table widgets.

## Supported Types

```ts
export type FieldType = 'text'|'select'|'autocomplete'|'label'|
                        'messagingbox'|'chart'| 'viewtable'|
                        'map'|'code'|'color'|'html'|'htmlview'|'listselect'|
                        'time'|'date'|'datetime'|'button'|'image'|
                        'document'|'password'|'float'|'integer'|'decimal'|
                        'collection'|'textarea'|'boolean'|'table'|'reporttable'|'servertable';
```

## Type Families

- **Text and simple entry:** `text`, `textarea`, `password`, `label`, `button`, `boolean`
- **Selection and lookup:** `select`, `autocomplete`, `listselect`, `collection`
- **Date and time:** `date`, `time`, `datetime`
- **Numeric:** `float`, `integer`, `decimal`, `color`
- **Rich content and media:** `html`, `htmlview`, `code`, `image`, `document`, `messagingbox`, `chart`, `map`
- **Table-oriented widgets:** `table`, `viewtable`, `reporttable`, `servertable`

## Param Relevance by Type Family

### Common params used by many field types

- `type`, `label`, `storage`, `placeholder`, `readonly`, `invisible`, `default`, `required`
- `variant`, grid sizing (`xs`-`xxl`, `cols`), `class`, `style`, `height`, `minHeight`, `maxHeight`, `minWidth`
- `hint`, `icon`, `color`, `autofocus`, `clearable`, `inline`, `bordered`
- `validation` plus `options.rules(...)` / `options.validate(...)`

### Selection-oriented params

- `options`, `multiple`, `idField`, `itemValue`, `itemTitle`, `returnObject`, `checkbox`
- `options.selectOptions(field)` to load items dynamically

### Collection/table params

- `itemsPerPage`, `hasFooter`, `collectionStart`, `collectionEnd`, `collectionDisableAdd`, `collectionDisableRemove`
- `options.headers(...)`, `options.items(...)`, `options.format(...)`, `options.footer(...)`
- `options.form(...)` when a collection/table opens row forms

### Rich widget params

- `lang`, `codeTheme` for code/html fields
- `chartType`, `options.chartData(...)`, `options.chartOptions(...)` for charts
- `mapApiKey`, `mapOptions`, `mapZoom` for maps
- `messageInitialCount`, `messagePageSize`, `options.messageFormat(...)` for messagingbox
- `fileAccepts`, `fileMaxSize` for image/document uploads or previews

### Numeric/date helpers

- `decimalPlaces` for decimal/float formatting and validation
- `datetimeOptions` for date/datetime field adapters

## Common Params and Options

### `FieldParams`

```ts
export interface FieldParams {
  ref?: string;
  type?: FieldType;
  label?: string;
  storage?: string;
  placeholder?: string;
  multiple?: boolean;
  options?: any;
  readonly?: boolean;
  invisible?: boolean;
  idField?: string;
  lang?: 'html'|'json'|'javascript'|'python'|'python'|'text'|'ejs'|'latex';
  codeTheme?: 'chrome'|'xcode';
  hint?: string;
  icon?: string;
  clearable?: boolean;
  autofocus?: boolean;
  inline?: boolean;
  color?: string;
  itemValue?: string;
  itemTitle?: string;
  returnObject?: boolean;
  itemsPerPage?: string|number;
  class?: string[];
  style?: any;
  height?: number;
  maxHeight?: number|string|undefined;
  minHeight?: number|string|undefined;
  minWidth?: number;
  variant?: "filled" | "outlined" | "plain" | "underlined" | "solo" | "solo-inverted" | "solo-filled" | undefined;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  chartType?: any;
  mapApiKey?: any;
  mapOptions?: any;
  mapZoom?: number;
  fileAccepts?: any;
  fileMaxSize?: number; // In KB
  messageInitialCount?: number;
  messagePageSize?: number;
  bordered?: boolean;
  default?: any;
  required?: boolean;
  decimalPlaces?: number;
  collectionStart?: number;
  collectionEnd?: number;
  collectionDisableAdd?: boolean;
  collectionDisableRemove?: boolean;
  hasFooter?: boolean;
  checkbox?: boolean;
  resolveFormulas?: boolean;
  validation?: {
    range?: { from: any, to: any, converter?: any};
    max?: {value: any, converter?: any};
    min?: {value: any, converter?: any};
    gt?: {value: any, converter?: any};
    lt?: {value: any, converter?: any};
    gte?: {value: any, converter?: any};
    lte?: {value: any, converter?: any};
    neq?: {value: any, converter?: any};
    eq?: {value: any, converter?: any};
    in?: any[];
    nin?: any[];
    includes?: any;
    excludes?: any;
    maxLen?: number;
    minLen?: number;
    regex?: string;
  }
}
```

### `FieldOptions`

```ts
export interface FieldOptions {
  master?: Master;
  modifies?: Ref<any>;
  datetimeOptions?: any|undefined;
  selectOptions?: (field: Field) => Promise<any[]|undefined>|any[]|undefined;
  button?: (field: Field) => Button|undefined;
  form?: (field: Field) => Promise<Form|undefined>|Form|undefined;
  headers?: (field: Field) => Promise<any[]|undefined>|any[]|undefined;
  items?: (field: Field, options?: any) => Promise<any[]|any|undefined>|any[]|any|undefined;
  format?: (field: Field, items: any[]) => any[]|undefined;
  footer?: (field: Field, items: any[]) => any[]|undefined;
  chartData?: (field: Field) => Promise<any|undefined>|any|undefined;
  chartOptions?: (field: Field) => Promise<any|undefined>|any|undefined;
  messageFormat?: (field: Field, data: any) => any[];
  rules?: (field: Field) => any[];
  changed?: (field: Field) => void;
  focusChanged?: (field: Field, focused: boolean) => void;
  setup?: (field: Field) => void;
  validate?: (field: Field) => Promise<string|undefined>|string|undefined;
  default?: (field: Field) => any;
  on?: (field: Field) => OnHandler;
  canRemoveItem?: (field: Field, item: any) => Promise<boolean>|boolean|undefined;
  canEditItem?: (field: Field, item: any) => Promise<boolean>|boolean|undefined;
}
```

### `Field`

```ts
export class Field extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: FieldParams, reset?: boolean)`
- `setParams(params: FieldParams)`
- `render(props: any, context: any)`

## Practical Notes

- `options.changed(field)` and `options.focusChanged(field, focused)` are the main hooks for host-side reactions.
- Heavier renderers are delegated to [src/ui/widgets/field-rich-widgets.ts](../../src/ui/widgets/field-rich-widgets.ts) and [src/ui/widgets/field-table-widgets.ts](../../src/ui/widgets/field-table-widgets.ts).
- `storage` is especially important when the field is bound to a `Master`, `Form`, or `Report` data object.

## Example

```ts
new Field(
  { type: 'text', label: 'Name', storage: 'name', required: true },
  {
    rules: () => [$v.required()],
  },
)

new Field(
  { type: 'autocomplete', label: 'Customer', storage: 'customerId', itemTitle: 'name', itemValue: '_id' },
  {
    selectOptions: async () => apiCustomers,
  },
)

new Field(
  { type: 'messagingbox', storage: 'messages', messageInitialCount: 50, messagePageSize: 50 },
  {
    messageFormat: (field, raw) => raw,
  },
)
```
