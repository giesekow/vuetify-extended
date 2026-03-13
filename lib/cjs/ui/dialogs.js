"use strict";
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
                return () => [
                    (0, vue_1.h)(ConfirmDialog),
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
    static hasBlockingDialog() {
        return Dialogs.confirmDialog.value || Dialogs.progressDialog.value;
    }
    static installConfirmKeydownHandler() {
        if (typeof window === 'undefined' || Dialogs.confirmKeydownHandler) {
            return;
        }
        Dialogs.confirmKeydownHandler = (ev) => {
            if (!Dialogs.confirmDialog.value || ev.key !== 'Escape') {
                return;
            }
            ev.preventDefault();
            ev.stopPropagation();
            if (Dialogs.confirmNo) {
                Dialogs.confirmNo();
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
}
exports.Dialogs = Dialogs;
Dialogs.confirmDialog = (0, vue_1.ref)(false);
Dialogs.successDialog = (0, vue_1.ref)(false);
Dialogs.errorDialog = (0, vue_1.ref)(false);
Dialogs.warningDialog = (0, vue_1.ref)(false);
Dialogs.progressDialog = (0, vue_1.ref)(false);
Dialogs.confirmTitle = (0, vue_1.ref)('');
Dialogs.confirmText = (0, vue_1.ref)('');
Dialogs.successText = (0, vue_1.ref)('');
Dialogs.errorText = (0, vue_1.ref)('');
Dialogs.warningText = (0, vue_1.ref)('');
Dialogs.progressValue = (0, vue_1.ref)(0);
Dialogs.progressText = (0, vue_1.ref)('');
Dialogs.progressIndeterminate = (0, vue_1.ref)(true);
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.rootMounted = false;
Dialogs.options = (0, vue_1.ref)({});
