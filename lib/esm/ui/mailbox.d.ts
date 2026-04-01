import { Ref, VNode } from "vue";
import { UIBase } from "./base";
import { Report } from "./report";
export interface MailboxItem {
    id: string | number;
    title: string;
    text?: string;
    timestamp?: string | Date;
    read?: boolean;
    category?: string;
    icon?: string;
    meta?: any;
}
export interface MailboxLoadParams {
    page: number;
    pageSize: number;
    cursor?: any;
    refresh?: boolean;
}
export interface MailboxPage {
    items: MailboxItem[];
    total?: number;
    unreadCount?: number;
    hasMore?: boolean;
    nextCursor?: any;
}
export interface MailboxOptions {
    title?: string;
    pageSize?: number;
    load?: (params: MailboxLoadParams) => Promise<MailboxPage | MailboxItem[]> | MailboxPage | MailboxItem[];
    viewItem?: (item: MailboxItem) => Promise<Report | undefined> | Report | undefined;
    markRead?: (item: MailboxItem) => Promise<void> | void;
    markReadMany?: (items: MailboxItem[]) => Promise<void> | void;
    markUnread?: (item: MailboxItem) => Promise<void> | void;
    remove?: (item: MailboxItem) => Promise<void> | void;
    removeMany?: (items: MailboxItem[]) => Promise<void> | void;
    loadUnreadCount?: () => Promise<number> | number;
}
export interface MailboxViewParams {
    title?: string;
    width?: string | number;
    pageSize?: number;
    reloadOnShow?: boolean;
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
    fluid?: boolean;
    listMaxHeight?: string | number;
}
export interface MailboxBellParams {
    icon?: string;
    color?: string;
    variant?: 'flat' | 'text' | 'outlined' | 'plain' | 'elevated' | 'tonal';
    badgeColor?: string;
    maxBadge?: number;
    title?: string;
    viewWidth?: string | number;
    hideOnMobile?: boolean;
    hideOnNonMobile?: boolean;
}
export declare class Mailbox {
    private static options;
    private static items;
    private static unreadCount;
    private static loading;
    private static loaded;
    private static hasMore;
    private static page;
    private static total;
    private static nextCursor;
    static configure(options: MailboxOptions, reset?: boolean): void;
    static setOptions(options: MailboxOptions): void;
    static get itemsRef(): Ref<MailboxItem[]>;
    static get $items(): MailboxItem[];
    static get unreadCountRef(): Ref<number>;
    static get $unreadCount(): number;
    static get loadingRef(): Ref<boolean>;
    static get $loading(): boolean;
    static get $loaded(): boolean;
    static get hasMoreRef(): Ref<boolean>;
    static get $hasMore(): boolean;
    static get $title(): string;
    static setUnread(count: number): void;
    static push(item: MailboxItem): void;
    static replace(items: MailboxItem[]): void;
    static clear(): void;
    static refresh(pageSize?: number): Promise<MailboxItem[]>;
    static loadMore(pageSize?: number): Promise<MailboxItem[]>;
    static refreshUnreadCount(): Promise<number>;
    static markRead(item: MailboxItem, persist?: boolean): Promise<void>;
    static markReadMany(items: MailboxItem[]): Promise<void>;
    static markUnread(item: MailboxItem): Promise<void>;
    static remove(item: MailboxItem): Promise<void>;
    static removeMany(items: MailboxItem[]): Promise<void>;
    static openItem(item: MailboxItem): Promise<void>;
    private static loadPage;
}
export declare class MailboxView extends UIBase {
    private params;
    private static defaultParams;
    private shortcutHandler?;
    private selectedIds;
    constructor(params?: MailboxViewParams);
    static setDefault(value: MailboxViewParams, reset?: boolean): void;
    get $params(): MailboxViewParams;
    show(): Promise<void>;
    forceCancel(): Promise<void>;
    private normalizeSize;
    private clampToViewport;
    private getSelectedItems;
    private isSelected;
    private toggleSelection;
    private clearSelection;
    private markSelectedRead;
    private deleteSelected;
    render(): VNode | VNode[] | undefined;
    private static formatTimestamp;
    private onMailboxKeydown;
    attachEventListeners(): void;
    removeEventListeners(): void;
}
export declare class MailboxBell extends UIBase {
    private params;
    private static defaultParams;
    constructor(params?: MailboxBellParams);
    static setDefault(value: MailboxBellParams, reset?: boolean): void;
    get $params(): MailboxBellParams;
    mounted(): void;
    render(): VNode | undefined;
}
export declare const $MAILBOX: (params?: MailboxViewParams) => MailboxView;
export declare const $MAILBOX_BELL: (params?: MailboxBellParams) => MailboxBell;
