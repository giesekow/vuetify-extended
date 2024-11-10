import { VNode, Ref } from "vue";
import { UIBase } from "./base";
import { VDivider, VRow, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VCardSubtitle, VTextField, VCol, VContainer, VLayout, VAutocomplete } from 'vuetify/components';
import { Button, ButtonParams } from "./button";
import { VDataTableServer } from 'vuetify/components';
import { Dialogs } from "./dialogs";
import { OnHandler } from "./lib";

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
  verticalAlign?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  horizontalAlign?: "left"|"center"|"right";
  fluid?: boolean;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  query?: any;
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
  private items: Ref<any[]|undefined>;
  private selected: Ref<any[]|undefined>;
  private searchText: Ref<string>;
  private selectedSearchFields: Ref<any[]>;
  private searchFieldItems: Ref<any[]>;
  private searchFieldData: any;
  private currentSearchText: string;
  private computedHeaders: Ref<any[]|undefined>;
  private tableOptions: Ref<ServerTableOptions>;
  private loaded = false;
  private loading: Ref<boolean> = this.$makeRef(false);

  constructor(params?: TriggerParams, options?: TriggerOptions) {
    super();
    this.params = this.$makeRef(params || {});
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
      if (this.options.access) {
        this.hasAccess.value = await this.options.access(this, this.params.value.mode);
      } else {
        this.hasAccess.value = await this.access(this.params.value.mode);
      }
      if (this.options.removeAccess) {
        this.hasRemoveAccess.value = await this.options.removeAccess(this);
      } else {
        this.hasRemoveAccess.value = await this.removeAccess();
      }
    } catch (error) {
      this.hasAccess.value = false;
    }
  }

  async validate (): Promise<string|true|undefined|void> {
  }

  async saved() {}

  async cancel() {}

  async access(mode?: 'create'|'edit'|'display'): Promise<boolean> {
    return true;
  }

  async removeAccess (): Promise<boolean> {
    return true;
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

      if (this.selectedSearchFields.value && this.selectedSearchFields.value.length > 0) {

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
    return query;
  }

  props() {
    return []
  }

  async onTableOptionsChanged(options: any) {
    await this.loadItems(options);
  }

  private async loadItems(options: ServerTableOptions) {

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
            justify: "center"
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
                maxWidth: this.params.value.maxWidth,
                width: this.params.value.width,
                minWidth: this.params.value.minWidth,
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
        () => [
          ...this.buildSearchBar(),
          ...(this.searchFieldItems.value.length > 0 ? this.buildFilterBar() : []),
          ...this.buildResultTable()
        ]
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
            modelValue: this.searchText,
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
            modelValue: this.selectedSearchFields,
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
        VDataTableServer,
        {
          headers: this.computedHeaders.value,
          items: this.items.value,
          modelValue: this.selected.value,
          showSelect: true,
          hideNoData: true,
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
    ]
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

  private buildDefaultButtons(): Button[] {

    if (this.hasRemoveAccess.value && this.selected.value && this.selected.value.length > 0) {
      return [
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
      ]
    } else {
      return [
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
      ]
    }
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