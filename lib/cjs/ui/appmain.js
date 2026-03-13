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
const base_1 = require("./base");
const misc_1 = require("../misc");
const dialogs_1 = require("./dialogs");
const field_1 = require("./field");
const api_1 = require("../api");
class AppMain extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, AppMain.defaultParams), (params || {})));
        this.options = options || {};
        this.stack = [];
        this.loaded = this.$makeRef(false);
        this.index = this.$makeRef(-1);
        this.selectorCount = this.$makeRef(0);
        this.dialogCount = this.$makeRef(0);
        this.selectors = [];
        this.dialogs = [];
        this.selectorFocusTargets = new Map();
        this.dialogFocusTargets = new Map();
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
        else if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
            return [
                ...this.selectors.map((s) => h(s.component)),
                ...this.dialogs.map((d) => h(d.component))
            ];
        }
        return undefined;
    }
    activateCurrentItem(index = this.index.value) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield this.activateCurrentItem();
            }
            else if (rem >= this.stack.length) {
                this.loadApp();
            }
        });
    }
    onCancel(item) {
        return __awaiter(this, void 0, void 0, function* () {
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
}
exports.AppMain = AppMain;
AppMain.defaultParams = {};
const $APP = (params, options) => new AppMain(params || {}, options || {});
exports.$APP = $APP;
