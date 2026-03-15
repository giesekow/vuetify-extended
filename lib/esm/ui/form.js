var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { nextTick } from "vue";
import { UIBase } from "./base";
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VForm, VCardSubtitle } from 'vuetify/components';
import { Part } from "./part";
import { Button } from "./button";
import { Dialogs } from "./dialogs";
import { AppManager } from "./appmanager";
import { Field } from "./field";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";
export class Form extends UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.udfData = [];
        this.listenersAttached = false;
        this.params = this.$makeRef(Object.assign(Object.assign({}, Form.defaultParams), (params || {})));
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
        this.hasAccess = this.$makeRef(true);
        this.cardRoot = this.$makeRef();
        this.udfLoaded = this.$makeRef(false);
        this.validationSummary = this.$makeRef([]);
    }
    static setDefault(value, reset) {
        if (reset) {
            Form.defaultParams = value;
        }
        else {
            Form.defaultParams = Object.assign(Object.assign({}, Form.defaultParams), value);
        }
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
                this.hasAccess.value = (yield this.access(this.$params.mode)) || false;
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
    afterSaved() {
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
        return h(VCard, {
            ref: (el) => this.setCardRoot(el),
            onKeydown: (ev) => this.onFormKeydown(ev),
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
            h(VDivider),
            this.buildBody(props, context),
            h(VDivider),
            this.buildBottomActions(props, context),
        ]);
    }
    focusPrimaryInput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof document === 'undefined') {
                return;
            }
            yield nextTick();
            for (let i = 0; i < 5; i++) {
                if (yield this.focusSpecialFieldTarget()) {
                    return;
                }
                const target = this.findFocusTarget();
                if (target && typeof target.focus === 'function') {
                    target.focus();
                    return;
                }
                yield this.waitForFocusFrame();
            }
        });
    }
    setCardRoot(el) {
        if (el instanceof HTMLElement) {
            this.cardRoot.value = el;
            return;
        }
        const root = el === null || el === void 0 ? void 0 : el.$el;
        this.cardRoot.value = root instanceof HTMLElement ? root : undefined;
    }
    focusSpecialFieldTarget() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.collectFields(this.childrenInstances);
            for (const field of fields) {
                const behavior = this.fieldFocusBehavior(field);
                if (behavior === 'skip') {
                    continue;
                }
                if (behavior === 'special') {
                    return yield field.focusPrimaryInput();
                }
                return false;
            }
            return false;
        });
    }
    fieldFocusBehavior(field) {
        if (field.$params.invisible || field.$readonly) {
            return 'skip';
        }
        const type = field.$params.type || 'text';
        if (['label', 'htmlview', 'button', 'chart', 'map', 'map-line', 'map-circle', 'map-rectangle', 'map-polygon', 'table', 'viewtable', 'servertable', 'reporttable', 'collection', 'messagingbox', 'image', 'document'].includes(type)) {
            return 'skip';
        }
        if (type === 'html') {
            return 'special';
        }
        return 'standard';
    }
    findFocusTarget() {
        const root = this.cardRoot.value;
        if (!root) {
            return undefined;
        }
        const selectors = [
            'input[autofocus]:not([type="hidden"]):not([disabled]):not([readonly])',
            'textarea[autofocus]:not([disabled]):not([readonly])',
            '.v-field input:not([type="hidden"]):not([disabled]):not([readonly])',
            '.v-autocomplete input:not([type="hidden"]):not([disabled]):not([readonly])',
            'iframe.tox-edit-area__iframe',
            'textarea:not([disabled]):not([readonly])',
        ];
        for (const selector of selectors) {
            const items = Array.from(root.querySelectorAll(selector));
            const target = items.find((item) => this.isVisibleFocusable(item));
            if (target) {
                return target;
            }
        }
        const fallbackButtons = Array.from(root.querySelectorAll('button:not([disabled])'));
        return fallbackButtons.find((item) => this.isVisibleFocusable(item)) || undefined;
    }
    isVisibleFocusable(target) {
        if (target.hasAttribute('readonly') || target.getAttribute('aria-readonly') === 'true') {
            return false;
        }
        const readonlyWrapper = target.closest('[readonly], [aria-readonly="true"], .v-input--readonly, .v-field--readonly');
        if (readonlyWrapper) {
            return false;
        }
        return target.offsetParent !== null || target === document.activeElement;
    }
    waitForFocusFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 50));
        });
    }
    buildTitle(props, context) {
        const h = this.$h;
        const modes = { create: 'Create', edit: 'Edit', display: 'Display' };
        return h(VCardTitle, {}, () => h('span', {}, this.$params.mode ? (this.$params.hideMode ? this.$params.title : `${modes[this.$params.mode]} ${this.$params.title || ''}`) : (this.$params.title || '')));
    }
    buildSubTitle(props, context) {
        const h = this.$h;
        return h(VCardSubtitle, {}, () => h('span', {}, this.params.value.subtitle || ""));
    }
    buildBody(props, context) {
        const h = this.$h;
        this.childrenInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.childrenInstances = [];
        if (!this.hasAccess.value) {
            return h(VCardText, {
                class: 'text-center'
            }, () => h('span', {
                class: 'title'
            }, 'Access Denied!'));
        }
        return h(VCardText, {}, () => h(VForm, {
            ref: this.formRef
        }, () => [
            this.buildValidationSummary(),
            h(VRow, {
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
            })
        ]));
    }
    buildValidationSummary() {
        const h = this.$h;
        if ((this.validationSummary.value || []).length === 0) {
            return undefined;
        }
        return h('div', {
            class: ['mb-4', 'pa-4', 'rounded'],
            style: {
                border: '1px solid rgb(var(--v-theme-error))',
                background: 'rgba(var(--v-theme-error), 0.08)'
            }
        }, [
            h('div', {
                class: ['text-subtitle-2', 'mb-2'],
                style: {
                    color: 'rgb(var(--v-theme-error))'
                }
            }, 'Please review the following before saving:'),
            h('ul', {
                class: ['pl-5', 'my-0']
            }, this.validationSummary.value.map((message) => h('li', { class: ['mb-1'] }, message)))
        ]);
    }
    loadUDFData() {
        return __awaiter(this, void 0, void 0, function* () {
            const udfs = this.params.value.udf ? yield AppManager.getUDFs(this.params.value.udf) : [];
            this.udfData = yield this.processUDF(udfs);
            this.udfLoaded.value = true;
        });
    }
    prepareBeforeUDFs() {
        const items = this.udfData.filter((u) => u.sort && u.sort < 0);
        return new Part(this.options.preUDFOptions || {}, {
            children: () => {
                const fitems = [];
                for (let i = 0; i < items.length; i++) {
                    const f = AppManager.makeUDF(items[i], this.$params.mode);
                    if (f)
                        fitems.push(f);
                }
                return fitems;
            }
        });
    }
    prepareAfterUDFs() {
        const items = this.udfData.filter((u) => !(u.sort && u.sort < 0));
        return new Part(this.options.postUDFOptions || {}, {
            children: () => {
                const fitems = [];
                for (let i = 0; i < items.length; i++) {
                    const f = AppManager.makeUDF(items[i], this.$params.mode);
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
        return h(VCardActions, {}, () => [
            ...leftButtons.map((b) => h(b.component)),
            h(VSpacer),
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
        return h(VCardActions, {}, () => [
            ...leftButtons.map((b) => h(b.component)),
            h(VSpacer),
            ...(reportButton.concat(rightButtons)).map((b) => h(b.component))
        ]);
    }
    buildDefaultButtons() {
        const prevButtons = this.params.value.prevButton ? [
            new Button(Object.assign({ text: 'Prev', color: 'secondary' }, (this.params.value.prevButton || {})), {
                onClicked: () => this.onPrevClicked()
            })
        ] : [];
        if (!this.hasAccess.value) {
            return [
                new Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                }),
                ...prevButtons,
            ];
        }
        if (this.$readonly && !this.params.value.sub && !this.params.value.showSaveInReadonly) {
            return [
                new Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                }),
                ...prevButtons,
            ];
        }
        return [
            new Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                onClicked: () => this.onCancelClicked()
            }),
            ...prevButtons,
            new Button(Object.assign({ text: 'Save', color: 'success' }, (this.params.value.saveButton || {})), {
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
    $prev() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onPrevClicked();
        });
    }
    $handleEscapeShortcut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.prevButton) {
                yield this.onPrevClicked();
                return;
            }
            yield this.onCancelClicked();
        });
    }
    $handleSaveShortcut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canTriggerSaveShortcut()) {
                return;
            }
            yield this.onSaveClicked();
        });
    }
    onFormKeydown(ev) {
        if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
            return;
        }
        if (this.isSaveShortcut(ev)) {
            if (this.shouldIgnoreSaveShortcut(ev.target) || !this.canTriggerSaveShortcut()) {
                return;
            }
            ev.preventDefault();
            this.onSaveClicked();
            return;
        }
        if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
            if (this.shouldIgnoreEscapeCancel(ev.target)) {
                return;
            }
            ev.preventDefault();
            this.$handleEscapeShortcut();
            return;
        }
        this.triggerButtonShortcut(ev);
    }
    isSaveShortcut(ev) {
        return !ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's';
    }
    canTriggerSaveShortcut() {
        var _a;
        if (!this.hasAccess.value) {
            return false;
        }
        if ((_a = this.params.value.saveButton) === null || _a === void 0 ? void 0 : _a.disabled) {
            return false;
        }
        if (this.$readonly && !this.params.value.sub && !this.params.value.showSaveInReadonly) {
            return false;
        }
        return true;
    }
    getShortcutButtons() {
        return this.topButtonInstances.concat(this.bottomButtonInstances);
    }
    triggerButtonShortcut(ev) {
        if (ev.repeat) {
            return false;
        }
        const seen = new Set();
        for (const button of this.getShortcutButtons()) {
            if (seen.has(button)) {
                continue;
            }
            seen.add(button);
            if (button.$params.disabled || button.$params.invisible || button.$readonly) {
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
            button.triggerShortcut();
            return true;
        }
        return false;
    }
    shouldIgnoreSaveShortcut(target) {
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        if (target.closest('[contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
            return true;
        }
        return false;
    }
    shouldIgnoreEscapeCancel(target) {
        if (!(target instanceof HTMLElement)) {
            return false;
        }
        if (target.closest('[contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
            return true;
        }
        return false;
    }
    onSaveClicked() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$readonly) {
                this.clearValidationSummary();
                this.handleOn('saved', this);
                return;
            }
            const res = yield ((_b = (_a = this.formRef) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.validate());
            if (!(res === null || res === void 0 ? void 0 : res.valid)) {
                this.setValidationSummary();
                yield nextTick();
                yield ((_d = (_c = this.formRef) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.validate());
                return;
            }
            let canProceed = true;
            this.handleOn('before-validate', this);
            const vres = yield this.validate();
            canProceed = typeof vres !== 'string';
            this.setValidationSummary(typeof vres === 'string' ? [vres] : []);
            this.handleOn('validate', this);
            if (canProceed) {
                this.clearValidationSummary();
                yield this.save();
            }
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            let accepted = true;
            if (!this.params.value.auto && !this.params.value.sub) {
                accepted = yield Dialogs.$confirm('Save data ?');
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
                            Dialogs.$error(saved || 'Unable to save data!');
                            this.handleOn('error', saved);
                        }
                        else {
                            if (!this.params.value.auto)
                                Dialogs.$success('Data successfully saved!');
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
                this.handleOn('after-saved', this);
                if (this.options.afterSaved) {
                    yield this.options.afterSaved(this);
                }
                else {
                    yield this.afterSaved();
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
    onPrevClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleOn('before-prev', this);
            this.handleOn('prev', this);
        });
    }
    setValidationSummary(messages = []) {
        const combined = messages.concat(this.collectRequiredFieldSummary());
        const unique = combined.filter((message, index) => message && combined.indexOf(message) === index);
        this.validationSummary.value = unique;
    }
    clearValidationSummary() {
        this.validationSummary.value = [];
    }
    collectRequiredFieldSummary() {
        var _a;
        const fields = this.collectFields(this.childrenInstances);
        const messages = [];
        for (const field of fields) {
            if (field.$params.invisible || !field.$params.required || !field.$params.storage) {
                continue;
            }
            const value = (_a = field.$master) === null || _a === void 0 ? void 0 : _a.$get(field.$params.storage);
            if (this.isEmptyValue(value)) {
                messages.push(`${field.$params.label || field.$params.storage} is required.`);
            }
        }
        return messages;
    }
    collectFields(items) {
        const fields = [];
        for (const item of items) {
            if (item instanceof Field) {
                fields.push(item);
                continue;
            }
            const children = (item.childrenInstances || []);
            fields.push(...this.collectFields(children));
        }
        return fields;
    }
    isEmptyValue(value) {
        if (value === undefined || value === null)
            return true;
        if (typeof value === 'string')
            return value.trim() === '';
        if (Array.isArray(value))
            return value.length === 0;
        if (typeof value === 'object')
            return Object.keys(value).length === 0;
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
    attachEventListeners() {
        if (this.options.attachEventListeners && !this.listenersAttached)
            this.options.attachEventListeners(this);
        if (typeof window !== 'undefined' && !this.shortcutHandler) {
            this.shortcutHandler = (ev) => this.onFormKeydown(ev);
            window.addEventListener('keydown', this.shortcutHandler);
        }
        super.attachEventListeners();
        this.listenersAttached = true;
    }
    removeEventListeners() {
        if (this.options.removeEventListeners && this.listenersAttached)
            this.options.removeEventListeners(this);
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
        super.removeEventListeners();
        this.listenersAttached = false;
    }
}
Form.defaultParams = {};
export const $FM = (params, options) => new Form(params || {}, options || {});
