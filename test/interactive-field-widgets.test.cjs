const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  createFieldPaginationEvent,
  normalizeFieldPaginationValue,
  updateFieldPaginationValue,
} = require('../lib/cjs/ui/widgets/field-pagination-state.js');

const normalized = normalizeFieldPaginationValue(
  { page: 3, limit: 10, total: 43 },
  { page: 1, limit: 5, total: 0 },
);
assert.deepEqual(normalized, { page: 3, limit: 10, total: 43 });

assert.deepEqual(
  normalizeFieldPaginationValue({ page: 9, limit: 20, total: 43 }),
  { page: 3, limit: 20, total: 43 },
  'Pagination state must clamp the page after an API total or page-size change.',
);
assert.deepEqual(
  normalizeFieldPaginationValue(undefined, { page: 2, limit: 5, total: 12 }),
  { page: 2, limit: 5, total: 12 },
  'Field params must provide pagination defaults when no model value is bound.',
);
assert.deepEqual(
  normalizeFieldPaginationValue({ page: 4, itemsPerPage: '3', total: '0' }),
  { page: 1, limit: 3, total: 0 },
  'Pagination normalization must produce canonical numbers and clamp empty datasets to page one.',
);
assert.deepEqual(
  updateFieldPaginationValue({ page: 4, limit: 5, total: 43 }, { limit: 20 }, 'limit'),
  { page: 1, limit: 20, total: 43 },
  'Changing items per page must reset pagination to page one.',
);
assert.deepEqual(
  updateFieldPaginationValue({ page: 4, limit: 10, total: 43 }, { total: 12 }, 'programmatic'),
  { page: 2, limit: 10, total: 12 },
  'A lower API total must clamp the current page without changing the page size.',
);

const pageEvent = createFieldPaginationEvent(
  normalized,
  { page: 2, limit: 10, total: 43 },
  'page',
);
assert.equal(pageEvent.skip, 20);
assert.equal(pageEvent.start, 21);
assert.equal(pageEvent.end, 30);
assert.equal(pageEvent.pageCount, 5);

const fieldSource = fs.readFileSync(path.resolve(__dirname, '../src/ui/field.ts'), 'utf8');
const paginationWidgetSource = fs.readFileSync(
  path.resolve(__dirname, '../src/ui/widgets/field-pagination-widget.ts'),
  'utf8',
);
const cssSource = fs.readFileSync(path.resolve(__dirname, '../src/css/index.css'), 'utf8');

assert.match(fieldSource, /case 'pagination':\s*return this\.buildPagination/,
  'The pagination Field type must be routed to its first-class widget.');
assert.match(fieldSource, /updateFieldPaginationValue\(previousValue, value, reason\)/,
  'Field.setPagination must use the behaviorally tested pagination transition helper.');
assert.match(fieldSource, /this\.setModelValueAndSync\(nextValue, options\.origin \|\| 'programmatic'\)/,
  'Notified pagination changes must update Field and Master state before callbacks.');
assert.match(fieldSource, /this\.params\.value\.type === 'pagination'[\s\S]{0,100}this\.normalizePaginationValue\(value\)/,
  'Pagination defaults and Master values must normalize to the canonical numeric storage shape.');
assert.match(fieldSource, /this\.params\.value\.type === 'pagination'[\s\S]{0,500}normalizedLeft\.page === normalizedRight\.page/,
  'Equivalent pagination objects must not produce spurious changed callbacks.');
assert.match(fieldSource, /if \(this\.options\.paginationChanged\)[\s\S]*this\.handleOn\('paginationChanged', event\)/,
  'Pagination must support both callback and EventEmitter handling.');
assert.match(fieldSource, /onClick: \(event: Event\) => this\.dispatchHtmlViewEvent\(event, 'click'\)/,
  'HTML view must use delegated click handling rather than inline JavaScript.');
assert.match(fieldSource, /this\.handleOn\(`html:\$\{name\}`, event\)/,
  'HTML view must emit a named Field event.');
assert.match(fieldSource, /report\.emit\(`field:html:\$\{name\}`, event\)/,
  'HTML view events must bubble to the parent Report with a namespaced event.');
assert.match(paginationWidgetSource, /field\.setPagination\(\{ limit \}, \{ notify: true, origin: 'user', reason: 'limit' \}\)/,
  'Items-per-page controls must use the user pagination lifecycle.');
assert.match(paginationWidgetSource, /params\.readonly === true \|\| params\.paginationLoading === true/,
  'Display-mode forms must remain pageable unless pagination is explicitly readonly or loading.');
assert.match(paginationWidgetSource, /'aria-live': 'polite'/,
  'Pagination range and page changes must be announced to assistive technology.');
assert.match(cssSource, /\.vef-pagination[\s\S]*rgb\(var\(--v-theme-surface\)\)/,
  'Pagination surfaces must follow Vuetify theme tokens.');
assert.match(cssSource, /rgba\(var\(--v-border-color\), var\(--v-border-opacity\)\)/,
  'Pagination outlines must follow Vuetify border tokens.');

console.log('Interactive pagination and HTML-view Field contracts passed.');
