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
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const button_1 = require("./button");
const components_2 = require("vuetify/components");
const dialogs_1 = require("./dialogs");
const part_1 = require("./part");
const field_1 = require("./field");
const appmanager_1 = require("./appmanager");
const misc_1 = require("../misc");
class Trigger extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.topButtonInstances = [];
        this.bottomButtonInstances = [];
        this.childrenInstances = [];
        this.loaded = false;
        this.loading = this.$makeRef(false);
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        this.hasAccess = this.$makeRef(true);
        this.items = this.$makeRef([]);
        this.selected = this.$makeRef([]);
        this.computedHeaders = this.$makeRef([]);
        this.hasRemoveAccess = this.$makeRef(true);
        this.searchText = this.$makeRef("");
        this.selectedSearchFields = this.$makeRef([]);
        this.tableOptions = this.$makeRef({ page: 1, itemsPerPage: 10, total: 0 });
        this.currentSearchText = "";
        this.searchFieldItems = this.$makeRef([]);
        this.searchFieldData = {};
        this.hasPrintAccess = this.$makeRef(true);
        this.hasExportAccess = this.$makeRef(true);
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
            const itemId = item[this.params.value.idField || "_id"];
            if (itemId) {
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
                        addedQ = this.selectedSearchFields.value.filter((f) => f._id).map((f) => {
                            const fq = {};
                            fq[f._id] = { $regex: search, $options: 'i' };
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
            fluid: this.params.value.fluid,
            class: ['fill-height'],
        }, () => h(components_1.VLayout, {
            fullHeight: true,
        }, () => h(components_1.VRow, {
            alignContent: this.params.value.verticalAlign,
            justify: "center"
        }, () => h(components_1.VCol, {
            cols: 12,
            align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined
        }, () => h(components_1.VCard, {
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth,
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
        ])))));
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
                ...(top.map((instance) => this.$h(instance))),
                ...this.buildResultTable(),
                ...(bot.map((instance) => this.$h(instance))),
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
                modelValue: this.searchText,
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
                modelValue: this.selectedSearchFields,
                multiple: true,
                itemTitle: "name",
                itemValue: "_id",
                returnObject: true,
                appendIcon: 'mdi-filter-cog',
                items: this.searchFieldItems.value
            }))
        ];
    }
    buildResultTable() {
        const h = this.$h;
        return [
            h(components_2.VDataTableServer, {
                headers: this.computedHeaders.value,
                items: this.items.value,
                modelValue: this.selected.value,
                showSelect: true,
                hideNoData: true,
                itemValue: this.params.value.idField || "_id",
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
                "onUpdate:options": (options) => this.onTableOptionsChanged(options),
                "onClick:row": (ev, item) => this.onTableItemClicked(item),
                "onUpdate:modelValue": (options) => this.onSelectionChanged(options)
            })
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
            this.currentSearchText = this.searchText.value;
            yield this.loadItems(options);
        });
    }
    onTableItemClicked(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = (options === null || options === void 0 ? void 0 : options.item) || {};
            this.handleOn("selected", item);
        });
    }
    onSelectionChanged(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.selected.value = options;
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
const $TG = (params, options) => new Trigger(params || {}, options || {});
exports.$TG = $TG;
