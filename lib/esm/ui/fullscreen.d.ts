import { VNode } from "vue";
import { UIBase } from "./base";
interface FullScreenBaseParams {
    title?: string;
    subtitle?: string;
    message?: string;
    icon?: string;
    iconColor?: string;
    logo?: string;
    logoAlt?: string;
    backgroundColor?: string;
    backgroundGradient?: string;
    backgroundImage?: string;
    backgroundOverlay?: string;
    cardColor?: string;
    textColor?: string;
    titleColor?: string;
    maxWidth?: string | number;
    minHeight?: string | number;
}
export interface AccessDeniedScreenParams extends FullScreenBaseParams {
    actionText?: string;
}
export interface AccessDeniedScreenOptions {
    action?: (screen: AccessDeniedScreen) => Promise<void> | void;
}
export declare class AccessDeniedScreen extends UIBase {
    private params;
    private options;
    private static defaultParams;
    constructor(params?: AccessDeniedScreenParams, options?: AccessDeniedScreenOptions);
    static setDefault(value: AccessDeniedScreenParams, reset?: boolean): void;
    get $params(): AccessDeniedScreenParams;
    forceCancel(): Promise<void>;
    render(): VNode | undefined;
}
export interface SplashScreenParams extends FullScreenBaseParams {
    loadingText?: string;
    progress?: number;
    indeterminate?: boolean;
    progressColor?: string;
    progressSize?: string | number;
}
export declare class SplashScreen extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: SplashScreenParams);
    static setDefault(value: SplashScreenParams, reset?: boolean): void;
    get $params(): SplashScreenParams;
    forceCancel(): Promise<void>;
    render(): VNode | undefined;
}
export declare const $AccessDeniedScreen: (params?: AccessDeniedScreenParams, options?: AccessDeniedScreenOptions) => AccessDeniedScreen;
export declare const $SplashScreen: (params?: SplashScreenParams) => SplashScreen;
export {};
