import { VNode } from "vue";
import { UIBase } from "./base";
import { Trigger } from "./trigger";
import { Report } from "./report";
import { Selector } from "./selector";
import { OnHandler } from "./lib";
export interface CollectionParams {
    ref?: string;
    readonly?: boolean;
    invisible?: boolean;
    idField?: string;
    objectType?: string;
    selectionOnly?: boolean;
    multiple?: boolean;
    mode?: 'create' | 'edit' | 'display';
}
export interface CollectionOptions {
    access?: (collection: Collection, mode: any) => Promise<boolean | undefined> | boolean | undefined;
    report?: (collection: Collection) => Promise<Report | undefined> | Report | undefined;
    trigger?: (collection: Collection) => Promise<Trigger | undefined> | Trigger | undefined;
    selector?: (collection: Collection) => Promise<Selector | undefined> | Selector | undefined;
    setup?: (collection: Collection) => void;
    on?: (collection: Collection) => OnHandler;
}
export declare class Collection extends UIBase {
    private params;
    private options;
    private currentReport?;
    private currentTrigger?;
    private currentSelector?;
    private currentObject;
    private prevState;
    private selectedItems;
    private currentIndex;
    constructor(params?: CollectionParams, options?: CollectionOptions);
    access(mode: any): Promise<boolean | undefined>;
    get $ref(): string | undefined;
    get $readonly(): any;
    setParams(params: CollectionParams): void;
    get $params(): CollectionParams;
    props(): never[];
    render(props: any, context: any): VNode | undefined;
    private buildReport;
    private buildTrigger;
    private buildSelector;
    selector(): Promise<Selector | undefined>;
    trigger(): Promise<Trigger | undefined>;
    report(): Promise<Report | undefined>;
    show(): Promise<void>;
    showSelector(): Promise<void>;
    showTrigger(): Promise<true | undefined>;
    showReport(item?: any): Promise<void>;
    private triggerSelected;
    private showReportWithIndex;
    private itemSelected;
    private reportSaved;
    private reportCancelled;
    private reportFinished;
    private onSelectorCancelled;
    private onTriggerCancelled;
    forceCancel(): Promise<void>;
    setup(props: any, context: any): void;
    private handleOn;
}
export declare const $COL: (params?: CollectionParams, options?: CollectionOptions) => Collection;
