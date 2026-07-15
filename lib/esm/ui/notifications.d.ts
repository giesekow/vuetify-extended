import { Button } from "./button";
import { type UIText } from "./runtime";
export type NotificationLocation = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type NotificationSurfaceStyle = 'opaque' | 'translucent';
export interface NotificationOptions {
    successColor?: string;
    errorColor?: string;
    warningColor?: string;
    infoColor?: string;
    defaultTimeout?: number;
    successTimeout?: number;
    errorTimeout?: number;
    warningTimeout?: number;
    infoTimeout?: number;
    location?: NotificationLocation;
    maxVisible?: number;
    surfaceStyle?: NotificationSurfaceStyle;
    surfaceOpacity?: number;
    surfaceBlur?: string | number;
}
export interface NotificationItem {
    id: number;
    title?: UIText;
    text: UIText;
    color?: string;
    icon?: string;
    timeout?: number;
    closable?: boolean;
    persistent?: boolean;
    location?: NotificationLocation;
    actions?: Button[];
}
export interface NotificationPayload {
    title?: UIText;
    text: UIText;
    color?: string;
    icon?: string;
    timeout?: number;
    closable?: boolean;
    persistent?: boolean;
    location?: NotificationLocation;
    actions?: Button[];
}
export declare class Notifications {
    private static items;
    private static options;
    private static rootMounted;
    private static timers;
    private static nextId;
    static setOptions(options: NotificationOptions): void;
    static setDefault(options: NotificationOptions, reset?: boolean): void;
    static get rootIsMounted(): boolean;
    static rootComponent(): import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | undefined, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    private static renderRoot;
    private static renderItem;
    private static containerStyle;
    private static normalizeActions;
    private static enqueue;
    private static scheduleDismiss;
    private static clearTimer;
    static dismiss(id: number): void;
    static clear(): void;
    static $push(payload: NotificationPayload): number;
    static $info(text: UIText, payload?: Partial<Omit<NotificationPayload, 'text'>>): number;
    static $success(text: UIText, payload?: Partial<Omit<NotificationPayload, 'text'>>): number;
    static $warning(text: UIText, payload?: Partial<Omit<NotificationPayload, 'text'>>): number;
    static $error(text: UIText, payload?: Partial<Omit<NotificationPayload, 'text'>>): number;
}
