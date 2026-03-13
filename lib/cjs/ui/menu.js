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
exports.$MI = exports.$MN = exports.MenuItem = exports.Menu = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const lib_1 = require("./lib");
const appmanager_1 = require("./appmanager");
const dialogs_1 = require("./dialogs");
const shortcut_1 = require("./shortcut");
class Menu extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.cardElements = [];
        this.params = this.$makeRef(Object.assign(Object.assign({}, Menu.defaultParams), (params || {})));
        this.options = options || {};
        this.loaded = this.$makeRef(false);
        this.activeIndex = this.$makeRef(-1);
    }
    static setDefault(value, reset) {
        if (reset) {
            Menu.defaultParams = value;
        }
        else {
            Menu.defaultParams = Object.assign(Object.assign({}, Menu.defaultParams), value);
        }
    }
    get $ref() {
        return this.params.value.ref;
    }
    access() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this) : true;
        });
    }
    hasParent() {
        return this.$parent ? true : false;
    }
    setParent(parent) {
        super.setParent(parent);
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    props() {
        return [];
    }
    children() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    render(props, context) {
        const h = this.$h;
        return h(components_1.VContainer, {
            class: ['fill-height'],
        }, () => h(components_1.VLayout, {
            fullHeight: true
        }, () => h(components_1.VRow, {
            alignContent: "center",
        }, () => h(components_1.VCol, {
            class: ['mx-auto'],
            cols: this.params.value.containerCols || 12,
            lg: this.params.value.containerLg,
            xs: this.params.value.containerXs,
            md: this.params.value.containerMd,
            xl: this.params.value.containerXl,
            xxl: this.params.value.containerXxl,
            sm: this.params.value.containerSm,
            style: { paddingTop: '16px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px', overflow: 'visible' },
        }, () => this.build(props, context)))));
    }
    build(props, context) {
        const h = this.$h;
        return this.$h(components_1.VRow, {
            justify: this.params.value.justify || 'center',
            align: this.params.value.align || 'center',
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent || 'center',
        }, () => {
            const title = h(components_1.VCol, {
                align: 'center',
                cols: 12,
            }, () => h('div', {
                class: ['text-h4']
            }, this.params.value.title || ''));
            const backTop = h(components_1.VCol, {
                align: 'center',
                cols: 12,
            }, () => h(components_1.VBtn, {
                icon: true,
                variant: 'plain',
                color: 'error',
                class: ['text-h6'],
                onClick: () => {
                    this.backClicked();
                }
            }, () => h(components_1.VIcon, {}, () => 'mdi-backspace')));
            const back = h(components_1.VCol, {
                align: 'center',
                cols: 12,
            }, () => h(components_1.VBtn, {
                icon: true,
                variant: 'plain',
                color: 'error',
                class: ['text-h6'],
                onClick: () => {
                    this.backClicked();
                }
            }, () => h(components_1.VIcon, {}, () => 'mdi-backspace')));
            if (!this.loaded.value) {
                this.prepareChildren();
                return title;
            }
            return [
                title,
                ...(this.hasParent() && this.childrenInstances.length > 6 ? [backTop] : []),
                ...this.childrenInstances.map((item, index) => h(components_1.VCol, {
                    cols: this.params.value.cols || 12,
                    lg: this.params.value.lg,
                    xs: this.params.value.xs,
                    md: this.params.value.md,
                    xl: this.params.value.xl,
                    xxl: this.params.value.xxl,
                    sm: this.params.value.sm,
                    style: { overflow: 'visible' },
                }, () => h(components_1.VCard, {
                    ref: (el) => this.setCardElement(index, el),
                    color: item.$params.color || 'primary',
                    elevation: 4,
                    maxWidth: this.params.value.maxWidth,
                    minWidth: this.params.value.minWidth,
                    width: this.params.value.width,
                    class: ['mx-auto'],
                    role: 'button',
                    tabindex: this.params.value.keyboardNavigation ? -1 : undefined,
                    'aria-selected': this.params.value.keyboardNavigation ? index === this.activeIndex.value : undefined,
                    style: this.menuCardStyle(index),
                    onMouseenter: () => this.setActiveIndex(index),
                    onClick: () => {
                        this.setActiveIndex(index);
                        this.itemClicked(item);
                    }
                }, () => h(components_1.VCardTitle, {
                    class: ['pa-0'],
                }, () => h(components_1.VListItem, {
                    lines: 'two',
                    class: ['py-0', 'my-0']
                }, {
                    prepend: () => h(components_1.VAvatar, {}, () => h(components_1.VIcon, {
                        color: item.$params.textColor || 'white'
                    }, () => item.$params.icon || '')),
                    title: () => h('span', {
                        class: ['text-h6']
                    }, item.$params.text),
                    subtitle: () => h('span', item.$params.subText),
                    append: () => this.renderMenuItemShortcut(item),
                }))))),
                ...(this.hasParent() ? [back] : [])
            ];
        });
    }
    renderMenuItemShortcut(item) {
        const h = this.$h;
        const displayShortcut = (0, shortcut_1.describeShortcut)(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
        if (!displayShortcut) {
            return undefined;
        }
        if (item.$params.shortcutDisplay === 'compact') {
            return h('span', {
                class: ['text-caption'],
                title: displayShortcut.label,
                'aria-label': displayShortcut.label,
                'aria-keyshortcuts': displayShortcut.label,
                style: {
                    opacity: '0.82',
                    fontWeight: '600',
                    fontSize: item.$params.shortcutFontSize || '0.8rem',
                    lineHeight: '1.5',
                    letterSpacing: '0.03em',
                    padding: '1px 1px',
                    border: '1px solid currentColor',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0',
                    minWidth: (displayShortcut.shift || displayShortcut.meta) ? '2.4em' : '1.8em',
                    whiteSpace: 'nowrap',
                },
            }, [
                ...(displayShortcut.meta ? [
                    h(components_1.VIcon, {
                        icon: 'mdi-apple-keyboard-command',
                        size: '1.05em',
                        style: {
                            opacity: '1',
                            marginRight: displayShortcut.shift ? '-0.3em' : '-0.15em',
                            marginLeft: '-0.05em',
                        },
                    }),
                ] : []),
                ...(displayShortcut.shift ? [
                    h(components_1.VIcon, {
                        icon: item.$params.shortcutShiftIcon || 'mdi-arrow-up-thin',
                        size: '1.5em',
                        style: {
                            opacity: '1',
                            marginRight: '-0.8em',
                            marginLeft: '-0.2em',
                        },
                    }),
                ] : []),
                h('span', {
                    style: {
                        textDecorationLine: [displayShortcut.ctrl ? 'underline' : '', displayShortcut.alt ? 'overline' : ''].filter(Boolean).join(' ') || 'none',
                        textDecorationThickness: (displayShortcut.ctrl || displayShortcut.alt) ? '1px' : undefined,
                        textUnderlineOffset: displayShortcut.ctrl ? '1px' : undefined,
                        textDecorationSkipInk: 'none',
                        textDecorationColor: 'currentColor',
                        display: 'inline-block',
                        minWidth: '1.8em',
                        textAlign: 'center',
                        paddingTop: displayShortcut.alt ? '2px' : undefined,
                    },
                }, displayShortcut.key),
            ]);
        }
        return h('span', {
            class: ['text-caption'],
            title: displayShortcut.label,
            'aria-label': displayShortcut.label,
            'aria-keyshortcuts': displayShortcut.label,
            style: {
                fontWeight: '500',
                fontSize: item.$params.shortcutFontSize || '0.5rem',
                letterSpacing: '0.02em',
                color: 'inherit',
                opacity: '1',
            },
        }, displayShortcut.label);
    }
    prepareChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded.value = false;
            this.childrenInstances.forEach((instance) => {
                instance.removeEventListeners();
            });
            this.childrenInstances = [];
            const ch = this.options.children ? yield this.options.children(this) : yield this.children();
            const filtered = [];
            for (let c = 0; c < ch.length; c++) {
                if (yield ch[c].access()) {
                    filtered.push(ch[c]);
                }
                else {
                    ch[c].removeEventListeners();
                }
            }
            this.childrenInstances = filtered;
            this.cardElements = new Array(this.childrenInstances.length);
            this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
            });
            if (this.childrenInstances.length === 0) {
                this.activeIndex.value = -1;
            }
            else if (this.activeIndex.value < 0 || this.activeIndex.value >= this.childrenInstances.length) {
                this.activeIndex.value = 0;
            }
            this.loaded.value = true;
            void this.ensureActiveCardVisible();
        });
    }
    menuCardStyle(index) {
        if (!this.params.value.keyboardNavigation || index !== this.activeIndex.value) {
            return undefined;
        }
        return {
            border: '5px solid rgba(255,255,255,0.99)',
            borderRadius: '12px',
            boxSizing: 'border-box',
            boxShadow: '0 0 0 3px rgba(13, 17, 23, 0.94), 0 0 0 10px rgba(255,255,255,0.16), 0 18px 36px rgba(0,0,0,0.34)',
            transform: 'translateY(-3px) scale(1.015)',
            filter: 'saturate(1.12) brightness(1.08) contrast(1.04)',
            transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease, filter 120ms ease',
        };
    }
    setCardElement(index, el) {
        const root = el instanceof HTMLElement ? el : el === null || el === void 0 ? void 0 : el.$el;
        this.cardElements[index] = root instanceof HTMLElement ? root : undefined;
    }
    setActiveIndex(index) {
        if (!this.params.value.keyboardNavigation) {
            return;
        }
        if (index < 0 || index >= this.childrenInstances.length) {
            return;
        }
        this.activeIndex.value = index;
        void this.ensureActiveCardVisible();
    }
    ensureActiveCardVisible() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.params.value.keyboardNavigation) {
                return;
            }
            yield (0, vue_1.nextTick)();
            const el = this.cardElements[this.activeIndex.value];
            (_a = el === null || el === void 0 ? void 0 : el.scrollIntoView) === null || _a === void 0 ? void 0 : _a.call(el, { block: 'nearest', inline: 'nearest', behavior: 'smooth' });
        });
    }
    activateCurrentItem() {
        if (!this.params.value.keyboardNavigation) {
            return false;
        }
        const item = this.childrenInstances[this.activeIndex.value];
        if (!item) {
            return false;
        }
        void this.itemClicked(item);
        return true;
    }
    moveActiveIndex(direction) {
        if (!this.params.value.keyboardNavigation || this.childrenInstances.length === 0) {
            return false;
        }
        if (this.activeIndex.value < 0 || !this.cardElements[this.activeIndex.value]) {
            this.setActiveIndex(0);
            return true;
        }
        const currentEl = this.cardElements[this.activeIndex.value];
        if (!currentEl) {
            this.setActiveIndex(0);
            return true;
        }
        const currentRect = currentEl.getBoundingClientRect();
        const currentCenterX = currentRect.left + currentRect.width / 2;
        const currentCenterY = currentRect.top + currentRect.height / 2;
        let bestIndex = -1;
        let bestScore = Number.POSITIVE_INFINITY;
        for (let index = 0; index < this.cardElements.length; index++) {
            if (index === this.activeIndex.value) {
                continue;
            }
            const el = this.cardElements[index];
            if (!el) {
                continue;
            }
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = centerX - currentCenterX;
            const deltaY = centerY - currentCenterY;
            if (direction === 'left' && deltaX >= -4)
                continue;
            if (direction === 'right' && deltaX <= 4)
                continue;
            if (direction === 'up' && deltaY >= -4)
                continue;
            if (direction === 'down' && deltaY <= 4)
                continue;
            const horizontal = direction === 'left' || direction === 'right';
            const primary = horizontal ? Math.abs(deltaX) : Math.abs(deltaY);
            const secondary = horizontal ? Math.abs(deltaY) : Math.abs(deltaX);
            const score = primary * 1000 + secondary;
            if (score < bestScore) {
                bestScore = score;
                bestIndex = index;
            }
        }
        if (bestIndex >= 0) {
            this.setActiveIndex(bestIndex);
            return true;
        }
        if (this.childrenInstances.length > 0) {
            if (direction === 'left' || direction === 'up') {
                this.setActiveIndex(this.childrenInstances.length - 1);
                return true;
            }
            if (direction === 'right' || direction === 'down') {
                this.setActiveIndex(0);
                return true;
            }
        }
        return false;
    }
    itemClicked(item) {
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
                        dialogs_1.Dialogs.$error("access denied!");
                    }
                }
            }
            if (item.$params.action === 'collection') {
                const collection = yield item.collection();
                if (collection) {
                    if (yield collection.access(item.$params.mode)) {
                        collection.$params.mode = item.$params.mode;
                        appmanager_1.AppManager.showCollection(collection);
                    }
                    else {
                        dialogs_1.Dialogs.$error("access denied!");
                    }
                }
            }
            if (item.$params.action === 'report') {
                const report = yield item.report();
                if (report) {
                    if (yield report.access(item.$params.mode)) {
                        report.$params.mode = item.$params.mode;
                        appmanager_1.AppManager.showReport(report);
                    }
                    else {
                        dialogs_1.Dialogs.$error("access denied!");
                    }
                }
            }
            if (item.$params.action === 'function') {
                item.callback();
            }
        });
    }
    backClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleOn('cancel', this);
        });
    }
    $reload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prepareChildren();
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide();
            this.backClicked();
        });
    }
    setup(props, context) {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    attachEventListeners() {
        super.attachEventListeners();
        if (typeof window === 'undefined' || this.shortcutHandler) {
            return;
        }
        this.shortcutHandler = (ev) => this.onShortcutKeydown(ev);
        window.addEventListener('keydown', this.shortcutHandler);
    }
    removeEventListeners() {
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
        super.removeEventListeners();
    }
    onShortcutKeydown(ev) {
        if (dialogs_1.Dialogs.hasBlockingDialog() || ev.defaultPrevented || ev.repeat || this.shouldIgnoreShortcut(ev)) {
            return;
        }
        if (this.params.value.keyboardNavigation) {
            if (ev.key === 'ArrowLeft' && this.moveActiveIndex('left')) {
                ev.preventDefault();
                return;
            }
            if (ev.key === 'ArrowRight' && this.moveActiveIndex('right')) {
                ev.preventDefault();
                return;
            }
            if (ev.key === 'ArrowUp' && this.moveActiveIndex('up')) {
                ev.preventDefault();
                return;
            }
            if (ev.key === 'ArrowDown' && this.moveActiveIndex('down')) {
                ev.preventDefault();
                return;
            }
            if (ev.key === 'Home' || ev.key === 'PageUp') {
                ev.preventDefault();
                this.setActiveIndex(0);
                return;
            }
            if (ev.key === 'End' || ev.key === 'PageDown') {
                ev.preventDefault();
                this.setActiveIndex(Math.max(this.childrenInstances.length - 1, 0));
                return;
            }
            if ((ev.key === 'Enter' || ev.key === ' ') && this.activateCurrentItem()) {
                ev.preventDefault();
                return;
            }
        }
        for (const item of this.childrenInstances) {
            const eventShortcut = (0, shortcut_1.normalizeShortcutFromEvent)(ev, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
            if (!eventShortcut) {
                continue;
            }
            const itemShortcut = (0, shortcut_1.normalizeShortcut)(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
            if (!itemShortcut || itemShortcut !== eventShortcut) {
                continue;
            }
            ev.preventDefault();
            this.setActiveIndex(this.childrenInstances.indexOf(item));
            this.itemClicked(item);
            return;
        }
        if ((0, shortcut_1.normalizeShortcutFromEvent)(ev) === 'escape' && this.hasParent()) {
            ev.preventDefault();
            this.backClicked();
        }
    }
    shouldIgnoreShortcut(ev) {
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
exports.Menu = Menu;
Menu.defaultParams = {
    keyboardNavigation: true,
};
class MenuItem extends lib_1.EventEmitter {
    constructor(params, options) {
        super();
        this.params = Object.assign(Object.assign({}, MenuItem.defaultParams), (params || {}));
        this.$id = Symbol('id');
        this.options = options || {};
    }
    static setDefault(value, reset) {
        if (reset) {
            MenuItem.defaultParams = value;
        }
        else {
            MenuItem.defaultParams = Object.assign(Object.assign({}, MenuItem.defaultParams), value);
        }
    }
    get $params() {
        return this.params;
    }
    setParent(menu) {
        this.parent = menu;
    }
    getParent() {
        return this.parent;
    }
    access(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this, mode) : true;
        });
    }
    report(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.report ? yield this.options.report(this, mode) : undefined;
        });
    }
    collection(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.collection ? yield this.options.collection(this, mode) : undefined;
        });
    }
    menu(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.menu ? yield this.options.menu(this, mode) : undefined;
        });
    }
    callback(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.callback)
                yield this.options.callback(this, mode);
        });
    }
    attachEventListeners() { }
    removeEventListeners() { }
    setup(props, context) {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
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
exports.MenuItem = MenuItem;
MenuItem.defaultParams = {
    cmdForCtrlOnMac: true,
};
const $MN = (params, options) => new Menu(params || {}, options || {});
exports.$MN = $MN;
const $MI = (params, options) => new MenuItem(params || {}, options || {});
exports.$MI = $MI;
