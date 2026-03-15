import { Ref, RendererNode, VNode, nextTick, watch } from "vue";
import { ReportMode, UIBase } from "./base";
import { VAutocomplete, VBtn, VCard, VCardActions, VCardText, VCardTitle, VCheckbox, VCheckboxBtn, VCol, VColorPicker, VCombobox, VContainer, VDialog, VIcon, VListItem, VRadio, VRadioGroup, VRow, VSelect, VSpacer, VSwitch, VTable, VTextField, VTextarea, VToolbar } from 'vuetify/components';
import { Master } from "../master";
import { Button } from "./button";
import * as webtex from 'webtex';
import { SimpleDate, SimpleTime, sleep } from "../misc";
import { VDataTable, VDataTableFooter } from "vuetify/components";
import Datepicker from '@vuepic/vue-datepicker';
import { Form } from "./form";
import { Report } from "./report";
import { $v } from "../misc";
import { buildChartWidget, buildCodeWidget, buildHTMLWidget, buildImageWidget, buildMapWidget, buildMessageBoxWidget, RichWidgetContext } from "./widgets/field-rich-widgets";
import { buildReportTableWidget, buildServerTableWidget, buildTableWidget, buildViewTableWidget, TableWidgetContext } from "./widgets/field-table-widgets";

import '@vuepic/vue-datepicker/dist/main.css';
import { Dialogs } from "./dialogs";
import nestedProperty from "nested-property";
import { OnHandler } from "./lib";
import katex from 'katex';
import 'katex/dist/katex.min.css';


export type FieldType = 'text'|'select'|'autocomplete'|'label'|
                        'messagingbox'|'chart'| 'viewtable'|
                        'map'|'map-line'|'map-circle'|'map-rectangle'|'map-polygon'|'map-heatmap'|'map-cluster'|'map-geojson'|'code'|'color'|'html'|'htmlview'|'listselect'|
                        'time'|'date'|'datetime'|'button'|'image'|
                        'document'|'password'|'float'|'integer'|'decimal'|
                        'collection'|'textarea'|'boolean'|'table'|'reporttable'|'servertable';

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
]

export const fieldTypeOptions = [
  {name: 'Text', _id: 'text', id: 'text'}, {name: 'Select', _id: 'select', id: 'select'}, {name: 'Autocomplete', _id: 'autocomplete', id: 'autocomplete'},
  {name: 'Label', _id: 'label', id: 'label'}, {name: 'Messaging Box', _id: 'messagingbox', id: 'messagingbox'}, {name: 'Chart', _id: 'chart', id: 'chart'},
  {name: 'View Table', _id: 'viewtable', id: 'viewtable'}, {name: 'Map', _id: 'map', id: 'map'}, {name: 'Map Line', _id: 'map-line', id: 'map-line'}, {name: 'Map Circle', _id: 'map-circle', id: 'map-circle'}, {name: 'Map Rectangle', _id: 'map-rectangle', id: 'map-rectangle'}, {name: 'Map Polygon', _id: 'map-polygon', id: 'map-polygon'}, {name: 'Map Heatmap', _id: 'map-heatmap', id: 'map-heatmap'}, {name: 'Map Cluster', _id: 'map-cluster', id: 'map-cluster'}, {name: 'Map GeoJSON', _id: 'map-geojson', id: 'map-geojson'}, {name: 'Code', _id: 'code', id: 'code'},
  {name: 'Color', _id: 'color', id: 'color'}, {name: 'HTML', _id: 'html', id: 'html'}, {name: 'Time', _id: 'time', id: 'time'},
  {name: 'Date', _id: 'date', id: 'date'}, {name: 'Datetime', _id: 'datetime', id: 'datetime'}, {name: 'Button', _id: 'button', id: 'button'},
  {name: 'Image', _id: 'image', id: 'image'}, {name: 'Document', _id: 'document', id: 'document'}, {name: 'Password', _id: 'password', id: 'password'},
  {name: 'Float', _id: 'float', id: 'float'}, {name: 'Integer', _id: 'integer', id: 'integer'}, {name: 'Decimal', _id: 'decimal', id: 'decimal'},
  {name: 'Collection', _id: 'collection', id: 'collection'}, {name: 'Textarea', _id: 'textarea', id: 'textarea'}, {name: 'Boolean', _id: 'boolean', id: 'boolean'},
  {name: 'Table', _id: 'table', id: 'table'}, {name: 'Report Table', _id: 'reporttable', id: 'reporttable'}, {name: 'Server Table', _id: 'servertable', id: 'servertable'},
]

export interface FieldParams {
  ref?: string;
  type?: FieldType;
  label?: string;
  storage?: string;
  placeholder?: string;
  multiple?: boolean;
  options?: any;
  readonly?: boolean;
  invisible?: boolean;
  idField?: string;
  lang?: 'html'|'json'|'javascript'|'python'|'python'|'text'|'ejs'|'latex';
  codeTheme?: 'chrome'|'xcode';
  hint?: string;
  icon?: string;
  clearable?: boolean;
  autofocus?: boolean;
  inline?: boolean;
  color?: string;
  itemValue?: string;
  itemTitle?: string;
  returnObject?: boolean;
  itemsPerPage?: string|number;
  class?: string[];
  style?: any;
  height?: number;
  maxHeight?: number|string|undefined;
  minHeight?: number|string|undefined;
  minWidth?: number;
  variant?: "filled" | "outlined" | "plain" | "underlined" | "solo" | "solo-inverted" | "solo-filled" | undefined;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  chartType?: any;
  mapApiKey?: any;
  mapOptions?: any;
  mapZoom?: number;
  hideMapText?: boolean;
  mapTextPageSize?: number;
  fileAccepts?: any;
  fileMaxSize?: number; // In KB
  messageInitialCount?: number;
  messagePageSize?: number;
  bordered?: boolean;
  default?: any;
  required?: boolean;
  decimalPlaces?: number;
  collectionStart?: number;
  collectionEnd?: number;
  collectionDisableAdd?: boolean;
  collectionDisableRemove?: boolean;
  hasFooter?: boolean;
  checkbox?: boolean;
  resolveFormulas?: boolean;
  validation?: {
    range?: { from: any, to: any, converter?: any};
    max?: {value: any, converter?: any};
    min?: {value: any, converter?: any};
    gt?: {value: any, converter?: any};
    lt?: {value: any, converter?: any};
    gte?: {value: any, converter?: any};
    lte?: {value: any, converter?: any};
    neq?: {value: any, converter?: any};
    eq?: {value: any, converter?: any};
    in?: any[];
    nin?: any[];
    includes?: any;
    excludes?: any;
    maxLen?: number;
    minLen?: number;
    regex?: string;
  }
}

export interface FieldOptions {
  master?: Master;
  modifies?: Ref<any>;
  datetimeOptions?: any|undefined;
  selectOptions?: (field: Field) => Promise<any[]|undefined>|any[]|undefined;
  button?: (field: Field) => Button|undefined;
  form?: (field: Field) => Promise<Form|undefined>|Form|undefined;
  headers?: (field: Field) => Promise<any[]|undefined>|any[]|undefined;
  items?: (field: Field, options?: any) => Promise<any[]|any|undefined>|any[]|any|undefined;
  format?: (field: Field, items: any[]) => any[]|undefined;
  footer?: (field: Field, items: any[]) => any[]|undefined;
  chartData?: (field: Field) => Promise<any|undefined>|any|undefined;
  chartOptions?: (field: Field) => Promise<any|undefined>|any|undefined;
  messageFormat?: (field: Field, data: any) => any[];
  rules?: (field: Field) => any[];
  changed?: (field: Field) => void;
  focusChanged?: (field: Field, focused: boolean) => void;
  setup?: (field: Field) => void;
  validate?: (field: Field) => Promise<string|undefined>|string|undefined;
  default?: (field: Field) => any;
  on?: (field: Field) => OnHandler;
  canRemoveItem?: (field: Field, item: any) => Promise<boolean>|boolean|undefined;
  canEditItem?: (field: Field, item: any) => Promise<boolean>|boolean|undefined;
}

export interface Refs {
  [key: string]: Field
}

export class Field extends UIBase {
  private params: Ref<FieldParams>;
  private modelValue = this.$makeRef();
  private options: FieldOptions;
  private changing: boolean;
  private selectItems: Ref<any[]>;
  private optionLoaded: Ref<boolean>;
  private collectionLoaded: Ref<boolean>;
  private collectionForm?: Form;
  private collectionSelectedItems: Ref<any[]>;
  private collectionHeaders?: any[];
  private collectionDialog: Ref<boolean>;
  private collectionFormMaster?: Master;

  private tableHeaders: Ref<any[]>;
  private tableItems: Ref<any[]>;
  private tableLoaded: Ref<boolean>;
  private tableItemsPerPage: Ref<any>;
  private tableTotalItems: Ref<any>;
  private tablePage: Ref<any>;

  private chartOpts: Ref<any>;
  private chartValue: Ref<any>;
  private chartLoaded: Ref<boolean>;
  private loading: Ref<boolean>;
  private currentCollectionItems: any[];
  private currentCollectionFooter: any[];
  private isEditting: boolean;

  private static defaultParams: FieldParams = {};
  private maxWidth: Ref;

  private codePreview: Ref<any>;
  private htmlEditor: any;
  private messageVisibleCount: Ref<number>;
  private messageContainer: Ref<HTMLElement|undefined>;
  private pendingMessageScrollRestore?: { scrollTop: number; scrollHeight: number };

  constructor(params?: FieldParams, options?: FieldOptions) {
    super();
    this.params = this.$makeRef({...Field.defaultParams, ...(params || {})});

    this.changing = false;
    if (options?.master) this.setMaster(options.master); 
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

  static setDefault(value: FieldParams, reset?: boolean): void {
    if (reset) {
      Field.defaultParams = value;
    } else {
      Field.defaultParams = {...Field.defaultParams, ...value}
    }
  }

  get $refs(): Refs {
    const p: any = this.$parent;
    if (p) return p.$refs || {};
    return {};
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: FieldParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): FieldParams {
    return this.params.value;
  }

  get $readonly() {
    if (this.params.value.readonly === true || this.params.value.readonly === false) return this.params.value.readonly;
    if (this.$parent && (this.$parent as any).$readonly) return (this.$parent as any).$readonly;
    return this.params.value.readonly;
  }

  get $parentReport(): Report|undefined {
    return this.$parent ? (this.$parent as any).$parentReport : undefined;
  }

  get $mode(): ReportMode|undefined {
    return this.$parentReport?.$params.mode;
  }

  get $value() {
    const val = this.postprocess(this.modelValue.value);
    if (this.params.value.type === 'decimal') {
      if (val?.$numberDecimal !== undefined) return Number(val.$numberDecimal);
    }
    return val
  }

  get $options() {
    return this.selectItems.value || [];
  }

  get $collectionForm() {
    return this.collectionForm
  }

  props() {
    return []
  }

  setup(props: any, context: any) {
    this.$watch(this.modelValue, () => {
      if (!this.changing) this.valueChanged();
    });
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  private modelBinding() {
    return {
      modelValue: this.modelValue.value,
      "onUpdate:modelValue": (value: any) => {
        this.modelValue.value = value;
      }
    }
  }

  valueChanged(newValue?: any) {
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
    if (this.options.changed) this.options.changed(this);
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
      } else if (this.params.value.default !== undefined || this.options.default) {
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

  private renderMathInHtml(html: string): string {
    // Render display math first ($$...$$)
    if(!html) return html
    
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { displayMode: true });
      } catch (err) {
        return `<span class="katex-error">${math}</span>`;
      }
    });

    // Render inline math ($...$)
    html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { displayMode: false });
      } catch (err) {
        return `<span class="katex-error">${math}</span>`;
      }
    });

    return html;
  }

  private renderLatex(value: any) {
    if (this.params.value.type === 'code' && this.params.value.lang === 'latex') {
      try {
        let fulltext: string = value || ''
        fulltext = fulltext.trim()

        const hasClass = fulltext.includes('\\documentclass')
        const hasBegin = fulltext.includes('\\begin{document}')
        const hasEnd = fulltext.includes('\\end{document}')

        if (!hasClass) {
          if (!hasBegin) {
            fulltext = `\\begin{document}\n${fulltext}`;
          }
          
          fulltext = `\\documentclass{article}\n${latexPackages.map((p: string) => '\\usepackage{' + p + '}').join('\n')}\n${fulltext}`;

          if (!hasEnd) {
            fulltext = `${fulltext}\n\\end{document}`;
          }
        }

        const generator = new webtex.HtmlGenerator({ hyphenate: false });
        const doc = webtex.parse(value, { generator }).htmlDocument();
        this.codePreview.value = `<!DOCTYPE html>${doc.documentElement.outerHTML}`;
      } catch (err: any) {
        this.codePreview.value = `<!DOCTYPE html><html><body><span style="color:red">${err.message}</span></body></html>`
      }
    }
  }

  private showPreviewFullscreen(html: string) {
    const newWindow = window.open('', '_blank')
    if (!newWindow) return
    newWindow.document.open()
    newWindow.document.write(html)
    newWindow.document.close()
  }

  private isEqual(value1: any, value2: any) {
    if (Array.isArray(value1) && Array.isArray(value2)) {
      if (value1.length !== value2.length) return false;
      for (let i = 0; i < value1.length; i++) {
        if (value1[i] !== value2[i]) return false;
      }
      return true;
    } else {
      return value1 === value2;
    }
  }

  private preprocess(value: any) {
    if (value === undefined || value === null) return value;
    
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
      const dp = this.params.value.decimalPlaces || 2;
      if (value.$numberDecimal !== undefined) {
        return Number(value.$numberDecimal).toFixed(dp)
      } else {
        try {
          const dvalue = Number(value).toFixed(dp)
          return dvalue
        } catch (error) {
          
        }
      }
    }

    return value;
  }

  private postprocess(value: any) {
    if (value === undefined || value === null) return value;
    
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
        return { $numberDecimal: Number(value || 0).toFixed(dp) }
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

  async selectOptions(): Promise<any[]|undefined> {
    if (this.options.selectOptions) return await this.options.selectOptions(this);
    return [];
  }

  button(): Button|undefined {
    if (this.options.button) return this.options.button(this);
    return undefined;
  }

  async form(): Promise<Form|undefined> {
    if (this.options.form) return await this.options.form(this);
    return undefined;
  }

  async headers(): Promise<any[]|undefined> {
    if (this.options.headers) return await this.options.headers(this);
  }

  makeHTMLColumns(headers: any[]) {
    const slots: any = {}

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.isHTML) {
        slots[`item.${header.key}`] = (options: any) => {
          return this.$h(
            header.tag || 'div',
            {
              innerHTML: options.value?.html ? options.value.html : options.value,
              class: options.value?.class || [],
              style: options.value?.style || {}
            }
          )
        }
      }
    }

    return slots;
  }

  async items(options?: any): Promise<any[]|undefined> {
    if (this.options.items) return await this.options.items(this, options);
  }

  async chartOptions(): Promise<any|undefined> {
    if (this.options.chartOptions) return await this.options.chartOptions(this);
  }

  async chartData(): Promise<any|undefined> {
    if (this.options.chartData) return await this.options.chartData(this);
  }

  private async loadChart() {
    this.chartOpts.value = await this.chartOptions();
    this.chartValue.value = await this.chartData();
    this.chartLoaded.value = true;
  }

  async loadOptions() {
    const options = await this.selectOptions();
    if (options) {
      this.selectItems.value = options;
    } else {
      this.selectItems.value = [];
    }
  }

  messageFormat(data: any): any[] {
    if (this.options.messageFormat) return this.options.messageFormat(this, data) || [];
    return data;
  }

  async $reload() {
    this.loading.value = true;
    await sleep(100);
    this.loading.value = false;
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;
    
    if (this.params.value.invisible) {
      return;
    }

    if (this.loading.value) {
      return;
    }

    return h(
      VCol,
      {
        cols: this.params.value.cols || 12,
        lg: this.params.value.lg,
        xs: this.params.value.xs,
        md: this.params.value.md,
        xl: this.params.value.xl,
        xxl: this.params.value.xxl,
        sm: this.params.value.sm,
        onVnodeMounted: (props) => {
          if (props.el) {
            const el: RendererNode = props.el;
            this.maxWidth.value = el.offsetWidth - 20;
          }
        }
      },
      () => this.build(props, context),
    );
  }

  async validate(): Promise<string|undefined> {
    if (this.params.value.invisible) return undefined;
    if (this.options.validate) return await this.options.validate(this);
  }

  private rules(): any[] {
    if (this.options.rules) return this.options.rules(this);
    
    const items: any[] = [];

    if (this.params.value.required) {
      items.push($v.isRequired());
    }

    if (this.params.value.validation) {
      const v = this.params.value.validation;
      let converter: any = undefined;

      if (this.params.value.type === 'date') converter = (v: any) => (new SimpleDate(v)).toNumber();
      if (this.params.value.type === 'datetime') converter = (v: any) => new Date(v);
      if (this.params.value.type === 'float') converter = Number;
      if (this.params.value.type === 'integer') converter = Number;
      if (this.params.value.type === 'time') converter = (v: any) => (new SimpleTime(v)).toNumber();


      if (v.range) items.push($v.range(v.range.from, v.range.to, v.range.converter || converter));
      if (v.max) items.push($v.max(v.max.value, v.max.converter || converter));
      if (v.min) items.push($v.min(v.min.value, v.min.converter || converter));
      if (v.gt) items.push($v.gt(v.gt.value, v.gt.converter || converter));
      if (v.lt) items.push($v.lt(v.lt.value, v.lt.converter || converter));
      if (v.gte) items.push($v.gte(v.gte.value, v.gte.converter || converter));
      if (v.lte) items.push($v.lte(v.lte.value, v.lte.converter || converter));
      if (v.neq) items.push($v.neq(v.neq.value, v.neq.converter || converter));
      if (v.eq) items.push($v.eq(v.eq.value, v.eq.converter || converter));
      if (v.in) items.push($v.in(v.in));
      if (v.nin) items.push($v.nin(v.nin));
      if (v.includes !== undefined ) items.push($v.includes(v.includes));
      if (v.excludes !== undefined) items.push($v.excludes(v.excludes));
      if (v.maxLen || v.maxLen === 0) items.push($v.maxLen(v.maxLen));
      if (v.minLen || v.minLen === 0) items.push($v.minLen(v.minLen));
      if (v.regex) items.push($v.regex(v.regex));
    }

    return items;
  }

  build(props: any, context: any) {
    const ftype: FieldType = this.params.value.type || 'text';

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
            this.params.value.fileAccepts = 'application/pdf, *.pdf'
          }
          return this.buildImage(props, context);
        }
      case 'float':
      case 'decimal':
        return this.buildText(props, context, 'number');
      case 'map':
      case 'map-line':
      case 'map-circle':
      case 'map-rectangle':
      case 'map-polygon':
      case 'map-heatmap':
      case 'map-cluster':
      case 'map-geojson':
        return this.buildMap(props, context);
      case 'html':
        return this.buildHTML(props, context);
      case 'htmlview':
        return this.buildHTMLView(props, context);
      case 'image':
        {
          if (!this.params.value.fileAccepts) {
            this.params.value.fileAccepts = 'image/*'
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

  buildText(props: any, context: any, type: any) {
    const h = this.$h;
    if (this.params.value.multiple) {
      return h(
        VCombobox,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          multiple: true,
          type,
          chips: true,
          items: [],
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    } else {
      return h(
        VTextField,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          type,
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    }
  }

  buildLabel(props: any, context: any) {
    const h = this.$h;
    return h(
      'div',
      {
        class: this.params.value.class || ['text-subtitle-2'],
        style: this.params.value.style || {},
        innerHTML: this.params.value.label
      },
    );
  }

  buildHTMLView(props: any, context: any) {
    const h = this.$h;
    return h(
      'div',
      {
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        innerHTML: this.params.value.resolveFormulas ? this.renderMathInHtml(this.modelValue.value) : this.modelValue.value
      },
    );
  }

  buildSelect(props: any, context: any) {
    const h = this.$h;
    return h(
      VSelect,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        itemTitle: this.params.value.itemTitle || 'name',
        itemValue: Master.resolveItemValueField(this.selectItems.value, this.params.value.itemValue || this.params.value.idField),
        readonly: this.$readonly,
        items: this.selectItems.value,
        multiple: this.params.value.multiple,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        "onUpdate:focused": (ev) => this.onFocusChanged(ev)
      },
    );
  }

  buildRadioSelect(props: any, context: any) {
    const h = this.$h;
    return [
      h(
        'div',
        {
          class: ['ml-4', 'mb-4'],
          innerHTML: this.params.value.label
        }
      ),
      h(
        VRadioGroup,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: ['vef-radio-select'].concat(this.params.value.class || []),
          style: this.params.value.style || {},
          rules: this.rules(),
          inline: this.params.value.inline,
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
        () => (this.selectItems.value || []).map(
          (item: any) => h(
            VRadio,
            {
              value: Master.getItemId(item, this.params.value.itemValue || this.params.value.idField),
              inline: this.params.value.inline
            },
            {
              label: () => h(
                'div',
                {
                  ...(item.props || {}),
                  innerHTML: item[this.params.value.itemTitle || 'name']
                }
              )
            }
          ),
        )
      )
    ];
  }

  buildCheckboxSelect(props: any, context: any) {
    const h = this.$h;
    
    if (this.params.value.multiple) {
      if (!this.modelValue.value) {
        const curValue = this.$master?.$get(this.params.value.storage || '')
        if (!curValue) this.modelValue.value = []
        else this.modelValue.value = curValue
      }
    }

    return [
      h(
        'div',
        {
          class: ['ml-4', 'mb-4'],
          innerHTML: this.params.value.label
        }
      ),
      ...(this.selectItems.value || []).map(
        (item: any) => h(
          VCheckboxBtn,
          {
            value: Master.getItemId(item, this.params.value.itemValue || this.params.value.idField),
            ...this.modelBinding(),
            readonly: this.$readonly,
            class: ['vef-check-select'].concat(this.params.value.class || []),
            style: this.params.value.style || {},
            color: this.params.value.color || "primary",
            hint: this.params.value.hint || "",
            multiple: this.params.value.multiple,
            persistentHint: this.params.value.hint ? true : false,
            inline: this.params.value.inline,
          },
          {
            label: () => h(
              'div',
              {
                ...(item.props || {}),
                innerHTML: item[this.params.value.itemTitle || 'name'],
              }
            )
          }
        ),
      )
    ];
  }

  buildAutocomplete(props: any, context: any) {
    const h = this.$h;
    return h(
      VAutocomplete,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        itemTitle: this.params.value.itemTitle || 'name',
        itemValue: Master.resolveItemValueField(this.selectItems.value, this.params.value.itemValue || this.params.value.idField),
        readonly: this.$readonly,
        items: this.selectItems.value,
        autoSelectFirst: true,
        returnObject: this.params.value.returnObject,
        multiple: this.params.value.multiple,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        "onUpdate:focused": (ev) => this.onFocusChanged(ev)
      },
    );
  }

  private richWidgetContext(): RichWidgetContext {
    return {
      $h: this.$h,
      $readonly: this.$readonly,
      params: this.params,
      modelValue: this.modelValue,
      maxWidth: this.maxWidth,
      $makeRef: this.$makeRef,
      $watch: this.$watch,
      getState: <T>(key: string, init: () => T): T => {
        const existing = this.$get(key);
        if (existing !== null && existing !== undefined) {
          return existing as T;
        }

        const value = init();
        this.$set(key, value);
        return value;
      },
      codePreview: this.codePreview,
      chartLoaded: this.chartLoaded,
      chartOpts: this.chartOpts,
      chartValue: this.chartValue,
      renderMathInHtml: (html: string) => this.renderMathInHtml(html),
      showPreviewFullscreen: (html: string) => this.showPreviewFullscreen(html),
      registerHtmlEditor: (editor: any) => this.registerHtmlEditor(editor),
      onHtmlEditorReady: (editor: any) => {
        this.htmlEditor = editor;
        if (this.params.value.autofocus) {
          this.focusHtmlEditor();
        }
      },
      renderLatex: (value: string) => this.renderLatex(value),
      loadChart: () => this.loadChart(),
      messageFormat: (data: any) => this.messageFormat(data),
      showMediaFullscreen: (data: string) => this.showFullscreen(data),
      getMessageWindow: (items: any[]) => this.getMessageWindow(items),
      loadEarlierMessages: (total: number) => this.loadEarlierMessages(total),
      setMessageScrollContainer: (el: Element | any) => this.setMessageScrollContainer(el),
    };
  }

  private tableWidgetContext(): TableWidgetContext {
    return {
      $h: this.$h,
      $readonly: this.$readonly,
      params: this.params,
      modelValue: this.modelValue,
      maxWidth: this.maxWidth,
      tableHeaders: this.tableHeaders,
      tableItems: this.tableItems,
      tableLoaded: this.tableLoaded,
      tableItemsPerPage: this.tableItemsPerPage,
      tableTotalItems: this.tableTotalItems,
      tablePage: this.tablePage,
      getCurrentCollectionItems: () => this.currentCollectionItems,
      setCurrentCollectionItems: (items: any[]) => { this.currentCollectionItems = items; },
      getCurrentCollectionFooter: () => this.currentCollectionFooter,
      setCurrentCollectionFooter: (items: any[]) => { this.currentCollectionFooter = items; },
      loadTableInformation: (options?: any) => this.loadTableInformation(options),
      formatTableItems: (items: any[]) => this.format(items),
      buildTableFooter: (items: any[]) => this.footer(items),
      makeHTMLColumns: (headers: any[]) => this.makeHTMLColumns(headers),
      handleOn: (event: string, data?: any) => this.handleOn(event, data),
    };
  }

  private getMessageWindow(items: any[]) {
    const total = Array.isArray(items) ? items.length : 0;

    if (total === 0) {
      this.messageVisibleCount.value = 0;
      return { items: [], hasEarlier: false, earlierCount: 0, pageSize: this.messagePageSize() };
    }

    const initialCount = this.messageInitialRenderCount(total);
    if (this.messageVisibleCount.value <= 0) {
      this.messageVisibleCount.value = initialCount;
    } else if (this.messageVisibleCount.value > total) {
      this.messageVisibleCount.value = total;
    } else if (total <= initialCount) {
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

  private messageInitialRenderCount(total: number) {
    const configured = this.params.value.messageInitialCount;
    if (typeof configured === 'number' && configured > 0) {
      return Math.min(total, configured);
    }

    if (total > 50) {
      return Math.min(total, 50);
    }

    return total;
  }

  private messagePageSize() {
    const configured = this.params.value.messagePageSize;
    if (typeof configured === 'number' && configured > 0) {
      return configured;
    }

    return 50;
  }

  private async loadEarlierMessages(total: number) {
    const container = this.messageContainer.value;
    if (container) {
      this.pendingMessageScrollRestore = {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
      };
    }

    this.messageVisibleCount.value = Math.min(total, (this.messageVisibleCount.value || 0) + this.messagePageSize());
    await nextTick();
    this.restoreMessageScrollPosition();
  }

  private setMessageScrollContainer(el: Element | any) {
    if (el instanceof HTMLElement) {
      this.messageContainer.value = el;
    } else {
      const root = el?.$el;
      this.messageContainer.value = root instanceof HTMLElement ? root : undefined;
    }

    this.restoreMessageScrollPosition();
  }

  private restoreMessageScrollPosition() {
    if (!this.pendingMessageScrollRestore || !this.messageContainer.value) {
      return;
    }

    const delta = this.messageContainer.value.scrollHeight - this.pendingMessageScrollRestore.scrollHeight;
    this.messageContainer.value.scrollTop = this.pendingMessageScrollRestore.scrollTop + delta;
    this.pendingMessageScrollRestore = undefined;
  }

  buildHTML(props: any, context: any) {
    return buildHTMLWidget(this.richWidgetContext());
  }

  private registerHtmlEditor(editor: any) {
    this.htmlEditor = editor;

    editor.on('init', () => {
      if (this.params.value.autofocus) {
        this.focusHtmlEditor();
      }
    });

    editor.on('keydown', (ev: KeyboardEvent) => {
      this.onHtmlEditorKeydown(ev);
    });
  }

  private async onHtmlEditorKeydown(ev: KeyboardEvent) {
    const form = this.parentForm();
    if (!form || Dialogs.hasBlockingDialog()) {
      return;
    }

    if (!ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's') {
      ev.preventDefault();
      await form.$handleSaveShortcut();
      return;
    }

    if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
      ev.preventDefault();
      await form.$handleEscapeShortcut();
    }
  }

  private focusHtmlEditor() {
    const editor = this.htmlEditor;
    if (!editor || typeof window === 'undefined') {
      return;
    }

    setTimeout(() => {
      editor.focus?.();
      const body = editor.getBody?.();
      body?.focus?.();
      if (body && typeof editor.selection?.select === 'function' && typeof editor.selection?.collapse === 'function') {
        editor.selection.select(body, true);
        editor.selection.collapse(true);
      }
    }, 50);
  }

  private parentForm(): Form|undefined {
    let parent: any = this.$parent;
    while (parent) {
      if (parent instanceof Form) {
        return parent;
      }
      parent = parent.$parent;
    }
    return undefined;
  }

  async focusPrimaryInput(): Promise<boolean> {
    if (this.$readonly || this.params.value.invisible) {
      return false;
    }

    if (this.params.value.type === 'html') {
      this.focusHtmlEditor();
      return true;
    }

    return false;
  }

  buildButton(props: any, context: any) {
    const h = this.$h;
    const btn = this.button()
    if (btn) return h(btn.component);
    return undefined;
  }

  buildCode(props: any, context: any) {
    return buildCodeWidget(this.richWidgetContext());
  }

  buildColor(props: any, context: any) {
    const h = this.$h;

    const dialog: Ref<boolean> = this.$makeRef(false);
    const temp: Ref<any> = this.$makeRef();

    return h(
      VRow,
      {},
      () => [
        h(
          VCol,
          {
            cols: 12
          },
          () => h(
            'span',
            {
              class: ['ml-4']
            },
            this.params.value.label
          )
        ),
        h(
          VCol,
          {
            class: [],
          },
          () => [
            h(
              VListItem,
              {
                lines: 'two',
                class: ['py-0', 'my-0'],
              },
              {
                prepend: () => h(
                  'div',
                  {
                    class: ['v-color-picker-preview__dot', 'ml-4'],
                    style: {cursor: 'pointer', width: '30px', height: '30px', display: 'inline-block'},
                    onClick: () => {
                      dialog.value = true;
                    }
                  },
                  h(
                    'div',
                    {
                      class: [],
                      style: {cursor: 'pointer', 'background-color': this.modelValue.value, width: '30px', height: '30px', display: 'inline-block'},
                      onClick: () => {
                        dialog.value = true;
                      }
                    } 
                  )
                ),
                title: () => h(
                  'div',
                  {
                    class: ['text-h6'],
                    style: {cursor: 'pointer', display: 'inline-block'},
                    onClick: () => {
                      dialog.value = true;
                    }
                  },
                  this.modelValue.value,
                )
              }
            ),
          ]
        ),
        h(
          VDialog,
          {
            modelValue: dialog.value,
            maxWidth: 350,
            persistent: true
          },
          () => h(
            VCard,
            {},
            () => [
              h(
                VCardText,
                {},
                () => h(
                  VColorPicker,
                  {
                    modelValue: temp.value,
                    mode: "hexa",
                    "onUpdate:modelValue": (v) => {
                      temp.value = v;
                    }
                  }
                )
              ),
              h(
                VCardActions,
                {},
                () => [
                  h(VSpacer),
                  h(
                    VBtn,
                    {
                      color: "error",
                      onClick: () => {
                        dialog.value = false;
                      }
                    },
                    () => "Cancel"
                  ),
                  h(
                    VBtn,
                    {
                      color: "success",
                      onClick: () => {
                        this.modelValue.value = temp.value;
                        dialog.value = false;
                      }
                    },
                    () => "Save"
                  )
                ]
              )
            ]
          )
        )
      ]
    );
  }

  buildTime(props: any, context: any) {
    const h = this.$h;
    if (this.params.value.multiple) {
      return h(
        VCombobox,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          multiple: true,
          type: "time",
          chips: true,
          items: [],
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    } else {
      return h(
        VTextField,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          type: "time",
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    }
  }

  buildDate(props: any, context: any) {
    const h = this.$h;
    if (this.params.value.multiple) {
      return h(
        VCombobox,
        {
          modelValue: this.modelValue.value,
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          multiple: true,
          type: "date",
          chips: true,
          items: [],
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          "onUpdate:modelValue": (value: any[]) => {
            this.modelValue.value = value;
          },
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    } else {
      return h(
        VTextField,
        {
          modelValue: this.modelValue.value,
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          type: "date",
          "onUpdate:modelValue": (value: any) => {
            this.modelValue.value = value;
          },
          "onUpdate:focused": (ev) => this.onFocusChanged(ev)
        },
      );
    }
  }

  buildDatetime(props: any, context: any) {
    const h = this.$h;
    return [
      h(
        'div',
        {
          class: ['mb-2', 'ml-4'],
          innerHTML: this.params.value.label || ""
        },
      ),
      h(
        Datepicker,
        {
          modelValue: this.modelValue.value,
          autofocus: this.params.value.autofocus,
          label: this.params.value.label || "",
          hint: this.params.value.hint || "",
          persistentHint: this.params.value.hint ? true : false,
          placeholder: this.params.value.placeholder || "",
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          ...(this.options.datetimeOptions || {}),
          "onUpdate:model-value": (value: any) => {
            this.modelValue.value = value;
          },
          "onUpdate:focused": (ev: any) => this.onFocusChanged(ev)
        },
      )
    ];
  }

  buildPassword(props: any, context: any) {
    const h = this.$h;
    return h(
      VTextField,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        type: 'password',
        rules: this.rules(),
        "onUpdate:focused": (ev) => this.onFocusChanged(ev)
      },
    );
  }

  buildFloat(props: any, context: any) {
    const h = this.$h;
    return h(
      VTextField,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        type: 'number',
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        "onUpdate:focused": (ev) => this.onFocusChanged(ev)
      },
    );
  }

  buildInteger(props: any, context: any) {
    const h = this.$h;
    return h(
      VTextField,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        type: 'number',
        "onBeforeinput": (v: InputEvent) => {
          if (v.inputType === 'insertText' && v.data) {
            if (!['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-'].includes(v.data!)) {
              v.preventDefault();
            }
          }
        },
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        "onUpdate:focused": (ev) => this.onFocusChanged(ev)
      },
    );
  }

  buildCollection(props: any, context: any) {
    const h = this.$h;
    
    if (!this.collectionLoaded.value) {
      this.loadCollectionInformation();
    } else {
      let items: any[] = this.modelValue.value || [];
      items = items.slice(this.params.value.collectionStart, this.params.value.collectionEnd)
      this.currentCollectionItems = this.format(items);
      if (this.params.value.hasFooter) this.currentCollectionFooter = this.footer(this.currentCollectionItems);
    }

    return h(
      VRow,
      {},
      () => [
        h(
          VCol,
          {
            cols: 12,
            md: 9,
            class: ['py-0', 'pl-6']
          },
          () => [
            h(
              'div',
              {
              },
              this.params.value.label
            )
          ]
        ),
        h(
          VCol,
          {
            cols: 12,
            md: 3,
            align: "end",
            class: ['my-0', 'py-0', 'text-right']
          },
          () => [
            ...(this.collectionSelectedItems.value.length > 0 && !this.$readonly && !this.params.value.collectionDisableRemove ? [
              h(
                VBtn,
                {
                  color: 'error',
                  size: 28,
                  icon: true,
                  class: ['mr-4'],
                  onClick: () => {
                    this.onCollectionItemRemoved();
                  }
                },
                () => [
                  h(VIcon, {size: 24}, () => 'mdi-delete'),
                ]
              )
            ] : []),
            ...(
              this.$readonly || this.params.value.collectionDisableAdd || (this.params.value.collectionEnd !== undefined && this.params.value.collectionEnd <= (this.modelValue.value || []).length) ? [] : [
                h(
                  VBtn,
                  {
                    color: 'primary',
                    size: 28,
                    icon: true,
                    onClick: async () => {
                      await this.createCollectionForm();
                      if (this.collectionForm) {
                        this.collectionForm.$params.mode = 'create';
                        this.collectionForm.setParent(this);
                        this.collectionFormMaster?.$reset({});
                      }
                      this.collectionDialog.value = true;
                    }
                  },
                  () => [
                    h(VIcon, {size: 24}, () => 'mdi-plus'),
                  ]
                )
              ]
            )
          ]
        ),
        h(
          VCol,
          {
            cols: 12,
            class: ['my-0', 'py-0'],
          },
          () => h(
            VCard,
            {
              class: ['overflow-auto', 'mx-auto', 'pa-0'],
              maxWidth: this.maxWidth.value,
              elevation: 0
            },
            () => h(
              VDataTable,
              {
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
                "onUpdate:modelValue": (value: any) => {
                  this.collectionSelectedItems.value = value;
                },
                "onClick:row": (_: any, {item}: any) => {
                  this.onCollectionItemClicked(item);
                }
              },
              {
                ...(this.params.value.hasFooter ? {
                  bottom: (options: any) => [
                    h(
                      VDataTable,
                      {
                        headers: options.headers[0],
                        density: 'compact',
                        hideNoData: true,
                        items: this.currentCollectionFooter
                      },
                      {
                        top: () => h('hr'),
                        headers: () => h('div'),
                        bottom: () => h('hr', {class: ['mb-4']}),
                        "item.data-table-select": () => h('div')
                      }
                    ),
                    h(
                      VDataTableFooter,
                      {},
                    )
                  ]
                } : {})
              }
            )
          )
        ),
        ...(this.collectionLoaded.value ? [
          h(
            VCol,
            {
              align: 'center',
              cols: 12
            },
            () => h(
              VDialog,
              {
                modelValue: this.collectionDialog.value,
                persistent: true,
                scrollable: true,
                "onUpdate:modelValue": (v) => {
                  this.collectionDialog.value = v;
                }
              },
              () => this.collectionForm ? h(
                  this.collectionForm.component,
                  {class: ['mx-auto']}
              ) : undefined
            )
          )
        ] : [])
      ]
    );
  }

  buildMessageBox(props: any, context: any) {
    return buildMessageBoxWidget(this.richWidgetContext());
  }

  buildChart(props: any, context: any) {
    return buildChartWidget(this.richWidgetContext());
  }

  buildMap(props: any, context: any) {
    return buildMapWidget(this.richWidgetContext());
  }

  buildImage(props: any, context: any) {
    return buildImageWidget(this.richWidgetContext());
  }

  private showFullscreen (data: string) {
    const pdfWindow = window.open("")
    if (!pdfWindow) return;
    pdfWindow.document.write(
        `<iframe width='100%' height='100%' src='${data}' frameBorder="0"></iframe>`
    )
  }

  private async loadCollectionInformation() {
    this.collectionHeaders = await this.headers();
    this.collectionLoaded.value = true;
  }

  forceLoadCollectionInfo() {
    this.collectionLoaded.value = false;
  }

  private async createCollectionForm() {
    if (this.collectionForm) {
      this.collectionForm.clearListeners(this.$id);
    }

    this.collectionForm = await this.form();
    if (this.collectionForm) {
      this.collectionForm.$params.auto = true;
      
      this.collectionFormMaster = new Master();
      this.collectionForm.setMaster(this.collectionFormMaster);

      this.collectionForm.on('saved', (fm: any) => {
        this.onCollectionFormSaved(fm)
      }, this.$id)

      this.collectionForm.on('cancel', () => {
        this.onCollectionFormCancel();
      }, this.$id)
    }
  }

  private async onCollectionFormSaved(fm: Form) {
    const value = this.collectionFormMaster?.$data || {};
    if (this.$master && this.params.value.storage) {
      
      if (fm.$params.mode === 'create') this.$master.$addCollectionObject(this.params.value.storage, value);

      if (fm.$params.mode === 'edit')  {
        const valueId = Master.getItemId(value, this.params.value.idField);
        this.$master.$setCollectionObject(this.params.value.storage, (valueId || valueId === 0) ? valueId : value.__index?.toString(), value, (valueId || valueId === 0) ? Master.resolveItemValueField([value], this.params.value.idField) : '__index');
      }
      this.updateValue();
    }

    this.handleOn('form-saved', this)

    if (this.collectionFormMaster && fm.$params.mode === 'create') {
      this.collectionFormMaster.$reset({});
    } else {
      this.collectionDialog.value = false;
    }
  }

  private async onCollectionFormCancel() {
    this.collectionDialog.value = false;
    this.handleOn('form-cancel', this)
  }

  private async onCollectionItemRemoved() {
    if (this.$master && this.params.value.storage) {
      const items = this.collectionSelectedItems.value || [];
      
      items.sort((a: any, b: any) => {
        if (a.__index > b.__index) return -1;
        if (a.__index < b.__index) return 1;
        return 0
      })

      for (let i = 0; i < items.length; i++) {
        let canRemove: any = true;
        
        if (this.options.canRemoveItem) {
          canRemove = await this.options.canRemoveItem(this, items[i]);
        }
        
        if (canRemove) {
          const itemId = Master.getItemId(items[i], this.params.value.idField);
          this.$master.$removeCollectionObject(this.params.value.storage, (itemId || itemId === 0) ? itemId : (items[i].__index || items[i].__index === 0 ? items[i].__index.toString() : items[i].toString()), (itemId || itemId === 0) ? Master.resolveItemValueField([items[i]], this.params.value.idField) : '__index');
        }
        
      }

      this.handleOn('item-removed', this)

      this.collectionSelectedItems.value = [];
    }
    this.updateValue();
  }

  private async onCollectionItemClicked(item: any) {

    let canEdit: any = true;
    if (this.options.canEditItem) canEdit = await this.options.canEditItem(this, item);
    if (!canEdit) return;

    await this.createCollectionForm();
    const itemId = Master.getItemId(item, this.params.value.idField);
    const value = this.currentCollectionItems.filter((i: any) => Master.matchesItemId(i, itemId, this.params.value.idField) || i.__index === item.__index)[0];
    await this.collectionFormMaster?.$reset(Object.assign({}, value || {}));
    if (this.collectionForm) {
      this.collectionForm.$params.mode = this.$readonly ? 'display': 'edit';
      this.collectionForm.setParent(this);
    }
    this.handleOn('item-clicked', this)
    this.collectionDialog.value = true;
  }

  format(items: any[]): any[] {
    if (this.options.format) {
      const data = this.options.format(this, JSON.parse(JSON.stringify(items)));
      if (data && Array.isArray(data)) return data;
    }
    return items;
  }

  private attachIndex(data: any[]) {
    if (!data) return []

    if (!Array.isArray(data)) data = [data];

    data = data.filter((d: any) => d)

    data.forEach((item: any, index: number) => {
      item.__index = index;
    });

    return data;
  }

  private footer(items: any[]): any[] {
    let data = []
    if (this.options.footer) data = this.options.footer(this, items) || [];
    return data;
  }

  buildTextArea(props: any, context: any) {
    const h = this.$h;
    return h(
      VTextarea,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules()
      },
    );
  }

  buildBoolean(props: any, context: any) {
    const h = this.$h;
    return h(
      this.params.value.checkbox ? VCheckboxBtn : VSwitch,
      {
        ...this.modelBinding(),
        autofocus: this.params.value.autofocus,
        label: this.params.value.label || "",
        hint: this.params.value.hint || "",
        persistentHint: this.params.value.hint ? true : false,
        placeholder: this.params.value.placeholder || "",
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        inline: this.params.value.inline
      },
    );
  }

  buildTable(props: any, context: any) {
    return buildTableWidget(this.tableWidgetContext());
  }

  forceLoadTableInfo() {
    this.tableLoaded.value = false;
  }

  clearTableSelection() {
    this.modelValue.value = []
  }

  buildServerTable(props: any, context: any) {
    return buildServerTableWidget(this.tableWidgetContext());
  }

  buildViewTable(props: any, context: any) {
    return buildViewTableWidget(this.tableWidgetContext());
  }

  buildReportTable(props: any, context: any) {
    return buildReportTableWidget(this.tableWidgetContext());
  }

  private async loadTableInformation(options?: any) {
    this.tableHeaders.value = await this.headers() || [];
    const data: any = await this.items(options);
    
    if (Array.isArray(data)) {
      this.tableItems.value = this.format(data);
      this.tableTotalItems.value = data.length;
      this.tableItemsPerPage.value = -1;
      this.tablePage.value = 1;
    } else if (data) {
      this.tableItems.value = this.format(data.data || []);
      this.tableTotalItems.value = data.total || 0;
      this.tableItemsPerPage.value = data.limit;
      this.tablePage.value = options.page || 1;
    } else {
      this.tableItems.value = this.format([]);
      this.tableTotalItems.value = 0;
      this.tableItemsPerPage.value = -1;
      this.tablePage.value = 1;
    }

    this.tableLoaded.value = true;
  }

  private handleOn(event: string, data?: any) {
    if (this.options.on) {
      const events = this.options.on(this);
      if (events[event]) {
        events[event](data)
      }
    }

    this.emit(event, data)
  }

  onFocusChanged(focused: any) {
    if (this.isEditting && !focused) {
      if (this.params.value.type === 'decimal' && this.modelValue.value) {
        this.changing = true;
        const dp = this.params.value.decimalPlaces || 2;
        const dvalue = Array.isArray(this.modelValue.value) ? this.modelValue.value.map((v: any) => Number(v).toFixed(dp)) : Number(this.modelValue.value).toFixed(dp)
        this.modelValue.value = dvalue
        this.changing = false;
      }
    }
    this.isEditting = focused
    this.handleOn('focus-changed', focused)
    if(focused) this.handleOn('focus-gained')
    else this.handleOn('focus-lost')
    if (this.options?.focusChanged) this.options.focusChanged(this, focused)
  }

  mounted() {
    this.updateValue();
  }

}

const FD = (params?: FieldParams, options?: FieldOptions) => new Field(params, options);
FD.setDefault = Field.setDefault

export const $FD = FD;
