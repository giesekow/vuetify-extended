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
exports.$DF = exports.DialogForm = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const master_1 = require("../master");
class DialogForm extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.loaded = false;
        this.params = this.$makeRef(Object.assign(Object.assign({}, DialogForm.defaultParams), (params || {})));
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.dialog = this.$makeRef(false);
        this.currentForm = undefined;
        this.loading = this.$makeRef(false);
        this.dialogRoot = this.$makeRef();
        if (options === null || options === void 0 ? void 0 : options.master) {
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
        }
        else {
            this.setMaster(new master_1.Master({ type: this.params.value.objectType, id: this.params.value.objectId }));
        }
    }
    static setDefault(value, reset) {
        if (reset) {
            DialogForm.defaultParams = value;
        }
        else {
            DialogForm.defaultParams = Object.assign(Object.assign({}, DialogForm.defaultParams), value);
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
    query(search, mode) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    props() {
        return [];
    }
    render(props, context) {
        const h = this.$h;
        if (!this.loaded) {
            this.loaded = true;
            this.initialize(props, context);
        }
        if (this.params.value.invisible) {
            return;
        }
        return h(components_1.VDialog, {
            modelValue: this.dialog.value,
            persistent: this.params.value.persistent !== false,
            width: "auto",
            fullscreen: this.params.value.fullscreen,
            onAfterEnter: () => this.focusPrimaryInput(),
        }, () => h('div', {
            ref: (el) => this.setDialogRoot(el),
            onKeydown: (ev) => this.onDialogKeydown(ev)
        }, [
            this.buildBody(props, context)
        ]));
    }
    buildBody(props, context) {
        const h = this.$h;
        if (!this.hasAccess.value) {
            return h(components_1.VCard, {
                width: 400,
                class: ['mx-auto']
            }, () => [
                h(components_1.VCardActions, {}, () => [
                    h(components_1.VSpacer, {}),
                    h(components_1.VBtn, {
                        color: 'primary',
                        onClick: () => this.onCancelClicked()
                    }, () => 'Cancel')
                ]),
                h(components_1.VCardText, {
                    class: 'text-center'
                }, () => h('span', {
                    class: 'title'
                }, 'Access Denied!')),
                h(components_1.VCardActions, {}, () => [
                    h(components_1.VSpacer, {}),
                    h(components_1.VBtn, {
                        color: 'primary',
                        onClick: () => this.onCancelClicked()
                    }, () => 'Cancel')
                ]),
            ]);
        }
        if (!this.loading.value && this.currentForm) {
            return h(this.currentForm.component);
        }
        return h(components_1.VCard, {
            width: 400,
            class: ['mx-auto']
        }, () => [
            h(components_1.VCardActions, {}, () => [
                h(components_1.VSpacer, {}),
                h(components_1.VBtn, {
                    color: 'primary',
                    onClick: () => this.onCancelClicked()
                }, () => 'Cancel')
            ]),
            h(components_1.VCardText, {
                class: 'text-center'
            }, () => h('span', {
                class: 'title'
            }, 'Loading....')),
            h(components_1.VCardActions, {}, () => [
                h(components_1.VSpacer, {}),
                h(components_1.VBtn, {
                    color: 'primary',
                    onClick: () => this.onCancelClicked()
                }, () => 'Cancel')
            ]),
        ]);
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialog.value = true;
        });
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialog.value = false;
        });
    }
    form(props, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.form)
                return yield this.options.form(props, context);
        });
    }
    initialize(props, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.currentForm) {
                this.currentForm.clearListeners();
            }
            this.loading.value = true;
            yield this.runAccess();
            if (this.hasAccess.value) {
                this.currentForm = yield this.form(props, context);
                if (this.currentForm) {
                    this.currentForm.setParent(this);
                    this.currentForm.$params.mode = this.params.value.mode;
                    this.currentForm.on('cancel', () => this.onCancelClicked());
                    this.currentForm.on('saved', () => this.onSaved());
                }
            }
            this.loading.value = false;
            if (this.dialog.value) {
                yield this.focusPrimaryInput();
            }
        });
    }
    onCancelClicked() {
        return __awaiter(this, void 0, void 0, function* () {
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
    onDialogKeydown(ev) {
        if (ev.key === 'Escape' && this.dialog.value) {
            ev.preventDefault();
            this.onCancelClicked();
        }
    }
    setDialogRoot(el) {
        if (el instanceof HTMLElement) {
            this.dialogRoot.value = el;
            return;
        }
        const root = el === null || el === void 0 ? void 0 : el.$el;
        this.dialogRoot.value = root instanceof HTMLElement ? root : undefined;
    }
    focusPrimaryInput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof document === 'undefined') {
                return;
            }
            yield (0, vue_1.nextTick)();
            yield this.waitForFocusFrame();
            const target = this.findFocusTarget();
            if (target && typeof target.focus === 'function') {
                target.focus();
            }
        });
    }
    findFocusTarget() {
        const root = this.dialogRoot.value;
        if (!root) {
            return undefined;
        }
        const selectors = [
            'input[autofocus]:not([type="hidden"]):not([disabled]):not([readonly])',
            'textarea[autofocus]:not([disabled]):not([readonly])',
            '.v-autocomplete input:not([type="hidden"]):not([disabled]):not([readonly])',
            '.v-field input:not([type="hidden"]):not([disabled]):not([readonly])',
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
    waitForFocusFrame() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 50));
        });
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
    onSaved() {
        return __awaiter(this, void 0, void 0, function* () {
            this.handleOn('before-save', this);
            if (this.options.saved) {
                yield this.options.saved();
            }
            else {
                yield this.saved();
            }
            this.handleOn('saved', this);
            if (this.params.value.closeOnSave)
                this.onCancelClicked();
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide();
            this.onCancelClicked();
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
exports.DialogForm = DialogForm;
DialogForm.defaultParams = {};
const $DF = (params, options) => new DialogForm(params || {}, options || {});
exports.$DF = $DF;
