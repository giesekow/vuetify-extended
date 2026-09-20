const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const source = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');

function sourceFunction(file, name) {
  const input = source(file);
  const ast = ts.createSourceFile(file, input, ts.ScriptTarget.Latest, true);
  const declaration = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert.ok(declaration, `Expected ${name} in ${file}`);
  const js = ts.transpileModule(`${declaration.getText(ast)}\n${name};`, {}).outputText;
  return vm.runInNewContext(js);
}

function sourceClass(file, names) {
  const input = source(file);
  const ast = ts.createSourceFile(file, input, ts.ScriptTarget.Latest, true);
  const declaration = ast.statements.find(node => ts.isClassDeclaration(node));
  const methods = declaration.members
    .filter(node => names.includes(node.name?.getText(ast)))
    .map(node => node.getText(ast));
  assert.equal(methods.length, names.length);
  const js = ts.transpileModule(`class Subject {${methods.join('\n')}}\nSubject;`, {}).outputText;
  return vm.runInNewContext(js);
}

(async () => {
const buildAttributes = sourceFunction('src/ui/tiptap-editor.ts', 'buildEditorAccessibilityAttributes');
const attributes = buildAttributes({
  name: 'Case notes',
  hint: 'Describe the decision',
  hintId: 'editor-hint',
  errorMessage: 'Notes are required',
  errorId: 'editor-error',
  required: true,
  readonly: false,
  disabled: false,
});
assert.deepEqual(JSON.parse(JSON.stringify(attributes)), {
  class: 'vef-tiptap__content ProseMirror',
  role: 'textbox',
  'aria-label': 'Case notes',
  'aria-multiline': 'true',
  'aria-required': 'true',
  'aria-readonly': 'false',
  'aria-disabled': 'false',
  'aria-invalid': 'true',
  'aria-describedby': 'editor-hint editor-error',
  tabindex: '0',
});
assert.equal(buildAttributes({
  name: 'Content',
  hint: '',
  hintId: 'unused-hint',
  errorMessage: '',
  errorId: 'unused-error',
  required: false,
  readonly: true,
  disabled: true,
})['aria-describedby'], '');

const mergeAttributes = sourceFunction('src/ui/tiptap-editor.ts', 'withEditorAccessibilityAttributes');
const keydown = () => true;
const existingEditorProps = {
  handleDOMEvents: { keydown },
  transformPastedHTML: value => value,
  attributes: { class: 'old' },
};
const nextAttributes = () => ({ 'aria-label': 'Updated name' });
const mergedEditorProps = mergeAttributes(existingEditorProps, nextAttributes);
assert.equal(mergedEditorProps.handleDOMEvents.keydown, keydown,
  'Reactive ARIA updates must retain editor and form keyboard handling.');
assert.equal(mergedEditorProps.transformPastedHTML, existingEditorProps.transformPastedHTML);
assert.equal(mergedEditorProps.attributes, nextAttributes);
assert.notEqual(mergedEditorProps, existingEditorProps);

const Field = sourceClass('src/ui/field.ts', ['validate', 'valueChanged']);
const field = new Field();
field.params = { value: { invisible: false, type: 'html' } };
field.modelValue = { value: '<p>Initial</p>' };
field.htmlValidationResult = { value: undefined };
field.htmlValidationVersion = 0;
field.changing = false;
field.options = {};
field.postprocess = value => value;
field.renderLatex = async () => {};
field.notifyChanged = () => {};
field.eventValue = value => value;

field.options.validate = async () => 'Initial error';
await field.validate();
assert.equal(field.htmlValidationResult.value, 'Initial error');

field.modelValue.value = '<p>Edited</p>';
field.valueChanged(field.modelValue.value, 'user', '<p>Initial</p>');
assert.equal(field.htmlValidationResult.value, undefined, 'Editing must clear the displayed validation error.');

const pendingResolvers = [];
field.options.validate = () => new Promise(resolve => pendingResolvers.push(resolve));
const olderValidation = field.validate();
const newerValidation = field.validate();
pendingResolvers[1](undefined);
await newerValidation;
pendingResolvers[0]('Stale error');
await olderValidation;
assert.equal(field.htmlValidationResult.value, undefined,
  'An older validation must not overwrite the latest result for the same content.');

const editResolvers = [];
field.options.validate = () => new Promise(resolve => editResolvers.push(resolve));
const validationBeforeEdit = field.validate();
field.modelValue.value = '<p>Edited again</p>';
field.valueChanged(field.modelValue.value, 'user', '<p>Edited</p>');
editResolvers[0]('Error for previous content');
await validationBeforeEdit;
assert.equal(field.htmlValidationResult.value, undefined,
  'A validation started before an edit must not attach its error to the new content.');

const editor = source('src/ui/tiptap-editor.ts');
const widget = source('src/ui/widgets/field-rich-widgets.ts');
assert.match(editor, /const accessibilityId = useId\(\)/, 'Each mounted editor needs unique description IDs.');
assert.match(editor, /attributes: editorAttributes/);
assert.match(editor, /withEditorAccessibilityAttributes\(instance\.options\.editorProps, editorAttributes\)/);
assert.match(editor, /'aria-label': params.title/g, 'Icon buttons need explicit translated names.');
assert.match(editor, /'aria-pressed': params.active === undefined \? undefined : String\(params.active\)/);
assert.match(widget, /label: field\.\$text\(field.params.value.label\)/);
assert.match(widget, /hint: field\.\$text\(field.params.value.hint\)/);
assert.match(widget, /errorMessage: field.htmlValidationMessage\?\.\(\)/);
assert.match(editor, /label: props.label,[\s\S]*hint: props.hint,[\s\S]*errorMessage: props.errorMessage/);
assert.match(editor, /onAfterLeave: restoreFullscreenFocus/, 'Fullscreen close must restore focus after transition.');
assert.match(editor, /fullscreenReturnFocus\?\.isConnected/, 'Do not focus a removed opener.');

console.log('HTML editor accessibility, keyboard preservation, and validation-race contracts passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
