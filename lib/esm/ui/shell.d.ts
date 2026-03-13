import { VNode } from "vue";
import { UIBase } from "./base";
export interface AppTitleBlockParams {
    title?: string;
    subtitle?: string;
    overline?: string;
    icon?: string;
    color?: string;
    align?: 'left' | 'center' | 'right';
}
export declare class AppTitleBlock extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: AppTitleBlockParams);
    static setDefault(value: AppTitleBlockParams, reset?: boolean): void;
    get $params(): AppTitleBlockParams;
    render(): VNode | undefined;
}
export interface EnvironmentTagParams {
    text?: string;
    color?: string;
    variant?: 'flat' | 'text' | 'outlined' | 'plain' | 'elevated' | 'tonal';
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
}
export declare class EnvironmentTag extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: EnvironmentTagParams);
    static setDefault(value: EnvironmentTagParams, reset?: boolean): void;
    get $params(): EnvironmentTagParams;
    render(): VNode | undefined;
}
export interface StatusBadgeParams {
    text?: string;
    icon?: string;
    color?: string;
    variant?: 'flat' | 'text' | 'outlined' | 'plain' | 'elevated' | 'tonal';
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
}
export declare class StatusBadge extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: StatusBadgeParams);
    static setDefault(value: StatusBadgeParams, reset?: boolean): void;
    get $params(): StatusBadgeParams;
    render(): VNode | undefined;
}
export interface UserAreaParams {
    name?: string;
    subtitle?: string;
    initials?: string;
    icon?: string;
    avatarColor?: string;
    align?: 'left' | 'right';
}
export declare class UserArea extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: UserAreaParams);
    static setDefault(value: UserAreaParams, reset?: boolean): void;
    get $params(): UserAreaParams;
    render(): VNode | undefined;
    private initialsFromName;
}
export declare const $ATB: (params?: AppTitleBlockParams) => AppTitleBlock;
export declare const $ENV: (params?: EnvironmentTagParams) => EnvironmentTag;
export declare const $STB: (params?: StatusBadgeParams) => StatusBadge;
export declare const $USR: (params?: UserAreaParams) => UserArea;
