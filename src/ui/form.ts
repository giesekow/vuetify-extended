import { VNode, Ref, nextTick } from "vue";
import { ReportMode, UIBase } from "./base";
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VForm, VCardSubtitle } from 'vuetify/components';
import { Master } from "../master";
import { Part, PartParams, PRefs } from "./part";
import { Button, ButtonParams } from "./button";
import { Dialogs } from "./dialogs";
import { Report } from "./report";
import { AppManager } from "./appmanager";
import { Field, Refs } from "./field";
import { OnHandler } from "./lib";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent, shouldIgnoreShortcutTarget } from "./shortcut";

export interface FormParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  title?: string;
  subtitle?: string;
  mode?: ReportMode;
  auto?: boolean;
  sub?: boolean;
  hideMode?: boolean;
  saveButton?: ButtonParams,
  cancelButton?: ButtonParams,
  prevButton?: ButtonParams,
  showSaveInReadonly?: boolean;
  elevation?: number;
  maxWidth?: number|string|undefined;
  minWidth?: number|string|undefined;
  maxHeight?: number|string|undefined;
  minHeight?: number|string|undefined;
  width?: number|string|undefined;
  cardClass?: string|string[];
  defaultButtonPosition?: "top"|"bottom"|"both";
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  udf?: string | string[];
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}

export interface FormOptions {
  master?: Master;
  topChildren?: (props: any, context: any) => Array<Part>;
  bottomChildren?: (props: any, context: any) => Array<Part>;
  children?: (props: any, context: any) => Array<Part>;
  buttons?: (props: any, context: any) => Array<Button>;
  bottomButtons?: (props: any, context: any) => Array<Button>;
  leftButtons?: (props: any, context: any) => Array<Button>;
  bottomLeftButtons?: (props: any, context: any) => Array<Button>;
  validate?: (form: Form) => Promise<string|true|undefined|void>|string|true|undefined|void;
  saved?: (form: Form) => Promise<void>|void;
  afterSaved?: (form: Form) => Promise<void>|void;
  onError?: (form: Form, error: any) => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  canCancel?: (form: Form) => Promise<boolean|undefined>|boolean|undefined
  access?: (form: Form, mode: any) => Promise<boolean>|boolean;
  processUDF?: (form: Form, udfs: any[]) => Promise<any[]>;
  setup?: (form: Form) => void,
  preUDFOptions?: PartParams;
  postUDFOptions?: PartParams;
  on?: (form: Form) => OnHandler;
  removeEventListeners?: (form: Form) => Promise<void>|void
  attachEventListeners?: (form: Form) => Promise<void>|void
}

export class Form extends UIBase {
  private params: Ref<FormParams>;
  private hasAccess: Ref<boolean>;
  private options: FormOptions;
  private childrenInstances: Array<Part> = [];
  private topButtonInstances: Array<Button> = [];
  private bottomButtonInstances: Array<Button> = [];
  private udfData: Array<any> = [];
  private formRef?: Ref<InstanceType<typeof VForm> | null>;
  private cardRoot: Ref<HTMLElement|undefined>;
  private udfLoaded: Ref<boolean>;
  private validationSummary: Ref<string[]>;
  private listenersAttached = false;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private static defaultParams: FormParams = {};

  constructor(params?: FormParams, options?: FormOptions) {
    super();
    this.params = this.$makeRef({...Form.defaultParams, ...(params || {})});
    this.options = options || {};
    if (options?.master) this.setMaster(options?.master);
    this.hasAccess = this.$makeRef(true);
    this.cardRoot = this.$makeRef();
    this.udfLoaded = this.$makeRef(false);
    this.validationSummary = this.$makeRef([]);
  }

  static setDefault(value: FormParams, reset?: boolean): void {
    if (reset) {
      Form.defaultParams = value;
    } else {
      Form.defaultParams = {...Form.defaultParams, ...value};
    }
  }

  get $prefs(): PRefs {
    const items: PRefs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      const ref = this.childrenInstances[i].$ref;
      if (ref && ref !== '') {
        items[ref] = this.childrenInstances[i];
      }
    }
    return items;
  }

  get $refs(): Refs {
    let items: Refs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      items = {...items, ...this.childrenInstances[i].$refs}
    }
    return items;
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $readonly() {
    if (this.params.value.readonly === true || this.params.value.readonly === false) return this.params.value.readonly;
    if (this.$parent && (this.$parent as any).$readonly) return (this.$parent as any).$readonly;
    return this.params.value.mode === "display";
  }

  get $parentReport(): Report|undefined {
    return this.$parent ? (this.$parent as any).$parentReport : undefined;
  }

  setParams(params: FormParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): FormParams {
    return this.params.value;
  }

  get $access(): boolean {
    return this.hasAccess.value;
  }

  async runAccess() {
    try {
      this.hasAccess.value = await this.access(this.$params.mode) || false;
    } catch (error) {
      this.hasAccess.value = false;
    }
  }

  async validate (): Promise<string|true|undefined|void> {
    if (this.options.validate) {
      const v = await this.options.validate(this);
      if (typeof v === 'string') return v;
    };

    for (let i = 0; i < this.childrenInstances.length; i++) {
      const v = await this.childrenInstances[i].validate();
      if (typeof v === 'string') return v;
    }
  }

  async saved() {}

  async afterSaved() {}

  async cancel() {}

  async access(mode: any): Promise<boolean> {
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async processUDF(udfs: any[]): Promise<any[]> {
    if (this.options.processUDF) return await this.options.processUDF(this, udfs);
    return udfs;
  }

  props() {
    return []
  }

  topChildren (props: any, context: any): Array<Part> {
    return []
  }

  bottomChildren (props: any, context: any): Array<Part> {
    return []
  }

  children (props: any, context: any): Array<Part> {
    return []
  }

  buttons (props: any, context: any): Array<Button> {
    return [];
  }
  
  bottomButtons (props: any, context: any): Array<Button> {
    return [];
  }

  leftButtons (props: any, context: any): Array<Button> {
    return [];
  }

  bottomLeftButtons (props: any, context: any): Array<Button> {
    return [];
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;
    
    if (this.params.value.invisible) {
      return;
    }

    return h(
      VCard,
      {
        ref: (el: Element | any) => this.setCardRoot(el),
        onKeydown: (ev: KeyboardEvent) => this.onFormKeydown(ev),
        elevation: this.params.value.elevation,
        class: this.params.value.cardClass,
        maxHeight: this.params.value.maxHeight,
        minHeight: this.params.value.minHeight,
        style: this.cardSizeStyle(),
      } as any,
      () => [
        this.buildTitle(props, context),
        ...(this.params.value.subtitle ? [this.buildSubTitle(props, context)] : []),
        this.buildTopActions(props, context),
        h(VDivider),
        this.buildBody(props, context),
        h(VDivider),
        this.buildBottomActions(props, context),
      ]
    );
  }

  private toCssSize(value?: string | number) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    return typeof value === 'number' ? `${value}px` : value;
  }

  private clampToViewport(value?: string | number) {
    const size = this.toCssSize(value);
    if (!size) {
      return undefined;
    }
    if (size.includes('%') || size.includes('vw') || size.includes('vh') || size.includes('calc(') || size.includes('min(') || size.includes('max(') || size.includes('clamp(')) {
      return size;
    }
    return `min(calc(100vw - 32px), ${size})`;
  }

  private cardSizeStyle() {
    const width = this.clampToViewport(this.params.value.width);
    const maxWidth = this.clampToViewport(this.params.value.maxWidth);
    const minWidth = this.clampToViewport(this.params.value.minWidth);

    return {
      width,
      maxWidth: maxWidth || '100%',
      minWidth,
      boxSizing: 'border-box',
    };
  }

  async focusPrimaryInput() {
    if (typeof document === 'undefined') {
      return;
    }

    await nextTick();

    for (let i = 0; i < 5; i++) {
      if (await this.focusSpecialFieldTarget()) {
        return;
      }

      const target = this.findFocusTarget();
      if (target && typeof target.focus === 'function') {
        target.focus();
        return;
      }

      await this.waitForFocusFrame();
    }
  }

  private setCardRoot(el: Element | any) {
    if (el instanceof HTMLElement) {
      this.cardRoot.value = el;
      return;
    }

    const root = el?.$el;
    this.cardRoot.value = root instanceof HTMLElement ? root : undefined;
  }

  private async focusSpecialFieldTarget(): Promise<boolean> {
    const fields = this.collectFields(this.childrenInstances);

    for (const field of fields) {
      const behavior = this.fieldFocusBehavior(field);

      if (behavior === 'skip') {
        continue;
      }

      if (behavior === 'special') {
        return await field.focusPrimaryInput();
      }

      return false;
    }

    return false;
  }

  private fieldFocusBehavior(field: Field): 'skip'|'special'|'standard' {
    if (field.$params.invisible || field.$readonly) {
      return 'skip';
    }

    const type = field.$params.type || 'text';

    if (['label', 'htmlview', 'button', 'chart', 'map', 'map-line', 'map-circle', 'map-rectangle', 'map-polygon', 'map-heatmap', 'map-cluster', 'map-geojson', 'table', 'viewtable', 'servertable', 'reporttable', 'collection', 'messagingbox', 'image', 'document'].includes(type)) {
      return 'skip';
    }

    if (type === 'html') {
      return 'special';
    }

    return 'standard';
  }

  private findFocusTarget(): HTMLElement | undefined {
    const root = this.cardRoot.value;
    if (!root) {
      return undefined;
    }

    const selectors = [
      'input[autofocus]:not([type="hidden"]):not([disabled]):not([readonly])',
      'textarea[autofocus]:not([disabled]):not([readonly])',
      '.v-field input:not([type="hidden"]):not([disabled]):not([readonly])',
      '.v-autocomplete input:not([type="hidden"]):not([disabled]):not([readonly])',
      'iframe.tox-edit-area__iframe',
      'textarea:not([disabled]):not([readonly])',
    ];

    for (const selector of selectors) {
      const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
      const target = items.find((item) => this.isVisibleFocusable(item));
      if (target) {
        return target;
      }
    }

    const fallbackButtons = Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled])'));
    return fallbackButtons.find((item) => this.isVisibleFocusable(item)) || undefined;
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

  private async waitForFocusFrame() {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  private buildTitle(props: any, context: any) {
    const h = this.$h;

    const modes = {create: 'Create', edit: 'Edit', display: 'Display'};

    return h(
      VCardTitle,
      {},
      () => h(
        'span',
        {},
        this.$params.mode ? (this.$params.hideMode ? this.$params.title : `${modes[this.$params.mode]} ${this.$params.title || ''}`) : (this.$params.title || '')
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
    this.childrenInstances.forEach((instance) => {
      instance.removeEventListeners();
    })

    this.childrenInstances = [];

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
        VForm,
        {
          ref: this.formRef
        },
        () => [
          this.buildValidationSummary(),
          h(
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
    
              if (this.udfLoaded.value) {
                const pr = this.prepareBeforeUDFs();
                const pt = this.prepareAfterUDFs();
                this.childrenInstances = top.concat(pr).concat(ch).concat(pt).concat(bot);
              } else {
                this.childrenInstances = top.concat(ch).concat(bot);
              }

              this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
              });
    
              return this.childrenInstances.map((instanace) => this.$h(instanace.component));
            }
          )
        ]
      )
    )
  }

  private buildValidationSummary() {
    const h = this.$h;
    if ((this.validationSummary.value || []).length === 0) {
      return undefined;
    }

    return h(
      'div',
      {
        class: ['mb-4', 'pa-4', 'rounded'],
        style: {
          border: '1px solid rgb(var(--v-theme-error))',
          background: 'rgba(var(--v-theme-error), 0.08)'
        }
      },
      [
        h(
          'div',
          {
            class: ['text-subtitle-2', 'mb-2'],
            style: {
              color: 'rgb(var(--v-theme-error))'
            }
          },
          'Please review the following before saving:'
        ),
        h(
          'ul',
          {
            class: ['pl-5', 'my-0']
          },
          this.validationSummary.value.map((message) => h('li', { class: ['mb-1'] }, message))
        )
      ]
    );
  }

  private async loadUDFData() {
    const udfs = this.params.value.udf ? await AppManager.getUDFs(this.params.value.udf) : [];
    this.udfData = await this.processUDF(udfs);
    this.udfLoaded.value = true;
  }

  private prepareBeforeUDFs(): Part {
    const items: any[] = this.udfData.filter((u: any) => u.sort && u.sort < 0);
    
    return new Part(this.options.preUDFOptions || {}, {
      children: () => {
        const fitems: Array<Field> = [];

        for (let i = 0; i < items.length; i++) {
          const f = AppManager.makeUDF(items[i], this.$params.mode);
          if (f) fitems.push(f);
        }

        return fitems;
      }
    })

  }

  private prepareAfterUDFs() {
    const items: any[] = this.udfData.filter((u: any) => !(u.sort && u.sort < 0));

    return new Part(this.options.postUDFOptions || {}, {
      children: () => {
        const fitems: Array<Field> = [];

        for (let i = 0; i < items.length; i++) {
          const f = AppManager.makeUDF(items[i], this.$params.mode);
          if (f) fitems.push(f);
        }

        return fitems;
      }
    })
  }

  private buildTopActions(props: any, context: any) {
    const h = this.$h;

    this.topButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

    this.topButtonInstances = [];

    const leftButtons: Button[] = !this.hasAccess.value ? [] : (this.options.leftButtons ? this.options.leftButtons(props, context) : this.leftButtons(props, context));
    let rightButtons: Button[] = !this.hasAccess.value ? [] : (this.options.buttons ? this.options.buttons(props, context) : this.buttons(props, context));

    if (!this.params.value.defaultButtonPosition || ["top", "both"].includes(this.params.value.defaultButtonPosition)) {
      const btns = this.buildDefaultButtons();
      rightButtons = rightButtons.concat(btns);
    }

    const reportButton = this.$parentReport?.getAdditionalButtons() || []
    this.topButtonInstances = leftButtons.concat(reportButton).concat(rightButtons);

    return h(
      VCardActions,
      {},
      () => [
        ...leftButtons.map((b) => h(b.component)),
        h(VSpacer),
        ...(reportButton.concat(rightButtons).map((b) => h(b.component)))
      ]
    )
  }

  private buildBottomActions(props: any, context: any) {
    const h = this.$h;

    this.bottomButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

    this.bottomButtonInstances = [];

    const leftButtons: Button[] = !this.hasAccess.value ? [] : (this.options.bottomLeftButtons ? this.options.bottomLeftButtons(props, context) : this.bottomLeftButtons(props, context));
    let rightButtons: Button[] = !this.hasAccess.value ? [] : (this.options.bottomButtons ? this.options.bottomButtons(props, context) : this.bottomButtons(props, context));

    if (!this.params.value.defaultButtonPosition || ["bottom", "both"].includes(this.params.value.defaultButtonPosition)) {
      const btns = this.buildDefaultButtons();
      rightButtons = rightButtons.concat(btns);
    }

    const reportButton = this.$parentReport?.getAdditionalButtons() || []
    this.bottomButtonInstances = leftButtons.concat(reportButton).concat(rightButtons);

    return h(
      VCardActions,
      {},
      () => [
        ...leftButtons.map((b) => h(b.component)),
        h(VSpacer),
        ...(reportButton.concat(rightButtons)).map((b) => h(b.component))
      ]
    )
  }

  private buildDefaultButtons(): Button[] {
    const prevButtons = this.params.value.prevButton ? [
      new Button(
        {text: 'Prev', color: 'secondary', ...(this.params.value.prevButton || {})},
        {
          onClicked: () => this.onPrevClicked()
        }
      )
    ] : [];

    if (!this.hasAccess.value) {
      return [
        new Button(
          {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
          {
            onClicked: () => this.onCancelClicked()
          }
        ),
        ...prevButtons,
      ]
    }

    if (this.$readonly && !this.params.value.sub && !this.params.value.showSaveInReadonly) {
      return [
        new Button(
          {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
          {
            onClicked: () => this.onCancelClicked()
          }
        ),
        ...prevButtons,
      ]
    }

    return [
      new Button(
        {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
        {
          onClicked: () => this.onCancelClicked()
        }
      ),
      ...prevButtons,
      new Button(
        {text: 'Save', color: 'success', ...(this.params.value.saveButton || {})},
        {
          onClicked: () => this.onSaveClicked()
        }
      )
    ]
  }

  async $save() {
    await this.onSaveClicked();
  }

  async $cancel() {
    await this.onCancelClicked();
  }

  async $prev() {
    await this.onPrevClicked();
  }

  async $handleEscapeShortcut() {
    if (this.params.value.prevButton) {
      await this.onPrevClicked();
      return;
    }

    await this.onCancelClicked();
  }

  async $handleSaveShortcut() {
    if (!this.canTriggerSaveShortcut()) {
      return;
    }

    await this.onSaveClicked();
  }

  private onFormKeydown(ev: KeyboardEvent) {
    if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
      return;
    }

    if (this.isSaveShortcut(ev)) {
      if (this.shouldIgnoreSaveShortcut(ev.target) || !this.canTriggerSaveShortcut()) {
        return;
      }

      ev.preventDefault();
      this.onSaveClicked();
      return;
    }

    if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
      if (this.shouldIgnoreEscapeCancel(ev.target)) {
        return;
      }

      ev.preventDefault();
      this.$handleEscapeShortcut();
      return;
    }

    this.triggerButtonShortcut(ev);
  }

  private isSaveShortcut(ev: KeyboardEvent) {
    return !ev.altKey && !ev.shiftKey && (ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 's';
  }

  private canTriggerSaveShortcut() {
    if (!this.hasAccess.value) {
      return false;
    }

    if (this.params.value.saveButton?.disabled) {
      return false;
    }

    if (this.$readonly && !this.params.value.sub && !this.params.value.showSaveInReadonly) {
      return false;
    }

    return true;
  }


  private getShortcutButtons() {
    return this.topButtonInstances.concat(this.bottomButtonInstances);
  }

  private triggerButtonShortcut(ev: KeyboardEvent) {
    if (ev.repeat) {
      return false;
    }

    const seen = new Set<Button>();
    for (const button of this.getShortcutButtons()) {
      if (seen.has(button)) {
        continue;
      }
      seen.add(button);

      if (button.$params.disabled || button.$params.invisible || button.$readonly) {
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
      button.triggerShortcut();
      return true;
    }

    return false;
  }

  private shouldIgnoreSaveShortcut(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest('[contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
      return true;
    }

    return false;
  }

  private shouldIgnoreEscapeCancel(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest('[contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
      return true;
    }

    return false;
  }

  private async onSaveClicked(){

    if (this.$readonly) {
      this.clearValidationSummary();
      this.handleOn('saved', this);
      return;
    }

    const res = await this.formRef?.value?.validate();
    if (!res?.valid) {
      this.setValidationSummary();
      await nextTick();
      await this.formRef?.value?.validate();
      return;
    }
    let canProceed = true;
    this.handleOn('before-validate', this);

    const vres = await this.validate();
    
    canProceed = typeof vres !== 'string';
    this.setValidationSummary(typeof vres === 'string' ? [vres] : []);

    this.handleOn('validate', this);

    if (canProceed) {
      this.clearValidationSummary();
      await this.save();
    }
  }

  private async save() {
    let accepted = true;

    if (!this.params.value.auto && !this.params.value.sub) {
      accepted = await Dialogs.$confirm('Save data ?');
    }

    if (accepted) {
      this.handleOn('before-saved', this);
      if (this.options.saved) {
        await this.options.saved(this);
      } else {
        await this.saved();
      }

      if (!this.params.value.sub) {
        if (this.$master) {
          const saved = await this.$master.$save(this.params.value.mode);
          if (saved !== true) {
            Dialogs.$error(saved || 'Unable to save data!');
            if (this.options.onError) {
              await this.options.onError(this, saved);
            }
            this.handleOn('error', saved);
          } else {
            if (!this.params.value.auto) Dialogs.$success('Data successfully saved!');
            if (this.options.afterSaved) {
              await this.options.afterSaved(this);
            } else {
              await this.afterSaved();
            }
            this.handleOn('saved', this);
          }
        } else {
          this.handleOn('saved', this);
        }
      } else {

        if (this.options.afterSaved) {
          await this.options.afterSaved(this);
        } else {
          await this.afterSaved();
        }

        this.handleOn('saved', this);
      }

      this.handleOn('after-saved', this)

    }
  }

  setup(props: any, context: any) {
    this.formRef = this.$makeRef(null);
    this.loadUDFData();
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  private async onCancelClicked(){
    let canCancel = true
    if (this.options.canCancel) canCancel = await this.options.canCancel(this) || false    
    if (!canCancel) return;

    this.handleOn('before-cancel', this);
    
    if (this.options.cancel) {
      await this.options.cancel();
    } else {
      await this.cancel();
    }

    this.handleOn('cancel', this);
  }

  private async onPrevClicked(){
    this.handleOn('before-prev', this);
    this.handleOn('prev', this);
  }

  private setValidationSummary(messages: string[] = []) {
    const combined = messages.concat(this.collectRequiredFieldSummary());
    const unique = combined.filter((message, index) => message && combined.indexOf(message) === index);
    this.validationSummary.value = unique;
  }

  private clearValidationSummary() {
    this.validationSummary.value = [];
  }

  private collectRequiredFieldSummary(): string[] {
    const fields = this.collectFields(this.childrenInstances);
    const messages: string[] = [];

    for (const field of fields) {
      if (field.$params.invisible || !field.$params.required || !field.$params.storage) {
        continue;
      }

      const value = field.$master?.$get(field.$params.storage);
      if (this.isEmptyValue(value)) {
        messages.push(`${field.$params.label || field.$params.storage} is required.`);
      }
    }

    return messages;
  }

  private collectFields(items: Array<Part|Field>): Field[] {
    const fields: Field[] = [];

    for (const item of items) {
      if (item instanceof Field) {
        fields.push(item);
        continue;
      }

      const children = ((item as any).childrenInstances || []) as Array<Part|Field>;
      fields.push(...this.collectFields(children));
    }

    return fields;
  }

  private isEmptyValue(value: any): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
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

  attachEventListeners() {
    if (this.options.attachEventListeners && !this.listenersAttached) this.options.attachEventListeners(this)
    if (typeof window !== 'undefined' && !this.shortcutHandler) {
      this.shortcutHandler = (ev: KeyboardEvent) => this.onFormKeydown(ev);
      window.addEventListener('keydown', this.shortcutHandler);
    }
    super.attachEventListeners()
    this.listenersAttached = true;
  }

  removeEventListeners() {
    if (this.options.removeEventListeners && this.listenersAttached) this.options.removeEventListeners(this);
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }
    super.removeEventListeners()
    this.listenersAttached = false;
  }

}

export const $FM = (params?: FormParams, options?: FormOptions) => new Form(params || {}, options || {});
