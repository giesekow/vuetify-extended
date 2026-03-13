import { VNode, Ref, isVNode } from "vue";
import { ReportMode, UIBase } from "./base";
import { Menu } from "./menu";
import { Report } from "./report";
import { Collection } from "./collection";
import { Selector } from "./selector";
import { sleep } from "../misc";
import { Dialogs } from "./dialogs";
import { Field } from "./field";
import { Api } from "../api";
import { DialogForm } from "./dialogform";
import { VApp, VAppBar, VAppBarTitle, VFooter, VMain } from 'vuetify/components';

export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export type AppShellContent = UIBase | VNode | string | number | boolean | null | undefined;

export interface AppOptions {
  menu?: (app: AppMain) => Promise<Menu|undefined>|Menu|undefined;
  udfs?: (app: AppMain, objectType: string|string[], query: any) => Promise<any[]>;
  makeUDF?: (app: AppMain, options: any) => Field|undefined;
  header?: (app: AppMain) => AppShellContent | AppShellContent[];
  footer?: (app: AppMain) => AppShellContent | AppShellContent[];
}

export interface AppStackItem {
  type: "menu"|"report"|"collection"|"selector"|"ui";
  item: UIBase,
  params: any
}

export class AppMain extends UIBase {
  private params: Ref<AppParams>;
  private options: AppOptions;

  private stack: Array<AppStackItem>;
  private loaded: Ref<boolean>;
  private index: Ref<number>;
  private selectors: Array<Selector>;
  private selectorCount: Ref<number>;
  private dialogs: Array<DialogForm>;
  private dialogCount: Ref<number>;
  private selectorFocusTargets: Map<symbol, HTMLElement>;
  private dialogFocusTargets: Map<symbol, HTMLElement>;
  private static defaultParams: AppParams = {
    showHeader: false,
    showFooter: false,
  };

  constructor(params?: AppParams, options?: AppOptions) {
    super();
    this.params = this.$makeRef({...AppMain.defaultParams, ...(params || {})});
    this.options = options || {};
    this.stack = [];
    this.loaded = this.$makeRef(false);
    this.index = this.$makeRef(-1);
    this.selectorCount = this.$makeRef(0);
    this.dialogCount = this.$makeRef(0);
    this.selectors = [];
    this.dialogs = [];
    this.selectorFocusTargets = new Map();
    this.dialogFocusTargets = new Map();
  }

  static setDefault(value: AppParams, reset?: boolean): void {
    if (reset) {
      AppMain.defaultParams = value;
    } else {
      AppMain.defaultParams = {...AppMain.defaultParams, ...value};
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: AppParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): AppParams {
    return this.params.value;
  }

  props() {
    return []
  }

  async menu(): Promise<Menu|undefined> {
    if (this.options.menu) {
      return await this.options.menu(this);
    }
  }

  render(props: any, context: any): VNode| VNode[] |undefined {
    const h = this.$h;

    if (!this.loaded.value) {
      this.loadApp();
      return undefined;
    }

    const content = this.renderStackContent();
    const header = this.renderShellRegion('header');
    const footer = this.renderShellRegion('footer');
    const showHeader = this.params.value.showHeader || !!header;
    const showFooter = this.params.value.showFooter || !!footer;

    if (!showHeader && !showFooter) {
      return content;
    }

    return h(
      VApp,
      {
        class: ['vuetify-extended-app-shell'],
      },
      () => [
        ...(showHeader ? [
          h(
            VAppBar,
            {
              elevation: 2,
              density: 'comfortable',
            },
            () => header || h(VAppBarTitle, {}, () => this.params.value.title || 'Application')
          ),
        ] : []),
        h(
          VMain,
          {
            class: ['vuetify-extended-app-main'],
          },
          () => h(
            'div',
            {
              style: {
                minHeight: '100%',
                paddingBottom: showFooter ? '72px' : undefined,
              },
            },
            content as any
          )
        ),
        ...(showFooter ? [
          h(
            VFooter,
            {
              app: true,
              elevation: 2,
              class: ['px-4', 'py-2'],
            },
            () => footer || ''
          ),
        ] : []),
      ]
    );
  }

  private renderStackContent(): VNode | VNode[] | undefined {
    const h = this.$h;

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      const item = this.stack[this.index.value].item;
      if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
        return [
          h(item.component),
          ...this.selectors.map((s) => h(s.component)),
          ...this.dialogs.map((d) => h(d.component))
        ];
      }
      return h(item.component);
    }

    if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
      return [
        ...this.selectors.map((s) => h(s.component)),
        ...this.dialogs.map((d) => h(d.component))
      ];
    }

    return undefined;
  }

  private renderShellRegion(region: 'header' | 'footer'): VNode | VNode[] | undefined {
    const render = region === 'header' ? this.options.header : this.options.footer;
    if (!render) {
      return undefined;
    }

    const content = render(this);
    return this.normalizeShellContent(content);
  }

  private normalizeShellContent(content: AppShellContent | AppShellContent[]): VNode | VNode[] | undefined {
    const items = Array.isArray(content) ? content : [content];
    const rendered = items
      .map((item) => this.normalizeShellItem(item))
      .filter((item): item is VNode => !!item);

    if (rendered.length === 0) {
      return undefined;
    }

    return rendered.length === 1 ? rendered[0] : rendered;
  }

  private normalizeShellItem(item: AppShellContent): VNode | undefined {
    const h = this.$h;

    if (item === null || item === undefined || item === false) {
      return undefined;
    }

    if (item instanceof UIBase) {
      return h(item.component);
    }

    if (isVNode(item)) {
      return item;
    }

    return h('span', {}, String(item));
  }

  private async activateCurrentItem(index: number = this.index.value) {
    if (index < 0 || index >= this.stack.length) {
      return;
    }

    if (index > 0 && this.stack.length > 0) {
      this.stack[index-1].item.clearListeners(this.$id);
    }

    if (index < this.stack.length) {
      this.stack[index].item.clearListeners(this.$id);
      this.stack[index].item.on('cancel', (item: any) => this.onCancel(item), this.$id);
      this.stack[index].item.on('finished', (item: any) => this.onCancel(item), this.$id);
      await this.stack[index].item.show();
    }
  }

  async $reload() {
    await this.loadApp();
  }

  private async loadApp() {
    Dialogs.$showProgress({})
    const menu = await this.menu();

    this.stack.forEach((entry) => {
      entry.item.removeEventListeners();
    });

    this.stack = [];
    this.selectors = [];
    this.index.value = -1;
    this.selectorCount.value = 0;

    if (menu) {
      await this.$showMenu(menu);
    }
    this.loaded.value = true;
    Dialogs.$hideProgress();
  }

  async $getUDFs(objectType: string|string[]): Promise<any[]> {
    if (this.options.udfs) return await this.options.udfs(this, objectType, this.params.value.udfQuery || {});

    try {
      const items = await Api.instance.service('udfs').findAll({query: {$sort: {sort: 1}, inactive: {$ne: true}, ...(this.params.value.udfQuery ? this.params.value.udfQuery : {}), objectTypes: {$in: Array.isArray(objectType) ? objectType : [objectType]}}});
      return items
    } catch (error) {
      return [];
    }
  }

  $makeUDF (options: any, mode?: ReportMode): Field|undefined {
    if (this.options.makeUDF) return this.options.makeUDF(this, options);

    const ftype: any = options.fieldType;
    if (!ftype) return;

    const fieldMaps: any = {}

    return new Field({
      type: fieldMaps[ftype] || ftype,
      label: options.fieldLabel,
      hint: options.hint,
      placeholder: options.placeholder,
      icon: options.icon,
      required: options.isRequired,
      multiple: options.multiple || false,
      storage: `udfs.${options._id}`,
      cols: options.gridSize?.cols,
      xs: options.gridSize?.xs,
      sm: options.gridSize?.sm,
      md: options.gridSize?.md,
      lg: options.gridSize?.lg,
      xl: options.gridSize?.xl,
      xxl: options.gridSize?.xxl,
      ...(options.defaultValue || options.defaultValue === 0  ? {default: options.defaultValue}: {}),
      ...(options.fieldType === 'text' && options.isAutoGen && mode && ['create', 'edit'].includes(mode) ? {readonly: !options.autoGenInfo?.enableEdit, hint: 'Is Auto Generated', default: '<AUTO>'}: {})
    }, {
      selectOptions: () => options.options || []
    })
  }

  async $showMenu(menu: Menu, params?: any) {
    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    this.stack.push({
      type: "menu",
      item: menu,
      params: params || {}
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
  }

  async $showReport(report: Report, params?: any, replace?: boolean) {

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop()

    this.stack.push({
      type: "report",
      item: report,
      params: params || {}
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
  }

  async $showCollection(collection: Collection, params?: any, replace?: boolean) {

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop()

    this.stack.push({
      type: "collection",
      item: collection,
      params: params || {}
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
  }

  async $showUI(ui: UIBase, params?: any, replace?: boolean) {

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop()

    this.stack.push({
      type: "ui",
      item: ui,
      params: params || {}
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
  }

  async $showSelector(selector: Selector, params?: any) {
    const target = this.captureActiveElement();
    if (target) {
      this.selectorFocusTargets.set(selector.$id, target);
    }
    this.selectors.push(selector)
    this.selectorCount.value = this.selectors.length;
    await sleep(100);
    selector.on('cancel', () => this.onSelectorCancel(selector), this.$id);
    selector.attachEventListeners()
    selector.show();
  }

  async $showDialog(dialog: DialogForm, params?: any) {
    const target = this.captureActiveElement();
    if (target) {
      this.dialogFocusTargets.set(dialog.$id, target);
    }
    this.dialogs.push(dialog)
    this.dialogCount.value = this.dialogs.length;
    await sleep(100);
    dialog.on('cancel', () => this.onDialogCancel(dialog), this.$id);
    dialog.attachEventListeners()
    dialog.show();
  }

  async $back() {
    if (this.selectors.length > 0) {
      this.selectors[this.selectors.length - 1].forceCancel();
    } else if (this.stack.length > 1) {
      this.stack[this.stack.length-1].item.forceCancel();
    } else {
      this.emit('close', this);
    }
  }

  async $pop(count?: number) {
    if (count === 0) return;
    const rem = count || 1;
    if (rem < this.stack.length) {
      this.index.value -= rem;
      for (let i = 0; i < rem; i++) {
        const info = this.stack.pop();
        if (info) info.item.removeEventListeners();
      }
      await this.activateCurrentItem();
    } else if (rem >= this.stack.length) {
      this.loadApp();
    }
  }

  private async onCancel(item: UIBase) {
    const ui = this.stack.filter((inst) => inst.item.$id === item.$id)[0];
    if (ui) {
      const index = this.stack.indexOf(ui);
      if (index >= 0) {
        this.stack.splice(index, 1);
        ui.item.clearListeners(this.$id);
        this.index.value = this.stack.length - 1;
        await this.activateCurrentItem();
      }
    }
  }

  private async onSelectorCancel(item: UIBase) {
    const ui = this.selectors.filter((inst) => inst.$id === item.$id)[0];
    if (ui) {
      const index = this.selectors.indexOf(ui);
      if (index >= 0) {
        this.selectors.splice(index, 1);
        ui.clearListeners(this.$id);
        this.selectorCount.value = this.selectors.length;
        await this.restoreFocus(this.selectorFocusTargets.get(ui.$id));
        this.selectorFocusTargets.delete(ui.$id);
      }
    }
  }

  private async onDialogCancel(item: UIBase) {
    const ui = this.dialogs.filter((inst) => inst.$id === item.$id)[0];
    if (ui) {
      const index = this.dialogs.indexOf(ui);
      if (index >= 0) {
        this.dialogs.splice(index, 1);
        ui.clearListeners(this.$id);
        this.dialogCount.value = this.dialogs.length;
        await this.restoreFocus(this.dialogFocusTargets.get(ui.$id));
        this.dialogFocusTargets.delete(ui.$id);
      }
    }
  }

  private captureActiveElement(): HTMLElement|undefined {
    if (typeof document === 'undefined' || typeof HTMLElement === 'undefined') {
      return undefined;
    }

    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      return active;
    }
    return undefined;
  }

  private async restoreFocus(target?: HTMLElement) {
    if (!target) {
      return;
    }

    await sleep(50);
    if (target.isConnected && typeof target.focus === 'function') {
      target.focus();
    }
  }

}

export const $APP = (params?: AppParams, options?: AppOptions) => new AppMain(params || {}, options || {});
