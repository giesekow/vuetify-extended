"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$USR = exports.$STB = exports.$ENV = exports.$ATB = exports.UserArea = exports.StatusBadge = exports.EnvironmentTag = exports.AppTitleBlock = void 0;
const base_1 = require("./base");
const components_1 = require("vuetify/components");
class AppTitleBlock extends base_1.UIBase {
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
            ...(this.$params.icon ? [h(components_1.VAvatar, {
                    color: this.$params.color || 'primary',
                    variant: 'tonal',
                    size: 40,
                }, () => h(components_1.VIcon, {}, () => this.$params.icon || ''))] : []),
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
exports.AppTitleBlock = AppTitleBlock;
AppTitleBlock.defaultParams = {};
class EnvironmentTag extends base_1.UIBase {
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
        return h(components_1.VChip, {
            color: this.$params.color,
            variant: this.$params.variant,
            size: this.$params.size,
            label: true,
        }, () => this.$params.text || '');
    }
}
exports.EnvironmentTag = EnvironmentTag;
EnvironmentTag.defaultParams = {
    color: 'warning',
    variant: 'tonal',
    size: 'small',
};
class StatusBadge extends base_1.UIBase {
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
        return h(components_1.VChip, {
            color: this.$params.color,
            variant: this.$params.variant,
            size: this.$params.size,
            prependIcon: this.$params.icon,
            label: true,
        }, () => this.$params.text || '');
    }
}
exports.StatusBadge = StatusBadge;
StatusBadge.defaultParams = {
    color: 'primary',
    variant: 'tonal',
    size: 'small',
};
class UserArea extends base_1.UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, UserArea.defaultParams), (params || {})));
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
        const reverse = this.$params.align !== 'left';
        const avatar = h(components_1.VAvatar, {
            color: this.$params.avatarColor,
            variant: 'tonal',
            size: 38,
        }, () => this.$params.icon ? h(components_1.VIcon, {}, () => this.$params.icon || '') : (this.$params.initials || this.initialsFromName()));
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
    initialsFromName() {
        return (this.$params.name || '').split(' ').filter(Boolean).slice(0, 2).map((item) => { var _a; return ((_a = item[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || ''; }).join('');
    }
}
exports.UserArea = UserArea;
UserArea.defaultParams = {
    avatarColor: 'secondary',
    align: 'right',
};
const $ATB = (params) => new AppTitleBlock(params || {});
exports.$ATB = $ATB;
const $ENV = (params) => new EnvironmentTag(params || {});
exports.$ENV = $ENV;
const $STB = (params) => new StatusBadge(params || {});
exports.$STB = $STB;
const $USR = (params) => new UserArea(params || {});
exports.$USR = $USR;
