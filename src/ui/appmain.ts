import { VNode, Ref, isVNode } from "vue";
import { ReportMode, UIBase } from "./base";
import { Menu } from "./menu";
import { Report } from "./report";
import { Collection } from "./collection";
import { Selector } from "./selector";
import { sleep } from "../misc";
import { Dialogs } from "./dialogs";
import { Field } from "./field";
import { Button } from "./button";
import { Api } from "../api";
import { DialogForm } from "./dialogform";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";
import { VApp, VAppBar, VAppBarTitle, VBtn, VCard, VCardText, VFooter, VMain, VMenu } from 'vuetify/components';
import { Master } from "../master";

export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: string;
  fabShortcut?: string;
  headerLayout?: 'balanced'|'auto'|'stacked';
  footerLayout?: 'balanced'|'auto'|'stacked';
  headerStartWidth?: string|number;
  headerCenterWidth?: string|number;
  headerEndWidth?: string|number;
  footerStartWidth?: string|number;
  footerCenterWidth?: string|number;
  footerEndWidth?: string|number;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundOverlay?: string;
}

export type AppShellContent = UIBase | VNode | string | number | boolean | null | undefined;

export interface AppOptions {
  menu?: (app: AppMain) => Promise<Menu|undefined>|Menu|undefined;
  udfs?: (app: AppMain, objectType: string|string[], query: any) => Promise<any[]>;
  makeUDF?: (app: AppMain, options: any) => Field|undefined;
  fabButtons?: AppFabButtonsFactory;
  header?: (app: AppMain) => AppShellContent | AppShellContent[];
  footer?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
}

export type AppFabButtonsFactory = Button[] | ((app: AppMain, item?: UIBase, stackItem?: AppStackItem) => Button[]);

export interface AppScreenParams {
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: string;
  fabShortcut?: string;
  fabButtons?: AppFabButtonsFactory;
  [key: string]: any;
}

export interface AppStackItem {
  type: "menu"|"report"|"collection"|"selector"|"ui";
  item: UIBase,
  params: AppScreenParams
}

export class AppMain extends UIBase {
  private params: Ref<AppParams>;
  private options: AppOptions;

  private stack: Array<AppStackItem>;
  private stackRefState: Ref<Array<AppStackItem>>;
  private activeItemRefState: Ref<AppStackItem | undefined>;
  private loaded: Ref<boolean>;
  private index: Ref<number>;
  private selectors: Array<Selector>;
  private selectorCount: Ref<number>;
  private dialogs: Array<DialogForm>;
  private dialogCount: Ref<number>;
  private selectorFocusTargets: Map<symbol, HTMLElement>;
  private dialogFocusTargets: Map<symbol, HTMLElement>;
  private fabButtonInstances: Array<Button>;
  private fabOpen: Ref<boolean>;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private static defaultParams: AppParams = {
    showHeader: false,
    showFooter: false,
    showFab: false,
    fabIcon: 'mdi-plus',
    fabColor: 'primary',
    fabPosition: 'bottom-right',
    fabDirection: 'up',
    fabLabel: 'Quick Actions',
    fabShortcut: undefined,
    headerLayout: 'balanced',
    footerLayout: 'balanced',
  };

  constructor(params?: AppParams, options?: AppOptions) {
    super();
    this.params = this.$makeRef({...AppMain.defaultParams, ...(params || {})});
    this.options = options || {};
    this.stack = [];
    this.stackRefState = this.$makeRef([]);
    this.activeItemRefState = this.$makeRef(undefined);
    this.loaded = this.$makeRef(false);
    this.index = this.$makeRef(-1);
    this.selectorCount = this.$makeRef(0);
    this.dialogCount = this.$makeRef(0);
    this.selectors = [];
    this.dialogs = [];
    this.selectorFocusTargets = new Map();
    this.dialogFocusTargets = new Map();
    this.fabButtonInstances = [];
    this.fabOpen = this.$makeRef(false);
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

  get stackRef() {
    return this.stackRefState;
  }

  get activeItemRef() {
    return this.activeItemRefState;
  }

  private syncStackRefs() {
    this.stackRefState.value = [...this.stack];
    this.activeItemRefState.value = this.getActiveStackItem();
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
    const headerBar = this.renderShellBar('header');
    const footerBar = this.renderShellBar('footer');
    const showHeader = this.params.value.showHeader || !!headerBar || !!header;
    const showFooter = this.params.value.showFooter || !!footerBar || !!footer;

    if (!showHeader && !showFooter) {
      return this.wrapWithFab(content, showFooter);
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
            () => h(
              'div',
              {
                style: {
                  width: '100%',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                },
              },
              [headerBar || header || h(VAppBarTitle, {}, () => this.params.value.title || 'Application')]
            )
          ),
        ] : []),
        h(
          VMain,
          {
            class: ['vuetify-extended-app-main'],
            style: this.mainShellStyle(),
          },
          () => h(
            'div',
            {
              style: this.mainShellContentStyle(showFooter),
            },
            [
              ...(this.params.value.backgroundOverlay ? [
                h('div', { style: this.mainShellOverlayStyle() })
              ] : []),
              h(
                'div',
                {
                  style: {
                    position: 'relative',
                    zIndex: 1,
                    minHeight: '100%',
                  },
                },
                this.wrapWithFab(content, showFooter) as any
              ),
            ]
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
            () => footerBar || footer || ''
          ),
        ] : []),
      ]
    );
  }

  private renderStackContent(): VNode | VNode[] | undefined {
    const h = this.$h;

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      const item = this.stack[this.index.value].item;
      const itemNode = this.wrapStackItemContent(item, h(item.component));
      if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
        return [
          itemNode,
          ...this.selectors.map((s) => h(s.component)),
          ...this.dialogs.map((d) => h(d.component))
        ];
      }
      return itemNode;
    }

    if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
      return [
        ...this.selectors.map((s) => h(s.component)),
        ...this.dialogs.map((d) => h(d.component))
      ];
    }

    return undefined;
  }

  private wrapStackItemContent(item: UIBase, node: VNode) {
    const h = this.$h;

    if (item instanceof Menu) {
      return h('div', {
        style: {
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        },
      }, [node]);
    }

    return node;
  }

  private wrapWithFab(content: VNode | VNode[] | undefined, showFooter: boolean = false) {
    const h = this.$h;
    const fab = this.renderFabActions(showFooter);
    if (!fab) {
      return content;
    }

    const nodes = Array.isArray(content) ? content : (content ? [content] : []);
    return [
      ...nodes,
      fab,
    ];
  }

  private getActiveStackItem(): AppStackItem | undefined {
    if (this.index.value < 0 || this.index.value >= this.stack.length) {
      return undefined;
    }
    return this.stack[this.index.value];
  }

  private resolveFabConfig() {
    const active = this.getActiveStackItem();
    const itemScreen = ((active?.item as any)?.$screenParams || (active?.item as any)?.$appScreenParams || {}) as AppScreenParams;
    const screen = {
      ...itemScreen,
      ...(active?.params || {}),
    } as AppScreenParams;
    return {
      showFab: screen.showFab ?? this.params.value.showFab,
      fabIcon: screen.fabIcon ?? this.params.value.fabIcon,
      fabColor: screen.fabColor ?? this.params.value.fabColor,
      fabPosition: screen.fabPosition ?? this.params.value.fabPosition,
      fabDirection: screen.fabDirection ?? this.params.value.fabDirection,
      fabLabel: screen.fabLabel ?? this.params.value.fabLabel,
      fabShortcut: screen.fabShortcut ?? this.params.value.fabShortcut,
      fabButtons: screen.fabButtons ?? this.options.fabButtons,
      active,
    };
  }

  private resolveFabButtonSource(source: AppFabButtonsFactory | undefined, active?: AppStackItem) {
    if (!source) {
      return [];
    }

    if (typeof source === 'function') {
      return source(this, active?.item, active) || [];
    }

    return source || [];
  }

  private buildFabButtons() {
    this.fabButtonInstances.forEach((instance) => instance.removeEventListeners());
    const config = this.resolveFabConfig();
    this.fabButtonInstances = this.resolveFabButtonSource(config.fabButtons, config.active);
    this.fabButtonInstances.forEach((instance) => instance.setParent(this));
    return {
      buttons: this.fabButtonInstances.filter((instance) => !instance.$params.invisible),
      config,
    };
  }

  private renderFabActions(showFooter: boolean = false) {
    const { buttons, config } = this.buildFabButtons();
    if (!config.showFab || buttons.length === 0) {
      return undefined;
    }

    const h = this.$h;
    const right = config.fabPosition !== 'bottom-left';
    const location = right ? 'top end' : 'top start';

    return h('div', {
      style: {
        position: 'fixed',
        right: right ? '24px' : undefined,
        left: right ? undefined : '24px',
        bottom: showFooter ? '96px' : '24px',
        zIndex: 1200,
      },
    }, [
      h(VMenu, {
        modelValue: this.fabOpen.value,
        'onUpdate:modelValue': (value: boolean) => { this.fabOpen.value = value; },
        location,
        offset: 12,
        closeOnContentClick: true,
      }, {
        activator: ({ props: activatorProps }: any) => h(VBtn, {
          ...activatorProps,
          color: config.fabColor,
          icon: config.fabIcon,
          size: 'large',
          elevation: 8,
          title: config.fabLabel,
          'aria-label': config.fabLabel,
          style: {
            borderRadius: '999px',
          },
        }),
        default: () => h(VCard, {
          elevation: 8,
          style: {
            minWidth: '220px',
            maxWidth: '280px',
          },
        }, () => h(VCardText, {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
          },
        }, () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })])))),
      }),
    ]);
  }

  private triggerComponentShortcut(target: any, ev: KeyboardEvent) {
    if (!target) {
      return false;
    }

    if (typeof target.triggerButtonShortcut === 'function') {
      return !!target.triggerButtonShortcut(ev);
    }

    return false;
  }

  private triggerActiveScreenShortcut(ev: KeyboardEvent) {
    const activeItem = this.getActiveStackItem()?.item as any;
    const currentForm = activeItem?.currentForm;

    if (this.triggerComponentShortcut(currentForm, ev)) {
      return true;
    }

    if (ev.defaultPrevented) {
      return true;
    }

    if (this.triggerComponentShortcut(activeItem, ev)) {
      return true;
    }

    return ev.defaultPrevented;
  }

  private triggerFabButtonShortcut(ev: KeyboardEvent) {
    if (!this.fabOpen.value || ev.repeat) {
      return false;
    }

    const { buttons } = this.buildFabButtons();
    for (const button of buttons) {
      if (button.$params.disabled || button.$readonly) {
        continue;
      }

      const eventShortcut = normalizeButtonShortcutFromEvent(ev, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
      if (!eventShortcut) {
        continue;
      }

      const shortcut = normalizeButtonShortcut(button.$params.shortcut, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
      if (!shortcut || shortcut !== eventShortcut) {
        continue;
      }

      ev.preventDefault();
      this.fabOpen.value = false;
      button.triggerShortcut();
      return true;
    }

    return false;
  }

  private triggerFabShortcut(ev: KeyboardEvent) {
    if (ev.repeat) {
      return false;
    }

    const config = this.resolveFabConfig();
    if (!config.showFab) {
      return false;
    }

    const eventShortcut = normalizeButtonShortcutFromEvent(ev);
    if (!eventShortcut) {
      return false;
    }

    const shortcut = normalizeButtonShortcut(config.fabShortcut);
    if (!shortcut || shortcut !== eventShortcut) {
      return false;
    }

    ev.preventDefault();
    this.fabOpen.value = !this.fabOpen.value;
    return true;
  }

  private onAppKeydown(ev: KeyboardEvent) {
    if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
      return;
    }

    if (this.triggerActiveScreenShortcut(ev)) {
      return;
    }

    if (ev.defaultPrevented) {
      return;
    }

    if (this.triggerFabButtonShortcut(ev)) {
      return;
    }

    this.triggerFabShortcut(ev);
  }

  private renderShellRegion(region: 'header' | 'footer'): VNode | VNode[] | undefined {
    const render = region === 'header' ? this.options.header : this.options.footer;
    if (!render) {
      return undefined;
    }

    const content = render(this);
    return this.normalizeShellContent(content);
  }

  private renderShellBar(region: 'header' | 'footer'): VNode | undefined {
    const start = this.renderShellBarSection(region, 'Start');
    const center = this.renderShellBarSection(region, 'Center');
    const end = this.renderShellBarSection(region, 'End');

    if (!start && !center && !end) {
      return undefined;
    }

    const h = this.$h;
    const layout = this.getShellLayout(region);

    return h('div', {
      style: this.getShellBarContainerStyle(region, layout),
    }, [
      h('div', { style: this.getShellBarSectionStyle(region, 'Start', layout) }, start ? (Array.isArray(start) ? start : [start]) : []),
      h('div', { style: this.getShellBarSectionStyle(region, 'Center', layout) }, center ? (Array.isArray(center) ? center : [center]) : []),
      h('div', { style: this.getShellBarSectionStyle(region, 'End', layout) }, end ? (Array.isArray(end) ? end : [end]) : []),
    ]);
  }

  private renderShellBarSection(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End'): VNode | VNode[] | undefined {
    const key = `${region}${section}` as keyof AppOptions;
    const render = this.options[key] as ((app: AppMain) => AppShellContent | AppShellContent[]) | undefined;
    if (!render) {
      return undefined;
    }

    return this.normalizeShellContent(render(this));
  }

  private getShellLayout(region: 'header' | 'footer') {
    return (region === 'header' ? this.params.value.headerLayout : this.params.value.footerLayout) || 'balanced';
  }

  private getShellWidthValue(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End') {
    const key = `${region}${section}Width` as keyof AppParams;
    return this.params.value[key] as string | number | undefined;
  }

  private normalizeCssSize(value?: string | number) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
  }

  private getShellBarContainerStyle(region: 'header' | 'footer', layout: 'balanced'|'auto'|'stacked') {
    if (layout === 'stacked') {
      return {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: '10px',
      };
    }

    const startWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Start')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
    const centerWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Center')) || 'auto';
    const endWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'End')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');

    return {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: `${startWidth} ${centerWidth} ${endWidth}`,
      alignItems: 'center',
      gap: '16px',
    };
  }

  private getShellBarSectionStyle(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End', layout: 'balanced'|'auto'|'stacked') {
    const justifyContent = section === 'Start' ? 'flex-start' : section === 'Center' ? 'center' : 'flex-end';
    const width = this.normalizeCssSize(this.getShellWidthValue(region, section));

    return {
      minWidth: 0,
      width: layout === 'stacked' ? '100%' : width,
      display: 'flex',
      alignItems: 'center',
      justifyContent,
      gap: '12px',
      flexWrap: 'wrap',
    };
  }

  private mainShellStyle() {
    const image = this.params.value.backgroundImage;
    const gradient = this.params.value.backgroundGradient;
    const backgroundImage = [gradient, image ? `url(${image})` : undefined].filter(Boolean).join(', ');

    return {
      backgroundColor: this.params.value.backgroundColor,
      backgroundImage: backgroundImage || undefined,
      backgroundSize: this.params.value.backgroundSize || (image ? 'cover' : undefined),
      backgroundPosition: this.params.value.backgroundPosition || (image ? 'center center' : undefined),
      backgroundRepeat: this.params.value.backgroundRepeat || (image ? 'no-repeat' : undefined),
      backgroundAttachment: this.params.value.backgroundAttachment,
    };
  }

  private mainShellContentStyle(showFooter: boolean) {
    const activeItem = this.getActiveStackItem()?.item;
    const reserveFooterSpace = showFooter && !(activeItem instanceof Menu);

    return {
      position: 'relative',
      minHeight: '100%',
      paddingBottom: reserveFooterSpace ? '72px' : undefined,
    };
  }

  private mainShellOverlayStyle() {
    return {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: this.params.value.backgroundOverlay,
      zIndex: 0,
    };
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
    this.syncStackRefs();
    this.fabOpen.value = false;
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
    this.fabOpen.value = false;
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
    const itemId = Master.getItemId(options, Master.getDefaultIdField())

    return new Field({
      type: fieldMaps[ftype] || ftype,
      label: options.fieldLabel,
      hint: options.hint,
      placeholder: options.placeholder,
      icon: options.icon,
      required: options.isRequired,
      multiple: options.multiple || false,
      storage: `udfs.${itemId}`,
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
    this.fabOpen.value = false;
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

  attachEventListeners() {
    super.attachEventListeners();
    if (typeof window !== 'undefined' && !this.shortcutHandler) {
      this.shortcutHandler = (ev: KeyboardEvent) => this.onAppKeydown(ev);
      window.addEventListener('keydown', this.shortcutHandler);
    }
  }

  removeEventListeners() {
    super.removeEventListeners();
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }
  }

}

export const $APP = (params?: AppParams, options?: AppOptions) => new AppMain(params || {}, options || {});
