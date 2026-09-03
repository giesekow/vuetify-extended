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
  validate?: (report: Report, form: Form, index: number) => Promise<UIValidationResult>|UIValidationResult;
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

export interface ReportRefreshOptions {
  progress?: boolean;
}
```

### `Report`

```ts
export class Report extends UIBase {
  validate(form: Form, index?: number): Promise<UIValidationResult>;
  refresh(options?: ReportRefreshOptions): Promise<void>;
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: ReportParams, reset?: boolean)`
- `validate(form: Form, index?: number)`
- `loadObject()`
- `refresh(options?: ReportRefreshOptions)`
- `render(props: any, context: any)`

## Report-Level Validation

Use `ReportOptions.validate` for rules that span forms, depend on the current workflow step, or belong to the report rather than one field or form. It runs after the active form and all its child parts have passed validation, but before a confirmation dialog, `Master.$save()`, or movement to the next form.

```ts
import { $FD, $FM, $PT, $RP, $l } from 'vuetify-extended';

const report = $RP(
  { title: 'Booking', forms: 2, mode: 'create' },
  {
    form: (_props, _context, index) => $FM({}, {
      children: () => [
        $PT({}, {
          children: () => [
            $FD({ storage: index === 0 ? 'startDate' : 'endDate', type: 'date' }),
          ],
        }),
      ],
    }),
    validate: (report, _form, index) => {
      const start = report.$master?.$data.startDate;
      const end = report.$master?.$data.endDate;

      if (index === 1 && start && end && end < start) {
        return $l(
          'booking.validation.dateOrder',
          'End date must be on or after start date.',
        );
      }

      return undefined;
    },
  },
);
```

The callback receives the owning `Report`, the active `Form`, and its zero-based form index. Return a plain string or `UIText` descriptor to stop the action and show the message in the form validation summary. Return `true` or `undefined` to continue. Validation failures prevent both next-step navigation and final saving.

Standalone forms are unaffected because report-level validation only runs when the form belongs to a `Report`.

`await report.forceSave()` follows the same validation, confirmation, persistence, and report-step pipeline as the visible Save/Next button. It delegates to the active form rather than bypassing validation.

## Refreshing Report Data

Use `Report.refresh()` when API data may have changed and the complete visible report should reflect the latest state:

```ts
await report.refresh();
```

`refresh()` performs the following sequence:

1. Calls `report.loadObject()` to reload the current object through the normal Report and Master lifecycle.
2. Updates the Report clean-state snapshot and executes `ReportOptions.loaded(report)` plus `before-loaded`/`loaded` events.
3. Calls `report.forceRender()` so the current Form subtree and `sideButtons(...)` factory are reevaluated.

Progress is disabled by default, which makes the method suitable for background and realtime refreshes. Enable the shared blocking progress dialog for a user-triggered refresh:

```ts
await report.refresh({ progress: true });
```

The progress dialog is closed in a `finally` block even when a loaded hook throws. Concurrent calls share the same in-flight API reload, preventing duplicate requests. Each caller still controls whether it displays progress.

Refreshing does not save or reset the Report. Fields receive the reloaded Master data through their normal synchronization lifecycle, while side buttons are recreated from the latest Report state.

Use `Report.refresh()` rather than only `report.$master.$load()` when report-level UI factories must also reflect the new data. For a comparison with Trigger and Dashboard refresh behavior, see [Refreshing UI Data](./Refreshing.md).
