import { VNode } from "vue";
import { MenuTarget, UIBase } from "./base";
import { Trigger } from "./trigger";
import { Report } from "./report";
import { Selector } from "./selector";
import { OnHandler } from "./lib";
type CollectionViewState = 'report' | 'selector' | 'trigger' | undefined;
interface CollectionNavigationState {
    restoreMode?: 'full' | 'shallow';
    currentObject?: CollectionViewState;
    prevState?: CollectionViewState;
    selectedItems?: any[];
    selectedIds?: any[];
    currentIndex?: number;
}
export interface CollectionParams {
    ref?: string;
    readonly?: boolean;
    invisible?: boolean;
    hideSideNavs?: boolean;
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
    private suppressNavigationSync;
    private static defaultParams;
    constructor(params?: CollectionParams, options?: CollectionOptions);
    get $currentReport(): Report | undefined;
    get $currentTrigger(): Trigger | undefined;
    get $currentSelector(): Selector | undefined;
    static setDefault(value: CollectionParams, reset?: boolean): void;
    access(mode: any): Promise<boolean | undefined>;
    get $ref(): string | undefined;
    get $readonly(): any;
    setParams(params: CollectionParams): void;
    get $params(): CollectionParams;
    get $appScreenParams(): Record<string, any> | undefined;
    props(): never[];
    render(props: any, context: any): VNode | VNode[] | undefined;
    private buildSelectionContext;
    private selectionContextText;
    private buildReport;
    private buildTrigger;
    private buildSelector;
    selector(): Promise<Selector | undefined>;
    trigger(): Promise<Trigger | undefined>;
    report(): Promise<Report | undefined>;
    getRightMenuTarget(): Promise<MenuTarget | undefined>;
    show(): Promise<void>;
    showSelector(options?: {
        replaceHistory?: boolean;
        syncNavigation?: boolean;
    }): Promise<void>;
    showTrigger(options?: {
        replaceHistory?: boolean;
        syncNavigation?: boolean;
    }): Promise<true | undefined>;
    showReport(item?: any, options?: {
        replaceHistory?: boolean;
        syncNavigation?: boolean;
    }): Promise<void>;
    private applySelectionContextToReport;
    private triggerSelected;
    private showReportWithIndex;
    private itemSelected;
    private reportSaved;
    private reportCancelled;
    private reportFinished;
    private onSelectorCancelled;
    private onTriggerCancelled;
    forceCancel(): Promise<void>;
    canHandleBack(): Promise<boolean>;
    handleBack(): Promise<boolean>;
    serializeNavigationState(): Promise<CollectionNavigationState>;
    restoreNavigationState(state: CollectionNavigationState): Promise<void>;
    setup(props: any, context: any): void;
    private handleOn;
    private hasInternalBackState;
    private buildSelectionItemsFromIds;
    private restorePreviousStateLocally;
    private syncNavigationState;
}
export declare const $COL: (params?: CollectionParams, options?: CollectionOptions) => Collection;
export {};
