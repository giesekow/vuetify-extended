import { VNode, Ref } from "vue";
import { ReportMode, UIBase } from "./base";
import { VDivider, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VLayout, VCol, VRow, VContainer } from 'vuetify/components';
import { Master } from "../master";
import { Form } from './form';
import { Button, ButtonParams } from "./button";
import { $excel, computeFunctionalCodeAsync, sleep } from "../misc";
import { AppManager } from "./appmanager";
import { Dialogs } from "./dialogs";
import { OnHandler } from "./lib";
import { PRefs } from "./part";
import { Refs } from "./field";

export interface ReportParams {
  objectType?: any;
  objectId?: any;
  selected?: any;
  title?: string;
  hideMode?: boolean;
  cancelButton?: ButtonParams;
  nextButton?: ButtonParams;
  prevButton?: ButtonParams;
  finishButton?: ButtonParams;
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
  access?: (report: Report) => Promise<boolean>|boolean;
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
}

export interface ExportTemplateInfo {
  template?: any;
  filename?: string;
}

export class Report extends UIBase {
  private params: Ref<ReportParams>;
  private hasAccess: Ref<boolean>;
  private options: ReportOptions;
  private loaded = false;
  private topButtonInstances: Array<Button> = [];
  private bottomButtonInstances: Array<Button> = [];
  private currentForm: Form|undefined;
  private currentIndex: Ref<number>;
  private hasNext = false;
  private hasPrev = false;
  private listenersAttached = false;

  constructor(params?: ReportParams, options?: ReportOptions) {
    super();
    this.params = this.$makeRef(params || {});
    this.options = options || {};

    if (options?.master) {
      this.setMaster(options?.master);
    } else {
      this.setMaster(new Master({type: this.params.value.objectType, id: this.params.value.objectId}));
    }

    this.hasAccess = this.$makeRef(true);
    this.currentIndex = this.$makeRef(-1);
    this.currentForm = undefined;
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

  private async initialize(props: any, context: any) {
    this.loaded = true;
    await this.runAccess();

    if (this.hasAccess.value) {
      await this.prepareForm(props, context, 0);
      await this.loadObject();
    }
  }

  private async runAccess() {
    this.hasAccess.value = await this.access() || false;
  }

  async loadObject() {
    this.handleOn('before-loaded', this);
    if (this.$master) {
      this.$master.$id = this.params.value.objectId;
      this.$master.$type = this.params.value.objectType;
      await this.$master.$load();
    }
    if (this.options.loaded) {
      this.options.loaded(this)
    }
    this.handleOn('loaded', this);
  }

  async saved() {}

  async cancel() {}

  async access(): Promise<boolean> {
    return this.options.access ? await this.options.access(this) : true;
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

  props() {
    return []
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;

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
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined
              },
              () => h(
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
      );
    }

    if (this.currentForm) {
      this.currentForm.on('saved', () => this.save(props, context));
      this.currentForm.on('cancel', () => this.oncancel(props, context));

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
                align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined
              },
              () => {
                if ((this.params.value.horizontalAlign || "center") === "center") this.currentForm!.$params.cardClass = ['mx-auto'];
                return h(
                  this.currentForm!.component
                )
              }
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

        if (this.params.value.setActionButtons || this.params.value.setActionButtons === undefined) {
          if (this.hasNext) {
            newForm.$params.saveButton = {
              ...(this.params.value.nextButton || {text: 'Next'}),
              ...(newForm.$params.saveButton || {}),
            }
          } else if (index > 0) {
            newForm.$params.showSaveInReadonly = true;
            if (this.params.value.mode === 'display') {
              newForm.$params.saveButton = {
                ...(this.params.value.finishButton || {text: 'Finish'}),
                ...(newForm.$params.saveButton || {}),
              }
            } else if (this.params.value.finishButton) {
              newForm.$params.saveButton = {
                ...(this.params.value.finishButton || {text: 'Save'}),
                ...(newForm.$params.saveButton || {}),
              }
            }
          }

          if (this.hasPrev) {
            newForm.$params.cancelButton = {
              ...(this.params.value.prevButton || {text: 'Prev'}),
              ...(newForm.$params.cancelButton || {}),
            }
          }
        }

        if (this.currentForm) {
          this.currentForm.removeEventListeners()
        }

        this.currentForm = newForm
        this.currentIndex.value = index;
        this.currentForm.attachEventListeners();
      }

    } else {
      this.currentForm = undefined;
      this.currentIndex.value = -1;
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

  private buildDefaultButtons(): Button[] {
    return [
      new Button(
        {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
        {
          onClicked: () => this.oncancel(null, null)
        }
      ),
    ]
  }

  getAdditionalButtons(): Button[] {
    if (this.params.value.mode === 'create') return [];

    const btns: Button[] = [];
    if (this.params.value.canPrint) {
      btns.push(
        new Button({text: 'Print', color: 'primary'}, {
          onClicked: () => {
            this.printAction()
          }
        })
      )
    }

    if (this.params.value.canExport) {
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

  private async save(props: any, context: any) {
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
        this.handleOn('reset', this);
      } else if (this.params.value.mode === 'edit' && this.params.value.editAfterSave) {
        this.handleOn('saved', this);
        await this.prepareForm(props, context, 0);
      } else {
        if (this.params.value.mode === 'create') {
          this.handleOn('before-reset', this);
          await this.$master?.$reset();
          this.handleOn('reset', this);
        }
        this.handleOn('saved', this);
        this.handleOn('finished', this);
      }
    }
  }

  private async oncancel(props: any, context: any) {
    await sleep(50);
    if (this.hasPrev) {
      await this.prepareForm(props, context, this.currentIndex.value - 1);
    } else {
      this.handleOn('cancel', this);
    }
  }

  async forceCancel() {
    await this.hide();
    this.oncancel(null, null);
  }

  async forceSave() {
    this.save(null, null)
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

      const workbook = $excel.writeData(excelData.sheetNames || [], excelData.data || {});
      await $excel.saveWorkBook(templateInfo.filename || 'data.xlsx', workbook);
      this.handleOn('after-export', data);
    }
    Dialogs.$hideProgress()
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
    super.attachEventListeners()
    this.listenersAttached = true;
  }

  removeEventListeners() {
    if (this.options.removeEventListeners && this.listenersAttached) {
      this.options.removeEventListeners(this);
      if (this.currentForm) this.currentForm.removeEventListeners()
    }
    super.removeEventListeners()
    this.listenersAttached = false;
  }

}

export const $RP = (params?: ReportParams, options?: ReportOptions) => new Report(params || {}, options || {});