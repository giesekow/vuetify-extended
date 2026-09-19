# Field

Most flexible input/display primitive in the library. `Field` is the single class that covers plain text inputs, booleans, selectors, date/time inputs, numeric inputs, HTML/code editors, media/document widgets, collection/table widgets, charts, message rendering, and all supported map/geometry widgets.

## Source

- [src/ui/field.ts](../../src/ui/field.ts)
- [src/ui/html-editor-options.ts](../../src/ui/html-editor-options.ts)
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
  'code'|'color'|'html'|'htmlview'|'listselect'|'file-upload'|'otp'|'pagination'|
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
  `label`, `htmlview`, `chart`, `pagination`
- Rich editor/media fields:
  `html`, `code`, `image`, `document`, `file-upload`, `messagingbox`
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
  htmlProfile?: 'minimal'|'standard'|'full';
  htmlToolbar?: HtmlEditorToolbarItem[];
  htmlFullscreen?: boolean;
  inline?: boolean;
  color?: string;
  itemValue?: string;
  itemTitle?: string;
  returnObject?: boolean;
  itemsPerPage?: string|number;
  itemsPerPageOptions?: number[];
  page?: number;
  totalItems?: number;
  showItemsPerPage?: boolean;
  showItemRange?: boolean;
  showPageInfo?: boolean;
  paginationLoading?: boolean;
  paginationVariant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
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
  serverSearch?: boolean;
  autocompleteFormat?: 'default'|'table';
  autocompleteAddText?: UIText;
  autocompleteSelectedText?: UIText;
  autocompleteRemoveText?: UIText;
  autocompleteDisableRemove?: boolean;
  autocompleteLoadMore?: 'scroll'|'button';
  searchDebounceMs?: number;
  minSearchChars?: number;
  searchOnFocus?: boolean;
  searchPageSize?: number;
  cacheSearchResults?: boolean;
  keepSelectedItemsInOptions?: boolean;
  autocompleteLoadMoreText?: UIText;
  autocompleteLoadingMoreText?: UIText;
  previewFullscreen?: boolean;
  hideMapText?: boolean;
  mapTextPageSize?: number;
  uploadType?: 'base64'|'file'|'metadata';
  fileAccepts?: any;
  fileMaxSize?: number;
  assetMode?: boolean;
  assetAdapter?: AssetAdapter;
  assetIdField?: string;
  assetPreviewField?: string;
  assetDownloadField?: string;
  assetNameField?: string;
  assetMimeTypeField?: string;
  assetSizeField?: string;
  autoUpload?: boolean;
  removeAssetOnClear?: boolean;
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
type FieldValueOrigin = 'default' | 'master' | 'user' | 'programmatic';

interface FieldValueContext {
  origin: FieldValueOrigin;
  value: any;
  previousValue?: any;
}

export interface FieldOptions {
  master?: Master;
  modifies?: Ref<any>;
  datetimeOptions?: any|undefined;
  selectOptions?: (field: Field) => Promise<any[]|undefined>|any[]|undefined;
  autocompleteSearch?: (
    field: Field,
    search: string,
    options?: { page?: number; limit?: number; signal?: AbortSignal }
  ) => Promise<
    | any[]
    | { items: any[]; total?: number; page?: number; hasMore?: boolean }
    | { data: any[]; total?: number; skip?: number; limit?: number; page?: number; hasMore?: boolean }
    | undefined
  >
    | any[]
    | { items: any[]; total?: number; page?: number; hasMore?: boolean }
    | { data: any[]; total?: number; skip?: number; limit?: number; page?: number; hasMore?: boolean }
    | undefined;
  autocompleteResolveValue?: (
    field: Field,
    value: any,
    options?: { signal?: AbortSignal }
  ) => Promise<any | any[] | undefined> | any | any[] | undefined;
  autocompleteNoSearchText?: (field: Field) => string|undefined;
  autocompleteNoDataText?: (field: Field, search: string) => string|undefined;
  button?: (field: Field) => Button|undefined;
  form?: (field: Field) => Promise<Form|undefined>|Form|undefined;
  headers?: (field: Field) => Promise<UITableHeader[]|undefined>|UITableHeader[]|undefined;
  items?: (field: Field, options?: any) => Promise<any[]|any|undefined>|any[]|any|undefined;
  format?: (field: Field, items: any[]) => any[]|undefined;
  footer?: (field: Field, items: any[]) => any[]|undefined;
  chartData?: (field: Field) => Promise<any|undefined>|any|undefined;
  chartOptions?: (field: Field) => Promise<any|undefined>|any|undefined;
  messageFormat?: (field: Field, data: any) => any[];
  rules?: (field: Field) => any[];
  changed?: (field: Field, context: FieldValueContext) => void;
  initialized?: (field: Field, context: FieldValueContext) => Promise<void>|void;
  paginationChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  pageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  itemsPerPageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  htmlEvent?: (field: Field, event: FieldHtmlEvent) => Promise<void>|void;
  fileSelected?: (field: Field, payload: FieldSelectedFilePayload) => Promise<void>|void;
  assetUploaded?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  assetsResolved?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  assetRemoved?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  focusChanged?: (field: Field, focused: boolean) => void;
  setup?: (field: Field) => void;
  validate?: (field: Field) => Promise<UIValidationResult>|UIValidationResult;
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
  Static default value used when the bound `Master` path is `undefined`. `options.default(field)` is the dynamic equivalent, and is evaluated only when no stored value exists. `params.default` takes precedence when both are provided. The resolved value is normalized for the field type and written to the configured `Master` storage path. Default application invokes `initialized` with `origin: 'default'`, not the user-originated `changed` callback/event.
- `readonly`
  Forces display-only behavior regardless of report/form mode.
- `required`
  Adds the built-in required rule.
- `validation`
  Adds built-in range/comparison/length/regex validators.
- `multiple`
  Switches many field types from scalar to array storage.
- `uploadType`
  Applies to `file-upload` in direct mode. Controls whether the stored value is base64 content, raw `File` objects, or metadata-only objects.
- `fileAccepts`
  Passed to the native picker / upload widget to constrain allowed file types.
- `fileMaxSize`
  Max allowed file size in KB for selected files.
- `previewFullscreen`
  Controls whether image/document previews open fullscreen or in a contained dialog.
- `assetMode`
  Enables asset-backed storage for `image`, `document`, and `file-upload`. In this mode the field stores asset ids in `Master` instead of storing file payloads directly.
- `assetAdapter`
  Required for `assetMode`. Provides the upload/resolve/remove integration with your asset service.
- `assetIdField`, `assetPreviewField`, `assetDownloadField`, `assetNameField`, `assetMimeTypeField`, `assetSizeField`
  Map your asset record shape into the fields used by the library for storage, preview, and display.
- `autoUpload`
  Asset-mode only. Defaults to `true`. When `false`, files are staged first and uploaded only when `field.$uploadAssets()` is called.
- `removeAssetOnClear`
  Asset-mode only. When `true`, clearing/removing uploaded items also calls the adapter `remove(...)` hook.
- `class`, `style`, `height`, `minHeight`, `maxHeight`, `minWidth`
  Standard layout/appearance hooks that apply directly to the underlying widget.
- grid params `cols`, `xs`, `sm`, `md`, `lg`, `xl`, `xxl`
  Control the `VCol` that wraps the field.

### Common options

- `master`
  Explicit `Master` instance to bind to.
- `selectOptions(...)`
  Async/static selection item loader for `select`, `autocomplete`, and `listselect`.
- `autocompleteSearch(...)`
  Remote/server-side autocomplete loader used when `type: 'autocomplete'` and `serverSearch: true`.
- `autocompleteResolveValue(...)`
  Hydrates stored autocomplete value(s) back into displayable option objects, especially important when `returnObject` is false and `Master` only stores ids.
- `headers(...)`
  Header loader for table-like widgets and the `collection` field.
- `items(...)`
  Data loader for table-like widgets and related display widgets.
- `format(...)`
  Final display transformation hook for datasets before rendering.
- `validate(...)`
  Extra custom validation beyond the built-in `validation` object. It may return a plain string or any `UIText`, including `{ key, fallback, values }`.
- `changed(...)`
  Runs after a user or programmatic value transition has synchronized the field and `Master`. Its context origin is `user` or `programmatic`.
- `initialized(...)`
  Runs after the field receives its effective default or existing `Master` value. Use it to load dependent options and calculate enabled/disabled state without clearing persisted edit-mode values. Its context origin is `default` or `master`.
- `fileSelected(...)`
  Runs after file selection has updated the field state. In direct mode this happens after `modelValue` is updated. In asset mode this happens after files are staged locally.
- `assetUploaded(...)`
  Runs after asset-mode upload succeeds. Receives the newly uploaded batch of asset records.
- `assetsResolved(...)`
  Runs after stored asset ids are resolved into asset records for display/preview.
- `assetRemoved(...)`
  Runs after adapter-backed asset removal when `removeAssetOnClear: true`.
- `focusChanged(...)`
  Focus gain/loss callback.
- `on(...)`
  Event handlers registered through the field event system.

## Localized Validation

Validation callbacks accept the shared result types:

```ts
type UIValidationResult = UIText | true | undefined | void;
type UIValidationRuleResult = UIValidationResult | false;
```

Return `true` or `undefined` when valid. Return a string, lazy text callback, or keyed descriptor when invalid:

```ts
const code = $FD(
  { storage: 'code', label: $l('fields.code', 'Code') },
  {
    validate: (field) => {
      const value = String(field.$value || '');
      return value.length >= 6
        ? undefined
        : $l(
            'validation.codeLength',
            'Code must contain at least {min} characters.',
            { min: 6 },
          );
    },
  },
)
```

`FieldOptions.rules(...)` supports the same translated error values. The field resolves `UIText` rule results into strings before passing them to Vuetify.

Built-in `required` and `validation` rules use `ve.validation.*` keys. For example, `validation.range` resolves through `ve.validation.min` or `ve.validation.max`, while `maxLen` uses `ve.validation.maxLength`. Applications override these through the normal i18n adapter; see [Built-In Translation Keys](../runtime/BuiltInTranslationKeys.md#vevalidation).

## Event Model

`Field` emits and/or supports these common hook points:

- `setup`
- `initialized`
- `changed`
- `focus-changed`
- `focus-gained`
- `focus-lost`
- `fileSelected`
- `assetUploaded`
- `assetsResolved`
- `assetRemoved`

### Field Value Lifecycle

Fields have two deliberately separate value lifecycle hooks:

- `initialized` configures the field and its dependencies from the effective initial value.
- `changed` reacts to a genuine value transition after initialization.

Both hooks receive the same `FieldValueContext` as their second argument:

```ts
export type FieldValueOrigin =
  | 'default'
  | 'master'
  | 'user'
  | 'programmatic';

export interface FieldValueContext {
  origin: FieldValueOrigin;
  value: any;
  previousValue?: any;
}
```

`context.value` and `context.previousValue` use the field's normalized storage representation. For example, date and time fields use their configured storage formats, and a select field follows its `returnObject`, `itemValue`, and `multiple` configuration.

#### Origin and callback matrix

| Situation | Origin | `initialized` | `changed` |
| --- | --- | --- | --- |
| `FieldParams.default` is applied | `default` | yes | no |
| `FieldOptions.default(field)` is applied | `default` | yes | no |
| An existing value is loaded from `Master` | `master` | yes | no |
| A `Master` reset supplies an existing value | `master` | yes | no |
| A `Master` reset leaves the path missing and a default is reapplied | `default` | yes | no |
| The user edits or selects a value in the rendered widget | `user` | no | yes |
| Relevant code calls `master.$set(...)` with a different value | `programmatic` | no | yes |
| Field/Vuetify reconciliation produces an equivalent value | none | no | no |
| A broad unrelated `Master` change occurs, including save bookkeeping | none | no | no |

The most important rule is that applying a default invokes `initialized` only. It does **not** invoke `changed`. This prevents startup and edit-mode hydration from behaving like a user edit while still providing a dedicated place to load dependent data.

#### `initialized(field, context)`

Use `initialized` to establish state that depends on the effective starting value:

- load dependent select/autocomplete options
- enable, disable, show, or hide related fields
- fetch supporting data required by the initial selection
- derive non-destructive presentation state

Initialization occurs after the value is preprocessed and after an applied default has been normalized and written to `Master`. It is deferred until the next Vue tick so sibling fields and their Master listeners can mount first. If `initialized` returns a promise, the field waits for it before emitting the `initialized` event.

`initialized` runs once for each mounted `Field` instance. A `Master` reset explicitly starts a new initialization cycle. A dynamic form may replace and remount its field objects, so initialization code should still be safe to run more than once.

Do not clear persisted dependent values from `initialized`. In edit mode, it should load the dependencies needed to display saved values without destroying those values.

#### `changed(field, context)`

Use `changed` for effects that should happen because a value genuinely moved from one value to another:

- clear a dependent selection after its parent selection changes
- recalculate another stored value
- perform user-change validation or synchronization
- react to a relevant programmatic `Master.$set(...)`

The new value is already normalized and written to `Master` before `changed` runs. Therefore, `field.$value`, `context.value`, and `field.$master?.$get(field.$params.storage)` reflect the new state inside the callback.

Select and autocomplete values are compared semantically, including item ids and multiple selections. A new object reference representing the same selection does not invoke `changed`. Save-time validation and unrelated Master events also do not invoke it.

#### Dependent-field example

Use `initialized` to load the starting options and `changed` to load new options and clear the now-invalid dependent value:

```ts
const configureStateField = async (country: Field, reset: boolean) => {
  await loadStateOptions(country.$value);

  if (reset) {
    // Use null so a dependent field default is not applied again.
    country.$master?.$set('stateId', null);
  }
};

$FD(
  { ref: 'country', type: 'select', storage: 'countryId' },
  {
    selectOptions: () => countries,
    initialized: (field, context) => {
      // context.origin is "default" or "master".
      return configureStateField(field, false);
    },
    changed: (field, context) => {
      // context.origin is "user" or "programmatic".
      void configureStateField(field, true);
    },
  },
);
```

Use `null` when the dependent field should remain intentionally empty. Setting it to `undefined` means the path is missing, so that field's default may be applied again during its next synchronization.

#### Static and computed defaults

Static defaults belong in `FieldParams.default`:

```ts
$FD({
  type: 'select',
  storage: 'countryId',
  default: 'DE',
});
```

Computed defaults belong in `FieldOptions.default`:

```ts
$FD(
  { type: 'text', storage: 'createdBy' },
  {
    default: () => Api.instance.user?._id,
    initialized: (_field, context) => {
      console.log(context.origin); // "default"
      console.log(context.value);  // normalized stored user id
    },
  },
);
```

Defaults follow these rules:

- An existing `Master` value always wins, including `null`, `false`, `0`, and an empty string.
- A default is considered only when the storage path is `undefined`.
- `FieldParams.default` takes precedence when both default forms are configured.
- The default is preprocessed for the UI and postprocessed before storage.
- Applying the default writes it to the configured `Master` path before `initialized` runs.
- Applying the default produces `origin: 'default'` and never emits `changed`.

#### Callback and event APIs

The option callbacks receive the `Field` first and context second:

```ts
$FD(
  { type: 'text', storage: 'name' },
  {
    initialized: (field, context) => {
      console.log(field.$value, context.origin);
    },
    changed: (field, context) => {
      console.log(context.previousValue, context.value, context.origin);
    },
  },
);
```

The equivalent `.on(...)` events intentionally preserve the library's established payload order:

```ts
field.on('changed', (value, context: FieldValueContext) => {
  console.log(value, context.origin);
});

field.on('initialized', (context: FieldValueContext) => {
  console.log(context.value, context.origin);
});
```

Execution order is:

1. Synchronize the effective value into the field and `Master`.
2. Call `FieldOptions.initialized(field, context)` or `FieldOptions.changed(field, context)`.
3. Emit `initialized(context)` or `changed(value, context)` to `.on(...)` listeners.

Existing one-argument handlers remain valid:

```ts
$FD(
  { type: 'text', storage: 'name' },
  {
    changed: (field) => {
      console.log(field.$value);
    },
  },
);
```

```ts
field.on('changed', (value) => {
  console.log(value);
});
```

#### Choosing the correct hook

| Requirement | Recommended hook |
| --- | --- |
| Load options for a default value | `initialized` |
| Load options for an existing edit-mode value | `initialized` |
| Enable or hide fields based on their starting data | `initialized` |
| Clear a child value when the user changes its parent | `changed` |
| React to direct application code changing the bound Master path | `changed` with `origin: 'programmatic'` |
| Run the same non-destructive calculation at startup and after changes | Call a shared helper from both hooks |
| Run only after a user gesture, not after `Master.$set(...)` | `changed`, guarded by `context.origin === 'user'` |

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
| `date` | depends on `dateFormat`: numeric `SimpleDate` day-count by default, `"YYYY-MM-DD"` when configured, or compact `YYYYMMDD`; arrays when `multiple: true` |
| `time` | depends on `timeFormat`: numeric `SimpleTime` minutes-by-default, `"HH:mm"` when configured, or compact `HHMM`; arrays when `multiple: true` |
| `datetime` | whatever the datepicker emits; default usage is usually `Date` |
| `float` | `number` |
| `integer` | `number` |
| `decimal` | `{ $numberDecimal: string }` |
| `color` | `string` |
| `html` | `string` |
| `htmlview` | `string` if bound |
| `pagination` | `{ page: number, limit: number, total: number }` when `storage` is configured; otherwise the same shape remains local to the field |
| `code` | `string` |
| `image` | direct mode: base64/URL `string` or `string[]`; asset mode: asset id `string` or `string[]` |
| `document` | direct mode: base64/URL `string` or `string[]`; asset mode: asset id `string` or `string[]` |
| `file-upload` | direct mode: base64 `string`/`string[]`, `File`/`File[]`, or metadata object/object[] depending on `uploadType`; asset mode: asset id `string` or `string[]` |
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

## Media Field Workflow

`image`, `document`, and `file-upload` support both direct-storage mode and asset-backed mode.

### Direct mode

This is the default/legacy behavior.

- `assetMode` is omitted or `false`
- file payloads are stored directly in `Master`
- `image` and `document` store base64/data URL strings
- `file-upload` stores values according to `uploadType`

### Asset mode

This is the centralized-assets workflow.

- `assetMode: true`
- `assetAdapter` must be provided
- the field stores only asset ids in `Master`
- asset records are resolved separately for preview/display

Typical sequence when `autoUpload: true`:

1. user selects file(s)
2. field stages `File[]` internally
3. `fileSelected` fires
4. adapter `upload(...)` runs
5. returned asset ids are written to `Master`
6. `assetUploaded` fires

Typical sequence when `autoUpload: false`:

1. user selects file(s)
2. field stages `File[]` internally
3. `fileSelected` fires
4. `Master` is not updated yet
5. app or UI later calls `field.$uploadAssets()`
6. uploaded asset ids are then written to `Master`

### Field helpers exposed by the media workflow

- `field.$selectedFiles`
  Always returns a `File[]`. Empty when no files are currently staged.
- `field.$clearSelectedFiles()`
  Clears only staged files. It does not clear already stored/uploaded asset ids.
- `field.$resolvedAssets`
  Asset-mode cache of resolved asset records currently being displayed.
- `field.$uploadAssets()`
  Manual asset-mode upload trigger, mainly useful when `autoUpload: false`.

### Asset adapter contract

- `upload(payload, field)`
  Upload the selected file batch and return asset records.
- `resolve(payload, field)`
  Resolve stored asset ids back into asset records.
- `remove?(assets, field)`
  Optional cleanup hook used when `removeAssetOnClear: true`.
- `getPreviewUrl?(asset, field)`
  Optional helper to derive a preview URL when it is not already included on the asset record.
- `getDownloadUrl?(asset, field)`
  Optional helper to derive a download URL when it is not already included on the asset record.

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
  `VAutocomplete`, optionally paired with `VDataTable` for selected-item presentation
- Relevant params:
  `multiple`, `itemTitle`, `itemValue`, `idField`, `returnObject`, `clearable`, `serverSearch`, `autocompleteFormat`, `autocompleteAddText`, `autocompleteSelectedText`, `autocompleteRemoveText`, `autocompleteDisableRemove`, `autocompleteLoadMore`, `searchDebounceMs`, `minSearchChars`, `searchOnFocus`, `searchPageSize`, `cacheSearchResults`, `keepSelectedItemsInOptions`, `autocompleteLoadMoreText`, `autocompleteLoadingMoreText`, `itemsPerPage`, `height`
- Relevant options:
  `selectOptions(...)`, `autocompleteSearch(...)`, `autocompleteResolveValue(...)`, `autocompleteNoSearchText(...)`, `autocompleteNoDataText(...)`, `headers(...)`, `format(...)`, `canRemoveItem(...)`, `on(...)`
- Notes:
  Uses `autoSelectFirst: true` internally.
  Supports 2 modes:
  - local mode:
    use `selectOptions(...)`, load an item array once, and let the widget filter client-side
  - server-search mode:
    set `serverSearch: true` and provide `autocompleteSearch(...)`
  In server-search mode:
  - the widget binds search text and calls `autocompleteSearch(...)` after a debounce
  - local filtering is disabled and the server result set is used directly
  - `minSearchChars` controls when searching starts
  - `searchOnFocus: true` allows loading an initial suggestion list even before typing
  - `autocompleteLoadMore: 'button'` appends a clickable `Load more` row at the bottom of the menu
  - `autocompleteLoadMore: 'scroll'` automatically requests the next page when the dropdown list is scrolled near the bottom
  - `autocompleteLoadMoreText` customizes the button-mode action label. Default: `Load more...`
  - `autocompleteLoadingMoreText` customizes the loading label used while extra pages are being fetched. Default: `Loading more...`
  - `cacheSearchResults` keeps per-search-term results in memory for the field instance
  - `keepSelectedItemsInOptions` controls whether already selected item(s) are merged into the visible dropdown result list
  - when `keepSelectedItemsInOptions` is `false`, the current selection still displays correctly because the field keeps a separate internal resolved-selection buffer for label rendering
  Hydrating existing values:
  - if `returnObject: true`, the stored object already contains the label data, so no extra hydration is usually needed
  - if `returnObject` is false, `Master` usually stores only the id/value
  - in that id-storage mode, provide `autocompleteResolveValue(...)` so edit-mode fields can fetch the selected object and show the proper display label
  Search result contract:
  - `autocompleteSearch(...)` may return a plain item array
  - or `{ items, total?, page?, hasMore? }`
  - or `{ data, total?, skip?, limit?, page?, hasMore? }`
  - the generated `vuetify-ext create autocomplete-source` helper returns the normalized `{ data, skip, limit, total }` form

#### Selected-items table presentation

Use `autocompleteFormat: 'table'` for a multiple autocomplete whose selected objects need more context than chips or comma-separated labels can provide. The ordinary autocomplete remains the default. Table presentation requires `multiple: true`; without it, the field falls back to the ordinary autocomplete.

The editable layout contains a single-item search control with a compact `+` icon button in the autocomplete `append` slot, followed by a Vuetify data table. Selecting a suggestion only stages it. Pressing `+` appends it to the field value and `Master` in one update. `autocompleteAddText` supplies the icon button's translated tooltip and accessible label. Duplicate values are rejected using `itemValue` / `idField` identity. In readonly mode, only the selected-items table is rendered.

The table does not inject an action column. In editable mode its rows are selectable; selecting one or more rows reveals one bulk-remove button. `autocompleteDisableRemove: true` disables row selection and removal. When supplied, `canRemoveItem(field, item)` runs once for every requested row and receives the hydrated selected object. Allowed removals are committed together, so `changed` runs once for the batch.

`headers(field)` defines the table columns and supports the same header shape, translated titles, and `isHTML` columns as other Field tables. `format(field, items)` receives hydrated selected objects, not the IDs stored in `Master`, and controls the displayed rows. Keep the selected object's id field in each formatted row when reordering rows so removal can retain exact source identity.

Header `title` accepts `UIText`, while a plain string continues to render as-is. Grouped headers are translated recursively through `children`. The same contract applies to `table`, `viewtable`, `servertable`, `reporttable`, and nested `collection` fields:

```ts
import { $l, type UITableHeader } from 'vuetify-extended';

const headers: UITableHeader[] = [
  { title: $l('people.columns.name', 'Name'), key: 'name' },
  { title: $l('people.columns.email', 'Email'), key: 'email' },
];
```

Initial value hydration follows these rules:

- With `returnObject: true`, stored objects are used directly.
- With local ID storage, selected objects are first matched from `selectOptions(...)`.
- IDs not present locally or in cached search results are passed together to `autocompleteResolveValue(...)`.
- Resolved rows retain the same order as the stored values.
- An unresolved ID is still shown as a fallback row and remains removable.

The standard `changed(field, context)` callback observes the final array with `context.origin === 'user'`. Event listeners may also use `item-added` for the hydrated object and `item-removed` for the hydrated object array. Required validation applies to the selected array, never to the staged search candidate.

All table chrome uses Vuetify theme tokens. `autocompleteAddText`, `autocompleteSelectedText`, and `autocompleteRemoveText` accept `UIText`; selected and remove labels support `{count}`, while selected text also supports `{label}`.

```ts
$FD(
  {
    label: $l('people.administrators', 'Administrators'),
    storage: 'administratorIds',
    type: 'autocomplete',
    autocompleteFormat: 'table',
    multiple: true,
    itemTitle: 'displayName',
    itemValue: '_id',
    itemsPerPage: 10,
    height: 280,
    autocompleteSelectedText: $l(
      'people.selectedAdministrators',
      'Selected administrators ({count})',
    ),
  },
  {
    selectOptions: () => api.people.list(),
    headers: () => [
      { title: $l('people.displayName', 'Display name'), key: 'displayName' },
      { title: $l('people.userCode', 'User code'), key: 'userCode' },
    ],
    format: (_field, selectedPeople) => selectedPeople.map((person) => ({
      ...person,
      userCode: person.code.toUpperCase(),
    })),
    canRemoveItem: (_field, person) => !person.locked,
    changed: (_field, context) => console.log(context.value),
  },
)
```

  Example server-search setup:

```ts
new Field(
  {
    label: 'Manager',
    storage: 'managerId',
    type: 'autocomplete',
    itemTitle: 'name',
    itemValue: '_id',
    serverSearch: true,
    minSearchChars: 1,
    searchDebounceMs: 250,
  },
  {
    autocompleteSearch: async (_field, search, options) => ({
      items: await Api.instance.service('people').findAll({
        query: {
          name: { $regex: search, $options: 'i' },
          $limit: options?.limit || 25,
          $paginate: false,
        },
      }),
    }),
    autocompleteResolveValue: async (_field, value) =>
      value ? Api.instance.service('people').get(value) : undefined,
  },
)
```

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
  depends on `dateFormat`
- UI datatype:
  string date value(s)
- Widget:
  single-value browser-style date input for non-multiple mode, `VCombobox` for multiple mode
- Relevant params:
  `multiple`, `clearable`, `autofocus`, `validation`, `dateFormat`
- Relevant options:
  `default`, `validate`
- Notes:
  `Field` always normalizes the UI value as `YYYY-MM-DD` for the browser input, then stores the result in `Master` according to `dateFormat`.

Supported `dateFormat` values:

- `"timestamp"` (default)
  Stored datatype: `number` or `number[]`
  Uses `SimpleDate.toNumber()`, which is the library's internal day-count integer, not Unix milliseconds
- `"YYYYMMDD"`
  Stored datatype: `number` or `number[]`
  Example: `20260805`
- `"YYYY-MM-DD"`
  Stored datatype: `string` or `string[]`
  Example: `"2026-08-05"`

### `time`

- Stored datatype:
  depends on `timeFormat`
- UI datatype:
  string time value(s)
- Widget:
  browser-style time input
- Relevant params:
  `multiple`, `clearable`, `autofocus`, `validation`, `timeFormat`
- Relevant options:
  `default`, `validate`
- Notes:
  Like `date`, time values are normalized to `HH:mm` for the browser input first, then stored according to `timeFormat`.

Supported `timeFormat` values:

- `"timestamp"` (default)
  Stored datatype: `number` or `number[]`
  Uses `SimpleTime.toNumber()`, which is the library's minutes-since-midnight integer
- `"HHMM"`
  Stored datatype: `number` or `number[]`
  Example: `1430`
  Note: leading zeroes are not preserved in numeric form, so `09:15` becomes `915`
- `"HH:mm"`
  Stored datatype: `string` or `string[]`
  Example: `"14:30"`

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
  Tiptap-based rich HTML editor
- Relevant params:
  `placeholder`, `height`, `class`, `style`, `htmlProfile`, `htmlToolbar`, `htmlFullscreen`
- Relevant options:
  none special beyond common hooks
- Notes:
  Supports fullscreen editing, source HTML mode, formula helpers, tables, media embeds, and responsive toolbar overflow.

#### HTML editor toolbar

`htmlProfile` selects a predefined toolbar. It defaults to `full`, preserving the complete editor toolbar used by existing applications.

| Profile | Controls |
| --- | --- |
| `minimal` | undo, redo, alignment, bold, italic |
| `standard` | history, block styles, alignment, bold, italic, underline, bullet/numbered lists, links, clear formatting, source mode, fullscreen |
| `full` | every supported toolbar control |

Use `htmlToolbar` when a field needs an exact list instead of a preset. An explicit list replaces the selected profile; it does not extend it.
The list controls visibility; controls retain the editor's standard ordering. Use an empty list to hide the toolbar completely.

```ts
const summary = $FD({
  type: 'html',
  storage: 'summaryHtml',
  htmlToolbar: ['bold', 'italic', 'align'],
  htmlFullscreen: false,
});
```

Supported `htmlToolbar` values:

- history: `undo`, `redo`
- block and alignment: `block`, `align`
- inline formatting: `bold`, `italic`, `underline`, `strike`, `inlineCode`
- lists: `bulletList`, `orderedList`, `taskList`
- formulas: `inlineFormula`, `blockFormula`
- content: `link`, `image`, `video`, `table`, `horizontalRule`
- utilities: `clearFormatting`, `source`, `fullscreen`

The `block` control contains paragraph, headings 1-6, block quote, code block, and task-list choices. The `link` control includes both insert/edit and remove actions. The `video` and `table` controls include their related edit actions.

`htmlFullscreen` defaults to `true`. Set it to `false` to remove the fullscreen editor button, field-level fullscreen preview, fullscreen dialog, and F11 handling. It overrides both profiles and explicit toolbar lists. Conversely, when using `htmlToolbar`, fullscreen is available only when `fullscreen` is included and `htmlFullscreen` is not false.

Toolbar filtering is applied consistently to wide layouts, compact overflow menus, and the fullscreen editor. It controls the available UI actions without stripping Tiptap extensions, so existing HTML containing tables, media, links, or other rich content remains readable and editable as HTML. Readonly fields continue to hide the editing toolbar entirely.

```ts
const standardEditor = $FD({
  type: 'html',
  storage: 'descriptionHtml',
  htmlProfile: 'standard',
});

const fullEditorWithoutFullscreen = $FD({
  type: 'html',
  storage: 'contentHtml',
  htmlProfile: 'full',
  htmlFullscreen: false,
});
```

### `htmlview`

- Stored datatype:
  `string` when bound
- Widget:
  raw HTML output block
- Relevant params:
  `resolveFormulas`, `class`, `style`
- Relevant options:
  `htmlEvent(field, event)`
- Notes:
  If `resolveFormulas` is true, inline/display math is rendered before display.

#### Interactive HTML events

`htmlview` supports delegated, CSP-safe events without inline JavaScript. Put `data-ve-event` on an element inside the rendered HTML. The field listens at its root, so dynamically replaced HTML continues to work without rebinding handlers.

```ts
const activityView = $FD(
  {
    ref: 'activityView',
    type: 'htmlview',
    default: `
      <button
        type="button"
        data-ve-event="inspect-item"
        data-ve-payload='{"id":"activity-7","name":"Review invoice"}'
      >
        Inspect
      </button>
    `,
  },
  {
    htmlEvent: (_field, event) => {
      console.log(event.name, event.payload);
    },
  },
);
```

Supported attributes:

| Attribute | Purpose |
| --- | --- |
| `data-ve-event="name"` | Required event name. Names may contain letters, numbers, `_`, `.`, `:`, and `-`, and must start with a letter. |
| `data-ve-on="click change"` | Native event types to accept. Supported values are `click`, `change`, `input`, and `submit`; default is `click`. Commas may also separate values. |
| `data-ve-payload='{"id":1}'` | Optional JSON payload. Invalid JSON is supplied as its original string. |
| `data-ve-prevent-default` | Calls `preventDefault()` before dispatch. Useful for forms and links. |
| `data-ve-stop-propagation` | Calls `stopPropagation()` before dispatch. |

The event object is:

```ts
interface FieldHtmlEvent {
  name: string;
  payload?: any;
  value?: any; // input value, or checked state for checkbox/radio controls
  eventType: 'click'|'change'|'input'|'submit';
  field: Field;
  element: HTMLElement;
  nativeEvent: Event;
}
```

Events are dispatched after `FieldOptions.htmlEvent` in this order:

```ts
field.on('html-event', (event) => { /* every HTML event */ });
field.on('html:inspect-item', (event) => { /* one named event */ });

report.on('field:html-event', (event) => { /* every child htmlview event */ });
report.on('field:html:inspect-item', (event) => { /* one named child event */ });
```

Only trusted application HTML should be rendered. The bridge avoids inline script execution, but it does not sanitize untrusted HTML.

### `pagination`

- Stored datatype:
  `{ page: number, limit: number, total: number }` when `storage` is provided
- Widget:
  responsive pagination controls with page-size choices, item range, page status, and previous/next actions
- Relevant params:
  `storage`, `default`, `page`, `itemsPerPage`, `totalItems`, `itemsPerPageOptions`, `showItemsPerPage`, `showItemRange`, `showPageInfo`, `paginationLoading`, `color`, `paginationVariant`, `readonly`, `label`
- Relevant options:
  `paginationChanged`, `pageChanged`, `itemsPerPageChanged`

The normalized value and callback payload types are:

```ts
interface FieldPaginationValue {
  page: number;  // one-based
  limit: number;
  total: number;
}

interface FieldPaginationEvent extends FieldPaginationValue {
  skip: number;
  pageCount: number;
  start: number; // one-based visible range, or 0 for an empty dataset
  end: number;
  reason: 'page'|'limit'|'programmatic';
  previousValue: FieldPaginationValue;
}
```

Use no `storage` for UI-only pagination. Add `storage` when the pagination state should be available in `Master` or included in the form payload.

```ts
$FD(
  {
    ref: 'activityPagination',
    type: 'pagination',
    default: { page: 1, limit: 10, total: 87 },
    itemsPerPageOptions: [5, 10, 20, 50],
    color: 'primary',
    paginationVariant: 'outlined',
    cols: 12,
  },
  {
    paginationChanged: async (field, event) => {
      const response = await Api.instance.service('activity').find({
        query: { $skip: event.skip, $limit: event.limit },
      });

      field.$master?.$set('visibleActivity', response.data);
      await field.setPagination(
        { total: response.total },
        { notify: false },
      );
    },
  },
);
```

Behavior:

- changing the page size resets `page` to `1`
- page values are clamped to the available page count
- `readonly: true` or `paginationLoading: true` disables controls
- inherited form/report display mode does not disable pagination because paging is UI navigation rather than record editing; set the field's own `readonly: true` when paging must be disabled
- defaults, stored values, and programmatic updates are normalized to numeric `{ page, limit, total }` values
- `paginationChanged` runs for both page and page-size gestures
- `pageChanged` runs only for page navigation
- `itemsPerPageChanged` runs only for page-size changes
- callback functions run before matching `.on(...)` listeners
- all callback/event state is synchronized to the field and `Master` first
- labels use built-in translation keys and the widget uses Vuetify surface, text, and border theme tokens

Programmatic updates are silent by default. This is useful when an API response updates `total` without triggering another request:

```ts
await pagination.setPagination({ total: response.total });

await pagination.setPagination(
  { page: 2 },
  { notify: true, origin: 'programmatic', reason: 'page' },
);
```

Equivalent listeners are available when callbacks are not convenient:

```ts
pagination.on('paginationChanged', (event) => loadPage(event));
pagination.on('pageChanged', (event) => console.log(event.page));
pagination.on('itemsPerPageChanged', (event) => console.log(event.limit));
```

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
  direct mode: base64/URL `string`, or `string[]` when `multiple: true`
  asset mode: asset id `string`, or `string[]` when `multiple: true`
- Widget:
  media upload/preview widget
- Relevant params:
  `fileAccepts`, `fileMaxSize`, `height`, `multiple`, `previewFullscreen`, `assetMode`, `assetAdapter`, `autoUpload`, `removeAssetOnClear`
- Relevant options:
  `fileSelected(...)`, `assetUploaded(...)`, `assetsResolved(...)`, `assetRemoved(...)`
- Notes:
  In direct mode values are usually base64/data URLs but can also be remote renderable URLs.
  In asset mode the field stores only asset ids in `Master`, while preview/display is driven by resolved asset records.
  Clicking the preview opens the in-app image preview dialog. `previewFullscreen` defaults to `true`; set it to `false` to use the contained dialog mode instead.

### `document`

- Stored datatype:
  direct mode: base64/URL `string`, or `string[]` when `multiple: true`
  asset mode: asset id `string`, or `string[]` when `multiple: true`
- Widget:
  document upload/preview widget
- Relevant params:
  `fileAccepts`, `fileMaxSize`, `height`, `multiple`, `previewFullscreen`, `assetMode`, `assetAdapter`, `autoUpload`, `removeAssetOnClear`
- Relevant options:
  `fileSelected(...)`, `assetUploaded(...)`, `assetsResolved(...)`, `assetRemoved(...)`
- Notes:
  Defaults accepted types to PDF-related values when not explicitly set.
  In asset mode the stored `Master` value becomes the asset id or asset id array, not the document content itself.
  PDF previews now open in the in-app document preview dialog. `previewFullscreen` defaults to `true`; set it to `false` for the contained dialog mode. Viewer controls such as zoom or page navigation depend on the browser's embedded PDF/document renderer.

### `file-upload`

- Stored datatype:
  direct mode:
  `uploadType: 'base64'` => base64 `string` or `string[]`
  `uploadType: 'file'` => `File` or `File[]`
  `uploadType: 'metadata'` => metadata object or metadata object array
  asset mode:
  asset id `string`, or `string[]` when `multiple: true`
- Widget:
  `VFileUpload`
- Relevant params:
  `multiple`, `uploadType`, `fileAccepts`, `fileMaxSize`, `assetMode`, `assetAdapter`, `autoUpload`, `removeAssetOnClear`
- Relevant options:
  `fileSelected(...)`, `assetUploaded(...)`, `assetsResolved(...)`, `assetRemoved(...)`
- Notes:
  This is the most general file field.
  Use direct mode when the form should persist actual file payloads or metadata directly in `Master`.
  Use asset mode when your application stores binary content in a centralized asset service/table and other records should only reference asset ids.
  Even in metadata mode, `field.$selectedFiles` still exposes the currently selected raw `File[]` for validation or custom upload handling.

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
- `setPagination(value, options?)` for `pagination` fields
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
- `date` is normalized to the browser input format first, then stored according to `dateFormat`; `time` is normalized to `HH:mm` first, then stored according to `timeFormat`; `datetime` is not normalized beyond what the datepicker emits.
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
