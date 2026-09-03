import { Ref, RendererNode, VNode, nextTick } from "vue";
import { ReportMode, UIBase } from "./base";
import { VAutocomplete, VBtn, VCard, VCheckboxBtn, VCol, VColorInput, VCombobox, VDialog, VFileUpload, VIcon, VOtpInput, VRadio, VRadioGroup, VRow, VSelect, VSwitch, VTextField, VTextarea } from 'vuetify/components';
import { Master } from "../master";
import { Button } from "./button";
import { fileToBase64, selectFile, SimpleDate, SimpleTime, sleep } from "../misc";
import { VDataTable, VDataTableFooter } from "vuetify/components";
import Datepicker from '@vuepic/vue-datepicker';
import { Form } from "./form";
import { Report } from "./report";
import { $v } from "../misc";
import { buildChartWidget, buildCodeWidget, buildHTMLWidget, buildImageWidget, buildMapWidget, buildMessageBoxWidget, RichWidgetContext } from "./widgets/field-rich-widgets";
import { buildReportTableWidget, buildServerTableWidget, buildTableWidget, buildViewTableWidget, TableWidgetContext } from "./widgets/field-table-widgets";
import { buildPaginationWidget } from "./widgets/field-pagination-widget";
import {
  createFieldPaginationEvent,
  normalizeFieldPaginationValue,
  updateFieldPaginationValue,
  type FieldPaginationChangeReason,
  type FieldPaginationEvent,
  type FieldPaginationValue,
} from "./widgets/field-pagination-state";

export type {
  FieldPaginationChangeReason,
  FieldPaginationEvent,
  FieldPaginationValue,
} from "./widgets/field-pagination-state";

import '@vuepic/vue-datepicker/dist/main.css';
import { Dialogs } from "./dialogs";
import nestedProperty from "nested-property";
import { OnHandler } from "./lib";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { isUIValidationMessage, resolveUIText, type UIText, type UIValidationResult, type UIValidationRuleResult } from "./runtime";


export type FieldType = 'text'|'select'|'autocomplete'|'label'|
                        'messagingbox'|'chart'| 'viewtable'|
                        'map'|'map-line'|'map-circle'|'map-rectangle'|'map-polygon'|'map-heatmap'|'map-cluster'|'map-geojson'|'code'|'color'|'html'|'htmlview'|'listselect'|'otp'|'file-upload'|
                        'time'|'date'|'datetime'|'button'|'image'|
                        'document'|'password'|'float'|'integer'|'decimal'|
                        'collection'|'textarea'|'boolean'|'pagination'|'table'|'reporttable'|'servertable';

export type FieldUploadType = 'base64'|'file'|'metadata';
export type FieldDateFormat = 'YYYY-MM-DD'|'YYYYMMDD'|'timestamp';
export type FieldTimeFormat = 'HH:mm'|'HHMM'|'timestamp';
export type FieldValueOrigin = 'default'|'master'|'user'|'programmatic';

export interface FieldValueContext {
  origin: FieldValueOrigin;
  value: any;
  previousValue?: any;
}

export interface FieldPaginationSetOptions {
  notify?: boolean;
  origin?: FieldValueOrigin;
  reason?: FieldPaginationChangeReason;
}

export type FieldHtmlEventType = 'click'|'change'|'input'|'submit';

export interface FieldHtmlEvent {
  name: string;
  payload?: any;
  value?: any;
  eventType: FieldHtmlEventType;
  field: Field;
  element: HTMLElement;
  nativeEvent: Event;
}

interface FieldUpdateOptions {
  initialize?: boolean;
  notifyChanged?: boolean;
  origin?: FieldValueOrigin;
}

export interface AssetRecord {
  id: string;
  name: string;
  mimeType?: string;
  size?: number;
  previewUrl?: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  extension?: string;
  [key: string]: any;
}

export interface AssetFieldUploadPayload {
  files: File[];
  file?: File;
  multiple: boolean;
  fieldType: 'image' | 'document' | 'file-upload';
}

export interface AssetResolvePayload {
  ids: string[];
  multiple: boolean;
  fieldType: 'image' | 'document' | 'file-upload';
}

export interface AssetAdapter {
  upload: (payload: AssetFieldUploadPayload, field: Field) => Promise<AssetRecord[]>;
  resolve: (payload: AssetResolvePayload, field: Field) => Promise<AssetRecord[]>;
  remove?: (assets: AssetRecord[], field: Field) => Promise<void>;
  replace?: (asset: AssetRecord, file: File, field: Field) => Promise<AssetRecord>;
  getPreviewUrl?: (asset: AssetRecord, field: Field) => Promise<string> | string;
  getDownloadUrl?: (asset: AssetRecord, field: Field) => Promise<string> | string;
}

export interface UploadedFileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension?: string;
}

export interface FieldSelectedFilePayload {
  files: File[];
  file?: File;
  multiple: boolean;
  uploadType: FieldUploadType;
}

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
  {name: 'Color', _id: 'color', id: 'color'}, {name: 'HTML', _id: 'html', id: 'html'}, {name: 'HTML View', _id: 'htmlview', id: 'htmlview'}, {name: 'Time', _id: 'time', id: 'time'},
  {name: 'Date', _id: 'date', id: 'date'}, {name: 'Datetime', _id: 'datetime', id: 'datetime'}, {name: 'Button', _id: 'button', id: 'button'},
  {name: 'Image', _id: 'image', id: 'image'}, {name: 'Document', _id: 'document', id: 'document'}, {name: 'Password', _id: 'password', id: 'password'},
  {name: 'Float', _id: 'float', id: 'float'}, {name: 'Integer', _id: 'integer', id: 'integer'}, {name: 'Decimal', _id: 'decimal', id: 'decimal'},
  {name: 'OTP', _id: 'otp', id: 'otp'}, {name: 'File Upload', _id: 'file-upload', id: 'file-upload'},
  {name: 'Collection', _id: 'collection', id: 'collection'}, {name: 'Textarea', _id: 'textarea', id: 'textarea'}, {name: 'Boolean', _id: 'boolean', id: 'boolean'},
  {name: 'Pagination', _id: 'pagination', id: 'pagination'},
  {name: 'Table', _id: 'table', id: 'table'}, {name: 'Report Table', _id: 'reporttable', id: 'reporttable'}, {name: 'Server Table', _id: 'servertable', id: 'servertable'},
]

export interface FieldParams {
  ref?: string;
  type?: FieldType;
  label?: UIText;
  storage?: string;
  placeholder?: UIText;
  multiple?: boolean;
  options?: any;
  readonly?: boolean;
  invisible?: boolean;
  idField?: string;
  lang?: 'html'|'json'|'javascript'|'python'|'text'|'ejs'|'latex';
  codeTheme?: 'chrome'|'xcode';
  hint?: UIText;
  icon?: string;
  clearable?: boolean;
  autofocus?: boolean;
  inline?: boolean;
  color?: string;
  itemValue?: string;
  itemTitle?: string;
  returnObject?: boolean;
  itemsPerPage?: string|number;
  itemsPerPageOptions?: number[];
  page?: number;
  totalItems?: number;
  showItemsPerPage?: boolean;
  showItemRange?: boolean;
  showPageInfo?: boolean;
  paginationLoading?: boolean;
  paginationVariant?: "flat" | "text" | "outlined" | "plain" | "elevated" | "tonal";
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
  serverSearch?: boolean;
  autocompleteLoadMore?: 'scroll'|'button';
  searchDebounceMs?: number;
  minSearchChars?: number;
  searchOnFocus?: boolean;
  searchPageSize?: number;
  cacheSearchResults?: boolean;
  keepSelectedItemsInOptions?: boolean;
  autocompleteLoadMoreText?: UIText;
  autocompleteLoadingMoreText?: UIText;
  previewFullscreen?: boolean;
  hideMapText?: boolean;
  mapTextPageSize?: number;
  uploadType?: FieldUploadType;
  dateFormat?: FieldDateFormat;
  timeFormat?: FieldTimeFormat;
  fileAccepts?: any;
  fileMaxSize?: number; // In KB
  assetMode?: boolean;
  assetAdapter?: AssetAdapter;
  assetIdField?: string;
  assetPreviewField?: string;
  assetDownloadField?: string;
  assetNameField?: string;
  assetMimeTypeField?: string;
  assetSizeField?: string;
  autoUpload?: boolean;
  removeAssetOnClear?: boolean;
  messageInitialCount?: number;
  messagePageSize?: number;
  bordered?: boolean;
  default?: any;
  required?: boolean;
  decimalPlaces?: number;
  length?: number;
  otpType?: string;
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
  autocompleteSearch?: (
    field: Field,
    search: string,
    options?: {
      page?: number;
      limit?: number;
      signal?: AbortSignal;
    }
  ) => Promise<any[] | {
    items?: any[];
    data?: any[];
    total?: number;
    page?: number;
    hasMore?: boolean;
  } | undefined> | any[] | {
    items?: any[];
    data?: any[];
    total?: number;
    page?: number;
    hasMore?: boolean;
  } | undefined;
  autocompleteResolveValue?: (
    field: Field,
    value: any,
    options?: {
      signal?: AbortSignal;
    }
  ) => Promise<any | any[] | undefined> | any | any[] | undefined;
  autocompleteNoSearchText?: (field: Field) => string|undefined;
  autocompleteNoDataText?: (field: Field, search: string) => string|undefined;
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
  changed?: (field: Field, context: FieldValueContext) => void;
  initialized?: (field: Field, context: FieldValueContext) => Promise<void>|void;
  paginationChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  pageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  itemsPerPageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void>|void;
  htmlEvent?: (field: Field, event: FieldHtmlEvent) => Promise<void>|void;
  fileSelected?: (field: Field, payload: FieldSelectedFilePayload) => Promise<void>|void;
  assetUploaded?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  assetsResolved?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  assetRemoved?: (field: Field, assets: AssetRecord[]) => Promise<void>|void;
  finished?: (field: Field, value: string) => Promise<void>|void;
  focusChanged?: (field: Field, focused: boolean) => void;
  setup?: (field: Field) => void;
  validate?: (field: Field) => Promise<UIValidationResult>|UIValidationResult;
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
  private handledModelSyncPending = false;
  private handledModelSyncValue: any;
  private handledModelSyncVersion = 0;
  private initialized = false;
  private initializationVersion = 0;
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
  private autocompleteSearchText: Ref<string>;
  private autocompleteLoading: Ref<boolean>;
  private autocompleteLoadingMore: Ref<boolean>;
  private autocompleteLoaded: Ref<boolean>;
  private autocompletePage: Ref<number>;
  private autocompleteTotal: Ref<number|undefined>;
  private autocompleteHasMore: Ref<boolean>;
  private autocompleteRequestId: Ref<number>;
  private autocompleteResultItems: Ref<any[]>;
  private autocompleteResolvedItems: Ref<any[]>;
  private autocompleteCache: Map<string, { items: any[]; total?: number; page?: number; hasMore?: boolean }>;
  private autocompleteDebounceTimer?: ReturnType<typeof setTimeout>;
  private autocompleteAbortController?: AbortController;
  private autocompleteMenuClass: string;
  private selectedFiles: Ref<File[]>;
  private resolvedAssets: Ref<AssetRecord[]>;
  private assetResolveRequestId: Ref<number>;
  private assetUploadPending: Ref<boolean>;
  private assetUploading: Ref<boolean>;
  private fileUploadLoading: Ref<boolean>;

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
    this.autocompleteSearchText = this.$makeRef('');
    this.autocompleteLoading = this.$makeRef(false);
    this.autocompleteLoadingMore = this.$makeRef(false);
    this.autocompleteLoaded = this.$makeRef(false);
    this.autocompletePage = this.$makeRef(1);
    this.autocompleteTotal = this.$makeRef(undefined);
    this.autocompleteHasMore = this.$makeRef(false);
    this.autocompleteRequestId = this.$makeRef(0);
    this.autocompleteResultItems = this.$makeRef([]);
    this.autocompleteResolvedItems = this.$makeRef([]);
    this.autocompleteCache = new Map();
    this.autocompleteMenuClass = `vef-autocomplete-menu-${Math.random().toString(36).slice(2, 10)}`;
    this.selectedFiles = this.$makeRef([]);
    this.resolvedAssets = this.$makeRef([]);
    this.assetResolveRequestId = this.$makeRef(0);
    this.assetUploadPending = this.$makeRef(false);
    this.assetUploading = this.$makeRef(false);
    this.fileUploadLoading = this.$makeRef(false);
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

  private isCreateMode() {
    if (this.params.value.readonly) {
      return false;
    }

    if (this.params.value && (this.params.value as any).mode === 'create') {
      return true;
    }

    let parent: any = this.$parent;
    while (parent) {
      if (parent.$params?.mode === 'create') {
        return true;
      }

      parent = parent.$parent;
    }

    return this.$mode === 'create';
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

  get $selectedFiles(): File[] {
    return [...(this.selectedFiles.value || [])];
  }

  get $resolvedAssets(): AssetRecord[] {
    return [...(this.resolvedAssets.value || [])];
  }

  get $hasPendingUpload(): boolean {
    return this.assetUploadPending.value === true;
  }

  props() {
    return []
  }

  setup(props: any, context: any) {
    this.$watch(this.modelValue, (value, previousValue) => {
      if (this.isAssetMode()) {
        void this.syncResolvedAssets();
      }
      if (this.isServerAutocomplete()) {
        void this.syncServerAutocompleteSelection();
      }
      if (this.consumeHandledModelSync()) {
        return;
      }
      if (!this.changing) this.valueChanged(value, 'user', previousValue);
    });
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  private consumeHandledModelSync() {
    if (!this.handledModelSyncPending || !Object.is(this.modelValue.value, this.handledModelSyncValue)) {
      return false;
    }

    this.handledModelSyncPending = false;
    this.handledModelSyncValue = undefined;
    return true;
  }

  private markCurrentModelSyncHandled() {
    const syncVersion = ++this.handledModelSyncVersion;
    this.handledModelSyncValue = this.modelValue.value;
    this.handledModelSyncPending = true;

    void nextTick(() => {
      if (this.handledModelSyncVersion === syncVersion) {
        this.handledModelSyncPending = false;
        this.handledModelSyncValue = undefined;
      }
    });
  }

  private setModelValueFromMaster(value: any) {
    this.modelValue.value = value;
    this.markCurrentModelSyncHandled();
  }

  private setModelValueAndSync(value: any, origin: FieldValueOrigin = 'user') {
    const previousValue = this.modelValue.value;
    this.modelValue.value = value;
    this.markCurrentModelSyncHandled();
    this.valueChanged(value, origin, previousValue);
  }

  private normalizePaginationValue(value?: Partial<FieldPaginationValue> | any): FieldPaginationValue {
    return normalizeFieldPaginationValue(value, {
      page: this.params.value.page,
      limit: Number(this.params.value.itemsPerPage || 10),
      total: this.params.value.totalItems,
    });
  }

  private paginationEvent(value: FieldPaginationValue, previousValue: FieldPaginationValue, reason: FieldPaginationChangeReason): FieldPaginationEvent {
    return createFieldPaginationEvent(value, previousValue, reason);
  }

  get $pagination(): FieldPaginationValue {
    return this.normalizePaginationValue(this.modelValue.value);
  }

  get $paginationItemsPerPageOptions(): number[] {
    const currentLimit = this.$pagination.limit;
    const configured = this.params.value.itemsPerPageOptions || [5, 10, 20, 50, 100];
    return Array.from(new Set([...configured, currentLimit]
      .map((value) => Math.trunc(Number(value)))
      .filter((value) => value > 0)))
      .sort((left, right) => left - right);
  }

  async setPagination(value: Partial<FieldPaginationValue>, options: FieldPaginationSetOptions = {}): Promise<FieldPaginationValue> {
    const previousValue = this.$pagination;
    const reason = options.reason || 'programmatic';
    const nextValue = updateFieldPaginationValue(previousValue, value, reason);

    if (
      nextValue.page === previousValue.page
      && nextValue.limit === previousValue.limit
      && nextValue.total === previousValue.total
    ) {
      return previousValue;
    }

    if (options.notify) {
      this.setModelValueAndSync(nextValue, options.origin || 'programmatic');
    } else {
      this.setModelValueFromMaster(nextValue);
      if (this.$master && this.params.value.storage) {
        this.$master.$set(this.params.value.storage, nextValue);
      }
      if (this.options.modifies) {
        this.options.modifies.value = nextValue;
      }
    }

    if (options.notify) {
      const event = this.paginationEvent(nextValue, previousValue, reason);
      if (this.options.paginationChanged) {
        await this.options.paginationChanged(this, event);
      }
      this.handleOn('paginationChanged', event);

      if (reason === 'page') {
        if (this.options.pageChanged) {
          await this.options.pageChanged(this, event);
        }
        this.handleOn('pageChanged', event);
      } else if (reason === 'limit') {
        if (this.options.itemsPerPageChanged) {
          await this.options.itemsPerPageChanged(this, event);
        }
        this.handleOn('itemsPerPageChanged', event);
      }
    }

    return nextValue;
  }

  private selectionValuesEqual(left: any, right: any) {
    if ((left === undefined || left === null) && (right === undefined || right === null)) {
      return true;
    }

    const normalizedLeft = this.params.value.multiple && (left === undefined || left === null) ? [] : left;
    const normalizedRight = this.params.value.multiple && (right === undefined || right === null) ? [] : right;

    if (Array.isArray(normalizedLeft) || Array.isArray(normalizedRight)) {
      if (!Array.isArray(normalizedLeft) || !Array.isArray(normalizedRight) || normalizedLeft.length !== normalizedRight.length) {
        return false;
      }

      return normalizedLeft.every((item, index) => this.autocompleteValuesEqual(item, normalizedRight[index]));
    }

    return this.autocompleteValuesEqual(normalizedLeft, normalizedRight);
  }

  private modelValuesEqual(left: any, right: any) {
    if (this.params.value.type === 'select' || this.params.value.type === 'autocomplete') {
      return this.selectionValuesEqual(left, right);
    }

    if (this.params.value.type === 'pagination') {
      const leftMissing = left === undefined || left === null;
      const rightMissing = right === undefined || right === null;
      if (leftMissing || rightMissing) {
        return leftMissing && rightMissing;
      }
      const normalizedLeft = this.normalizePaginationValue(left);
      const normalizedRight = this.normalizePaginationValue(right);
      return normalizedLeft.page === normalizedRight.page
        && normalizedLeft.limit === normalizedRight.limit
        && normalizedLeft.total === normalizedRight.total;
    }

    return this.isEqual(left, right);
  }

  private modelBinding() {
    return {
      modelValue: this.modelValue.value,
      "onUpdate:modelValue": (value: any) => {
        if (
          (this.params.value.type === 'select' || this.params.value.type === 'autocomplete')
          && this.selectionValuesEqual(this.modelValue.value, value)
        ) {
          return;
        }
        this.modelValue.value = value;
      }
    }
  }

  private componentOptions() {
    return this.params.value.options || {};
  }

  private inputIconProps() {
    return this.params.value.icon ? { prependInnerIcon: this.params.value.icon } : {};
  }

  private mediaFieldType(): 'image'|'document'|'file-upload'|undefined {
    const type = this.params.value.type;
    if (type === 'image' || type === 'document' || type === 'file-upload') {
      return type;
    }
    return undefined;
  }

  private isMediaField() {
    return !!this.mediaFieldType();
  }

  private isAssetMode() {
    return this.isMediaField() && this.params.value.assetMode === true && !!this.assetAdapter();
  }

  private assetAdapter() {
    return this.params.value.assetAdapter || Field.defaultParams.assetAdapter;
  }

  private assetIdField() {
    return this.params.value.assetIdField || 'id';
  }

  private assetPreviewField() {
    return this.params.value.assetPreviewField || 'previewUrl';
  }

  private assetDownloadField() {
    return this.params.value.assetDownloadField || 'downloadUrl';
  }

  private assetNameField() {
    return this.params.value.assetNameField || 'name';
  }

  private assetMimeTypeField() {
    return this.params.value.assetMimeTypeField || 'mimeType';
  }

  private assetSizeField() {
    return this.params.value.assetSizeField || 'size';
  }

  private resolvedUploadType(): FieldUploadType {
    return this.params.value.uploadType || 'base64';
  }

  private normalizeFiles(files?: File[] | FileList | null) {
    if (!files) {
      return [];
    }

    if (Array.isArray(files)) {
      return files.filter((file): file is File => file instanceof File);
    }

    if (files instanceof File) {
      return [files];
    }

    return Array.from(files);
  }

  private normalizeStoredAssetIds(value: any): string[] {
    if (value === undefined || value === null || value === '') {
      return [];
    }

    const values = Array.isArray(value) ? value : [value];
    return values
      .map((item) => item === undefined || item === null ? undefined : String(item))
      .filter((item): item is string => !!item && item !== '');
  }

  private assetValueFromRecords(records: AssetRecord[]) {
    const ids = records
      .map((record) => nestedProperty.get(record, this.assetIdField()))
      .filter((value) => value !== undefined && value !== null && value !== '');

    if (this.params.value.multiple) {
      return ids;
    }

    return ids[0];
  }

  private buildAssetRecordMetadata(record: AssetRecord) {
    const name = nestedProperty.get(record, this.assetNameField()) || this.$uiText('ve.field.assetLabel', 'Asset');
    const mimeType = nestedProperty.get(record, this.assetMimeTypeField()) || '';
    const size = nestedProperty.get(record, this.assetSizeField());
    const previewUrl = nestedProperty.get(record, this.assetPreviewField());
    const downloadUrl = nestedProperty.get(record, this.assetDownloadField());

    return {
      key: String(nestedProperty.get(record, this.assetIdField()) || name),
      label: String(name),
      mimeType: mimeType ? String(mimeType) : '',
      size: typeof size === 'number' ? size : undefined,
      previewUrl: previewUrl ? String(previewUrl) : undefined,
      downloadUrl: downloadUrl ? String(downloadUrl) : (previewUrl ? String(previewUrl) : undefined),
      raw: record,
      uploaded: true,
      pending: false,
    };
  }

  private async hydrateAssetRecords(records: AssetRecord[]) {
    const adapter = this.assetAdapter();
    if (!adapter || records.length === 0) {
      return records;
    }

    return Promise.all(records.map(async (record) => {
      const nextRecord = { ...record };

      if (adapter.getPreviewUrl && !nestedProperty.get(nextRecord, this.assetPreviewField())) {
        const previewUrl = await adapter.getPreviewUrl(record, this);
        if (previewUrl) {
          nestedProperty.set(nextRecord, this.assetPreviewField(), previewUrl);
        }
      }

      if (adapter.getDownloadUrl && !nestedProperty.get(nextRecord, this.assetDownloadField())) {
        const downloadUrl = await adapter.getDownloadUrl(record, this);
        if (downloadUrl) {
          nestedProperty.set(nextRecord, this.assetDownloadField(), downloadUrl);
        }
      }

      return nextRecord;
    }));
  }

  private buildSelectedFileMetadata(file: File, index: number) {
    const name = file?.name || `File ${index + 1}`;
    return {
      key: `${name}-${index}`,
      label: name,
      mimeType: file?.type || '',
      size: file?.size,
      previewUrl: undefined,
      downloadUrl: undefined,
      raw: file,
      uploaded: false,
      pending: true,
    };
  }

  private directStoredMediaItems() {
    const value = this.modelValue.value;
    if (value === undefined || value === null || value === '') {
      return [];
    }

    const values = Array.isArray(value) ? value : [value];
    return values.map((item: any, index: number) => {
      if (item instanceof File) {
        return this.buildSelectedFileMetadata(item, index);
      }

      if (item && typeof item === 'object' && typeof item.name === 'string') {
        return {
          key: `${item.name}-${index}`,
          label: item.name,
          mimeType: item.type || item.mimeType || '',
          size: item.size,
          previewUrl: undefined,
          downloadUrl: undefined,
          raw: item,
          uploaded: false,
          pending: false,
        };
      }

      const str = String(item || '');
      const isImage = str.includes('image');
      return {
        key: `${index}-${str.slice(0, 24)}`,
        label: values.length > 1 ? this.$uiText('ve.field.fileIndexedLabel', `File ${index + 1}`, { index: index + 1 }) : (this.resolvedLabel() || this.$uiText('ve.field.fileLabel', 'File')),
        mimeType: isImage ? 'image/*' : '',
        size: undefined,
        previewUrl: str,
        downloadUrl: str,
        raw: item,
        uploaded: true,
        pending: false,
      };
    });
  }

  mediaItems() {
    if (this.isAssetMode()) {
      if (this.selectedFiles.value.length > 0 && this.assetUploadPending.value) {
        if (this.params.value.multiple) {
          return [
            ...this.resolvedAssets.value.map((record) => this.buildAssetRecordMetadata(record)),
            ...this.selectedFiles.value.map((file, index) => this.buildSelectedFileMetadata(file, index)),
          ];
        }
        return this.selectedFiles.value.map((file, index) => this.buildSelectedFileMetadata(file, index));
      }

      return this.resolvedAssets.value.map((record) => this.buildAssetRecordMetadata(record));
    }

    return this.directStoredMediaItems();
  }

  private setSelectedFiles(files?: File[] | FileList | null) {
    this.selectedFiles.value = this.normalizeFiles(files);
  }

  private mergeDirectMediaValues(nextValue: any) {
    if (!this.params.value.multiple) {
      return nextValue;
    }

    const current = this.modelValue.value;
    const currentItems = current === undefined || current === null || current === ''
      ? []
      : (Array.isArray(current) ? [...current] : [current]);
    const nextItems = nextValue === undefined || nextValue === null || nextValue === ''
      ? []
      : (Array.isArray(nextValue) ? nextValue : [nextValue]);

    return currentItems.concat(nextItems);
  }

  async $clearSelectedFiles() {
    this.clearSelectedFiles();
  }

  private clearSelectedFiles() {
    this.selectedFiles.value = [];
    this.assetUploadPending.value = false;
  }

  private async emitFileSelected(files?: File[] | FileList | null) {
    const normalizedFiles = files ? this.normalizeFiles(files) : this.$selectedFiles;
    const payload: FieldSelectedFilePayload = {
      files: normalizedFiles,
      file: normalizedFiles[0],
      multiple: !!this.params.value.multiple,
      uploadType: this.resolvedUploadType(),
    };

    if (this.options.fileSelected) {
      await this.options.fileSelected(this, payload);
    }
    this.handleOn('fileSelected', payload);
  }

  private async emitAssetUploaded(records: AssetRecord[]) {
    if (this.options.assetUploaded) {
      await this.options.assetUploaded(this, records);
    }
    this.handleOn('assetUploaded', records);
  }

  private async emitAssetsResolved(records: AssetRecord[]) {
    if (this.options.assetsResolved) {
      await this.options.assetsResolved(this, records);
    }
    this.handleOn('assetsResolved', records);
  }

  private async emitAssetRemoved(records: AssetRecord[]) {
    if (this.options.assetRemoved) {
      await this.options.assetRemoved(this, records);
    }
    this.handleOn('assetRemoved', records);
  }

  private async removeAssets(records: AssetRecord[]) {
    if (!records.length || !this.isAssetMode() || this.params.value.removeAssetOnClear !== true) {
      return;
    }

    const adapter = this.assetAdapter();
    if (!adapter?.remove) {
      return;
    }

    await adapter.remove(records, this);
    await this.emitAssetRemoved(records);
  }

  private buildFileMetadata(file: File): UploadedFileMetadata {
    const fileName = file?.name || '';
    const parts = fileName.split('.');
    const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : undefined;

    return {
      name: fileName,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      extension,
    };
  }

  private normalizeFilesInput(value: any): File[] {
    return this.normalizeFiles(value).filter((item) => item instanceof File);
  }

  private async validateSelectedFiles(files: File[]) {
    const validFiles: File[] = [];
    const maxSize = Number(this.params.value.fileMaxSize || 0);

    for (const file of files) {
      if (maxSize > 0 && file.size > (maxSize * 1024)) {
        Dialogs.$error(this.$uiText(
          've.validation.fileMaxSize',
          '{file} exceeds the maximum allowed size of {max} KB.',
          { file: file.name, max: maxSize },
        ));
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  }

  private async createDirectUploadValue(files: File[]) {
    const mediaType = this.mediaFieldType();

    if (mediaType === 'image' || mediaType === 'document') {
      const data = [];
      for (const file of files) {
        data.push(await fileToBase64(file, this.params.value.fileMaxSize || 500));
      }
      return this.params.value.multiple ? data : data[0];
    }

    if (this.resolvedUploadType() === 'file') {
      return this.params.value.multiple ? files : files[0];
    }

    if (this.resolvedUploadType() === 'metadata') {
      const metadata = files.map((file) => this.buildFileMetadata(file));
      return this.params.value.multiple ? metadata : metadata[0];
    }

    const encoded = [];
    for (const file of files) {
      encoded.push(await fileToBase64(file, this.params.value.fileMaxSize || 500));
    }

    return this.params.value.multiple ? encoded : encoded[0];
  }

  async $uploadAssets() {
    if (!this.isAssetMode()) {
      return [];
    }

    const adapter = this.assetAdapter();
    const files = this.$selectedFiles;
    const fieldType = this.mediaFieldType();

    if (!adapter || !fieldType || files.length === 0) {
      return [];
    }

    this.assetUploading.value = true;
    try {
      const existingRecords = this.params.value.multiple ? [...this.resolvedAssets.value] : [];
      const records = await adapter.upload({
        files,
        file: files[0],
        multiple: !!this.params.value.multiple,
        fieldType,
      }, this);

      const safeRecords = await this.hydrateAssetRecords(Array.isArray(records) ? records : []);
      const nextRecords = this.params.value.multiple ? existingRecords.concat(safeRecords) : safeRecords;
      this.resolvedAssets.value = nextRecords;
      this.modelValue.value = this.assetValueFromRecords(nextRecords);
      this.clearSelectedFiles();
      await this.emitAssetUploaded(safeRecords);
      return safeRecords;
    } catch (error: any) {
      Dialogs.$error(error?.message || this.$uiText('ve.field.assetUploadFailed', 'Failed to upload asset files.'));
      throw error;
    } finally {
      this.assetUploading.value = false;
    }
  }

  async handleSelectedFiles(files?: File[] | FileList | null) {
    const normalized = await this.validateSelectedFiles(this.normalizeFiles(files));

    if (normalized.length === 0) {
      if (this.isAssetMode()) {
        await this.$clearSelectedFiles();
      } else {
        this.clearSelectedFiles();
        this.modelValue.value = this.params.value.multiple ? [] : null;
      }
      return;
    }

    if (this.isAssetMode()) {
      const mergedFiles = this.params.value.multiple && this.assetUploadPending.value
        ? [...this.selectedFiles.value, ...normalized]
        : normalized;
      this.setSelectedFiles(mergedFiles);
      this.assetUploadPending.value = true;
      await this.emitFileSelected(mergedFiles);
      if (this.params.value.autoUpload !== false) {
        await this.$uploadAssets();
      }
      return;
    }

    try {
      const nextValue = await this.createDirectUploadValue(normalized);
      this.setSelectedFiles(normalized);
      this.modelValue.value = this.mergeDirectMediaValues(nextValue);
      await this.emitFileSelected(normalized);
    } catch (error: any) {
      Dialogs.$error(error?.message || this.$uiText('ve.field.fileProcessFailed', 'Failed to process selected files.'));
    }
  }

  private async syncResolvedAssets() {
    if (!this.isAssetMode()) {
      return;
    }

    const adapter = this.assetAdapter();
    const ids = this.normalizeStoredAssetIds(this.modelValue.value);
    const fieldType = this.mediaFieldType();

    if (!adapter || !fieldType) {
      this.resolvedAssets.value = [];
      return;
    }

    if (ids.length === 0) {
      this.resolvedAssets.value = [];
      return;
    }

    const requestId = this.assetResolveRequestId.value + 1;
    this.assetResolveRequestId.value = requestId;

    try {
      const records = await adapter.resolve({
        ids,
        multiple: !!this.params.value.multiple,
        fieldType,
      }, this);

      if (requestId !== this.assetResolveRequestId.value) {
        return;
      }

      this.resolvedAssets.value = await this.hydrateAssetRecords(Array.isArray(records) ? records : []);
      await this.emitAssetsResolved(this.resolvedAssets.value);
    } catch (error: any) {
      if (requestId === this.assetResolveRequestId.value) {
        this.resolvedAssets.value = [];
      }
      Dialogs.$error(error?.message || this.$uiText('ve.field.assetResolveFailed', 'Failed to resolve asset references.'));
    }
  }

  private async clearMediaValue() {
    const resolved = this.$resolvedAssets;
    this.modelValue.value = this.params.value.multiple ? [] : null;
    this.resolvedAssets.value = [];
    await this.$clearSelectedFiles();
    await this.removeAssets(resolved);
  }

  private async clearMediaItem(index: number) {
    if (this.isAssetMode()) {
      if (this.assetUploadPending.value && this.selectedFiles.value.length > 0) {
        if (this.params.value.multiple && this.resolvedAssets.value.length > 0) {
          if (index < this.resolvedAssets.value.length) {
            const records = [...this.resolvedAssets.value];
            const [removed] = records.splice(index, 1);
            this.resolvedAssets.value = records;
            this.modelValue.value = this.assetValueFromRecords(records);
            if (removed) {
              await this.removeAssets([removed]);
            }
            return;
          }

          const pendingIndex = index - this.resolvedAssets.value.length;
          const files = [...this.selectedFiles.value];
          files.splice(pendingIndex, 1);
          this.setSelectedFiles(files);
          this.assetUploadPending.value = files.length > 0;
          return;
        }

        const files = [...this.selectedFiles.value];
        files.splice(index, 1);
        this.setSelectedFiles(files);
        this.assetUploadPending.value = files.length > 0;
        return;
      }

      const records = [...this.resolvedAssets.value];
      const [removed] = records.splice(index, 1);
      this.resolvedAssets.value = records;
      this.modelValue.value = this.assetValueFromRecords(records);
      if (removed) {
        await this.removeAssets([removed]);
      }
      return;
    }

    if (this.params.value.multiple) {
      const items = Array.isArray(this.modelValue.value) ? [...this.modelValue.value] : [];
      items.splice(index, 1);
      this.modelValue.value = items;
    } else {
      this.modelValue.value = null;
    }
  }

  private async openMediaItem(item: any) {
    if (!item) {
      return;
    }

    if (item.previewUrl || item.downloadUrl) {
      this.showFullscreen(item.previewUrl || item.downloadUrl);
      return;
    }

    if (typeof item.raw === 'string') {
      this.showFullscreen(item.raw);
      return;
    }

    if (item.raw instanceof File) {
      const objectUrl = URL.createObjectURL(item.raw);
      if (item.raw.type.startsWith('image/')) {
        void Dialogs.$imagePreview(objectUrl, {
          title: item.label || this.params.value.label,
          fullscreen: this.params.value.previewFullscreen !== false,
        });
        return;
      }

      if (item.raw.type === 'application/pdf') {
        void Dialogs.$documentPreview(objectUrl, {
          title: item.label || this.params.value.label,
          fullscreen: this.params.value.previewFullscreen !== false,
        });
        return;
      }

      void Dialogs.$iframe({
        src: objectUrl,
        title: item.label || this.params.value.label,
        fullscreen: this.params.value.previewFullscreen !== false,
        downloadUrl: objectUrl,
      });
    }
  }

  private async onOtpFinished(value: string) {
    if (this.options.finished) {
      await this.options.finished(this, value);
    }
    this.handleOn('finish', value);
  }

  private async onFileUploadChanged(value: any) {
    const files = this.normalizeFilesInput(value);

    if (this.isAssetMode()) {
      await this.handleSelectedFiles(files);
      return;
    }

    this.fileUploadLoading.value = true;
    try {
      await this.handleSelectedFiles(files);
    } finally {
      this.fileUploadLoading.value = false;
    }
  }

  private eventValue(value: any) {
    return value === undefined ? undefined : this.postprocess(value);
  }

  private notifyChanged(context: FieldValueContext) {
    if (this.options.changed) this.options.changed(this, context);
    this.handleOn('changed', context.value, context);
  }

  private notifyInitialized(context: FieldValueContext, force = false) {
    if (this.initialized && !force) {
      return;
    }

    this.initialized = true;
    const version = ++this.initializationVersion;
    const dispatch = async () => {
      await nextTick();
      if (version !== this.initializationVersion) {
        return;
      }
      if (this.options.initialized) {
        await this.options.initialized(this, context);
      }
      if (version !== this.initializationVersion) {
        return;
      }
      this.handleOn('initialized', context);
    };

    void dispatch();
  }

  valueChanged(newValue?: any, origin: FieldValueOrigin = 'programmatic', previousValue?: any) {
    if (this.changing) {
      return;
    }

    this.changing = true;
    try {
      const value = this.postprocess(newValue !== undefined ? newValue : this.modelValue.value);
      void this.renderLatex(value);
      if (this.$master && this.params.value.storage) {
        this.$master.$set(this.params.value.storage, value);
      }
      if (this.options.modifies) {
        this.options.modifies.value = value;
      }
      this.notifyChanged({
        origin,
        value,
        previousValue: this.eventValue(previousValue),
      });
    } finally {
      this.changing = false;
    }
  }

  private masterChangeAffectsValue(event: any) {
    const storage = this.params.value.storage;
    const key = event?.key;
    if (!storage || typeof key !== 'string' || key.length === 0) {
      return false;
    }

    return key === storage || key.startsWith(`${storage}.`) || storage.startsWith(`${key}.`);
  }

  attachEventListeners() {
    if (this.$master) {
      this.$master.on('changed', (event: any) => this.synchronizeValue({
        notifyChanged: this.masterChangeAffectsValue(event),
        origin: 'programmatic',
      }), this.$id);
      this.$master.on('loaded', () => this.updateValue(), this.$id);
      this.$master.on('reset', () => {
        this.synchronizeValue({ initialize: true, origin: 'master' }, true);
      }, this.$id);
    }
  }

  removeEventListeners() {
    if (this.$master) {
      this.$master.clearListeners(this.$id);
    }
  }

  private hasDefaultValue() {
    return this.params.value.default !== undefined || !!this.options.default;
  }

  private resolveDefaultValue() {
    if (this.params.value.default !== undefined) {
      return this.params.value.default;
    }

    return this.options.default ? this.options.default(this) : undefined;
  }

  updateValue() {
    this.synchronizeValue();
  }

  private synchronizeValue(options: FieldUpdateOptions = {}, forceInitialization = false) {
    if (!this.changing) {
      const previousValue = this.modelValue.value;
      let currentValue = previousValue;
      let applyingDefault = false;
      let modelChanged = false;
      this.changing = true;
      try {
        if (this.$master && this.params.value.storage) {
          const storedValue = this.$master.$get(this.params.value.storage);
          applyingDefault = storedValue === undefined && this.hasDefaultValue();
          currentValue = this.preprocess(applyingDefault ? this.resolveDefaultValue() : storedValue);

          if (this.params.value.type === 'collection' && currentValue) {
            currentValue = this.attachIndex(currentValue || []);
            if (!applyingDefault) {
              this.$master.$set(this.params.value.storage, currentValue);
            }
          }

          if (applyingDefault && currentValue !== undefined) {
            this.$master.$set(this.params.value.storage, this.postprocess(currentValue));
          }

          modelChanged = !this.modelValuesEqual(this.modelValue.value, currentValue);
          if (modelChanged) {
            this.setModelValueFromMaster(currentValue);
            if (this.isMediaField()) {
              this.clearSelectedFiles();
            }
            if (this.options.modifies) {
              this.options.modifies.value = currentValue;
            }
          }
        } else if (this.hasDefaultValue() && this.modelValue.value === undefined) {
          applyingDefault = true;
          currentValue = this.preprocess(this.resolveDefaultValue());
          modelChanged = !this.modelValuesEqual(this.modelValue.value, currentValue);
          if (modelChanged) {
            this.setModelValueFromMaster(currentValue);
            if (this.isMediaField()) {
              this.clearSelectedFiles();
            }
            if (this.options.modifies) {
              this.options.modifies.value = currentValue;
            }
          }
        }
      } finally {
        this.changing = false;
      }

      const context: FieldValueContext = {
        origin: applyingDefault ? 'default' : (options.origin || 'master'),
        value: this.eventValue(currentValue),
        previousValue: this.eventValue(previousValue),
      };

      if (options.initialize) {
        this.notifyInitialized(context, forceInitialization);
      } else if (options.notifyChanged && modelChanged) {
        this.notifyChanged(context);
      }
    }
  }

  private renderMathInHtml(html: string, output: 'htmlAndMathml'|'html'|'mathml' = 'htmlAndMathml'): string {
    // Render display math first ($$...$$)
    if(!html) return html

    html = html.replace(
      /<(p|div)>\s*\$\$\s*<\/\1>([\s\S]*?)<(p|div)>\s*\$\$\s*<\/\3>/gi,
      (_match, _startTag, math) => {
        const normalizedMath = String(math)
          .replace(/<\/(p|div)>\s*<(p|div)>/gi, '\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/?(p|div)>/gi, '')
          .replace(/&nbsp;/gi, ' ')
          .trim();

        return `$$${normalizedMath}$$`;
      },
    );
    
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { displayMode: true, output });
      } catch (err) {
        return `<span class="katex-error">${math}</span>`;
      }
    });

    // Render inline math ($...$)
    html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
      try {
        return katex.renderToString(math, { displayMode: false, output });
      } catch (err) {
        return `<span class="katex-error">${math}</span>`;
      }
    });

    return html;
  }

  private async renderLatex(value: any) {
    if (this.params.value.type === 'code' && this.params.value.lang === 'latex') {
      try {
        // webtex embeds a WASM syntax highlighter. Loading it at module startup
        // breaks every application page under a strict CSP even when no LaTeX
        // field exists, so keep the optional capability behind its field path.
        const webtex = await import('webtex');
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
    void Dialogs.$iframe({
      srcdoc: html,
      title: this.$text(this.params.value.label, this.$uiText('ve.field.preview', 'Preview')),
      fullscreen: true,
    });
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

    if (this.params.value.type === 'pagination') {
      return this.normalizePaginationValue(value);
    }
    
    if (this.params.value.type === "date") {
      if (Array.isArray(value)) {
        return value.map((v) => this.preprocessDateValue(v));
      }
      return this.preprocessDateValue(value);
    }
    
    if (this.params.value.type === "time") {
      if (Array.isArray(value)) {
        return value.map((v) => this.preprocessTimeValue(v));
      }
      return this.preprocessTimeValue(value);
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

    if (this.params.value.type === 'pagination') {
      return this.normalizePaginationValue(value);
    }
    
    if (this.params.value.type === "date") {
      if (Array.isArray(value)) {
        return value.map((v) => this.postprocessDateValue(v));
      }
      return this.postprocessDateValue(value);
    }
    
    if (this.params.value.type === "time") {
      if (Array.isArray(value)) {
        return value.map((v) => this.postprocessTimeValue(v));
      }
      return this.postprocessTimeValue(value);
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

  private resolvedDateFormat(): FieldDateFormat {
    return this.params.value.dateFormat || 'timestamp';
  }

  private resolvedTimeFormat(): FieldTimeFormat {
    return this.params.value.timeFormat || 'timestamp';
  }

  private parseCompactDateValue(value: any) {
    const compact = String(value ?? '').trim();
    if (!/^\d{8}$/.test(compact)) {
      return new SimpleDate(value);
    }

    const year = Number(compact.slice(0, 4));
    const month = Number(compact.slice(4, 6));
    const day = Number(compact.slice(6, 8));

    return new SimpleDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  private preprocessDateValue(value: any) {
    if (value === undefined || value === null || value === '') {
      return value;
    }

    if (this.resolvedDateFormat() === 'YYYYMMDD') {
      return this.parseCompactDateValue(value).toString();
    }

    return new SimpleDate(value).toString();
  }

  private preprocessTimeValue(value: any) {
    if (value === undefined || value === null || value === '') {
      return value;
    }

    if (this.resolvedTimeFormat() === 'HHMM') {
      const compact = String(value ?? '').trim();
      if (/^\d{3,4}$/.test(compact)) {
        const padded = compact.padStart(4, '0');
        return new SimpleTime(`${padded.slice(0, 2)}:${padded.slice(2, 4)}`).toString();
      }
    }

    return new SimpleTime(value).toString();
  }

  private postprocessDateValue(value: any) {
    if (value === undefined || value === null || value === '') {
      return value;
    }

    const date = new SimpleDate(value);

    switch (this.resolvedDateFormat()) {
      case 'YYYY-MM-DD':
        return date.toString();
      case 'YYYYMMDD':
        return date.toCompactNumber();
      case 'timestamp':
        return date.toNumber();
      default:
        return date.toString();
    }
  }

  private postprocessTimeValue(value: any) {
    if (value === undefined || value === null || value === '') {
      return value;
    }

    const time = new SimpleTime(value);

    switch (this.resolvedTimeFormat()) {
      case 'HH:mm':
        return time.toString();
      case 'HHMM':
        return time.toCompactNumber();
      case 'timestamp':
        return time.toNumber();
      default:
        return time.toNumber();
    }
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

  private isServerAutocomplete() {
    return this.params.value.type === 'autocomplete' &&
      this.params.value.serverSearch === true &&
      !!this.options.autocompleteSearch;
  }

  private autocompleteMinSearchChars() {
    return typeof this.params.value.minSearchChars === 'number' ? this.params.value.minSearchChars : 2;
  }

  private autocompleteDebounceMs() {
    return typeof this.params.value.searchDebounceMs === 'number' ? this.params.value.searchDebounceMs : 300;
  }

  private autocompleteLoadMoreMode() {
    return this.params.value.autocompleteLoadMore === 'button' ? 'button' : 'scroll';
  }

  private autocompletePageSize() {
    return typeof this.params.value.searchPageSize === 'number' ? this.params.value.searchPageSize : 25;
  }

  private autocompleteMinScrollableItems() {
    return Math.max(this.autocompletePageSize(), 20);
  }

  private findAutocompleteListElement() {
    if (typeof document === 'undefined') {
      return undefined;
    }

    return document.querySelector(`.${this.autocompleteMenuClass} .v-list`) as HTMLElement | null | undefined;
  }

  private shouldCacheAutocompleteResults() {
    return this.params.value.cacheSearchResults !== false;
  }

  private shouldKeepSelectedAutocompleteItems() {
    return this.params.value.keepSelectedItemsInOptions !== false;
  }

  private resolveAutocompleteHasMore(normalized: { items: any[]; total?: number; page?: number; hasMore?: boolean }, page: number) {
    const resolvedPage = normalized.page || page;
    if (normalized.hasMore === true) {
      return true;
    }

    if (normalized.hasMore === false) {
      return false;
    }

    return (
      (typeof normalized.total === 'number' && ((resolvedPage * this.autocompletePageSize()) < normalized.total))
      || ((normalized.items || []).length >= this.autocompletePageSize())
    );
  }

  private normalizeAutocompleteItems(value: any): any[] {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value.filter((item) => item !== undefined && item !== null) : [value];
  }

  private normalizeAutocompleteSearchResult(result: any): { items: any[]; total?: number; page?: number; hasMore?: boolean } {
    if (Array.isArray(result)) {
      return { items: result };
    }

    if (result?.data && Array.isArray(result?.data)) {
      return {
        items: result.data,
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
      };
    }

    if (result?.items && Array.isArray(result?.items)) {
      return {
        items: result.items,
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
      };
    }

    return { items: [] };
  }

  private autocompleteItemKey(item: any, index: number) {
    if (item && typeof item === 'object') {
      const itemId = Master.getItemId(item, this.params.value.itemValue || this.params.value.idField);
      if (itemId || itemId === 0) {
        return `id:${itemId.toString()}`;
      }
    }

    if (item || item === 0 || item === '') {
      return `value:${String(item)}`;
    }

    return `index:${index}`;
  }

  private mergeAutocompleteItems(baseItems: any[], extraItems: any[]) {
    const merged: any[] = [];
    const seen = new Set<string>();

    [...(baseItems || []), ...(extraItems || [])].forEach((item, index) => {
      if (item === undefined || item === null) {
        return;
      }

      const key = this.autocompleteItemKey(item, index);
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      merged.push(item);
    });

    return merged;
  }

  private selectedAutocompleteObjects() {
    if (!this.params.value.returnObject) {
      return [];
    }

    return this.normalizeAutocompleteItems(this.modelValue.value).filter((item: any) => item && typeof item === 'object');
  }

  private selectedAutocompleteIds() {
    if (this.params.value.returnObject) {
      return [];
    }

    return this.normalizeAutocompleteItems(this.modelValue.value).filter((item: any) => item || item === 0 || item === '');
  }

  private autocompleteItemMatchesValue(item: any, value: any) {
    if (item && typeof item === 'object') {
      return Master.matchesItemId(item, value, this.params.value.itemValue || this.params.value.idField);
    }

    return String(item) === String(value);
  }

  private filterAutocompleteItemsByValues(items: any[], values: any[]) {
    if (!Array.isArray(items) || values.length === 0) {
      return [];
    }

    return items.filter((item: any) => values.some((value) => this.autocompleteItemMatchesValue(item, value)));
  }

  private hydratedAutocompleteSelection() {
    if (this.params.value.returnObject) {
      return this.selectedAutocompleteObjects();
    }

    const ids = this.selectedAutocompleteIds();
    if (ids.length === 0) {
      return [];
    }

    return this.filterAutocompleteItemsByValues(this.autocompleteResolvedItems.value || [], ids);
  }

  private retainSelectedAutocompleteItems(items: any[]) {
    if (!this.shouldKeepSelectedAutocompleteItems()) {
      return items;
    }

    return this.mergeAutocompleteItems(items, this.hydratedAutocompleteSelection());
  }

  private refreshAutocompleteDisplayItems(items?: any[]) {
    this.selectItems.value = this.retainSelectedAutocompleteItems(items || this.autocompleteResultItems.value || []);
  }

  private updateResolvedAutocompleteItems(items: any[]) {
    this.autocompleteResolvedItems.value = this.mergeAutocompleteItems([], items || []);
  }

  private autocompleteDisplayItemForValue(value: any) {
    if (value && typeof value === 'object') {
      return value;
    }

    const candidates = [
      ...(this.autocompleteResolvedItems.value || []),
      ...(this.autocompleteResultItems.value || []),
      ...(this.selectItems.value || []),
    ];

    return candidates.find((item: any) => this.autocompleteItemMatchesValue(item, value));
  }

  private normalizeAutocompleteComparisonValue(value: any) {
    if (value && typeof value === 'object') {
      if ('raw' in value && value.raw !== undefined) {
        return value.raw;
      }

      if ('value' in value && value.value !== undefined) {
        return value.value;
      }
    }

    return value;
  }

  private autocompleteValuesEqual(left: any, right: any) {
    const normalizedLeft = this.normalizeAutocompleteComparisonValue(left);
    const normalizedRight = this.normalizeAutocompleteComparisonValue(right);

    if (normalizedLeft === normalizedRight) {
      return true;
    }

    const itemField = this.params.value.itemValue || this.params.value.idField;
    const leftId = normalizedLeft && typeof normalizedLeft === 'object'
      ? Master.getItemId(normalizedLeft, itemField)
      : normalizedLeft;
    const rightId = normalizedRight && typeof normalizedRight === 'object'
      ? Master.getItemId(normalizedRight, itemField)
      : normalizedRight;

    if ((leftId || leftId === 0) && (rightId || rightId === 0)) {
      return String(leftId) === String(rightId);
    }

    return false;
  }

  private autocompleteDisplayTitle(item: any) {
    const fallback = item?.title ?? item?.value ?? item?.raw ?? '';
    const resolvedItem = this.autocompleteDisplayItemForValue(item?.raw ?? item?.value ?? item);

    if (!resolvedItem || typeof resolvedItem !== 'object') {
      return String(resolvedItem ?? fallback ?? '');
    }

    const titleField = this.params.value.itemTitle || 'name';
    const title = nestedProperty.get(resolvedItem, titleField);
    return String(title ?? fallback ?? '');
  }

  private autocompleteCacheKey(search: string, page: number) {
    return `${page}:${(search || '').trim().toLocaleLowerCase()}`;
  }

  private async fetchAutocompleteSearchPage(trimmedSearch: string, page: number) {
    const cacheKey = this.autocompleteCacheKey(trimmedSearch, page);

    if (this.shouldCacheAutocompleteResults() && this.autocompleteCache.has(cacheKey)) {
      return this.autocompleteCache.get(cacheKey)!;
    }

    const result = await this.options.autocompleteSearch?.(this, trimmedSearch, {
      page,
      limit: this.autocompletePageSize(),
      signal: this.autocompleteAbortController?.signal,
    });
    const normalized = this.normalizeAutocompleteSearchResult(result);

    if (this.shouldCacheAutocompleteResults()) {
      this.autocompleteCache.set(cacheKey, normalized);
    }

    return normalized;
  }

  private async syncServerAutocompleteSelection() {
    if (!this.isServerAutocomplete()) {
      return;
    }

    const selectedObjects = this.selectedAutocompleteObjects();
    if (selectedObjects.length > 0) {
      this.updateResolvedAutocompleteItems(selectedObjects);
      if (this.shouldKeepSelectedAutocompleteItems()) {
        this.refreshAutocompleteDisplayItems();
      }
      return;
    }

    const ids = this.selectedAutocompleteIds();
    if (ids.length === 0) {
      this.updateResolvedAutocompleteItems([]);
      if (this.shouldKeepSelectedAutocompleteItems()) {
        this.refreshAutocompleteDisplayItems();
      }
      return;
    }

    const fromResults = this.filterAutocompleteItemsByValues(this.autocompleteResultItems.value || [], ids);
    const existingResolved = this.filterAutocompleteItemsByValues(this.autocompleteResolvedItems.value || [], ids);
    const mergedResolved = this.mergeAutocompleteItems(existingResolved, fromResults);

    if (mergedResolved.length >= ids.length) {
      this.updateResolvedAutocompleteItems(mergedResolved);
      if (this.shouldKeepSelectedAutocompleteItems()) {
        this.refreshAutocompleteDisplayItems();
      }
      return;
    }

    if (!this.options.autocompleteResolveValue) {
      this.updateResolvedAutocompleteItems(mergedResolved);
      if (this.shouldKeepSelectedAutocompleteItems()) {
        this.refreshAutocompleteDisplayItems();
      }
      return;
    }

    try {
      const resolved = await this.options.autocompleteResolveValue(this, this.params.value.multiple ? ids : ids[0], {
        signal: this.autocompleteAbortController?.signal,
      });
      const resolvedItems = this.normalizeAutocompleteItems(resolved);
      this.updateResolvedAutocompleteItems(this.mergeAutocompleteItems(mergedResolved, resolvedItems));
      if (this.shouldKeepSelectedAutocompleteItems()) {
        this.refreshAutocompleteDisplayItems();
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return;
      }
    }
  }

  private async applyServerAutocompleteSearch(search: string, page = 1, options?: { bypassMinChars?: boolean; append?: boolean }) {
    if (!this.isServerAutocomplete() || !this.options.autocompleteSearch) {
      return;
    }

    const trimmedSearch = (search || '').trim();
    const minChars = this.autocompleteMinSearchChars();
    if (!options?.bypassMinChars && trimmedSearch.length < minChars) {
      this.autocompleteLoaded.value = false;
      this.autocompleteTotal.value = undefined;
      this.autocompleteHasMore.value = false;
      this.autocompletePage.value = 1;
      this.autocompleteResultItems.value = [];
      this.refreshAutocompleteDisplayItems([]);
      return;
    }

    const requestId = this.autocompleteRequestId.value + 1;
    this.autocompleteRequestId.value = requestId;
    const isAppend = options?.append === true;
    if (isAppend) {
      this.autocompleteLoadingMore.value = true;
    } else {
      this.autocompleteLoading.value = true;
      this.autocompletePage.value = page;
    }

    if (this.autocompleteAbortController) {
      this.autocompleteAbortController.abort();
    }

    this.autocompleteAbortController = typeof AbortController !== 'undefined' ? new AbortController() : undefined;

    try {
      const previousCount = (this.autocompleteResultItems.value || []).length;
      let normalized = await this.fetchAutocompleteSearchPage(trimmedSearch, page);

      if (!isAppend && this.autocompleteLoadMoreMode() === 'scroll') {
        let collectedItems = this.mergeAutocompleteItems([], normalized.items || []);
        let currentPage = normalized.page || page;
        let hasMore = this.resolveAutocompleteHasMore(normalized, currentPage);

        while (hasMore && collectedItems.length < this.autocompleteMinScrollableItems()) {
          const nextPage = currentPage + 1;
          const nextNormalized = await this.fetchAutocompleteSearchPage(trimmedSearch, nextPage);

          if (requestId !== this.autocompleteRequestId.value) {
            return;
          }

          collectedItems = this.mergeAutocompleteItems(collectedItems, nextNormalized.items || []);
          normalized = {
            items: collectedItems,
            total: nextNormalized.total ?? normalized.total,
            page: nextNormalized.page || nextPage,
            hasMore: nextNormalized.hasMore,
          };
          currentPage = normalized.page || nextPage;
          hasMore = this.resolveAutocompleteHasMore(nextNormalized, currentPage);
        }
      }

      if (requestId !== this.autocompleteRequestId.value) {
        return;
      }

      const normalizedItems = this.mergeAutocompleteItems([], normalized.items || []);

      this.autocompleteLoaded.value = true;
      this.autocompleteTotal.value = normalized.total;
      this.autocompletePage.value = normalized.page || page;
      this.autocompleteHasMore.value = this.resolveAutocompleteHasMore(normalized, this.autocompletePage.value);
      this.autocompleteResultItems.value = isAppend
        ? this.mergeAutocompleteItems(this.autocompleteResultItems.value, normalizedItems)
        : normalizedItems;
      this.refreshAutocompleteDisplayItems(this.autocompleteResultItems.value);
      await this.syncServerAutocompleteSelection();
      await this.maybePrimeScrollableAutocompleteResults(previousCount, { append: isAppend });
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        return;
      }

      if (requestId !== this.autocompleteRequestId.value) {
        return;
      }

      this.autocompleteLoaded.value = true;
      this.autocompleteTotal.value = 0;
      this.autocompleteHasMore.value = false;
      if (!isAppend) {
        this.autocompleteResultItems.value = [];
      }
      this.refreshAutocompleteDisplayItems(this.autocompleteResultItems.value);
    } finally {
      if (requestId === this.autocompleteRequestId.value) {
        if (isAppend) {
          this.autocompleteLoadingMore.value = false;
        } else {
          this.autocompleteLoading.value = false;
        }
      }
    }
  }

  private scheduleServerAutocompleteSearch(search: string, options?: { immediate?: boolean; bypassMinChars?: boolean }) {
    this.autocompleteSearchText.value = search || '';

    if (this.autocompleteDebounceTimer) {
      clearTimeout(this.autocompleteDebounceTimer);
      this.autocompleteDebounceTimer = undefined;
    }

    if (options?.immediate) {
      void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, 1, {
        bypassMinChars: options.bypassMinChars,
      });
      return;
    }

    this.autocompleteDebounceTimer = setTimeout(() => {
      this.autocompleteDebounceTimer = undefined;
      void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, 1, {
        bypassMinChars: options?.bypassMinChars,
      });
    }, this.autocompleteDebounceMs());
  }

  private canLoadMoreAutocompleteResults() {
    return this.isServerAutocomplete()
      && this.autocompleteHasMore.value
      && !this.autocompleteLoading.value
      && !this.autocompleteLoadingMore.value;
  }

  private loadMoreAutocompleteResults() {
    if (!this.canLoadMoreAutocompleteResults()) {
      return;
    }

    void this.applyServerAutocompleteSearch(this.autocompleteSearchText.value, this.autocompletePage.value + 1, {
      bypassMinChars: true,
      append: true,
    });
  }

  private queueLoadMoreAutocompleteResults() {
    setTimeout(() => {
      this.loadMoreAutocompleteResults();
    }, 0);
  }

  private async maybePrimeScrollableAutocompleteResults(previousCount: number, options?: { append?: boolean }) {
    if (!this.isServerAutocomplete() || this.autocompleteLoadMoreMode() !== 'scroll') {
      return;
    }

    const currentCount = (this.autocompleteResultItems.value || []).length;
    const targetCount = this.autocompleteMinScrollableItems();

    if (!this.autocompleteHasMore.value) {
      return;
    }

    if (options?.append && currentCount <= previousCount) {
      return;
    }

    if (currentCount < targetCount) {
      this.queueLoadMoreAutocompleteResults();
      return;
    }

    await nextTick();

    const list = this.findAutocompleteListElement();
    if (list && list.clientHeight > 0) {
      if (list.scrollHeight <= list.clientHeight + 1) {
        this.queueLoadMoreAutocompleteResults();
      }
      return;
    }

    this.queueLoadMoreAutocompleteResults();
  }

  private onAutocompleteListScroll(ev: Event) {
    if (!this.isServerAutocomplete() || this.autocompleteLoadMoreMode() !== 'scroll') {
      return;
    }

    const target = ev.target as HTMLElement | null;
    if (!target) {
      return;
    }

    const remaining = target.scrollHeight - (target.scrollTop + target.clientHeight);
    if (remaining <= 32) {
      this.loadMoreAutocompleteResults();
    }
  }

  private autocompleteNoDataText() {
    const search = (this.autocompleteSearchText.value || '').trim();

    if (!this.isServerAutocomplete()) {
      return undefined;
    }

    if (search.length < this.autocompleteMinSearchChars()) {
      if (this.options.autocompleteNoSearchText) {
        return this.options.autocompleteNoSearchText(this);
      }

      return this.$uiText(
        've.field.autocomplete.typeMinChars',
        `Type at least ${this.autocompleteMinSearchChars()} character(s) to search`,
        { count: this.autocompleteMinSearchChars() }
      );
    }

    if (this.options.autocompleteNoDataText) {
      return this.options.autocompleteNoDataText(this, search) || this.$uiText('ve.field.autocomplete.noMatches', 'No matching records found');
    }

    return this.$uiText('ve.field.autocomplete.noMatches', 'No matching records found');
  }

  private autocompleteLoadMoreText() {
    return this.$text(this.params.value.autocompleteLoadMoreText, this.$uiText('ve.field.autocomplete.loadMore', 'Load more...'));
  }

  private autocompleteLoadingMoreText() {
    return this.$text(this.params.value.autocompleteLoadingMoreText, this.$uiText('ve.field.autocomplete.loadingMore', 'Loading more...'));
  }

  private resolvedLabel() {
    return this.$text(this.params.value.label);
  }

  private resolvedHint() {
    return this.$text(this.params.value.hint);
  }

  private resolvedPlaceholder() {
    return this.$text(this.params.value.placeholder);
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

  async validate(): Promise<UIValidationResult> {
    if (this.params.value.invisible) return undefined;
    if (this.options.validate) return await this.options.validate(this);
  }

  private rules(): any[] {
    const items: any[] = this.options.rules ? this.options.rules(this) : [];

    if (this.options.rules) {
      return items.map((rule) => this.resolveValidationRule(rule));
    }

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

    return items.map((rule) => this.resolveValidationRule(rule));
  }

  private resolveValidationRule(rule: any) {
    if (typeof rule !== 'function') {
      return rule;
    }

    return (value: any) => {
      const result = rule(value);
      if (result && typeof result.then === 'function') {
        return result.then((resolved: UIValidationRuleResult) => isUIValidationMessage(resolved) ? resolveUIText(resolved) : resolved);
      }
      return isUIValidationMessage(result) ? resolveUIText(result) : result;
    };
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
          if (!this.optionLoaded.value && !(ftype === 'autocomplete' && this.isServerAutocomplete())) {
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
      case 'otp':
        return this.buildOtp(props, context);
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
      case 'file-upload':
        return this.buildFileUpload(props, context);
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
      case 'pagination':
        return this.buildPagination(props, context);
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
        innerHTML: this.resolvedLabel()
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
        innerHTML: this.params.value.resolveFormulas ? this.renderMathInHtml(this.modelValue.value) : this.modelValue.value,
        onClick: (event: Event) => this.dispatchHtmlViewEvent(event, 'click'),
        onChange: (event: Event) => this.dispatchHtmlViewEvent(event, 'change'),
        onInput: (event: Event) => this.dispatchHtmlViewEvent(event, 'input'),
        onSubmit: (event: Event) => this.dispatchHtmlViewEvent(event, 'submit'),
      },
    );
  }

  private parseHtmlEventPayload(value: string | null) {
    if (value === null || value === '') {
      return value === '' ? '' : undefined;
    }

    try {
      return JSON.parse(value);
    } catch (_error) {
      return value;
    }
  }

  private htmlEventElementValue(element: any) {
    if (element?.type === 'checkbox' || element?.type === 'radio') {
      return !!element.checked;
    }
    return element && 'value' in element ? element.value : undefined;
  }

  private async dispatchHtmlViewEvent(nativeEvent: Event, eventType: FieldHtmlEventType) {
    const target = nativeEvent.target as any;
    const currentTarget = nativeEvent.currentTarget as any;
    const element = target?.closest?.('[data-ve-event]') as HTMLElement | undefined;
    if (!element || (currentTarget?.contains && !currentTarget.contains(element))) {
      return;
    }

    const configuredEvents = (element.getAttribute('data-ve-on') || 'click')
      .split(/[\s,]+/)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    if (!configuredEvents.includes(eventType)) {
      return;
    }

    const name = (element.getAttribute('data-ve-event') || '').trim();
    if (!/^[A-Za-z][A-Za-z0-9_.:-]*$/.test(name)) {
      return;
    }

    if (element.hasAttribute('data-ve-prevent-default')) {
      nativeEvent.preventDefault();
    }
    if (element.hasAttribute('data-ve-stop-propagation')) {
      nativeEvent.stopPropagation();
    }

    const event: FieldHtmlEvent = {
      name,
      payload: this.parseHtmlEventPayload(element.getAttribute('data-ve-payload')),
      value: this.htmlEventElementValue(element),
      eventType,
      field: this,
      element,
      nativeEvent,
    };

    if (this.options.htmlEvent) {
      await this.options.htmlEvent(this, event);
    }
    this.handleOn('html-event', event);
    this.handleOn(`html:${name}`, event);

    const report = this.$parentReport;
    if (report) {
      report.emit('field:html-event', event);
      report.emit(`field:html:${name}`, event);
    }
  }

  buildPagination(_props: any, _context: any) {
    return buildPaginationWidget(this);
  }

  buildSelect(props: any, context: any) {
    const h = this.$h;
    return h(
      VSelect,
      {
        ...this.modelBinding(),
        ...this.inputIconProps(),
        autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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
          innerHTML: this.resolvedLabel()
        }
      ),
      h(
        VRadioGroup,
        {
          ...this.modelBinding(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
          innerHTML: this.resolvedLabel()
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
            hint: this.resolvedHint(),
            multiple: this.params.value.multiple,
            persistentHint: !!this.params.value.hint,
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
    const loadMoreMode = this.autocompleteLoadMoreMode();
    const serverAutocompleteProps = this.isServerAutocomplete()
      ? {
          search: this.autocompleteSearchText.value,
          noFilter: true,
          noDataText: this.autocompleteNoDataText(),
          menuProps: {
            contentClass: this.autocompleteMenuClass,
          },
          listProps: loadMoreMode === 'scroll'
            ? {
                onScrollPassive: (ev: Event) => this.onAutocompleteListScroll(ev),
              }
            : undefined,
          "onUpdate:search": (value: string) => this.scheduleServerAutocompleteSearch(value || ''),
        }
      : {};

    const autocompleteSlots: Record<string, any> | undefined = this.isServerAutocomplete() ? {
      selection: ({ item, index }: any) => h(
        'span',
        {
          class: 'v-autocomplete__selection-text',
        },
        [
          this.autocompleteDisplayTitle(item),
          this.params.value.multiple && index < ((this.modelValue.value || []).length - 1)
            ? h(
                'span',
                {
                  class: 'v-autocomplete__selection-comma',
                },
                ',',
              )
            : undefined,
        ],
      ),
    } : undefined;

    if (this.isServerAutocomplete() && autocompleteSlots) {
      autocompleteSlots['append-item'] = () => {
        if (loadMoreMode === 'button' && (this.autocompleteHasMore.value || this.autocompleteLoadingMore.value)) {
          return h(
            'div',
            {
              style: {
                padding: '8px 12px 12px 12px',
                borderTop: '1px solid rgba(128,128,128,0.18)',
                display: 'flex',
                justifyContent: 'center',
              },
            },
            [
              h(
                VBtn,
                {
                  variant: 'text',
                  color: this.params.value.color || 'primary',
                  disabled: this.autocompleteLoadingMore.value,
                  prependIcon: this.autocompleteLoadingMore.value ? 'mdi-loading mdi-spin' : 'mdi-chevron-down',
                  onClick: () => this.loadMoreAutocompleteResults(),
                },
                () => this.autocompleteLoadingMore.value ? this.autocompleteLoadingMoreText() : this.autocompleteLoadMoreText(),
              ),
            ],
          );
        }

        if (loadMoreMode === 'scroll' && this.autocompleteLoadingMore.value) {
          return h(
            'div',
            {
              style: {
                padding: '8px 12px 12px 12px',
                borderTop: '1px solid rgba(128,128,128,0.18)',
                textAlign: 'center',
                fontSize: '0.9rem',
                opacity: 0.82,
              },
            },
            this.autocompleteLoadingMoreText(),
          );
        }

        return undefined;
      };
    }

    return h(
      VAutocomplete as any,
      {
        ...this.modelBinding(),
        ...this.inputIconProps(),
        autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        itemTitle: this.params.value.itemTitle || 'name',
        itemValue: Master.resolveItemValueField(this.selectItems.value, this.params.value.itemValue || this.params.value.idField),
        readonly: this.$readonly,
        items: this.selectItems.value,
        loading: this.autocompleteLoading.value,
        autoSelectFirst: true,
        returnObject: this.params.value.returnObject,
        valueComparator: (left: any, right: any) => this.autocompleteValuesEqual(left, right),
        multiple: this.params.value.multiple,
        ...serverAutocompleteProps,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        "onUpdate:focused": (ev: any) => this.onFocusChanged(ev),
      },
      autocompleteSlots,
    );
  }

  private richWidgetContext(): RichWidgetContext {
    return {
      $h: this.$h,
      $text: (value: any, fallback?: string) => this.$text(value, fallback),
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
      isCreateMode: () => this.isCreateMode(),
      codePreview: this.codePreview,
      chartLoaded: this.chartLoaded,
      chartOpts: this.chartOpts,
      chartValue: this.chartValue,
      renderMathInHtml: (html: string, output?: 'htmlAndMathml'|'html'|'mathml') => this.renderMathInHtml(html, output),
      showPreviewFullscreen: (html: string) => this.showPreviewFullscreen(html),
      registerHtmlEditor: (editor: any) => this.registerHtmlEditor(editor),
      onHtmlEditorReady: (editor: any) => {
        this.htmlEditor = editor;
        if (this.params.value.autofocus) {
          this.focusHtmlEditor();
        }
      },
      renderLatex: (value: string) => void this.renderLatex(value),
      loadChart: () => this.loadChart(),
      messageFormat: (data: any) => this.messageFormat(data),
      showMediaFullscreen: (data: string) => this.showFullscreen(data),
      mediaItems: () => this.mediaItems(),
      selectMediaFiles: async () => {
        try {
          const files = await selectFile(this.params.value.fileAccepts, !!this.params.value.multiple);
          await this.handleSelectedFiles(files);
        } catch (error: any) {
          if (error?.message !== 'No File Selected!') {
            Dialogs.$error(error?.message || this.$uiText('ve.field.fileSelectFailed', 'Failed to select files.'));
          }
        }
      },
      clearMediaItem: async (index: number) => {
        await this.clearMediaItem(index);
      },
      clearMediaItems: async () => {
        await this.clearMediaValue();
      },
      openMediaItem: async (item: any) => {
        await this.openMediaItem(item);
      },
      isAssetMode: () => this.isAssetMode(),
      hasPendingUpload: () => this.$hasPendingUpload,
      uploadAssets: async () => this.$uploadAssets(),
      clearSelectedFiles: async () => this.$clearSelectedFiles(),
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

    const onInit = () => {
      if (this.params.value.autofocus) {
        this.focusHtmlEditor();
      }
    };

    if (typeof editor?.on === 'function') {
      editor.on('init', onInit);
      editor.on('keydown', (ev: KeyboardEvent) => {
        this.onHtmlEditorKeydown(ev);
      });
      return;
    }

    if (editor?.isReady) {
      onInit();
    }
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
      if (body && typeof editor.selection?.select === 'function' && typeof editor.selection?.collapse === 'function') {
        body.focus?.();
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
    if (btn) {
      btn.setParent(this);
      return h(btn.component);
    }
    return undefined;
  }

  buildCode(props: any, context: any) {
    return buildCodeWidget(this.richWidgetContext());
  }

  buildColor(props: any, context: any) {
    const h = this.$h;
    return h(
      VColorInput as any,
      {
        ...this.componentOptions(),
        ...this.modelBinding(),
        ...this.inputIconProps(),
        autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
        clearable: this.params.value.clearable || false,
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant,
        readonly: this.$readonly,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        rules: this.rules(),
        mode: 'hexa',
        "onUpdate:modelValue": (value: any) => {
          if (typeof value === 'string') {
            this.modelValue.value = value;
            return;
          }

          this.modelValue.value = value?.hexa || value?.hex || '';
        },
        "onUpdate:focused": (ev: any) => this.onFocusChanged(ev)
      },
    );
  }

  buildOtp(props: any, context: any) {
    const h = this.$h;
    return h(
      VOtpInput as any,
      {
        ...this.componentOptions(),
        ...this.modelBinding(),
        ...this.inputIconProps(),
        autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        placeholder: this.resolvedPlaceholder(),
        color: this.params.value.color || "primary",
        variant: this.params.value.variant || Field.defaultParams?.variant || 'outlined',
        readonly: this.$readonly,
        disabled: this.$readonly,
        class: this.params.value.class || [],
        style: this.params.value.style || {},
        length: this.params.value.length || 6,
        type: this.params.value.otpType || 'number',
        "onUpdate:focused": (ev: any) => this.onFocusChanged(ev),
        onFinish: (value: string) => {
          void this.onOtpFinished(value);
        },
      },
    );
  }

  buildTime(props: any, context: any) {
    const h = this.$h;
    if (this.params.value.multiple) {
      return h(
        VCombobox,
        {
          ...this.modelBinding(),
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
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
    const updateValue = (value: any) => {
      this.setModelValueAndSync(value);
    };
    return [
      h(
        'div',
        {
          class: ['mb-2', 'ml-4'],
          innerHTML: this.resolvedLabel()
        },
      ),
      h(
        Datepicker,
        {
          modelValue: this.modelValue.value,
          'model-value': this.modelValue.value,
          autofocus: this.params.value.autofocus,
          label: this.resolvedLabel(),
          hint: this.resolvedHint(),
          persistentHint: !!this.params.value.hint,
          placeholder: this.resolvedPlaceholder(),
          clearable: this.params.value.clearable || false,
          color: this.params.value.color || "primary",
          variant: this.params.value.variant || Field.defaultParams?.variant,
          readonly: this.$readonly,
          class: this.params.value.class || [],
          style: this.params.value.style || {},
          rules: this.rules(),
          teleport: true,
          autoPosition: true,
          ...(this.options.datetimeOptions || {}),
          "onUpdate:modelValue": updateValue,
          "onUpdate:model-value": updateValue,
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
          ...this.inputIconProps(),
          autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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
        ...this.inputIconProps(),
        autofocus: this.params.value.autofocus,
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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
              this.$text(this.params.value.label)
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

  buildFileUpload(props: any, context: any) {
    const h = this.$h;
    const items = this.mediaItems();

    return h(
      VRow,
      {},
      () => [
        h(
          VCol,
          {
            cols: 12,
          },
          () => h(
            VFileUpload as any,
            {
              ...this.componentOptions(),
              modelValue: this.selectedFiles.value,
              title: this.resolvedLabel(),
              subtitle: this.resolvedHint() || this.resolvedPlaceholder(),
              autofocus: this.params.value.autofocus,
              clearable: this.params.value.clearable !== false,
              disabled: this.$readonly,
              readonly: this.$readonly,
              multiple: this.params.value.multiple,
              filterByType: this.params.value.fileAccepts,
              color: this.params.value.color || "primary",
              class: this.params.value.class || [],
              style: this.params.value.style || {},
              loading: this.assetUploading.value || this.fileUploadLoading.value,
              showSize: true,
              "onUpdate:modelValue": (value: any) => {
                void this.onFileUploadChanged(value);
              },
              onRejected: (files: File[]) => {
                if (files?.length) {
                  Dialogs.$error(this.$uiText('ve.field.fileUpload.unsupportedType', `Unsupported file type: ${files.map((file) => file.name).join(', ')}`, {
                    files: files.map((file) => file.name).join(', '),
                  }));
                }
              },
              "onUpdate:focused": (ev: any) => this.onFocusChanged(ev),
            },
          ),
        ),
        ...(items.length > 0 ? [
          h(
            VCol,
            {
              cols: 12,
            },
            () => items.map((item, index) => h(
              VCard,
              {
                key: item.key,
                class: ['mb-2'],
                variant: 'outlined',
              },
              () => h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 16px',
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        minWidth: 0,
                        flex: '1 1 auto',
                      },
                    },
                    [
                      h('div', { style: { fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, item.label),
                      h('div', { style: { fontSize: '0.85rem', opacity: 0.72 } }, [
                        item.mimeType || 'file',
                        item.size ? ` • ${Math.max(1, Math.round(item.size / 1024))} KB` : '',
                        item.pending ? ' • pending upload' : '',
                      ].join('')),
                    ],
                  ),
                  h(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      },
                    },
                    [
                      ...((item.previewUrl || item.downloadUrl || typeof item.raw === 'string' || item.raw instanceof File) ? [
                        h(
                          VBtn,
                          {
                            color: 'success',
                            icon: true,
                            size: 'small',
                            onClick: () => {
                              void this.openMediaItem(item);
                            },
                          },
                          () => h(VIcon, {}, () => 'mdi-eye'),
                        ),
                      ] : []),
                      ...(!this.$readonly ? [
                        h(
                          VBtn,
                          {
                            color: 'error',
                            icon: true,
                            size: 'small',
                            onClick: () => {
                              void this.clearMediaItem(index);
                            },
                          },
                          () => h(VIcon, {}, () => 'mdi-delete'),
                        ),
                      ] : []),
                    ],
                  ),
                ],
              ),
            )),
          ),
        ] : []),
        ...(!this.$readonly && this.isAssetMode() && this.$hasPendingUpload ? [
          h(
            VCol,
            {
              cols: 12,
              class: ['d-flex', 'justify-center', 'ga-3'],
            },
            () => [
              h(
                VBtn,
                {
                  color: 'primary',
                  onClick: () => {
                    void this.$uploadAssets();
                  },
                },
                () => this.$uiText('ve.field.fileUpload.uploadSelected', 'Upload Selected Files'),
              ),
              h(
                VBtn,
                {
                  color: 'error',
                  variant: 'outlined',
                  onClick: () => {
                    void this.$clearSelectedFiles();
                  },
                },
                () => this.$uiText('ve.field.fileUpload.clearSelected', 'Clear Selected Files'),
              ),
            ],
          ),
        ] : []),
      ],
    );
  }

  private showFullscreen (data: string) {
    const isImageData = typeof data === 'string' && (
      data.startsWith('data:image/')
      || /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(data)
    );
    const isPdfData = typeof data === 'string' && (
      data.startsWith('data:application/pdf')
      || /\.pdf(\?.*)?$/i.test(data)
    );

    if (isImageData) {
      void Dialogs.$imagePreview(data, {
        title: this.$text(this.params.value.label),
        fullscreen: this.params.value.previewFullscreen !== false,
      });
      return;
    }

    if (isPdfData) {
      void Dialogs.$documentPreview(data, {
        title: this.$text(this.params.value.label),
        fullscreen: this.params.value.previewFullscreen !== false,
      });
      return;
    }

    void Dialogs.$iframe({
      src: data,
      title: this.$text(this.params.value.label),
      fullscreen: this.params.value.previewFullscreen !== false,
      downloadUrl: data,
    });
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
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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
        label: this.resolvedLabel(),
        hint: this.resolvedHint(),
        persistentHint: !!this.params.value.hint,
        placeholder: this.resolvedPlaceholder(),
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

  private handleOn(event: string, data?: any, ...args: any[]) {
    if (this.options.on) {
      const events = this.options.on(this);
      if (events[event]) {
        events[event](data, ...args)
      }
    }

    this.emit(event, data, ...args)
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

    if (focused && this.isServerAutocomplete()) {
      void this.syncServerAutocompleteSelection();

      if (this.params.value.searchOnFocus) {
        this.scheduleServerAutocompleteSearch(this.autocompleteSearchText.value || '', {
          immediate: true,
          bypassMinChars: true,
        });
      }
    }
  }

  mounted() {
    this.synchronizeValue({ initialize: true, origin: 'master' });
    if (this.isAssetMode()) {
      void this.syncResolvedAssets();
    }
    if (this.isServerAutocomplete()) {
      void this.syncServerAutocompleteSelection();
    }
  }

  destructor() {
    this.initializationVersion += 1;
    if (this.autocompleteDebounceTimer) {
      clearTimeout(this.autocompleteDebounceTimer);
      this.autocompleteDebounceTimer = undefined;
    }

    if (this.autocompleteAbortController) {
      this.autocompleteAbortController.abort();
      this.autocompleteAbortController = undefined;
    }
  }

}

const FD = (params?: FieldParams, options?: FieldOptions) => new Field(params, options);
FD.setDefault = Field.setDefault

export const $FD = FD;
