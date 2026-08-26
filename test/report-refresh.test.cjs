const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const reportSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'report.ts'),
  'utf8',
);

assert.match(
  reportSource,
  /export interface ReportRefreshOptions \{\s*progress\?: boolean;\s*\}/,
  'Report.refresh() must expose optional progress that defaults to disabled.',
);

const refreshStart = reportSource.indexOf('  async refresh(options: ReportRefreshOptions = {})');
const savedStart = reportSource.indexOf('  async saved()', refreshStart);
assert.notEqual(refreshStart, -1, 'Unable to locate Report.refresh().');
assert.notEqual(savedStart, -1, 'Unable to locate the end of Report.refresh().');

const refreshSource = reportSource.slice(refreshStart, savedStart);
const loadIndex = refreshSource.indexOf('await this.loadObject()');
const renderIndex = refreshSource.indexOf('this.forceRender()');
assert.ok(loadIndex >= 0 && loadIndex < renderIndex,
  'Report.refresh() must reload through the Report lifecycle before rerendering.');
assert.match(
  refreshSource,
  /this\.refreshPromise \|\|/,
  'Overlapping refresh calls must share the current API reload.',
);
assert.match(
  refreshSource,
  /if \(options\.progress\) \{\s*Dialogs\.\$showProgress\(\{\}\);\s*\}/,
  'Progress must only be displayed when explicitly requested.',
);
assert.match(
  refreshSource,
  /finally \{[\s\S]*if \(options\.progress\) \{\s*Dialogs\.\$hideProgress\(\);\s*\}/,
  'Requested progress must always be closed from the refresh finally block.',
);

console.log('Report refresh lifecycle contracts passed.');
