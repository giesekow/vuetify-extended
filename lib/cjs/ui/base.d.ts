import { VNode, h, ref, watch } from 'vue';
import { EventEmitter } from './lib';
import { Master } from '../master';
import { type NavigationEntry, type UIText } from './runtime';
export declare class BaseComponent extends EventEmitter {
    private dataStore;
    private forceRenderListeners;
    get $makeRef(): typeof ref;
    get $h(): typeof h;
    get $watch(): typeof watch;
    $get(key: any, def?: any): any;
    $set(key: any, value: any): void;
    $remove(key: any): void;
    props(): never[];
    render(props: any, context: any): VNode | VNode[] | undefined;
    setup(props: any, context: any): void;
    forceRender(): void;
    get component(): import("vue").DefineComponent<{}, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    destructor(): void;
    mounted(): void;
    unmounted(): void;
    attachEventListeners(): void;
    removeEventListeners(): void;
}
export type ReportMode = "display" | "edit" | "create";
export declare class UIBase extends BaseComponent {
    private parent;
    private master?;
    private uid;
    constructor();
    get $master(): Master | undefined;
    get $id(): symbol;
    get $parent(): BaseComponent;
    setParent(parent: UIBase): void;
    setMaster(master: Master): void;
    show(): Promise<void>;
    hide(): Promise<void>;
    forceCancel(): Promise<void>;
    canHandleBack(): Promise<boolean>;
    handleBack(): Promise<boolean>;
    serializeNavigationState(_entry?: NavigationEntry): Promise<any>;
    restoreNavigationState(_state: any, _entry?: NavigationEntry): Promise<void>;
    $text(value: UIText | undefined | null, fallback?: string): string;
    $uiText(key: string, fallback?: string, values?: Record<string, any>): string;
    $formatDate(value: any, options?: any): any;
    $formatNumber(value: number, options?: any): string;
    $formatCurrency(value: number, options?: any): string;
    get $isRTL(): boolean;
}
