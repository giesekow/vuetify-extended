import { Ref, VNode } from "vue";
export interface TableWidgetContext {
    $h: any;
    $readonly: boolean;
    params: Ref<any>;
    modelValue: Ref<any>;
    maxWidth: Ref<any>;
    tableHeaders: Ref<any[]>;
    tableItems: Ref<any[]>;
    tableLoaded: Ref<boolean>;
    tableItemsPerPage: Ref<any>;
    tableTotalItems: Ref<any>;
    tablePage: Ref<any>;
    getCurrentCollectionItems: () => any[];
    setCurrentCollectionItems: (items: any[]) => void;
    getCurrentCollectionFooter: () => any[];
    setCurrentCollectionFooter: (items: any[]) => void;
    loadTableInformation: (options?: any) => void | Promise<void>;
    formatTableItems: (items: any[]) => any[];
    buildTableFooter: (items: any[]) => any[];
    makeHTMLColumns: (headers: any[]) => any;
    handleOn: (event: string, data?: any) => void;
}
export declare function buildTableWidget(field: TableWidgetContext): VNode;
export declare function buildServerTableWidget(field: TableWidgetContext): VNode;
export declare function buildViewTableWidget(field: TableWidgetContext): VNode;
export declare function buildReportTableWidget(field: TableWidgetContext): VNode;
