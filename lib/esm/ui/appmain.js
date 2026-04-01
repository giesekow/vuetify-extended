var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isVNode } from "vue";
import { UIBase } from "./base";
import { Menu } from "./menu";
import { sleep } from "../misc";
import { Dialogs } from "./dialogs";
import { Field } from "./field";
import { Api } from "../api";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";
import { VApp, VAppBar, VAppBarTitle, VBtn, VCard, VCardText, VFooter, VMain, VMenu, VNavigationDrawer, VDivider } from 'vuetify/components';
import { Master } from "../master";
export class AppMain extends UIBase {
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
        this.compactShellLayout = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth < 960 : false);
        this.mobileHeaderDrawerOpen = this.$makeRef(false);
        this.footerHeight = this.$makeRef(0);
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
        const compactHeaderDrawer = this.renderCompactHeaderDrawer(showHeader);
        if (!showHeader && !showFooter) {
            return this.wrapWithFab(content, showFooter);
        }
        return h(VApp, {
            class: ['vuetify-extended-app-shell'],
        }, () => [
            ...(compactHeaderDrawer ? [compactHeaderDrawer] : []),
            ...(showHeader ? [
                h(VAppBar, {
                    elevation: 2,
                    density: 'comfortable',
                }, () => h('div', {
                    style: {
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        boxSizing: 'border-box',
                    },
                }, [headerBar || header || h(VAppBarTitle, {}, () => this.params.value.title || 'Application')])),
            ] : []),
            h(VMain, {
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
                h(VFooter, {
                    app: true,
                    elevation: 2,
                    class: ['px-4', 'py-2'],
                    ref: (el) => this.setFooterElement(el),
                }, () => footerBar || footer || ''),
            ] : []),
        ]);
    }
    renderStackContent() {
        const h = this.$h;
        if (this.index.value >= 0 && this.index.value < this.stack.length) {
            const item = this.stack[this.index.value].item;
            const itemNode = this.wrapStackItemContent(item, h(item.component));
            if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
                return [
                    itemNode,
                    ...this.selectors.map((s) => h(s.component)),
                    ...this.dialogs.map((d) => h(d.component))
                ];
            }
            return itemNode;
        }
        if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
            return [
                ...this.selectors.map((s) => h(s.component)),
                ...this.dialogs.map((d) => h(d.component))
            ];
        }
        return undefined;
    }
    wrapStackItemContent(item, node) {
        const h = this.$h;
        if (item instanceof Menu) {
            return h('div', {
                style: {
                    minHeight: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                },
            }, [node]);
        }
        return node;
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
                bottom: showFooter ? `${this.footerHeight.value + 24}px` : '24px',
                zIndex: 1200,
            },
        }, [
            h(VMenu, {
                modelValue: this.fabOpen.value,
                'onUpdate:modelValue': (value) => { this.fabOpen.value = value; },
                location,
                offset: 12,
                closeOnContentClick: true,
            }, {
                activator: ({ props: activatorProps }) => h(VBtn, Object.assign(Object.assign({}, activatorProps), { color: config.fabColor, icon: config.fabIcon, size: 'large', elevation: 8, title: config.fabLabel, 'aria-label': config.fabLabel, style: {
                        borderRadius: '999px',
                    } })),
                default: () => h(VCard, {
                    elevation: 8,
                    style: {
                        width: 'min(calc(100vw - 32px), 280px)',
                        maxWidth: 'calc(100vw - 32px)',
                    },
                }, () => h(VCardText, {
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
            const eventShortcut = normalizeButtonShortcutFromEvent(ev, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
            if (!eventShortcut) {
                continue;
            }
            const shortcut = normalizeButtonShortcut(button.$params.shortcut, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
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
        const eventShortcut = normalizeButtonShortcutFromEvent(ev);
        if (!eventShortcut) {
            return false;
        }
        const shortcut = normalizeButtonShortcut(config.fabShortcut);
        if (!shortcut || shortcut !== eventShortcut) {
            return false;
        }
        ev.preventDefault();
        this.fabOpen.value = !this.fabOpen.value;
        return true;
    }
    onAppKeydown(ev) {
        if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
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
        const layout = this.getResolvedShellLayout(region);
        return h('div', {
            style: this.getShellBarContainerStyle(region, layout),
        }, [
            h('div', { style: this.getShellBarSectionStyle(region, 'Start', layout) }, start ? (Array.isArray(start) ? start : [start]) : []),
            h('div', { style: this.getShellBarSectionStyle(region, 'Center', layout) }, center ? (Array.isArray(center) ? center : [center]) : []),
            h('div', { style: this.getShellBarSectionStyle(region, 'End', layout) }, end ? (Array.isArray(end) ? end : [end]) : []),
        ]);
    }
    renderShellBarSection(region, section) {
        if (this.compactShellLayout.value && region === 'header' && section === 'Start') {
            return this.renderMobileHeaderBrand();
        }
        if (this.compactShellLayout.value && region === 'header' && section === 'Center') {
            return undefined;
        }
        const items = this.compactShellLayout.value && region === 'header' && section === 'End'
            ? this.getCompactHeaderActionItems()
            : this.getShellBarSectionItems(region, section);
        if (items.length === 0) {
            return undefined;
        }
        const responsive = this.renderCompactShellOverflow(region, section, items);
        if (responsive) {
            return responsive;
        }
        return this.normalizeShellContent(items);
    }
    getShellBarSectionItems(region, section) {
        const key = `${region}${section}`;
        const render = this.options[key];
        if (!render) {
            return [];
        }
        const content = render(this);
        return Array.isArray(content) ? content : [content];
    }
    getCompactHeaderActionItems() {
        return [
            ...this.getShellBarSectionItems('header', 'Start'),
            ...this.getShellBarSectionItems('header', 'Center'),
            ...this.getShellBarSectionItems('header', 'End'),
        ];
    }
    getShellLayout(region) {
        return (region === 'header' ? this.params.value.headerLayout : this.params.value.footerLayout) || 'balanced';
    }
    getResolvedShellLayout(region) {
        const layout = this.getShellLayout(region);
        if (this.compactShellLayout.value && layout !== 'stacked') {
            if (region === 'header') {
                return 'auto';
            }
            return 'stacked';
        }
        return layout;
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
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'center',
                gap: '10px',
            };
        }
        const startWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Start')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
        const centerWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Center')) || 'auto';
        const endWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'End')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
        return {
            width: '100%',
            minHeight: '100%',
            display: 'grid',
            gridTemplateColumns: `${startWidth} ${centerWidth} ${endWidth}`,
            alignItems: 'center',
            gap: '16px',
        };
    }
    getShellBarSectionStyle(region, section, layout) {
        const justifyContent = section === 'Start' ? 'flex-start' : section === 'Center' ? 'center' : 'flex-end';
        const width = this.normalizeCssSize(this.getShellWidthValue(region, section));
        const compactHeaderSection = this.compactShellLayout.value && region === 'header';
        return {
            minWidth: 0,
            width: layout === 'stacked' ? '100%' : width,
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent,
            gap: '12px',
            flexWrap: compactHeaderSection ? 'nowrap' : 'wrap',
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
        var _a;
        const activeItem = (_a = this.getActiveStackItem()) === null || _a === void 0 ? void 0 : _a.item;
        const reserveFooterSpace = showFooter && !(activeItem instanceof Menu);
        return {
            position: 'relative',
            minHeight: '100%',
            paddingBottom: reserveFooterSpace ? '72px' : undefined,
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
    renderMobileHeaderBrand() {
        if (!this.compactShellLayout.value) {
            return undefined;
        }
        const title = this.params.value.mobileTitle || this.params.value.title || 'Application';
        const logo = this.params.value.mobileLogo;
        const h = this.$h;
        return h('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: 0,
                height: '100%',
            },
        }, [
            ...(logo ? [h('img', {
                    src: logo,
                    alt: title,
                    style: {
                        width: '28px',
                        height: '28px',
                        objectFit: 'contain',
                        flexShrink: 0,
                        borderRadius: '8px',
                    },
                })] : []),
            h('div', {
                style: {
                    minWidth: 0,
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
            }, title),
        ]);
    }
    renderCompactShellOverflow(region, section, items) {
        if (!this.compactShellLayout.value || region !== 'header' || section !== 'End') {
            return undefined;
        }
        const entries = items
            .map((item, index) => ({
            index,
            item,
            node: this.normalizeShellItem(item),
            priority: this.mobileShellPriority(item),
        }))
            .filter((entry) => !!entry.node);
        if (entries.length === 0) {
            return undefined;
        }
        const visible = entries
            .filter((entry) => this.resolveMobileShellLocation(entry.item) === 'header')
            .sort((a, b) => a.index - b.index);
        const visibleIndexes = new Set(visible.map((entry) => entry.index));
        const overflow = entries.filter((entry) => !visibleIndexes.has(entry.index)).sort((a, b) => a.index - b.index);
        const h = this.$h;
        return h('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '8px',
                width: '100%',
                height: '100%',
                minWidth: 0,
            },
        }, [
            ...visible.map((entry) => h('div', {
                style: {
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
            }, [entry.node])),
            ...(overflow.length > 0 ? [h('div', {
                    style: {
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }, [h(VBtn, {
                        icon: 'mdi-menu',
                        variant: 'text',
                        size: 'default',
                        title: 'Open header menu',
                        'aria-label': 'Open header menu',
                        style: {
                            height: '40px',
                            width: '40px',
                            minWidth: '40px',
                        },
                        onClick: () => {
                            this.mobileHeaderDrawerOpen.value = true;
                        },
                    })])] : []),
        ]);
    }
    resolveMobileShellLocation(item) {
        if (item instanceof UIBase) {
            const params = item.$params || {};
            if (params.mobileLocation === 'header' || params.mobileLocation === 'drawer') {
                return params.mobileLocation;
            }
        }
        return this.mobileShellPriority(item) >= 90 ? 'header' : 'drawer';
    }
    mobileShellPriority(item) {
        var _a;
        if (item instanceof UIBase) {
            const type = (_a = item.constructor) === null || _a === void 0 ? void 0 : _a.name;
            if (type === 'UserArea')
                return 100;
            if (type === 'MailboxBell')
                return 90;
            if (type === 'ShellIconAction')
                return 70;
            if (type === 'StatusBadge')
                return 30;
            if (type === 'EnvironmentTag')
                return 20;
            if (type === 'AppTitleBlock')
                return 10;
            return 50;
        }
        if (typeof item === 'string' || typeof item === 'number') {
            return 10;
        }
        return 40;
    }
    shouldHideShellItem(item) {
        if (!(item instanceof UIBase)) {
            return false;
        }
        const params = item.$params || {};
        if (this.compactShellLayout.value && params.hideOnMobile) {
            return true;
        }
        if (!this.compactShellLayout.value && params.hideOnNonMobile) {
            return true;
        }
        return false;
    }
    renderCompactHeaderDrawer(showHeader) {
        if (!showHeader || !this.compactShellLayout.value) {
            return undefined;
        }
        const sections = ['Start', 'Center', 'End']
            .map((section) => this.getShellBarSectionItems('header', section)
            .filter((item) => this.resolveMobileShellLocation(item) === 'drawer')
            .map((item) => this.normalizeShellItem(item))
            .filter((item) => !!item))
            .filter((items) => items.length > 0);
        if (sections.length === 0) {
            return undefined;
        }
        const h = this.$h;
        const sectionNodes = [];
        sections.forEach((nodes, index) => {
            if (index > 0) {
                sectionNodes.push(h(VDivider));
            }
            sectionNodes.push(h('div', {
                style: {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    minWidth: 0,
                },
            }, nodes.map((node) => h('div', {
                style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    minWidth: 0,
                },
            }, [node]))));
        });
        return h(VNavigationDrawer, {
            modelValue: this.mobileHeaderDrawerOpen.value,
            'onUpdate:modelValue': (value) => {
                this.mobileHeaderDrawerOpen.value = value;
            },
            location: 'right',
            temporary: true,
            width: 320,
            scrim: true,
        }, () => h('div', {
            style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            },
        }, [
            h('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    gap: '12px',
                },
            }, [
                h('div', {
                    style: {
                        fontSize: '1rem',
                        fontWeight: '700',
                    },
                }, 'Header Menu'),
                h(VBtn, {
                    icon: 'mdi-close',
                    variant: 'text',
                    size: 'small',
                    'aria-label': 'Close header menu',
                    onClick: () => {
                        this.mobileHeaderDrawerOpen.value = false;
                    },
                }),
            ]),
            h(VDivider),
            h(VCardText, {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: '16px',
                },
            }, () => sectionNodes),
        ]));
    }
    normalizeShellItem(item) {
        const h = this.$h;
        if (item === null || item === undefined || item === false) {
            return undefined;
        }
        if (this.shouldHideShellItem(item)) {
            return undefined;
        }
        if (item instanceof UIBase) {
            return h(item.component);
        }
        if (isVNode(item)) {
            return item;
        }
        return h('span', {}, String(item));
    }
    activateCurrentItem(index = this.index.value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.syncStackRefs();
            this.fabOpen.value = false;
            this.mobileHeaderDrawerOpen.value = false;
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
            this.mobileHeaderDrawerOpen.value = false;
            Dialogs.$showProgress({});
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
            Dialogs.$hideProgress();
        });
    }
    $getUDFs(objectType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.udfs)
                return yield this.options.udfs(this, objectType, this.params.value.udfQuery || {});
            try {
                const items = yield Api.instance.service('udfs').findAll({ query: Object.assign(Object.assign({ $sort: { sort: 1 }, inactive: { $ne: true } }, (this.params.value.udfQuery ? this.params.value.udfQuery : {})), { objectTypes: { $in: Array.isArray(objectType) ? objectType : [objectType] } }) });
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
        const itemId = Master.getItemId(options, Master.getDefaultIdField());
        return new Field(Object.assign(Object.assign({ type: fieldMaps[ftype] || ftype, label: options.fieldLabel, hint: options.hint, placeholder: options.placeholder, icon: options.icon, required: options.isRequired, multiple: options.multiple || false, storage: `udfs.${itemId}`, cols: (_a = options.gridSize) === null || _a === void 0 ? void 0 : _a.cols, xs: (_b = options.gridSize) === null || _b === void 0 ? void 0 : _b.xs, sm: (_c = options.gridSize) === null || _c === void 0 ? void 0 : _c.sm, md: (_d = options.gridSize) === null || _d === void 0 ? void 0 : _d.md, lg: (_e = options.gridSize) === null || _e === void 0 ? void 0 : _e.lg, xl: (_f = options.gridSize) === null || _f === void 0 ? void 0 : _f.xl, xxl: (_g = options.gridSize) === null || _g === void 0 ? void 0 : _g.xxl }, (options.defaultValue || options.defaultValue === 0 ? { default: options.defaultValue } : {})), (options.fieldType === 'text' && options.isAutoGen && mode && ['create', 'edit'].includes(mode) ? { readonly: !((_h = options.autoGenInfo) === null || _h === void 0 ? void 0 : _h.enableEdit), hint: 'Is Auto Generated', default: '<AUTO>' } : {})), {
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
            yield sleep(100);
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
            yield sleep(100);
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
            yield sleep(50);
            if (target.isConnected && typeof target.focus === 'function') {
                target.focus();
            }
        });
    }
    attachEventListeners() {
        super.attachEventListeners();
        this.attachShellLayoutBreakpoint();
        if (typeof window !== 'undefined' && !this.shortcutHandler) {
            this.shortcutHandler = (ev) => this.onAppKeydown(ev);
            window.addEventListener('keydown', this.shortcutHandler);
        }
    }
    removeEventListeners() {
        super.removeEventListeners();
        this.detachShellLayoutBreakpoint();
        this.disconnectFooterObserver();
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
    }
    syncShellLayoutBreakpoint(matches) {
        this.compactShellLayout.value = matches !== null && matches !== void 0 ? matches : (typeof window !== 'undefined' ? window.innerWidth < 960 : false);
        if (!this.compactShellLayout.value) {
            this.mobileHeaderDrawerOpen.value = false;
        }
    }
    attachShellLayoutBreakpoint() {
        if (typeof window === 'undefined' || this.shellLayoutMediaQuery) {
            return;
        }
        this.shellLayoutMediaQuery = window.matchMedia('(max-width: 959px)');
        this.syncShellLayoutBreakpoint(this.shellLayoutMediaQuery.matches);
        this.shellLayoutMediaHandler = (ev) => {
            this.syncShellLayoutBreakpoint(ev.matches);
        };
        if (typeof this.shellLayoutMediaQuery.addEventListener === 'function') {
            this.shellLayoutMediaQuery.addEventListener('change', this.shellLayoutMediaHandler);
        }
        else {
            this.shellLayoutMediaQuery.addListener(this.shellLayoutMediaHandler);
        }
    }
    detachShellLayoutBreakpoint() {
        if (!this.shellLayoutMediaQuery || !this.shellLayoutMediaHandler) {
            this.shellLayoutMediaQuery = undefined;
            this.shellLayoutMediaHandler = undefined;
            return;
        }
        if (typeof this.shellLayoutMediaQuery.removeEventListener === 'function') {
            this.shellLayoutMediaQuery.removeEventListener('change', this.shellLayoutMediaHandler);
        }
        else {
            this.shellLayoutMediaQuery.removeListener(this.shellLayoutMediaHandler);
        }
        this.shellLayoutMediaQuery = undefined;
        this.shellLayoutMediaHandler = undefined;
    }
    setFooterElement(el) {
        const root = el instanceof HTMLElement ? el : el === null || el === void 0 ? void 0 : el.$el;
        const element = root instanceof HTMLElement ? root : undefined;
        if (element === this.footerElement) {
            this.updateFooterHeight();
            return;
        }
        this.disconnectFooterObserver();
        this.footerElement = element;
        this.updateFooterHeight();
        if (typeof ResizeObserver !== 'undefined' && this.footerElement) {
            this.footerResizeObserver = new ResizeObserver(() => this.updateFooterHeight());
            this.footerResizeObserver.observe(this.footerElement);
        }
    }
    updateFooterHeight() {
        var _a;
        this.footerHeight.value = ((_a = this.footerElement) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
    }
    disconnectFooterObserver() {
        if (this.footerResizeObserver) {
            this.footerResizeObserver.disconnect();
            this.footerResizeObserver = undefined;
        }
        this.footerElement = undefined;
        this.footerHeight.value = 0;
    }
}
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
export const $APP = (params, options) => new AppMain(params || {}, options || {});
