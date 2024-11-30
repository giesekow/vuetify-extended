import { VNode } from "vue";
import { UIBase } from "./base";
import { Master } from "../master";
import { Field, Refs } from "./field";
import { Report } from "./report";
import { OnHandler } from "./lib";
export interface PartParams {
    ref?: string;
    readonly?: boolean;
    invisible?: boolean;
    xs?: number | string | undefined;
    sm?: number | string | undefined;
    md?: number | string | undefined;
    lg?: number | string | undefined;
    cols?: number | string | undefined;
    xl?: number | string | undefined;
    xxl?: number | string | undefined;
    alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
    dense?: boolean | undefined;
    justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
    align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}
export interface PartOptions {
    master?: Master;
    validate?: (part: Part) => Promise<string | undefined> | string | undefined;
    topChildren?: (props: any, context: any) => Array<Part | Field>;
    bottomChildren?: (props: any, context: any) => Array<Part | Field>;
    children?: (props: any, context: any) => Array<Part | Field>;
    setup?: (part: Part) => void;
    on?: (part: Part) => OnHandler;
}
export interface PRefs {
    [key: string]: Part;
}
export declare class Part extends UIBase {
    private params;
    private options;
    private childrenInstances;
    private cnt;
    constructor(params?: PartParams, options?: PartOptions);
    get $refs(): Refs;
    get $prefs(): PRefs;
    get $ref(): string | undefined;
    get $readonly(): any;
    get $parentReport(): Report | undefined;
    setParams(params: PartParams): void;
    get $params(): PartParams;
    props(): never[];
    topChildren(props: any, context: any): Array<Part | Field>;
    bottomChildren(props: any, context: any): Array<Part | Field>;
    children(props: any, context: any): Array<Part | Field>;
    render(props: any, context: any): VNode | undefined;
    build(props: any, context: any): VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>;
    validate(): Promise<string | undefined>;
    setup(props: any, context: any): void;
    private handleOn;
}
export declare const $PT: (params?: PartParams, options?: PartOptions) => Part;
