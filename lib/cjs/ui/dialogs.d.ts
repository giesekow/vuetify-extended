export interface DialogOptions {
    confirmColor?: string | undefined;
    successColor?: string | undefined;
    errorColor?: string | undefined;
    warningColor?: string | undefined;
    progressColor?: string | undefined;
    successTimeout?: number | undefined;
    errorTimeout?: number | undefined;
    warningTimeout?: number | undefined;
    progressSize?: number | undefined;
    progressWidth?: number | undefined;
}
export declare class Dialogs {
    private static confirmDialog;
    private static successDialog;
    private static errorDialog;
    private static warningDialog;
    private static progressDialog;
    private static confirmTitle;
    private static confirmText;
    private static successText;
    private static errorText;
    private static warningText;
    private static progressValue;
    private static progressText;
    private static progressIndeterminate;
    private static confirmYes;
    private static confirmNo;
    private static options;
    static setOptions(options: DialogOptions): void;
    static confirmComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static successComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static errorComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static warningComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static progressComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static $confirm(text: string, title?: string): Promise<boolean>;
    static $error(text: string): void;
    static $success(text: string): void;
    static $warning(text: string): void;
    static $showProgress({ value, text }: any): void;
    static $updateProgress({ value, text }: any): void;
    static $hideProgress(): void;
}
