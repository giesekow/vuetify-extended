import { Ref, VNode } from 'vue';
import { UIBase } from './base';
import { Master } from '../master';
import { OnHandler } from './lib';
import { Report } from './report';
import { MenuItem } from './menu';
export type DashboardTheme = 'light' | 'dark';
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
export declare class DashboardWidget extends UIBase {
    protected params: Ref<DashboardWidgetParams>;
    private options;
    private childInstances;
    private static defaultParams;
    constructor(params?: DashboardWidgetParams, options?: DashboardWidgetOptions);
    static setDefault(value: DashboardWidgetParams, reset?: boolean): void;
    get $ref(): string | undefined;
    get $params(): DashboardWidgetParams;
    get $theme(): DashboardTheme;
    get $textColor(): string;
    get $readonly(): any;
    get $parentReport(): Report | undefined;
    setParams(params: DashboardWidgetParams): void;
    topChildren(_props: any, _context: any): Array<UIBase | VNode>;
    children(_props: any, _context: any): Array<UIBase | VNode>;
    bottomChildren(_props: any, _context: any): Array<UIBase | VNode>;
    props(): never[];
    render(props: any, context: any): VNode | undefined;
    setup(): void;
    validate(): Promise<string | undefined>;
    forceCancel(): Promise<void>;
    refresh(): Promise<void>;
    private handleOn;
}
export declare class DashboardMetricWidget extends DashboardWidget {
    private metricOptions;
    private resolvedValue;
    private animatedValue;
    private loading;
    private loaded;
    private currentLoad?;
    private animationFrame?;
    constructor(params?: DashboardMetricWidgetParams, options?: DashboardMetricWidgetOptions);
    get $metricParams(): DashboardMetricWidgetParams;
    private resolveRawValue;
    private normalizeDisplayNumber;
    private startValueAnimation;
    private loadResolvedValue;
    private ensureLoaded;
    private currentRenderedValue;
    private formattedValue;
    private onClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
    destructor(): void;
}
export declare class DashboardTableWidget extends DashboardWidget {
    private tableOptions;
    private resolvedHeaders;
    private resolvedItems;
    private loading;
    private loaded;
    private search;
    private currentPage;
    private totalItems;
    private currentLoad?;
    constructor(params?: DashboardTableWidgetParams, options?: DashboardTableWidgetOptions);
    get $tableParams(): DashboardTableWidgetParams;
    private pageSize;
    private usesPagedLoader;
    private shouldPaginate;
    private loadResolvedData;
    private ensureLoaded;
    private filteredItems;
    private totalPages;
    private visibleItems;
    private visibleTotalCount;
    private dividerColor;
    private goToPage;
    private updateSearch;
    private rowClassValue;
    private rowStyleValue;
    private onRowClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardListWidget extends DashboardWidget {
    private listOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardListWidgetParams, options?: DashboardListWidgetOptions);
    get $listParams(): DashboardListWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private renderLeading;
    private dividerColor;
    private onItemClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardProgressWidget extends DashboardWidget {
    private progressOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private animatedAmounts;
    private hasAnimatedInitialLoad;
    private animationFrame?;
    private currentLoad?;
    constructor(params?: DashboardProgressWidgetParams, options?: DashboardProgressWidgetOptions);
    get $progressParams(): DashboardProgressWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private syncAnimatedAmounts;
    private startInitialAnimation;
    private normalizedAmount;
    private renderLeading;
    private onItemClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
    destructor(): void;
}
export declare class DashboardChartWidget extends DashboardWidget {
    private chartOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardChartWidgetParams, options?: DashboardChartWidgetOptions);
    get $chartParams(): DashboardChartWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private itemsWithColor;
    private chartHeight;
    private maxValue;
    private onItemClicked;
    private renderLegend;
    private renderBarChart;
    private renderLineChart;
    private renderDonutChart;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardTrendWidget extends DashboardWidget {
    private trendOptions;
    private resolvedValue;
    private resolvedDelta;
    private resolvedSparkline;
    private animatedValue;
    private loading;
    private loaded;
    private currentLoad?;
    private animationFrame?;
    constructor(params?: DashboardTrendWidgetParams, options?: DashboardTrendWidgetOptions);
    get $trendParams(): DashboardTrendWidgetParams;
    private normalizeDisplayNumber;
    private startValueAnimation;
    private loadResolvedData;
    private ensureLoaded;
    private currentRenderedValue;
    private formattedValue;
    private trendColor;
    private trendIcon;
    private renderSparkline;
    private onClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
    destructor(): void;
}
export declare class DashboardTimelineWidget extends DashboardWidget {
    private timelineOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardTimelineWidgetParams, options?: DashboardTimelineWidgetOptions);
    get $timelineParams(): DashboardTimelineWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private onItemClicked;
    private renderLeading;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardActionListWidget extends DashboardWidget {
    private actionOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardActionListWidgetParams, options?: DashboardActionListWidgetOptions);
    get $actionParams(): DashboardActionListWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private renderLeading;
    private onItemClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardAlertWidget extends DashboardWidget {
    private alertOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardAlertWidgetParams, options?: DashboardAlertWidgetOptions);
    get $alertParams(): DashboardAlertWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private severityColor;
    private severityIcon;
    private onItemClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardEmptyStateWidget extends DashboardWidget {
    private emptyOptions;
    private resolvedButtonText;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardEmptyStateWidgetParams, options?: DashboardEmptyStateWidgetOptions);
    get $emptyParams(): DashboardEmptyStateWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private onClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardStatGridWidget extends DashboardWidget {
    private statOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardStatGridWidgetParams, options?: DashboardStatGridWidgetOptions);
    get $statParams(): DashboardStatGridWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private formatValue;
    private onItemClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardMapWidget extends DashboardWidget {
    private mapOptions;
    private resolvedData;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardMapWidgetParams, options?: DashboardMapWidgetOptions);
    get $mapParams(): DashboardMapWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private mapHeight;
    private allPoints;
    private project;
    private pointString;
    private onMarkerClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardCalendarWidget extends DashboardWidget {
    private calendarOptions;
    private resolvedItems;
    private loading;
    private loaded;
    private currentLoad?;
    constructor(params?: DashboardCalendarWidgetParams, options?: DashboardCalendarWidgetOptions);
    get $calendarParams(): DashboardCalendarWidgetParams;
    private activeYear;
    private activeMonth;
    private loadResolvedData;
    private ensureLoaded;
    private toDateKey;
    private itemsForDay;
    private onDateClicked;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class DashboardTabsWidget extends DashboardWidget {
    private tabsOptions;
    private resolvedTabs;
    private loading;
    private loaded;
    private activeIndex;
    private currentLoad?;
    private activeChildren;
    constructor(params?: DashboardTabsWidgetParams, options?: DashboardTabsWidgetOptions);
    get $tabsParams(): DashboardTabsWidgetParams;
    private loadResolvedData;
    private ensureLoaded;
    private normalizedIndex;
    private selectTab;
    render(): VNode | undefined;
    refresh(): Promise<void>;
}
export declare class Dashboard extends UIBase {
    protected params: Ref<DashboardParams>;
    private options;
    private childInstances;
    private dashboardMenuOpen;
    private dashboardMenuItems;
    private dashboardMenuActiveIndex;
    private dashboardMenuLoaded;
    private dashboardMenuLoading;
    private resolvedChildrenCache?;
    private shortcutHandler?;
    private static defaultParams;
    constructor(params?: DashboardParams, options?: DashboardOptions);
    static setDefault(value: DashboardParams, reset?: boolean): void;
    get $ref(): string | undefined;
    get $params(): DashboardParams;
    get $theme(): DashboardTheme;
    get $textColor(): string;
    get $readonly(): boolean;
    get $parentReport(): Report | undefined;
    setParams(params: DashboardParams): void;
    topChildren(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode>;
    children(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode>;
    bottomChildren(_props: any, _context: any): Array<DashboardWidget | UIBase | VNode>;
    props(): never[];
    render(props: any, context: any): VNode | undefined;
    setup(): void;
    attachEventListeners(): void;
    removeEventListeners(): void;
    validate(): Promise<string | undefined>;
    forceCancel(): Promise<void>;
    refresh(): Promise<void>;
    private resolveDashboardChildren;
    private invalidateDashboardChildren;
    private renderHeaderMenu;
    private loadDashboardMenuItems;
    private executeDashboardMenuItem;
    private runRefreshAction;
    private onDashboardKeydown;
    private moveDashboardMenuActiveIndex;
    private activateDashboardMenuActiveItem;
    private toggleDashboardMenuFromShortcut;
    private handleDashboardMenuShortcut;
    private shouldIgnoreDashboardShortcut;
    private handleOn;
}
export declare const $DB: (params?: DashboardParams, options?: DashboardOptions) => Dashboard;
export declare const $DW: (params?: DashboardWidgetParams, options?: DashboardWidgetOptions) => DashboardWidget;
export declare const $DMW: (params?: DashboardMetricWidgetParams, options?: DashboardMetricWidgetOptions) => DashboardMetricWidget;
export declare const $DTW: (params?: DashboardTableWidgetParams, options?: DashboardTableWidgetOptions) => DashboardTableWidget;
export declare const $DLW: (params?: DashboardListWidgetParams, options?: DashboardListWidgetOptions) => DashboardListWidget;
export declare const $DPW: (params?: DashboardProgressWidgetParams, options?: DashboardProgressWidgetOptions) => DashboardProgressWidget;
export declare const $DCHW: (params?: DashboardChartWidgetParams, options?: DashboardChartWidgetOptions) => DashboardChartWidget;
export declare const $DTrW: (params?: DashboardTrendWidgetParams, options?: DashboardTrendWidgetOptions) => DashboardTrendWidget;
export declare const $DTLW: (params?: DashboardTimelineWidgetParams, options?: DashboardTimelineWidgetOptions) => DashboardTimelineWidget;
export declare const $DALW: (params?: DashboardActionListWidgetParams, options?: DashboardActionListWidgetOptions) => DashboardActionListWidget;
export declare const $DAW: (params?: DashboardAlertWidgetParams, options?: DashboardAlertWidgetOptions) => DashboardAlertWidget;
export declare const $DESW: (params?: DashboardEmptyStateWidgetParams, options?: DashboardEmptyStateWidgetOptions) => DashboardEmptyStateWidget;
export declare const $DSGW: (params?: DashboardStatGridWidgetParams, options?: DashboardStatGridWidgetOptions) => DashboardStatGridWidget;
export declare const $DMaW: (params?: DashboardMapWidgetParams, options?: DashboardMapWidgetOptions) => DashboardMapWidget;
export declare const $DCaW: (params?: DashboardCalendarWidgetParams, options?: DashboardCalendarWidgetOptions) => DashboardCalendarWidget;
export declare const $DTabW: (params?: DashboardTabsWidgetParams, options?: DashboardTabsWidgetOptions) => DashboardTabsWidget;
