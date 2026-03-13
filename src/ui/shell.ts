import { Ref, VNode } from "vue";
import { UIBase } from "./base";
import { VAvatar, VChip, VIcon } from 'vuetify/components';

export interface AppTitleBlockParams {
  title?: string;
  subtitle?: string;
  overline?: string;
  icon?: string;
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

export interface EnvironmentTagParams {
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

export interface StatusBadgeParams {
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

export interface UserAreaParams {
  name?: string;
  subtitle?: string;
  initials?: string;
  icon?: string;
  avatarColor?: string;
  align?: 'left'|'right';
}

export class UserArea extends UIBase {
  private params: Ref<UserAreaParams>;
  private static defaultParams: UserAreaParams = {
    avatarColor: 'secondary',
    align: 'right',
  };

  constructor(params?: UserAreaParams) {
    super();
    this.params = this.$makeRef({ ...UserArea.defaultParams, ...(params || {}) });
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
    const reverse = this.$params.align !== 'left';
    const avatar = h(VAvatar, {
      color: this.$params.avatarColor,
      variant: 'tonal',
      size: 38,
    }, () => this.$params.icon ? h(VIcon, {}, () => this.$params.icon || '') : (this.$params.initials || this.initialsFromName()));

    const text = h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        textAlign: reverse ? 'right' : 'left',
      },
    }, [
      h('div', { style: { fontSize: '0.92rem', fontWeight: '600' } }, this.$params.name || ''),
      ...(this.$params.subtitle ? [h('div', { style: { fontSize: '0.76rem', opacity: '0.72' } }, this.$params.subtitle)] : []),
    ]);

    return h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        justifyContent: reverse ? 'flex-end' : 'flex-start',
      },
    }, reverse ? [text, avatar] : [avatar, text]);
  }

  private initialsFromName() {
    return (this.$params.name || '').split(' ').filter(Boolean).slice(0, 2).map((item) => item[0]?.toUpperCase() || '').join('');
  }
}

export const $ATB = (params?: AppTitleBlockParams) => new AppTitleBlock(params || {});
export const $ENV = (params?: EnvironmentTagParams) => new EnvironmentTag(params || {});
export const $STB = (params?: StatusBadgeParams) => new StatusBadge(params || {});
export const $USR = (params?: UserAreaParams) => new UserArea(params || {});
