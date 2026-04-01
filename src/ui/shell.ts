import { Ref, VNode, markRaw } from "vue";
import { UIBase } from "./base";
import { Button } from "./button";
import { VAvatar, VBadge, VBtn, VCard, VCardText, VDivider, VIcon, VList, VListItem, VListItemTitle, VMenu, VChip } from 'vuetify/components';

export interface ShellResponsiveVisibilityParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
}

export interface AppTitleBlockParams extends ShellResponsiveVisibilityParams {
  title?: string;
  subtitle?: string;
  overline?: string;
  icon?: string;
  image?: string;
  color?: string;
  align?: 'left'|'center'|'right';
}

export class AppTitleBlock extends UIBase {
  private params: Ref<AppTitleBlockParams>;
  private static defaultParams: AppTitleBlockParams = {};

  constructor(params?: AppTitleBlockParams) {
    super();
    this.params = this.$makeRef({ ...AppTitleBlock.defaultParams, ...(params || {}) });
  }

  static setDefault(value: AppTitleBlockParams, reset?: boolean) {
    AppTitleBlock.defaultParams = reset ? value : { ...AppTitleBlock.defaultParams, ...value };
  }

  get $params() {
    return this.params.value;
  }

  render(): VNode | undefined {
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
      ...(this.$params.image ? [h(VAvatar, {
        size: 40,
      }, () => h('img', {
        src: this.$params.image,
        alt: this.$params.title || 'App title image',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        },
      }))] : this.$params.icon ? [h(VAvatar, {
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

export interface EnvironmentTagParams extends ShellResponsiveVisibilityParams {
  text?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}

export class EnvironmentTag extends UIBase {
  private params: Ref<EnvironmentTagParams>;
  private static defaultParams: EnvironmentTagParams = {
    color: 'warning',
    variant: 'tonal',
    size: 'small',
  };

  constructor(params?: EnvironmentTagParams) {
    super();
    this.params = this.$makeRef({ ...EnvironmentTag.defaultParams, ...(params || {}) });
  }

  static setDefault(value: EnvironmentTagParams, reset?: boolean) {
    EnvironmentTag.defaultParams = reset ? value : { ...EnvironmentTag.defaultParams, ...value };
  }

  get $params() {
    return this.params.value;
  }

  render(): VNode | undefined {
    if (!this.$params.text) return undefined;
    const h = this.$h;
    return h(VChip, {
      color: this.$params.color,
      variant: this.$params.variant,
      size: this.$params.size,
      label: true,
    }, () => this.$params.text || '');
  }
}

export interface StatusBadgeParams extends ShellResponsiveVisibilityParams {
  text?: string;
  icon?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}

export class StatusBadge extends UIBase {
  private params: Ref<StatusBadgeParams>;
  private static defaultParams: StatusBadgeParams = {
    color: 'primary',
    variant: 'tonal',
    size: 'small',
  };

  constructor(params?: StatusBadgeParams) {
    super();
    this.params = this.$makeRef({ ...StatusBadge.defaultParams, ...(params || {}) });
  }

  static setDefault(value: StatusBadgeParams, reset?: boolean) {
    StatusBadge.defaultParams = reset ? value : { ...StatusBadge.defaultParams, ...value };
  }

  get $params() {
    return this.params.value;
  }

  render(): VNode | undefined {
    if (!this.$params.text) return undefined;
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


export interface ShellIconActionParams extends ShellResponsiveVisibilityParams {
  icon?: string;
  title?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
  iconSize?: string | number;
  badge?: string | number;
  badgeColor?: string;
  disabled?: boolean;
}

export interface ShellIconActionOptions {
  onClicked?: (widget: ShellIconAction) => Promise<void> | void;
}

export class ShellIconAction extends UIBase {
  private params: Ref<ShellIconActionParams>;
  private options: ShellIconActionOptions;
  private static defaultParams: ShellIconActionParams = {
    color: 'primary',
    variant: 'text',
    size: 'default',
    badgeColor: 'error',
  };

  constructor(params?: ShellIconActionParams, options?: ShellIconActionOptions) {
    super();
    this.params = this.$makeRef({ ...ShellIconAction.defaultParams, ...(params || {}) });
    this.options = options || {};
  }

  static setDefault(value: ShellIconActionParams, reset?: boolean) {
    ShellIconAction.defaultParams = reset ? value : { ...ShellIconAction.defaultParams, ...value };
  }

  get $params() {
    return this.params.value;
  }

  render(): VNode | undefined {
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
        if (!this.$params.disabled) {
          void this.options.onClicked?.(this);
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

export interface UserAreaParams extends ShellResponsiveVisibilityParams {
  name?: string;
  subtitle?: string;
  email?: string;
  accountId?: string;
  initials?: string;
  icon?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarColor?: string;
  align?: 'left'|'right';
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

export class UserArea extends UIBase {
  private params: Ref<UserAreaParams>;
  private options: UserAreaOptions;
  private menuOpen: Ref<boolean>;
  private menuEntries: Ref<UserAreaMenuEntry[]>;
  private menuLoading: Ref<boolean>;
  private copyConfirmed: Ref<boolean>;
  private copyResetTimer?: ReturnType<typeof setTimeout>;
  private static defaultParams: UserAreaParams = {
    avatarColor: 'secondary',
    align: 'right',
    menuWidth: 320,
    copyIcon: 'mdi-content-copy',
    copiedIcon: 'mdi-check',
    copiedDuration: 2200,
  };

  constructor(params?: UserAreaParams, options?: UserAreaOptions) {
    super();
    this.params = this.$makeRef({ ...UserArea.defaultParams, ...(params || {}) });
    this.options = options || {};
    this.menuOpen = this.$makeRef(false);
    this.menuEntries = this.$makeRef([]);
    this.menuLoading = this.$makeRef(false);
    this.copyConfirmed = this.$makeRef(false);
  }

  static setDefault(value: UserAreaParams, reset?: boolean) {
    UserArea.defaultParams = reset ? value : { ...UserArea.defaultParams, ...value };
  }

  get $params() {
    return this.params.value;
  }

  render(): VNode | undefined {
    if (!this.$params.name && !this.$params.initials && !this.$params.icon) {
      return undefined;
    }

    const h = this.$h;

    return h(VMenu, {
      modelValue: this.menuOpen.value,
      'onUpdate:modelValue': (value: boolean) => {
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
      activator: ({ props: activatorProps }: any) => h(VBtn, {
        ...activatorProps,
        variant: 'text',
        style: {
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
        },
        'aria-label': this.$params.name || 'Open user menu',
      }, () => this.buildActivator()),
      default: () => h(VCard, {
        elevation: 10,
        rounded: 'lg',
        style: {
          width: typeof this.$params.menuWidth === 'number' ? `${this.$params.menuWidth}px` : (this.$params.menuWidth || '320px'),
          maxWidth: 'calc(100vw - 24px)',
          overflow: 'hidden',
        },
      }, () => {
        const content: VNode[] = [this.buildMenuHeader()];
        const actionSection = this.buildMenuActions();
        if (actionSection) {
          content.push(h(VDivider));
          content.push(actionSection);
        }
        return content;
      }),
    });
  }

  private buildActivator() {
    const h = this.$h;
    const avatarProps: Record<string, any> = {
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

  private buildMenuHeader() {
    const h = this.$h;
    const infoRows: VNode[] = [
      h('div', { style: { fontSize: '1.05rem', fontWeight: '700', lineHeight: '1.2' } }, this.$params.name || ''),
      ...(this.$params.subtitle ? [h('div', { style: { fontSize: '0.92rem', opacity: '0.78', lineHeight: '1.2', marginTop: '2px' } }, this.$params.subtitle)] : []),
      ...(this.$params.email ? [h('div', { style: { fontSize: '0.9rem', opacity: '0.72', lineHeight: '1.2', marginTop: this.$params.subtitle ? '2px' : '4px' } }, this.$params.email)] : []),
    ];

    if (this.$params.accountId) {
      infoRows.push(
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' } }, [
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
            onClick: async (ev: Event) => {
              ev.stopPropagation();
              await this.copyAccountId();
            },
          }),
        ])
      );
    }

    return h(VCardText, { style: { padding: '16px 18px' } }, () => infoRows);
  }

  private buildMenuActions() {
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

    const rows: VNode[] = [];
    for (const entry of this.menuEntries.value) {
      if (entry instanceof Button) {
        rows.push(this.buildButtonEntry(entry));
        continue;
      }

      rows.push(this.buildSeparator(entry));
    }

    return h(VList, { density: 'comfortable', nav: true, style: { paddingTop: '4px', paddingBottom: '8px' } }, () => rows);
  }

  private buildButtonEntry(entry: Button) {
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

  private buildSeparator(entry: UserAreaSeparatorEntry) {
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

  private async ensureMenuEntries() {
    if (!this.options.buttons) {
      this.menuEntries.value = [];
      return;
    }

    this.menuLoading.value = true;
    try {
      const entries = await this.options.buttons(this);
      const normalized = (entries || []).filter(Boolean).map((entry) => {
        if (entry instanceof Button) {
          entry.setParent(this);
          return markRaw(entry);
        }

        return entry;
      });
      this.menuEntries.value = normalized;
    } finally {
      this.menuLoading.value = false;
    }
  }

  private async copyAccountId() {
    const value = this.$params.accountId;
    if (!value || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      this.copyConfirmed.value = true;
      if (this.copyResetTimer) {
        clearTimeout(this.copyResetTimer);
      }
      this.copyResetTimer = setTimeout(() => {
        this.copyConfirmed.value = false;
        this.copyResetTimer = undefined;
      }, Number(this.$params.copiedDuration || 2200));
    } catch (error) {
      // Ignore clipboard write failures in unsupported contexts.
    }
  }

  private initialsFromName() {
    return (this.$params.name || '').split(' ').filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase() || '').join('');
  }
}

export const $ATB = (params?: AppTitleBlockParams) => new AppTitleBlock(params || {});
export const $ENV = (params?: EnvironmentTagParams) => new EnvironmentTag(params || {});
export const $STB = (params?: StatusBadgeParams) => new StatusBadge(params || {});
export const $SIA = (params?: ShellIconActionParams, options?: ShellIconActionOptions) => new ShellIconAction(params || {}, options || {});
export const $USR = (params?: UserAreaParams) => new UserArea(params || {});
