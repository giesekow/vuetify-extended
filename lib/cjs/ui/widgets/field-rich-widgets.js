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
exports.buildImageWidget = exports.buildMapWidget = exports.buildChartWidget = exports.buildMessageBoxWidget = exports.buildCodeWidget = exports.buildHTMLWidget = void 0;
const vue_1 = require("vue");
const components_1 = require("vuetify/components");
const vue3_ace_editor_1 = require("vue3-ace-editor");
require("ace-builds/src-noconflict/mode-text");
require("ace-builds/src-noconflict/mode-json");
require("ace-builds/src-noconflict/mode-javascript");
require("ace-builds/src-noconflict/mode-html");
require("ace-builds/src-noconflict/mode-python");
require("ace-builds/src-noconflict/mode-ejs");
require("ace-builds/src-noconflict/mode-latex");
require("ace-builds/src-noconflict/theme-chrome");
require("ace-builds/src-noconflict/theme-xcode");
require("ace-builds/src-noconflict/worker-json");
require("ace-builds/src-noconflict/worker-javascript");
require("ace-builds/src-noconflict/worker-html");
const vue3_apexcharts_1 = __importDefault(require("vue3-apexcharts"));
const vue3_google_map_1 = require("vue3-google-map");
const tinymce_vue_1 = __importDefault(require("@tinymce/tinymce-vue"));
const misc_1 = require("../../misc");
const dialogs_1 = require("../dialogs");
const googleMapsPromiseCache = new Map();
function getGoogleMapsApiPromise(options) {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Google Maps requires a browser environment.'));
    }
    const existingGoogle = window.google;
    if (existingGoogle === null || existingGoogle === void 0 ? void 0 : existingGoogle.maps) {
        return Promise.resolve(existingGoogle);
    }
    const libraries = [...new Set((options.libraries || []).filter(Boolean))].sort();
    const cacheKey = JSON.stringify({
        apiKey: options.apiKey,
        language: options.language || '',
        region: options.region || '',
        version: options.version || 'weekly',
        libraries,
    });
    const cached = googleMapsPromiseCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const promise = new Promise((resolve, reject) => {
        var _a;
        const callbackName = '__vuetifyExtendedGoogleMapsCallback';
        const scriptId = '__vuetifyExtendedGoogleMapsScript';
        const params = new URLSearchParams();
        params.set('callback', callbackName);
        params.set('loading', 'async');
        params.set('key', options.apiKey);
        params.set('v', options.version || 'weekly');
        if (libraries.length) {
            params.set('libraries', libraries.join(','));
        }
        if (options.language) {
            params.set('language', options.language);
        }
        if (options.region) {
            params.set('region', options.region);
        }
        const cleanup = () => {
            try {
                delete window[callbackName];
            }
            catch (_error) {
                window[callbackName] = undefined;
            }
        };
        window[callbackName] = () => {
            cleanup();
            resolve(window.google);
        };
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            if ((_a = window.google) === null || _a === void 0 ? void 0 : _a.maps) {
                cleanup();
                resolve(window.google);
                return;
            }
            existingScript.addEventListener('error', () => {
                cleanup();
                googleMapsPromiseCache.delete(cacheKey);
                reject(new Error('Failed to load Google Maps JavaScript API.'));
            }, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.defer = true;
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        script.onerror = () => {
            cleanup();
            googleMapsPromiseCache.delete(cacheKey);
            reject(new Error('Failed to load Google Maps JavaScript API.'));
        };
        document.head.appendChild(script);
    });
    googleMapsPromiseCache.set(cacheKey, promise);
    return promise;
}
const SafeGoogleMap = (0, vue_1.defineComponent)({
    name: 'VuetifyExtendedSafeGoogleMap',
    inheritAttrs: false,
    props: {
        apiPromise: {
            type: Object,
            required: true,
        },
        mapProps: {
            type: Object,
            required: true,
        },
    },
    setup(props, { slots }) {
        let active = true;
        const renderReady = (0, vue_1.shallowRef)(false);
        const guardedPromise = new Promise((resolve, reject) => {
            props.apiPromise
                .then((google) => {
                if (active) {
                    resolve(google);
                }
            })
                .catch((error) => {
                if (active) {
                    reject(error);
                }
            });
        });
        (0, vue_1.onMounted)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, vue_1.nextTick)();
            if (active) {
                renderReady.value = true;
            }
        }));
        (0, vue_1.onBeforeUnmount)(() => {
            active = false;
            renderReady.value = false;
        });
        return () => renderReady.value ? (0, vue_1.h)(vue3_google_map_1.GoogleMap, Object.assign(Object.assign({}, props.mapProps), { apiPromise: guardedPromise }), slots) : null;
    },
});
function buildHTMLWidget(field) {
    const h = field.$h;
    const editor = h(tinymce_vue_1.default, {
        apiKey: 'ee1xu2usg9edqb2dtfggyg50ghsc6snlrhdkagr9425luz2a',
        modelValue: field.modelValue.value,
        readonly: field.$readonly,
        disabled: field.$readonly,
        init: {
            plugins: 'lists link table image emoticons autoresize',
            setup: (editor) => {
                field.registerHtmlEditor(editor);
            }
        },
        placeholder: field.params.value.placeholder,
        height: field.params.value.height || 300,
        class: field.params.value.class || [],
        style: field.params.value.style || {},
        onInit: (_evt, editor) => {
            field.onHtmlEditorReady(editor);
        },
        "onUpdate:modelValue": (v) => {
            field.modelValue.value = v;
        }
    });
    const fullscreenBtn = h(components_1.VBtn, {
        icon: 'mdi-fullscreen',
        size: 'small',
        style: {
            'margin-top': '-64px'
        },
        onClick: () => {
            var _a;
            const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Preview</title>
          <link rel="stylesheet" href="katex/dist/katex.min.css">
        </head>
        <bod>${field.renderMathInHtml((_a = field.modelValue.value) !== null && _a !== void 0 ? _a : "")}</body>
        </html>
        `;
            field.showPreviewFullscreen(html);
        }
    });
    return h(components_1.VRow, {}, () => [
        h(components_1.VCol, {
            cols: 12
        }, () => h('div', {
            class: ['text-subtitle-2']
        }, field.params.value.label)),
        h(components_1.VCol, {
            cols: 12,
        }, () => h(components_1.VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth: field.maxWidth.value,
            elevation: 0
        }, () => [editor, fullscreenBtn])),
    ]);
}
exports.buildHTMLWidget = buildHTMLWidget;
function buildCodeWidget(field) {
    var _a;
    const h = field.$h;
    const editor = h(vue3_ace_editor_1.VAceEditor, {
        value: (_a = field.modelValue.value) !== null && _a !== void 0 ? _a : "",
        lang: field.params.value.lang || 'text',
        theme: field.params.value.codeTheme || "chrome",
        readonly: field.$readonly,
        placeholder: field.params.value.placeholder,
        class: field.params.value.class || [],
        style: Object.assign(Object.assign({ "font-size": "12pt" }, (field.params.value.style || {})), { height: field.params.value.height || "300px", "max-width": field.maxWidth.value }),
        onInit: (e) => {
            // Keep Ace workers off in the library widgets so bundlers do not need
            // extra worker asset wiring for dynamic form remounts.
            e.setOptions({ useWorker: false });
        },
        "onUpdate:value": (v) => {
            field.modelValue.value = v;
        }
    });
    const fullscreenBtn = h(components_1.VBtn, {
        icon: 'mdi-fullscreen',
        size: 'small',
        onClick: () => {
            var _a;
            field.renderLatex((_a = field.modelValue.value) !== null && _a !== void 0 ? _a : "");
            field.showPreviewFullscreen(field.codePreview.value);
        }
    });
    return [
        h('div', {
            class: ['ml-4', 'mb-4']
        }, h('label', {}, field.params.value.label)),
        ...(field.params.value.lang === 'latex' ? [editor, fullscreenBtn] : [editor]),
        ...(field.params.value.hint ?
            [h('div', {
                    class: ['ml-4', 'mb-4']
                }, h('label', {}, field.params.value.hint))] : [])
    ];
}
exports.buildCodeWidget = buildCodeWidget;
function buildMessageBoxWidget(field) {
    const h = field.$h;
    let items = field.modelValue.value || [];
    if (!Array.isArray(items))
        items = [items];
    items = field.messageFormat(items);
    const windowInfo = field.getMessageWindow(items);
    const messages = normalizeMessages(windowInfo.items);
    return h(components_1.VRow, {}, () => [
        h(components_1.VCol, {
            cols: 12,
        }, () => h('div', {
            class: ['text-subtitle-2']
        }, field.params.value.label)),
        h(components_1.VCol, {
            cols: 12,
        }, () => h(components_1.VCard, {
            ref: (el) => field.setMessageScrollContainer(el),
            class: ['overflow-y-auto', 'mx-auto', 'pa-4'],
            maxWidth: field.maxWidth.value,
            elevation: 0,
            variant: 'outlined',
            style: {
                minHeight: '220px',
                maxHeight: `${field.params.value.height || 340}px`,
                background: 'rgba(var(--v-theme-surface), 0.7)',
            }
        }, () => [
            ...(windowInfo.hasEarlier ? [
                h('div', {
                    class: ['mb-4', 'text-center']
                }, h(components_1.VBtn, {
                    variant: 'text',
                    color: 'primary',
                    onClick: () => field.loadEarlierMessages(windowInfo.items.length + windowInfo.earlierCount)
                }, () => `Load ${Math.min(windowInfo.pageSize, windowInfo.earlierCount)} earlier messages`))
            ] : []),
            ...(messages.length === 0 ? [
                h('div', {
                    class: ['text-medium-emphasis', 'text-body-2', 'py-8', 'text-center']
                }, 'No messages yet.')
            ] : messages.map((item, index) => {
                if (item.$type === 'day-separator') {
                    return h('div', {
                        class: ['d-flex', 'align-center', 'my-4']
                    }, [
                        h('div', { class: ['flex-grow-1'], style: { height: '1px', background: 'rgba(0,0,0,0.12)' } }),
                        h('div', {
                            class: ['px-3', 'text-caption', 'text-medium-emphasis']
                        }, item.label),
                        h('div', { class: ['flex-grow-1'], style: { height: '1px', background: 'rgba(0,0,0,0.12)' } }),
                    ]);
                }
                return h(components_1.VRow, {
                    key: `msg-${index}`,
                    class: ['my-1'],
                    justify: item.right ? 'end' : 'start'
                }, () => [
                    h(components_1.VCol, {
                        cols: 12,
                        class: [item.right ? 'text-right' : 'text-left']
                    }, () => [
                        ...(item.showUser && item.user ? [
                            h('div', {
                                class: ['text-caption', 'font-weight-bold', 'mb-1', 'px-1', 'text-medium-emphasis']
                            }, item.user)
                        ] : []),
                        h(components_1.VSheet, {
                            rounded: 'lg',
                            border: true,
                            elevation: item.system ? 0 : 1,
                            minWidth: item.minWidth,
                            maxWidth: item.maxWidth || '80%',
                            width: item.width,
                            class: ["pa-3", item.system ? 'mx-auto' : 'd-inline-block'],
                            color: item.color || (item.system ? 'grey-lighten-4' : undefined),
                            theme: item.theme,
                            style: item.system ? {
                                maxWidth: '100%',
                            } : undefined
                        }, () => [
                            h('div', Object.assign({ class: ['text-body-2'] }, (item.html ? { innerHTML: item.html } : {})), item.html ? undefined : item.message),
                            ...(item.attachments.length > 0 ? [
                                h('div', {
                                    class: ['mt-3']
                                }, item.attachments.map((attachment, attachmentIndex) => renderMessageAttachment(field, attachment, `${index}-${attachmentIndex}`)))
                            ] : []),
                            ...((item.timestampLabel || item.status) ? [
                                h('div', {
                                    class: ['text-caption', 'mt-2', 'text-medium-emphasis']
                                }, [item.timestampLabel, item.status].filter(Boolean).join(' • '))
                            ] : [])
                        ])
                    ])
                ]);
            }))
        ]))
    ]);
}
exports.buildMessageBoxWidget = buildMessageBoxWidget;
function normalizeMessages(items) {
    const list = Array.isArray(items) ? items.filter((item) => item) : [];
    const normalized = list.map((item) => {
        const timestamp = resolveTimestamp(item);
        return Object.assign(Object.assign({}, item), { system: item.system === true || item.type === 'system', right: item.right === true, user: item.user || item.sender || item.author || '', message: item.message || item.text || '', html: item.html, attachments: normalizeAttachments(item), timestamp, timestampLabel: timestamp ? formatTimestamp(timestamp) : undefined });
    });
    const rows = [];
    let lastDateLabel;
    normalized.forEach((item, index) => {
        const dateLabel = item.timestamp ? formatDayLabel(item.timestamp) : undefined;
        if (dateLabel && dateLabel !== lastDateLabel) {
            rows.push({
                $type: 'day-separator',
                label: dateLabel,
            });
            lastDateLabel = dateLabel;
        }
        const prev = index > 0 ? normalized[index - 1] : undefined;
        const sameGroup = !!prev
            && !item.system
            && !prev.system
            && prev.user === item.user
            && prev.right === item.right
            && sameDay(prev.timestamp, item.timestamp);
        rows.push(Object.assign(Object.assign({}, item), { showUser: item.system ? false : !sameGroup }));
    });
    return rows;
}
function resolveTimestamp(item) {
    const raw = (item === null || item === void 0 ? void 0 : item.timestamp) || (item === null || item === void 0 ? void 0 : item.time) || (item === null || item === void 0 ? void 0 : item.createdAt) || (item === null || item === void 0 ? void 0 : item.date);
    if (!raw) {
        return undefined;
    }
    const value = raw instanceof Date ? raw : new Date(raw);
    return Number.isNaN(value.getTime()) ? undefined : value;
}
function formatTimestamp(value) {
    return value.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}
function formatDayLabel(value) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const valueStart = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
    const diffDays = Math.round((todayStart - valueStart) / 86400000);
    if (diffDays === 0)
        return 'Today';
    if (diffDays === 1)
        return 'Yesterday';
    return value.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
function sameDay(a, b) {
    if (!a || !b) {
        return false;
    }
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}
function normalizeAttachments(item) {
    const raw = (item === null || item === void 0 ? void 0 : item.attachments) || (item === null || item === void 0 ? void 0 : item.files) || [];
    const list = Array.isArray(raw) ? raw : [raw];
    return list
        .filter((attachment) => attachment)
        .map((attachment) => {
        if (typeof attachment === 'string') {
            return {
                name: attachment.split('/').pop() || 'Attachment',
                url: attachment,
            };
        }
        return {
            name: attachment.name || attachment.filename || attachment.label || 'Attachment',
            url: attachment.url || attachment.href || attachment.src || attachment.data,
            type: attachment.type || attachment.mimeType || attachment.mime,
            size: attachment.size,
        };
    });
}
function renderMessageAttachment(field, attachment, key) {
    const h = field.$h;
    const image = isImageAttachment(attachment);
    if (image && attachment.url) {
        return h('div', {
            key,
            class: ['mb-2']
        }, h(components_1.VCard, {
            variant: 'outlined',
            class: ['pa-2'],
            style: {
                maxWidth: '240px',
                cursor: 'pointer',
            },
            onClick: () => openAttachment(field, attachment)
        }, () => [
            h(components_1.VImg, {
                src: attachment.url,
                height: 140,
                cover: true,
                class: ['rounded']
            }),
            h('div', {
                class: ['text-caption', 'mt-2', 'text-medium-emphasis']
            }, attachment.name)
        ]));
    }
    return h('div', {
        key,
        class: ['mb-2']
    }, h(components_1.VSheet, {
        rounded: 'lg',
        border: true,
        class: ['d-inline-flex', 'align-center', 'px-3', 'py-2'],
        style: {
            cursor: attachment.url ? 'pointer' : 'default',
            gap: '10px',
            maxWidth: '100%',
        },
        onClick: () => openAttachment(field, attachment)
    }, () => [
        h(components_1.VIcon, {}, () => attachmentIcon(attachment)),
        h('div', {
            class: ['text-left']
        }, [
            h('div', {
                class: ['text-body-2', 'font-weight-medium']
            }, attachment.name),
            ...((attachment.type || attachment.size) ? [
                h('div', {
                    class: ['text-caption', 'text-medium-emphasis']
                }, [attachment.type, formatAttachmentSize(attachment.size)].filter(Boolean).join(' • '))
            ] : [])
        ])
    ]));
}
function openAttachment(field, attachment) {
    if (!(attachment === null || attachment === void 0 ? void 0 : attachment.url) || typeof window === 'undefined') {
        return;
    }
    if (attachment.url.startsWith('data:')) {
        field.showMediaFullscreen(attachment.url);
        return;
    }
    window.open(attachment.url, '_blank', 'noopener');
}
function isImageAttachment(attachment) {
    if ((attachment === null || attachment === void 0 ? void 0 : attachment.type) && typeof attachment.type === 'string') {
        return attachment.type.startsWith('image/');
    }
    return typeof (attachment === null || attachment === void 0 ? void 0 : attachment.url) === 'string' && attachment.url.startsWith('data:image/');
}
function attachmentIcon(attachment) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (isImageAttachment(attachment))
        return 'mdi-image';
    if (((_b = (_a = attachment === null || attachment === void 0 ? void 0 : attachment.type) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, 'pdf')) || ((_d = (_c = attachment === null || attachment === void 0 ? void 0 : attachment.url) === null || _c === void 0 ? void 0 : _c.includes) === null || _d === void 0 ? void 0 : _d.call(_c, '.pdf')))
        return 'mdi-file-pdf-box';
    if (((_f = (_e = attachment === null || attachment === void 0 ? void 0 : attachment.type) === null || _e === void 0 ? void 0 : _e.includes) === null || _f === void 0 ? void 0 : _f.call(_e, 'sheet')) || ((_h = (_g = attachment === null || attachment === void 0 ? void 0 : attachment.url) === null || _g === void 0 ? void 0 : _g.match) === null || _h === void 0 ? void 0 : _h.call(_g, /\.(xlsx|xls|csv)$/i)))
        return 'mdi-file-excel';
    if (((_k = (_j = attachment === null || attachment === void 0 ? void 0 : attachment.type) === null || _j === void 0 ? void 0 : _j.includes) === null || _k === void 0 ? void 0 : _k.call(_j, 'word')) || ((_m = (_l = attachment === null || attachment === void 0 ? void 0 : attachment.url) === null || _l === void 0 ? void 0 : _l.match) === null || _m === void 0 ? void 0 : _m.call(_l, /\.(docx|doc)$/i)))
        return 'mdi-file-word';
    return 'mdi-paperclip';
}
function formatAttachmentSize(size) {
    if (typeof size !== 'number' || Number.isNaN(size) || size <= 0) {
        return undefined;
    }
    if (size < 1024)
        return `${size} B`;
    if (size < 1024 * 1024)
        return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
function buildChartWidget(field) {
    const h = field.$h;
    if (!field.chartLoaded.value) {
        field.loadChart();
        return undefined;
    }
    return [
        h('div', {
            class: ['ml-2', 'mb-4'],
            innerHTML: field.params.value.label
        }),
        h(vue3_apexcharts_1.default, {
            type: field.params.value.chartType,
            options: field.chartOpts.value || {},
            series: field.chartValue.value || [],
            height: field.params.value.height || 300,
            width: field.maxWidth.value,
        })
    ];
}
exports.buildChartWidget = buildChartWidget;
function getMapWidgetState(field) {
    return field.getState('__ve_map_widget_state', () => ({
        locationEntries: field.$makeRef([]),
        draftPolygonPaths: field.$makeRef([]),
        draftLinePaths: field.$makeRef([]),
        locationPage: field.$makeRef(0),
        mapComponentRef: (0, vue_1.shallowRef)(),
        locationCache: {},
        locationPending: {},
    }));
}
function isPolygonMap(field) {
    return field.params.value.type === 'map-polygon';
}
function isLineMap(field) {
    return field.params.value.type === 'map-line';
}
function isCircleMap(field) {
    return field.params.value.type === 'map-circle';
}
function isRectangleMap(field) {
    return field.params.value.type === 'map-rectangle';
}
function isMultiPointMap(field) {
    return field.params.value.type === 'map' && !!field.params.value.multiple;
}
function isHeatmapMap(field) {
    return field.params.value.type === 'map-heatmap';
}
function isClusterMap(field) {
    return field.params.value.type === 'map-cluster';
}
function isGeoJsonMap(field) {
    return field.params.value.type === 'map-geojson';
}
function normalizePoint(value) {
    if (!value) {
        return undefined;
    }
    if (typeof value.lat === 'number' && typeof value.lng === 'number') {
        return { lat: value.lat, lng: value.lng };
    }
    if (Array.isArray(value.coordinates) && value.coordinates.length >= 2) {
        return {
            lat: Number(value.coordinates[1]),
            lng: Number(value.coordinates[0]),
        };
    }
    if (Array.isArray(value) && value.length >= 2) {
        return {
            lat: Number(value[1]),
            lng: Number(value[0]),
        };
    }
    return undefined;
}
function normalizePointList(value) {
    if (!value) {
        return [];
    }
    if (Array.isArray(value)) {
        if (!value.length) {
            return [];
        }
        const looksLikePointArray = value.every((item) => !!normalizePoint(item));
        if (looksLikePointArray) {
            return value
                .map((item) => normalizePoint(item))
                .filter((item) => !!item);
        }
    }
    const point = normalizePoint(value);
    return point ? [point] : [];
}
function pointKey(point) {
    return `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`;
}
function normalizePathCoordinates(value, geometryType) {
    var _a;
    if (!value) {
        return [];
    }
    const geometry = value.type === 'Feature' ? value.geometry : value;
    let raw = [];
    if (geometryType === 'LineString' && (geometry === null || geometry === void 0 ? void 0 : geometry.type) === 'LineString' && Array.isArray(geometry.coordinates)) {
        raw = geometry.coordinates;
    }
    else if (geometryType === 'Polygon' && (geometry === null || geometry === void 0 ? void 0 : geometry.type) === 'Polygon' && Array.isArray((_a = geometry.coordinates) === null || _a === void 0 ? void 0 : _a[0])) {
        raw = geometry.coordinates[0];
    }
    else if (Array.isArray(value)) {
        raw = value;
    }
    const points = raw
        .map((item) => {
        if (Array.isArray(item) && item.length >= 2) {
            return { lat: Number(item[1]), lng: Number(item[0]) };
        }
        if (item && typeof item.lat === 'number' && typeof item.lng === 'number') {
            return { lat: item.lat, lng: item.lng };
        }
        return undefined;
    })
        .filter((item) => !!item && !Number.isNaN(item.lat) && !Number.isNaN(item.lng));
    if (geometryType === 'Polygon' && points.length > 1) {
        const first = points[0];
        const last = points[points.length - 1];
        if (first.lat === last.lat && first.lng === last.lng) {
            points.pop();
        }
    }
    return points;
}
function normalizeLineCoordinates(value) {
    return normalizePathCoordinates(value, 'LineString');
}
function normalizePolygonCoordinates(value) {
    return normalizePathCoordinates(value, 'Polygon');
}
function toGeoJsonLineString(paths) {
    const normalized = paths
        .map((item) => ({ lat: Number(item.lat), lng: Number(item.lng) }))
        .filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));
    if (normalized.length < 2) {
        return undefined;
    }
    return {
        type: 'LineString',
        coordinates: normalized.map((item) => [item.lng, item.lat]),
    };
}
function toGeoJsonPolygon(paths) {
    const normalized = paths
        .map((item) => ({ lat: Number(item.lat), lng: Number(item.lng) }))
        .filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));
    if (normalized.length < 3) {
        return undefined;
    }
    const closed = [...normalized];
    const first = closed[0];
    const last = closed[closed.length - 1];
    if (!last || first.lat !== last.lat || first.lng !== last.lng) {
        closed.push(Object.assign({}, first));
    }
    return {
        type: 'Polygon',
        coordinates: [closed.map((item) => [item.lng, item.lat])],
    };
}
function normalizeCircleValue(value) {
    if (!value) {
        return undefined;
    }
    const center = normalizePoint(value.center || value.position || value);
    const radius = Number(value.radius);
    if (!center || Number.isNaN(radius) || radius <= 0) {
        return undefined;
    }
    return { center, radius };
}
function normalizeHeatmapPoints(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((item) => {
        const point = normalizePoint((item === null || item === void 0 ? void 0 : item.location) || item);
        if (!point) {
            return undefined;
        }
        const weight = item && item.weight !== undefined ? Number(item.weight) : undefined;
        return Object.assign({ location: point }, (weight !== undefined && !Number.isNaN(weight) ? { weight } : {}));
    })
        .filter((item) => !!item);
}
function normalizeGeoJsonSource(value) {
    if (!value) {
        return undefined;
    }
    if (value.type === 'FeatureCollection' || value.type === 'Feature') {
        return value;
    }
    if (typeof value.type === 'string') {
        return {
            type: 'FeatureCollection',
            features: [{ type: 'Feature', geometry: value, properties: {} }],
        };
    }
    return undefined;
}
function extractGeoJsonPoints(value) {
    const source = normalizeGeoJsonSource(value);
    if (!source) {
        return [];
    }
    const result = [];
    const collectGeometry = (geometry) => {
        if (!geometry || typeof geometry.type !== 'string') {
            return;
        }
        switch (geometry.type) {
            case 'Point':
                if (Array.isArray(geometry.coordinates) && geometry.coordinates.length >= 2) {
                    result.push({ lat: Number(geometry.coordinates[1]), lng: Number(geometry.coordinates[0]) });
                }
                break;
            case 'MultiPoint':
            case 'LineString':
                (geometry.coordinates || []).forEach((item) => {
                    if (Array.isArray(item) && item.length >= 2) {
                        result.push({ lat: Number(item[1]), lng: Number(item[0]) });
                    }
                });
                break;
            case 'MultiLineString':
            case 'Polygon':
                (geometry.coordinates || []).forEach((segment) => {
                    (segment || []).forEach((item) => {
                        if (Array.isArray(item) && item.length >= 2) {
                            result.push({ lat: Number(item[1]), lng: Number(item[0]) });
                        }
                    });
                });
                break;
            case 'MultiPolygon':
                (geometry.coordinates || []).forEach((polygon) => {
                    (polygon || []).forEach((segment) => {
                        (segment || []).forEach((item) => {
                            if (Array.isArray(item) && item.length >= 2) {
                                result.push({ lat: Number(item[1]), lng: Number(item[0]) });
                            }
                        });
                    });
                });
                break;
            case 'GeometryCollection':
                (geometry.geometries || []).forEach((item) => collectGeometry(item));
                break;
        }
    };
    if (source.type === 'FeatureCollection') {
        (source.features || []).forEach((feature) => collectGeometry(feature === null || feature === void 0 ? void 0 : feature.geometry));
    }
    else if (source.type === 'Feature') {
        collectGeometry(source.geometry);
    }
    return result.filter((item) => !Number.isNaN(item.lat) && !Number.isNaN(item.lng));
}
function syncGeoJsonDisplay(field, state, map) {
    var _a, _b;
    if (!(map === null || map === void 0 ? void 0 : map.data)) {
        return;
    }
    const source = isGeoJsonMap(field) ? normalizeGeoJsonSource(field.modelValue.value) : undefined;
    const style = ((_a = field.params.value.mapOptions) === null || _a === void 0 ? void 0 : _a.geoJsonStyle) || ((_b = field.params.value.mapOptions) === null || _b === void 0 ? void 0 : _b.style) || {
        fillColor: '#146eb4',
        fillOpacity: 0.18,
        strokeColor: '#146eb4',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        clickable: false,
    };
    const signature = JSON.stringify(source || null) + JSON.stringify(style || null);
    if (state.geoJsonSignature === signature) {
        return;
    }
    state.geoJsonSignature = signature;
    const existing = [];
    map.data.forEach((feature) => existing.push(feature));
    existing.forEach((feature) => map.data.remove(feature));
    if (source) {
        map.data.addGeoJson(source);
    }
    map.data.setStyle(style);
}
function normalizeRectangleValue(value) {
    if (!value) {
        return undefined;
    }
    const source = value.bounds || value;
    const north = Number(source.north);
    const south = Number(source.south);
    const east = Number(source.east);
    const west = Number(source.west);
    if ([north, south, east, west].some((item) => Number.isNaN(item))) {
        return undefined;
    }
    return { north, south, east, west };
}
function rectangleFromCenter(point, radiusMeters = 500) {
    const latDelta = radiusMeters / 111320;
    const lngDelta = radiusMeters / (111320 * Math.max(Math.cos(point.lat * Math.PI / 180), 0.1));
    return {
        north: point.lat + latDelta,
        south: point.lat - latDelta,
        east: point.lng + lngDelta,
        west: point.lng - lngDelta,
    };
}
function rectangleToPoints(bounds) {
    return [
        { lat: bounds.north, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east },
        { lat: bounds.south, lng: bounds.east },
        { lat: bounds.south, lng: bounds.west },
    ];
}
function circleToPoints(circle) {
    const latDelta = circle.radius / 111320;
    const lngDelta = circle.radius / (111320 * Math.max(Math.cos(circle.center.lat * Math.PI / 180), 0.1));
    return [
        circle.center,
        { lat: circle.center.lat + latDelta, lng: circle.center.lng },
        { lat: circle.center.lat - latDelta, lng: circle.center.lng },
        { lat: circle.center.lat, lng: circle.center.lng + lngDelta },
        { lat: circle.center.lat, lng: circle.center.lng - lngDelta },
    ];
}
function pointsCenter(paths, fallback) {
    if (!paths.length) {
        return fallback;
    }
    const aggregate = paths.reduce((acc, item) => {
        acc.lat += item.lat;
        acc.lng += item.lng;
        return acc;
    }, { lat: 0, lng: 0 });
    return {
        lat: aggregate.lat / paths.length,
        lng: aggregate.lng / paths.length,
    };
}
function clearMapListeners(listeners) {
    (listeners || []).forEach((listener) => {
        if (listener === null || listener === void 0 ? void 0 : listener.remove) {
            listener.remove();
            return;
        }
        if (listener === null || listener === void 0 ? void 0 : listener.removeListener) {
            listener.removeListener();
        }
    });
}
function overlayPathToArray(path) {
    const result = [];
    if (!path) {
        return result;
    }
    for (let index = 0; index < path.getLength(); index++) {
        const point = path.getAt(index);
        result.push({ lat: point.lat(), lng: point.lng() });
    }
    return result;
}
function syncPolygonModel(field, state, polygon) {
    var _a;
    const points = overlayPathToArray((_a = polygon === null || polygon === void 0 ? void 0 : polygon.getPath) === null || _a === void 0 ? void 0 : _a.call(polygon));
    const nextValue = toGeoJsonPolygon(points);
    if (nextValue) {
        state.draftPolygonPaths.value = [];
        field.modelValue.value = nextValue;
    }
    else {
        state.draftPolygonPaths.value = points;
        field.modelValue.value = undefined;
    }
}
function syncLineModel(field, state, line) {
    var _a;
    const points = overlayPathToArray((_a = line === null || line === void 0 ? void 0 : line.getPath) === null || _a === void 0 ? void 0 : _a.call(line));
    const nextValue = toGeoJsonLineString(points);
    if (nextValue) {
        state.draftLinePaths.value = [];
        field.modelValue.value = nextValue;
    }
    else {
        state.draftLinePaths.value = points;
        field.modelValue.value = undefined;
    }
}
function syncPolygonListeners(field, state, api, polygon) {
    var _a;
    if (!(api === null || api === void 0 ? void 0 : api.event) || !polygon || state.boundPolygon === polygon) {
        return;
    }
    clearMapListeners(state.polygonListeners);
    clearMapListeners(state.polygonPathListeners);
    state.boundPolygon = polygon;
    state.boundPolygonPath = (_a = polygon.getPath) === null || _a === void 0 ? void 0 : _a.call(polygon);
    state.polygonListeners = [
        api.event.addListener(polygon, 'rightclick', (event) => {
            if (!field.$readonly && typeof (event === null || event === void 0 ? void 0 : event.vertex) === 'number') {
                polygon.getPath().removeAt(event.vertex);
                syncPolygonModel(field, state, polygon);
            }
        }),
        api.event.addListener(polygon, 'mouseup', () => {
            if (!field.$readonly)
                syncPolygonModel(field, state, polygon);
        }),
        api.event.addListener(polygon, 'dragend', () => {
            if (!field.$readonly)
                syncPolygonModel(field, state, polygon);
        }),
    ];
    if (state.boundPolygonPath) {
        state.polygonPathListeners = [
            api.event.addListener(state.boundPolygonPath, 'insert_at', () => syncPolygonModel(field, state, polygon)),
            api.event.addListener(state.boundPolygonPath, 'set_at', () => syncPolygonModel(field, state, polygon)),
            api.event.addListener(state.boundPolygonPath, 'remove_at', () => syncPolygonModel(field, state, polygon)),
        ];
    }
}
function syncLineListeners(field, state, api, line) {
    var _a;
    if (!(api === null || api === void 0 ? void 0 : api.event) || !line || state.boundLine === line) {
        return;
    }
    clearMapListeners(state.lineListeners);
    clearMapListeners(state.linePathListeners);
    state.boundLine = line;
    state.boundLinePath = (_a = line.getPath) === null || _a === void 0 ? void 0 : _a.call(line);
    state.lineListeners = [
        api.event.addListener(line, 'rightclick', (event) => {
            if (!field.$readonly && typeof (event === null || event === void 0 ? void 0 : event.vertex) === 'number') {
                line.getPath().removeAt(event.vertex);
                syncLineModel(field, state, line);
            }
        }),
        api.event.addListener(line, 'mouseup', () => {
            if (!field.$readonly)
                syncLineModel(field, state, line);
        }),
        api.event.addListener(line, 'dragend', () => {
            if (!field.$readonly)
                syncLineModel(field, state, line);
        }),
    ];
    if (state.boundLinePath) {
        state.linePathListeners = [
            api.event.addListener(state.boundLinePath, 'insert_at', () => syncLineModel(field, state, line)),
            api.event.addListener(state.boundLinePath, 'set_at', () => syncLineModel(field, state, line)),
            api.event.addListener(state.boundLinePath, 'remove_at', () => syncLineModel(field, state, line)),
        ];
    }
}
function syncCircleModel(field, circle) {
    var _a, _b;
    const center = (_a = circle === null || circle === void 0 ? void 0 : circle.getCenter) === null || _a === void 0 ? void 0 : _a.call(circle);
    const radius = Number((_b = circle === null || circle === void 0 ? void 0 : circle.getRadius) === null || _b === void 0 ? void 0 : _b.call(circle));
    if (!center || Number.isNaN(radius) || radius <= 0) {
        field.modelValue.value = undefined;
        return;
    }
    field.modelValue.value = {
        center: { lat: center.lat(), lng: center.lng() },
        radius,
    };
}
function syncCircleListeners(field, state, api, circle) {
    if (!(api === null || api === void 0 ? void 0 : api.event) || !circle || state.boundCircle === circle) {
        return;
    }
    clearMapListeners(state.circleListeners);
    state.boundCircle = circle;
    state.circleListeners = [
        api.event.addListener(circle, 'center_changed', () => {
            if (!field.$readonly)
                syncCircleModel(field, circle);
        }),
        api.event.addListener(circle, 'radius_changed', () => {
            if (!field.$readonly)
                syncCircleModel(field, circle);
        }),
        api.event.addListener(circle, 'dragend', () => {
            if (!field.$readonly)
                syncCircleModel(field, circle);
        }),
        api.event.addListener(circle, 'mouseup', () => {
            if (!field.$readonly)
                syncCircleModel(field, circle);
        }),
    ];
}
function syncRectangleModel(field, rectangle) {
    var _a, _b, _c;
    const bounds = (_a = rectangle === null || rectangle === void 0 ? void 0 : rectangle.getBounds) === null || _a === void 0 ? void 0 : _a.call(rectangle);
    const northEast = (_b = bounds === null || bounds === void 0 ? void 0 : bounds.getNorthEast) === null || _b === void 0 ? void 0 : _b.call(bounds);
    const southWest = (_c = bounds === null || bounds === void 0 ? void 0 : bounds.getSouthWest) === null || _c === void 0 ? void 0 : _c.call(bounds);
    if (!northEast || !southWest) {
        field.modelValue.value = undefined;
        return;
    }
    field.modelValue.value = {
        north: northEast.lat(),
        south: southWest.lat(),
        east: northEast.lng(),
        west: southWest.lng(),
    };
}
function syncRectangleListeners(field, state, api, rectangle) {
    if (!(api === null || api === void 0 ? void 0 : api.event) || !rectangle || state.boundRectangle === rectangle) {
        return;
    }
    clearMapListeners(state.rectangleListeners);
    state.boundRectangle = rectangle;
    state.rectangleListeners = [
        api.event.addListener(rectangle, 'bounds_changed', () => {
            if (!field.$readonly)
                syncRectangleModel(field, rectangle);
        }),
        api.event.addListener(rectangle, 'dragend', () => {
            if (!field.$readonly)
                syncRectangleModel(field, rectangle);
        }),
        api.event.addListener(rectangle, 'mouseup', () => {
            if (!field.$readonly)
                syncRectangleModel(field, rectangle);
        }),
    ];
}
function syncPolygonMapClick(field, state, api, map) {
    if (!isPolygonMap(field) || field.$readonly || !(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    if (state.boundPolygonMap === map && state.polygonMapClickListener) {
        return;
    }
    clearMapListeners(state.polygonMapClickListener ? [state.polygonMapClickListener] : []);
    state.boundPolygonMap = map;
    state.polygonMapClickListener = api.event.addListener(map, 'click', (event) => {
        if (!(event === null || event === void 0 ? void 0 : event.latLng)) {
            return;
        }
        const existing = normalizePolygonCoordinates(field.modelValue.value);
        const base = existing.length ? existing : [...state.draftPolygonPaths.value];
        const nextPaths = [...base, { lat: event.latLng.lat(), lng: event.latLng.lng() }];
        if (nextPaths.length >= 3) {
            state.draftPolygonPaths.value = [];
            field.modelValue.value = toGeoJsonPolygon(nextPaths);
        }
        else {
            state.draftPolygonPaths.value = nextPaths;
        }
    });
}
function syncLineMapClick(field, state, api, map) {
    if (!isLineMap(field) || field.$readonly || !(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    if (state.boundLineMap === map && state.lineMapClickListener) {
        return;
    }
    clearMapListeners(state.lineMapClickListener ? [state.lineMapClickListener] : []);
    state.boundLineMap = map;
    state.lineMapClickListener = api.event.addListener(map, 'click', (event) => {
        if (!(event === null || event === void 0 ? void 0 : event.latLng)) {
            return;
        }
        const existing = normalizeLineCoordinates(field.modelValue.value);
        const base = existing.length ? existing : [...state.draftLinePaths.value];
        const nextPaths = [...base, { lat: event.latLng.lat(), lng: event.latLng.lng() }];
        if (nextPaths.length >= 2) {
            state.draftLinePaths.value = [];
            field.modelValue.value = toGeoJsonLineString(nextPaths);
        }
        else {
            state.draftLinePaths.value = nextPaths;
        }
    });
}
function syncPointMapClick(field, state, api, map) {
    if (!isMultiPointMap(field) || field.$readonly || !(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    if (state.boundPointMap === map && state.pointMapClickListener) {
        return;
    }
    clearMapListeners(state.pointMapClickListener ? [state.pointMapClickListener] : []);
    state.boundPointMap = map;
    state.pointMapClickListener = api.event.addListener(map, 'click', (event) => {
        if (!(event === null || event === void 0 ? void 0 : event.latLng)) {
            return;
        }
        field.modelValue.value = [
            ...normalizePointList(field.modelValue.value),
            { lat: event.latLng.lat(), lng: event.latLng.lng() },
        ];
    });
}
function syncCircleMapClick(field, state, api, map) {
    if (!isCircleMap(field) || field.$readonly || !(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    if (state.boundCircleMap === map && state.circleMapClickListener) {
        return;
    }
    clearMapListeners(state.circleMapClickListener ? [state.circleMapClickListener] : []);
    state.boundCircleMap = map;
    state.circleMapClickListener = api.event.addListener(map, 'click', (event) => {
        var _a;
        if (!(event === null || event === void 0 ? void 0 : event.latLng) || normalizeCircleValue(field.modelValue.value)) {
            return;
        }
        field.modelValue.value = {
            center: { lat: event.latLng.lat(), lng: event.latLng.lng() },
            radius: Number((_a = field.params.value.mapOptions) === null || _a === void 0 ? void 0 : _a.radius) || 500,
        };
    });
}
function syncRectangleMapClick(field, state, api, map) {
    if (!isRectangleMap(field) || field.$readonly || !(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    if (state.boundRectangleMap === map && state.rectangleMapClickListener) {
        return;
    }
    clearMapListeners(state.rectangleMapClickListener ? [state.rectangleMapClickListener] : []);
    state.boundRectangleMap = map;
    state.rectangleMapClickListener = api.event.addListener(map, 'click', (event) => {
        if (!(event === null || event === void 0 ? void 0 : event.latLng) || normalizeRectangleValue(field.modelValue.value)) {
            return;
        }
        field.modelValue.value = rectangleFromCenter({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
}
function currentMapPoints(field, state) {
    if (isPolygonMap(field)) {
        const fromModel = normalizePolygonCoordinates(field.modelValue.value);
        return fromModel.length ? fromModel : state.draftPolygonPaths.value;
    }
    if (isLineMap(field)) {
        const fromModel = normalizeLineCoordinates(field.modelValue.value);
        return fromModel.length ? fromModel : state.draftLinePaths.value;
    }
    if (isCircleMap(field)) {
        const circle = normalizeCircleValue(field.modelValue.value);
        return circle ? circleToPoints(circle) : [];
    }
    if (isRectangleMap(field)) {
        const rectangle = normalizeRectangleValue(field.modelValue.value);
        return rectangle ? rectangleToPoints(rectangle) : [];
    }
    if (isHeatmapMap(field)) {
        return normalizeHeatmapPoints(field.modelValue.value).map((item) => item.location);
    }
    if (isClusterMap(field)) {
        return normalizePointList(field.modelValue.value);
    }
    if (isGeoJsonMap(field)) {
        return extractGeoJsonPoints(field.modelValue.value);
    }
    if (isMultiPointMap(field)) {
        return normalizePointList(field.modelValue.value);
    }
    const point = normalizePoint(field.modelValue.value);
    return point ? [point] : [];
}
function currentMapCenter(field, state) {
    return pointsCenter(currentMapPoints(field, state), { lat: 0, lng: 0 });
}
function syncMapRuntime(field, state) {
    const ref = state.mapComponentRef.value;
    if (!(ref === null || ref === void 0 ? void 0 : ref.ready) || !ref.api || !ref.map) {
        return;
    }
    const center = currentMapCenter(field, state);
    const points = currentMapPoints(field, state);
    syncMapLocationText(field, state, ref.api);
    syncPointMapClick(field, state, ref.api, ref.map);
    syncLineMapClick(field, state, ref.api, ref.map);
    syncPolygonMapClick(field, state, ref.api, ref.map);
    syncCircleMapClick(field, state, ref.api, ref.map);
    syncRectangleMapClick(field, state, ref.api, ref.map);
    syncGeoJsonDisplay(field, state, ref.map);
    (0, vue_1.nextTick)(() => {
        refreshGoogleMap(ref.api, ref.map, center, points);
    });
}
function ensureMapWatchers(field, state) {
    if (state.watchersAttached) {
        return;
    }
    state.watchersAttached = true;
    field.$watch(() => state.mapComponentRef.value, () => syncMapRuntime(field, state), { immediate: true });
    field.$watch(() => { var _a; return (_a = state.mapComponentRef.value) === null || _a === void 0 ? void 0 : _a.ready; }, (ready) => {
        if (ready)
            syncMapRuntime(field, state);
    }, { immediate: true });
    field.$watch(() => field.modelValue.value, () => syncMapRuntime(field, state), { deep: true });
    field.$watch(() => state.draftPolygonPaths.value, () => syncMapRuntime(field, state), { deep: true });
    field.$watch(() => state.draftLinePaths.value, () => syncMapRuntime(field, state), { deep: true });
}
function refreshGoogleMap(api, map, center, points) {
    if (!(api === null || api === void 0 ? void 0 : api.event) || !map) {
        return;
    }
    const refresh = () => {
        try {
            api.event.trigger(map, 'resize');
            if (points.length > 1 && typeof api.LatLngBounds === 'function' && typeof map.fitBounds === 'function') {
                const bounds = new api.LatLngBounds();
                points.forEach((item) => bounds.extend(item));
                map.fitBounds(bounds);
                return;
            }
            if (typeof map.panTo === 'function') {
                map.panTo(center);
            }
            else if (typeof map.setCenter === 'function') {
                map.setCenter(center);
            }
        }
        catch (_error) {
            // Ignore transient map refresh errors.
        }
    };
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(refresh);
    }
    else {
        setTimeout(refresh, 0);
    }
    setTimeout(refresh, 180);
}
function getMapTextPoints(field, state) {
    if (field.params.value.hideMapText) {
        return [];
    }
    if (isPolygonMap(field)) {
        const fromModel = normalizePolygonCoordinates(field.modelValue.value);
        return fromModel.length ? fromModel : state.draftPolygonPaths.value;
    }
    if (isLineMap(field)) {
        const fromModel = normalizeLineCoordinates(field.modelValue.value);
        return fromModel.length ? fromModel : state.draftLinePaths.value;
    }
    if (isCircleMap(field)) {
        const circle = normalizeCircleValue(field.modelValue.value);
        return circle ? [circle.center] : [];
    }
    if (isRectangleMap(field)) {
        const rectangle = normalizeRectangleValue(field.modelValue.value);
        return rectangle ? rectangleToPoints(rectangle) : [];
    }
    if (isHeatmapMap(field)) {
        return normalizeHeatmapPoints(field.modelValue.value).map((item) => item.location);
    }
    if (isClusterMap(field)) {
        return normalizePointList(field.modelValue.value);
    }
    if (isGeoJsonMap(field)) {
        return extractGeoJsonPoints(field.modelValue.value);
    }
    if (isMultiPointMap(field)) {
        return normalizePointList(field.modelValue.value);
    }
    if (field.params.value.type === 'map') {
        const point = normalizePoint(field.modelValue.value);
        return point ? [point] : [];
    }
    return [];
}
function syncMapLocationText(field, state, api) {
    const points = getMapTextPoints(field, state);
    if (!points.length) {
        state.locationEntries.value = [];
        return;
    }
    state.locationCache = state.locationCache || {};
    state.locationPending = state.locationPending || {};
    const updateEntries = () => {
        state.locationEntries.value = points.map((point) => {
            var _a, _b;
            const key = pointKey(point);
            return {
                key,
                text: ((_a = state.locationCache) === null || _a === void 0 ? void 0 : _a[key]) || (((_b = state.locationPending) === null || _b === void 0 ? void 0 : _b[key]) ? 'Resolving location...' : key),
            };
        });
    };
    if (!(api === null || api === void 0 ? void 0 : api.Geocoder)) {
        points.forEach((point) => {
            const key = pointKey(point);
            state.locationCache[key] = key;
            delete state.locationPending[key];
        });
        updateEntries();
        return;
    }
    updateEntries();
    const geocoder = new api.Geocoder();
    points.forEach((point) => {
        var _a, _b;
        const key = pointKey(point);
        if (((_a = state.locationCache) === null || _a === void 0 ? void 0 : _a[key]) || ((_b = state.locationPending) === null || _b === void 0 ? void 0 : _b[key])) {
            return;
        }
        state.locationPending[key] = true;
        updateEntries();
        geocoder.geocode({ location: point }, (results, status) => {
            delete state.locationPending[key];
            state.locationCache[key] = status === 'OK' && (results === null || results === void 0 ? void 0 : results.length) ? (results[0].formatted_address || key) : key;
            updateEntries();
        });
    });
}
function getMapTextLabel(field, index, total) {
    if (isCircleMap(field)) {
        return 'Center';
    }
    if (isRectangleMap(field)) {
        return ['North-West', 'North-East', 'South-East', 'South-West'][index] || `Corner ${index + 1}`;
    }
    if (isLineMap(field)) {
        return `Point ${index + 1}`;
    }
    if (isPolygonMap(field)) {
        return `Vertex ${index + 1}`;
    }
    if (isMultiPointMap(field)) {
        return `Marker ${index + 1}`;
    }
    return total > 1 ? `Point ${index + 1}` : 'Location';
}
function buildStaticMapMarker(field, point, key, color = '#146eb4') {
    const h = field.$h;
    return h(vue3_google_map_1.CustomMarker, {
        key,
        options: {
            position: point,
            anchorPoint: 'BOTTOM_CENTER',
        },
    }, {
        default: () => h('div', {
            style: {
                width: '14px',
                height: '14px',
                borderRadius: '999px',
                background: color,
                border: '2px solid #ffffff',
                boxShadow: '0 2px 6px rgba(20, 110, 180, 0.35)',
            },
        }),
    });
}
function getHeatCircleRadius(field, weight) {
    var _a;
    const baseRadius = Number((_a = field.params.value.mapOptions) === null || _a === void 0 ? void 0 : _a.heatRadius) || 2500;
    const normalizedWeight = weight === undefined || Number.isNaN(Number(weight)) ? 1 : Math.max(0.25, Number(weight));
    return baseRadius * normalizedWeight;
}
function buildMapWidget(field) {
    var _a, _b, _c, _d;
    const h = field.$h;
    const state = getMapWidgetState(field);
    ensureMapWatchers(field, state);
    const mapApiKey = field.params.value.mapApiKey;
    const polygonPathsFromModel = normalizePolygonCoordinates(field.modelValue.value);
    const polygonPaths = polygonPathsFromModel.length ? polygonPathsFromModel : state.draftPolygonPaths.value;
    const linePathsFromModel = normalizeLineCoordinates(field.modelValue.value);
    const linePaths = linePathsFromModel.length ? linePathsFromModel : state.draftLinePaths.value;
    const pointValues = isMultiPointMap(field)
        ? normalizePointList(field.modelValue.value)
        : (() => {
            const point = normalizePoint(field.modelValue.value);
            return point ? [point] : [];
        })();
    const circleValue = normalizeCircleValue(field.modelValue.value);
    const rectangleValue = normalizeRectangleValue(field.modelValue.value);
    const heatmapValues = normalizeHeatmapPoints(field.modelValue.value);
    const clusterValues = normalizePointList(field.modelValue.value);
    if (polygonPathsFromModel.length && state.draftPolygonPaths.value.length) {
        state.draftPolygonPaths.value = [];
    }
    if (linePathsFromModel.length && state.draftLinePaths.value.length) {
        state.draftLinePaths.value = [];
    }
    const mapCenter = currentMapCenter(field, state);
    const mapHeight = field.params.value.height || '300px';
    const mapChildren = [];
    if (isPolygonMap(field)) {
        const polygonOptions = Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { strokeColor: '#146eb4', strokeOpacity: 0.9, strokeWeight: 2, fillColor: '#146eb4', fillOpacity: 0.24, editable: !field.$readonly, draggable: !field.$readonly, clickable: true, paths: polygonPaths });
        if (polygonPaths.length >= 3) {
            mapChildren.push(h(vue3_google_map_1.Polygon, {
                ref: (el) => {
                    const polygon = el === null || el === void 0 ? void 0 : el.polygon;
                    const ref = state.mapComponentRef.value;
                    if (polygon && (ref === null || ref === void 0 ? void 0 : ref.ready) && ref.api) {
                        syncPolygonListeners(field, state, ref.api, polygon);
                    }
                },
                options: polygonOptions,
            }));
        }
        else {
            polygonPaths.forEach((item) => {
                mapChildren.push(buildStaticMapMarker(field, item, `${pointKey(item)}-draft-polygon`));
            });
        }
    }
    else if (isLineMap(field)) {
        const lineOptions = Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { strokeColor: '#146eb4', strokeOpacity: 0.9, strokeWeight: 3, editable: !field.$readonly, draggable: !field.$readonly, clickable: true, path: linePaths });
        if (linePaths.length >= 2) {
            mapChildren.push(h(vue3_google_map_1.Polyline, {
                ref: (el) => {
                    const line = el === null || el === void 0 ? void 0 : el.polyline;
                    const ref = state.mapComponentRef.value;
                    if (line && (ref === null || ref === void 0 ? void 0 : ref.ready) && ref.api) {
                        syncLineListeners(field, state, ref.api, line);
                    }
                },
                options: lineOptions,
            }));
        }
        linePaths.forEach((item) => {
            mapChildren.push(buildStaticMapMarker(field, item, `${pointKey(item)}-line`));
        });
    }
    else if (isCircleMap(field)) {
        if (circleValue) {
            const circleOptions = Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { center: circleValue.center, radius: circleValue.radius, editable: !field.$readonly, draggable: !field.$readonly, clickable: true, strokeColor: '#146eb4', strokeOpacity: 0.9, strokeWeight: 2, fillColor: '#146eb4', fillOpacity: 0.18 });
            mapChildren.push(h(vue3_google_map_1.Circle, {
                ref: (el) => {
                    const circle = el === null || el === void 0 ? void 0 : el.circle;
                    const ref = state.mapComponentRef.value;
                    if (circle && (ref === null || ref === void 0 ? void 0 : ref.ready) && ref.api) {
                        syncCircleListeners(field, state, ref.api, circle);
                    }
                },
                options: circleOptions,
            }));
        }
    }
    else if (isRectangleMap(field)) {
        if (rectangleValue) {
            const rectangleOptions = Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { bounds: rectangleValue, editable: !field.$readonly, draggable: !field.$readonly, clickable: true, strokeColor: '#146eb4', strokeOpacity: 0.9, strokeWeight: 2, fillColor: '#146eb4', fillOpacity: 0.18 });
            mapChildren.push(h(vue3_google_map_1.Rectangle, {
                ref: (el) => {
                    const rectangle = el === null || el === void 0 ? void 0 : el.rectangle;
                    const ref = state.mapComponentRef.value;
                    if (rectangle && (ref === null || ref === void 0 ? void 0 : ref.ready) && ref.api) {
                        syncRectangleListeners(field, state, ref.api, rectangle);
                    }
                },
                options: rectangleOptions,
            }));
        }
    }
    else if (isHeatmapMap(field)) {
        heatmapValues.forEach((item, index) => {
            var _a, _b, _c, _d, _e, _f;
            mapChildren.push(h(vue3_google_map_1.Circle, {
                key: `${pointKey(item.location)}-heat-${index}`,
                options: {
                    center: item.location,
                    radius: getHeatCircleRadius(field, item.weight),
                    clickable: false,
                    draggable: false,
                    editable: false,
                    strokeColor: ((_a = field.params.value.mapOptions) === null || _a === void 0 ? void 0 : _a.heatStrokeColor) || '#d84315',
                    strokeOpacity: Number((_c = (_b = field.params.value.mapOptions) === null || _b === void 0 ? void 0 : _b.heatStrokeOpacity) !== null && _c !== void 0 ? _c : 0.08),
                    strokeWeight: Number((_e = (_d = field.params.value.mapOptions) === null || _d === void 0 ? void 0 : _d.heatStrokeWeight) !== null && _e !== void 0 ? _e : 1),
                    fillColor: ((_f = field.params.value.mapOptions) === null || _f === void 0 ? void 0 : _f.heatColor) || '#ef6c00',
                    fillOpacity: Math.min(0.45, 0.12 + (Math.max(1, Number(item.weight || 1)) - 1) * 0.06),
                },
            }));
        });
    }
    else if (isClusterMap(field)) {
        if (clusterValues.length) {
            mapChildren.push(h(vue3_google_map_1.MarkerCluster, {
                options: ((_a = field.params.value.mapOptions) === null || _a === void 0 ? void 0 : _a.clusterOptions) || field.params.value.mapOptions || {},
            }, {
                default: () => clusterValues.map((item, index) => buildStaticMapMarker(field, item, `${pointKey(item)}-cluster-${index}`, '#455a64')),
            }));
        }
    }
    else if (isGeoJsonMap(field)) {
        // GeoJSON display is managed through the Google Maps data layer in syncMapRuntime.
    }
    else if (isMultiPointMap(field)) {
        pointValues.forEach((item, index) => {
            if (field.$readonly) {
                mapChildren.push(buildStaticMapMarker(field, item, `${pointKey(item)}-readonly-${index}`));
                return;
            }
            mapChildren.push(h(vue3_google_map_1.Marker, {
                key: pointKey(item),
                options: Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { position: item, draggable: true }),
                title: `${field.params.value.label || 'Location'} ${index + 1}`,
                draggable: true,
                onDragend: (event) => {
                    if (!(event === null || event === void 0 ? void 0 : event.latLng)) {
                        return;
                    }
                    const currentKey = pointKey(item);
                    let replaced = false;
                    field.modelValue.value = normalizePointList(field.modelValue.value).map((point) => {
                        if (!replaced && pointKey(point) === currentKey) {
                            replaced = true;
                            return { lat: event.latLng.lat(), lng: event.latLng.lng() };
                        }
                        return point;
                    });
                },
                onRightclick: () => {
                    const currentKey = pointKey(item);
                    let removed = false;
                    field.modelValue.value = normalizePointList(field.modelValue.value).filter((point) => {
                        if (!removed && pointKey(point) === currentKey) {
                            removed = true;
                            return false;
                        }
                        return true;
                    });
                },
            }));
        });
    }
    else if (pointValues[0]) {
        if (field.$readonly) {
            mapChildren.push(buildStaticMapMarker(field, pointValues[0], `${pointKey(pointValues[0])}-readonly`));
        }
        else {
            mapChildren.push(h(vue3_google_map_1.Marker, {
                options: Object.assign(Object.assign({}, (field.params.value.mapOptions || {})), { position: pointValues[0], draggable: true }),
                title: field.params.value.label,
                draggable: true,
                onDragend: (event) => {
                    if (!(event === null || event === void 0 ? void 0 : event.latLng)) {
                        return;
                    }
                    field.modelValue.value = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                },
            }));
        }
    }
    const mapNode = h('div', {
        style: {
            height: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
            width: '100%',
            maxWidth: field.maxWidth.value,
            border: '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#f8fafc',
        },
    }, !mapApiKey
        ? h('div', {
            class: ['d-flex', 'align-center', 'justify-center', 'text-center', 'px-4', 'py-6', 'text-body-2'],
            style: { height: '100%' },
        }, 'Google Maps is not configured. Set VITE_GOOGLE_MAPS_API_KEY in test/.env (or the repo root .env) to enable this widget.')
        : h(SafeGoogleMap, {
            apiPromise: getGoogleMapsApiPromise({
                apiKey: mapApiKey,
                language: (_b = field.params.value.mapOptions) === null || _b === void 0 ? void 0 : _b.language,
                region: (_c = field.params.value.mapOptions) === null || _c === void 0 ? void 0 : _c.region,
                version: (_d = field.params.value.mapOptions) === null || _d === void 0 ? void 0 : _d.version,
                libraries: [],
            }),
            mapProps: {
                ref: (el) => {
                    state.mapComponentRef.value = el ? (0, vue_1.markRaw)(el) : el;
                },
                style: {
                    height: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
                    width: '100%',
                },
                center: mapCenter,
                zoom: field.params.value.mapZoom || 5,
            },
        }, { default: () => mapChildren }));
    const circleValueForText = isCircleMap(field) ? normalizeCircleValue(field.modelValue.value) : undefined;
    const locationPageSize = Math.max(1, Number(field.params.value.mapTextPageSize) || 5);
    const totalLocationPages = Math.max(1, Math.ceil(state.locationEntries.value.length / locationPageSize));
    if (state.locationPage.value >= totalLocationPages) {
        state.locationPage.value = totalLocationPages - 1;
    }
    if (state.locationPage.value < 0) {
        state.locationPage.value = 0;
    }
    const pagedLocationEntries = state.locationEntries.value.slice(state.locationPage.value * locationPageSize, (state.locationPage.value + 1) * locationPageSize);
    const showLocationSheet = (!field.params.value.hideMapText && (state.locationEntries.value.length > 0 || !!circleValueForText));
    const locationSheet = showLocationSheet
        ? h(components_1.VSheet, {
            rounded: 'lg',
            variant: 'tonal',
            color: 'primary',
            class: ['mt-3', 'px-3', 'py-2'],
            style: { width: '100%', maxWidth: field.maxWidth.value },
        }, () => [
            ...(pagedLocationEntries.map((entry, index) => {
                const absoluteIndex = state.locationPage.value * locationPageSize + index;
                return h('div', {
                    key: entry.key,
                    class: ['text-body-2', ...(index > 0 ? ['mt-2'] : [])],
                }, `${getMapTextLabel(field, absoluteIndex, state.locationEntries.value.length)}: ${entry.text}`);
            })),
            ...(circleValueForText ? [
                h('div', {
                    class: ['text-body-2', ...(pagedLocationEntries.length ? ['mt-2'] : [])],
                }, `Radius: ${(circleValueForText.radius / 1000).toFixed(2)} km`)
            ] : []),
            ...(state.locationEntries.value.length > locationPageSize ? [
                h('div', {
                    class: ['d-flex', 'align-center', 'justify-space-between', 'mt-3'],
                }, [
                    h(components_1.VBtn, {
                        size: 'small',
                        variant: 'text',
                        disabled: state.locationPage.value <= 0,
                        onClick: () => {
                            if (state.locationPage.value > 0) {
                                state.locationPage.value -= 1;
                            }
                        },
                    }, () => 'Previous'),
                    h('div', {
                        class: ['text-caption'],
                    }, `Points ${state.locationPage.value * locationPageSize + 1}-${Math.min((state.locationPage.value + 1) * locationPageSize, state.locationEntries.value.length)} of ${state.locationEntries.value.length}`),
                    h(components_1.VBtn, {
                        size: 'small',
                        variant: 'text',
                        disabled: state.locationPage.value >= totalLocationPages - 1,
                        onClick: () => {
                            if (state.locationPage.value < totalLocationPages - 1) {
                                state.locationPage.value += 1;
                            }
                        },
                    }, () => 'Next'),
                ])
            ] : []),
        ])
        : undefined;
    const instructionText = isMultiPointMap(field)
        ? 'Click on the map to add markers. Drag markers to adjust them. Right-click a marker to remove it.'
        : isLineMap(field)
            ? (linePaths.length >= 2 ? 'Drag line vertices to edit. Right-click a vertex to remove it.' : 'Click on the map to add line points.')
            : isPolygonMap(field)
                ? (polygonPaths.length >= 3 ? 'Drag polygon vertices to edit. Right-click a vertex to remove it.' : 'Click on the map to add polygon points.')
                : isCircleMap(field)
                    ? (circleValue ? 'Drag or resize the circle to edit it.' : 'Click on the map to place a circle.')
                    : isRectangleMap(field)
                        ? (rectangleValue ? 'Drag or resize the rectangle to edit it.' : 'Click on the map to place a rectangle.')
                        : '';
    return [
        h('div', { class: ['ml-2', 'mb-4'] }, field.params.value.label),
        h('div', {}, mapNode),
        ...(locationSheet ? [locationSheet] : []),
        ...((instructionText && !field.$readonly) ? [
            h('div', {
                class: ['text-caption', 'mt-2'],
                style: { maxWidth: field.maxWidth.value, opacity: '0.72' },
            }, instructionText),
        ] : []),
    ];
}
exports.buildMapWidget = buildMapWidget;
function buildImageWidget(field) {
    const h = field.$h;
    if (field.params.value.multiple) {
        if (!field.modelValue.value)
            field.modelValue.value = [];
        if (!Array.isArray(field.modelValue.value))
            field.modelValue.value = [field.modelValue.value];
        return h(components_1.VRow, {}, () => [
            h(components_1.VCol, {
                cols: 12
            }, () => h('div', {}, field.params.value.label)),
            ...(field.modelValue.value || []).map((item, index) => h(components_1.VCol, {
                cols: 12,
                md: 6,
                lg: 4,
                align: 'center'
            }, () => [
                item.indexOf('image') !== -1 ? h(components_1.VImg, {
                    src: item,
                    height: item ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10,
                    onClick: () => {
                        field.showMediaFullscreen(item);
                    }
                }) : (item ? h('div', {
                    class: ['py-auto'],
                    style: {
                        height: `${item ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10}px`,
                        'max-width': '200px',
                        border: 'thin solid black',
                    },
                    onClick: () => {
                        field.showMediaFullscreen(item);
                    }
                }, 'No Preview') : undefined),
                ...(field.$readonly ? [] : [
                    h(components_1.VIcon, {
                        icon: 'mdi-delete',
                        color: 'error',
                        flat: true,
                        size: 'small',
                        class: ['mt-1'],
                        onClick: () => {
                            const items = field.modelValue.value || [];
                            items.splice(index, 1);
                            field.modelValue.value = items;
                        }
                    })
                ])
            ])),
            h(components_1.VCol, {
                cols: 12,
                align: "center"
            }, () => field.$readonly ? [] : [
                h(components_1.VBtn, {
                    color: 'primary',
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const files = yield (0, misc_1.selectFile)(field.params.value.fileAccepts, true);
                            const data = [];
                            for (let i = 0; i < files.length; i++) {
                                try {
                                    const base64 = yield (0, misc_1.fileToBase64)(files[i], field.params.value.fileMaxSize || 500);
                                    data.push(base64);
                                }
                                catch (error) {
                                    dialogs_1.Dialogs.$error(error.message);
                                }
                            }
                            if (!field.modelValue.value) {
                                field.modelValue.value = data;
                            }
                            else if (!Array.isArray(field.modelValue.value)) {
                                field.modelValue.value = [field.modelValue.value].concat(data);
                            }
                            else {
                                const value = field.modelValue.value || [];
                                field.modelValue.value = value.concat(data);
                            }
                        }
                        catch (error) {
                            dialogs_1.Dialogs.$error(error.message);
                        }
                    })
                }, () => h(components_1.VIcon, {}, () => 'mdi-upload')),
                ...(field.modelValue.value && field.modelValue.value.length > 0 ? [
                    h(components_1.VBtn, {
                        color: 'error',
                        class: ['ml-4'],
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            field.modelValue.value = [];
                        })
                    }, () => h(components_1.VIcon, {}, () => 'mdi-delete')),
                ] : [])
            ])
        ]);
    }
    return h(components_1.VRow, {}, () => [
        h(components_1.VCol, {
            cols: 12
        }, () => h('div', {}, field.params.value.label)),
        h(components_1.VCol, {
            cols: 12,
            align: 'center'
        }, () => field.modelValue.value && field.modelValue.value.indexOf('image') !== -1 ? h(components_1.VImg, {
            src: field.modelValue.value,
            height: field.modelValue.value ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10,
            style: {
                cursor: 'pointer'
            },
            onClick: () => {
                field.showMediaFullscreen(field.modelValue.value);
            }
        }) : (field.modelValue.value ? h('div', {
            class: ['py-auto'],
            style: {
                height: `${field.modelValue.value ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10}px`,
                'max-width': '200px',
                border: 'thin solid black',
                cursor: 'pointer'
            },
            onClick: () => {
                field.showMediaFullscreen(field.modelValue.value);
            }
        }, 'No Preview') : undefined)),
        h(components_1.VCol, {
            cols: 12,
            align: "center"
        }, () => field.$readonly ? [] : [
            h(components_1.VBtn, {
                color: 'primary',
                onClick: () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const files = yield (0, misc_1.selectFile)(field.params.value.fileAccepts);
                        const base64 = yield (0, misc_1.fileToBase64)(files[0], field.params.value.fileMaxSize || 500);
                        field.modelValue.value = base64;
                    }
                    catch (error) {
                        dialogs_1.Dialogs.$error(error.message);
                    }
                })
            }, () => h(components_1.VIcon, {}, () => 'mdi-upload')),
            ...(field.modelValue.value ? [
                h(components_1.VBtn, {
                    color: 'error',
                    class: ['ml-4'],
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        field.modelValue.value = null;
                    })
                }, () => h(components_1.VIcon, {}, () => 'mdi-delete')),
                h(components_1.VBtn, {
                    color: 'success',
                    class: ['ml-4'],
                    onClick: () => {
                        field.showMediaFullscreen(field.modelValue.value);
                    }
                }, () => h(components_1.VIcon, {}, () => 'mdi-eye'))
            ] : [])
        ])
    ]);
}
exports.buildImageWidget = buildImageWidget;
