import { VNode, Ref, nextTick } from "vue";
import { UIBase } from "./base";
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VCardSubtitle, VCol, VDialog, VAutocomplete } from 'vuetify/components';
import { Button, ButtonParams } from "./button";
import { OnHandler } from "./lib";

export interface SelectorParams {
  ref?: string;
  invisible?: boolean;
  persistent?: boolean;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  mode?: 'create'|'edit'|'display';
  cancelButton?: ButtonParams,
  saveButton?: ButtonParams,
  elevation?: number;
  maxWidth?: number|string|undefined;
  minWidth?: number|string|undefined;
  width?: number|string|undefined;
  selectFields?: any;
  objectType?: any;
  idField?: any;
  returnObject?: boolean;
  textField?: any;
  defaultButtonPosition?: "top"|"bottom"|"both";
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}

export interface SelectorOptions {
  cancel?: () => Promise<void>;
  access?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<boolean>|boolean;
  load?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any[]>|any[];
  query?: (selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  format?: (item: any, items: any[], selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  selected?: (item: any, selector: Selector, mode?: 'create'|'edit'|'display') => Promise<any>|any;
  setup?: (selector: Selector) => void;
  on?: (selector: Selector) => OnHandler;
}

export class Selector extends UIBase {
  private params: Ref<SelectorParams>;
  private hasAccess: Ref<boolean>;
  private options: SelectorOptions;
  private topButtonInstances: Array<Button> = [];
  private bottomButtonInstances: Array<Button> = [];
  private items: Ref<any[]|undefined>;
  private storage: Ref<any|undefined>;
  private dialog: Ref<boolean>;
  private loading: Ref<boolean>;
  private dialogRoot: Ref<HTMLElement|undefined>;
  private loaded = false;
  private static defaultParams: SelectorParams = {};

  constructor(params?: SelectorParams, options?: SelectorOptions) {
    super();
    this.params = this.$makeRef({...Selector.defaultParams, ...(params || {})});
    this.options = options || {};
    this.hasAccess = this.$makeRef(true);
    this.items = this.$makeRef([]);
    this.storage = this.$makeRef();
    this.dialog = this.$makeRef(false);
    this.loading = this.$makeRef(false);
    this.dialogRoot = this.$makeRef();
  }

  static setDefault(value: SelectorParams, reset?: boolean): void {
    if (reset) {
      Selector.defaultParams = value;
    } else {
      Selector.defaultParams = {...Selector.defaultParams, ...value};
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: SelectorParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): SelectorParams {
    return this.params.value;
  }

  get $access(): boolean {
    return this.hasAccess.value;
  }

  private async runAccess() {
    try {
      this.hasAccess.value = await this.access(this.$params.mode) || false;
    } catch (error) {
      this.hasAccess.value = false;
    }
  }

  async validate (): Promise<string|true|undefined|void> {
  }

  async selected(item: any, mode?:'create'|'edit'|'display') {}

  async format(item: any, items: any[]): Promise<any|undefined> {
    return item;
  }

  async cancel() {}

  async access(mode?: 'create'|'edit'|'display'): Promise<boolean> {
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async load(mode?: 'create'|'edit'|'display'): Promise<any[]> {
    let data: any = null;

    if (this.$params.objectType) {
      let query: any = {};
      
      if (this.options.query) {
        query = await this.options.query(this, this.params.value.mode);
      } else {
        if (this.params.value.selectFields) {
          query.$select = this.params.value.selectFields;
        }
      }

      query.$paginate = false;
      data = await this.$app.service(this.params.value.objectType).find({query});
    }

    return data;
  }

  async query(search: string, mode?: 'create'|'edit'|'display'): Promise<any> {}

  props() {
    return []
  }

  private async loadItems() {
    this.loading.value = true;

    try {
      let data: any = null;

      if (this.options.load) {
        data = await this.options.load(this, this.params.value.mode);
      } else {
        data = await this.load(this.params.value.mode);
      }
      
      const items = Array.isArray(data) ? data : data.data || [];
      const formatted = [];
      for (let i = 0; i < items.length; i++) {
        const d = this.options.format ? await this.options.format(items[i], items, this): await this.format(items[i], items);
        if (d) formatted.push(d);
      }

      this.items.value = formatted;
    } finally {
      this.loading.value = false;
    }

  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;

    if(!this.loaded) {
      this.loaded = true;
      this.initialize();
    }
    
    if (this.params.value.invisible) {
      return;
    }

    return h(
      VDialog,
      {
        modelValue: this.dialog.value,
        persistent: this.params.value.persistent !== false,
        maxWidth: this.params.value.maxWidth,
        width: this.params.value.width,
        minWidth: this.params.value.minWidth,
        onAfterEnter: () => this.focusPrimaryInput(),
      },
      () => h(
        'div',
        {
          ref: (el: Element | any) => this.setDialogRoot(el)
        },
        [
          h(
          VCard,
          {
            maxWidth: this.params.value.maxWidth,
            width: this.params.value.width,
            minWidth: this.params.value.minWidth,
            elevation: this.params.value.elevation
          },
          () => [
            this.buildTitle(props, context),
            ...(this.params.value.subtitle ? [this.buildSubTitle(props, context)] : []),
            this.buildTopActions(props, context),
            h(VDivider),
            this.buildBody(props, context),
            h(VDivider),
            this.buildBottomActions(props, context),
          ]
          )
        ]
      )
    );
  }

  private buildTitle(props: any, context: any) {
    const h = this.$h;
    return h(
      VCardTitle,
      {},
      () => h(
        'span',
        {},
        this.$params.title || ''
      )
    );
  }

  private buildSubTitle(props: any, context: any) {
    const h = this.$h;
    return h(
      VCardSubtitle,
      {},
      () => h(
        'span',
        {},
        this.params.value.subtitle || ""
      )
    );
  }

  private buildBody(props: any, context: any) {
    const h = this.$h;

    if(!this.hasAccess.value) {
      return h(
        VCardText,
        {
          class: 'text-center'
        },
        () => h(
          'span',
          {
            class: 'title'
          },
          'Access Denied!'
        )
      )
    }

    return h(
      VCardText,
      {},
      () => h(
        VRow,
        {
          justify: this.params.value.justify,
          align: this.params.value.align,
          dense: this.params.value.dense,
          alignContent: this.params.value.alignContent,
        },
        () => [
          ...this.buildSearchBar(),
          ...this.buildStatusMessage(),
        ]
      )
    )
  }

  private buildSearchBar() {
    const h = this.$h;

    return [
      h(
        VCol,
        {},
        () => h(
          VAutocomplete,
          {
            variant: 'outlined',
            placeholder: 'Search Object',
            density: 'compact',
            modelValue: this.storage.value,
            "onUpdate:modelValue": (value: any) => {
              this.storage.value = value;
            },
            autofocus: true,
            multiple: this.params.value.multiple,
            items: this.items.value,
            itemTitle: this.params.value.textField || "name",
            itemValue: this.params.value.idField || "_id",
            returnObject: this.params.value.returnObject,
            onKeyup: (ev: KeyboardEvent) => this.onSelectorKeyup(ev),
          },
        )
      )
    ]
  }

  private buildStatusMessage() {
    const h = this.$h;

    let message: string | undefined;

    if (this.loading.value) {
      message = 'Loading options...';
    } else if ((this.items.value || []).length === 0) {
      message = 'No records available to select.';
    }

    if (!message) {
      return [];
    }

    return [
      h(
        VCol,
        {
          cols: 12,
        },
        () => h(
          'div',
          {
            class: ['text-medium-emphasis', 'text-body-2', 'px-2']
          },
          message
        )
      )
    ];
  }

  async show() {
    await this.loadItems();
    this.storage.value = null;
    this.dialog.value = true;
    await this.focusPrimaryInput();
  }

  async hide() {
    this.dialog.value = false;
  }

  private async initialize() {
    await this.runAccess();
    await this.loadItems();
  }

  private buildTopActions(props: any, context: any) {
    const h = this.$h;

    this.topButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

    this.topButtonInstances = [];
    this.topButtonInstances = this.buildDefaultButtons();

    return h(
      VCardActions,
      {},
      () => [
        h(VSpacer),
        ...this.topButtonInstances.map((b) => h(b.component))
      ]
    )
  }

  private buildBottomActions(props: any, context: any) {
    const h = this.$h;

    this.bottomButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

    this.bottomButtonInstances = [];
    this.bottomButtonInstances = this.buildDefaultButtons();

    return h(
      VCardActions,
      {},
      () => [
        h(VSpacer),
        ...this.bottomButtonInstances.map((b) => h(b.component))
      ]
    )
  }

  private buildDefaultButtons(): Button[] {
    return [
      new Button(
        {text: 'Cancel', color: 'warning', ...(this.params.value.cancelButton || {})},
        {
          onClicked: () => this.onCancelClicked()
        }
      ),
      new Button(
        {text: 'Confirm', color: 'success', ...(this.params.value.saveButton || {}), disabled: this.storage.value ? false: true},
        {
          onClicked: () => this.onSelectItem()
        }
      )
    ]
  }

  private onSelectItem() {
    const item = this.storage.value;
    if (this.options.selected) {
      this.options.selected(item, this, this.params.value.mode);
    } else {
      this.selected(item, this.params.value.mode);
    }
    this.handleOn('selected', item);
  }

  private onSelectorKeyup(ev: KeyboardEvent) {
    if ((ev.key === 'Enter' || ev.key === 'Return') && this.storage.value) {
      ev.preventDefault();
      this.onSelectItem();
      return;
    }

    if (ev.key === 'Escape' && this.dialog.value) {
      ev.preventDefault();
      this.onCancelClicked();
    }
  }

  private setDialogRoot(el: Element | any) {
    if (el instanceof HTMLElement) {
      this.dialogRoot.value = el;
      return;
    }

    const root = el?.$el;
    this.dialogRoot.value = root instanceof HTMLElement ? root : undefined;
  }

  private async focusPrimaryInput() {
    if (typeof document === 'undefined') {
      return;
    }

    await nextTick();
    await this.waitForFocusFrame();

    const target = this.findFocusTarget();
    if (target && typeof target.focus === 'function') {
      target.focus();
    }
  }

  private findFocusTarget(): HTMLElement | undefined {
    const root = this.dialogRoot.value;
    if (!root) {
      return undefined;
    }

    const selectors = [
      'input[autofocus]:not([type="hidden"]):not([disabled]):not([readonly])',
      'textarea[autofocus]:not([disabled]):not([readonly])',
      '.v-autocomplete input:not([type="hidden"]):not([disabled]):not([readonly])',
      '.v-field input:not([type="hidden"]):not([disabled]):not([readonly])',
      'textarea:not([disabled]):not([readonly])',
    ];

    for (const selector of selectors) {
      const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const target = items.find((item) => this.isVisibleFocusable(item));
      if (target) {
        return target;
      }
    }

    return undefined;
  }

  private async waitForFocusFrame() {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  private isVisibleFocusable(target: HTMLElement) {
    if (target.hasAttribute('readonly') || target.getAttribute('aria-readonly') === 'true') {
      return false;
    }

    const readonlyWrapper = target.closest('[readonly], [aria-readonly="true"], .v-input--readonly, .v-field--readonly');
    if (readonlyWrapper) {
      return false;
    }

    return target.offsetParent !== null || target === document.activeElement;
  }

  private async onCancelClicked(){
    this.handleOn('before-cancel', this);
    
    if (this.options.cancel) {
      await this.options.cancel();
    } else {
      await this.cancel();
    }

    this.handleOn('cancel', this);
  }

  async forceCancel() {
    await this.hide();
    this.onCancelClicked();
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

export const $SL = (params?: SelectorParams, options?: SelectorOptions) => new Selector(params || {}, options || {});
