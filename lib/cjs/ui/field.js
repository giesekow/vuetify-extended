"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$FD = exports.Field = exports.fieldTypeOptions = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const master_1 = require("../master");
const webtex = __importStar(require("webtex"));
const misc_1 = require("../misc");
const components_2 = require("vuetify/components");
const vue_datepicker_1 = __importDefault(require("@vuepic/vue-datepicker"));
const form_1 = require("./form");
const misc_2 = require("../misc");
const field_rich_widgets_1 = require("./widgets/field-rich-widgets");
require("@vuepic/vue-datepicker/dist/main.css");
const dialogs_1 = require("./dialogs");
const nested_property_1 = __importDefault(require("nested-property"));
const katex_1 = __importDefault(require("katex"));
require("katex/dist/katex.min.css");
const latexPackages = [
    'amsmath',
    'amsthm',
    'bussproofs',
    'color',
    'xcolor',
    'echo',
    'gensymb',
    'graphics',
    'graphicx',
    'hyperref',
    'latexsym',
    'minted',
    'multicol',
    'stix',
    'textcomp',
    'textgreek',
];
exports.fieldTypeOptions = [
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
class Field extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.modelValue = this.$makeRef();
        this.params = this.$makeRef(Object.assign(Object.assign({}, Field.defaultParams), (params || {})));
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
        this.isEditting = false;
        this.codePreview = this.$makeRef("");
        this.htmlEditor = undefined;
        this.messageVisibleCount = this.$makeRef(0);
        this.messageContainer = this.$makeRef();
        this.pendingMessageScrollRestore = undefined;
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
    modelBinding() {
        return {
            modelValue: this.modelValue.value,
            "onUpdate:modelValue": (value) => {
                this.modelValue.value = value;
            }
        };
    }
    valueChanged(newValue) {
        if (this.changing) {
            return;
        }
        this.changing = true;
        const value = this.postprocess(newValue !== undefined ? newValue : this.modelValue.value);
        this.renderLatex(value);
        if (this.$master && this.params.value.storage) {
            this.$master.$set(this.params.value.storage, value);
        }
        if (this.options.modifies) {
            this.options.modifies.value = value;
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
    renderMathInHtml(html) {
        // Render display math first ($$...$$)
        if (!html)
            return html;
        html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
            try {
                return katex_1.default.renderToString(math, { displayMode: true });
            }
            catch (err) {
                return `<span class="katex-error">${math}</span>`;
            }
        });
        // Render inline math ($...$)
        html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
            try {
                return katex_1.default.renderToString(math, { displayMode: false });
            }
            catch (err) {
                return `<span class="katex-error">${math}</span>`;
            }
        });
        return html;
    }
    renderLatex(value) {
        if (this.params.value.type === 'code' && this.params.value.lang === 'latex') {
            try {
                let fulltext = value || '';
                fulltext = fulltext.trim();
                const hasClass = fulltext.includes('\\documentclass');
                const hasBegin = fulltext.includes('\\begin{document}');
                const hasEnd = fulltext.includes('\\end{document}');
                if (!hasClass) {
                    if (!hasBegin) {
                        fulltext = `\\begin{document}\n${fulltext}`;
                    }
                    fulltext = `\\documentclass{article}\n${latexPackages.map((p) => '\\usepackage{' + p + '}').join('\n')}\n${fulltext}`;
                    if (!hasEnd) {
                        fulltext = `${fulltext}\n\\end{document}`;
                    }
                }
                const generator = new webtex.HtmlGenerator({ hyphenate: false });
                const doc = webtex.parse(value, { generator }).htmlDocument();
                this.codePreview.value = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
            }
            catch (err) {
                this.codePreview.value = `<!DOCTYPE html><html><body><span style="color:red">${err.message}</span></body></html>`;
            }
        }
    }
    showPreviewFullscreen(html) {
        const newWindow = window.open('', '_blank');
        if (!newWindow)
            return;
        newWindow.document.open();
        newWindow.document.write(html);
        newWindow.document.close();
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
                return value.map((v) => new misc_1.SimpleDate(v).toString());
            }
            return new misc_1.SimpleDate(value).toString();
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => new misc_1.SimpleTime(v).toString());
            }
            return new misc_1.SimpleTime(value).toString();
        }
        if (this.params.value.type === 'decimal') {
            const dp = this.params.value.decimalPlaces || 2;
            if (value.$numberDecimal !== undefined) {
                return Number(value.$numberDecimal).toFixed(dp);
            }
            else {
                try {
                    const dvalue = Number(value).toFixed(dp);
                    return dvalue;
                }
                catch (error) {
                }
            }
        }
        return value;
    }
    postprocess(value) {
        if (value === undefined || value === null)
            return value;
        if (this.params.value.type === "date") {
            if (Array.isArray(value)) {
                return value.map((v) => new misc_1.SimpleDate(v).toNumber());
            }
            return new misc_1.SimpleDate(value).toNumber();
        }
        if (this.params.value.type === "time") {
            if (Array.isArray(value)) {
                return value.map((v) => new misc_1.SimpleTime(v).toNumber());
            }
            return new misc_1.SimpleTime(value).toNumber();
        }
        if (this.params.value.type === 'decimal') {
            if (value.$numberDecimal === undefined && value !== undefined && value !== null) {
                const dp = this.params.value.decimalPlaces || 2;
                return { $numberDecimal: Number(value || 0).toFixed(dp) };
            }
        }
        if (this.params.value.type === 'float') {
            return Number(value || 0);
        }
        if (this.params.value.type === 'integer') {
            return Number(value || 0);
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
    makeHTMLColumns(headers) {
        const slots = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            if (header.isHTML) {
                slots[`item.${header.key}`] = (options) => {
                    var _a, _b, _c;
                    return this.$h(header.tag || 'div', {
                        innerHTML: ((_a = options.value) === null || _a === void 0 ? void 0 : _a.html) ? options.value.html : options.value,
                        class: ((_b = options.value) === null || _b === void 0 ? void 0 : _b.class) || [],
                        style: ((_c = options.value) === null || _c === void 0 ? void 0 : _c.style) || {}
                    });
                };
            }
        }
        return slots;
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
            yield (0, misc_1.sleep)(100);
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
        return h(components_1.VCol, {
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
            items.push(misc_2.$v.isRequired());
        }
        if (this.params.value.validation) {
            const v = this.params.value.validation;
            let converter = undefined;
            if (this.params.value.type === 'date')
                converter = (v) => (new misc_1.SimpleDate(v)).toNumber();
            if (this.params.value.type === 'datetime')
                converter = (v) => new Date(v);
            if (this.params.value.type === 'float')
                converter = Number;
            if (this.params.value.type === 'integer')
                converter = Number;
            if (this.params.value.type === 'time')
                converter = (v) => (new misc_1.SimpleTime(v)).toNumber();
            if (v.range)
                items.push(misc_2.$v.range(v.range.from, v.range.to, v.range.converter || converter));
            if (v.max)
                items.push(misc_2.$v.max(v.max.value, v.max.converter || converter));
            if (v.min)
                items.push(misc_2.$v.min(v.min.value, v.min.converter || converter));
            if (v.gt)
                items.push(misc_2.$v.gt(v.gt.value, v.gt.converter || converter));
            if (v.lt)
                items.push(misc_2.$v.lt(v.lt.value, v.lt.converter || converter));
            if (v.gte)
                items.push(misc_2.$v.gte(v.gte.value, v.gte.converter || converter));
            if (v.lte)
                items.push(misc_2.$v.lte(v.lte.value, v.lte.converter || converter));
            if (v.neq)
                items.push(misc_2.$v.neq(v.neq.value, v.neq.converter || converter));
            if (v.eq)
                items.push(misc_2.$v.eq(v.eq.value, v.eq.converter || converter));
            if (v.in)
                items.push(misc_2.$v.in(v.in));
            if (v.nin)
                items.push(misc_2.$v.nin(v.nin));
            if (v.includes !== undefined)
                items.push(misc_2.$v.includes(v.includes));
            if (v.excludes !== undefined)
                items.push(misc_2.$v.excludes(v.excludes));
            if (v.maxLen || v.maxLen === 0)
                items.push(misc_2.$v.maxLen(v.maxLen));
            if (v.minLen || v.minLen === 0)
                items.push(misc_2.$v.minLen(v.minLen));
            if (v.regex)
                items.push(misc_2.$v.regex(v.regex));
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
            case 'htmlview':
                return this.buildHTMLView(props, context);
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
            case 'listselect':
                {
                    if (!this.optionLoaded.value) {
                        this.optionLoaded.value = true;
                        this.loadOptions();
                    }
                    return this.params.value.multiple ? this.buildCheckboxSelect(props, context) : this.buildRadioSelect(props, context);
                }
        }
        return this.$h('div');
    }
    buildText(props, context, type) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(components_1.VCombobox, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, multiple: true, type, chips: true, items: [], class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
        else {
            return h(components_1.VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), type, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
    }
    buildLabel(props, context) {
        const h = this.$h;
        return h('div', {
            class: this.params.value.class || ['text-subtitle-2'],
            style: this.params.value.style || {},
            innerHTML: this.params.value.label
        });
    }
    buildHTMLView(props, context) {
        const h = this.$h;
        return h('div', {
            class: this.params.value.class || [],
            style: this.params.value.style || {},
            innerHTML: this.params.value.resolveFormulas ? this.renderMathInHtml(this.modelValue.value) : this.modelValue.value
        });
    }
    buildSelect(props, context) {
        var _a;
        const h = this.$h;
        return h(components_1.VSelect, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), itemTitle: this.params.value.itemTitle || 'name', itemValue: this.params.value.itemValue || '_id', readonly: this.$readonly, items: this.selectItems.value, multiple: this.params.value.multiple, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildRadioSelect(props, context) {
        var _a;
        const h = this.$h;
        return [
            h('div', {
                class: ['ml-4', 'mb-4'],
                innerHTML: this.params.value.label
            }),
            h(components_1.VRadioGroup, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: ['vef-radio-select'].concat(this.params.value.class || []), style: this.params.value.style || {}, rules: this.rules(), inline: this.params.value.inline, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }), () => (this.selectItems.value || []).map((item) => h(components_1.VRadio, {
                value: item[this.params.value.itemValue || '_id'],
                inline: this.params.value.inline
            }, {
                label: () => h('div', Object.assign(Object.assign({}, (item.props || {})), { innerHTML: item[this.params.value.itemTitle || 'name'] }))
            })))
        ];
    }
    buildCheckboxSelect(props, context) {
        var _a;
        const h = this.$h;
        if (this.params.value.multiple) {
            if (!this.modelValue.value) {
                const curValue = (_a = this.$master) === null || _a === void 0 ? void 0 : _a.$get(this.params.value.storage || '');
                if (!curValue)
                    this.modelValue.value = [];
                else
                    this.modelValue.value = curValue;
            }
        }
        return [
            h('div', {
                class: ['ml-4', 'mb-4'],
                innerHTML: this.params.value.label
            }),
            ...(this.selectItems.value || []).map((item) => h(components_1.VCheckboxBtn, Object.assign(Object.assign({ value: item[this.params.value.itemValue || '_id'] }, this.modelBinding()), { readonly: this.$readonly, class: ['vef-check-select'].concat(this.params.value.class || []), style: this.params.value.style || {}, color: this.params.value.color || "primary", hint: this.params.value.hint || "", multiple: this.params.value.multiple, persistentHint: this.params.value.hint ? true : false, inline: this.params.value.inline }), {
                label: () => h('div', Object.assign(Object.assign({}, (item.props || {})), { innerHTML: item[this.params.value.itemTitle || 'name'] }))
            }))
        ];
    }
    buildAutocomplete(props, context) {
        var _a;
        const h = this.$h;
        return h(components_1.VAutocomplete, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), itemTitle: this.params.value.itemTitle || 'name', itemValue: this.params.value.itemValue || '_id', readonly: this.$readonly, items: this.selectItems.value, autoSelectFirst: true, returnObject: this.params.value.returnObject, multiple: this.params.value.multiple, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    richWidgetContext() {
        return {
            $h: this.$h,
            $readonly: this.$readonly,
            params: this.params,
            modelValue: this.modelValue,
            maxWidth: this.maxWidth,
            codePreview: this.codePreview,
            chartLoaded: this.chartLoaded,
            chartOpts: this.chartOpts,
            chartValue: this.chartValue,
            renderMathInHtml: (html) => this.renderMathInHtml(html),
            showPreviewFullscreen: (html) => this.showPreviewFullscreen(html),
            registerHtmlEditor: (editor) => this.registerHtmlEditor(editor),
            onHtmlEditorReady: (editor) => {
                this.htmlEditor = editor;
                if (this.params.value.autofocus) {
                    this.focusHtmlEditor();
                }
            },
            renderLatex: (value) => this.renderLatex(value),
            loadChart: () => this.loadChart(),
            messageFormat: (data) => this.messageFormat(data),
            showMediaFullscreen: (data) => this.showFullscreen(data),
            getMessageWindow: (items) => this.getMessageWindow(items),
            loadEarlierMessages: (total) => this.loadEarlierMessages(total),
            setMessageScrollContainer: (el) => this.setMessageScrollContainer(el),
        };
    }
    getMessageWindow(items) {
        const total = Array.isArray(items) ? items.length : 0;
        if (total === 0) {
            this.messageVisibleCount.value = 0;
            return { items: [], hasEarlier: false, earlierCount: 0, pageSize: this.messagePageSize() };
        }
        const initialCount = this.messageInitialRenderCount(total);
        if (this.messageVisibleCount.value <= 0) {
            this.messageVisibleCount.value = initialCount;
        }
        else if (this.messageVisibleCount.value > total) {
            this.messageVisibleCount.value = total;
        }
        else if (total <= initialCount) {
            this.messageVisibleCount.value = total;
        }
        const visibleCount = Math.min(total, this.messageVisibleCount.value || total);
        const earlierCount = Math.max(0, total - visibleCount);
        return {
            items: items.slice(total - visibleCount),
            hasEarlier: earlierCount > 0,
            earlierCount,
            pageSize: this.messagePageSize(),
        };
    }
    messageInitialRenderCount(total) {
        const configured = this.params.value.messageInitialCount;
        if (typeof configured === 'number' && configured > 0) {
            return Math.min(total, configured);
        }
        if (total > 50) {
            return Math.min(total, 50);
        }
        return total;
    }
    messagePageSize() {
        const configured = this.params.value.messagePageSize;
        if (typeof configured === 'number' && configured > 0) {
            return configured;
        }
        return 50;
    }
    loadEarlierMessages(total) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = this.messageContainer.value;
            if (container) {
                this.pendingMessageScrollRestore = {
                    scrollTop: container.scrollTop,
                    scrollHeight: container.scrollHeight,
                };
            }
            this.messageVisibleCount.value = Math.min(total, (this.messageVisibleCount.value || 0) + this.messagePageSize());
            yield (0, vue_1.nextTick)();
            this.restoreMessageScrollPosition();
        });
    }
    setMessageScrollContainer(el) {
        if (el instanceof HTMLElement) {
            this.messageContainer.value = el;
        }
        else {
            const root = el === null || el === void 0 ? void 0 : el.$el;
            this.messageContainer.value = root instanceof HTMLElement ? root : undefined;
        }
        this.restoreMessageScrollPosition();
    }
    restoreMessageScrollPosition() {
        if (!this.pendingMessageScrollRestore || !this.messageContainer.value) {
            return;
        }
        const delta = this.messageContainer.value.scrollHeight - this.pendingMessageScrollRestore.scrollHeight;
        this.messageContainer.value.scrollTop = this.pendingMessageScrollRestore.scrollTop + delta;
        this.pendingMessageScrollRestore = undefined;
    }
    buildHTML(props, context) {
        return (0, field_rich_widgets_1.buildHTMLWidget)(this.richWidgetContext());
    }
    registerHtmlEditor(editor) {
        this.htmlEditor = editor;
        editor.on('init', () => {
            if (this.params.value.autofocus) {
                this.focusHtmlEditor();
            }
        });
        editor.on('keydown', (ev) => {
            this.onHtmlEditorKeydown(ev);
        });
    }
    onHtmlEditorKeydown(ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = this.parentForm();
            if (!form || dialogs_1.Dialogs.hasBlockingDialog()) {
                return;
            }
            if (!ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
                ev.preventDefault();
                yield form.$handleSaveShortcut();
                return;
            }
            if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
                ev.preventDefault();
                yield form.$handleEscapeShortcut();
            }
        });
    }
    focusHtmlEditor() {
        const editor = this.htmlEditor;
        if (!editor || typeof window === 'undefined') {
            return;
        }
        setTimeout(() => {
            var _a, _b, _c, _d, _e;
            (_a = editor.focus) === null || _a === void 0 ? void 0 : _a.call(editor);
            const body = (_b = editor.getBody) === null || _b === void 0 ? void 0 : _b.call(editor);
            (_c = body === null || body === void 0 ? void 0 : body.focus) === null || _c === void 0 ? void 0 : _c.call(body);
            if (body && typeof ((_d = editor.selection) === null || _d === void 0 ? void 0 : _d.select) === 'function' && typeof ((_e = editor.selection) === null || _e === void 0 ? void 0 : _e.collapse) === 'function') {
                editor.selection.select(body, true);
                editor.selection.collapse(true);
            }
        }, 50);
    }
    parentForm() {
        let parent = this.$parent;
        while (parent) {
            if (parent instanceof form_1.Form) {
                return parent;
            }
            parent = parent.$parent;
        }
        return undefined;
    }
    focusPrimaryInput() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$readonly || this.params.value.invisible) {
                return false;
            }
            if (this.params.value.type === 'html') {
                this.focusHtmlEditor();
                return true;
            }
            return false;
        });
    }
    buildButton(props, context) {
        const h = this.$h;
        const btn = this.button();
        if (btn)
            return h(btn.component);
        return undefined;
    }
    buildCode(props, context) {
        return (0, field_rich_widgets_1.buildCodeWidget)(this.richWidgetContext());
    }
    buildColor(props, context) {
        const h = this.$h;
        const dialog = this.$makeRef(false);
        const temp = this.$makeRef();
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('span', {
                class: ['ml-4']
            }, this.params.value.label)),
            h(components_1.VCol, {
                class: [],
            }, () => [
                h(components_1.VListItem, {
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
            h(components_1.VDialog, {
                modelValue: dialog.value,
                maxWidth: 350,
                persistent: true
            }, () => h(components_1.VCard, {}, () => [
                h(components_1.VCardText, {}, () => h(components_1.VColorPicker, {
                    modelValue: temp.value,
                    mode: "hexa",
                    "onUpdate:modelValue": (v) => {
                        temp.value = v;
                    }
                })),
                h(components_1.VCardActions, {}, () => [
                    h(components_1.VSpacer),
                    h(components_1.VBtn, {
                        color: "error",
                        onClick: () => {
                            dialog.value = false;
                        }
                    }, () => "Cancel"),
                    h(components_1.VBtn, {
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
            return h(components_1.VCombobox, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, multiple: true, type: "time", chips: true, items: [], class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
        else {
            return h(components_1.VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_b = Field.defaultParams) === null || _b === void 0 ? void 0 : _b.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), type: "time", "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
        }
    }
    buildDate(props, context) {
        var _a, _b;
        const h = this.$h;
        if (this.params.value.multiple) {
            return h(components_1.VCombobox, {
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
                },
                "onUpdate:focused": (ev) => this.onFocusChanged(ev)
            });
        }
        else {
            return h(components_1.VTextField, {
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
                },
                "onUpdate:focused": (ev) => this.onFocusChanged(ev)
            });
        }
    }
    buildDatetime(props, context) {
        var _a;
        const h = this.$h;
        return [
            h('div', {
                class: ['mb-2', 'ml-4'],
                innerHTML: this.params.value.label || ""
            }),
            h(vue_datepicker_1.default, Object.assign(Object.assign({ modelValue: this.modelValue.value, autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules() }, (this.options.datetimeOptions || {})), { "onUpdate:model-value": (value) => {
                    this.modelValue.value = value;
                }, "onUpdate:focused": (ev) => this.onFocusChanged(ev) }))
        ];
    }
    buildPassword(props, context) {
        var _a;
        const h = this.$h;
        return h(components_1.VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, type: 'password', rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildFloat(props, context) {
        var _a;
        const h = this.$h;
        return h(components_1.VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, type: 'number', class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
    }
    buildInteger(props, context) {
        var _a;
        const h = this.$h;
        return h(components_1.VTextField, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, type: 'number', "onBeforeinput": (v) => {
                if (v.inputType === 'insertText' && v.data) {
                    if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'].includes(v.data)) {
                        v.preventDefault();
                    }
                }
            }, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), "onUpdate:focused": (ev) => this.onFocusChanged(ev) }));
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
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12,
                md: 9,
                class: ['py-0', 'pl-6']
            }, () => [
                h('div', {}, this.params.value.label)
            ]),
            h(components_1.VCol, {
                cols: 12,
                md: 3,
                align: "end",
                class: ['my-0', 'py-0', 'text-right']
            }, () => [
                ...(this.collectionSelectedItems.value.length > 0 && !this.$readonly && !this.params.value.collectionDisableRemove ? [
                    h(components_1.VBtn, {
                        color: 'error',
                        size: 28,
                        icon: true,
                        class: ['mr-4'],
                        onClick: () => {
                            this.onCollectionItemRemoved();
                        }
                    }, () => [
                        h(components_1.VIcon, { size: 24 }, () => 'mdi-delete'),
                    ])
                ] : []),
                ...(this.$readonly || this.params.value.collectionDisableAdd || (this.params.value.collectionEnd !== undefined && this.params.value.collectionEnd <= (this.modelValue.value || []).length) ? [] : [
                    h(components_1.VBtn, {
                        color: 'primary',
                        size: 28,
                        icon: true,
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
                        h(components_1.VIcon, { size: 24 }, () => 'mdi-plus'),
                    ])
                ])
            ]),
            h(components_1.VCol, {
                cols: 12,
                class: ['my-0', 'py-0'],
            }, () => h(components_1.VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(components_2.VDataTable, {
                headers: this.collectionHeaders || [],
                items: this.currentCollectionItems,
                density: 'compact',
                showSelect: !this.$readonly,
                itemValue: '__index',
                itemsPerPage: this.params.value.itemsPerPage || 10,
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
                    h(components_2.VDataTable, {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(components_2.VDataTableFooter, {})
                ]
            } : {}))))),
            ...(this.collectionLoaded.value ? [
                h(components_1.VCol, {
                    align: 'center',
                    cols: 12
                }, () => h(components_1.VDialog, {
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
        return (0, field_rich_widgets_1.buildMessageBoxWidget)(this.richWidgetContext());
    }
    buildChart(props, context) {
        return (0, field_rich_widgets_1.buildChartWidget)(this.richWidgetContext());
    }
    buildMap(props, context) {
        return (0, field_rich_widgets_1.buildMapWidget)(this.richWidgetContext());
    }
    buildImage(props, context) {
        return (0, field_rich_widgets_1.buildImageWidget)(this.richWidgetContext());
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
                this.collectionFormMaster = new master_1.Master();
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
            this.handleOn('form-saved', this);
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
            this.handleOn('form-cancel', this);
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
                this.handleOn('item-removed', this);
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
            const value = this.currentCollectionItems.filter((i) => (i._id && i._id === item._id) || i.__index === item.__index)[0];
            yield ((_a = this.collectionFormMaster) === null || _a === void 0 ? void 0 : _a.$reset(Object.assign({}, value || {})));
            if (this.collectionForm) {
                this.collectionForm.$params.mode = this.$readonly ? 'display' : 'edit';
                this.collectionForm.setParent(this);
            }
            this.handleOn('item-clicked', this);
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
        if (!data)
            return [];
        if (!Array.isArray(data))
            data = [data];
        data = data.filter((d) => d);
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
        return h(components_1.VTextarea, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules() }));
    }
    buildBoolean(props, context) {
        var _a;
        const h = this.$h;
        return h(this.params.value.checkbox ? components_1.VCheckboxBtn : components_1.VSwitch, Object.assign(Object.assign({}, this.modelBinding()), { autofocus: this.params.value.autofocus, label: this.params.value.label || "", hint: this.params.value.hint || "", persistentHint: this.params.value.hint ? true : false, placeholder: this.params.value.placeholder || "", clearable: this.params.value.clearable || false, color: this.params.value.color || "primary", variant: this.params.value.variant || ((_a = Field.defaultParams) === null || _a === void 0 ? void 0 : _a.variant), readonly: this.$readonly, class: this.params.value.class || [], style: this.params.value.style || {}, rules: this.rules(), inline: this.params.value.inline }));
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
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(components_1.VCol, {
                cols: 12
            }, () => h(components_1.VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(components_2.VDataTable, {
                headers: this.tableHeaders.value || [],
                items: this.currentCollectionItems,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                itemsPerPage: this.params.value.itemsPerPage || 10,
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
            }, Object.assign(Object.assign({}, this.makeHTMLColumns(this.tableHeaders.value)), (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(components_2.VDataTable, {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter,
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(components_2.VDataTableFooter, {})
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
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(components_1.VCol, {
                cols: 12
            }, () => h(components_1.VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(components_2.VDataTableServer, {
                headers: this.tableHeaders.value || [],
                items: this.tableItems.value,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                returnObject: true,
                fixedHeader: true,
                fixedFooter: true,
                density: 'compact',
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
            }, Object.assign(Object.assign({}, this.makeHTMLColumns(this.tableHeaders.value)), (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(components_2.VDataTable, {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(components_2.VDataTableFooter, {})
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
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(components_1.VCol, {
                cols: 12
            }, () => h(components_1.VCard, {
                class: ['overflow-auto', 'mx-auto', 'pa-0'],
                maxWidth: this.maxWidth.value,
                elevation: 0
            }, () => h(components_2.VDataTableVirtual, {
                headers: this.tableHeaders.value || [],
                items: this.tableItems.value,
                class: [...(this.params.value.class || []), 'dense-table', ...(this.params.value.bordered ? ['bordered-table'] : [])],
                showSelect: !this.$readonly,
                itemValue: this.params.value.idField || '_id',
                itemsPerPage: this.params.value.itemsPerPage || 10,
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
            }, Object.assign(Object.assign({}, this.makeHTMLColumns(this.tableHeaders.value)), (this.params.value.hasFooter ? {
                bottom: (options) => [
                    h(components_2.VDataTable, {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                    }, {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', { class: ['mb-4'] }),
                        "item.data-table-select": () => h('div')
                    }),
                    h(components_2.VDataTableFooter, {})
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
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('div', {}, this.params.value.label)),
            h(components_1.VCol, {
                cols: 12
            }, () => h(components_1.VCard, {
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
                    } }), head.key ? (head.format ? head.format(nested_property_1.default.get(item, head.key), item, this) : nested_property_1.default.get(item, head.key)) : ''));
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
                    } }), head.key ? (head.footerFormat ? head.footerFormat(nested_property_1.default.get(item, head.key), item, this) : nested_property_1.default.get(item, head.key)) : ''));
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
    onFocusChanged(focused) {
        var _a;
        if (this.isEditting && !focused) {
            if (this.params.value.type === 'decimal' && this.modelValue.value) {
                this.changing = true;
                const dp = this.params.value.decimalPlaces || 2;
                const dvalue = Array.isArray(this.modelValue.value) ? this.modelValue.value.map((v) => Number(v).toFixed(dp)) : Number(this.modelValue.value).toFixed(dp);
                this.modelValue.value = dvalue;
                this.changing = false;
            }
        }
        this.isEditting = focused;
        this.handleOn('focus-changed', focused);
        if (focused)
            this.handleOn('focus-gained');
        else
            this.handleOn('focus-lost');
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.focusChanged)
            this.options.focusChanged(this, focused);
    }
    mounted() {
        this.updateValue();
    }
}
exports.Field = Field;
Field.defaultParams = {};
const FD = (params, options) => new Field(params, options);
FD.setDefault = Field.setDefault;
exports.$FD = FD;
