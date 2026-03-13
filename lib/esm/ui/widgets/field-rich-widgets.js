var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VBtn, VCard, VCol, VIcon, VImg, VRow, VSheet } from 'vuetify/components';
import { VAceEditor } from 'vue3-ace-editor';
import * as ace from 'ace-builds';
import VueApexCharts from 'vue3-apexcharts';
import { GoogleMap, Marker } from "vue3-google-map";
import VueEditor from '@tinymce/tinymce-vue';
import { fileToBase64, selectFile } from "../../misc";
import { Dialogs } from "../dialogs";
ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@" + ace.version + "/src-noconflict/");
export function buildHTMLWidget(field) {
    const h = field.$h;
    const editor = h(VueEditor, {
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
    const fullscreenBtn = h(VBtn, {
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
    return h(VRow, {}, () => [
        h(VCol, {
            cols: 12
        }, () => h('div', {
            class: ['text-subtitle-2']
        }, field.params.value.label)),
        h(VCol, {
            cols: 12,
        }, () => h(VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth: field.maxWidth.value,
            elevation: 0
        }, () => [editor, fullscreenBtn])),
    ]);
}
export function buildCodeWidget(field) {
    var _a;
    const h = field.$h;
    const editor = h(VAceEditor, {
        value: (_a = field.modelValue.value) !== null && _a !== void 0 ? _a : "",
        lang: field.params.value.lang || 'text',
        theme: field.params.value.codeTheme || "chrome",
        readonly: field.$readonly,
        placeholder: field.params.value.placeholder,
        class: field.params.value.class || [],
        style: Object.assign(Object.assign({ "font-size": "12pt" }, (field.params.value.style || {})), { height: field.params.value.height || "300px", "max-width": field.maxWidth.value }),
        onInit: (e) => {
            e.setOptions({ useWorker: ['json', 'javascript', 'html'].includes(field.params.value.lang || 'text') });
        },
        "onUpdate:value": (v) => {
            field.modelValue.value = v;
        }
    });
    const fullscreenBtn = h(VBtn, {
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
export function buildMessageBoxWidget(field) {
    const h = field.$h;
    let items = field.modelValue.value || [];
    if (!Array.isArray(items))
        items = [items];
    items = field.messageFormat(items);
    const windowInfo = field.getMessageWindow(items);
    const messages = normalizeMessages(windowInfo.items);
    return h(VRow, {}, () => [
        h(VCol, {
            cols: 12,
        }, () => h('div', {
            class: ['text-subtitle-2']
        }, field.params.value.label)),
        h(VCol, {
            cols: 12,
        }, () => h(VCard, {
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
                }, h(VBtn, {
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
                return h(VRow, {
                    key: `msg-${index}`,
                    class: ['my-1'],
                    justify: item.right ? 'end' : 'start'
                }, () => [
                    h(VCol, {
                        cols: 12,
                        class: [item.right ? 'text-right' : 'text-left']
                    }, () => [
                        ...(item.showUser && item.user ? [
                            h('div', {
                                class: ['text-caption', 'font-weight-bold', 'mb-1', 'px-1', 'text-medium-emphasis']
                            }, item.user)
                        ] : []),
                        h(VSheet, {
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
        }, h(VCard, {
            variant: 'outlined',
            class: ['pa-2'],
            style: {
                maxWidth: '240px',
                cursor: 'pointer',
            },
            onClick: () => openAttachment(field, attachment)
        }, () => [
            h(VImg, {
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
    }, h(VSheet, {
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
        h(VIcon, {}, () => attachmentIcon(attachment)),
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
export function buildChartWidget(field) {
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
        h(VueApexCharts, {
            type: field.params.value.chartType,
            options: field.chartOpts.value || {},
            series: field.chartValue.value || [],
            height: field.params.value.height || 300,
            width: field.maxWidth.value,
        })
    ];
}
export function buildMapWidget(field) {
    const h = field.$h;
    const center = { lat: 0, lng: 0 };
    const options = field.params.value.mapOptions || {
        draggable: true
    };
    options.position = field.modelValue.value || center;
    options.draggable = !field.$readonly;
    return [
        h('div', {
            class: ['ml-2', 'mb-4']
        }, field.params.value.label),
        h('div', {}, h(GoogleMap, {
            apiKey: field.params.value.mapApiKey,
            style: Object.assign(Object.assign({}, field.params.value.style), { height: field.params.value.height || '300px', width: '100%', 'max-width': field.maxWidth.value }),
            center: field.modelValue.value || center,
            zoom: field.params.value.mapZoom || 5
        }, () => h(Marker, {
            options: options,
            title: field.params.value.label,
            draggable: true,
            onDragend: (event) => {
                const pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
                field.modelValue.value = pos;
            }
        })))
    ];
}
export function buildImageWidget(field) {
    const h = field.$h;
    if (field.params.value.multiple) {
        if (!field.modelValue.value)
            field.modelValue.value = [];
        if (!Array.isArray(field.modelValue.value))
            field.modelValue.value = [field.modelValue.value];
        return h(VRow, {}, () => [
            h(VCol, {
                cols: 12
            }, () => h('div', {}, field.params.value.label)),
            ...(field.modelValue.value || []).map((item, index) => h(VCol, {
                cols: 12,
                md: 6,
                lg: 4,
                align: 'center'
            }, () => [
                item.indexOf('image') !== -1 ? h(VImg, {
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
                    h(VIcon, {
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
            h(VCol, {
                cols: 12,
                align: "center"
            }, () => field.$readonly ? [] : [
                h(VBtn, {
                    color: 'primary',
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const files = yield selectFile(field.params.value.fileAccepts, true);
                            const data = [];
                            for (let i = 0; i < files.length; i++) {
                                try {
                                    const base64 = yield fileToBase64(files[i], field.params.value.fileMaxSize || 500);
                                    data.push(base64);
                                }
                                catch (error) {
                                    Dialogs.$error(error.message);
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
                            Dialogs.$error(error.message);
                        }
                    })
                }, () => h(VIcon, {}, () => 'mdi-upload')),
                ...(field.modelValue.value && field.modelValue.value.length > 0 ? [
                    h(VBtn, {
                        color: 'error',
                        class: ['ml-4'],
                        onClick: () => __awaiter(this, void 0, void 0, function* () {
                            field.modelValue.value = [];
                        })
                    }, () => h(VIcon, {}, () => 'mdi-delete')),
                ] : [])
            ])
        ]);
    }
    return h(VRow, {}, () => [
        h(VCol, {
            cols: 12
        }, () => h('div', {}, field.params.value.label)),
        h(VCol, {
            cols: 12,
            align: 'center'
        }, () => field.modelValue.value && field.modelValue.value.indexOf('image') !== -1 ? h(VImg, {
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
        h(VCol, {
            cols: 12,
            align: "center"
        }, () => field.$readonly ? [] : [
            h(VBtn, {
                color: 'primary',
                onClick: () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const files = yield selectFile(field.params.value.fileAccepts);
                        const base64 = yield fileToBase64(files[0], field.params.value.fileMaxSize || 500);
                        field.modelValue.value = base64;
                    }
                    catch (error) {
                        Dialogs.$error(error.message);
                    }
                })
            }, () => h(VIcon, {}, () => 'mdi-upload')),
            ...(field.modelValue.value ? [
                h(VBtn, {
                    color: 'error',
                    class: ['ml-4'],
                    onClick: () => __awaiter(this, void 0, void 0, function* () {
                        field.modelValue.value = null;
                    })
                }, () => h(VIcon, {}, () => 'mdi-delete')),
                h(VBtn, {
                    color: 'success',
                    class: ['ml-4'],
                    onClick: () => {
                        field.showMediaFullscreen(field.modelValue.value);
                    }
                }, () => h(VIcon, {}, () => 'mdi-eye'))
            ] : [])
        ])
    ]);
}
