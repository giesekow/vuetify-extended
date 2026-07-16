import { VNode, Ref, nextTick } from "vue";
import { ReportMode, UIBase } from "./base";
import { VAvatar, VBtn, VCard, VCardTitle, VCol, VContainer, VIcon, VList, VListItem, VRow } from 'vuetify/components';
import { EventEmitter, OnHandler } from "./lib";
import { Report } from "./report";
import { Collection } from "./collection";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
import { describeShortcut, normalizeShortcut, normalizeShortcutFromEvent } from "./shortcut";
import { Trigger } from "./trigger";
import type { AppScreenParams } from "./appmain";
import { InlineNavigationOptions, NavigationMenuRestoreStep, NavigationScreenFactory, UIText } from "./runtime";

type MenuScreenTarget<T extends UIBase> = T | NavigationScreenFactory<T>;

export interface MenuParams {
  ref?: string;
  title?: UIText;
  presentation?: 'screen'|'side-nav';
  hideTitle?: boolean;
  hideBackButton?: boolean;
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
  private resizeHandler?: () => void;
  private resizeObserver?: ResizeObserver;
  private activeIndex: Ref<number>;
  private menuTopOffset: Ref<number>;
  private hostElement: Ref<HTMLElement|undefined>;
  private contentElement: Ref<HTMLElement|undefined>;
  private cardElements: Array<HTMLElement | undefined> = [];
  private replayPath: NavigationMenuRestoreStep[] = [];
  private static defaultParams: MenuParams = {
    keyboardNavigation: true,
    presentation: 'screen',
  };

  constructor(params?: MenuParams, options?: MenuOptions) {
    super();
    this.params = this.$makeRef({...Menu.defaultParams, ...(params || {})});
    this.options = options || {};
    this.loaded = this.$makeRef(false);
    this.activeIndex = this.$makeRef(-1);
    this.menuTopOffset = this.$makeRef(0);
    this.hostElement = this.$makeRef();
    this.contentElement = this.$makeRef();
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

  setParent(parent: UIBase) {
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
    if (this.isSideNavPresentation()) {
      return this.renderSideNav(props, context);
    }

    const h = this.$h;

    return h(
      'div',
      {
        ref: (el: Element | any) => this.setHostElement(el),
        style: {
          height: 'calc(100vh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px))',
          width: '100%',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      },
      [
        h(
          'div',
          {
            style: {
              width: '100%',
              boxSizing: 'border-box',
            },
          },
          [
            h('div', {
              style: {
                height: `${this.menuTopOffset.value}px`,
                width: '100%',
                flexShrink: 0,
              },
            }),
            h(
              'div',
              {
                ref: (el: Element | any) => this.setContentElement(el),
                style: {
                  width: '100%',
                  boxSizing: 'border-box',
                },
              },
              [
                h(
                  VContainer,
                  {
                    class: ['py-4'],
                    style: {
                      width: '100%',
                    },
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
                      style: { paddingTop: '16px', paddingBottom: '16px', paddingLeft: 'clamp(12px, 4vw, 24px)', paddingRight: 'clamp(12px, 4vw, 24px)', overflow: 'visible' },
                    },
                    () => this.build(props, context)
                  )
                )
              ]
            )
          ]
        )
      ]
    );
  }

  build(props: any, context: any) {
    const h = this.$h;
    return this.$h(
      VRow as any,
      {
        justify: this.params.value.justify || 'center',
        align: this.params.value.align || 'center',
        density: this.params.value.dense ? 'comfortable' : undefined,
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
            this.$text(this.params.value.title)
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
          ...(this.params.value.hideTitle ? [] : [title]),
          ...(this.hasParent() && !this.params.value.hideBackButton && this.childrenInstances.length > 6 ? [backTop] : []),
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
              style: { overflow: 'visible' },
            },
            () => h(
              VCard,
              {
                ref: (el: Element | any) => this.setCardElement(index, el),
                color: item.$params.color || 'primary',
                elevation: 4,
                class: ['mx-auto'],
                role: 'button',
                tabindex: this.params.value.keyboardNavigation ? -1 : undefined,
                'aria-selected': this.params.value.keyboardNavigation ? index === this.activeIndex.value : undefined,
                style: { ...this.menuCardSizingStyle(), ...this.menuCardStyle(index) } as any,
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
                      {
                        style: {
                          background: item.$params.iconBackgroundColor || 'rgba(255, 255, 255, 0.96)',
                        },
                      },
                      () => h(
                        VIcon,
                        {
                          color: item.$params.iconColor || item.$params.color || item.$params.textColor || 'rgb(var(--v-theme-on-surface))'
                        },
                        () => item.$params.icon || ''
                      )
                    ),
                    title: () => h(
                      'span',
                      {
                        class: ['text-h6']
                      },
                      this.$text(item.$params.text),
                    ),
                    subtitle: () => h(
                      'span',
                      this.$text(item.$params.subText),
                    ),
                    append: () => this.renderMenuItemShortcut(item),
                  }
                )
              )
            )
          )),
          ...(this.hasParent() && !this.params.value.hideBackButton ? [back] : [])
        ]
      }
    );
  }

  private renderSideNav(props: any, context: any) {
    const h = this.$h;
    const attrs = context?.attrs || {};

    if (!this.loaded.value) {
      void this.prepareChildren();
    }

    return h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        },
      },
      [
        ...(!this.params.value.hideTitle && this.params.value.title ? [
          h(
            'div',
            {
              style: {
                padding: '16px 16px 8px 16px',
                flexShrink: 0,
              },
            },
            [
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        fontSize: '1rem',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        minWidth: 0,
                        flex: '1 1 auto',
                      },
                    },
                    this.$text(this.params.value.title),
                  ),
                  ...(attrs?.sideNavShowCloseButton && typeof attrs?.sideNavOnClose === 'function' ? [
                    h(VBtn, {
                      icon: 'mdi-close',
                      variant: 'text',
                      size: 'small',
                      title: this.$text(
                        attrs?.sideNavCloseTooltip,
                        this.$uiText('ve.app.closeSideNav', 'Close panel'),
                      ),
                      'aria-label': this.$text(
                        attrs?.sideNavCloseTooltip,
                        this.$uiText('ve.app.closeSideNav', 'Close panel'),
                      ),
                      onClick: () => {
                        attrs.sideNavOnClose();
                      },
                    } as any),
                  ] : []),
                ],
              ),
            ],
          ),
        ] : []),
        h(
          'div',
          {
            style: {
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '8px',
              boxSizing: 'border-box',
            },
          },
          [
            h(
              VList,
              {
                density: this.params.value.dense ? 'compact' : 'comfortable',
                nav: true,
                style: {
                  background: 'transparent',
                },
              },
              () => this.childrenInstances.map((item, index) => h(
                VListItem,
                {
                  key: `${index}-${this.$text(item.$params.text)}`,
                  rounded: 'lg',
                  active: this.params.value.keyboardNavigation ? index === this.activeIndex.value : false,
                  color: item.$params.color || 'primary',
                  onMouseenter: () => this.setActiveIndex(index),
                  onClick: () => {
                    this.setActiveIndex(index);
                    void this.itemClicked(item);
                  },
                },
                {
                  prepend: () => item.$params.icon ? h(
                    VAvatar,
                    {
                      size: 34,
                      style: {
                        background: item.$params.iconBackgroundColor || 'rgba(var(--v-theme-surface), 0.92)',
                      },
                    },
                    () => h(
                      VIcon,
                      {
                        color: item.$params.iconColor || item.$params.color || item.$params.textColor || 'currentColor',
                      },
                      () => item.$params.icon || '',
                    ),
                  ) : undefined,
                  title: () => this.$text(item.$params.text),
                  subtitle: () => this.$text(item.$params.subText),
                  append: () => this.renderMenuItemShortcut(item),
                },
              )),
            ),
          ],
        ),
      ],
    );
  }

  private isSideNavPresentation() {
    return this.params.value.presentation === 'side-nav';
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

  private normalizeCssSize(value?: string | number) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
  }

  private clampToViewport(value?: string | number, fallback?: string | number) {
    const size = this.normalizeCssSize(value ?? fallback);
    if (!size) {
      return undefined;
    }

    if (size.includes('%') || size.includes('vw') || size.includes('vh') || size.includes('calc(') || size.includes('min(') || size.includes('max(') || size.includes('clamp(')) {
      return size;
    }

    return `min(calc(100vw - 32px), ${size})`;
  }

  private menuCardSizingStyle() {
    return {
      width: this.clampToViewport(this.params.value.width),
      maxWidth: this.clampToViewport(this.params.value.maxWidth, '100%'),
      minWidth: this.clampToViewport(this.params.value.minWidth),
      boxSizing: 'border-box',
    };
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
    void this.updateVerticalLayout();
  }

  private menuCardStyle(index: number) {
    if (!this.params.value.keyboardNavigation || index !== this.activeIndex.value) {
      return undefined;
    }

    return {
      border: '5px solid rgba(255,255,255,0.99)',
      borderRadius: '12px',
      boxSizing: 'border-box',
      boxShadow: '0 0 0 3px rgba(13, 17, 23, 0.94), 0 0 0 10px rgba(255,255,255,0.16), 0 18px 36px rgba(0,0,0,0.34)',
      transform: 'translateY(-3px) scale(1.015)',
      filter: 'saturate(1.12) brightness(1.08) contrast(1.04)',
      transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease, filter 120ms ease',
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


  private setHostElement(el: Element | any) {
    const root = el instanceof HTMLElement ? el : el?.$el;
    const nextRoot = root instanceof HTMLElement ? root : undefined;

    if (this.hostElement.value === nextRoot) {
      return;
    }

    this.hostElement.value = nextRoot;
    if (this.resizeObserver && nextRoot) {
      this.resizeObserver.observe(nextRoot);
    }
    void this.updateVerticalLayout();
  }

  private setContentElement(el: Element | any) {
    const root = el instanceof HTMLElement ? el : el?.$el;
    const nextRoot = root instanceof HTMLElement ? root : undefined;

    if (this.contentElement.value === nextRoot) {
      return;
    }

    this.contentElement.value = nextRoot;
    if (this.resizeObserver && nextRoot) {
      this.resizeObserver.observe(nextRoot);
    }
    void this.updateVerticalLayout();
  }

  private async updateVerticalLayout() {
    await nextTick();

    const host = this.hostElement.value;
    const content = this.contentElement.value;
    if (!host || !content) {
      return;
    }

    const usableHeight = host.clientHeight;
    const contentHeight = content.scrollHeight;

    if (!usableHeight || !contentHeight) {
      this.menuTopOffset.value = 0;
      return;
    }

    if (contentHeight >= usableHeight) {
      this.menuTopOffset.value = 0;
      return;
    }

    const freeSpace = Math.max(usableHeight - contentHeight, 0);
    const centeredTop = freeSpace / 2;
    const oneThirdTop = freeSpace / 3;
    this.menuTopOffset.value = Math.max(Math.floor(Math.min(centeredTop, oneThirdTop)), 0);
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

    if (this.childrenInstances.length > 0) {
      if (direction === 'left' || direction === 'up') {
        this.setActiveIndex(this.childrenInstances.length - 1);
        return true;
      }

      if (direction === 'right' || direction === 'down') {
        this.setActiveIndex(0);
        return true;
      }
    }

    return false;
  }

  private async itemClicked(item: MenuItem) {
    await executeMenuItemAction(item, this);
  }

  private async backClicked() {
    this.handleOn('cancel', this);
  }

  async $reload() {
    await this.prepareChildren();
  }

  async $getVisibleItems() {
    if (!this.loaded.value) {
      await this.prepareChildren();
    }

    return [...this.childrenInstances];
  }

  setReplayPath(path?: NavigationMenuRestoreStep[]) {
    this.replayPath = Array.isArray(path)
      ? path.map((step) => ({ ...step }))
      : [];
  }

  getReplayPath() {
    return this.replayPath.map((step) => ({ ...step }));
  }

  buildReplayPathForItem(item: MenuItem) {
    const index = this.childrenInstances.indexOf(item);
    if (index < 0) {
      return this.getReplayPath();
    }

    return [
      ...this.getReplayPath(),
      {
        index,
        text: this.$text(item.$params.text),
        action: item.$params.action,
      },
    ];
  }

  async forceCancel() {
    await this.hide();
    this.backClicked();
  }

  setup(props: any, context: any) {
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  mounted() {
    this.setupVerticalLayoutObservers();
    void this.updateVerticalLayout();
  }

  unmounted() {
    this.teardownVerticalLayoutObservers();
  }

  private setupVerticalLayoutObservers() {
    if (typeof window !== 'undefined' && !this.resizeHandler) {
      this.resizeHandler = () => {
        void this.updateVerticalLayout();
      };
      window.addEventListener('resize', this.resizeHandler);
    }

    if (typeof ResizeObserver !== 'undefined' && !this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        void this.updateVerticalLayout();
      });

      if (this.hostElement.value) {
        this.resizeObserver.observe(this.hostElement.value);
      }

      if (this.contentElement.value) {
        this.resizeObserver.observe(this.contentElement.value);
      }
    }
  }

  private teardownVerticalLayoutObservers() {
    if (typeof window !== 'undefined' && this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  attachEventListeners() {
    super.attachEventListeners();

    if (this.isSideNavPresentation() || typeof window === 'undefined' || this.shortcutHandler) {
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

    this.teardownVerticalLayoutObservers();
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
  action?: 'report'|'collection'|'trigger'|'ui'|'function'|'menu';
  mode?: ReportMode;
  text?: UIText;
  subText?: UIText;
  shortcut?: string;
  shortcutDisplay?: 'text'|'compact';
  shortcutFontSize?: string | number;
  shortcutShiftIcon?: string;
  cmdForCtrlOnMac?: boolean;
  icon?: string;
  color?: string;
  textColor?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
}

export interface MenuItemOptions {
  access?: (menuItem: MenuItem, mode?: ReportMode) => Promise<boolean|undefined>|boolean|undefined;
  report?: (menuItem: MenuItem, mode?: ReportMode) => Promise<MenuScreenTarget<Report>|undefined>|MenuScreenTarget<Report>|undefined;
  collection?: (menuItem: MenuItem, mode?: ReportMode) => Promise<MenuScreenTarget<Collection>|undefined>|MenuScreenTarget<Collection>|undefined;
  trigger?: (menuItem: MenuItem, mode?: ReportMode) => Promise<MenuScreenTarget<Trigger>|undefined>|MenuScreenTarget<Trigger>|undefined;
  ui?: (menuItem: MenuItem, mode?: ReportMode) => Promise<MenuScreenTarget<UIBase>|undefined>|MenuScreenTarget<UIBase>|undefined;
  menu?:(menuItem: MenuItem, mode?: ReportMode) => Promise<MenuScreenTarget<Menu>|undefined>|MenuScreenTarget<Menu>|undefined;
  navigation?: (menuItem: MenuItem, mode?: ReportMode) => Promise<InlineNavigationOptions<any> | undefined> | InlineNavigationOptions<any> | undefined;
  showParams?: (menuItem: MenuItem, mode?: ReportMode) => Promise<AppScreenParams | undefined> | AppScreenParams | undefined;
  replace?: (menuItem: MenuItem, mode?: ReportMode) => Promise<boolean | undefined> | boolean | undefined;
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

  async report (mode?: ReportMode): Promise<MenuScreenTarget<Report>|undefined> {
    return this.options.report ? await this.options.report(this, mode) : undefined;
  }

  async collection (mode?: ReportMode): Promise<MenuScreenTarget<Collection>|undefined> {
    return this.options.collection ? await this.options.collection(this, mode) : undefined;
  }

  async trigger (mode?: ReportMode): Promise<MenuScreenTarget<Trigger>|undefined> {
    return this.options.trigger ? await this.options.trigger(this, mode) : undefined;
  }

  async ui (mode?: ReportMode): Promise<MenuScreenTarget<UIBase>|undefined> {
    return this.options.ui ? await this.options.ui(this, mode) : undefined;
  }

  async menu (mode?: ReportMode): Promise<MenuScreenTarget<Menu>|undefined> {
    return this.options.menu ? await this.options.menu(this, mode) : undefined;
  }

  async navigation(mode?: ReportMode): Promise<InlineNavigationOptions<any> | undefined> {
    return this.options.navigation ? await this.options.navigation(this, mode) : undefined;
  }

  async showParams(mode?: ReportMode): Promise<AppScreenParams | undefined> {
    return this.options.showParams ? await this.options.showParams(this, mode) : undefined;
  }

  async replace(mode?: ReportMode): Promise<boolean | undefined> {
    return this.options.replace ? await this.options.replace(this, mode) : undefined;
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

function mergeMenuItemShowParams(
  baseParams?: AppScreenParams,
  navigation?: InlineNavigationOptions<any>,
): AppScreenParams {
  if (!navigation) {
    return { ...(baseParams || {}) };
  }

  return {
    ...(baseParams || {}),
    navigation: {
      ...((baseParams || {}).navigation || {}),
      ...navigation,
    },
  };
}

async function resolveMenuItemNavigationContext(item: MenuItem, mode?: ReportMode) {
  const navigation = await item.navigation(mode);
  const showParams = await item.showParams(mode);
  const replace = (await item.replace(mode)) === true;

  return {
    params: mergeMenuItemShowParams(showParams, navigation),
    replace,
  };
}

export async function prepareMenuReplayTarget(parent: Menu, step: NavigationMenuRestoreStep) {
  const items = await parent.$getVisibleItems();
  const matchesStep = (candidate?: MenuItem) => {
    if (!candidate || candidate.$params.action !== 'menu') {
      return false;
    }

    if (step.action && candidate.$params.action !== step.action) {
      return false;
    }

    if (step.text && parent.$text(candidate.$params.text) !== step.text && step.index !== items.indexOf(candidate)) {
      return false;
    }

    return true;
  };

  let candidate: MenuItem | undefined = items[step.index];
  if (!matchesStep(candidate) && step.text) {
    candidate = items.find((item) => item.$params.action === 'menu' && parent.$text(item.$params.text) === step.text);
  }

  if (!matchesStep(candidate)) {
    return undefined;
  }
  if (!candidate) {
    return undefined;
  }
  const selectedCandidate = candidate;

  const mode = selectedCandidate.$params.mode;
  const { params } = await resolveMenuItemNavigationContext(selectedCandidate, mode);
  const preferFactory = !!(params.navigation?.key || params.navigationKey);
  const target = await resolveMenuItemTarget(selectedCandidate, (currentMode) => selectedCandidate.menu(currentMode), mode, parent, preferFactory);
  if (!target) {
    return undefined;
  }

  return {
    mode,
    params,
    target,
  };
}

async function resolveMenuItemTarget<T extends UIBase>(
  item: MenuItem,
  resolver: (mode?: ReportMode) => Promise<MenuScreenTarget<T> | undefined>,
  mode?: ReportMode,
  parent?: UIBase,
  preferFactory?: boolean,
): Promise<MenuScreenTarget<T> | undefined> {
  if (preferFactory) {
    return async (entry) => {
      const dynamicMode = (entry?.mode as ReportMode | undefined) || mode;
      const dynamicTarget = await resolver(dynamicMode);
      if (!dynamicTarget) {
        return undefined;
      }

      const created = typeof dynamicTarget === 'function'
        ? await (dynamicTarget as NavigationScreenFactory<T>)(entry)
        : dynamicTarget;

      if (!created) {
        return undefined;
      }

      if (dynamicMode && (created as any)?.$params) {
        (created as any).$params.mode = dynamicMode;
      }

      if (parent && created instanceof Menu) {
        created.setParent(parent);
      }

      return created;
    };
  }

  const resolvedTarget = await resolver(mode);
  if (!resolvedTarget) {
    return undefined;
  }

  if (typeof resolvedTarget === 'function') {
    const factory = resolvedTarget as NavigationScreenFactory<T>;
    return async (entry) => {
      const created = await factory(entry);
      if (!created) {
        return undefined;
      }

      if (mode && (created as any)?.$params) {
        (created as any).$params.mode = entry?.mode || mode;
      }

      if (parent && created instanceof Menu) {
        created.setParent(parent);
      }

      return created;
    };
  }

  const instance = resolvedTarget as T;
  if (mode && (instance as any)?.$params) {
    (instance as any).$params.mode = mode;
  }

  if (parent && instance instanceof Menu) {
    instance.setParent(parent);
  }

  return instance;
}

async function showPreparedMenuItemTarget<T extends UIBase>(
  type: 'menu' | 'report' | 'collection' | 'trigger' | 'ui',
  target: MenuScreenTarget<T>,
  params: AppScreenParams,
  replace: boolean,
  mode?: ReportMode,
) {
  const resolved = await AppManager.prepareScreenTarget(type, target, params);
  if (!resolved.item) {
    return;
  }

  if (mode && (resolved.item as any)?.$params) {
    (resolved.item as any).$params.mode = mode;
  }

  let allowed = true;
  if (type === 'menu' && typeof (resolved.item as any)?.access === 'function') {
    allowed = await (resolved.item as any).access();
  } else if ((type === 'report' || type === 'collection' || type === 'trigger') && typeof (resolved.item as any)?.access === 'function') {
    allowed = await (resolved.item as any).access(mode);
  }

  if (!allowed) {
    Dialogs.$error({ key: 've.common.accessDenied', fallback: 'Access Denied' });
    return;
  }

  if (type === 'menu') {
    AppManager.showMenu(resolved.item as any, resolved.params);
    return;
  }

  if (type === 'report') {
    AppManager.showReport(resolved.item as any, resolved.params, replace);
    return;
  }

  if (type === 'collection') {
    AppManager.showCollection(resolved.item as any, resolved.params, replace);
    return;
  }

  if (type === 'trigger') {
    AppManager.showTrigger(resolved.item as any, resolved.params, replace);
    return;
  }

  AppManager.showUI(resolved.item as any, resolved.params, replace);
}

export async function executeMenuItemAction(item: MenuItem, parent?: UIBase) {
  const mode = item.$params.mode;
  const { params, replace } = await resolveMenuItemNavigationContext(item, mode);
  const preferFactory = !!(params.navigation?.key || params.navigationKey);

  if (item.$params.action === 'menu') {
    if (parent instanceof Menu) {
      const menuRestorePath = params.navigation?.menuRestorePath || params.navigationMenuRestorePath || parent.buildReplayPathForItem(item);
      params.navigationMenuRestorePath = menuRestorePath;
      params.navigation = {
        ...(params.navigation || {}),
        menuRestorePath,
      };
    }

    const target = await resolveMenuItemTarget(item, (currentMode) => item.menu(currentMode), mode, parent, preferFactory);
    if (target) {
      await showPreparedMenuItemTarget('menu', target, params, replace, mode);
    }
    return;
  }

  if (item.$params.action === 'collection') {
    const target = await resolveMenuItemTarget(item, (currentMode) => item.collection(currentMode), mode, parent, preferFactory);
    if (target) {
      await showPreparedMenuItemTarget('collection', target, params, replace, mode);
    }
    return;
  }

  if (item.$params.action === 'report') {
    const target = await resolveMenuItemTarget(item, (currentMode) => item.report(currentMode), mode, parent, preferFactory);
    if (target) {
      await showPreparedMenuItemTarget('report', target, params, replace, mode);
    }
    return;
  }

  if (item.$params.action === 'trigger') {
    const target = await resolveMenuItemTarget(item, (currentMode) => item.trigger(currentMode), mode, parent, preferFactory);
    if (target) {
      await showPreparedMenuItemTarget('trigger', target, params, replace, mode);
    }
    return;
  }

  if (item.$params.action === 'ui') {
    const target = await resolveMenuItemTarget(item, (currentMode) => item.ui(currentMode), mode, parent, preferFactory);
    if (target) {
      await showPreparedMenuItemTarget('ui', target, params, replace, mode);
    }
    return;
  }

  if (item.$params.action === 'function') {
    await item.callback(mode);
  }
}

export const $MN = (params?: MenuParams, options?: MenuOptions) => new Menu(params || {}, options || {});
export const $MI = (params?: MenuItemParams, options?: MenuItemOptions) => new MenuItem(params || {}, options || {});
