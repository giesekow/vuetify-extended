# Dashboard

Composable dashboard page and widget system built on `UIBase`. `Dashboard` is intended for read-first app surfaces such as KPI overviews, operations boards, activity hubs, analytics summaries, and quick-action workspaces.

## Source

- [src/ui/dashboard.ts](../../src/ui/dashboard.ts)

## Highlights

- `Dashboard` extends `UIBase`, so it can be shown with `AppManager.showUI(...)` like other screens.
- Layout is section-based: `topChildren`, `children`, and `bottomChildren`.
- `DashboardWidget` is the common card/shell primitive used by all dashboard widget variants.
- Widgets support `refresh()` and the dashboard header refresh button cascades refresh across the whole page.
- Dashboards support theme-aware rendering, background customization, keyboard shortcuts, and a `MenuItem`-powered header dropdown.
- The dashboard header menu reuses existing `MenuItem` definitions, including `function`, `menu`, `collection`, and `report` actions.

## Factories

```ts
$DB     // Dashboard
$DW     // DashboardWidget
$DMW    // DashboardMetricWidget
$DTW    // DashboardTableWidget
$DLW    // DashboardListWidget
$DPW    // DashboardProgressWidget
$DCHW   // DashboardChartWidget
$DTrW   // DashboardTrendWidget
$DTLW   // DashboardTimelineWidget
$DALW   // DashboardActionListWidget
$DAW    // DashboardAlertWidget
$DESW   // DashboardEmptyStateWidget
$DSGW   // DashboardStatGridWidget
$DMaW   // DashboardMapWidget
$DCaW   // DashboardCalendarWidget
$DTabW  // DashboardTabsWidget
```

## `Dashboard`

### Purpose

Use `Dashboard` when the whole page is a collection of read-oriented widgets rather than a form/report/menu workflow.

### `DashboardParams`

```ts
export interface DashboardParams {
  ref?: string;
  title?: string;
  subtitle?: string;
  invisible?: boolean;
  fluid?: boolean;
  width?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  class?: string | string[];
  style?: any;
  containerClass?: string | string[];
  containerStyle?: any;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  theme?: 'light' | 'dark';
  textColor?: string;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  cols?: number | string;
  xl?: number | string;
  xxl?: number | string;
  justify?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  align?: 'center' | 'end' | 'start' | 'stretch' | 'baseline';
  alignContent?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  dense?: boolean;
}
```

### `DashboardOptions`

```ts
export interface DashboardOptions {
  master?: Master;
  topChildren?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  children?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  bottomChildren?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  menuItems?: (dashboard: Dashboard) => Array<MenuItem> | Promise<Array<MenuItem> | undefined> | undefined;
  setup?: (dashboard: Dashboard) => void;
  on?: (dashboard: Dashboard) => OnHandler;
}
```

### Notes

- `theme` controls default text color: dark dashboards default to white text and light dashboards default to dark text.
- `textColor` overrides the theme-derived text color.
- `backgroundGradient` and `backgroundImage` can be combined.
- `menuItems(...)` uses existing `MenuItem` definitions, so shortcut display and built-in action types work out of the box.
- `Dashboard.refresh()` cascades into all child widgets.

### Keyboard Behavior

- `Enter`: refresh the dashboard.
- `Shift+Enter`: open or close the dashboard header menu.
- `Escape`: close the dashboard.
- When the dashboard menu is open:
  - `ArrowDown`: move to the next menu item.
  - `ArrowUp`: move to the previous menu item.
  - `Enter`: trigger the highlighted menu item.
  - `Escape`: close the menu without closing the dashboard.
- Dashboard menu shortcuts defined on `MenuItem.shortcut` are also active while the dashboard is open, except when focus is inside text-editing controls.

### Example

```ts
const dashboard = new Dashboard(
  {
    title: 'Operations Dashboard',
    subtitle: 'Realtime overview of orders, alerts, and activity.',
    theme: 'dark',
    backgroundColor: '#1f2937',
    backgroundGradient: 'linear-gradient(180deg, rgba(31,41,55,0.96) 0%, rgba(30,41,59,0.9) 100%)',
  },
  {
    menuItems: () => [
      $MI({ text: 'Refresh', icon: 'mdi-refresh', action: 'function', shortcut: 'shift+r' }, {
        callback: async () => { await dashboard.refresh(); },
      }),
    ],
    topChildren: () => [
      $DMW({ title: 'Revenue', value: 14301, cols: 12, md: 3 }),
    ],
    children: () => [
      $DTW({ title: 'Recent Orders', cols: 12, lg: 8 }),
      $DCHW({ title: 'Revenue Trend', cols: 12, lg: 4, chartType: 'line' }),
    ],
  },
)
```

## Shared Widget Shell

All dashboard widgets inherit from `DashboardWidget`, which extends `UIBase` and provides the shared layout/card behavior.

### `DashboardWidgetParams`

```ts
export interface DashboardWidgetParams {
  ref?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  invisible?: boolean;
  noCard?: boolean;
  rounded?: string | number | boolean;
  elevation?: number;
  color?: string;
  variant?: 'elevated' | 'flat' | 'tonal' | 'text' | 'outlined' | 'plain';
  cardClass?: string | string[];
  cardStyle?: any;
  bodyClass?: string | string[];
  bodyStyle?: any;
  theme?: 'light' | 'dark';
  textColor?: string;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  cols?: number | string;
  xl?: number | string;
  xxl?: number | string;
  justify?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  align?: 'center' | 'end' | 'start' | 'stretch' | 'baseline';
  alignContent?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  dense?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  height?: number | string;
}
```

### `DashboardWidgetOptions`

```ts
export interface DashboardWidgetOptions {
  master?: Master;
  topChildren?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  children?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  bottomChildren?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  setup?: (widget: DashboardWidget) => void;
  on?: (widget: DashboardWidget) => OnHandler;
}
```

### Shared Notes

- `height`, `minHeight`, and `maxHeight` are handled at the widget shell level.
- When a widget has extra vertical space, the empty space stays inside the card below the content.
- When content overflows, the body becomes vertically scrollable.
- Widget `theme` inherits from the parent dashboard when it is not set locally.
- Widget `textColor` overrides both the widget theme and inherited dashboard theme.
- `DashboardWidget.refresh()` is available on all widget types and is used by `Dashboard.refresh()`.

## Value and Data Format by Widget Type

This section describes the expected static `params` shape and the matching async `options` shape for each concrete widget.

### `DashboardMetricWidget`

Use for single KPI cards such as revenue, subscriber count, order volume, or headline totals.

#### Expected value format

- `params.value`: `string | number`
- `options.value(widget)`: must return `string | number | undefined` or a promise of that value
- numeric values animate when first loaded and when refreshed

#### `DashboardMetricWidgetParams`

```ts
export interface DashboardMetricWidgetParams extends DashboardWidgetParams {
  value?: string | number;
  caption?: string;
  valueColor?: string;
  captionColor?: string;
}
```

#### `DashboardMetricWidgetOptions`

```ts
export interface DashboardMetricWidgetOptions extends DashboardWidgetOptions {
  value?: (widget: DashboardMetricWidget) => string | number | Promise<string | number | undefined> | undefined;
  formatValue?: (widget: DashboardMetricWidget, value: string | number | undefined) => string;
  onClicked?: (widget: DashboardMetricWidget) => void | Promise<void>;
}
```

#### Notes

- `options.value(...)` overrides `params.value` when provided.
- `formatValue(...)` is the right place for currency or compact-number formatting.
- Emits `clicked` and also supports `onClicked(...)`.

### `DashboardTableWidget`

Use for tabular detail such as recent orders, top customers, approval queues, or incident lists.

#### Expected data format

- `headers`: `DashboardTableColumn[]`
- `items`: `any[]` row objects
- local pagination uses the resolved `items` array
- server pagination uses `loadPage(...) => { items, total?, headers? }`

```ts
export interface DashboardTableColumn {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
}

export interface DashboardTablePageResult {
  items: any[];
  total?: number;
  headers?: DashboardTableColumn[];
}

export interface DashboardTableLoadArgs {
  page: number;
  pageSize: number;
  search: string;
}
```

#### `DashboardTableWidgetParams`

```ts
export interface DashboardTableWidgetParams extends DashboardWidgetParams {
  headers?: DashboardTableColumn[];
  items?: any[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  pagination?: boolean;
  pageSize?: number;
  page?: number;
}
```

#### `DashboardTableWidgetOptions`

```ts
export interface DashboardTableWidgetOptions extends DashboardWidgetOptions {
  headers?: (widget: DashboardTableWidget) => DashboardTableColumn[] | Promise<DashboardTableColumn[] | undefined> | undefined;
  items?: (widget: DashboardTableWidget) => any[] | Promise<any[] | undefined> | undefined;
  loadPage?: (widget: DashboardTableWidget, args: DashboardTableLoadArgs) => DashboardTablePageResult | Promise<DashboardTablePageResult | undefined> | undefined;
  cell?: (widget: DashboardTableWidget, row: any, column: DashboardTableColumn, index: number) => VNode | string | number | undefined;
  onRowClick?: (widget: DashboardTableWidget, row: any, index: number) => void | Promise<void>;
  rowClass?: (widget: DashboardTableWidget, row: any, index: number) => string | string[] | undefined;
  rowStyle?: (widget: DashboardTableWidget, row: any, index: number) => any;
}
```

#### Notes

- Emits `rowClicked` and also supports `onRowClick(...)`.
- `cell(...)` is for per-cell rendering without replacing the whole widget.
- `pagination: true` enables the built-in footer pager.
- `loadPage(...)` is the server-style path when the full row list is not already in memory.

### `DashboardListWidget`

Use for transaction lists, contacts, queue summaries, or compact record lists.

#### Expected item format

```ts
export interface DashboardListItem {
  key?: string | number;
  avatarText?: string;
  avatarColor?: string;
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  valueColor?: string;
  chipText?: string;
  chipColor?: string;
  chipVariant?: 'elevated' | 'flat' | 'tonal' | 'text' | 'outlined' | 'plain';
}
```

#### `DashboardListWidgetParams`

```ts
export interface DashboardListWidgetParams extends DashboardWidgetParams {
  items?: DashboardListItem[];
  emptyText?: string;
  separator?: boolean;
}
```

#### `DashboardListWidgetOptions`

```ts
export interface DashboardListWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardListWidget) => DashboardListItem[] | Promise<DashboardListItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardListWidget, item: DashboardListItem, index: number) => void | Promise<void>;
}
```

#### Notes

- `separator` is off by default.
- Emits `itemClicked` and also supports `onItemClicked(...)`.

### `DashboardProgressWidget`

Use for progress-style summaries such as revenue share, budget usage, completion ratios, or quota attainment.

#### Expected item format

```ts
export interface DashboardProgressItem {
  key?: string | number;
  avatarText?: string;
  avatarColor?: string;
  icon?: string;
  iconColor?: string;
  label: string;
  value?: string;
  amount: number;
  color?: string;
  bgColor?: string;
}
```

#### Notes on `amount`

- `amount` is expected as a ratio between `0` and `1`.
- Example: `0.62` means 62% fill.

#### `DashboardProgressWidgetParams`

```ts
export interface DashboardProgressWidgetParams extends DashboardWidgetParams {
  items?: DashboardProgressItem[];
  emptyText?: string;
}
```

#### `DashboardProgressWidgetOptions`

```ts
export interface DashboardProgressWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardProgressWidget) => DashboardProgressItem[] | Promise<DashboardProgressItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardProgressWidget, item: DashboardProgressItem, index: number) => void | Promise<void>;
}
```

#### Notes

- Emits `itemClicked` and also supports `onItemClicked(...)`.
- Bars animate on first load and on refresh.

### `DashboardChartWidget`

Use for line, bar, and donut charts.

#### Expected item format

```ts
export interface DashboardChartItem {
  key?: string | number;
  label: string;
  value: number;
  color?: string;
  valueLabel?: string;
}
```

#### `DashboardChartWidgetParams`

```ts
export interface DashboardChartWidgetParams extends DashboardWidgetParams {
  chartType?: 'bar' | 'line' | 'donut';
  items?: DashboardChartItem[];
  emptyText?: string;
  chartHeight?: number | string;
  showLegend?: boolean;
}
```

#### `DashboardChartWidgetOptions`

```ts
export interface DashboardChartWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardChartWidget) => DashboardChartItem[] | Promise<DashboardChartItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardChartWidget, item: DashboardChartItem, index: number) => void | Promise<void>;
}
```

#### Notes

- `label` is the visible category/point label.
- `value` is the numeric magnitude.
- `valueLabel` is optional display text, useful for percentages in donut charts.
- Emits `itemClicked` and also supports `onItemClicked(...)`.

### `DashboardTrendWidget`

Use for KPI cards with a trend direction and sparkline.

#### Expected value format

- `value`: `string | number`
- `delta`: `string`
- `sparklineValues`: `number[]`

#### `DashboardTrendWidgetParams`

```ts
export interface DashboardTrendWidgetParams extends DashboardWidgetParams {
  value?: string | number;
  caption?: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  sparklineValues?: number[];
  valueColor?: string;
  deltaColor?: string;
  sparklineColor?: string;
}
```

#### `DashboardTrendWidgetOptions`

```ts
export interface DashboardTrendWidgetOptions extends DashboardWidgetOptions {
  value?: (widget: DashboardTrendWidget) => string | number | Promise<string | number | undefined> | undefined;
  delta?: (widget: DashboardTrendWidget) => string | Promise<string | undefined> | undefined;
  sparklineValues?: (widget: DashboardTrendWidget) => number[] | Promise<number[] | undefined> | undefined;
  formatValue?: (widget: DashboardTrendWidget, value: string | number | undefined) => string;
  onClicked?: (widget: DashboardTrendWidget) => void | Promise<void>;
}
```

#### Notes

- `trend` controls iconography and default direction styling.
- Emits `clicked` and also supports `onClicked(...)`.

### `DashboardTimelineWidget`

Use for activity feeds, audit trails, shipping events, deployment timelines, or status history.

#### Expected item format

```ts
export interface DashboardTimelineItem {
  key?: string | number;
  title: string;
  subtitle?: string;
  time?: string;
  description?: string;
  color?: string;
  icon?: string;
  iconColor?: string;
  avatarText?: string;
  avatarColor?: string;
}
```

#### Notes

- Use either `icon` or `avatarText` depending on the visual style you want.
- `time` is display-only text; no date parsing is required by the widget.

### `DashboardActionListWidget`

Use for shortcut/action cards where each row includes an action button or actionable summary.

#### Expected item format

```ts
export interface DashboardActionItem {
  key?: string | number;
  title: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  avatarText?: string;
  avatarColor?: string;
  chipText?: string;
  chipColor?: string;
  actionText?: string;
  actionColor?: string;
  actionVariant?: 'elevated' | 'flat' | 'tonal' | 'text' | 'outlined' | 'plain';
  disabled?: boolean;
}
```

#### Notes

- Emits `itemClicked` and also supports `onItemClicked(...)`.
- `actionText` controls the right-side button label.

### `DashboardAlertWidget`

Use for operational alerts, warnings, and important notices.

#### Expected item format

```ts
export interface DashboardAlertItem {
  key?: string | number;
  severity?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  time?: string;
  chipText?: string;
}
```

#### Notes

- `severity` controls the visual tone.
- Emits `itemClicked` and also supports `onItemClicked(...)`.

### `DashboardEmptyStateWidget`

Use for onboarding, disconnected integrations, or no-data states.

#### Expected value format

This widget is not list-based. It expects descriptive strings rather than item arrays.

#### `DashboardEmptyStateWidgetParams`

```ts
export interface DashboardEmptyStateWidgetParams extends DashboardWidgetParams {
  titleText?: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  buttonText?: string;
  toneColor?: string;
}
```

#### `DashboardEmptyStateWidgetOptions`

```ts
export interface DashboardEmptyStateWidgetOptions extends DashboardWidgetOptions {
  buttonText?: (widget: DashboardEmptyStateWidget) => string | Promise<string | undefined> | undefined;
  onClicked?: (widget: DashboardEmptyStateWidget) => void | Promise<void>;
}
```

#### Notes

- `buttonText` only matters when the widget is meant to expose an action.
- Emits `clicked` and also supports `onClicked(...)`.

### `DashboardStatGridWidget`

Use for compact multi-KPI cards where several metrics should fit inside one widget.

#### Expected item format

```ts
export interface DashboardStatGridItem {
  key?: string | number;
  label: string;
  value: string | number;
  caption?: string;
  icon?: string;
  iconColor?: string;
  color?: string;
  valueColor?: string;
}
```

#### `DashboardStatGridWidgetParams`

```ts
export interface DashboardStatGridWidgetParams extends DashboardWidgetParams {
  items?: DashboardStatGridItem[];
  columns?: number;
  emptyText?: string;
}
```

#### `DashboardStatGridWidgetOptions`

```ts
export interface DashboardStatGridWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardStatGridWidget) => DashboardStatGridItem[] | Promise<DashboardStatGridItem[] | undefined> | undefined;
  formatValue?: (widget: DashboardStatGridWidget, item: DashboardStatGridItem, index: number) => string;
  onItemClicked?: (widget: DashboardStatGridWidget, item: DashboardStatGridItem, index: number) => void | Promise<void>;
}
```

#### Notes

- `columns` controls how many stat cells appear per row.
- Emits `itemClicked` and also supports `onItemClicked(...)`.

### `DashboardMapWidget`

Use for read-only geographic summary cards.

#### Expected data format

```ts
export interface DashboardMapPoint {
  lat: number;
  lng: number;
}

export interface DashboardMapMarker extends DashboardMapPoint {
  key?: string | number;
  label?: string;
  color?: string;
}

export interface DashboardMapData {
  center?: DashboardMapPoint;
  markers?: DashboardMapMarker[];
  line?: DashboardMapPoint[];
  polygon?: DashboardMapPoint[];
}
```

#### Notes

- `center` sets the initial viewport focus.
- `markers` are optional labeled points.
- `line` is a simple ordered list of `{ lat, lng }` points.
- `polygon` is a simple ordered list of `{ lat, lng }` points.
- This widget is display-only; it does not edit geometry.

#### `DashboardMapWidgetParams`

```ts
export interface DashboardMapWidgetParams extends DashboardWidgetParams {
  data?: DashboardMapData;
  emptyText?: string;
  mapHeight?: number | string;
  showLegend?: boolean;
}
```

#### `DashboardMapWidgetOptions`

```ts
export interface DashboardMapWidgetOptions extends DashboardWidgetOptions {
  data?: (widget: DashboardMapWidget) => DashboardMapData | Promise<DashboardMapData | undefined> | undefined;
  onMarkerClicked?: (widget: DashboardMapWidget, marker: DashboardMapMarker, index: number) => void | Promise<void>;
}
```

### `DashboardCalendarWidget`

Use for month-style scheduling, booking, due-date, or event views.

#### Expected item format

```ts
export interface DashboardCalendarItem {
  key?: string | number;
  date: string | Date;
  title: string;
  color?: string;
}
```

#### `DashboardCalendarWidgetParams`

```ts
export interface DashboardCalendarWidgetParams extends DashboardWidgetParams {
  items?: DashboardCalendarItem[];
  year?: number;
  month?: number;
  emptyText?: string;
}
```

#### `DashboardCalendarWidgetOptions`

```ts
export interface DashboardCalendarWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardCalendarWidget) => DashboardCalendarItem[] | Promise<DashboardCalendarItem[] | undefined> | undefined;
  onDateClicked?: (widget: DashboardCalendarWidget, date: Date, items: DashboardCalendarItem[]) => void | Promise<void>;
}
```

#### Notes

- `month` is `1`-based in normal dashboard usage.
- `date` can be a `Date` instance or any string your host app wants to convert into a valid `Date`.
- `onDateClicked(...)` receives the clicked date and all items for that date.

### `DashboardTabsWidget`

Use when one card should swap between a few related mini-panels.

#### Expected tab format

```ts
export interface DashboardTabItem {
  key?: string | number;
  label: string;
  badge?: string | number;
  children?: (widget: DashboardTabsWidget, props: any, context: any) => Array<UIBase | VNode>;
}
```

#### `DashboardTabsWidgetParams`

```ts
export interface DashboardTabsWidgetParams extends DashboardWidgetParams {
  tabs?: DashboardTabItem[];
  activeTab?: number;
  emptyText?: string;
}
```

#### `DashboardTabsWidgetOptions`

```ts
export interface DashboardTabsWidgetOptions extends DashboardWidgetOptions {
  tabs?: (widget: DashboardTabsWidget) => DashboardTabItem[] | Promise<DashboardTabItem[] | undefined> | undefined;
  onTabChanged?: (widget: DashboardTabsWidget, tab: DashboardTabItem, index: number) => void | Promise<void>;
}
```

#### Notes

- `children(...)` is the tab body renderer and can return nested `UIBase` instances or raw VNodes.
- Emits `tabChanged` and also supports `onTabChanged(...)`.

## Refresh Model

- `Dashboard.refresh()` cascades into every child widget.
- Widgets with async loaders refresh by reloading their data and redrawing their internal state.
- Metric and progress widgets replay their animations on refresh.
- The dashboard header refresh button and the `Enter` shortcut both call the same refresh path.

## Header Menu Model

The dashboard header menu is powered by `MenuItem` definitions from [src/ui/menu.ts](../../src/ui/menu.ts).

That means dashboard menu items can reuse:

- `action: 'function'`
- `action: 'menu'`
- `action: 'collection'`
- `action: 'report'`
- `shortcut`
- `icon`, `text`, `subText`, and `textColor`

Example:

```ts
new Dashboard(
  { title: 'Commerce Dashboard' },
  {
    menuItems: () => [
      $MI(
        { text: 'Refresh Widgets', icon: 'mdi-refresh', action: 'function', shortcut: 'shift+r' },
        { callback: async () => { await dashboard.refresh(); } },
      ),
    ],
  },
)
```
