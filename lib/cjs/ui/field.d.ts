import { Ref, RendererNode, VNode } from "vue";
import { ReportMode, UIBase } from "./base";
import { Master } from "../master";
import { Button } from "./button";
import { Form } from "./form";
import { Report } from "./report";
import { type FieldPaginationChangeReason, type FieldPaginationEvent, type FieldPaginationValue } from "./widgets/field-pagination-state";
export type { FieldPaginationChangeReason, FieldPaginationEvent, FieldPaginationValue, } from "./widgets/field-pagination-state";
import '@vuepic/vue-datepicker/dist/main.css';
import { OnHandler } from "./lib";
import 'katex/dist/katex.min.css';
import { type UIText, type UIValidationResult } from "./runtime";
import { type UITableHeader } from "./table-header";
import { type HtmlEditorProfile, type HtmlEditorToolbarItem } from "./html-editor-options";
export type FieldType = 'text' | 'select' | 'autocomplete' | 'label' | 'messagingbox' | 'chart' | 'viewtable' | 'map' | 'map-line' | 'map-circle' | 'map-rectangle' | 'map-polygon' | 'map-heatmap' | 'map-cluster' | 'map-geojson' | 'code' | 'color' | 'html' | 'htmlview' | 'listselect' | 'otp' | 'file-upload' | 'time' | 'date' | 'datetime' | 'button' | 'image' | 'document' | 'password' | 'float' | 'integer' | 'decimal' | 'collection' | 'textarea' | 'boolean' | 'pagination' | 'table' | 'reporttable' | 'servertable';
export type FieldUploadType = 'base64' | 'file' | 'metadata';
export type FieldDateFormat = 'YYYY-MM-DD' | 'YYYYMMDD' | 'timestamp';
export type FieldTimeFormat = 'HH:mm' | 'HHMM' | 'timestamp';
export type FieldAutocompleteFormat = 'default' | 'table';
export type FieldValueOrigin = 'default' | 'master' | 'user' | 'programmatic';
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
export type FieldHtmlEventType = 'click' | 'change' | 'input' | 'submit';
export interface FieldHtmlEvent {
    name: string;
    payload?: any;
    value?: any;
    eventType: FieldHtmlEventType;
    field: Field;
    element: HTMLElement;
    nativeEvent: Event;
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
export declare const fieldTypeOptions: {
    name: string;
    _id: string;
    id: string;
}[];
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
    lang?: 'html' | 'json' | 'javascript' | 'python' | 'text' | 'ejs' | 'latex';
    codeTheme?: 'chrome' | 'xcode';
    hint?: UIText;
    icon?: string;
    clearable?: boolean;
    autofocus?: boolean;
    htmlProfile?: HtmlEditorProfile;
    htmlToolbar?: HtmlEditorToolbarItem[];
    htmlFullscreen?: boolean;
    inline?: boolean;
    color?: string;
    itemValue?: string;
    itemTitle?: string;
    returnObject?: boolean;
    itemsPerPage?: string | number;
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
    maxHeight?: number | string | undefined;
    minHeight?: number | string | undefined;
    minWidth?: number;
    variant?: "filled" | "outlined" | "plain" | "underlined" | "solo" | "solo-inverted" | "solo-filled" | undefined;
    xs?: number | string | undefined;
    sm?: number | string | undefined;
    md?: number | string | undefined;
    lg?: number | string | undefined;
    cols?: number | string | undefined;
    xl?: number | string | undefined;
    xxl?: number | string | undefined;
    chartType?: any;
    mapApiKey?: any;
    mapOptions?: any;
    mapZoom?: number;
    serverSearch?: boolean;
    autocompleteFormat?: FieldAutocompleteFormat;
    autocompleteAddText?: UIText;
    autocompleteSelectedText?: UIText;
    autocompleteRemoveText?: UIText;
    autocompleteDisableRemove?: boolean;
    autocompleteLoadMore?: 'scroll' | 'button';
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
    fileMaxSize?: number;
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
        range?: {
            from: any;
            to: any;
            converter?: any;
        };
        max?: {
            value: any;
            converter?: any;
        };
        min?: {
            value: any;
            converter?: any;
        };
        gt?: {
            value: any;
            converter?: any;
        };
        lt?: {
            value: any;
            converter?: any;
        };
        gte?: {
            value: any;
            converter?: any;
        };
        lte?: {
            value: any;
            converter?: any;
        };
        neq?: {
            value: any;
            converter?: any;
        };
        eq?: {
            value: any;
            converter?: any;
        };
        in?: any[];
        nin?: any[];
        includes?: any;
        excludes?: any;
        maxLen?: number;
        minLen?: number;
        regex?: string;
    };
}
export interface FieldOptions {
    master?: Master;
    modifies?: Ref<any>;
    datetimeOptions?: any | undefined;
    selectOptions?: (field: Field) => Promise<any[] | undefined> | any[] | undefined;
    autocompleteSearch?: (field: Field, search: string, options?: {
        page?: number;
        limit?: number;
        signal?: AbortSignal;
    }) => Promise<any[] | {
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
    autocompleteResolveValue?: (field: Field, value: any, options?: {
        signal?: AbortSignal;
    }) => Promise<any | any[] | undefined> | any | any[] | undefined;
    autocompleteNoSearchText?: (field: Field) => string | undefined;
    autocompleteNoDataText?: (field: Field, search: string) => string | undefined;
    button?: (field: Field) => Button | undefined;
    form?: (field: Field) => Promise<Form | undefined> | Form | undefined;
    headers?: (field: Field) => Promise<UITableHeader[] | undefined> | UITableHeader[] | undefined;
    items?: (field: Field, options?: any) => Promise<any[] | any | undefined> | any[] | any | undefined;
    format?: (field: Field, items: any[]) => any[] | undefined;
    footer?: (field: Field, items: any[]) => any[] | undefined;
    chartData?: (field: Field) => Promise<any | undefined> | any | undefined;
    chartOptions?: (field: Field) => Promise<any | undefined> | any | undefined;
    messageFormat?: (field: Field, data: any) => any[];
    rules?: (field: Field) => any[];
    changed?: (field: Field, context: FieldValueContext) => void;
    initialized?: (field: Field, context: FieldValueContext) => Promise<void> | void;
    paginationChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void> | void;
    pageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void> | void;
    itemsPerPageChanged?: (field: Field, event: FieldPaginationEvent) => Promise<void> | void;
    htmlEvent?: (field: Field, event: FieldHtmlEvent) => Promise<void> | void;
    fileSelected?: (field: Field, payload: FieldSelectedFilePayload) => Promise<void> | void;
    assetUploaded?: (field: Field, assets: AssetRecord[]) => Promise<void> | void;
    assetsResolved?: (field: Field, assets: AssetRecord[]) => Promise<void> | void;
    assetRemoved?: (field: Field, assets: AssetRecord[]) => Promise<void> | void;
    finished?: (field: Field, value: string) => Promise<void> | void;
    focusChanged?: (field: Field, focused: boolean) => void;
    setup?: (field: Field) => void;
    validate?: (field: Field) => Promise<UIValidationResult> | UIValidationResult;
    default?: (field: Field) => any;
    on?: (field: Field) => OnHandler;
    canRemoveItem?: (field: Field, item: any) => Promise<boolean> | boolean | undefined;
    canEditItem?: (field: Field, item: any) => Promise<boolean> | boolean | undefined;
}
export interface Refs {
    [key: string]: Field;
}
export declare class Field extends UIBase {
    private params;
    private modelValue;
    private htmlValidationResult;
    private options;
    private changing;
    private handledModelSyncPending;
    private handledModelSyncValue;
    private handledModelSyncVersion;
    private initialized;
    private initializationVersion;
    private selectItems;
    private optionLoaded;
    private collectionLoaded;
    private collectionForm?;
    private collectionSelectedItems;
    private collectionHeaders?;
    private collectionDialog;
    private collectionFormMaster?;
    private tableHeaders;
    private tableItems;
    private tableLoaded;
    private tableItemsPerPage;
    private tableTotalItems;
    private tablePage;
    private chartOpts;
    private chartValue;
    private chartLoaded;
    private loading;
    private currentCollectionItems;
    private currentCollectionFooter;
    private isEditting;
    private static defaultParams;
    private maxWidth;
    private codePreview;
    private htmlEditor;
    private messageVisibleCount;
    private messageContainer;
    private pendingMessageScrollRestore?;
    private autocompleteSearchText;
    private autocompleteLoading;
    private autocompleteLoadingMore;
    private autocompleteLoaded;
    private autocompletePage;
    private autocompleteTotal;
    private autocompleteHasMore;
    private autocompleteRequestId;
    private autocompleteResultItems;
    private autocompleteResolvedItems;
    private autocompleteCache;
    private autocompleteDebounceTimer?;
    private autocompleteAbortController?;
    private autocompleteMenuClass;
    private autocompleteTablePendingItem;
    private autocompleteTableHeaders;
    private autocompleteTableHeadersLoaded;
    private autocompleteTableRows;
    private autocompleteTableSelectedKeys;
    private autocompleteTableLoading;
    private autocompleteTableRequestId;
    private autocompleteTableRowSources;
    private optionLoading;
    private selectedFiles;
    private resolvedAssets;
    private assetResolveRequestId;
    private assetUploadPending;
    private assetUploading;
    private fileUploadLoading;
    constructor(params?: FieldParams, options?: FieldOptions);
    static setDefault(value: FieldParams, reset?: boolean): void;
    get $refs(): Refs;
    get $ref(): string | undefined;
    setParams(params: FieldParams): void;
    get $params(): FieldParams;
    get $readonly(): any;
    get $parentReport(): Report | undefined;
    get $mode(): ReportMode | undefined;
    private isCreateMode;
    get $value(): any;
    get $options(): any[];
    get $collectionForm(): Form | undefined;
    get $selectedFiles(): File[];
    get $resolvedAssets(): AssetRecord[];
    get $hasPendingUpload(): boolean;
    props(): never[];
    setup(props: any, context: any): void;
    private consumeHandledModelSync;
    private markCurrentModelSyncHandled;
    private setModelValueFromMaster;
    private setModelValueAndSync;
    private normalizePaginationValue;
    private paginationEvent;
    get $pagination(): FieldPaginationValue;
    get $paginationItemsPerPageOptions(): number[];
    setPagination(value: Partial<FieldPaginationValue>, options?: FieldPaginationSetOptions): Promise<FieldPaginationValue>;
    private selectionValuesEqual;
    private modelValuesEqual;
    private modelBinding;
    private componentOptions;
    private inputIconProps;
    private mediaFieldType;
    private isMediaField;
    private isAssetMode;
    private assetAdapter;
    private assetIdField;
    private assetPreviewField;
    private assetDownloadField;
    private assetNameField;
    private assetMimeTypeField;
    private assetSizeField;
    private resolvedUploadType;
    private normalizeFiles;
    private normalizeStoredAssetIds;
    private assetValueFromRecords;
    private buildAssetRecordMetadata;
    private hydrateAssetRecords;
    private buildSelectedFileMetadata;
    private directStoredMediaItems;
    mediaItems(): ({
        key: string;
        label: any;
        mimeType: any;
        size: any;
        previewUrl: undefined;
        downloadUrl: undefined;
        raw: any;
        uploaded: boolean;
        pending: boolean;
    } | {
        key: string;
        label: string;
        mimeType: string;
        size: undefined;
        previewUrl: string;
        downloadUrl: string;
        raw: any;
        uploaded: boolean;
        pending: boolean;
    })[] | ({
        key: string;
        label: string;
        mimeType: string;
        size: number | undefined;
        previewUrl: string | undefined;
        downloadUrl: string | undefined;
        raw: AssetRecord;
        uploaded: boolean;
        pending: boolean;
    } | {
        key: string;
        label: string;
        mimeType: string;
        size: number;
        previewUrl: undefined;
        downloadUrl: undefined;
        raw: File;
        uploaded: boolean;
        pending: boolean;
    })[];
    private setSelectedFiles;
    private mergeDirectMediaValues;
    $clearSelectedFiles(): Promise<void>;
    private clearSelectedFiles;
    private emitFileSelected;
    private emitAssetUploaded;
    private emitAssetsResolved;
    private emitAssetRemoved;
    private removeAssets;
    private buildFileMetadata;
    private normalizeFilesInput;
    private validateSelectedFiles;
    private createDirectUploadValue;
    $uploadAssets(): Promise<AssetRecord[]>;
    handleSelectedFiles(files?: File[] | FileList | null): Promise<void>;
    private syncResolvedAssets;
    private clearMediaValue;
    private clearMediaItem;
    private openMediaItem;
    private onOtpFinished;
    private onFileUploadChanged;
    private eventValue;
    private notifyChanged;
    private notifyInitialized;
    valueChanged(newValue?: any, origin?: FieldValueOrigin, previousValue?: any): void;
    private masterChangeAffectsValue;
    attachEventListeners(): void;
    removeEventListeners(): void;
    private hasDefaultValue;
    private resolveDefaultValue;
    updateValue(): void;
    private synchronizeValue;
    private renderMathInHtml;
    private renderLatex;
    private showPreviewFullscreen;
    private isEqual;
    private preprocess;
    private postprocess;
    private resolvedDateFormat;
    private resolvedTimeFormat;
    private parseCompactDateValue;
    private preprocessDateValue;
    private preprocessTimeValue;
    private postprocessDateValue;
    private postprocessTimeValue;
    selectOptions(): Promise<any[] | undefined>;
    button(): Button | undefined;
    form(): Promise<Form | undefined>;
    headers(): Promise<UITableHeader[] | undefined>;
    makeHTMLColumns(headers: UITableHeader[]): any;
    items(options?: any): Promise<any[] | undefined>;
    chartOptions(): Promise<any | undefined>;
    chartData(): Promise<any | undefined>;
    private loadChart;
    loadOptions(): Promise<void>;
    private isAutocompleteTable;
    private syncAutocompleteSelectionDisplay;
    private isServerAutocomplete;
    private autocompleteMinSearchChars;
    private autocompleteDebounceMs;
    private autocompleteLoadMoreMode;
    private autocompletePageSize;
    private autocompleteMinScrollableItems;
    private findAutocompleteListElement;
    private shouldCacheAutocompleteResults;
    private shouldKeepSelectedAutocompleteItems;
    private resolveAutocompleteHasMore;
    private normalizeAutocompleteItems;
    private normalizeAutocompleteSearchResult;
    private autocompleteItemKey;
    private mergeAutocompleteItems;
    private selectedAutocompleteObjects;
    private selectedAutocompleteIds;
    private autocompleteItemMatchesValue;
    private filterAutocompleteItemsByValues;
    private hydratedAutocompleteSelection;
    private retainSelectedAutocompleteItems;
    private refreshAutocompleteDisplayItems;
    private updateResolvedAutocompleteItems;
    private autocompleteDisplayItemForValue;
    private normalizeAutocompleteComparisonValue;
    private autocompleteValuesEqual;
    private autocompleteDisplayTitle;
    private autocompleteCacheKey;
    private fetchAutocompleteSearchPage;
    private syncServerAutocompleteSelection;
    private autocompleteTableStoredValues;
    private autocompleteTableFallbackItem;
    private autocompleteTableStoredValue;
    private resolveAutocompleteTableItems;
    private loadAutocompleteTableHeaders;
    private autocompleteTableSourceKey;
    private buildAutocompleteTableRows;
    private syncAutocompleteTableSelection;
    private autocompleteTablePendingRawItem;
    private canAddAutocompleteTableItem;
    private addAutocompleteTableItem;
    private removeAutocompleteTableItems;
    private applyServerAutocompleteSearch;
    private scheduleServerAutocompleteSearch;
    private canLoadMoreAutocompleteResults;
    private loadMoreAutocompleteResults;
    private queueLoadMoreAutocompleteResults;
    private maybePrimeScrollableAutocompleteResults;
    private onAutocompleteListScroll;
    private autocompleteNoDataText;
    private autocompleteLoadMoreText;
    private autocompleteLoadingMoreText;
    private autocompleteTableText;
    private autocompleteTableAddText;
    private autocompleteTableSelectedText;
    private autocompleteTableRemoveText;
    private resolvedLabel;
    private resolvedHint;
    private resolvedPlaceholder;
    messageFormat(data: any): any[];
    $reload(): Promise<void>;
    render(props: any, context: any): VNode | undefined;
    validate(): Promise<UIValidationResult>;
    private rules;
    private resolveValidationRule;
    build(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | undefined;
    buildText(props: any, context: any, type: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildLabel(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildHTMLView(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    private parseHtmlEventPayload;
    private htmlEventElementValue;
    private dispatchHtmlViewEvent;
    buildPagination(_props: any, _context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildSelect(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildRadioSelect(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    buildCheckboxSelect(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    private autocompleteServerInputProps;
    private buildAutocompleteLoadMoreItem;
    buildAutocomplete(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildAutocompleteTable(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    private richWidgetContext;
    private tableWidgetContext;
    private getMessageWindow;
    private messageInitialRenderCount;
    private messagePageSize;
    private loadEarlierMessages;
    private setMessageScrollContainer;
    private restoreMessageScrollPosition;
    buildHTML(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    private registerHtmlEditor;
    private onHtmlEditorKeydown;
    private focusHtmlEditor;
    private parentForm;
    focusPrimaryInput(): Promise<boolean>;
    buildButton(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined;
    buildCode(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    buildColor(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildOtp(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildTime(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildDate(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildDatetime(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    buildPassword(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildFloat(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildInteger(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildCollection(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildMessageBox(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildChart(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | undefined;
    buildMap(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[];
    buildImage(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildFileUpload(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    private showFullscreen;
    private loadCollectionInformation;
    forceLoadCollectionInfo(): void;
    private createCollectionForm;
    private onCollectionFormSaved;
    private onCollectionFormCancel;
    private onCollectionItemRemoved;
    private onCollectionItemClicked;
    format(items: any[]): any[];
    private attachIndex;
    private footer;
    buildTextArea(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildBoolean(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildTable(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    forceLoadTableInfo(): void;
    clearTableSelection(): void;
    buildServerTable(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildViewTable(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildReportTable(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    private loadTableInformation;
    private handleOn;
    onFocusChanged(focused: any): void;
    mounted(): void;
    destructor(): void;
}
export declare const $FD: {
    (params?: FieldParams, options?: FieldOptions): Field;
    setDefault: typeof Field.setDefault;
};
