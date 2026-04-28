# Field

Most flexible input/display primitive in the library. `Field` is the single class that covers plain text inputs, booleans, selectors, date/time inputs, numeric inputs, HTML/code editors, media/document widgets, collection/table widgets, charts, message rendering, and all supported map/geometry widgets.

## Source

- [src/ui/field.ts](../../src/ui/field.ts)
- [src/ui/widgets/field-rich-widgets.ts](../../src/ui/widgets/field-rich-widgets.ts)
- [src/ui/widgets/field-table-widgets.ts](../../src/ui/widgets/field-table-widgets.ts)

## Highlights

- `Field` is type-driven: the same class changes behavior based on `params.type`.
- `storage` binds the field to a nested path in a `Master` object.
- `params` describe appearance and static behavior, while `options` provide dynamic behavior, async data loading, and hooks.
- `multiple` changes the stored datatype for many field types.
- Some types are pure input widgets, some are display widgets, and some are small workflow widgets such as `collection`, `messagingbox`, `table`, and map geometries.

## Factory

```ts
$FD // Field
```

## Supported Types

```ts
export type FieldType =
  'text'|'select'|'autocomplete'|'label'|
  'messagingbox'|'chart'|'viewtable'|
  'map'|'map-line'|'map-circle'|'map-rectangle'|'map-polygon'|'map-heatmap'|'map-cluster'|'map-geojson'|
  'code'|'color'|'html'|'htmlview'|'listselect'|
  'time'|'date'|'datetime'|'button'|'image'|
  'document'|'password'|'float'|'integer'|'decimal'|
  'collection'|'textarea'|'boolean'|'table'|'reporttable'|'servertable';
```

## Quick Mental Model

Use this mental split when designing a field:

- Entry fields:
  `text`, `textarea`, `password`, `boolean`, `float`, `integer`, `decimal`, `date`, `time`, `datetime`, `color`
- Selection fields:
  `select`, `autocomplete`, `listselect`
- Display fields:
  `label`, `htmlview`, `chart`
- Rich editor/media fields:
  `html`, `code`, `image`, `document`, `messagingbox`
- Dataset widgets:
  `table`, `viewtable`, `reporttable`, `servertable`, `collection`
- Geo widgets:
  `map`, `map-line`, `map-circle`, `map-rectangle`, `map-polygon`, `map-heatmap`, `map-cluster`, `map-geojson`
- Action field:
  `button`

## `FieldParams`

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
  hideMapText?: boolean;
  mapTextPageSize?: number;
  fileAccepts?: any;
  fileMaxSize?: number;
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

## `FieldOptions`

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

## Common Param and Option Notes

### Common params

- `storage`
  Nested path inside `Master`, for example `name`, `address.city`, or `items.0.price`.
- `default`
  Static default value used when the bound `Master` path is empty. `options.default(...)` is the dynamic equivalent.
- `readonly`
  Forces display-only behavior regardless of report/form mode.
- `required`
  Adds the built-in required rule.
- `validation`
  Adds built-in range/comparison/length/regex validators.
- `multiple`
  Switches many field types from scalar to array storage.
- `class`, `style`, `height`, `minHeight`, `maxHeight`, `minWidth`
  Standard layout/appearance hooks that apply directly to the underlying widget.
- grid params `cols`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
  Control the `VCol` that wraps the field.

### Common options

- `master`
  Explicit `Master` instance to bind to.
- `selectOptions(...)`
  Async/static selection item loader for `select`, `autocomplete`, and `listselect`.
- `headers(...)`
  Header loader for table-like widgets and the `collection` field.
- `items(...)`
  Data loader for table-like widgets and related display widgets.
- `format(...)`
  Final display transformation hook for datasets before rendering.
- `validate(...)`
  Extra custom validation beyond the built-in `validation` object.
- `changed(...)`
  Runs after the field has pushed its new value back into `Master`.
- `focusChanged(...)`
  Focus gain/loss callback.
- `on(...)`
  Event handlers registered through the field event system.

## Event Model

`Field` emits and/or supports these common hook points:

- `setup`
- `changed`
- `focus-changed`
- `focus-gained`
- `focus-lost`

Collection fields also emit:

- `form-saved`
- `form-cancel`
- `item-clicked`
- `item-removed`

## Master Storage Datatype by Field Type

This is the most important quick reference when binding a field to `Master`.

| Field type | Stored datatype in `Master` |
| --- | --- |
| `text` | `string`, or `string[]` when `multiple: true` |
| `textarea` | `string` |
| `password` | `string` |
| `label` | usually no meaningful stored value is required |
| `button` | usually no meaningful stored value is required |
| `boolean` | `boolean` |
| `select` | selected value, or selected values array when `multiple: true`; object(s) when `returnObject: true` |
| `autocomplete` | same as `select` |
| `listselect` | selected value, or selected values array when `multiple: true` |
| `date` | numeric `SimpleDate` representation, or `number[]` when `multiple: true` |
| `time` | numeric `SimpleTime` representation, or `number[]` when `multiple: true` |
| `datetime` | whatever the datepicker emits; default usage is usually `Date` |
| `float` | `number` |
| `integer` | `number` |
| `decimal` | `{ $numberDecimal: string }` |
| `color` | `string` |
| `html` | `string` |
| `htmlview` | `string` if bound |
| `code` | `string` |
| `image` | `string` or `string[]` when `multiple: true` |
| `document` | `string` or `string[]` when `multiple: true` |
| `messagingbox` | `any[]` |
| `chart` | no fixed stored datatype; usually driven by `chartData(...)` / `chartOptions(...)` |
| `table` | usually `any[]` |
| `viewtable` | usually `any[]` |
| `reporttable` | usually `any[]` |
| `servertable` | usually dataset comes from `items(...)`; stored datatype is app-defined if bound |
| `collection` | `Array<Record<string, any>>` |
| `map` | `{ lat: number, lng: number }` |
| `map` with `multiple: true` | `Array<{ lat: number, lng: number }>` |
| `map-line` | GeoJSON `LineString` |
| `map-circle` | `{ center: { lat: number, lng: number }, radius: number }` |
| `map-rectangle` | `{ north: number, south: number, east: number, west: number }` |
| `map-polygon` | GeoJSON `Polygon` |
| `map-heatmap` | array of weighted point objects |
| `map-cluster` | array of point objects |
| `map-geojson` | GeoJSON `Feature`, `FeatureCollection`, or geometry object |

## Field-Type Reference

Each section below describes the stored datatype, relevant params, relevant options, and important behavior for that field type.

### `text`

- Stored datatype:
  `string`, or `string[]` when `multiple: true`
- Widget:
  `VTextField` for single values, `VCombobox` for `multiple: true`
- Relevant params:
  `placeholder`, `clearable`, `autofocus`, `variant`, `color`, `multiple`
- Relevant options:
  `default`, `changed`, `validate`, `focusChanged`
- Notes:
  `multiple: true` turns free-text entry into a chip/list style field backed by an array.

### `textarea`

- Stored datatype:
  `string`
- Widget:
  `VTextarea`
- Relevant params:
  `placeholder`, `clearable`, `autofocus`, `variant`, `color`, `height`
- Relevant options:
  `default`, `changed`, `validate`, `focusChanged`

### `password`

- Stored datatype:
  `string`
- Widget:
  `VTextField` with `type: 'password'`
- Relevant params:
  same as `text`
- Relevant options:
  same as `text`

### `label`

- Stored datatype:
  usually none
- Widget:
  simple HTML block using `params.label`
- Relevant params:
  `label`, `class`, `style`
- Relevant options:
  rarely needed
- Notes:
  This is a display field. If `storage` is present it is not normally used for rendering.

### `button`

- Stored datatype:
  usually none
- Widget:
  a `Button` instance returned by `options.button(field)`
- Relevant params:
  `label`, `color`, sizing/layout params
- Relevant options:
  `button(...)`
- Notes:
  The actual rendered button behavior comes from the nested `Button` object, not from a text-like field value.

### `boolean`

- Stored datatype:
  `boolean`
- Widget:
  `VSwitch` by default, `VCheckboxBtn` when `checkbox: true`
- Relevant params:
  `checkbox`, `inline`, `color`
- Relevant options:
  `default`, `changed`

### `select`

- Stored datatype:
  selected value, selected values array, or object(s) depending on `multiple` / `returnObject`
- Widget:
  `VSelect`
- Relevant params:
  `multiple`, `itemTitle`, `itemValue`, `idField`, `returnObject`, `options`, `clearable`
- Relevant options:
  `selectOptions(...)`
- Notes:
  `itemValue` / `idField` resolution falls back to the global `Master` id-field default, then `_id`, then `id`.

### `autocomplete`

- Stored datatype:
  same as `select`
- Widget:
  `VAutocomplete`
- Relevant params:
  same as `select`
- Relevant options:
  `selectOptions(...)`
- Notes:
  Uses `autoSelectFirst: true` internally.

### `listselect`

- Stored datatype:
  selected value, or selected values array when `multiple: true`
- Widget:
  radio-list when `multiple` is false, checkbox-list when `multiple` is true
- Relevant params:
  `multiple`, `inline`, `itemTitle`, `itemValue`, `idField`, `color`, `hint`
- Relevant options:
  `selectOptions(...)`
- Notes:
  This type is useful when you want always-visible choices instead of a dropdown.

### `date`

- Stored datatype:
  numeric `SimpleDate` representation, or `number[]` when `multiple: true`
- UI datatype:
  string date value(s)
- Widget:
  single-value browser-style date input for non-multiple mode, `VCombobox` for multiple mode
- Relevant params:
  `multiple`, `clearable`, `autofocus`, `validation`
- Relevant options:
  `default`, `validate`
- Notes:
  `Field` preprocesses date values into string form for the UI, then postprocesses them back into numeric `SimpleDate` values before writing into `Master`.

### `time`

- Stored datatype:
  numeric `SimpleTime` representation, or `number[]` when `multiple: true`
- UI datatype:
  string time value(s)
- Widget:
  browser-style time input
- Relevant params:
  `multiple`, `clearable`, `autofocus`, `validation`
- Relevant options:
  `default`, `validate`
- Notes:
  Like `date`, time values are normalized by `Field` before storage.

### `datetime`

- Stored datatype:
  whatever the datepicker emits; default setups normally store a `Date`
- Widget:
  `@vuepic/vue-datepicker`
- Relevant params:
  `clearable`, `autofocus`, `placeholder`, `hint`
- Relevant options:
  `datetimeOptions`
- Notes:
  `datetimeOptions` is forwarded directly to the datepicker. If you configure the picker to emit a custom model type, that becomes the datatype stored in `Master`.

### `float`

- Stored datatype:
  `number`
- Widget:
  numeric `VTextField`
- Relevant params:
  `validation`, `default`
- Relevant options:
  `validate`, `changed`

### `integer`

- Stored datatype:
  `number`
- Widget:
  numeric `VTextField`
- Relevant params:
  `validation`, `default`
- Relevant options:
  `validate`, `changed`
- Notes:
  Input is filtered to digits and `-` in the browser event handler.

### `decimal`

- Stored datatype:
  `{ $numberDecimal: string }`
- UI datatype:
  string/number-like value
- Widget:
  numeric `VTextField`
- Relevant params:
  `decimalPlaces`, `validation`
- Relevant options:
  `validate`, `changed`
- Notes:
  On blur, decimal text is normalized to the configured number of decimal places.

### `color`

- Stored datatype:
  `string`
- Widget:
  color-preview + dialog-based `VColorPicker`
- Relevant params:
  `label`, `color`, `variant`
- Relevant options:
  `changed`

### `html`

- Stored datatype:
  `string`
- Widget:
  TinyMCE editor
- Relevant params:
  `placeholder`, `height`, `class`, `style`
- Relevant options:
  none special beyond common hooks
- Notes:
  Supports fullscreen preview and formula rendering helpers.

### `htmlview`

- Stored datatype:
  `string` when bound
- Widget:
  raw HTML output block
- Relevant params:
  `resolveFormulas`, `class`, `style`
- Relevant options:
  rarely needed
- Notes:
  If `resolveFormulas` is true, inline/display math is rendered before display.

### `code`

- Stored datatype:
  `string`
- Widget:
  Ace editor
- Relevant params:
  `lang`, `codeTheme`, `height`, `class`, `style`
- Relevant options:
  common hooks only
- Notes:
  Includes preview/fullscreen support for rendered output such as LaTeX and HTML-like content.

### `image`

- Stored datatype:
  `string`, or `string[]` when `multiple: true`
- Widget:
  media upload/preview widget
- Relevant params:
  `fileAccepts`, `fileMaxSize`, `height`, `multiple`
- Relevant options:
  common hooks only
- Notes:
  Values are usually base64/data URLs but can also be remote renderable URLs.

### `document`

- Stored datatype:
  `string`, or `string[]` when `multiple: true`
- Widget:
  document upload/preview widget
- Relevant params:
  `fileAccepts`, `fileMaxSize`, `height`, `multiple`
- Relevant options:
  common hooks only
- Notes:
  Defaults accepted types to PDF-related values when not explicitly set.

### `messagingbox`

- Stored datatype:
  `any[]`
- Widget:
  chat/message stream view
- Relevant params:
  `messageInitialCount`, `messagePageSize`, `height`
- Relevant options:
  `messageFormat(...)`
- Notes:
  The stored value is the raw message array. `messageFormat(...)` maps each record into the displayed chat/message shape.

### `chart`

- Stored datatype:
  app-defined; often no direct storage is needed
- Widget:
  ApexCharts view
- Relevant params:
  `chartType`, `height`
- Relevant options:
  `chartData(...)`, `chartOptions(...)`
- Notes:
  Most chart fields are driven entirely from the options hooks instead of the raw bound field value.

### `table`

- Stored datatype:
  usually `any[]`
- Widget:
  local data table
- Relevant params:
  `itemsPerPage`, `height`, `checkbox`, `hasFooter`
- Relevant options:
  `headers(...)`, `items(...)`, `format(...)`, `footer(...)`

### `viewtable`

- Stored datatype:
  usually `any[]`
- Widget:
  readonly table view
- Relevant params:
  similar to `table`
- Relevant options:
  `headers(...)`, `items(...)`, `format(...)`, `footer(...)`

### `reporttable`

- Stored datatype:
  usually `any[]`
- Widget:
  report-style table view
- Relevant params:
  similar to `table`
- Relevant options:
  `headers(...)`, `items(...)`, `format(...)`, `footer(...)`

### `servertable`

- Stored datatype:
  app-defined if bound; commonly the field is used as a display surface rather than a persisted value
- Widget:
  server-backed table
- Relevant params:
  `itemsPerPage`, `height`, `checkbox`
- Relevant options:
  `headers(...)`, `items(field, options)`
- Notes:
  `items(...)` normally returns a paginated object such as `{ data, total, limit }`.

### `collection`

- Stored datatype:
  `Array<Record<string, any>>`
- Internal UI detail:
  items are augmented with `__index` for editing/removal identity
- Widget:
  embedded `VDataTable` plus dialog-based row form workflow
- Relevant params:
  `itemsPerPage`, `height`, `hasFooter`
  `collectionStart`, `collectionEnd`
  `collectionDisableAdd`, `collectionDisableRemove`
  `idField`
- Relevant options:
  `form(...)`
  `headers(...)`
  `format(...)`
  `footer(...)`
  `canRemoveItem(...)`
  `canEditItem(...)`
- Detailed behavior:
  - `form(...)` must return the row form used for create/edit/display.
  - `headers(...)` supplies the table columns.
  - `format(...)` transforms a cloned copy of collection items for display.
  - `footer(...)` supplies footer rows when `hasFooter: true`.
  - `collectionStart` and `collectionEnd` slice the displayed subset of items.
  - add button is hidden when:
    - field is readonly
    - `collectionDisableAdd` is true
    - `collectionEnd` has been reached
  - remove button is hidden when:
    - nothing is selected
    - field is readonly
    - `collectionDisableRemove` is true
  - clicking a row opens the row form in:
    - `edit` mode for editable fields
    - `display` mode for readonly fields
  - clicking add opens the row form in `create` mode with a fresh nested `Master`
  - saving a created row appends it into the bound `Master` collection path
  - saving an edited row updates the existing row using:
    - resolved item id from `idField` / default id-field chain
    - or `__index` fallback when no stable id exists
- Master datatype notes:
  - stored value is still an array of row objects
  - the runtime may attach `__index` to items for UI identity and update operations
  - if you do not want to treat `__index` as business data, consider it an internal helper field

### `map`

- Stored datatype:
  `{ lat: number, lng: number }`
- With `multiple: true`:
  `Array<{ lat: number, lng: number }>`
- Widget:
  editable point map or multi-marker map
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`, `mapTextPageSize`, `multiple`
- Relevant options:
  none special beyond common hooks
- Notes:
  - single-point mode edits one marker
  - multi-marker mode allows click-to-add, drag-to-move, and right-click removal
  - reverse-geocoded text is shown below the map unless `hideMapText` is true
  - in create mode, an empty point map tries to seed from browser geolocation

### `map-line`

- Stored datatype:
  GeoJSON `LineString`

```ts
{
  type: 'LineString',
  coordinates: [[lng, lat], [lng, lat]]
}
```

- Widget:
  editable route/path map
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`, `mapTextPageSize`
- Notes:
  click adds points; vertex editing updates the GeoJSON; reverse-geocoded point text can be paged.

### `map-circle`

- Stored datatype:

```ts
{
  center: { lat: number, lng: number },
  radius: number
}
```

- Radius unit:
  meters
- Widget:
  editable center/radius map
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`
- Notes:
  center is reverse-geocoded below the map, and radius text is shown in kilometers. In create mode, an empty circle seeds from browser geolocation with a default radius of `1000`.

### `map-rectangle`

- Stored datatype:

```ts
{
  north: number,
  south: number,
  east: number,
  west: number
}
```

- Coordinate meaning:
  - `north` / `south` are latitude numbers
  - `east` / `west` are longitude numbers
- Widget:
  editable bounds rectangle
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`, `mapTextPageSize`
- Notes:
  rectangle corner summaries are reverse-geocoded below the map. In create mode, an empty rectangle seeds to a 1 km square around the current geolocation.

### `map-polygon`

- Stored datatype:
  GeoJSON `Polygon`

```ts
{
  type: 'Polygon',
  coordinates: [
    [[lng, lat], [lng, lat], [lng, lat], [lng, lat]]
  ]
}
```

- Widget:
  editable area polygon
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`, `mapTextPageSize`
- Notes:
  text summaries can grow large, so `mapTextPageSize` is especially useful here. In create mode, an empty polygon seeds to a 1 km square around the current geolocation.

### `map-heatmap`

- Stored datatype:
  array of weighted points, commonly:

```ts
[
  { location: { lat: number, lng: number }, weight?: number }
]
```

- Widget:
  display-only density view
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`
- Notes:
  not editable through the built-in UI.

### `map-cluster`

- Stored datatype:
  usually `Array<{ lat: number, lng: number }>`
- Widget:
  display-only clustered marker map
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`
- Notes:
  optimized for dense point sets; not editable.

### `map-geojson`

- Stored datatype:
  GeoJSON `Feature`, `FeatureCollection`, or geometry object
- Widget:
  display-only mixed-geometry renderer
- Relevant params:
  `mapApiKey`, `mapOptions`, `mapZoom`
- Notes:
  useful when your backend already speaks GeoJSON and you do not want type-specific editing.

## Per-Family Param Guidance

### Selection fields

The most important params/options for `select`, `autocomplete`, and `listselect` are:

- `itemTitle`
- `itemValue`
- `idField`
- `returnObject`
- `multiple`
- `selectOptions(...)`

Recommended rule:
set `itemValue` explicitly when the item id is not obvious.

### Numeric fields

The most important params/options for `float`, `integer`, and `decimal` are:

- `validation`
- `decimalPlaces`
- `default`

Recommended rule:
use `decimal` when your backend expects Mongo-style decimal storage.

### Table and collection fields

The most important params/options are:

- `headers(...)`
- `items(...)`
- `format(...)`
- `footer(...)`
- `itemsPerPage`
- `height`

For `collection`, also treat these as core:

- `form(...)`
- `canRemoveItem(...)`
- `canEditItem(...)`
- `collectionStart`
- `collectionEnd`
- `collectionDisableAdd`
- `collectionDisableRemove`

### Map and geometry fields

The most important params are:

- `mapApiKey`
- `mapOptions`
- `mapZoom`
- `hideMapText`
- `mapTextPageSize`

Recommended rule:
use `hideMapText: true` when the geocoded text is not part of the workflow, because it also skips the geocoding work.

## Key Methods and Runtime Helpers

### `Field`

```ts
export class Field extends UIBase {
  // see source for full implementation
}
```

Commonly useful methods:

- `setParams(params)`
- `forceLoadCollectionInfo()`
- `forceLoadTableInfo()`
- `clearTableSelection()`
- `$reload()`

Useful runtime properties:

- `$params`
- `$value`
- `$options`
- `$readonly`
- `$collectionForm`
- `$parentReport`

## Practical Notes

- `Field` pushes changes back into `Master` through `storage` whenever the bound UI value changes.
- `options.modifies` receives the same resolved value that is written into `Master`.
- `date` and `time` are normalized before storage; `datetime` is not normalized beyond what the datepicker emits.
- `decimal` is normalized into `{ $numberDecimal: string }` before storage.
- Some display widgets such as `label`, `button`, and many `chart` uses do not need meaningful `storage`.

## Example

```ts
new Field(
  {
    label: 'Appointment',
    storage: 'appointment',
    type: 'datetime',
    cols: 6,
  },
  {
    datetimeOptions: {
      enableTimePicker: true,
      autoApply: false,
    },
  },
)
```
