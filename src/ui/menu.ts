import { VNode, Ref } from "vue";
import { ReportMode, UIBase } from "./base";
import { VAvatar, VBtn, VCard, VCardTitle, VCol, VContainer, VIcon, VLayout, VListItem, VRow } from 'vuetify/components';
import { EventEmitter, OnHandler } from "./lib";
import { Report } from "./report";
import { Collection } from "./collection";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";

export interface MenuParams {
  ref?: string;
  title?: string;
  maxWidth?: number|string;
  minWidth?: number|string;
  width?: number|string;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  containerXs?: number|string|undefined;
  containerSm?: number|string|undefined;
  containerMd?: number|string|undefined;
  containerLg?: number|string|undefined;
  containerCols?: number|string|undefined;
  containerXl?: number|string|undefined;
  containerXxl?: number|string|undefined;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}

export interface MenuOptions {
  access?: (menu: Menu) => Promise<boolean|undefined>|boolean|undefined;
  children?: (menu: Menu) => Promise<MenuItem[]>|MenuItem[];
  setup?: (menu: Menu) => void;
  on?: (menu: Menu) => OnHandler;
}

export class Menu extends UIBase {
  private params: Ref<MenuParams>;
  private options: MenuOptions;
  private childrenInstances: Array<MenuItem> = [];
  private loaded: Ref<boolean>;

  constructor(params?: MenuParams, options?: MenuOptions) {
    super();
    this.params = this.$makeRef(params || {});
    this.options = options || {};
    this.loaded = this.$makeRef(false);
  }

  get $ref() {
    return this.params.value.ref;
  }

  async access(): Promise<boolean|undefined>{
    return this.options.access ? await this.options.access(this) : true;
  }

  hasParent () {
    return this.$parent ? true : false;
  }

  setParent(parent: Menu) {
    super.setParent(parent);
  }

  setParams(params: MenuParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): MenuParams {
    return this.params.value;
  }

  props() {
    return []
  }

  async children (): Promise<MenuItem[]> {
    return []
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;

    return h(
      VContainer,
      {
        class: ['fill-height'],
      },
      () => h(
        VLayout,
        {
          fullHeight: true
        },
        () => h(
          VRow,
          {
            alignContent: "center",
          },
          () => h(
            VCol,
            {
              class: ['mx-auto'],
              cols: this.params.value.containerCols || 12,
              lg: this.params.value.containerLg,
              xs: this.params.value.containerXs,
              md: this.params.value.containerMd,
              xl: this.params.value.containerXl,
              xxl: this.params.value.containerXxl,
              sm: this.params.value.containerSm,
            },
            () => this.build(props, context)
          )
        ),
      )
    );
  }

  build(props: any, context: any) {
    const h = this.$h;
    return this.$h(
      VRow,
      {
        justify: this.params.value.justify || 'center',
        align: this.params.value.align || 'center',
        dense: this.params.value.dense,
        alignContent: this.params.value.alignContent || 'center',
      },
      () => {

        const title = h(
          VCol,
          {
            align: 'center',
            cols: 12,
          },
          () => h(
            'div',
            {
              class: ['text-h4']
            },
            this.params.value.title || ''
          )
        );

        const backTop = h(
          VCol,
          {
            align: 'center',
            cols: 12,
          },
          () => h(
            VBtn,
            {
              icon: true,
              variant: 'plain',
              color: 'error',
              class: ['text-h6'],
              onClick: () => {
                this.backClicked();
              }
            },
            () => h(
              VIcon,
              {},
              () => 'mdi-backspace'
            )
          )
        );

        const back = h(
          VCol,
          {
            align: 'center',
            cols: 12,
          },
          () => h(
            VBtn,
            {
              icon: true,
              variant: 'plain',
              color: 'error',
              class: ['text-h6'],
              onClick: () => {
                this.backClicked();
              }
            },
            () => h(
              VIcon,
              {},
              () => 'mdi-backspace'
            )
          )
        );

        if (!this.loaded.value) {
          this.prepareChildren();
          return title;
        }

        return [
          title,
          ...(this.hasParent() && this.childrenInstances.length > 6 ? [backTop] : []),
          ...this.childrenInstances.map((item) => h(
            VCol,
            {
              cols: this.params.value.cols || 12,
              lg: this.params.value.lg,
              xs: this.params.value.xs,
              md: this.params.value.md,
              xl: this.params.value.xl,
              xxl: this.params.value.xxl,
              sm: this.params.value.sm,
            },
            () => h(
              VCard,
              {
                color: item.$params.color || 'primary',
                elevation: 4,
                maxWidth: this.params.value.maxWidth,
                minWidth: this.params.value.minWidth,
                width: this.params.value.width,
                class: ['mx-auto'],
                onClick: () => {
                  this.itemClicked(item);
                }
              },
              () => h(
                VCardTitle,
                {
                  class: ['pa-0'],
                },
                () => h(
                  VListItem,
                  {
                    lines: 'two',
                    class: ['py-0', 'my-0']
                  },
                  {
                    prepend: () => h(
                      VAvatar,
                      {},
                      () => h(
                        VIcon,
                        {
                          color: item.$params.textColor || 'white'
                        },
                        () => item.$params.icon || ''
                      )
                    ),
                    title: () => h(
                      'span',
                      {
                        class: ['text-h6']
                      },
                      item.$params.text,
                    ),
                    subtitle: () => h(
                      'span',
                      item.$params.subText,
                    )
                  }
                )
              )
            )
          )),
          ...(this.hasParent() ? [back] : [])
        ]
      }
    );
  }

  private async prepareChildren() {
    this.loaded.value = false;
    this.childrenInstances.forEach((instance) => {
      instance.removeEventListeners();
    })

    this.childrenInstances = [];

    const ch = this.options.children ? await this.options.children(this) : await this.children();
    const filtered: MenuItem[] = [];
    
    for (let c = 0; c < ch.length; c++) {
      if (await ch[c].access()) {
        filtered.push(ch[c]);
      } else {
        ch[c].removeEventListeners();
      }
    }

    this.childrenInstances = filtered;

    this.childrenInstances.forEach((instance) => {
      instance.setParent(this);
    })

    this.loaded.value = true;
  }

  private async itemClicked(item: MenuItem) {
    const mode = item.$params.mode;
    if (item.$params.action === 'menu') {
      const menu = await item.menu(mode);
      if (menu) {
        if (await menu.access()) {
          menu.setParent(this);
          AppManager.showMenu(menu);
        } else {
          Dialogs.$error("access denied!");
        }
      }
    }

    if (item.$params.action === 'collection') {
      const collection = await item.collection();
      if (collection) {
        if (await collection.access()) {
          collection.$params.mode = item.$params.mode;
          AppManager.showCollection(collection);
        } else {
          Dialogs.$error("access denied!");
        }
      }
    }

    if (item.$params.action === 'report') {
      const report = await item.report();
      if (report) {
        if (await report.access()) {
          report.$params.mode = item.$params.mode;
          AppManager.showReport(report);
        } else {
          Dialogs.$error("access denied!");
        }
      }
    }

    if (item.$params.action === 'function') {
      item.callback();
    }
  }

  private async backClicked() {
    this.handleOn('cancel', this);
  }

  async $reload() {
    await this.prepareChildren();
  }

  async forceCancel() {
    await this.hide();
    this.backClicked();
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


export interface MenuItemParams {
  action?: 'report'|'collection'|'function'|'menu';
  mode?: ReportMode;
  text?: string;
  subText?: string;
  icon?: string;
  color?: string;
  textColor?: string;
}

export interface MenuItemOptions {
  access?: (menuItem: MenuItem, mode?: ReportMode) => Promise<boolean|undefined>|boolean|undefined;
  report?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Report|undefined>|Report|undefined;
  collection?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Collection|undefined>|Collection|undefined;
  menu?:(menuItem: MenuItem, mode?: ReportMode) => Promise<Menu|undefined>|Menu|undefined;
  callback?: (menuItem: MenuItem, mode?: ReportMode) => Promise<void>|void;
  setup?: (menuItem: MenuItem) => void;
  on?: (menuItem: MenuItem) => OnHandler;
}

export class MenuItem extends EventEmitter {
  private params: MenuItemParams;
  private options: MenuItemOptions;
  private $id: symbol;
  private parent?: Menu;

  constructor(params?: MenuItemParams, options?: MenuItemOptions) {
    super();
    this.params = params || {};
    this.$id = Symbol('id');
    this.options = options || {};
  }

  get $params(): MenuItemParams {
    return this.params;
  }

  setParent(menu: Menu) {
    this.parent = menu;
  }

  getParent(): Menu|undefined {
    return this.parent;
  }

  async access(mode?: ReportMode): Promise<boolean|undefined>{
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async report (mode?: ReportMode): Promise<Report|undefined> {
    return this.options.report ? await this.options.report(this, mode) : undefined;
  }

  async collection (mode?: ReportMode): Promise<Collection|undefined> {
    return this.options.collection ? await this.options.collection(this, mode) : undefined;
  }

  async menu (mode?: ReportMode): Promise<Menu|undefined> {
    return this.options.menu ? await this.options.menu(this, mode) : undefined;
  }

  async callback (mode?: ReportMode): Promise<void> {
    if (this.options.callback) await this.options.callback(this, mode);
  }

  attachEventListeners() {}

  removeEventListeners() {}

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

export const $MN = (params?: MenuParams, options?: MenuOptions) => new Menu(params || {}, options || {});
export const $MI = (params?: MenuItemParams, options?: MenuItemOptions) => new MenuItem(params || {}, options || {});