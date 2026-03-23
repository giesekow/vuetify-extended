import { VNode, h, ref, watch } from 'vue';
import { EventEmitter } from './lib';
import { Master } from '../master';
export declare class BaseComponent extends EventEmitter {
    private dataStore;
    private renderVersion;
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
    get component(): import("vue").DefineComponent<Readonly<{}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}, {}>;
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
}
