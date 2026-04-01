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
exports.$TG = exports.Trigger = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const button_1 = require("./button");
const components_2 = require("vuetify/components");
const dialogs_1 = require("./dialogs");
const part_1 = require("./part");
const field_1 = require("./field");
const appmanager_1 = require("./appmanager");
const misc_1 = require("../misc");
const shortcut_1 = require("./shortcut");
const master_1 = require("../master");
class Trigger extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.sideButtonInstances = [];
        this.childrenInstances = [];
        this.loaded = false;
        this.loading = this.$makeRef(false);
        this.listenersAttached = false;
        this.params = this.$makeRef(Object.assign(Object.assign({}, Trigger.defaultParams), (params || {})));
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.items = this.$makeRef([]);
        this.selected = this.$makeRef([]);
        this.computedHeaders = this.$makeRef([]);
        this.hasRemoveAccess = this.$makeRef(true);
        this.searchText = this.$makeRef("");
        this.selectedSearchFields = this.$makeRef([]);
        this.tableOptions = this.$makeRef({ page: 1, itemsPerPage: 10, total: 0 });
        this.activeRowIndex = this.$makeRef(-1);
        this.resultTableRoot = this.$makeRef();
        this.currentSearchText = "";
        this.searchFieldItems = this.$makeRef([]);
        this.searchFieldData = {};
        this.hasPrintAccess = this.$makeRef(true);
        this.hasExportAccess = this.$makeRef(true);
        this.compactSideActions = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth < 1400 : false);
    }
    static setDefault(value, reset) {
        if (reset) {
            Trigger.defaultParams = value;
        }
        else {
            Trigger.defaultParams = Object.assign(Object.assign({}, Trigger.defaultParams), value);
        }
    }
    get $refs() {
        const items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            if (this.childrenInstances[i] instanceof field_1.Field) {
                const ref = this.childrenInstances[i].$ref;
                if (ref && ref !== '') {
                    items[ref] = this.childrenInstances[i];
                }
            }
        }
        return items;
    }
    get $prefs() {
        const items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            if (this.childrenInstances[i] instanceof part_1.Part) {
                const ref = this.childrenInstances[i].$ref;
                if (ref && ref !== '') {
                    items[ref] = this.childrenInstances[i];
                }
            }
        }
        return items;
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
            try {
                this.hasRemoveAccess.value = (yield this.removeAccess()) || false;
            }
            catch (error) {
                this.hasRemoveAccess.value = false;
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
    removeAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.options.removeAccess ? yield this.options.removeAccess(this) : true;
        });
    }
    canRemove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemId = master_1.Master.getItemId(item, this.params.value.idField);
            if (itemId || itemId === 0) {
                try {
                    yield this.$app.service(this.params.value.objectType).remove(itemId);
                    return true;
                }
                catch (error) {
                    return error.message;
                }
            }
            return 'Undefined Item Id';
        });
    }
    load(searchText, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = null;
            if (this.$params.objectType) {
                let query = yield this.query(searchText, this.params.value.mode);
                if (options.itemsPerPage >= 0) {
                    query.$limit = options.itemsPerPage;
                    query.$skip = (options.page - 1) * query.$limit;
                }
                else {
                    query.$paginate = false;
                }
                data = yield this.$app.service(this.params.value.objectType).find({ query });
            }
            return data;
        });
    }
    query(search, mode) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let query = Object.assign({}, (this.params.value.query || {}));
            if (this.options.query) {
                query = yield this.options.query(search, this, mode, this.selectedSearchFields.value || []);
            }
            else {
                if (this.params.value.selectFields) {
                    query.$select = this.params.value.selectFields;
                }
                if (this.params.value.queryFields && search) {
                    query.$or = this.params.value.queryFields.map((f) => {
                        const fq = {};
                        fq[f] = { $regex: search, $options: 'i' };
                        return fq;
                    });
                }
                if ((this.selectedSearchFields.value || []).length > 0) {
                    let addedQ = [];
                    if ((_a = this.searchFieldData) === null || _a === void 0 ? void 0 : _a.callback) {
                        addedQ = yield this.searchFieldData.callback(search, this.selectedSearchFields.value, this);
                    }
                    else {
                        addedQ = this.selectedSearchFields.value.map((f) => master_1.Master.getItemId(f)).filter((fieldId) => fieldId || fieldId === 0).map((fieldId) => {
                            const fq = {};
                            fq[fieldId] = { $regex: search, $options: 'i' };
                            return fq;
                        });
                    }
                    if (!query.$or)
                        query.$or = [];
                    if (Array.isArray(addedQ)) {
                        query.$or = query.$or.concat(addedQ);
                    }
                    else {
                        query.$or.push(addedQ);
                    }
                }
            }
            if (this.options.processQuery) {
                query = (yield this.options.processQuery(query, this, mode, search, this.selectedSearchFields.value || [])) || query;
            }
            return query;
        });
    }
    props() {
        return [];
    }
    onTableOptionsChanged(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadItems(options);
        });
    }
    loadItems(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading.value = true;
            try {
                let data = null;
                if (this.options.load) {
                    const fulloptions = Object.assign(Object.assign({}, options), { selectedFilterFields: this.selectedSearchFields.value || [] });
                    data = yield this.options.load(this.currentSearchText, this, fulloptions);
                }
                else {
                    data = yield this.load(this.currentSearchText, options);
                }
                if (Array.isArray(data)) {
                    this.items.value = this.options.format ? (yield this.options.format(this, data)) || [] : data;
                    this.tableOptions.value.itemsPerPage = -1;
                    this.tableOptions.value.total = data.length;
                    this.tableOptions.value.page = 1;
                }
                else {
                    this.tableOptions.value.total = data.total;
                    this.items.value = this.options.format ? (yield this.options.format(this, data.data || [])) || [] : data.data || [];
                    this.tableOptions.value.itemsPerPage = data.limit;
                    this.tableOptions.value.page = options.page;
                }
                this.syncActiveRowAfterLoad();
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
        return h(components_1.VContainer, {
            fluid: this.params.value.fluid !== false,
            class: ['fill-height'],
        }, () => h(components_1.VLayout, {
            fullHeight: true,
        }, () => h(components_1.VRow, {
            class: ['fill-height'],
            align: this.outerAlign(),
            alignContent: this.params.value.verticalAlign,
            justify: this.outerJustify(),
        }, () => h(components_1.VCol, {
            cols: 12,
            align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined,
            style: { paddingTop: '16px', paddingBottom: '16px' }
        }, () => this.wrapWithSideButtons(props, context, h(components_1.VCard, {
            onKeydown: (ev) => this.onTriggerKeydown(ev),
            style: this.cardStyle(),
            elevation: this.params.value.elevation,
            class: (this.params.value.horizontalAlign || "center") === "center" ? ['mx-auto'] : []
        }, () => [
            this.buildTitle(props, context),
            ...(this.params.value.subtitle ? [this.buildSubTitle(props, context)] : []),
            this.buildTopActions(props, context),
            h(components_1.VDivider),
            this.buildBody(props, context),
            h(components_1.VDivider),
            this.buildBottomActions(props, context),
        ]))))));
    }
    outerAlign() {
        if (this.params.value.verticalAlign === 'start')
            return 'start';
        if (this.params.value.verticalAlign === 'end')
            return 'end';
        if (this.params.value.verticalAlign === 'stretch')
            return 'stretch';
        return 'center';
    }
    outerJustify() {
        if (this.params.value.horizontalAlign === 'left')
            return 'start';
        if (this.params.value.horizontalAlign === 'right')
            return 'end';
        return 'center';
    }
    cardStyle() {
        return {
            width: this.clampToViewport(this.params.value.width),
            maxWidth: this.clampToViewport(this.params.value.maxWidth, '100%'),
            minWidth: this.clampToViewport(this.params.value.minWidth),
            boxSizing: 'border-box',
        };
    }
    buildTitle(props, context) {
        const h = this.$h;
        return h(components_1.VCardTitle, {}, () => [
            h('span', {}, this.$params.title || '')
        ]);
    }
    buildSubTitle(props, context) {
        const h = this.$h;
        return h(components_1.VCardSubtitle, {}, () => h('span', {}, this.params.value.subtitle || ""));
    }
    buildBody(props, context) {
        const h = this.$h;
        if (!this.hasAccess.value) {
            return h(components_1.VCardText, {
                class: 'text-center'
            }, () => h('span', {
                class: 'title'
            }, 'Access Denied!'));
        }
        return h(components_1.VCardText, {}, () => h(components_1.VRow, {
            justify: this.params.value.justify,
            align: this.params.value.align,
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent,
        }, () => {
            const top = this.options.topChildren ? this.options.topChildren(props, context) : this.topChildren(props, context);
            const bot = this.options.bottomChildren ? this.options.bottomChildren(props, context) : this.bottomChildren(props, context);
            this.childrenInstances = top.concat(bot);
            this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
            });
            return [
                ...this.buildSearchBar(),
                ...(this.searchFieldItems.value.length > 0 ? this.buildFilterBar() : []),
                ...(top.map((instance) => this.$h(instance.component))),
                ...this.buildResultStatus(),
                ...this.buildResultTable(),
                ...(bot.map((instance) => this.$h(instance.component))),
            ];
        }));
    }
    buildSearchBar() {
        const h = this.$h;
        return [
            h(components_1.VCol, { cols: 12 }, () => h(components_1.VTextField, {
                variant: 'outlined',
                placeholder: 'Search Object',
                density: 'compact',
                appendIcon: 'mdi-magnify',
                modelValue: this.searchText.value,
                "onUpdate:modelValue": (value) => {
                    this.searchText.value = value;
                },
                autofocus: true,
                "onClick:append": () => this.onSearchClicked(),
                onKeyup: (ev) => {
                    if (ev.key === 'Enter' || ev.key === 'Return') {
                        this.onSearchClicked();
                    }
                },
            }))
        ];
    }
    buildFilterBar() {
        const h = this.$h;
        return [
            h(components_1.VCol, { cols: 12 }, () => h(components_1.VAutocomplete, {
                variant: 'outlined',
                placeholder: 'Select Additional Search Fields',
                density: 'compact',
                modelValue: this.selectedSearchFields.value,
                "onUpdate:modelValue": (value) => {
                    this.selectedSearchFields.value = value;
                },
                multiple: true,
                itemTitle: "name",
                itemValue: master_1.Master.resolveItemValueField(this.searchFieldItems.value),
                returnObject: true,
                appendIcon: 'mdi-filter-cog',
                items: this.searchFieldItems.value
            }))
        ];
    }
    buildResultTable() {
        const h = this.$h;
        return [
            h(components_1.VCol, {
                cols: 12,
                class: ['pt-0'],
                ref: (el) => this.setResultTableRoot(el),
            }, () => h(components_2.VDataTableServer, {
                headers: this.computedHeaders.value,
                items: this.items.value,
                modelValue: this.selected.value,
                showSelect: true,
                hideNoData: false,
                noDataText: this.currentSearchText || (this.selectedSearchFields.value || []).length > 0
                    ? 'No matching records found. Try a different search.'
                    : 'Enter a search term and press Enter to load results.',
                itemValue: master_1.Master.resolveItemValueField(this.items.value, this.params.value.idField),
                loading: this.loading.value,
                itemsPerPage: this.tableOptions.value.itemsPerPage,
                page: this.tableOptions.value.page,
                returnObject: true,
                itemsLength: this.tableOptions.value.total || 0,
                density: 'compact',
                height: this.params.value.tableHeight || 300,
                fixedHeader: true,
                fixedFooter: true,
                hover: true,
                rowProps: (slot) => this.buildTableRowProps(slot),
                "onUpdate:options": (options) => this.onTableOptionsChanged(options),
                "onClick:row": (ev, item) => this.onTableItemClicked(item),
                "onUpdate:modelValue": (options) => this.onSelectionChanged(options)
            }))
        ];
    }
    buildResultStatus() {
        const h = this.$h;
        let message = '';
        if (this.loading.value) {
            message = 'Loading results...';
        }
        else if ((this.selected.value || []).length > 0) {
            message = `${this.selected.value.length} item(s) selected.`;
        }
        else if (this.currentSearchText || (this.selectedSearchFields.value || []).length > 0) {
            message = `${this.tableOptions.value.total || 0} result(s) found.`;
        }
        else {
            message = 'Search by text or add filters to start browsing records.';
        }
        return [
            h(components_1.VCol, {
                cols: 12,
                class: ['pb-0']
            }, () => h('div', {
                class: ['text-medium-emphasis', 'text-body-2']
            }, message))
        ];
    }
    headers() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                { title: 'Name', key: 'name' }
            ];
        });
    }
    searchFields() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.options.headers ? yield this.options.headers(this) : (this.params.value.headers || (yield this.headers()));
            yield this.runAccess();
            this.computedHeaders.value = headers;
            let sdata = null;
            if (this.options.searchFields) {
                sdata = yield this.options.searchFields(this, this.params.value.mode);
            }
            else {
                sdata = yield this.searchFields();
            }
            if (sdata) {
                this.searchFieldData = sdata;
                this.searchFieldItems.value = sdata.fields || [];
            }
            else {
                this.searchFieldData = {};
                this.searchFieldItems.value = [];
            }
        });
    }
    buildTopActions(props, context) {
        const h = this.$h;
        this.topButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.topButtonInstances = [];
        this.topButtonInstances = this.buildDefaultButtons();
        return h(components_1.VCardActions, {}, () => [
            h(components_1.VSpacer),
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
        return h(components_1.VCardActions, {}, () => [
            h(components_1.VSpacer),
            ...this.bottomButtonInstances.map((b) => h(b.component))
        ]);
    }
    buildSideButtons(props, context) {
        this.sideButtonInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.sideButtonInstances = (this.options.sideButtons ? this.options.sideButtons(props, context, this) : []) || [];
        this.sideButtonInstances.forEach((instance) => {
            instance.setParent(this);
        });
        return this.sideButtonInstances.filter((instance) => !instance.$params.invisible);
    }
    buildDesktopSideActions(buttons) {
        const h = this.$h;
        if (buttons.length === 0 || this.compactSideActions.value) {
            return undefined;
        }
        return h(components_1.VCard, {
            elevation: 2,
            style: {
                width: this.clampToViewport(this.params.value.sideButtonWidth, this.params.value.sideButtonWidth || 180),
                minWidth: 0,
                maxWidth: 'calc(100vw - 32px)',
                alignSelf: 'flex-start',
            },
        }, () => h(components_1.VCardText, {
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px',
            },
        }, () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })]))));
    }
    buildMobileSideActions(buttons) {
        const h = this.$h;
        if (buttons.length === 0 || !this.compactSideActions.value) {
            return undefined;
        }
        const justifyContent = this.params.value.sideButtonPosition === 'left' ? 'flex-start' : 'flex-end';
        const location = this.params.value.sideButtonPosition === 'left' ? 'bottom start' : 'bottom end';
        return h('div', {
            style: {
                width: '100%',
                display: 'flex',
                justifyContent,
                marginBottom: '12px',
            },
        }, [h(components_1.VMenu, {
                location,
            }, {
                activator: ({ props: activatorProps }) => h(components_1.VBtn, Object.assign(Object.assign({}, activatorProps), { variant: 'outlined', color: 'secondary', prependIcon: 'mdi-dots-vertical', size: 'small' }), () => 'Actions'),
                default: () => h(components_1.VCard, {
                    elevation: 2,
                    style: {
                        width: this.clampToViewport(this.params.value.sideButtonWidth, this.params.value.sideButtonWidth || 180),
                        minWidth: 0,
                        maxWidth: 'calc(100vw - 32px)',
                    },
                }, () => h(components_1.VCardText, {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        padding: '12px',
                    },
                }, () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })])))),
            })]);
    }
    wrapWithSideButtons(props, context, content) {
        const h = this.$h;
        const buttons = this.buildSideButtons(props, context);
        const sideActions = this.buildDesktopSideActions(buttons);
        const mobileActions = this.buildMobileSideActions(buttons);
        if (!sideActions && !mobileActions) {
            return h('div', {
                style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: (this.params.value.horizontalAlign || 'center') === 'center' ? 'center' : this.params.value.horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
                },
            }, [content]);
        }
        const desktopChildren = sideActions
            ? (this.params.value.sideButtonPosition === 'left' ? [sideActions, content] : [content, sideActions])
            : [content];
        const desktopContent = desktopChildren.map((child, index) => {
            const isSideAction = !!sideActions && ((this.params.value.sideButtonPosition === 'left' && index === 0) || (this.params.value.sideButtonPosition !== 'left' && index === desktopChildren.length - 1));
            if (isSideAction) {
                return h('div', {
                    style: {
                        flex: '0 0 auto',
                        minWidth: 0,
                        maxWidth: '100%',
                    },
                }, [child]);
            }
            if (sideActions) {
                const sbSize = this.clampToViewport(this.params.value.sideButtonWidth, this.params.value.sideButtonWidth || 180);
                const repSize = `calc(100% - 16px - ${sbSize})`;
                return h('div', {
                    style: {
                        flex: '0 1 auto',
                        minWidth: 0,
                        maxWidth: repSize,
                    },
                }, [child]);
            }
            return h('div', {
                style: {
                    flex: '0 1 auto',
                    minWidth: 0,
                    maxWidth: `calc(100vw - 32px)`,
                },
            }, [child]);
        });
        return h('div', {
            style: {
                width: '100%',
            },
        }, [
            ...(mobileActions ? [mobileActions] : []),
            h('div', {
                style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: (this.params.value.horizontalAlign || 'center') === 'center' ? 'center' : this.params.value.horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
                },
            }, [h('div', {
                    style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        maxWidth: '100%',
                    },
                }, desktopContent)]),
        ]);
    }
    buildDefaultButtons() {
        if (this.hasRemoveAccess.value && this.selected.value && this.selected.value.length > 0) {
            return this.getAdditionalButtons().concat([
                new button_1.Button(Object.assign({ text: 'Remove', color: 'warning' }, (this.params.value.removeButton || {})), {
                    onClicked: () => this.onRemoveClicked()
                }),
                ...(this.params.value.multiple && this.selected.value && this.selected.value.length > 0 ? [
                    new button_1.Button(Object.assign({ text: this.params.value.mode === 'display' ? 'View' : 'Edit', color: 'success' }, (this.params.value.mode === 'display' ? this.params.value.viewButton || {} : this.params.value.editButton || {})), {
                        onClicked: () => this.onProcessMultiple()
                    })
                ] : []),
                new button_1.Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                })
            ]);
        }
        else {
            return this.getAdditionalButtons().concat([
                ...(this.params.value.multiple && this.selected.value && this.selected.value.length > 0 ? [
                    new button_1.Button(Object.assign({ text: this.params.value.mode === 'display' ? 'View' : 'Edit', color: 'success' }, (this.params.value.mode === 'display' ? this.params.value.viewButton || {} : this.params.value.editButton || {})), {
                        onClicked: () => this.onProcessMultiple()
                    })
                ] : []),
                new button_1.Button(Object.assign({ text: 'Cancel', color: 'secondary' }, (this.params.value.cancelButton || {})), {
                    onClicked: () => this.onCancelClicked()
                })
            ]);
        }
    }
    getAdditionalButtons() {
        if (this.params.value.mode === 'create')
            return [];
        const btns = [];
        if (this.params.value.canPrint && this.hasPrintAccess.value) {
            btns.push(new button_1.Button({ text: 'Print', color: 'primary' }, {
                onClicked: () => {
                    this.printAction();
                }
            }));
        }
        if (this.params.value.canExport && this.hasExportAccess.value) {
            btns.push(new button_1.Button({ text: 'Export', color: 'primary' }, {
                onClicked: () => {
                    this.exportAction();
                }
            }));
        }
        return btns;
    }
    topChildren(props, context) {
        return [];
    }
    bottomChildren(props, context) {
        return [];
    }
    onProcessMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.selected.value || [];
            this.handleOn("selected", items);
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
    onTriggerKeydown(ev) {
        if (dialogs_1.Dialogs.hasBlockingDialog() || ev.defaultPrevented) {
            return;
        }
        if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
            if (this.shouldIgnoreEscapeCancel(ev.target)) {
                return;
            }
            ev.preventDefault();
            this.onCancelClicked();
            return;
        }
        if (this.handleTableKeyboardNavigation(ev)) {
            return;
        }
        this.triggerButtonShortcut(ev);
    }
    getShortcutButtons() {
        return this.topButtonInstances.concat(this.bottomButtonInstances).concat(this.sideButtonInstances);
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
            const eventShortcut = (0, shortcut_1.normalizeButtonShortcutFromEvent)(ev, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
            if (!eventShortcut) {
                continue;
            }
            const shortcut = (0, shortcut_1.normalizeButtonShortcut)(button.$params.shortcut, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
            if (!shortcut || shortcut !== eventShortcut) {
                continue;
            }
            ev.preventDefault();
            button.triggerShortcut();
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
    onRemoveClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirm = yield dialogs_1.Dialogs.$confirm('Remove selected items?');
            if (!confirm)
                return;
            const items = this.selected.value || [];
            let hasError = false;
            for (let i = 0; i < items.length; i++) {
                const canRem = this.options.canRemove ? yield this.options.canRemove(items[i], this) : this.canRemove(items[i]);
                if (canRem) {
                    let res = false;
                    if (this.options.remove) {
                        res = yield this.options.remove(items[i], this);
                    }
                    else {
                        res = yield this.remove(items[i]);
                    }
                    if (res !== true) {
                        dialogs_1.Dialogs.$warning(res || 'Unable to remove items');
                        hasError = true;
                        break;
                    }
                }
            }
            if (!hasError) {
                dialogs_1.Dialogs.$success('Items successfully removed!');
            }
            this.selected.value = [];
            yield this.loadItems({ page: 1, itemsPerPage: this.tableOptions.value.itemsPerPage, total: 0 });
        });
    }
    onSearchClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                page: 1,
                itemsPerPage: this.tableOptions.value.itemsPerPage,
                total: 0
            };
            this.activeRowIndex.value = -1;
            this.currentSearchText = this.searchText.value;
            yield this.loadItems(options);
        });
    }
    onTableItemClicked(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = (options === null || options === void 0 ? void 0 : options.item) || {};
            this.setActiveRowByItem(item);
            this.handleOn("selected", item);
        });
    }
    onSelectionChanged(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.selected.value = options;
        });
    }
    setResultTableRoot(el) {
        if (el instanceof HTMLElement) {
            this.resultTableRoot.value = el;
            return;
        }
        const root = el === null || el === void 0 ? void 0 : el.$el;
        this.resultTableRoot.value = root instanceof HTMLElement ? root : undefined;
    }
    buildTableRowProps(slot) {
        const index = this.resolveRowIndex(slot);
        const active = index >= 0 && index === this.activeRowIndex.value;
        return {
            'data-trigger-row-index': index >= 0 ? String(index) : undefined,
            'aria-selected': active ? 'true' : 'false',
            style: active ? {
                outline: '2px solid rgb(var(--v-theme-primary))',
                outlineOffset: '-2px',
                background: 'rgba(var(--v-theme-primary), 0.10)',
            } : undefined,
            onMouseenter: () => {
                if (index >= 0) {
                    this.activeRowIndex.value = index;
                }
            },
        };
    }
    resolveRowIndex(slot) {
        var _a, _b;
        if (typeof (slot === null || slot === void 0 ? void 0 : slot.index) === 'number') {
            return slot.index;
        }
        const raw = ((_a = slot === null || slot === void 0 ? void 0 : slot.item) === null || _a === void 0 ? void 0 : _a.raw) || (slot === null || slot === void 0 ? void 0 : slot.item) || ((_b = slot === null || slot === void 0 ? void 0 : slot.internalItem) === null || _b === void 0 ? void 0 : _b.raw);
        return (this.items.value || []).indexOf(raw);
    }
    hasTableItems() {
        return (this.items.value || []).length > 0;
    }
    syncActiveRowAfterLoad() {
        const items = this.items.value || [];
        if (items.length === 0) {
            this.activeRowIndex.value = -1;
            return;
        }
        if (this.activeRowIndex.value < 0) {
            return;
        }
        if (this.activeRowIndex.value >= items.length) {
            this.activeRowIndex.value = items.length - 1;
        }
        this.scrollActiveRowIntoView();
    }
    setActiveRowByItem(item) {
        if (!(item || item === 0)) {
            return;
        }
        const items = this.items.value || [];
        const itemId = master_1.Master.getItemId(item, this.params.value.idField);
        const index = items.findIndex((entry) => master_1.Master.matchesItemId(entry, itemId, this.params.value.idField) || entry === item);
        if (index >= 0) {
            this.activeRowIndex.value = index;
            this.scrollActiveRowIntoView();
        }
    }
    moveActiveRow(delta) {
        const items = this.items.value || [];
        if (items.length === 0) {
            return false;
        }
        if (this.activeRowIndex.value < 0) {
            this.activeRowIndex.value = 0;
        }
        else {
            const nextIndex = Math.max(0, Math.min(items.length - 1, this.activeRowIndex.value + delta));
            this.activeRowIndex.value = nextIndex;
        }
        this.scrollActiveRowIntoView();
        return true;
    }
    scrollActiveRowIntoView() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, vue_1.nextTick)();
            const root = this.resultTableRoot.value;
            if (!root || this.activeRowIndex.value < 0) {
                return;
            }
            const row = root.querySelector(`[data-trigger-row-index="${this.activeRowIndex.value}"]`);
            row === null || row === void 0 ? void 0 : row.scrollIntoView({ block: 'nearest' });
        });
    }
    activateActiveRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.items.value || [];
            if (items.length === 0) {
                return false;
            }
            const index = this.activeRowIndex.value >= 0 ? this.activeRowIndex.value : 0;
            const item = items[index];
            if (!item) {
                return false;
            }
            this.activeRowIndex.value = index;
            yield this.onTableItemClicked({ item });
            return true;
        });
    }
    hasPreviousPage() {
        return (this.tableOptions.value.page || 1) > 1;
    }
    hasNextPage() {
        const itemsPerPage = Number(this.tableOptions.value.itemsPerPage || 0);
        if (itemsPerPage <= 0) {
            return false;
        }
        const total = Number(this.tableOptions.value.total || 0);
        return (this.tableOptions.value.page || 1) < Math.ceil(total / itemsPerPage);
    }
    goToRelativePage(delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsPerPage = this.tableOptions.value.itemsPerPage;
            if (!(Number(itemsPerPage) > 0)) {
                return false;
            }
            const page = (this.tableOptions.value.page || 1) + delta;
            if (page < 1) {
                return false;
            }
            if (delta < 0 && !this.hasPreviousPage()) {
                return false;
            }
            if (delta > 0 && !this.hasNextPage()) {
                return false;
            }
            this.activeRowIndex.value = -1;
            yield this.loadItems({
                page,
                itemsPerPage: this.tableOptions.value.itemsPerPage,
                total: this.tableOptions.value.total,
                selectedFilterFields: this.selectedSearchFields.value || [],
            });
            return true;
        });
    }
    handleTableKeyboardNavigation(ev) {
        if (ev.altKey) {
            return false;
        }
        if (!ev.ctrlKey && !ev.metaKey && !ev.shiftKey && ev.key === 'ArrowDown' && this.hasTableItems()) {
            ev.preventDefault();
            return this.moveActiveRow(1);
        }
        if (!ev.ctrlKey && !ev.metaKey && !ev.shiftKey && ev.key === 'ArrowUp' && this.hasTableItems()) {
            ev.preventDefault();
            return this.moveActiveRow(-1);
        }
        if (!ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && (ev.key === 'Enter' || ev.key === 'Return') && this.hasTableItems()) {
            ev.preventDefault();
            void this.activateActiveRow();
            return true;
        }
        if (!ev.ctrlKey && !ev.metaKey && !ev.shiftKey && ev.key === 'PageUp') {
            ev.preventDefault();
            void this.goToRelativePage(-1);
            return true;
        }
        if (!ev.ctrlKey && !ev.metaKey && !ev.shiftKey && ev.key === 'PageDown') {
            ev.preventDefault();
            void this.goToRelativePage(1);
            return true;
        }
        return false;
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
            return yield appmanager_1.AppManager.$printer.getTemplateIdByName(this.params.value.printTemplate);
        });
    }
    printAction() {
        return __awaiter(this, void 0, void 0, function* () {
            dialogs_1.Dialogs.$showProgress({});
            const template = yield this.printTemplate();
            if (template) {
                const info = yield this.beforePrint();
                const data = { $info: info, $master: this.$master, $rep: this, $func: appmanager_1.AppManager.$printer.printFunctions() };
                this.handleOn('before-print', data);
                yield appmanager_1.AppManager.$printer.printReportById(template, data);
                this.handleOn('after-print', data);
            }
            dialogs_1.Dialogs.$hideProgress();
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
            const temp = yield appmanager_1.AppManager.$printer.getTemplateIdByName(this.params.value.exportTemplate);
            return { template: temp, filename: 'data.xlsx' };
        });
    }
    exportAction() {
        return __awaiter(this, void 0, void 0, function* () {
            dialogs_1.Dialogs.$showProgress({});
            const templateInfo = yield this.exportTemplate();
            const template = templateInfo === null || templateInfo === void 0 ? void 0 : templateInfo.template;
            if (template) {
                const info = yield this.beforeExport();
                const data = { $info: info, $master: this.$master, $rep: this, $func: appmanager_1.AppManager.$printer.printFunctions() };
                this.handleOn('before-export', data);
                const code = yield appmanager_1.AppManager.$printer.getTemplate(template, "excel");
                const excelData = yield (0, misc_1.computeFunctionalCodeAsync)(code, {
                    params: ['$info', '$master', '$func'],
                    data
                });
                const workbook = misc_1.$excel.writeData(excelData.sheetNames || [], excelData.data || {});
                yield misc_1.$excel.saveWorkBook(templateInfo.filename || 'data.xlsx', workbook);
                this.handleOn('after-export', data);
            }
            dialogs_1.Dialogs.$hideProgress();
        });
    }
    attachEventListeners() {
        this.attachSideActionBreakpoint();
        if (typeof window !== 'undefined' && !this.shortcutHandler) {
            this.shortcutHandler = (ev) => this.onTriggerKeydown(ev);
            window.addEventListener('keydown', this.shortcutHandler);
        }
        super.attachEventListeners();
        this.listenersAttached = true;
    }
    removeEventListeners() {
        this.detachSideActionBreakpoint();
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
        super.removeEventListeners();
        this.listenersAttached = false;
    }
    syncSideActionBreakpoint(matches) {
        this.compactSideActions.value = matches !== null && matches !== void 0 ? matches : (typeof window !== 'undefined' ? window.innerWidth < 1400 : false);
    }
    toCssSize(value) {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }
        return typeof value === 'number' ? `${value}px` : value;
    }
    clampToViewport(value, fallback) {
        const size = this.toCssSize(value !== null && value !== void 0 ? value : fallback);
        if (!size) {
            return undefined;
        }
        if (size.includes('%') || size.includes('vw') || size.includes('vh') || size.includes('calc(') || size.includes('min(') || size.includes('max(') || size.includes('clamp(')) {
            return size;
        }
        return `min(calc(100vw - 32px), ${size})`;
    }
    attachSideActionBreakpoint() {
        if (typeof window === 'undefined' || this.sideActionMediaQuery) {
            return;
        }
        this.sideActionMediaQuery = window.matchMedia('(max-width: 1399px)');
        this.syncSideActionBreakpoint(this.sideActionMediaQuery.matches);
        this.sideActionMediaHandler = (ev) => {
            this.syncSideActionBreakpoint(ev.matches);
        };
        if (typeof this.sideActionMediaQuery.addEventListener === 'function') {
            this.sideActionMediaQuery.addEventListener('change', this.sideActionMediaHandler);
        }
        else {
            this.sideActionMediaQuery.addListener(this.sideActionMediaHandler);
        }
    }
    detachSideActionBreakpoint() {
        if (!this.sideActionMediaQuery || !this.sideActionMediaHandler) {
            this.sideActionMediaQuery = undefined;
            this.sideActionMediaHandler = undefined;
            return;
        }
        if (typeof this.sideActionMediaQuery.removeEventListener === 'function') {
            this.sideActionMediaQuery.removeEventListener('change', this.sideActionMediaHandler);
        }
        else {
            this.sideActionMediaQuery.removeListener(this.sideActionMediaHandler);
        }
        this.sideActionMediaQuery = undefined;
        this.sideActionMediaHandler = undefined;
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
exports.Trigger = Trigger;
Trigger.defaultParams = {
    fluid: true,
    sideButtonPosition: 'right',
    sideButtonWidth: 180,
};
const $TG = (params, options) => new Trigger(params || {}, options || {});
exports.$TG = $TG;
