import { VNode, Ref } from "vue";
import { ReportMode, UIBase } from "./base";
import { VDivider, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VLayout, VCol, VRow, VContainer, VBtn, VMenu, VProgressLinear } from 'vuetify/components';
import { Master } from "../master";
import { Form } from './form';
import { Button, ButtonParams } from "./button";
import { $excel, computeFunctionalCodeAsync, sleep } from "../misc";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
import { OnHandler } from "./lib";
import { PRefs } from "./part";
import { Refs } from "./field";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";

export type ReportButtonStyle = 'text'|'outlined'|'elevated';

export interface ReportParams {
  objectType?: any;
  objectId?: any;
  selected?: any;
  title?: string;
  confirmOnCancel?: boolean;
  hideMode?: boolean;
  cancelButton?: ButtonParams;
  cancelButtonStyle?: ReportButtonStyle;
  nextButton?: ButtonParams;
  nextButtonStyle?: ReportButtonStyle;
  prevButton?: ButtonParams;
  prevButtonStyle?: ReportButtonStyle;
  finishButton?: ButtonParams;
  finishButtonStyle?: ReportButtonStyle;
  sideButtonPosition?: 'left'|'right';
  sideButtonWidth?: string|number;
  multiple?: boolean;
  setActionButtons?: boolean;
  forms?: number;
  mode?: 'create'|'edit'|'display';
  editAfterSave?: boolean;
  verticalAlign?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  horizontalAlign?: "left"|"center"|"right";
  fluid?: boolean;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  printAfterSave?: boolean;
  canPrint?: boolean;
  canExport?: boolean;
  printTemplate?: string;
  exportTemplate?: string;
  exportFilename?: string;
}

export interface ReportOptions {
  master?: Master;
  form?: (props: any, context: any, index: number) => Promise<Form|undefined>|Form|undefined;
  hasForm?: (props: any, context: any, index: number) => Promise<boolean|undefined>|boolean|undefined;
  saved?: () => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  access?: (report: Report, mode: any) => Promise<boolean>|boolean;
  setup?: (report: Report) => void;
  beforePrint?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  printTemplate?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  beforeExport?: (report: Report, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  exportTemplate?: (report: Report, mode?: ReportMode) => Promise<ExportTemplateInfo|undefined>|ExportTemplateInfo|undefined;
  on?: (report: Report) => OnHandler;
  loaded?: (report: Report) => void;
  hasNextForm?: (report: Report, index: number) => Promise<boolean|undefined>|boolean|undefined
  hasPrevForm?: (report: Report, index: number) => Promise<boolean|undefined>|boolean|undefined
  removeEventListeners?: (report: Report) => Promise<void>|void
  attachEventListeners?: (report: Report) => Promise<void>|void
  title?: (report: Report, index?: number) => string
  sideButtons?: (props: any, context: any, report: Report) => Array<Button>|undefined
}

export interface ExportTemplateInfo {
  template?: any;
  filename?: string;
}

export class Report extends UIBase {
  private params: Ref<ReportParams>;
  private hasAccess: Ref<boolean>;
  private hasPrintAccess: Ref<boolean>;
  private hasExportAccess: Ref<boolean>;
  private options: ReportOptions;
  private loaded = false;
  private topButtonInstances: Array<Button> = [];
  private bottomButtonInstances: Array<Button> = [];
  private sideButtonInstances: Array<Button> = [];
  private currentForm: Form|undefined;
  private currentIndex: Ref<number>;
  private currentFormRenderKey: Ref<number>;
  private currentStepRefState: Ref<number>;
  private hasNext = false;
  private hasPrev = false;
  private listenersAttached = false;
  private lastProps: any;
  private lastContext: any;
  private cleanSnapshot: string;
  private resolvedFormCount: Ref<number>;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private compactSideActions: Ref<boolean>;
  private sideActionMediaQuery?: MediaQueryList;
  private sideActionMediaHandler?: ((ev: MediaQueryListEvent) => void) | undefined;
  private static defaultParams: ReportParams = {
    sideButtonPosition: 'right',
    sideButtonWidth: 180,
  };

  constructor(params?: ReportParams, options?: ReportOptions) {
    super();
    this.params = this.$makeRef({...Report.defaultParams, ...(params || {})});
    this.options = options || {};

    if (options?.master) {
      this.setMaster(options?.master);
    } else {
      this.setMaster(new Master({type: this.params.value.objectType, id: this.params.value.objectId}));
    }

    this.hasAccess = this.$makeRef(true);
    this.hasPrintAccess = this.$makeRef(true);
    this.hasExportAccess = this.$makeRef(true);
    this.currentIndex = this.$makeRef(-1);
    this.currentFormRenderKey = this.$makeRef(0);
    this.currentStepRefState = this.$makeRef(0);
    this.currentForm = undefined;
    this.resolvedFormCount = this.$makeRef(Math.max(1, this.params.value.forms || 1));
    this.lastProps = null;
    this.lastContext = null;
    this.cleanSnapshot = this.snapshotMasterData();
    this.compactSideActions = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth < 1400 : false);
  }

  static setDefault(value: ReportParams, reset?: boolean): void {
    if (reset) {
      Report.defaultParams = value;
    } else {
      Report.defaultParams = {...Report.defaultParams, ...value};
    }
  }

  get $parentReport(): Report|undefined {
    return this;
  }

  get $prefs(): PRefs {
    return this.currentForm?.$prefs || {}
  }

  get $currentForm(): Form|undefined {
    return this.currentForm;
  }

  get $refs(): Refs {
    return this.currentForm?.$refs || {}
  }

  get objectType() {
    return this.params.value.objectType;
  }

  get objectId() {
    return this.params.value.objectId;
  }

  set objectType(v: any) {
    this.params.value.objectType = v;
    if (this.$master) {
      this.$master.$type = v;
    }
  }

  set objectId(v: any) {
    this.params.value.objectId = v;
    if (this.$master) {
      this.$master.$id = v;
    }
  }

  setParams(params: ReportParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): ReportParams {
    return this.params.value;
  }

  get $access(): boolean {
    return this.hasAccess.value;
  }

  get currentStepRef() {
    return this.currentStepRefState;
  }

  get totalStepsRef() {
    return this.resolvedFormCount;
  }

  private syncStepRefs() {
    this.currentStepRefState.value = this.currentIndex.value >= 0 ? this.currentIndex.value + 1 : 0;
  }

  private async initialize(props: any, context: any) {
    this.loaded = true;
    await this.runAccess();

    if (this.hasAccess.value) {
      await this.resolveFormCount(props, context);
      await this.prepareForm(props, context, 0);
      await this.loadObject();
      await this.focusCurrentForm();
    }
  }

  private async runAccess() {
    try {
      this.hasAccess.value = await this.access(this.$params.mode) || false;
    } catch (error) {
      this.hasAccess.value = false;
    }

    try {
      this.hasPrintAccess.value = await this.access('print') || false;
    } catch (error) {
      this.hasPrintAccess.value = false;
    }

    try {
      this.hasExportAccess.value = await this.access('export') || false;
    } catch (error) {
      this.hasExportAccess.value = false;
    }
  }

  async loadObject() {
    this.handleOn('before-loaded', this);
    if (this.$master) {
      this.$master.$id = this.params.value.objectId;
      this.$master.$type = this.params.value.objectType;
      await this.$master.$load();
    }
    this.captureCleanState();
    if (this.options.loaded) {
      this.options.loaded(this)
    }
    this.handleOn('loaded', this);
  }

  async saved() {}

  async cancel() {}

  async access(mode: any): Promise<boolean> {
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async form(props: any, context: any, index: number): Promise<Form|undefined> {
    return undefined;
  }

  async hasForm(props: any, context: any, index: number): Promise<boolean> {
    return index < (this.params.value.forms || 1) ;
  }

  async hasPrevForm(props: any, context: any, index: number): Promise<boolean|undefined> {
    if (this.options.hasPrevForm) return await this.options.hasPrevForm(this, index);
    if (index <= 0) return false;
    return this.options.hasForm ? await this.options.hasForm(props, context, index-1) : await this.hasForm(props, context, index-1);
  }

  async hasNextForm(props: any, context: any, index: number): Promise<boolean|undefined> {
    if (this.options.hasNextForm) return await this.options.hasNextForm(this, index);
    return this.options.hasForm ? await this.options.hasForm(props, context, index + 1) : await this.hasForm(props, context, index + 1);
  }

  private async resolveFormCount(props: any, context: any) {
    if (this.params.value.forms && this.params.value.forms > 0) {
      this.resolvedFormCount.value = this.params.value.forms;
      return;
    }

    let count = 0;
    const limit = 50;
    while (count < limit) {
      const hasForm = this.options.hasForm ? await this.options.hasForm(props, context, count) : await this.hasForm(props, context, count);
      if (!hasForm) {
        break;
      }
      count += 1;
    }

    this.resolvedFormCount.value = Math.max(1, count || 1);
  }

  props() {
    return []
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;
    this.lastProps = props;
    this.lastContext = context;

    if (!this.loaded) {
      this.initialize(props, context);
    }

    if (this.currentIndex.value === -1 || !this.hasAccess.value) {
      return h(
        VContainer,
        {
          fluid: this.params.value.fluid,
          class: ['fill-height'],
        },
        () => h(
          VLayout,
          {
            fullHeight: true,
          },
          () => h(
            VRow,
            {
              alignContent: this.params.value.verticalAlign,
            },
            () => h(
              VCol,
              {
                cols: 12,
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined,
                style: { paddingTop: '16px', paddingBottom: '16px' },
              },
              () => this.wrapWithSideButtons(
                props,
                context,
                h(
                  VCard,
                  {
                    minWidth: 400,
                    class: (this.params.value.horizontalAlign || "center") === "center" ? ['mx-auto']: []
                  },
                  () => [
                    this.buildTitle(props, context),
                    this.buildTopActions(props, context),
                    h(VDivider),
                    this.buildBody(props, context),
                    h(VDivider),
                    this.buildBottomActions(props, context),
                  ]
                )
              )
            )
          )
        )
      );
    }

    if (this.currentForm) {
      return h(
        VContainer,
        {
          fluid: this.params.value.fluid,
          class: ['fill-height'],
        },
        () => h(
          VLayout,
          {
            fullHeight: true,
          },
          () => h(
            VRow,
            {
              alignContent: this.params.value.verticalAlign,
            },
            () => h(
              VCol,
              {
                cols: 12,
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined,
                style: { paddingTop: '16px', paddingBottom: '16px' },
              },
              () => h(
                'div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: this.buildProgressHeader() ? '12px' : '0',
                    width: '100%',
                  },
                },
                [
                  ...(this.buildProgressHeader() ? [this.buildProgressHeader()!] : []),
                  this.wrapWithSideButtons(
                    props,
                    context,
                    h(this.currentForm!.component, { key: this.currentFormRenderKey.value })
                  )
                ]
              )
            )
          )
        )
      )
    }

    return h(
      'div'
    );
  }

  private async prepareForm(props: any, context: any, index: number) {
    this.loaded = true;
    const hasForm = this.options.hasForm ? await this.options.hasForm(props, context, index) : await this.hasForm(props, context, index);

    if (hasForm) {
      const hasNext = await this.hasNextForm(props, context, index);
      this.hasNext = hasNext || false;

      if (index <= 0) {
        this.hasPrev = false;
      } else {
        const hasPrev = await this.hasPrevForm(props, context, index);
        this.hasPrev = hasPrev || false;
      }

      const newForm = this.options.form ? await this.options.form(props, context, index) : await this.form(props, context, index);
      if (newForm) {
        newForm.setParent(this);
        newForm.$params.sub = this.hasNext;
        newForm.$params.auto = newForm.$params.auto === undefined ? this.hasNext : newForm.$params.auto;
        newForm.$params.mode = this.params.value.mode;
        if (this.params.value.title && !newForm.$params.subtitle) {
          newForm.$params.subtitle = newForm.$params.title;
          newForm.$params.title = this.options.title ? this.options.title(this, index) : this.params.value.title;
        }
        this.applyStepSubtitle(newForm, index);

        if (this.params.value.setActionButtons || this.params.value.setActionButtons === undefined) {
          newForm.$params.cancelButton = {
            text: 'Cancel',
            color: 'warning',
            variant: this.params.value.cancelButtonStyle || 'text',
            ...(this.params.value.cancelButton || {}),
            ...(newForm.$params.cancelButton || {}),
          };

          if (this.hasNext) {
            newForm.$params.saveButton = {
              text: 'Next',
              color: 'primary',
              variant: this.params.value.nextButtonStyle || 'elevated',
              ...(this.params.value.nextButton || {}),
              ...(newForm.$params.saveButton || {}),
            }
          } else {
            newForm.$params.showSaveInReadonly = true;

            const finalAction: ButtonParams = this.params.value.mode === 'display'
              ? {
                  text: 'Finish',
                  color: 'primary',
                  variant: this.params.value.finishButtonStyle || 'elevated',
                }
              : {
                  text: 'Save',
                  color: 'primary',
                  variant: this.params.value.finishButtonStyle || 'elevated',
                };

            if (this.params.value.mode === 'display') {
              newForm.$params.saveButton = {
                ...finalAction,
                ...(this.params.value.finishButton || {}),
                ...(newForm.$params.saveButton || {}),
              }
            } else {
              newForm.$params.saveButton = {
                ...finalAction,
                ...(this.params.value.finishButton || {}),
                ...(newForm.$params.saveButton || {}),
              }
            }
          }

          if (this.hasPrev) {
            newForm.$params.prevButton = {
              text: 'Prev',
              color: 'secondary',
              variant: this.params.value.prevButtonStyle || 'outlined',
              ...(this.params.value.prevButton || {}),
              ...(newForm.$params.prevButton || {}),
            }
          } else {
            newForm.$params.prevButton = undefined;
          }
        }

        if (this.currentForm) {
          this.currentForm.clearListeners(this.$id);
          this.currentForm.removeEventListeners()
        }

        this.currentForm = newForm
        this.currentFormRenderKey.value += 1;
        this.currentIndex.value = index;
        this.syncStepRefs();
        this.currentForm.clearListeners(this.$id);
        this.currentForm.on('saved', () => this.save(), this.$id);
        this.currentForm.on('prev', () => this.onprev(), this.$id);
        this.currentForm.on('cancel', () => this.oncancel(), this.$id);
        this.currentForm.attachEventListeners();
        this.focusCurrentForm();
      }

    } else {
      this.currentForm = undefined;
      this.currentFormRenderKey.value += 1;
      this.currentIndex.value = -1;
      this.syncStepRefs();
    }
    
  }

  private buildTitle(props: any, context: any) {
    const h = this.$h;

    const modes = {create: 'Create', edit: 'Edit', display: 'Display'};
    const title = this.options.title ? this.options.title(this) : this.$params.title

    return h(
      VCardTitle,
      {},
      () => h(
        'span',
        {},
        this.$params.mode ? (this.$params.hideMode ? title : `${modes[this.$params.mode]} ${title || ''}`) : (title || '')
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
      {
        class: 'text-center'
      },
      () => h(
        'span',
        {
          class: 'title'
        },
        'Loading...'
      )
    )
    
  }

  private buildTopActions(props: any, context: any) {
    const h = this.$h;

    this.topButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

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


  private buildSideButtons(props: any, context: any) {
    this.sideButtonInstances.forEach((instance) => {
      instance.removeEventListeners();
    });

    this.sideButtonInstances = (this.options.sideButtons ? this.options.sideButtons(props, context, this) : []) || [];
    this.sideButtonInstances.forEach((instance) => {
      instance.setParent(this);
    });
    return this.sideButtonInstances.filter((instance) => !instance.$params.invisible);
  }

  private buildDesktopSideActions(buttons: Button[]) {
    const h = this.$h;

    if (buttons.length === 0 || this.compactSideActions.value) {
      return undefined;
    }

    return h(
      VCard,
      {
        elevation: 2,
        style: {
          width: this.params.value.sideButtonWidth,
          minWidth: this.params.value.sideButtonWidth,
          alignSelf: 'flex-start',
        },
      },
      () => h(
        VCardText,
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '12px',
          },
        },
        () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })]))
      )
    );
  }

  private buildMobileSideActions(buttons: Button[]) {
    const h = this.$h;

    if (buttons.length === 0 || !this.compactSideActions.value) {
      return undefined;
    }

    const justifyContent = this.params.value.sideButtonPosition === 'left' ? 'flex-start' : 'flex-end';
    const location = this.params.value.sideButtonPosition === 'left' ? 'bottom start' : 'bottom end';

    return h(
      'div',
      {
        style: {
          width: '100%',
          display: 'flex',
          justifyContent,
          marginBottom: '12px',
        },
      },
      [h(
        VMenu,
        {
          location,
        },
        {
          activator: ({ props: activatorProps }: any) => h(
            VBtn,
            {
              ...activatorProps,
              variant: 'outlined',
              color: 'secondary',
              prependIcon: 'mdi-dots-vertical',
              size: 'small',
            },
            () => 'Actions'
          ),
          default: () => h(
            VCard,
            {
              elevation: 2,
              style: {
                width: this.params.value.sideButtonWidth,
                minWidth: this.params.value.sideButtonWidth,
              },
            },
            () => h(
              VCardText,
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  padding: '12px',
                },
              },
              () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })]))
            )
          ),
        }
      )]
    );
  }

  private wrapWithSideButtons(props: any, context: any, content: VNode) {
    const h = this.$h;
    const buttons = this.buildSideButtons(props, context);
    const sideActions = this.buildDesktopSideActions(buttons);
    const mobileActions = this.buildMobileSideActions(buttons);

    if (!sideActions && !mobileActions) {
      return h(
        'div',
        {
          style: {
            width: '100%',
            display: 'flex',
            justifyContent: (this.params.value.horizontalAlign || 'center') === 'center' ? 'center' : this.params.value.horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
          },
        },
        [content]
      );
    }

    const desktopChildren = sideActions
      ? (this.params.value.sideButtonPosition === 'left' ? [sideActions, content] : [content, sideActions])
      : [content];

    return h(
      'div',
      {
        style: {
          width: '100%',
        },
      },
      [
        ...(mobileActions ? [mobileActions] : []),
        h(
          'div',
          {
            style: {
              width: '100%',
              display: 'flex',
              justifyContent: (this.params.value.horizontalAlign || 'center') === 'center' ? 'center' : this.params.value.horizontalAlign === 'right' ? 'flex-end' : 'flex-start',
            },
          },
          [h(
            'div',
            {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                maxWidth: '100%',
              },
            },
            desktopChildren
          )]
        ),
      ]
    );
  }

  private buildProgressHeader() {
    if (!this.currentForm) {
      return undefined;
    }

    const total = Math.max(this.resolvedFormCount.value || this.params.value.forms || 1, 1);
    if (total <= 1) {
      return undefined;
    }

    const h = this.$h;
    const current = Math.min(Math.max(this.currentIndex.value + 1, 1), total);
    const percent = Math.max(0, Math.min(100, (current / total) * 100));

    return h(VCard, {
      elevation: 0,
      variant: 'tonal',
      class: ['mx-auto'],
      style: {
        width: this.currentForm?.$params.width || this.currentForm?.$params.maxWidth || '100%',
        maxWidth: this.currentForm?.$params.maxWidth || this.currentForm?.$params.width || '100%',
      },
    }, () => h(VCardText, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '2px 4px',
        flexWrap: 'nowrap',
      },
    }, () => [
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
          whiteSpace: 'nowrap',
          flex: '0 0 auto',
        },
      }, [
        h('div', { style: { fontSize: '0.58rem', lineHeight: '1', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: '0.68' } }, 'Progress'),
        h('div', { style: { fontSize: '0.72rem', lineHeight: '1', fontWeight: '700' } }, `Step ${current} of ${total}`),
      ]),
      h('div', {
        style: {
          flex: '1 1 65%',
          minWidth: '120px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        },
      }, [
        h(VProgressLinear, {
          modelValue: percent,
          color: 'primary',
          rounded: true,
          height: 4,
          style: { width: '100%' },
        }),
      ]),
    ]));
  }

  private buildDefaultButtons(): Button[] {
    return [
      new Button(
        {text: 'Cancel', color: 'warning', variant: this.params.value.cancelButtonStyle || 'text', ...(this.params.value.cancelButton || {})},
        {
          onClicked: () => this.oncancel()
        }
      ),
    ]
  }

  getAdditionalButtons(): Button[] {
    if (this.params.value.mode === 'create') return [];

    const btns: Button[] = [];
    if (this.params.value.canPrint && this.hasPrintAccess.value) {
      btns.push(
        new Button({text: 'Print', color: 'primary'}, {
          onClicked: () => {
            this.printAction()
          }
        })
      )
    }

    if (this.params.value.canExport && this.hasExportAccess.value) {
      btns.push(
        new Button({text: 'Export', color: 'primary'}, {
          onClicked: () => {
            this.exportAction()
          }
        })
      )
    }

    return btns
  }

  private async save() {
    const props = this.lastProps;
    const context = this.lastContext;
    await sleep(50);
    if (this.hasNext) {
      await this.prepareForm(props, context, this.currentIndex.value + 1);
    } else {
      
      if (this.params.value.printAfterSave) {
        await this.printAction()
      }

      if (this.params.value.mode === 'create' && this.params.value.multiple) {
        this.handleOn('saved', this);
        await this.prepareForm(props, context, 0);
        this.handleOn('before-reset', this);
        await this.$master?.$reset();
        this.captureCleanState();
        this.handleOn('reset', this);
      } else if (this.params.value.mode === 'edit' && this.params.value.editAfterSave) {
        this.captureCleanState();
        this.handleOn('saved', this);
        await this.prepareForm(props, context, 0);
      } else {
        if (this.params.value.mode === 'create') {
          this.handleOn('before-reset', this);
          await this.$master?.$reset();
          this.captureCleanState();
          this.handleOn('reset', this);
        } else {
          this.captureCleanState();
        }
        this.handleOn('saved', this);
        this.handleOn('finished', this);
      }
    }
  }

  private async oncancel() {
    if (this.params.value.confirmOnCancel) {
      const accepted = await Dialogs.$confirm(this.hasUnsavedChanges() ? 'Discard unsaved changes?' : 'Cancel this report?');
      if (!accepted) {
        return;
      }
    }

    await sleep(50);
    this.handleOn('cancel', this);
  }

  private async onprev() {
    const props = this.lastProps;
    const context = this.lastContext;
    await sleep(50);
    if (this.hasPrev) {
      await this.prepareForm(props, context, this.currentIndex.value - 1);
    }
  }

  private async focusCurrentForm() {
    if (!this.currentForm) {
      return;
    }

    await sleep(50);
    await this.currentForm.focusPrimaryInput();
  }

  private applyStepSubtitle(form: Form, index: number) {
    const label = this.progressLabel(index);
    if (!label) {
      return;
    }

    const subtitle = form.$params.subtitle;
    form.$params.subtitle = subtitle && subtitle !== ''
      ? `${subtitle} • ${label}`
      : label;
  }

  private progressLabel(index: number): string | undefined {
    const total = Math.max(this.params.value.forms || 0, index + 1);
    if (total <= 1) {
      return undefined;
    }
    return `Step ${index + 1} of ${total}`;
  }

  private snapshotMasterData(): string {
    try {
      return JSON.stringify(this.$master?.$data || {});
    } catch (error) {
      return '';
    }
  }

  private captureCleanState() {
    this.cleanSnapshot = this.snapshotMasterData();
  }

  private hasUnsavedChanges(): boolean {
    return this.snapshotMasterData() !== this.cleanSnapshot;
  }

  async forceCancel() {
    await this.hide();
    this.oncancel();
  }

  async forceSave() {
    this.save()
  }

  private triggerButtonShortcut(ev: KeyboardEvent) {
    if (ev.repeat) {
      return false;
    }

    for (const button of this.sideButtonInstances) {
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

  private onReportKeydown(ev: KeyboardEvent) {
    if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
      return;
    }

    this.triggerButtonShortcut(ev);
  }

  setup(props: any, context: any) {
    if (this.options.setup) this.options.setup(this);
    this.handleOn('setup', this);
  }

  async print() {
    await this.printAction();
  }

  async beforePrint(): Promise<any|undefined> {
    if (this.options.beforePrint) return await this.options.beforePrint(this, this.params.value.mode);
  }

  async printTemplate(): Promise<any|undefined> {
    if (this.options.printTemplate) return await this.options.printTemplate(this, this.params.value.mode);
    return await AppManager.$printer.getTemplateIdByName(this.params.value.printTemplate);
  }

  private async printAction() {
    Dialogs.$showProgress({});
    const template = await this.printTemplate();
    if (template) {
      const info = await this.beforePrint();
      const data = {$info: info, $master: this.$master, $rep: this, $func: AppManager.$printer.printFunctions()};
      this.handleOn('before-print', data);
      await AppManager.$printer.printReportById(template, data);
      this.handleOn('after-print', data);
    }
    Dialogs.$hideProgress();
  }

  async export() {
    await this.exportAction()
  }

  async beforeExport(): Promise<any|undefined> {
    if (this.options.beforeExport) return await this.options.beforeExport(this, this.params.value.mode);
  }

  async exportTemplate(): Promise<ExportTemplateInfo|undefined> {
    if (this.options.exportTemplate) return await this.options.exportTemplate(this, this.params.value.mode);
    const temp = await AppManager.$printer.getTemplateIdByName(this.params.value.exportTemplate);
    return {template: temp, filename: 'data.xlsx'}
  }

  private async exportAction() {
    Dialogs.$showProgress({});
    const templateInfo = await this.exportTemplate();
    const template = templateInfo?.template;

    if (template) {
      const info = await this.beforeExport();
      const data = {$info: info, $master: this.$master, $rep: this, $func: AppManager.$printer.printFunctions()};
      this.handleOn('before-export', data);
      const code = await AppManager.$printer.getTemplate(template, "excel");
      
      const excelData: any = await computeFunctionalCodeAsync(code, {
        params: ['$info', '$master', '$func'],
        data
      });

      if (excelData) {
        const workbook = $excel.writeData(excelData?.sheetNames || [], excelData?.data || {});
        await $excel.saveWorkBook(templateInfo.filename || 'data.xlsx', workbook);  
      }
      
      this.handleOn('after-export', data);
    }
    Dialogs.$hideProgress()
  }

  private syncSideActionBreakpoint(matches?: boolean) {
    this.compactSideActions.value = matches ?? (typeof window !== 'undefined' ? window.innerWidth < 1400 : false);
  }

  private attachSideActionBreakpoint() {
    if (typeof window === 'undefined' || this.sideActionMediaQuery) {
      return;
    }

    this.sideActionMediaQuery = window.matchMedia('(max-width: 1399px)');
    this.syncSideActionBreakpoint(this.sideActionMediaQuery.matches);
    this.sideActionMediaHandler = (ev: MediaQueryListEvent) => {
      this.syncSideActionBreakpoint(ev.matches);
    };

    if (typeof this.sideActionMediaQuery.addEventListener === 'function') {
      this.sideActionMediaQuery.addEventListener('change', this.sideActionMediaHandler);
    } else {
      this.sideActionMediaQuery.addListener(this.sideActionMediaHandler);
    }
  }

  private detachSideActionBreakpoint() {
    if (!this.sideActionMediaQuery || !this.sideActionMediaHandler) {
      this.sideActionMediaQuery = undefined;
      this.sideActionMediaHandler = undefined;
      return;
    }

    if (typeof this.sideActionMediaQuery.removeEventListener === 'function') {
      this.sideActionMediaQuery.removeEventListener('change', this.sideActionMediaHandler);
    } else {
      this.sideActionMediaQuery.removeListener(this.sideActionMediaHandler);
    }

    this.sideActionMediaQuery = undefined;
    this.sideActionMediaHandler = undefined;
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
    this.attachSideActionBreakpoint();
    if (typeof window !== 'undefined' && !this.shortcutHandler) {
      this.shortcutHandler = (ev: KeyboardEvent) => this.onReportKeydown(ev);
      window.addEventListener('keydown', this.shortcutHandler);
    }
    super.attachEventListeners()
    this.listenersAttached = true;
  }

  removeEventListeners() {
    if (this.options.removeEventListeners && this.listenersAttached) {
      this.options.removeEventListeners(this);
      if (this.currentForm) this.currentForm.removeEventListeners()
    }
    this.detachSideActionBreakpoint();
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }
    super.removeEventListeners()
    this.listenersAttached = false;
  }

}

export const $RP = (params?: ReportParams, options?: ReportOptions) => new Report(params || {}, options || {});
