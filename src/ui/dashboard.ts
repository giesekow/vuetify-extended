import { Ref, VNode } from 'vue';
import { UIBase } from './base';
import {
  VAvatar,
  VBtn,
  VCard,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VChip,
  VCol,
  VContainer,
  VIcon,
  VList,
  VListItem,
  VMenu,
  VProgressLinear,
  VRow,
  VTable,
  VTextField,
} from 'vuetify/components';
import { Master } from '../master';
import { OnHandler } from './lib';
import { Report } from './report';
import { Dialogs } from './dialogs';
import { AppManager } from './appmanager';
import { MenuItem } from './menu';
import { describeShortcut, normalizeShortcut, normalizeShortcutFromEvent } from './shortcut';

export type DashboardTheme = 'light' | 'dark';

const DASHBOARD_WIDGET_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

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
  theme?: DashboardTheme;
  textColor?: string;
  xs?: number | string | undefined;
  sm?: number | string | undefined;
  md?: number | string | undefined;
  lg?: number | string | undefined;
  cols?: number | string | undefined;
  xl?: number | string | undefined;
  xxl?: number | string | undefined;
  justify?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch' | undefined;
  align?: 'center' | 'end' | 'start' | 'stretch' | 'baseline' | undefined;
  alignContent?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch' | undefined;
  dense?: boolean | undefined;
}

export interface DashboardOptions {
  master?: Master;
  topChildren?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  children?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  bottomChildren?: (dashboard: Dashboard, props: any, context: any) => Array<DashboardWidget | UIBase | VNode>;
  menuItems?: (dashboard: Dashboard) => Array<MenuItem> | Promise<Array<MenuItem> | undefined> | undefined;
  setup?: (dashboard: Dashboard) => void;
  on?: (dashboard: Dashboard) => OnHandler;
}

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
  theme?: DashboardTheme;
  textColor?: string;
  xs?: number | string | undefined;
  sm?: number | string | undefined;
  md?: number | string | undefined;
  lg?: number | string | undefined;
  cols?: number | string | undefined;
  xl?: number | string | undefined;
  xxl?: number | string | undefined;
  justify?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch' | undefined;
  align?: 'center' | 'end' | 'start' | 'stretch' | 'baseline' | undefined;
  alignContent?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch' | undefined;
  dense?: boolean | undefined;
  minHeight?: number | string | undefined;
  maxHeight?: number | string | undefined;
  height?: number | string | undefined;
}

export interface DashboardWidgetOptions {
  master?: Master;
  topChildren?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  children?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  bottomChildren?: (widget: DashboardWidget, props: any, context: any) => Array<UIBase | VNode>;
  setup?: (widget: DashboardWidget) => void;
  on?: (widget: DashboardWidget) => OnHandler;
}

export interface DashboardMetricWidgetParams extends DashboardWidgetParams {
  value?: string | number;
  caption?: string;
  valueColor?: string;
  captionColor?: string;
}

export interface DashboardMetricWidgetOptions extends DashboardWidgetOptions {
  value?: (widget: DashboardMetricWidget) => string | number | Promise<string | number | undefined> | undefined;
  formatValue?: (widget: DashboardMetricWidget, value: string | number | undefined) => string;
  onClicked?: (widget: DashboardMetricWidget) => void | Promise<void>;
}

export interface DashboardTableColumn {
  key: string;
  title: string;
  align?: 'start' | 'center' | 'end';
  width?: string | number;
}

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

export interface DashboardTableWidgetOptions extends DashboardWidgetOptions {
  headers?: (widget: DashboardTableWidget) => DashboardTableColumn[] | Promise<DashboardTableColumn[] | undefined> | undefined;
  items?: (widget: DashboardTableWidget) => any[] | Promise<any[] | undefined> | undefined;
  loadPage?: (widget: DashboardTableWidget, args: DashboardTableLoadArgs) => DashboardTablePageResult | Promise<DashboardTablePageResult | undefined> | undefined;
  cell?: (widget: DashboardTableWidget, row: any, column: DashboardTableColumn, index: number) => VNode | string | number | undefined;
  onRowClick?: (widget: DashboardTableWidget, row: any, index: number) => void | Promise<void>;
  rowClass?: (widget: DashboardTableWidget, row: any, index: number) => string | string[] | undefined;
  rowStyle?: (widget: DashboardTableWidget, row: any, index: number) => any;
}

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

export interface DashboardListWidgetParams extends DashboardWidgetParams {
  items?: DashboardListItem[];
  emptyText?: string;
  separator?: boolean;
}

export interface DashboardListWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardListWidget) => DashboardListItem[] | Promise<DashboardListItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardListWidget, item: DashboardListItem, index: number) => void | Promise<void>;
}

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

export interface DashboardProgressWidgetParams extends DashboardWidgetParams {
  items?: DashboardProgressItem[];
  emptyText?: string;
}

export interface DashboardProgressWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardProgressWidget) => DashboardProgressItem[] | Promise<DashboardProgressItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardProgressWidget, item: DashboardProgressItem, index: number) => void | Promise<void>;
}


export interface DashboardChartItem {
  key?: string | number;
  label: string;
  value: number;
  color?: string;
  valueLabel?: string;
}

export interface DashboardChartWidgetParams extends DashboardWidgetParams {
  chartType?: 'bar' | 'line' | 'donut';
  items?: DashboardChartItem[];
  emptyText?: string;
  chartHeight?: number | string;
  showLegend?: boolean;
}

export interface DashboardChartWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardChartWidget) => DashboardChartItem[] | Promise<DashboardChartItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardChartWidget, item: DashboardChartItem, index: number) => void | Promise<void>;
}

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

export interface DashboardTrendWidgetOptions extends DashboardWidgetOptions {
  value?: (widget: DashboardTrendWidget) => string | number | Promise<string | number | undefined> | undefined;
  delta?: (widget: DashboardTrendWidget) => string | Promise<string | undefined> | undefined;
  sparklineValues?: (widget: DashboardTrendWidget) => number[] | Promise<number[] | undefined> | undefined;
  formatValue?: (widget: DashboardTrendWidget, value: string | number | undefined) => string;
  onClicked?: (widget: DashboardTrendWidget) => void | Promise<void>;
}

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

export interface DashboardTimelineWidgetParams extends DashboardWidgetParams {
  items?: DashboardTimelineItem[];
  emptyText?: string;
}

export interface DashboardTimelineWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardTimelineWidget) => DashboardTimelineItem[] | Promise<DashboardTimelineItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardTimelineWidget, item: DashboardTimelineItem, index: number) => void | Promise<void>;
}

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

export interface DashboardActionListWidgetParams extends DashboardWidgetParams {
  items?: DashboardActionItem[];
  emptyText?: string;
}

export interface DashboardActionListWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardActionListWidget) => DashboardActionItem[] | Promise<DashboardActionItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardActionListWidget, item: DashboardActionItem, index: number) => void | Promise<void>;
}


export interface DashboardAlertItem {
  key?: string | number;
  severity?: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  time?: string;
  chipText?: string;
}

export interface DashboardAlertWidgetParams extends DashboardWidgetParams {
  items?: DashboardAlertItem[];
  emptyText?: string;
}

export interface DashboardAlertWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardAlertWidget) => DashboardAlertItem[] | Promise<DashboardAlertItem[] | undefined> | undefined;
  onItemClicked?: (widget: DashboardAlertWidget, item: DashboardAlertItem, index: number) => void | Promise<void>;
}

export interface DashboardEmptyStateWidgetParams extends DashboardWidgetParams {
  titleText?: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  buttonText?: string;
  toneColor?: string;
}

export interface DashboardEmptyStateWidgetOptions extends DashboardWidgetOptions {
  buttonText?: (widget: DashboardEmptyStateWidget) => string | Promise<string | undefined> | undefined;
  onClicked?: (widget: DashboardEmptyStateWidget) => void | Promise<void>;
}

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

export interface DashboardStatGridWidgetParams extends DashboardWidgetParams {
  items?: DashboardStatGridItem[];
  columns?: number;
  emptyText?: string;
}

export interface DashboardStatGridWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardStatGridWidget) => DashboardStatGridItem[] | Promise<DashboardStatGridItem[] | undefined> | undefined;
  formatValue?: (widget: DashboardStatGridWidget, item: DashboardStatGridItem, index: number) => string;
  onItemClicked?: (widget: DashboardStatGridWidget, item: DashboardStatGridItem, index: number) => void | Promise<void>;
}

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

export interface DashboardMapWidgetParams extends DashboardWidgetParams {
  data?: DashboardMapData;
  emptyText?: string;
  mapHeight?: number | string;
  showLegend?: boolean;
}

export interface DashboardMapWidgetOptions extends DashboardWidgetOptions {
  data?: (widget: DashboardMapWidget) => DashboardMapData | Promise<DashboardMapData | undefined> | undefined;
  onMarkerClicked?: (widget: DashboardMapWidget, marker: DashboardMapMarker, index: number) => void | Promise<void>;
}

export interface DashboardCalendarItem {
  key?: string | number;
  date: string | Date;
  title: string;
  color?: string;
}

export interface DashboardCalendarWidgetParams extends DashboardWidgetParams {
  items?: DashboardCalendarItem[];
  year?: number;
  month?: number;
  emptyText?: string;
}

export interface DashboardCalendarWidgetOptions extends DashboardWidgetOptions {
  items?: (widget: DashboardCalendarWidget) => DashboardCalendarItem[] | Promise<DashboardCalendarItem[] | undefined> | undefined;
  onDateClicked?: (widget: DashboardCalendarWidget, date: Date, items: DashboardCalendarItem[]) => void | Promise<void>;
}

export interface DashboardTabItem {
  key?: string | number;
  label: string;
  badge?: string | number;
  children?: (widget: DashboardTabsWidget, props: any, context: any) => Array<UIBase | VNode>;
}

export interface DashboardTabsWidgetParams extends DashboardWidgetParams {
  tabs?: DashboardTabItem[];
  activeTab?: number;
  emptyText?: string;
}

export interface DashboardTabsWidgetOptions extends DashboardWidgetOptions {
  tabs?: (widget: DashboardTabsWidget) => DashboardTabItem[] | Promise<DashboardTabItem[] | undefined> | undefined;
  onTabChanged?: (widget: DashboardTabsWidget, tab: DashboardTabItem, index: number) => void | Promise<void>;
}

function asCssSize(value?: number | string) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

function normalizeClassValue(value?: string | string[]) {
  if (!value) {
    return [] as string[];
  }

  return Array.isArray(value) ? value : [value];
}

function isRenderableUIBase(item: any): item is UIBase {
  return item instanceof UIBase;
}

function defaultTextColorForTheme(theme: DashboardTheme) {
  return theme === 'dark' ? '#ffffff' : '#111827';
}

function describeDashboardMenuShortcut(item: MenuItem): string | undefined {
  return describeShortcut(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac })?.label;
}

function paletteColor(index: number) {
  return DASHBOARD_WIDGET_PALETTE[index % DASHBOARD_WIDGET_PALETTE.length];
}

function resolveOwnerTextColor(owner: any) {
  return owner?.$textColor || defaultTextColorForTheme('light');
}

function renderDashboardChild(owner: UIBase, child: UIBase | VNode) {
  if (isRenderableUIBase(child)) {
    child.setParent(owner);
    return owner.$h(child.component);
  }

  return child;
}


function ensureDashboardWidgetStyles() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('ve-dashboard-widget-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 've-dashboard-widget-styles';
  style.textContent = `
    .ve-dashboard-widget-card {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .ve-dashboard-widget-cardtext {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }

    .ve-dashboard-widget-shell {
      display: flex;
      flex-direction: column;
      min-height: 0;
      height: 100%;
    }

    .ve-dashboard-widget-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      scrollbar-width: none;
      scrollbar-color: transparent transparent;
    }

    .ve-dashboard-widget-scroll:hover {
      scrollbar-width: thin;
      scrollbar-color: var(--ve-dashboard-scrollbar-thumb-hover, rgba(148, 163, 184, 0.45)) transparent;
    }

    .ve-dashboard-widget-scroll::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    .ve-dashboard-widget-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .ve-dashboard-widget-scroll::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
      transition: background-color 160ms ease;
    }

    .ve-dashboard-widget-scroll:hover::-webkit-scrollbar-thumb {
      background: var(--ve-dashboard-scrollbar-thumb-hover, rgba(148, 163, 184, 0.45));
    }

    .ve-dashboard-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      min-width: 0;
    }

    .ve-dashboard-list-main {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .ve-dashboard-list-text {
      min-width: 0;
      flex: 1 1 auto;
    }

    .ve-dashboard-list-title {
      font-size: 1.05rem;
      font-weight: 500;
      line-height: 1.35;
      word-break: break-word;
    }

    .ve-dashboard-list-subtitle {
      opacity: 0.7;
      line-height: 1.35;
      word-break: break-word;
    }

    .ve-dashboard-list-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 0 0 auto;
      min-width: 0;
    }

    .ve-dashboard-list-value {
      font-size: 1.05rem;
      font-weight: 500;
      text-align: right;
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      .ve-dashboard-list-item {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
      }

      .ve-dashboard-list-main {
        width: 100%;
      }

      .ve-dashboard-list-meta {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-left: 50px;
        gap: 8px;
      }

      .ve-dashboard-list-value {
        white-space: normal;
      }
    }
  `;

  document.head.appendChild(style);
}

function renderDashboardWidgetShell(
  owner: UIBase,
  params: DashboardWidgetParams,
  body: VNode | VNode[],
  hasBody: boolean = true,
) {
  ensureDashboardWidgetStyles();

  const h = owner.$h;
  const headerNodes: VNode[] = [];
  const textColor = resolveOwnerTextColor(owner);
  const widgetHeight = asCssSize(params.height);
  const widgetMinHeight = asCssSize(params.minHeight);
  const widgetMaxHeight = asCssSize(params.maxHeight);
  const scrollbarThumb = owner && (owner as any).$theme === 'dark' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(71, 85, 105, 0.16)';
  const scrollbarThumbHover = owner && (owner as any).$theme === 'dark' ? 'rgba(148, 163, 184, 0.46)' : 'rgba(71, 85, 105, 0.34)';

  if (params.title || params.subtitle || params.icon) {
    headerNodes.push(
      h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: params.subtitle ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: hasBody ? '12px' : '0px',
            flexShrink: 0,
          },
        },
        [
          h('div', { style: { color: textColor } }, [
            ...(params.title ? [h(VCardTitle, { style: { padding: '0px', lineHeight: '1.2', color: textColor } }, () => params.title || '')] : []),
            ...(params.subtitle ? [h(VCardSubtitle, { style: { padding: '6px 0 0 0', color: textColor, opacity: 0.74 } }, () => params.subtitle || '')] : []),
          ]),
          ...(params.icon ? [
            h(VIcon, {
              icon: params.icon,
              color: params.iconColor || textColor,
              size: 28,
            })
          ] : []),
        ]
      )
    );
  }

  const shellStyle = {
    minHeight: widgetMinHeight,
    maxHeight: widgetMaxHeight,
    height: widgetHeight,
  };

  const scrollStyle = {
    color: textColor,
    ...(params.noCard ? { padding: '0px' } : {}),
    '--ve-dashboard-scrollbar-thumb': scrollbarThumb,
    '--ve-dashboard-scrollbar-thumb-hover': scrollbarThumbHover,
    ...(params.bodyStyle || {}),
  } as any;

  const contentNodes = Array.isArray(body) ? body : [body];
  const scrollNode = h('div', {
    class: ['ve-dashboard-widget-scroll'].concat(normalizeClassValue(params.bodyClass)),
    style: scrollStyle,
  }, contentNodes);

  const shellChildren = [...headerNodes, scrollNode];

  const inner = params.noCard
    ? h('div', { class: ['ve-dashboard-widget-shell'], style: shellStyle }, shellChildren)
    : h(
        VCard,
        {
          rounded: params.rounded,
          elevation: params.elevation,
          color: params.color,
          variant: params.variant,
          class: ['ve-dashboard-widget-card'].concat(normalizeClassValue(params.cardClass)),
          style: { color: textColor, ...shellStyle, ...(params.cardStyle || {}) },
        },
        () => h(VCardText, { class: ['ve-dashboard-widget-cardtext'], style: { minHeight: 0, height: '100%' } }, () => shellChildren)
      );

  return h(
    VCol,
    {
      cols: params.cols || 12,
      lg: params.lg,
      xs: params.xs,
      md: params.md,
      xl: params.xl,
      xxl: params.xxl,
      sm: params.sm,
    },
    () => inner,
  );
}

export class DashboardWidget extends UIBase {
  protected params: Ref<DashboardWidgetParams>;
  private options: DashboardWidgetOptions;
  private childInstances: Array<UIBase> = [];
  private static defaultParams: DashboardWidgetParams = {
    cols: 12,
    variant: 'outlined',
    elevation: 0,
    rounded: 'lg',
  };

  constructor(params?: DashboardWidgetParams, options?: DashboardWidgetOptions) {
    super();
    this.params = this.$makeRef({ ...DashboardWidget.defaultParams, ...(params || {}) });
    this.options = options || {};
    if (options?.master) this.setMaster(options.master);
  }

  static setDefault(value: DashboardWidgetParams, reset?: boolean): void {
    if (reset) {
      DashboardWidget.defaultParams = value;
    } else {
      DashboardWidget.defaultParams = { ...DashboardWidget.defaultParams, ...value };
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $params(): DashboardWidgetParams {
    return this.params.value;
  }

  get $theme(): DashboardTheme {
    if (this.params.value.theme) return this.params.value.theme;
    if (this.$parent && (this.$parent as any).$theme) return (this.$parent as any).$theme;
    return 'light';
  }

  get $textColor(): string {
    if (this.params.value.textColor) return this.params.value.textColor;
    return defaultTextColorForTheme(this.$theme);
  }

  get $readonly() {
    if (this.$parent && (this.$parent as any).$readonly !== undefined) return (this.$parent as any).$readonly;
    return false;
  }

  get $parentReport(): Report | undefined {
    return this.$parent ? (this.$parent as any).$parentReport : undefined;
  }

  setParams(params: DashboardWidgetParams) {
    this.params.value = { ...this.params.value, ...params };
  }

  topChildren(_props: any, _context: any): Array<UIBase | VNode> {
    return [];
  }

  children(_props: any, _context: any): Array<UIBase | VNode> {
    return [];
  }

  bottomChildren(_props: any, _context: any): Array<UIBase | VNode> {
    return [];
  }

  props() {
    return [];
  }

  render(props: any, context: any): VNode | undefined {
    if (this.params.value.invisible) {
      return;
    }

    const h = this.$h;
    const top = this.options.topChildren ? this.options.topChildren(this, props, context) : this.topChildren(props, context);
    const middle = this.options.children ? this.options.children(this, props, context) : this.children(props, context);
    const bottom = this.options.bottomChildren ? this.options.bottomChildren(this, props, context) : this.bottomChildren(props, context);
    const allChildren = [...top, ...middle, ...bottom];
    this.childInstances = allChildren.filter((item): item is UIBase => isRenderableUIBase(item));

    const content = h(
      VRow,
      {
        justify: this.params.value.justify,
        align: this.params.value.align,
        dense: this.params.value.dense,
        alignContent: this.params.value.alignContent,
      },
      () => allChildren.map((child) => renderDashboardChild(this, child))
    );

    return renderDashboardWidgetShell(this, this.params.value, content, allChildren.length > 0);
  }

  setup() {
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  async validate(): Promise<string | undefined> {
    for (const child of this.childInstances) {
      const value = await (child as any).validate?.();
      if (typeof value === 'string') return value;
    }
  }

  async forceCancel() {
    this.emit('cancel', this);
  }

  async refresh(): Promise<void> {
    for (const child of this.childInstances) {
      await (child as any).refresh?.();
    }
  }

  private handleOn(event: string, data?: any) {
    if (this.options.on) {
      const events = this.options.on(this);
      if (events[event]) {
        events[event](data);
      }
    }

    this.emit(event, data);
  }
}

export class DashboardMetricWidget extends DashboardWidget {
  private metricOptions: DashboardMetricWidgetOptions;
  private resolvedValue: Ref<string | number | undefined>;
  private animatedValue: Ref<number | undefined>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;
  private animationFrame?: number;

  constructor(params?: DashboardMetricWidgetParams, options?: DashboardMetricWidgetOptions) {
    super(params, options);
    this.metricOptions = options || {};
    this.resolvedValue = this.$makeRef(undefined);
    this.animatedValue = this.$makeRef(undefined);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $metricParams(): DashboardMetricWidgetParams {
    return this.$params as DashboardMetricWidgetParams;
  }

  private resolveRawValue() {
    if (this.metricOptions.value !== undefined) {
      return this.metricOptions.value;
    }

    return this.$metricParams.value;
  }

  private normalizeDisplayNumber(value: number) {
    return Number.isInteger(value) ? Math.round(value) : Number(value.toFixed(2));
  }

  private startValueAnimation(nextValue: number) {
    if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
      this.animatedValue.value = nextValue;
      return;
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }

    const startValue = typeof this.animatedValue.value === 'number' ? this.animatedValue.value : 0;
    const delta = nextValue - startValue;
    const duration = 550;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.animatedValue.value = this.normalizeDisplayNumber(startValue + (delta * eased));

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        this.animatedValue.value = nextValue;
        this.animationFrame = undefined;
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  private async loadResolvedValue(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    const source = this.resolveRawValue();
    if (typeof source !== 'function') {
      this.resolvedValue.value = source;
      this.loaded.value = true;
      if (typeof source === 'number') {
        this.startValueAnimation(source);
      } else {
        this.animatedValue.value = undefined;
      }
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(source(this)).then((value) => {
      this.resolvedValue.value = value;
      this.loaded.value = true;
      if (typeof value === 'number') {
        this.startValueAnimation(value);
      } else {
        this.animatedValue.value = undefined;
      }
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedValue();
  }

  private currentRenderedValue() {
    if (typeof this.resolvedValue.value === 'number') {
      return this.animatedValue.value ?? this.resolvedValue.value;
    }

    return this.resolvedValue.value;
  }

  private formattedValue() {
    const currentValue = this.currentRenderedValue();
    if (this.metricOptions.formatValue) {
      return this.metricOptions.formatValue(this, currentValue);
    }

    if (currentValue === undefined || currentValue === null) {
      return '';
    }

    return String(currentValue);
  }

  private async onClicked() {
    if (this.metricOptions.onClicked) {
      await this.metricOptions.onClicked(this);
    }

    this.emit('clicked', { widget: this, value: this.resolvedValue.value });
  }

  render(): VNode | undefined {
    if (this.$metricParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body = h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6px',
        ...(this.metricOptions.onClicked ? { cursor: 'pointer' } : {}),
      },
      onClick: () => {
        void this.onClicked();
      },
    }, [
      h('div', {
        style: {
          fontSize: '1.75rem',
          fontWeight: 700,
          lineHeight: '1.1',
          color: this.$metricParams.valueColor,
        },
      }, this.formattedValue()),
      ...(this.$metricParams.caption ? [
        h('div', {
          class: ['text-body-2'],
          style: { opacity: 0.74, color: this.$metricParams.captionColor },
        }, this.$metricParams.caption)
      ] : []),
    ]);

    return renderDashboardWidgetShell(this, this.$metricParams, body, true);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animatedValue.value = undefined;
    await this.loadResolvedValue(true);
    await super.refresh();
  }

  destructor() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    super.destructor();
  }
}

export class DashboardTableWidget extends DashboardWidget {
  private tableOptions: DashboardTableWidgetOptions;
  private resolvedHeaders: Ref<DashboardTableColumn[]>;
  private resolvedItems: Ref<any[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private search: Ref<string>;
  private currentPage: Ref<number>;
  private totalItems: Ref<number>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardTableWidgetParams, options?: DashboardTableWidgetOptions) {
    super(params, options);
    this.tableOptions = options || {};
    this.resolvedHeaders = this.$makeRef([]);
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
    this.search = this.$makeRef('');
    this.currentPage = this.$makeRef(Math.max(1, Number(this.$tableParams.page || 1)));
    this.totalItems = this.$makeRef(0);
  }

  get $tableParams(): DashboardTableWidgetParams {
    return this.$params as DashboardTableWidgetParams;
  }

  private pageSize() {
    return Math.max(1, Number(this.$tableParams.pageSize || 5));
  }

  private usesPagedLoader() {
    return typeof this.tableOptions.loadPage === 'function';
  }

  private shouldPaginate() {
    return this.$tableParams.pagination === true;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    const paramHeaders = this.$tableParams.headers || [];
    const paramItems = this.$tableParams.items || [];

    if (this.usesPagedLoader()) {
      this.loading.value = true;
      this.currentLoad = Promise.resolve(this.tableOptions.loadPage?.(this, {
        page: this.currentPage.value,
        pageSize: this.pageSize(),
        search: (this.search.value || '').trim(),
      })).then((result) => {
        this.resolvedHeaders.value = result?.headers || paramHeaders;
        this.resolvedItems.value = result?.items || [];
        this.totalItems.value = Math.max(0, Number(result?.total ?? this.resolvedItems.value.length));
        this.loaded.value = true;
      }).finally(() => {
        this.loading.value = false;
        this.currentLoad = undefined;
      });

      await this.currentLoad;
      return;
    }

    if (!this.tableOptions.headers && !this.tableOptions.items) {
      this.resolvedHeaders.value = paramHeaders;
      this.resolvedItems.value = paramItems;
      this.totalItems.value = paramItems.length;
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.all([
      Promise.resolve(this.tableOptions.headers ? this.tableOptions.headers(this) : paramHeaders),
      Promise.resolve(this.tableOptions.items ? this.tableOptions.items(this) : paramItems),
    ]).then(([headers, items]) => {
      this.resolvedHeaders.value = headers || [];
      this.resolvedItems.value = items || [];
      this.totalItems.value = this.resolvedItems.value.length;
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private filteredItems() {
    const rawItems = this.resolvedItems.value || [];
    const term = (this.search.value || '').trim().toLowerCase();
    if (!term || this.usesPagedLoader()) {
      return rawItems;
    }

    return rawItems.filter((row: any) => {
      return this.resolvedHeaders.value.some((column) => String(row?.[column.key] ?? '').toLowerCase().includes(term));
    });
  }

  private totalPages(totalCount: number) {
    return Math.max(1, Math.ceil(totalCount / this.pageSize()));
  }

  private visibleItems() {
    const items = this.filteredItems();
    if (!this.shouldPaginate() || this.usesPagedLoader()) {
      return items;
    }

    const totalPages = this.totalPages(items.length);
    if (this.currentPage.value > totalPages) {
      this.currentPage.value = totalPages;
    }

    const start = (this.currentPage.value - 1) * this.pageSize();
    return items.slice(start, start + this.pageSize());
  }

  private visibleTotalCount() {
    if (this.usesPagedLoader()) {
      return this.totalItems.value;
    }

    return this.filteredItems().length;
  }

  private dividerColor() {
    return this.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(17, 24, 39, 0.12)';
  }

  private async goToPage(page: number) {
    const nextPage = Math.max(1, page);
    if (nextPage === this.currentPage.value) {
      return;
    }

    this.currentPage.value = nextPage;
    if (this.usesPagedLoader()) {
      this.loaded.value = false;
      await this.loadResolvedData(true);
    }
  }

  private async updateSearch(value: any) {
    this.search.value = value || '';
    this.currentPage.value = 1;

    if (this.usesPagedLoader()) {
      this.loaded.value = false;
      await this.loadResolvedData(true);
    }
  }

  private rowClassValue(row: any, index: number) {
    const value = this.tableOptions.rowClass?.(this, row, index);
    if (!value) {
      return [] as string[];
    }

    return Array.isArray(value) ? value : [value];
  }

  private rowStyleValue(row: any, index: number) {
    const clickable = typeof this.tableOptions.onRowClick === 'function';
    return {
      ...(clickable ? { cursor: 'pointer' } : {}),
      ...(this.tableOptions.rowStyle?.(this, row, index) || {}),
    };
  }

  private async onRowClicked(row: any, index: number) {
    if (this.tableOptions.onRowClick) {
      await this.tableOptions.onRowClick(this, row, index);
    }

    this.emit('rowClicked', { widget: this, row, index });
  }

  render(): VNode | undefined {
    if (this.$tableParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const headers = this.resolvedHeaders.value || [];
    const items = this.visibleItems();
    const totalCount = this.visibleTotalCount();
    const dividerColor = this.dividerColor();
    const paginationEnabled = this.shouldPaginate();
    const totalPages = paginationEnabled ? this.totalPages(totalCount) : 1;
    const pageStart = totalCount > 0 ? ((this.currentPage.value - 1) * this.pageSize()) + 1 : 0;
    const pageEnd = totalCount > 0 ? Math.min(pageStart + items.length - 1, totalCount) : 0;

    const body: VNode[] = [];
    if (this.$tableParams.showSearch !== false) {
      body.push(
        h(VTextField, {
          baseColor: this.$textColor,
          color: this.$textColor,
          modelValue: this.search.value,
          placeholder: this.$tableParams.searchPlaceholder || 'Search',
          prependInnerIcon: 'mdi-magnify',
          hideDetails: true,
          density: 'comfortable',
          variant: 'outlined',
          style: { marginBottom: '10px' },
          'onUpdate:modelValue': (value: any) => {
            void this.updateSearch(value);
          },
        })
      );
    }

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!items.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$tableParams.emptyText || 'No rows to display.'));
    } else {
      body.push(
        h(VTable, { density: 'comfortable', class: ['bg-transparent'], style: { background: 'transparent', color: this.$textColor } }, {
          default: () => [
            h('thead', [
              h('tr', { style: { borderBottom: `1px solid ${dividerColor}` } }, headers.map((column) => h('th', {
                style: {
                  textAlign: column.align === 'end' ? 'right' : (column.align === 'center' ? 'center' : 'left'),
                  width: asCssSize(column.width),
                  color: this.$textColor,
                  borderBottom: `1px solid ${dividerColor}`,
                },
              }, column.title))),
            ]),
            h('tbody', items.map((row: any, index: number) => h('tr', {
              key: row?.key || `${this.currentPage.value}-${index}`,
              class: this.rowClassValue(row, index),
              style: { borderBottom: `1px solid ${dividerColor}`, ...this.rowStyleValue(row, index) },
              onClick: () => {
                void this.onRowClicked(row, index);
              },
            }, headers.map((column) => {
              const rendered = this.tableOptions.cell?.(this, row, column, index);
              return h('td', {
                style: {
                  textAlign: column.align === 'end' ? 'right' : (column.align === 'center' ? 'center' : 'left'),
                  color: this.$textColor,
                  borderBottom: `1px solid ${dividerColor}`,
                },
              }, rendered === undefined ? String(row?.[column.key] ?? '') : rendered as any);
            })))),
          ],
        })
      );
    }

    if (paginationEnabled) {
      body.push(
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginTop: '12px',
          },
        }, [
          h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, totalCount > 0 ? `${pageStart}-${pageEnd} of ${totalCount}` : '0 items'),
          h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            h(VBtn, {
              variant: 'text',
              size: 'small',
              color: this.$textColor,
              disabled: this.currentPage.value <= 1 || this.loading.value,
              onClick: () => {
                void this.goToPage(this.currentPage.value - 1);
              },
            }, () => 'Prev'),
            h('div', { class: ['text-body-2'], style: { minWidth: '68px', textAlign: 'center', opacity: 0.78 } }, `Page ${Math.min(this.currentPage.value, totalPages)} / ${totalPages}`),
            h(VBtn, {
              variant: 'text',
              size: 'small',
              color: this.$textColor,
              disabled: this.currentPage.value >= totalPages || this.loading.value,
              onClick: () => {
                void this.goToPage(this.currentPage.value + 1);
              },
            }, () => 'Next'),
          ]),
        ])
      );
    }

    return renderDashboardWidgetShell(this, this.$tableParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardListWidget extends DashboardWidget {
  private listOptions: DashboardListWidgetOptions;
  private resolvedItems: Ref<DashboardListItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardListWidgetParams, options?: DashboardListWidgetOptions) {
    super(params, options);
    this.listOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $listParams(): DashboardListWidgetParams {
    return this.$params as DashboardListWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.listOptions.items) {
      this.resolvedItems.value = this.$listParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.listOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private renderLeading(item: DashboardListItem) {
    const h = this.$h;
    if (item.icon) {
      return h(VAvatar, { color: item.avatarColor || 'primary', rounded: 'lg', size: 36, variant: 'tonal' }, () => h(VIcon, { icon: item.icon, color: item.iconColor }));
    }

    return h(VAvatar, { color: item.avatarColor || 'primary', rounded: 'lg', size: 36 }, () => item.avatarText || item.title.charAt(0));
  }

  private dividerColor() {
    return this.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(17, 24, 39, 0.12)';
  }

  private async onItemClicked(item: DashboardListItem, index: number) {
    if (this.listOptions.onItemClicked) {
      await this.listOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  render(): VNode | undefined {
    if (this.$listParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];
    const dividerColor = this.dividerColor();
    const showSeparator = this.$listParams.separator === true;

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$listParams.emptyText || 'No items to display.'));
    } else {
      body.push(...this.resolvedItems.value.map((item, index) => h('div', {
        key: item.key || index,
        class: ['ve-dashboard-list-item'],
        style: {
          borderBottom: showSeparator ? `1px solid ${dividerColor}` : undefined,
          ...(this.listOptions.onItemClicked ? { cursor: 'pointer' } : {}),
        },
        onClick: () => {
          void this.onItemClicked(item, index);
        },
      }, [
        h('div', { class: ['ve-dashboard-list-main'] }, [
          this.renderLeading(item),
          h('div', { class: ['ve-dashboard-list-text'] }, [
            h('div', { class: ['ve-dashboard-list-title'] }, item.title),
            ...(item.subtitle ? [h('div', { class: ['ve-dashboard-list-subtitle'] }, item.subtitle)] : []),
          ]),
        ]),
        h('div', { class: ['ve-dashboard-list-meta'] }, [
          ...(item.chipText ? [h(VChip, { size: 'small', color: item.chipColor, variant: item.chipVariant || 'outlined' }, () => item.chipText)] : []),
          ...(item.value ? [h('div', { class: ['ve-dashboard-list-value'], style: { color: item.valueColor } }, item.value)] : []),
        ]),
      ])));
    }

    return renderDashboardWidgetShell(this, this.$listParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardProgressWidget extends DashboardWidget {
  private progressOptions: DashboardProgressWidgetOptions;
  private resolvedItems: Ref<DashboardProgressItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private animatedAmounts: Ref<number[]>;
  private hasAnimatedInitialLoad: boolean;
  private animationFrame?: number;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardProgressWidgetParams, options?: DashboardProgressWidgetOptions) {
    super(params, options);
    this.progressOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
    this.animatedAmounts = this.$makeRef([]);
    this.hasAnimatedInitialLoad = false;
  }

  get $progressParams(): DashboardProgressWidgetParams {
    return this.$params as DashboardProgressWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.progressOptions.items) {
      this.resolvedItems.value = this.$progressParams.items || [];
      this.loaded.value = true;
      this.startInitialAnimation();
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.progressOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
      this.startInitialAnimation();
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private syncAnimatedAmounts() {
    this.animatedAmounts.value = this.resolvedItems.value.map((item) => this.normalizedAmount(item.amount));
  }

  private startInitialAnimation() {
    if (this.hasAnimatedInitialLoad || !this.resolvedItems.value.length) {
      this.syncAnimatedAmounts();
      return;
    }

    if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
      this.hasAnimatedInitialLoad = true;
      this.syncAnimatedAmounts();
      return;
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }

    this.hasAnimatedInitialLoad = true;
    const targets = this.resolvedItems.value.map((item) => this.normalizedAmount(item.amount));
    this.animatedAmounts.value = targets.map(() => 0);
    const duration = 550;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.animatedAmounts.value = targets.map((target) => target * eased);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        this.animatedAmounts.value = targets;
        this.animationFrame = undefined;
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  private normalizedAmount(amount: number) {
    const numeric = Number(amount || 0);
    if (Number.isNaN(numeric)) {
      return 0;
    }

    if (numeric <= 1) {
      return Math.max(0, Math.min(100, numeric * 100));
    }

    return Math.max(0, Math.min(100, numeric));
  }

  private renderLeading(item: DashboardProgressItem) {
    const h = this.$h;
    if (item.icon) {
      return h(VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', size: 40 }, () => h(VIcon, { icon: item.icon, color: item.iconColor }));
    }

    return h(VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', size: 40 }, () => item.avatarText || item.label.charAt(0));
  }

  private async onItemClicked(item: DashboardProgressItem, index: number) {
    if (this.progressOptions.onItemClicked) {
      await this.progressOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  render(): VNode | undefined {
    if (this.$progressParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$progressParams.emptyText || 'No summary items to display.'));
    } else {
      body.push(...this.resolvedItems.value.map((item, index) => h('div', {
        key: item.key || index,
        style: {
          display: 'flex',
          gap: '16px',
          padding: '14px 0',
          ...(this.progressOptions.onItemClicked ? { cursor: 'pointer' } : {}),
        },
        onClick: () => {
          void this.onItemClicked(item, index);
        },
      }, [
        this.renderLeading(item),
        h('div', { style: { flex: 1 } }, [
          h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' } }, [
            h('span', { style: { fontSize: '1.05rem' } }, item.label),
            ...(item.value ? [h('span', { style: { opacity: 0.78 } }, item.value)] : []),
          ]),
          h(VProgressLinear, {
            modelValue: this.animatedAmounts.value[index] ?? this.normalizedAmount(item.amount),
            color: item.color || 'primary',
            rounded: true,
            height: 8,
            bgColor: item.bgColor || 'grey-darken-1',
          }),
        ]),
      ])));
    }

    return renderDashboardWidgetShell(this, this.$progressParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    this.hasAnimatedInitialLoad = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animatedAmounts.value = [];
    await this.loadResolvedData(true);
    await super.refresh();
  }

  destructor() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    super.destructor();
  }
}


export class DashboardChartWidget extends DashboardWidget {
  private chartOptions: DashboardChartWidgetOptions;
  private resolvedItems: Ref<DashboardChartItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardChartWidgetParams, options?: DashboardChartWidgetOptions) {
    super(params, options);
    this.chartOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $chartParams(): DashboardChartWidgetParams {
    return this.$params as DashboardChartWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.chartOptions.items) {
      this.resolvedItems.value = this.$chartParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.chartOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private itemsWithColor() {
    return (this.resolvedItems.value || []).map((item, index) => ({
      ...item,
      color: item.color || paletteColor(index),
    }));
  }

  private chartHeight() {
    return asCssSize(this.$chartParams.chartHeight || 220) || '220px';
  }

  private maxValue(items: DashboardChartItem[]) {
    return Math.max(1, ...items.map((item) => Number(item.value || 0)));
  }

  private async onItemClicked(item: DashboardChartItem, index: number) {
    if (this.chartOptions.onItemClicked) {
      await this.chartOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  private renderLegend(items: DashboardChartItem[]) {
    if (this.$chartParams.showLegend === false || !items.length) {
      return [] as VNode[];
    }

    const h = this.$h;
    const clickable = typeof this.chartOptions.onItemClicked === 'function';
    return items.map((item, index) => h('div', {
      key: item.key || item.label || index,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '6px 0',
        ...(clickable ? { cursor: 'pointer' } : {}),
      },
      onClick: () => {
        void this.onItemClicked(item, index);
      },
    }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 } }, [
        h('span', {
          style: {
            width: '10px',
            height: '10px',
            borderRadius: '999px',
            background: item.color,
            display: 'inline-block',
            flexShrink: 0,
          },
        }),
        h('span', { style: { minWidth: 0 } }, item.label),
      ]),
      h('span', { style: { opacity: 0.78, flexShrink: 0 } }, item.valueLabel || item.value.toLocaleString()),
    ]));
  }

  private renderBarChart(items: DashboardChartItem[]) {
    const h = this.$h;
    const width = 360;
    const height = 220;
    const baseY = 180;
    const chartHeight = 140;
    const barWidth = Math.max(18, Math.floor(220 / Math.max(items.length, 1)));
    const gap = 18;
    const maxValue = this.maxValue(items);
    const left = 28;
    const clickable = typeof this.chartOptions.onItemClicked === 'function';

    return h('svg', {
      viewBox: `0 0 ${width} ${height}`,
      style: { width: '100%', height: this.chartHeight(), overflow: 'visible' },
    }, [
      h('line', { x1: left, y1: baseY, x2: width - 18, y2: baseY, stroke: this.$theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(17,24,39,0.14)', 'stroke-width': 1 }),
      ...items.reduce<VNode[]>((nodes, item: DashboardChartItem, index: number) => {
        const numeric = Number(item.value || 0);
        const barHeight = Math.max(8, (numeric / maxValue) * chartHeight);
        const x = left + (index * (barWidth + gap));
        const y = baseY - barHeight;
        nodes.push(
          h('rect', {
            key: `${item.key || item.label || index}-bar`,
            x,
            y,
            rx: 8,
            ry: 8,
            width: barWidth,
            height: barHeight,
            fill: item.color,
            style: clickable ? { cursor: 'pointer' } : undefined,
            onClick: () => {
              void this.onItemClicked(item, index);
            },
          }),
          h('text', {
            x: x + (barWidth / 2),
            y: baseY + 18,
            'text-anchor': 'middle',
            fill: this.$textColor,
            style: { fontSize: '11px', opacity: 0.8 },
          }, item.label),
          h('text', {
            x: x + (barWidth / 2),
            y: y - 8,
            'text-anchor': 'middle',
            fill: this.$textColor,
            style: { fontSize: '11px', opacity: 0.72 },
          }, item.valueLabel || String(item.value)),
        );
        return nodes;
      }, []),
    ]);
  }

  private renderLineChart(items: DashboardChartItem[]) {
    const h = this.$h;
    const width = 360;
    const height = 220;
    const left = 20;
    const top = 20;
    const right = 20;
    const bottom = 36;
    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;
    const maxValue = this.maxValue(items);
    const clickable = typeof this.chartOptions.onItemClicked === 'function';
    const points = items.map((item, index) => {
      const x = left + (items.length === 1 ? chartWidth / 2 : (index * chartWidth) / (items.length - 1));
      const y = top + chartHeight - ((Number(item.value || 0) / maxValue) * chartHeight);
      return { x, y, item, index };
    });

    return h('svg', {
      viewBox: `0 0 ${width} ${height}`,
      style: { width: '100%', height: this.chartHeight(), overflow: 'visible' },
    }, [
      h('line', { x1: left, y1: top + chartHeight, x2: width - right, y2: top + chartHeight, stroke: this.$theme === 'dark' ? 'rgba(255,255,255,0.18)' : 'rgba(17,24,39,0.14)', 'stroke-width': 1 }),
      h('polyline', {
        points: points.map((point) => `${point.x},${point.y}`).join(' '),
        fill: 'none',
        stroke: items[0]?.color || paletteColor(0),
        'stroke-width': 3,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
      ...points.reduce<VNode[]>((nodes, point: { x: number; y: number; item: DashboardChartItem; index: number }) => {
        nodes.push(
          h('circle', {
            key: `${point.item.key || point.item.label || point.index}-dot`,
            cx: point.x,
            cy: point.y,
            r: 5,
            fill: point.item.color,
            stroke: this.$theme === 'dark' ? '#111827' : '#ffffff',
            'stroke-width': 2,
            style: clickable ? { cursor: 'pointer' } : undefined,
            onClick: () => {
              void this.onItemClicked(point.item, point.index);
            },
          }),
          h('text', {
            x: point.x,
            y: top + chartHeight + 18,
            'text-anchor': 'middle',
            fill: this.$textColor,
            style: { fontSize: '11px', opacity: 0.8 },
          }, point.item.label),
        );
        return nodes;
      }, []),
    ]);
  }

  private renderDonutChart(items: DashboardChartItem[]) {
    const h = this.$h;
    const total = Math.max(0, items.reduce((sum, item) => sum + Number(item.value || 0), 0));
    if (!total) {
      return h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'No chart values to display.');
    }

    let offset = 0;
    const gradient = items.map((item) => {
      const share = (Number(item.value || 0) / total) * 100;
      const start = offset;
      offset += share;
      return `${item.color} ${start}% ${offset}%`;
    }).join(', ');

    return h('div', {
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: this.chartHeight(),
      },
    }, [
      h('div', {
        style: {
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: `conic-gradient(${gradient})`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }, [
        h('div', {
          style: {
            width: '132px',
            height: '132px',
            borderRadius: '50%',
            background: this.$theme === 'dark' ? 'rgba(15, 23, 42, 0.92)' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: this.$theme === 'dark' ? '0 8px 24px rgba(0,0,0,0.22)' : '0 8px 24px rgba(15,23,42,0.08)',
          },
        }, [
          h('div', { style: { fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.1 } }, total.toLocaleString()),
          h('div', { style: { opacity: 0.7, fontSize: '0.9rem' } }, 'Total'),
        ]),
      ]),
    ]);
  }

  render(): VNode | undefined {
    if (this.$chartParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const items = this.itemsWithColor();
    const body: VNode[] = [];

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!items.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$chartParams.emptyText || 'No chart data to display.'));
    } else {
      const type = this.$chartParams.chartType || 'bar';
      body.push(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } }, [
        type === 'line' ? this.renderLineChart(items) : (type === 'donut' ? this.renderDonutChart(items) : this.renderBarChart(items)),
        h('div', { style: { display: 'grid', gap: '4px' } }, this.renderLegend(items)),
      ]));
    }

    return renderDashboardWidgetShell(this, this.$chartParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardTrendWidget extends DashboardWidget {
  private trendOptions: DashboardTrendWidgetOptions;
  private resolvedValue: Ref<string | number | undefined>;
  private resolvedDelta: Ref<string | undefined>;
  private resolvedSparkline: Ref<number[]>;
  private animatedValue: Ref<number | undefined>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;
  private animationFrame?: number;

  constructor(params?: DashboardTrendWidgetParams, options?: DashboardTrendWidgetOptions) {
    super(params, options);
    this.trendOptions = options || {};
    this.resolvedValue = this.$makeRef(undefined);
    this.resolvedDelta = this.$makeRef(undefined);
    this.resolvedSparkline = this.$makeRef([]);
    this.animatedValue = this.$makeRef(undefined);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $trendParams(): DashboardTrendWidgetParams {
    return this.$params as DashboardTrendWidgetParams;
  }

  private normalizeDisplayNumber(value: number) {
    return Number.isInteger(value) ? Math.round(value) : Number(value.toFixed(2));
  }

  private startValueAnimation(nextValue: number) {
    if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
      this.animatedValue.value = nextValue;
      return;
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }

    const startValue = typeof this.animatedValue.value === 'number' ? this.animatedValue.value : 0;
    const delta = nextValue - startValue;
    const duration = 550;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.animatedValue.value = this.normalizeDisplayNumber(startValue + (delta * eased));

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      } else {
        this.animatedValue.value = nextValue;
        this.animationFrame = undefined;
      }
    };

    this.animationFrame = requestAnimationFrame(step);
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    const valueSource = this.trendOptions.value !== undefined ? this.trendOptions.value : this.$trendParams.value;
    const deltaSource = this.trendOptions.delta !== undefined ? this.trendOptions.delta : this.$trendParams.delta;
    const sparklineSource = this.trendOptions.sparklineValues !== undefined ? this.trendOptions.sparklineValues : this.$trendParams.sparklineValues;

    this.loading.value = true;
    this.currentLoad = Promise.all([
      Promise.resolve(typeof valueSource === 'function' ? valueSource(this) : valueSource),
      Promise.resolve(typeof deltaSource === 'function' ? deltaSource(this) : deltaSource),
      Promise.resolve(typeof sparklineSource === 'function' ? sparklineSource(this) : sparklineSource),
    ]).then(([value, delta, sparkline]) => {
      this.resolvedValue.value = value;
      this.resolvedDelta.value = delta;
      this.resolvedSparkline.value = sparkline || [];
      this.loaded.value = true;
      if (typeof value === 'number') {
        this.startValueAnimation(value);
      } else {
        this.animatedValue.value = undefined;
      }
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private currentRenderedValue() {
    if (typeof this.resolvedValue.value === 'number') {
      return this.animatedValue.value ?? this.resolvedValue.value;
    }

    return this.resolvedValue.value;
  }

  private formattedValue() {
    const currentValue = this.currentRenderedValue();
    if (this.trendOptions.formatValue) {
      return this.trendOptions.formatValue(this, currentValue);
    }

    if (currentValue === undefined || currentValue === null) {
      return '';
    }

    return String(currentValue);
  }

  private trendColor() {
    if (this.$trendParams.deltaColor) {
      return this.$trendParams.deltaColor;
    }

    if (this.$trendParams.trend === 'down') {
      return '#ef4444';
    }

    if (this.$trendParams.trend === 'flat') {
      return '#94a3b8';
    }

    return '#10b981';
  }

  private trendIcon() {
    if (this.$trendParams.trend === 'down') {
      return 'mdi-trending-down';
    }

    if (this.$trendParams.trend === 'flat') {
      return 'mdi-trending-neutral';
    }

    return 'mdi-trending-up';
  }

  private renderSparkline() {
    const values = this.resolvedSparkline.value || [];
    if (!values.length) {
      return undefined;
    }

    const h = this.$h;
    const width = 320;
    const height = 72;
    const max = Math.max(1, ...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);
    const points = values.map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index * width) / (values.length - 1);
      const y = 12 + ((max - value) / range) * (height - 24);
      return `${x},${y}`;
    }).join(' ');

    return h('svg', {
      viewBox: `0 0 ${width} ${height}`,
      style: { width: '100%', height: '72px', overflow: 'visible' },
    }, [
      h('polyline', {
        points,
        fill: 'none',
        stroke: this.$trendParams.sparklineColor || '#3b82f6',
        'stroke-width': 3,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      }),
    ]);
  }

  private async onClicked() {
    if (this.trendOptions.onClicked) {
      await this.trendOptions.onClicked(this);
    }

    this.emit('clicked', { widget: this, value: this.resolvedValue.value, delta: this.resolvedDelta.value });
  }

  render(): VNode | undefined {
    if (this.$trendParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const clickable = typeof this.trendOptions.onClicked === 'function';
    const sparkline = this.renderSparkline();
    const body = h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...(clickable ? { cursor: 'pointer' } : {}),
      },
      onClick: () => {
        void this.onClicked();
      },
    }, [
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' } }, [
        h('div', {
          style: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.1,
            color: this.$trendParams.valueColor,
          },
        }, this.formattedValue()),
        ...(this.resolvedDelta.value ? [h(VChip, {
          color: this.trendColor(),
          variant: 'tonal',
          prependIcon: this.trendIcon(),
          size: 'small',
        }, () => this.resolvedDelta.value)] : []),
      ]),
      ...(this.$trendParams.caption ? [h('div', { class: ['text-body-2'], style: { opacity: 0.74 } }, this.$trendParams.caption)] : []),
      ...(sparkline ? [sparkline] : []),
    ]);

    return renderDashboardWidgetShell(this, this.$trendParams, body, true);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    this.animatedValue.value = undefined;
    await this.loadResolvedData(true);
    await super.refresh();
  }

  destructor() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
    super.destructor();
  }
}

export class DashboardTimelineWidget extends DashboardWidget {
  private timelineOptions: DashboardTimelineWidgetOptions;
  private resolvedItems: Ref<DashboardTimelineItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardTimelineWidgetParams, options?: DashboardTimelineWidgetOptions) {
    super(params, options);
    this.timelineOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $timelineParams(): DashboardTimelineWidgetParams {
    return this.$params as DashboardTimelineWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.timelineOptions.items) {
      this.resolvedItems.value = this.$timelineParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.timelineOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private async onItemClicked(item: DashboardTimelineItem, index: number) {
    if (this.timelineOptions.onItemClicked) {
      await this.timelineOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  private renderLeading(item: DashboardTimelineItem) {
    const h = this.$h;
    if (item.icon) {
      return h(VAvatar, { color: item.avatarColor || item.color || 'primary', variant: 'tonal', size: 34 }, () => h(VIcon, { icon: item.icon, color: item.iconColor }));
    }

    return h(VAvatar, { color: item.avatarColor || item.color || 'primary', variant: 'tonal', size: 34 }, () => item.avatarText || item.title.charAt(0));
  }

  render(): VNode | undefined {
    if (this.$timelineParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const clickable = typeof this.timelineOptions.onItemClicked === 'function';
    const body: VNode[] = [];

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$timelineParams.emptyText || 'No activity to display.'));
    } else {
      body.push(h('div', { style: { display: 'flex', flexDirection: 'column' } }, this.resolvedItems.value.map((item, index) => h('div', {
        key: item.key || index,
        style: {
          display: 'grid',
          gridTemplateColumns: '44px 1fr',
          gap: '14px',
          paddingBottom: index === this.resolvedItems.value.length - 1 ? '0px' : '18px',
          ...(clickable ? { cursor: 'pointer' } : {}),
        },
        onClick: () => {
          void this.onItemClicked(item, index);
        },
      }, [
        h('div', { style: { position: 'relative', display: 'flex', justifyContent: 'center' } }, [
          ...(index < this.resolvedItems.value.length - 1 ? [h('span', {
            style: {
              position: 'absolute',
              top: '36px',
              bottom: '-18px',
              width: '2px',
              background: this.$theme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(17,24,39,0.12)',
            },
          })] : []),
          this.renderLeading(item),
        ]),
        h('div', { style: { paddingTop: '4px' } }, [
          h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' } }, [
            h('div', { style: { fontSize: '1.02rem', fontWeight: 600 } }, item.title),
            ...(item.time ? [h('span', { style: { opacity: 0.66, fontSize: '0.9rem' } }, item.time)] : []),
          ]),
          ...(item.subtitle ? [h('div', { style: { opacity: 0.78, marginTop: '4px' } }, item.subtitle)] : []),
          ...(item.description ? [h('div', { class: ['text-body-2'], style: { opacity: 0.68, marginTop: '6px' } }, item.description)] : []),
        ]),
      ]))));
    }

    return renderDashboardWidgetShell(this, this.$timelineParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardActionListWidget extends DashboardWidget {
  private actionOptions: DashboardActionListWidgetOptions;
  private resolvedItems: Ref<DashboardActionItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardActionListWidgetParams, options?: DashboardActionListWidgetOptions) {
    super(params, options);
    this.actionOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $actionParams(): DashboardActionListWidgetParams {
    return this.$params as DashboardActionListWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.actionOptions.items) {
      this.resolvedItems.value = this.$actionParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.actionOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private renderLeading(item: DashboardActionItem) {
    const h = this.$h;
    if (item.icon) {
      return h(VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', rounded: 'lg', size: 38 }, () => h(VIcon, { icon: item.icon, color: item.iconColor }));
    }

    return h(VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', rounded: 'lg', size: 38 }, () => item.avatarText || item.title.charAt(0));
  }

  private async onItemClicked(item: DashboardActionItem, index: number) {
    if (item.disabled) {
      return;
    }

    if (this.actionOptions.onItemClicked) {
      await this.actionOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  render(): VNode | undefined {
    if (this.$actionParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];
    const clickable = typeof this.actionOptions.onItemClicked === 'function';

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$actionParams.emptyText || 'No actions available.'));
    } else {
      body.push(...this.resolvedItems.value.map((item, index) => h('div', {
        key: item.key || index,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          padding: '12px 0',
          borderBottom: index === this.resolvedItems.value.length - 1 ? undefined : (this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(17,24,39,0.1)'),
          opacity: item.disabled ? 0.55 : 1,
          ...(clickable ? { cursor: item.disabled ? 'default' : 'pointer' } : {}),
        },
        onClick: () => {
          if (item.actionText) {
            return;
          }
          void this.onItemClicked(item, index);
        },
      }, [
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 } }, [
          this.renderLeading(item),
          h('div', { style: { minWidth: 0 } }, [
            h('div', { style: { fontSize: '1.02rem', fontWeight: 600 } }, item.title),
            ...(item.subtitle ? [h('div', { style: { opacity: 0.72, marginTop: '4px' } }, item.subtitle)] : []),
            ...(item.chipText ? [h(VChip, { size: 'x-small', color: item.chipColor, variant: 'outlined', style: { marginTop: '8px' } }, () => item.chipText)] : []),
          ]),
        ]),
        ...(item.actionText ? [h(VBtn, {
          size: 'small',
          variant: item.actionVariant || 'tonal',
          color: item.actionColor || 'primary',
          disabled: item.disabled,
          onClick: (ev: any) => {
            ev?.stopPropagation?.();
            void this.onItemClicked(item, index);
          },
        }, () => item.actionText)] : []),
      ])));
    }

    return renderDashboardWidgetShell(this, this.$actionParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}


export class DashboardAlertWidget extends DashboardWidget {
  private alertOptions: DashboardAlertWidgetOptions;
  private resolvedItems: Ref<DashboardAlertItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardAlertWidgetParams, options?: DashboardAlertWidgetOptions) {
    super(params, options);
    this.alertOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $alertParams(): DashboardAlertWidgetParams {
    return this.$params as DashboardAlertWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.alertOptions.items) {
      this.resolvedItems.value = this.$alertParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.alertOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private severityColor(item: DashboardAlertItem) {
    switch (item.severity) {
      case 'success': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  }

  private severityIcon(item: DashboardAlertItem) {
    switch (item.severity) {
      case 'success': return 'mdi-check-circle-outline';
      case 'warning': return 'mdi-alert-outline';
      case 'error': return 'mdi-alert-circle-outline';
      default: return 'mdi-information-outline';
    }
  }

  private async onItemClicked(item: DashboardAlertItem, index: number) {
    if (this.alertOptions.onItemClicked) {
      await this.alertOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  render(): VNode | undefined {
    if (this.$alertParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];
    const clickable = typeof this.alertOptions.onItemClicked === 'function';

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$alertParams.emptyText || 'No alerts right now.'));
    } else {
      body.push(...this.resolvedItems.value.map((item, index) => {
        const color = this.severityColor(item);
        return h('div', {
          key: item.key || index,
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '12px 0',
            borderBottom: index === this.resolvedItems.value.length - 1 ? undefined : (this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(17,24,39,0.1)'),
            ...(clickable ? { cursor: 'pointer' } : {}),
          },
          onClick: () => {
            void this.onItemClicked(item, index);
          },
        }, [
          h(VAvatar, { size: 34, color, variant: 'tonal' }, () => h(VIcon, { icon: this.severityIcon(item), color })),
          h('div', { style: { flex: 1, minWidth: 0 } }, [
            h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' } }, [
              h('div', { style: { fontSize: '1.02rem', fontWeight: 600 } }, item.title),
              ...(item.time ? [h('span', { style: { opacity: 0.66, fontSize: '0.9rem' } }, item.time)] : []),
            ]),
            ...(item.message ? [h('div', { class: ['text-body-2'], style: { opacity: 0.74, marginTop: '4px' } }, item.message)] : []),
            ...(item.chipText ? [h(VChip, { size: 'x-small', color, variant: 'outlined', style: { marginTop: '8px' } }, () => item.chipText)] : []),
          ]),
        ]);
      }));
    }

    return renderDashboardWidgetShell(this, this.$alertParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardEmptyStateWidget extends DashboardWidget {
  private emptyOptions: DashboardEmptyStateWidgetOptions;
  private resolvedButtonText: Ref<string | undefined>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardEmptyStateWidgetParams, options?: DashboardEmptyStateWidgetOptions) {
    super(params, options);
    this.emptyOptions = options || {};
    this.resolvedButtonText = this.$makeRef(undefined);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $emptyParams(): DashboardEmptyStateWidgetParams {
    return this.$params as DashboardEmptyStateWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    const source = this.emptyOptions.buttonText;
    if (!source) {
      this.resolvedButtonText.value = this.$emptyParams.buttonText;
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(source(this)).then((text) => {
      this.resolvedButtonText.value = text || this.$emptyParams.buttonText;
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private async onClicked() {
    if (this.emptyOptions.onClicked) {
      await this.emptyOptions.onClicked(this);
    }

    this.emit('clicked', { widget: this });
  }

  render(): VNode | undefined {
    if (this.$emptyParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const toneColor = this.$emptyParams.toneColor || '#3b82f6';
    const body = h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '14px',
        minHeight: '100%',
        padding: '18px 8px',
      },
    }, [
      h(VAvatar, { size: 72, color: toneColor, variant: 'tonal' }, () => h(VIcon, { icon: this.$emptyParams.icon || 'mdi-inbox-outline', color: this.$emptyParams.iconColor || toneColor, size: 34 })),
      h('div', { style: { fontSize: '1.1rem', fontWeight: 700 } }, this.$emptyParams.titleText || this.$emptyParams.title || 'Nothing here yet'),
      ...(this.$emptyParams.message ? [h('div', { class: ['text-body-2'], style: { maxWidth: '360px', opacity: 0.74 } }, this.$emptyParams.message)] : []),
      ...(this.resolvedButtonText.value ? [h(VBtn, {
        color: toneColor,
        variant: 'tonal',
        onClick: () => {
          void this.onClicked();
        },
      }, () => this.resolvedButtonText.value)] : []),
    ]);

    return renderDashboardWidgetShell(this, this.$emptyParams, body, true);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardStatGridWidget extends DashboardWidget {
  private statOptions: DashboardStatGridWidgetOptions;
  private resolvedItems: Ref<DashboardStatGridItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardStatGridWidgetParams, options?: DashboardStatGridWidgetOptions) {
    super(params, options);
    this.statOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $statParams(): DashboardStatGridWidgetParams {
    return this.$params as DashboardStatGridWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.statOptions.items) {
      this.resolvedItems.value = this.$statParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.statOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private formatValue(item: DashboardStatGridItem, index: number) {
    if (this.statOptions.formatValue) {
      return this.statOptions.formatValue(this, item, index);
    }

    return String(item.value ?? '');
  }

  private async onItemClicked(item: DashboardStatGridItem, index: number) {
    if (this.statOptions.onItemClicked) {
      await this.statOptions.onItemClicked(this, item, index);
    }

    this.emit('itemClicked', { widget: this, item, index });
  }

  render(): VNode | undefined {
    if (this.$statParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];
    const clickable = typeof this.statOptions.onItemClicked === 'function';
    const columns = Math.max(1, Math.min(4, Number(this.$statParams.columns || 2)));

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedItems.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$statParams.emptyText || 'No statistics available.'));
    } else {
      body.push(h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: '12px',
        },
      }, this.resolvedItems.value.map((item, index) => h('div', {
        key: item.key || index,
        style: {
          padding: '14px',
          borderRadius: '16px',
          background: this.$theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)',
          border: this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)',
          ...(clickable ? { cursor: 'pointer' } : {}),
        },
        onClick: () => {
          void this.onItemClicked(item, index);
        },
      }, [
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' } }, [
          h('div', { style: { opacity: 0.72 } }, item.label),
          ...(item.icon ? [h(VIcon, { icon: item.icon, color: item.iconColor || item.color || paletteColor(index), size: 18 })] : []),
        ]),
        h('div', { style: { fontSize: '1.35rem', fontWeight: 700, color: item.valueColor || item.color } }, this.formatValue(item, index)),
        ...(item.caption ? [h('div', { class: ['text-body-2'], style: { opacity: 0.68, marginTop: '6px' } }, item.caption)] : []),
      ]))));
    }

    return renderDashboardWidgetShell(this, this.$statParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardMapWidget extends DashboardWidget {
  private mapOptions: DashboardMapWidgetOptions;
  private resolvedData: Ref<DashboardMapData | undefined>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardMapWidgetParams, options?: DashboardMapWidgetOptions) {
    super(params, options);
    this.mapOptions = options || {};
    this.resolvedData = this.$makeRef(undefined);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $mapParams(): DashboardMapWidgetParams {
    return this.$params as DashboardMapWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.mapOptions.data) {
      this.resolvedData.value = this.$mapParams.data;
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.mapOptions.data(this)).then((data) => {
      this.resolvedData.value = data;
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private mapHeight() {
    return asCssSize(this.$mapParams.mapHeight || 220) || '220px';
  }

  private allPoints() {
    const data = this.resolvedData.value;
    const points: DashboardMapPoint[] = [];
    if (data?.center) points.push(data.center);
    (data?.markers || []).forEach((item) => points.push({ lat: item.lat, lng: item.lng }));
    (data?.line || []).forEach((item) => points.push(item));
    (data?.polygon || []).forEach((item) => points.push(item));
    return points;
  }

  private project(point: DashboardMapPoint, width: number, height: number) {
    const points = this.allPoints();
    const lats = points.map((item) => item.lat);
    const lngs = points.map((item) => item.lng);
    const minLat = Math.min.apply(null, lats);
    const maxLat = Math.max.apply(null, lats);
    const minLng = Math.min.apply(null, lngs);
    const maxLng = Math.max.apply(null, lngs);
    const latSpan = Math.max(0.01, maxLat - minLat);
    const lngSpan = Math.max(0.01, maxLng - minLng);
    const padLat = latSpan * 0.12;
    const padLng = lngSpan * 0.12;
    const left = minLng - padLng;
    const right = maxLng + padLng;
    const top = maxLat + padLat;
    const bottom = minLat - padLat;
    const x = ((point.lng - left) / Math.max(0.01, right - left)) * width;
    const y = ((top - point.lat) / Math.max(0.01, top - bottom)) * height;
    return { x, y };
  }

  private pointString(points: DashboardMapPoint[], width: number, height: number) {
    return points.map((point) => {
      const projected = this.project(point, width, height);
      return `${projected.x},${projected.y}`;
    }).join(' ');
  }

  private async onMarkerClicked(marker: DashboardMapMarker, index: number) {
    if (this.mapOptions.onMarkerClicked) {
      await this.mapOptions.onMarkerClicked(this, marker, index);
    }

    this.emit('markerClicked', { widget: this, marker, index });
  }

  render(): VNode | undefined {
    if (this.$mapParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const data = this.resolvedData.value;
    const hasData = !!data && ((data.markers && data.markers.length) || (data.line && data.line.length) || (data.polygon && data.polygon.length) || data.center);
    const body: VNode[] = [];
    const width = 360;
    const height = 220;

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!hasData) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$mapParams.emptyText || 'No geo data available.'));
    } else {
      const markers = data?.markers || [];
      const line = data?.line || [];
      const polygon = data?.polygon || [];
      body.push(h('div', {
        style: {
          height: this.mapHeight(),
          borderRadius: '18px',
          overflow: 'hidden',
          background: this.$theme === 'dark'
            ? 'radial-gradient(circle at top right, rgba(59,130,246,0.16), transparent 24%), linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(30,41,59,0.94) 100%)'
            : 'radial-gradient(circle at top right, rgba(59,130,246,0.1), transparent 24%), linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(226,232,240,0.92) 100%)',
          border: this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.08)',
          position: 'relative',
        },
      }, [
        h('div', {
          style: {
            position: 'absolute',
            inset: 0,
            backgroundImage: this.$theme === 'dark'
              ? 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)'
              : 'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          },
        }),
        h('svg', {
          viewBox: `0 0 ${width} ${height}`,
          style: { width: '100%', height: '100%', position: 'relative', zIndex: 1 },
        }, [
          ...(polygon.length ? [h('polygon', {
            points: this.pointString(polygon, width, height),
            fill: 'rgba(59,130,246,0.22)',
            stroke: '#60a5fa',
            'stroke-width': 2,
          })] : []),
          ...(line.length ? [h('polyline', {
            points: this.pointString(line, width, height),
            fill: 'none',
            stroke: '#10b981',
            'stroke-width': 3,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          })] : []),
          ...markers.reduce<VNode[]>((nodes, marker, index) => {
            const projected = this.project(marker, width, height);
            const color = marker.color || paletteColor(index);
            nodes.push(
              h('circle', {
                key: marker.key || index,
                cx: projected.x,
                cy: projected.y,
                r: 7,
                fill: color,
                stroke: this.$theme === 'dark' ? '#0f172a' : '#ffffff',
                'stroke-width': 2,
                style: this.mapOptions.onMarkerClicked ? { cursor: 'pointer' } : undefined,
                onClick: () => {
                  void this.onMarkerClicked(marker, index);
                },
              }),
              ...(marker.label ? [h('text', {
                x: projected.x + 10,
                y: projected.y - 10,
                fill: this.$textColor,
                style: { fontSize: '11px', fontWeight: 600 },
              }, marker.label)] : []),
            );
            return nodes;
          }, []),
        ]),
      ]));

      if (this.$mapParams.showLegend !== false) {
        body.push(h('div', {
          style: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginTop: '12px',
          },
        }, [
          ...(markers.length ? [h(VChip, { size: 'x-small', variant: 'outlined' }, () => `${markers.length} markers`)] : []),
          ...(line.length ? [h(VChip, { size: 'x-small', variant: 'outlined' }, () => `${line.length} route points`)] : []),
          ...(polygon.length ? [h(VChip, { size: 'x-small', variant: 'outlined' }, () => `${polygon.length} area points`)] : []),
        ]));
      }
    }

    return renderDashboardWidgetShell(this, this.$mapParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardCalendarWidget extends DashboardWidget {
  private calendarOptions: DashboardCalendarWidgetOptions;
  private resolvedItems: Ref<DashboardCalendarItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private currentLoad?: Promise<void>;

  constructor(params?: DashboardCalendarWidgetParams, options?: DashboardCalendarWidgetOptions) {
    super(params, options);
    this.calendarOptions = options || {};
    this.resolvedItems = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
  }

  get $calendarParams(): DashboardCalendarWidgetParams {
    return this.$params as DashboardCalendarWidgetParams;
  }

  private activeYear() {
    return Number(this.$calendarParams.year || new Date().getFullYear());
  }

  private activeMonth() {
    return Number(this.$calendarParams.month || (new Date().getMonth() + 1));
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.calendarOptions.items) {
      this.resolvedItems.value = this.$calendarParams.items || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.calendarOptions.items(this)).then((items) => {
      this.resolvedItems.value = items || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private toDateKey(value: string | Date) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }

  private itemsForDay(date: Date) {
    const key = this.toDateKey(date);
    return this.resolvedItems.value.filter((item) => this.toDateKey(item.date) === key);
  }

  private async onDateClicked(date: Date) {
    const items = this.itemsForDay(date);
    if (this.calendarOptions.onDateClicked) {
      await this.calendarOptions.onDateClicked(this, date, items);
    }

    this.emit('dateClicked', { widget: this, date, items });
  }

  render(): VNode | undefined {
    if (this.$calendarParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];
    const year = this.activeYear();
    const month = this.activeMonth();
    const firstDay = new Date(year, month - 1, 1);
    const firstWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabel = firstDay.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else {
      const cells: VNode[] = [];
      weekdayLabels.forEach((label) => {
        cells.push(h('div', {
          style: { fontSize: '0.82rem', fontWeight: 600, opacity: 0.7, padding: '0 0 8px 0' },
        }, label));
      });
      for (let i = 0; i < firstWeekday; i += 1) {
        cells.push(h('div', { style: { minHeight: '92px' } }));
      }
      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month - 1, day);
        const items = this.itemsForDay(date);
        cells.push(h('div', {
          style: {
            minHeight: '92px',
            padding: '8px',
            borderRadius: '12px',
            background: items.length ? (this.$theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)') : 'transparent',
            border: this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.05)',
            cursor: 'pointer',
          },
          onClick: () => {
            void this.onDateClicked(date);
          },
        }, [
          h('div', { style: { fontWeight: 700, marginBottom: '8px' } }, String(day)),
          ...items.slice(0, 2).map((item, index) => h(VChip, {
            key: item.key || index,
            size: 'x-small',
            color: item.color || paletteColor(index),
            variant: 'tonal',
            style: { marginBottom: '4px', maxWidth: '100%' },
          }, () => item.title)),
          ...(items.length > 2 ? [h('div', { class: ['text-body-2'], style: { opacity: 0.68, marginTop: '2px' } }, `+${items.length - 2} more`)] : []),
        ]));
      }

      body.push(h('div', { style: { fontSize: '1rem', fontWeight: 600, marginBottom: '10px' } }, monthLabel));
      body.push(h('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '8px',
        },
      }, cells));
    }

    return renderDashboardWidgetShell(this, this.$calendarParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    await super.refresh();
  }
}

export class DashboardTabsWidget extends DashboardWidget {
  private tabsOptions: DashboardTabsWidgetOptions;
  private resolvedTabs: Ref<DashboardTabItem[]>;
  private loading: Ref<boolean>;
  private loaded: Ref<boolean>;
  private activeIndex: Ref<number>;
  private currentLoad?: Promise<void>;
  private activeChildren: UIBase[] = [];

  constructor(params?: DashboardTabsWidgetParams, options?: DashboardTabsWidgetOptions) {
    super(params, options);
    this.tabsOptions = options || {};
    this.resolvedTabs = this.$makeRef([]);
    this.loading = this.$makeRef(false);
    this.loaded = this.$makeRef(false);
    this.activeIndex = this.$makeRef(Math.max(0, Number((params || {}).activeTab || 0)));
  }

  get $tabsParams(): DashboardTabsWidgetParams {
    return this.$params as DashboardTabsWidgetParams;
  }

  private async loadResolvedData(force: boolean = false) {
    if (!force && this.loaded.value) {
      return;
    }

    if (this.loading.value && this.currentLoad) {
      await this.currentLoad;
      return;
    }

    if (!this.tabsOptions.tabs) {
      this.resolvedTabs.value = this.$tabsParams.tabs || [];
      this.loaded.value = true;
      return;
    }

    this.loading.value = true;
    this.currentLoad = Promise.resolve(this.tabsOptions.tabs(this)).then((tabs) => {
      this.resolvedTabs.value = tabs || [];
      this.loaded.value = true;
    }).finally(() => {
      this.loading.value = false;
      this.currentLoad = undefined;
    });

    await this.currentLoad;
  }

  private ensureLoaded() {
    void this.loadResolvedData();
  }

  private normalizedIndex() {
    if (!this.resolvedTabs.value.length) {
      return 0;
    }
    return Math.max(0, Math.min(this.activeIndex.value, this.resolvedTabs.value.length - 1));
  }

  private async selectTab(index: number) {
    this.activeIndex.value = index;
    const tab = this.resolvedTabs.value[index];
    if (tab && this.tabsOptions.onTabChanged) {
      await this.tabsOptions.onTabChanged(this, tab, index);
    }
    if (tab) {
      this.emit('tabChanged', { widget: this, tab, index });
    }
  }

  render(): VNode | undefined {
    if (this.$tabsParams.invisible) {
      return;
    }

    this.ensureLoaded();
    const h = this.$h;
    const body: VNode[] = [];

    if (this.loading.value && !this.loaded.value) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
    } else if (!this.resolvedTabs.value.length) {
      body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$tabsParams.emptyText || 'No tabs configured.'));
    } else {
      const activeIndex = this.normalizedIndex();
      const activeTab = this.resolvedTabs.value[activeIndex];
      const tabChildren = activeTab?.children ? activeTab.children(this, {}, {}) : [];
      this.activeChildren = tabChildren.filter((item): item is UIBase => isRenderableUIBase(item));
      body.push(h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' } }, this.resolvedTabs.value.map((tab, index) => h(VBtn, {
        key: tab.key || index,
        size: 'small',
        variant: index === activeIndex ? 'tonal' : 'text',
        color: index === activeIndex ? 'primary' : this.$textColor,
        onClick: () => {
          void this.selectTab(index);
        },
      }, () => [
        h('span', tab.label),
        ...(tab.badge !== undefined ? [h(VChip, { size: 'x-small', variant: 'flat', style: { marginLeft: '8px' } }, () => String(tab.badge))] : []),
      ]))));
      body.push(h('div', {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        },
      }, tabChildren.map((child) => renderDashboardChild(this, child))));
    }

    return renderDashboardWidgetShell(this, this.$tabsParams, body, body.length > 0);
  }

  async refresh(): Promise<void> {
    this.loaded.value = false;
    await this.loadResolvedData(true);
    for (const child of this.activeChildren) {
      await (child as any).refresh?.();
    }
  }
}

export class Dashboard extends UIBase {
  protected params: Ref<DashboardParams>;
  private options: DashboardOptions;
  private childInstances: Array<UIBase> = [];
  private dashboardMenuOpen: Ref<boolean>;
  private dashboardMenuItems: Ref<Array<MenuItem>>;
  private dashboardMenuActiveIndex: Ref<number>;
  private dashboardMenuLoaded: Ref<boolean>;
  private dashboardMenuLoading: Ref<boolean>;
  private resolvedChildrenCache?: Array<DashboardWidget | UIBase | VNode>;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private static defaultParams: DashboardParams = {
    fluid: true,
  };

  constructor(params?: DashboardParams, options?: DashboardOptions) {
    super();
    this.params = this.$makeRef({ ...Dashboard.defaultParams, ...(params || {}) });
    this.options = options || {};
    this.dashboardMenuOpen = this.$makeRef(false);
    this.dashboardMenuItems = this.$makeRef([]);
    this.dashboardMenuActiveIndex = this.$makeRef(-1);
    this.dashboardMenuLoaded = this.$makeRef(false);
    this.dashboardMenuLoading = this.$makeRef(false);
    if (options?.master) this.setMaster(options.master);
  }

  static setDefault(value: DashboardParams, reset?: boolean): void {
    if (reset) {
      Dashboard.defaultParams = value;
    } else {
      Dashboard.defaultParams = { ...Dashboard.defaultParams, ...value };
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $params(): DashboardParams {
    return this.params.value;
  }

  get $theme(): DashboardTheme {
    return this.params.value.theme || 'light';
  }

  get $textColor(): string {
    if (this.params.value.textColor) return this.params.value.textColor;
    return defaultTextColorForTheme(this.$theme);
  }

  get $readonly() {
    return true;
  }

  get $parentReport(): Report | undefined {
    return this.$parent ? (this.$parent as any).$parentReport : undefined;
  }

  setParams(params: DashboardParams) {
    this.params.value = { ...this.params.value, ...params };
    this.invalidateDashboardChildren();
  }

  topChildren(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode> {
    return [];
  }

  children(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode> {
    return [];
  }

  bottomChildren(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode> {
    return [];
  }

  props() {
    return [];
  }

  render(props: any, context: any): VNode | undefined {
    if (this.params.value.invisible) {
      return;
    }

    const h = this.$h;
    const allChildren = this.resolveDashboardChildren(props, context);
    this.childInstances = allChildren.filter((item): item is UIBase => isRenderableUIBase(item));

    const titleNodes: VNode[] = [];
    if (this.params.value.title) {
      titleNodes.push(h('div', { class: ['text-h4'], style: { fontWeight: 700, color: this.$textColor } }, this.params.value.title));
    }
    if (this.params.value.subtitle) {
      titleNodes.push(h('div', { class: ['text-subtitle-1'], style: { opacity: 0.74, marginTop: this.params.value.title ? '6px' : '0px', color: this.$textColor } }, this.params.value.subtitle));
    }

    const headerNode = h('div', {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '20px',
      },
    }, [
      h('div', { style: { minWidth: 0, flex: 1 } }, titleNodes),
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 } }, [
        ...(this.options.menuItems ? [this.renderHeaderMenu()] : []),
        h(VBtn, {
          icon: 'mdi-refresh',
          variant: 'text',
          size: 'small',
          color: this.$textColor,
          'aria-label': 'Refresh dashboard',
          onClick: () => {
            void this.runRefreshAction();
          },
        }),
        h(VBtn, {
          icon: 'mdi-close',
          variant: 'text',
          size: 'small',
          color: this.$textColor,
          'aria-label': 'Close dashboard',
          onClick: () => {
            void this.forceCancel();
          },
        }),
      ]),
    ]);

    return h(
      VContainer,
      {
        fluid: this.params.value.fluid,
        class: normalizeClassValue(this.params.value.containerClass),
        style: {
          width: '100%',
          ...(this.params.value.width !== undefined ? { width: asCssSize(this.params.value.width) } : {}),
          ...(this.params.value.maxWidth !== undefined ? { maxWidth: asCssSize(this.params.value.maxWidth) } : {}),
          ...(this.params.value.minWidth !== undefined ? { minWidth: asCssSize(this.params.value.minWidth) } : {}),
          ...(this.params.value.backgroundColor ? { backgroundColor: this.params.value.backgroundColor } : {}),
          ...((this.params.value.backgroundGradient || this.params.value.backgroundImage) ? {
            backgroundImage: [this.params.value.backgroundGradient, this.params.value.backgroundImage].filter(Boolean).join(', '),
          } : {}),
          ...(this.params.value.backgroundSize ? { backgroundSize: this.params.value.backgroundSize } : {}),
          ...(this.params.value.backgroundPosition ? { backgroundPosition: this.params.value.backgroundPosition } : {}),
          ...(this.params.value.backgroundRepeat ? { backgroundRepeat: this.params.value.backgroundRepeat } : {}),
          color: this.$textColor,
          ...(this.params.value.containerStyle || {}),
        },
      },
      () => h(
        VCol,
        {
          class: ['mx-auto'].concat(normalizeClassValue(this.params.value.class)),
          cols: this.params.value.cols || 12,
          lg: this.params.value.lg,
          xs: this.params.value.xs,
          md: this.params.value.md,
          xl: this.params.value.xl,
          xxl: this.params.value.xxl,
          sm: this.params.value.sm,
          style: { color: this.$textColor, ...(this.params.value.style || {}) },
        },
        () => [
          headerNode,
          h(
            VRow,
            {
              justify: this.params.value.justify,
              align: this.params.value.align,
              dense: this.params.value.dense,
              alignContent: this.params.value.alignContent,
            },
            () => allChildren.map((child) => renderDashboardChild(this, child))
          )
        ]
      )
    );
  }

  setup() {
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  attachEventListeners() {
    super.attachEventListeners();

    if (typeof window === 'undefined' || this.shortcutHandler) {
      return;
    }

    this.shortcutHandler = (ev: KeyboardEvent) => this.onDashboardKeydown(ev);
    window.addEventListener('keydown', this.shortcutHandler);
  }

  removeEventListeners() {
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }

    super.removeEventListeners();
  }

  async validate(): Promise<string | undefined> {
    for (const child of this.childInstances) {
      const value = await (child as any).validate?.();
      if (typeof value === 'string') return value;
    }
  }

  async forceCancel() {
    this.emit('cancel', this);
  }

  async refresh(): Promise<void> {
    for (const child of this.childInstances) {
      await (child as any).refresh?.();
    }
  }

  private resolveDashboardChildren(props: any, context: any): Array<DashboardWidget | UIBase | VNode> {
    if (!this.resolvedChildrenCache) {
      const top = this.options.topChildren ? this.options.topChildren(this, props, context) : this.topChildren(props, context);
      const middle = this.options.children ? this.options.children(this, props, context) : this.children(props, context);
      const bottom = this.options.bottomChildren ? this.options.bottomChildren(this, props, context) : this.bottomChildren(props, context);
      this.resolvedChildrenCache = [...top, ...middle, ...bottom];
    }

    return this.resolvedChildrenCache;
  }

  private invalidateDashboardChildren() {
    this.resolvedChildrenCache = undefined;
  }

  private renderHeaderMenu(): VNode {
    const h = this.$h;
    const menuSurfaceColor = this.$theme === 'dark' ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.97)';

    return h(
      VMenu,
      {
        modelValue: this.dashboardMenuOpen.value,
        'onUpdate:modelValue': (value: boolean) => {
          this.dashboardMenuOpen.value = value;
          this.dashboardMenuActiveIndex.value = value ? Math.max(this.dashboardMenuActiveIndex.value, 0) : -1;
          if (value) {
            void this.loadDashboardMenuItems();
          }
        },
        location: 'bottom end',
        origin: 'top end',
        closeOnContentClick: true,
      },
      {
        activator: ({ props: activatorProps }: any) => h(VBtn, {
          ...activatorProps,
          icon: 'mdi-dots-vertical',
          variant: 'text',
          size: 'small',
          color: this.$textColor,
          'aria-label': 'Dashboard menu',
          onClick: (ev: Event) => {
            activatorProps?.onClick?.(ev);
            if (!this.dashboardMenuLoaded.value) {
              void this.loadDashboardMenuItems();
            }
          },
        }),
        default: () => h(
          VList,
          {
            density: 'comfortable',
            nav: true,
            style: {
              minWidth: '250px',
              backgroundColor: menuSurfaceColor,
              color: this.$textColor,
              backdropFilter: 'blur(12px)',
            },
          },
          () => {
            if (this.dashboardMenuLoading.value) {
              return [
                h(VListItem, {
                  title: 'Loading actions...',
                  prependIcon: 'mdi-loading',
                  color: this.$textColor,
                }),
              ];
            }

            if (!this.dashboardMenuItems.value.length) {
              return [
                h(VListItem, {
                  title: 'No actions available',
                  prependIcon: 'mdi-menu-open',
                  color: this.$textColor,
                }),
              ];
            }

            return this.dashboardMenuItems.value.map((item, index) => h(VListItem, {
              key: item.$params.text || item.$params.subText || index,
              title: item.$params.text,
              subtitle: item.$params.subText,
              prependIcon: item.$params.icon,
              color: item.$params.textColor || this.$textColor,
              active: index === this.dashboardMenuActiveIndex.value,
              baseColor: item.$params.textColor || this.$textColor,
              style: {
                minHeight: '48px',
                borderRadius: '10px',
                backgroundColor: index === this.dashboardMenuActiveIndex.value ? (this.$theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(17,24,39,0.08)') : undefined,
              },
              onMouseenter: () => {
                this.dashboardMenuActiveIndex.value = index;
              },
              onClick: async () => {
                this.dashboardMenuActiveIndex.value = index;
                this.dashboardMenuOpen.value = false;
                await this.executeDashboardMenuItem(item);
              },
            }, {
              append: () => {
                const shortcut = describeDashboardMenuShortcut(item);
                return shortcut ? h('span', {
                  class: ['text-caption'],
                  style: { opacity: 0.72, fontWeight: 600, marginLeft: '12px' },
                }, shortcut) : undefined;
              },
            }));
          }
        ),
      }
    );
  }

  private async loadDashboardMenuItems(force = false): Promise<void> {
    if (!this.options.menuItems) {
      this.dashboardMenuItems.value = [];
      this.dashboardMenuLoaded.value = true;
      return;
    }

    if (this.dashboardMenuLoaded.value && !force) {
      return;
    }

    this.dashboardMenuLoading.value = true;

    try {
      const items = (await this.options.menuItems(this)) || [];
      const filtered: Array<MenuItem> = [];
      for (const item of items) {
        if (await item.access(item.$params.mode)) {
          filtered.push(item);
        }
      }
      this.dashboardMenuItems.value = filtered;
      this.dashboardMenuActiveIndex.value = filtered.length ? Math.min(Math.max(this.dashboardMenuActiveIndex.value, 0), filtered.length - 1) : -1;
      this.dashboardMenuLoaded.value = true;
    } finally {
      this.dashboardMenuLoading.value = false;
    }
  }

  private async executeDashboardMenuItem(item: MenuItem) {
    const mode = item.$params.mode;

    if (item.$params.action === 'menu') {
      const menu = await item.menu(mode);
      if (menu) {
        if (await menu.access()) {
          menu.setParent(this)
          AppManager.showMenu(menu);
        } else {
          Dialogs.$error('access denied!');
        }
      }
      return;
    }

    if (item.$params.action === 'collection') {
      const collection = await item.collection(mode);
      if (collection) {
        if (await collection.access(mode)) {
          collection.$params.mode = mode;
          AppManager.showCollection(collection);
        } else {
          Dialogs.$error('access denied!');
        }
      }
      return;
    }

    if (item.$params.action === 'report') {
      const report = await item.report(mode);
      if (report) {
        if (await report.access(mode)) {
          report.$params.mode = mode;
          AppManager.showReport(report);
        } else {
          Dialogs.$error('access denied!');
        }
      }
      return;
    }

    await item.callback(mode);
  }

  private async runRefreshAction() {
    Dialogs.$showProgress({});
    try {
      await this.refresh();
    } finally {
      Dialogs.$hideProgress();
    }
  }

  private onDashboardKeydown(ev: KeyboardEvent) {
    if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
      return;
    }

    if (this.dashboardMenuOpen.value) {
      if (ev.key === 'ArrowDown' && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
        ev.preventDefault();
        this.moveDashboardMenuActiveIndex('down');
        return;
      }

      if (ev.key === 'ArrowUp' && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
        ev.preventDefault();
        this.moveDashboardMenuActiveIndex('up');
        return;
      }

      if (ev.key === 'Enter' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
        ev.preventDefault();
        void this.activateDashboardMenuActiveItem();
        return;
      }

      if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey) {
        ev.preventDefault();
        this.dashboardMenuOpen.value = false;
        this.dashboardMenuActiveIndex.value = -1;
        return;
      }
    }

    if (ev.key === 'Enter' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
      ev.preventDefault();
      void this.runRefreshAction();
      return;
    }

    if (ev.key === 'Enter' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && ev.shiftKey) {
      ev.preventDefault();
      void this.toggleDashboardMenuFromShortcut();
      return;
    }

    if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
      ev.preventDefault();
      void this.forceCancel();
      return;
    }

    if (!this.shouldIgnoreDashboardShortcut(ev)) {
      void this.handleDashboardMenuShortcut(ev);
    }
  }

  private moveDashboardMenuActiveIndex(direction: 'up'|'down') {
    const items = this.dashboardMenuItems.value;
    if (!items.length) {
      this.dashboardMenuActiveIndex.value = -1;
      return;
    }

    if (this.dashboardMenuActiveIndex.value < 0 || this.dashboardMenuActiveIndex.value >= items.length) {
      this.dashboardMenuActiveIndex.value = direction === 'down' ? 0 : items.length - 1;
      return;
    }

    if (direction === 'down') {
      this.dashboardMenuActiveIndex.value = (this.dashboardMenuActiveIndex.value + 1) % items.length;
      return;
    }

    this.dashboardMenuActiveIndex.value = (this.dashboardMenuActiveIndex.value - 1 + items.length) % items.length;
  }

  private async activateDashboardMenuActiveItem() {
    const item = this.dashboardMenuItems.value[this.dashboardMenuActiveIndex.value];
    if (!item) {
      return;
    }

    this.dashboardMenuOpen.value = false;
    await this.executeDashboardMenuItem(item);
  }

  private async toggleDashboardMenuFromShortcut() {
    if (!this.options.menuItems) {
      return;
    }

    if (!this.dashboardMenuOpen.value && !this.dashboardMenuLoaded.value) {
      await this.loadDashboardMenuItems();
    }

    this.dashboardMenuOpen.value = !this.dashboardMenuOpen.value;
  }

  private async handleDashboardMenuShortcut(ev: KeyboardEvent) {
    if (!this.options.menuItems) {
      return;
    }

    if (!this.dashboardMenuLoaded.value) {
      await this.loadDashboardMenuItems();
    }

    const eventShortcut = normalizeShortcutFromEvent(ev);
    if (!eventShortcut) {
      return;
    }

    for (const item of this.dashboardMenuItems.value) {
      const itemShortcut = normalizeShortcut(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
      if (!itemShortcut || itemShortcut !== eventShortcut) {
        continue;
      }

      ev.preventDefault();
      await this.executeDashboardMenuItem(item);
      return;
    }
  }

  private shouldIgnoreDashboardShortcut(ev: KeyboardEvent) {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
      return true;
    }

    return false;
  }

  private handleOn(event: string, data?: any) {
    if (this.options.on) {
      const events = this.options.on(this);
      if (events[event]) {
        events[event](data);
      }
    }

    this.emit(event, data);
  }
}

export const $DB = (params?: DashboardParams, options?: DashboardOptions) => new Dashboard(params || {}, options || {});
export const $DW = (params?: DashboardWidgetParams, options?: DashboardWidgetOptions) => new DashboardWidget(params || {}, options || {});
export const $DMW = (params?: DashboardMetricWidgetParams, options?: DashboardMetricWidgetOptions) => new DashboardMetricWidget(params || {}, options || {});
export const $DTW = (params?: DashboardTableWidgetParams, options?: DashboardTableWidgetOptions) => new DashboardTableWidget(params || {}, options || {});
export const $DLW = (params?: DashboardListWidgetParams, options?: DashboardListWidgetOptions) => new DashboardListWidget(params || {}, options || {});
export const $DPW = (params?: DashboardProgressWidgetParams, options?: DashboardProgressWidgetOptions) => new DashboardProgressWidget(params || {}, options || {});
export const $DCHW = (params?: DashboardChartWidgetParams, options?: DashboardChartWidgetOptions) => new DashboardChartWidget(params || {}, options || {});
export const $DTrW = (params?: DashboardTrendWidgetParams, options?: DashboardTrendWidgetOptions) => new DashboardTrendWidget(params || {}, options || {});
export const $DTLW = (params?: DashboardTimelineWidgetParams, options?: DashboardTimelineWidgetOptions) => new DashboardTimelineWidget(params || {}, options || {});
export const $DALW = (params?: DashboardActionListWidgetParams, options?: DashboardActionListWidgetOptions) => new DashboardActionListWidget(params || {}, options || {});
export const $DAW = (params?: DashboardAlertWidgetParams, options?: DashboardAlertWidgetOptions) => new DashboardAlertWidget(params || {}, options || {});
export const $DESW = (params?: DashboardEmptyStateWidgetParams, options?: DashboardEmptyStateWidgetOptions) => new DashboardEmptyStateWidget(params || {}, options || {});
export const $DSGW = (params?: DashboardStatGridWidgetParams, options?: DashboardStatGridWidgetOptions) => new DashboardStatGridWidget(params || {}, options || {});
export const $DMaW = (params?: DashboardMapWidgetParams, options?: DashboardMapWidgetOptions) => new DashboardMapWidget(params || {}, options || {});
export const $DCaW = (params?: DashboardCalendarWidgetParams, options?: DashboardCalendarWidgetOptions) => new DashboardCalendarWidget(params || {}, options || {});
export const $DTabW = (params?: DashboardTabsWidgetParams, options?: DashboardTabsWidgetOptions) => new DashboardTabsWidget(params || {}, options || {});
