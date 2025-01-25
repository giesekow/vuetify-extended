import { Ref, RendererNode, VNode } from "vue";
import { ReportMode, UIBase } from "./base";
import { Master } from "../master";
import { Button } from "./button";
import { Form } from "./form";
import { Report } from "./report";
import '@vuepic/vue-datepicker/dist/main.css';
import { OnHandler } from "./lib";
export type FieldType = 'text' | 'select' | 'autocomplete' | 'label' | 'messagingbox' | 'chart' | 'viewtable' | 'map' | 'code' | 'color' | 'html' | 'htmlview' | 'listselect' | 'time' | 'date' | 'datetime' | 'button' | 'image' | 'document' | 'password' | 'float' | 'integer' | 'decimal' | 'collection' | 'textarea' | 'boolean' | 'table' | 'reporttable' | 'servertable';
export declare const fieldTypeOptions: {
    name: string;
    _id: string;
}[];
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
    lang?: 'html' | 'json' | 'javascript' | 'python' | 'python' | 'text' | 'ejs';
    codeTheme?: 'chrome' | 'xcode';
    hint?: string;
    icon?: string;
    clearable?: boolean;
    autofocus?: boolean;
    inline?: boolean;
    color?: string;
    itemValue?: string;
    itemTitle?: string;
    returnObject?: boolean;
    itemsPerPage?: string | number;
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
    fileAccepts?: any;
    fileMaxSize?: number;
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
    button?: (field: Field) => Button | undefined;
    form?: (field: Field) => Promise<Form | undefined> | Form | undefined;
    headers?: (field: Field) => Promise<any[] | undefined> | any[] | undefined;
    items?: (field: Field, options?: any) => Promise<any[] | any | undefined> | any[] | any | undefined;
    format?: (field: Field, items: any[]) => any[] | undefined;
    footer?: (field: Field, items: any[]) => any[] | undefined;
    chartData?: (field: Field) => Promise<any | undefined> | any | undefined;
    chartOptions?: (field: Field) => Promise<any | undefined> | any | undefined;
    messageFormat?: (field: Field, data: any) => any[];
    rules?: (field: Field) => any[];
    changed?: (field: Field) => void;
    focusChanged?: (field: Field, focused: boolean) => void;
    setup?: (field: Field) => void;
    validate?: (field: Field) => Promise<string | undefined> | string | undefined;
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
    private options;
    private changing;
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
    constructor(params?: FieldParams, options?: FieldOptions);
    static setDefault(value: FieldParams, reset?: boolean): void;
    get $refs(): Refs;
    get $ref(): string | undefined;
    setParams(params: FieldParams): void;
    get $params(): FieldParams;
    get $readonly(): any;
    get $parentReport(): Report | undefined;
    get $mode(): ReportMode | undefined;
    get $value(): any;
    get $options(): any[];
    get $collectionForm(): Form | undefined;
    props(): never[];
    setup(props: any, context: any): void;
    valueChanged(newValue?: any): void;
    attachEventListeners(): void;
    removeEventListeners(): void;
    updateValue(): void;
    private isEqual;
    private preprocess;
    private postprocess;
    selectOptions(): Promise<any[] | undefined>;
    button(): Button | undefined;
    form(): Promise<Form | undefined>;
    headers(): Promise<any[] | undefined>;
    items(options?: any): Promise<any[] | undefined>;
    chartOptions(): Promise<any | undefined>;
    chartData(): Promise<any | undefined>;
    private loadChart;
    loadOptions(): Promise<void>;
    messageFormat(data: any): any[];
    $reload(): Promise<void>;
    render(props: any, context: any): VNode | undefined;
    validate(): Promise<string | undefined>;
    private rules;
    build(props: any, context: any): any[] | VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined;
    buildText(props: any, context: any, type: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildLabel(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildHTMLView(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
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
    buildAutocomplete(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildHTML(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    buildButton(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined;
    buildCode(props: any, context: any): any[];
    buildColor(props: any, context: any): VNode<RendererNode, import("vue").RendererElement, {
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
    private getColspan;
    private calculateHeaderRows;
    private getItemHeaders;
    private makeReportTableHeader;
    private makeReportTableBody;
    private makeReportTableFooter;
    private loadTableInformation;
    private handleOn;
    onFocusChanged(focused: any): void;
    mounted(): void;
}
export declare const $FD: {
    (params?: FieldParams, options?: FieldOptions): Field;
    setDefault: typeof Field.setDefault;
};
