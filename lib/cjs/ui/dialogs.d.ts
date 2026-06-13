import { Master } from "../master";
import type { DialogFormOptions, DialogParams } from "./dialogform";
import type { Field, FieldOptions, FieldParams, FieldType } from "./field";
import type { FormOptions, FormParams } from "./form";
import type { Part } from "./part";
export interface PromptParams {
    title?: string;
    text?: string;
    type?: FieldType;
    confirmText?: string;
    cancelText?: string;
    fieldParams?: FieldParams;
    formParams?: FormParams;
    dialogParams?: DialogParams;
}
export interface PromptOptions {
    master?: Master;
    fieldOptions?: Omit<FieldOptions, 'master'>;
    children?: () => Array<Part | Field>;
    formOptions?: Omit<FormOptions, 'master' | 'children'>;
    dialogOptions?: Omit<DialogFormOptions, 'master' | 'form'>;
}
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
    infoWindowWidth?: number | undefined;
    infoWindowHeight?: number | undefined;
}
export interface ImagePreviewOptions {
    title?: string;
    fullscreen?: boolean;
}
export declare class Dialogs {
    private static confirmDialog;
    private static infoDialog;
    private static successDialog;
    private static errorDialog;
    private static warningDialog;
    private static progressDialog;
    private static imagePreviewDialog;
    private static confirmTitle;
    private static confirmText;
    private static infoTitle;
    private static infoText;
    private static infoWidth;
    private static infoHeight;
    private static successText;
    private static errorText;
    private static warningText;
    private static progressValue;
    private static progressText;
    private static progressIndeterminate;
    private static imagePreviewSrc;
    private static imagePreviewTitle;
    private static imagePreviewFullscreen;
    private static confirmYes;
    private static confirmNo;
    private static infoClose;
    private static confirmKeydownHandler?;
    private static rootMounted;
    private static promptForm;
    private static promptVersion;
    private static promptResolver;
    private static options;
    static setOptions(options: DialogOptions): void;
    static get rootIsMounted(): boolean;
    static rootComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
    static confirmComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static infoComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static promptComponent(): import("vue").DefineComponent<Readonly<{}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
    static imagePreviewComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{}>>, {}, {}>;
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
    static $info(text: string, title?: string, options?: {
        width?: number;
        height?: number;
    }): Promise<void>;
    static hasBlockingDialog(): boolean;
    static $imagePreview(src: string, options?: ImagePreviewOptions): Promise<void>;
    static $prompt(params?: PromptParams, options?: PromptOptions): Promise<any | undefined>;
    private static installConfirmKeydownHandler;
    private static removeConfirmKeydownHandler;
    static $error(text: string): void;
    static $success(text: string): void;
    static $warning(text: string): void;
    static $showProgress({ value, text }: any): void;
    static $updateProgress({ value, text }: any): void;
    static $hideProgress(): void;
    private static closePrompt;
    private static createPromptMaster;
    private static clonePromptData;
}
