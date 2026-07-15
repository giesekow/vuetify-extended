import type { Ref } from 'vue';
export interface UITextDescriptor {
    key: string;
    fallback?: string;
    values?: Record<string, any>;
}
export type UIText = string | UITextDescriptor | (() => string);
export interface VuetifyExtendedI18nAdapter {
    localeRef?: Ref<string>;
    t?: (key: string, values?: Record<string, any>) => string;
    formatDate?: (value: any, options?: any) => string;
    formatNumber?: (value: number, options?: any) => string;
    formatCurrency?: (value: number, options?: any) => string;
    isRTL?: (locale?: string) => boolean;
}
export declare function setVuetifyExtendedI18n(adapter?: VuetifyExtendedI18nAdapter): void;
export declare function getVuetifyExtendedI18n(): VuetifyExtendedI18nAdapter | undefined;
export declare function isUITextDescriptor(value: any): value is UITextDescriptor;
export declare function interpolateUITextTemplate(template?: string, values?: Record<string, any>): string;
export declare function $l(key: string, fallback?: string, values?: Record<string, any>): UITextDescriptor;
export declare function $t(key: string, fallback?: string, values?: Record<string, any>): string;
export declare function resolveUIText(value: UIText | undefined | null, fallback?: string): string;
export declare function formatDateText(value: any, options?: any): any;
export declare function formatNumberText(value: number, options?: any): string;
export declare function formatCurrencyText(value: number, options?: any): string;
export declare function isRTLLocale(locale?: string): boolean;
export type NavigationScreenType = 'menu' | 'report' | 'trigger' | 'collection' | 'dashboard' | 'dialog' | 'selector' | 'ui';
export type NavigationStorageMode = 'web-session' | 'web-local' | 'capacitor-preferences' | 'custom';
export type NavigationPersistIntent = boolean | 'default' | 'local';
export interface NavigationMenuRestoreStep {
    index: number;
    text?: string;
    action?: string;
}
export interface NavigationEntry {
    id: string;
    type: NavigationScreenType;
    key?: string;
    title?: string;
    mode?: 'create' | 'edit' | 'display';
    params?: any;
    state?: any;
    menuRestorePath?: NavigationMenuRestoreStep[];
    persistState?: NavigationPersistIntent;
    excludeFromRestore?: boolean;
}
export type NavigationScreenFactory<T = any> = (entry?: NavigationEntry) => Promise<T | undefined> | T | undefined;
export interface InlineNavigationOptions<T = any> {
    key?: string;
    type?: NavigationScreenType;
    title?: UIText;
    params?: any;
    state?: any;
    menuRestorePath?: NavigationMenuRestoreStep[];
    persist?: NavigationPersistIntent;
    excludeFromRestore?: boolean;
    serializeState?: (item: T, entry: NavigationEntry) => Promise<any> | any;
    restoreState?: (item: T, state: any, entry: NavigationEntry) => Promise<void> | void;
    resolveTitle?: (item: T, entry: NavigationEntry) => string | undefined;
}
export interface AppSnapshot {
    version: 1;
    savedAt: number;
    stack: NavigationEntry[];
}
export interface NavigationPersistenceAdapter {
    load(): Promise<AppSnapshot | undefined>;
    save(snapshot: AppSnapshot): Promise<void>;
    clear(): Promise<void>;
}
export interface NavigationRegistryEntry<T = any> {
    key: string;
    type: NavigationScreenType;
    create: (entry: NavigationEntry) => Promise<T | undefined> | T | undefined;
    serializeState?: (item: T, entry: NavigationEntry) => Promise<any> | any;
    restoreState?: (item: T, state: any, entry: NavigationEntry) => Promise<void> | void;
    persistState?: NavigationPersistIntent;
    excludeFromRestore?: boolean;
    title?: (item: T, entry: NavigationEntry) => string | undefined;
}
export interface AppNavigationOptions {
    enabled?: boolean;
    history?: boolean;
    persist?: boolean;
    restoreOnLoad?: boolean;
    storageMode?: NavigationStorageMode;
    storageKey?: string;
    persistence?: NavigationPersistenceAdapter;
}
export interface NavigationTemplate {
    key?: string;
    type?: NavigationScreenType;
    persistState?: NavigationPersistIntent;
    excludeFromRestore?: boolean;
}
export declare function setNavigationTemplate(target: any, template: NavigationTemplate): void;
export declare function getNavigationTemplate(target: any): NavigationTemplate | undefined;
export declare function createNavigationId(): string;
export declare function navigationStorageKey(value?: string): string;
export declare function detectCapacitorEnvironment(): boolean;
export declare function resolveDefaultNavigationStorageMode(): NavigationStorageMode;
export declare function createNavigationPersistenceAdapter(mode: NavigationStorageMode, key?: string): Promise<NavigationPersistenceAdapter>;
export declare function attachCapacitorBackButton(handler: () => Promise<void> | void): Promise<() => void>;
export declare function isValidSnapshot(value: any): value is AppSnapshot;
export declare function isNavigationEntry(value: any): value is NavigationEntry;
export declare function makeSerializable<T = any>(value: T): T | undefined;
export declare function resolvePersistIntent(intent: NavigationPersistIntent | undefined, defaultValue?: NavigationPersistIntent): NavigationPersistIntent;
