import { Ref, VNode, markRaw, nextTick, shallowRef } from "vue";
import { VBtn, VCard, VCol, VIcon, VImg, VRow, VSheet } from 'vuetify/components';
import { VAceEditor } from 'vue3-ace-editor';
import * as ace from 'ace-builds';
import VueApexCharts from 'vue3-apexcharts';
import { GoogleMap, Marker, Polygon } from "vue3-google-map";
import VueEditor from '@tinymce/tinymce-vue';
import { fileToBase64, selectFile } from "../../misc";
import { Dialogs } from "../dialogs";

ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@" + ace.version + "/src-noconflict/");

export interface RichWidgetContext {
  $h: any;
  $readonly: boolean;
  $makeRef: any;
  $watch: any;
  params: Ref<any>;
  modelValue: Ref<any>;
  maxWidth: Ref<any>;
  getState: <T>(key: string, init: () => T) => T;
  codePreview: Ref<any>;
  chartLoaded: Ref<boolean>;
  chartOpts: Ref<any>;
  chartValue: Ref<any>;
  renderMathInHtml: (html: string) => string;
  showPreviewFullscreen: (html: string) => void;
  registerHtmlEditor: (editor: any) => void;
  onHtmlEditorReady: (editor: any) => void;
  renderLatex: (value: string) => void;
  loadChart: () => void;
  messageFormat: (data: any) => any[];
  showMediaFullscreen: (data: string) => void;
  getMessageWindow: (items: any[]) => { items: any[]; hasEarlier: boolean; earlierCount: number; pageSize: number };
  loadEarlierMessages: (total: number) => void | Promise<void>;
  setMessageScrollContainer: (el: Element | any) => void;
}

export function buildHTMLWidget(field: RichWidgetContext): VNode {
  const h = field.$h;

  const editor = h(
    VueEditor,
    {
      apiKey: 'ee1xu2usg9edqb2dtfggyg50ghsc6snlrhdkagr9425luz2a',
      modelValue: field.modelValue.value,
      readonly: field.$readonly,
      disabled: field.$readonly,
      init: {
        plugins: 'lists link table image emoticons autoresize',
        setup: (editor: any) => {
          field.registerHtmlEditor(editor);
        }
      },
      placeholder: field.params.value.placeholder,
      height: field.params.value.height || 300,
      class: field.params.value.class || [],
      style: field.params.value.style || {},
      onInit: (_evt: any, editor: any) => {
        field.onHtmlEditorReady(editor);
      },
      "onUpdate:modelValue": (v: any) => {
        field.modelValue.value = v;
      }
    }
  );

  const fullscreenBtn = h(VBtn, {
    icon: 'mdi-fullscreen',
    size: 'small',
    style: {
      'margin-top': '-64px'
    },
    onClick: () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Preview</title>
          <link rel="stylesheet" href="katex/dist/katex.min.css">
        </head>
        <bod>${field.renderMathInHtml(field.modelValue.value ?? "")}</body>
        </html>
        `;
      field.showPreviewFullscreen(html);
    }
  });

  return h(
    VRow,
    {},
    () => [
      h(
        VCol,
        {
          cols: 12
        },
        () => h(
          'div',
          {
            class: ['text-subtitle-2']
          },
          field.params.value.label
        )
      ),
      h(
        VCol,
        {
          cols: 12,
        },
        () => h(
          VCard,
          {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth: field.maxWidth.value,
            elevation: 0
          },
          () => [editor, fullscreenBtn]
        )
      ),
    ]
  );
}

export function buildCodeWidget(field: RichWidgetContext): VNode[] {
  const h = field.$h;

  const editor: any = h(
    VAceEditor,
    {
      value: field.modelValue.value ?? "",
      lang: field.params.value.lang || 'text',
      theme: field.params.value.codeTheme || "chrome",
      readonly: field.$readonly,
      placeholder: field.params.value.placeholder,
      class: field.params.value.class || [],
      style: {"font-size": "12pt", ...(field.params.value.style || {}), height: field.params.value.height || "300px", "max-width": field.maxWidth.value},
      onInit: (e: any) => {
        e.setOptions({useWorker: ['json', 'javascript', 'html'].includes(field.params.value.lang || 'text')});
      },
      "onUpdate:value": (v: any) => {
        field.modelValue.value = v;
      }
    }
  );

  const fullscreenBtn = h(VBtn, {
    icon: 'mdi-fullscreen',
    size: 'small',
    onClick: () => {
      field.renderLatex(field.modelValue.value ?? "");
      field.showPreviewFullscreen(field.codePreview.value);
    }
  });

  return [
    h(
      'div',
      {
        class: ['ml-4', 'mb-4']
      },
      h(
        'label',
        {},
        field.params.value.label
      ),
    ),
    ...(field.params.value.lang === 'latex' ? [editor, fullscreenBtn] : [editor]),
    ...(
      field.params.value.hint ?
      [h(
        'div',
        {
          class: ['ml-4', 'mb-4']
        },
        h(
          'label',
          {},
          field.params.value.hint
        ),
      )] : []
    )
  ];
}

export function buildMessageBoxWidget(field: RichWidgetContext): VNode {
  const h = field.$h;
  let items: any = field.modelValue.value || [];
  if (!Array.isArray(items)) items = [items];

  items = field.messageFormat(items);
  const windowInfo = field.getMessageWindow(items);
  const messages = normalizeMessages(windowInfo.items);

  return h(
    VRow,
    {},
    () => [
      h(
        VCol,
        {
          cols: 12,
        },
        () => h(
          'div',
          {
            class: ['text-subtitle-2']
          },
          field.params.value.label
        )
      ),
      h(
        VCol,
        {
          cols: 12,
        },
        () => h(
          VCard,
          {
            ref: (el: Element | any) => field.setMessageScrollContainer(el),
            class: ['overflow-y-auto', 'mx-auto', 'pa-4'],
            maxWidth: field.maxWidth.value,
            elevation: 0,
            variant: 'outlined',
            style: {
              minHeight: '220px',
              maxHeight: `${field.params.value.height || 340}px`,
              background: 'rgba(var(--v-theme-surface), 0.7)',
            }
          },
          () => [
            ...(windowInfo.hasEarlier ? [
              h(
                'div',
                {
                  class: ['mb-4', 'text-center']
                },
                h(
                  VBtn,
                  {
                    variant: 'text',
                    color: 'primary',
                    onClick: () => field.loadEarlierMessages(windowInfo.items.length + windowInfo.earlierCount)
                  },
                  () => `Load ${Math.min(windowInfo.pageSize, windowInfo.earlierCount)} earlier messages`
                )
              )
            ] : []),
            ...(messages.length === 0 ? [
            h(
              'div',
              {
                class: ['text-medium-emphasis', 'text-body-2', 'py-8', 'text-center']
              },
              'No messages yet.'
            )
          ] : messages.map((item: any, index: number) => {
            if (item.$type === 'day-separator') {
              return h(
                'div',
                {
                  class: ['d-flex', 'align-center', 'my-4']
                },
                [
                  h('div', { class: ['flex-grow-1'], style: { height: '1px', background: 'rgba(0,0,0,0.12)' } }),
                  h(
                    'div',
                    {
                      class: ['px-3', 'text-caption', 'text-medium-emphasis']
                    },
                    item.label
                  ),
                  h('div', { class: ['flex-grow-1'], style: { height: '1px', background: 'rgba(0,0,0,0.12)' } }),
                ]
              );
            }

            return h(
              VRow,
              {
                key: `msg-${index}`,
                class: ['my-1'],
                justify: item.right ? 'end' : 'start'
              },
              () => [
                h(
                  VCol,
                  {
                    cols: 12,
                    class: [item.right ? 'text-right' : 'text-left']
                  },
                  () => [
                    ...(item.showUser && item.user ? [
                      h(
                        'div',
                        {
                          class: ['text-caption', 'font-weight-bold', 'mb-1', 'px-1', 'text-medium-emphasis']
                        },
                        item.user
                      )
                    ] : []),
                    h(
                      VSheet,
                      {
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
                      },
                      () => [
                        h(
                          'div',
                          {
                            class: ['text-body-2'],
                            ...(item.html ? { innerHTML: item.html } : {})
                          },
                          item.html ? undefined : item.message,
                        ),
                        ...(item.attachments.length > 0 ? [
                          h(
                            'div',
                            {
                              class: ['mt-3']
                            },
                            item.attachments.map((attachment: any, attachmentIndex: number) =>
                              renderMessageAttachment(field, attachment, `${index}-${attachmentIndex}`)
                            )
                          )
                        ] : []),
                        ...((item.timestampLabel || item.status) ? [
                          h(
                            'div',
                            {
                              class: ['text-caption', 'mt-2', 'text-medium-emphasis']
                            },
                            [item.timestampLabel, item.status].filter(Boolean).join(' • ')
                          )
                        ] : [])
                      ]
                    )
                  ]
                )
              ]
            );
          }))
          ]
        )
      )
    ]
  );
}

function normalizeMessages(items: any[]): any[] {
  const list = Array.isArray(items) ? items.filter((item) => item) : [];
  const normalized = list.map((item: any) => {
    const timestamp = resolveTimestamp(item);
    return {
      ...item,
      system: item.system === true || item.type === 'system',
      right: item.right === true,
      user: item.user || item.sender || item.author || '',
      message: item.message || item.text || '',
      html: item.html,
      attachments: normalizeAttachments(item),
      timestamp,
      timestampLabel: timestamp ? formatTimestamp(timestamp) : undefined,
    };
  });

  const rows: any[] = [];
  let lastDateLabel: string | undefined;

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

    rows.push({
      ...item,
      showUser: item.system ? false : !sameGroup,
    });
  });

  return rows;
}

function resolveTimestamp(item: any): Date | undefined {
  const raw = item?.timestamp || item?.time || item?.createdAt || item?.date;
  if (!raw) {
    return undefined;
  }

  const value = raw instanceof Date ? raw : new Date(raw);
  return Number.isNaN(value.getTime()) ? undefined : value;
}

function formatTimestamp(value: Date): string {
  return value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDayLabel(value: Date): string {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const valueStart = new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const diffDays = Math.round((todayStart - valueStart) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return value.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function sameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) {
    return false;
  }

  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function normalizeAttachments(item: any): any[] {
  const raw = item?.attachments || item?.files || [];
  const list = Array.isArray(raw) ? raw : [raw];

  return list
    .filter((attachment) => attachment)
    .map((attachment: any) => {
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

function renderMessageAttachment(field: RichWidgetContext, attachment: any, key: string) {
  const h = field.$h;
  const image = isImageAttachment(attachment);

  if (image && attachment.url) {
    return h(
      'div',
      {
        key,
        class: ['mb-2']
      },
      h(
        VCard,
        {
          variant: 'outlined',
          class: ['pa-2'],
          style: {
            maxWidth: '240px',
            cursor: 'pointer',
          },
          onClick: () => openAttachment(field, attachment)
        },
        () => [
          h(
            VImg,
            {
              src: attachment.url,
              height: 140,
              cover: true,
              class: ['rounded']
            }
          ),
          h(
            'div',
            {
              class: ['text-caption', 'mt-2', 'text-medium-emphasis']
            },
            attachment.name
          )
        ]
      )
    );
  }

  return h(
    'div',
    {
      key,
      class: ['mb-2']
    },
    h(
      VSheet,
      {
        rounded: 'lg',
        border: true,
        class: ['d-inline-flex', 'align-center', 'px-3', 'py-2'],
        style: {
          cursor: attachment.url ? 'pointer' : 'default',
          gap: '10px',
          maxWidth: '100%',
        },
        onClick: () => openAttachment(field, attachment)
      },
      () => [
        h(VIcon, {}, () => attachmentIcon(attachment)),
        h(
          'div',
          {
            class: ['text-left']
          },
          [
            h(
              'div',
              {
                class: ['text-body-2', 'font-weight-medium']
              },
              attachment.name
            ),
            ...((attachment.type || attachment.size) ? [
              h(
                'div',
                {
                  class: ['text-caption', 'text-medium-emphasis']
                },
                [attachment.type, formatAttachmentSize(attachment.size)].filter(Boolean).join(' • ')
              )
            ] : [])
          ]
        )
      ]
    )
  );
}

function openAttachment(field: RichWidgetContext, attachment: any) {
  if (!attachment?.url || typeof window === 'undefined') {
    return;
  }

  if (attachment.url.startsWith('data:')) {
    field.showMediaFullscreen(attachment.url);
    return;
  }

  window.open(attachment.url, '_blank', 'noopener');
}

function isImageAttachment(attachment: any) {
  if (attachment?.type && typeof attachment.type === 'string') {
    return attachment.type.startsWith('image/');
  }

  return typeof attachment?.url === 'string' && attachment.url.startsWith('data:image/');
}

function attachmentIcon(attachment: any) {
  if (isImageAttachment(attachment)) return 'mdi-image';
  if (attachment?.type?.includes?.('pdf') || attachment?.url?.includes?.('.pdf')) return 'mdi-file-pdf-box';
  if (attachment?.type?.includes?.('sheet') || attachment?.url?.match?.(/\.(xlsx|xls|csv)$/i)) return 'mdi-file-excel';
  if (attachment?.type?.includes?.('word') || attachment?.url?.match?.(/\.(docx|doc)$/i)) return 'mdi-file-word';
  return 'mdi-paperclip';
}

function formatAttachmentSize(size: any) {
  if (typeof size !== 'number' || Number.isNaN(size) || size <= 0) {
    return undefined;
  }

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function buildChartWidget(field: RichWidgetContext): VNode[] | undefined {
  const h = field.$h;

  if (!field.chartLoaded.value) {
    field.loadChart();
    return undefined;
  }

  return [
    h(
      'div',
      {
        class: ['ml-2', 'mb-4'],
        innerHTML: field.params.value.label
      }
    ),
    h(
      VueApexCharts as any,
      {
        type: field.params.value.chartType,
        options: field.chartOpts.value || {},
        series: field.chartValue.value || [],
        height: field.params.value.height || 300,
        width: field.maxWidth.value,
      },
    )
  ];
}

interface MapWidgetState {
  locationText: Ref<string>;
  locationLookupKey?: string;
  locationLookupPending?: string;
  draftPolygonPaths: Ref<Array<{ lat: number; lng: number }>>;
  mapComponentRef: Ref<any>;
  watchersAttached?: boolean;
  boundMap?: any;
  mapClickListener?: any;
  boundPolygon?: any;
  polygonListeners?: any[];
  boundPath?: any;
  pathListeners?: any[];
}

function getMapWidgetState(field: RichWidgetContext): MapWidgetState {
  return field.getState('__ve_map_widget_state', () => ({
    locationText: field.$makeRef(''),
    draftPolygonPaths: field.$makeRef([]),
    mapComponentRef: shallowRef(),
  }));
}

function isPolygonMap(field: RichWidgetContext) {
  return field.params.value.type === 'map-polygon';
}

function normalizePoint(value: any): { lat: number; lng: number } | undefined {
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

function normalizePolygonCoordinates(value: any): Array<{ lat: number; lng: number }> {
  if (!value) {
    return [];
  }

  const geometry = value.type === 'Feature' ? value.geometry : value;

  let ring: any[] = [];
  if (geometry?.type === 'Polygon' && Array.isArray(geometry.coordinates?.[0])) {
    ring = geometry.coordinates[0];
  } else if (Array.isArray(value)) {
    ring = value;
  }

  const points = ring
    .map((item: any) => {
      if (Array.isArray(item) && item.length >= 2) {
        return { lat: Number(item[1]), lng: Number(item[0]) };
      }

      if (item && typeof item.lat === 'number' && typeof item.lng === 'number') {
        return { lat: item.lat, lng: item.lng };
      }

      return undefined;
    })
    .filter((item: any): item is { lat: number; lng: number } => !!item && !Number.isNaN(item.lat) && !Number.isNaN(item.lng));

  if (points.length > 1) {
    const first = points[0]!;
    const last = points[points.length - 1]!;
    if (first.lat === last.lat && first.lng === last.lng) {
      points.pop();
    }
  }

  return points;
}

function toGeoJsonPolygon(paths: Array<{ lat: number; lng: number }>) {
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
    closed.push({ ...first });
  }

  return {
    type: 'Polygon',
    coordinates: [closed.map((item) => [item.lng, item.lat])],
  };
}

function polygonCenter(paths: Array<{ lat: number; lng: number }>, fallback: { lat: number; lng: number }) {
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

function clearMapListeners(listeners?: any[]) {
  (listeners || []).forEach((listener: any) => {
    if (listener?.remove) {
      listener.remove();
      return;
    }

    if (listener?.removeListener) {
      listener.removeListener();
    }
  });
}

function polygonPathToArray(path: any) {
  const result: Array<{ lat: number; lng: number }> = [];
  if (!path) {
    return result;
  }

  for (let index = 0; index < path.getLength(); index++) {
    const point = path.getAt(index);
    result.push({ lat: point.lat(), lng: point.lng() });
  }

  return result;
}

function syncPolygonModel(field: RichWidgetContext, state: MapWidgetState, polygon: any) {
  const path = polygon?.getPath?.();
  const points = polygonPathToArray(path);
  const nextValue = toGeoJsonPolygon(points);

  if (nextValue) {
    state.draftPolygonPaths.value = [];
    field.modelValue.value = nextValue;
  } else {
    state.draftPolygonPaths.value = points;
    field.modelValue.value = undefined;
  }
}

function syncPolygonListeners(field: RichWidgetContext, state: MapWidgetState, api: any, polygon: any) {
  if (!api?.event || !polygon) {
    return;
  }

  if (state.boundPolygon === polygon) {
    return;
  }

  clearMapListeners(state.polygonListeners);
  clearMapListeners(state.pathListeners);

  state.boundPolygon = polygon;
  state.boundPath = polygon.getPath?.();
  state.polygonListeners = [
    api.event.addListener(polygon, 'rightclick', (event: any) => {
      if (field.$readonly) {
        return;
      }

      if (typeof event?.vertex === 'number') {
        polygon.getPath().removeAt(event.vertex);
        syncPolygonModel(field, state, polygon);
      }
    }),
    api.event.addListener(polygon, 'mouseup', () => {
      if (!field.$readonly) {
        syncPolygonModel(field, state, polygon);
      }
    }),
    api.event.addListener(polygon, 'dragend', () => {
      if (!field.$readonly) {
        syncPolygonModel(field, state, polygon);
      }
    }),
  ];

  if (state.boundPath) {
    state.pathListeners = [
      api.event.addListener(state.boundPath, 'insert_at', () => syncPolygonModel(field, state, polygon)),
      api.event.addListener(state.boundPath, 'set_at', () => syncPolygonModel(field, state, polygon)),
      api.event.addListener(state.boundPath, 'remove_at', () => syncPolygonModel(field, state, polygon)),
    ];
  }
}

function syncPolygonMapClick(field: RichWidgetContext, state: MapWidgetState, api: any, map: any) {
  if (!isPolygonMap(field) || field.$readonly || !api?.event || !map) {
    return;
  }

  if (state.boundMap === map && state.mapClickListener) {
    return;
  }

  clearMapListeners(state.mapClickListener ? [state.mapClickListener] : []);
  state.boundMap = map;
  state.mapClickListener = api.event.addListener(map, 'click', (event: any) => {
    if (!event?.latLng) {
      return;
    }

    const existing = normalizePolygonCoordinates(field.modelValue.value);
    const base = existing.length ? existing : [...state.draftPolygonPaths.value];
    const nextPaths = [...base, { lat: event.latLng.lat(), lng: event.latLng.lng() }];

    if (nextPaths.length >= 3) {
      const nextValue = toGeoJsonPolygon(nextPaths);
      state.draftPolygonPaths.value = [];
      field.modelValue.value = nextValue;
    } else {
      state.draftPolygonPaths.value = nextPaths;
    }
  });
}



function currentMapCenter(field: RichWidgetContext, state: MapWidgetState) {
  const center = { lat: 0, lng: 0 };
  if (isPolygonMap(field)) {
    const fromModel = normalizePolygonCoordinates(field.modelValue.value);
    return polygonCenter(fromModel.length ? fromModel : state.draftPolygonPaths.value, center);
  }

  return normalizePoint(field.modelValue.value) || center;
}

function syncMapRuntime(field: RichWidgetContext, state: MapWidgetState) {
  const ref = state.mapComponentRef.value;
  if (!ref?.ready || !ref.api || !ref.map) {
    return;
  }

  const center = currentMapCenter(field, state);
  syncMapLocationText(field, state, ref.api);
  syncPolygonMapClick(field, state, ref.api, ref.map);

  nextTick(() => {
    refreshGoogleMap(ref.api, ref.map, center);
  });
}

function ensureMapWatchers(field: RichWidgetContext, state: MapWidgetState) {
  if (state.watchersAttached) {
    return;
  }

  state.watchersAttached = true;

  field.$watch(() => state.mapComponentRef.value, () => {
    syncMapRuntime(field, state);
  }, { immediate: true });

  field.$watch(() => state.mapComponentRef.value?.ready, (ready: boolean) => {
    if (ready) {
      syncMapRuntime(field, state);
    }
  }, { immediate: true });

  field.$watch(() => field.modelValue.value, () => {
    syncMapRuntime(field, state);
  }, { deep: true });

  field.$watch(() => state.draftPolygonPaths.value, () => {
    syncMapRuntime(field, state);
  }, { deep: true });
}

function refreshGoogleMap(api: any, map: any, center: { lat: number; lng: number }) {
  if (!api?.event || !map) {
    return;
  }

  const refresh = () => {
    try {
      api.event.trigger(map, 'resize');
      if (typeof map.panTo === 'function') {
        map.panTo(center);
      } else if (typeof map.setCenter === 'function') {
        map.setCenter(center);
      }
    } catch (_error) {
      // Ignore transient map refresh errors.
    }
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(refresh);
  } else {
    setTimeout(refresh, 0);
  }

  setTimeout(refresh, 180);
}
function syncMapLocationText(field: RichWidgetContext, state: MapWidgetState, api: any) {
  if (isPolygonMap(field) || field.params.value.hideMapText) {
    state.locationText.value = '';
    state.locationLookupKey = undefined;
    state.locationLookupPending = undefined;
    return;
  }

  const point = normalizePoint(field.modelValue.value);
  if (!point) {
    state.locationText.value = '';
    state.locationLookupKey = undefined;
    state.locationLookupPending = undefined;
    return;
  }

  const key = `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`;
  if (state.locationLookupKey === key || state.locationLookupPending === key) {
    return;
  }

  if (!api?.Geocoder) {
    state.locationText.value = key;
    state.locationLookupKey = key;
    state.locationLookupPending = undefined;
    return;
  }

  state.locationLookupPending = key;
  state.locationText.value = 'Resolving location...';

  const geocoder = new api.Geocoder();
  geocoder.geocode({ location: point }, (results: any[], status: string) => {
    if (state.locationLookupPending !== key) {
      return;
    }

    state.locationLookupPending = undefined;
    state.locationLookupKey = key;

    if (status === 'OK' && results?.length) {
      state.locationText.value = results[0].formatted_address || key;
      return;
    }

    state.locationText.value = key;
  });
}

export function buildMapWidget(field: RichWidgetContext): VNode[] {
  const h = field.$h;
  const center = { lat: 0, lng: 0 };
  const state = getMapWidgetState(field);
  ensureMapWatchers(field, state);

  const mapApiKey = field.params.value.mapApiKey;
  const polygonPathsFromModel = normalizePolygonCoordinates(field.modelValue.value);
  const polygonPaths = polygonPathsFromModel.length ? polygonPathsFromModel : state.draftPolygonPaths.value;

  if (polygonPathsFromModel.length && state.draftPolygonPaths.value.length) {
    state.draftPolygonPaths.value = [];
  }

  const pointValue = normalizePoint(field.modelValue.value);
  const mapCenter = isPolygonMap(field) ? polygonCenter(polygonPaths, center) : (pointValue || center);
  const pointOptions: any = {
    ...(field.params.value.mapOptions || {}),
    position: pointValue || center,
    draggable: !field.$readonly,
  };
  const polygonOptions: any = {
    strokeColor: '#146eb4',
    strokeOpacity: 0.9,
    strokeWeight: 2,
    fillColor: '#146eb4',
    fillOpacity: 0.24,
    editable: !field.$readonly,
    draggable: !field.$readonly,
    clickable: true,
    paths: polygonPaths,
    ...(field.params.value.mapOptions || {}),
  };

  const mapHeight = field.params.value.height || '300px';
  const mapChildren: VNode[] = [];

  if (isPolygonMap(field)) {
    if (polygonPaths.length >= 3) {
      mapChildren.push(
        h(Polygon as any, {
          ref: (el: any) => {
            const polygon = el?.polygon;
            const ref = state.mapComponentRef.value;
            if (polygon && ref?.ready && ref.api) {
              syncPolygonListeners(field, state, ref.api, polygon);
            }
          },
          options: polygonOptions,
        })
      );
    }

    if (polygonPaths.length < 3) {
      polygonPaths.forEach((item) => {
        mapChildren.push(
          h(Marker, {
            options: {
              position: item,
              draggable: false,
            },
          })
        );
      });
    }
  } else {
    mapChildren.push(
      h(Marker, {
        options: pointOptions,
        title: field.params.value.label,
        draggable: !field.$readonly,
        onDragend: (event: any) => {
          const pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          field.modelValue.value = pos;
        },
      })
    );
  }

  const mapNode = h(
    'div',
    {
      style: {
        height: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
        width: '100%',
        maxWidth: field.maxWidth.value,
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#f8fafc',
      },
    },
    !mapApiKey
      ? h(
          'div',
          {
            class: ['d-flex', 'align-center', 'justify-center', 'text-center', 'px-4', 'py-6', 'text-body-2'],
            style: {
              height: '100%',
            },
          },
          'Google Maps is not configured. Set VITE_GOOGLE_MAPS_API_KEY in test/.env (or the repo root .env) to enable this widget.'
        )
      : h(
          GoogleMap,
          {
            ref: (el: any) => {
              state.mapComponentRef.value = el ? markRaw(el) : el;
            },
            apiKey: mapApiKey,
            style: {
              height: typeof mapHeight === 'number' ? `${mapHeight}px` : mapHeight,
              width: '100%',
            },
            center: mapCenter,
            zoom: field.params.value.mapZoom || 5,
          },
          {
            default: () => mapChildren,
          }
        )
  );

  return [
    h(
      'div',
      {
        class: ['ml-2', 'mb-4'],
      },
      field.params.value.label
    ),
    h(
      'div',
      {},
      mapNode
    ),
    ...(!isPolygonMap(field) && !field.params.value.hideMapText && state.locationText.value ? [
      h(
        VSheet,
        {
          rounded: 'lg',
          variant: 'tonal',
          color: 'primary',
          class: ['mt-3', 'px-3', 'py-2'],
          style: {
            width: '100%',
            maxWidth: field.maxWidth.value,
          },
        },
        () =>
          h(
            'div',
            {
              class: ['text-body-2'],
            },
            state.locationText.value
          )
      ),
    ] : []),
    ...(isPolygonMap(field) && !field.$readonly ? [
      h(
        'div',
        {
          class: ['text-caption', 'mt-2'],
          style: {
            maxWidth: field.maxWidth.value,
            opacity: '0.72',
          },
        },
        polygonPaths.length >= 3 ? 'Drag polygon vertices to edit. Right-click a vertex to remove it.' : 'Click on the map to add polygon points.'
      ),
    ] : []),
  ];
}

export function buildImageWidget(field: RichWidgetContext): VNode {
  const h = field.$h;
  if (field.params.value.multiple) {
    if (!field.modelValue.value) field.modelValue.value = [];
    if (!Array.isArray(field.modelValue.value)) field.modelValue.value = [field.modelValue.value];

    return h(
      VRow,
      {},
      () => [
        h(
          VCol,
          {
            cols: 12
          },
          () => h(
            'div',
            {},
            field.params.value.label
          )
        ),
        ...(field.modelValue.value || []).map((item: any, index: number) => 
        h(
          VCol,
          {
            cols: 12,
            md: 6,
            lg: 4,
            align: 'center'
          },
          () => [
            item.indexOf('image') !== -1 ? h(
              VImg,
              {
                src: item,
                height: item ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10,
                onClick: () => {
                  field.showMediaFullscreen(item);
                }
              }
            ) : (item ? h(
              'div',
              {
                class: ['py-auto'],
                style: {
                  height: `${item ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10}px`,
                  'max-width': '200px',
                  border: 'thin solid black',
                },
                onClick: () => {
                  field.showMediaFullscreen(item);
                }
              },
              'No Preview'
            ) : undefined),
            ...(field.$readonly ? [] : [
              h(
                VIcon,
                {
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
                }
              )
            ])
          ]
        )
        ),
        h(
          VCol,
          {
            cols: 12,
            align: "center"
          },
          () => field.$readonly ? [] : [
            h(
              VBtn,
              {
                color: 'primary',
                onClick: async () => {
                  try {
                    const files: FileList = await selectFile(field.params.value.fileAccepts, true);
                    const data: any[] = [];
                    for (let i = 0; i < files.length; i++) {
                      try {
                        const base64 = await fileToBase64(files[i], field.params.value.fileMaxSize || 500);
                        data.push(base64);
                      } catch (error) {
                        Dialogs.$error((error as any).message);
                      }
                    }
                    if (!field.modelValue.value) {
                      field.modelValue.value = data;
                    } else if (!Array.isArray(field.modelValue.value)) {
                      field.modelValue.value = [field.modelValue.value].concat(data);
                    } else {
                      const value = field.modelValue.value || [];
                      field.modelValue.value = value.concat(data);
                    }
                  } catch (error) {
                    Dialogs.$error((error as any).message);
                  }
                }
              },
              () => h(
                VIcon,
                {},
                () => 'mdi-upload'
              ),
            ),
            ...(field.modelValue.value && field.modelValue.value.length > 0 ? [
              h(
                VBtn,
                {
                  color: 'error',
                  class: ['ml-4'],
                  onClick: async () => {
                    field.modelValue.value = [];
                  }
                },
                () => h(
                  VIcon,
                  {},
                  () => 'mdi-delete'
                )
              ),
            ] : [])
          ]
        )
      ]
    );  
  }
  return h(
    VRow,
    {},
    () => [
      h(
        VCol,
        {
          cols: 12
        },
        () => h(
          'div',
          {},
          field.params.value.label
        )
      ),
      h(
        VCol,
        {
          cols: 12,
          align: 'center'
        },
        () => field.modelValue.value && field.modelValue.value.indexOf('image') !== -1 ? h(
          VImg,
          {
            src: field.modelValue.value,
            height: field.modelValue.value ? (field.params.value.height === undefined ? 300 : field.params.value.height) : 10,
            style: {
              cursor: 'pointer'
            },
            onClick: () => {
              field.showMediaFullscreen(field.modelValue.value);
            }
          }
        ) : (field.modelValue.value ? h(
          'div',
          {
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
          },
          'No Preview'
        ) : undefined)
      ),
      h(
        VCol,
        {
          cols: 12,
          align: "center"
        },
        () => field.$readonly ? [] : [
          h(
            VBtn,
            {
              color: 'primary',
              onClick: async () => {
                try {
                  const files: FileList = await selectFile(field.params.value.fileAccepts);
                  const base64 = await fileToBase64(files[0], field.params.value.fileMaxSize || 500);
                  field.modelValue.value = base64;
                } catch (error) {
                  Dialogs.$error((error as any).message);
                }
              }
            },
            () => h(
              VIcon,
              {},
              () => 'mdi-upload'
            ),
          ),
          ...(field.modelValue.value ? [
            h(
              VBtn,
              {
                color: 'error',
                class: ['ml-4'],
                onClick: async () => {
                  field.modelValue.value = null;
                }
              },
              () => h(
                VIcon,
                {},
                () => 'mdi-delete'
              )
            ),
            h(
              VBtn,
              {
                color: 'success',
                class: ['ml-4'],
                onClick: () => {
                  field.showMediaFullscreen(field.modelValue.value);
                }
              },
              () => h(
                VIcon,
                {},
                () => 'mdi-eye'
              )
            )
          ] : [])
        ]
      )
    ]
  );
}
