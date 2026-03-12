import { VNode, Ref } from "vue";
import { UIBase } from "./base";
import { Trigger } from "./trigger";
import { Report } from "./report";
import { Selector } from "./selector";
import { OnHandler } from "./lib";
import { VAlert } from "vuetify/components";

export interface CollectionParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  idField?: string;
  objectType?: string;
  selectionOnly?: boolean;
  multiple?: boolean;
  mode?: 'create'|'edit'|'display';
}

export interface CollectionOptions {
  access?: (collection: Collection, mode: any) => Promise<boolean|undefined>|boolean|undefined;
  report?: (collection: Collection) => Promise<Report|undefined>|Report|undefined;
  trigger?: (collection: Collection) => Promise<Trigger|undefined>|Trigger|undefined;
  selector?: (collection: Collection) => Promise<Selector|undefined>|Selector|undefined;
  setup?: (collection: Collection) => void;
  on?: (collection: Collection) => OnHandler;
}

export class Collection extends UIBase {
  private params: Ref<CollectionParams>;
  private options: CollectionOptions;
  private currentReport?: Report;
  private currentTrigger?: Trigger;
  private currentSelector?: Selector;
  private currentObject: Ref<'report'|'selector'|'trigger'|undefined>;
  private prevState: 'report'|'selector'|'trigger'|undefined;
  private selectedItems: any[] = [];
  private currentIndex: number = 0;
  private static defaultParams: CollectionParams = {};

  constructor(params?: CollectionParams, options?: CollectionOptions) {
    super();
    this.params = this.$makeRef({...Collection.defaultParams, ...(params || {})});
    this.options = options || {};
    this.currentObject = this.$makeRef();
    this.prevState = undefined;
  }

  static setDefault(value: CollectionParams, reset?: boolean): void {
    if (reset) {
      Collection.defaultParams = value;
    } else {
      Collection.defaultParams = {...Collection.defaultParams, ...value};
    }
  }

  async access(mode: any): Promise<boolean|undefined>{
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  get $ref() {
    return this.params.value.ref;
  }

  get $readonly() {
    if (this.params.value.readonly === true || this.params.value.readonly === false) return this.params.value.readonly;
    if (this.$parent && (this.$parent as any).$readonly) return (this.$parent as any).$readonly;
    return this.params.value.readonly;
  }

  setParams(params: CollectionParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): CollectionParams {
    return this.params.value;
  }

  props() {
    return []
  }

  render(props: any, context: any): VNode|VNode[]|undefined {
    const h = this.$h;
    
    if (this.params.value.invisible) {
      return;
    }

    if (this.currentObject?.value === 'trigger') {
      return this.buildTrigger(props, context);
    }

    if (this.currentObject?.value === 'report') {
      return [
        this.buildSelectionContext(),
        this.buildReport(props, context)
      ].filter((item) => item !== undefined) as VNode[];
    }

    if (this.currentObject?.value === 'selector') {
      return this.buildSelector(props, context);
    }

    return undefined;
  }

  private buildSelectionContext(): VNode|undefined {
    const h = this.$h;
    const text = this.selectionContextText();
    if (!text) {
      return undefined;
    }

    return h(
      VAlert,
      {
        color: 'info',
        variant: 'tonal',
        density: 'comfortable',
        border: 'start',
        closable: false,
        style: {
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 3000,
          maxWidth: '360px',
        }
      },
      () => text
    );
  }

  private selectionContextText(): string | undefined {
    const total = this.selectedItems.length;
    if (total <= 0) {
      return undefined;
    }

    if (this.currentObject?.value === 'report' && this.params.value.multiple) {
      return `Editing item ${this.currentIndex + 1} of ${total}`;
    }

    return undefined;
  }

  private buildReport(props: any, context: any): VNode|undefined {
    const h = this.$h;
    if (this.currentReport) {
      return h(
        this.currentReport.component
      )
    }
    return undefined;
  }
  
  private buildTrigger(props: any, context: any): VNode|undefined {
    const h = this.$h;
    if (this.currentTrigger) {
      return h(
        this.currentTrigger.component
      )
    }
    return undefined;
  }
  
  private buildSelector(props: any, context: any): VNode|undefined {
    const h = this.$h;
    if (this.currentSelector) {
      return h(
        this.currentSelector.component
      )
    }
    return undefined;
  }

  async selector(): Promise<Selector|undefined>  {
    return undefined;
  }

  async trigger(): Promise<Trigger|undefined>  {
    return undefined;
  }

  async report(): Promise<Report|undefined>  {
    return undefined;
  }

  async show() {
    if (this.currentObject.value) return;
    
    if (this.params.value.mode === 'create') {
      await this.showReport();
    } else {
      if (!await this.showTrigger()) {
        await this.showSelector();
      }
    }
  }

  async showSelector() {
    if (!this.currentSelector) {
      this.currentSelector = this.options.selector ? await this.options.selector(this) : await this.selector();
      if (this.currentSelector) {
        this.currentSelector.$params.mode = this.params.value.mode;
        
        this.currentSelector.on('selected', (item: any) => this.itemSelected(item));
        this.currentSelector.on('cancel', () => this.onSelectorCancelled());

        if (this.params.value.objectType && !this.currentSelector.$params.objectType) this.currentSelector.$params.objectType = this.params.value.objectType;
        this.currentObject.value = 'selector';
        this.currentSelector.$params.returnObject = true;
        this.currentSelector.$params.multiple = this.params.value.multiple;
        this.currentSelector.show();
      }
    } else {
      this.currentSelector.$params.mode = this.params.value.mode;
      if (this.params.value.objectType && !this.currentSelector.$params.objectType) this.currentSelector.$params.objectType = this.params.value.objectType;
      this.currentSelector.$params.returnObject = true;
      this.currentSelector.$params.multiple = this.params.value.multiple;
      this.currentObject.value = 'selector';
      this.currentSelector.show();
    }
  }

  async showTrigger() {
    if (!this.currentTrigger) {
      this.currentTrigger = this.options.trigger ? await this.options.trigger(this) : await this.trigger();
      if (this.currentTrigger) {
        this.currentTrigger.$params.mode = this.params.value.mode;
        this.currentTrigger.on('selected', (item: any) => this.triggerSelected(item));
        this.currentTrigger.on('cancel', () => this.onTriggerCancelled());

        if (this.params.value.objectType && !this.currentTrigger.$params.objectType) this.currentTrigger.$params.objectType = this.params.value.objectType;
        this.currentTrigger.$params.multiple = this.params.value.multiple;
        this.currentObject.value = 'trigger';
        this.currentTrigger.show();
        return true;
      }
    } else {
      this.currentTrigger.$params.mode = this.params.value.mode;
      if (this.params.value.objectType && !this.currentTrigger.$params.objectType) this.currentTrigger.$params.objectType = this.params.value.objectType;
      this.currentTrigger.$params.multiple = this.params.value.multiple;
      this.currentObject.value = 'trigger';
      this.currentTrigger.show();
      return true;
    }
  }

  async showReport(item?: any) {
    if (this.currentReport) {
      this.currentReport.removeEventListeners();
    }

    const rep = this.options.report ? await this.options.report(this) : await this.report();

    if (rep) {
      this.currentReport = rep;
      this.applySelectionContextToReport(this.currentReport);
      if (!this.currentReport.$params.mode && this.params.value.mode) this.currentReport.$params.mode = this.params.value.mode;

      this.currentReport.$params.selected = item;

      if (!this.params.value.selectionOnly && item) {
        this.currentReport.$params.objectId = item[this.params.value.idField || "_id"];
      }

      if (this.params.value.mode === "create") this.currentReport.$params.multiple = true;

      if (this.params.value.objectType && !this.currentReport.$params.objectType) this.currentReport.$params.objectType = this.params.value.objectType;

      if (this.params.value.mode !== 'create' && this.params.value.multiple && this.currentIndex + 1 < this.selectedItems.length) {
        this.currentReport.$params.editAfterSave = true;
      } else if (this.params.value.mode !== 'create' && this.params.value.multiple && this.selectedItems.length > 1) {
        this.currentReport.$params.editAfterSave = false;
      }

      this.currentReport.on('saved', () => this.reportSaved(item));
      this.currentReport.on('cancel', () => this.reportCancelled());
      this.currentReport.on('finished', () => this.reportFinished());

      await this.currentReport.loadObject();
      this.currentObject.value = 'report';
      this.currentReport.show();
    }
  }

  private applySelectionContextToReport(report: Report) {
    const total = this.selectedItems.length;
    const baseTitle = report.$params.title || 'Collection Editor';

    if (this.params.value.multiple && total > 1) {
      report.$params.title = `${baseTitle} (${this.currentIndex + 1} of ${total})`;
    }
  }

  private async triggerSelected(item: any) {
    // for trigger items
    this.prevState = 'trigger';
    if (Array.isArray(item) && this.params.value.multiple) {
      this.selectedItems = item;
      this.currentIndex = 0;
      await this.showReportWithIndex(this.currentIndex);
    } else {
      this.currentIndex = 0;
      this.selectedItems = [item];
      await this.showReportWithIndex(this.currentIndex);
    }
    this.currentTrigger?.hide();

  }

  private async showReportWithIndex(index: number) {
    if (index < this.selectedItems.length) {
      this.currentReport = undefined;
      this.currentObject.value = undefined;
      await this.showReport(this.selectedItems[index]);

      if (this.currentTrigger) {
        this.currentTrigger.removeEventListeners();
        this.currentTrigger = undefined;
      }
    }
  }

  private async itemSelected(item: any) {
    this.prevState = 'selector';
    
    if (Array.isArray(item) && this.params.value.multiple) {
      this.selectedItems = item;
      this.currentIndex = 0;
      await this.showReportWithIndex(this.currentIndex);
    } else {
      this.currentIndex = 0;
      this.selectedItems = [item];
      await this.showReportWithIndex(this.currentIndex);
    }

    this.currentSelector?.hide();
  }

  private async reportSaved(item: any) {
    if (this.params.value.mode !== 'create' && this.params.value.multiple && this.currentIndex + 1 < this.selectedItems.length) {
      this.currentIndex += 1;
      this.showReportWithIndex(this.currentIndex);
    } else if (this.params.value.mode !== 'create') {
      this.reportCancelled();
    }
  }

  private async reportCancelled() {
    
    if (this.prevState === 'trigger') {
      return this.showTrigger();
    }

    if (this.prevState === 'selector') {
      return this.showSelector();
    }

    this.handleOn('cancel', this);
  }

  private async reportFinished() {
    if (this.params.value.mode === 'create') {
      this.selectedItems = [];
      this.currentIndex = 0;
      this.handleOn('cancel', this);
    }
  }

  private async onSelectorCancelled() {
    this.selectedItems = [];
    this.currentIndex = 0;
    this.handleOn('cancel', this);
  }

  private async onTriggerCancelled() {
    this.selectedItems = [];
    this.currentIndex = 0;
    this.handleOn('cancel', this);
  }

  async forceCancel() {
    await this.hide();
    if (this.currentObject.value === 'report') {
      this.reportCancelled();
    } else if (this.currentObject.value === 'selector') {
      this.onSelectorCancelled();
    } else if (this.currentObject.value === 'trigger') {
      this.onTriggerCancelled();
    } else {
      this.handleOn('cancel');
    }
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

export const $COL = (params?: CollectionParams, options?: CollectionOptions) => new Collection(params || {}, options || {});
