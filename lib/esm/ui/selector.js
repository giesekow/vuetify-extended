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
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VCardSubtitle, VCol, VDialog, VAutocomplete } from 'vuetify/components';
import { Button } from "./button";
import { Master } from "../master";
export class Selector extends UIBase {
    constructor(params, options) {
        super();
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.loaded = false;
        this.params = this.$makeRef(Object.assign(Object.assign({}, Selector.defaultParams), (params || {})));
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.items = this.$makeRef([]);
        this.storage = this.$makeRef();
        this.dialog = this.$makeRef(false);
        this.loading = this.$makeRef(false);
        this.dialogRoot = this.$makeRef();
    }
    static setDefault(value, reset) {
        if (reset) {
            Selector.defaultParams = value;
        }
        else {
            Selector.defaultParams = Object.assign(Object.assign({}, Selector.defaultParams), value);
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
    selected(item, mode) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    format(item, items) {
        return __awaiter(this, void 0, void 0, function* () {
            return item;
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    access(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.access ? yield this.options.access(this, mode) : true;
        });
    }
    load(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = null;
            if (this.$params.objectType) {
                let query = {};
                if (this.options.query) {
                    query = yield this.options.query(this, this.params.value.mode);
                }
                else {
                    if (this.params.value.selectFields) {
                        query.$select = this.params.value.selectFields;
                    }
                }
                query.$paginate = false;
                data = yield this.$app.service(this.params.value.objectType).find({ query });
            }
            return data;
        });
    }
    query(search, mode) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    props() {
        return [];
    }
    loadItems() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading.value = true;
            try {
                let data = null;
                if (this.options.load) {
                    data = yield this.options.load(this, this.params.value.mode);
                }
                else {
                    data = yield this.load(this.params.value.mode);
                }
                const items = Array.isArray(data) ? data : data.data || [];
                const formatted = [];
                for (let i = 0; i < items.length; i++) {
                    const d = this.options.format ? yield this.options.format(items[i], items, this) : yield this.format(items[i], items);
                    if (d)
                        formatted.push(d);
                }
                this.items.value = formatted;
            }
            finally {
                this.loading.value = false;
            }
        });
    }
    render(props, context) {
        const h = this.$h;
        if (!this.loaded) {
            this.loaded = true;
            this.initialize();
        }
        if (this.params.value.invisible) {
            return;
        }
        return h(VDialog, {
            modelValue: this.dialog.value,
            persistent: this.params.value.persistent !== false,
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth,
            onAfterEnter: () => this.focusPrimaryInput(),
        }, () => h('div', {
            ref: (el) => this.setDialogRoot(el)
        }, [
            h(VCard, {
                maxWidth: this.params.value.maxWidth,
                width: this.params.value.width,
                minWidth: this.params.value.minWidth,
                elevation: this.params.value.elevation
            }, () => [
                this.buildTitle(props, context),
                ...(this.params.value.subtitle ? [this.buildSubTitle(props, context)] : []),
                this.buildTopActions(props, context),
                h(VDivider),
                this.buildBody(props, context),
                h(VDivider),
                this.buildBottomActions(props, context),
            ])
        ]));
    }
    buildTitle(props, context) {
        const h = this.$h;
        return h(VCardTitle, {}, () => h('span', {}, this.$params.title || ''));
    }
    buildSubTitle(props, context) {
        const h = this.$h;
        return h(VCardSubtitle, {}, () => h('span', {}, this.params.value.subtitle || ""));
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
        return h(VCardText, {}, () => h(VRow, {
            justify: this.params.value.justify,
            align: this.params.value.align,
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent,
        }, () => [
            ...this.buildSearchBar(),
            ...this.buildStatusMessage(),
        ]));
    }
    buildSearchBar() {
        const h = this.$h;
        return [
            h(VCol, {}, () => h(VAutocomplete, {
                variant: 'outlined',
                placeholder: 'Search Object',
                density: 'compact',
                modelValue: this.storage.value,
                "onUpdate:modelValue": (value) => {
                    this.storage.value = value;
                },
                autofocus: true,
                multiple: this.params.value.multiple,
                items: this.items.value,
                itemTitle: this.params.value.textField || "name",
                itemValue: Master.resolveItemValueField(this.items.value, this.params.value.idField),
                returnObject: this.params.value.returnObject,
                onKeyup: (ev) => this.onSelectorKeyup(ev),
            }))
        ];
    }
    buildStatusMessage() {
        const h = this.$h;
        let message;
        if (this.loading.value) {
            message = 'Loading options...';
        }
        else if ((this.items.value || []).length === 0) {
            message = 'No records available to select.';
        }
        if (!message) {
            return [];
        }
        return [
            h(VCol, {
                cols: 12,
            }, () => h('div', {
                class: ['text-medium-emphasis', 'text-body-2', 'px-2']
            }, message))
        ];
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadItems();
            this.storage.value = null;
            this.dialog.value = true;
            yield this.focusPrimaryInput();
        });
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dialog.value = false;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.runAccess();
            yield this.loadItems();
        });
    }
    buildTopActions(props, context) {
        const h = this.$h;
        this.topButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.topButtonInstances = [];
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
        this.bottomButtonInstances = [];
        this.bottomButtonInstances = this.buildDefaultButtons();
        return h(VCardActions, {}, () => [
            h(VSpacer),
            ...this.bottomButtonInstances.map((b) => h(b.component))
        ]);
    }
    buildDefaultButtons() {
        return [
            new Button(Object.assign({ text: 'Cancel', color: 'warning' }, (this.params.value.cancelButton || {})), {
                onClicked: () => this.onCancelClicked()
            }),
            new Button(Object.assign(Object.assign({ text: 'Confirm', color: 'success' }, (this.params.value.saveButton || {})), { disabled: this.storage.value ? false : true }), {
                onClicked: () => this.onSelectItem()
            })
        ];
    }
    onSelectItem() {
        const item = this.storage.value;
        if (this.options.selected) {
            this.options.selected(item, this, this.params.value.mode);
        }
        else {
            this.selected(item, this.params.value.mode);
        }
        this.handleOn('selected', item);
    }
    onSelectorKeyup(ev) {
        if ((ev.key === 'Enter' || ev.key === 'Return') && this.storage.value) {
            ev.preventDefault();
            this.onSelectItem();
            return;
        }
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
            yield nextTick();
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
        return undefined;
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
Selector.defaultParams = {};
export const $SL = (params, options) => new Selector(params || {}, options || {});
