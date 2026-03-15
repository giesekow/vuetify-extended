import { Ref, VNode } from "vue";
export interface RichWidgetContext {
    $h: any;
    $readonly: boolean;
    $makeRef: any;
    $watch: any;
    params: Ref<any>;
    modelValue: Ref<any>;
    maxWidth: Ref<any>;
    getState: <T>(key: string, init: () => T) => T;
    codePreview: Ref<any>;
    chartLoaded: Ref<boolean>;
    chartOpts: Ref<any>;
    chartValue: Ref<any>;
    renderMathInHtml: (html: string) => string;
    showPreviewFullscreen: (html: string) => void;
    registerHtmlEditor: (editor: any) => void;
    onHtmlEditorReady: (editor: any) => void;
    renderLatex: (value: string) => void;
    loadChart: () => void;
    messageFormat: (data: any) => any[];
    showMediaFullscreen: (data: string) => void;
    getMessageWindow: (items: any[]) => {
        items: any[];
        hasEarlier: boolean;
        earlierCount: number;
        pageSize: number;
    };
    loadEarlierMessages: (total: number) => void | Promise<void>;
    setMessageScrollContainer: (el: Element | any) => void;
}
export declare function buildHTMLWidget(field: RichWidgetContext): VNode;
export declare function buildCodeWidget(field: RichWidgetContext): VNode[];
export declare function buildMessageBoxWidget(field: RichWidgetContext): VNode;
export declare function buildChartWidget(field: RichWidgetContext): VNode[] | undefined;
export declare function buildMapWidget(field: RichWidgetContext): VNode[];
export declare function buildImageWidget(field: RichWidgetContext): VNode;
