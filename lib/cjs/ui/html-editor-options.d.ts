export type HtmlEditorProfile = 'minimal' | 'standard' | 'full';
export type HtmlEditorToolbarItem = 'undo' | 'redo' | 'block' | 'align' | 'bold' | 'italic' | 'underline' | 'strike' | 'inlineCode' | 'bulletList' | 'orderedList' | 'taskList' | 'inlineFormula' | 'blockFormula' | 'link' | 'image' | 'video' | 'table' | 'clearFormatting' | 'horizontalRule' | 'source' | 'fullscreen';
export declare const htmlEditorToolbarProfiles: Readonly<Record<HtmlEditorProfile, readonly HtmlEditorToolbarItem[]>>;
export declare function resolveHtmlEditorToolbar(profile?: HtmlEditorProfile, toolbar?: readonly HtmlEditorToolbarItem[], allowFullscreen?: boolean): HtmlEditorToolbarItem[];
