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
exports.$APP = exports.AppMain = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const misc_1 = require("../misc");
const dialogs_1 = require("./dialogs");
const field_1 = require("./field");
const api_1 = require("../api");
const shortcut_1 = require("./shortcut");
const components_1 = require("vuetify/components");
class AppMain extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, AppMain.defaultParams), (params || {})));
        this.options = options || {};
        this.stack = [];
        this.stackRefState = this.$makeRef([]);
        this.activeItemRefState = this.$makeRef(undefined);
        this.loaded = this.$makeRef(false);
        this.index = this.$makeRef(-1);
        this.selectorCount = this.$makeRef(0);
        this.dialogCount = this.$makeRef(0);
        this.selectors = [];
        this.dialogs = [];
        this.selectorFocusTargets = new Map();
        this.dialogFocusTargets = new Map();
        this.fabButtonInstances = [];
        this.fabOpen = this.$makeRef(false);
    }
    static setDefault(value, reset) {
        if (reset) {
            AppMain.defaultParams = value;
        }
        else {
            AppMain.defaultParams = Object.assign(Object.assign({}, AppMain.defaultParams), value);
        }
    }
    get $ref() {
        return this.params.value.ref;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    get stackRef() {
        return this.stackRefState;
    }
    get activeItemRef() {
        return this.activeItemRefState;
    }
    syncStackRefs() {
        this.stackRefState.value = [...this.stack];
        this.activeItemRefState.value = this.getActiveStackItem();
    }
    props() {
        return [];
    }
    menu() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.menu) {
                return yield this.options.menu(this);
            }
        });
    }
    render(props, context) {
        const h = this.$h;
        if (!this.loaded.value) {
            this.loadApp();
            return undefined;
        }
        const content = this.renderStackContent();
        const header = this.renderShellRegion('header');
        const footer = this.renderShellRegion('footer');
        const headerBar = this.renderShellBar('header');
        const footerBar = this.renderShellBar('footer');
        const showHeader = this.params.value.showHeader || !!headerBar || !!header;
        const showFooter = this.params.value.showFooter || !!footerBar || !!footer;
        if (!showHeader && !showFooter) {
            return this.wrapWithFab(content, showFooter);
        }
        return h(components_1.VApp, {
            class: ['vuetify-extended-app-shell'],
        }, () => [
            ...(showHeader ? [
                h(components_1.VAppBar, {
                    elevation: 2,
                    density: 'comfortable',
                }, () => h('div', {
                    style: {
                        width: '100%',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                    },
                }, [headerBar || header || h(components_1.VAppBarTitle, {}, () => this.params.value.title || 'Application')])),
            ] : []),
            h(components_1.VMain, {
                class: ['vuetify-extended-app-main'],
                style: this.mainShellStyle(),
            }, () => h('div', {
                style: this.mainShellContentStyle(showFooter),
            }, [
                ...(this.params.value.backgroundOverlay ? [
                    h('div', { style: this.mainShellOverlayStyle() })
                ] : []),
                h('div', {
                    style: {
                        position: 'relative',
                        zIndex: 1,
                        minHeight: '100%',
                    },
                }, this.wrapWithFab(content, showFooter)),
            ])),
            ...(showFooter ? [
                h(components_1.VFooter, {
                    app: true,
                    elevation: 2,
                    class: ['px-4', 'py-2'],
                }, () => footerBar || footer || ''),
            ] : []),
        ]);
    }
    renderStackContent() {
        const h = this.$h;
        if (this.index.value >= 0 && this.index.value < this.stack.length) {
            const item = this.stack[this.index.value].item;
            if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
                return [
                    h(item.component),
                    ...this.selectors.map((s) => h(s.component)),
                    ...this.dialogs.map((d) => h(d.component))
                ];
            }
            return h(item.component);
        }
        if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
            return [
                ...this.selectors.map((s) => h(s.component)),
                ...this.dialogs.map((d) => h(d.component))
            ];
        }
        return undefined;
    }
    wrapWithFab(content, showFooter = false) {
        const h = this.$h;
        const fab = this.renderFabActions(showFooter);
        if (!fab) {
            return content;
        }
        const nodes = Array.isArray(content) ? content : (content ? [content] : []);
        return [
            ...nodes,
            fab,
        ];
    }
    getActiveStackItem() {
        if (this.index.value < 0 || this.index.value >= this.stack.length) {
            return undefined;
        }
        return this.stack[this.index.value];
    }
    resolveFabConfig() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const active = this.getActiveStackItem();
        const itemScreen = (((_a = active === null || active === void 0 ? void 0 : active.item) === null || _a === void 0 ? void 0 : _a.$screenParams) || ((_b = active === null || active === void 0 ? void 0 : active.item) === null || _b === void 0 ? void 0 : _b.$appScreenParams) || {});
        const screen = Object.assign(Object.assign({}, itemScreen), ((active === null || active === void 0 ? void 0 : active.params) || {}));
        return {
            showFab: (_c = screen.showFab) !== null && _c !== void 0 ? _c : this.params.value.showFab,
            fabIcon: (_d = screen.fabIcon) !== null && _d !== void 0 ? _d : this.params.value.fabIcon,
            fabColor: (_e = screen.fabColor) !== null && _e !== void 0 ? _e : this.params.value.fabColor,
            fabPosition: (_f = screen.fabPosition) !== null && _f !== void 0 ? _f : this.params.value.fabPosition,
            fabDirection: (_g = screen.fabDirection) !== null && _g !== void 0 ? _g : this.params.value.fabDirection,
            fabLabel: (_h = screen.fabLabel) !== null && _h !== void 0 ? _h : this.params.value.fabLabel,
            fabShortcut: (_j = screen.fabShortcut) !== null && _j !== void 0 ? _j : this.params.value.fabShortcut,
            fabButtons: (_k = screen.fabButtons) !== null && _k !== void 0 ? _k : this.options.fabButtons,
            active,
        };
    }
    resolveFabButtonSource(source, active) {
        if (!source) {
            return [];
        }
        if (typeof source === 'function') {
            return source(this, active === null || active === void 0 ? void 0 : active.item, active) || [];
        }
        return source || [];
    }
    buildFabButtons() {
        this.fabButtonInstances.forEach((instance) => instance.removeEventListeners());
        const config = this.resolveFabConfig();
        this.fabButtonInstances = this.resolveFabButtonSource(config.fabButtons, config.active);
        this.fabButtonInstances.forEach((instance) => instance.setParent(this));
        return {
            buttons: this.fabButtonInstances.filter((instance) => !instance.$params.invisible),
            config,
        };
    }
    renderFabActions(showFooter = false) {
        const { buttons, config } = this.buildFabButtons();
        if (!config.showFab || buttons.length === 0) {
            return undefined;
        }
        const h = this.$h;
        const right = config.fabPosition !== 'bottom-left';
        const location = right ? 'top end' : 'top start';
        return h('div', {
            style: {
                position: 'fixed',
                right: right ? '24px' : undefined,
                left: right ? undefined : '24px',
                bottom: showFooter ? '96px' : '24px',
                zIndex: 1200,
            },
        }, [
            h(components_1.VMenu, {
                modelValue: this.fabOpen.value,
                'onUpdate:modelValue': (value) => { this.fabOpen.value = value; },
                location,
                offset: 12,
                closeOnContentClick: true,
            }, {
                activator: ({ props: activatorProps }) => h(components_1.VBtn, Object.assign(Object.assign({}, activatorProps), { color: config.fabColor, icon: config.fabIcon, size: 'large', elevation: 8, title: config.fabLabel, 'aria-label': config.fabLabel, style: {
                        borderRadius: '999px',
                    } })),
                default: () => h(components_1.VCard, {
                    elevation: 8,
                    style: {
                        minWidth: '220px',
                        maxWidth: '280px',
                    },
                }, () => h(components_1.VCardText, {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                    },
                }, () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })])))),
            }),
        ]);
    }
    triggerComponentShortcut(target, ev) {
        if (!target) {
            return false;
        }
        if (typeof target.triggerButtonShortcut === 'function') {
            return !!target.triggerButtonShortcut(ev);
        }
        return false;
    }
    triggerActiveScreenShortcut(ev) {
        var _a;
        const activeItem = (_a = this.getActiveStackItem()) === null || _a === void 0 ? void 0 : _a.item;
        const currentForm = activeItem === null || activeItem === void 0 ? void 0 : activeItem.currentForm;
        if (this.triggerComponentShortcut(currentForm, ev)) {
            return true;
        }
        if (ev.defaultPrevented) {
            return true;
        }
        if (this.triggerComponentShortcut(activeItem, ev)) {
            return true;
        }
        return ev.defaultPrevented;
    }
    triggerFabButtonShortcut(ev) {
        if (!this.fabOpen.value || ev.repeat) {
            return false;
        }
        const { buttons } = this.buildFabButtons();
        for (const button of buttons) {
            if (button.$params.disabled || button.$readonly) {
                continue;
            }
            const eventShortcut = (0, shortcut_1.normalizeButtonShortcutFromEvent)(ev, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
            if (!eventShortcut) {
                continue;
            }
            const shortcut = (0, shortcut_1.normalizeButtonShortcut)(button.$params.shortcut, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
            if (!shortcut || shortcut !== eventShortcut) {
                continue;
            }
            ev.preventDefault();
            this.fabOpen.value = false;
            button.triggerShortcut();
            return true;
        }
        return false;
    }
    triggerFabShortcut(ev) {
        if (ev.repeat) {
            return false;
        }
        const config = this.resolveFabConfig();
        if (!config.showFab) {
            return false;
        }
        const eventShortcut = (0, shortcut_1.normalizeButtonShortcutFromEvent)(ev);
        if (!eventShortcut) {
            return false;
        }
        const shortcut = (0, shortcut_1.normalizeButtonShortcut)(config.fabShortcut);
        if (!shortcut || shortcut !== eventShortcut) {
            return false;
        }
        ev.preventDefault();
        this.fabOpen.value = !this.fabOpen.value;
        return true;
    }
    onAppKeydown(ev) {
        if (ev.defaultPrevented || dialogs_1.Dialogs.hasBlockingDialog()) {
            return;
        }
        if (this.triggerActiveScreenShortcut(ev)) {
            return;
        }
        if (ev.defaultPrevented) {
            return;
        }
        if (this.triggerFabButtonShortcut(ev)) {
            return;
        }
        this.triggerFabShortcut(ev);
    }
    renderShellRegion(region) {
        const render = region === 'header' ? this.options.header : this.options.footer;
        if (!render) {
            return undefined;
        }
        const content = render(this);
        return this.normalizeShellContent(content);
    }
    renderShellBar(region) {
        const start = this.renderShellBarSection(region, 'Start');
        const center = this.renderShellBarSection(region, 'Center');
        const end = this.renderShellBarSection(region, 'End');
        if (!start && !center && !end) {
            return undefined;
        }
        const h = this.$h;
        const layout = this.getShellLayout(region);
        return h('div', {
            style: this.getShellBarContainerStyle(region, layout),
        }, [
            h('div', { style: this.getShellBarSectionStyle(region, 'Start', layout) }, start ? (Array.isArray(start) ? start : [start]) : []),
            h('div', { style: this.getShellBarSectionStyle(region, 'Center', layout) }, center ? (Array.isArray(center) ? center : [center]) : []),
            h('div', { style: this.getShellBarSectionStyle(region, 'End', layout) }, end ? (Array.isArray(end) ? end : [end]) : []),
        ]);
    }
    renderShellBarSection(region, section) {
        const key = `${region}${section}`;
        const render = this.options[key];
        if (!render) {
            return undefined;
        }
        return this.normalizeShellContent(render(this));
    }
    getShellLayout(region) {
        return (region === 'header' ? this.params.value.headerLayout : this.params.value.footerLayout) || 'balanced';
    }
    getShellWidthValue(region, section) {
        const key = `${region}${section}Width`;
        return this.params.value[key];
    }
    normalizeCssSize(value) {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return typeof value === 'number' ? `${value}px` : value;
    }
    getShellBarContainerStyle(region, layout) {
        if (layout === 'stacked') {
            return {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                gap: '10px',
            };
        }
        const startWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Start')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
        const centerWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Center')) || 'auto';
        const endWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'End')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
        return {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `${startWidth} ${centerWidth} ${endWidth}`,
            alignItems: 'center',
            gap: '16px',
        };
    }
    getShellBarSectionStyle(region, section, layout) {
        const justifyContent = section === 'Start' ? 'flex-start' : section === 'Center' ? 'center' : 'flex-end';
        const width = this.normalizeCssSize(this.getShellWidthValue(region, section));
        return {
            minWidth: 0,
            width: layout === 'stacked' ? '100%' : width,
            display: 'flex',
            alignItems: 'center',
            justifyContent,
            gap: '12px',
            flexWrap: 'wrap',
        };
    }
    mainShellStyle() {
        const image = this.params.value.backgroundImage;
        const gradient = this.params.value.backgroundGradient;
        const backgroundImage = [gradient, image ? `url(${image})` : undefined].filter(Boolean).join(', ');
        return {
            backgroundColor: this.params.value.backgroundColor,
            backgroundImage: backgroundImage || undefined,
            backgroundSize: this.params.value.backgroundSize || (image ? 'cover' : undefined),
            backgroundPosition: this.params.value.backgroundPosition || (image ? 'center center' : undefined),
            backgroundRepeat: this.params.value.backgroundRepeat || (image ? 'no-repeat' : undefined),
            backgroundAttachment: this.params.value.backgroundAttachment,
        };
    }
    mainShellContentStyle(showFooter) {
        return {
            position: 'relative',
            minHeight: '100%',
            paddingBottom: showFooter ? '72px' : undefined,
        };
    }
    mainShellOverlayStyle() {
        return {
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: this.params.value.backgroundOverlay,
            zIndex: 0,
        };
    }
    normalizeShellContent(content) {
        const items = Array.isArray(content) ? content : [content];
        const rendered = items
            .map((item) => this.normalizeShellItem(item))
            .filter((item) => !!item);
        if (rendered.length === 0) {
            return undefined;
        }
        return rendered.length === 1 ? rendered[0] : rendered;
    }
    normalizeShellItem(item) {
        const h = this.$h;
        if (item === null || item === undefined || item === false) {
            return undefined;
        }
        if (item instanceof base_1.UIBase) {
            return h(item.component);
        }
        if ((0, vue_1.isVNode)(item)) {
            return item;
        }
        return h('span', {}, String(item));
    }
    activateCurrentItem(index = this.index.value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fabOpen.value = false;
            if (index < 0 || index >= this.stack.length) {
                return;
            }
            if (index > 0 && this.stack.length > 0) {
                this.stack[index - 1].item.clearListeners(this.$id);
            }
            if (index < this.stack.length) {
                this.stack[index].item.clearListeners(this.$id);
                this.stack[index].item.on('cancel', (item) => this.onCancel(item), this.$id);
                this.stack[index].item.on('finished', (item) => this.onCancel(item), this.$id);
                yield this.stack[index].item.show();
            }
        });
    }
    $reload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadApp();
        });
    }
    loadApp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fabOpen.value = false;
            dialogs_1.Dialogs.$showProgress({});
            const menu = yield this.menu();
            this.stack.forEach((entry) => {
                entry.item.removeEventListeners();
            });
            this.stack = [];
            this.selectors = [];
            this.index.value = -1;
            this.selectorCount.value = 0;
            if (menu) {
                yield this.$showMenu(menu);
            }
            this.loaded.value = true;
            dialogs_1.Dialogs.$hideProgress();
        });
    }
    $getUDFs(objectType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.udfs)
                return yield this.options.udfs(this, objectType, this.params.value.udfQuery || {});
            try {
                const items = yield api_1.Api.instance.service('udfs').findAll({ query: Object.assign(Object.assign({ $sort: { sort: 1 }, inactive: { $ne: true } }, (this.params.value.udfQuery ? this.params.value.udfQuery : {})), { objectTypes: { $in: Array.isArray(objectType) ? objectType : [objectType] } }) });
                return items;
            }
            catch (error) {
                return [];
            }
        });
    }
    $makeUDF(options, mode) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.options.makeUDF)
            return this.options.makeUDF(this, options);
        const ftype = options.fieldType;
        if (!ftype)
            return;
        const fieldMaps = {};
        return new field_1.Field(Object.assign(Object.assign({ type: fieldMaps[ftype] || ftype, label: options.fieldLabel, hint: options.hint, placeholder: options.placeholder, icon: options.icon, required: options.isRequired, multiple: options.multiple || false, storage: `udfs.${options._id}`, cols: (_a = options.gridSize) === null || _a === void 0 ? void 0 : _a.cols, xs: (_b = options.gridSize) === null || _b === void 0 ? void 0 : _b.xs, sm: (_c = options.gridSize) === null || _c === void 0 ? void 0 : _c.sm, md: (_d = options.gridSize) === null || _d === void 0 ? void 0 : _d.md, lg: (_e = options.gridSize) === null || _e === void 0 ? void 0 : _e.lg, xl: (_f = options.gridSize) === null || _f === void 0 ? void 0 : _f.xl, xxl: (_g = options.gridSize) === null || _g === void 0 ? void 0 : _g.xxl }, (options.defaultValue || options.defaultValue === 0 ? { default: options.defaultValue } : {})), (options.fieldType === 'text' && options.isAutoGen && mode && ['create', 'edit'].includes(mode) ? { readonly: !((_h = options.autoGenInfo) === null || _h === void 0 ? void 0 : _h.enableEdit), hint: 'Is Auto Generated', default: '<AUTO>' } : {})), {
            selectOptions: () => options.options || []
        });
    }
    $showMenu(menu, params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.index.value >= 0 && this.index.value < this.stack.length) {
                this.stack[this.index.value].item.removeEventListeners();
            }
            this.stack.push({
                type: "menu",
                item: menu,
                params: params || {}
            });
            this.index.value = this.stack.length - 1;
            yield this.activateCurrentItem();
        });
    }
    $showReport(report, params, replace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.index.value >= 0 && this.index.value < this.stack.length) {
                this.stack[this.index.value].item.removeEventListeners();
            }
            if (replace)
                yield this.$pop();
            this.stack.push({
                type: "report",
                item: report,
                params: params || {}
            });
            this.index.value = this.stack.length - 1;
            yield this.activateCurrentItem();
        });
    }
    $showCollection(collection, params, replace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.index.value >= 0 && this.index.value < this.stack.length) {
                this.stack[this.index.value].item.removeEventListeners();
            }
            if (replace)
                yield this.$pop();
            this.stack.push({
                type: "collection",
                item: collection,
                params: params || {}
            });
            this.index.value = this.stack.length - 1;
            yield this.activateCurrentItem();
        });
    }
    $showUI(ui, params, replace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.index.value >= 0 && this.index.value < this.stack.length) {
                this.stack[this.index.value].item.removeEventListeners();
            }
            if (replace)
                yield this.$pop();
            this.stack.push({
                type: "ui",
                item: ui,
                params: params || {}
            });
            this.index.value = this.stack.length - 1;
            yield this.activateCurrentItem();
        });
    }
    $showSelector(selector, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = this.captureActiveElement();
            if (target) {
                this.selectorFocusTargets.set(selector.$id, target);
            }
            this.selectors.push(selector);
            this.selectorCount.value = this.selectors.length;
            yield (0, misc_1.sleep)(100);
            selector.on('cancel', () => this.onSelectorCancel(selector), this.$id);
            selector.attachEventListeners();
            selector.show();
        });
    }
    $showDialog(dialog, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = this.captureActiveElement();
            if (target) {
                this.dialogFocusTargets.set(dialog.$id, target);
            }
            this.dialogs.push(dialog);
            this.dialogCount.value = this.dialogs.length;
            yield (0, misc_1.sleep)(100);
            dialog.on('cancel', () => this.onDialogCancel(dialog), this.$id);
            dialog.attachEventListeners();
            dialog.show();
        });
    }
    $back() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.selectors.length > 0) {
                this.selectors[this.selectors.length - 1].forceCancel();
            }
            else if (this.stack.length > 1) {
                this.stack[this.stack.length - 1].item.forceCancel();
            }
            else {
                this.emit('close', this);
            }
        });
    }
    $pop(count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (count === 0)
                return;
            const rem = count || 1;
            if (rem < this.stack.length) {
                this.index.value -= rem;
                for (let i = 0; i < rem; i++) {
                    const info = this.stack.pop();
                    if (info)
                        info.item.removeEventListeners();
                }
                this.syncStackRefs();
                yield this.activateCurrentItem();
            }
            else if (rem >= this.stack.length) {
                this.loadApp();
            }
        });
    }
    onCancel(item) {
        return __awaiter(this, void 0, void 0, function* () {
            this.fabOpen.value = false;
            const ui = this.stack.filter((inst) => inst.item.$id === item.$id)[0];
            if (ui) {
                const index = this.stack.indexOf(ui);
                if (index >= 0) {
                    this.stack.splice(index, 1);
                    ui.item.clearListeners(this.$id);
                    this.index.value = this.stack.length - 1;
                    yield this.activateCurrentItem();
                }
            }
        });
    }
    onSelectorCancel(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const ui = this.selectors.filter((inst) => inst.$id === item.$id)[0];
            if (ui) {
                const index = this.selectors.indexOf(ui);
                if (index >= 0) {
                    this.selectors.splice(index, 1);
                    ui.clearListeners(this.$id);
                    this.selectorCount.value = this.selectors.length;
                    yield this.restoreFocus(this.selectorFocusTargets.get(ui.$id));
                    this.selectorFocusTargets.delete(ui.$id);
                }
            }
        });
    }
    onDialogCancel(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const ui = this.dialogs.filter((inst) => inst.$id === item.$id)[0];
            if (ui) {
                const index = this.dialogs.indexOf(ui);
                if (index >= 0) {
                    this.dialogs.splice(index, 1);
                    ui.clearListeners(this.$id);
                    this.dialogCount.value = this.dialogs.length;
                    yield this.restoreFocus(this.dialogFocusTargets.get(ui.$id));
                    this.dialogFocusTargets.delete(ui.$id);
                }
            }
        });
    }
    captureActiveElement() {
        if (typeof document === 'undefined' || typeof HTMLElement === 'undefined') {
            return undefined;
        }
        const active = document.activeElement;
        if (active instanceof HTMLElement && active !== document.body) {
            return active;
        }
        return undefined;
    }
    restoreFocus(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!target) {
                return;
            }
            yield (0, misc_1.sleep)(50);
            if (target.isConnected && typeof target.focus === 'function') {
                target.focus();
            }
        });
    }
    attachEventListeners() {
        super.attachEventListeners();
        if (typeof window !== 'undefined' && !this.shortcutHandler) {
            this.shortcutHandler = (ev) => this.onAppKeydown(ev);
            window.addEventListener('keydown', this.shortcutHandler);
        }
    }
    removeEventListeners() {
        super.removeEventListeners();
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
    }
}
exports.AppMain = AppMain;
AppMain.defaultParams = {
    showHeader: false,
    showFooter: false,
    showFab: false,
    fabIcon: 'mdi-plus',
    fabColor: 'primary',
    fabPosition: 'bottom-right',
    fabDirection: 'up',
    fabLabel: 'Quick Actions',
    fabShortcut: undefined,
    headerLayout: 'balanced',
    footerLayout: 'balanced',
};
const $APP = (params, options) => new AppMain(params || {}, options || {});
exports.$APP = $APP;
