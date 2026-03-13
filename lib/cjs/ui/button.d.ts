import { VNode } from "vue";
import { UIBase } from "./base";
import { Master } from "../master";
import { OnHandler } from "./lib";
export interface ButtonParams {
    ref?: string;
    readonly?: boolean;
    invisible?: boolean;
    disabled?: boolean;
    icon?: string;
    iconOnly?: boolean;
    appendIcon?: boolean;
    elevation?: string | number;
    color?: string;
    class?: string;
    text?: string;
    flat?: boolean;
    loading?: boolean;
    rounded?: string | number | boolean;
    size?: string | number;
    block?: boolean;
    width?: string | number;
    position?: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky';
    density?: 'default' | 'comfortable' | 'compact';
    variant?: "flat" | "text" | "outlined" | "plain" | "elevated" | "tonal";
}
export interface ButtonOptions {
    master?: Master;
    onClicked?: (button: Button) => void;
    setup?: (button: Button) => void;
    on?: (button: Button) => OnHandler;
}
export declare class Button extends UIBase {
    private params;
    private options;
    private static defaultParams;
    constructor(params?: ButtonParams, options?: ButtonOptions);
    static setDefault(value: ButtonParams, reset?: boolean): void;
    get $ref(): string | undefined;
    get $readonly(): any;
    setParams(params: ButtonParams): void;
    get $params(): ButtonParams;
    props(): never[];
    onClicked(props: any, context: any): void;
    render(props: any, context: any): VNode | undefined;
    private clicked;
    setup(props: any, context: any): void;
    private handleOn;
}
export declare const $BN: (params?: ButtonParams, options?: ButtonOptions) => Button;
