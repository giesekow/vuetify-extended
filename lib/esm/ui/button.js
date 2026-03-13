import { UIBase } from "./base";
import { VBtn, VIcon, VTooltip } from 'vuetify/components';
import { describeButtonShortcut } from "./shortcut";
export class Button extends UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, Button.defaultParams), (params || {})));
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
    }
    static setDefault(value, reset) {
        if (reset) {
            Button.defaultParams = value;
        }
        else {
            Button.defaultParams = Object.assign(Object.assign({}, Button.defaultParams), value);
        }
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.readonly;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    props() {
        return [];
    }
    onClicked(props, context) {
        //
    }
    triggerShortcut() {
        if (this.params.value.disabled || this.params.value.invisible || this.$readonly) {
            return;
        }
        this.clicked({}, {});
    }
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        const displayShortcut = describeButtonShortcut(this.params.value.shortcut, { cmdForCtrlOnMac: this.params.value.cmdForCtrlOnMac });
        const titleParts = [this.params.value.text || ''].filter((item) => item && item !== '');
        if (displayShortcut && this.params.value.shortcutDisplay === 'compact') {
            titleParts.push(displayShortcut.label);
        }
        const accessibleLabel = this.params.value.tooltip || (titleParts.length > 0 ? titleParts.join(' - ') : undefined);
        const buttonProps = {
            icon: this.params.value.iconOnly,
            appendIcon: this.params.value.appendIcon && this.params.value.icon ? this.params.value.icon : undefined,
            prependIcon: !this.params.value.appendIcon && this.params.value.icon ? this.params.value.icon : undefined,
            color: this.params.value.color,
            variant: this.params.value.variant,
            disabled: this.params.value.disabled,
            class: this.params.value.class,
            elevation: this.params.value.elevation,
            density: this.params.value.density,
            position: this.params.value.position,
            flat: this.params.value.flat,
            size: this.params.value.size,
            rounded: this.params.value.rounded,
            block: this.params.value.block,
            loading: this.params.value.loading,
            width: this.params.value.width,
            title: this.params.value.tooltip ? undefined : accessibleLabel,
            'aria-label': accessibleLabel,
            'aria-keyshortcuts': displayShortcut === null || displayShortcut === void 0 ? void 0 : displayShortcut.label,
            onClick: () => this.clicked(props, context)
        };
        const buttonNode = h(VBtn, buttonProps, () => this.renderButtonContent(displayShortcut));
        if (!this.params.value.tooltip) {
            return buttonNode;
        }
        return h(VTooltip, {
            location: this.params.value.tooltipLocation || 'top',
            text: this.params.value.tooltip,
        }, {
            activator: ({ props: activatorProps }) => h(VBtn, Object.assign(Object.assign({}, buttonProps), activatorProps), () => this.renderButtonContent(displayShortcut)),
            default: () => this.params.value.tooltip || '',
        });
    }
    renderButtonContent(displayShortcut) {
        const h = this.$h;
        if (this.params.value.iconOnly) {
            return h(VIcon, this.params.value.icon);
        }
        if (!displayShortcut) {
            return this.params.value.text || '';
        }
        return h('span', {
            style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
            },
        }, [
            h('span', {}, this.params.value.text || ''),
            this.params.value.shortcutDisplay === 'compact'
                ? this.renderCompactShortcut(displayShortcut.key, displayShortcut.ctrl, displayShortcut.alt, displayShortcut.shift, displayShortcut.meta, displayShortcut.label)
                : h('span', {
                    class: ['text-caption'],
                    style: {
                        opacity: '0.7',
                        fontWeight: '500',
                        fontSize: this.params.value.shortcutFontSize || '0.5rem',
                        letterSpacing: '0.02em',
                    },
                }, displayShortcut.label),
        ]);
    }
    renderCompactShortcut(key, ctrl, alt, shift, meta, label) {
        const h = this.$h;
        return this.$h('span', {
            class: ['text-caption'],
            title: label,
            'aria-label': label,
            style: {
                opacity: '0.82',
                fontWeight: '600',
                fontSize: this.params.value.shortcutFontSize || '0.5rem',
                lineHeight: '1',
                letterSpacing: '0.03em',
                padding: '1px 4px',
                border: '1px solid currentColor',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0',
                minWidth: (shift || meta) ? '2.8em' : '1.8em',
                whiteSpace: 'nowrap',
            },
        }, [
            ...(meta ? [
                h(VIcon, {
                    icon: 'mdi-apple-keyboard-command',
                    size: '0.95em',
                    style: {
                        opacity: '1',
                        marginRight: shift ? '-0.15em' : '-0.1em',
                        marginLeft: '-0.05em',
                    },
                }),
            ] : []),
            ...(shift ? [
                h(VIcon, {
                    icon: this.params.value.shortcutShiftIcon || 'mdi-arrow-up-thin',
                    size: '1em',
                    style: {
                        opacity: '1',
                        marginRight: '-0.4em',
                    },
                }),
            ] : []),
            h('span', {
                style: {
                    textDecorationLine: [ctrl ? 'underline' : '', alt ? 'overline' : ''].filter(Boolean).join(' ') || 'none',
                    textDecorationThickness: (ctrl || alt) ? '1px' : undefined,
                    textUnderlineOffset: ctrl ? '1px' : undefined,
                    textDecorationSkipInk: 'none',
                    textDecorationColor: 'currentColor',
                    display: 'inline-block',
                    minWidth: '1.8em',
                    textAlign: 'center',
                    paddingTop: alt ? '2px' : undefined,
                },
            }, key),
        ]);
    }
    clicked(props, context) {
        this.onClicked(props, context);
        if (this.options.onClicked) {
            this.options.onClicked(this);
        }
        this.handleOn('clicked', this);
    }
    setup(props, context) {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    handleOn(event, data) {
        if (this.options.on) {
            const events = this.options.on(this);
            if (events[event]) {
                events[event](data);
            }
        }
        this.emit(event, data);
    }
}
Button.defaultParams = {
    cmdForCtrlOnMac: true,
};
export const $BN = (params, options) => new Button(params || {}, options || {});
