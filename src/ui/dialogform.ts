import { VNode, Ref } from "vue";
import { UIBase } from "./base";
import { VBtn, VCard, VCardActions, VCardText, VDialog, VSpacer } from 'vuetify/components';
import { Form } from "./form";
import { Master } from "../master";
import { OnHandler } from "./lib";

export interface DialogParams {
  ref?: string;
  objectType?: any;
  objectId?: any;
  invisible?: boolean;
  persistent?: boolean;
  mode?: 'create'|'edit'|'display';
  closeOnSave?: boolean;
  fullscreen?: boolean|undefined;
}

export interface DialogFormOptions {
  master?: Master;
  form?: (props: any, context: any) => Promise<Form|undefined>|Form|undefined;
  saved?: () => Promise<void>|void;
  cancel?: () => Promise<void>|void;
  access?: (dialog: DialogForm, mode?: any) => Promise<boolean>|boolean;
  setup?: (dialog: DialogForm) => void;
  on?: (dialog: DialogForm) => OnHandler;
}

export class DialogForm extends UIBase {
  private params: Ref<DialogParams>;
  private hasAccess: Ref<boolean>;
  private options: DialogFormOptions;
  private dialog: Ref<boolean>;
  private loaded = false;
  private loading: Ref<boolean>;
  private currentForm: Form|undefined;
  private static defaultParams: DialogParams = {};

  constructor(params?: DialogParams, options?: DialogFormOptions) {
    super();
    this.params = this.$makeRef({...DialogForm.defaultParams, ...(params || {})});
    this.options = options || {};
    this.hasAccess = this.$makeRef(true);
    this.dialog = this.$makeRef(false);
    this.currentForm = undefined;
    this.loading = this.$makeRef(false);
    if (options?.master) {
      this.setMaster(options?.master);
    } else {
      this.setMaster(new Master({type: this.params.value.objectType, id: this.params.value.objectId}));
    }
  }

  static setDefault(value: DialogParams, reset?: boolean): void {
    if (reset) {
      DialogForm.defaultParams = value;
    } else {
      DialogForm.defaultParams = {...DialogForm.defaultParams, ...value};
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: DialogParams) {
    this.params.value = {...this.params.value, ...params};
  }

  get $params(): DialogParams {
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

  async saved() {}

  async cancel() {}

  async access(mode?: any): Promise<boolean> {
    return this.options.access ? await this.options.access(this, mode) : true;
  }

  async query(search: string, mode?: 'create'|'edit'|'display'): Promise<any> {}

  props() {
    return []
  }

  render(props: any, context: any): VNode|undefined {
    const h = this.$h;

    if(!this.loaded) {
      this.loaded = true;
      this.initialize(props, context);
    }
    
    if (this.params.value.invisible) {
      return;
    }

    return h(
      VDialog,
      {
        modelValue: this.dialog.value,
        persistent: this.params.value.persistent !== false,
        width: "auto",
        fullscreen: this.params.value.fullscreen,
      },
      () => h(
        'div',
        {
          onKeydown: (ev: KeyboardEvent) => this.onDialogKeydown(ev)
        },
        () => this.buildBody(props, context)
      )
    );
  }

  private buildBody(props: any, context: any) {
    const h = this.$h;

    if (!this.hasAccess.value) {
      return h(
        VCard,
        {
          width: 400,
          class: ['mx-auto']
        },
        () => [
          h(
            VCardActions,
            {},
            () => [
              h(VSpacer, {}),
              h(
                VBtn,
                {
                  color: 'primary',
                  onClick: () => this.onCancelClicked()
                },
                () => 'Cancel'
              )
            ]
          ),
          h(
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
          ),
          h(
            VCardActions,
            {},
            () => [
              h(VSpacer, {}),
              h(
                VBtn,
                {
                  color: 'primary',
                  onClick: () => this.onCancelClicked()
                },
                () => 'Cancel'
              )
            ]
          ),
        ]
      )
    }

    if (!this.loading.value && this.currentForm) {
      return h(this.currentForm.component)
    }

    return h(
      VCard,
      {
        width: 400,
        class: ['mx-auto']
      },
      () => [
        h(
          VCardActions,
          {},
          () => [
            h(VSpacer, {}),
            h(
              VBtn,
              {
                color: 'primary',
                onClick: () => this.onCancelClicked()
              },
              () => 'Cancel'
            )
          ]
        ),
        h(
          VCardText,
          {
            class: 'text-center'
          },
          () => h(
            'span',
            {
              class: 'title'
            },
            'Loading....'
          )
        ),
        h(
          VCardActions,
          {},
          () => [
            h(VSpacer, {}),
            h(
              VBtn,
              {
                color: 'primary',
                onClick: () => this.onCancelClicked()
              },
              () => 'Cancel'
            )
          ]
        ),
      ]
    )

  }

  async show() {
    this.dialog.value = true;
  }

  async hide() {
    this.dialog.value = false;
  }

  async form(props: any, context: any): Promise<Form|undefined> {
    if (this.options.form) return await this.options.form(props, context);
  }

  private async initialize(props: any, context: any) {
    if (this.currentForm) {
      this.currentForm.clearListeners()
    }

    this.loading.value = true;
    await this.runAccess();

    if (this.hasAccess.value) {
      this.currentForm = await this.form(props, context);
      if (this.currentForm) {
        this.currentForm.setParent(this)
        this.currentForm.$params.mode = this.params.value.mode;
        this.currentForm.on('cancel', () => this.onCancelClicked())
        this.currentForm.on('saved', () => this.onSaved())
      }
    }

    this.loading.value = false;
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

  private onDialogKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && this.dialog.value) {
      ev.preventDefault();
      this.onCancelClicked();
    }
  }

  private async onSaved(){
    this.handleOn('before-save', this);
    
    if (this.options.saved) {
      await this.options.saved();
    } else {
      await this.saved();
    }

    this.handleOn('saved', this);

    if (this.params.value.closeOnSave) this.onCancelClicked();
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

export const $DF = (params?: DialogParams, options?: DialogFormOptions) => new DialogForm(params || {}, options || {});
