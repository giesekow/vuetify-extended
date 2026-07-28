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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiptapHtmlEditor = void 0;
const vue_3_1 = require("@tiptap/vue-3");
const core_1 = require("@tiptap/core");
const starter_kit_1 = __importDefault(require("@tiptap/starter-kit"));
const extension_placeholder_1 = __importDefault(require("@tiptap/extension-placeholder"));
const extension_image_1 = __importDefault(require("@tiptap/extension-image"));
const extension_text_align_1 = __importDefault(require("@tiptap/extension-text-align"));
const extension_task_item_1 = __importDefault(require("@tiptap/extension-task-item"));
const extension_task_list_1 = __importDefault(require("@tiptap/extension-task-list"));
const extension_table_1 = require("@tiptap/extension-table");
const extension_table_row_1 = require("@tiptap/extension-table-row");
const extension_table_cell_1 = require("@tiptap/extension-table-cell");
const extension_table_header_1 = require("@tiptap/extension-table-header");
const vue_1 = require("vue");
const components_1 = require("vuetify/components");
const dialogs_1 = require("./dialogs");
const misc_1 = require("../misc");
const runtime_1 = require("./runtime");
const headingLevels = [1, 2, 3, 4, 5, 6];
const topLevelText = (key, fallback, values) => (0, runtime_1.resolveUIText)({ key, fallback, values }, fallback);
const asCssSize = (value) => {
    if (typeof value === 'number') {
        return `${value}px`;
    }
    if (typeof value === 'string' && value.trim()) {
        return value;
    }
    return undefined;
};
const normalizeHtmlValue = (value) => value || '';
const normalizeUrlInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
        return trimmed;
    }
    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }
    return `https://${trimmed}`;
};
const getYouTubeVideoId = (url) => {
    const hostname = url.hostname.replace(/^www\./, '');
    if (hostname === 'youtu.be') {
        return url.pathname.split('/').filter(Boolean)[0] || null;
    }
    if (!hostname.endsWith('youtube.com') && !hostname.endsWith('youtube-nocookie.com')) {
        return null;
    }
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'watch') {
        return url.searchParams.get('v');
    }
    if (pathParts[0] === 'embed' || pathParts[0] === 'shorts' || pathParts[0] === 'live') {
        return pathParts[1] || null;
    }
    return url.searchParams.get('v');
};
const getVimeoVideoId = (url) => {
    const hostname = url.hostname.replace(/^www\./, '');
    if (!hostname.endsWith('vimeo.com')) {
        return null;
    }
    const parts = url.pathname.split('/').filter(Boolean);
    const numericPart = [...parts].reverse().find((part) => /^\d+$/.test(part));
    return numericPart || null;
};
const isDirectVideoUrl = (url) => {
    return /\.(mp4|webm|ogg|mov|m4v)(?:$|\?)/i.test(`${url.pathname}${url.search}`);
};
const resolveEmbeddedVideo = (input) => {
    const normalized = normalizeUrlInput(input);
    if (!normalized) {
        return null;
    }
    let url;
    try {
        url = new URL(normalized);
    }
    catch (_error) {
        return null;
    }
    if (isDirectVideoUrl(url)) {
        return {
            src: normalized,
            embedSrc: normalized,
            provider: 'file',
            title: topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
            allowFullscreen: false,
            width: '100%',
        };
    }
    const youTubeId = getYouTubeVideoId(url);
    if (youTubeId) {
        return {
            src: normalized,
            embedSrc: `https://www.youtube.com/embed/${encodeURIComponent(youTubeId)}`,
            provider: 'iframe',
            title: topLevelText('ve.editor.video.youtubeTitle', 'YouTube video'),
            allowFullscreen: true,
            width: '100%',
        };
    }
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
        return {
            src: normalized,
            embedSrc: `https://player.vimeo.com/video/${encodeURIComponent(vimeoId)}`,
            provider: 'iframe',
            title: topLevelText('ve.editor.video.vimeoTitle', 'Vimeo video'),
            allowFullscreen: true,
            width: '100%',
        };
    }
    if (url.pathname.includes('/embed/') || url.hostname.startsWith('player.')) {
        return {
            src: normalized,
            embedSrc: normalized,
            provider: 'iframe',
            title: topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
            allowFullscreen: true,
            width: '100%',
        };
    }
    return null;
};
const EmbeddedVideo = core_1.Node.create({
    name: 'embeddedVideo',
    group: 'block',
    atom: true,
    draggable: true,
    selectable: true,
    addAttributes() {
        return {
            src: {
                default: '',
            },
            embedSrc: {
                default: '',
            },
            provider: {
                default: 'iframe',
            },
            title: {
                default: topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
            },
            allowFullscreen: {
                default: true,
            },
            width: {
                default: '100%',
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'div[data-embedded-video]',
                getAttrs: (node) => {
                    const element = node;
                    return {
                        src: element.getAttribute('data-src') || '',
                        embedSrc: element.getAttribute('data-embed-src') || '',
                        provider: element.getAttribute('data-provider') || 'iframe',
                        title: element.getAttribute('data-title') || topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
                        allowFullscreen: element.getAttribute('data-allow-fullscreen') !== 'false',
                        width: element.getAttribute('data-width') || '100%',
                    };
                },
            },
            {
                tag: 'iframe[src]',
                getAttrs: (node) => {
                    const element = node;
                    const src = element.getAttribute('src') || '';
                    if (!src) {
                        return false;
                    }
                    return {
                        src,
                        embedSrc: src,
                        provider: 'iframe',
                        title: element.getAttribute('title') || topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
                        allowFullscreen: element.hasAttribute('allowfullscreen'),
                        width: element.style.width || '100%',
                    };
                },
            },
            {
                tag: 'video[src]',
                getAttrs: (node) => {
                    const element = node;
                    const src = element.getAttribute('src') || '';
                    if (!src) {
                        return false;
                    }
                    return {
                        src,
                        embedSrc: src,
                        provider: 'file',
                        title: element.getAttribute('title') || topLevelText('ve.editor.video.embeddedTitle', 'Embedded video'),
                        allowFullscreen: false,
                        width: element.style.width || '100%',
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        const attrs = HTMLAttributes;
        const wrapperAttrs = (0, core_1.mergeAttributes)({
            'data-embedded-video': 'true',
            'data-src': attrs.src,
            'data-embed-src': attrs.embedSrc,
            'data-provider': attrs.provider,
            'data-title': attrs.title,
            'data-allow-fullscreen': String(attrs.allowFullscreen),
            'data-width': attrs.width || '100%',
            class: 'vef-tiptap__embedded-video',
            contenteditable: 'false',
            style: `width: ${attrs.width || '100%'};`,
        }, HTMLAttributes);
        if (attrs.provider === 'file') {
            return ['div', wrapperAttrs, ['video', {
                        src: attrs.embedSrc,
                        title: attrs.title,
                        class: 'vef-tiptap__embedded-video-file',
                        controls: 'true',
                        playsinline: 'true',
                        preload: 'metadata',
                    }]];
        }
        return ['div', wrapperAttrs, ['iframe', {
                    src: attrs.embedSrc,
                    title: attrs.title,
                    class: 'vef-tiptap__embedded-video-frame',
                    frameborder: '0',
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                    allowfullscreen: attrs.allowFullscreen ? 'true' : undefined,
                    referrerpolicy: 'strict-origin-when-cross-origin',
                }]];
    },
});
exports.TiptapHtmlEditor = (0, vue_1.defineComponent)({
    name: 'TiptapHtmlEditor',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        },
        height: {
            type: [Number, String],
            default: 300,
        },
        allowFullscreen: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue', 'ready'],
    setup(props, { emit, attrs }) {
        const editor = (0, vue_1.shallowRef)(null);
        const rootEl = (0, vue_1.ref)(null);
        const hostEl = (0, vue_1.ref)(null);
        const revision = (0, vue_1.ref)(0);
        const currentHtml = (0, vue_1.ref)(normalizeHtmlValue(props.modelValue));
        const sourceHtml = (0, vue_1.ref)(normalizeHtmlValue(props.modelValue));
        const sourceDraft = (0, vue_1.ref)(normalizeHtmlValue(props.modelValue));
        const sourceSnapshot = (0, vue_1.ref)(normalizeHtmlValue(props.modelValue));
        const sourceMode = (0, vue_1.ref)(false);
        const fullscreenDialog = (0, vue_1.ref)(false);
        const editorActionFrame = (0, vue_1.ref)(null);
        const initHandlers = [];
        const keydownHandlers = [];
        const pendingEditorActions = [];
        const lastSelection = (0, vue_1.ref)(undefined);
        const toolbarCompact = (0, vue_1.ref)(false);
        let resizeObserver;
        const preventToolbarMouseDown = (event) => {
            event.preventDefault();
        };
        const flushEditorActions = () => {
            editorActionFrame.value = null;
            const actions = pendingEditorActions.splice(0, pendingEditorActions.length);
            actions.forEach((action) => action());
        };
        const queueEditorAction = (action) => {
            if (typeof window === 'undefined') {
                action();
                return;
            }
            pendingEditorActions.push(action);
            if (editorActionFrame.value !== null) {
                return;
            }
            editorActionFrame.value = window.requestAnimationFrame(flushEditorActions);
        };
        const getSelectionSnapshot = (instance) => {
            const liveEditor = instance || editor.value;
            if (!liveEditor) {
                return undefined;
            }
            const selection = liveEditor.state.selection;
            return {
                from: selection.from,
                to: selection.to,
            };
        };
        const restoreSelection = (liveEditor, selection) => {
            if (!selection) {
                return liveEditor.chain();
            }
            return liveEditor.chain().setTextSelection(selection);
        };
        const runEditorCommand = (command) => {
            queueEditorAction(() => {
                const instance = editor.value;
                if (!instance) {
                    return;
                }
                command(instance);
            });
        };
        const refreshToolbar = () => {
            revision.value += 1;
        };
        const t = (key, fallback, values) => (0, runtime_1.resolveUIText)({ key, fallback, values }, fallback);
        const tooltip = (key, fallback, shortcut, values) => {
            const label = t(key, fallback, values);
            return shortcut ? `${label} (${shortcut})` : label;
        };
        const syncSourceState = (value) => {
            sourceHtml.value = value;
            if (!sourceMode.value) {
                sourceDraft.value = value;
                sourceSnapshot.value = value;
            }
        };
        const updateHtmlValue = (value) => {
            currentHtml.value = value;
            syncSourceState(value);
            emit('update:modelValue', value);
            refreshToolbar();
        };
        const queueContentSync = (nextValue) => {
            queueEditorAction(() => {
                const liveEditor = editor.value;
                if (!liveEditor) {
                    return;
                }
                if (nextValue === currentHtml.value && nextValue === liveEditor.getHTML()) {
                    return;
                }
                liveEditor.commands.setContent(nextValue, { emitUpdate: false });
                currentHtml.value = liveEditor.getHTML();
                syncSourceState(currentHtml.value);
                refreshToolbar();
            });
        };
        const adapter = {
            isReady: false,
            on(event, handler) {
                if (event === 'init') {
                    initHandlers.push(handler);
                    if (adapter.isReady) {
                        handler();
                    }
                    return;
                }
                if (event === 'keydown') {
                    keydownHandlers.push(handler);
                }
            },
            focus() {
                queueEditorAction(() => {
                    var _a;
                    const body = (_a = hostEl.value) === null || _a === void 0 ? void 0 : _a.querySelector('.ProseMirror');
                    body === null || body === void 0 ? void 0 : body.focus();
                });
            },
            getBody() {
                var _a;
                return ((_a = hostEl.value) === null || _a === void 0 ? void 0 : _a.querySelector('.ProseMirror')) || null;
            },
            getHTML() {
                var _a;
                return ((_a = editor.value) === null || _a === void 0 ? void 0 : _a.getHTML()) || '';
            },
        };
        const getBlockLabel = () => {
            const instance = editor.value;
            if (!instance) {
                return t('ve.editor.block.paragraph', 'Paragraph');
            }
            for (const level of headingLevels) {
                if (instance.isActive('heading', { level })) {
                    return `H${level}`;
                }
            }
            if (instance.isActive('codeBlock')) {
                return t('ve.editor.block.codeBlock', 'Code Block');
            }
            if (instance.isActive('blockquote')) {
                return t('ve.editor.block.quoteShort', 'Quote');
            }
            if (instance.isActive('taskList')) {
                return t('ve.editor.block.taskList', 'Task List');
            }
            return t('ve.editor.block.paragraph', 'Paragraph');
        };
        const getRootElement = () => {
            var _a, _b, _c;
            if (rootEl.value instanceof HTMLElement) {
                return rootEl.value;
            }
            const componentElement = (_a = rootEl.value) === null || _a === void 0 ? void 0 : _a.$el;
            if (componentElement instanceof HTMLElement) {
                return componentElement;
            }
            const closestSheet = (_c = (_b = hostEl.value) === null || _b === void 0 ? void 0 : _b.closest) === null || _c === void 0 ? void 0 : _c.call(_b, '.vef-tiptap');
            if (closestSheet instanceof HTMLElement) {
                return closestSheet;
            }
            return hostEl.value;
        };
        const syncToolbarMode = () => {
            var _a;
            const width = ((_a = getRootElement()) === null || _a === void 0 ? void 0 : _a.clientWidth) || 0;
            toolbarCompact.value = width > 0 && width < 860;
            refreshToolbar();
        };
        const createIconButton = (params) => (0, vue_1.h)(components_1.VTooltip, {
            text: params.title,
            location: 'top',
            openDelay: 120,
        }, {
            activator: ({ props: tooltipProps }) => (0, vue_1.h)(components_1.VBtn, (0, vue_1.mergeProps)(tooltipProps, {
                icon: params.icon,
                variant: params.active ? 'tonal' : 'text',
                density: 'compact',
                size: 'small',
                class: ['vef-tiptap__tool-btn'],
                style: {
                    width: '30px',
                    minWidth: '30px',
                    height: '30px',
                    padding: '0',
                },
                disabled: params.disabled,
                onMousedown: preventToolbarMouseDown,
                onClick: params.onClick,
            })),
        });
        const createMenuButton = (params) => (0, vue_1.h)(components_1.VMenu, {
            closeOnContentClick: true,
        }, {
            default: () => (0, vue_1.h)(components_1.VList, {
                density: 'compact',
                minWidth: 220,
            }, () => params.items.map((item) => (0, vue_1.h)(components_1.VListItem, {
                key: `${params.label || params.icon}-${item.title}`,
                title: item.title,
                prependIcon: item.icon,
                active: item.active,
                disabled: item.disabled,
                onClick: item.onClick,
            }))),
            activator: ({ props: menuActivatorProps }) => (0, vue_1.h)(components_1.VTooltip, {
                text: params.title,
                location: 'top',
                openDelay: 120,
            }, {
                activator: ({ props: tooltipProps }) => (0, vue_1.h)(components_1.VBtn, (0, vue_1.mergeProps)(menuActivatorProps, tooltipProps, {
                    prependIcon: params.icon,
                    appendIcon: 'mdi-menu-down',
                    variant: params.active ? 'tonal' : 'text',
                    density: 'compact',
                    size: 'small',
                    class: ['vef-tiptap__menu-btn'],
                    style: {
                        minWidth: 'unset',
                        height: '30px',
                        paddingInline: '8px',
                    },
                    disabled: params.disabled,
                    onMousedown: preventToolbarMouseDown,
                }), () => params.label || ''),
            }),
        });
        const promptForLink = () => __awaiter(this, void 0, void 0, function* () {
            const instance = editor.value;
            if (!instance || props.readonly || props.disabled) {
                return;
            }
            const selection = getSelectionSnapshot(instance);
            const currentUrl = instance.getAttributes('link').href || '';
            const value = yield dialogs_1.Dialogs.$prompt({
                title: currentUrl
                    ? { key: 've.editor.link.editTitle', fallback: 'Edit Link' }
                    : { key: 've.editor.link.insertTitle', fallback: 'Insert Link' },
                text: { key: 've.editor.link.promptText', fallback: 'Enter the URL to apply to the current selection.' },
                confirmText: { key: 've.common.apply', fallback: 'Apply' },
                type: 'text',
                fieldParams: {
                    label: { key: 've.editor.link.label', fallback: 'URL' },
                    placeholder: { key: 've.editor.link.placeholder', fallback: 'https://example.com' },
                    default: currentUrl,
                },
            });
            if (value === undefined) {
                return;
            }
            const url = String(value || '').trim();
            runEditorCommand((liveEditor) => {
                const chain = restoreSelection(liveEditor, selection).extendMarkRange('link');
                if (!url) {
                    chain.unsetLink().run();
                    return;
                }
                chain.setLink({ href: url }).run();
            });
        });
        const promptForTableInsert = () => __awaiter(this, void 0, void 0, function* () {
            const selection = getSelectionSnapshot();
            const rowsValue = yield dialogs_1.Dialogs.$prompt({
                title: { key: 've.editor.table.insertTitle', fallback: 'Insert Table' },
                text: { key: 've.editor.table.rowsPrompt', fallback: 'How many rows should the table have?' },
                confirmText: { key: 've.common.next', fallback: 'Next' },
                type: 'integer',
                fieldParams: {
                    label: { key: 've.editor.table.rows', fallback: 'Rows' },
                    default: 3,
                },
            });
            if (rowsValue === undefined) {
                return;
            }
            const colsValue = yield dialogs_1.Dialogs.$prompt({
                title: { key: 've.editor.table.insertTitle', fallback: 'Insert Table' },
                text: { key: 've.editor.table.columnsPrompt', fallback: 'How many columns should the table have?' },
                confirmText: { key: 've.common.insert', fallback: 'Insert' },
                type: 'integer',
                fieldParams: {
                    label: { key: 've.editor.table.columns', fallback: 'Columns' },
                    default: 3,
                },
            });
            if (colsValue === undefined) {
                return;
            }
            const rows = Math.max(1, Number(rowsValue) || 1);
            const cols = Math.max(1, Number(colsValue) || 1);
            runEditorCommand((liveEditor) => {
                restoreSelection(liveEditor, selection).insertTable({ rows, cols, withHeaderRow: true }).run();
            });
        });
        const promptForImage = () => __awaiter(this, void 0, void 0, function* () {
            const instance = editor.value;
            if (!instance || props.readonly || props.disabled) {
                return;
            }
            try {
                const selection = getSelectionSnapshot(instance);
                const files = yield (0, misc_1.selectFile)('image/*');
                const file = files === null || files === void 0 ? void 0 : files[0];
                if (!file) {
                    return;
                }
                const dataUrl = yield (0, misc_1.fileToBase64)(file);
                runEditorCommand((liveEditor) => {
                    restoreSelection(liveEditor, selection).setImage({ src: dataUrl, alt: file.name }).run();
                });
            }
            catch (_error) {
                // User cancelled file selection.
            }
        });
        const promptForVideo = () => __awaiter(this, void 0, void 0, function* () {
            const instance = editor.value;
            if (!instance || props.readonly || props.disabled) {
                return;
            }
            const selection = getSelectionSnapshot(instance);
            const value = yield dialogs_1.Dialogs.$prompt({
                title: { key: 've.editor.video.insertTitle', fallback: 'Insert Video' },
                text: { key: 've.editor.video.promptText', fallback: 'Enter a YouTube, Vimeo, embed, or direct video URL.' },
                confirmText: { key: 've.common.insert', fallback: 'Insert' },
                type: 'text',
                fieldParams: {
                    label: { key: 've.editor.video.urlLabel', fallback: 'Video URL' },
                    placeholder: { key: 've.editor.video.urlPlaceholder', fallback: 'https://www.youtube.com/watch?v=...' },
                },
            });
            if (value === undefined) {
                return;
            }
            const embeddedVideo = resolveEmbeddedVideo(String(value || ''));
            if (!embeddedVideo) {
                dialogs_1.Dialogs.$error({ key: 've.editor.video.unsupportedUrl', fallback: 'Unsupported video URL. Use YouTube, Vimeo, an embeddable player URL, or a direct .mp4/.webm/.ogg link.' });
                return;
            }
            runEditorCommand((liveEditor) => {
                restoreSelection(liveEditor, selection).insertContent([
                    {
                        type: 'embeddedVideo',
                        attrs: embeddedVideo,
                    },
                    {
                        type: 'paragraph',
                    },
                ]).run();
            });
        });
        const setSelectedVideoWidth = (width) => {
            runEditorCommand((liveEditor) => {
                liveEditor.chain().updateAttributes('embeddedVideo', { width }).run();
            });
        };
        const promptForVideoWidth = () => __awaiter(this, void 0, void 0, function* () {
            const instance = editor.value;
            if (!instance || props.readonly || props.disabled || !instance.isActive('embeddedVideo')) {
                return;
            }
            const currentWidth = String(instance.getAttributes('embeddedVideo').width || '100%');
            const defaultWidth = Number.parseInt(currentWidth, 10);
            const value = yield dialogs_1.Dialogs.$prompt({
                title: { key: 've.editor.video.resizeTitle', fallback: 'Resize Video' },
                text: { key: 've.editor.video.resizePrompt', fallback: 'Enter the video width as a percentage of the editor width.' },
                confirmText: { key: 've.common.apply', fallback: 'Apply' },
                type: 'integer',
                fieldParams: {
                    label: { key: 've.editor.video.widthPercent', fallback: 'Width (%)' },
                    default: Number.isFinite(defaultWidth) ? defaultWidth : 100,
                },
            });
            if (value === undefined) {
                return;
            }
            const nextWidth = Math.max(25, Math.min(100, Number(value) || 100));
            setSelectedVideoWidth(`${nextWidth}%`);
        });
        const insertFormula = (display) => {
            runEditorCommand((liveEditor) => {
                const { from, to } = liveEditor.state.selection;
                const selectedText = liveEditor.state.doc.textBetween(from, to, '\n');
                const isEmptySelection = from === to;
                const content = display
                    ? `$$\n${selectedText}\n$$`
                    : `$${selectedText}$`;
                const selectionStart = display ? from + 3 : from + 1;
                const selectionEnd = selectionStart + selectedText.length;
                liveEditor.chain().insertContentAt({ from, to }, content).setTextSelection(isEmptySelection
                    ? selectionStart
                    : { from: selectionStart, to: selectionEnd }).run();
            });
        };
        const enterSourceMode = () => {
            sourceSnapshot.value = currentHtml.value;
            sourceDraft.value = currentHtml.value;
            sourceMode.value = true;
            refreshToolbar();
        };
        const applySourceMode = () => {
            const nextValue = sourceDraft.value;
            sourceMode.value = false;
            updateHtmlValue(nextValue);
            queueContentSync(nextValue);
        };
        const cancelSourceMode = () => {
            const snapshot = sourceSnapshot.value;
            sourceDraft.value = snapshot;
            sourceHtml.value = snapshot;
            currentHtml.value = snapshot;
            sourceMode.value = false;
            refreshToolbar();
        };
        const toggleSourceMode = () => {
            if (sourceMode.value) {
                applySourceMode();
                return;
            }
            enterSourceMode();
        };
        const onEditorShortcut = (event) => {
            if (props.readonly || props.disabled) {
                return false;
            }
            const key = event.key.toLowerCase();
            const withMeta = event.ctrlKey || event.metaKey;
            const withAlt = event.altKey;
            const withShift = event.shiftKey;
            if (event.key === 'F11') {
                event.preventDefault();
                if (props.allowFullscreen) {
                    fullscreenDialog.value = true;
                }
                return true;
            }
            if (!withMeta) {
                return false;
            }
            if (withAlt && !withShift) {
                if (key === '0') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().setParagraph().run());
                    return true;
                }
                if (['1', '2', '3', '4', '5', '6'].includes(key)) {
                    event.preventDefault();
                    const level = Number(key);
                    runEditorCommand((liveEditor) => liveEditor.chain().toggleHeading({ level }).run());
                    return true;
                }
                if (key === 'q') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().toggleBlockquote().run());
                    return true;
                }
                if (key === 'c') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().toggleCodeBlock().run());
                    return true;
                }
                if (key === 'l') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('left').run());
                    return true;
                }
                if (key === 'e') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('center').run());
                    return true;
                }
                if (key === 'r') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('right').run());
                    return true;
                }
                if (key === 'j') {
                    event.preventDefault();
                    runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('justify').run());
                    return true;
                }
                if (key === 'k') {
                    event.preventDefault();
                    void promptForLink();
                    return true;
                }
                if (key === 'i') {
                    event.preventDefault();
                    void promptForImage();
                    return true;
                }
                if (key === 'v') {
                    event.preventDefault();
                    void promptForVideo();
                    return true;
                }
                if (key === 't') {
                    event.preventDefault();
                    void promptForTableInsert();
                    return true;
                }
                if (key === 'm') {
                    event.preventDefault();
                    insertFormula(false);
                    return true;
                }
                if (key === 's') {
                    event.preventDefault();
                    toggleSourceMode();
                    return true;
                }
            }
            if (withMeta && withAlt && withShift && key === 'm') {
                event.preventDefault();
                insertFormula(true);
                return true;
            }
            return false;
        };
        const createEditor = () => {
            editor.value = new core_1.Editor({
                editable: !(props.readonly || props.disabled),
                content: normalizeHtmlValue(props.modelValue),
                extensions: [
                    starter_kit_1.default.configure({
                        link: {
                            openOnClick: false,
                            autolink: true,
                            linkOnPaste: true,
                            defaultProtocol: 'https',
                        },
                    }),
                    extension_placeholder_1.default.configure({
                        placeholder: props.placeholder || '',
                    }),
                    extension_image_1.default,
                    extension_task_list_1.default,
                    extension_task_item_1.default.configure({
                        nested: true,
                    }),
                    EmbeddedVideo,
                    extension_text_align_1.default.configure({
                        types: ['heading', 'paragraph'],
                        alignments: ['left', 'center', 'right', 'justify'],
                    }),
                    extension_table_1.Table.configure({
                        resizable: true,
                    }),
                    extension_table_row_1.TableRow,
                    extension_table_header_1.TableHeader,
                    extension_table_cell_1.TableCell,
                ],
                editorProps: {
                    attributes: {
                        class: 'vef-tiptap__content ProseMirror',
                    },
                    handleDOMEvents: {
                        keydown: (_view, event) => {
                            if (onEditorShortcut(event)) {
                                return true;
                            }
                            keydownHandlers.forEach((handler) => handler(event));
                            return false;
                        },
                    },
                },
                onUpdate: ({ editor: instance }) => {
                    const html = instance.getHTML();
                    currentHtml.value = html;
                    syncSourceState(html);
                    if (html !== normalizeHtmlValue(props.modelValue)) {
                        emit('update:modelValue', html);
                    }
                    refreshToolbar();
                },
                onSelectionUpdate: ({ editor: instance }) => {
                    lastSelection.value = getSelectionSnapshot(instance);
                    refreshToolbar();
                },
                onFocus: refreshToolbar,
                onBlur: refreshToolbar,
                onTransaction: refreshToolbar,
            });
            adapter.isReady = true;
            emit('ready', adapter);
            initHandlers.forEach((handler) => handler());
            refreshToolbar();
        };
        (0, vue_1.onMounted)(() => {
            createEditor();
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(() => syncToolbarMode());
                const rootElement = getRootElement();
                if (rootElement) {
                    resizeObserver.observe(rootElement);
                }
                else {
                    syncToolbarMode();
                }
            }
            else {
                syncToolbarMode();
            }
        });
        (0, vue_1.onBeforeUnmount)(() => {
            var _a;
            adapter.isReady = false;
            if (editorActionFrame.value !== null && typeof window !== 'undefined') {
                window.cancelAnimationFrame(editorActionFrame.value);
                editorActionFrame.value = null;
            }
            pendingEditorActions.splice(0, pendingEditorActions.length);
            resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
            resizeObserver = undefined;
            (_a = editor.value) === null || _a === void 0 ? void 0 : _a.destroy();
            editor.value = null;
        });
        (0, vue_1.watch)(() => props.modelValue, (value) => {
            const instance = editor.value;
            if (!instance) {
                return;
            }
            const nextValue = normalizeHtmlValue(value);
            sourceHtml.value = nextValue;
            if (!sourceMode.value) {
                sourceDraft.value = nextValue;
                sourceSnapshot.value = nextValue;
            }
            if (nextValue !== currentHtml.value) {
                queueContentSync(nextValue);
            }
        }, {
            flush: 'post',
        });
        (0, vue_1.watch)(() => [props.readonly, props.disabled], ([readonly, disabled]) => {
            var _a;
            (_a = editor.value) === null || _a === void 0 ? void 0 : _a.setEditable(!(readonly || disabled));
            refreshToolbar();
        });
        return () => {
            revision.value;
            const instance = editor.value;
            const isReadOnly = props.readonly || props.disabled;
            const height = asCssSize(props.height);
            const contentMinHeight = typeof props.height === 'number'
                ? `${Math.max(props.height - 56, 120)}px`
                : '220px';
            const inTable = !!(instance === null || instance === void 0 ? void 0 : instance.isActive('table'));
            const inEmbeddedVideo = !!(instance === null || instance === void 0 ? void 0 : instance.isActive('embeddedVideo'));
            const embeddedVideoWidth = String((instance === null || instance === void 0 ? void 0 : instance.getAttributes('embeddedVideo').width) || '100%');
            const blockMenu = createMenuButton({
                icon: 'mdi-format-paragraph',
                label: (instance === null || instance === void 0 ? void 0 : instance.isActive('heading'))
                    ? getBlockLabel()
                    : (instance === null || instance === void 0 ? void 0 : instance.isActive('codeBlock'))
                        ? t('ve.editor.block.codeShort', 'Code')
                        : (instance === null || instance === void 0 ? void 0 : instance.isActive('blockquote'))
                            ? t('ve.editor.block.quoteShort', 'Quote')
                            : (instance === null || instance === void 0 ? void 0 : instance.isActive('taskList'))
                                ? t('ve.editor.block.taskShort', 'Task')
                                : 'P',
                title: t('ve.editor.toolbar.blockStyle', 'Block Style'),
                items: [
                    {
                        title: t('ve.editor.block.paragraph', 'Paragraph'),
                        icon: 'mdi-format-paragraph',
                        active: !(instance === null || instance === void 0 ? void 0 : instance.isActive('heading')) && !(instance === null || instance === void 0 ? void 0 : instance.isActive('codeBlock')) && !(instance === null || instance === void 0 ? void 0 : instance.isActive('blockquote')) && !(instance === null || instance === void 0 ? void 0 : instance.isActive('taskList')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setParagraph().run()),
                    },
                    ...headingLevels.map((level) => ({
                        title: t('ve.editor.block.heading', `Heading ${level}`, { level }),
                        icon: 'mdi-format-header-pound',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('heading', { level })),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleHeading({ level }).run()),
                    })),
                    {
                        title: t('ve.editor.block.blockQuote', 'Block Quote'),
                        icon: 'mdi-format-quote-close',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('blockquote')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBlockquote().run()),
                    },
                    {
                        title: t('ve.editor.block.codeBlock', 'Code Block'),
                        icon: 'mdi-code-tags',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('codeBlock')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCodeBlock().run()),
                    },
                    {
                        title: t('ve.editor.block.taskList', 'Task List'),
                        icon: 'mdi-format-list-checks',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('taskList')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
                    },
                ],
            });
            const alignMenu = createMenuButton({
                icon: 'mdi-format-align-left',
                label: '',
                title: t('ve.editor.toolbar.alignment', 'Alignment'),
                items: [
                    {
                        title: t('ve.editor.align.left', 'Align Left'),
                        icon: 'mdi-format-align-left',
                        active: !(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'center' })) && !(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'right' })) && !(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'justify' })),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('left').run()),
                    },
                    {
                        title: t('ve.editor.align.center', 'Align Center'),
                        icon: 'mdi-format-align-center',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'center' })),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('center').run()),
                    },
                    {
                        title: t('ve.editor.align.right', 'Align Right'),
                        icon: 'mdi-format-align-right',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'right' })),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('right').run()),
                    },
                    {
                        title: t('ve.editor.align.justify', 'Justify'),
                        icon: 'mdi-format-align-justify',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive({ textAlign: 'justify' })),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('justify').run()),
                    },
                ],
            });
            const tableMenuItems = [
                {
                    title: t('ve.editor.table.insertTitle', 'Insert Table'),
                    icon: 'mdi-table-plus',
                    onClick: promptForTableInsert,
                },
                {
                    title: t('ve.editor.table.addRowBefore', 'Add Row Before'),
                    icon: 'mdi-table-row-plus-before',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().addRowBefore().run()),
                },
                {
                    title: t('ve.editor.table.addRowAfter', 'Add Row After'),
                    icon: 'mdi-table-row-plus-after',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().addRowAfter().run()),
                },
                {
                    title: t('ve.editor.table.deleteRow', 'Delete Row'),
                    icon: 'mdi-table-row-remove',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().deleteRow().run()),
                },
                {
                    title: t('ve.editor.table.addColumnBefore', 'Add Column Before'),
                    icon: 'mdi-table-column-plus-before',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().addColumnBefore().run()),
                },
                {
                    title: t('ve.editor.table.addColumnAfter', 'Add Column After'),
                    icon: 'mdi-table-column-plus-after',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().addColumnAfter().run()),
                },
                {
                    title: t('ve.editor.table.deleteColumn', 'Delete Column'),
                    icon: 'mdi-table-column-remove',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().deleteColumn().run()),
                },
                {
                    title: t('ve.editor.table.toggleHeaderRow', 'Toggle Header Row'),
                    icon: 'mdi-table-headers-eye',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleHeaderRow().run()),
                },
                {
                    title: t('ve.editor.table.toggleHeaderColumn', 'Toggle Header Column'),
                    icon: 'mdi-table-column-plus-after',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleHeaderColumn().run()),
                },
                {
                    title: t('ve.editor.table.toggleHeaderCell', 'Toggle Header Cell'),
                    icon: 'mdi-table-column',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleHeaderCell().run()),
                },
                {
                    title: t('ve.editor.table.mergeOrSplit', 'Merge Or Split'),
                    icon: 'mdi-table-sync',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().mergeOrSplit().run()),
                },
                {
                    title: t('ve.editor.table.mergeCells', 'Merge Cells'),
                    icon: 'mdi-table-merge-cells',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().mergeCells().run()),
                },
                {
                    title: t('ve.editor.table.splitCell', 'Split Cell'),
                    icon: 'mdi-table-split-cell',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().splitCell().run()),
                },
                {
                    title: t('ve.editor.table.cellAlignLeft', 'Cell Align Left'),
                    icon: 'mdi-format-align-left',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('left').run()),
                },
                {
                    title: t('ve.editor.table.cellAlignCenter', 'Cell Align Center'),
                    icon: 'mdi-format-align-center',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('center').run()),
                },
                {
                    title: t('ve.editor.table.cellAlignRight', 'Cell Align Right'),
                    icon: 'mdi-format-align-right',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('right').run()),
                },
                {
                    title: t('ve.editor.table.cellJustify', 'Cell Justify'),
                    icon: 'mdi-format-align-justify',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('justify').run()),
                },
                {
                    title: t('ve.editor.table.deleteTable', 'Delete Table'),
                    icon: 'mdi-table-remove',
                    disabled: !inTable,
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().deleteTable().run()),
                },
            ];
            const tableMenu = createMenuButton({
                icon: 'mdi-table',
                label: t('ve.editor.table.shortLabel', 'Tbl'),
                title: t('ve.editor.table.actions', 'Table Actions'),
                active: inTable,
                items: tableMenuItems,
            });
            const videoMenuItems = [
                {
                    title: t('ve.editor.video.width100', 'Set 100% Width'),
                    icon: 'mdi-arrow-expand-horizontal',
                    active: inEmbeddedVideo && embeddedVideoWidth === '100%',
                    disabled: !inEmbeddedVideo,
                    onClick: () => setSelectedVideoWidth('100%'),
                },
                {
                    title: t('ve.editor.video.width75', 'Set 75% Width'),
                    icon: 'mdi-arrow-expand-horizontal',
                    active: inEmbeddedVideo && embeddedVideoWidth === '75%',
                    disabled: !inEmbeddedVideo,
                    onClick: () => setSelectedVideoWidth('75%'),
                },
                {
                    title: t('ve.editor.video.width50', 'Set 50% Width'),
                    icon: 'mdi-arrow-collapse-horizontal',
                    active: inEmbeddedVideo && embeddedVideoWidth === '50%',
                    disabled: !inEmbeddedVideo,
                    onClick: () => setSelectedVideoWidth('50%'),
                },
                {
                    title: t('ve.editor.video.customWidth', 'Custom Width'),
                    icon: 'mdi-tune',
                    disabled: !inEmbeddedVideo,
                    onClick: promptForVideoWidth,
                },
            ];
            const videoMenu = createMenuButton({
                icon: 'mdi-video',
                label: t('ve.editor.video.shortLabel', 'Vid'),
                title: t('ve.editor.video.size', 'Video Size'),
                active: inEmbeddedVideo,
                items: videoMenuItems,
            });
            const sourceToggleButton = createIconButton({
                icon: 'mdi-code-braces',
                title: sourceMode.value ? tooltip('ve.editor.source.apply', 'Apply Source Changes', 'Ctrl/Cmd+Alt+S') : tooltip('ve.editor.source.switchToHtml', 'Switch To Source HTML', 'Ctrl/Cmd+Alt+S'),
                active: sourceMode.value,
                onClick: toggleSourceMode,
            });
            const fullscreenButton = props.allowFullscreen ? createIconButton({
                icon: 'mdi-fullscreen',
                title: tooltip('ve.editor.fullscreen.open', 'Open Fullscreen Editor', 'F11'),
                onClick: () => {
                    fullscreenDialog.value = true;
                },
            }) : null;
            const secondaryToolbarItems = [
                createIconButton({
                    icon: 'mdi-format-underline',
                    title: t('ve.editor.mark.underline', 'Underline'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('underline')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleUnderline().run()),
                }),
                createIconButton({
                    icon: 'mdi-format-strikethrough',
                    title: t('ve.editor.mark.strikeThrough', 'Strike Through'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('strike')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleStrike().run()),
                }),
                createIconButton({
                    icon: 'mdi-code-tags',
                    title: t('ve.editor.mark.inlineCode', 'Inline Code'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('code')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCode().run()),
                }),
                createIconButton({
                    icon: 'mdi-format-list-checks',
                    title: t('ve.editor.block.taskList', 'Task List'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('taskList')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
                }),
                createIconButton({
                    icon: 'mdi-function-variant',
                    title: tooltip('ve.editor.formula.inline', 'Insert Inline Formula', 'Ctrl/Cmd+Alt+M'),
                    onClick: () => insertFormula(false),
                }),
                createIconButton({
                    icon: 'mdi-function',
                    title: tooltip('ve.editor.formula.block', 'Insert Block Formula', 'Ctrl/Cmd+Alt+Shift+M'),
                    onClick: () => insertFormula(true),
                }),
                createIconButton({
                    icon: 'mdi-link-variant',
                    title: tooltip('ve.editor.link.insertOrEdit', 'Insert Or Edit Link', 'Ctrl/Cmd+Alt+K'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('link')),
                    onClick: promptForLink,
                }),
                createIconButton({
                    icon: 'mdi-link-variant-off',
                    title: t('ve.editor.link.remove', 'Remove Link'),
                    disabled: !(instance === null || instance === void 0 ? void 0 : instance.isActive('link')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().extendMarkRange('link').unsetLink().run()),
                }),
                createIconButton({
                    icon: 'mdi-image-plus',
                    title: tooltip('ve.editor.image.insert', 'Insert Image', 'Ctrl/Cmd+Alt+I'),
                    onClick: promptForImage,
                }),
                createIconButton({
                    icon: 'mdi-video-plus',
                    title: tooltip('ve.editor.video.insertTitle', 'Insert Video', 'Ctrl/Cmd+Alt+V'),
                    onClick: promptForVideo,
                }),
                createIconButton({
                    icon: 'mdi-minus-circle-off-outline',
                    title: t('ve.editor.clearFormatting', 'Clear Formatting'),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().unsetAllMarks().clearNodes().run()),
                }),
                createIconButton({
                    icon: 'mdi-minus',
                    title: t('ve.editor.insertHorizontalRule', 'Insert Horizontal Rule'),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setHorizontalRule().run()),
                }),
            ];
            const moreMenu = createMenuButton({
                icon: 'mdi-dots-horizontal',
                label: '',
                title: t('ve.editor.moreActions', 'More Actions'),
                items: [
                    {
                        title: t('ve.editor.mark.underline', 'Underline'),
                        icon: 'mdi-format-underline',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('underline')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleUnderline().run()),
                    },
                    {
                        title: t('ve.editor.mark.strikeThrough', 'Strike Through'),
                        icon: 'mdi-format-strikethrough',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('strike')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleStrike().run()),
                    },
                    {
                        title: t('ve.editor.mark.inlineCode', 'Inline Code'),
                        icon: 'mdi-code-tags',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('code')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCode().run()),
                    },
                    {
                        title: t('ve.editor.block.taskList', 'Task List'),
                        icon: 'mdi-format-list-checks',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('taskList')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
                    },
                    {
                        title: t('ve.editor.formula.inline', 'Insert Inline Formula'),
                        icon: 'mdi-function-variant',
                        onClick: () => insertFormula(false),
                    },
                    {
                        title: t('ve.editor.formula.block', 'Insert Block Formula'),
                        icon: 'mdi-function',
                        onClick: () => insertFormula(true),
                    },
                    {
                        title: t('ve.editor.link.insertOrEdit', 'Insert Or Edit Link'),
                        icon: 'mdi-link-variant',
                        active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('link')),
                        onClick: promptForLink,
                    },
                    {
                        title: t('ve.editor.link.remove', 'Remove Link'),
                        icon: 'mdi-link-variant-off',
                        disabled: !(instance === null || instance === void 0 ? void 0 : instance.isActive('link')),
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().extendMarkRange('link').unsetLink().run()),
                    },
                    {
                        title: t('ve.editor.image.insert', 'Insert Image'),
                        icon: 'mdi-image-plus',
                        onClick: promptForImage,
                    },
                    {
                        title: t('ve.editor.video.insertTitle', 'Insert Video'),
                        icon: 'mdi-video-plus',
                        onClick: promptForVideo,
                    },
                    ...videoMenuItems.map((item) => (Object.assign(Object.assign({}, item), { title: t('ve.editor.video.prefixedAction', `Video: ${item.title}`, { title: item.title }) }))),
                    {
                        title: t('ve.editor.clearFormatting', 'Clear Formatting'),
                        icon: 'mdi-minus-circle-off-outline',
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().unsetAllMarks().clearNodes().run()),
                    },
                    {
                        title: t('ve.editor.insertHorizontalRule', 'Insert Horizontal Rule'),
                        icon: 'mdi-minus',
                        onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setHorizontalRule().run()),
                    },
                    ...tableMenuItems.map((item) => (Object.assign(Object.assign({}, item), { title: t('ve.editor.table.prefixedAction', `Table: ${item.title}`, { title: item.title }) }))),
                ],
            });
            const visualToolbarItems = [
                createIconButton({
                    icon: 'mdi-undo',
                    title: tooltip('ve.common.undo', 'Undo', 'Ctrl/Cmd+Z'),
                    disabled: !(instance === null || instance === void 0 ? void 0 : instance.can().undo()),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().undo().run()),
                }),
                createIconButton({
                    icon: 'mdi-redo',
                    title: tooltip('ve.common.redo', 'Redo', 'Ctrl/Cmd+Shift+Z'),
                    disabled: !(instance === null || instance === void 0 ? void 0 : instance.can().redo()),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().redo().run()),
                }),
                (0, vue_1.h)(components_1.VDivider, { vertical: true, class: 'mx-1' }),
                blockMenu,
                alignMenu,
                createIconButton({
                    icon: 'mdi-format-bold',
                    title: tooltip('ve.editor.mark.bold', 'Bold', 'Ctrl/Cmd+B'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('bold')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBold().run()),
                }),
                createIconButton({
                    icon: 'mdi-format-italic',
                    title: tooltip('ve.editor.mark.italic', 'Italic', 'Ctrl/Cmd+I'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('italic')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleItalic().run()),
                }),
                createIconButton({
                    icon: 'mdi-format-list-bulleted',
                    title: tooltip('ve.editor.list.bulleted', 'Bullet List', 'Ctrl/Cmd+Shift+8'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('bulletList')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBulletList().run()),
                }),
                createIconButton({
                    icon: 'mdi-format-list-numbered',
                    title: tooltip('ve.editor.list.numbered', 'Numbered List', 'Ctrl/Cmd+Shift+7'),
                    active: !!(instance === null || instance === void 0 ? void 0 : instance.isActive('orderedList')),
                    onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleOrderedList().run()),
                }),
            ];
            const compactToolbarItems = [sourceToggleButton, fullscreenButton].filter(Boolean);
            const sourceToolbarItems = [
                createIconButton({
                    icon: 'mdi-check',
                    title: t('ve.editor.source.apply', 'Apply Source Changes'),
                    onClick: applySourceMode,
                }),
                createIconButton({
                    icon: 'mdi-close',
                    title: t('ve.editor.source.cancel', 'Cancel Source Changes'),
                    onClick: cancelSourceMode,
                }),
                fullscreenButton,
            ].filter(Boolean);
            const toolbar = !isReadOnly ? (0, vue_1.h)('div', {
                class: 'vef-tiptap__toolbar',
            }, sourceMode.value
                ? sourceToolbarItems
                : [
                    ...visualToolbarItems,
                    ...(toolbarCompact.value ? [moreMenu] : [...secondaryToolbarItems, tableMenu, videoMenu]),
                    (0, vue_1.h)(components_1.VDivider, { vertical: true, class: 'mx-1' }),
                    ...compactToolbarItems,
                ]) : null;
            const editorBody = sourceMode.value
                ? (0, vue_1.h)(components_1.VTextarea, {
                    modelValue: sourceDraft.value,
                    readonly: props.readonly,
                    disabled: props.disabled,
                    'onUpdate:modelValue': (value) => {
                        sourceDraft.value = String(value || '');
                    },
                    autoGrow: false,
                    rows: typeof props.height === 'number' ? Math.max(Math.round((props.height - 56) / 24), 10) : 14,
                    variant: 'plain',
                    hideDetails: true,
                    class: ['vef-tiptap__source'],
                    style: {
                        minHeight: contentMinHeight,
                    },
                })
                : (instance ? [(0, vue_1.h)(vue_3_1.EditorContent, { editor: instance })] : []);
            return (0, vue_1.h)('div', {
                style: {
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: '0',
                },
            }, [
                (0, vue_1.h)(components_1.VSheet, Object.assign(Object.assign({ ref: rootEl }, attrs), { class: ['vef-tiptap', attrs.class], style: [
                        attrs.style,
                        {
                            width: '100%',
                            maxWidth: '100%',
                            minWidth: '0',
                            minHeight: height,
                        },
                    ], border: true, rounded: 'lg' }), {
                    default: () => [
                        toolbar,
                        (0, vue_1.h)('div', {
                            ref: hostEl,
                            class: ['vef-tiptap__host', sourceMode.value ? 'vef-tiptap__host--source' : ''],
                            style: {
                                width: '100%',
                                maxWidth: '100%',
                                minWidth: '0',
                                minHeight: contentMinHeight,
                            },
                        }, editorBody),
                    ],
                }),
                props.allowFullscreen ? (0, vue_1.h)(components_1.VDialog, {
                    modelValue: fullscreenDialog.value,
                    'onUpdate:modelValue': (value) => {
                        fullscreenDialog.value = value;
                    },
                    fullscreen: true,
                }, {
                    default: () => (0, vue_1.h)('div', {
                        class: 'vef-tiptap__fullscreen-shell',
                    }, [
                        (0, vue_1.h)(exports.TiptapHtmlEditor, {
                            modelValue: props.modelValue,
                            readonly: props.readonly,
                            disabled: props.disabled,
                            placeholder: props.placeholder,
                            height: 'calc(100vh - 32px)',
                            allowFullscreen: false,
                            'onUpdate:modelValue': (value) => emit('update:modelValue', value),
                        }),
                        (0, vue_1.h)(components_1.VBtn, {
                            icon: 'mdi-close',
                            title: t('ve.editor.fullscreen.close', 'Close Fullscreen'),
                            class: ['vef-tiptap__fullscreen-close'],
                            onClick: () => {
                                fullscreenDialog.value = false;
                            },
                        }),
                    ]),
                }) : null,
            ]);
        };
    },
});
