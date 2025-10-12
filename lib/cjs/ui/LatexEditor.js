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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const monaco_editor_vue3_1 = __importDefault(require("monaco-editor-vue3"));
const katex_1 = __importDefault(require("katex"));
const monaco = __importStar(require("monaco-editor"));
require("katex/dist/katex.min.css");
// Vuetify imports
const components_1 = require("vuetify/components");
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
exports.default = (0, vue_1.defineComponent)({
    name: 'LatexEditor',
    props: {
        modelValue: { type: String, default: '\\frac{a}{b} + c' },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const latexSource = (0, vue_1.ref)(props.modelValue);
        const previewHtml = (0, vue_1.ref)('');
        // Render KaTeX on change
        (0, vue_1.watch)(latexSource, (newVal) => {
            emit('update:modelValue', newVal);
            try {
                previewHtml.value = katex_1.default.renderToString(newVal, {
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
        return () => (0, vue_1.h)(components_1.VCard, { class: 'pa-4', elevation: 3 }, {
            default: () => [
                // Toolbar
                (0, vue_1.h)(components_1.VToolbar, { flat: true, dense: true, color: 'primary', dark: true }, {
                    default: () => [
                        (0, vue_1.h)(components_1.VToolbarTitle, { class: 'text-h6' }, () => 'LaTeX Editor'),
                        (0, vue_1.h)(components_1.VSpacer),
                        (0, vue_1.h)(components_1.VBtn, { icon: true, onClick: resetEditor }, () => (0, vue_1.h)(components_1.VIcon, 'mdi-refresh')),
                    ],
                }),
                // Panels
                (0, vue_1.h)(components_1.VRow, { class: 'mt-4', noGutters: true }, () => [
                    // Editor Panel
                    (0, vue_1.h)(components_1.VCol, { cols: 12, md: 6, class: 'pa-2' }, () => (0, vue_1.h)(components_1.VCard, { outlined: true }, () => [
                        (0, vue_1.h)(components_1.VCardTitle, { class: 'text-h6' }, () => 'Editor'),
                        (0, vue_1.h)(components_1.VDivider),
                        (0, vue_1.h)(monaco_editor_vue3_1.default, {
                            modelValue: latexSource.value,
                            'onUpdate:modelValue': (val) => { latexSource.value = val; },
                            language: 'latex',
                            theme: 'vs-dark',
                            height: '400px',
                        }),
                    ])),
                    // Preview Panel
                    (0, vue_1.h)(components_1.VCol, { cols: 12, md: 6, class: 'pa-2' }, () => (0, vue_1.h)(components_1.VCard, { outlined: true }, () => [
                        (0, vue_1.h)(components_1.VCardTitle, { class: 'text-h6' }, () => 'Preview'),
                        (0, vue_1.h)(components_1.VDivider),
                        (0, vue_1.h)(components_1.VCardText, () => (0, vue_1.h)('div', {
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
