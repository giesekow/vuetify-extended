const fullToolbar = Object.freeze([
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
export const htmlEditorToolbarProfiles = Object.freeze({
    minimal: Object.freeze(['undo', 'redo', 'align', 'bold', 'italic']),
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
    ]),
    full: fullToolbar,
});
const supportedToolbarItems = new Set(fullToolbar);
export function resolveHtmlEditorToolbar(profile = 'full', toolbar, allowFullscreen = true) {
    var _a;
    const selected = (_a = toolbar !== null && toolbar !== void 0 ? toolbar : htmlEditorToolbarProfiles[profile]) !== null && _a !== void 0 ? _a : htmlEditorToolbarProfiles.full;
    const resolved = [];
    const seen = new Set();
    for (const item of selected) {
        if (!supportedToolbarItems.has(item) || seen.has(item) || (!allowFullscreen && item === 'fullscreen')) {
            continue;
        }
        seen.add(item);
        resolved.push(item);
    }
    return resolved;
}
