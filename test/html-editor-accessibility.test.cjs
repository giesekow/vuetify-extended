const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const editor = source('src/ui/tiptap-editor.ts');
const widget = source('src/ui/widgets/field-rich-widgets.ts');
const field = source('src/ui/field.ts');

assert.match(editor, /const accessibilityId = useId\(\)/, 'Each mounted editor needs unique description IDs.');
assert.match(editor, /role: 'textbox'/);
for (const name of ['aria-label', 'aria-multiline', 'aria-required', 'aria-readonly', 'aria-disabled', 'aria-invalid', 'aria-describedby']) {
  assert.ok(editor.includes(`'${name}'`), `${name} must reach the editable node.`);
}
assert.match(editor, /attributes: editorAttributes/);
assert.match(editor, /setOptions\(\{ editorProps: \{ attributes: editorAttributes \} \}\)/, 'ARIA state must react to prop changes.');
assert.match(editor, /'aria-label': params.title/g, 'Icon buttons need explicit translated names, not tooltips alone.');
assert.match(editor, /text: params.title,\s*'aria-label': params.title/, 'Tooltip wrappers need a name even before their content opens.');
assert.match(editor, /'aria-pressed': params.active === undefined \? undefined : String\(params.active\)/);
assert.match(widget, /label: field\.\$text\(field.params.value.label\)/);
assert.match(widget, /hint: field\.\$text\(field.params.value.hint\)/);
assert.match(widget, /errorMessage: field.htmlValidationMessage\?\.\(\)/);
assert.match(field, /value === this.modelValue.value/, 'Async errors must not attach to newer content.');
assert.match(field, /valueChanged[\s\S]*this.htmlValidationResult.value = undefined/);
assert.match(editor, /label: props.label,[\s\S]*hint: props.hint,[\s\S]*errorMessage: props.errorMessage/);
assert.match(editor, /onAfterLeave: restoreFullscreenFocus/, 'Fullscreen close must restore focus after the native transition.');
assert.match(editor, /fullscreenReturnFocus\?\.isConnected/, 'Do not focus a removed opener.');
console.log('HTML editor accessibility wiring contracts passed (rendered checks required separately).');
