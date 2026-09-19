export type HtmlEditorProfile = 'minimal'|'standard'|'full';

export type HtmlEditorToolbarItem =
  | 'undo'
  | 'redo'
  | 'block'
  | 'align'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'inlineCode'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'inlineFormula'
  | 'blockFormula'
  | 'link'
  | 'image'
  | 'video'
  | 'table'
  | 'clearFormatting'
  | 'horizontalRule'
  | 'source'
  | 'fullscreen';

const fullToolbar: readonly HtmlEditorToolbarItem[] = Object.freeze([
  'undo',
  'redo',
  'block',
  'align',
  'bold',
  'italic',
  'underline',
  'strike',
  'inlineCode',
  'bulletList',
  'orderedList',
  'taskList',
  'inlineFormula',
  'blockFormula',
  'link',
  'image',
  'video',
  'table',
  'clearFormatting',
  'horizontalRule',
  'source',
  'fullscreen',
]);

export const htmlEditorToolbarProfiles: Readonly<Record<HtmlEditorProfile, readonly HtmlEditorToolbarItem[]>> = Object.freeze({
  minimal: Object.freeze(['undo', 'redo', 'align', 'bold', 'italic'] as HtmlEditorToolbarItem[]),
  standard: Object.freeze([
    'undo',
    'redo',
    'block',
    'align',
    'bold',
    'italic',
    'underline',
    'bulletList',
    'orderedList',
    'link',
    'clearFormatting',
    'source',
    'fullscreen',
  ] as HtmlEditorToolbarItem[]),
  full: fullToolbar,
});

const supportedToolbarItems = new Set<HtmlEditorToolbarItem>(fullToolbar);

export function resolveHtmlEditorToolbar(
  profile: HtmlEditorProfile = 'full',
  toolbar?: readonly HtmlEditorToolbarItem[],
  allowFullscreen = true,
): HtmlEditorToolbarItem[] {
  const selected = toolbar ?? htmlEditorToolbarProfiles[profile] ?? htmlEditorToolbarProfiles.full;
  const resolved: HtmlEditorToolbarItem[] = [];
  const seen = new Set<HtmlEditorToolbarItem>();

  for (const item of selected) {
    if (!supportedToolbarItems.has(item) || seen.has(item) || (!allowFullscreen && item === 'fullscreen')) {
      continue;
    }

    seen.add(item);
    resolved.push(item);
  }

  return resolved;
}
