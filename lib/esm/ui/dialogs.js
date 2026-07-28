var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineComponent, h, markRaw, onMounted, onUnmounted, ref, shallowRef, watch } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VIcon, VLayout, VMenu, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';
import { Master } from "../master";
import { Button } from "./button";
import { resolveUIText } from "./runtime";
export class Dialogs {
    static setOptions(options) {
        Dialogs.options.value = Object.assign(Object.assign({}, Dialogs.options.value), options);
    }
    static get rootIsMounted() {
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
                return () => h(VDialog, {
                    modelValue: Dialogs.confirmDialog.value,
                    persistent: true,
                    maxWidth: 300,
                    maxHeight: 200
                }, () => h(VCard, {}, () => [
                    h(VCardTitle, {}, () => resolveUIText(Dialogs.confirmTitle.value)),
                    h(VCardText, {}, () => resolveUIText(Dialogs.confirmText.value)),
                    h(VCardActions, {}, () => [
                        h(VSpacer),
                        h(VBtn, {
                            color: 'error',
                            onClick: () => {
                                if (Dialogs.confirmNo)
                                    Dialogs.confirmNo();
                            }
                        }, () => resolveUIText({ key: 've.common.no', fallback: 'No' })),
                        h(VBtn, {
                            color: 'success',
                            onClick: () => {
                                if (Dialogs.confirmYes)
                                    Dialogs.confirmYes();
                            }
                        }, () => resolveUIText({ key: 've.common.yes', fallback: 'Yes' }))
                    ])
                ]));
            },
        });
    }
    static infoComponent() {
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VDialog, {
                    modelValue: Dialogs.infoDialog.value,
                    persistent: true,
                    width: Dialogs.infoWidth.value || Dialogs.options.value.infoWindowWidth || 400,
                    maxHeight: Dialogs.infoHeight.value || Dialogs.options.value.infoWindowHeight || 300
                }, () => h(VCard, {}, () => [
                    h(VCardTitle, {}, () => resolveUIText(Dialogs.infoTitle.value)),
                    h(VCardText, {}, () => resolveUIText(Dialogs.infoText.value)),
                    h(VCardActions, {}, () => [
                        h(VSpacer),
                        h(VBtn, {
                            color: 'success',
                            onClick: () => {
                                if (Dialogs.infoClose)
                                    Dialogs.infoClose();
                            }
                        }, () => resolveUIText({ key: 've.common.close', fallback: 'Close' }))
                    ])
                ]));
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
                const clampScale = (value) => Math.min(6, Math.max(0.5, value));
                const resetView = () => {
                    scale.value = 1;
                    translateX.value = 0;
                    translateY.value = 0;
                    dragging.value = false;
                };
                const zoomTo = (nextScale) => {
                    scale.value = clampScale(nextScale);
                    if (scale.value <= 1) {
                        translateX.value = 0;
                        translateY.value = 0;
                    }
                };
                const zoomBy = (delta) => {
                    zoomTo(scale.value + delta);
                };
                const close = () => {
                    Dialogs.imagePreviewDialog.value = false;
                };
                const onPointerDown = (ev) => {
                    if (scale.value <= 1) {
                        return;
                    }
                    dragging.value = true;
                    lastPointerX.value = ev.clientX;
                    lastPointerY.value = ev.clientY;
                };
                const onPointerMove = (ev) => {
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
                const onWheel = (ev) => {
                    if (!Dialogs.imagePreviewDialog.value) {
                        return;
                    }
                    ev.preventDefault();
                    zoomBy(ev.deltaY < 0 ? 0.2 : -0.2);
                };
                const onKeydown = (ev) => {
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
                watch(() => [Dialogs.imagePreviewDialog.value, Dialogs.imagePreviewSrc.value], ([open]) => {
                    if (open) {
                        resetView();
                    }
                }, { immediate: true });
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
                return () => h(VDialog, {
                    modelValue: Dialogs.imagePreviewDialog.value,
                    fullscreen: Dialogs.imagePreviewFullscreen.value,
                    width: Dialogs.imagePreviewFullscreen.value ? undefined : 1100,
                    maxWidth: Dialogs.imagePreviewFullscreen.value ? undefined : '92vw',
                    persistent: false,
                    scrim: 'rgba(7, 10, 17, 0.88)',
                    transition: 'dialog-bottom-transition',
                    "onUpdate:modelValue": (v) => {
                        Dialogs.imagePreviewDialog.value = v;
                        if (!v) {
                            resetView();
                        }
                    },
                }, () => h(VCard, {
                    style: {
                        background: '#0f172a',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        height: Dialogs.imagePreviewFullscreen.value ? '100vh' : '88vh',
                        overflow: 'hidden',
                    },
                }, () => [
                    h('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(15, 23, 42, 0.94)',
                        },
                    }, [
                        h('div', {
                            style: {
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: '1 1 auto',
                            },
                        }, resolveUIText(Dialogs.imagePreviewTitle.value, 'Image Preview')),
                        h(VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: resolveUIText({ key: 've.dialog.preview.zoomOut', fallback: 'Zoom out' }),
                            onClick: () => zoomBy(-0.2),
                        }, () => h(VIcon, {}, () => 'mdi-magnify-minus-outline')),
                        h(VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: resolveUIText({ key: 've.dialog.preview.resetZoom', fallback: 'Reset zoom' }),
                            onClick: () => resetView(),
                        }, () => h(VIcon, {}, () => 'mdi-fit-to-screen-outline')),
                        h(VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: resolveUIText({ key: 've.dialog.preview.zoomIn', fallback: 'Zoom in' }),
                            onClick: () => zoomBy(0.2),
                        }, () => h(VIcon, {}, () => 'mdi-magnify-plus-outline')),
                        h(VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: resolveUIText({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }),
                            onClick: () => close(),
                        }, () => h(VIcon, {}, () => 'mdi-close')),
                    ]),
                    h('div', {
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
                            }
                            else {
                                zoomTo(2);
                            }
                        },
                        onPointerdown: onPointerDown,
                    }, [
                        h('img', {
                            src: Dialogs.imagePreviewSrc.value,
                            alt: resolveUIText(Dialogs.imagePreviewTitle.value, 'Image preview'),
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
                        h('div', {
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
                        }, `${Math.round(scale.value * 100)}%`),
                    ]),
                ]));
            },
        });
    }
    static iframeComponent() {
        return defineComponent({
            name: 'VuetifyExtendedIframePreview',
            setup: () => {
                const close = () => {
                    Dialogs.documentPreviewDialog.value = false;
                };
                const openNewTab = () => {
                    const previewSrc = Dialogs.documentPreviewOpenUrl.value || Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value;
                    if (typeof window === 'undefined' || !previewSrc) {
                        return;
                    }
                    window.open(previewSrc, '_blank', 'noopener');
                };
                const downloadDocument = () => {
                    const downloadUrl = Dialogs.documentPreviewDownloadUrl.value || Dialogs.documentPreviewSrc.value;
                    if (typeof document === 'undefined' || !downloadUrl) {
                        return;
                    }
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = resolveUIText(Dialogs.documentPreviewTitle.value, resolveUIText({ key: 've.dialog.preview.documentFallback', fallback: 'document' }));
                    link.target = '_blank';
                    link.rel = 'noopener';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
                const buildBuiltInActions = () => {
                    const actions = [];
                    if (Dialogs.documentPreviewOpenUrl.value || Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value) {
                        actions.push(markRaw(new Button({
                            text: { key: 've.common.open', fallback: 'Open' },
                            icon: 'mdi-open-in-new',
                            variant: 'text',
                        }, {
                            onClicked: () => {
                                openNewTab();
                            },
                        })));
                    }
                    if (Dialogs.documentPreviewDownloadUrl.value || Dialogs.documentPreviewSrc.value) {
                        actions.push(markRaw(new Button({
                            text: { key: 've.common.download', fallback: 'Download' },
                            icon: 'mdi-download',
                            variant: 'text',
                        }, {
                            onClicked: () => {
                                downloadDocument();
                            },
                        })));
                    }
                    return actions;
                };
                const onKeydown = (ev) => {
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
                return () => h(VDialog, Object.assign(Object.assign({ modelValue: Dialogs.documentPreviewDialog.value, fullscreen: Dialogs.documentPreviewFullscreen.value, width: Dialogs.documentPreviewFullscreen.value ? undefined : (Dialogs.documentPreviewWidth.value || 1100), maxWidth: Dialogs.documentPreviewFullscreen.value ? undefined : (Dialogs.documentPreviewMaxWidth.value || '92vw'), persistent: false }, (Dialogs.documentPreviewScrim.value
                    ? { scrim: Dialogs.documentPreviewScrim.value }
                    : (Dialogs.documentPreviewSkin.value === 'inherit'
                        ? {}
                        : { scrim: Dialogs.documentPreviewSkin.value === 'dark' ? 'rgba(7, 10, 17, 0.82)' : 'rgba(15, 23, 42, 0.36)' }))), { transition: 'dialog-bottom-transition', "onUpdate:modelValue": (v) => {
                        Dialogs.documentPreviewDialog.value = v;
                    } }), () => {
                    const skin = Dialogs.documentPreviewSkin.value;
                    const dark = skin === 'dark';
                    const inheritSkin = skin === 'inherit';
                    const textColor = Dialogs.documentPreviewTextColor.value || (inheritSkin ? '' : (dark ? '#ffffff' : '#0f172a'));
                    const cardBackground = Dialogs.documentPreviewBackgroundColor.value || (inheritSkin ? '' : (dark ? '#0f172a' : '#ffffff'));
                    const toolbarBackground = Dialogs.documentPreviewToolbarBackground.value || (inheritSkin ? '' : (dark ? 'rgba(15, 23, 42, 0.94)' : '#f8fafc'));
                    const contentBackground = Dialogs.documentPreviewContentBackground.value || (inheritSkin ? '' : (dark ? '#111827' : '#e5e7eb'));
                    const toolbarBorderColor = inheritSkin ? '' : (dark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.08)');
                    const builtInActions = buildBuiltInActions();
                    const customActions = (Dialogs.documentPreviewActions.value || []).filter((button) => !!button);
                    const menuActions = (Dialogs.documentPreviewPrependActions.value
                        ? customActions.concat(builtInActions)
                        : builtInActions.concat(customActions)).filter((button) => !!button && !!button.component);
                    return h(VCard, {
                        style: Object.assign(Object.assign(Object.assign({ display: 'flex', flexDirection: 'column', height: Dialogs.documentPreviewFullscreen.value ? '100vh' : (Dialogs.documentPreviewHeight.value || '88vh'), overflow: 'hidden' }, (cardBackground ? { background: cardBackground } : {})), (textColor ? { color: textColor } : {})), (Dialogs.documentPreviewCardStyle.value || {})),
                    }, () => [
                        h('div', {
                            style: Object.assign(Object.assign(Object.assign(Object.assign({ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px' }, (toolbarBorderColor ? { borderBottom: `1px solid ${toolbarBorderColor}` } : {})), (toolbarBackground ? { background: toolbarBackground } : {})), (textColor ? { color: textColor } : {})), (Dialogs.documentPreviewToolbarStyle.value || {})),
                        }, [
                            h('div', {
                                style: Object.assign({ fontWeight: '600', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1 1 auto' }, (textColor ? { color: textColor } : {})),
                            }, resolveUIText(Dialogs.documentPreviewTitle.value, 'Preview')),
                            ...(menuActions.length ? [
                                h(VMenu, {
                                    location: 'bottom end',
                                    closeOnContentClick: true,
                                }, {
                                    activator: ({ props: activatorProps }) => h(VBtn, Object.assign(Object.assign(Object.assign(Object.assign({}, activatorProps), { icon: true, variant: 'text' }), (textColor ? { color: textColor } : {})), { title: resolveUIText({ key: 've.dialog.preview.moreActions', fallback: 'More actions' }) }), () => h(VIcon, {}, () => 'mdi-dots-vertical')),
                                    default: () => h(VCard, {
                                        elevation: 8,
                                        rounded: 'lg',
                                        style: Object.assign(Object.assign(Object.assign({ minWidth: '180px', maxWidth: 'calc(100vw - 24px)', overflow: 'hidden' }, (cardBackground ? { background: cardBackground } : {})), (textColor ? { color: textColor } : {})), (toolbarBorderColor ? { border: `1px solid ${toolbarBorderColor}` } : {})),
                                    }, () => h(VCardText, {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px',
                                            padding: '12px',
                                        },
                                    }, () => menuActions.map((button, index) => {
                                        const buttonParams = button === null || button === void 0 ? void 0 : button.$params;
                                        if (!button || !buttonParams) {
                                            return undefined;
                                        }
                                        if (!buttonParams.color && textColor) {
                                            button.setParams({ color: textColor });
                                        }
                                        if (!buttonParams.variant) {
                                            button.setParams({ variant: 'text' });
                                        }
                                        return h('div', {
                                            key: `iframe-action-${index}`,
                                            style: {
                                                display: 'flex',
                                                width: '100%',
                                            },
                                        }, [
                                            h(button.component, {
                                                style: {
                                                    width: '100%',
                                                    justifyContent: 'flex-start',
                                                },
                                            }),
                                        ]);
                                    }))),
                                }),
                            ] : []),
                            h(VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (textColor ? { color: textColor } : {})), { title: resolveUIText({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }), onClick: close }), () => h(VIcon, {}, () => 'mdi-close')),
                        ]),
                        h('div', {
                            style: Object.assign({ flex: '1 1 auto', padding: Dialogs.documentPreviewFullscreen.value ? '0' : '8px' }, (contentBackground ? { background: contentBackground } : {})),
                        }, [
                            h('iframe', {
                                src: Dialogs.documentPreviewSrcdoc.value ? undefined : (Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value),
                                srcdoc: Dialogs.documentPreviewSrcdoc.value || undefined,
                                title: resolveUIText(Dialogs.documentPreviewTitle.value, 'Preview'),
                                style: Object.assign({ width: '100%', height: '100%', border: '0', display: 'block', background: 'white', borderRadius: Dialogs.documentPreviewFullscreen.value ? '0' : '12px' }, (Dialogs.documentPreviewFrameStyle.value || {})),
                            }),
                        ]),
                    ]);
                });
            },
        });
    }
    static successComponent() {
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VSnackbar, {
                    modelValue: Dialogs.successDialog.value,
                    timeout: Dialogs.options.value.successTimeout || 2000,
                    elevation: 24,
                    color: Dialogs.options.value.successColor || 'success',
                    location: 'top center',
                    class: ['pa-2'],
                    "onUpdate:modelValue": (v) => {
                        Dialogs.successDialog.value = v;
                    }
                }, {
                    actions: () => [
                        h(VBtn, {
                            color: Dialogs.options.value.successColor === 'white' ? 'success' : 'white',
                            variant: 'text',
                            onClick: () => {
                                Dialogs.successDialog.value = false;
                            }
                        }, () => resolveUIText({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => resolveUIText(Dialogs.successText.value)
                });
            },
        });
    }
    static errorComponent() {
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VSnackbar, {
                    modelValue: Dialogs.errorDialog.value,
                    timeout: Dialogs.options.value.errorTimeout || 5000,
                    elevation: 24,
                    color: Dialogs.options.value.errorColor || 'error',
                    location: 'top center',
                    class: ['pa-2'],
                    "onUpdate:modelValue": (v) => {
                        Dialogs.errorDialog.value = v;
                    }
                }, {
                    actions: () => [
                        h(VBtn, {
                            color: Dialogs.options.value.errorColor === 'white' ? 'success' : 'white',
                            variant: 'text',
                            onClick: () => {
                                Dialogs.errorDialog.value = false;
                            }
                        }, () => resolveUIText({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => resolveUIText(Dialogs.errorText.value)
                });
            },
        });
    }
    static warningComponent() {
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VSnackbar, {
                    modelValue: Dialogs.warningDialog.value,
                    timeout: Dialogs.options.value.warningTimeout || 5000,
                    elevation: 24,
                    color: Dialogs.options.value.warningColor || 'warning',
                    location: 'top center',
                    class: ['pa-2'],
                    "onUpdate:modelValue": (v) => {
                        Dialogs.warningDialog.value = v;
                    }
                }, {
                    actions: () => [
                        h(VBtn, {
                            variant: 'text',
                            onClick: () => {
                                Dialogs.warningDialog.value = false;
                            }
                        }, () => resolveUIText({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => resolveUIText(Dialogs.warningText.value)
                });
            },
        });
    }
    static progressComponent() {
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VOverlay, {
                    modelValue: Dialogs.progressDialog.value,
                    persistent: true,
                    height: '100%',
                    width: '100%'
                }, () => h(VLayout, {
                    fullHeight: true,
                }, () => h(VRow, {
                    alignContent: 'center',
                }, () => h(VCol, {
                    align: 'center'
                }, () => [
                    h(VProgressCircular, {
                        indeterminate: Dialogs.progressIndeterminate.value,
                        size: Dialogs.options.value.progressSize || 300,
                        width: Dialogs.options.value.progressWidth || 20,
                        modelValue: Dialogs.progressValue.value,
                        color: Dialogs.options.value.progressColor || 'white',
                        class: ['my-auto', 'mx-auto']
                    }, () => [
                        ...(Dialogs.progressValue.value || Dialogs.progressValue.value === 0 ? [
                            `${Number(Dialogs.progressValue.value).toFixed(2)}%`
                        ] : []),
                        h('br'),
                        Dialogs.progressText.value
                    ])
                ]))));
            },
        });
    }
    static $confirm(text, title) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                Dialogs.confirmYes = () => {
                    Dialogs.removeConfirmKeydownHandler();
                    Dialogs.confirmDialog.value = false;
                    resolve(true);
                };
                Dialogs.confirmNo = () => {
                    Dialogs.removeConfirmKeydownHandler();
                    Dialogs.confirmDialog.value = false;
                    resolve(false);
                };
                Dialogs.installConfirmKeydownHandler();
                Dialogs.confirmText.value = text;
                Dialogs.confirmTitle.value = title || { key: 've.dialog.confirmTitle', fallback: 'Confirm' };
                Dialogs.confirmDialog.value = true;
            });
        });
    }
    static $info(text, title, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                Dialogs.infoClose = () => {
                    Dialogs.removeConfirmKeydownHandler();
                    Dialogs.infoDialog.value = false;
                    resolve();
                };
                Dialogs.installConfirmKeydownHandler();
                Dialogs.infoText.value = text;
                Dialogs.infoTitle.value = title || { key: 've.dialog.infoTitle', fallback: 'Info' };
                Dialogs.infoWidth.value = (options === null || options === void 0 ? void 0 : options.width) || Dialogs.options.value.infoWindowWidth || 400;
                Dialogs.infoHeight.value = (options === null || options === void 0 ? void 0 : options.height) || Dialogs.options.value.infoWindowHeight || 300;
                Dialogs.infoDialog.value = true;
            });
        });
    }
    static hasBlockingDialog() {
        return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value || Dialogs.imagePreviewDialog.value || Dialogs.documentPreviewDialog.value;
    }
    static $imagePreview(src, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Dialogs.imagePreviewSrc.value = src;
            Dialogs.imagePreviewTitle.value = (options === null || options === void 0 ? void 0 : options.title) || '';
            Dialogs.imagePreviewFullscreen.value = (options === null || options === void 0 ? void 0 : options.fullscreen) !== false;
            Dialogs.imagePreviewDialog.value = true;
        });
    }
    static $iframe(params, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedParams = params || {};
            const resolvedOptions = options || {};
            const src = resolvedParams.src || '';
            const renderSrc = src ? Dialogs.createDocumentPreviewRenderSrc(src) : '';
            const actions = (yield ((_a = resolvedOptions.actions) === null || _a === void 0 ? void 0 : _a.call(resolvedOptions, resolvedParams))) || [];
            Dialogs.documentPreviewSrc.value = src;
            Dialogs.documentPreviewSrcdoc.value = resolvedParams.srcdoc || '';
            Dialogs.documentPreviewRenderSrc.value = renderSrc;
            Dialogs.documentPreviewOpenUrl.value = resolvedParams.openUrl || renderSrc || src;
            Dialogs.documentPreviewDownloadUrl.value = resolvedParams.downloadUrl || src;
            Dialogs.documentPreviewPrependActions.value = resolvedParams.prependActions === true;
            Dialogs.documentPreviewSkin.value = resolvedParams.skin || 'inherit';
            Dialogs.documentPreviewWidth.value = resolvedParams.width;
            Dialogs.documentPreviewMaxWidth.value = resolvedParams.maxWidth;
            Dialogs.documentPreviewHeight.value = resolvedParams.height;
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
        });
    }
    static $documentPreview(src, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Dialogs.$iframe(Object.assign(Object.assign({ src }, (params || {})), { downloadUrl: src }), options);
        });
    }
    static $prompt(params, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __awaiter(this, void 0, void 0, function* () {
            const promptParams = params || {};
            const promptOptions = options || {};
            if (Dialogs.promptResolver) {
                yield Dialogs.closePrompt(undefined);
            }
            const [{ DialogForm }, { Form }, { Field }] = yield Promise.all([
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
            const field = !hasCustomChildren ? new Field(Object.assign({ type: resolvedFieldParams.type || promptParams.type || 'text', label: resolvedFieldParams.label || { key: 've.dialog.promptValue', fallback: 'Value' }, storage: storageKey, autofocus: (_a = resolvedFieldParams.autofocus) !== null && _a !== void 0 ? _a : true, cols: (_b = resolvedFieldParams.cols) !== null && _b !== void 0 ? _b : 12 }, resolvedFieldParams), promptOptions.fieldOptions) : undefined;
            const form = new Form(Object.assign(Object.assign({}, formParams), { auto: true, sub: true, hideMode: (_c = formParams.hideMode) !== null && _c !== void 0 ? _c : true, mode: dialogParams.mode || formParams.mode || 'create', title: (_e = (_d = promptParams.title) !== null && _d !== void 0 ? _d : formParams.title) !== null && _e !== void 0 ? _e : { key: 've.dialog.promptTitle', fallback: 'Prompt' }, subtitle: (_f = promptParams.text) !== null && _f !== void 0 ? _f : formParams.subtitle, width: (_g = formParams.width) !== null && _g !== void 0 ? _g : (hasCustomChildren ? 760 : 520), saveButton: Object.assign(Object.assign({}, (formParams.saveButton || {})), { text: promptParams.confirmText || ((_h = formParams.saveButton) === null || _h === void 0 ? void 0 : _h.text) || { key: 've.common.confirm', fallback: 'Confirm' } }), cancelButton: Object.assign(Object.assign({}, (formParams.cancelButton || {})), { text: promptParams.cancelText || ((_j = formParams.cancelButton) === null || _j === void 0 ? void 0 : _j.text) || { key: 've.common.cancel', fallback: 'Cancel' } }) }), Object.assign(Object.assign({}, formOptions), { master: workingMaster, children: (() => { var _a; return hasCustomChildren ? (((_a = promptOptions.children) === null || _a === void 0 ? void 0 : _a.call(promptOptions)) || []) : (field ? [field] : []); }) }));
            let dialog;
            return new Promise((resolve) => {
                var _a;
                Dialogs.promptResolver = resolve;
                dialog = new DialogForm({
                    persistent: (_a = dialogParams.persistent) !== null && _a !== void 0 ? _a : true,
                    mode: dialogParams.mode || 'create',
                    fullscreen: dialogParams.fullscreen,
                    invisible: dialogParams.invisible,
                    objectType: dialogParams.objectType,
                    objectId: dialogParams.objectId,
                    ref: dialogParams.ref,
                    closeOnSave: false,
                }, Object.assign(Object.assign({}, dialogOptions), { master: workingMaster, form: () => __awaiter(this, void 0, void 0, function* () { return form; }), saved: () => __awaiter(this, void 0, void 0, function* () {
                        if (dialogOptions.saved) {
                            yield dialogOptions.saved();
                        }
                        const result = hasCustomChildren ? workingMaster.$data : workingMaster.$get(storageKey);
                        yield dialog.hide();
                        yield Dialogs.closePrompt(result);
                    }), cancel: () => __awaiter(this, void 0, void 0, function* () {
                        if (dialogOptions.cancel) {
                            yield dialogOptions.cancel();
                        }
                        yield dialog.hide();
                        yield Dialogs.closePrompt(undefined);
                    }) }));
                Dialogs.promptForm.value = markRaw(dialog);
                Dialogs.promptVersion.value += 1;
                dialog.show();
            });
        });
    }
    static installConfirmKeydownHandler() {
        if (typeof window === 'undefined' || Dialogs.confirmKeydownHandler) {
            return;
        }
        Dialogs.confirmKeydownHandler = (ev) => {
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
    static removeConfirmKeydownHandler() {
        if (typeof window !== 'undefined' && Dialogs.confirmKeydownHandler) {
            window.removeEventListener('keydown', Dialogs.confirmKeydownHandler, true);
            Dialogs.confirmKeydownHandler = undefined;
        }
    }
    static $error(text) {
        Dialogs.errorText.value = text;
        Dialogs.errorDialog.value = true;
    }
    static $success(text) {
        Dialogs.successText.value = text;
        Dialogs.successDialog.value = true;
    }
    static $warning(text) {
        Dialogs.warningText.value = text;
        Dialogs.warningDialog.value = true;
    }
    static $showProgress({ value, text }) {
        if (value || value === 0) {
            Dialogs.progressIndeterminate.value = false;
            Dialogs.progressValue.value = value < 0 ? 0 : (value > 100 ? 100 : value);
        }
        else {
            Dialogs.progressIndeterminate.value = true;
            Dialogs.progressValue.value = undefined;
        }
        Dialogs.progressText.value = text || '';
        Dialogs.progressDialog.value = true;
    }
    static $updateProgress({ value, text }) {
        if (value || value === 0) {
            Dialogs.progressIndeterminate.value = false;
            Dialogs.progressValue.value = value < 0 ? 0 : (value > 100 ? 100 : value);
        }
        if (text || text === '')
            Dialogs.progressText.value = text || '';
        Dialogs.progressDialog.value = true;
    }
    static $hideProgress() {
        Dialogs.progressDialog.value = false;
    }
    static closePrompt(value) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static createPromptMaster(source) {
        const master = new Master({
            type: source === null || source === void 0 ? void 0 : source.$type,
            id: source === null || source === void 0 ? void 0 : source.$id,
            idField: source === null || source === void 0 ? void 0 : source.$idField,
            parent: source === null || source === void 0 ? void 0 : source.$parent,
        });
        if (source) {
            master.$data = Dialogs.clonePromptData(source.$data);
        }
        return master;
    }
    static clonePromptData(value) {
        if (typeof globalThis.structuredClone === 'function') {
            return globalThis.structuredClone(value);
        }
        try {
            return JSON.parse(JSON.stringify(value));
        }
        catch (_error) {
            return value;
        }
    }
    static createDocumentPreviewRenderSrc(src) {
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
    static releaseDocumentPreviewObjectUrl() {
        if (!Dialogs.documentPreviewObjectUrl) {
            return;
        }
        URL.revokeObjectURL(Dialogs.documentPreviewObjectUrl);
        Dialogs.documentPreviewObjectUrl = undefined;
    }
    static decodeDataUrl(src) {
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
Dialogs.confirmDialog = ref(false);
Dialogs.infoDialog = ref(false);
Dialogs.successDialog = ref(false);
Dialogs.errorDialog = ref(false);
Dialogs.warningDialog = ref(false);
Dialogs.progressDialog = ref(false);
Dialogs.imagePreviewDialog = ref(false);
Dialogs.documentPreviewDialog = ref(false);
Dialogs.confirmTitle = ref('');
Dialogs.confirmText = ref('');
Dialogs.infoTitle = ref('');
Dialogs.infoText = ref('');
Dialogs.infoWidth = ref(0);
Dialogs.infoHeight = ref(0);
Dialogs.successText = ref('');
Dialogs.errorText = ref('');
Dialogs.warningText = ref('');
Dialogs.progressValue = ref(0);
Dialogs.progressText = ref('');
Dialogs.progressIndeterminate = ref(true);
Dialogs.imagePreviewSrc = ref('');
Dialogs.imagePreviewTitle = ref(undefined);
Dialogs.imagePreviewFullscreen = ref(true);
Dialogs.documentPreviewSrc = ref('');
Dialogs.documentPreviewSrcdoc = ref('');
Dialogs.documentPreviewRenderSrc = ref('');
Dialogs.documentPreviewOpenUrl = ref('');
Dialogs.documentPreviewDownloadUrl = ref('');
Dialogs.documentPreviewPrependActions = ref(false);
Dialogs.documentPreviewSkin = ref('inherit');
Dialogs.documentPreviewWidth = ref(undefined);
Dialogs.documentPreviewMaxWidth = ref(undefined);
Dialogs.documentPreviewHeight = ref(undefined);
Dialogs.documentPreviewScrim = ref('');
Dialogs.documentPreviewBackgroundColor = ref('');
Dialogs.documentPreviewToolbarBackground = ref('');
Dialogs.documentPreviewContentBackground = ref('');
Dialogs.documentPreviewTextColor = ref('');
Dialogs.documentPreviewCardStyle = ref(undefined);
Dialogs.documentPreviewToolbarStyle = ref(undefined);
Dialogs.documentPreviewFrameStyle = ref(undefined);
Dialogs.documentPreviewActions = ref([]);
Dialogs.documentPreviewTitle = ref(undefined);
Dialogs.documentPreviewFullscreen = ref(true);
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.infoClose = null;
Dialogs.rootMounted = false;
Dialogs.promptForm = shallowRef();
Dialogs.promptVersion = ref(0);
Dialogs.options = ref({});
