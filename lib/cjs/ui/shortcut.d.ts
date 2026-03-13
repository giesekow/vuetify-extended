export interface ShortcutNormalizationOptions {
    cmdForCtrlOnMac?: boolean;
}
export interface ShortcutDescriptor {
    normalized: string;
    key: string;
    label: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
}
export interface ButtonShortcutDescriptor {
    normalized: string;
    key: string;
    label: string;
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
    meta: boolean;
}
export declare function normalizeShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): string | undefined;
export declare function normalizeShortcutFromEvent(ev: KeyboardEvent, options?: ShortcutNormalizationOptions): string | undefined;
export declare function normalizeButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): string | undefined;
export declare function normalizeButtonShortcutFromEvent(ev: KeyboardEvent, options?: ShortcutNormalizationOptions): string | undefined;
export declare function describeShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): ShortcutDescriptor | undefined;
export declare function describeButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): ButtonShortcutDescriptor | undefined;
export declare function normalizeShortcutKey(key?: string): string | undefined;
export declare function shouldIgnoreShortcutTarget(target: EventTarget | null): boolean;
export declare function formatButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): string | undefined;
export declare function formatShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): string | undefined;
