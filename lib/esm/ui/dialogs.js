var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineComponent, h, onMounted, onUnmounted, ref } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VLayout, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';
import { Master } from "../master";
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
                return () => [
                    h(ConfirmDialog),
                    h(InfoDialog),
                    h(PromptDialog),
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
                    h(VCardTitle, {}, () => Dialogs.confirmTitle.value),
                    h(VCardText, {}, () => Dialogs.confirmText.value),
                    h(VCardActions, {}, () => [
                        h(VSpacer),
                        h(VBtn, {
                            color: 'error',
                            onClick: () => {
                                if (Dialogs.confirmNo)
                                    Dialogs.confirmNo();
                            }
                        }, () => 'No'),
                        h(VBtn, {
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
        return defineComponent({
            props: [],
            setup: (props, context) => {
                return () => h(VDialog, {
                    modelValue: Dialogs.infoDialog.value,
                    persistent: true,
                    width: Dialogs.infoWidth.value || Dialogs.options.value.infoWindowWidth || 400,
                    maxHeight: Dialogs.infoHeight.value || Dialogs.options.value.infoWindowHeight || 300
                }, () => h(VCard, {}, () => [
                    h(VCardTitle, {}, () => Dialogs.infoTitle.value),
                    h(VCardText, {}, () => Dialogs.infoText.value),
                    h(VCardActions, {}, () => [
                        h(VSpacer),
                        h(VBtn, {
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.successText.value
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.errorText.value
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
                        }, () => 'Close')
                    ],
                    default: () => Dialogs.warningText.value
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
        return Dialogs.confirmDialog.value || Dialogs.progressDialog.value || !!Dialogs.promptForm.value;
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
}
Dialogs.confirmDialog = ref(false);
Dialogs.infoDialog = ref(false);
Dialogs.successDialog = ref(false);
Dialogs.errorDialog = ref(false);
Dialogs.warningDialog = ref(false);
Dialogs.progressDialog = ref(false);
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
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.infoClose = null;
Dialogs.rootMounted = false;
Dialogs.promptForm = ref();
Dialogs.promptVersion = ref(0);
Dialogs.options = ref({});
