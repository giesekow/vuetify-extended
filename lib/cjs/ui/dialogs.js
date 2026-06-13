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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dialogs = void 0;
const vue_1 = require("vue");
const components_1 = require("vuetify/components");
const master_1 = require("../master");
class Dialogs {
    static setOptions(options) {
        Dialogs.options.value = Object.assign(Object.assign({}, Dialogs.options.value), options);
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
                    (0, vue_1.h)(ConfirmDialog),
                    (0, vue_1.h)(InfoDialog),
                    (0, vue_1.h)(PromptDialog),
                    (0, vue_1.h)(ImagePreviewDialog),
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
                return () => (0, vue_1.h)(components_1.VDialog, {
                    modelValue: Dialogs.confirmDialog.value,
                    persistent: true,
                    maxWidth: 300,
                    maxHeight: 200
                }, () => (0, vue_1.h)(components_1.VCard, {}, () => [
                    (0, vue_1.h)(components_1.VCardTitle, {}, () => Dialogs.confirmTitle.value),
                    (0, vue_1.h)(components_1.VCardText, {}, () => Dialogs.confirmText.value),
                    (0, vue_1.h)(components_1.VCardActions, {}, () => [
                        (0, vue_1.h)(components_1.VSpacer),
                        (0, vue_1.h)(components_1.VBtn, {
                            color: 'error',
                            onClick: () => {
                                if (Dialogs.confirmNo)
                                    Dialogs.confirmNo();
                            }
                        }, () => 'No'),
                        (0, vue_1.h)(components_1.VBtn, {
                            color: 'success',
                            onClick: () => {
                                if (Dialogs.confirmYes)
                                    Dialogs.confirmYes();
                            }
                        }, () => 'Yes')
                    ])
                ]));
            },
        });
    }
    static infoComponent() {
        return (0, vue_1.defineComponent)({
            props: [],
            setup: (props, context) => {
                return () => (0, vue_1.h)(components_1.VDialog, {
                    modelValue: Dialogs.infoDialog.value,
                    persistent: true,
                    width: Dialogs.infoWidth.value || Dialogs.options.value.infoWindowWidth || 400,
                    maxHeight: Dialogs.infoHeight.value || Dialogs.options.value.infoWindowHeight || 300
                }, () => (0, vue_1.h)(components_1.VCard, {}, () => [
                    (0, vue_1.h)(components_1.VCardTitle, {}, () => Dialogs.infoTitle.value),
                    (0, vue_1.h)(components_1.VCardText, {}, () => Dialogs.infoText.value),
                    (0, vue_1.h)(components_1.VCardActions, {}, () => [
                        (0, vue_1.h)(components_1.VSpacer),
                        (0, vue_1.h)(components_1.VBtn, {
                            color: 'success',
                            onClick: () => {
                                if (Dialogs.infoClose)
                                    Dialogs.infoClose();
                            }
                        }, () => 'Close')
                    ])
                ]));
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
                return () => (0, vue_1.h)(components_1.VDialog, {
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
                }, () => (0, vue_1.h)(components_1.VCard, {
                    style: {
                        background: '#0f172a',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        height: Dialogs.imagePreviewFullscreen.value ? '100vh' : '88vh',
                        overflow: 'hidden',
                    },
                }, () => [
                    (0, vue_1.h)('div', {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(15, 23, 42, 0.94)',
                        },
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
                        }, Dialogs.imagePreviewTitle.value || 'Image Preview'),
                        (0, vue_1.h)(components_1.VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: 'Zoom out',
                            onClick: () => zoomBy(-0.2),
                        }, () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-magnify-minus-outline')),
                        (0, vue_1.h)(components_1.VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: 'Reset zoom',
                            onClick: () => resetView(),
                        }, () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-fit-to-screen-outline')),
                        (0, vue_1.h)(components_1.VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: 'Zoom in',
                            onClick: () => zoomBy(0.2),
                        }, () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-magnify-plus-outline')),
                        (0, vue_1.h)(components_1.VBtn, {
                            icon: true,
                            variant: 'text',
                            color: 'white',
                            title: 'Close preview',
                            onClick: () => close(),
                        }, () => (0, vue_1.h)(components_1.VIcon, {}, () => 'mdi-close')),
                    ]),
                    (0, vue_1.h)('div', {
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
                        (0, vue_1.h)('img', {
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
                        (0, vue_1.h)('div', {
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.successText.value
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.errorText.value
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.warningText.value
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
                Dialogs.confirmTitle.value = title || 'Confirm';
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
                Dialogs.infoTitle.value = title || 'Info';
                Dialogs.infoWidth.value = (options === null || options === void 0 ? void 0 : options.width) || Dialogs.options.value.infoWindowWidth || 400;
                Dialogs.infoHeight.value = (options === null || options === void 0 ? void 0 : options.height) || Dialogs.options.value.infoWindowHeight || 300;
                Dialogs.infoDialog.value = true;
            });
        });
    }
    static hasBlockingDialog() {
        return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value || Dialogs.imagePreviewDialog.value;
    }
    static $imagePreview(src, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Dialogs.imagePreviewSrc.value = src;
            Dialogs.imagePreviewTitle.value = (options === null || options === void 0 ? void 0 : options.title) || '';
            Dialogs.imagePreviewFullscreen.value = (options === null || options === void 0 ? void 0 : options.fullscreen) !== false;
            Dialogs.imagePreviewDialog.value = true;
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
                Promise.resolve().then(() => __importStar(require('./dialogform'))),
                Promise.resolve().then(() => __importStar(require('./form'))),
                Promise.resolve().then(() => __importStar(require('./field'))),
            ]);
            const workingMaster = Dialogs.createPromptMaster(promptOptions.master);
            const hasCustomChildren = typeof promptOptions.children === 'function';
            const resolvedFieldParams = promptParams.fieldParams || {};
            const storageKey = resolvedFieldParams.storage || '__promptValue';
            const dialogParams = promptParams.dialogParams || {};
            const formParams = promptParams.formParams || {};
            const formOptions = promptOptions.formOptions || {};
            const dialogOptions = promptOptions.dialogOptions || {};
            const field = !hasCustomChildren ? new Field(Object.assign({ type: resolvedFieldParams.type || promptParams.type || 'text', label: resolvedFieldParams.label || 'Value', storage: storageKey, autofocus: (_a = resolvedFieldParams.autofocus) !== null && _a !== void 0 ? _a : true, cols: (_b = resolvedFieldParams.cols) !== null && _b !== void 0 ? _b : 12 }, resolvedFieldParams), promptOptions.fieldOptions) : undefined;
            const form = new Form(Object.assign(Object.assign({}, formParams), { auto: true, sub: true, hideMode: (_c = formParams.hideMode) !== null && _c !== void 0 ? _c : true, mode: dialogParams.mode || formParams.mode || 'create', title: (_e = (_d = promptParams.title) !== null && _d !== void 0 ? _d : formParams.title) !== null && _e !== void 0 ? _e : 'Prompt', subtitle: (_f = promptParams.text) !== null && _f !== void 0 ? _f : formParams.subtitle, width: (_g = formParams.width) !== null && _g !== void 0 ? _g : (hasCustomChildren ? 760 : 520), saveButton: Object.assign(Object.assign({}, (formParams.saveButton || {})), { text: promptParams.confirmText || ((_h = formParams.saveButton) === null || _h === void 0 ? void 0 : _h.text) || 'Confirm' }), cancelButton: Object.assign(Object.assign({}, (formParams.cancelButton || {})), { text: promptParams.cancelText || ((_j = formParams.cancelButton) === null || _j === void 0 ? void 0 : _j.text) || 'Cancel' }) }), Object.assign(Object.assign({}, formOptions), { master: workingMaster, children: (() => { var _a; return hasCustomChildren ? (((_a = promptOptions.children) === null || _a === void 0 ? void 0 : _a.call(promptOptions)) || []) : (field ? [field] : []); }) }));
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
                Dialogs.promptForm.value = dialog;
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
}
exports.Dialogs = Dialogs;
Dialogs.confirmDialog = (0, vue_1.ref)(false);
Dialogs.infoDialog = (0, vue_1.ref)(false);
Dialogs.successDialog = (0, vue_1.ref)(false);
Dialogs.errorDialog = (0, vue_1.ref)(false);
Dialogs.warningDialog = (0, vue_1.ref)(false);
Dialogs.progressDialog = (0, vue_1.ref)(false);
Dialogs.imagePreviewDialog = (0, vue_1.ref)(false);
Dialogs.confirmTitle = (0, vue_1.ref)('');
Dialogs.confirmText = (0, vue_1.ref)('');
Dialogs.infoTitle = (0, vue_1.ref)('');
Dialogs.infoText = (0, vue_1.ref)('');
Dialogs.infoWidth = (0, vue_1.ref)(0);
Dialogs.infoHeight = (0, vue_1.ref)(0);
Dialogs.successText = (0, vue_1.ref)('');
Dialogs.errorText = (0, vue_1.ref)('');
Dialogs.warningText = (0, vue_1.ref)('');
Dialogs.progressValue = (0, vue_1.ref)(0);
Dialogs.progressText = (0, vue_1.ref)('');
Dialogs.progressIndeterminate = (0, vue_1.ref)(true);
Dialogs.imagePreviewSrc = (0, vue_1.ref)('');
Dialogs.imagePreviewTitle = (0, vue_1.ref)('');
Dialogs.imagePreviewFullscreen = (0, vue_1.ref)(true);
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.infoClose = null;
Dialogs.rootMounted = false;
Dialogs.promptForm = (0, vue_1.ref)();
Dialogs.promptVersion = (0, vue_1.ref)(0);
Dialogs.options = (0, vue_1.ref)({});
