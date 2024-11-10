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
exports.$FM = exports.Form = void 0;
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const part_1 = require("./part");
const button_1 = require("./button");
const dialogs_1 = require("./dialogs");
const appmanager_1 = require("./appmanager");
class Form extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.udfData = [];
        this.listenersAttached = false;
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
        this.hasAccess = this.$makeRef(true);
        this.udfLoaded = this.$makeRef(false);
    }
    get $prefs() {
        const items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            const ref = this.childrenInstances[i].$ref;
            if (ref && ref !== '') {
                items[ref] = this.childrenInstances[i];
            }
        }
        return items;
    }
    get $refs() {
        let items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            items = Object.assign(Object.assign({}, items), this.childrenInstances[i].$refs);
        }
        return items;
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.mode === "display";
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
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
    runAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.options.access) {
                    this.hasAccess.value = yield this.options.access(this);
                }
                else {
                    this.hasAccess.value = yield this.access();
                }
            }
            catch (error) {
                this.hasAccess.value = false;
            }
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.validate) {
                const v = yield this.options.validate(this);
                if (typeof v === 'string')
                    return v;
            }
            ;
            for (let i = 0; i < this.childrenInstances.length; i++) {
                const v = yield this.childrenInstances[i].validate();
                if (typeof v === 'string')
                    return v;
            }
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
            return true;
        });
    }
    processUDF(udfs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.processUDF)
                return yield this.options.processUDF(this, udfs);
            return udfs;
        });
    }
    props() {
        return [];
    }
    topChildren(props, context) {
        return [];
    }
    bottomChildren(props, context) {
        return [];
    }
    children(props, context) {
        return [];
    }
    buttons(props, context) {
        return [];
    }
    bottomButtons(props, context) {
        return [];
    }
    leftButtons(props, context) {
        return [];
    }
    bottomLeftButtons(props, context) {
        return [];
    }
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        return h(components_1.VCard, {
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth,
            elevation: this.params.value.elevation,
            class: this.params.value.cardClass,
            maxHeight: this.params.value.maxHeight,
            minHeight: this.params.value.minHeight
        }, () => [
            this.buildTitle(props, context),
            ...(this.params.value.subtitle ? [this.buildSubTitle(props, context)] : []),
            this.buildTopActions(props, context),
            h(components_1.VDivider),
            this.buildBody(props, context),
            h(components_1.VDivider),
            this.buildBottomActions(props, context),
        ]);
    }
    buildTitle(props, context) {
        const h = this.$h;
        const modes = { create: 'Create', edit: 'Edit', display: 'Display' };
        return h(components_1.VCardTitle, {}, () => h('span', {}, this.$params.mode ? (this.$params.hideMode ? this.$params.title : `${modes[this.$params.mode]} ${this.$params.title || ''}`) : (this.$params.title || '')));
    }
    buildSubTitle(props, context) {
        const h = this.$h;
        return h(components_1.VCardSubtitle, {}, () => h('span', {}, this.params.value.subtitle || ""));
    }
    buildBody(props, context) {
        const h = this.$h;
        this.childrenInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.childrenInstances = [];
        if (!this.hasAccess.value) {
            return h(components_1.VCardText, {
                class: 'text-center'
            }, () => h('span', {
                class: 'title'
            }, 'Access Denied!'));
        }
        return h(components_1.VCardText, {}, () => h(components_1.VForm, {
            ref: this.formRef
        }, () => h(components_1.VRow, {
            justify: this.params.value.justify,
            align: this.params.value.align,
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent,
        }, () => {
            const top = this.options.topChildren ? this.options.topChildren(props, context) : this.topChildren(props, context);
            const ch = this.options.children ? this.options.children(props, context) : this.children(props, context);
            const bot = this.options.bottomChildren ? this.options.bottomChildren(props, context) : this.bottomChildren(props, context);
            if (this.udfLoaded.value) {
                const pr = this.prepareBeforeUDFs();
                const pt = this.prepareAfterUDFs();
                this.childrenInstances = top.concat(pr).concat(ch).concat(pt).concat(bot);
            }
            else {
                this.childrenInstances = top.concat(ch).concat(bot);
            }
            this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
            });
            return this.childrenInstances.map((instanace) => this.$h(instanace.component));
        })));
    }
    loadUDFData() {
        return __awaiter(this, void 0, void 0, function* () {
            const udfs = this.params.value.udf ? yield appmanager_1.AppManager.getUDFs(this.params.value.udf) : [];
            this.udfData = yield this.processUDF(udfs);
            this.udfLoaded.value = true;
        });
    }
    prepareBeforeUDFs() {
        const items = this.udfData.filter((u) => u.sort && u.sort < 0);
        return new part_1.Part(this.options.preUDFOptions || {}, {
            children: () => {
                const fitems = [];
                for (let i = 0; i < items.length; i++) {
                    const f = appmanager_1.AppManager.makeUDF(items[i], this.$params.mode);
                    if (f)
                        fitems.push(f);
                }
                return fitems;
            }
        });
    }
    prepareAfterUDFs() {
        const items = this.udfData.filter((u) => !(u.sort && u.sort < 0));
        return new part_1.Part(this.options.postUDFOptions || {}, {
            children: () => {
                const fitems = [];
                for (let i = 0; i < items.length; i++) {
                    const f = appmanager_1.AppManager.makeUDF(items[i], this.$params.mode);
                    if (f)
                        fitems.push(f);
                }
                return fitems;
            }
        });
    }
    buildTopActions(props, context) {
        var _a;
        const h = this.$h;
        this.topButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.topButtonInstances = [];
        const leftButtons = !this.hasAccess.value ? [] : (this.options.leftButtons ? this.options.leftButtons(props, context) : this.leftButtons(props, context));
        let rightButtons = !this.hasAccess.value ? [] : (this.options.buttons ? this.options.buttons(props, context) : this.buttons(props, context));
        if (!this.params.value.defaultButtonPosition || ["top", "both"].includes(this.params.value.defaultButtonPosition)) {
            const btns = this.buildDefaultButtons();
            rightButtons = rightButtons.concat(btns);
        }
        const reportButton = ((_a = this.$parentReport) === null || _a === void 0 ? void 0 : _a.getAdditionalButtons()) || [];
        this.topButtonInstances = leftButtons.concat(reportButton).concat(rightButtons);
        return h(components_1.VCardActions, {}, () => [
            ...leftButtons.map((b) => h(b.component)),
            h(components_1.VSpacer),
            ...(reportButton.concat(rightButtons).map((b) => h(b.component)))
        ]);
    }
    buildBottomActions(props, context) {
        var _a;
        const h = this.$h;
        this.bottomButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.bottomButtonInstances = [];
        const leftButtons = !this.hasAccess.value ? [] : (this.options.bottomLeftButtons ? this.options.bottomLeftButtons(props, context) : this.bottomLeftButtons(props, context));
        let rightButtons = !this.hasAccess.value ? [] : (this.options.bottomButtons ? this.options.bottomButtons(props, context) : this.bottomButtons(props, context));
        if (!this.params.value.defaultButtonPosition || ["bottom", "both"].includes(this.params.value.defaultButtonPosition)) {
            const btns = this.buildDefaultButtons();
            rightButtons = rightButtons.concat(btns);
        }
        const reportButton = ((_a = this.$parentReport) === null || _a === void 0 ? void 0 : _a.getAdditionalButtons()) || [];
        this.bottomButtonInstances = leftButtons.concat(reportButton).concat(rightButtons);
        return h(components_1.VCardActions, {}, () => [
            ...leftButtons.map((b) => h(b.component)),
            h(components_1.VSpacer),
            ...(reportButton.concat(rightButtons)).map((b) => h(b.component))
        ]);
    }
    buildDefaultButtons() {
        if (!this.hasAccess.value) {
            return [
                new button_1.Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                }),
            ];
        }
        if (this.$readonly && !this.params.value.sub && !this.params.value.showSaveInReadonly) {
            return [
                new button_1.Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                })
            ];
        }
        return [
            new button_1.Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                onClicked: () => this.onCancelClicked()
            }),
            new button_1.Button(Object.assign({ text: 'Save', color: 'success' }, (this.params.value.saveButton || {})), {
                onClicked: () => this.onSaveClicked()
            })
        ];
    }
    $save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onSaveClicked();
        });
    }
    $cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onCancelClicked();
        });
    }
    onSaveClicked() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$readonly) {
                this.handleOn('saved', this);
                return;
            }
            const res = yield ((_b = (_a = this.formRef) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.validate());
            if (!(res === null || res === void 0 ? void 0 : res.valid)) {
                dialogs_1.Dialogs.$error('Validation failed check entered data!');
                return;
            }
            let canProceed = true;
            this.handleOn('before-validate', this);
            const vres = yield this.validate();
            if (typeof vres === 'string') {
                dialogs_1.Dialogs.$error(vres);
            }
            canProceed = typeof vres !== 'string';
            this.handleOn('validate', this);
            if (canProceed) {
                yield this.save();
            }
            else {
                dialogs_1.Dialogs.$error(typeof vres === 'string' ? vres : 'Validation failed check entered data!');
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let accepted = true;
            if (!this.params.value.auto && !this.params.value.sub) {
                accepted = yield dialogs_1.Dialogs.$confirm('Save data ?');
            }
            if (accepted) {
                this.handleOn('before-saved', this);
                if (this.options.saved) {
                    yield this.options.saved(this);
                }
                else {
                    yield this.saved();
                }
                if (!this.params.value.sub) {
                    if (this.$master) {
                        const saved = yield this.$master.$save(this.params.value.mode);
                        if (saved !== true) {
                            dialogs_1.Dialogs.$error(saved || 'Unable to save data!');
                            this.handleOn('error', saved);
                        }
                        else {
                            if (!this.params.value.auto)
                                dialogs_1.Dialogs.$success('Data successfully saved!');
                            this.handleOn('saved', this);
                        }
                    }
                    else {
                        this.handleOn('saved', this);
                    }
                }
                else {
                    this.handleOn('saved', this);
                }
            }
        });
    }
    setup(props, context) {
        this.formRef = this.$makeRef(null);
        this.loadUDFData();
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    onCancelClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            let canCancel = true;
            if (this.options.canCancel)
                canCancel = (yield this.options.canCancel(this)) || false;
            if (!canCancel)
                return;
            this.handleOn('before-cancel', this);
            if (this.options.cancel) {
                yield this.options.cancel();
            }
            else {
                yield this.cancel();
            }
            this.handleOn('cancel', this);
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
        if (this.options.removeEventListeners && this.listenersAttached)
            this.options.removeEventListeners(this);
        super.removeEventListeners();
        this.listenersAttached = false;
    }
}
exports.Form = Form;
const $FM = (params, options) => new Form(params || {}, options || {});
exports.$FM = $FM;
