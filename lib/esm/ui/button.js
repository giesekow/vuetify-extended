import { UIBase } from "./base";
import { VBtn, VIcon } from 'vuetify/components';
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
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        return h(VBtn, {
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
            onClick: () => this.clicked(props, context)
        }, () => this.params.value.iconOnly ? h(VIcon, this.params.value.icon) : (this.params.value.text || ''));
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
Button.defaultParams = {};
export const $BN = (params, options) => new Button(params || {}, options || {});
