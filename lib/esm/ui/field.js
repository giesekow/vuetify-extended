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
import { VAutocomplete, VBtn, VCard, VCardActions, VCardText, VCol, VColorPicker, VCombobox, VDialog, VIcon, VImg, VListItem, VRow, VSelect, VSheet, VSpacer, VSwitch, VTextField, VTextarea } from 'vuetify/components';
import { VAceEditor } from 'vue3-ace-editor';
import { Master } from "../master";
// import { VueEditor } from "vue3-editor";
import ace from 'ace-builds';
import { SimpleDate, SimpleTime, fileToBase64, selectFile, sleep } from "../misc";
import { VDataTable, VDataTableFooter, VDataTableServer, VDataTableVirtual } from "vuetify/lib/labs/components.mjs";
import Datepicker from '@vuepic/vue-datepicker';
import VueApexCharts from 'vue3-apexcharts';
import { GoogleMap, Marker } from "vue3-google-map";
import VueEditor from '@tinymce/tinymce-vue';
import { $v } from "../misc";
import '@vuepic/vue-datepicker/dist/main.css';
import { Dialogs } from "./dialogs";
import nestedProperty from "nested-property";
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@" + ace.version + "/src-noconflict/");
export const fieldTypeOptions = [
    { name: 'Text', _id: 'text' }, { name: 'Select', _id: 'select' }, { name: 'Autocomplete', _id: 'autocomplete' },
    { name: 'Label', _id: 'label' }, { name: 'Messaging Box', _id: 'messagingbox' }, { name: 'Chart', _id: 'chart' },
    { name: 'View Table', _id: 'viewtable' }, { name: 'Map', _id: 'map' }, { name: 'Code', _id: 'code' },
    { name: 'Color', _id: 'color' }, { name: 'HTML', _id: 'html' }, { name: 'Time', _id: 'time' },
    { name: 'Date', _id: 'date' }, { name: 'Datetime', _id: 'datetime' }, { name: 'Button', _id: 'button' },
    { name: 'Image', _id: 'image' }, { name: 'Document', _id: 'document' }, { name: 'Password', _id: 'password' },
    { name: 'Float', _id: 'float' }, { name: 'Integer', _id: 'integer' }, { name: 'Decimal', _id: 'decimal' },
    { name: 'Collection', _id: 'collection' }, { name: 'Textarea', _id: 'textarea' }, { name: 'Boolean', _id: 'boolean' },
    { name: 'Table', _id: 'table' }, { name: 'Report Table', _id: 'reporttable' }, { name: 'Server Table', _id: 'servertable' },
];
export class Field extends UIBase {
    constructor(params, options) {
        super();
        this.modelValue = this.$makeRef();
        this.params = this.$makeRef(params || {});
        this.changing = false;
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options.master);
        this.options = options || {};
        this.selectItems = this.$makeRef([]);
        this.optionLoaded = this.$makeRef(false);
        this.collectionLoaded = this.$makeRef(false);
        this.collectionDialog = this.$makeRef(false);
        this.collectionSelectedItems = this.$makeRef([]);
        this.chartLoaded = this.$makeRef(false);
        this.chartOpts = this.$makeRef();
        this.chartValue = this.$makeRef();
        this.loading = this.$makeRef(false);
        this.tableLoaded = this.$makeRef(false);
        this.tableHeaders = this.$makeRef([]);
        this.tableItems = this.$makeRef([]);
        this.tableItemsPerPage = this.$makeRef(25);
        this.tableTotalItems = this.$makeRef(0);
        this.tablePage = this.$makeRef(1);
        this.currentCollectionItems = [];
        this.currentCollectionFooter = [];
        this.maxWidth = this.$makeRef(null);
    }
    static setDefault(value, reset) {
        if (reset) {
            Field.defaultParams = value;
        }
        else {
            Field.defaultParams = Object.assign(Object.assign({}, Field.defaultParams), value);
        }
    }
    get $refs() {
        const p = this.$parent;
        if (p)
            return p.$refs || {};
        return {};
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
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.readonly;
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
    }
    get $mode() {
        var _a;
        return (_a = this.$parentReport) === null || _a === void 0 ? void 0 : _a.$params.mode;
    }
    get $value() {
        const val = this.postprocess(this.modelValue.value);
        if (this.params.value.type === 'decimal') {
            if ((val === null || val === void 0 ? void 0 : val.$numberDecimal) !== undefined)
                return Number(val.$numberDecimal);
        }
        return val;
    }
    get $options() {
        return this.selectItems.value || [];
    }
    get $collectionForm() {
        return this.collectionForm;
    }
    props() {
        return [];
    }
    setup(props, context) {
        this.$watch(this.modelValue, () => {
            if (!this.changing)
                this.valueChanged();
        });
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    valueChanged(newValue) {
        if (this.changing) {
            return;
        }
        this.changing = true;
        const value = this.postprocess(newValue !== undefined ? newValue : this.modelValue.value);
        if (this.$master && this.params.value.storage) {
            this.$master.$set(this.params.value.storage, value);
        }
        if (this.options.modifies) {
            this.options.modifies = value;
        }
        if (this.options.changed)
            this.options.changed(this);
        this.handleOn('changed', value);
        this.changing = false;
    }
    attachEventListeners() {
        if (this.$master) {
            this.$master.on('changed', () => this.updateValue(), this.$id);
            this.$master.on('loaded', () => this.updateValue(), this.$id);
            this.$master.on('reset', () => this.updateValue(), this.$id);
        }
    }
    removeEventListeners() {
        if (this.$master) {
            this.$master.clearListeners(this.$id);
        }
    }
    updateValue() {
        if (!this.changing) {
            this.changing = true;
            if (this.$master && this.params.value.storage) {
                const defval = this.params.value.default !== undefined ? this.params.value.default : (this.options.default ? this.options.default(this) : undefined);
                let value = this.preprocess(this.$master.$get(this.params.value.storage, defval));
                if (this.params.value.type === 'collection' && value) {
                    value = this.attachIndex(value || []);
                    this.$master.$set(this.params.value.storage, value);
                }
                if (this.isEqual(this.modelValue.value, value)) {
                    this.changing = false;
                    return;
                }
                this.modelValue.value = value;
                if (this.options.modifies) {
                    this.options.modifies.value = value;
                }
            }
            else if (this.params.value.default !== undefined || this.options.default) {
                if (this.modelValue.value === undefined) {
                    const defval = this.params.value.default !== undefined ? this.params.value.default : (this.options.default ? this.options.default(this) : undefined);
                    const value = this.preprocess(defval);
                    if (this.isEqual(this.modelValue.value, value)) {
                        this.changing = false;
                        return;
                    }
                    this.modelValue.value = value;
                    if (this.options.modifies) {
                        this.options.modifies.value = value;
                    }
                }
            }
            this.changing = false;
        }
    }
    isEqual(value1, value2) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            if (value1.length !== value2.length)
                return false;
            for (let i = 0; i < value1.length; i++) {
                if (value1[i] !== value2[i])
                    return false;
            }
            return true;
        }
        else {
            return value1 === value2;
        }
    }
    preprocess(value) {
        if (value === undefined || value === null)
            return value;
        if (this.params.value.type === "date") {
            if (Array.isArray(value)) {
                return value.map((v) => new SimpleDate(v).toString());
            }
            return new SimpleDate(value).toString();
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => new SimpleTime(v).toString());
            }
            return new SimpleTime(value).toString();
        }
        if (this.params.value.type === 'decimal') {
            if (value.$numberDecimal !== undefined) {
                return value.$numberDecimal;
            }
        }
        return value;
    }
    postprocess(value) {
        if (value === undefined || value === null)
            return value;
        if (this.params.value.type === "date") {
            if (Array.isArray(value)) {
                return value.map((v) => new SimpleDate(v).toNumber());
            }
            return new SimpleDate(value).toNumber();
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => new SimpleTime(v).toNumber());
            }
            return new SimpleTime(value).toNumber();
        }
        if (this.params.value.type === 'decimal') {
            if (value.$numberDecimal === undefined && value !== undefined && value !== null) {
                const dp = this.params.value.decimalPlaces || 2;
                return { $numberDecimal: Number(value || 0).toFixed(dp) };
            }
        }
        return value;
    }
    selectOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.selectOptions)
                return yield this.options.selectOptions(this);
            return [];
        });
    }
    button() {
        if (this.options.button)
            return this.options.button(this);
        return undefined;
    }
    form() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.form)
                return yield this.options.form(this);
            return undefined;
        });
    }
    headers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.headers)
                return yield this.options.headers(this);
        });
    }
    items(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.items)
                return yield this.options.items(this, options);
        });
    }
    chartOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.chartOptions)
                return yield this.options.chartOptions(this);
        });
    }
    chartData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.chartData)
                return yield this.options.chartData(this);
        });
    }
    loadChart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chartOpts.value = yield this.chartOptions();
            this.chartValue.value = yield this.chartData();
            this.chartLoaded.value = true;
        });
    }
    loadOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const options = yield this.selectOptions();
            if (options) {
                this.selectItems.value = options;
            }
            else {
                this.selectItems.value = [];
            }
        });
    }
    messageFormat(data) {
        if (this.options.messageFormat)
            return this.options.messageFormat(this, data) || [];
        return data;
    }
    $reload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.loading.value = true;
            yield sleep(100);
            this.loading.value = false;
        });
    }
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        if (this.loading.value) {
            return;
        }
        return h(VCol, {
            cols: this.params.value.cols || 12,
            lg: this.params.value.lg,
            xs: this.params.value.xs,
            md: this.params.value.md,
            xl: this.params.value.xl,
            xxl: this.params.value.xxl,
            sm: this.params.value.sm,
            onVnodeMounted: (props) => {
                if (props.el) {
                    const el = props.el;
                    this.maxWidth.value = el.offsetWidth - 20;
                }
            }
        }, () => this.build(props, context));
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.invisible)
                return undefined;
            if (this.options.validate)
                return yield this.options.validate(this);
        });
    }
    rules() {
        if (this.options.rules)
            return this.options.rules(this);
        const items = [];
        if (this.params.value.required) {
            items.push($v.isRequired());
        }
        if (this.params.value.validation) {
            const v = this.params.value.validation;
            let converter = undefined;
            if (this.params.value.type === 'date')
                converter = (v) => (new SimpleDate(v)).toNumber();
            if (this.params.value.type === 'datetime')
                converter = (v) => new Date(v);
            if (this.params.value.type === 'float')
                converter = Number;
            if (this.params.value.type === 'integer')
                converter = Number;
            if (this.params.value.type === 'time')
                converter = (v) => (new SimpleTime(v)).toNumber();
            if (v.range)
                items.push($v.range(v.range.from, v.range.to, v.range.converter || converter));
            if (v.max)
                items.push($v.max(v.max.value, v.max.converter || converter));
            if (v.min)
                items.push($v.min(v.min.value, v.min.converter || converter));
            if (v.gt)
                items.push($v.gt(v.gt.value, v.gt.converter || converter));
            if (v.lt)
                items.push($v.lt(v.lt.value, v.lt.converter || converter));
            if (v.gte)
                items.push($v.gte(v.gte.value, v.gte.converter || converter));
            if (v.lte)
                items.push($v.lte(v.lte.value, v.lte.converter || converter));
            if (v.neq)
                items.push($v.neq(v.neq.value, v.neq.converter || converter));
            if (v.eq)
                items.push($v.eq(v.eq.value, v.eq.converter || converter));
            if (v.in)
                items.push($v.in(v.in));
            if (v.nin)
                items.push($v.nin(v.nin));
            if (v.includes !== undefined)
                items.push($v.includes(v.includes));
            if (v.excludes !== undefined)
                items.push($v.excludes(v.excludes));
            if (v.maxLen || v.maxLen === 0)
                items.push($v.maxLen(v.maxLen));
            if (v.minLen || v.minLen === 0)
                items.push($v.minLen(v.minLen));
            if (v.regex)
                items.push($v.regex(v.regex));
        }
        return items;
    }
    build(props, context) {
        const ftype = this.params.value.type || 'text';
        switch (ftype) {
            case 'text':
            case 'password':
                return this.buildText(props, context, ftype);
            case 'select':
            case 'autocomplete':
                {
                    if (!this.optionLoaded.value) {
                        this.optionLoaded.value = true;
                        this.loadOptions();
                    }
                    return ftype === 'autocomplete' ? this.buildAutocomplete(props, context) : this.buildSelect(props, context);
                }
            case 'label':
                return this.buildLabel(props, context);
            case 'boolean':
                return this.buildBoolean(props, context);
            case 'button':
                return this.buildButton(props, context);
            case 'chart':
                return this.buildChart(props, context);
            case 'code':
                return this.buildCode(props, context);
            case 'collection':
                return this.buildCollection(props, context);
            case 'color':
                return this.buildColor(props, context);
            case 'date':
                return this.buildDate(props, context);
            case 'datetime':
                return this.buildDatetime(props, context);
            case 'document':
                {
                    if (!this.params.value.fileAccepts) {
                        this.params.value.fileAccepts = 'application/pdf, *.pdf';
                    }
                    return this.buildImage(props, context);
                }
            case 'float':
            case 'decimal':
                return this.buildText(props, context, 'number');
            case 'map':
                return this.buildMap(props, context);
            case 'html':
                return this.buildHTML(props, context);
            case 'image':
                {
                    if (!this.params.value.fileAccepts) {
                        this.params.value.fileAccepts = 'image/*';
                    }
                    return this.buildImage(props, context);
                }
            case 'integer':
                return this.buildInteger(props, context);
            case 'messagingbox':
                return this.buildMessageBox(props, context);
            case 'table':
                return this.buildTable(props, context);
            case 'textarea':
                return this.buildTextArea(props, context);
            case 'viewtable':
                return this.buildViewTable(props, context);
            case 'servertable':
                return this.buildServerTable(props, context);
            case 'reporttable':
                return this.buildReportTable(props, context);
            case 'time':
                return this.buildTime(props, context);
        }
        return this.$h('div');
    }
    buildText(props, context, type) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, {
                modelValue: this.modelValue,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
                readonly: this.$readonly,
                multiple: true,
                type,
                chips: true,
                items: [],
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
            });
        }
        else {
            return h(VTextField, {
                modelValue: this.modelValue,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant),
                readonly: this.$readonly,
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
                type
            });
        }
    }
    buildLabel(props, context) {
        const h = this.$h;
        return h('div', {
            class: this.params.value.class || ['text-subtitle-2'],
            style: this.params.value.style || {}
        }, this.params.value.label);
    }
    buildSelect(props, context) {
        var _a;
        const h = this.$h;
        return h(VSelect, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            itemTitle: this.params.value.itemTitle || 'name',
            itemValue: this.params.value.itemValue || '_id',
            readonly: this.$readonly,
            items: this.selectItems.value,
            multiple: this.params.value.multiple,
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildAutocomplete(props, context) {
        var _a;
        const h = this.$h;
        return h(VAutocomplete, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            itemTitle: this.params.value.itemTitle || 'name',
            itemValue: this.params.value.itemValue || '_id',
            readonly: this.$readonly,
            items: this.selectItems.value,
            multiple: this.params.value.multiple,
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildHTML(props, context) {
        const h = this.$h;
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {
                class: ['text-subtitle-2']
            }, this.params.value.label)),
            h(VCol, {
                cols: 12,
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VueEditor, {
                apiKey: 'ee1xu2usg9edqb2dtfggyg50ghsc6snlrhdkagr9425luz2a',
                modelValue: this.modelValue.value,
                readonly: this.$readonly,
                disabled: this.$readonly,
                init: {
                    plugins: 'lists link table image emoticons autoresize'
                },
                placeholder: this.params.value.placeholder,
                height: this.params.value.height || 300,
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                "onUpdate:modelValue": (v) => {
                    this.modelValue.value = v;
                }
            }))),
        ]);
    }
    buildButton(props, context) {
        const h = this.$h;
        const btn = this.button();
        if (btn)
            return h(btn.component);
        return undefined;
    }
    buildCode(props, context) {
        const h = this.$h;
        if (!this.modelValue.value)
            this.modelValue.value = "";
        const editor = h(VAceEditor, {
            value: this.modelValue.value,
            lang: this.params.value.lang || 'text',
            theme: this.params.value.codeTheme || "chrome",
            readonly: this.$readonly,
            placeholder: this.params.value.placeholder,
            class: this.params.value.class || [],
            style: Object.assign(Object.assign({ "font-size": "12pt" }, (this.params.value.style || {})), { height: this.params.value.height || "300px", "max-width": this.maxWidth.value }),
            onInit: (e) => {
                e.setOptions({ useWorker: ['json', 'javascript', 'html'].includes(this.params.value.lang || 'text') });
            },
            "onUpdate:value": (v) => {
                this.modelValue.value = v;
            }
        });
        return [
            h('div', {
                class: ['ml-4', 'mb-4']
            }, h('label', {}, this.params.value.label)),
            editor
        ];
    }
    buildColor(props, context) {
        const h = this.$h;
        const dialog = this.$makeRef(false);
        const temp = this.$makeRef();
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('span', {
                class: ['ml-4']
            }, this.params.value.label)),
            h(VCol, {
                class: [],
            }, () => [
                h(VListItem, {
                    lines: 'two',
                    class: ['py-0', 'my-0'],
                }, {
                    prepend: () => h('div', {
                        class: ['v-color-picker-preview__dot', 'ml-4'],
                        style: { cursor: 'pointer', width: '30px', height: '30px', display: 'inline-block' },
                        onClick: () => {
                            dialog.value = true;
                        }
                    }, h('div', {
                        class: [],
                        style: { cursor: 'pointer', 'background-color': this.modelValue.value, width: '30px', height: '30px', display: 'inline-block' },
                        onClick: () => {
                            dialog.value = true;
                        }
                    })),
                    title: () => h('div', {
                        class: ['text-h6'],
                        style: { cursor: 'pointer', display: 'inline-block' },
                        onClick: () => {
                            dialog.value = true;
                        }
                    }, this.modelValue.value)
                }),
            ]),
            h(VDialog, {
                modelValue: dialog.value,
                maxWidth: 350,
                persistent: true
            }, () => h(VCard, {}, () => [
                h(VCardText, {}, () => h(VColorPicker, {
                    modelValue: temp.value,
                    mode: "hexa",
                    "onUpdate:modelValue": (v) => {
                        temp.value = v;
                    }
                })),
                h(VCardActions, {}, () => [
                    h(VSpacer),
                    h(VBtn, {
                        color: "error",
                        onClick: () => {
                            dialog.value = false;
                        }
                    }, () => "Cancel"),
                    h(VBtn, {
                        color: "success",
                        onClick: () => {
                            this.modelValue.value = temp.value;
                            dialog.value = false;
                        }
                    }, () => "Save")
                ])
            ]))
        ]);
    }
    buildTime(props, context) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, {
                modelValue: this.modelValue,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
                readonly: this.$readonly,
                multiple: true,
                type: "time",
                chips: true,
                items: [],
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
            });
        }
        else {
            return h(VTextField, {
                modelValue: this.modelValue,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant),
                readonly: this.$readonly,
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
                type: "time"
            });
        }
    }
    buildDate(props, context) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(VCombobox, {
                modelValue: this.modelValue.value,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
                readonly: this.$readonly,
                multiple: true,
                type: "date",
                chips: true,
                items: [],
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
                "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                }
            });
        }
        else {
            return h(VTextField, {
                modelValue: this.modelValue.value,
                autofocus: this.params.value.autofocus,
                label: this.params.value.label || "",
                hint: this.params.value.hint || "",
                persistentHint: this.params.value.hint ? true : false,
                placeholder: this.params.value.placeholder || "",
                clearable: this.params.value.clearable || false,
                color: this.params.value.color || "primary",
                variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant),
                readonly: this.$readonly,
                class: this.params.value.class || [],
                style: this.params.value.style || {},
                rules: this.rules(),
                type: "date",
                "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                }
            });
        }
    }
    buildDatetime(props, context) {
        var _a;
        const h = this.$h;
        return [
            h('div', {
                class: ['mb-2', 'ml-4']
            }, this.params.value.label || ""),
            h(Datepicker, Object.assign(Object.assign({ modelValue: this.modelValue.value, autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules() }, (this.options.datetimeOptions || {})), { "onUpdate:model-value": (value) => {
                    this.modelValue.value = value;
                } }))
        ];
    }
    buildPassword(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            readonly: this.$readonly,
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            type: 'password',
            rules: this.rules()
        });
    }
    buildFloat(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            readonly: this.$readonly,
            type: 'number',
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildInteger(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextField, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            readonly: this.$readonly,
            type: 'number',
            "onBeforeinput": (v) => {
                if (v.inputType === 'insertText' && v.data) {
                    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'].includes(v.data)) {
                        v.preventDefault();
                    }
                }
            },
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildCollection(props, context) {
        const h = this.$h;
        if (!this.collectionLoaded.value) {
            this.loadCollectionInformation();
        }
        else {
            let items = this.modelValue.value || [];
            items = items.slice(this.params.value.collectionStart, this.params.value.collectionEnd);
            this.currentCollectionItems = this.format(items);
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.currentCollectionItems);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12,
                md: 9,
                class: ['py-0', 'pl-6']
            }, () => [
                h('div', {}, this.params.value.label)
            ]),
            h(VCol, {
                cols: 12,
                md: 3,
                align: "end",
                class: ['my-0', 'py-0']
            }, () => [
                ...(this.collectionSelectedItems.value.length > 0 && !this.$readonly && !this.params.value.collectionDisableRemove ? [
                    h(VBtn, {
                        color: 'error',
                        size: 28,
                        class: ['mr-4'],
                        onClick: () => {
                            this.onCollectionItemRemoved();
                        }
                    }, () => [
                        h(VIcon, { size: 24 }, () => 'mdi-delete'),
                    ])
                ] : []),
                ...(this.$readonly || this.params.value.collectionDisableAdd || (this.params.value.collectionEnd !== undefined && this.params.value.collectionEnd <= (this.modelValue.value || []).length) ? [] : [
                    h(VBtn, {
                        color: 'primary',
                        size: 28,
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            yield this.createCollectionForm();
                            if (this.collectionForm) {
                                this.collectionForm.$params.mode = 'create';
                                this.collectionForm.setParent(this);
                                (_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$reset({});
                            }
                            this.collectionDialog.value = true;
                        })
                    }, () => [
                        h(VIcon, { size: 24 }, () => 'mdi-plus'),
                    ])
                ])
            ]),
            h(VCol, {
                cols: 12,
                class: ['my-0', 'py-0'],
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VDataTable, {
                headers: this.collectionHeaders || [],
                items: this.currentCollectionItems,
                density: 'compact',
                showSelect: !this.$readonly,
                itemValue: '__index',
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                height: this.params.value.height || 200,
                modelValue: this.collectionSelectedItems.value,
                "onUpdate:modelValue": (value) => {
                    this.collectionSelectedItems.value = value;
                },
                "onClick:row": (_, { item }) => {
                    this.onCollectionItemClicked(item);
                }
            }, Object.assign({}, (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(VDataTable, {
                        headers: options.headers,
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(VDataTableFooter, {})
                ]
            } : {}))))),
            ...(this.collectionLoaded.value ? [
                h(VCol, {
                    align: 'center',
                    cols: 12
                }, () => h(VDialog, {
                    modelValue: this.collectionDialog.value,
                    persistent: true,
                    scrollable: true,
                    "onUpdate:modelValue": (v) => {
                        this.collectionDialog.value = v;
                    }
                }, () => this.collectionForm ? h(this.collectionForm.component, { class: ['mx-auto'] }) : undefined))
            ] : [])
        ]);
    }
    buildMessageBox(props, context) {
        const h = this.$h;
        let items = this.modelValue.value || [];
        if (!Array.isArray(items))
            items = [items];
        items = this.messageFormat(items);
        return h(VRow, {}, () => [
            h(VCol, {}, () => h('span', {}, this.params.value.label)),
            ...items.map((item) => h(VCol, {
                cols: 12,
                align: item.right ? 'right' : 'left'
            }, () => h(VSheet, {
                rounded: true,
                border: true,
                elevation: 1,
                minWidth: item.minWidth,
                maxWidth: item.maxWidth,
                width: item.width,
                class: ["pa-4"],
                color: item.color,
                theme: item.theme
            }, () => [
                h('span', {
                    class: ['caption', 'font-weight-bold']
                }, item.user),
                h('p', {}, item.message)
            ])))
        ]);
    }
    buildChart(props, context) {
        const h = this.$h;
        if (!this.chartLoaded.value) {
            this.loadChart();
            return undefined;
        }
        return [
            h('div', {
                class: ['ml-2', 'mb-4']
            }, this.params.value.label),
            h(VueApexCharts, {
                type: this.params.value.chartType,
                options: this.chartOpts.value,
                series: this.chartValue.value,
                height: this.params.value.height || 300,
                width: this.maxWidth.value,
            })
        ];
    }
    buildMap(props, context) {
        var _a;
        const h = this.$h;
        const center = { lat: 0, lng: 0 };
        const options = this.params.value.mapOptions || {
            draggable: true
        };
        options.position = this.modelValue.value || center;
        options.draggable = !this.$readonly;
        return [
            h('div', {
                class: ['ml-2', 'mb-4']
            }, this.params.value.label),
            h('div', {}, h(GoogleMap, {
                apiKey: this.params.value.mapApiKey || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.mapApiKey),
                style: Object.assign(Object.assign({}, this.params.value.style), { height: this.params.value.height || '300px', width: '100%', 'max-width': this.maxWidth.value }),
                center: this.modelValue.value || center,
                zoom: this.params.value.mapZoom || 5
            }, () => h(Marker, {
                options: options,
                title: this.params.value.label,
                draggable: true,
                onDragend: (event) => {
                    const pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                    this.modelValue.value = pos;
                }
            })))
        ];
    }
    buildImage(props, context) {
        const h = this.$h;
        if (this.params.value.multiple) {
            if (!this.modelValue.value)
                this.modelValue.value = [];
            if (!Array.isArray(this.modelValue.value))
                this.modelValue.value = [this.modelValue.value];
            return h(VRow, {}, () => [
                h(VCol, {
                    cols: 12
                }, () => h('div', {}, this.params.value.label)),
                ...(this.modelValue.value || []).map((item, index) => h(VCol, {
                    cols: 12,
                    md: 6,
                    lg: 4,
                    align: 'center'
                }, () => [
                    item.indexOf('image') !== -1 ? h(VImg, {
                        src: item,
                        height: item ? (this.params.value.height === undefined ? 300 : this.params.value.height) : 10,
                        onClick: () => {
                            this.showFullscreen(item);
                        }
                    }) : (item ? h('div', {
                        class: ['py-auto'],
                        style: {
                            height: `${item ? (this.params.value.height === undefined ? 300 : this.params.value.height) : 10}px`,
                            'max-width': '200px',
                            border: 'thin solid black',
                        },
                        onClick: () => {
                            this.showFullscreen(item);
                        }
                    }, 'No Preview') : undefined),
                    ...(this.$readonly ? [] : [
                        h(VIcon, {
                            icon: 'mdi-delete',
                            color: 'error',
                            flat: true,
                            size: 'small',
                            class: ['mt-1'],
                            onClick: () => {
                                const items = this.modelValue.value || [];
                                items.splice(index, 1);
                                this.modelValue.value = items;
                            }
                        })
                    ])
                ])),
                h(VCol, {
                    cols: 12,
                    align: "center"
                }, () => this.$readonly ? [] : [
                    h(VBtn, {
                        color: 'primary',
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            try {
                                const files = yield selectFile(this.params.value.fileAccepts, true);
                                const data = [];
                                for (let i = 0; i < files.length; i++) {
                                    try {
                                        const base64 = yield fileToBase64(files[i], this.params.value.fileMaxSize);
                                        data.push(base64);
                                    }
                                    catch (error) {
                                        Dialogs.$error(error.message);
                                    }
                                }
                                if (!this.modelValue.value) {
                                    this.modelValue.value = data;
                                }
                                else if (!Array.isArray(this.modelValue.value)) {
                                    this.modelValue.value = [this.modelValue.value].concat(data);
                                }
                                else {
                                    const value = this.modelValue.value || [];
                                    this.modelValue.value = value.concat(data);
                                }
                            }
                            catch (error) {
                                Dialogs.$error(error.message);
                            }
                        })
                    }, () => h(VIcon, {}, () => 'mdi-upload')),
                    ...(this.modelValue.value && this.modelValue.value.length > 0 ? [
                        h(VBtn, {
                            color: 'error',
                            class: ['ml-4'],
                            onClick: () => __awaiter(this, void 0, void 0, function* () {
                                this.modelValue.value = [];
                            })
                        }, () => h(VIcon, {}, () => 'mdi-delete')),
                    ] : [])
                ])
            ]);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(VCol, {
                cols: 12,
                align: 'center'
            }, () => this.modelValue.value && this.modelValue.value.indexOf('image') !== -1 ? h(VImg, {
                src: this.modelValue.value,
                height: this.modelValue.value ? (this.params.value.height === undefined ? 300 : this.params.value.height) : 10,
                style: {
                    cursor: 'pointer'
                },
                onClick: () => {
                    this.showFullscreen(this.modelValue.value);
                }
            }) : (this.modelValue.value ? h('div', {
                class: ['py-auto'],
                style: {
                    height: `${this.modelValue.value ? (this.params.value.height === undefined ? 300 : this.params.value.height) : 10}px`,
                    'max-width': '200px',
                    border: 'thin solid black',
                    cursor: 'pointer'
                },
                onClick: () => {
                    this.showFullscreen(this.modelValue.value);
                }
            }, 'No Preview') : undefined)),
            h(VCol, {
                cols: 12,
                align: "center"
            }, () => this.$readonly ? [] : [
                h(VBtn, {
                    color: 'primary',
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const files = yield selectFile(this.params.value.fileAccepts);
                            const base64 = yield fileToBase64(files[0], this.params.value.fileMaxSize);
                            this.modelValue.value = base64;
                        }
                        catch (error) {
                            Dialogs.$error(error.message);
                        }
                    })
                }, () => h(VIcon, {}, () => 'mdi-upload')),
                ...(this.modelValue.value ? [
                    h(VBtn, {
                        color: 'error',
                        class: ['ml-4'],
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            this.modelValue.value = null;
                        })
                    }, () => h(VIcon, {}, () => 'mdi-delete')),
                    h(VBtn, {
                        color: 'success',
                        class: ['ml-4'],
                        onClick: () => {
                            this.showFullscreen(this.modelValue.value);
                        }
                    }, () => h(VIcon, {}, () => 'mdi-eye'))
                ] : [])
            ])
        ]);
    }
    showFullscreen(data) {
        const pdfWindow = window.open("");
        if (!pdfWindow)
            return;
        pdfWindow.document.write(`<iframe width='100%' height='100%' src='${data}' frameBorder="0"></iframe>`);
    }
    loadCollectionInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            this.collectionHeaders = yield this.headers();
            this.collectionLoaded.value = true;
        });
    }
    forceLoadCollectionInfo() {
        this.collectionLoaded.value = false;
    }
    createCollectionForm() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.collectionForm) {
                this.collectionForm.clearListeners(this.$id);
            }
            this.collectionForm = yield this.form();
            if (this.collectionForm) {
                this.collectionForm.$params.auto = true;
                this.collectionFormMaster = new Master();
                this.collectionForm.setMaster(this.collectionFormMaster);
                this.collectionForm.on('saved', (fm) => {
                    this.onCollectionFormSaved(fm);
                }, this.$id);
                this.collectionForm.on('cancel', () => {
                    this.onCollectionFormCancel();
                }, this.$id);
            }
        });
    }
    onCollectionFormSaved(fm) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const value = ((_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$data) || {};
            if (this.$master && this.params.value.storage) {
                if (fm.$params.mode === 'create')
                    this.$master.$addCollectionObject(this.params.value.storage, value);
                if (fm.$params.mode === 'edit') {
                    this.$master.$setCollectionObject(this.params.value.storage, value._id || ((_b = value.__index) === null || _b === void 0 ? void 0 : _b.toString()), value, value._id ? '_id' : '__index');
                }
                this.updateValue();
            }
            if (this.collectionFormMaster && fm.$params.mode === 'create') {
                this.collectionFormMaster.$reset({});
            }
            else {
                this.collectionDialog.value = false;
            }
        });
    }
    onCollectionFormCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.collectionDialog.value = false;
        });
    }
    onCollectionItemRemoved() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$master && this.params.value.storage) {
                const items = this.collectionSelectedItems.value || [];
                items.sort((a, b) => {
                    if (a.__index > b.__index)
                        return -1;
                    if (a.__index < b.__index)
                        return 1;
                    return 0;
                });
                for (let i = 0; i < items.length; i++) {
                    let canRemove = true;
                    if (this.options.canRemoveItem) {
                        canRemove = yield this.options.canRemoveItem(this, items[i]);
                    }
                    if (canRemove)
                        this.$master.$removeCollectionObject(this.params.value.storage, items[i]._id || (items[i].__index || items[i].__index === 0 ? items[i].__index.toString() : items[i].toString()), items[i]._id ? '_id' : '__index');
                }
                this.collectionSelectedItems.value = [];
            }
            this.updateValue();
        });
    }
    onCollectionItemClicked(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let canEdit = true;
            if (this.options.canEditItem)
                canEdit = yield this.options.canEditItem(this, item);
            if (!canEdit)
                return;
            yield this.createCollectionForm();
            const value = this.currentCollectionItems.filter((i) => (i._id && i._id === item.raw._id) || i.__index === item.raw.__index)[0];
            yield ((_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$reset(Object.assign({}, value || {})));
            if (this.collectionForm) {
                this.collectionForm.$params.mode = this.$readonly ? 'display' : 'edit';
                this.collectionForm.setParent(this);
            }
            this.collectionDialog.value = true;
        });
    }
    format(items) {
        if (this.options.format) {
            const data = this.options.format(this, JSON.parse(JSON.stringify(items)));
            if (data && Array.isArray(data))
                return data;
        }
        return items;
    }
    attachIndex(data) {
        if (!Array.isArray(data))
            data = [data];
        data.forEach((item, index) => {
            item.__index = index;
        });
        return data;
    }
    footer(items) {
        let data = [];
        if (this.options.footer)
            data = this.options.footer(this, items) || [];
        return data;
    }
    buildTextArea(props, context) {
        var _a;
        const h = this.$h;
        return h(VTextarea, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            readonly: this.$readonly,
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildBoolean(props, context) {
        var _a;
        const h = this.$h;
        return h(VSwitch, {
            modelValue: this.modelValue,
            autofocus: this.params.value.autofocus,
            label: this.params.value.label || "",
            hint: this.params.value.hint || "",
            persistentHint: this.params.value.hint ? true : false,
            placeholder: this.params.value.placeholder || "",
            clearable: this.params.value.clearable || false,
            color: this.params.value.color || "primary",
            variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant),
            readonly: this.$readonly,
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            rules: this.rules()
        });
    }
    buildTable(props, context) {
        const h = this.$h;
        if (!this.tableLoaded.value) {
            this.loadTableInformation();
        }
        else {
            this.currentCollectionItems = this.format(this.tableItems.value || []);
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.currentCollectionItems);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(VCol, {
                cols: 12
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VDataTable, {
                headers: this.tableHeaders.value || [],
                items: this.currentCollectionItems,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                hover: true,
                height: this.params.value.height || 400,
                modelValue: this.modelValue.value,
                "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                },
                "onClick:row": (_, { item }) => {
                    this.handleOn('click:row', item);
                }
            }, Object.assign({}, (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(VDataTable, {
                        headers: options.headers,
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter,
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(VDataTableFooter, {})
                ]
            } : {})))))
        ]);
    }
    forceLoadTableInfo() {
        this.tableLoaded.value = false;
    }
    clearTableSelection() {
        this.modelValue.value = [];
    }
    buildServerTable(props, context) {
        const h = this.$h;
        if (!this.tableLoaded.value) {
            this.loadTableInformation({
                itemsPerPage: this.tableItemsPerPage.value,
                page: this.tablePage.value
            });
        }
        else {
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.tableItems.value);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(VCol, {
                cols: 12
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VDataTableServer, {
                headers: this.tableHeaders.value || [],
                items: this.tableItems.value,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                height: this.params.value.height || 400,
                page: this.tablePage.value,
                itemsLength: this.tableTotalItems.value,
                itemsPerPage: this.tableItemsPerPage.value,
                hover: true,
                modelValue: this.modelValue.value,
                "onUpdate:options": (options) => {
                    this.loadTableInformation(options);
                    this.handleOn('changed:options', options);
                },
                "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                },
                "onClick:row": (_, { item }) => {
                    this.handleOn('click:row', item);
                }
            }, Object.assign({}, (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(VDataTable, {
                        headers: options.headers,
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(VDataTableFooter, {})
                ]
            } : {})))))
        ]);
    }
    buildViewTable(props, context) {
        const h = this.$h;
        if (!this.tableLoaded.value) {
            this.loadTableInformation();
        }
        else {
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.tableItems.value);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(VCol, {
                cols: 12
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(VDataTableVirtual, {
                headers: this.tableHeaders.value || [],
                items: this.tableItems.value,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                hover: true,
                height: this.params.value.height || 400,
                modelValue: this.modelValue.value,
                "onUpdate:modelValue": (value) => {
                    this.modelValue.value = value;
                },
                "onClick:row": (_, { item }) => {
                    this.handleOn('click:row', item);
                }
            }, Object.assign({}, (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(VDataTable, {
                        headers: options.headers,
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(VDataTableFooter, {})
                ]
            } : {})))))
        ]);
    }
    buildReportTable(props, context) {
        const h = this.$h;
        if (!this.tableLoaded.value) {
            this.loadTableInformation();
        }
        else {
            if (this.params.value.hasFooter)
                this.currentCollectionFooter = this.footer(this.tableItems.value);
        }
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(VCol, {
                cols: 12
            }, () => h(VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value - 5,
                elevation: 0
            }, () => {
                var _a;
                return h('table', {
                    class: ['reporttable'],
                    style: this.maxWidth.value ? {
                        minWidth: `${Math.max(this.maxWidth.value - 5, ((_a = this.params.value) === null || _a === void 0 ? void 0 : _a.minWidth) || 900)}px`
                    } : {}
                }, [
                    h('thead', {}, this.makeReportTableHeader(props, context)),
                    h('tbody', {
                        style: {
                            'max-height': this.params.value.height ? `${this.params.value.height}px` : '400px'
                        }
                    }, this.makeReportTableBody(props, context, this.params.value.idField)),
                    ...(this.params.value.hasFooter ? [
                        h('tfoot', {}, this.makeReportTableFooter(props, context, this.currentCollectionFooter))
                    ] : [])
                ]);
            }))
        ]);
    }
    getColspan(header) {
        var _a;
        let span = 1;
        if (((_a = header.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const children = header.children;
            span = 0;
            for (let i = 0; i < children.length; i++) {
                const sp = this.getColspan(children[i]);
                span += sp;
            }
        }
        return span;
    }
    calculateHeaderRows(headers) {
        let cnt = 0;
        let children = [];
        let currentHeaders = headers || [];
        let headerRows = [];
        while (currentHeaders.length > 0) {
            children = [];
            cnt += 1;
            for (let i = 0; i < currentHeaders.length; i++) {
                const item = currentHeaders[i];
                if (item.children && item.children.length > 0) {
                    children = children.concat(item.children || []);
                    item.colspan = this.getColspan(item);
                }
                else {
                    item.colspan = 1;
                }
            }
            headerRows.push(currentHeaders);
            currentHeaders = children;
        }
        return { headerRows: headerRows, rowCount: cnt };
    }
    getItemHeaders(headers) {
        var _a;
        let items = [];
        for (let i = 0; i < headers.length; i++) {
            const item = headers[i];
            if (((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                const cItems = this.getItemHeaders(item.children);
                items = items.concat(cItems);
            }
            else {
                items.push(item);
            }
        }
        return items;
    }
    makeReportTableHeader(props, context) {
        var _a;
        const h = this.$h;
        const headers = this.tableHeaders.value || [];
        const { headerRows, rowCount } = this.calculateHeaderRows(headers);
        const rows = [];
        for (let i = 0; i < headerRows.length; i++) {
            const columns = [];
            const heads = headerRows[i];
            for (let c = 0; c < heads.length; c++) {
                const col = heads[c];
                columns.push(h('th', Object.assign(Object.assign({}, (col.attributes || {})), { colspan: col.colspan || 1, rowspan: ((_a = col.children) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 1 : rowCount - i, onClick: () => {
                        this.handleOn('click:header', col);
                    } }), col.title || ''));
            }
            rows.push(h('tr', {}, columns));
        }
        return rows;
    }
    makeReportTableBody(props, context, idField) {
        const h = this.$h;
        const headers = this.getItemHeaders(this.tableHeaders.value || []);
        const items = this.tableItems.value || [];
        const rows = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const columns = [];
            for (let a = 0; a < headers.length; a++) {
                const head = headers[a];
                columns.push(h('td', Object.assign(Object.assign({}, (head.itemAttributes || {})), { onClick: () => {
                        this.handleOn('click:item', { header: head, item: item });
                    } }), head.key ? (head.format ? head.format(nestedProperty.get(item, head.key), item, this) : nestedProperty.get(item, head.key)) : ''));
            }
            rows.push(h('tr', {
                onClick: () => {
                    this.handleOn('click:row', item);
                }
            }, columns));
        }
        return rows;
    }
    makeReportTableFooter(props, context, items) {
        const h = this.$h;
        const headers = this.getItemHeaders(this.tableHeaders.value || []);
        const rows = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const columns = [];
            for (let a = 0; a < headers.length; a++) {
                const head = headers[a];
                columns.push(h('th', Object.assign(Object.assign({}, (head.footerAttributes || {})), { onClick: () => {
                        this.handleOn('click:footer-item', { header: head, item });
                    } }), head.key ? (head.footerFormat ? head.footerFormat(nestedProperty.get(item, head.key), item, this) : nestedProperty.get(item, head.key)) : ''));
            }
            rows.push(h('tr', {
                onClick: () => {
                    this.handleOn('click:footer-row', item);
                }
            }, columns));
        }
        return rows;
    }
    loadTableInformation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableHeaders.value = (yield this.headers()) || [];
            const data = yield this.items(options);
            if (Array.isArray(data)) {
                this.tableItems.value = this.format(data);
                this.tableTotalItems.value = data.length;
                this.tableItemsPerPage.value = -1;
                this.tablePage.value = 1;
            }
            else if (data) {
                this.tableItems.value = this.format(data.data || []);
                this.tableTotalItems.value = data.total || 0;
                this.tableItemsPerPage.value = data.limit;
                this.tablePage.value = options.page || 1;
            }
            else {
                this.tableItems.value = this.format([]);
                this.tableTotalItems.value = 0;
                this.tableItemsPerPage.value = -1;
                this.tablePage.value = 1;
            }
            this.tableLoaded.value = true;
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
    mounted() {
        this.updateValue();
    }
}
Field.defaultParams = {};
const FD = (params, options) => new Field(params, options);
FD.setDefault = Field.setDefault;
export const $FD = FD;
