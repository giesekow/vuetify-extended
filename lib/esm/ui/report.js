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
import { VDivider, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VLayout, VCol, VRow, VContainer } from 'vuetify/components';
import { Master } from "../master";
import { Button } from "./button";
import { $excel, computeFunctionalCodeAsync, sleep } from "../misc";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
export class Report extends UIBase {
    constructor(params, options) {
        super();
        this.loaded = false;
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.hasNext = false;
        this.hasPrev = false;
        this.listenersAttached = false;
        this.params = this.$makeRef(Object.assign(Object.assign({}, Report.defaultParams), (params || {})));
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master) {
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
        }
        else {
            this.setMaster(new Master({ type: this.params.value.objectType, id: this.params.value.objectId }));
        }
        this.hasAccess = this.$makeRef(true);
        this.hasPrintAccess = this.$makeRef(true);
        this.hasExportAccess = this.$makeRef(true);
        this.currentIndex = this.$makeRef(-1);
        this.currentForm = undefined;
        this.lastProps = null;
        this.lastContext = null;
        this.cleanSnapshot = this.snapshotMasterData();
    }
    static setDefault(value, reset) {
        if (reset) {
            Report.defaultParams = value;
        }
        else {
            Report.defaultParams = Object.assign(Object.assign({}, Report.defaultParams), value);
        }
    }
    get $parentReport() {
        return this;
    }
    get $prefs() {
        var _a;
        return ((_a = this.currentForm) === null || _a === void 0 ? void 0 : _a.$prefs) || {};
    }
    get $currentForm() {
        return this.currentForm;
    }
    get $refs() {
        var _a;
        return ((_a = this.currentForm) === null || _a === void 0 ? void 0 : _a.$refs) || {};
    }
    get objectType() {
        return this.params.value.objectType;
    }
    get objectId() {
        return this.params.value.objectId;
    }
    set objectType(v) {
        this.params.value.objectType = v;
        if (this.$master) {
            this.$master.$type = v;
        }
    }
    set objectId(v) {
        this.params.value.objectId = v;
        if (this.$master) {
            this.$master.$id = v;
        }
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    get $access() {
        return this.hasAccess.value;
    }
    initialize(props, context) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded = true;
            yield this.runAccess();
            if (this.hasAccess.value) {
                yield this.prepareForm(props, context, 0);
                yield this.loadObject();
                yield this.focusCurrentForm();
            }
        });
    }
    runAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.hasAccess.value = (yield this.access(this.$params.mode)) || false;
            }
            catch (error) {
                this.hasAccess.value = false;
            }
            try {
                this.hasPrintAccess.value = (yield this.access('print')) || false;
            }
            catch (error) {
                this.hasPrintAccess.value = false;
            }
            try {
                this.hasExportAccess.value = (yield this.access('export')) || false;
            }
            catch (error) {
                this.hasExportAccess.value = false;
            }
        });
    }
    loadObject() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleOn('before-loaded', this);
            if (this.$master) {
                this.$master.$id = this.params.value.objectId;
                this.$master.$type = this.params.value.objectType;
                yield this.$master.$load();
            }
            this.captureCleanState();
            if (this.options.loaded) {
                this.options.loaded(this);
            }
            this.handleOn('loaded', this);
        });
    }
    saved() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    access(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this, mode) : true;
        });
    }
    form(props, context, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return undefined;
        });
    }
    hasForm(props, context, index) {
        return __awaiter(this, void 0, void 0, function* () {
            return index < (this.params.value.forms || 1);
        });
    }
    hasPrevForm(props, context, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.hasPrevForm)
                return yield this.options.hasPrevForm(this, index);
            if (index <= 0)
                return false;
            return this.options.hasForm ? yield this.options.hasForm(props, context, index - 1) : yield this.hasForm(props, context, index - 1);
        });
    }
    hasNextForm(props, context, index) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.hasNextForm)
                return yield this.options.hasNextForm(this, index);
            return this.options.hasForm ? yield this.options.hasForm(props, context, index + 1) : yield this.hasForm(props, context, index + 1);
        });
    }
    props() {
        return [];
    }
    render(props, context) {
        const h = this.$h;
        this.lastProps = props;
        this.lastContext = context;
        if (!this.loaded) {
            this.initialize(props, context);
        }
        if (this.currentIndex.value === -1 || !this.hasAccess.value) {
            return h(VContainer, {
                fluid: this.params.value.fluid,
                class: ['fill-height'],
            }, () => h(VLayout, {
                fullHeight: true,
            }, () => h(VRow, {
                alignContent: this.params.value.verticalAlign,
            }, () => h(VCol, {
                cols: 12,
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined
            }, () => h(VCard, {
                minWidth: 400,
                class: (this.params.value.horizontalAlign || "center") === "center" ? ['mx-auto'] : []
            }, () => [
                this.buildTitle(props, context),
                this.buildTopActions(props, context),
                h(VDivider),
                this.buildBody(props, context),
                h(VDivider),
                this.buildBottomActions(props, context),
            ])))));
        }
        if (this.currentForm) {
            return h(VContainer, {
                fluid: this.params.value.fluid,
                class: ['fill-height'],
            }, () => h(VLayout, {
                fullHeight: true,
            }, () => h(VRow, {
                alignContent: this.params.value.verticalAlign,
            }, () => h(VCol, {
                cols: 12,
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined
            }, () => {
                if ((this.params.value.horizontalAlign || "center") === "center")
                    this.currentForm.$params.cardClass = ['mx-auto'];
                return h(this.currentForm.component);
            }))));
        }
        return h('div');
    }
    prepareForm(props, context, index) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loaded = true;
            const hasForm = this.options.hasForm ? yield this.options.hasForm(props, context, index) : yield this.hasForm(props, context, index);
            if (hasForm) {
                const hasNext = yield this.hasNextForm(props, context, index);
                this.hasNext = hasNext || false;
                if (index <= 0) {
                    this.hasPrev = false;
                }
                else {
                    const hasPrev = yield this.hasPrevForm(props, context, index);
                    this.hasPrev = hasPrev || false;
                }
                const newForm = this.options.form ? yield this.options.form(props, context, index) : yield this.form(props, context, index);
                if (newForm) {
                    newForm.setParent(this);
                    newForm.$params.sub = this.hasNext;
                    newForm.$params.auto = newForm.$params.auto === undefined ? this.hasNext : newForm.$params.auto;
                    newForm.$params.mode = this.params.value.mode;
                    if (this.params.value.title && !newForm.$params.subtitle) {
                        newForm.$params.subtitle = newForm.$params.title;
                        newForm.$params.title = this.options.title ? this.options.title(this, index) : this.params.value.title;
                    }
                    this.applyStepSubtitle(newForm, index);
                    if (this.params.value.setActionButtons || this.params.value.setActionButtons === undefined) {
                        newForm.$params.cancelButton = Object.assign(Object.assign({ text: 'Cancel', color: 'warning', variant: this.params.value.cancelButtonStyle || 'text' }, (this.params.value.cancelButton || {})), (newForm.$params.cancelButton || {}));
                        if (this.hasNext) {
                            newForm.$params.saveButton = Object.assign(Object.assign({ text: 'Next', color: 'primary', variant: this.params.value.nextButtonStyle || 'elevated' }, (this.params.value.nextButton || {})), (newForm.$params.saveButton || {}));
                        }
                        else {
                            newForm.$params.showSaveInReadonly = true;
                            const finalAction = this.params.value.mode === 'display'
                                ? {
                                    text: 'Finish',
                                    color: 'primary',
                                    variant: this.params.value.finishButtonStyle || 'elevated',
                                }
                                : {
                                    text: 'Save',
                                    color: 'primary',
                                    variant: this.params.value.finishButtonStyle || 'elevated',
                                };
                            if (this.params.value.mode === 'display') {
                                newForm.$params.saveButton = Object.assign(Object.assign(Object.assign({}, finalAction), (this.params.value.finishButton || {})), (newForm.$params.saveButton || {}));
                            }
                            else {
                                newForm.$params.saveButton = Object.assign(Object.assign(Object.assign({}, finalAction), (this.params.value.finishButton || {})), (newForm.$params.saveButton || {}));
                            }
                        }
                        if (this.hasPrev) {
                            newForm.$params.prevButton = Object.assign(Object.assign({ text: 'Prev', color: 'secondary', variant: this.params.value.prevButtonStyle || 'outlined' }, (this.params.value.prevButton || {})), (newForm.$params.prevButton || {}));
                        }
                        else {
                            newForm.$params.prevButton = undefined;
                        }
                    }
                    if (this.currentForm) {
                        this.currentForm.clearListeners(this.$id);
                        this.currentForm.removeEventListeners();
                    }
                    this.currentForm = newForm;
                    this.currentIndex.value = index;
                    this.currentForm.clearListeners(this.$id);
                    this.currentForm.on('saved', () => this.save(), this.$id);
                    this.currentForm.on('prev', () => this.onprev(), this.$id);
                    this.currentForm.on('cancel', () => this.oncancel(), this.$id);
                    this.currentForm.attachEventListeners();
                    this.focusCurrentForm();
                }
            }
            else {
                this.currentForm = undefined;
                this.currentIndex.value = -1;
            }
        });
    }
    buildTitle(props, context) {
        const h = this.$h;
        const modes = { create: 'Create', edit: 'Edit', display: 'Display' };
        const title = this.options.title ? this.options.title(this) : this.$params.title;
        return h(VCardTitle, {}, () => h('span', {}, this.$params.mode ? (this.$params.hideMode ? title : `${modes[this.$params.mode]} ${title || ''}`) : (title || '')));
    }
    buildBody(props, context) {
        const h = this.$h;
        if (!this.hasAccess.value) {
            return h(VCardText, {
                class: 'text-center'
            }, () => h('span', {
                class: 'title'
            }, 'Access Denied!'));
        }
        return h(VCardText, {
            class: 'text-center'
        }, () => h('span', {
            class: 'title'
        }, 'Loading...'));
    }
    buildTopActions(props, context) {
        const h = this.$h;
        this.topButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.topButtonInstances = this.buildDefaultButtons();
        return h(VCardActions, {}, () => [
            h(VSpacer),
            ...this.topButtonInstances.map((b) => h(b.component))
        ]);
    }
    buildBottomActions(props, context) {
        const h = this.$h;
        this.bottomButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.bottomButtonInstances = this.buildDefaultButtons();
        return h(VCardActions, {}, () => [
            h(VSpacer),
            ...this.bottomButtonInstances.map((b) => h(b.component))
        ]);
    }
    buildDefaultButtons() {
        return [
            new Button(Object.assign({ text: 'Cancel', color: 'warning', variant: this.params.value.cancelButtonStyle || 'text' }, (this.params.value.cancelButton || {})), {
                onClicked: () => this.oncancel()
            }),
        ];
    }
    getAdditionalButtons() {
        if (this.params.value.mode === 'create')
            return [];
        const btns = [];
        if (this.params.value.canPrint && this.hasPrintAccess.value) {
            btns.push(new Button({ text: 'Print', color: 'primary' }, {
                onClicked: () => {
                    this.printAction();
                }
            }));
        }
        if (this.params.value.canExport && this.hasExportAccess.value) {
            btns.push(new Button({ text: 'Export', color: 'primary' }, {
                onClicked: () => {
                    this.exportAction();
                }
            }));
        }
        return btns;
    }
    save() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const props = this.lastProps;
            const context = this.lastContext;
            yield sleep(50);
            if (this.hasNext) {
                yield this.prepareForm(props, context, this.currentIndex.value + 1);
            }
            else {
                if (this.params.value.printAfterSave) {
                    yield this.printAction();
                }
                if (this.params.value.mode === 'create' && this.params.value.multiple) {
                    this.handleOn('saved', this);
                    yield this.prepareForm(props, context, 0);
                    this.handleOn('before-reset', this);
                    yield ((_a = this.$master) === null || _a === void 0 ? void 0 : _a.$reset());
                    this.captureCleanState();
                    this.handleOn('reset', this);
                }
                else if (this.params.value.mode === 'edit' && this.params.value.editAfterSave) {
                    this.captureCleanState();
                    this.handleOn('saved', this);
                    yield this.prepareForm(props, context, 0);
                }
                else {
                    if (this.params.value.mode === 'create') {
                        this.handleOn('before-reset', this);
                        yield ((_b = this.$master) === null || _b === void 0 ? void 0 : _b.$reset());
                        this.captureCleanState();
                        this.handleOn('reset', this);
                    }
                    else {
                        this.captureCleanState();
                    }
                    this.handleOn('saved', this);
                    this.handleOn('finished', this);
                }
            }
        });
    }
    oncancel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.confirmOnCancel) {
                const accepted = yield Dialogs.$confirm(this.hasUnsavedChanges() ? 'Discard unsaved changes?' : 'Cancel this report?');
                if (!accepted) {
                    return;
                }
            }
            yield sleep(50);
            this.handleOn('cancel', this);
        });
    }
    onprev() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = this.lastProps;
            const context = this.lastContext;
            yield sleep(50);
            if (this.hasPrev) {
                yield this.prepareForm(props, context, this.currentIndex.value - 1);
            }
        });
    }
    focusCurrentForm() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.currentForm) {
                return;
            }
            yield sleep(50);
            yield this.currentForm.focusPrimaryInput();
        });
    }
    applyStepSubtitle(form, index) {
        const label = this.progressLabel(index);
        if (!label) {
            return;
        }
        const subtitle = form.$params.subtitle;
        form.$params.subtitle = subtitle && subtitle !== ''
            ? `${subtitle} • ${label}`
            : label;
    }
    progressLabel(index) {
        const total = Math.max(this.params.value.forms || 0, index + 1);
        if (total <= 1) {
            return undefined;
        }
        return `Step ${index + 1} of ${total}`;
    }
    snapshotMasterData() {
        var _a;
        try {
            return JSON.stringify(((_a = this.$master) === null || _a === void 0 ? void 0 : _a.$data) || {});
        }
        catch (error) {
            return '';
        }
    }
    captureCleanState() {
        this.cleanSnapshot = this.snapshotMasterData();
    }
    hasUnsavedChanges() {
        return this.snapshotMasterData() !== this.cleanSnapshot;
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide();
            this.oncancel();
        });
    }
    forceSave() {
        return __awaiter(this, void 0, void 0, function* () {
            this.save();
        });
    }
    setup(props, context) {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    print() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.printAction();
        });
    }
    beforePrint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.beforePrint)
                return yield this.options.beforePrint(this, this.params.value.mode);
        });
    }
    printTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.printTemplate)
                return yield this.options.printTemplate(this, this.params.value.mode);
            return yield AppManager.$printer.getTemplateIdByName(this.params.value.printTemplate);
        });
    }
    printAction() {
        return __awaiter(this, void 0, void 0, function* () {
            Dialogs.$showProgress({});
            const template = yield this.printTemplate();
            if (template) {
                const info = yield this.beforePrint();
                const data = { $info: info, $master: this.$master, $rep: this, $func: AppManager.$printer.printFunctions() };
                this.handleOn('before-print', data);
                yield AppManager.$printer.printReportById(template, data);
                this.handleOn('after-print', data);
            }
            Dialogs.$hideProgress();
        });
    }
    export() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exportAction();
        });
    }
    beforeExport() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.beforeExport)
                return yield this.options.beforeExport(this, this.params.value.mode);
        });
    }
    exportTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.exportTemplate)
                return yield this.options.exportTemplate(this, this.params.value.mode);
            const temp = yield AppManager.$printer.getTemplateIdByName(this.params.value.exportTemplate);
            return { template: temp, filename: 'data.xlsx' };
        });
    }
    exportAction() {
        return __awaiter(this, void 0, void 0, function* () {
            Dialogs.$showProgress({});
            const templateInfo = yield this.exportTemplate();
            const template = templateInfo === null || templateInfo === void 0 ? void 0 : templateInfo.template;
            if (template) {
                const info = yield this.beforeExport();
                const data = { $info: info, $master: this.$master, $rep: this, $func: AppManager.$printer.printFunctions() };
                this.handleOn('before-export', data);
                const code = yield AppManager.$printer.getTemplate(template, "excel");
                const excelData = yield computeFunctionalCodeAsync(code, {
                    params: ['$info', '$master', '$func'],
                    data
                });
                if (excelData) {
                    const workbook = $excel.writeData((excelData === null || excelData === void 0 ? void 0 : excelData.sheetNames) || [], (excelData === null || excelData === void 0 ? void 0 : excelData.data) || {});
                    yield $excel.saveWorkBook(templateInfo.filename || 'data.xlsx', workbook);
                }
                this.handleOn('after-export', data);
            }
            Dialogs.$hideProgress();
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
    attachEventListeners() {
        if (this.options.attachEventListeners && !this.listenersAttached)
            this.options.attachEventListeners(this);
        super.attachEventListeners();
        this.listenersAttached = true;
    }
    removeEventListeners() {
        if (this.options.removeEventListeners && this.listenersAttached) {
            this.options.removeEventListeners(this);
            if (this.currentForm)
                this.currentForm.removeEventListeners();
        }
        super.removeEventListeners();
        this.listenersAttached = false;
    }
}
Report.defaultParams = {};
export const $RP = (params, options) => new Report(params || {}, options || {});
