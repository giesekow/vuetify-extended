import { Fragment, VNode, cloneVNode, defineComponent, h, ref, watch, onUnmounted, onMounted } from 'vue';
import { EventEmitter } from './lib';
import { Master } from '../master';
import { formatCurrencyText, formatDateText, formatNumberText, isRTLLocale, resolveUIText, type NavigationEntry, type UIText } from './runtime';
import type { NavigationScreenFactory } from './runtime';
import type { Menu } from './menu';

export class BaseComponent extends EventEmitter {
  private dataStore: any = {};
  private forceRenderListeners = new Set<() => void>();

  get $makeRef() {
    return ref;
  }

  get $h() {
    return h;
  }

  get $watch() {
    return watch;
  }

  $get(key: any, def: any = null): any {
    return this.dataStore[key] === undefined ? def : this.dataStore[key]
  }

  $set(key: any, value: any) {
    this.dataStore[key] = value
  }

  $remove(key: any) {
    delete this.dataStore[key];
  }

  props () {
    return [];
  }

  render(props: any, context: any): VNode|VNode[]|undefined {
    return h('div');
  }

  setup(props: any, context: any) {
  }

  forceRender() {
    this.forceRenderListeners.forEach((listener) => listener());
  }

  get component () {
    return defineComponent({
      props: this.props(),
      setup: (props, context) => {
        const renderVersion = ref(0);
        const rerender = () => {
          renderVersion.value += 1;
        };

        context.expose({$this: this});

        this.setup(props, context);

        onMounted(() => {
          this.forceRenderListeners.add(rerender);
          this.mounted();
          this.attachEventListeners();
        });
    
        onUnmounted(() => {
          this.forceRenderListeners.delete(rerender);
          this.unmounted();
          this.removeEventListeners();
          this.destructor();
        })
        
        return () => {
          const version = renderVersion.value;
          const content = this.render(props, context);

          if (Array.isArray(content)) {
            return h(Fragment, { key: version }, content);
          }

          if (!content) {
            return undefined;
          }

          return cloneVNode(content, { ...context.attrs, key: version }, true);
        };
      },
    })
  }

  destructor() {}

  mounted() {}

  unmounted() {}

  attachEventListeners() {}

  removeEventListeners() {}
}

export type ScreenMode = "display"|"edit"|"create";
export type AccessMode = ScreenMode | "print" | "export";
export type ReportMode = ScreenMode;
export type TriggerMode = ScreenMode;
export type CollectionMode = ScreenMode;
export type SelectorMode = ScreenMode;
export type DialogMode = ScreenMode;
export type ReportAccessMode = AccessMode;
export type TriggerAccessMode = AccessMode;
export type MenuTarget = Menu | NavigationScreenFactory<Menu>;

export class UIBase extends BaseComponent {

  private parent!: UIBase;
  private master?: Master;
  private uid: symbol;

  constructor() {
    super();
    this.uid = Symbol('id');
  }

  get $master(): Master|undefined {
    if (this.master) return this.master;
    if (this.parent) return this.parent.$master;
  }

  get $id(): symbol {
    return this.uid;
  }

  get $parent (): BaseComponent {
    return this.parent;
  }

  setParent(parent: UIBase) {
    this.parent = parent;
  }

  setMaster(master: Master) {
    this.master = master;
  }

  async show() {}

  async hide() {}

  async forceCancel() {}

  async canHandleBack(): Promise<boolean> {
    return false;
  }

  async handleBack(): Promise<boolean> {
    return false;
  }

  async serializeNavigationState(_entry?: NavigationEntry): Promise<any> {
    return undefined;
  }

  async restoreNavigationState(_state: any, _entry?: NavigationEntry): Promise<void> {
    //
  }

  async getRightMenuTarget(): Promise<MenuTarget | undefined> {
    return undefined;
  }

  $text(value: UIText | undefined | null, fallback: string = '') {
    return resolveUIText(value, fallback);
  }

  $uiText(key: string, fallback: string = '', values?: Record<string, any>) {
    return resolveUIText({ key, fallback, values }, fallback);
  }

  $formatDate(value: any, options?: any) {
    return formatDateText(value, options);
  }

  $formatNumber(value: number, options?: any) {
    return formatNumberText(value, options);
  }

  $formatCurrency(value: number, options?: any) {
    return formatCurrencyText(value, options);
  }

  get $isRTL() {
    return isRTLLocale();
  }
}
