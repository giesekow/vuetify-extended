var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { markRaw } from "vue";
import { UIBase } from "./base";
import { Button } from "./button";
import { VAvatar, VBadge, VBtn, VCard, VCardText, VDivider, VIcon, VList, VListItem, VListItemTitle, VMenu, VChip } from 'vuetify/components';
export class AppTitleBlock extends UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, AppTitleBlock.defaultParams), (params || {})));
    }
    static setDefault(value, reset) {
        AppTitleBlock.defaultParams = reset ? value : Object.assign(Object.assign({}, AppTitleBlock.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    render() {
        const h = this.$h;
        const justifyContent = this.$params.align === 'center' ? 'center' : this.$params.align === 'right' ? 'flex-end' : 'flex-start';
        const textAlign = this.$params.align || 'left';
        return h('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent,
                textAlign,
            },
        }, [
            ...(this.$params.icon ? [h(VAvatar, {
                    color: this.$params.color || 'primary',
                    variant: 'tonal',
                    size: 40,
                }, () => h(VIcon, {}, () => this.$params.icon || ''))] : []),
            h('div', {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    overflow: 'visible',
                },
            }, [
                ...(this.$params.overline ? [h('div', { style: { fontSize: '0.68rem', lineHeight: '1.2', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: '0.72' } }, this.$params.overline)] : []),
                h('div', { style: { fontSize: '1rem', lineHeight: '1.2', fontWeight: '700', color: this.$params.color || 'inherit' } }, this.$params.title || ''),
                ...(this.$params.subtitle ? [h('div', { style: { fontSize: '0.78rem', lineHeight: '1.2', opacity: '0.74' } }, this.$params.subtitle)] : []),
            ]),
        ]);
    }
}
AppTitleBlock.defaultParams = {};
export class EnvironmentTag extends UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, EnvironmentTag.defaultParams), (params || {})));
    }
    static setDefault(value, reset) {
        EnvironmentTag.defaultParams = reset ? value : Object.assign(Object.assign({}, EnvironmentTag.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    render() {
        if (!this.$params.text)
            return undefined;
        const h = this.$h;
        return h(VChip, {
            color: this.$params.color,
            variant: this.$params.variant,
            size: this.$params.size,
            label: true,
        }, () => this.$params.text || '');
    }
}
EnvironmentTag.defaultParams = {
    color: 'warning',
    variant: 'tonal',
    size: 'small',
};
export class StatusBadge extends UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, StatusBadge.defaultParams), (params || {})));
    }
    static setDefault(value, reset) {
        StatusBadge.defaultParams = reset ? value : Object.assign(Object.assign({}, StatusBadge.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    render() {
        if (!this.$params.text)
            return undefined;
        const h = this.$h;
        return h(VChip, {
            color: this.$params.color,
            variant: this.$params.variant,
            size: this.$params.size,
            prependIcon: this.$params.icon,
            label: true,
        }, () => this.$params.text || '');
    }
}
StatusBadge.defaultParams = {
    color: 'primary',
    variant: 'tonal',
    size: 'small',
};
export class ShellIconAction extends UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, ShellIconAction.defaultParams), (params || {})));
        this.options = options || {};
    }
    static setDefault(value, reset) {
        ShellIconAction.defaultParams = reset ? value : Object.assign(Object.assign({}, ShellIconAction.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    render() {
        if (!this.$params.icon) {
            return undefined;
        }
        const h = this.$h;
        const button = h(VBtn, {
            icon: true,
            color: this.$params.color,
            variant: this.$params.variant,
            size: this.$params.size,
            disabled: this.$params.disabled,
            title: this.$params.title,
            'aria-label': this.$params.title || 'Shell action',
            style: {
                height: 'auto',
                minWidth: '0',
                paddingInline: '4px',
                paddingBlock: '4px',
                borderRadius: '999px',
            },
            onClick: () => {
                var _a, _b;
                if (!this.$params.disabled) {
                    void ((_b = (_a = this.options).onClicked) === null || _b === void 0 ? void 0 : _b.call(_a, this));
                }
            },
        }, () => h(VIcon, {
            size: this.$params.iconSize,
        }, () => this.$params.icon || ''));
        if (this.$params.badge === undefined || this.$params.badge === null || this.$params.badge === '') {
            return button;
        }
        return h('div', {
            style: {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }, [
            h(VBadge, {
                content: this.$params.badge,
                color: this.$params.badgeColor,
                floating: true,
                location: 'top end',
                offsetX: 0,
                offsetY: 0,
            }, {
                default: () => button,
            }),
        ]);
    }
}
ShellIconAction.defaultParams = {
    color: 'primary',
    variant: 'text',
    size: 'default',
    badgeColor: 'error',
};
export class UserArea extends UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, UserArea.defaultParams), (params || {})));
        this.options = options || {};
        this.menuOpen = this.$makeRef(false);
        this.menuEntries = this.$makeRef([]);
        this.menuLoading = this.$makeRef(false);
        this.copyConfirmed = this.$makeRef(false);
    }
    static setDefault(value, reset) {
        UserArea.defaultParams = reset ? value : Object.assign(Object.assign({}, UserArea.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    render() {
        if (!this.$params.name && !this.$params.initials && !this.$params.icon) {
            return undefined;
        }
        const h = this.$h;
        return h(VMenu, {
            modelValue: this.menuOpen.value,
            'onUpdate:modelValue': (value) => {
                this.menuOpen.value = value;
                if (value) {
                    void this.ensureMenuEntries();
                }
            },
            location: this.$params.align === 'left' ? 'bottom start' : 'bottom end',
            origin: this.$params.align === 'left' ? 'top start' : 'top end',
            offset: 10,
            closeOnClick: true,
            closeOnContentClick: true,
            closeOnBack: true,
        }, {
            activator: ({ props: activatorProps }) => h(VBtn, Object.assign(Object.assign({}, activatorProps), { variant: 'text', style: {
                    height: '40px',
                    width: '40px',
                    minWidth: '40px',
                    paddingInline: '0',
                    paddingBlock: '0',
                    textTransform: 'none',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }, 'aria-label': this.$params.name || 'Open user menu' }), () => this.buildActivator()),
            default: () => h(VCard, {
                elevation: 10,
                rounded: 'lg',
                style: {
                    width: typeof this.$params.menuWidth === 'number' ? `${this.$params.menuWidth}px` : (this.$params.menuWidth || '320px'),
                    maxWidth: 'calc(100vw - 24px)',
                    overflow: 'hidden',
                },
            }, () => {
                const content = [this.buildMenuHeader()];
                const actionSection = this.buildMenuActions();
                if (actionSection) {
                    content.push(h(VDivider));
                    content.push(actionSection);
                }
                return content;
            }),
        });
    }
    buildActivator() {
        const h = this.$h;
        const avatarProps = {
            color: this.$params.avatarColor,
            variant: 'tonal',
            size: 38,
            'aria-label': this.$params.avatarAlt || this.$params.name || 'User avatar',
        };
        if (this.$params.avatarSrc) {
            avatarProps.image = this.$params.avatarSrc;
            avatarProps.alt = this.$params.avatarAlt || this.$params.name || 'User avatar';
            return h(VAvatar, avatarProps);
        }
        return h(VAvatar, avatarProps, () => this.$params.icon ? h(VIcon, {}, () => this.$params.icon || '') : (this.$params.initials || this.initialsFromName()));
    }
    buildMenuHeader() {
        const h = this.$h;
        const infoRows = [
            h('div', { style: { fontSize: '1.05rem', fontWeight: '700', lineHeight: '1.2' } }, this.$params.name || ''),
            ...(this.$params.subtitle ? [h('div', { style: { fontSize: '0.92rem', opacity: '0.78', lineHeight: '1.2', marginTop: '2px' } }, this.$params.subtitle)] : []),
            ...(this.$params.email ? [h('div', { style: { fontSize: '0.9rem', opacity: '0.72', lineHeight: '1.2', marginTop: this.$params.subtitle ? '2px' : '4px' } }, this.$params.email)] : []),
        ];
        if (this.$params.accountId) {
            infoRows.push(h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' } }, [
                h('div', { style: { flex: '1 1 auto', minWidth: 0 } }, [
                    h('div', { style: { fontSize: '1rem', fontWeight: '600', lineHeight: '1.2', letterSpacing: '0.02em' } }, this.$params.accountId),
                    h('div', { style: { fontSize: '0.82rem', opacity: '0.72', lineHeight: '1.2', marginTop: '4px' } }, 'Account ID'),
                ]),
                h(VBtn, {
                    icon: this.copyConfirmed.value ? (this.$params.copiedIcon || 'mdi-check') : this.$params.copyIcon,
                    variant: 'text',
                    size: 'small',
                    color: this.copyConfirmed.value ? 'success' : undefined,
                    title: this.copyConfirmed.value ? 'Copied' : 'Copy account ID',
                    'aria-label': this.copyConfirmed.value ? 'Account ID copied' : 'Copy account ID',
                    onClick: (ev) => __awaiter(this, void 0, void 0, function* () {
                        ev.stopPropagation();
                        yield this.copyAccountId();
                    }),
                }),
            ]));
        }
        return h(VCardText, { style: { padding: '16px 18px' } }, () => infoRows);
    }
    buildMenuActions() {
        const h = this.$h;
        if (this.menuLoading.value) {
            return h(VList, { density: 'comfortable', nav: true, style: { paddingTop: '4px', paddingBottom: '8px' } }, () => [
                h(VListItem, { style: { minHeight: '52px' } }, {
                    default: () => h(VListItemTitle, { style: { fontSize: '0.92rem', opacity: '0.72' } }, () => 'Loading...'),
                }),
            ]);
        }
        if (!this.menuEntries.value.length) {
            return undefined;
        }
        const rows = [];
        for (const entry of this.menuEntries.value) {
            if (entry instanceof Button) {
                rows.push(this.buildButtonEntry(entry));
                continue;
            }
            rows.push(this.buildSeparator(entry));
        }
        return h(VList, { density: 'comfortable', nav: true, style: { paddingTop: '4px', paddingBottom: '8px' } }, () => rows);
    }
    buildButtonEntry(entry) {
        const h = this.$h;
        const params = entry.$params;
        return h(VListItem, {
            onClick: () => {
                this.menuOpen.value = false;
                entry.triggerShortcut();
            },
            style: { minHeight: '52px', cursor: 'pointer' },
            title: params.tooltip,
            'aria-label': params.tooltip || params.text || 'User menu action',
        }, {
            prepend: () => params.icon ? h(VIcon, { size: 22, style: { opacity: '0.72' } }, () => params.icon || '') : undefined,
            default: () => h(VListItemTitle, { style: { fontSize: '0.96rem', fontWeight: '500' } }, () => params.text || ''),
        });
    }
    buildSeparator(entry) {
        const h = this.$h;
        return h('div', {
            style: {
                padding: entry.label ? '8px 18px 6px 18px' : '0',
            },
        }, [
            ...(entry.label ? [h('div', {
                    style: {
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        opacity: '0.58',
                        marginBottom: entry.divider === false ? '0' : '8px',
                    },
                }, entry.label)] : []),
            ...(entry.divider === false ? [] : [h(VDivider)]),
        ]);
    }
    ensureMenuEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.options.buttons) {
                this.menuEntries.value = [];
                return;
            }
            this.menuLoading.value = true;
            try {
                const entries = yield this.options.buttons(this);
                const normalized = (entries || []).filter(Boolean).map((entry) => {
                    if (entry instanceof Button) {
                        entry.setParent(this);
                        return markRaw(entry);
                    }
                    return entry;
                });
                this.menuEntries.value = normalized;
            }
            finally {
                this.menuLoading.value = false;
            }
        });
    }
    copyAccountId() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.$params.accountId;
            if (!value || typeof navigator === 'undefined' || !((_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText)) {
                return;
            }
            try {
                yield navigator.clipboard.writeText(value);
                this.copyConfirmed.value = true;
                if (this.copyResetTimer) {
                    clearTimeout(this.copyResetTimer);
                }
                this.copyResetTimer = setTimeout(() => {
                    this.copyConfirmed.value = false;
                    this.copyResetTimer = undefined;
                }, Number(this.$params.copiedDuration || 2200));
            }
            catch (error) {
                // Ignore clipboard write failures in unsupported contexts.
            }
        });
    }
    initialsFromName() {
        return (this.$params.name || '').split(' ').filter(Boolean).slice(0, 2).map((item) => { var _a; return ((_a = item[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || ''; }).join('');
    }
}
UserArea.defaultParams = {
    avatarColor: 'secondary',
    align: 'right',
    menuWidth: 320,
    copyIcon: 'mdi-content-copy',
    copiedIcon: 'mdi-check',
    copiedDuration: 2200,
};
export const $ATB = (params) => new AppTitleBlock(params || {});
export const $ENV = (params) => new EnvironmentTag(params || {});
export const $STB = (params) => new StatusBadge(params || {});
export const $SIA = (params, options) => new ShellIconAction(params || {}, options || {});
export const $USR = (params) => new UserArea(params || {});
