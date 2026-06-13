import { Ref, defineComponent, h, onMounted, onUnmounted, ref, watch } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VIcon, VLayout, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';
import { Master } from "../master";
import type { DialogForm, DialogFormOptions, DialogParams } from "./dialogform";
import type { Field, FieldOptions, FieldParams, FieldType } from "./field";
import type { FormOptions, FormParams } from "./form";
import type { Part } from "./part";

export interface PromptParams {
  title?: string;
  text?: string;
  type?: FieldType;
  confirmText?: string;
  cancelText?: string;
  fieldParams?: FieldParams;
  formParams?: FormParams;
  dialogParams?: DialogParams;
}

export interface PromptOptions {
  master?: Master;
  fieldOptions?: Omit<FieldOptions, 'master'>;
  children?: () => Array<Part|Field>;
  formOptions?: Omit<FormOptions, 'master'|'children'>;
  dialogOptions?: Omit<DialogFormOptions, 'master'|'form'>;
}

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
  infoWindowWidth?: number|undefined;
  infoWindowHeight?: number|undefined;
}

export interface ImagePreviewOptions {
  title?: string;
  fullscreen?: boolean;
}

export class Dialogs {

  private static confirmDialog: Ref<boolean> = ref(false);
  private static infoDialog: Ref<boolean> = ref(false);
  private static successDialog: Ref<boolean> = ref(false);
  private static errorDialog: Ref<boolean> = ref(false);
  private static warningDialog: Ref<boolean> = ref(false);
  private static progressDialog: Ref<boolean> = ref(false);
  private static imagePreviewDialog: Ref<boolean> = ref(false);

  private static confirmTitle: Ref<string> = ref('');
  private static confirmText: Ref<string> = ref('');
  
  private static infoTitle: Ref<string> = ref('');
  private static infoText: Ref<string> = ref('');
  private static infoWidth: Ref<number|undefined> = ref(0)
  private static infoHeight: Ref<number|undefined> = ref(0)

  private static successText: Ref<string> = ref('');
  private static errorText: Ref<string> = ref('');
  private static warningText: Ref<string> = ref('');

  private static progressValue: Ref<number|undefined> = ref(0);
  private static progressText: Ref<string> = ref('');
  private static progressIndeterminate: Ref<boolean> = ref(true);
  private static imagePreviewSrc: Ref<string> = ref('');
  private static imagePreviewTitle: Ref<string> = ref('');
  private static imagePreviewFullscreen: Ref<boolean> = ref(true);

  private static confirmYes: any = null;
  private static confirmNo: any = null;
  private static infoClose: any = null;
  private static confirmKeydownHandler?: (ev: KeyboardEvent) => void;
  private static rootMounted = false;
  private static promptForm: Ref<DialogForm|undefined> = ref();
  private static promptVersion: Ref<number> = ref(0);
  private static promptResolver: ((value: any) => void)|undefined;

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
        const InfoDialog = Dialogs.infoComponent();
        const PromptDialog = Dialogs.promptComponent();
        const ImagePreviewDialog = Dialogs.imagePreviewComponent();

        return () => [
          h(ConfirmDialog),
          h(InfoDialog),
          h(PromptDialog),
          h(ImagePreviewDialog),
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

  static infoComponent() {
    return defineComponent({
      props: [],
      setup: (props, context) => {
        return () => h(
          VDialog,
          {
            modelValue: Dialogs.infoDialog.value,
            persistent: true,
            width: Dialogs.infoWidth.value || Dialogs.options.value.infoWindowWidth || 400,
            maxHeight: Dialogs.infoHeight.value || Dialogs.options.value.infoWindowHeight || 300
          },
          () => h(
            VCard,
            {},
            () => [
              h(
                VCardTitle,
                {},
                () => Dialogs.infoTitle.value
              ),
              h(
                VCardText,
                {},
                () => Dialogs.infoText.value
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
                      color: 'success',
                      onClick: () => {
                        if (Dialogs.infoClose) Dialogs.infoClose();
                      }
                    },
                    () => 'Close'
                  )
                ]
              )
            ]
          )
        )
      },
    });
  }

  static promptComponent() {
    return defineComponent({
      props: [],
      setup: () => {
        return () => {
          const form = Dialogs.promptForm.value;
          if (!form) {
            return undefined;
          }

          return h(form.component, {
            key: Dialogs.promptVersion.value,
          });
        };
      },
    });
  }

  static imagePreviewComponent() {
    return defineComponent({
      name: 'VuetifyExtendedImagePreview',
      setup: () => {
        const scale = ref(1);
        const translateX = ref(0);
        const translateY = ref(0);
        const dragging = ref(false);
        const lastPointerX = ref(0);
        const lastPointerY = ref(0);

        const clampScale = (value: number) => Math.min(6, Math.max(0.5, value));
        const resetView = () => {
          scale.value = 1;
          translateX.value = 0;
          translateY.value = 0;
          dragging.value = false;
        };

        const zoomTo = (nextScale: number) => {
          scale.value = clampScale(nextScale);
          if (scale.value <= 1) {
            translateX.value = 0;
            translateY.value = 0;
          }
        };

        const zoomBy = (delta: number) => {
          zoomTo(scale.value + delta);
        };

        const close = () => {
          Dialogs.imagePreviewDialog.value = false;
        };

        const onPointerDown = (ev: PointerEvent) => {
          if (scale.value <= 1) {
            return;
          }

          dragging.value = true;
          lastPointerX.value = ev.clientX;
          lastPointerY.value = ev.clientY;
        };

        const onPointerMove = (ev: PointerEvent) => {
          if (!dragging.value || scale.value <= 1) {
            return;
          }

          translateX.value += ev.clientX - lastPointerX.value;
          translateY.value += ev.clientY - lastPointerY.value;
          lastPointerX.value = ev.clientX;
          lastPointerY.value = ev.clientY;
        };

        const onPointerUp = () => {
          dragging.value = false;
        };

        const onWheel = (ev: WheelEvent) => {
          if (!Dialogs.imagePreviewDialog.value) {
            return;
          }

          ev.preventDefault();
          zoomBy(ev.deltaY < 0 ? 0.2 : -0.2);
        };

        const onKeydown = (ev: KeyboardEvent) => {
          if (!Dialogs.imagePreviewDialog.value) {
            return;
          }

          if (ev.key === 'Escape') {
            ev.preventDefault();
            close();
            return;
          }

          if (ev.key === '+' || ev.key === '=') {
            ev.preventDefault();
            zoomBy(0.2);
            return;
          }

          if (ev.key === '-') {
            ev.preventDefault();
            zoomBy(-0.2);
            return;
          }

          if (ev.key === '0') {
            ev.preventDefault();
            resetView();
          }
        };

        watch(
          () => [Dialogs.imagePreviewDialog.value, Dialogs.imagePreviewSrc.value] as const,
          ([open]) => {
            if (open) {
              resetView();
            }
          },
          { immediate: true },
        );

        onMounted(() => {
          window.addEventListener('pointermove', onPointerMove, true);
          window.addEventListener('pointerup', onPointerUp, true);
          window.addEventListener('wheel', onWheel, { passive: false, capture: true });
          window.addEventListener('keydown', onKeydown, true);
        });

        onUnmounted(() => {
          window.removeEventListener('pointermove', onPointerMove, true);
          window.removeEventListener('pointerup', onPointerUp, true);
          window.removeEventListener('wheel', onWheel, true);
          window.removeEventListener('keydown', onKeydown, true);
        });

        return () => h(
          VDialog,
          {
            modelValue: Dialogs.imagePreviewDialog.value,
            fullscreen: Dialogs.imagePreviewFullscreen.value,
            width: Dialogs.imagePreviewFullscreen.value ? undefined : 1100,
            maxWidth: Dialogs.imagePreviewFullscreen.value ? undefined : '92vw',
            persistent: false,
            scrim: 'rgba(7, 10, 17, 0.88)',
            transition: 'dialog-bottom-transition',
            "onUpdate:modelValue": (v: boolean) => {
              Dialogs.imagePreviewDialog.value = v;
              if (!v) {
                resetView();
              }
            },
          },
          () => h(
            VCard,
            {
              style: {
                background: '#0f172a',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                height: Dialogs.imagePreviewFullscreen.value ? '100vh' : '88vh',
                overflow: 'hidden',
              },
            },
            () => [
              h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(15, 23, 42, 0.94)',
                  },
                },
                [
                  h(
                    'div',
                    {
                      style: {
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: '1 1 auto',
                      },
                    },
                    Dialogs.imagePreviewTitle.value || 'Image Preview',
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      color: 'white',
                      title: 'Zoom out',
                      onClick: () => zoomBy(-0.2),
                    },
                    () => h(VIcon, {}, () => 'mdi-magnify-minus-outline'),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      color: 'white',
                      title: 'Reset zoom',
                      onClick: () => resetView(),
                    },
                    () => h(VIcon, {}, () => 'mdi-fit-to-screen-outline'),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      color: 'white',
                      title: 'Zoom in',
                      onClick: () => zoomBy(0.2),
                    },
                    () => h(VIcon, {}, () => 'mdi-magnify-plus-outline'),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      color: 'white',
                      title: 'Close preview',
                      onClick: () => close(),
                    },
                    () => h(VIcon, {}, () => 'mdi-close'),
                  ),
                ],
              ),
              h(
                'div',
                {
                  style: {
                    position: 'relative',
                    flex: '1 1 auto',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle at top, rgba(30,41,59,0.75) 0%, rgba(2,6,23,0.96) 100%)',
                    cursor: scale.value > 1 ? (dragging.value ? 'grabbing' : 'grab') : 'default',
                    userSelect: 'none',
                    touchAction: 'none',
                  },
                  onDblclick: () => {
                    if (scale.value > 1) {
                      resetView();
                    } else {
                      zoomTo(2);
                    }
                  },
                  onPointerdown: onPointerDown,
                },
                [
                  h('img', {
                    src: Dialogs.imagePreviewSrc.value,
                    alt: Dialogs.imagePreviewTitle.value || 'Image preview',
                    draggable: false,
                    style: {
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
                      transformOrigin: 'center center',
                      transition: dragging.value ? 'none' : 'transform 0.16s ease',
                      boxShadow: scale.value > 1 ? '0 18px 48px rgba(0,0,0,0.38)' : '0 12px 30px rgba(0,0,0,0.26)',
                    },
                  }),
                  h(
                    'div',
                    {
                      style: {
                        position: 'absolute',
                        right: '16px',
                        bottom: '16px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '0.82rem',
                        background: 'rgba(15,23,42,0.74)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      },
                    },
                    `${Math.round(scale.value * 100)}%`,
                  ),
                ],
              ),
            ],
          ),
        );
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

  static async $info(text: string, title?: string, options?: {width?: number, height?: number}): Promise<void> {
    return new Promise((resolve: any) => {
      Dialogs.infoClose = () => {
        Dialogs.removeConfirmKeydownHandler();
        Dialogs.infoDialog.value = false;
        resolve();
      }
      Dialogs.installConfirmKeydownHandler();
      Dialogs.infoText.value = text;
      Dialogs.infoTitle.value = title || 'Info';
      Dialogs.infoWidth.value = options?.width || Dialogs.options.value.infoWindowWidth || 400
      Dialogs.infoHeight.value = options?.height || Dialogs.options.value.infoWindowHeight || 300
      Dialogs.infoDialog.value = true;
    })
  }

  static hasBlockingDialog(): boolean {
    return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value || Dialogs.imagePreviewDialog.value;
  }

  static async $imagePreview(src: string, options?: ImagePreviewOptions): Promise<void> {
    Dialogs.imagePreviewSrc.value = src;
    Dialogs.imagePreviewTitle.value = options?.title || '';
    Dialogs.imagePreviewFullscreen.value = options?.fullscreen !== false;
    Dialogs.imagePreviewDialog.value = true;
  }

  static async $prompt(params?: PromptParams, options?: PromptOptions): Promise<any|undefined> {
    const promptParams = params || {};
    const promptOptions = options || {};

    if (Dialogs.promptResolver) {
      await Dialogs.closePrompt(undefined);
    }

    const [{ DialogForm }, { Form }, { Field }] = await Promise.all([
      import('./dialogform'),
      import('./form'),
      import('./field'),
    ]);

    const workingMaster = Dialogs.createPromptMaster(promptOptions.master);
    const hasCustomChildren = typeof promptOptions.children === 'function';
    const resolvedFieldParams = promptParams.fieldParams || {};
    const storageKey = resolvedFieldParams.storage || '__promptValue';
    const dialogParams = promptParams.dialogParams || {};
    const formParams = promptParams.formParams || {};
    const formOptions = promptOptions.formOptions || {};
    const dialogOptions = promptOptions.dialogOptions || {};

    const field = !hasCustomChildren ? new Field(
      {
        type: resolvedFieldParams.type || promptParams.type || 'text',
        label: resolvedFieldParams.label || 'Value',
        storage: storageKey,
        autofocus: resolvedFieldParams.autofocus ?? true,
        cols: resolvedFieldParams.cols ?? 12,
        ...resolvedFieldParams,
      },
      promptOptions.fieldOptions,
    ) : undefined;

    const form = new Form(
      {
        ...formParams,
        auto: true,
        sub: true,
        hideMode: formParams.hideMode ?? true,
        mode: dialogParams.mode || formParams.mode || 'create',
        title: promptParams.title ?? formParams.title ?? 'Prompt',
        subtitle: promptParams.text ?? formParams.subtitle,
        width: formParams.width ?? (hasCustomChildren ? 760 : 520),
        saveButton: {
          ...(formParams.saveButton || {}),
          text: promptParams.confirmText || formParams.saveButton?.text || 'Confirm',
        },
        cancelButton: {
          ...(formParams.cancelButton || {}),
          text: promptParams.cancelText || formParams.cancelButton?.text || 'Cancel',
        },
      },
      {
        ...formOptions,
        master: workingMaster,
        children: (() => hasCustomChildren ? (promptOptions.children?.() || []) : (field ? [field] : [])) as any,
      },
    );

    let dialog!: DialogForm;

    return new Promise((resolve) => {
      Dialogs.promptResolver = resolve;

      dialog = new DialogForm(
        {
          persistent: dialogParams.persistent ?? true,
          mode: dialogParams.mode || 'create',
          fullscreen: dialogParams.fullscreen,
          invisible: dialogParams.invisible,
          objectType: dialogParams.objectType,
          objectId: dialogParams.objectId,
          ref: dialogParams.ref,
          closeOnSave: false,
        },
        {
          ...dialogOptions,
          master: workingMaster,
          form: async () => form,
          saved: async () => {
            if (dialogOptions.saved) {
              await dialogOptions.saved();
            }

            const result = hasCustomChildren ? workingMaster.$data : workingMaster.$get(storageKey);
            await dialog.hide();
            await Dialogs.closePrompt(result);
          },
          cancel: async () => {
            if (dialogOptions.cancel) {
              await dialogOptions.cancel();
            }

            await dialog.hide();
            await Dialogs.closePrompt(undefined);
          },
        },
      );

      Dialogs.promptForm.value = dialog;
      Dialogs.promptVersion.value += 1;
      dialog.show();
    });
  }

  private static installConfirmKeydownHandler() {
    if (typeof window === 'undefined' || Dialogs.confirmKeydownHandler) {
      return;
    }

    Dialogs.confirmKeydownHandler = (ev: KeyboardEvent) => {
      if (!Dialogs.confirmDialog.value && !Dialogs.infoDialog.value) {
        return;
      }

      const key = ev.key.toLowerCase();

      if (ev.key === 'Escape' || key === 'n') {
        ev.preventDefault();
        ev.stopPropagation();
        if (Dialogs.confirmNo) {
          Dialogs.confirmNo();
        }
        if (Dialogs.infoClose) {
          Dialogs.infoClose();
        }
        return;
      }

      if (ev.key === 'Enter' || ev.key === 'Return' || key === 'y') {
        ev.preventDefault();
        ev.stopPropagation();
        if (Dialogs.confirmYes) {
          Dialogs.confirmYes();
        }
        if (Dialogs.infoClose) {
          Dialogs.infoClose();
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

  private static async closePrompt(value: any) {
    const dialog = Dialogs.promptForm.value;
    const resolve = Dialogs.promptResolver;

    Dialogs.promptForm.value = undefined;
    Dialogs.promptVersion.value += 1;
    Dialogs.promptResolver = undefined;

    if (dialog) {
      dialog.removeEventListeners();
      dialog.clearListeners();
    }

    if (resolve) {
      resolve(value);
    }
  }

  private static createPromptMaster(source?: Master) {
    const master = new Master({
      type: source?.$type,
      id: source?.$id,
      idField: source?.$idField,
      parent: source?.$parent,
    });

    if (source) {
      master.$data = Dialogs.clonePromptData(source.$data);
    }

    return master;
  }

  private static clonePromptData<T>(value: T): T {
    if (typeof globalThis.structuredClone === 'function') {
      return globalThis.structuredClone(value);
    }

    try {
      return JSON.parse(JSON.stringify(value));
    } catch (_error) {
      return value;
    }
  }

}
