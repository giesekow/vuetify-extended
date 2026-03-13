import { VNode, Ref } from "vue";
import { UIBase } from "./base";
import { VBtn, VIcon } from 'vuetify/components';
import { Master } from "../master";
import { OnHandler } from "./lib";

export interface ButtonParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  disabled?: boolean;
  icon?: string;
  iconOnly?: boolean;
  appendIcon?: boolean;
  elevation?: string|number;
  color?: string;
  class?: string;
  text?: string;
  shortcut?: string;
  flat?: boolean;
  loading?: boolean;
  rounded?: string | number | boolean;
  size?: string | number;
  block?: boolean;
  width?: string | number;
  position?: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky';
  density?: 'default' | 'comfortable' | 'compact';
  variant?: "flat" | "text" | "outlined" | "plain" | "elevated" | "tonal";
}

export interface ButtonOptions {
  master?: Master;
  onClicked?: (button: Button) => void;
  setup?: (button: Button) => void;
  on?: (button: Button) => OnHandler
}

export class Button extends UIBase {
  private params: Ref<ButtonParams>;
  private options: ButtonOptions;
  private static defaultParams: ButtonParams = {};

  constructor(params?: ButtonParams, options?: ButtonOptions) {
    super();
    this.params = this.$makeRef({...Button.defaultParams, ...(params || {})});
    this.options = options || {};
    if (options?.master) this.setMaster(options?.master);
  }

  static setDefault(value: ButtonParams, reset?: boolean): void {
    if (reset) {
      Button.defaultParams = value;
    } else {
      Button.defaultParams = {...Button.defaultParams, ...value};
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $readonly() {
    if (this.params.value.readonly === true || this.params.value.readonly === false) return this.params.value.readonly;
    if (this.$parent && (this.$parent as any).$readonly) return (this.$parent as any).$readonly;
    return this.params.value.readonly;
  }

  setParams(params: ButtonParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): ButtonParams {
    return this.params.value;
  }

  props() {
    return []
  }

  onClicked (props: any, context: any): void {
    //
  }

  triggerShortcut() {
    if (this.params.value.disabled || this.params.value.invisible || this.$readonly) {
      return;
    }

    this.clicked({}, {});
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;
    
    if (this.params.value.invisible) {
      return;
    }

    return h(
      VBtn,
      {
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
      },
      () => this.params.value.iconOnly ? h(VIcon, this.params.value.icon) : (this.params.value.text || '')
    );
  }

  private clicked(props: any, context: any) {
    this.onClicked(props, context);
    if (this.options.onClicked) {
      this.options.onClicked(this);
    }
    this.handleOn('clicked', this);
  }

  setup(props: any, context: any) {
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  private handleOn(event: string, data?: any) {
    if (this.options.on) {
      const events = this.options.on(this);
      if (events[event]) {
        events[event](data)
      }
    }

    this.emit(event, data)
  }

}

export const $BN = (params?: ButtonParams, options?: ButtonOptions) => new Button(params || {}, options || {});
