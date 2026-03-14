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
  headers?: any[];
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
  headers?: (trigger: Trigger) => Promise<any[]>;
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
```

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
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: TriggerParams, reset?: boolean)`
- `render(props: any, context: any)`

## ID Resolution

- `TriggerParams.idField` is used first for selected records, result tables, and remove actions.
- When omitted, trigger result handling falls back to the global `Master` id field and then `_id` / `id`.
