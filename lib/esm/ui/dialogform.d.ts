import { VNode } from "vue";
import { UIBase } from "./base";
import { Form } from "./form";
import { Master } from "../master";
import { OnHandler } from "./lib";
export interface DialogParams {
    ref?: string;
    objectType?: any;
    objectId?: any;
    invisible?: boolean;
    mode?: 'create' | 'edit' | 'display';
    closeOnSave?: boolean;
    fullscreen?: boolean | undefined;
}
export interface DialogFormOptions {
    master?: Master;
    form?: (props: any, context: any) => Promise<Form | undefined> | Form | undefined;
    saved?: () => Promise<void> | void;
    cancel?: () => Promise<void> | void;
    access?: (dialog: DialogForm, mode?: any) => Promise<boolean> | boolean;
    setup?: (dialog: DialogForm) => void;
    on?: (dialog: DialogForm) => OnHandler;
}
export declare class DialogForm extends UIBase {
    private params;
    private hasAccess;
    private options;
    private dialog;
    private loaded;
    private loading;
    private currentForm;
    constructor(params?: DialogParams, options?: DialogFormOptions);
    get $ref(): string | undefined;
    setParams(params: DialogParams): void;
    get $params(): DialogParams;
    get $access(): boolean;
    private runAccess;
    validate(): Promise<string | true | undefined | void>;
    saved(): Promise<void>;
    cancel(): Promise<void>;
    access(mode?: any): Promise<boolean>;
    query(search: string, mode?: 'create' | 'edit' | 'display'): Promise<any>;
    props(): never[];
    render(props: any, context: any): VNode | undefined;
    private buildBody;
    show(): Promise<void>;
    hide(): Promise<void>;
    form(props: any, context: any): Promise<Form | undefined>;
    private initialize;
    private onCancelClicked;
    private onSaved;
    forceCancel(): Promise<void>;
    setup(props: any, context: any): void;
    private handleOn;
}
export declare const $DF: (params?: DialogParams, options?: DialogFormOptions) => DialogForm;
