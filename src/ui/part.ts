import { VNode, Ref } from "vue";
import { UIBase } from "./base";
import { VCol, VRow } from 'vuetify/components';
import { Master } from "../master";
import { Field, Refs } from "./field";
import { Report } from "./report";
import { OnHandler } from "./lib";

export interface PartParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}

export interface PartOptions {
  master?: Master;
  validate?: (part: Part) => Promise<string|undefined>|string|undefined;
  topChildren?: (props: any, context: any) => Array<Part|Field>;
  bottomChildren?: (props: any, context: any) => Array<Part|Field>;
  children?: (props: any, context: any) => Array<Part|Field>;
  setup?: (part: Part) => void;
  on?: (part: Part) => OnHandler;
}

export interface PRefs {
  [key: string]: Part
}

export class Part extends UIBase {
  private params: Ref<PartParams>;
  private options: PartOptions;
  private childrenInstances: Array<Part|Field> = [];
  private cnt = 0;
  constructor(params?: PartParams, options?: PartOptions) {
    super();
    this.params = this.$makeRef(params || {});
    this.options = options || {};
    if (options?.master) this.setMaster(options?.master);
  }

  get $refs(): Refs {
    const items: Refs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      if (this.childrenInstances[i] instanceof Field) {
        const ref = this.childrenInstances[i].$ref;
        if (ref && ref !== '') {
          items[ref] = (this.childrenInstances[i] as Field);
        }
      }
    }
    return items;
  }

  get $prefs(): PRefs {
    const items: PRefs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      if (this.childrenInstances[i] instanceof Part) {
        const ref = this.childrenInstances[i].$ref;
        if (ref && ref !== '') {
          items[ref] = (this.childrenInstances[i] as Part);
        }
      }
    }
    return items;
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $readonly() {
    if (this.params.value.readonly === true || this.params.value.readonly === false) return this.params.value.readonly;
    if (this.$parent && (this.$parent as any).$readonly) return (this.$parent as any).$readonly;
    return this.params.value.readonly;
  }

  get $parentReport(): Report|undefined {
    return this.$parent ? (this.$parent as any).$parentReport : undefined;
  }

  setParams(params: PartParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): PartParams {
    return this.params.value;
  }

  props() {
    return []
  }

  topChildren (props: any, context: any): Array<Part|Field> {
    return []
  }

  bottomChildren (props: any, context: any): Array<Part|Field> {
    return []
  }

  children (props: any, context: any): Array<Part|Field> {
    return []
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;
    if (this.params.value.invisible) {
      return;
    }

    return h(
      VCol,
      {
        cols: this.params.value.cols || 12,
        lg: this.params.value.lg,
        xs: this.params.value.xs,
        md: this.params.value.md,
        xl: this.params.value.xl,
        xxl: this.params.value.xxl,
        sm: this.params.value.sm
      },
      () => this.build(props, context),
    );
  }

  build(props: any, context: any) {
    this.childrenInstances.forEach((instance) => {
      instance.removeEventListeners();
    })

    this.childrenInstances = [];

    return this.$h(
      VRow,
      {
        justify: this.params.value.justify,
        align: this.params.value.align,
        dense: this.params.value.dense,
        alignContent: this.params.value.alignContent,
      },
      () => {
        
        const top = this.options.topChildren ? this.options.topChildren(props, context) : this.topChildren(props, context);
        const ch = this.options.children ? this.options.children(props, context) : this.children(props, context);
        const bot = this.options.bottomChildren ? this.options.bottomChildren(props, context) : this.bottomChildren(props, context);

        this.childrenInstances = top.concat(ch).concat(bot);

        this.childrenInstances.forEach((instance) => {
          instance.setParent(this);
        })

        return this.childrenInstances.map((instance) => this.$h(instance.component));
      }
    );
  }

  async validate(): Promise<string|undefined> {
    if (this.params.value.invisible) return undefined;
    
    if (this.options.validate) {
      const v = await this.options.validate(this);
      if (typeof v === 'string') return v;
    }

    for (let i = 0; i < this.childrenInstances.length; i++) {
      const v = await this.childrenInstances[i].validate();
      if (typeof v === 'string') return v;
    }
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

export const $PT = (params?: PartParams, options?: PartOptions) => new Part(params || {}, options || {});