var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UIBase } from "./base";
import { VAvatar, VBtn, VCard, VCardTitle, VCol, VContainer, VIcon, VLayout, VListItem, VRow } from 'vuetify/components';
import { EventEmitter } from "./lib";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
export class Menu extends UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.params = this.$makeRef(Object.assign(Object.assign({}, Menu.defaultParams), (params || {})));
        this.options = options || {};
        this.loaded = this.$makeRef(false);
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
        return h(VContainer, {
            class: ['fill-height'],
        }, () => h(VLayout, {
            fullHeight: true
        }, () => h(VRow, {
            alignContent: "center",
        }, () => h(VCol, {
            class: ['mx-auto'],
            cols: this.params.value.containerCols || 12,
            lg: this.params.value.containerLg,
            xs: this.params.value.containerXs,
            md: this.params.value.containerMd,
            xl: this.params.value.containerXl,
            xxl: this.params.value.containerXxl,
            sm: this.params.value.containerSm,
        }, () => this.build(props, context)))));
    }
    build(props, context) {
        const h = this.$h;
        return this.$h(VRow, {
            justify: this.params.value.justify || 'center',
            align: this.params.value.align || 'center',
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent || 'center',
        }, () => {
            const title = h(VCol, {
                align: 'center',
                cols: 12,
            }, () => h('div', {
                class: ['text-h4']
            }, this.params.value.title || ''));
            const backTop = h(VCol, {
                align: 'center',
                cols: 12,
            }, () => h(VBtn, {
                icon: true,
                variant: 'plain',
                color: 'error',
                class: ['text-h6'],
                onClick: () => {
                    this.backClicked();
                }
            }, () => h(VIcon, {}, () => 'mdi-backspace')));
            const back = h(VCol, {
                align: 'center',
                cols: 12,
            }, () => h(VBtn, {
                icon: true,
                variant: 'plain',
                color: 'error',
                class: ['text-h6'],
                onClick: () => {
                    this.backClicked();
                }
            }, () => h(VIcon, {}, () => 'mdi-backspace')));
            if (!this.loaded.value) {
                this.prepareChildren();
                return title;
            }
            return [
                title,
                ...(this.hasParent() && this.childrenInstances.length > 6 ? [backTop] : []),
                ...this.childrenInstances.map((item) => h(VCol, {
                    cols: this.params.value.cols || 12,
                    lg: this.params.value.lg,
                    xs: this.params.value.xs,
                    md: this.params.value.md,
                    xl: this.params.value.xl,
                    xxl: this.params.value.xxl,
                    sm: this.params.value.sm,
                }, () => h(VCard, {
                    color: item.$params.color || 'primary',
                    elevation: 4,
                    maxWidth: this.params.value.maxWidth,
                    minWidth: this.params.value.minWidth,
                    width: this.params.value.width,
                    class: ['mx-auto'],
                    onClick: () => {
                        this.itemClicked(item);
                    }
                }, () => h(VCardTitle, {
                    class: ['pa-0'],
                }, () => h(VListItem, {
                    lines: 'two',
                    class: ['py-0', 'my-0']
                }, {
                    prepend: () => h(VAvatar, {}, () => h(VIcon, {
                        color: item.$params.textColor || 'white'
                    }, () => item.$params.icon || '')),
                    title: () => h('span', {
                        class: ['text-h6']
                    }, item.$params.text),
                    subtitle: () => h('span', item.$params.subText),
                    append: () => item.$params.shortcut ? h('span', {
                        class: ['text-caption', 'text-medium-emphasis']
                    }, item.$params.shortcut) : undefined,
                }))))),
                ...(this.hasParent() ? [back] : [])
            ];
        });
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
            this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
            });
            this.loaded.value = true;
        });
    }
    itemClicked(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const mode = item.$params.mode;
            if (item.$params.action === 'menu') {
                const menu = yield item.menu(mode);
                if (menu) {
                    if (yield menu.access()) {
                        menu.setParent(this);
                        AppManager.showMenu(menu);
                    }
                    else {
                        Dialogs.$error("access denied!");
                    }
                }
            }
            if (item.$params.action === 'collection') {
                const collection = yield item.collection();
                if (collection) {
                    if (yield collection.access(item.$params.mode)) {
                        collection.$params.mode = item.$params.mode;
                        AppManager.showCollection(collection);
                    }
                    else {
                        Dialogs.$error("access denied!");
                    }
                }
            }
            if (item.$params.action === 'report') {
                const report = yield item.report();
                if (report) {
                    if (yield report.access(item.$params.mode)) {
                        report.$params.mode = item.$params.mode;
                        AppManager.showReport(report);
                    }
                    else {
                        Dialogs.$error("access denied!");
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
        if (Dialogs.hasBlockingDialog() || ev.defaultPrevented || ev.repeat || this.shouldIgnoreShortcut(ev)) {
            return;
        }
        const eventShortcut = this.normalizeShortcutFromEvent(ev);
        if (!eventShortcut) {
            return;
        }
        for (const item of this.childrenInstances) {
            const itemShortcut = this.normalizeShortcut(item.$params.shortcut);
            if (!itemShortcut || itemShortcut !== eventShortcut) {
                continue;
            }
            ev.preventDefault();
            this.itemClicked(item);
            return;
        }
        if (eventShortcut === 'escape' && this.hasParent()) {
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
    normalizeShortcut(shortcut) {
        if (!shortcut) {
            return undefined;
        }
        const tokens = shortcut
            .split('+')
            .map((token) => token.trim().toLowerCase())
            .filter((token) => token !== '');
        if (tokens.length === 0) {
            return undefined;
        }
        let ctrl = false;
        let alt = false;
        let shift = false;
        let meta = false;
        let key;
        for (const token of tokens) {
            if (['ctrl', 'control'].includes(token)) {
                ctrl = true;
                continue;
            }
            if (['alt', 'option'].includes(token)) {
                alt = true;
                continue;
            }
            if (token === 'shift') {
                shift = true;
                continue;
            }
            if (['cmd', 'command', 'meta'].includes(token)) {
                meta = true;
                continue;
            }
            key = this.normalizeShortcutKey(token);
        }
        if (!key) {
            return undefined;
        }
        return `${ctrl ? 'ctrl+' : ''}${alt ? 'alt+' : ''}${shift ? 'shift+' : ''}${meta ? 'meta+' : ''}${key}`;
    }
    normalizeShortcutFromEvent(ev) {
        const key = this.normalizeShortcutKey(ev.key);
        if (!key) {
            return undefined;
        }
        return `${ev.ctrlKey ? 'ctrl+' : ''}${ev.altKey ? 'alt+' : ''}${ev.shiftKey ? 'shift+' : ''}${ev.metaKey ? 'meta+' : ''}${key}`;
    }
    normalizeShortcutKey(key) {
        if (!key) {
            return undefined;
        }
        const normalized = key.trim().toLowerCase();
        const aliases = {
            esc: 'escape',
            return: 'enter',
            ' ': 'space',
            spacebar: 'space',
            left: 'arrowleft',
            right: 'arrowright',
            up: 'arrowup',
            down: 'arrowdown',
            del: 'delete',
        };
        return aliases[normalized] || normalized;
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
Menu.defaultParams = {};
export class MenuItem extends EventEmitter {
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
MenuItem.defaultParams = {};
export const $MN = (params, options) => new Menu(params || {}, options || {});
export const $MI = (params, options) => new MenuItem(params || {}, options || {});
