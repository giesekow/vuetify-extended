const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fieldSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'field.ts'),
  'utf8',
);

const immediateSyncStart = fieldSource.indexOf('private setModelValueAndSync(value: any)');
const modelBindingStart = fieldSource.indexOf('private modelBinding()', immediateSyncStart);
assert.notEqual(immediateSyncStart, -1, 'Field must provide an immediate model-to-Master synchronization path.');
assert.notEqual(modelBindingStart, -1, 'Unable to locate the end of the immediate synchronization method.');

const immediateSyncSource = fieldSource.slice(immediateSyncStart, modelBindingStart);
const localUpdateIndex = immediateSyncSource.indexOf('this.modelValue.value = value;');
const masterUpdateIndex = immediateSyncSource.indexOf('this.valueChanged(value);');
assert.ok(localUpdateIndex >= 0, 'Immediate synchronization must update the field model.');
assert.ok(masterUpdateIndex > localUpdateIndex, 'The field model must update before the value is committed to Master.');

const datetimeStart = fieldSource.indexOf('buildDatetime(props: any, context: any)');
const passwordStart = fieldSource.indexOf('buildPassword(props: any, context: any)', datetimeStart);
assert.notEqual(datetimeStart, -1, 'Unable to locate the datetime field builder.');
assert.notEqual(passwordStart, -1, 'Unable to locate the end of the datetime field builder.');
assert.match(
  fieldSource.slice(datetimeStart, passwordStart),
  /this\.setModelValueAndSync\(value\)/,
  'Datetime updates must use the immediate model-to-Master synchronization path.',
);

assert.match(
  fieldSource,
  /if \(this\.consumeImmediateModelSync\(\)\) \{\s*return;\s*\}/,
  'The normal model watcher must suppress the duplicate callback after an immediate datetime synchronization.',
);

console.log('Datetime field immediate Master synchronization contract passed.');
