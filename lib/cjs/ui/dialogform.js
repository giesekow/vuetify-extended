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
const base_1 = require("./base");
const components_1 = require("vuetify/components");
class DialogForm extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.loaded = false;
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.dialog = this.$makeRef(false);
        this.currentForm = undefined;
        this.loading = this.$makeRef(false);
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
                if (this.options.access) {
                    this.hasAccess.value = yield this.options.access(this, this.params.value.mode);
                }
                else {
                    this.hasAccess.value = yield this.access(this.params.value.mode);
                }
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
            return true;
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
            persistent: true,
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth
        }, () => this.buildBody(props, context));
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
                    this.currentForm.$params.mode = this.params.value.mode;
                    this.currentForm.on('cancel', () => this.onCancelClicked());
                    this.currentForm.on('saved', () => this.onSaved());
                }
            }
            this.loading.value = false;
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
const $DF = (params, options) => new DialogForm(params || {}, options || {});
exports.$DF = $DF;
