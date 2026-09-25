const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  htmlEditorToolbarProfiles,
  resolveHtmlEditorToolbar,
} = require('../lib/cjs/ui/html-editor-options.js');

assert.equal(Object.isFrozen(htmlEditorToolbarProfiles), true);
assert.equal(Object.isFrozen(htmlEditorToolbarProfiles.full), true);
assert.deepEqual(
  resolveHtmlEditorToolbar('minimal'),
  ['undo', 'redo', 'align', 'bold', 'italic'],
  'The minimal profile must remain intentionally small.',
);
assert.ok(htmlEditorToolbarProfiles.standard.includes('source'));
assert.ok(!htmlEditorToolbarProfiles.standard.includes('table'));
assert.ok(htmlEditorToolbarProfiles.full.includes('table'));
assert.ok(htmlEditorToolbarProfiles.full.includes('fullscreen'));

assert.deepEqual(
  resolveHtmlEditorToolbar('full', ['bold', 'italic', 'align']),
  ['bold', 'italic', 'align'],
  'An explicit toolbar must replace, rather than extend, the selected profile.',
);
assert.deepEqual(
  resolveHtmlEditorToolbar('full', ['bold', 'bold', 'unsupported']),
  ['bold'],
  'Runtime toolbar input must discard duplicates and unsupported controls.',
);
assert.ok(
  !resolveHtmlEditorToolbar('full', undefined, false).includes('fullscreen'),
  'Disabling fullscreen must override the profile.',
);

const fieldSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/field.ts'), 'utf8');
const richWidgetSource = fs.readFileSync(
  path.resolve(__dirname, '../src/ui/widgets/field-rich-widgets.ts'),
  'utf8',
);
const editorSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/tiptap-editor.ts'), 'utf8');

assert.match(fieldSource, /htmlProfile\?: HtmlEditorProfile/);
assert.match(fieldSource, /htmlToolbar\?: HtmlEditorToolbarItem\[\]/);
assert.match(fieldSource, /htmlFullscreen\?: boolean/);
assert.match(richWidgetSource, /showFullscreen \? \[editor, fullscreenBtn\] : \[editor\]/,
  'The field-level fullscreen preview must follow the resolved toolbar configuration.');
assert.match(editorSource, /toolbarCompact\.value[\s\S]*moreMenu/,
  'Compact toolbar rendering must use the filtered overflow menu.');
assert.match(editorSource, /profile: props\.profile,[\s\S]*toolbar: props\.toolbar,[\s\S]*allowFullscreen: false/,
  'The fullscreen editor must preserve the parent toolbar configuration.');
assert.match(editorSource, /event\.key === 'F11' && hasToolbarItem\('fullscreen'\)/,
  'F11 must not reopen fullscreen when fullscreen is disabled or omitted.');

console.log('HTML editor toolbar profiles, overrides, and fullscreen contracts passed.');

// Run the real resize callback: height-only observations must not render again.
const vm = require('node:vm');
const ts = require('typescript');
const start = editorSource.indexOf('    const syncToolbarMode = () => {');
const end = editorSource.indexOf('    const createIconButton', start);
let width = 390, refreshes = 0;
const context = {
  getRootElement: () => ({ clientWidth: width }),
  toolbarCompact: { value: false },
  refreshToolbar: () => refreshes++,
};
vm.runInNewContext(ts.transpileModule(editorSource.slice(start, end) + '\nglobalThis.sync = syncToolbarMode;', {
  compilerOptions: { target: ts.ScriptTarget.ES2020 },
}).outputText, context);
context.sync();
assert.equal(context.toolbarCompact.value, true);
assert.equal(refreshes, 1);
context.sync(); context.sync();
assert.equal(refreshes, 1, 'unchanged width/height-only delivery must not cause another toolbar render');
width = 1280; context.sync();
assert.equal(context.toolbarCompact.value, false);
assert.equal(refreshes, 2, 'expanding changes mode once');
width = 390; context.sync(); context.sync();
assert.equal(context.toolbarCompact.value, true);
assert.equal(refreshes, 3, 'shrinking changes mode once');
console.log('Editor responsive mode and idempotent resize delivery passed.');
