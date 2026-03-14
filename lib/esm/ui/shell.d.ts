import { VNode } from "vue";
import { UIBase } from "./base";
import { Button } from "./button";
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
export interface ShellIconActionParams {
    icon?: string;
    title?: string;
    color?: string;
    variant?: 'flat' | 'text' | 'outlined' | 'plain' | 'elevated' | 'tonal';
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
    iconSize?: string | number;
    badge?: string | number;
    badgeColor?: string;
    disabled?: boolean;
}
export interface ShellIconActionOptions {
    onClicked?: (widget: ShellIconAction) => Promise<void> | void;
}
export declare class ShellIconAction extends UIBase {
    private params;
    private options;
    private static defaultParams;
    constructor(params?: ShellIconActionParams, options?: ShellIconActionOptions);
    static setDefault(value: ShellIconActionParams, reset?: boolean): void;
    get $params(): ShellIconActionParams;
    render(): VNode | undefined;
}
export interface UserAreaParams {
    name?: string;
    subtitle?: string;
    email?: string;
    accountId?: string;
    initials?: string;
    icon?: string;
    avatarSrc?: string;
    avatarAlt?: string;
    avatarColor?: string;
    align?: 'left' | 'right';
    menuWidth?: string | number;
    copyIcon?: string;
    copiedIcon?: string;
    copiedDuration?: number;
}
export interface UserAreaSeparatorEntry {
    type: 'separator';
    label?: string;
    divider?: boolean;
}
export type UserAreaMenuEntry = Button | UserAreaSeparatorEntry;
export interface UserAreaOptions {
    buttons?: (userArea: UserArea) => Promise<UserAreaMenuEntry[]> | UserAreaMenuEntry[];
}
export declare class UserArea extends UIBase {
    private params;
    private options;
    private menuOpen;
    private menuEntries;
    private menuLoading;
    private copyConfirmed;
    private copyResetTimer?;
    private static defaultParams;
    constructor(params?: UserAreaParams, options?: UserAreaOptions);
    static setDefault(value: UserAreaParams, reset?: boolean): void;
    get $params(): UserAreaParams;
    render(): VNode | undefined;
    private buildActivator;
    private buildMenuHeader;
    private buildMenuActions;
    private buildButtonEntry;
    private buildSeparator;
    private ensureMenuEntries;
    private copyAccountId;
    private initialsFromName;
}
export declare const $ATB: (params?: AppTitleBlockParams) => AppTitleBlock;
export declare const $ENV: (params?: EnvironmentTagParams) => EnvironmentTag;
export declare const $STB: (params?: StatusBadgeParams) => StatusBadge;
export declare const $SIA: (params?: ShellIconActionParams, options?: ShellIconActionOptions) => ShellIconAction;
export declare const $USR: (params?: UserAreaParams) => UserArea;
