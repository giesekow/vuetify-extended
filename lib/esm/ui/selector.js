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
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VCardSubtitle, VCol, VDialog, VAutocomplete } from 'vuetify/components';
import { Button } from "./button";
export class Selector extends UIBase {
    constructor(params, options) {
        super();
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.loaded = false;
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.items = this.$makeRef([]);
        this.storage = this.$makeRef();
        this.dialog = this.$makeRef(false);
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
            persistent: true,
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth
        }, () => h(VCard, {
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
        ]));
    }
    buildSearchBar() {
        const h = this.$h;
        return [
            h(VCol, {}, () => h(VAutocomplete, {
                variant: 'outlined',
                placeholder: 'Search Object',
                density: 'compact',
                modelValue: this.storage,
                autofocus: true,
                multiple: this.params.value.multiple,
                items: this.items.value,
                itemTitle: this.params.value.textField || "name",
                itemValue: this.params.value.idField || "_id",
                returnObject: this.params.value.returnObject
            }))
        ];
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadItems();
            this.storage.value = null;
            this.dialog.value = true;
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
export const $SL = (params, options) => new Selector(params || {}, options || {});
