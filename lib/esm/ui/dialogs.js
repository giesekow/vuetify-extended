var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { defineComponent, h, ref } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VCol, VDialog, VLayout, VOverlay, VProgressCircular, VRow, VSnackbar, VSpacer } from 'vuetify/components';
export class Dialogs {
    static setOptions(options) {
        Dialogs.options.value = Object.assign(Object.assign({}, Dialogs.options.value), options);
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
                    Dialogs.confirmDialog.value = false;
                    resolve(true);
                };
                Dialogs.confirmNo = () => {
                    Dialogs.confirmDialog.value = false;
                    resolve(false);
                };
                Dialogs.confirmText.value = text;
                Dialogs.confirmTitle.value = title || 'Confirm';
                Dialogs.confirmDialog.value = true;
            });
        });
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
Dialogs.confirmDialog = ref(false);
Dialogs.successDialog = ref(false);
Dialogs.errorDialog = ref(false);
Dialogs.warningDialog = ref(false);
Dialogs.progressDialog = ref(false);
Dialogs.confirmTitle = ref('');
Dialogs.confirmText = ref('');
Dialogs.successText = ref('');
Dialogs.errorText = ref('');
Dialogs.warningText = ref('');
Dialogs.progressValue = ref(0);
Dialogs.progressText = ref('');
Dialogs.progressIndeterminate = ref(true);
Dialogs.confirmYes = null;
Dialogs.confirmNo = null;
Dialogs.options = ref({});
