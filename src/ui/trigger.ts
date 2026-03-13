import { VNode, Ref } from "vue";
import { ReportMode, UIBase } from "./base";
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VCardSubtitle, VTextField, VCol, VContainer, VLayout, VAutocomplete, VBtn, VMenu } from 'vuetify/components';
import { Button, ButtonParams } from "./button";
import { VDataTableServer } from 'vuetify/components';
import { Dialogs } from "./dialogs";
import { OnHandler } from "./lib";
import { Part, PRefs } from "./part";
import { Field, Refs } from "./field";
import { ExportTemplateInfo } from "./report";
import { AppManager } from "./appmanager";
import { $excel, computeFunctionalCodeAsync } from "../misc";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";

export interface TriggerParams {
  ref?: string;
  invisible?: boolean;
  title?: string;
  subtitle?: string;
  mode?: 'create'|'edit'|'display';
  cancelButton?: ButtonParams,
  removeButton?: ButtonParams,
  viewButton?: ButtonParams,
  editButton?: ButtonParams,
  elevation?: number;
  maxWidth?: number|string|undefined;
  minWidth?: number|string|undefined;
  width?: number|string|undefined;
  headers?: any[];
  tableHeight?: number|string;
  queryFields?: any[];
  selectFields?: any;
  objectType?: any;
  idField?: any;
  multiple?: boolean;
  defaultButtonPosition?: "top"|"bottom"|"both";
  sideButtonPosition?: 'left'|'right';
  verticalAlign?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  horizontalAlign?: "left"|"center"|"right";
  fluid?: boolean;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  query?: any;
  canPrint?: boolean;
  canExport?: boolean;
  printTemplate?: string;
  exportTemplate?: string;
  exportFilename?: string;
}

export interface TriggerOptions {
  searchFields?: (tigger: Trigger, mode?: 'create'|'edit'|'display') => any | Promise<any>;
  cancel?: () => Promise<void>;
  access?: (tigger: Trigger, mode?: 'create'|'edit'|'display') => Promise<boolean>;
  removeAccess?: (trigger: Trigger) => Promise<boolean>;
  canRemove?: (item: any, trigger: Trigger) => Promise<boolean>;
  headers?: (trigger: Trigger) => Promise<any[]>;
  load?: (searchText: string, trigger: Trigger, options: any) => Promise<any>;
  remove?: (item: any, trigger: Trigger) => Promise<boolean|string>;
  query?: (search: string, trigger: Trigger, mode?: 'create'|'edit'|'display', searchFields?: any[]) => Promise<any>;
  setup?: (trigger: Trigger) => void;
  on?: (trigger: Trigger) => OnHandler;
  format?: (trigger: Trigger, items : any[]) => Promise<any[]| undefined>|any[]|undefined;
  topChildren?: (props: any, context: any) => Array<Part|Field>;
  bottomChildren?: (props: any, context: any) => Array<Part|Field>;
  processQuery?: (query: any, trigger: Trigger, mode?: 'create'|'edit'|'display', search?: string, searchFields?: any[]) => Promise<any>;
  beforePrint?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  printTemplate?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  beforeExport?: (trigger: Trigger, mode?: ReportMode) => Promise<any|undefined>|any|undefined;
  exportTemplate?: (trigger: Trigger, mode?: ReportMode) => Promise<ExportTemplateInfo|undefined>|ExportTemplateInfo|undefined;
  sideButtons?: (props: any, context: any, trigger: Trigger) => Array<Button>|undefined;
}

export interface ServerTableOptions {
  page: number,
  itemsPerPage: any,
  total: number,
  selectedFilterFields?: any[]
}

export class Trigger extends UIBase {
  private params: Ref<TriggerParams>;
  private hasAccess: Ref<boolean>;
  private hasRemoveAccess: Ref<boolean>;
  private options: TriggerOptions;
  private topButtonInstances: Array<Button> = [];
  private bottomButtonInstances: Array<Button> = [];
  private sideButtonInstances: Array<Button> = [];
  private items: Ref<any[]|undefined>;
  private selected: Ref<any[]|undefined>;
  private searchText: Ref<string>;
  private selectedSearchFields: Ref<any[]>;
  private childrenInstances: Array<Part|Field> = [];
  private searchFieldItems: Ref<any[]>;
  private searchFieldData: any;
  private currentSearchText: string;
  private computedHeaders: Ref<any[]|undefined>;
  private tableOptions: Ref<ServerTableOptions>;
  private loaded = false;
  private loading: Ref<boolean> = this.$makeRef(false);
  private hasPrintAccess: Ref<boolean>;
  private hasExportAccess: Ref<boolean>;
  private listenersAttached = false;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private compactSideActions: Ref<boolean>;
  private sideActionMediaQuery?: MediaQueryList;
  private sideActionMediaHandler?: ((ev: MediaQueryListEvent) => void) | undefined;
  private static defaultParams: TriggerParams = {
    fluid: true,
    sideButtonPosition: 'right',
  };

  constructor(params?: TriggerParams, options?: TriggerOptions) {
    super();
    this.params = this.$makeRef({...Trigger.defaultParams, ...(params || {})});
    this.options = options || {};
    this.hasAccess = this.$makeRef(true);
    this.items = this.$makeRef([]);
    this.selected = this.$makeRef([]);
    this.computedHeaders = this.$makeRef([]);
    this.hasRemoveAccess = this.$makeRef(true);
    this.searchText = this.$makeRef("");
    this.selectedSearchFields = this.$makeRef([])
    this.tableOptions = this.$makeRef({page: 1, itemsPerPage: 10, total: 0});
    this.currentSearchText = "";
    this.searchFieldItems = this.$makeRef([]);
    this.searchFieldData = {};

    this.hasPrintAccess = this.$makeRef(true);
    this.hasExportAccess = this.$makeRef(true);
    this.compactSideActions = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth < 1400 : false);
  }

  static setDefault(value: TriggerParams, reset?: boolean): void {
    if (reset) {
      Trigger.defaultParams = value;
    } else {
      Trigger.defaultParams = {...Trigger.defaultParams, ...value};
    }
  }

  get $refs(): Refs {
    const items: Refs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      if (this.childrenInstances[i] instanceof Field) {
        const ref = this.childrenInstances[i].$ref;
        if (ref && ref !== '') {
          items[ref] = (this.childrenInstances[i] as Field);
        }
      }
    }
    return items;
  }

  get $prefs(): PRefs {
    const items: PRefs = {};
    for (let i = 0; i < this.childrenInstances.length; i++) {
      if (this.childrenInstances[i] instanceof Part) {
        const ref = this.childrenInstances[i].$ref;
        if (ref && ref !== '') {
          items[ref] = (this.childrenInstances[i] as Part);
        }
      }
    }
    return items;
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: TriggerParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): TriggerParams {
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
    try {
      this.hasRemoveAccess.value = await this.removeAccess() || false;
    } catch (error) {
      this.hasRemoveAccess.value = false;
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

  async validate (): Promise<string|true|undefined|void> {
  }

  async saved() {}

  async cancel() {}

  async access(mode?: any): Promise<boolean> {
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async removeAccess (): Promise<boolean> {
    return this.options.removeAccess ? await this.options.removeAccess(this) : true;
  }

  async canRemove (item: any): Promise<boolean> {
    return true;
  }

  async remove (item: any): Promise<boolean|string> {
    const itemId = item[this.params.value.idField || "_id"];
    if (itemId) {
      try {
        await this.$app.service(this.params.value.objectType).remove(itemId);
        return true;
      } catch (error) {
        return (error as any).message;
      }
    }
    return 'Undefined Item Id';
  }

  async load(searchText: string, options: ServerTableOptions): Promise<any> {
    let data: any = null;

    if (this.$params.objectType) {
      let query: any = await this.query(searchText, this.params.value.mode);
      if (options.itemsPerPage >= 0) {
        query.$limit = options.itemsPerPage;
        query.$skip = (options.page - 1) * query.$limit;
      } else {
        query.$paginate = false;
      }
      data = await this.$app.service(this.params.value.objectType).find({query});
    }

    return data;
  }

  async query(search: string, mode?: 'create'|'edit'|'display'): Promise<any> {
    let query: any = {...(this.params.value.query || {})};

    if (this.options.query) {
      query = await this.options.query(search, this, mode, this.selectedSearchFields.value || []);
    } else {
      if (this.params.value.selectFields) {
        query.$select = this.params.value.selectFields;
      }
      if (this.params.value.queryFields && search) {

        query.$or = this.params.value.queryFields.map((f: any) => {
          const fq: any = {};
          fq[f] = {$regex: search, $options: 'i'}
          return fq;
        });
      }

      if ((this.selectedSearchFields.value || []).length > 0) {
        let addedQ: any[] = [];

        if (this.searchFieldData?.callback) {
          addedQ = await this.searchFieldData.callback(search, this.selectedSearchFields.value, this)
        } else {

          addedQ = this.selectedSearchFields.value.filter((f: any) => f._id).map((f: any) => {
            const fq: any = {};
            fq[f._id] = {$regex: search, $options: 'i'}
            return fq;
          })

        }

        if (!query.$or) query.$or = []
        
        if (Array.isArray(addedQ)) {
          query.$or = query.$or.concat(addedQ);
        } else {
          query.$or.push(addedQ);
        }

      }
    }
    if (this.options.processQuery) {
      query = (await this.options.processQuery(query, this, mode, search, this.selectedSearchFields.value || [])) || query;
    }
    return query;
  }

  props() {
    return []
  }

  async onTableOptionsChanged(options: any) {
    await this.loadItems(options);
  }

  private async loadItems(options: ServerTableOptions) {
    this.loading.value = true;

    try {
      let data: any = null;

      if (this.options.load) {
        const fulloptions = {
          ...options,
          selectedFilterFields: this.selectedSearchFields.value || []
        }
        data = await this.options.load(this.currentSearchText, this, fulloptions);
      } else {
        data = await this.load(this.currentSearchText, options);
      }
      
      if(Array.isArray(data)) {
        this.items.value = this.options.format ? await this.options.format(this, data) || [] : data;
        this.tableOptions.value.itemsPerPage = -1;
        this.tableOptions.value.total = data.length;
        this.tableOptions.value.page = 1;
      } else {
        this.tableOptions.value.total = data.total;
        this.items.value = this.options.format ? await this.options.format(this, data.data || []) || [] : data.data || [];
        this.tableOptions.value.itemsPerPage = data.limit;
        this.tableOptions.value.page = options.page;
      }
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
      VContainer,
      {
        fluid: this.params.value.fluid !== false,
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
            class: ['fill-height'],
            align: this.outerAlign(),
            alignContent: this.params.value.verticalAlign,
            justify: this.outerJustify(),
          },
          () => h(
            VCol,
            {
              cols: 12,
              align: this.params.value.horizontalAlign !== "center" ? this.params.value.horizontalAlign : undefined,
              style: { paddingTop: '16px', paddingBottom: '16px' }
            },
            () => this.wrapWithSideButtons(
              props,
              context,
              h(
                VCard,
                {
                  onKeydown: (ev: KeyboardEvent) => this.onTriggerKeydown(ev),
                  maxWidth: this.params.value.maxWidth,
                  width: this.params.value.width,
                  minWidth: this.params.value.minWidth,
                  style: this.cardStyle(),
                  elevation: this.params.value.elevation,
                  class: (this.params.value.horizontalAlign || "center") === "center" ? ['mx-auto'] : []
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
            )
          )
        )
      )
    )
  }

  private outerAlign(): NonNullable<TriggerParams['align']> {
    if (this.params.value.verticalAlign === 'start') return 'start';
    if (this.params.value.verticalAlign === 'end') return 'end';
    if (this.params.value.verticalAlign === 'stretch') return 'stretch';
    return 'center';
  }

  private outerJustify(): NonNullable<TriggerParams['justify']> {
    if (this.params.value.horizontalAlign === 'left') return 'start';
    if (this.params.value.horizontalAlign === 'right') return 'end';
    return 'center';
  }

  private cardStyle() {
    return {
      maxWidth: '100%',
    };
  }

  private buildTitle(props: any, context: any) {
    const h = this.$h;
    return h(
      VCardTitle,
      {},
      () => [
        h(
        'span',
        {},
        this.$params.title || ''
        )
      ]
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
        () => {
          const top = this.options.topChildren ? this.options.topChildren(props, context) : this.topChildren(props, context);
          const bot = this.options.bottomChildren ? this.options.bottomChildren(props, context) : this.bottomChildren(props, context);

          this.childrenInstances = top.concat(bot);
          this.childrenInstances.forEach((instance) => {
            instance.setParent(this);
          })

          return [
            ...this.buildSearchBar(),
            ...(this.searchFieldItems.value.length > 0 ? this.buildFilterBar() : []),
            ...(top.map((instance) => this.$h(instance.component))),
            ...this.buildResultStatus(),
            ...this.buildResultTable(),
            ...(bot.map((instance) => this.$h(instance.component))),
          ]
        }
      )
    )
  }

  private buildSearchBar() {
    const h = this.$h;

    return [
      h(
        VCol,
        {cols: 12},
        () => h(
          VTextField,
          {
            variant: 'outlined',
            placeholder: 'Search Object',
            density: 'compact',
            appendIcon: 'mdi-magnify',
            modelValue: this.searchText.value,
            "onUpdate:modelValue": (value: string) => {
              this.searchText.value = value;
            },
            autofocus: true,
            "onClick:append": () => this.onSearchClicked(),
            onKeyup: (ev: KeyboardEvent) => {
              if (ev.key === 'Enter' || ev.key === 'Return') {
                this.onSearchClicked()
              }
            },
          },
        )
      )
    ]
  }

  private buildFilterBar() {
    const h = this.$h;

    return [
      h(
        VCol,
        {cols: 12},
        () => h(
          VAutocomplete,
          {
            variant: 'outlined',
            placeholder: 'Select Additional Search Fields',
            density: 'compact',
            modelValue: this.selectedSearchFields.value,
            "onUpdate:modelValue": (value: any[]) => {
              this.selectedSearchFields.value = value;
            },
            multiple: true,
            itemTitle: "name",
            itemValue: "_id",
            returnObject: true,
            appendIcon: 'mdi-filter-cog',
            items: this.searchFieldItems.value
          },
        )
      )
    ]
  }

  private buildResultTable() {
    const h = this.$h;
    return [
      h(
        VCol,
        {
          cols: 12,
          class: ['pt-0']
        },
        () => h(
          VDataTableServer,
          {
            headers: this.computedHeaders.value,
            items: this.items.value,
            modelValue: this.selected.value,
            showSelect: true,
            hideNoData: false,
            noDataText: this.currentSearchText || (this.selectedSearchFields.value || []).length > 0
              ? 'No matching records found. Try a different search.'
              : 'Enter a search term and press Enter to load results.',
            itemValue: this.params.value.idField || "_id",
            loading: this.loading.value,
            itemsPerPage: this.tableOptions.value.itemsPerPage,
            page: this.tableOptions.value.page,
            returnObject: true,
            itemsLength: this.tableOptions.value.total || 0,
            density: 'compact',
            height: this.params.value.tableHeight || 300,
            fixedHeader: true,
            fixedFooter: true,
            hover: true,
            "onUpdate:options": (options: any) => this.onTableOptionsChanged(options),
            "onClick:row": (ev: any, item: any) => this.onTableItemClicked(item),
            "onUpdate:modelValue": (options: any) => this.onSelectionChanged(options)
          }
        )
      )
    ]
  }

  private buildResultStatus() {
    const h = this.$h;

    let message = '';
    if (this.loading.value) {
      message = 'Loading results...';
    } else if ((this.selected.value || []).length > 0) {
      message = `${this.selected.value!.length} item(s) selected.`;
    } else if (this.currentSearchText || (this.selectedSearchFields.value || []).length > 0) {
      message = `${this.tableOptions.value.total || 0} result(s) found.`;
    } else {
      message = 'Search by text or add filters to start browsing records.';
    }

    return [
      h(
        VCol,
        {
          cols: 12,
          class: ['pb-0']
        },
        () => h(
          'div',
          {
            class: ['text-medium-emphasis', 'text-body-2']
          },
          message
        )
      )
    ];
  }

  async headers(): Promise<any[]> {
    return [
      {title: 'Name', key: 'name'}
    ];
  }

  async searchFields(): Promise<any> {
    return {}
  }

  private async initialize() {
    const headers = this.options.headers ? await this.options.headers(this): (this.params.value.headers || await this.headers());
    await this.runAccess();
    this.computedHeaders.value = headers;
    let sdata = null;

    if (this.options.searchFields) {
      sdata = await this.options.searchFields(this, this.params.value.mode)
    } else {
      sdata = await this.searchFields()
    }

    if (sdata) {
      this.searchFieldData = sdata;
      this.searchFieldItems.value = sdata.fields || []
    } else {
      this.searchFieldData = {}
      this.searchFieldItems.value = []
    }


    
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
          width: '180px',
          minWidth: '180px',
          alignSelf: 'flex-start',
        },
      },
      () => h(
        VCardText,
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
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
                width: '180px',
                minWidth: '180px',
              },
            },
            () => h(
              VCardText,
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
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

  private buildDefaultButtons(): Button[] {

    if (this.hasRemoveAccess.value && this.selected.value && this.selected.value.length > 0) {
      return this.getAdditionalButtons().concat([
        new Button(
          {text: 'Remove', color: 'warning', ...(this.params.value.removeButton || {})},
          {
            onClicked: () => this.onRemoveClicked()
          }
        ),
        ...(this.params.value.multiple && this.selected.value && this.selected.value.length > 0 ? [
          new Button(
            {text: this.params.value.mode === 'display' ? 'View': 'Edit', color: 'success', ...(this.params.value.mode === 'display' ? this.params.value.viewButton || {} : this.params.value.editButton || {})},
            {
              onClicked: () => this.onProcessMultiple()
            }
          )  
        ]: []),
        new Button(
          {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
          {
            onClicked: () => this.onCancelClicked()
          }
        )
      ])
    } else {
      return this.getAdditionalButtons().concat([
        ...(this.params.value.multiple && this.selected.value && this.selected.value.length > 0 ? [
          new Button(
            {text: this.params.value.mode === 'display' ? 'View': 'Edit', color: 'success', ...(this.params.value.mode === 'display' ? this.params.value.viewButton || {} : this.params.value.editButton || {})},
            {
              onClicked: () => this.onProcessMultiple()
            }
          )  
        ]: []),
        new Button(
          {text: 'Cancel', color: 'secondary', ...(this.params.value.cancelButton || {})},
          {
            onClicked: () => this.onCancelClicked()
          }
        )
      ])
    }
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

  topChildren (props: any, context: any): Array<Part|Field> {
    return []
  }

  bottomChildren (props: any, context: any): Array<Part|Field> {
    return []
  }

  private async onProcessMultiple() {
    const items: any = this.selected.value || [];
    this.handleOn("selected", items);
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

  private onTriggerKeydown(ev: KeyboardEvent) {
    if (Dialogs.hasBlockingDialog() || ev.defaultPrevented) {
      return;
    }

    if (ev.key === 'Escape' && !ev.altKey && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) {
      if (this.shouldIgnoreEscapeCancel(ev.target)) {
        return;
      }

      ev.preventDefault();
      this.onCancelClicked();
      return;
    }

    this.triggerButtonShortcut(ev);
  }

  private getShortcutButtons() {
    return this.topButtonInstances.concat(this.bottomButtonInstances).concat(this.sideButtonInstances);
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

  private shouldIgnoreEscapeCancel(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest('[contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
      return true;
    }

    return false;
  }

  private async onRemoveClicked() {
    const confirm = await Dialogs.$confirm('Remove selected items?');
    if (!confirm) return;

    const items = this.selected.value || [];
    let hasError = false;

    for (let i = 0; i < items.length; i++) {
      const canRem = this.options.canRemove ? await this.options.canRemove(items[i], this) : this.canRemove(items[i]);
      if (canRem) {
        let res: any = false;
        if (this.options.remove) {
          res = await this.options.remove(items[i], this); 
        } else {
          res = await this.remove(items[i]);
        }

        if (res !== true) {
          Dialogs.$warning(res || 'Unable to remove items');
          hasError = true;
          break;
        }
      }
    }

    if (!hasError) {
      Dialogs.$success('Items successfully removed!');
    }

    this.selected.value = [];
    await this.loadItems({page: 1, itemsPerPage: this.tableOptions.value.itemsPerPage, total: 0});
  }

  private async onSearchClicked() {
    const options: ServerTableOptions = {
      page: 1,
      itemsPerPage: this.tableOptions.value.itemsPerPage,
      total: 0
    };

    this.currentSearchText = this.searchText.value;
    await this.loadItems(options);
  }

  private async onTableItemClicked(options: any) {
    const item: any = options?.item || {};
    this.handleOn("selected", item);
  }

  private async onSelectionChanged(options: any) {
    this.selected.value = options;
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

  attachEventListeners() {
    this.attachSideActionBreakpoint();
    if (typeof window !== 'undefined' && !this.shortcutHandler) {
      this.shortcutHandler = (ev: KeyboardEvent) => this.onTriggerKeydown(ev);
      window.addEventListener('keydown', this.shortcutHandler);
    }
    super.attachEventListeners();
    this.listenersAttached = true;
  }

  removeEventListeners() {
    this.detachSideActionBreakpoint();
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }
    super.removeEventListeners();
    this.listenersAttached = false;
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

}

export const $TG = (params?: TriggerParams, options?: TriggerOptions) => new Trigger(params || {}, options || {});
