# Fields

Use this reference when implementing, debugging, or documenting field behavior.

Primary sources:

- `docs/ui/Field.md`
- `src/ui/field.ts`
- `src/ui/widgets/field-rich-widgets.ts`
- `src/ui/widgets/field-table-widgets.ts`
- `src/ui/widgets/field-pagination-state.ts`
- `src/ui/widgets/field-pagination-widget.ts`

## Non-Negotiable Rule

Preserve the datatype written into `Master`.

If a field change breaks the stored datatype, it will usually break reports, triggers, collections, exports, or downstream code that expects that shape.

## High-Value Field Rules

- `text`
  - single => `string`
  - `multiple: true` => `string[]`
- `select` / `autocomplete`
  - stores selected id/value unless `returnObject: true`
- `date`
  - stores numeric `SimpleDate`
- `time`
  - stores numeric `SimpleTime`
- `decimal`
  - stores `{ $numberDecimal: string }`
- `collection`
  - stores `Array<Record<string, any>>`
- `pagination`
  - stores `{ page: number, limit: number, total: number }` when bound
  - remains local UI state when `storage` is omitted
- `map-*`
  - use the documented geometry shape exactly

Before changing any of these, read `docs/ui/Field.md`.

## Autocomplete Table Presentation

Use `autocompleteFormat: 'table'` with `multiple: true` when selected objects need several visible columns. Do not use it for a single autocomplete or when ordinary chips/labels are sufficient.

```ts
$FD(
  {
    type: 'autocomplete',
    storage: 'administratorIds',
    multiple: true,
    autocompleteFormat: 'table',
    itemTitle: 'name',
    itemValue: '_id',
  },
  {
    selectOptions: () => people,
    headers: () => [
      { title: $l('people.columns.name', 'Name'), key: 'name' },
      { title: $l('people.columns.code', 'Code'), key: 'code' },
    ],
    format: (_field, selectedObjects) => selectedObjects,
  },
);
```

Rules:

- the search selection is staged until the user presses `Add`
- add and bulk remove each synchronize `Master` once and invoke `changed` once
- duplicate protection uses `itemValue` / `idField`
- no action column is added; editable rows use checkbox selection and one bulk-remove action
- `headers`, `format`, `canRemoveItem`, local options, remote search, and load-more behavior are reused
- `format` and `canRemoveItem` receive hydrated objects even when `Master` stores only ids
- provide `autocompleteResolveValue` for server-side or locally missing initial ids
- unresolved ids remain visible and removable
- readonly mode hides search, Add, selection, and removal controls
- built-in table styling follows the active Vuetify theme
- every table header `title` accepts `UIText`; grouped `children` titles are translated recursively

## Pagination Field

Use `type: 'pagination'` beside an `htmlview` or another custom data presentation when the application, rather than a built-in table, owns data loading.

```ts
const pager = $FD(
  {
    ref: 'pager',
    type: 'pagination',
    default: { page: 1, limit: 10, total: 0 },
    itemsPerPageOptions: [5, 10, 20],
  },
  {
    paginationChanged: (_field, event) => loadData(event.skip, event.limit),
  },
);
```

Rules:

- `page` is one-based; API offset is available as `event.skip`
- changing `limit` resets `page` to one
- `paginationChanged` covers page and limit changes
- `pageChanged` and `itemsPerPageChanged` are narrower hooks
- update API totals with `field.setPagination({ total }, { notify: false })` to avoid request loops
- omit `storage` unless the pagination state belongs in `Master`
- use `paginationLoading` or `readonly` to disable interaction
- parent display mode does not disable pagination; only the field's explicit `readonly: true` does
- incoming/default pagination values normalize to numeric `{ page, limit, total }`
- use `color` and `paginationVariant` for controls; base styling follows Vuetify theme tokens

## Interactive HTML View

Use declarative data attributes instead of inline JavaScript:

```html
<button data-ve-event="open-item" data-ve-payload='{"id":"42"}'>Open</button>
```

Handle it locally or at report level:

```ts
htmlField.on('html:open-item', (event) => openItem(event.payload.id));
report.on('field:html:open-item', (event) => openItem(event.payload.id));
```

`data-ve-on` may select `click`, `change`, `input`, or `submit`. Optional `data-ve-prevent-default` and `data-ve-stop-propagation` control native event behavior. Read the complete payload and security contract in `docs/ui/Field.md`.

## Nested `collection` Field

Use `Field type: 'collection'` when one parent record owns a nested array of child objects and the user should add, edit, remove, and review those child rows inside the parent form.

Typical use cases:

- invoice or order line items
- contact methods on a person/company record
- addresses on a customer record
- embedded checklist rows
- attachments metadata rows
- any `Array<Record<string, any>>` property that belongs to one parent object

Do not use this field type when the requirement is a full screen-level management workflow across many records. That is the top-level `Collection` primitive.

### Stored Shape

- `Master` stores `Array<Record<string, any>>`
- runtime may attach `__index` while editing/rendering
- `__index` is an internal helper, not business data

### Minimum Contract

For a usable nested `collection` field, the following are the practical minimums:

- `FieldParams.storage`
  required so the array has a stable location in the parent `Master`
- `FieldOptions.form(field)`
  required in practice; must return the row `Form` used for create/edit/display
- `FieldOptions.headers(field)`
  required in practice; defines the table columns for the embedded row listing

Without `form(...)`, rows cannot be created or edited correctly.

Without `headers(...)`, the table has no meaningful column definition.

### Strongly Recommended Settings

- `FieldParams.idField`
  use when rows have a stable business id; this makes edit/remove updates safer than relying on `__index`
- `FieldOptions.format(field, items)`
  use when displayed table rows should differ from the raw stored row shape
- `FieldOptions.canEditItem(field, item)`
  use when row edit access is conditional
- `FieldOptions.canRemoveItem(field, item)`
  use when row deletion must be filtered or guarded

### Optional Enhancements

- `FieldParams.hasFooter`
  enables footer rendering below the main table
- `FieldOptions.footer(field, items)`
  provides footer rows; meaningful only when `hasFooter: true`
- `FieldParams.itemsPerPage`
  controls table paging
- `FieldParams.height`
  controls table viewport height
- `FieldParams.collectionStart` / `FieldParams.collectionEnd`
  limit the visible slice of the array
- `FieldParams.collectionDisableAdd`
  hides add behavior
- `FieldParams.collectionDisableRemove`
  hides remove behavior

### Behavioral Model

- add opens the row form in `create` mode with a fresh nested `Master`
- clicking a row opens the row form in `edit` mode, or `display` mode when the field is readonly
- saving in create mode appends a new object into the parent collection path
- saving in edit mode updates the existing row by stable id when possible, otherwise by `__index`
- remove operates on selected rows in the table

### Design Rule

The nested `collection` field is the right choice when:

- the child rows do not need their own independent screen workflow
- the rows are conceptually part of one parent object
- save/cancel should remain part of the parent form/report flow

If each row should be searched, filtered, paged, or edited as a first-class record management screen, step up to a top-level `Collection` or `Trigger` + `Report` flow instead.

## Field Value Lifecycle

Use `FieldOptions.initialized(field, context)` to configure dependencies from a default or an existing Master value. Use `FieldOptions.changed(field, context)` for reactions to genuine user or programmatic transitions.

Both callbacks receive:

```ts
interface FieldValueContext {
  origin: 'default' | 'master' | 'user' | 'programmatic';
  value: any;
  previousValue?: any;
}
```

Origins are:

- `default`: a `FieldParams.default` or `FieldOptions.default(field)` value was applied and stored
- `master`: an existing or reset Master value initialized the field
- `user`: the rendered field emitted a real value update
- `programmatic`: a relevant direct `Master.$set(...)` changed the bound value

Applying either form of default triggers `initialized` with `origin: 'default'`; it does not trigger `changed`. Existing Master values trigger `initialized` with `origin: 'master'`. A user edit triggers `changed` with `origin: 'user'`, while a relevant direct Master update triggers it with `origin: 'programmatic'`.

The effective value is already normalized and synchronized to `Master` before either callback runs. `context.previousValue` is the normalized prior field value. Equivalent select/autocomplete reconciliation values, unrelated Master changes, and save bookkeeping do not invoke `changed`.

Do not clear persisted dependent values from `initialized`; edit-mode hydration should load options and enabled state without destroying saved data. Put reset behavior in `changed`. Use `null`, rather than `undefined`, to intentionally clear a dependent field that has a default. Keep initialization idempotent because dynamic definitions may remount a Field. In-place rerenders do not replay either lifecycle callback, while a Master reset starts a new initialization cycle.

Option callbacks execute before event listeners. Their signatures differ intentionally:

```ts
initialized: (field, context) => { /* ... */ }
changed: (field, context) => { /* ... */ }

field.on('initialized', (context) => { /* ... */ });
field.on('changed', (value, context) => { /* ... */ });
```

Use a shared non-destructive helper from both hooks when dependency loading must happen initially and after edits. Guard `changed` with `context.origin === 'user'` when an effect must only follow a user gesture.

## Media Fields

Media-capable field types:

- `image`
- `document`
- `file-upload`

## Media Field Decision Matrix

Choose by the kind of content and by what should be stored in `Master`:

- image preview/upload where the field is specifically about images => `image`
- PDF or general document preview/upload => `document`
- general-purpose file picking/upload with no image/document-specific UX assumption => `file-upload`

Then choose the storage strategy:

- actual payload should be stored directly on the record => direct mode
- the record should store only centralized asset references => asset mode
- raw browser `File` objects must be preserved in `Master` => `file-upload` with `uploadType: 'file'`
- lightweight file descriptors should be stored in `Master` while raw files stay runtime-only => `file-upload` with `uploadType: 'metadata'`

Practical defaults:

- screenshots, profile photos, signatures, image attachments => `image`
- PDFs, letters, reports, exported docs => `document`
- mixed attachments, import files, spreadsheets, archives, arbitrary uploads => `file-upload`
- S3/Minio/assets-table workflows => asset mode
- simple legacy form persistence => direct mode

### Direct Mode

Default behavior:

- `image` and `document` store base64/data URLs
- `file-upload` stores values according to `uploadType`

`file-upload` direct mode exact storage shapes:

- `uploadType: 'base64'`
  - single => `string`
  - `multiple: true` => `string[]`
- `uploadType: 'file'`
  - single => `File`
  - `multiple: true` => `File[]`
- `uploadType: 'metadata'`
  - single => metadata object
  - `multiple: true` => metadata object[]

Operational rules:

- `fileSelected` fires for every upload mode
- raw browser files remain available through `field.$selectedFiles` even when `Master` stores metadata or base64
- metadata mode is for lightweight stored values plus separate upload/orchestration logic

### Asset Mode

Enabled by:

- `assetMode: true`
- `assetAdapter: ...`

Behavior:

- `Master` stores asset ids, not payloads
- field resolves asset ids back into asset records for preview/display
- staged files live in `field.$selectedFiles`
- `image`, `document`, and `file-upload` share the same asset-mode lifecycle
- single => one asset id `string`
- `multiple: true` => asset id array `string[]`

Typical lifecycle:

`autoUpload: true`

1. user selects file(s)
2. field stages `File[]`
3. `fileSelected` fires
4. adapter `upload(...)` runs
5. returned asset ids are written to `Master`
6. `assetUploaded` fires

`autoUpload: false`

1. user selects file(s)
2. field stages `File[]`
3. `fileSelected` fires
4. `Master` is unchanged
5. caller later invokes `field.$uploadAssets()`
6. returned asset ids are written to `Master`
7. `assetUploaded` fires

Important helpers:

- `field.$selectedFiles`
- `field.$clearSelectedFiles()`
- `field.$resolvedAssets`
- `field.$uploadAssets()`

Important hooks/events:

- `fileSelected`
- `assetUploaded`
- `assetsResolved`
- `assetRemoved`

Operational notes:

- `field.$clearSelectedFiles()` clears staged files only
- it does not clear already stored asset ids from `Master`
- use `autoUpload: false` when upload must happen at a later transactional point
- use `removeAssetOnClear: true` only when clearing should also trigger adapter-backed remote removal

If the task touches asset mode, read `docs/ui/Field.md` before editing.

## Validation Flow

Validation is split across field-level built-ins, field-level custom logic, and form-level aggregation.

### Field-Level Built-Ins

Driven by `FieldParams`:

- `required`
  - participates in normal form validation
  - invisible fields are skipped
- `validation`
  - range / min / max / gt / gte / lt / lte
  - eq / neq / in / nin
  - includes / excludes
  - minLen / maxLen
  - regex
  - type-aware conversion is applied for date, time, datetime, float, and integer cases
- file-related limits such as `fileMaxSize`

### Field-Level Custom Validation

Driven by `FieldOptions.validate(field)`.

The callback returns `UIValidationResult`. Prefer `$l(key, fallback, values)` for user-visible errors so validation follows the active locale. Plain strings remain valid.

Use this when validation depends on:

- another field value
- selected raw files via `field.$selectedFiles`
- resolved assets
- runtime-only conditions

Important implementation detail:

- `Field.validate()` delegates to `options.validate(...)` when provided
- if custom validation is added, preserve any built-in checks the flow still requires

### Form And Report Validation

Driven by `FormOptions.validate(form)`.

Form, `PartOptions.validate(part)`, and `ReportOptions.validate(report, form, index)` callbacks use the same `UIValidationResult` contract. Report validation is the final custom stage for report-owned forms and can block both next-step navigation and final saving. Built-in rules resolve through `ve.validation.*`; consult `docs/runtime/BuiltInTranslationKeys.md` before introducing new library-owned validation wording.

Use `await report.forceSave()` for programmatic saves. It delegates to the active form and follows the complete field, part, form, and report validation pipeline before persistence or step navigation.

Use this for cross-field rules such as:

- either A or B must be present
- staged uploads must be committed before save
- dates across several fields must be consistent

### Validation Review Rule

When changing a field or media workflow, always verify:

1. what reaches `Master`
2. what remains only in `field.$selectedFiles`
3. what validates at field level
4. what validates only at form level

## Collection Field

Use `collection` when the stored value is an array of item objects edited through a nested form.

Important characteristics:

- stored value is an array of records
- headers and items are table-driven
- add/edit/remove behavior is form-backed
- it is not the same thing as top-level `Collection`

Do not confuse:

- `Field type: 'collection'`
- `new Collection(...)`

They solve different problems.

## Canonical Review Checklist

Before finalizing a field change, check:

1. What exact datatype reaches `Master`?
2. Does `multiple` still behave correctly?
3. Does direct mode still work if asset mode was added?
4. Does preview/open behavior still work for image/document fields?
5. Do docs in `docs/ui/Field.md` still match implementation?
