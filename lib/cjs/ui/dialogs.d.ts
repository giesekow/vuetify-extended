import { Master } from "../master";
import { Button } from "./button";
import type { DialogFormOptions, DialogParams, DialogSizeParams } from "./dialogform";
import type { Field, FieldOptions, FieldParams, FieldType } from "./field";
import type { FormOptions, FormParams } from "./form";
import type { Part } from "./part";
import { type UIText } from "./runtime";
export interface PromptParams extends DialogSizeParams {
    title?: UIText;
    text?: UIText;
    type?: FieldType;
    confirmText?: UIText;
    cancelText?: UIText;
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
export interface ConfirmParams extends DialogSizeParams {
}
export interface InfoParams extends DialogSizeParams {
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
    /** @deprecated Use Dialogs.setInfoDefault({ width }). */
    infoWindowWidth?: number | undefined;
    /** @deprecated Use Dialogs.setInfoDefault({ maxHeight }). */
    infoWindowHeight?: number | undefined;
}
export interface ImagePreviewParams extends DialogSizeParams {
    title?: UIText;
    fullscreen?: boolean;
}
/** @deprecated Use ImagePreviewParams. */
export type ImagePreviewOptions = ImagePreviewParams;
export type IframeSkin = 'inherit' | 'light' | 'dark';
export interface IframeParams extends DialogSizeParams {
    src?: string;
    srcdoc?: string;
    title?: UIText;
    fullscreen?: boolean;
    openUrl?: string;
    downloadUrl?: string;
    prependActions?: boolean;
    skin?: IframeSkin;
    scrim?: string;
    backgroundColor?: string;
    toolbarBackground?: string;
    contentBackground?: string;
    textColor?: string;
    cardStyle?: any;
    toolbarStyle?: any;
    frameStyle?: any;
}
export interface IframeOptions {
    actions?: (params: IframeParams) => Promise<Button[] | undefined> | Button[] | undefined;
}
export interface DocumentPreviewParams extends Omit<IframeParams, 'src' | 'srcdoc' | 'openUrl' | 'downloadUrl'> {
}
export declare class Dialogs {
    private static confirmDialog;
    private static infoDialog;
    private static successDialog;
    private static errorDialog;
    private static warningDialog;
    private static progressDialog;
    private static imagePreviewDialog;
    private static documentPreviewDialog;
    private static confirmTitle;
    private static confirmText;
    private static confirmParams;
    private static infoTitle;
    private static infoText;
    private static infoParams;
    private static successText;
    private static errorText;
    private static warningText;
    private static progressValue;
    private static progressText;
    private static progressIndeterminate;
    private static imagePreviewSrc;
    private static imagePreviewTitle;
    private static imagePreviewFullscreen;
    private static imagePreviewParams;
    private static documentPreviewSrc;
    private static documentPreviewSrcdoc;
    private static documentPreviewRenderSrc;
    private static documentPreviewOpenUrl;
    private static documentPreviewDownloadUrl;
    private static documentPreviewPrependActions;
    private static documentPreviewSkin;
    private static documentPreviewWidth;
    private static documentPreviewMaxWidth;
    private static documentPreviewMinWidth;
    private static documentPreviewHeight;
    private static documentPreviewMaxHeight;
    private static documentPreviewMinHeight;
    private static documentPreviewScrim;
    private static documentPreviewBackgroundColor;
    private static documentPreviewToolbarBackground;
    private static documentPreviewContentBackground;
    private static documentPreviewTextColor;
    private static documentPreviewCardStyle;
    private static documentPreviewToolbarStyle;
    private static documentPreviewFrameStyle;
    private static documentPreviewActions;
    private static documentPreviewTitle;
    private static documentPreviewFullscreen;
    private static documentPreviewObjectUrl?;
    private static confirmYes;
    private static confirmNo;
    private static infoClose;
    private static confirmKeydownHandler?;
    private static rootMounted;
    private static promptForm;
    private static promptVersion;
    private static promptResolver;
    private static promptRequest;
    private static promptReturnFocus;
    private static options;
    private static confirmDefaults;
    private static infoDefaults;
    private static promptDefaults;
    private static imagePreviewDefaults;
    private static iframeDefaults;
    private static documentPreviewDefaults;
    static setOptions(options: DialogOptions): void;
    static setConfirmDefault(value: ConfirmParams, reset?: boolean): void;
    static setInfoDefault(value: InfoParams, reset?: boolean): void;
    static setPromptDefault(value: PromptParams, reset?: boolean): void;
    static setImagePreviewDefault(value: ImagePreviewParams, reset?: boolean): void;
    static setIframeDefault(value: IframeParams, reset?: boolean): void;
    static setDocumentPreviewDefault(value: DocumentPreviewParams, reset?: boolean): void;
    static get rootIsMounted(): boolean;
    static rootComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static confirmComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static infoComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static promptComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static imagePreviewComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static iframeComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static successComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static errorComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static warningComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static progressComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    static $confirm(text: UIText, title?: UIText, params?: ConfirmParams): Promise<boolean>;
    static $info(text: UIText, title?: UIText, params?: InfoParams): Promise<void>;
    static hasBlockingDialog(): boolean;
    static $imagePreview(src: string, params?: ImagePreviewParams): Promise<void>;
    static $iframe(params?: IframeParams, options?: IframeOptions): Promise<void>;
    static $documentPreview(src: string, params?: DocumentPreviewParams, options?: IframeOptions): Promise<void>;
    static $prompt(params?: PromptParams, options?: PromptOptions): Promise<any | undefined>;
    private static installConfirmKeydownHandler;
    private static removeConfirmKeydownHandler;
    static $error(text: UIText): void;
    static $success(text: UIText): void;
    static $warning(text: UIText): void;
    static $showProgress({ value, text }: any): void;
    static $updateProgress({ value, text }: any): void;
    static $hideProgress(): void;
    private static closePrompt;
    private static captureActiveElement;
    private static restorePromptFocus;
    private static resolvePromptParams;
    private static mergePromptParams;
    private static createPromptMaster;
    private static clonePromptData;
    private static createDocumentPreviewRenderSrc;
    private static releaseDocumentPreviewObjectUrl;
    private static decodeDataUrl;
}
