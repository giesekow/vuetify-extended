# Report

Multi-step workflow screen for create/edit/reporting tasks with forms, navigation, progress, side buttons, and finish/cancel behavior.

## Source

- [src/ui/report.ts](../../src/ui/report.ts)

## Highlights

- Supports multi-step flows with current-step refs and a compact progress header.
- Can render side-button rails and mobile-friendly actions.
- Integrates tightly with `Form` for save, prev/next, and cancel semantics.

## Reference

### `ReportParams`

```ts
export interface ReportParams {
  objectType?: any;
  objectId?: any;
  selected?: any;
  title?: string;
  confirmOnCancel?: boolean;
  hideMode?: boolean;
  cancelButton?: ButtonParams;
  cancelButtonStyle?: ReportButtonStyle;
  nextButton?: ButtonParams;
  nextButtonStyle?: ReportButtonStyle;
  prevButton?: ButtonParams;
  prevButtonStyle?: ReportButtonStyle;
  finishButton?: ButtonParams;
  finishButtonStyle?: ReportButtonStyle;
  sideButtonPosition?: 'left'|'right';
  sideButtonWidth?: string|number;
  multiple?: boolean;
  setActionButtons?: boolean;
  forms?: number;
  mode?: 'create'|'edit'|'display';
  editAfterSave?: boolean;
  verticalAlign?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  horizontalAlign?: "left"|"center"|"right";
  fluid?: boolean;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  printAfterSave?: boolean;
  canPrint?: boolean;
  canExport?: boolean;
  printTemplate?: string;
  exportTemplate?: string;
  exportFilename?: string;
}
```

### `ReportOptions`

```ts
export interface ReportOptions {
  master?: Master;
  form?: (props: any, context: any, index: number) => Promise<Form|undefined>|Form|undefined;
  hasForm?: (props: any, context: any, index: number) => Promise<boolean|undefined>|boolean|undefined;
  saved?: () => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  access?: (report: Report, mode: any) => Promise<boolean>|boolean;
  setup?: (report: Report) => void;
  beforePrint?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  printTemplate?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  beforeExport?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  exportTemplate?: (report: Report, mode?: ReportMode) => Promise<ExportTemplateInfo|undefined>|ExportTemplateInfo|undefined;
  on?: (report: Report) => OnHandler;
  loaded?: (report: Report) => void;
  hasNextForm?: (report: Report, index: number) => Promise<boolean|undefined>|boolean|undefined
  hasPrevForm?: (report: Report, index: number) => Promise<boolean|undefined>|boolean|undefined
  removeEventListeners?: (report: Report) => Promise<void>|void
  attachEventListeners?: (report: Report) => Promise<void>|void
  title?: (report: Report, index?: number) => string
  sideButtons?: (props: any, context: any, report: Report) => Array<Button>|undefined
}
```

### `Report`

```ts
export class Report extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: ReportParams, reset?: boolean)`
- `render(props: any, context: any)`
