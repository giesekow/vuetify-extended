const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { resolveUITableHeaders } = require('../lib/cjs/ui/table-header.js');

const descriptor = { key: 'orders.headers.status', fallback: 'Status' };
const headers = [
  { title: 'Name', key: 'name', sortable: false },
  {
    title: { key: 'orders.headers.details', fallback: 'Details' },
    align: 'center',
    children: [
      { title: descriptor, key: 'status', width: 120 },
      { title: () => 'Dynamic total', key: 'total' },
    ],
  },
];

const resolved = resolveUITableHeaders(headers, (value) => {
  if (typeof value === 'string') return value;
  if (typeof value === 'function') return value();
  return `translated:${value.key}`;
});

assert.equal(resolved[0].title, 'Name', 'Plain string titles must remain unchanged.');
assert.equal(resolved[1].title, 'translated:orders.headers.details', 'UIText descriptors must resolve.');
assert.equal(resolved[1].children[0].title, 'translated:orders.headers.status', 'Nested titles must resolve recursively.');
assert.equal(resolved[1].children[1].title, 'Dynamic total', 'Callback titles must resolve.');
assert.equal(resolved[0].sortable, false, 'Arbitrary Vuetify header properties must be preserved.');
assert.equal(resolved[1].children[0].width, 120, 'Nested header properties must be preserved.');
assert.notEqual(resolved, headers, 'The resolved header array must be cloned.');
assert.notEqual(resolved[1], headers[1], 'Each header must be cloned.');
assert.notEqual(resolved[1].children, headers[1].children, 'Nested arrays must be cloned.');
assert.equal(headers[1].title.fallback, 'Details', 'Resolving must not mutate application headers.');
assert.equal(headers[1].children[0].title, descriptor, 'Resolving must retain the original nested descriptor.');

const fieldSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/field.ts'), 'utf8');
const tableWidgetSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/widgets/field-table-widgets.ts'), 'utf8');
const triggerSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/trigger.ts'), 'utf8');
const dashboardSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/dashboard.ts'), 'utf8');
const uiIndexSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/index.ts'), 'utf8');

assert.match(fieldSource, /headers\?: \(field: Field\).*UITableHeader\[\]/, 'FieldOptions.headers must expose UITableHeader.');
assert.match(fieldSource, /resolveUITableHeaders\(\s*this\.collectionHeaders/, 'Nested collection headers must resolve UIText.');
assert.match(fieldSource, /resolveUITableHeaders\(\s*this\.autocompleteTableHeaders\.value/, 'Autocomplete table headers must resolve recursively.');
assert.match(fieldSource, /if \(header\.children\?\.length\)[\s\S]{0,80}addColumns\(header\.children\)/, 'Nested HTML columns must register their item slots.');
assert.match(tableWidgetSource, /const headers = resolvedTableHeaders\(field\)/, 'All Field table widgets must use resolved headers.');
assert.match(tableWidgetSource, /field\.\$text\(col\.title\)/, 'Report-table titles must resolve UIText at render time.');
assert.doesNotMatch(tableWidgetSource, /item\.colspan\s*=/, 'Report-table layout must not mutate application-owned headers.');
assert.match(triggerSource, /headers: resolveUITableHeaders\(this\.computedHeaders\.value/, 'Trigger result headers must resolve UIText.');
assert.match(dashboardSource, /this\.\$text\(column\.title\)/, 'Dashboard table headers must resolve UIText.');
assert.match(uiIndexSource, /export \* from '\.\/table-header'/, 'UITableHeader must be publicly exported.');

console.log('Table header localization contracts passed.');
