import { Ref, defineComponent, h, markRaw, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VIcon, VLayout, VMenu, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';
import { Master } from "../master";
import { Button } from "./button";
import type { DialogForm, DialogFormOptions, DialogParams, DialogSizeParams } from "./dialogform";
import type { Field, FieldOptions, FieldParams, FieldType } from "./field";
import type { FormOptions, FormParams } from "./form";
import type { Part } from "./part";
import { resolveUIText, type UIText } from "./runtime";

export interface PromptParams extends DialogSizeParams {
  title?: UIText;
  text?: UIText;
  type?: FieldType;
  confirmText?: UIText;
  cancelText?: UIText;
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

export interface ConfirmParams extends DialogSizeParams {}

export interface InfoParams extends DialogSizeParams {}

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
  /** @deprecated Use Dialogs.setInfoDefault({ width }). */
  infoWindowWidth?: number|undefined;
  /** @deprecated Use Dialogs.setInfoDefault({ maxHeight }). */
  infoWindowHeight?: number|undefined;
}

export type IframeSkin = 'inherit'|'light'|'dark';

export interface ImagePreviewParams extends DialogSizeParams {
  title?: UIText;
  fullscreen?: boolean;
  skin?: IframeSkin;
  scrim?: string;
  backgroundColor?: string;
  toolbarBackground?: string;
  contentBackground?: string;
  textColor?: string;
  cardStyle?: any;
  toolbarStyle?: any;
  frameStyle?: any;
}

/** @deprecated Use ImagePreviewParams. */
export type ImagePreviewOptions = ImagePreviewParams;

export interface IframeParams extends DialogSizeParams {
  src?: string;
  srcdoc?: string;
  title?: UIText;
  fullscreen?: boolean;
  openUrl?: string;
  downloadUrl?: string;
  prependActions?: boolean;
  skin?: IframeSkin;
  scrim?: string;
  backgroundColor?: string;
  toolbarBackground?: string;
  contentBackground?: string;
  textColor?: string;
  cardStyle?: any;
  toolbarStyle?: any;
  frameStyle?: any;
}

export interface IframeOptions {
  actions?: (params: IframeParams) => Promise<Button[]|undefined>|Button[]|undefined;
}

export interface DocumentPreviewParams extends Omit<IframeParams, 'src'|'srcdoc'|'openUrl'|'downloadUrl'> {}

export type FilePreviewSource = string|Blob|File;

export type UnsupportedFilePreviewBehavior = 'dialog'|'iframe'|'download';

export interface FilePreviewParams extends DocumentPreviewParams {
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
  openUrl?: string;
  downloadUrl?: string;
}

export interface FilePreviewOptions {
  actions?: (params: FilePreviewParams) => Promise<Button[]|undefined>|Button[]|undefined;
  unsupported?: UnsupportedFilePreviewBehavior;
}

interface FilePreviewInfo {
  fileName: string;
  mimeType: string;
  fileSize?: number;
}

export class Dialogs {

  private static confirmDialog: Ref<boolean> = ref(false);
  private static infoDialog: Ref<boolean> = ref(false);
  private static successDialog: Ref<boolean> = ref(false);
  private static errorDialog: Ref<boolean> = ref(false);
  private static warningDialog: Ref<boolean> = ref(false);
  private static progressDialog: Ref<boolean> = ref(false);
  private static imagePreviewDialog: Ref<boolean> = ref(false);
  private static documentPreviewDialog: Ref<boolean> = ref(false);

  private static confirmTitle: Ref<any> = ref('');
  private static confirmText: Ref<any> = ref('');
  private static confirmParams: Ref<ConfirmParams> = ref({});
  
  private static infoTitle: Ref<any> = ref('');
  private static infoText: Ref<any> = ref('');
  private static infoParams: Ref<InfoParams> = ref({});

  private static successText: Ref<any> = ref('');
  private static errorText: Ref<any> = ref('');
  private static warningText: Ref<any> = ref('');

  private static progressValue: Ref<number|undefined> = ref(0);
  private static progressText: Ref<string> = ref('');
  private static progressIndeterminate: Ref<boolean> = ref(true);
  private static imagePreviewSrc: Ref<string> = ref('');
  private static imagePreviewTitle: Ref<UIText | undefined> = ref(undefined);
  private static imagePreviewFullscreen: Ref<boolean> = ref(true);
  private static imagePreviewParams: Ref<ImagePreviewParams> = ref({});
  private static imagePreviewOpenUrl: Ref<string> = ref('');
  private static imagePreviewDownloadUrl: Ref<string> = ref('');
  private static imagePreviewFileName: Ref<string> = ref('');
  private static imagePreviewPrependActions: Ref<boolean> = ref(false);
  private static imagePreviewActions: Ref<Button[]> = ref([]);
  private static documentPreviewSrc: Ref<string> = ref('');
  private static documentPreviewSrcdoc: Ref<string> = ref('');
  private static documentPreviewRenderSrc: Ref<string> = ref('');
  private static documentPreviewOpenUrl: Ref<string> = ref('');
  private static documentPreviewDownloadUrl: Ref<string> = ref('');
  private static documentPreviewFileName: Ref<string> = ref('');
  private static documentPreviewPrependActions: Ref<boolean> = ref(false);
  private static documentPreviewSkin: Ref<IframeSkin> = ref('inherit');
  private static documentPreviewWidth: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewMaxWidth: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewMinWidth: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewHeight: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewMaxHeight: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewMinHeight: Ref<number|string|undefined> = ref(undefined);
  private static documentPreviewScrim: Ref<string> = ref('');
  private static documentPreviewBackgroundColor: Ref<string> = ref('');
  private static documentPreviewToolbarBackground: Ref<string> = ref('');
  private static documentPreviewContentBackground: Ref<string> = ref('');
  private static documentPreviewTextColor: Ref<string> = ref('');
  private static documentPreviewCardStyle: Ref<any> = ref(undefined);
  private static documentPreviewToolbarStyle: Ref<any> = ref(undefined);
  private static documentPreviewFrameStyle: Ref<any> = ref(undefined);
  private static documentPreviewActions: Ref<Button[]> = ref([]);
  private static documentPreviewTitle: Ref<UIText | undefined> = ref(undefined);
  private static documentPreviewFullscreen: Ref<boolean> = ref(true);
  private static documentPreviewFileInfo: Ref<FilePreviewInfo|undefined> = ref(undefined);
  private static documentPreviewObjectUrl?: string;
  private static filePreviewObjectUrl?: string;
  private static filePreviewRequest = 0;

  private static confirmYes: any = null;
  private static confirmNo: any = null;
  private static infoClose: any = null;
  private static confirmKeydownHandler?: (ev: KeyboardEvent) => void;
  private static rootMounted = false;
  private static promptForm = shallowRef<DialogForm|undefined>();
  private static promptVersion: Ref<number> = ref(0);
  private static promptResolver: ((value: any) => void)|undefined;
  private static promptRequest = 0;
  private static promptReturnFocus: HTMLElement|undefined;

  private static options: Ref<DialogOptions> = ref({});
  private static confirmDefaults: ConfirmParams = {};
  private static infoDefaults: InfoParams = {};
  private static promptDefaults: PromptParams = {};
  private static imagePreviewDefaults: ImagePreviewParams = {};
  private static iframeDefaults: IframeParams = {};
  private static documentPreviewDefaults: DocumentPreviewParams = {};
  private static filePreviewDefaults: FilePreviewParams = {};

  static setOptions(options: DialogOptions) {
    Dialogs.options.value = {...Dialogs.options.value , ...options};
  }

  static setConfirmDefault(value: ConfirmParams, reset?: boolean): void {
    Dialogs.confirmDefaults = reset ? {...value} : {...Dialogs.confirmDefaults, ...value};
  }

  static setInfoDefault(value: InfoParams, reset?: boolean): void {
    Dialogs.infoDefaults = reset ? {...value} : {...Dialogs.infoDefaults, ...value};
  }

  static setPromptDefault(value: PromptParams, reset?: boolean): void {
    if (reset) {
      Dialogs.promptDefaults = Dialogs.mergePromptParams({}, value);
      return;
    }

    Dialogs.promptDefaults = Dialogs.mergePromptParams(Dialogs.promptDefaults, value);
  }

  static setImagePreviewDefault(value: ImagePreviewParams, reset?: boolean): void {
    Dialogs.imagePreviewDefaults = reset ? {...value} : {...Dialogs.imagePreviewDefaults, ...value};
  }

  static setIframeDefault(value: IframeParams, reset?: boolean): void {
    Dialogs.iframeDefaults = reset ? {...value} : {...Dialogs.iframeDefaults, ...value};
  }

  static setDocumentPreviewDefault(value: DocumentPreviewParams, reset?: boolean): void {
    Dialogs.documentPreviewDefaults = reset ? {...value} : {...Dialogs.documentPreviewDefaults, ...value};
  }

  static setFilePreviewDefault(value: FilePreviewParams, reset?: boolean): void {
    Dialogs.filePreviewDefaults = reset ? {...value} : {...Dialogs.filePreviewDefaults, ...value};
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
          Dialogs.filePreviewRequest += 1;
          Dialogs.releaseDocumentPreviewObjectUrl();
          Dialogs.releaseFilePreviewObjectUrl();
        });

        const ConfirmDialog = Dialogs.confirmComponent();
        const SuccessSnackbar = Dialogs.successComponent();
        const ErrorSnackbar = Dialogs.errorComponent();
        const WarningSnackbar = Dialogs.warningComponent();
        const ProgressOverlay = Dialogs.progressComponent();
        const InfoDialog = Dialogs.infoComponent();
        const PromptDialog = Dialogs.promptComponent();
        const ImagePreviewDialog = Dialogs.imagePreviewComponent();
        const IframeDialog = Dialogs.iframeComponent();

        return () => [
          h(ConfirmDialog),
          h(InfoDialog),
          h(PromptDialog),
          h(ImagePreviewDialog),
          h(IframeDialog),
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
            width: Dialogs.confirmParams.value.width,
            maxWidth: Dialogs.confirmParams.value.maxWidth ?? (Dialogs.confirmParams.value.width === undefined ? 300 : undefined),
            minWidth: Dialogs.confirmParams.value.minWidth,
            height: Dialogs.confirmParams.value.height,
            maxHeight: Dialogs.confirmParams.value.maxHeight ?? (Dialogs.confirmParams.value.height === undefined ? 200 : undefined),
            minHeight: Dialogs.confirmParams.value.minHeight,
          },
          () => h(
            VCard,
            {
              style: Dialogs.confirmParams.value.height !== undefined ? { height: '100%' } : undefined,
            },
            () => [
              h(
                VCardTitle,
                {},
                () => resolveUIText(Dialogs.confirmTitle.value)
              ),
              h(
                VCardText,
                {},
                () => resolveUIText(Dialogs.confirmText.value)
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
                    () => resolveUIText({ key: 've.common.no', fallback: 'No' })
                  ),
                  h(
                    VBtn,
                    {
                      color: 'success',
                      onClick: () => {
                        if (Dialogs.confirmYes) Dialogs.confirmYes();
                      }
                    },
                    () => resolveUIText({ key: 've.common.yes', fallback: 'Yes' })
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
            width: Dialogs.infoParams.value.width ?? Dialogs.options.value.infoWindowWidth ?? 400,
            maxWidth: Dialogs.infoParams.value.maxWidth,
            minWidth: Dialogs.infoParams.value.minWidth,
            height: Dialogs.infoParams.value.height,
            maxHeight: Dialogs.infoParams.value.maxHeight
              ?? (Dialogs.infoParams.value.height === undefined ? (Dialogs.options.value.infoWindowHeight ?? 300) : undefined),
            minHeight: Dialogs.infoParams.value.minHeight,
          },
          () => h(
            VCard,
            {
              style: Dialogs.infoParams.value.height !== undefined ? { height: '100%' } : undefined,
            },
            () => [
              h(
                VCardTitle,
                {},
                () => resolveUIText(Dialogs.infoTitle.value)
              ),
              h(
                VCardText,
                {},
                () => resolveUIText(Dialogs.infoText.value)
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
                    () => resolveUIText({ key: 've.common.close', fallback: 'Close' })
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
          Dialogs.closeImagePreview();
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
            width: Dialogs.imagePreviewFullscreen.value ? undefined : (Dialogs.imagePreviewParams.value.width ?? 1100),
            maxWidth: Dialogs.imagePreviewFullscreen.value ? undefined : (Dialogs.imagePreviewParams.value.maxWidth ?? '92vw'),
            minWidth: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.minWidth,
            height: Dialogs.imagePreviewFullscreen.value ? undefined : (Dialogs.imagePreviewParams.value.height ?? '88vh'),
            maxHeight: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.maxHeight,
            minHeight: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.minHeight,
            persistent: false,
            ...(Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value).scrim
              ? { scrim: Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value).scrim }
              : {}),
            transition: 'dialog-bottom-transition',
            "onUpdate:modelValue": (v: boolean) => {
              if (v) {
                Dialogs.imagePreviewDialog.value = true;
              } else {
                Dialogs.closeImagePreview();
              }
              if (!v) {
                resetView();
              }
            },
          },
          () => {
            const theme = Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value);
            const builtInActions = Dialogs.buildPreviewActions(
              Dialogs.imagePreviewOpenUrl.value,
              Dialogs.imagePreviewDownloadUrl.value,
              Dialogs.imagePreviewFileName.value,
              Dialogs.imagePreviewTitle.value,
            );
            const customActions = (Dialogs.imagePreviewActions.value || []).filter((button) => !!button);
            const menuActions = (Dialogs.imagePreviewPrependActions.value
              ? customActions.concat(builtInActions)
              : builtInActions.concat(customActions)
            ).filter((button) => !!button && !!(button as any).component);

            return h(
            VCard,
            {
              style: {
                background: theme.cardBackground,
                color: theme.textColor,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                ...(Dialogs.imagePreviewParams.value.cardStyle || {}),
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
                    borderBottom: `1px solid ${theme.toolbarBorderColor}`,
                    background: theme.toolbarBackground,
                    color: theme.textColor,
                    ...(Dialogs.imagePreviewParams.value.toolbarStyle || {}),
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
                    resolveUIText(Dialogs.imagePreviewTitle.value, resolveUIText({ key: 've.dialog.preview.imageTitle', fallback: 'Image Preview' })),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      ...(theme.actionColor ? { color: theme.actionColor } : {}),
                      title: resolveUIText({ key: 've.dialog.preview.zoomOut', fallback: 'Zoom out' }),
                      onClick: () => zoomBy(-0.2),
                    },
                    () => h(VIcon, {}, () => 'mdi-magnify-minus-outline'),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      ...(theme.actionColor ? { color: theme.actionColor } : {}),
                      title: resolveUIText({ key: 've.dialog.preview.resetZoom', fallback: 'Reset zoom' }),
                      onClick: () => resetView(),
                    },
                    () => h(VIcon, {}, () => 'mdi-fit-to-screen-outline'),
                  ),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      ...(theme.actionColor ? { color: theme.actionColor } : {}),
                      title: resolveUIText({ key: 've.dialog.preview.zoomIn', fallback: 'Zoom in' }),
                      onClick: () => zoomBy(0.2),
                    },
                    () => h(VIcon, {}, () => 'mdi-magnify-plus-outline'),
                  ),
                  ...(menuActions.length ? [
                    h(
                      VMenu,
                      {
                        location: 'bottom end',
                        closeOnContentClick: true,
                      },
                      {
                        activator: ({ props: activatorProps }: any) => h(
                          VBtn,
                          {
                            ...activatorProps,
                            icon: true,
                            variant: 'text',
                            ...(theme.actionColor ? { color: theme.actionColor } : {}),
                            title: resolveUIText({ key: 've.dialog.preview.moreActions', fallback: 'More actions' }),
                          },
                          () => h(VIcon, {}, () => 'mdi-dots-vertical'),
                        ),
                        default: () => h(
                          VCard,
                          {
                            elevation: 8,
                            rounded: 'lg',
                            style: {
                              minWidth: '180px',
                              maxWidth: 'calc(100vw - 24px)',
                              overflow: 'hidden',
                              background: theme.cardBackground,
                              color: theme.textColor,
                              border: `1px solid ${theme.toolbarBorderColor}`,
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
                            () => menuActions.map((button, index) => {
                              const buttonParams = button?.$params;
                              if (!button || !buttonParams) {
                                return undefined;
                              }
                              return h('div', {
                                key: `image-preview-action-${index}`,
                                style: {
                                  display: 'flex',
                                  width: '100%',
                                },
                              }, [
                                h(button.component, {
                                  color: buttonParams.color || theme.actionColor || undefined,
                                  variant: buttonParams.variant || 'text',
                                  style: {
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                  },
                                }),
                              ]);
                            }),
                          ),
                        ),
                      },
                    ),
                  ] : []),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      ...(theme.actionColor ? { color: theme.actionColor } : {}),
                      title: resolveUIText({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }),
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
                    background: theme.contentBackground,
                    cursor: scale.value > 1 ? (dragging.value ? 'grabbing' : 'grab') : 'default',
                    userSelect: 'none',
                    touchAction: 'none',
                    ...(Dialogs.imagePreviewParams.value.frameStyle || {}),
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
                    alt: resolveUIText(Dialogs.imagePreviewTitle.value, resolveUIText({ key: 've.dialog.preview.imageAlt', fallback: 'Image preview' })),
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
                        background: theme.cardBackground,
                        color: theme.textColor,
                        border: `1px solid ${theme.toolbarBorderColor}`,
                        opacity: 0.9,
                      },
                    },
                    `${Math.round(scale.value * 100)}%`,
                  ),
                ],
              ),
            ],
            );
          },
        );
      },
    });
  }

  static iframeComponent() {
    return defineComponent({
      name: 'VuetifyExtendedIframePreview',
      setup: () => {
        const close = () => {
          Dialogs.closeDocumentPreview();
        };

        const onKeydown = (ev: KeyboardEvent) => {
          if (!Dialogs.documentPreviewDialog.value) {
            return;
          }

          if (ev.key === 'Escape') {
            ev.preventDefault();
            close();
          }
        };

        onMounted(() => {
          window.addEventListener('keydown', onKeydown, true);
        });

        onUnmounted(() => {
          window.removeEventListener('keydown', onKeydown, true);
        });

        return () => h(
          VDialog,
          {
            modelValue: Dialogs.documentPreviewDialog.value,
            fullscreen: Dialogs.documentPreviewFullscreen.value,
            width: Dialogs.documentPreviewFullscreen.value ? undefined : (Dialogs.documentPreviewWidth.value ?? 1100),
            maxWidth: Dialogs.documentPreviewFullscreen.value ? undefined : (Dialogs.documentPreviewMaxWidth.value ?? '92vw'),
            minWidth: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMinWidth.value,
            height: Dialogs.documentPreviewFullscreen.value ? undefined : (Dialogs.documentPreviewHeight.value ?? '88vh'),
            maxHeight: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMaxHeight.value,
            minHeight: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMinHeight.value,
            persistent: false,
            ...(Dialogs.resolveDocumentPreviewTheme().scrim
              ? { scrim: Dialogs.resolveDocumentPreviewTheme().scrim }
              : {}),
            transition: 'dialog-bottom-transition',
            "onUpdate:modelValue": (v: boolean) => {
              if (v) {
                Dialogs.documentPreviewDialog.value = true;
              } else {
                Dialogs.closeDocumentPreview();
              }
            },
          },
          () => {
            const theme = Dialogs.resolveDocumentPreviewTheme();
            const builtInActions = Dialogs.buildPreviewActions(
              Dialogs.documentPreviewOpenUrl.value || Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value,
              Dialogs.documentPreviewDownloadUrl.value || Dialogs.documentPreviewSrc.value,
              Dialogs.documentPreviewFileName.value,
              Dialogs.documentPreviewTitle.value,
            );
            const customActions = (Dialogs.documentPreviewActions.value || []).filter((button) => !!button);
            const menuActions = (Dialogs.documentPreviewPrependActions.value
              ? customActions.concat(builtInActions)
              : builtInActions.concat(customActions)
            ).filter((button) => !!button && !!(button as any).component);

            return h(
              VCard,
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  background: theme.cardBackground,
                  color: theme.textColor,
                  ...(Dialogs.documentPreviewCardStyle.value || {}),
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
                    borderBottom: `1px solid ${theme.toolbarBorderColor}`,
                    background: theme.toolbarBackground,
                    color: theme.textColor,
                    ...(Dialogs.documentPreviewToolbarStyle.value || {}),
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
                        color: theme.textColor,
                      },
                    },
                    resolveUIText(Dialogs.documentPreviewTitle.value, resolveUIText({ key: 've.dialog.preview.title', fallback: 'Preview' })),
                  ),
                  ...(menuActions.length ? [
                    h(
                      VMenu,
                      {
                        location: 'bottom end',
                        closeOnContentClick: true,
                      },
                      {
                        activator: ({ props: activatorProps }: any) => h(
                          VBtn,
                          {
                            ...activatorProps,
                            icon: true,
                            variant: 'text',
                            ...(theme.actionColor ? { color: theme.actionColor } : {}),
                            title: resolveUIText({ key: 've.dialog.preview.moreActions', fallback: 'More actions' }),
                          },
                          () => h(VIcon, {}, () => 'mdi-dots-vertical'),
                        ),
                        default: () => h(
                          VCard,
                          {
                            elevation: 8,
                            rounded: 'lg',
                            style: {
                              minWidth: '180px',
                              maxWidth: 'calc(100vw - 24px)',
                              overflow: 'hidden',
                              background: theme.cardBackground,
                              color: theme.textColor,
                              border: `1px solid ${theme.toolbarBorderColor}`,
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
                            () => menuActions.map((button, index) => {
                              const buttonParams = button?.$params;
                              if (!button || !buttonParams) {
                                return undefined;
                              }
                              return h('div', {
                                key: `iframe-action-${index}`,
                                style: {
                                  display: 'flex',
                                  width: '100%',
                                },
                              }, [
                                h(button.component, {
                                  color: buttonParams.color || theme.actionColor || undefined,
                                  variant: buttonParams.variant || 'text',
                                  style: {
                                    width: '100%',
                                    justifyContent: 'flex-start',
                                  },
                                }),
                              ]);
                            }),
                          ),
                        ),
                      },
                    ),
                  ] : []),
                  h(
                    VBtn,
                    {
                      icon: true,
                      variant: 'text',
                      ...(theme.actionColor ? { color: theme.actionColor } : {}),
                      title: resolveUIText({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }),
                      onClick: close,
                    },
                    () => h(VIcon, {}, () => 'mdi-close'),
                  ),
                ],
              ),
              h(
                'div',
                {
                  style: {
                    flex: '1 1 auto',
                    padding: Dialogs.documentPreviewFullscreen.value ? '0' : '8px',
                    background: theme.contentBackground,
                  },
                },
                Dialogs.documentPreviewFileInfo.value
                  ? [Dialogs.renderUnsupportedFilePreview(Dialogs.documentPreviewFileInfo.value, theme.textColor)]
                  : [
                    h('iframe', {
                      src: Dialogs.documentPreviewSrcdoc.value ? undefined : (Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value),
                      srcdoc: Dialogs.documentPreviewSrcdoc.value || undefined,
                      title: resolveUIText(Dialogs.documentPreviewTitle.value, resolveUIText({ key: 've.dialog.preview.title', fallback: 'Preview' })),
                      style: {
                        width: '100%',
                        height: '100%',
                        border: '0',
                        display: 'block',
                        background: theme.contentBackground,
                        borderRadius: Dialogs.documentPreviewFullscreen.value ? '0' : '12px',
                        ...(Dialogs.documentPreviewFrameStyle.value || {}),
                      },
                    }),
                  ],
              ),
            ],
            );
          },
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
                () => resolveUIText({ key: 've.common.close', fallback: 'Close' })
              )
            ],
            default: () => resolveUIText(Dialogs.successText.value)
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
                () => resolveUIText({ key: 've.common.close', fallback: 'Close' })
              )
            ],
            default: () => resolveUIText(Dialogs.errorText.value)
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
                () => resolveUIText({ key: 've.common.close', fallback: 'Close' })
              )
            ],
            default: () => resolveUIText(Dialogs.warningText.value)
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

  static async $confirm(text: UIText, title?: UIText, params?: ConfirmParams): Promise<boolean> {
    const resolvedParams = {...Dialogs.confirmDefaults, ...(params || {})};

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
      Dialogs.confirmTitle.value = title || { key: 've.dialog.confirmTitle', fallback: 'Confirm' };
      Dialogs.confirmParams.value = resolvedParams;
      Dialogs.confirmDialog.value = true;
    })
  }

  static async $info(text: UIText, title?: UIText, params?: InfoParams): Promise<void> {
    const resolvedParams = {...Dialogs.infoDefaults, ...(params || {})};

    return new Promise((resolve: any) => {
      Dialogs.infoClose = () => {
        Dialogs.removeConfirmKeydownHandler();
        Dialogs.infoDialog.value = false;
        resolve();
      }
      Dialogs.installConfirmKeydownHandler();
      Dialogs.infoText.value = text;
      Dialogs.infoTitle.value = title || { key: 've.dialog.infoTitle', fallback: 'Info' };
      Dialogs.infoParams.value = resolvedParams;
      Dialogs.infoDialog.value = true;
    })
  }

  static hasBlockingDialog(): boolean {
    return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value || Dialogs.imagePreviewDialog.value || Dialogs.documentPreviewDialog.value;
  }

  static async $imagePreview(src: string, params?: ImagePreviewParams): Promise<void> {
    await Dialogs.openImagePreview(src, params, true);
  }

  private static async openImagePreview(
    src: string,
    params?: ImagePreviewParams,
    invalidatePending = false,
    expectedRequest?: number,
  ): Promise<boolean> {
    if (invalidatePending) {
      Dialogs.filePreviewRequest += 1;
    }
    if (expectedRequest !== undefined && expectedRequest !== Dialogs.filePreviewRequest) {
      return false;
    }

    Dialogs.documentPreviewDialog.value = false;
    Dialogs.documentPreviewFileInfo.value = undefined;
    Dialogs.releaseDocumentPreviewObjectUrl();
    Dialogs.releaseFilePreviewObjectUrl();
    const resolvedParams = {...Dialogs.imagePreviewDefaults, ...(params || {})};

    Dialogs.imagePreviewSrc.value = src;
    Dialogs.imagePreviewTitle.value = resolvedParams.title || '';
    Dialogs.imagePreviewFullscreen.value = resolvedParams.fullscreen !== false;
    Dialogs.imagePreviewParams.value = resolvedParams;
    Dialogs.imagePreviewOpenUrl.value = '';
    Dialogs.imagePreviewDownloadUrl.value = '';
    Dialogs.imagePreviewFileName.value = '';
    Dialogs.imagePreviewPrependActions.value = false;
    Dialogs.imagePreviewActions.value = [];
    Dialogs.imagePreviewDialog.value = true;
    return true;
  }

  static async $iframe(params?: IframeParams, options?: IframeOptions): Promise<void> {
    await Dialogs.openIframe(params, options, true);
  }

  private static async openIframe(
    params?: IframeParams,
    options?: IframeOptions,
    invalidatePending = false,
    expectedRequest?: number,
  ): Promise<boolean> {
    if (invalidatePending) {
      Dialogs.filePreviewRequest += 1;
    }

    const resolvedParams = {...Dialogs.iframeDefaults, ...(params || {})};
    const resolvedOptions = options || {};
    const actions = (await resolvedOptions.actions?.(resolvedParams)) || [];
    if (expectedRequest !== undefined && expectedRequest !== Dialogs.filePreviewRequest) {
      return false;
    }

    Dialogs.imagePreviewDialog.value = false;
    Dialogs.releaseFilePreviewObjectUrl();
    Dialogs.releaseDocumentPreviewObjectUrl();
    const src = resolvedParams.src || '';
    const renderSrc = src ? Dialogs.createDocumentPreviewRenderSrc(src) : '';

    Dialogs.documentPreviewFileInfo.value = undefined;
    Dialogs.documentPreviewSrc.value = src;
    Dialogs.documentPreviewSrcdoc.value = resolvedParams.srcdoc || '';
    Dialogs.documentPreviewRenderSrc.value = renderSrc;
    Dialogs.documentPreviewOpenUrl.value = resolvedParams.openUrl || renderSrc || src;
    Dialogs.documentPreviewDownloadUrl.value = resolvedParams.downloadUrl || src;
    Dialogs.documentPreviewFileName.value = '';
    Dialogs.documentPreviewPrependActions.value = resolvedParams.prependActions === true;
    Dialogs.documentPreviewSkin.value = resolvedParams.skin || 'inherit';
    Dialogs.documentPreviewWidth.value = resolvedParams.width;
    Dialogs.documentPreviewMaxWidth.value = resolvedParams.maxWidth;
    Dialogs.documentPreviewMinWidth.value = resolvedParams.minWidth;
    Dialogs.documentPreviewHeight.value = resolvedParams.height;
    Dialogs.documentPreviewMaxHeight.value = resolvedParams.maxHeight;
    Dialogs.documentPreviewMinHeight.value = resolvedParams.minHeight;
    Dialogs.documentPreviewScrim.value = resolvedParams.scrim || '';
    Dialogs.documentPreviewBackgroundColor.value = resolvedParams.backgroundColor || '';
    Dialogs.documentPreviewToolbarBackground.value = resolvedParams.toolbarBackground || '';
    Dialogs.documentPreviewContentBackground.value = resolvedParams.contentBackground || '';
    Dialogs.documentPreviewTextColor.value = resolvedParams.textColor || '';
    Dialogs.documentPreviewCardStyle.value = resolvedParams.cardStyle;
    Dialogs.documentPreviewToolbarStyle.value = resolvedParams.toolbarStyle;
    Dialogs.documentPreviewFrameStyle.value = resolvedParams.frameStyle;
    Dialogs.documentPreviewActions.value = Array.isArray(actions)
      ? actions.filter((button) => !!button).map((button) => markRaw(button))
      : [];
    Dialogs.documentPreviewTitle.value = resolvedParams.title || '';
    Dialogs.documentPreviewFullscreen.value = resolvedParams.fullscreen !== false;
    Dialogs.documentPreviewDialog.value = true;
    return true;
  }

  static async $documentPreview(src: string, params?: DocumentPreviewParams, options?: IframeOptions): Promise<void> {
    const resolvedParams = {...Dialogs.documentPreviewDefaults, ...(params || {})};

    await Dialogs.$iframe({
      src,
      ...resolvedParams,
      downloadUrl: src,
    }, options);
  }

  static async $previewFile(source: FilePreviewSource, params?: FilePreviewParams, options?: FilePreviewOptions): Promise<void> {
    const request = ++Dialogs.filePreviewRequest;
    const resolvedParams = {...Dialogs.filePreviewDefaults, ...(params || {})};
    const sourceInfo = Dialogs.resolveFilePreviewSource(source, resolvedParams);
    const title = resolvedParams.title
      || sourceInfo.fileName
      || { key: 've.dialog.preview.fileTitle', fallback: 'File Preview' };
    const effectiveParams: FilePreviewParams = {
      ...resolvedParams,
      title,
      mimeType: sourceInfo.mimeType || undefined,
      fileName: sourceInfo.fileName || undefined,
      fileSize: sourceInfo.fileSize,
      openUrl: resolvedParams.openUrl || sourceInfo.url,
      downloadUrl: resolvedParams.downloadUrl || sourceInfo.url,
    };
    let customActions: Button[]|undefined;
    try {
      customActions = await options?.actions?.(effectiveParams);
    } catch (error) {
      if (sourceInfo.objectUrl) {
        URL.revokeObjectURL(sourceInfo.objectUrl);
      }
      throw error;
    }
    if (request !== Dialogs.filePreviewRequest) {
      Dialogs.revokeObjectUrl(sourceInfo.objectUrl);
      return;
    }
    const actions = Array.isArray(customActions)
      ? customActions.filter((button) => !!button).map((button) => markRaw(button))
      : [];
    const previewKind = Dialogs.resolveFilePreviewKind(sourceInfo.mimeType, sourceInfo.fileName, sourceInfo.url);

    try {
      if (previewKind === 'image') {
        const opened = await Dialogs.openImagePreview(sourceInfo.url, effectiveParams, false, request);
        if (!opened || request !== Dialogs.filePreviewRequest) {
          Dialogs.revokeObjectUrl(sourceInfo.objectUrl);
          return;
        }
        Dialogs.imagePreviewOpenUrl.value = effectiveParams.openUrl || sourceInfo.url;
        Dialogs.imagePreviewDownloadUrl.value = effectiveParams.downloadUrl || sourceInfo.url;
        Dialogs.imagePreviewFileName.value = sourceInfo.fileName;
        Dialogs.imagePreviewPrependActions.value = effectiveParams.prependActions === true;
        Dialogs.imagePreviewActions.value = actions;
        Dialogs.filePreviewObjectUrl = sourceInfo.objectUrl;
        return;
      }

      const {
        mimeType: _mimeType,
        fileName: _fileName,
        fileSize: _fileSize,
        ...iframeParams
      } = effectiveParams;
      const iframeOptions: IframeOptions = {
        actions: () => actions,
      };
      const viewerParams = previewKind === 'pdf'
        ? {...Dialogs.documentPreviewDefaults, ...iframeParams}
        : iframeParams;

      if (previewKind === 'pdf' || previewKind === 'iframe' || options?.unsupported === 'iframe') {
        const opened = await Dialogs.openIframe({
          ...viewerParams,
          src: sourceInfo.url,
          openUrl: effectiveParams.openUrl || sourceInfo.url,
          downloadUrl: effectiveParams.downloadUrl || sourceInfo.url,
        }, iframeOptions, false, request);
        if (!opened || request !== Dialogs.filePreviewRequest) {
          Dialogs.revokeObjectUrl(sourceInfo.objectUrl);
          return;
        }
        Dialogs.documentPreviewFileName.value = sourceInfo.fileName;
        Dialogs.filePreviewObjectUrl = sourceInfo.objectUrl;
        return;
      }

      if (options?.unsupported === 'download') {
        Dialogs.downloadPreviewUrl(
          effectiveParams.downloadUrl || sourceInfo.url,
          sourceInfo.fileName,
          title,
        );
        if (sourceInfo.objectUrl) {
          const objectUrl = sourceInfo.objectUrl;
          setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
        }
        return;
      }

      const opened = await Dialogs.openIframe({
        ...iframeParams,
        src: '',
        openUrl: effectiveParams.openUrl || sourceInfo.url,
        downloadUrl: effectiveParams.downloadUrl || sourceInfo.url,
      }, iframeOptions, false, request);
      if (!opened || request !== Dialogs.filePreviewRequest) {
        Dialogs.revokeObjectUrl(sourceInfo.objectUrl);
        return;
      }
      Dialogs.documentPreviewFileName.value = sourceInfo.fileName;
      Dialogs.documentPreviewFileInfo.value = {
        fileName: sourceInfo.fileName,
        mimeType: sourceInfo.mimeType,
        fileSize: sourceInfo.fileSize,
      };
      Dialogs.filePreviewObjectUrl = sourceInfo.objectUrl;
    } catch (error) {
      if (sourceInfo.objectUrl) {
        URL.revokeObjectURL(sourceInfo.objectUrl);
      }
      throw error;
    }
  }

  static async $prompt(params?: PromptParams, options?: PromptOptions): Promise<any|undefined> {
    const request = ++Dialogs.promptRequest;
    const promptParams = Dialogs.resolvePromptParams(params);
    const promptOptions = options || {};
    const returnFocus = Dialogs.promptReturnFocus || Dialogs.captureActiveElement();

    if (Dialogs.promptResolver) {
      // A replacement prompt inherits the original external focus target.
      await Dialogs.closePrompt(undefined, Dialogs.promptForm.value, false);
    }

    const [{ DialogForm }, { Form }, { Field }] = await Promise.all([
      import('./dialogform'),
      import('./form'),
      import('./field'),
    ]);
    if (request !== Dialogs.promptRequest) return undefined;

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
        label: resolvedFieldParams.label || { key: 've.dialog.promptValue', fallback: 'Value' },
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
        title: promptParams.title ?? formParams.title ?? { key: 've.dialog.promptTitle', fallback: 'Prompt' },
        subtitle: promptParams.text ?? formParams.subtitle,
        width: formParams.width ?? promptParams.width ?? (hasCustomChildren ? 760 : 520),
        maxWidth: formParams.maxWidth ?? promptParams.maxWidth,
        minWidth: formParams.minWidth ?? promptParams.minWidth,
        maxHeight: formParams.maxHeight ?? promptParams.height ?? promptParams.maxHeight,
        minHeight: formParams.minHeight ?? promptParams.height ?? promptParams.minHeight,
        saveButton: {
          ...(formParams.saveButton || {}),
          text: promptParams.confirmText || formParams.saveButton?.text || { key: 've.common.confirm', fallback: 'Confirm' },
        },
        cancelButton: {
          ...(formParams.cancelButton || {}),
          text: promptParams.cancelText || formParams.cancelButton?.text || { key: 've.common.cancel', fallback: 'Cancel' },
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
      Dialogs.promptReturnFocus = returnFocus;

      dialog = new DialogForm(
        {
          persistent: dialogParams.persistent ?? true,
          mode: dialogParams.mode || 'create',
          fullscreen: dialogParams.fullscreen,
          width: promptParams.width ?? dialogParams.width,
          maxWidth: promptParams.maxWidth ?? dialogParams.maxWidth,
          minWidth: promptParams.minWidth ?? dialogParams.minWidth,
          height: promptParams.height ?? dialogParams.height,
          maxHeight: promptParams.maxHeight ?? dialogParams.maxHeight,
          minHeight: promptParams.minHeight ?? dialogParams.minHeight,
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
            await Dialogs.closePrompt(result, dialog);
          },
          cancel: async () => {
            if (dialogOptions.cancel) {
              await dialogOptions.cancel();
            }

            await Dialogs.closePrompt(undefined, dialog);
          },
        },
      );

      Dialogs.promptForm.value = markRaw(dialog);
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

  static $error(text: UIText) {
    Dialogs.errorText.value = text;
    Dialogs.errorDialog.value = true;
  }

  static $success(text: UIText) {
    Dialogs.successText.value = text;
    Dialogs.successDialog.value = true;
  }

  static $warning(text: UIText) {
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

  private static async closePrompt(value: any, dialog = Dialogs.promptForm.value, restoreFocus = true) {
    if (dialog !== Dialogs.promptForm.value) return;
    const resolve = Dialogs.promptResolver;
    const returnFocus = Dialogs.promptReturnFocus;
    await dialog?.hide();
    // A superseded callback must never tear down a newer prompt.
    if (dialog !== Dialogs.promptForm.value || resolve !== Dialogs.promptResolver) return;

    Dialogs.promptForm.value = undefined;
    Dialogs.promptVersion.value += 1;
    Dialogs.promptResolver = undefined;
    Dialogs.promptReturnFocus = undefined;

    if (dialog) {
      dialog.removeEventListeners();
      dialog.clearListeners();
    }

    if (restoreFocus) {
      await Dialogs.restorePromptFocus(returnFocus);
    }

    if (resolve) {
      resolve(value);
    }
  }

  private static captureActiveElement(): HTMLElement|undefined {
    if (typeof document === 'undefined' || typeof HTMLElement === 'undefined') {
      return undefined;
    }

    const active = document.activeElement;
    return active instanceof HTMLElement && active !== document.body ? active : undefined;
  }

  private static async restorePromptFocus(target?: HTMLElement) {
    if (!target) return;
    await nextTick();
    if (target.isConnected && typeof target.focus === 'function') {
      target.focus({ preventScroll: true });
    }
  }

  private static resolvePromptParams(params?: PromptParams): PromptParams {
    return Dialogs.mergePromptParams(Dialogs.promptDefaults, params || {});
  }

  private static mergePromptParams(base: PromptParams, override: PromptParams): PromptParams {
    const resolved: PromptParams = {...base, ...override};

    if (base.fieldParams || override.fieldParams) {
      resolved.fieldParams = {...(base.fieldParams || {}), ...(override.fieldParams || {})};
    }
    if (base.formParams || override.formParams) {
      resolved.formParams = {...(base.formParams || {}), ...(override.formParams || {})};
    }
    if (base.dialogParams || override.dialogParams) {
      resolved.dialogParams = {...(base.dialogParams || {}), ...(override.dialogParams || {})};
    }

    return resolved;
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

  private static resolvePreviewTheme(params: ImagePreviewParams|IframeParams) {
    const skin = params.skin || 'inherit';
    const inheritSkin = skin === 'inherit';
    const dark = skin === 'dark';
    const forcedTextColor = dark ? '#ffffff' : '#0f172a';
    const forcedCardBackground = dark ? '#0f172a' : '#ffffff';
    const forcedToolbarBackground = dark ? '#111827' : '#f8fafc';
    const forcedContentBackground = dark ? '#020617' : '#e5e7eb';

    return {
      textColor: params.textColor || (inheritSkin ? 'rgb(var(--v-theme-on-surface))' : forcedTextColor),
      actionColor: params.textColor || (inheritSkin ? '' : forcedTextColor),
      cardBackground: params.backgroundColor || (inheritSkin ? 'rgb(var(--v-theme-surface))' : forcedCardBackground),
      toolbarBackground: params.toolbarBackground || (inheritSkin ? 'rgb(var(--v-theme-surface))' : forcedToolbarBackground),
      contentBackground: params.contentBackground || (inheritSkin ? 'rgb(var(--v-theme-background))' : forcedContentBackground),
      toolbarBorderColor: inheritSkin
        ? 'rgba(var(--v-theme-on-surface), 0.12)'
        : (dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.10)'),
      scrim: params.scrim || (inheritSkin ? '' : (dark ? 'rgba(7, 10, 17, 0.82)' : 'rgba(15, 23, 42, 0.36)')),
    };
  }

  private static resolveDocumentPreviewTheme() {
    return Dialogs.resolvePreviewTheme({
      skin: Dialogs.documentPreviewSkin.value,
      scrim: Dialogs.documentPreviewScrim.value,
      backgroundColor: Dialogs.documentPreviewBackgroundColor.value,
      toolbarBackground: Dialogs.documentPreviewToolbarBackground.value,
      contentBackground: Dialogs.documentPreviewContentBackground.value,
      textColor: Dialogs.documentPreviewTextColor.value,
    });
  }

  private static closeImagePreview(): void {
    Dialogs.filePreviewRequest += 1;
    Dialogs.imagePreviewDialog.value = false;
    Dialogs.releaseFilePreviewObjectUrl();
  }

  private static closeDocumentPreview(): void {
    Dialogs.filePreviewRequest += 1;
    Dialogs.documentPreviewDialog.value = false;
    Dialogs.releaseDocumentPreviewObjectUrl();
    Dialogs.releaseFilePreviewObjectUrl();
    Dialogs.documentPreviewFileInfo.value = undefined;
  }

  private static buildPreviewActions(openUrl: string, downloadUrl: string, fileName: string, title?: UIText): Button[] {
    const actions: Button[] = [];

    if (openUrl) {
      actions.push(markRaw(new Button(
        {
          text: { key: 've.common.open', fallback: 'Open' },
          icon: 'mdi-open-in-new',
          variant: 'text',
        },
        {
          onClicked: () => {
            Dialogs.openPreviewUrl(openUrl);
          },
        },
      )));
    }

    if (downloadUrl) {
      actions.push(markRaw(new Button(
        {
          text: { key: 've.common.download', fallback: 'Download' },
          icon: 'mdi-download',
          variant: 'text',
        },
        {
          onClicked: () => {
            Dialogs.downloadPreviewUrl(downloadUrl, fileName, title);
          },
        },
      )));
    }

    return actions;
  }

  private static openPreviewUrl(url: string): void {
    if (typeof window === 'undefined' || !url) {
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  private static downloadPreviewUrl(url: string, fileName: string, title?: UIText): void {
    if (typeof document === 'undefined' || !url) {
      return;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName
      || resolveUIText(title, resolveUIText({ key: 've.dialog.preview.documentFallback', fallback: 'document' }));
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private static resolveFilePreviewSource(source: FilePreviewSource, params: FilePreviewParams): {
    url: string;
    objectUrl?: string;
    fileName: string;
    mimeType: string;
    fileSize?: number;
  } {
    if (typeof source === 'string') {
      const fileName = params.fileName || Dialogs.fileNameFromUrl(source);
      const explicitMimeType = Dialogs.normalizeMimeType(params.mimeType);
      const mimeType = explicitMimeType || Dialogs.mimeTypeFromSource(source, fileName);
      return {
        url: source,
        fileName,
        mimeType,
        fileSize: params.fileSize,
      };
    }

    if (typeof Blob === 'undefined' || !(source instanceof Blob)) {
      throw new TypeError('Dialogs.$previewFile source must be a URL, data URL, Blob, or File.');
    }
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      throw new Error('Dialogs.$previewFile cannot preview Blob data because object URLs are unavailable.');
    }

    const sourceName = typeof File !== 'undefined' && source instanceof File ? source.name : '';
    const fileName = params.fileName || sourceName;
    const sourceMimeType = Dialogs.normalizeMimeType(source.type);
    const explicitMimeType = Dialogs.normalizeMimeType(params.mimeType);
    const inferredMimeType = Dialogs.mimeTypeFromFileName(fileName);
    const mimeType = explicitMimeType
      || (sourceMimeType && sourceMimeType !== 'application/octet-stream' ? sourceMimeType : inferredMimeType || sourceMimeType);
    const objectUrl = URL.createObjectURL(source);

    return {
      url: objectUrl,
      objectUrl,
      fileName,
      mimeType,
      fileSize: params.fileSize ?? source.size,
    };
  }

  private static resolveFilePreviewKind(mimeType: string, fileName: string, source: string): 'image'|'pdf'|'iframe'|'unsupported' {
    const normalizedMimeType = Dialogs.normalizeMimeType(mimeType);
    if (normalizedMimeType.startsWith('image/')) {
      return 'image';
    }
    if (normalizedMimeType === 'application/pdf') {
      return 'pdf';
    }
    if (
      normalizedMimeType.startsWith('text/')
      || normalizedMimeType.startsWith('audio/')
      || normalizedMimeType.startsWith('video/')
      || [
        'application/json',
        'application/xml',
        'application/xhtml+xml',
      ].includes(normalizedMimeType)
    ) {
      return 'iframe';
    }

    if (!normalizedMimeType) {
      const inferredMimeType = Dialogs.mimeTypeFromSource(source, fileName);
      if (inferredMimeType) {
        return Dialogs.resolveFilePreviewKind(inferredMimeType, fileName, source);
      }
      // Dynamic endpoints may return browser-renderable content even without an extension.
      return 'iframe';
    }

    return 'unsupported';
  }

  private static normalizeMimeType(mimeType?: string): string {
    return String(mimeType || '').split(';', 1)[0].trim().toLowerCase();
  }

  private static mimeTypeFromSource(source: string, fileName: string): string {
    const dataMimeType = source.match(/^data:([^;,]+)/i)?.[1];
    return Dialogs.normalizeMimeType(dataMimeType) || Dialogs.mimeTypeFromFileName(fileName || source);
  }

  private static mimeTypeFromFileName(fileName: string): string {
    const cleanName = String(fileName || '').split(/[?#]/, 1)[0].toLowerCase();
    const extension = cleanName.match(/\.([a-z0-9]+)$/)?.[1] || '';
    const mimeTypes: Record<string, string> = {
      avif: 'image/avif',
      bmp: 'image/bmp',
      gif: 'image/gif',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      svg: 'image/svg+xml',
      webp: 'image/webp',
      pdf: 'application/pdf',
      csv: 'text/csv',
      htm: 'text/html',
      html: 'text/html',
      json: 'application/json',
      md: 'text/markdown',
      rtf: 'text/rtf',
      txt: 'text/plain',
      xml: 'application/xml',
      mp3: 'audio/mpeg',
      ogg: 'audio/ogg',
      wav: 'audio/wav',
      m4v: 'video/mp4',
      mp4: 'video/mp4',
      webm: 'video/webm',
      bin: 'application/octet-stream',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      odp: 'application/vnd.oasis.opendocument.presentation',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odt: 'application/vnd.oasis.opendocument.text',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      rar: 'application/vnd.rar',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      zip: 'application/zip',
    };
    return mimeTypes[extension] || '';
  }

  private static fileNameFromUrl(source: string): string {
    if (!source || source.startsWith('data:') || source.startsWith('blob:')) {
      return '';
    }

    const cleanSource = source.split(/[?#]/, 1)[0];
    const fileName = cleanSource.slice(cleanSource.lastIndexOf('/') + 1);
    try {
      return decodeURIComponent(fileName);
    } catch (_error) {
      return fileName;
    }
  }

  private static formatFileSize(size?: number): string {
    if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) {
      return resolveUIText({ key: 've.dialog.preview.unknownSize', fallback: 'Unknown' });
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = size;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    const maximumFractionDigits = unitIndex === 0 ? 0 : 1;
    return `${new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value)} ${units[unitIndex]}`;
  }

  private static renderUnsupportedFilePreview(info: FilePreviewInfo, textColor: string) {
    const fileName = info.fileName || resolveUIText({ key: 've.dialog.preview.unknownFile', fallback: 'Unnamed file' });
    const mimeType = info.mimeType || resolveUIText({ key: 've.dialog.preview.unknownType', fallback: 'Unknown type' });
    const rows = [
      [{ key: 've.dialog.preview.fileName', fallback: 'File name' }, fileName],
      [{ key: 've.dialog.preview.fileType', fallback: 'File type' }, mimeType],
      [{ key: 've.dialog.preview.fileSize', fallback: 'File size' }, Dialogs.formatFileSize(info.fileSize)],
    ] as const;

    return h(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          minHeight: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          ...(textColor ? { color: textColor } : {}),
        },
      },
      [
        h(
          'div',
          {
            style: {
              width: 'min(520px, 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'center',
            },
          },
          [
            h(VIcon, { size: 64, color: 'primary' }, () => 'mdi-file-outline'),
            h('div', { style: { fontSize: '1.15rem', fontWeight: '600' } }, resolveUIText({
              key: 've.dialog.preview.unavailable',
              fallback: 'Preview unavailable',
            })),
            h('div', { style: { opacity: '0.76', maxWidth: '440px' } }, resolveUIText({
              key: 've.dialog.preview.unavailableDescription',
              fallback: 'This file type cannot be displayed in the browser. Use Open or Download from the actions menu.',
            })),
            h(
              'div',
              {
                style: {
                  width: '100%',
                  marginTop: '8px',
                  display: 'grid',
                  gridTemplateColumns: 'minmax(90px, auto) minmax(0, 1fr)',
                  gap: '8px 16px',
                  textAlign: 'left',
                },
              },
              rows.flatMap(([label, value], index) => [
                h('div', { key: `file-preview-label-${index}`, style: { fontWeight: '600', opacity: '0.78' } }, resolveUIText(label)),
                h('div', {
                  key: `file-preview-value-${index}`,
                  style: { overflowWrap: 'anywhere' },
                }, value),
              ]),
            ),
          ],
        ),
      ],
    );
  }

  private static createDocumentPreviewRenderSrc(src: string): string {
    Dialogs.releaseDocumentPreviewObjectUrl();

    if (typeof src !== 'string' || !src.startsWith('data:')) {
      return src;
    }

    const decoded = Dialogs.decodeDataUrl(src);
    if (!decoded) {
      return src;
    }

    const objectUrl = URL.createObjectURL(new Blob([decoded.bytes], {
      type: decoded.mimeType || 'application/octet-stream',
    }));
    Dialogs.documentPreviewObjectUrl = objectUrl;
    return objectUrl;
  }

  private static releaseDocumentPreviewObjectUrl() {
    if (!Dialogs.documentPreviewObjectUrl) {
      return;
    }

    URL.revokeObjectURL(Dialogs.documentPreviewObjectUrl);
    Dialogs.documentPreviewObjectUrl = undefined;
  }

  private static releaseFilePreviewObjectUrl() {
    if (!Dialogs.filePreviewObjectUrl) {
      return;
    }

    URL.revokeObjectURL(Dialogs.filePreviewObjectUrl);
    Dialogs.filePreviewObjectUrl = undefined;
  }

  private static revokeObjectUrl(objectUrl?: string) {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }

  private static decodeDataUrl(src: string): { mimeType: string; bytes: Uint8Array } | undefined {
    const matches = src.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?(;base64)?,(.*)$/s);
    if (!matches) {
      return undefined;
    }

    const mimeType = matches[1] || 'application/octet-stream';
    const isBase64 = !!matches[2];
    const payload = matches[3] || '';

    if (!isBase64) {
      return {
        mimeType,
        bytes: new TextEncoder().encode(decodeURIComponent(payload)),
      };
    }

    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return { mimeType, bytes };
  }

}
