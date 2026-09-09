# Trigger

Action-oriented workflow screen for search/query/trigger tasks with form controls, result tables, and side buttons.

## Source

- [src/ui/trigger.ts](../../src/ui/trigger.ts)

## Highlights

- Supports side-button rails/dropdowns and button shortcuts.
- Pairs especially well with selector/server-table style workflows.

## Reference

### `TriggerParams`

```ts
export interface TriggerParams {
  ref?: string;
  invisible?: boolean;
  title?: string;
  subtitle?: string;
  mode?: 'create'|'edit'|'display';
  cancelButton?: ButtonParams,
  removeButton?: ButtonParams,
  viewButton?: ButtonParams,
  editButton?: ButtonParams,
  elevation?: number;
  maxWidth?: number|string|undefined;
  minWidth?: number|string|undefined;
  width?: number|string|undefined;
  headers?: UITableHeader[];
  tableHeight?: number|string;
  queryFields?: any[];
  selectFields?: any;
  objectType?: any;
  idField?: any;
  multiple?: boolean;
  defaultButtonPosition?: "top"|"bottom"|"both";
  sideButtonPosition?: 'left'|'right';
  sideButtonWidth?: string|number;
  verticalAlign?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  horizontalAlign?: "left"|"center"|"right";
  fluid?: boolean;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  query?: any;
  canPrint?: boolean;
  canExport?: boolean;
  printTemplate?: string;
  exportTemplate?: string;
  exportFilename?: string;
}
```

### `TriggerOptions`

```ts
export interface TriggerOptions {
  searchFields?: (tigger: Trigger, mode?: 'create'|'edit'|'display') => any | Promise<any>;
  cancel?: () => Promise<void>;
  access?: (tigger: Trigger, mode?: 'create'|'edit'|'display') => Promise<boolean>;
  removeAccess?: (trigger: Trigger) => Promise<boolean>;
  canRemove?: (item: any, trigger: Trigger) => Promise<boolean>;
  headers?: (trigger: Trigger) => Promise<UITableHeader[]|undefined>|UITableHeader[]|undefined;
  load?: (searchText: string, trigger: Trigger, options: any) => Promise<any>;
  remove?: (item: any, trigger: Trigger) => Promise<boolean|string>;
  query?: (search: string, trigger: Trigger, mode?: 'create'|'edit'|'display', searchFields?: any[]) => Promise<any>;
  setup?: (trigger: Trigger) => void;
  on?: (trigger: Trigger) => OnHandler;
  format?: (trigger: Trigger, items : any[]) => Promise<any[]| undefined>|any[]|undefined;
  topChildren?: (props: any, context: any) => Array<Part|Field>;
  bottomChildren?: (props: any, context: any) => Array<Part|Field>;
  processQuery?: (query: any, trigger: Trigger, mode?: 'create'|'edit'|'display', search?: string, searchFields?: any[]) => Promise<any>;
  beforePrint?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  printTemplate?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  beforeExport?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  exportTemplate?: (trigger: Trigger, mode?: ReportMode) => Promise<ExportTemplateInfo|undefined>|ExportTemplateInfo|undefined;
  sideButtons?: (props: any, context: any, trigger: Trigger) => Array<Button>|undefined;
}

export interface TriggerRefreshOptions {
  progress?: boolean;
}
```

`TriggerParams.headers` and `TriggerOptions.headers(...)` use the exported `UITableHeader` contract. Every header `title` accepts a plain string or `UIText`; nested `children` titles are resolved recursively and react to locale changes.

### `ServerTableOptions`

```ts
export interface ServerTableOptions {
  page: number,
  itemsPerPage: any,
  total: number,
  selectedFilterFields?: any[]
}
```

### `Trigger`

```ts
export class Trigger extends UIBase {
  refreshResults(options?: TriggerRefreshOptions): Promise<void>;
  refresh(options?: TriggerRefreshOptions): Promise<void>;
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: TriggerParams, reset?: boolean)`
- `refreshResults(options?: TriggerRefreshOptions)`
- `refresh(options?: TriggerRefreshOptions)`
- `render(props: any, context: any)`

## Refreshing Trigger Results

Use `Trigger.refreshResults()` when only the API-backed result table must be reloaded, for example after another client or workflow creates a record:

```ts
await trigger.refreshResults();
```

It preserves and reuses the current browsing context:

- committed search text
- selected filter fields
- the current query and `processQuery(...)`
- current page and page size
- the selected-items model, which is not explicitly cleared

It reloads through `TriggerOptions.load(...)` or the default service query, applies `query(...)`, `processQuery(...)`, and `format(...)` through the normal loading path, and updates the reactive result table and total. It does not rerun access checks, headers, search-field configuration, top/bottom children, or side-button factories, and it does not force-remount the Trigger.

Progress is disabled by default:

```ts
await trigger.refreshResults({ progress: true });
```

Use the broader `Trigger.refresh()` when configuration and buttons may also depend on changed external data:

```ts
await trigger.refresh();
```

The full refresh reruns access, headers, and search-field configuration; delegates table loading to `refreshResults()`; then forces a render so top, bottom, and side-button definitions are recreated.

Progress is disabled by default. Enable it for a user-triggered refresh:

```ts
await trigger.refresh({ progress: true });
```

If current or refreshed access is denied, stale result items are cleared and no API result query is made. Concurrent result-only calls share one table request, and concurrent full refreshes share one full operation.

### Which Trigger refresh should I use?

| Situation | Method |
| --- | --- |
| A new API row should appear without disturbing the user's search | `refreshResults()` |
| A realtime update changed result values | `refreshResults()` |
| Available filters or table headers changed | `refresh()` |
| Access or side-button visibility changed | `refresh()` |

For the cross-component refresh guide and realtime examples, see [Refreshing UI Data](./Refreshing.md).


## Keyboard Navigation

When trigger results are visible, the trigger table supports keyboard-first navigation in addition to mouse interaction.

- `ArrowUp` / `ArrowDown`
  Move a trigger-local active-row highlight through the current result table, even when focus is still in the trigger search field.
- `Ctrl+Enter` on Windows/Linux
- `Cmd+Enter` on macOS
  Activate the current active row using the same behavior as clicking the row.
- `PageUp`
  Load the previous result page when the server table has one.
- `PageDown`
  Load the next result page when the server table has one.
- `Enter`
  Still triggers the current search from the search text field.
- `Home` / `End`
  Are intentionally left alone so normal text-cursor movement still works in focused fields.

The active-row highlight is separate from checkbox selection. In multiple-selection triggers, keyboard row navigation does not replace the selected-items model; it only determines the current row for keyboard activation.

## ID Resolution

- `TriggerParams.idField` is used first for selected records, result tables, and remove actions.
- When omitted, trigger result handling falls back to the global `Master` id field and then `_id` / `id`.
