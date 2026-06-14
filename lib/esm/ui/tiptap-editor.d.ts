import { PropType } from 'vue';
type TiptapAdapterEvent = 'init' | 'keydown';
export interface TiptapHtmlEditorAdapter {
    isReady: boolean;
    on: (event: TiptapAdapterEvent, handler: (...args: any[]) => void) => void;
    focus: () => void;
    getBody: () => HTMLElement | null;
    getHTML: () => string;
}
export declare const TiptapHtmlEditor: import("vue").DefineComponent<{
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
    height: {
        type: PropType<string | number | undefined>;
        default: number;
    };
    allowFullscreen: {
        type: BooleanConstructor;
        default: boolean;
    };
}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "ready")[], "update:modelValue" | "ready", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
    height: {
        type: PropType<string | number | undefined>;
        default: number;
    };
    allowFullscreen: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onReady?: ((...args: any[]) => any) | undefined;
}, {
    readonly: boolean;
    disabled: boolean;
    height: string | number | undefined;
    modelValue: string;
    placeholder: string;
    allowFullscreen: boolean;
}, {}>;
export {};
