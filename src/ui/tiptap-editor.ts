import { EditorContent } from '@tiptap/vue-3';
import { Editor, mergeAttributes, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { computed, defineComponent, h as vueH, mergeProps, onBeforeUnmount, onMounted, PropType, ref, shallowRef, watch } from 'vue';
import { VBtn, VDialog, VDivider, VList, VListItem, VMenu, VSheet, VTextarea, VTooltip } from 'vuetify/components';
import { Dialogs } from './dialogs';
import { fileToBase64, selectFile } from '../misc';
import { resolveUIText } from './runtime';
import { resolveHtmlEditorToolbar, type HtmlEditorProfile, type HtmlEditorToolbarItem } from './html-editor-options';

type TiptapAdapterEvent = 'init' | 'keydown';

export interface TiptapHtmlEditorAdapter {
  isReady: boolean;
  on: (event: TiptapAdapterEvent, handler: (...args: any[]) => void) => void;
  focus: () => void;
  getBody: () => HTMLElement | null;
  getHTML: () => string;
}

interface ToolbarMenuItem {
  active?: boolean;
  disabled?: boolean;
  icon?: string;
  title: string;
  onClick: () => void | Promise<void>;
}

interface EmbeddedVideoAttrs {
  src: string;
  embedSrc: string;
  provider: 'iframe' | 'file';
  title: string;
  allowFullscreen: boolean;
  width: string;
}

const headingLevels = [1, 2, 3, 4, 5, 6] as const;
const topLevelText = (key: string, fallback: string, values?: Record<string, any>) => resolveUIText({ key, fallback, values }, fallback);

const asCssSize = (value: number | string | undefined): string | undefined => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return undefined;
};

const normalizeHtmlValue = (value: string | null | undefined): string => value || '';

const normalizeUrlInput = (value: string): string => {
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

const getYouTubeVideoId = (url: URL): string | null => {
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

const getVimeoVideoId = (url: URL): string | null => {
  const hostname = url.hostname.replace(/^www\./, '');
  if (!hostname.endsWith('vimeo.com')) {
    return null;
  }

  const parts = url.pathname.split('/').filter(Boolean);
  const numericPart = [...parts].reverse().find((part) => /^\d+$/.test(part));
  return numericPart || null;
};

const isDirectVideoUrl = (url: URL): boolean => {
  return /\.(mp4|webm|ogg|mov|m4v)(?:$|\?)/i.test(`${url.pathname}${url.search}`);
};

const resolveEmbeddedVideo = (input: string): EmbeddedVideoAttrs | null => {
  const normalized = normalizeUrlInput(input);
  if (!normalized) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch (_error) {
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

const EmbeddedVideo = Node.create({
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
          const element = node as HTMLElement;
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
          const element = node as HTMLIFrameElement;
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
          const element = node as HTMLVideoElement;
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
    const attrs = HTMLAttributes as unknown as EmbeddedVideoAttrs;
    const wrapperAttrs = mergeAttributes(
      {
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
      },
      HTMLAttributes,
    );

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

export const TiptapHtmlEditor = defineComponent({
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
      type: [Number, String] as PropType<number | string | undefined>,
      default: 300,
    },
    profile: {
      type: String as PropType<HtmlEditorProfile>,
      default: 'full',
    },
    toolbar: {
      type: Array as PropType<HtmlEditorToolbarItem[] | undefined>,
      default: undefined,
    },
    allowFullscreen: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'ready'],
  setup(props, { emit, attrs }) {
    const editor = shallowRef<Editor | null>(null);
    const rootEl = ref<any>(null);
    const hostEl = ref<HTMLElement | null>(null);
    const revision = ref(0);
    const currentHtml = ref(normalizeHtmlValue(props.modelValue));
    const sourceHtml = ref(normalizeHtmlValue(props.modelValue));
    const sourceDraft = ref(normalizeHtmlValue(props.modelValue));
    const sourceSnapshot = ref(normalizeHtmlValue(props.modelValue));
    const sourceMode = ref(false);
    const fullscreenDialog = ref(false);
    const editorActionFrame = ref<number | null>(null);
    const initHandlers: Array<(...args: any[]) => void> = [];
    const keydownHandlers: Array<(...args: any[]) => void> = [];
    const pendingEditorActions: Array<() => void> = [];
    const lastSelection = ref<{ from: number; to: number } | undefined>(undefined);
    const toolbarCompact = ref(false);
    const enabledToolbarItems = computed(() => new Set(
      resolveHtmlEditorToolbar(props.profile, props.toolbar, props.allowFullscreen),
    ));
    const hasToolbarItem = (item: HtmlEditorToolbarItem) => enabledToolbarItems.value.has(item);
    let resizeObserver: ResizeObserver | undefined;

    const preventToolbarMouseDown = (event: MouseEvent) => {
      event.preventDefault();
    };

    const flushEditorActions = () => {
      editorActionFrame.value = null;
      const actions = pendingEditorActions.splice(0, pendingEditorActions.length);
      actions.forEach((action) => action());
    };

    const queueEditorAction = (action: () => void) => {
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

    const getSelectionSnapshot = (instance?: Editor | null) => {
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

    const restoreSelection = (liveEditor: Editor, selection?: { from: number; to: number }) => {
      if (!selection) {
        return liveEditor.chain();
      }

      return liveEditor.chain().setTextSelection(selection);
    };

    const runEditorCommand = (command: (instance: Editor) => void) => {
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

    const t = (key: string, fallback: string, values?: Record<string, any>) => resolveUIText({ key, fallback, values }, fallback);
    const tooltip = (key: string, fallback: string, shortcut?: string, values?: Record<string, any>) => {
      const label = t(key, fallback, values);
      return shortcut ? `${label} (${shortcut})` : label;
    };

    const syncSourceState = (value: string) => {
      sourceHtml.value = value;
      if (!sourceMode.value) {
        sourceDraft.value = value;
        sourceSnapshot.value = value;
      }
    };

    const updateHtmlValue = (value: string) => {
      currentHtml.value = value;
      syncSourceState(value);
      emit('update:modelValue', value);
      refreshToolbar();
    };

    const queueContentSync = (nextValue: string) => {
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

    const adapter: TiptapHtmlEditorAdapter = {
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
          const body = hostEl.value?.querySelector<HTMLElement>('.ProseMirror');
          body?.focus();
        });
      },
      getBody() {
        return hostEl.value?.querySelector('.ProseMirror') || null;
      },
      getHTML() {
        return editor.value?.getHTML() || '';
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

    const getRootElement = (): HTMLElement | null => {
      if (rootEl.value instanceof HTMLElement) {
        return rootEl.value;
      }

      const componentElement = rootEl.value?.$el;
      if (componentElement instanceof HTMLElement) {
        return componentElement;
      }

      const closestSheet = hostEl.value?.closest?.('.vef-tiptap');
      if (closestSheet instanceof HTMLElement) {
        return closestSheet;
      }

      return hostEl.value;
    };

    const syncToolbarMode = () => {
      const width = getRootElement()?.clientWidth || 0;
      toolbarCompact.value = width > 0 && width < 860;
      refreshToolbar();
    };

    const createIconButton = (params: {
      icon: string;
      title: string;
      active?: boolean;
      disabled?: boolean;
      onClick: () => void | Promise<void>;
    }) => vueH(
      VTooltip,
      {
        text: params.title,
        location: 'top',
        openDelay: 120,
      },
      {
        activator: ({ props: tooltipProps }: any) => vueH(VBtn, mergeProps(tooltipProps, {
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
      },
    );

    const createMenuButton = (params: {
      icon?: string;
      label?: string;
      title: string;
      active?: boolean;
      disabled?: boolean;
      items: ToolbarMenuItem[];
    }) => vueH(
      VMenu,
      {
        closeOnContentClick: true,
      },
      {
        default: () => vueH(
          VList,
          {
            density: 'compact',
            minWidth: 220,
          },
          () => params.items.map((item) => vueH(VListItem, {
            key: `${params.label || params.icon}-${item.title}`,
            title: item.title,
            prependIcon: item.icon,
            active: item.active,
            disabled: item.disabled,
            onClick: item.onClick,
          })),
        ),
        activator: ({ props: menuActivatorProps }: any) => vueH(
          VTooltip,
          {
            text: params.title,
            location: 'top',
            openDelay: 120,
          },
          {
            activator: ({ props: tooltipProps }: any) => vueH(VBtn, mergeProps(menuActivatorProps, tooltipProps, {
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
          },
        ),
      },
    );

    const promptForLink = async () => {
      const instance = editor.value;
      if (!instance || props.readonly || props.disabled) {
        return;
      }

      const selection = getSelectionSnapshot(instance);
      const currentUrl = instance.getAttributes('link').href || '';
      const value = await Dialogs.$prompt({
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
    };

    const promptForTableInsert = async () => {
      const selection = getSelectionSnapshot();
      const rowsValue = await Dialogs.$prompt({
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

      const colsValue = await Dialogs.$prompt({
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
    };

    const promptForImage = async () => {
      const instance = editor.value;
      if (!instance || props.readonly || props.disabled) {
        return;
      }

      try {
        const selection = getSelectionSnapshot(instance);
        const files = await selectFile('image/*');
        const file = files?.[0];
        if (!file) {
          return;
        }

        const dataUrl = await fileToBase64(file) as string;
        runEditorCommand((liveEditor) => {
          restoreSelection(liveEditor, selection).setImage({ src: dataUrl, alt: file.name }).run();
        });
      } catch (_error) {
        // User cancelled file selection.
      }
    };

    const promptForVideo = async () => {
      const instance = editor.value;
      if (!instance || props.readonly || props.disabled) {
        return;
      }

      const selection = getSelectionSnapshot(instance);
      const value = await Dialogs.$prompt({
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
        Dialogs.$error({ key: 've.editor.video.unsupportedUrl', fallback: 'Unsupported video URL. Use YouTube, Vimeo, an embeddable player URL, or a direct .mp4/.webm/.ogg link.' });
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
    };

    const setSelectedVideoWidth = (width: string) => {
      runEditorCommand((liveEditor) => {
        liveEditor.chain().updateAttributes('embeddedVideo', { width }).run();
      });
    };

    const promptForVideoWidth = async () => {
      const instance = editor.value;
      if (!instance || props.readonly || props.disabled || !instance.isActive('embeddedVideo')) {
        return;
      }

      const currentWidth = String(instance.getAttributes('embeddedVideo').width || '100%');
      const defaultWidth = Number.parseInt(currentWidth, 10);
      const value = await Dialogs.$prompt({
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
    };

    const insertFormula = (display: boolean) => {
      runEditorCommand((liveEditor) => {
        const { from, to } = liveEditor.state.selection;
        const selectedText = liveEditor.state.doc.textBetween(from, to, '\n');
        const isEmptySelection = from === to;
        const content = display
          ? `$$\n${selectedText}\n$$`
          : `$${selectedText}$`;

        const selectionStart = display ? from + 3 : from + 1;
        const selectionEnd = selectionStart + selectedText.length;

        liveEditor.chain().insertContentAt({ from, to }, content).setTextSelection(
          isEmptySelection
            ? selectionStart
            : { from: selectionStart, to: selectionEnd },
        ).run();
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

    const onEditorShortcut = (event: KeyboardEvent): boolean => {
      if (props.readonly || props.disabled) {
        return false;
      }

      const key = event.key.toLowerCase();
      const withMeta = event.ctrlKey || event.metaKey;
      const withAlt = event.altKey;
      const withShift = event.shiftKey;

      if (event.key === 'F11' && hasToolbarItem('fullscreen')) {
        event.preventDefault();
        fullscreenDialog.value = true;
        return true;
      }

      if (!withMeta) {
        return false;
      }

      if (withAlt && !withShift) {
        if (key === '0' && hasToolbarItem('block')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().setParagraph().run());
          return true;
        }

        if (['1', '2', '3', '4', '5', '6'].includes(key) && hasToolbarItem('block')) {
          event.preventDefault();
          const level = Number(key) as typeof headingLevels[number];
          runEditorCommand((liveEditor) => liveEditor.chain().toggleHeading({ level }).run());
          return true;
        }

        if (key === 'q' && hasToolbarItem('block')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().toggleBlockquote().run());
          return true;
        }

        if (key === 'c' && hasToolbarItem('block')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().toggleCodeBlock().run());
          return true;
        }

        if (key === 'l' && hasToolbarItem('align')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('left').run());
          return true;
        }

        if (key === 'e' && hasToolbarItem('align')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('center').run());
          return true;
        }

        if (key === 'r' && hasToolbarItem('align')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('right').run());
          return true;
        }

        if (key === 'j' && hasToolbarItem('align')) {
          event.preventDefault();
          runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('justify').run());
          return true;
        }

        if (key === 'k' && hasToolbarItem('link')) {
          event.preventDefault();
          void promptForLink();
          return true;
        }

        if (key === 'i' && hasToolbarItem('image')) {
          event.preventDefault();
          void promptForImage();
          return true;
        }

        if (key === 'v' && hasToolbarItem('video')) {
          event.preventDefault();
          void promptForVideo();
          return true;
        }

        if (key === 't' && hasToolbarItem('table')) {
          event.preventDefault();
          void promptForTableInsert();
          return true;
        }

        if (key === 'm' && hasToolbarItem('inlineFormula')) {
          event.preventDefault();
          insertFormula(false);
          return true;
        }

        if (key === 's' && hasToolbarItem('source')) {
          event.preventDefault();
          toggleSourceMode();
          return true;
        }
      }

      if (withMeta && withAlt && withShift && key === 'm' && hasToolbarItem('blockFormula')) {
        event.preventDefault();
        insertFormula(true);
        return true;
      }

      return false;
    };

    const createEditor = () => {
      editor.value = new Editor({
        editable: !(props.readonly || props.disabled),
        content: normalizeHtmlValue(props.modelValue),
        extensions: [
          StarterKit.configure({
            link: {
              openOnClick: false,
              autolink: true,
              linkOnPaste: true,
              defaultProtocol: 'https',
            },
          }),
          Placeholder.configure({
            placeholder: props.placeholder || '',
          }),
          Image,
          TaskList,
          TaskItem.configure({
            nested: true,
          }),
          EmbeddedVideo,
          TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'center', 'right', 'justify'],
          }),
          Table.configure({
            resizable: true,
          }),
          TableRow,
          TableHeader,
          TableCell,
        ],
        editorProps: {
          attributes: {
            class: 'vef-tiptap__content ProseMirror',
          },
          handleDOMEvents: {
            keydown: (_view, event) => {
              if (onEditorShortcut(event as KeyboardEvent)) {
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

    onMounted(() => {
      createEditor();
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => syncToolbarMode());
        const rootElement = getRootElement();
        if (rootElement) {
          resizeObserver.observe(rootElement);
        } else {
          syncToolbarMode();
        }
      } else {
        syncToolbarMode();
      }
    });

    onBeforeUnmount(() => {
      adapter.isReady = false;
      if (editorActionFrame.value !== null && typeof window !== 'undefined') {
        window.cancelAnimationFrame(editorActionFrame.value);
        editorActionFrame.value = null;
      }
      pendingEditorActions.splice(0, pendingEditorActions.length);
      resizeObserver?.disconnect();
      resizeObserver = undefined;
      editor.value?.destroy();
      editor.value = null;
    });

    watch(
      () => props.modelValue,
      (value) => {
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
      },
      {
        flush: 'post',
      },
    );

    watch(
      () => [props.readonly, props.disabled] as const,
      ([readonly, disabled]) => {
        editor.value?.setEditable(!(readonly || disabled));
        refreshToolbar();
      },
    );

    return () => {
      revision.value;

      const instance = editor.value;
      const isReadOnly = props.readonly || props.disabled;
      const height = asCssSize(props.height);
      const toolbarHeight = !isReadOnly && enabledToolbarItems.value.size > 0 ? 56 : 0;
      const contentMinHeight = typeof props.height === 'number'
        ? `${Math.max(props.height - toolbarHeight, 120)}px`
        : '220px';
      const inTable = !!instance?.isActive('table');
      const inEmbeddedVideo = !!instance?.isActive('embeddedVideo');
      const embeddedVideoWidth = String(instance?.getAttributes('embeddedVideo').width || '100%');
      const toolbarButton = (item: HtmlEditorToolbarItem, options: Parameters<typeof createIconButton>[0]) => (
        hasToolbarItem(item) ? createIconButton(options) : null
      );
      const menuItems = (item: HtmlEditorToolbarItem, items: ToolbarMenuItem[]) => (
        hasToolbarItem(item) ? items : []
      );
      const joinToolbarGroups = (...groups: any[][]): any[] => {
        const joined: any[] = [];
        for (const group of groups) {
          if (group.length === 0) {
            continue;
          }
          if (joined.length > 0) {
            joined.push(vueH(VDivider, { vertical: true, class: 'mx-1' }));
          }
          joined.push(...group);
        }
        return joined;
      };

      const blockMenu = hasToolbarItem('block') ? createMenuButton({
        icon: 'mdi-format-paragraph',
        label: instance?.isActive('heading')
          ? getBlockLabel()
          : instance?.isActive('codeBlock')
            ? t('ve.editor.block.codeShort', 'Code')
            : instance?.isActive('blockquote')
              ? t('ve.editor.block.quoteShort', 'Quote')
              : instance?.isActive('taskList')
                ? t('ve.editor.block.taskShort', 'Task')
                : 'P',
        title: t('ve.editor.toolbar.blockStyle', 'Block Style'),
        items: [
          {
            title: t('ve.editor.block.paragraph', 'Paragraph'),
            icon: 'mdi-format-paragraph',
            active: !instance?.isActive('heading') && !instance?.isActive('codeBlock') && !instance?.isActive('blockquote') && !instance?.isActive('taskList'),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setParagraph().run()),
          },
          ...headingLevels.map((level) => ({
            title: t('ve.editor.block.heading', `Heading ${level}`, { level }),
            icon: 'mdi-format-header-pound',
            active: !!instance?.isActive('heading', { level }),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleHeading({ level }).run()),
          })),
          {
            title: t('ve.editor.block.blockQuote', 'Block Quote'),
            icon: 'mdi-format-quote-close',
            active: !!instance?.isActive('blockquote'),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBlockquote().run()),
          },
          {
            title: t('ve.editor.block.codeBlock', 'Code Block'),
            icon: 'mdi-code-tags',
            active: !!instance?.isActive('codeBlock'),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCodeBlock().run()),
          },
          {
            title: t('ve.editor.block.taskList', 'Task List'),
            icon: 'mdi-format-list-checks',
            active: !!instance?.isActive('taskList'),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
          },
        ],
      }) : null;

      const alignMenu = hasToolbarItem('align') ? createMenuButton({
        icon: 'mdi-format-align-left',
        label: '',
        title: t('ve.editor.toolbar.alignment', 'Alignment'),
        items: [
          {
            title: t('ve.editor.align.left', 'Align Left'),
            icon: 'mdi-format-align-left',
            active: !instance?.isActive({ textAlign: 'center' }) && !instance?.isActive({ textAlign: 'right' }) && !instance?.isActive({ textAlign: 'justify' }),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('left').run()),
          },
          {
            title: t('ve.editor.align.center', 'Align Center'),
            icon: 'mdi-format-align-center',
            active: !!instance?.isActive({ textAlign: 'center' }),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('center').run()),
          },
          {
            title: t('ve.editor.align.right', 'Align Right'),
            icon: 'mdi-format-align-right',
            active: !!instance?.isActive({ textAlign: 'right' }),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('right').run()),
          },
          {
            title: t('ve.editor.align.justify', 'Justify'),
            icon: 'mdi-format-align-justify',
            active: !!instance?.isActive({ textAlign: 'justify' }),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setTextAlign('justify').run()),
          },
        ],
      }) : null;

      const tableMenuItems: ToolbarMenuItem[] = [
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

      const tableMenu = hasToolbarItem('table') ? createMenuButton({
        icon: 'mdi-table',
        label: t('ve.editor.table.shortLabel', 'Tbl'),
        title: t('ve.editor.table.actions', 'Table Actions'),
        active: inTable,
        items: tableMenuItems,
      }) : null;

      const videoMenuItems: ToolbarMenuItem[] = [
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

      const videoMenu = hasToolbarItem('video') ? createMenuButton({
        icon: 'mdi-video',
        label: t('ve.editor.video.shortLabel', 'Vid'),
        title: t('ve.editor.video.size', 'Video Size'),
        active: inEmbeddedVideo,
        items: videoMenuItems,
      }) : null;

      const sourceToggleButton = toolbarButton('source', {
        icon: 'mdi-code-braces',
        title: sourceMode.value ? tooltip('ve.editor.source.apply', 'Apply Source Changes', 'Ctrl/Cmd+Alt+S') : tooltip('ve.editor.source.switchToHtml', 'Switch To Source HTML', 'Ctrl/Cmd+Alt+S'),
        active: sourceMode.value,
        onClick: toggleSourceMode,
      });

      const fullscreenButton = toolbarButton('fullscreen', {
        icon: 'mdi-fullscreen',
        title: tooltip('ve.editor.fullscreen.open', 'Open Fullscreen Editor', 'F11'),
        onClick: () => {
          fullscreenDialog.value = true;
        },
      });

      const secondaryToolbarItems = [
        toolbarButton('underline', {
          icon: 'mdi-format-underline',
          title: t('ve.editor.mark.underline', 'Underline'),
          active: !!instance?.isActive('underline'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleUnderline().run()),
        }),
        toolbarButton('strike', {
          icon: 'mdi-format-strikethrough',
          title: t('ve.editor.mark.strikeThrough', 'Strike Through'),
          active: !!instance?.isActive('strike'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleStrike().run()),
        }),
        toolbarButton('inlineCode', {
          icon: 'mdi-code-tags',
          title: t('ve.editor.mark.inlineCode', 'Inline Code'),
          active: !!instance?.isActive('code'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCode().run()),
        }),
        toolbarButton('taskList', {
          icon: 'mdi-format-list-checks',
          title: t('ve.editor.block.taskList', 'Task List'),
          active: !!instance?.isActive('taskList'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
        }),
        toolbarButton('inlineFormula', {
          icon: 'mdi-function-variant',
          title: tooltip('ve.editor.formula.inline', 'Insert Inline Formula', 'Ctrl/Cmd+Alt+M'),
          onClick: () => insertFormula(false),
        }),
        toolbarButton('blockFormula', {
          icon: 'mdi-function',
          title: tooltip('ve.editor.formula.block', 'Insert Block Formula', 'Ctrl/Cmd+Alt+Shift+M'),
          onClick: () => insertFormula(true),
        }),
        toolbarButton('link', {
          icon: 'mdi-link-variant',
          title: tooltip('ve.editor.link.insertOrEdit', 'Insert Or Edit Link', 'Ctrl/Cmd+Alt+K'),
          active: !!instance?.isActive('link'),
          onClick: promptForLink,
        }),
        toolbarButton('link', {
          icon: 'mdi-link-variant-off',
          title: t('ve.editor.link.remove', 'Remove Link'),
          disabled: !instance?.isActive('link'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().extendMarkRange('link').unsetLink().run()),
        }),
        toolbarButton('image', {
          icon: 'mdi-image-plus',
          title: tooltip('ve.editor.image.insert', 'Insert Image', 'Ctrl/Cmd+Alt+I'),
          onClick: promptForImage,
        }),
        toolbarButton('video', {
          icon: 'mdi-video-plus',
          title: tooltip('ve.editor.video.insertTitle', 'Insert Video', 'Ctrl/Cmd+Alt+V'),
          onClick: promptForVideo,
        }),
        toolbarButton('clearFormatting', {
          icon: 'mdi-minus-circle-off-outline',
          title: t('ve.editor.clearFormatting', 'Clear Formatting'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().unsetAllMarks().clearNodes().run()),
        }),
        toolbarButton('horizontalRule', {
          icon: 'mdi-minus',
          title: t('ve.editor.insertHorizontalRule', 'Insert Horizontal Rule'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setHorizontalRule().run()),
        }),
      ].filter(Boolean) as any[];

      const moreMenuItems: ToolbarMenuItem[] = [
        ...menuItems('underline', [{
          title: t('ve.editor.mark.underline', 'Underline'),
          icon: 'mdi-format-underline',
          active: !!instance?.isActive('underline'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleUnderline().run()),
        }]),
        ...menuItems('strike', [{
          title: t('ve.editor.mark.strikeThrough', 'Strike Through'),
          icon: 'mdi-format-strikethrough',
          active: !!instance?.isActive('strike'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleStrike().run()),
        }]),
        ...menuItems('inlineCode', [{
          title: t('ve.editor.mark.inlineCode', 'Inline Code'),
          icon: 'mdi-code-tags',
          active: !!instance?.isActive('code'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleCode().run()),
        }]),
        ...menuItems('taskList', [{
          title: t('ve.editor.block.taskList', 'Task List'),
          icon: 'mdi-format-list-checks',
          active: !!instance?.isActive('taskList'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleTaskList().run()),
        }]),
        ...menuItems('inlineFormula', [{
          title: t('ve.editor.formula.inline', 'Insert Inline Formula'),
          icon: 'mdi-function-variant',
          onClick: () => insertFormula(false),
        }]),
        ...menuItems('blockFormula', [{
          title: t('ve.editor.formula.block', 'Insert Block Formula'),
          icon: 'mdi-function',
          onClick: () => insertFormula(true),
        }]),
        ...menuItems('link', [
          {
            title: t('ve.editor.link.insertOrEdit', 'Insert Or Edit Link'),
            icon: 'mdi-link-variant',
            active: !!instance?.isActive('link'),
            onClick: promptForLink,
          },
          {
            title: t('ve.editor.link.remove', 'Remove Link'),
            icon: 'mdi-link-variant-off',
            disabled: !instance?.isActive('link'),
            onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().extendMarkRange('link').unsetLink().run()),
          },
        ]),
        ...menuItems('image', [{
          title: t('ve.editor.image.insert', 'Insert Image'),
          icon: 'mdi-image-plus',
          onClick: promptForImage,
        }]),
        ...menuItems('video', [
          {
            title: t('ve.editor.video.insertTitle', 'Insert Video'),
            icon: 'mdi-video-plus',
            onClick: promptForVideo,
          },
          ...videoMenuItems.map((item) => ({
            ...item,
            title: t('ve.editor.video.prefixedAction', `Video: ${item.title}`, { title: item.title }),
          })),
        ]),
        ...menuItems('clearFormatting', [{
          title: t('ve.editor.clearFormatting', 'Clear Formatting'),
          icon: 'mdi-minus-circle-off-outline',
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().unsetAllMarks().clearNodes().run()),
        }]),
        ...menuItems('horizontalRule', [{
          title: t('ve.editor.insertHorizontalRule', 'Insert Horizontal Rule'),
          icon: 'mdi-minus',
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().setHorizontalRule().run()),
        }]),
        ...menuItems('table', tableMenuItems.map((item) => ({
          ...item,
          title: t('ve.editor.table.prefixedAction', `Table: ${item.title}`, { title: item.title }),
        }))),
      ];

      const moreMenu = moreMenuItems.length > 0 ? createMenuButton({
        icon: 'mdi-dots-horizontal',
        label: '',
        title: t('ve.editor.moreActions', 'More Actions'),
        items: moreMenuItems,
      }) : null;

      const historyToolbarItems = [
        toolbarButton('undo', {
          icon: 'mdi-undo',
          title: tooltip('ve.common.undo', 'Undo', 'Ctrl/Cmd+Z'),
          disabled: !instance?.can().undo(),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().undo().run()),
        }),
        toolbarButton('redo', {
          icon: 'mdi-redo',
          title: tooltip('ve.common.redo', 'Redo', 'Ctrl/Cmd+Shift+Z'),
          disabled: !instance?.can().redo(),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().redo().run()),
        }),
      ].filter(Boolean) as any[];

      const formattingToolbarItems = [
        blockMenu,
        alignMenu,
        toolbarButton('bold', {
          icon: 'mdi-format-bold',
          title: tooltip('ve.editor.mark.bold', 'Bold', 'Ctrl/Cmd+B'),
          active: !!instance?.isActive('bold'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBold().run()),
        }),
        toolbarButton('italic', {
          icon: 'mdi-format-italic',
          title: tooltip('ve.editor.mark.italic', 'Italic', 'Ctrl/Cmd+I'),
          active: !!instance?.isActive('italic'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleItalic().run()),
        }),
        toolbarButton('bulletList', {
          icon: 'mdi-format-list-bulleted',
          title: tooltip('ve.editor.list.bulleted', 'Bullet List', 'Ctrl/Cmd+Shift+8'),
          active: !!instance?.isActive('bulletList'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleBulletList().run()),
        }),
        toolbarButton('orderedList', {
          icon: 'mdi-format-list-numbered',
          title: tooltip('ve.editor.list.numbered', 'Numbered List', 'Ctrl/Cmd+Shift+7'),
          active: !!instance?.isActive('orderedList'),
          onClick: () => runEditorCommand((liveEditor) => liveEditor.chain().toggleOrderedList().run()),
        }),
      ].filter(Boolean) as any[];

      const visualToolbarItems = joinToolbarGroups(historyToolbarItems, formattingToolbarItems);

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

      const expandedToolbarItems = toolbarCompact.value
        ? (moreMenu ? [moreMenu] : [])
        : [...secondaryToolbarItems, ...(tableMenu ? [tableMenu] : []), ...(videoMenu ? [videoMenu] : [])];
      const visualModeToolbarItems = joinToolbarGroups(
        visualToolbarItems,
        expandedToolbarItems,
        compactToolbarItems as any[],
      );
      const activeToolbarItems = sourceMode.value ? sourceToolbarItems : visualModeToolbarItems;
      const toolbar = !isReadOnly && activeToolbarItems.length > 0 ? vueH(
        'div',
        {
          class: 'vef-tiptap__toolbar',
        },
        activeToolbarItems as any,
      ) : null;

      const editorBody = sourceMode.value
        ? vueH(VTextarea, {
          modelValue: sourceDraft.value,
          readonly: props.readonly,
          disabled: props.disabled,
          'onUpdate:modelValue': (value: string) => {
            sourceDraft.value = String(value || '');
          },
          autoGrow: false,
          rows: typeof props.height === 'number' ? Math.max(Math.round((props.height - toolbarHeight) / 24), 10) : 14,
          variant: 'plain',
          hideDetails: true,
          class: ['vef-tiptap__source'],
          style: {
            minHeight: contentMinHeight,
          },
        })
        : (instance ? [vueH(EditorContent as any, { editor: instance as any })] : []);

      return vueH(
        'div',
        {
          style: {
            width: '100%',
            maxWidth: '100%',
            minWidth: '0',
          },
        },
        [
          vueH(
            VSheet,
            {
              ref: rootEl,
              ...attrs,
              class: ['vef-tiptap', attrs.class],
              style: [
                attrs.style as any,
                {
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '0',
                  minHeight: height,
                },
              ],
              border: true,
              rounded: 'lg',
            },
            {
              default: () => [
                toolbar,
                vueH(
                  'div',
                  {
                    ref: hostEl,
                    class: ['vef-tiptap__host', sourceMode.value ? 'vef-tiptap__host--source' : ''],
                    style: {
                      width: '100%',
                      maxWidth: '100%',
                      minWidth: '0',
                      minHeight: contentMinHeight,
                    },
                  },
                  editorBody as any,
                ),
              ],
            },
          ),
          hasToolbarItem('fullscreen') ? vueH(
            VDialog,
            {
              modelValue: fullscreenDialog.value,
              'onUpdate:modelValue': (value: boolean) => {
                fullscreenDialog.value = value;
              },
              fullscreen: true,
            },
            {
              default: () => vueH(
                'div',
                {
                  class: 'vef-tiptap__fullscreen-shell',
                },
                [
                  vueH(TiptapHtmlEditor as any, {
                    modelValue: props.modelValue,
                    readonly: props.readonly,
                    disabled: props.disabled,
                    placeholder: props.placeholder,
                    height: 'calc(100vh - 32px)',
                    profile: props.profile,
                    toolbar: props.toolbar,
                    allowFullscreen: false,
                    'onUpdate:modelValue': (value: string) => emit('update:modelValue', value),
                  }),
                  vueH(VBtn, {
                    icon: 'mdi-close',
                    title: t('ve.editor.fullscreen.close', 'Close Fullscreen'),
                    class: ['vef-tiptap__fullscreen-close'],
                    onClick: () => {
                      fullscreenDialog.value = false;
                    },
                  }),
                ],
              ),
            },
          ) : null,
        ],
      );
    };
  },
});
