import { defineComponent, ref, h, watch } from 'vue';
import MonacoEditor from 'monaco-editor-vue3';
import katex from 'katex';
import * as monaco from 'monaco-editor';
import 'katex/dist/katex.min.css';
// Vuetify imports
import { VCard, VCardText, VCardTitle, VRow, VCol, VToolbar, VToolbarTitle, VSpacer, VBtn, VIcon, VDivider, } from 'vuetify/components';
// --- LaTeX ---
monaco.languages.register({ id: 'latex' });
monaco.languages.setMonarchTokensProvider('latex', {
    tokenizer: {
        root: [
            [/\\[a-zA-Z]+/, 'keyword'],
            [/%.*$/, 'comment'],
            [/[{}]/, 'delimiter'],
            [/\d+/, 'number'],
            [/[^\\{}\s%]+/, 'variable'], // Text
        ],
    },
});
// --- EJS ---
monaco.languages.register({ id: 'ejs' });
monaco.languages.setMonarchTokensProvider('ejs', {
    tokenizer: {
        root: [
            [/<%=?/, { token: 'delimiter', next: '@ejs' }],
            [/[^<%]+/, 'text'], // Plain HTML
        ],
        ejs: [
            [/%>/, { token: 'delimiter', next: '@pop' }],
            [/[{}]/, 'delimiter'],
            [/[a-zA-Z_$][\w$]*/, 'variable'],
            [/\d+/, 'number'],
            [/".*?"/, 'string'],
            [/'.*?'/, 'string'],
            [/[=+\-*/]/, 'operator'],
            [/\s+/, 'white'],
        ],
    },
});
export default defineComponent({
    name: 'LatexEditor',
    props: {
        modelValue: { type: String, default: '\\frac{a}{b} + c' },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const latexSource = ref(props.modelValue);
        const previewHtml = ref('');
        // Render KaTeX on change
        watch(latexSource, (newVal) => {
            emit('update:modelValue', newVal);
            try {
                previewHtml.value = katex.renderToString(newVal, {
                    throwOnError: false,
                    displayMode: true,
                });
            }
            catch (err) {
                previewHtml.value = `<span style="color:red">${err.message}</span>`;
            }
        }, { immediate: true });
        const resetEditor = () => {
            latexSource.value = '\\frac{a}{b} + c';
        };
        // --- Render function ---
        return () => h(VCard, { class: 'pa-4', elevation: 3 }, {
            default: () => [
                // Toolbar
                h(VToolbar, { flat: true, dense: true, color: 'primary', dark: true }, {
                    default: () => [
                        h(VToolbarTitle, { class: 'text-h6' }, () => 'LaTeX Editor'),
                        h(VSpacer),
                        h(VBtn, { icon: true, onClick: resetEditor }, () => h(VIcon, 'mdi-refresh')),
                    ],
                }),
                // Panels
                h(VRow, { class: 'mt-4', noGutters: true }, () => [
                    // Editor Panel
                    h(VCol, { cols: 12, md: 6, class: 'pa-2' }, () => h(VCard, { outlined: true }, () => [
                        h(VCardTitle, { class: 'text-h6' }, () => 'Editor'),
                        h(VDivider),
                        h(MonacoEditor, {
                            modelValue: latexSource.value,
                            'onUpdate:modelValue': (val) => { latexSource.value = val; },
                            language: 'latex',
                            theme: 'vs-dark',
                            height: '400px',
                        }),
                    ])),
                    // Preview Panel
                    h(VCol, { cols: 12, md: 6, class: 'pa-2' }, () => h(VCard, { outlined: true }, () => [
                        h(VCardTitle, { class: 'text-h6' }, () => 'Preview'),
                        h(VDivider),
                        h(VCardText, () => h('div', {
                            innerHTML: previewHtml.value,
                            style: {
                                minHeight: '400px',
                                padding: '16px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                            },
                        })),
                    ])),
                ]),
            ],
        });
    },
});
