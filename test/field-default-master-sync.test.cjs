const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fieldSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'field.ts'),
  'utf8',
);

const updateValueStart = fieldSource.indexOf('\n  private synchronizeValue(');
const renderMathStart = fieldSource.indexOf('private renderMathInHtml', updateValueStart);
assert.notEqual(updateValueStart, -1, 'Unable to locate Field.synchronizeValue().');
assert.notEqual(renderMathStart, -1, 'Unable to locate the end of Field.synchronizeValue().');

const updateValueSource = fieldSource.slice(updateValueStart, renderMathStart);
assert.match(
  updateValueSource,
  /const storedValue = this\.\$master\.\$get\(this\.params\.value\.storage\)/,
  'Default resolution must first inspect the actual stored Master value.',
);
assert.match(
  updateValueSource,
  /applyingDefault = storedValue === undefined && this\.hasDefaultValue\(\)/,
  'A default must only be applied when the Master path has no value.',
);
assert.match(
  updateValueSource,
  /this\.\$master\.\$set\(this\.params\.value\.storage, this\.postprocess\(currentValue\)\)/,
  'A FieldParams.default or FieldOptions.default value must be normalized and stored in Master.',
);
assert.match(
  updateValueSource,
  /this\.preprocess\(applyingDefault \? this\.resolveDefaultValue\(\) : storedValue\)/,
  'Static and dynamic defaults must use the same UI preprocessing path.',
);

const resolveDefaultStart = fieldSource.indexOf('private resolveDefaultValue()');
assert.notEqual(resolveDefaultStart, -1, 'Unable to locate Field.resolveDefaultValue().');
const resolveDefaultSource = fieldSource.slice(resolveDefaultStart, updateValueStart);
assert.match(
  resolveDefaultSource,
  /this\.params\.value\.default !== undefined/,
  'FieldParams.default must take precedence, including false, zero, empty-string, and null defaults.',
);
assert.match(
  resolveDefaultSource,
  /this\.options\.default \? this\.options\.default\(this\) : undefined/,
  'FieldOptions.default must remain available as the dynamic fallback.',
);

assert.doesNotMatch(
  updateValueSource,
  /this\.valueChanged\(/,
  'Applying an initialization default must not masquerade as a user-originated change.',
);

console.log('Field static and dynamic default-to-Master synchronization contracts passed.');
