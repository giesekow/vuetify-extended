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
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master) {
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
        }
        else {
            this.setMaster(new Master({ type: this.params.value.objectType, id: this.params.value.objectId }));
        }
        this.hasAccess = this.$makeRef(true);
        this.currentIndex = this.$makeRef(-1);
        this.currentForm = undefined;
    }
    get $parentReport() {
        return this;
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
            }
        });
    }
    runAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hasAccess.value = (yield this.access()) || false;
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
            this.handleOn('loaded', this);
        });
    }
    saved() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    access() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this) : true;
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
    props() {
        return [];
    }
    render(props, context) {
        const h = this.$h;
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
            this.currentForm.on('saved', () => this.save(props, context));
            this.currentForm.on('cancel', () => this.oncancel(props, context));
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
                const hasNext = this.options.hasForm ? yield this.options.hasForm(props, context, index + 1) : yield this.hasForm(props, context, index + 1);
                this.hasNext = hasNext || false;
                if (index <= 0) {
                    this.hasPrev = false;
                }
                else {
                    const hasPrev = this.options.hasForm ? yield this.options.hasForm(props, context, index) : yield this.hasForm(props, context, index);
                    this.hasPrev = hasPrev || false;
                }
                const newForm = this.options.form ? yield this.options.form(props, context, index) : yield this.form(props, context, index);
                if (newForm) {
                    newForm.setParent(this);
                    newForm.$params.sub = this.hasNext;
                    newForm.$params.auto = this.hasNext;
                    newForm.$params.mode = this.params.value.mode;
                    if (this.params.value.title && !newForm.$params.subtitle) {
                        newForm.$params.subtitle = newForm.$params.title;
                        newForm.$params.title = this.params.value.title;
                    }
                    if (this.params.value.setActionButtons || this.params.value.setActionButtons === undefined) {
                        if (this.hasNext) {
                            newForm.$params.saveButton = {
                                text: 'Next'
                            };
                        }
                        else if (index > 0) {
                            newForm.$params.showSaveInReadonly = true;
                            if (this.params.value.mode === 'display') {
                                newForm.$params.saveButton = {
                                    text: 'Finish'
                                };
                            }
                        }
                        if (this.hasPrev) {
                            newForm.$params.cancelButton = {
                                text: 'Prev'
                            };
                        }
                    }
                    this.currentForm = newForm;
                    this.currentIndex.value = index;
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
        return h(VCardTitle, {}, () => h('span', {}, this.$params.mode ? (this.$params.hideMode ? this.$params.title : `${modes[this.$params.mode]} ${this.$params.title || ''}`) : (this.$params.title || '')));
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
            new Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                onClicked: () => this.oncancel(null, null)
            }),
        ];
    }
    getAdditionalButtons() {
        if (this.params.value.mode === 'create')
            return [];
        const btns = [];
        if (this.params.value.canPrint) {
            btns.push(new Button({ text: 'Print', color: 'primary' }, {
                onClicked: () => {
                    this.printAction();
                }
            }));
        }
        if (this.params.value.canExport) {
            btns.push(new Button({ text: 'Export', color: 'primary' }, {
                onClicked: () => {
                    this.exportAction();
                }
            }));
        }
        return btns;
    }
    save(props, context) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
                    this.handleOn('reset', this);
                }
                else if (this.params.value.mode === 'edit' && this.params.value.editAfterSave) {
                    this.handleOn('saved', this);
                    yield this.prepareForm(props, context, 0);
                }
                else {
                    if (this.params.value.mode === 'create') {
                        this.handleOn('before-reset', this);
                        yield ((_b = this.$master) === null || _b === void 0 ? void 0 : _b.$reset());
                        this.handleOn('reset', this);
                    }
                    this.handleOn('saved', this);
                    this.handleOn('finished', this);
                }
            }
        });
    }
    oncancel(props, context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield sleep(50);
            if (this.hasPrev) {
                yield this.prepareForm(props, context, this.currentIndex.value - 1);
            }
            else {
                this.handleOn('cancel', this);
            }
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide();
            this.oncancel(null, null);
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
                const data = { $info: info, $master: this.$master, $func: AppManager.$printer.printFunctions() };
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
                const data = { $info: info, $master: this.$master, $func: AppManager.$printer.printFunctions() };
                this.handleOn('before-export', data);
                const code = yield AppManager.$printer.getTemplate(template, "excel");
                const excelData = yield computeFunctionalCodeAsync(code, {
                    params: ['$info', '$master', '$func'],
                    data
                });
                const workbook = $excel.writeData(excelData.sheetNames || [], excelData.data || {});
                yield $excel.saveWorkBook(templateInfo.filename || 'data.xlsx', workbook);
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
}
export const $RP = (params, options) => new Report(params || {}, options || {});
