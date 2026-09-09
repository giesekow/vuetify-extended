const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fieldSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'field.ts'),
  'utf8',
);
const formSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'form.ts'),
  'utf8',
);

const updateValueStart = fieldSource.indexOf('\n  private synchronizeValue(');
const renderMathStart = fieldSource.indexOf('private renderMathInHtml', updateValueStart);
assert.notEqual(updateValueStart, -1, 'Unable to locate Field.synchronizeValue().');
assert.notEqual(renderMathStart, -1, 'Unable to locate the end of Field.synchronizeValue().');

const updateValueSource = fieldSource.slice(updateValueStart, renderMathStart);
assert.match(
  updateValueSource,
  /this\.setModelValueFromMaster\(currentValue\)/,
  'Master/default hydration must use the non-user model synchronization path.',
);
assert.doesNotMatch(
  updateValueSource,
  /this\.modelValue\.value\s*=\s*(value|currentValue)/,
  'Field synchronization must not assign modelValue directly and accidentally emit a user change.',
);

const modelBindingStart = fieldSource.indexOf('private modelBinding()');
const componentOptionsStart = fieldSource.indexOf('private componentOptions()', modelBindingStart);
assert.notEqual(modelBindingStart, -1, 'Unable to locate Field.modelBinding().');
assert.notEqual(componentOptionsStart, -1, 'Unable to locate the end of Field.modelBinding().');

const modelBindingSource = fieldSource.slice(modelBindingStart, componentOptionsStart);
assert.match(
  modelBindingSource,
  /this\.selectionValuesEqual\(this\.modelValue\.value, value\)/,
  'Select and autocomplete reconciliation must compare semantic selection values.',
);
assert.match(
  modelBindingSource,
  /this\.modelValue\.value\s*=\s*value/,
  'A genuine user model update must still update the Field model.',
);
assert.match(
  fieldSource,
  /modelChanged = !this\.modelValuesEqual\(this\.modelValue\.value, currentValue\)/,
  'Master synchronization must use semantic select/autocomplete equality before reporting a programmatic change.',
);
assert.match(
  fieldSource,
  /this\.params\.value\.multiple[\s\S]{0,100}\? \[\] : left/,
  'Multiple select and autocomplete fields must treat nullish and empty-array values as the same empty selection.',
);

const setupStart = fieldSource.indexOf('setup(props: any, context: any)');
const handledSyncStart = fieldSource.indexOf('private consumeHandledModelSync()', setupStart);
assert.notEqual(setupStart, -1, 'Unable to locate Field.setup().');
assert.notEqual(handledSyncStart, -1, 'Unable to locate the end of Field.setup().');

const setupSource = fieldSource.slice(setupStart, handledSyncStart);
const assetSyncIndex = setupSource.indexOf('this.syncResolvedAssets()');
const autocompleteSyncIndex = setupSource.indexOf('this.syncAutocompleteSelectionDisplay()');
const consumeHandledIndex = setupSource.indexOf('this.consumeHandledModelSync()');
const changedIndex = setupSource.indexOf("this.valueChanged(value, 'user', previousValue)");
assert.ok(assetSyncIndex >= 0 && assetSyncIndex < consumeHandledIndex,
  'Master hydration must still refresh resolved asset display data before suppressing the user-change callback.');
assert.ok(autocompleteSyncIndex >= 0 && autocompleteSyncIndex < consumeHandledIndex,
  'Master hydration must refresh default and table autocomplete selections before suppressing the user-change callback.');
assert.ok(consumeHandledIndex >= 0 && consumeHandledIndex < changedIndex,
  'Only user-change propagation should be skipped for an already handled model synchronization.');

const validationSummaryStart = formSource.indexOf('private setValidationSummary(');
const requiredSummaryStart = formSource.indexOf('private collectRequiredFieldSummary', validationSummaryStart);
assert.notEqual(validationSummaryStart, -1, 'Unable to locate Form validation-summary handling.');
assert.notEqual(requiredSummaryStart, -1, 'Unable to locate the end of Form validation-summary handling.');

const validationSummarySource = formSource.slice(validationSummaryStart, requiredSummaryStart);
assert.match(
  validationSummarySource,
  /this\.validationSummary\.value\.every\(/,
  'Form must compare validation-summary contents before replacing the reactive array.',
);
assert.match(
  validationSummarySource,
  /if \(this\.validationSummary\.value\.length === 0\) \{\s*return;\s*\}/,
  'Clearing an already-empty validation summary must be a no-op.',
);

console.log('Field user-change origin and pre-confirm Form validation contracts passed.');
