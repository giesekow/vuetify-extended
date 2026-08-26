# Refreshing UI Data

`vuetify-extended` provides component-specific refresh methods so applications can reload API data without closing and reopening the current screen. Choose the narrowest refresh method that matches what changed.

## Quick Reference

| Component | Method | Use when | Rebuilds screen configuration |
| --- | --- | --- | --- |
| `Trigger` | `refreshResults(options?)` | Only the result table data changed | No |
| `Trigger` | `refresh(options?)` | Access, headers, search fields, buttons, or result data may have changed | Yes |
| `Report` | `refresh(options?)` | The current record and report-dependent UI should be reloaded | Yes |
| `Dashboard` | `refresh(options?)` | Dashboard widget data and the header menu should be reloaded | Refreshes existing widgets and reloads the menu |
| `DashboardWidget` | `refresh()` | Only one dashboard widget should reload | Widget-specific |

All screen-level refresh methods accept the same progress option:

```ts
interface RefreshOptions {
  progress?: boolean;
}
```

Progress is `false` by default. This keeps background and realtime refreshes unobtrusive. Use `{ progress: true }` for an explicit user action that should display the shared blocking progress dialog.

## Trigger Result-Only Refresh

Use `Trigger.refreshResults()` when a record was created, updated, or removed at the API and only the current result table needs fresh data:

```ts
await trigger.refreshResults();
```

The request follows the Trigger's normal loading path. It therefore continues to use:

- `TriggerOptions.load(...)`, when configured, or the default API service query
- the committed search text
- the selected search/filter fields
- `TriggerOptions.query(...)` and `TriggerOptions.processQuery(...)`
- the current page and page size
- `TriggerOptions.format(...)`

The method updates the reactive table items and pagination total. It does not call `initialize()`, force-remount the Trigger, or recreate headers, search fields, children, or side buttons. The current selected-items model is not explicitly cleared.

This is the recommended method after an external or realtime data change because it preserves the user's current browsing context:

```ts
service.on('created', async () => {
  await trigger.refreshResults();
});
```

For a manual reload button:

```ts
const reloadButton = $BN(
  { text: 'Reload results', icon: 'mdi-refresh' },
  {
    onClicked: async () => {
      await trigger.refreshResults({ progress: true });
    },
  },
);
```

If access is currently denied, `refreshResults()` clears stale rows and the total without issuing a result query.

## Full Trigger Refresh

Use `Trigger.refresh()` when configuration derived from external data may also have changed:

```ts
await trigger.refresh();
```

The full refresh:

1. Reruns Trigger initialization and access checks.
2. Recreates headers and search-field configuration.
3. Calls `refreshResults()` to reload the current result table.
4. Forces a render so top children, bottom children, and side-button definitions are evaluated again.

Use this method when permissions, available filters, column definitions, or button visibility can change. Do not use it merely to pick up a newly created table row; `refreshResults()` is less disruptive for that case.

## Report Refresh

Use `Report.refresh()` when the record behind the current report changed at the API:

```ts
await report.refresh();
```

The refresh:

1. Calls `report.loadObject()` and reloads the current object through its `Master`.
2. Captures the reloaded state as the Report's clean state.
3. Runs `ReportOptions.loaded(report)` and the Report's `before-loaded`/`loaded` events through the normal load lifecycle.
4. Calls `report.forceRender()` so the current Form subtree and report side buttons are recreated.

Use this instead of calling only `report.$master.$load()` when UI factories such as `sideButtons(...)` depend on the refreshed data:

```ts
await report.refresh({ progress: true });
```

`refresh()` does not save the report, reset it to create mode, or invoke the normal save flow.

## Dashboard Refresh

Use `Dashboard.refresh()` to refresh the complete dashboard:

```ts
await dashboard.refresh();
```

It calls `refresh()` on every resolved child widget, then reloads the Dashboard's cached `menuItems(...)` definitions and reapplies menu access checks. Widget-specific refresh behavior includes reloading async data and replaying supported metric/progress animations.

The dashboard header refresh action and the `Enter` shortcut use:

```ts
await dashboard.refresh({ progress: true });
```

To refresh only one widget, retain its instance and call its own method:

```ts
await revenueWidget.refresh();
```

Widget refresh methods do not take the Dashboard-level progress option. Show progress externally when a standalone widget refresh needs blocking feedback.

## Concurrency and Errors

`Report.refresh()`, `Trigger.refresh()`, `Trigger.refreshResults()`, and `Dashboard.refresh()` coalesce overlapping calls of the same kind onto the current in-flight operation. This prevents repeated clicks or simultaneous notifications from issuing duplicate work.

Each method returns a `Promise<void>`, so callers should `await` it and handle errors where application-specific recovery is needed:

```ts
try {
  await trigger.refreshResults({ progress: true });
} catch (error) {
  Dialogs.$error('The results could not be refreshed.');
}
```

When progress is enabled, the shared progress dialog is hidden in a `finally` block even if refresh fails.

## Choosing the Correct Method

- New or updated API row, unchanged table configuration: `trigger.refreshResults()`.
- Permissions, headers, filters, or Trigger buttons changed: `trigger.refresh()`.
- Current Report record or report-dependent side buttons changed: `report.refresh()`.
- Several dashboard widgets or dashboard menu actions changed: `dashboard.refresh()`.
- One dashboard card changed: `widget.refresh()`.
- Only reactive local state changed and no API reload is needed: use `forceRender()` only when factory output must be reconstructed; otherwise normal Vue reactivity should update the UI.

See [Trigger](./Trigger.md), [Report](./Report.md), and [Dashboard](./Dashboard.md) for each component's complete API.
