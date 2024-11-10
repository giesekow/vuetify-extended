import { VNode } from "vue";
import { ReportMode, UIBase } from "./base";
import { Menu } from "./menu";
import { Report } from "./report";
import { Collection } from "./collection";
import { Selector } from "./selector";
import { Field } from "./field";
import { DialogForm } from "./dialogform";
export interface AppParams {
    ref?: string;
    udfQuery?: any;
}
export interface AppOptions {
    menu?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
    udfs?: (app: AppMain, objectType: string | string[], query: any) => Promise<any[]>;
    makeUDF?: (app: AppMain, options: any) => Field | undefined;
}
export interface AppStackItem {
    type: "menu" | "report" | "collection" | "selector" | "ui";
    item: UIBase;
    params: any;
}
export declare class AppMain extends UIBase {
    private params;
    private options;
    private stack;
    private loaded;
    private index;
    private selectors;
    private selectorCount;
    private dialogs;
    private dialogCount;
    constructor(params?: AppParams, options?: AppOptions);
    get $ref(): string | undefined;
    setParams(params: AppParams): void;
    get $params(): AppParams;
    props(): never[];
    menu(): Promise<Menu | undefined>;
    render(props: any, context: any): VNode | VNode[] | undefined;
    private attachEvents;
    $reload(): Promise<void>;
    private loadApp;
    $getUDFs(objectType: string | string[]): Promise<any[]>;
    $makeUDF(options: any, mode?: ReportMode): Field | undefined;
    $showMenu(menu: Menu, params?: any): Promise<void>;
    $showReport(report: Report, params?: any, replace?: boolean): Promise<void>;
    $showCollection(collection: Collection, params?: any, replace?: boolean): Promise<void>;
    $showUI(ui: UIBase, params?: any, replace?: boolean): Promise<void>;
    $showSelector(selector: Selector, params?: any): Promise<void>;
    $showDialog(dialog: DialogForm, params?: any): Promise<void>;
    $back(): Promise<void>;
    $pop(count?: number): Promise<void>;
    private onCancel;
    private onSelectorCancel;
    private onDialogCancel;
}
export declare const $APP: (params?: AppParams, options?: AppOptions) => AppMain;
