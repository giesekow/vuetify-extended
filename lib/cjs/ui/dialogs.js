"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialogs = void 0;
const vue_1 = require("vue");
const components_1 = require("vuetify/components");
const master_1 = require("../master");
const button_1 = require("./button");
const runtime_1 = require("./runtime");
class Dialogs {
    static setOptions(options) {
        Dialogs.options.value = Object.assign(Object.assign({}, Dialogs.options.value), options);
    }
    static setConfirmDefault(value, reset) {
        Dialogs.confirmDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.confirmDefaults), value);
    }
    static setInfoDefault(value, reset) {
        Dialogs.infoDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.infoDefaults), value);
    }
    static setPromptDefault(value, reset) {
        if (reset) {
            Dialogs.promptDefaults = Dialogs.mergePromptParams({}, value);
            return;
        }
        Dialogs.promptDefaults = Dialogs.mergePromptParams(Dialogs.promptDefaults, value);
    }
    static setImagePreviewDefault(value, reset) {
        Dialogs.imagePreviewDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.imagePreviewDefaults), value);
    }
    static setIframeDefault(value, reset) {
        Dialogs.iframeDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.iframeDefaults), value);
    }
    static setDocumentPreviewDefault(value, reset) {
        Dialogs.documentPreviewDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.documentPreviewDefaults), value);
    }
    static setFilePreviewDefault(value, reset) {
        Dialogs.filePreviewDefaults = reset ? Object.assign({}, value) : Object.assign(Object.assign({}, Dialogs.filePreviewDefaults), value);
    }
    static get rootIsMounted() {
        return Dialogs.rootMounted;
    }
    static rootComponent() {
        return (0, vue_1.defineComponent)({
            name: 'VuetifyExtendedDialogs',
            setup: () => {
                (0, vue_1.onMounted)(() => {
                    Dialogs.rootMounted = true;
                });
                (0, vue_1.onUnmounted)(() => {
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
                    (0, vue_1.h)(ConfirmDialog),
                    (0, vue_1.h)(InfoDialog),
                    (0, vue_1.h)(PromptDialog),
                    (0, vue_1.h)(ImagePreviewDialog),
                    (0, vue_1.h)(IframeDialog),
                    (0, vue_1.h)(SuccessSnackbar),
                    (0, vue_1.h)(ErrorSnackbar),
                    (0, vue_1.h)(WarningSnackbar),
                    (0, vue_1.h)(ProgressOverlay),
                ];
            },
        });
    }
    static confirmComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => {
                    var _a, _b;
                    return (0, vue_1.h)(components_1.VDialog, {
                        modelValue: Dialogs.confirmDialog.value,
                        persistent: true,
                        width: Dialogs.confirmParams.value.width,
                        maxWidth: (_a = Dialogs.confirmParams.value.maxWidth) !== null && _a !== void 0 ? _a : (Dialogs.confirmParams.value.width === undefined ? 300 : undefined),
                        minWidth: Dialogs.confirmParams.value.minWidth,
                        height: Dialogs.confirmParams.value.height,
                        maxHeight: (_b = Dialogs.confirmParams.value.maxHeight) !== null && _b !== void 0 ? _b : (Dialogs.confirmParams.value.height === undefined ? 200 : undefined),
                        minHeight: Dialogs.confirmParams.value.minHeight,
                    }, () => (0, vue_1.h)(components_1.VCard, {
                        style: Dialogs.confirmParams.value.height !== undefined ? { height: '100%' } : undefined,
                    }, () => [
                        (0, vue_1.h)(components_1.VCardTitle, {}, () => (0, runtime_1.resolveUIText)(Dialogs.confirmTitle.value)),
                        (0, vue_1.h)(components_1.VCardText, {}, () => (0, runtime_1.resolveUIText)(Dialogs.confirmText.value)),
                        (0, vue_1.h)(components_1.VCardActions, {}, () => [
                            (0, vue_1.h)(components_1.VSpacer),
                            (0, vue_1.h)(components_1.VBtn, {
                                color: 'error',
                                onClick: () => {
                                    if (Dialogs.confirmNo)
                                        Dialogs.confirmNo();
                                }
                            }, () => (0, runtime_1.resolveUIText)({ key: 've.common.no', fallback: 'No' })),
                            (0, vue_1.h)(components_1.VBtn, {
                                color: 'success',
                                onClick: () => {
                                    if (Dialogs.confirmYes)
                                        Dialogs.confirmYes();
                                }
                            }, () => (0, runtime_1.resolveUIText)({ key: 've.common.yes', fallback: 'Yes' }))
                        ])
                    ]));
                };
            },
        });
    }
    static infoComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => {
                    var _a, _b, _c, _d;
                    return (0, vue_1.h)(components_1.VDialog, {
                        modelValue: Dialogs.infoDialog.value,
                        persistent: true,
                        width: (_b = (_a = Dialogs.infoParams.value.width) !== null && _a !== void 0 ? _a : Dialogs.options.value.infoWindowWidth) !== null && _b !== void 0 ? _b : 400,
                        maxWidth: Dialogs.infoParams.value.maxWidth,
                        minWidth: Dialogs.infoParams.value.minWidth,
                        height: Dialogs.infoParams.value.height,
                        maxHeight: (_c = Dialogs.infoParams.value.maxHeight) !== null && _c !== void 0 ? _c : (Dialogs.infoParams.value.height === undefined ? ((_d = Dialogs.options.value.infoWindowHeight) !== null && _d !== void 0 ? _d : 300) : undefined),
                        minHeight: Dialogs.infoParams.value.minHeight,
                    }, () => (0, vue_1.h)(components_1.VCard, {
                        style: Dialogs.infoParams.value.height !== undefined ? { height: '100%' } : undefined,
                    }, () => [
                        (0, vue_1.h)(components_1.VCardTitle, {}, () => (0, runtime_1.resolveUIText)(Dialogs.infoTitle.value)),
                        (0, vue_1.h)(components_1.VCardText, {}, () => (0, runtime_1.resolveUIText)(Dialogs.infoText.value)),
                        (0, vue_1.h)(components_1.VCardActions, {}, () => [
                            (0, vue_1.h)(components_1.VSpacer),
                            (0, vue_1.h)(components_1.VBtn, {
                                color: 'success',
                                onClick: () => {
                                    if (Dialogs.infoClose)
                                        Dialogs.infoClose();
                                }
                            }, () => (0, runtime_1.resolveUIText)({ key: 've.common.close', fallback: 'Close' }))
                        ])
                    ]));
                };
            },
        });
    }
    static promptComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: () => {
                return () => {
                    const form = Dialogs.promptForm.value;
                    if (!form) {
                        return undefined;
                    }
                    return (0, vue_1.h)(form.component, {
                        key: Dialogs.promptVersion.value,
                    });
                };
            },
        });
    }
    static imagePreviewComponent() {
        return (0, vue_1.defineComponent)({
            name: 'VuetifyExtendedImagePreview',
            setup: () => {
                const scale = (0, vue_1.ref)(1);
                const translateX = (0, vue_1.ref)(0);
                const translateY = (0, vue_1.ref)(0);
                const dragging = (0, vue_1.ref)(false);
                const lastPointerX = (0, vue_1.ref)(0);
                const lastPointerY = (0, vue_1.ref)(0);
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
                    Dialogs.closeImagePreview();
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
                (0, vue_1.watch)(() => [Dialogs.imagePreviewDialog.value, Dialogs.imagePreviewSrc.value], ([open]) => {
                    if (open) {
                        resetView();
                    }
                }, { immediate: true });
                (0, vue_1.onMounted)(() => {
                    window.addEventListener('pointermove', onPointerMove, true);
                    window.addEventListener('pointerup', onPointerUp, true);
                    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
                    window.addEventListener('keydown', onKeydown, true);
                });
                (0, vue_1.onUnmounted)(() => {
                    window.removeEventListener('pointermove', onPointerMove, true);
                    window.removeEventListener('pointerup', onPointerUp, true);
                    window.removeEventListener('wheel', onWheel, true);
                    window.removeEventListener('keydown', onKeydown, true);
                });
                return () => {
                    var _a, _b, _c;
                    return (0, vue_1.h)(components_1.VDialog, Object.assign(Object.assign({ modelValue: Dialogs.imagePreviewDialog.value, fullscreen: Dialogs.imagePreviewFullscreen.value, width: Dialogs.imagePreviewFullscreen.value ? undefined : ((_a = Dialogs.imagePreviewParams.value.width) !== null && _a !== void 0 ? _a : 1100), maxWidth: Dialogs.imagePreviewFullscreen.value ? undefined : ((_b = Dialogs.imagePreviewParams.value.maxWidth) !== null && _b !== void 0 ? _b : '92vw'), minWidth: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.minWidth, height: Dialogs.imagePreviewFullscreen.value ? undefined : ((_c = Dialogs.imagePreviewParams.value.height) !== null && _c !== void 0 ? _c : '88vh'), maxHeight: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.maxHeight, minHeight: Dialogs.imagePreviewFullscreen.value ? undefined : Dialogs.imagePreviewParams.value.minHeight, persistent: false }, (Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value).scrim
                        ? { scrim: Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value).scrim }
                        : {})), { transition: 'dialog-bottom-transition', "onUpdate:modelValue": (v) => {
                            if (v) {
                                Dialogs.imagePreviewDialog.value = true;
                            }
                            else {
                                Dialogs.closeImagePreview();
                            }
                            if (!v) {
                                resetView();
                            }
                        } }), () => {
                        const theme = Dialogs.resolvePreviewTheme(Dialogs.imagePreviewParams.value);
                        const builtInActions = Dialogs.buildPreviewActions(Dialogs.imagePreviewOpenUrl.value, Dialogs.imagePreviewDownloadUrl.value, Dialogs.imagePreviewFileName.value, Dialogs.imagePreviewTitle.value);
                        const customActions = (Dialogs.imagePreviewActions.value || []).filter((button) => !!button);
                        const menuActions = (Dialogs.imagePreviewPrependActions.value
                            ? customActions.concat(builtInActions)
                            : builtInActions.concat(customActions)).filter((button) => !!button && !!button.component);
                        return (0, vue_1.h)(components_1.VCard, {
                            style: Object.assign({ background: theme.cardBackground, color: theme.textColor, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }, (Dialogs.imagePreviewParams.value.cardStyle || {})),
                        }, () => [
                            (0, vue_1.h)('div', {
                                style: Object.assign({ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: `1px solid ${theme.toolbarBorderColor}`, background: theme.toolbarBackground, color: theme.textColor }, (Dialogs.imagePreviewParams.value.toolbarStyle || {})),
                            }, [
                                (0, vue_1.h)('div', {
                                    style: {
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: '1 1 auto',
                                    },
                                }, (0, runtime_1.resolveUIText)(Dialogs.imagePreviewTitle.value, (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.imageTitle', fallback: 'Image Preview' }))),
                                (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.zoomOut', fallback: 'Zoom out' }), onClick: () => zoomBy(-0.2) }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-magnify-minus-outline')),
                                (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.resetZoom', fallback: 'Reset zoom' }), onClick: () => resetView() }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-fit-to-screen-outline')),
                                (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.zoomIn', fallback: 'Zoom in' }), onClick: () => zoomBy(0.2) }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-magnify-plus-outline')),
                                ...(menuActions.length ? [
                                    (0, vue_1.h)(components_1.VMenu, {
                                        location: 'bottom end',
                                        closeOnContentClick: true,
                                    }, {
                                        activator: ({ props: activatorProps }) => (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign(Object.assign(Object.assign({}, activatorProps), { icon: true, variant: 'text' }), (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.moreActions', fallback: 'More actions' }) }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-dots-vertical')),
                                        default: () => (0, vue_1.h)(components_1.VCard, {
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
                                        }, () => (0, vue_1.h)(components_1.VCardText, {
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
                                            return (0, vue_1.h)('div', {
                                                key: `image-preview-action-${index}`,
                                                style: {
                                                    display: 'flex',
                                                    width: '100%',
                                                },
                                            }, [
                                                (0, vue_1.h)(button.component, {
                                                    color: buttonParams.color || theme.actionColor || undefined,
                                                    variant: buttonParams.variant || 'text',
                                                    style: {
                                                        width: '100%',
                                                        justifyContent: 'flex-start',
                                                    },
                                                }),
                                            ]);
                                        }))),
                                    }),
                                ] : []),
                                (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }), onClick: () => close() }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-close')),
                            ]),
                            (0, vue_1.h)('div', {
                                style: Object.assign({ position: 'relative', flex: '1 1 auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.contentBackground, cursor: scale.value > 1 ? (dragging.value ? 'grabbing' : 'grab') : 'default', userSelect: 'none', touchAction: 'none' }, (Dialogs.imagePreviewParams.value.frameStyle || {})),
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
                                (0, vue_1.h)('img', {
                                    src: Dialogs.imagePreviewSrc.value,
                                    alt: (0, runtime_1.resolveUIText)(Dialogs.imagePreviewTitle.value, (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.imageAlt', fallback: 'Image preview' })),
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
                                (0, vue_1.h)('div', {
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
                                }, `${Math.round(scale.value * 100)}%`),
                            ]),
                        ]);
                    });
                };
            },
        });
    }
    static iframeComponent() {
        return (0, vue_1.defineComponent)({
            name: 'VuetifyExtendedIframePreview',
            setup: () => {
                const close = () => {
                    Dialogs.closeDocumentPreview();
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
                (0, vue_1.onMounted)(() => {
                    window.addEventListener('keydown', onKeydown, true);
                });
                (0, vue_1.onUnmounted)(() => {
                    window.removeEventListener('keydown', onKeydown, true);
                });
                return () => {
                    var _a, _b, _c;
                    return (0, vue_1.h)(components_1.VDialog, Object.assign(Object.assign({ modelValue: Dialogs.documentPreviewDialog.value, fullscreen: Dialogs.documentPreviewFullscreen.value, width: Dialogs.documentPreviewFullscreen.value ? undefined : ((_a = Dialogs.documentPreviewWidth.value) !== null && _a !== void 0 ? _a : 1100), maxWidth: Dialogs.documentPreviewFullscreen.value ? undefined : ((_b = Dialogs.documentPreviewMaxWidth.value) !== null && _b !== void 0 ? _b : '92vw'), minWidth: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMinWidth.value, height: Dialogs.documentPreviewFullscreen.value ? undefined : ((_c = Dialogs.documentPreviewHeight.value) !== null && _c !== void 0 ? _c : '88vh'), maxHeight: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMaxHeight.value, minHeight: Dialogs.documentPreviewFullscreen.value ? undefined : Dialogs.documentPreviewMinHeight.value, persistent: false }, (Dialogs.resolveDocumentPreviewTheme().scrim
                        ? { scrim: Dialogs.resolveDocumentPreviewTheme().scrim }
                        : {})), { transition: 'dialog-bottom-transition', "onUpdate:modelValue": (v) => {
                            if (v) {
                                Dialogs.documentPreviewDialog.value = true;
                            }
                            else {
                                Dialogs.closeDocumentPreview();
                            }
                        } }), () => {
                        const theme = Dialogs.resolveDocumentPreviewTheme();
                        const builtInActions = Dialogs.buildPreviewActions(Dialogs.documentPreviewOpenUrl.value || Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value, Dialogs.documentPreviewDownloadUrl.value || Dialogs.documentPreviewSrc.value, Dialogs.documentPreviewFileName.value, Dialogs.documentPreviewTitle.value);
                        const customActions = (Dialogs.documentPreviewActions.value || []).filter((button) => !!button);
                        const menuActions = (Dialogs.documentPreviewPrependActions.value
                            ? customActions.concat(builtInActions)
                            : builtInActions.concat(customActions)).filter((button) => !!button && !!button.component);
                        return (0, vue_1.h)(components_1.VCard, {
                            style: Object.assign({ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: theme.cardBackground, color: theme.textColor }, (Dialogs.documentPreviewCardStyle.value || {})),
                        }, () => [
                            (0, vue_1.h)('div', {
                                style: Object.assign({ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderBottom: `1px solid ${theme.toolbarBorderColor}`, background: theme.toolbarBackground, color: theme.textColor }, (Dialogs.documentPreviewToolbarStyle.value || {})),
                            }, [
                                (0, vue_1.h)('div', {
                                    style: {
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        flex: '1 1 auto',
                                        color: theme.textColor,
                                    },
                                }, (0, runtime_1.resolveUIText)(Dialogs.documentPreviewTitle.value, (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.title', fallback: 'Preview' }))),
                                ...(menuActions.length ? [
                                    (0, vue_1.h)(components_1.VMenu, {
                                        location: 'bottom end',
                                        closeOnContentClick: true,
                                    }, {
                                        activator: ({ props: activatorProps }) => (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign(Object.assign(Object.assign({}, activatorProps), { icon: true, variant: 'text' }), (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.moreActions', fallback: 'More actions' }) }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-dots-vertical')),
                                        default: () => (0, vue_1.h)(components_1.VCard, {
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
                                        }, () => (0, vue_1.h)(components_1.VCardText, {
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
                                            return (0, vue_1.h)('div', {
                                                key: `iframe-action-${index}`,
                                                style: {
                                                    display: 'flex',
                                                    width: '100%',
                                                },
                                            }, [
                                                (0, vue_1.h)(button.component, {
                                                    color: buttonParams.color || theme.actionColor || undefined,
                                                    variant: buttonParams.variant || 'text',
                                                    style: {
                                                        width: '100%',
                                                        justifyContent: 'flex-start',
                                                    },
                                                }),
                                            ]);
                                        }))),
                                    }),
                                ] : []),
                                (0, vue_1.h)(components_1.VBtn, Object.assign(Object.assign({ icon: true, variant: 'text' }, (theme.actionColor ? { color: theme.actionColor } : {})), { title: (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.closePreview', fallback: 'Close preview' }), onClick: close }), () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-close')),
                            ]),
                            (0, vue_1.h)('div', {
                                style: {
                                    flex: '1 1 auto',
                                    padding: Dialogs.documentPreviewFullscreen.value ? '0' : '8px',
                                    background: theme.contentBackground,
                                },
                            }, Dialogs.documentPreviewFileInfo.value
                                ? [Dialogs.renderUnsupportedFilePreview(Dialogs.documentPreviewFileInfo.value, theme.textColor)]
                                : [
                                    (0, vue_1.h)('iframe', {
                                        src: Dialogs.documentPreviewSrcdoc.value ? undefined : (Dialogs.documentPreviewRenderSrc.value || Dialogs.documentPreviewSrc.value),
                                        srcdoc: Dialogs.documentPreviewSrcdoc.value || undefined,
                                        title: (0, runtime_1.resolveUIText)(Dialogs.documentPreviewTitle.value, (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.title', fallback: 'Preview' })),
                                        style: Object.assign({ width: '100%', height: '100%', border: '0', display: 'block', background: theme.contentBackground, borderRadius: Dialogs.documentPreviewFullscreen.value ? '0' : '12px' }, (Dialogs.documentPreviewFrameStyle.value || {})),
                                    }),
                                ]),
                        ]);
                    });
                };
            },
        });
    }
    static successComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => (0, vue_1.h)(components_1.VSnackbar, {
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
                        (0, vue_1.h)(components_1.VBtn, {
                            color: Dialogs.options.value.successColor === 'white' ? 'success' : 'white',
                            variant: 'text',
                            onClick: () => {
                                Dialogs.successDialog.value = false;
                            }
                        }, () => (0, runtime_1.resolveUIText)({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => (0, runtime_1.resolveUIText)(Dialogs.successText.value)
                });
            },
        });
    }
    static errorComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => (0, vue_1.h)(components_1.VSnackbar, {
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
                        (0, vue_1.h)(components_1.VBtn, {
                            color: Dialogs.options.value.errorColor === 'white' ? 'success' : 'white',
                            variant: 'text',
                            onClick: () => {
                                Dialogs.errorDialog.value = false;
                            }
                        }, () => (0, runtime_1.resolveUIText)({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => (0, runtime_1.resolveUIText)(Dialogs.errorText.value)
                });
            },
        });
    }
    static warningComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => (0, vue_1.h)(components_1.VSnackbar, {
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
                        (0, vue_1.h)(components_1.VBtn, {
                            variant: 'text',
                            onClick: () => {
                                Dialogs.warningDialog.value = false;
                            }
                        }, () => (0, runtime_1.resolveUIText)({ key: 've.common.close', fallback: 'Close' }))
                    ],
                    default: () => (0, runtime_1.resolveUIText)(Dialogs.warningText.value)
                });
            },
        });
    }
    static progressComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => (0, vue_1.h)(components_1.VOverlay, {
                    modelValue: Dialogs.progressDialog.value,
                    persistent: true,
                    height: '100%',
                    width: '100%'
                }, () => (0, vue_1.h)(components_1.VLayout, {
                    fullHeight: true,
                }, () => (0, vue_1.h)(components_1.VRow, {
                    alignContent: 'center',
                }, () => (0, vue_1.h)(components_1.VCol, {
                    align: 'center'
                }, () => [
                    (0, vue_1.h)(components_1.VProgressCircular, {
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
                        (0, vue_1.h)('br'),
                        Dialogs.progressText.value
                    ])
                ]))));
            },
        });
    }
    static $confirm(text, title, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.confirmDefaults), (params || {}));
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
                Dialogs.confirmParams.value = resolvedParams;
                Dialogs.confirmDialog.value = true;
            });
        });
    }
    static $info(text, title, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.infoDefaults), (params || {}));
            return new Promise((resolve) => {
                Dialogs.infoClose = () => {
                    Dialogs.removeConfirmKeydownHandler();
                    Dialogs.infoDialog.value = false;
                    resolve();
                };
                Dialogs.installConfirmKeydownHandler();
                Dialogs.infoText.value = text;
                Dialogs.infoTitle.value = title || { key: 've.dialog.infoTitle', fallback: 'Info' };
                Dialogs.infoParams.value = resolvedParams;
                Dialogs.infoDialog.value = true;
            });
        });
    }
    static hasBlockingDialog() {
        return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value || Dialogs.imagePreviewDialog.value || Dialogs.documentPreviewDialog.value;
    }
    static $imagePreview(src, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Dialogs.openImagePreview(src, params, true);
        });
    }
    static openImagePreview(src, params, invalidatePending = false, expectedRequest) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.imagePreviewDefaults), (params || {}));
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
        });
    }
    static $iframe(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Dialogs.openIframe(params, options, true);
        });
    }
    static openIframe(params, options, invalidatePending = false, expectedRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (invalidatePending) {
                Dialogs.filePreviewRequest += 1;
            }
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.iframeDefaults), (params || {}));
            const resolvedOptions = options || {};
            const actions = (yield ((_a = resolvedOptions.actions) === null || _a === void 0 ? void 0 : _a.call(resolvedOptions, resolvedParams))) || [];
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
                ? actions.filter((button) => !!button).map((button) => (0, vue_1.markRaw)(button))
                : [];
            Dialogs.documentPreviewTitle.value = resolvedParams.title || '';
            Dialogs.documentPreviewFullscreen.value = resolvedParams.fullscreen !== false;
            Dialogs.documentPreviewDialog.value = true;
            return true;
        });
    }
    static $documentPreview(src, params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.documentPreviewDefaults), (params || {}));
            yield Dialogs.$iframe(Object.assign(Object.assign({ src }, resolvedParams), { downloadUrl: src }), options);
        });
    }
    static $previewFile(source, params, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const request = ++Dialogs.filePreviewRequest;
            const resolvedParams = Object.assign(Object.assign({}, Dialogs.filePreviewDefaults), (params || {}));
            const sourceInfo = Dialogs.resolveFilePreviewSource(source, resolvedParams);
            const title = resolvedParams.title
                || sourceInfo.fileName
                || { key: 've.dialog.preview.fileTitle', fallback: 'File Preview' };
            const effectiveParams = Object.assign(Object.assign({}, resolvedParams), { title, mimeType: sourceInfo.mimeType || undefined, fileName: sourceInfo.fileName || undefined, fileSize: sourceInfo.fileSize, openUrl: resolvedParams.openUrl || sourceInfo.url, downloadUrl: resolvedParams.downloadUrl || sourceInfo.url });
            let customActions;
            try {
                customActions = yield ((_a = options === null || options === void 0 ? void 0 : options.actions) === null || _a === void 0 ? void 0 : _a.call(options, effectiveParams));
            }
            catch (error) {
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
                ? customActions.filter((button) => !!button).map((button) => (0, vue_1.markRaw)(button))
                : [];
            const previewKind = Dialogs.resolveFilePreviewKind(sourceInfo.mimeType, sourceInfo.fileName, sourceInfo.url);
            try {
                if (previewKind === 'image') {
                    const opened = yield Dialogs.openImagePreview(sourceInfo.url, effectiveParams, false, request);
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
                const { mimeType: _mimeType, fileName: _fileName, fileSize: _fileSize } = effectiveParams, iframeParams = __rest(effectiveParams, ["mimeType", "fileName", "fileSize"]);
                const iframeOptions = {
                    actions: () => actions,
                };
                const viewerParams = previewKind === 'pdf'
                    ? Object.assign(Object.assign({}, Dialogs.documentPreviewDefaults), iframeParams) : iframeParams;
                if (previewKind === 'pdf' || previewKind === 'iframe' || (options === null || options === void 0 ? void 0 : options.unsupported) === 'iframe') {
                    const opened = yield Dialogs.openIframe(Object.assign(Object.assign({}, viewerParams), { src: sourceInfo.url, openUrl: effectiveParams.openUrl || sourceInfo.url, downloadUrl: effectiveParams.downloadUrl || sourceInfo.url }), iframeOptions, false, request);
                    if (!opened || request !== Dialogs.filePreviewRequest) {
                        Dialogs.revokeObjectUrl(sourceInfo.objectUrl);
                        return;
                    }
                    Dialogs.documentPreviewFileName.value = sourceInfo.fileName;
                    Dialogs.filePreviewObjectUrl = sourceInfo.objectUrl;
                    return;
                }
                if ((options === null || options === void 0 ? void 0 : options.unsupported) === 'download') {
                    Dialogs.downloadPreviewUrl(effectiveParams.downloadUrl || sourceInfo.url, sourceInfo.fileName, title);
                    if (sourceInfo.objectUrl) {
                        const objectUrl = sourceInfo.objectUrl;
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
                    }
                    return;
                }
                const opened = yield Dialogs.openIframe(Object.assign(Object.assign({}, iframeParams), { src: '', openUrl: effectiveParams.openUrl || sourceInfo.url, downloadUrl: effectiveParams.downloadUrl || sourceInfo.url }), iframeOptions, false, request);
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
            }
            catch (error) {
                if (sourceInfo.objectUrl) {
                    URL.revokeObjectURL(sourceInfo.objectUrl);
                }
                throw error;
            }
        });
    }
    static $prompt(params, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __awaiter(this, void 0, void 0, function* () {
            const request = ++Dialogs.promptRequest;
            const promptParams = Dialogs.resolvePromptParams(params);
            const promptOptions = options || {};
            const returnFocus = Dialogs.promptReturnFocus || Dialogs.captureActiveElement();
            if (Dialogs.promptResolver) {
                // A replacement prompt inherits the original external focus target.
                yield Dialogs.closePrompt(undefined, Dialogs.promptForm.value, false);
            }
            const [{ DialogForm }, { Form }, { Field }] = yield Promise.all([
                Promise.resolve().then(() => __importStar(require('./dialogform'))),
                Promise.resolve().then(() => __importStar(require('./form'))),
                Promise.resolve().then(() => __importStar(require('./field'))),
            ]);
            if (request !== Dialogs.promptRequest)
                return undefined;
            const workingMaster = Dialogs.createPromptMaster(promptOptions.master);
            const hasCustomChildren = typeof promptOptions.children === 'function';
            const resolvedFieldParams = promptParams.fieldParams || {};
            const storageKey = resolvedFieldParams.storage || '__promptValue';
            const dialogParams = promptParams.dialogParams || {};
            const formParams = promptParams.formParams || {};
            const formOptions = promptOptions.formOptions || {};
            const dialogOptions = promptOptions.dialogOptions || {};
            const field = !hasCustomChildren ? new Field(Object.assign({ type: resolvedFieldParams.type || promptParams.type || 'text', label: resolvedFieldParams.label || { key: 've.dialog.promptValue', fallback: 'Value' }, storage: storageKey, autofocus: (_a = resolvedFieldParams.autofocus) !== null && _a !== void 0 ? _a : true, cols: (_b = resolvedFieldParams.cols) !== null && _b !== void 0 ? _b : 12 }, resolvedFieldParams), promptOptions.fieldOptions) : undefined;
            const form = new Form(Object.assign(Object.assign({}, formParams), { auto: true, sub: true, hideMode: (_c = formParams.hideMode) !== null && _c !== void 0 ? _c : true, mode: dialogParams.mode || formParams.mode || 'create', title: (_e = (_d = promptParams.title) !== null && _d !== void 0 ? _d : formParams.title) !== null && _e !== void 0 ? _e : { key: 've.dialog.promptTitle', fallback: 'Prompt' }, subtitle: (_f = promptParams.text) !== null && _f !== void 0 ? _f : formParams.subtitle, width: (_h = (_g = formParams.width) !== null && _g !== void 0 ? _g : promptParams.width) !== null && _h !== void 0 ? _h : (hasCustomChildren ? 760 : 520), maxWidth: (_j = formParams.maxWidth) !== null && _j !== void 0 ? _j : promptParams.maxWidth, minWidth: (_k = formParams.minWidth) !== null && _k !== void 0 ? _k : promptParams.minWidth, maxHeight: (_m = (_l = formParams.maxHeight) !== null && _l !== void 0 ? _l : promptParams.height) !== null && _m !== void 0 ? _m : promptParams.maxHeight, minHeight: (_p = (_o = formParams.minHeight) !== null && _o !== void 0 ? _o : promptParams.height) !== null && _p !== void 0 ? _p : promptParams.minHeight, saveButton: Object.assign(Object.assign({}, (formParams.saveButton || {})), { text: promptParams.confirmText || ((_q = formParams.saveButton) === null || _q === void 0 ? void 0 : _q.text) || { key: 've.common.confirm', fallback: 'Confirm' } }), cancelButton: Object.assign(Object.assign({}, (formParams.cancelButton || {})), { text: promptParams.cancelText || ((_r = formParams.cancelButton) === null || _r === void 0 ? void 0 : _r.text) || { key: 've.common.cancel', fallback: 'Cancel' } }) }), Object.assign(Object.assign({}, formOptions), { master: workingMaster, children: (() => { var _a; return hasCustomChildren ? (((_a = promptOptions.children) === null || _a === void 0 ? void 0 : _a.call(promptOptions)) || []) : (field ? [field] : []); }) }));
            let dialog;
            return new Promise((resolve) => {
                var _a, _b, _c, _d, _e, _f, _g;
                Dialogs.promptResolver = resolve;
                Dialogs.promptReturnFocus = returnFocus;
                dialog = new DialogForm({
                    persistent: (_a = dialogParams.persistent) !== null && _a !== void 0 ? _a : true,
                    mode: dialogParams.mode || 'create',
                    fullscreen: dialogParams.fullscreen,
                    width: (_b = promptParams.width) !== null && _b !== void 0 ? _b : dialogParams.width,
                    maxWidth: (_c = promptParams.maxWidth) !== null && _c !== void 0 ? _c : dialogParams.maxWidth,
                    minWidth: (_d = promptParams.minWidth) !== null && _d !== void 0 ? _d : dialogParams.minWidth,
                    height: (_e = promptParams.height) !== null && _e !== void 0 ? _e : dialogParams.height,
                    maxHeight: (_f = promptParams.maxHeight) !== null && _f !== void 0 ? _f : dialogParams.maxHeight,
                    minHeight: (_g = promptParams.minHeight) !== null && _g !== void 0 ? _g : dialogParams.minHeight,
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
                        yield Dialogs.closePrompt(result, dialog);
                    }), cancel: () => __awaiter(this, void 0, void 0, function* () {
                        if (dialogOptions.cancel) {
                            yield dialogOptions.cancel();
                        }
                        yield Dialogs.closePrompt(undefined, dialog);
                    }) }));
                Dialogs.promptForm.value = (0, vue_1.markRaw)(dialog);
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
    static closePrompt(value, dialog = Dialogs.promptForm.value, restoreFocus = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dialog !== Dialogs.promptForm.value)
                return;
            const resolve = Dialogs.promptResolver;
            const returnFocus = Dialogs.promptReturnFocus;
            yield (dialog === null || dialog === void 0 ? void 0 : dialog.hide());
            // A superseded callback must never tear down a newer prompt.
            if (dialog !== Dialogs.promptForm.value || resolve !== Dialogs.promptResolver)
                return;
            Dialogs.promptForm.value = undefined;
            Dialogs.promptVersion.value += 1;
            Dialogs.promptResolver = undefined;
            Dialogs.promptReturnFocus = undefined;
            if (dialog) {
                dialog.removeEventListeners();
                dialog.clearListeners();
            }
            if (restoreFocus) {
                yield Dialogs.restorePromptFocus(returnFocus);
            }
            if (resolve) {
                resolve(value);
            }
        });
    }
    static captureActiveElement() {
        if (typeof document === 'undefined' || typeof HTMLElement === 'undefined') {
            return undefined;
        }
        const active = document.activeElement;
        return active instanceof HTMLElement && active !== document.body ? active : undefined;
    }
    static restorePromptFocus(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!target)
                return;
            yield (0, vue_1.nextTick)();
            if (target.isConnected && typeof target.focus === 'function') {
                target.focus({ preventScroll: true });
            }
        });
    }
    static resolvePromptParams(params) {
        return Dialogs.mergePromptParams(Dialogs.promptDefaults, params || {});
    }
    static mergePromptParams(base, override) {
        const resolved = Object.assign(Object.assign({}, base), override);
        if (base.fieldParams || override.fieldParams) {
            resolved.fieldParams = Object.assign(Object.assign({}, (base.fieldParams || {})), (override.fieldParams || {}));
        }
        if (base.formParams || override.formParams) {
            resolved.formParams = Object.assign(Object.assign({}, (base.formParams || {})), (override.formParams || {}));
        }
        if (base.dialogParams || override.dialogParams) {
            resolved.dialogParams = Object.assign(Object.assign({}, (base.dialogParams || {})), (override.dialogParams || {}));
        }
        return resolved;
    }
    static createPromptMaster(source) {
        const master = new master_1.Master({
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
    static resolvePreviewTheme(params) {
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
    static resolveDocumentPreviewTheme() {
        return Dialogs.resolvePreviewTheme({
            skin: Dialogs.documentPreviewSkin.value,
            scrim: Dialogs.documentPreviewScrim.value,
            backgroundColor: Dialogs.documentPreviewBackgroundColor.value,
            toolbarBackground: Dialogs.documentPreviewToolbarBackground.value,
            contentBackground: Dialogs.documentPreviewContentBackground.value,
            textColor: Dialogs.documentPreviewTextColor.value,
        });
    }
    static closeImagePreview() {
        Dialogs.filePreviewRequest += 1;
        Dialogs.imagePreviewDialog.value = false;
        Dialogs.releaseFilePreviewObjectUrl();
    }
    static closeDocumentPreview() {
        Dialogs.filePreviewRequest += 1;
        Dialogs.documentPreviewDialog.value = false;
        Dialogs.releaseDocumentPreviewObjectUrl();
        Dialogs.releaseFilePreviewObjectUrl();
        Dialogs.documentPreviewFileInfo.value = undefined;
    }
    static buildPreviewActions(openUrl, downloadUrl, fileName, title) {
        const actions = [];
        if (openUrl) {
            actions.push((0, vue_1.markRaw)(new button_1.Button({
                text: { key: 've.common.open', fallback: 'Open' },
                icon: 'mdi-open-in-new',
                variant: 'text',
            }, {
                onClicked: () => {
                    Dialogs.openPreviewUrl(openUrl);
                },
            })));
        }
        if (downloadUrl) {
            actions.push((0, vue_1.markRaw)(new button_1.Button({
                text: { key: 've.common.download', fallback: 'Download' },
                icon: 'mdi-download',
                variant: 'text',
            }, {
                onClicked: () => {
                    Dialogs.downloadPreviewUrl(downloadUrl, fileName, title);
                },
            })));
        }
        return actions;
    }
    static openPreviewUrl(url) {
        if (typeof window === 'undefined' || !url) {
            return;
        }
        window.open(url, '_blank', 'noopener');
    }
    static downloadPreviewUrl(url, fileName, title) {
        if (typeof document === 'undefined' || !url) {
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName
            || (0, runtime_1.resolveUIText)(title, (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.documentFallback', fallback: 'document' }));
        link.target = '_blank';
        link.rel = 'noopener';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    static resolveFilePreviewSource(source, params) {
        var _a;
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
            fileSize: (_a = params.fileSize) !== null && _a !== void 0 ? _a : source.size,
        };
    }
    static resolveFilePreviewKind(mimeType, fileName, source) {
        const normalizedMimeType = Dialogs.normalizeMimeType(mimeType);
        if (normalizedMimeType.startsWith('image/')) {
            return 'image';
        }
        if (normalizedMimeType === 'application/pdf') {
            return 'pdf';
        }
        if (normalizedMimeType.startsWith('text/')
            || normalizedMimeType.startsWith('audio/')
            || normalizedMimeType.startsWith('video/')
            || [
                'application/json',
                'application/xml',
                'application/xhtml+xml',
            ].includes(normalizedMimeType)) {
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
    static normalizeMimeType(mimeType) {
        return String(mimeType || '').split(';', 1)[0].trim().toLowerCase();
    }
    static mimeTypeFromSource(source, fileName) {
        var _a;
        const dataMimeType = (_a = source.match(/^data:([^;,]+)/i)) === null || _a === void 0 ? void 0 : _a[1];
        return Dialogs.normalizeMimeType(dataMimeType) || Dialogs.mimeTypeFromFileName(fileName || source);
    }
    static mimeTypeFromFileName(fileName) {
        var _a;
        const cleanName = String(fileName || '').split(/[?#]/, 1)[0].toLowerCase();
        const extension = ((_a = cleanName.match(/\.([a-z0-9]+)$/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
        const mimeTypes = {
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
    static fileNameFromUrl(source) {
        if (!source || source.startsWith('data:') || source.startsWith('blob:')) {
            return '';
        }
        const cleanSource = source.split(/[?#]/, 1)[0];
        const fileName = cleanSource.slice(cleanSource.lastIndexOf('/') + 1);
        try {
            return decodeURIComponent(fileName);
        }
        catch (_error) {
            return fileName;
        }
    }
    static formatFileSize(size) {
        if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) {
            return (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.unknownSize', fallback: 'Unknown' });
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
    static renderUnsupportedFilePreview(info, textColor) {
        const fileName = info.fileName || (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.unknownFile', fallback: 'Unnamed file' });
        const mimeType = info.mimeType || (0, runtime_1.resolveUIText)({ key: 've.dialog.preview.unknownType', fallback: 'Unknown type' });
        const rows = [
            [{ key: 've.dialog.preview.fileName', fallback: 'File name' }, fileName],
            [{ key: 've.dialog.preview.fileType', fallback: 'File type' }, mimeType],
            [{ key: 've.dialog.preview.fileSize', fallback: 'File size' }, Dialogs.formatFileSize(info.fileSize)],
        ];
        return (0, vue_1.h)('div', {
            style: Object.assign({ width: '100%', height: '100%', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }, (textColor ? { color: textColor } : {})),
        }, [
            (0, vue_1.h)('div', {
                style: {
                    width: 'min(520px, 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'center',
                },
            }, [
                (0, vue_1.h)(components_1.VIcon, { size: 64, color: 'primary' }, () => 'mdi-file-outline'),
                (0, vue_1.h)('div', { style: { fontSize: '1.15rem', fontWeight: '600' } }, (0, runtime_1.resolveUIText)({
                    key: 've.dialog.preview.unavailable',
                    fallback: 'Preview unavailable',
                })),
                (0, vue_1.h)('div', { style: { opacity: '0.76', maxWidth: '440px' } }, (0, runtime_1.resolveUIText)({
                    key: 've.dialog.preview.unavailableDescription',
                    fallback: 'This file type cannot be displayed in the browser. Use Open or Download from the actions menu.',
                })),
                (0, vue_1.h)('div', {
                    style: {
                        width: '100%',
                        marginTop: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'minmax(90px, auto) minmax(0, 1fr)',
                        gap: '8px 16px',
                        textAlign: 'left',
                    },
                }, rows.flatMap(([label, value], index) => [
                    (0, vue_1.h)('div', { key: `file-preview-label-${index}`, style: { fontWeight: '600', opacity: '0.78' } }, (0, runtime_1.resolveUIText)(label)),
                    (0, vue_1.h)('div', {
                        key: `file-preview-value-${index}`,
                        style: { overflowWrap: 'anywhere' },
                    }, value),
                ])),
            ]),
        ]);
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
    static releaseFilePreviewObjectUrl() {
        if (!Dialogs.filePreviewObjectUrl) {
            return;
        }
        URL.revokeObjectURL(Dialogs.filePreviewObjectUrl);
        Dialogs.filePreviewObjectUrl = undefined;
    }
    static revokeObjectUrl(objectUrl) {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }
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
exports.Dialogs = Dialogs;
Dialogs.confirmDialog = (0, vue_1.ref)(false);
Dialogs.infoDialog = (0, vue_1.ref)(false);
Dialogs.successDialog = (0, vue_1.ref)(false);
Dialogs.errorDialog = (0, vue_1.ref)(false);
Dialogs.warningDialog = (0, vue_1.ref)(false);
Dialogs.progressDialog = (0, vue_1.ref)(false);
Dialogs.imagePreviewDialog = (0, vue_1.ref)(false);
Dialogs.documentPreviewDialog = (0, vue_1.ref)(false);
Dialogs.confirmTitle = (0, vue_1.ref)('');
Dialogs.confirmText = (0, vue_1.ref)('');
Dialogs.confirmParams = (0, vue_1.ref)({});
Dialogs.infoTitle = (0, vue_1.ref)('');
Dialogs.infoText = (0, vue_1.ref)('');
Dialogs.infoParams = (0, vue_1.ref)({});
Dialogs.successText = (0, vue_1.ref)('');
Dialogs.errorText = (0, vue_1.ref)('');
Dialogs.warningText = (0, vue_1.ref)('');
Dialogs.progressValue = (0, vue_1.ref)(0);
Dialogs.progressText = (0, vue_1.ref)('');
Dialogs.progressIndeterminate = (0, vue_1.ref)(true);
Dialogs.imagePreviewSrc = (0, vue_1.ref)('');
Dialogs.imagePreviewTitle = (0, vue_1.ref)(undefined);
Dialogs.imagePreviewFullscreen = (0, vue_1.ref)(true);
Dialogs.imagePreviewParams = (0, vue_1.ref)({});
Dialogs.imagePreviewOpenUrl = (0, vue_1.ref)('');
Dialogs.imagePreviewDownloadUrl = (0, vue_1.ref)('');
Dialogs.imagePreviewFileName = (0, vue_1.ref)('');
Dialogs.imagePreviewPrependActions = (0, vue_1.ref)(false);
Dialogs.imagePreviewActions = (0, vue_1.ref)([]);
Dialogs.documentPreviewSrc = (0, vue_1.ref)('');
Dialogs.documentPreviewSrcdoc = (0, vue_1.ref)('');
Dialogs.documentPreviewRenderSrc = (0, vue_1.ref)('');
Dialogs.documentPreviewOpenUrl = (0, vue_1.ref)('');
Dialogs.documentPreviewDownloadUrl = (0, vue_1.ref)('');
Dialogs.documentPreviewFileName = (0, vue_1.ref)('');
Dialogs.documentPreviewPrependActions = (0, vue_1.ref)(false);
Dialogs.documentPreviewSkin = (0, vue_1.ref)('inherit');
Dialogs.documentPreviewWidth = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewMaxWidth = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewMinWidth = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewHeight = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewMaxHeight = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewMinHeight = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewScrim = (0, vue_1.ref)('');
Dialogs.documentPreviewBackgroundColor = (0, vue_1.ref)('');
Dialogs.documentPreviewToolbarBackground = (0, vue_1.ref)('');
Dialogs.documentPreviewContentBackground = (0, vue_1.ref)('');
Dialogs.documentPreviewTextColor = (0, vue_1.ref)('');
Dialogs.documentPreviewCardStyle = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewToolbarStyle = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewFrameStyle = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewActions = (0, vue_1.ref)([]);
Dialogs.documentPreviewTitle = (0, vue_1.ref)(undefined);
Dialogs.documentPreviewFullscreen = (0, vue_1.ref)(true);
Dialogs.documentPreviewFileInfo = (0, vue_1.ref)(undefined);
Dialogs.filePreviewRequest = 0;
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.infoClose = null;
Dialogs.rootMounted = false;
Dialogs.promptForm = (0, vue_1.shallowRef)();
Dialogs.promptVersion = (0, vue_1.ref)(0);
Dialogs.promptRequest = 0;
Dialogs.options = (0, vue_1.ref)({});
Dialogs.confirmDefaults = {};
Dialogs.infoDefaults = {};
Dialogs.promptDefaults = {};
Dialogs.imagePreviewDefaults = {};
Dialogs.iframeDefaults = {};
Dialogs.documentPreviewDefaults = {};
Dialogs.filePreviewDefaults = {};
