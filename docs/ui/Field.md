# Field

Most flexible input/display primitive in the library. `Field` covers text inputs, selects, editors, tables, charts, maps, collections, messaging UI, and file/image/document display.

## Source

- [src/ui/field.ts](../../src/ui/field.ts)

## Highlights

- `Field` is heavily type-driven: the same class adapts behavior based on `params.type`.
- Widget rendering is split across `field-rich-widgets.ts` and `field-table-widgets.ts` for heavier types.
- Common params/options apply across many types, while some are only meaningful for specific families such as messaging, charts, maps, or table widgets.
- If `itemValue` / `idField` is omitted, `Field` falls back to the global `Master` id field and then `_id` / `id` based on the available items.

## Supported Types

```ts
export type FieldType = 'text'|'select'|'autocomplete'|'label'|
                        'messagingbox'|'chart'| 'viewtable'|
                        'map'|'map-line'|'map-circle'|'map-rectangle'|'map-polygon'|'map-heatmap'|'map-cluster'|'map-geojson'|'code'|'color'|'html'|'htmlview'|'listselect'|
                        'time'|'date'|'datetime'|'button'|'image'|
                        'document'|'password'|'float'|'integer'|'decimal'|
                        'collection'|'textarea'|'boolean'|'table'|'reporttable'|'servertable';
```

## Type Families

- **Text and simple entry:** `text`, `textarea`, `password`, `label`, `button`, `boolean`
- **Selection and lookup:** `select`, `autocomplete`, `listselect`, `collection`
- **Date and time:** `date`, `time`, `datetime`
- **Numeric:** `float`, `integer`, `decimal`, `color`
- **Rich content and media:** `html`, `htmlview`, `code`, `image`, `document`, `messagingbox`, `chart`, `map`, `map-line`, `map-circle`, `map-rectangle`, `map-polygon`, `map-heatmap`, `map-cluster`, `map-geojson`
- **Table-oriented widgets:** `table`, `viewtable`, `reporttable`, `servertable`

## Value Format by Field Type

This section describes the value shape a field normally reads from and writes back to `modelValue` / `Master` storage.

### Basic entry and display

- `text`: `string`; with `multiple: true`, typically `string[]`
- `textarea`: `string`
- `password`: `string`
- `label`: no bound value is required; it is display-only and usually driven by `label`
- `button`: no bound value is required; the action usually comes from `options.button(...)`
- `boolean`: `boolean`

### Selection and lookup

- `select`: a single option value by default; with `multiple: true`, an array of option values
- `autocomplete`: same as `select`; with `returnObject: true`, the value becomes the selected object or an array of selected objects
- `listselect`: a single option value, or an array of option values when `multiple: true`
- `collection`: `any[]`; each entry is a row/item object edited through the collection form flow

### Date, time, and numeric

- `date`: a single date-like value in the UI; the stored value is normalized to a numeric `SimpleDate` representation. With `multiple: true`, the value becomes `number[]`
- `time`: a single time-like value in the UI; the stored value is normalized to a numeric `SimpleTime` representation. With `multiple: true`, the value becomes `number[]`
- `datetime`: usually a `Date`; it may also be a `string` or `number` depending on the configured datepicker behavior
- `float`: `number`
- `integer`: `number`
- `decimal`: typically `{ $numberDecimal: string }` in the stored model; numeric/string UI input is normalized into that shape
- `color`: color string such as `'#146eb4'`, `'rgb(...)'`, or any CSS-valid color token

### Rich text, media, and message widgets

- `html`: HTML string
- `htmlview`: HTML string, rendered as display-only content
- `code`: code/text string
- `image`: a base64/data URL string for a single image, or `string[]` when `multiple: true`; remote URLs also render when they are valid image/document sources
- `document`: a base64/data URL string for a single document, or `string[]` when `multiple: true`
- `messagingbox`: `any[]` raw message records; `options.messageFormat(...)` maps them into the display structure
- `chart`: no strict built-in model shape; chart data is usually supplied by `options.chartData(...)` and chart options by `options.chartOptions(...)`

### Table-oriented widgets

- `table`: usually `any[]` row objects; can also be populated through `options.items(...)`
- `viewtable`: usually `any[]` row objects for readonly display
- `reporttable`: usually `any[]` row objects formatted for report-style display
- `servertable`: typically driven by `options.items(...)`, which normally returns a paginated result such as `{ data: any[]; total: number; limit: number }`

### Maps and geometry

- `map`: `{ lat: number; lng: number }`
- `map` with `multiple: true`: `Array<{ lat: number; lng: number }>`
- `map-line`: GeoJSON `LineString`
  ```ts
  {
    type: 'LineString',
    coordinates: [[lng, lat], [lng, lat]]
  }
  ```
- `map-circle`:
  ```ts
  {
    center: { lat: number, lng: number },
    radius: number // meters
  }
  ```
- `map-rectangle`:
  ```ts
  {
    north: number, // latitude
    south: number, // latitude
    east: number,  // longitude
    west: number   // longitude
  }
  ```
  This is a bounds object, not corner-point objects of shape `{ lat, lng }`.
- `map-polygon`: GeoJSON `Polygon`
  ```ts
  {
    type: 'Polygon',
    coordinates: [
      [[lng, lat], [lng, lat], [lng, lat], [lng, lat]]
    ]
  }
  ```
- `map-heatmap`: display-only array of weighted points
  ```ts
  [
    { location: { lat: number, lng: number }, weight?: number }
  ]
  ```
  Raw point objects like `{ lat, lng, weight }` are also normalized automatically
- `map-cluster`: display-only array of point-like objects, usually `Array<{ lat: number; lng: number }>`
- `map-geojson`: display-only GeoJSON `Feature`, `FeatureCollection`, or a single geometry object such as `Point`, `LineString`, or `Polygon`

### Practical rules

- `multiple: true` changes the value shape for many entry widgets from a scalar to an array
- selection widgets resolve ids using `itemValue`, `idField`, the global `Master` default id field, then `_id`, then `id`
- some display-oriented types such as `label`, `button`, and `chart` do not require a meaningful stored value if their content comes from params or options
- map display-only types still accept raw values through the field model, but they are not editable through the built-in widget UI

## Param Relevance by Type Family

### Common params used by many field types

- `type`, `label`, `storage`, `placeholder`, `readonly`, `invisible`, `default`, `required`
- `variant`, grid sizing (`xs`-`xxl`, `cols`), `class`, `style`, `height`, `minHeight`, `maxHeight`, `minWidth`
- `hint`, `icon`, `color`, `autofocus`, `clearable`, `inline`, `bordered`
- `validation` plus `options.rules(...)` / `options.validate(...)`

### Selection-oriented params

- `options`, `multiple`, `idField`, `itemValue`, `itemTitle`, `returnObject`, `checkbox`
- selection widgets resolve ids by trying local config first, then the global `Master` default, then `_id`, then `id`
- `options.selectOptions(field)` to load items dynamically

### Collection/table params

- `itemsPerPage`, `hasFooter`, `collectionStart`, `collectionEnd`, `collectionDisableAdd`, `collectionDisableRemove`
- `options.headers(...)`, `options.items(...)`, `options.format(...)`, `options.footer(...)`
- `options.form(...)` when a collection/table opens row forms

### Rich widget params

- `lang`, `codeTheme` for code/html fields
- `chartType`, `options.chartData(...)`, `options.chartOptions(...)` for charts
- `mapApiKey`, `mapOptions`, `mapZoom`, `hideMapText`, `mapTextPageSize`, `multiple` for maps and geometry widgets
- `map` stores/edits a point and can optionally render reverse-geocoded location text below the map
- `hideMapText: true` suppresses the geo-reference block and skips the geocoding work entirely
- `mapTextPageSize` limits how many geo-reference rows are shown at once before local previous/next paging is used
- `map` with `multiple: true` is intended for route stops, waypoints, and other multi-location entry use cases
- `map` with `multiple: true` stores `Array<{ lat, lng }>` and renders one reverse-geocoded address row per marker
- multi-marker maps support click-to-add, drag-to-move, and right-click removal when the field is editable
- `map-line` stores/edits GeoJSON `LineString` values and supports click-to-add plus vertex editing
- `map-line` also renders reverse-geocoded text for each line point below the map
- `map-circle` stores `{ center, radius }` and supports drag/resize editing
- `map-circle` renders the reverse-geocoded center plus the radius in kilometers below the map
- `map-rectangle` stores `{ north, south, east, west }` bounds and supports drag/resize editing
- `map-rectangle` renders reverse-geocoded corner labels (`North-West`, `North-East`, `South-East`, `South-West`) below the map
- `map-polygon` renders and edits GeoJSON polygon values
- `map-heatmap` is a display-only weighted heatmap for point-density visualization
- `map-cluster` is a display-only clustered-marker view for dense point sets
- `map-geojson` is a display-only mixed-geometry renderer for `Feature` / `FeatureCollection` GeoJSON data
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
  hideMapText?: boolean;
  mapTextPageSize?: number;
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
  { type: 'autocomplete', label: 'Customer', storage: 'customerId', itemTitle: 'name', idField: 'id' },
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
