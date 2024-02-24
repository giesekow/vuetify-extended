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
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const lib_1 = require("./lib");
const appmanager_1 = require("./appmanager");
const dialogs_1 = require("./dialogs");
class Menu extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        this.loaded = this.$makeRef(false);
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
                ...this.childrenInstances.map((item) => h(components_1.VCol, {
                    cols: this.params.value.cols || 12,
                    lg: this.params.value.lg,
                    xs: this.params.value.xs,
                    md: this.params.value.md,
                    xl: this.params.value.xl,
                    xxl: this.params.value.xxl,
                    sm: this.params.value.sm,
                }, () => h(components_1.VCard, {
                    color: item.$params.color || 'primary',
                    elevation: 4,
                    maxWidth: this.params.value.maxWidth,
                    minWidth: this.params.value.minWidth,
                    width: this.params.value.width,
                    class: ['mx-auto'],
                    onClick: () => {
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
                    subtitle: () => h('span', item.$params.subText)
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
                    if (yield collection.access()) {
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
                    if (yield report.access()) {
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
class MenuItem extends lib_1.EventEmitter {
    constructor(params, options) {
        super();
        this.params = params || {};
        this.$id = Symbol('id');
        this.options = options || {};
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
const $MN = (params, options) => new Menu(params || {}, options || {});
exports.$MN = $MN;
const $MI = (params, options) => new MenuItem(params || {}, options || {});
exports.$MI = $MI;
