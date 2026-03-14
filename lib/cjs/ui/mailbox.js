"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$MAILBOX_BELL = exports.$MAILBOX = exports.MailboxBell = exports.MailboxView = exports.Mailbox = void 0;
const vue_1 = require("vue");
const base_1 = require("./base");
const appmanager_1 = require("./appmanager");
const dialogs_1 = require("./dialogs");
const components_1 = require("vuetify/components");
class Mailbox {
    static configure(options, reset) {
        Mailbox.options.value = reset ? Object.assign({}, (options || {})) : Object.assign(Object.assign({}, Mailbox.options.value), (options || {}));
    }
    static setOptions(options) {
        Mailbox.configure(options);
    }
    static get itemsRef() {
        return Mailbox.items;
    }
    static get $items() {
        return Mailbox.items.value;
    }
    static get unreadCountRef() {
        return Mailbox.unreadCount;
    }
    static get $unreadCount() {
        return Mailbox.unreadCount.value;
    }
    static get loadingRef() {
        return Mailbox.loading;
    }
    static get $loading() {
        return Mailbox.loading.value;
    }
    static get $loaded() {
        return Mailbox.loaded.value;
    }
    static get hasMoreRef() {
        return Mailbox.hasMore;
    }
    static get $hasMore() {
        return Mailbox.hasMore.value;
    }
    static get $title() {
        return Mailbox.options.value.title || 'Mailbox';
    }
    static setUnread(count) {
        Mailbox.unreadCount.value = Math.max(0, Number(count || 0));
    }
    static push(item) {
        const normalized = Object.assign(Object.assign({}, item), { read: !!item.read });
        Mailbox.items.value = [normalized, ...Mailbox.items.value.filter((existing) => existing.id !== normalized.id)];
        if (!normalized.read) {
            Mailbox.unreadCount.value += 1;
        }
    }
    static replace(items) {
        Mailbox.items.value = items.map((item) => (Object.assign(Object.assign({}, item), { read: !!item.read })));
        Mailbox.unreadCount.value = Mailbox.items.value.filter((item) => !item.read).length;
        Mailbox.loaded.value = true;
    }
    static clear() {
        Mailbox.items.value = [];
        Mailbox.unreadCount.value = 0;
        Mailbox.hasMore.value = false;
        Mailbox.loaded.value = false;
        Mailbox.page.value = 0;
        Mailbox.total.value = undefined;
        Mailbox.nextCursor.value = undefined;
    }
    static refresh(pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return Mailbox.loadPage({ page: 1, cursor: undefined, refresh: true, append: false, pageSize: pageSize || Mailbox.options.value.pageSize || 8 });
        });
    }
    static loadMore(pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Mailbox.loading.value || !Mailbox.hasMore.value) {
                return Mailbox.items.value;
            }
            return Mailbox.loadPage({
                page: Mailbox.page.value + 1,
                cursor: Mailbox.nextCursor.value,
                refresh: false,
                append: true,
                pageSize: pageSize || Mailbox.options.value.pageSize || 8,
            });
        });
    }
    static refreshUnreadCount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Mailbox.options.value.loadUnreadCount) {
                Mailbox.unreadCount.value = Mailbox.items.value.filter((item) => !item.read).length;
                return Mailbox.unreadCount.value;
            }
            const value = yield Mailbox.options.value.loadUnreadCount();
            Mailbox.setUnread(value);
            return Mailbox.unreadCount.value;
        });
    }
    static markRead(item, persist = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = Mailbox.items.value.find((entry) => entry.id === item.id);
            if (target && !target.read) {
                target.read = true;
                Mailbox.unreadCount.value = Math.max(0, Mailbox.unreadCount.value - 1);
                Mailbox.items.value = [...Mailbox.items.value];
            }
            if (persist && Mailbox.options.value.markRead) {
                yield Mailbox.options.value.markRead(item);
            }
        });
    }
    static markReadMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!items || items.length === 0) {
                return;
            }
            const ids = new Set(items.map((item) => item.id));
            let unreadDelta = 0;
            Mailbox.items.value = Mailbox.items.value.map((entry) => {
                if (!ids.has(entry.id)) {
                    return entry;
                }
                if (!entry.read) {
                    unreadDelta += 1;
                }
                return Object.assign(Object.assign({}, entry), { read: true });
            });
            Mailbox.unreadCount.value = Math.max(0, Mailbox.unreadCount.value - unreadDelta);
            if (Mailbox.options.value.markReadMany) {
                yield Mailbox.options.value.markReadMany(items);
                return;
            }
            if (Mailbox.options.value.markRead) {
                for (const item of items) {
                    yield Mailbox.options.value.markRead(item);
                }
            }
        });
    }
    static markUnread(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = Mailbox.items.value.find((entry) => entry.id === item.id);
            if (target && target.read) {
                target.read = false;
                Mailbox.unreadCount.value += 1;
                Mailbox.items.value = [...Mailbox.items.value];
            }
            if (Mailbox.options.value.markUnread) {
                yield Mailbox.options.value.markUnread(item);
            }
        });
    }
    static remove(item) {
        return __awaiter(this, void 0, void 0, function* () {
            Mailbox.items.value = Mailbox.items.value.filter((entry) => entry.id !== item.id);
            if (!item.read) {
                Mailbox.unreadCount.value = Math.max(0, Mailbox.unreadCount.value - 1);
            }
            if (Mailbox.options.value.remove) {
                yield Mailbox.options.value.remove(item);
            }
        });
    }
    static removeMany(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!items || items.length === 0) {
                return;
            }
            const ids = new Set(items.map((item) => item.id));
            const removedUnread = items.filter((item) => !item.read).length;
            Mailbox.items.value = Mailbox.items.value.filter((entry) => !ids.has(entry.id));
            Mailbox.unreadCount.value = Math.max(0, Mailbox.unreadCount.value - removedUnread);
            if (Mailbox.options.value.removeMany) {
                yield Mailbox.options.value.removeMany(items);
                return;
            }
            if (Mailbox.options.value.remove) {
                for (const item of items) {
                    yield Mailbox.options.value.remove(item);
                }
            }
        });
    }
    static openItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mailbox.markRead(item);
            if (!Mailbox.options.value.viewItem) {
                return;
            }
            const report = yield Mailbox.options.value.viewItem(item);
            if (report) {
                appmanager_1.AppManager.showReport(report);
            }
        });
    }
    static loadPage(input) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!Mailbox.options.value.load) {
                Mailbox.loaded.value = true;
                Mailbox.hasMore.value = false;
                return Mailbox.items.value;
            }
            Mailbox.loading.value = true;
            try {
                const response = yield Mailbox.options.value.load({
                    page: input.page,
                    pageSize: input.pageSize,
                    cursor: input.cursor,
                    refresh: input.refresh,
                });
                const normalized = Array.isArray(response) ? { items: response } : response;
                const items = (normalized.items || []).map((item) => (Object.assign(Object.assign({}, item), { read: !!item.read })));
                Mailbox.items.value = input.append ? [...Mailbox.items.value, ...items] : items;
                Mailbox.total.value = normalized.total;
                Mailbox.page.value = input.page;
                Mailbox.nextCursor.value = normalized.nextCursor;
                Mailbox.hasMore.value = (_b = (_a = normalized.hasMore) !== null && _a !== void 0 ? _a : (!!normalized.nextCursor)) !== null && _b !== void 0 ? _b : (typeof normalized.total === 'number' ? Mailbox.items.value.length < normalized.total : items.length >= input.pageSize);
                Mailbox.loaded.value = true;
                if (typeof normalized.unreadCount === 'number') {
                    Mailbox.setUnread(normalized.unreadCount);
                }
                else {
                    Mailbox.unreadCount.value = Mailbox.items.value.filter((item) => !item.read).length;
                }
                return Mailbox.items.value;
            }
            catch (error) {
                dialogs_1.Dialogs.$error((error === null || error === void 0 ? void 0 : error.message) || 'Failed to load mailbox items.');
                return Mailbox.items.value;
            }
            finally {
                Mailbox.loading.value = false;
            }
        });
    }
}
exports.Mailbox = Mailbox;
Mailbox.options = (0, vue_1.ref)({ pageSize: 8, title: 'Mailbox' });
Mailbox.items = (0, vue_1.ref)([]);
Mailbox.unreadCount = (0, vue_1.ref)(0);
Mailbox.loading = (0, vue_1.ref)(false);
Mailbox.loaded = (0, vue_1.ref)(false);
Mailbox.hasMore = (0, vue_1.ref)(false);
Mailbox.page = (0, vue_1.ref)(0);
Mailbox.total = (0, vue_1.ref)(undefined);
Mailbox.nextCursor = (0, vue_1.ref)(undefined);
class MailboxView extends base_1.UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, MailboxView.defaultParams), (params || {})));
        this.selectedIds = this.$makeRef([]);
    }
    static setDefault(value, reset) {
        MailboxView.defaultParams = reset ? value : Object.assign(Object.assign({}, MailboxView.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearSelection();
            if (this.$params.reloadOnShow || !Mailbox.$loaded) {
                yield Mailbox.refresh(this.$params.pageSize);
            }
            yield Mailbox.refreshUnreadCount();
        });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('cancel', this);
        });
    }
    normalizeSize(value) {
        if (value === undefined || value === null || value === '')
            return undefined;
        return typeof value === 'number' ? `${value}px` : value;
    }
    getSelectedItems() {
        const ids = new Set(this.selectedIds.value);
        return Mailbox.$items.filter((item) => ids.has(item.id));
    }
    isSelected(item) {
        return this.selectedIds.value.includes(item.id);
    }
    toggleSelection(item) {
        if (this.isSelected(item)) {
            this.selectedIds.value = this.selectedIds.value.filter((id) => id !== item.id);
            return;
        }
        this.selectedIds.value = [...this.selectedIds.value, item.id];
    }
    clearSelection() {
        this.selectedIds.value = [];
    }
    markSelectedRead() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getSelectedItems().filter((item) => !item.read);
            if (items.length === 0) {
                return;
            }
            yield Mailbox.markReadMany(items);
            this.clearSelection();
        });
    }
    deleteSelected() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = this.getSelectedItems();
            if (items.length === 0) {
                return;
            }
            const accepted = yield dialogs_1.Dialogs.$confirm(`Delete ${items.length} selected mailbox item(s)?`);
            if (!accepted) {
                return;
            }
            yield Mailbox.removeMany(items);
            this.clearSelection();
        });
    }
    render() {
        const h = this.$h;
        const title = this.$params.title || Mailbox.$title;
        const width = typeof this.$params.width === 'number' ? `${this.$params.width}px` : (this.$params.width || '980px');
        const justify = this.$params.horizontalAlign === 'left' ? 'start' : this.$params.horizontalAlign === 'right' ? 'end' : 'center';
        const align = this.$params.verticalAlign === 'center' ? 'center' : this.$params.verticalAlign === 'end' ? 'end' : 'start';
        const listMaxHeight = this.normalizeSize(this.$params.listMaxHeight) || '60vh';
        const selectedCount = this.selectedIds.value.length;
        return h(components_1.VContainer, { fluid: this.$params.fluid }, () => h(components_1.VLayout, { fullHeight: true }, () => h(components_1.VRow, { justify, align }, () => h(components_1.VCol, { cols: 12, style: { paddingTop: '16px', paddingBottom: '16px' } }, () => h('div', { style: { width: '100%', display: 'flex', justifyContent: this.$params.horizontalAlign === 'left' ? 'flex-start' : this.$params.horizontalAlign === 'right' ? 'flex-end' : 'center' } }, [
            h(components_1.VCard, { elevation: 4, style: { width, maxWidth: '100%', overflow: 'hidden' } }, () => [
                h(components_1.VCardTitle, { style: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } }, () => [
                    h(components_1.VIcon, { icon: 'mdi-mailbox-open-up-outline' }),
                    h('span', title),
                    h(components_1.VChip, { size: 'small', color: Mailbox.$unreadCount > 0 ? 'primary' : 'default', variant: Mailbox.$unreadCount > 0 ? 'elevated' : 'outlined' }, () => `${Mailbox.$unreadCount} unread`),
                    ...(selectedCount > 0 ? [h(components_1.VChip, { size: 'small', color: 'secondary', variant: 'outlined' }, () => `${selectedCount} selected`)] : []),
                    h(components_1.VSpacer),
                    h(components_1.VBtn, { icon: 'mdi-refresh', variant: 'text', title: 'Refresh', onClick: () => __awaiter(this, void 0, void 0, function* () { this.clearSelection(); yield Mailbox.refresh(this.$params.pageSize); }) }),
                    h(components_1.VBtn, { icon: 'mdi-close', variant: 'text', title: 'Close', onClick: () => this.forceCancel() }),
                ]),
                ...(selectedCount > 0 ? [
                    h(components_1.VDivider),
                    h(components_1.VCardActions, { style: { padding: '8px 16px', gap: '8px', flexWrap: 'wrap' } }, () => [
                        h(components_1.VBtn, { variant: 'outlined', color: 'primary', prependIcon: 'mdi-email-open-outline', onClick: () => this.markSelectedRead() }, () => 'Mark Selected Read'),
                        h(components_1.VBtn, { variant: 'outlined', color: 'error', prependIcon: 'mdi-delete-outline', onClick: () => this.deleteSelected() }, () => 'Delete Selected'),
                        h(components_1.VBtn, { variant: 'text', onClick: () => this.clearSelection() }, () => 'Clear Selection'),
                    ]),
                ] : []),
                h(components_1.VDivider),
                h(components_1.VCardText, { style: { padding: '0px' } }, () => [
                    Mailbox.$items.length === 0 && !Mailbox.$loading
                        ? h('div', { style: { padding: '24px', textAlign: 'center', opacity: 0.72 } }, 'No mailbox items available.')
                        : h('div', { style: { maxHeight: listMaxHeight, overflowY: 'auto' } }, [
                            h(components_1.VList, { lines: 'three' }, () => Mailbox.$items.map((item) => h(components_1.VListItem, {
                                key: item.id,
                                onClick: () => Mailbox.openItem(item),
                                style: {
                                    cursor: 'pointer',
                                    background: item.read ? undefined : 'rgba(25, 118, 210, 0.08)',
                                    borderLeft: item.read ? '4px solid transparent' : '4px solid rgb(25, 118, 210)',
                                },
                            }, {
                                prepend: () => h('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
                                    h(components_1.VCheckboxBtn, {
                                        modelValue: this.isSelected(item),
                                        density: 'compact',
                                        onClick: (ev) => ev.stopPropagation(),
                                        'onUpdate:modelValue': () => this.toggleSelection(item),
                                    }),
                                    h(components_1.VIcon, { icon: item.icon || (item.read ? 'mdi-email-open-outline' : 'mdi-email-outline'), color: item.read ? undefined : 'primary' }),
                                ]),
                                title: () => h(components_1.VListItemTitle, { style: { fontWeight: item.read ? '500' : '700' } }, () => item.title),
                                subtitle: () => h('div', {}, [
                                    h(components_1.VListItemSubtitle, {}, () => item.text || ''),
                                    h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' } }, [
                                        ...(item.category ? [h(components_1.VChip, { size: 'x-small', variant: 'outlined', color: item.read ? undefined : 'primary' }, () => item.category)] : []),
                                        ...(item.timestamp ? [h('span', { style: { fontSize: '0.72rem', opacity: '0.72' } }, MailboxView.formatTimestamp(item.timestamp))] : []),
                                    ]),
                                ]),
                                append: () => h('div', { style: { display: 'flex', alignItems: 'center', gap: '4px' } }, [
                                    h(components_1.VBtn, { icon: item.read ? 'mdi-email-marked-unread' : 'mdi-email-open-outline', size: 'small', variant: 'text', title: item.read ? 'Mark unread' : 'Mark read', onClick: (ev) => { ev.stopPropagation(); item.read ? Mailbox.markUnread(item) : Mailbox.markRead(item); } }),
                                    h(components_1.VBtn, { icon: 'mdi-delete-outline', size: 'small', variant: 'text', title: 'Remove', onClick: (ev) => { ev.stopPropagation(); Mailbox.remove(item); this.selectedIds.value = this.selectedIds.value.filter((id) => id !== item.id); } }),
                                ]),
                            })))
                        ]),
                    h(components_1.VDivider),
                    h(components_1.VCardActions, { style: { justifyContent: 'space-between', padding: '12px 16px', gap: '8px', flexWrap: 'wrap' } }, () => [
                        h('span', { style: { fontSize: '0.78rem', opacity: '0.72' } }, Mailbox.$loading ? 'Loading mailbox...' : `${Mailbox.$items.length} item(s) loaded${Mailbox.$hasMore ? ' - more available' : ''}`),
                        h('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
                            h(components_1.VBtn, { variant: 'text', disabled: Mailbox.$unreadCount === 0, onClick: () => Mailbox.setUnread(0) }, () => 'Clear Unread Badge'),
                            h(components_1.VBtn, { variant: 'outlined', disabled: !Mailbox.$hasMore || Mailbox.$loading, onClick: () => Mailbox.loadMore(this.$params.pageSize) }, () => Mailbox.$loading ? 'Loading...' : 'Load More'),
                        ]),
                    ]),
                ]),
            ]),
        ])))));
    }
    static formatTimestamp(value) {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            return String(value);
        }
        return date.toLocaleString();
    }
    onMailboxKeydown(ev) {
        if (ev.defaultPrevented || dialogs_1.Dialogs.hasBlockingDialog()) {
            return;
        }
        if (ev.key === 'Escape') {
            ev.preventDefault();
            this.forceCancel();
        }
    }
    attachEventListeners() {
        super.attachEventListeners();
        if (typeof window !== 'undefined' && !this.shortcutHandler) {
            this.shortcutHandler = (ev) => this.onMailboxKeydown(ev);
            window.addEventListener('keydown', this.shortcutHandler);
        }
    }
    removeEventListeners() {
        super.removeEventListeners();
        if (typeof window !== 'undefined' && this.shortcutHandler) {
            window.removeEventListener('keydown', this.shortcutHandler);
            this.shortcutHandler = undefined;
        }
    }
}
exports.MailboxView = MailboxView;
MailboxView.defaultParams = {
    title: 'Mailbox',
    width: 980,
    pageSize: 8,
    reloadOnShow: false,
    horizontalAlign: 'center',
    verticalAlign: 'start',
    fluid: true,
    listMaxHeight: '60vh',
};
class MailboxBell extends base_1.UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, MailboxBell.defaultParams), (params || {})));
    }
    static setDefault(value, reset) {
        MailboxBell.defaultParams = reset ? value : Object.assign(Object.assign({}, MailboxBell.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    mounted() {
        void Mailbox.refreshUnreadCount();
    }
    render() {
        const h = this.$h;
        const count = Mailbox.$unreadCount;
        const display = count > (this.$params.maxBadge || 99) ? `${this.$params.maxBadge}+` : `${count}`;
        return h('div', {
            style: {
                display: 'inline-flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }, [
            h(components_1.VBadge, {
                modelValue: count > 0,
                content: display,
                color: this.$params.badgeColor,
                floating: true,
                location: 'top end',
                offsetX: 15,
                offsetY: 15,
            }, {
                default: () => h(components_1.VBtn, {
                    icon: this.$params.icon,
                    color: this.$params.color,
                    variant: this.$params.variant,
                    title: this.$params.title,
                    'aria-label': this.$params.title,
                    onClick: () => appmanager_1.AppManager.showUI(new MailboxView({ title: Mailbox.$title, width: this.$params.viewWidth })),
                }),
            }),
        ]);
    }
}
exports.MailboxBell = MailboxBell;
MailboxBell.defaultParams = {
    icon: 'mdi-bell-outline',
    color: 'primary',
    variant: 'text',
    badgeColor: 'error',
    maxBadge: 99,
    title: 'Open mailbox',
    viewWidth: 980,
};
const $MAILBOX = (params) => new MailboxView(params || {});
exports.$MAILBOX = $MAILBOX;
const $MAILBOX_BELL = (params) => new MailboxBell(params || {});
exports.$MAILBOX_BELL = $MAILBOX_BELL;
