import { VNode, Ref, nextTick } from "vue";
import { ReportMode, UIBase } from "./base";
import { VAvatar, VBtn, VCard, VCardTitle, VCol, VContainer, VIcon, VLayout, VListItem, VRow } from 'vuetify/components';
import { EventEmitter, OnHandler } from "./lib";
import { Report } from "./report";
import { Collection } from "./collection";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
import { describeShortcut, normalizeShortcut, normalizeShortcutFromEvent } from "./shortcut";

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
  keyboardNavigation?: boolean;
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
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private activeIndex: Ref<number>;
  private cardElements: Array<HTMLElement | undefined> = [];
  private static defaultParams: MenuParams = {
    keyboardNavigation: true,
  };

  constructor(params?: MenuParams, options?: MenuOptions) {
    super();
    this.params = this.$makeRef({...Menu.defaultParams, ...(params || {})});
    this.options = options || {};
    this.loaded = this.$makeRef(false);
    this.activeIndex = this.$makeRef(-1);
  }

  static setDefault(value: MenuParams, reset?: boolean): void {
    if (reset) {
      Menu.defaultParams = value;
    } else {
      Menu.defaultParams = {...Menu.defaultParams, ...value};
    }
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
          ...this.childrenInstances.map((item, index) => h(
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
                ref: (el: Element | any) => this.setCardElement(index, el),
                color: item.$params.color || 'primary',
                elevation: 4,
                maxWidth: this.params.value.maxWidth,
                minWidth: this.params.value.minWidth,
                width: this.params.value.width,
                class: ['mx-auto'],
                role: 'button',
                tabindex: this.params.value.keyboardNavigation ? -1 : undefined,
                'aria-selected': this.params.value.keyboardNavigation ? index === this.activeIndex.value : undefined,
                style: this.menuCardStyle(index),
                onMouseenter: () => this.setActiveIndex(index),
                onClick: () => {
                  this.setActiveIndex(index);
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
                    ),
                    append: () => this.renderMenuItemShortcut(item),
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


  private renderMenuItemShortcut(item: MenuItem) {
    const h = this.$h;
    const displayShortcut = describeShortcut(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });

    if (!displayShortcut) {
      return undefined;
    }

    if (item.$params.shortcutDisplay === 'compact') {
      return h(
        'span',
        {
          class: ['text-caption'],
          title: displayShortcut.label,
          'aria-label': displayShortcut.label,
          'aria-keyshortcuts': displayShortcut.label,
          style: {
            opacity: '0.82',
            fontWeight: '600',
            fontSize: item.$params.shortcutFontSize || '0.8rem',
            lineHeight: '1.5',
            letterSpacing: '0.03em',
            padding: '1px 1px',
            border: '1px solid currentColor',
            borderRadius: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
            minWidth: (displayShortcut.shift || displayShortcut.meta) ? '2.4em' : '1.8em',
            whiteSpace: 'nowrap',
          },
        },
        [
          ...(displayShortcut.meta ? [
            h(
              VIcon,
              {
                icon: 'mdi-apple-keyboard-command',
                size: '1.05em',
                style: {
                  opacity: '1',
                  marginRight: displayShortcut.shift ? '-0.3em' : '-0.15em',
                  marginLeft: '-0.05em',
                },
              }
            ),
          ] : []),
          ...(displayShortcut.shift ? [
            h(
              VIcon,
              {
                icon: item.$params.shortcutShiftIcon || 'mdi-arrow-up-thin',
                size: '1.5em',
                style: {
                  opacity: '1',
                  marginRight: '-0.8em',
                  marginLeft: '-0.2em',
                },
              }
            ),
          ] : []),
          h(
            'span',
            {
              style: {
                textDecorationLine: [displayShortcut.ctrl ? 'underline' : '', displayShortcut.alt ? 'overline' : ''].filter(Boolean).join(' ') || 'none',
                textDecorationThickness: (displayShortcut.ctrl || displayShortcut.alt) ? '1px' : undefined,
                textUnderlineOffset: displayShortcut.ctrl ? '1px' : undefined,
                textDecorationSkipInk: 'none',
                textDecorationColor: 'currentColor',
                display: 'inline-block',
                minWidth: '1.8em',
                textAlign: 'center',
                paddingTop: displayShortcut.alt ? '2px' : undefined,
              },
            },
            displayShortcut.key
          ),
        ]
      );
    }

    return h(
      'span',
      {
        class: ['text-caption'],
        title: displayShortcut.label,
        'aria-label': displayShortcut.label,
        'aria-keyshortcuts': displayShortcut.label,
        style: {
          fontWeight: '500',
          fontSize: item.$params.shortcutFontSize || '0.5rem',
          letterSpacing: '0.02em',
          color: 'inherit',
          opacity: '1',
        },
      },
      displayShortcut.label
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
    this.cardElements = new Array(this.childrenInstances.length);

    this.childrenInstances.forEach((instance) => {
      instance.setParent(this);
    })

    if (this.childrenInstances.length === 0) {
      this.activeIndex.value = -1;
    } else if (this.activeIndex.value < 0 || this.activeIndex.value >= this.childrenInstances.length) {
      this.activeIndex.value = 0;
    }

    this.loaded.value = true;
    void this.ensureActiveCardVisible();
  }

  private menuCardStyle(index: number) {
    if (!this.params.value.keyboardNavigation || index !== this.activeIndex.value) {
      return undefined;
    }

    return {
      outline: '4px solid rgba(255,255,255,0.98)',
      outlineOffset: '4px',
      boxShadow: '0 0 0 8px rgba(0,0,0,0.28), 0 14px 32px rgba(0,0,0,0.28)',
      transform: 'translateY(-2px) scale(1.01)',
      filter: 'saturate(1.08) brightness(1.04)',
      transition: 'outline-offset 120ms ease, box-shadow 120ms ease, transform 120ms ease, filter 120ms ease',
    };
  }

  private setCardElement(index: number, el: Element | any) {
    const root = el instanceof HTMLElement ? el : el?.$el;
    this.cardElements[index] = root instanceof HTMLElement ? root : undefined;
  }

  private setActiveIndex(index: number) {
    if (!this.params.value.keyboardNavigation) {
      return;
    }

    if (index < 0 || index >= this.childrenInstances.length) {
      return;
    }

    this.activeIndex.value = index;
    void this.ensureActiveCardVisible();
  }

  private async ensureActiveCardVisible() {
    if (!this.params.value.keyboardNavigation) {
      return;
    }

    await nextTick();
    const el = this.cardElements[this.activeIndex.value];
    el?.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  private activateCurrentItem() {
    if (!this.params.value.keyboardNavigation) {
      return false;
    }

    const item = this.childrenInstances[this.activeIndex.value];
    if (!item) {
      return false;
    }

    void this.itemClicked(item);
    return true;
  }

  private moveActiveIndex(direction: 'left'|'right'|'up'|'down') {
    if (!this.params.value.keyboardNavigation || this.childrenInstances.length === 0) {
      return false;
    }

    if (this.activeIndex.value < 0 || !this.cardElements[this.activeIndex.value]) {
      this.setActiveIndex(0);
      return true;
    }

    const currentEl = this.cardElements[this.activeIndex.value];
    if (!currentEl) {
      this.setActiveIndex(0);
      return true;
    }

    const currentRect = currentEl.getBoundingClientRect();
    const currentCenterX = currentRect.left + currentRect.width / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;

    let bestIndex = -1;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let index = 0; index < this.cardElements.length; index++) {
      if (index === this.activeIndex.value) {
        continue;
      }

      const el = this.cardElements[index];
      if (!el) {
        continue;
      }

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = centerX - currentCenterX;
      const deltaY = centerY - currentCenterY;

      if (direction === 'left' && deltaX >= -4) continue;
      if (direction === 'right' && deltaX <= 4) continue;
      if (direction === 'up' && deltaY >= -4) continue;
      if (direction === 'down' && deltaY <= 4) continue;

      const horizontal = direction === 'left' || direction === 'right';
      const primary = horizontal ? Math.abs(deltaX) : Math.abs(deltaY);
      const secondary = horizontal ? Math.abs(deltaY) : Math.abs(deltaX);
      const score = primary * 1000 + secondary;

      if (score < bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    if (bestIndex >= 0) {
      this.setActiveIndex(bestIndex);
      return true;
    }

    return false;
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
        if (await collection.access(item.$params.mode)) {
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
        if (await report.access(item.$params.mode)) {
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

  attachEventListeners() {
    super.attachEventListeners();

    if (typeof window === 'undefined' || this.shortcutHandler) {
      return;
    }

    this.shortcutHandler = (ev: KeyboardEvent) => this.onShortcutKeydown(ev);
    window.addEventListener('keydown', this.shortcutHandler);
  }

  removeEventListeners() {
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }

    super.removeEventListeners();
  }

  private onShortcutKeydown(ev: KeyboardEvent) {
    if (Dialogs.hasBlockingDialog() || ev.defaultPrevented || ev.repeat || this.shouldIgnoreShortcut(ev)) {
      return;
    }

    if (this.params.value.keyboardNavigation) {
      if (ev.key === 'ArrowLeft' && this.moveActiveIndex('left')) {
        ev.preventDefault();
        return;
      }

      if (ev.key === 'ArrowRight' && this.moveActiveIndex('right')) {
        ev.preventDefault();
        return;
      }

      if (ev.key === 'ArrowUp' && this.moveActiveIndex('up')) {
        ev.preventDefault();
        return;
      }

      if (ev.key === 'ArrowDown' && this.moveActiveIndex('down')) {
        ev.preventDefault();
        return;
      }

      if (ev.key === 'Home' || ev.key === 'PageUp') {
        ev.preventDefault();
        this.setActiveIndex(0);
        return;
      }

      if (ev.key === 'End' || ev.key === 'PageDown') {
        ev.preventDefault();
        this.setActiveIndex(Math.max(this.childrenInstances.length - 1, 0));
        return;
      }

      if ((ev.key === 'Enter' || ev.key === ' ') && this.activateCurrentItem()) {
        ev.preventDefault();
        return;
      }
    }

    for (const item of this.childrenInstances) {
      const eventShortcut = normalizeShortcutFromEvent(ev, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
      if (!eventShortcut) {
        continue;
      }

      const itemShortcut = normalizeShortcut(item.$params.shortcut, { cmdForCtrlOnMac: item.$params.cmdForCtrlOnMac });
      if (!itemShortcut || itemShortcut !== eventShortcut) {
        continue;
      }

      ev.preventDefault();
      this.setActiveIndex(this.childrenInstances.indexOf(item));
      this.itemClicked(item);
      return;
    }

    if (normalizeShortcutFromEvent(ev) === 'escape' && this.hasParent()) {
      ev.preventDefault();
      this.backClicked();
    }
  }

  private shouldIgnoreShortcut(ev: KeyboardEvent) {
    const target = ev.target;

    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
      return true;
    }

    return false;
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
  shortcut?: string;
  shortcutDisplay?: 'text'|'compact';
  shortcutFontSize?: string | number;
  shortcutShiftIcon?: string;
  cmdForCtrlOnMac?: boolean;
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
  private static defaultParams: MenuItemParams = {
    cmdForCtrlOnMac: true,
  };

  constructor(params?: MenuItemParams, options?: MenuItemOptions) {
    super();
    this.params = {...MenuItem.defaultParams, ...(params || {})};
    this.$id = Symbol('id');
    this.options = options || {};
  }

  static setDefault(value: MenuItemParams, reset?: boolean): void {
    if (reset) {
      MenuItem.defaultParams = value;
    } else {
      MenuItem.defaultParams = {...MenuItem.defaultParams, ...value};
    }
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
