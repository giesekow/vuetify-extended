const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  appendUniqueAutocompleteValue,
  removeAutocompleteValuesAtIndexes,
} = require('../lib/cjs/ui/widgets/field-autocomplete-table-state.js');

const equalsById = (left, right) => String(left?._id ?? left) === String(right?._id ?? right);
assert.deepEqual(
  appendUniqueAutocompleteValue(['person-1'], 'person-2', equalsById),
  { values: ['person-1', 'person-2'], added: true },
  'Adding a new table-autocomplete value must preserve order and append once.',
);
assert.deepEqual(
  appendUniqueAutocompleteValue(['person-1'], { _id: 'person-1', name: 'Ada' }, equalsById),
  { values: ['person-1'], added: false },
  'Duplicate ids must not be appended even when the candidate is an object.',
);
assert.deepEqual(
  removeAutocompleteValuesAtIndexes(['a', 'b', 'c', 'd'], [1, 3]),
  ['a', 'c'],
  'Batch removal must retain unselected values in their original order.',
);

const fieldSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/field.ts'), 'utf8');
const cssSource = fs.readFileSync(path.resolve(__dirname, '../src/css/index.css'), 'utf8');
const tableBuildStart = fieldSource.indexOf('  buildAutocompleteTable(');
const tableBuildEnd = fieldSource.indexOf('\n  private richWidgetContext()', tableBuildStart);
const tableBuildSource = fieldSource.slice(tableBuildStart, tableBuildEnd);
const addStart = fieldSource.indexOf('  private async addAutocompleteTableItem()');
const removeStart = fieldSource.indexOf('  private async removeAutocompleteTableItems()', addStart);
const searchStart = fieldSource.indexOf('  private async applyServerAutocompleteSearch(', removeStart);
const addSource = fieldSource.slice(addStart, removeStart);
const removeSource = fieldSource.slice(removeStart, searchStart);

assert.notEqual(tableBuildStart, -1, 'Unable to locate Field.buildAutocompleteTable().');
assert.match(
  fieldSource,
  /autocompleteFormat === 'table'[\s\S]{0,100}multiple === true/,
  'Table presentation must be opt-in and limited to multiple autocomplete fields.',
);
assert.match(
  fieldSource,
  /missingValues[\s\S]*autocompleteResolveValue\(this, missingValues, \{\}\)/,
  'Initial id hydration must resolve only values missing from local and cached options.',
);
assert.match(
  fieldSource,
  /const orderedItems = storedValues\.map\([\s\S]{0,220}autocompleteTableFallbackItem\(value\)/,
  'Hydration must preserve stored order and keep unresolved values visible.',
);
assert.match(
  fieldSource,
  /const formattedItems = this\.format\(items\)/,
  'FieldOptions.format must receive hydrated selected objects before table rendering.',
);
assert.match(
  fieldSource,
  /this\.options\.canRemoveItem[\s\S]{0,160}source\.item/,
  'Bulk removal must run canRemoveItem against each hydrated selected object.',
);
assert.equal(
  (addSource.match(/setModelValueAndSync\(/g) || []).length,
  1,
  'Add must commit to Field and Master exactly once.',
);
assert.equal(
  (removeSource.match(/setModelValueAndSync\(/g) || []).length,
  1,
  'Bulk remove must commit to Field and Master exactly once.',
);
assert.match(
  tableBuildSource,
  /showSelect: allowRemove/,
  'Editable table rows must use Vuetify checkbox selection for bulk removal.',
);
assert.match(
  tableBuildSource,
  /rules: tableRules/,
  'Required validation must be attached to the actual selected-value state rather than the staged candidate.',
);
assert.match(
  tableBuildSource,
  /autocompleteSlots\.append = \(\) => h\([\s\S]{0,500}'mdi-plus'/,
  'The Add action must use the autocomplete append slot and a compact plus icon button.',
);
assert.doesNotMatch(
  tableBuildSource,
  /vef-autocomplete-table__add-column/,
  'The Add action must not reserve a separate responsive grid column.',
);
assert.doesNotMatch(
  tableBuildSource,
  /title:\s*['"]Action['"]/,
  'The table presentation must not inject an automatic action column.',
);
assert.match(
  cssSource,
  /\.vef-autocomplete-table__surface[\s\S]*rgb\(var\(--v-theme-surface\)\)/,
  'The selected-items table surface must follow Vuetify theme tokens.',
);

console.log('Autocomplete table presentation contracts passed.');
