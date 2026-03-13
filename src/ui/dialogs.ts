import { Ref, defineComponent, h, onMounted, onUnmounted, ref } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VLayout, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';

export interface DialogOptions {
  confirmColor?: string|undefined;
  successColor?: string|undefined;
  errorColor?: string|undefined;
  warningColor?: string|undefined;
  progressColor?: string|undefined;
  successTimeout?: number|undefined;
  errorTimeout?: number|undefined;
  warningTimeout?: number|undefined;
  progressSize?: number|undefined;
  progressWidth?: number|undefined;
}

export class Dialogs {

  private static confirmDialog: Ref<boolean> = ref(false);
  private static successDialog: Ref<boolean> = ref(false);
  private static errorDialog: Ref<boolean> = ref(false);
  private static warningDialog: Ref<boolean> = ref(false);
  private static progressDialog: Ref<boolean> = ref(false);

  private static confirmTitle: Ref<string> = ref('');
  private static confirmText: Ref<string> = ref('');
  private static successText: Ref<string> = ref('');
  private static errorText: Ref<string> = ref('');
  private static warningText: Ref<string> = ref('');

  private static progressValue: Ref<number|undefined> = ref(0);
  private static progressText: Ref<string> = ref('');
  private static progressIndeterminate: Ref<boolean> = ref(true);

  private static confirmYes: any = null;
  private static confirmNo: any = null;
  private static confirmKeydownHandler?: (ev: KeyboardEvent) => void;
  private static rootMounted = false;

  private static options: Ref<DialogOptions> = ref({});

  static setOptions(options: DialogOptions) {
    Dialogs.options.value = {...Dialogs.options.value , ...options};
  }

  static get rootIsMounted(): boolean {
    return Dialogs.rootMounted;
  }

  static rootComponent() {
    return defineComponent({
      name: 'VuetifyExtendedDialogs',
      setup: () => {
        onMounted(() => {
          Dialogs.rootMounted = true;
        });

        onUnmounted(() => {
          Dialogs.rootMounted = false;
        });

        const ConfirmDialog = Dialogs.confirmComponent();
        const SuccessSnackbar = Dialogs.successComponent();
        const ErrorSnackbar = Dialogs.errorComponent();
        const WarningSnackbar = Dialogs.warningComponent();
        const ProgressOverlay = Dialogs.progressComponent();

        return () => [
          h(ConfirmDialog),
          h(SuccessSnackbar),
          h(ErrorSnackbar),
          h(WarningSnackbar),
          h(ProgressOverlay),
        ];
      },
    });
  }

  static confirmComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VDialog,
          {
            modelValue: Dialogs.confirmDialog.value,
            persistent: true,
            maxWidth: 300,
            maxHeight: 200
          },
          () => h(
            VCard,
            {},
            () => [
              h(
                VCardTitle,
                {},
                () => Dialogs.confirmTitle.value
              ),
              h(
                VCardText,
                {},
                () => Dialogs.confirmText.value
              ),
              h(
                VCardActions,
                {},
                () => [
                  h(
                    VSpacer
                  ),
                  h(
                    VBtn,
                    {
                      color: 'error',
                      onClick: () => {
                        if (Dialogs.confirmNo) Dialogs.confirmNo();
                      }
                    },
                    () => 'No'
                  ),
                  h(
                    VBtn,
                    {
                      color: 'success',
                      onClick: () => {
                        if (Dialogs.confirmYes) Dialogs.confirmYes();
                      }
                    },
                    () => 'Yes'
                  )
                ]
              )
            ]
          )
        )
      },
    });
  }

  static successComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VSnackbar,
          {
            modelValue: Dialogs.successDialog.value,
            timeout: Dialogs.options.value.successTimeout || 2000,
            elevation: 24,
            color: Dialogs.options.value.successColor || 'success',
            location: 'top center',
            class: ['pa-2'],
            "onUpdate:modelValue": (v) => {
              Dialogs.successDialog.value = v;
            }
          },
          {
            actions: () => [
              h(
                VBtn,
                {
                  color: Dialogs.options.value.successColor === 'white' ? 'success' : 'white',
                  variant: 'text',
                  onClick: () => {
                    Dialogs.successDialog.value = false;
                  }
                },
                () => 'Close'
              )
            ],
            default: () => Dialogs.successText.value
          }
        );
      },
    });
  }

  static errorComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VSnackbar,
          {
            modelValue: Dialogs.errorDialog.value,
            timeout: Dialogs.options.value.errorTimeout || 5000,
            elevation: 24,
            color: Dialogs.options.value.errorColor || 'error',
            location: 'top center',
            class: ['pa-2'],
            "onUpdate:modelValue": (v) => {
              Dialogs.errorDialog.value = v;
            }
          },
          {
            actions: () => [
              h(
                VBtn,
                {
                  color: Dialogs.options.value.errorColor === 'white' ? 'success' : 'white',
                  variant: 'text',
                  onClick: () => {
                    Dialogs.errorDialog.value = false;
                  }
                },
                () => 'Close'
              )
            ],
            default: () => Dialogs.errorText.value
          }
        );
      },
    });
  }

  static warningComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VSnackbar,
          {
            modelValue: Dialogs.warningDialog.value,
            timeout: Dialogs.options.value.warningTimeout || 5000,
            elevation: 24,
            color: Dialogs.options.value.warningColor || 'warning',
            location: 'top center',
            class: ['pa-2'],
            "onUpdate:modelValue": (v) => {
              Dialogs.warningDialog.value = v;
            }
          },
          {
            actions: () => [
              h(
                VBtn,
                {
                  variant: 'text',
                  onClick: () => {
                    Dialogs.warningDialog.value = false;
                  }
                },
                () => 'Close'
              )
            ],
            default: () => Dialogs.warningText.value
          }
        );
      },
    });
  }

  static progressComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VOverlay,
          {
            modelValue: Dialogs.progressDialog.value,
            persistent: true,
            height: '100%',
            width: '100%'
          },
          () => h(
            VLayout,
            {
              fullHeight: true,
            },
            () => h(
              VRow,
              {
                alignContent: 'center',
              },
              () => h(
                VCol,
                {
                  align: 'center'
                },
                () => [
                  h(
                    VProgressCircular,
                    {
                      indeterminate: Dialogs.progressIndeterminate.value,
                      size: Dialogs.options.value.progressSize || 300,
                      width: Dialogs.options.value.progressWidth || 20,
                      modelValue: Dialogs.progressValue.value,
                      color: Dialogs.options.value.progressColor || 'white',
                      class: ['my-auto', 'mx-auto']
                    },
                    () => [
                      ...(Dialogs.progressValue.value || Dialogs.progressValue.value === 0 ? [
                        `${Number(Dialogs.progressValue.value).toFixed(2)}%`
                      ] : []),
                      h('br'),
                      Dialogs.progressText.value
                    ]
                  )
                ]
              )
            )
          )
        );
      },
    });
  }

  static async $confirm(text: string, title?: string): Promise<boolean> {
    return new Promise((resolve: any) => {
      Dialogs.confirmYes = () => {
        Dialogs.removeConfirmKeydownHandler();
        Dialogs.confirmDialog.value = false;
        resolve(true);
      }
      Dialogs.confirmNo = () => {
        Dialogs.removeConfirmKeydownHandler();
        Dialogs.confirmDialog.value = false;
        resolve(false);
      }
      Dialogs.installConfirmKeydownHandler();
      Dialogs.confirmText.value = text;
      Dialogs.confirmTitle.value = title || 'Confirm';
      Dialogs.confirmDialog.value = true;
    })
  }

  static hasBlockingDialog(): boolean {
    return Dialogs.confirmDialog.value || Dialogs.progressDialog.value;
  }

  private static installConfirmKeydownHandler() {
    if (typeof window === 'undefined' || Dialogs.confirmKeydownHandler) {
      return;
    }

    Dialogs.confirmKeydownHandler = (ev: KeyboardEvent) => {
      if (!Dialogs.confirmDialog.value) {
        return;
      }

      const key = ev.key.toLowerCase();

      if (ev.key === 'Escape' || key === 'n') {
        ev.preventDefault();
        ev.stopPropagation();
        if (Dialogs.confirmNo) {
          Dialogs.confirmNo();
        }
        return;
      }

      if (ev.key === 'Enter' || ev.key === 'Return' || key === 'y') {
        ev.preventDefault();
        ev.stopPropagation();
        if (Dialogs.confirmYes) {
          Dialogs.confirmYes();
        }
      }
    };

    window.addEventListener('keydown', Dialogs.confirmKeydownHandler, true);
  }

  private static removeConfirmKeydownHandler() {
    if (typeof window !== 'undefined' && Dialogs.confirmKeydownHandler) {
      window.removeEventListener('keydown', Dialogs.confirmKeydownHandler, true);
      Dialogs.confirmKeydownHandler = undefined;
    }
  }

  static $error(text: string) {
    Dialogs.errorText.value = text;
    Dialogs.errorDialog.value = true;
  }

  static $success(text: string) {
    Dialogs.successText.value = text;
    Dialogs.successDialog.value = true;
  }

  static $warning(text: string) {
    Dialogs.warningText.value = text;
    Dialogs.warningDialog.value = true;
  }

  static $showProgress({value, text}: any) {
    if (value || value === 0) {
      Dialogs.progressIndeterminate.value = false;
      Dialogs.progressValue.value = value < 0 ? 0 : (value > 100 ? 100 : value);
    } else {
      Dialogs.progressIndeterminate.value = true;
      Dialogs.progressValue.value = undefined;
    }
    Dialogs.progressText.value = text || '';
    Dialogs.progressDialog.value = true;
  }
  
  static $updateProgress({value, text}: any) {
    if (value || value === 0) {
      Dialogs.progressIndeterminate.value = false;
      Dialogs.progressValue.value = value < 0 ? 0 : (value > 100 ? 100 : value);
    }

    if (text || text === '') Dialogs.progressText.value = text || '';
    Dialogs.progressDialog.value = true;
  }

  static $hideProgress() {
    Dialogs.progressDialog.value = false;
  }

}
