import { PropType } from 'vue';
import { type HtmlEditorProfile, type HtmlEditorToolbarItem } from './html-editor-options';
type TiptapAdapterEvent = 'init' | 'keydown';
export interface TiptapHtmlEditorAdapter {
    isReady: boolean;
    on: (event: TiptapAdapterEvent, handler: (...args: any[]) => void) => void;
    focus: () => void;
    getBody: () => HTMLElement | null;
    getHTML: () => string;
}
export declare const TiptapHtmlEditor: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
    hint: {
        type: StringConstructor;
        default: string;
    };
    errorMessage: {
        type: StringConstructor;
        default: string;
    };
    required: {
        type: BooleanConstructor;
        default: boolean;
    };
    height: {
        type: PropType<string | number | undefined>;
        default: number;
    };
    profile: {
        type: PropType<HtmlEditorProfile>;
        default: string;
    };
    toolbar: {
        type: PropType<HtmlEditorToolbarItem[] | undefined>;
        default: undefined;
    };
    allowFullscreen: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "ready")[], "update:modelValue" | "ready", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    readonly: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
    hint: {
        type: StringConstructor;
        default: string;
    };
    errorMessage: {
        type: StringConstructor;
        default: string;
    };
    required: {
        type: BooleanConstructor;
        default: boolean;
    };
    height: {
        type: PropType<string | number | undefined>;
        default: number;
    };
    profile: {
        type: PropType<HtmlEditorProfile>;
        default: string;
    };
    toolbar: {
        type: PropType<HtmlEditorToolbarItem[] | undefined>;
        default: undefined;
    };
    allowFullscreen: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
}>, {
    readonly: boolean;
    label: string;
    disabled: boolean;
    height: string | number | undefined;
    modelValue: string;
    required: boolean;
    hint: string;
    placeholder: string;
    toolbar: HtmlEditorToolbarItem[] | undefined;
    allowFullscreen: boolean;
    errorMessage: string;
    profile: HtmlEditorProfile;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export {};
