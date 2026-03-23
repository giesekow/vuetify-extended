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
import { VAlert } from "vuetify/components";
import { Master } from "../master";
export class Collection extends UIBase {
    constructor(params, options) {
        super();
        this.selectedItems = [];
        this.currentIndex = 0;
        this.params = this.$makeRef(Object.assign(Object.assign({}, Collection.defaultParams), (params || {})));
        this.options = options || {};
        this.currentObject = this.$makeRef();
        this.prevState = undefined;
    }
    get $currentReport() {
        return this.currentReport;
    }
    get $currentTrigger() {
        return this.currentTrigger;
    }
    get $currentSelector() {
        return this.currentSelector;
    }
    static setDefault(value, reset) {
        if (reset) {
            Collection.defaultParams = value;
        }
        else {
            Collection.defaultParams = Object.assign(Object.assign({}, Collection.defaultParams), value);
        }
    }
    access(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this, mode) : true;
        });
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.readonly;
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
    render(props, context) {
        var _a, _b, _c;
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        if (((_a = this.currentObject) === null || _a === void 0 ? void 0 : _a.value) === 'trigger') {
            return this.buildTrigger(props, context);
        }
        if (((_b = this.currentObject) === null || _b === void 0 ? void 0 : _b.value) === 'report') {
            return [
                this.buildSelectionContext(),
                this.buildReport(props, context)
            ].filter((item) => item !== undefined);
        }
        if (((_c = this.currentObject) === null || _c === void 0 ? void 0 : _c.value) === 'selector') {
            return this.buildSelector(props, context);
        }
        return undefined;
    }
    buildSelectionContext() {
        const h = this.$h;
        const text = this.selectionContextText();
        if (!text) {
            return undefined;
        }
        return h(VAlert, {
            color: 'info',
            variant: 'tonal',
            density: 'comfortable',
            border: 'start',
            closable: false,
            style: {
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: 3000,
                maxWidth: '360px',
            }
        }, () => text);
    }
    selectionContextText() {
        var _a;
        const total = this.selectedItems.length;
        if (total <= 0) {
            return undefined;
        }
        if (((_a = this.currentObject) === null || _a === void 0 ? void 0 : _a.value) === 'report' && this.params.value.multiple) {
            return `Editing item ${this.currentIndex + 1} of ${total}`;
        }
        return undefined;
    }
    buildReport(props, context) {
        const h = this.$h;
        if (this.currentReport) {
            return h(this.currentReport.component);
        }
        return undefined;
    }
    buildTrigger(props, context) {
        const h = this.$h;
        if (this.currentTrigger) {
            return h(this.currentTrigger.component);
        }
        return undefined;
    }
    buildSelector(props, context) {
        const h = this.$h;
        if (this.currentSelector) {
            return h(this.currentSelector.component);
        }
        return undefined;
    }
    selector() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    trigger() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    report() {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentObject.value)
                return;
            if (this.params.value.mode === 'create') {
                yield this.showReport();
            }
            else {
                if (!(yield this.showTrigger())) {
                    yield this.showSelector();
                }
            }
        });
    }
    showSelector() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.currentSelector) {
                this.currentSelector = this.options.selector ? yield this.options.selector(this) : yield this.selector();
                if (this.currentSelector) {
                    this.currentSelector.$params.mode = this.params.value.mode;
                    this.currentSelector.on('selected', (item) => this.itemSelected(item));
                    this.currentSelector.on('cancel', () => this.onSelectorCancelled());
                    if (this.params.value.objectType && !this.currentSelector.$params.objectType)
                        this.currentSelector.$params.objectType = this.params.value.objectType;
                    this.currentObject.value = 'selector';
                    this.currentSelector.$params.returnObject = true;
                    this.currentSelector.$params.multiple = this.params.value.multiple;
                    this.currentSelector.show();
                }
            }
            else {
                this.currentSelector.$params.mode = this.params.value.mode;
                if (this.params.value.objectType && !this.currentSelector.$params.objectType)
                    this.currentSelector.$params.objectType = this.params.value.objectType;
                this.currentSelector.$params.returnObject = true;
                this.currentSelector.$params.multiple = this.params.value.multiple;
                this.currentObject.value = 'selector';
                this.currentSelector.show();
            }
        });
    }
    showTrigger() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.currentTrigger) {
                this.currentTrigger = this.options.trigger ? yield this.options.trigger(this) : yield this.trigger();
                if (this.currentTrigger) {
                    this.currentTrigger.$params.mode = this.params.value.mode;
                    this.currentTrigger.on('selected', (item) => this.triggerSelected(item));
                    this.currentTrigger.on('cancel', () => this.onTriggerCancelled());
                    if (this.params.value.objectType && !this.currentTrigger.$params.objectType)
                        this.currentTrigger.$params.objectType = this.params.value.objectType;
                    this.currentTrigger.$params.multiple = this.params.value.multiple;
                    this.currentObject.value = 'trigger';
                    this.currentTrigger.show();
                    return true;
                }
            }
            else {
                this.currentTrigger.$params.mode = this.params.value.mode;
                if (this.params.value.objectType && !this.currentTrigger.$params.objectType)
                    this.currentTrigger.$params.objectType = this.params.value.objectType;
                this.currentTrigger.$params.multiple = this.params.value.multiple;
                this.currentObject.value = 'trigger';
                this.currentTrigger.show();
                return true;
            }
        });
    }
    showReport(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentReport) {
                this.currentReport.removeEventListeners();
            }
            const rep = this.options.report ? yield this.options.report(this) : yield this.report();
            if (rep) {
                this.currentReport = rep;
                this.applySelectionContextToReport(this.currentReport);
                if (!this.currentReport.$params.mode && this.params.value.mode)
                    this.currentReport.$params.mode = this.params.value.mode;
                this.currentReport.$params.selected = item;
                if (!this.params.value.selectionOnly && item) {
                    this.currentReport.$params.objectId = Master.getItemId(item, this.params.value.idField);
                }
                if (this.params.value.mode === "create")
                    this.currentReport.$params.multiple = true;
                if (this.params.value.objectType && !this.currentReport.$params.objectType)
                    this.currentReport.$params.objectType = this.params.value.objectType;
                if (this.params.value.mode !== 'create' && this.params.value.multiple && this.currentIndex + 1 < this.selectedItems.length) {
                    this.currentReport.$params.editAfterSave = true;
                }
                else if (this.params.value.mode !== 'create' && this.params.value.multiple && this.selectedItems.length > 1) {
                    this.currentReport.$params.editAfterSave = false;
                }
                this.currentReport.on('saved', () => this.reportSaved(item));
                this.currentReport.on('cancel', () => this.reportCancelled());
                this.currentReport.on('finished', () => this.reportFinished());
                yield this.currentReport.loadObject();
                this.currentObject.value = 'report';
                this.currentReport.show();
            }
        });
    }
    applySelectionContextToReport(report) {
        const total = this.selectedItems.length;
        const baseTitle = report.$params.title || 'Collection Editor';
        if (this.params.value.multiple && total > 1) {
            report.$params.title = `${baseTitle} (${this.currentIndex + 1} of ${total})`;
        }
    }
    triggerSelected(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // for trigger items
            this.prevState = 'trigger';
            if (Array.isArray(item) && this.params.value.multiple) {
                this.selectedItems = item;
                this.currentIndex = 0;
                yield this.showReportWithIndex(this.currentIndex);
            }
            else {
                this.currentIndex = 0;
                this.selectedItems = [item];
                yield this.showReportWithIndex(this.currentIndex);
            }
            (_a = this.currentTrigger) === null || _a === void 0 ? void 0 : _a.hide();
        });
    }
    showReportWithIndex(index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (index < this.selectedItems.length) {
                this.currentReport = undefined;
                this.currentObject.value = undefined;
                yield this.showReport(this.selectedItems[index]);
                if (this.currentTrigger) {
                    this.currentTrigger.removeEventListeners();
                    this.currentTrigger = undefined;
                }
            }
        });
    }
    itemSelected(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.prevState = 'selector';
            if (Array.isArray(item) && this.params.value.multiple) {
                this.selectedItems = item;
                this.currentIndex = 0;
                yield this.showReportWithIndex(this.currentIndex);
            }
            else {
                this.currentIndex = 0;
                this.selectedItems = [item];
                yield this.showReportWithIndex(this.currentIndex);
            }
            (_a = this.currentSelector) === null || _a === void 0 ? void 0 : _a.hide();
        });
    }
    reportSaved(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.mode !== 'create' && this.params.value.multiple && this.currentIndex + 1 < this.selectedItems.length) {
                this.currentIndex += 1;
                this.showReportWithIndex(this.currentIndex);
            }
            else if (this.params.value.mode !== 'create') {
                this.reportCancelled();
            }
        });
    }
    reportCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.prevState === 'trigger') {
                return this.showTrigger();
            }
            if (this.prevState === 'selector') {
                return this.showSelector();
            }
            this.handleOn('cancel', this);
        });
    }
    reportFinished() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.mode === 'create') {
                this.selectedItems = [];
                this.currentIndex = 0;
                this.handleOn('cancel', this);
            }
        });
    }
    onSelectorCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedItems = [];
            this.currentIndex = 0;
            this.handleOn('cancel', this);
        });
    }
    onTriggerCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            this.selectedItems = [];
            this.currentIndex = 0;
            this.handleOn('cancel', this);
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide();
            if (this.currentObject.value === 'report') {
                this.reportCancelled();
            }
            else if (this.currentObject.value === 'selector') {
                this.onSelectorCancelled();
            }
            else if (this.currentObject.value === 'trigger') {
                this.onTriggerCancelled();
            }
            else {
                this.handleOn('cancel');
            }
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
Collection.defaultParams = {};
export const $COL = (params, options) => new Collection(params || {}, options || {});
