const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fieldSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'field.ts'),
  'utf8',
);
const eventSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'lib.ts'),
  'utf8',
);

assert.match(
  fieldSource,
  /export type FieldValueOrigin = 'default'\|'master'\|'user'\|'programmatic'/,
  'Field lifecycle contexts must expose every supported value origin.',
);
assert.match(
  fieldSource,
  /changed\?: \(field: Field, context: FieldValueContext\) => void/,
  'FieldOptions.changed must receive the typed origin context as its second argument.',
);
assert.match(
  fieldSource,
  /initialized\?: \(field: Field, context: FieldValueContext\) => Promise<void>\|void/,
  'FieldOptions.initialized must support synchronous and asynchronous dependency initialization.',
);
assert.match(
  fieldSource,
  /this\.valueChanged\(value, 'user', previousValue\)/,
  'A component model update must be identified as user-originated.',
);
assert.match(
  fieldSource,
  /notifyChanged: this\.masterChangeAffectsValue\(event\)[\s\S]{0,100}origin: 'programmatic'/,
  'A direct Master path update must be identified as programmatic only when it affects the field.',
);
assert.match(
  fieldSource,
  /this\.synchronizeValue\(\{ initialize: true, origin: 'master' \}\)/,
  'Mounted fields must initialize dependencies after their effective value is synchronized.',
);
assert.match(
  fieldSource,
  /origin: applyingDefault \? 'default' : \(options\.origin \|\| 'master'\)/,
  'Default application and existing Master hydration must have distinct initialization origins.',
);
assert.match(
  fieldSource,
  /if \(this\.initialized && !force\) \{\s*return;\s*\}/,
  'Initialization must run once per mounted Field instance unless a reset forces a new cycle.',
);
assert.match(
  fieldSource,
  /this\.synchronizeValue\(\{ initialize: true, origin: 'master' \}, true\)/,
  'A Master reset must force a new initialization cycle for the mounted field.',
);
assert.match(
  fieldSource,
  /await nextTick\(\)[\s\S]{0,160}this\.options\.initialized\(this, context\)/,
  'Initialization must wait until sibling fields and Master listeners have mounted.',
);
assert.match(
  fieldSource,
  /this\.handleOn\('changed', context\.value, context\)/,
  'The changed event must retain its value argument and append the origin context.',
);
assert.match(
  eventSource,
  /emit \(name: string, \.\.\.args: any\[\]\)/,
  'UI events must support the additional context argument without replacing existing payloads.',
);

console.log('Field initialization and value-origin lifecycle contracts passed.');
