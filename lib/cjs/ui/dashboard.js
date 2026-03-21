"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$DTabW = exports.$DCaW = exports.$DMaW = exports.$DSGW = exports.$DESW = exports.$DAW = exports.$DALW = exports.$DTLW = exports.$DTrW = exports.$DCHW = exports.$DPW = exports.$DLW = exports.$DTW = exports.$DMW = exports.$DW = exports.$DB = exports.Dashboard = exports.DashboardTabsWidget = exports.DashboardCalendarWidget = exports.DashboardMapWidget = exports.DashboardStatGridWidget = exports.DashboardEmptyStateWidget = exports.DashboardAlertWidget = exports.DashboardActionListWidget = exports.DashboardTimelineWidget = exports.DashboardTrendWidget = exports.DashboardChartWidget = exports.DashboardProgressWidget = exports.DashboardListWidget = exports.DashboardTableWidget = exports.DashboardMetricWidget = exports.DashboardWidget = void 0;
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const dialogs_1 = require("./dialogs");
const appmanager_1 = require("./appmanager");
const shortcut_1 = require("./shortcut");
const DASHBOARD_WIDGET_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
function asCssSize(value) {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    return typeof value === 'number' ? `${value}px` : value;
}
function normalizeClassValue(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
function isRenderableUIBase(item) {
    return item instanceof base_1.UIBase;
}
function defaultTextColorForTheme(theme) {
    return theme === 'dark' ? '#ffffff' : '#111827';
}
function describeDashboardMenuShortcut(item) {
    var _a;
    return (_a = (0, shortcut_1.describeShortcut)(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac })) === null || _a === void 0 ? void 0 : _a.label;
}
function paletteColor(index) {
    return DASHBOARD_WIDGET_PALETTE[index % DASHBOARD_WIDGET_PALETTE.length];
}
function resolveOwnerTextColor(owner) {
    return (owner === null || owner === void 0 ? void 0 : owner.$textColor) || defaultTextColorForTheme('light');
}
function renderDashboardChild(owner, child) {
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
  `;
    document.head.appendChild(style);
}
function renderDashboardWidgetShell(owner, params, body, hasBody = true) {
    ensureDashboardWidgetStyles();
    const h = owner.$h;
    const headerNodes = [];
    const textColor = resolveOwnerTextColor(owner);
    const widgetHeight = asCssSize(params.height);
    const widgetMinHeight = asCssSize(params.minHeight);
    const widgetMaxHeight = asCssSize(params.maxHeight);
    const scrollbarThumb = owner && owner.$theme === 'dark' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(71, 85, 105, 0.16)';
    const scrollbarThumbHover = owner && owner.$theme === 'dark' ? 'rgba(148, 163, 184, 0.46)' : 'rgba(71, 85, 105, 0.34)';
    if (params.title || params.subtitle || params.icon) {
        headerNodes.push(h('div', {
            style: {
                display: 'flex',
                alignItems: params.subtitle ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: hasBody ? '12px' : '0px',
                flexShrink: 0,
            },
        }, [
            h('div', { style: { color: textColor } }, [
                ...(params.title ? [h(components_1.VCardTitle, { style: { padding: '0px', lineHeight: '1.2', color: textColor } }, () => params.title || '')] : []),
                ...(params.subtitle ? [h(components_1.VCardSubtitle, { style: { padding: '6px 0 0 0', color: textColor, opacity: 0.74 } }, () => params.subtitle || '')] : []),
            ]),
            ...(params.icon ? [
                h(components_1.VIcon, {
                    icon: params.icon,
                    color: params.iconColor || textColor,
                    size: 28,
                })
            ] : []),
        ]));
    }
    const shellStyle = {
        minHeight: widgetMinHeight,
        maxHeight: widgetMaxHeight,
        height: widgetHeight,
    };
    const scrollStyle = Object.assign(Object.assign(Object.assign({ color: textColor }, (params.noCard ? { padding: '0px' } : {})), { '--ve-dashboard-scrollbar-thumb': scrollbarThumb, '--ve-dashboard-scrollbar-thumb-hover': scrollbarThumbHover }), (params.bodyStyle || {}));
    const contentNodes = Array.isArray(body) ? body : [body];
    const scrollNode = h('div', {
        class: ['ve-dashboard-widget-scroll'].concat(normalizeClassValue(params.bodyClass)),
        style: scrollStyle,
    }, contentNodes);
    const shellChildren = [...headerNodes, scrollNode];
    const inner = params.noCard
        ? h('div', { class: ['ve-dashboard-widget-shell'], style: shellStyle }, shellChildren)
        : h(components_1.VCard, {
            rounded: params.rounded,
            elevation: params.elevation,
            color: params.color,
            variant: params.variant,
            class: ['ve-dashboard-widget-card'].concat(normalizeClassValue(params.cardClass)),
            style: Object.assign(Object.assign({ color: textColor }, shellStyle), (params.cardStyle || {})),
        }, () => h(components_1.VCardText, { class: ['ve-dashboard-widget-cardtext'], style: { minHeight: 0, height: '100%' } }, () => shellChildren));
    return h(components_1.VCol, {
        cols: params.cols || 12,
        lg: params.lg,
        xs: params.xs,
        md: params.md,
        xl: params.xl,
        xxl: params.xxl,
        sm: params.sm,
    }, () => inner);
}
class DashboardWidget extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childInstances = [];
        this.params = this.$makeRef(Object.assign(Object.assign({}, DashboardWidget.defaultParams), (params || {})));
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options.master);
    }
    static setDefault(value, reset) {
        if (reset) {
            DashboardWidget.defaultParams = value;
        }
        else {
            DashboardWidget.defaultParams = Object.assign(Object.assign({}, DashboardWidget.defaultParams), value);
        }
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $params() {
        return this.params.value;
    }
    get $theme() {
        if (this.params.value.theme)
            return this.params.value.theme;
        if (this.$parent && this.$parent.$theme)
            return this.$parent.$theme;
        return 'light';
    }
    get $textColor() {
        if (this.params.value.textColor)
            return this.params.value.textColor;
        return defaultTextColorForTheme(this.$theme);
    }
    get $readonly() {
        if (this.$parent && this.$parent.$readonly !== undefined)
            return this.$parent.$readonly;
        return false;
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    topChildren(_props, _context) {
        return [];
    }
    children(_props, _context) {
        return [];
    }
    bottomChildren(_props, _context) {
        return [];
    }
    props() {
        return [];
    }
    render(props, context) {
        if (this.params.value.invisible) {
            return;
        }
        const h = this.$h;
        const top = this.options.topChildren ? this.options.topChildren(this, props, context) : this.topChildren(props, context);
        const middle = this.options.children ? this.options.children(this, props, context) : this.children(props, context);
        const bottom = this.options.bottomChildren ? this.options.bottomChildren(this, props, context) : this.bottomChildren(props, context);
        const allChildren = [...top, ...middle, ...bottom];
        this.childInstances = allChildren.filter((item) => isRenderableUIBase(item));
        const content = h(components_1.VRow, {
            justify: this.params.value.justify,
            align: this.params.value.align,
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent,
        }, () => allChildren.map((child) => renderDashboardChild(this, child)));
        return renderDashboardWidgetShell(this, this.params.value, content, allChildren.length > 0);
    }
    setup() {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    validate() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of this.childInstances) {
                const value = yield ((_b = (_a = child).validate) === null || _b === void 0 ? void 0 : _b.call(_a));
                if (typeof value === 'string')
                    return value;
            }
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('cancel', this);
        });
    }
    refresh() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of this.childInstances) {
                yield ((_b = (_a = child).refresh) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
        });
    }
    handleOn(event, data) {
        if (this.options.on) {
            const events = this.options.on(this);
            if (events[event]) {
                events[event](data);
            }
        }
        this.emit(event, data);
    }
}
exports.DashboardWidget = DashboardWidget;
DashboardWidget.defaultParams = {
    cols: 12,
    variant: 'outlined',
    elevation: 0,
    rounded: 'lg',
};
class DashboardMetricWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.metricOptions = options || {};
        this.resolvedValue = this.$makeRef(undefined);
        this.animatedValue = this.$makeRef(undefined);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $metricParams() {
        return this.$params;
    }
    resolveRawValue() {
        if (this.metricOptions.value !== undefined) {
            return this.metricOptions.value;
        }
        return this.$metricParams.value;
    }
    normalizeDisplayNumber(value) {
        return Number.isInteger(value) ? Math.round(value) : Number(value.toFixed(2));
    }
    startValueAnimation(nextValue) {
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
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            this.animatedValue.value = this.normalizeDisplayNumber(startValue + (delta * eased));
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(step);
            }
            else {
                this.animatedValue.value = nextValue;
                this.animationFrame = undefined;
            }
        };
        this.animationFrame = requestAnimationFrame(step);
    }
    loadResolvedValue(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
                return;
            }
            const source = this.resolveRawValue();
            if (typeof source !== 'function') {
                this.resolvedValue.value = source;
                this.loaded.value = true;
                if (typeof source === 'number') {
                    this.startValueAnimation(source);
                }
                else {
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
                }
                else {
                    this.animatedValue.value = undefined;
                }
            }).finally(() => {
                this.loading.value = false;
                this.currentLoad = undefined;
            });
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedValue();
    }
    currentRenderedValue() {
        var _a;
        if (typeof this.resolvedValue.value === 'number') {
            return (_a = this.animatedValue.value) !== null && _a !== void 0 ? _a : this.resolvedValue.value;
        }
        return this.resolvedValue.value;
    }
    formattedValue() {
        const currentValue = this.currentRenderedValue();
        if (this.metricOptions.formatValue) {
            return this.metricOptions.formatValue(this, currentValue);
        }
        if (currentValue === undefined || currentValue === null) {
            return '';
        }
        return String(currentValue);
    }
    onClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.metricOptions.onClicked) {
                yield this.metricOptions.onClicked(this);
            }
            this.emit('clicked', { widget: this, value: this.resolvedValue.value });
        });
    }
    render() {
        if (this.$metricParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = h('div', {
            style: Object.assign({ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }, (this.metricOptions.onClicked ? { cursor: 'pointer' } : {})),
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
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = undefined;
            }
            this.animatedValue.value = undefined;
            yield this.loadResolvedValue(true);
            yield _super.refresh.call(this);
        });
    }
    destructor() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
        super.destructor();
    }
}
exports.DashboardMetricWidget = DashboardMetricWidget;
class DashboardTableWidget extends DashboardWidget {
    constructor(params, options) {
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
    get $tableParams() {
        return this.$params;
    }
    pageSize() {
        return Math.max(1, Number(this.$tableParams.pageSize || 5));
    }
    usesPagedLoader() {
        return typeof this.tableOptions.loadPage === 'function';
    }
    shouldPaginate() {
        return this.$tableParams.pagination === true;
    }
    loadResolvedData(force = false) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
                return;
            }
            const paramHeaders = this.$tableParams.headers || [];
            const paramItems = this.$tableParams.items || [];
            if (this.usesPagedLoader()) {
                this.loading.value = true;
                this.currentLoad = Promise.resolve((_b = (_a = this.tableOptions).loadPage) === null || _b === void 0 ? void 0 : _b.call(_a, this, {
                    page: this.currentPage.value,
                    pageSize: this.pageSize(),
                    search: (this.search.value || '').trim(),
                })).then((result) => {
                    var _a;
                    this.resolvedHeaders.value = (result === null || result === void 0 ? void 0 : result.headers) || paramHeaders;
                    this.resolvedItems.value = (result === null || result === void 0 ? void 0 : result.items) || [];
                    this.totalItems.value = Math.max(0, Number((_a = result === null || result === void 0 ? void 0 : result.total) !== null && _a !== void 0 ? _a : this.resolvedItems.value.length));
                    this.loaded.value = true;
                }).finally(() => {
                    this.loading.value = false;
                    this.currentLoad = undefined;
                });
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    filteredItems() {
        const rawItems = this.resolvedItems.value || [];
        const term = (this.search.value || '').trim().toLowerCase();
        if (!term || this.usesPagedLoader()) {
            return rawItems;
        }
        return rawItems.filter((row) => {
            return this.resolvedHeaders.value.some((column) => { var _a; return String((_a = row === null || row === void 0 ? void 0 : row[column.key]) !== null && _a !== void 0 ? _a : '').toLowerCase().includes(term); });
        });
    }
    totalPages(totalCount) {
        return Math.max(1, Math.ceil(totalCount / this.pageSize()));
    }
    visibleItems() {
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
    visibleTotalCount() {
        if (this.usesPagedLoader()) {
            return this.totalItems.value;
        }
        return this.filteredItems().length;
    }
    dividerColor() {
        return this.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(17, 24, 39, 0.12)';
    }
    goToPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const nextPage = Math.max(1, page);
            if (nextPage === this.currentPage.value) {
                return;
            }
            this.currentPage.value = nextPage;
            if (this.usesPagedLoader()) {
                this.loaded.value = false;
                yield this.loadResolvedData(true);
            }
        });
    }
    updateSearch(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.search.value = value || '';
            this.currentPage.value = 1;
            if (this.usesPagedLoader()) {
                this.loaded.value = false;
                yield this.loadResolvedData(true);
            }
        });
    }
    rowClassValue(row, index) {
        var _a, _b;
        const value = (_b = (_a = this.tableOptions).rowClass) === null || _b === void 0 ? void 0 : _b.call(_a, this, row, index);
        if (!value) {
            return [];
        }
        return Array.isArray(value) ? value : [value];
    }
    rowStyleValue(row, index) {
        var _a, _b;
        const clickable = typeof this.tableOptions.onRowClick === 'function';
        return Object.assign(Object.assign({}, (clickable ? { cursor: 'pointer' } : {})), (((_b = (_a = this.tableOptions).rowStyle) === null || _b === void 0 ? void 0 : _b.call(_a, this, row, index)) || {}));
    }
    onRowClicked(row, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tableOptions.onRowClick) {
                yield this.tableOptions.onRowClick(this, row, index);
            }
            this.emit('rowClicked', { widget: this, row, index });
        });
    }
    render() {
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
        const body = [];
        if (this.$tableParams.showSearch !== false) {
            body.push(h(components_1.VTextField, {
                baseColor: this.$textColor,
                color: this.$textColor,
                modelValue: this.search.value,
                placeholder: this.$tableParams.searchPlaceholder || 'Search',
                prependInnerIcon: 'mdi-magnify',
                hideDetails: true,
                density: 'comfortable',
                variant: 'outlined',
                style: { marginBottom: '10px' },
                'onUpdate:modelValue': (value) => {
                    void this.updateSearch(value);
                },
            }));
        }
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!items.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$tableParams.emptyText || 'No rows to display.'));
        }
        else {
            body.push(h(components_1.VTable, { density: 'comfortable', class: ['bg-transparent'], style: { background: 'transparent', color: this.$textColor } }, {
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
                    h('tbody', items.map((row, index) => h('tr', {
                        key: (row === null || row === void 0 ? void 0 : row.key) || `${this.currentPage.value}-${index}`,
                        class: this.rowClassValue(row, index),
                        style: Object.assign({ borderBottom: `1px solid ${dividerColor}` }, this.rowStyleValue(row, index)),
                        onClick: () => {
                            void this.onRowClicked(row, index);
                        },
                    }, headers.map((column) => {
                        var _a, _b, _c;
                        const rendered = (_b = (_a = this.tableOptions).cell) === null || _b === void 0 ? void 0 : _b.call(_a, this, row, column, index);
                        return h('td', {
                            style: {
                                textAlign: column.align === 'end' ? 'right' : (column.align === 'center' ? 'center' : 'left'),
                                color: this.$textColor,
                                borderBottom: `1px solid ${dividerColor}`,
                            },
                        }, rendered === undefined ? String((_c = row === null || row === void 0 ? void 0 : row[column.key]) !== null && _c !== void 0 ? _c : '') : rendered);
                    })))),
                ],
            }));
        }
        if (paginationEnabled) {
            body.push(h('div', {
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
                    h(components_1.VBtn, {
                        variant: 'text',
                        size: 'small',
                        color: this.$textColor,
                        disabled: this.currentPage.value <= 1 || this.loading.value,
                        onClick: () => {
                            void this.goToPage(this.currentPage.value - 1);
                        },
                    }, () => 'Prev'),
                    h('div', { class: ['text-body-2'], style: { minWidth: '68px', textAlign: 'center', opacity: 0.78 } }, `Page ${Math.min(this.currentPage.value, totalPages)} / ${totalPages}`),
                    h(components_1.VBtn, {
                        variant: 'text',
                        size: 'small',
                        color: this.$textColor,
                        disabled: this.currentPage.value >= totalPages || this.loading.value,
                        onClick: () => {
                            void this.goToPage(this.currentPage.value + 1);
                        },
                    }, () => 'Next'),
                ]),
            ]));
        }
        return renderDashboardWidgetShell(this, this.$tableParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardTableWidget = DashboardTableWidget;
class DashboardListWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.listOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $listParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    renderLeading(item) {
        const h = this.$h;
        if (item.icon) {
            return h(components_1.VAvatar, { color: item.avatarColor || 'primary', rounded: 'lg', size: 36, variant: 'tonal' }, () => h(components_1.VIcon, { icon: item.icon, color: item.iconColor }));
        }
        return h(components_1.VAvatar, { color: item.avatarColor || 'primary', rounded: 'lg', size: 36 }, () => item.avatarText || item.title.charAt(0));
    }
    dividerColor() {
        return this.$theme === 'dark' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(17, 24, 39, 0.12)';
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.listOptions.onItemClicked) {
                yield this.listOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    render() {
        if (this.$listParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        const dividerColor = this.dividerColor();
        const showSeparator = this.$listParams.separator === true;
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$listParams.emptyText || 'No items to display.'));
        }
        else {
            body.push(...this.resolvedItems.value.map((item, index) => h('div', {
                key: item.key || index,
                style: Object.assign({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '12px 0', borderBottom: showSeparator ? `1px solid ${dividerColor}` : undefined }, (this.listOptions.onItemClicked ? { cursor: 'pointer' } : {})),
                onClick: () => {
                    void this.onItemClicked(item, index);
                },
            }, [
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 } }, [
                    this.renderLeading(item),
                    h('div', { style: { minWidth: 0 } }, [
                        h('div', { style: { fontSize: '1.05rem', fontWeight: 500 } }, item.title),
                        ...(item.subtitle ? [h('div', { style: { opacity: 0.7 } }, item.subtitle)] : []),
                    ]),
                ]),
                h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 } }, [
                    ...(item.chipText ? [h(components_1.VChip, { size: 'small', color: item.chipColor, variant: item.chipVariant || 'outlined' }, () => item.chipText)] : []),
                    ...(item.value ? [h('div', { style: { fontSize: '1.05rem', fontWeight: 500, color: item.valueColor } }, item.value)] : []),
                ]),
            ])));
        }
        return renderDashboardWidgetShell(this, this.$listParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardListWidget = DashboardListWidget;
class DashboardProgressWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.progressOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
        this.animatedAmounts = this.$makeRef([]);
        this.hasAnimatedInitialLoad = false;
    }
    get $progressParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    syncAnimatedAmounts() {
        this.animatedAmounts.value = this.resolvedItems.value.map((item) => this.normalizedAmount(item.amount));
    }
    startInitialAnimation() {
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
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            this.animatedAmounts.value = targets.map((target) => target * eased);
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(step);
            }
            else {
                this.animatedAmounts.value = targets;
                this.animationFrame = undefined;
            }
        };
        this.animationFrame = requestAnimationFrame(step);
    }
    normalizedAmount(amount) {
        const numeric = Number(amount || 0);
        if (Number.isNaN(numeric)) {
            return 0;
        }
        if (numeric <= 1) {
            return Math.max(0, Math.min(100, numeric * 100));
        }
        return Math.max(0, Math.min(100, numeric));
    }
    renderLeading(item) {
        const h = this.$h;
        if (item.icon) {
            return h(components_1.VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', size: 40 }, () => h(components_1.VIcon, { icon: item.icon, color: item.iconColor }));
        }
        return h(components_1.VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', size: 40 }, () => item.avatarText || item.label.charAt(0));
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.progressOptions.onItemClicked) {
                yield this.progressOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    render() {
        if (this.$progressParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$progressParams.emptyText || 'No summary items to display.'));
        }
        else {
            body.push(...this.resolvedItems.value.map((item, index) => {
                var _a;
                return h('div', {
                    key: item.key || index,
                    style: Object.assign({ display: 'flex', gap: '16px', padding: '14px 0' }, (this.progressOptions.onItemClicked ? { cursor: 'pointer' } : {})),
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
                        h(components_1.VProgressLinear, {
                            modelValue: (_a = this.animatedAmounts.value[index]) !== null && _a !== void 0 ? _a : this.normalizedAmount(item.amount),
                            color: item.color || 'primary',
                            rounded: true,
                            height: 8,
                            bgColor: item.bgColor || 'grey-darken-1',
                        }),
                    ]),
                ]);
            }));
        }
        return renderDashboardWidgetShell(this, this.$progressParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            this.hasAnimatedInitialLoad = false;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = undefined;
            }
            this.animatedAmounts.value = [];
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
    destructor() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
        super.destructor();
    }
}
exports.DashboardProgressWidget = DashboardProgressWidget;
class DashboardChartWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.chartOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $chartParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    itemsWithColor() {
        return (this.resolvedItems.value || []).map((item, index) => (Object.assign(Object.assign({}, item), { color: item.color || paletteColor(index) })));
    }
    chartHeight() {
        return asCssSize(this.$chartParams.chartHeight || 220) || '220px';
    }
    maxValue(items) {
        return Math.max(1, ...items.map((item) => Number(item.value || 0)));
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.chartOptions.onItemClicked) {
                yield this.chartOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    renderLegend(items) {
        if (this.$chartParams.showLegend === false || !items.length) {
            return [];
        }
        const h = this.$h;
        const clickable = typeof this.chartOptions.onItemClicked === 'function';
        return items.map((item, index) => h('div', {
            key: item.key || item.label || index,
            style: Object.assign({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '6px 0' }, (clickable ? { cursor: 'pointer' } : {})),
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
    renderBarChart(items) {
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
            ...items.reduce((nodes, item, index) => {
                const numeric = Number(item.value || 0);
                const barHeight = Math.max(8, (numeric / maxValue) * chartHeight);
                const x = left + (index * (barWidth + gap));
                const y = baseY - barHeight;
                nodes.push(h('rect', {
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
                }), h('text', {
                    x: x + (barWidth / 2),
                    y: baseY + 18,
                    'text-anchor': 'middle',
                    fill: this.$textColor,
                    style: { fontSize: '11px', opacity: 0.8 },
                }, item.label), h('text', {
                    x: x + (barWidth / 2),
                    y: y - 8,
                    'text-anchor': 'middle',
                    fill: this.$textColor,
                    style: { fontSize: '11px', opacity: 0.72 },
                }, item.valueLabel || String(item.value)));
                return nodes;
            }, []),
        ]);
    }
    renderLineChart(items) {
        var _a;
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
                stroke: ((_a = items[0]) === null || _a === void 0 ? void 0 : _a.color) || paletteColor(0),
                'stroke-width': 3,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
            ...points.reduce((nodes, point) => {
                nodes.push(h('circle', {
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
                }), h('text', {
                    x: point.x,
                    y: top + chartHeight + 18,
                    'text-anchor': 'middle',
                    fill: this.$textColor,
                    style: { fontSize: '11px', opacity: 0.8 },
                }, point.item.label));
                return nodes;
            }, []),
        ]);
    }
    renderDonutChart(items) {
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
    render() {
        if (this.$chartParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const items = this.itemsWithColor();
        const body = [];
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!items.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$chartParams.emptyText || 'No chart data to display.'));
        }
        else {
            const type = this.$chartParams.chartType || 'bar';
            body.push(h('div', { style: { display: 'flex', flexDirection: 'column', gap: '14px' } }, [
                type === 'line' ? this.renderLineChart(items) : (type === 'donut' ? this.renderDonutChart(items) : this.renderBarChart(items)),
                h('div', { style: { display: 'grid', gap: '4px' } }, this.renderLegend(items)),
            ]));
        }
        return renderDashboardWidgetShell(this, this.$chartParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardChartWidget = DashboardChartWidget;
class DashboardTrendWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.trendOptions = options || {};
        this.resolvedValue = this.$makeRef(undefined);
        this.resolvedDelta = this.$makeRef(undefined);
        this.resolvedSparkline = this.$makeRef([]);
        this.animatedValue = this.$makeRef(undefined);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $trendParams() {
        return this.$params;
    }
    normalizeDisplayNumber(value) {
        return Number.isInteger(value) ? Math.round(value) : Number(value.toFixed(2));
    }
    startValueAnimation(nextValue) {
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
        const step = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            this.animatedValue.value = this.normalizeDisplayNumber(startValue + (delta * eased));
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(step);
            }
            else {
                this.animatedValue.value = nextValue;
                this.animationFrame = undefined;
            }
        };
        this.animationFrame = requestAnimationFrame(step);
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
                }
                else {
                    this.animatedValue.value = undefined;
                }
            }).finally(() => {
                this.loading.value = false;
                this.currentLoad = undefined;
            });
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    currentRenderedValue() {
        var _a;
        if (typeof this.resolvedValue.value === 'number') {
            return (_a = this.animatedValue.value) !== null && _a !== void 0 ? _a : this.resolvedValue.value;
        }
        return this.resolvedValue.value;
    }
    formattedValue() {
        const currentValue = this.currentRenderedValue();
        if (this.trendOptions.formatValue) {
            return this.trendOptions.formatValue(this, currentValue);
        }
        if (currentValue === undefined || currentValue === null) {
            return '';
        }
        return String(currentValue);
    }
    trendColor() {
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
    trendIcon() {
        if (this.$trendParams.trend === 'down') {
            return 'mdi-trending-down';
        }
        if (this.$trendParams.trend === 'flat') {
            return 'mdi-trending-neutral';
        }
        return 'mdi-trending-up';
    }
    renderSparkline() {
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
    onClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.trendOptions.onClicked) {
                yield this.trendOptions.onClicked(this);
            }
            this.emit('clicked', { widget: this, value: this.resolvedValue.value, delta: this.resolvedDelta.value });
        });
    }
    render() {
        if (this.$trendParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const clickable = typeof this.trendOptions.onClicked === 'function';
        const sparkline = this.renderSparkline();
        const body = h('div', {
            style: Object.assign({ display: 'flex', flexDirection: 'column', gap: '12px' }, (clickable ? { cursor: 'pointer' } : {})),
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
                ...(this.resolvedDelta.value ? [h(components_1.VChip, {
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
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = undefined;
            }
            this.animatedValue.value = undefined;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
    destructor() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = undefined;
        }
        super.destructor();
    }
}
exports.DashboardTrendWidget = DashboardTrendWidget;
class DashboardTimelineWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.timelineOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $timelineParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.timelineOptions.onItemClicked) {
                yield this.timelineOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    renderLeading(item) {
        const h = this.$h;
        if (item.icon) {
            return h(components_1.VAvatar, { color: item.avatarColor || item.color || 'primary', variant: 'tonal', size: 34 }, () => h(components_1.VIcon, { icon: item.icon, color: item.iconColor }));
        }
        return h(components_1.VAvatar, { color: item.avatarColor || item.color || 'primary', variant: 'tonal', size: 34 }, () => item.avatarText || item.title.charAt(0));
    }
    render() {
        if (this.$timelineParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const clickable = typeof this.timelineOptions.onItemClicked === 'function';
        const body = [];
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$timelineParams.emptyText || 'No activity to display.'));
        }
        else {
            body.push(h('div', { style: { display: 'flex', flexDirection: 'column' } }, this.resolvedItems.value.map((item, index) => h('div', {
                key: item.key || index,
                style: Object.assign({ display: 'grid', gridTemplateColumns: '44px 1fr', gap: '14px', paddingBottom: index === this.resolvedItems.value.length - 1 ? '0px' : '18px' }, (clickable ? { cursor: 'pointer' } : {})),
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
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardTimelineWidget = DashboardTimelineWidget;
class DashboardActionListWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.actionOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $actionParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    renderLeading(item) {
        const h = this.$h;
        if (item.icon) {
            return h(components_1.VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', rounded: 'lg', size: 38 }, () => h(components_1.VIcon, { icon: item.icon, color: item.iconColor }));
        }
        return h(components_1.VAvatar, { color: item.avatarColor || 'primary', variant: 'tonal', rounded: 'lg', size: 38 }, () => item.avatarText || item.title.charAt(0));
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item.disabled) {
                return;
            }
            if (this.actionOptions.onItemClicked) {
                yield this.actionOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    render() {
        if (this.$actionParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        const clickable = typeof this.actionOptions.onItemClicked === 'function';
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$actionParams.emptyText || 'No actions available.'));
        }
        else {
            body.push(...this.resolvedItems.value.map((item, index) => h('div', {
                key: item.key || index,
                style: Object.assign({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '12px 0', borderBottom: index === this.resolvedItems.value.length - 1 ? undefined : (this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(17,24,39,0.1)'), opacity: item.disabled ? 0.55 : 1 }, (clickable ? { cursor: item.disabled ? 'default' : 'pointer' } : {})),
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
                        ...(item.chipText ? [h(components_1.VChip, { size: 'x-small', color: item.chipColor, variant: 'outlined', style: { marginTop: '8px' } }, () => item.chipText)] : []),
                    ]),
                ]),
                ...(item.actionText ? [h(components_1.VBtn, {
                        size: 'small',
                        variant: item.actionVariant || 'tonal',
                        color: item.actionColor || 'primary',
                        disabled: item.disabled,
                        onClick: (ev) => {
                            var _a;
                            (_a = ev === null || ev === void 0 ? void 0 : ev.stopPropagation) === null || _a === void 0 ? void 0 : _a.call(ev);
                            void this.onItemClicked(item, index);
                        },
                    }, () => item.actionText)] : []),
            ])));
        }
        return renderDashboardWidgetShell(this, this.$actionParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardActionListWidget = DashboardActionListWidget;
class DashboardAlertWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.alertOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $alertParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    severityColor(item) {
        switch (item.severity) {
            case 'success': return '#22c55e';
            case 'warning': return '#f59e0b';
            case 'error': return '#ef4444';
            default: return '#3b82f6';
        }
    }
    severityIcon(item) {
        switch (item.severity) {
            case 'success': return 'mdi-check-circle-outline';
            case 'warning': return 'mdi-alert-outline';
            case 'error': return 'mdi-alert-circle-outline';
            default: return 'mdi-information-outline';
        }
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.alertOptions.onItemClicked) {
                yield this.alertOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    render() {
        if (this.$alertParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        const clickable = typeof this.alertOptions.onItemClicked === 'function';
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$alertParams.emptyText || 'No alerts right now.'));
        }
        else {
            body.push(...this.resolvedItems.value.map((item, index) => {
                const color = this.severityColor(item);
                return h('div', {
                    key: item.key || index,
                    style: Object.assign({ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: index === this.resolvedItems.value.length - 1 ? undefined : (this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(17,24,39,0.1)') }, (clickable ? { cursor: 'pointer' } : {})),
                    onClick: () => {
                        void this.onItemClicked(item, index);
                    },
                }, [
                    h(components_1.VAvatar, { size: 34, color, variant: 'tonal' }, () => h(components_1.VIcon, { icon: this.severityIcon(item), color })),
                    h('div', { style: { flex: 1, minWidth: 0 } }, [
                        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' } }, [
                            h('div', { style: { fontSize: '1.02rem', fontWeight: 600 } }, item.title),
                            ...(item.time ? [h('span', { style: { opacity: 0.66, fontSize: '0.9rem' } }, item.time)] : []),
                        ]),
                        ...(item.message ? [h('div', { class: ['text-body-2'], style: { opacity: 0.74, marginTop: '4px' } }, item.message)] : []),
                        ...(item.chipText ? [h(components_1.VChip, { size: 'x-small', color, variant: 'outlined', style: { marginTop: '8px' } }, () => item.chipText)] : []),
                    ]),
                ]);
            }));
        }
        return renderDashboardWidgetShell(this, this.$alertParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardAlertWidget = DashboardAlertWidget;
class DashboardEmptyStateWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.emptyOptions = options || {};
        this.resolvedButtonText = this.$makeRef(undefined);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $emptyParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    onClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.emptyOptions.onClicked) {
                yield this.emptyOptions.onClicked(this);
            }
            this.emit('clicked', { widget: this });
        });
    }
    render() {
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
            h(components_1.VAvatar, { size: 72, color: toneColor, variant: 'tonal' }, () => h(components_1.VIcon, { icon: this.$emptyParams.icon || 'mdi-inbox-outline', color: this.$emptyParams.iconColor || toneColor, size: 34 })),
            h('div', { style: { fontSize: '1.1rem', fontWeight: 700 } }, this.$emptyParams.titleText || this.$emptyParams.title || 'Nothing here yet'),
            ...(this.$emptyParams.message ? [h('div', { class: ['text-body-2'], style: { maxWidth: '360px', opacity: 0.74 } }, this.$emptyParams.message)] : []),
            ...(this.resolvedButtonText.value ? [h(components_1.VBtn, {
                    color: toneColor,
                    variant: 'tonal',
                    onClick: () => {
                        void this.onClicked();
                    },
                }, () => this.resolvedButtonText.value)] : []),
        ]);
        return renderDashboardWidgetShell(this, this.$emptyParams, body, true);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardEmptyStateWidget = DashboardEmptyStateWidget;
class DashboardStatGridWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.statOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $statParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    formatValue(item, index) {
        var _a;
        if (this.statOptions.formatValue) {
            return this.statOptions.formatValue(this, item, index);
        }
        return String((_a = item.value) !== null && _a !== void 0 ? _a : '');
    }
    onItemClicked(item, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.statOptions.onItemClicked) {
                yield this.statOptions.onItemClicked(this, item, index);
            }
            this.emit('itemClicked', { widget: this, item, index });
        });
    }
    render() {
        if (this.$statParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        const clickable = typeof this.statOptions.onItemClicked === 'function';
        const columns = Math.max(1, Math.min(4, Number(this.$statParams.columns || 2)));
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedItems.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$statParams.emptyText || 'No statistics available.'));
        }
        else {
            body.push(h('div', {
                style: {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    gap: '12px',
                },
            }, this.resolvedItems.value.map((item, index) => h('div', {
                key: item.key || index,
                style: Object.assign({ padding: '14px', borderRadius: '16px', background: this.$theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)', border: this.$theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.08)' }, (clickable ? { cursor: 'pointer' } : {})),
                onClick: () => {
                    void this.onItemClicked(item, index);
                },
            }, [
                h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' } }, [
                    h('div', { style: { opacity: 0.72 } }, item.label),
                    ...(item.icon ? [h(components_1.VIcon, { icon: item.icon, color: item.iconColor || item.color || paletteColor(index), size: 18 })] : []),
                ]),
                h('div', { style: { fontSize: '1.35rem', fontWeight: 700, color: item.valueColor || item.color } }, this.formatValue(item, index)),
                ...(item.caption ? [h('div', { class: ['text-body-2'], style: { opacity: 0.68, marginTop: '6px' } }, item.caption)] : []),
            ]))));
        }
        return renderDashboardWidgetShell(this, this.$statParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardStatGridWidget = DashboardStatGridWidget;
class DashboardMapWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.mapOptions = options || {};
        this.resolvedData = this.$makeRef(undefined);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $mapParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    mapHeight() {
        return asCssSize(this.$mapParams.mapHeight || 220) || '220px';
    }
    allPoints() {
        const data = this.resolvedData.value;
        const points = [];
        if (data === null || data === void 0 ? void 0 : data.center)
            points.push(data.center);
        ((data === null || data === void 0 ? void 0 : data.markers) || []).forEach((item) => points.push({ lat: item.lat, lng: item.lng }));
        ((data === null || data === void 0 ? void 0 : data.line) || []).forEach((item) => points.push(item));
        ((data === null || data === void 0 ? void 0 : data.polygon) || []).forEach((item) => points.push(item));
        return points;
    }
    project(point, width, height) {
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
    pointString(points, width, height) {
        return points.map((point) => {
            const projected = this.project(point, width, height);
            return `${projected.x},${projected.y}`;
        }).join(' ');
    }
    onMarkerClicked(marker, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mapOptions.onMarkerClicked) {
                yield this.mapOptions.onMarkerClicked(this, marker, index);
            }
            this.emit('markerClicked', { widget: this, marker, index });
        });
    }
    render() {
        if (this.$mapParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const data = this.resolvedData.value;
        const hasData = !!data && ((data.markers && data.markers.length) || (data.line && data.line.length) || (data.polygon && data.polygon.length) || data.center);
        const body = [];
        const width = 360;
        const height = 220;
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!hasData) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$mapParams.emptyText || 'No geo data available.'));
        }
        else {
            const markers = (data === null || data === void 0 ? void 0 : data.markers) || [];
            const line = (data === null || data === void 0 ? void 0 : data.line) || [];
            const polygon = (data === null || data === void 0 ? void 0 : data.polygon) || [];
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
                    ...markers.reduce((nodes, marker, index) => {
                        const projected = this.project(marker, width, height);
                        const color = marker.color || paletteColor(index);
                        nodes.push(h('circle', {
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
                        }), ...(marker.label ? [h('text', {
                                x: projected.x + 10,
                                y: projected.y - 10,
                                fill: this.$textColor,
                                style: { fontSize: '11px', fontWeight: 600 },
                            }, marker.label)] : []));
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
                    ...(markers.length ? [h(components_1.VChip, { size: 'x-small', variant: 'outlined' }, () => `${markers.length} markers`)] : []),
                    ...(line.length ? [h(components_1.VChip, { size: 'x-small', variant: 'outlined' }, () => `${line.length} route points`)] : []),
                    ...(polygon.length ? [h(components_1.VChip, { size: 'x-small', variant: 'outlined' }, () => `${polygon.length} area points`)] : []),
                ]));
            }
        }
        return renderDashboardWidgetShell(this, this.$mapParams, body, body.length > 0);
    }
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardMapWidget = DashboardMapWidget;
class DashboardCalendarWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.calendarOptions = options || {};
        this.resolvedItems = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
    }
    get $calendarParams() {
        return this.$params;
    }
    activeYear() {
        return Number(this.$calendarParams.year || new Date().getFullYear());
    }
    activeMonth() {
        return Number(this.$calendarParams.month || (new Date().getMonth() + 1));
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    toDateKey(value) {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`;
    }
    itemsForDay(date) {
        const key = this.toDateKey(date);
        return this.resolvedItems.value.filter((item) => this.toDateKey(item.date) === key);
    }
    onDateClicked(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.itemsForDay(date);
            if (this.calendarOptions.onDateClicked) {
                yield this.calendarOptions.onDateClicked(this, date, items);
            }
            this.emit('dateClicked', { widget: this, date, items });
        });
    }
    render() {
        if (this.$calendarParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        const year = this.activeYear();
        const month = this.activeMonth();
        const firstDay = new Date(year, month - 1, 1);
        const firstWeekday = firstDay.getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthLabel = firstDay.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else {
            const cells = [];
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
                    ...items.slice(0, 2).map((item, index) => h(components_1.VChip, {
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
    refresh() {
        const _super = Object.create(null, {
            refresh: { get: () => super.refresh }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            yield _super.refresh.call(this);
        });
    }
}
exports.DashboardCalendarWidget = DashboardCalendarWidget;
class DashboardTabsWidget extends DashboardWidget {
    constructor(params, options) {
        super(params, options);
        this.activeChildren = [];
        this.tabsOptions = options || {};
        this.resolvedTabs = this.$makeRef([]);
        this.loading = this.$makeRef(false);
        this.loaded = this.$makeRef(false);
        this.activeIndex = this.$makeRef(Math.max(0, Number((params || {}).activeTab || 0)));
    }
    get $tabsParams() {
        return this.$params;
    }
    loadResolvedData(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!force && this.loaded.value) {
                return;
            }
            if (this.loading.value && this.currentLoad) {
                yield this.currentLoad;
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
            yield this.currentLoad;
        });
    }
    ensureLoaded() {
        void this.loadResolvedData();
    }
    normalizedIndex() {
        if (!this.resolvedTabs.value.length) {
            return 0;
        }
        return Math.max(0, Math.min(this.activeIndex.value, this.resolvedTabs.value.length - 1));
    }
    selectTab(index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.activeIndex.value = index;
            const tab = this.resolvedTabs.value[index];
            if (tab && this.tabsOptions.onTabChanged) {
                yield this.tabsOptions.onTabChanged(this, tab, index);
            }
            if (tab) {
                this.emit('tabChanged', { widget: this, tab, index });
            }
        });
    }
    render() {
        if (this.$tabsParams.invisible) {
            return;
        }
        this.ensureLoaded();
        const h = this.$h;
        const body = [];
        if (this.loading.value && !this.loaded.value) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, 'Loading...'));
        }
        else if (!this.resolvedTabs.value.length) {
            body.push(h('div', { class: ['text-body-2'], style: { opacity: 0.72 } }, this.$tabsParams.emptyText || 'No tabs configured.'));
        }
        else {
            const activeIndex = this.normalizedIndex();
            const activeTab = this.resolvedTabs.value[activeIndex];
            const tabChildren = (activeTab === null || activeTab === void 0 ? void 0 : activeTab.children) ? activeTab.children(this, {}, {}) : [];
            this.activeChildren = tabChildren.filter((item) => isRenderableUIBase(item));
            body.push(h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' } }, this.resolvedTabs.value.map((tab, index) => h(components_1.VBtn, {
                key: tab.key || index,
                size: 'small',
                variant: index === activeIndex ? 'tonal' : 'text',
                color: index === activeIndex ? 'primary' : this.$textColor,
                onClick: () => {
                    void this.selectTab(index);
                },
            }, () => [
                h('span', tab.label),
                ...(tab.badge !== undefined ? [h(components_1.VChip, { size: 'x-small', variant: 'flat', style: { marginLeft: '8px' } }, () => String(tab.badge))] : []),
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
    refresh() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            yield this.loadResolvedData(true);
            for (const child of this.activeChildren) {
                yield ((_b = (_a = child).refresh) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
        });
    }
}
exports.DashboardTabsWidget = DashboardTabsWidget;
class Dashboard extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childInstances = [];
        this.params = this.$makeRef(Object.assign(Object.assign({}, Dashboard.defaultParams), (params || {})));
        this.options = options || {};
        this.dashboardMenuOpen = this.$makeRef(false);
        this.dashboardMenuItems = this.$makeRef([]);
        this.dashboardMenuActiveIndex = this.$makeRef(-1);
        this.dashboardMenuLoaded = this.$makeRef(false);
        this.dashboardMenuLoading = this.$makeRef(false);
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options.master);
    }
    static setDefault(value, reset) {
        if (reset) {
            Dashboard.defaultParams = value;
        }
        else {
            Dashboard.defaultParams = Object.assign(Object.assign({}, Dashboard.defaultParams), value);
        }
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $params() {
        return this.params.value;
    }
    get $theme() {
        return this.params.value.theme || 'light';
    }
    get $textColor() {
        if (this.params.value.textColor)
            return this.params.value.textColor;
        return defaultTextColorForTheme(this.$theme);
    }
    get $readonly() {
        return true;
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
        this.invalidateDashboardChildren();
    }
    topChildren(_props, _context) {
        return [];
    }
    children(_props, _context) {
        return [];
    }
    bottomChildren(_props, _context) {
        return [];
    }
    props() {
        return [];
    }
    render(props, context) {
        if (this.params.value.invisible) {
            return;
        }
        const h = this.$h;
        const allChildren = this.resolveDashboardChildren(props, context);
        this.childInstances = allChildren.filter((item) => isRenderableUIBase(item));
        const titleNodes = [];
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
                h(components_1.VBtn, {
                    icon: 'mdi-refresh',
                    variant: 'text',
                    size: 'small',
                    color: this.$textColor,
                    'aria-label': 'Refresh dashboard',
                    onClick: () => {
                        void this.runRefreshAction();
                    },
                }),
                h(components_1.VBtn, {
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
        return h(components_1.VContainer, {
            fluid: this.params.value.fluid,
            class: normalizeClassValue(this.params.value.containerClass),
            style: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ width: '100%' }, (this.params.value.width !== undefined ? { width: asCssSize(this.params.value.width) } : {})), (this.params.value.maxWidth !== undefined ? { maxWidth: asCssSize(this.params.value.maxWidth) } : {})), (this.params.value.minWidth !== undefined ? { minWidth: asCssSize(this.params.value.minWidth) } : {})), (this.params.value.backgroundColor ? { backgroundColor: this.params.value.backgroundColor } : {})), ((this.params.value.backgroundGradient || this.params.value.backgroundImage) ? {
                backgroundImage: [this.params.value.backgroundGradient, this.params.value.backgroundImage].filter(Boolean).join(', '),
            } : {})), (this.params.value.backgroundSize ? { backgroundSize: this.params.value.backgroundSize } : {})), (this.params.value.backgroundPosition ? { backgroundPosition: this.params.value.backgroundPosition } : {})), (this.params.value.backgroundRepeat ? { backgroundRepeat: this.params.value.backgroundRepeat } : {})), { color: this.$textColor }), (this.params.value.containerStyle || {})),
        }, () => h(components_1.VCol, {
            class: ['mx-auto'].concat(normalizeClassValue(this.params.value.class)),
            cols: this.params.value.cols || 12,
            lg: this.params.value.lg,
            xs: this.params.value.xs,
            md: this.params.value.md,
            xl: this.params.value.xl,
            xxl: this.params.value.xxl,
            sm: this.params.value.sm,
            style: Object.assign({ color: this.$textColor }, (this.params.value.style || {})),
        }, () => [
            headerNode,
            h(components_1.VRow, {
                justify: this.params.value.justify,
                align: this.params.value.align,
                dense: this.params.value.dense,
                alignContent: this.params.value.alignContent,
            }, () => allChildren.map((child) => renderDashboardChild(this, child)))
        ]));
    }
    setup() {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    attachEventListeners() {
        super.attachEventListeners();
        if (typeof window === 'undefined' || this.shortcutHandler) {
            return;
        }
        this.shortcutHandler = (ev) => this.onDashboardKeydown(ev);
        window.addEventListener('keydown', this.shortcutHandler);
    }
    removeEventListeners() {
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
        super.removeEventListeners();
    }
    validate() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of this.childInstances) {
                const value = yield ((_b = (_a = child).validate) === null || _b === void 0 ? void 0 : _b.call(_a));
                if (typeof value === 'string')
                    return value;
            }
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('cancel', this);
        });
    }
    refresh() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            for (const child of this.childInstances) {
                yield ((_b = (_a = child).refresh) === null || _b === void 0 ? void 0 : _b.call(_a));
            }
        });
    }
    resolveDashboardChildren(props, context) {
        if (!this.resolvedChildrenCache) {
            const top = this.options.topChildren ? this.options.topChildren(this, props, context) : this.topChildren(props, context);
            const middle = this.options.children ? this.options.children(this, props, context) : this.children(props, context);
            const bottom = this.options.bottomChildren ? this.options.bottomChildren(this, props, context) : this.bottomChildren(props, context);
            this.resolvedChildrenCache = [...top, ...middle, ...bottom];
        }
        return this.resolvedChildrenCache;
    }
    invalidateDashboardChildren() {
        this.resolvedChildrenCache = undefined;
    }
    renderHeaderMenu() {
        const h = this.$h;
        const menuSurfaceColor = this.$theme === 'dark' ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.97)';
        return h(components_1.VMenu, {
            modelValue: this.dashboardMenuOpen.value,
            'onUpdate:modelValue': (value) => {
                this.dashboardMenuOpen.value = value;
                this.dashboardMenuActiveIndex.value = value ? Math.max(this.dashboardMenuActiveIndex.value, 0) : -1;
                if (value) {
                    void this.loadDashboardMenuItems();
                }
            },
            location: 'bottom end',
            origin: 'top end',
            closeOnContentClick: true,
        }, {
            activator: ({ props: activatorProps }) => h(components_1.VBtn, Object.assign(Object.assign({}, activatorProps), { icon: 'mdi-dots-vertical', variant: 'text', size: 'small', color: this.$textColor, 'aria-label': 'Dashboard menu', onClick: (ev) => {
                    var _a;
                    (_a = activatorProps === null || activatorProps === void 0 ? void 0 : activatorProps.onClick) === null || _a === void 0 ? void 0 : _a.call(activatorProps, ev);
                    if (!this.dashboardMenuLoaded.value) {
                        void this.loadDashboardMenuItems();
                    }
                } })),
            default: () => h(components_1.VList, {
                density: 'comfortable',
                nav: true,
                style: {
                    minWidth: '250px',
                    backgroundColor: menuSurfaceColor,
                    color: this.$textColor,
                    backdropFilter: 'blur(12px)',
                },
            }, () => {
                if (this.dashboardMenuLoading.value) {
                    return [
                        h(components_1.VListItem, {
                            title: 'Loading actions...',
                            prependIcon: 'mdi-loading',
                            color: this.$textColor,
                        }),
                    ];
                }
                if (!this.dashboardMenuItems.value.length) {
                    return [
                        h(components_1.VListItem, {
                            title: 'No actions available',
                            prependIcon: 'mdi-menu-open',
                            color: this.$textColor,
                        }),
                    ];
                }
                return this.dashboardMenuItems.value.map((item, index) => h(components_1.VListItem, {
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
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        this.dashboardMenuActiveIndex.value = index;
                        this.dashboardMenuOpen.value = false;
                        yield this.executeDashboardMenuItem(item);
                    }),
                }, {
                    append: () => {
                        const shortcut = describeDashboardMenuShortcut(item);
                        return shortcut ? h('span', {
                            class: ['text-caption'],
                            style: { opacity: 0.72, fontWeight: 600, marginLeft: '12px' },
                        }, shortcut) : undefined;
                    },
                }));
            }),
        });
    }
    loadDashboardMenuItems(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const items = (yield this.options.menuItems(this)) || [];
                const filtered = [];
                for (const item of items) {
                    if (yield item.access(item.$params.mode)) {
                        filtered.push(item);
                    }
                }
                this.dashboardMenuItems.value = filtered;
                this.dashboardMenuActiveIndex.value = filtered.length ? Math.min(Math.max(this.dashboardMenuActiveIndex.value, 0), filtered.length - 1) : -1;
                this.dashboardMenuLoaded.value = true;
            }
            finally {
                this.dashboardMenuLoading.value = false;
            }
        });
    }
    executeDashboardMenuItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = item.$params.mode;
            if (item.$params.action === 'menu') {
                const menu = yield item.menu(mode);
                if (menu) {
                    if (yield menu.access()) {
                        menu.setParent(this);
                        appmanager_1.AppManager.showMenu(menu);
                    }
                    else {
                        dialogs_1.Dialogs.$error('access denied!');
                    }
                }
                return;
            }
            if (item.$params.action === 'collection') {
                const collection = yield item.collection(mode);
                if (collection) {
                    if (yield collection.access(mode)) {
                        collection.$params.mode = mode;
                        appmanager_1.AppManager.showCollection(collection);
                    }
                    else {
                        dialogs_1.Dialogs.$error('access denied!');
                    }
                }
                return;
            }
            if (item.$params.action === 'report') {
                const report = yield item.report(mode);
                if (report) {
                    if (yield report.access(mode)) {
                        report.$params.mode = mode;
                        appmanager_1.AppManager.showReport(report);
                    }
                    else {
                        dialogs_1.Dialogs.$error('access denied!');
                    }
                }
                return;
            }
            yield item.callback(mode);
        });
    }
    runRefreshAction() {
        return __awaiter(this, void 0, void 0, function* () {
            dialogs_1.Dialogs.$showProgress({});
            try {
                yield this.refresh();
            }
            finally {
                dialogs_1.Dialogs.$hideProgress();
            }
        });
    }
    onDashboardKeydown(ev) {
        if (ev.defaultPrevented || dialogs_1.Dialogs.hasBlockingDialog()) {
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
    moveDashboardMenuActiveIndex(direction) {
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
    activateDashboardMenuActiveItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const item = this.dashboardMenuItems.value[this.dashboardMenuActiveIndex.value];
            if (!item) {
                return;
            }
            this.dashboardMenuOpen.value = false;
            yield this.executeDashboardMenuItem(item);
        });
    }
    toggleDashboardMenuFromShortcut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.menuItems) {
                return;
            }
            if (!this.dashboardMenuOpen.value && !this.dashboardMenuLoaded.value) {
                yield this.loadDashboardMenuItems();
            }
            this.dashboardMenuOpen.value = !this.dashboardMenuOpen.value;
        });
    }
    handleDashboardMenuShortcut(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.menuItems) {
                return;
            }
            if (!this.dashboardMenuLoaded.value) {
                yield this.loadDashboardMenuItems();
            }
            const eventShortcut = (0, shortcut_1.normalizeShortcutFromEvent)(ev);
            if (!eventShortcut) {
                return;
            }
            for (const item of this.dashboardMenuItems.value) {
                const itemShortcut = (0, shortcut_1.normalizeShortcut)(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
                if (!itemShortcut || itemShortcut !== eventShortcut) {
                    continue;
                }
                ev.preventDefault();
                yield this.executeDashboardMenuItem(item);
                return;
            }
        });
    }
    shouldIgnoreDashboardShortcut(ev) {
        const target = ev.target;
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
            return true;
        }
        return false;
    }
    handleOn(event, data) {
        if (this.options.on) {
            const events = this.options.on(this);
            if (events[event]) {
                events[event](data);
            }
        }
        this.emit(event, data);
    }
}
exports.Dashboard = Dashboard;
Dashboard.defaultParams = {
    fluid: true,
};
const $DB = (params, options) => new Dashboard(params || {}, options || {});
exports.$DB = $DB;
const $DW = (params, options) => new DashboardWidget(params || {}, options || {});
exports.$DW = $DW;
const $DMW = (params, options) => new DashboardMetricWidget(params || {}, options || {});
exports.$DMW = $DMW;
const $DTW = (params, options) => new DashboardTableWidget(params || {}, options || {});
exports.$DTW = $DTW;
const $DLW = (params, options) => new DashboardListWidget(params || {}, options || {});
exports.$DLW = $DLW;
const $DPW = (params, options) => new DashboardProgressWidget(params || {}, options || {});
exports.$DPW = $DPW;
const $DCHW = (params, options) => new DashboardChartWidget(params || {}, options || {});
exports.$DCHW = $DCHW;
const $DTrW = (params, options) => new DashboardTrendWidget(params || {}, options || {});
exports.$DTrW = $DTrW;
const $DTLW = (params, options) => new DashboardTimelineWidget(params || {}, options || {});
exports.$DTLW = $DTLW;
const $DALW = (params, options) => new DashboardActionListWidget(params || {}, options || {});
exports.$DALW = $DALW;
const $DAW = (params, options) => new DashboardAlertWidget(params || {}, options || {});
exports.$DAW = $DAW;
const $DESW = (params, options) => new DashboardEmptyStateWidget(params || {}, options || {});
exports.$DESW = $DESW;
const $DSGW = (params, options) => new DashboardStatGridWidget(params || {}, options || {});
exports.$DSGW = $DSGW;
const $DMaW = (params, options) => new DashboardMapWidget(params || {}, options || {});
exports.$DMaW = $DMaW;
const $DCaW = (params, options) => new DashboardCalendarWidget(params || {}, options || {});
exports.$DCaW = $DCaW;
const $DTabW = (params, options) => new DashboardTabsWidget(params || {}, options || {});
exports.$DTabW = $DTabW;
