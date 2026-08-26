const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const readSource = (name) => fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', name),
  'utf8',
);

const dashboardSource = readSource('dashboard.ts');
assert.match(
  dashboardSource,
  /export interface DashboardRefreshOptions \{\s*progress\?: boolean;\s*\}/,
  'Dashboard.refresh() must expose optional progress.',
);

const dashboardRefreshStart = dashboardSource.indexOf('  async refresh(options: DashboardRefreshOptions = {})');
const dashboardChildrenStart = dashboardSource.indexOf('  private resolveDashboardChildren', dashboardRefreshStart);
assert.notEqual(dashboardRefreshStart, -1, 'Unable to locate Dashboard.refresh().');
assert.notEqual(dashboardChildrenStart, -1, 'Unable to locate the end of Dashboard.refresh().');
const dashboardRefresh = dashboardSource.slice(dashboardRefreshStart, dashboardChildrenStart);
assert.match(dashboardRefresh, /await \(child as any\)\.refresh\?\.\(\)/,
  'Dashboard.refresh() must cascade into existing child widgets.');
assert.match(dashboardRefresh, /await this\.loadDashboardMenuItems\(true\)/,
  'Dashboard.refresh() must force-reload cached header menu definitions.');
assert.match(dashboardRefresh, /this\.refreshPromise \|\|/,
  'Overlapping Dashboard refresh calls must share one operation.');
assert.match(dashboardRefresh, /if \(options\.progress\)[\s\S]*Dialogs\.\$showProgress/,
  'Dashboard progress must be opt-in.');
assert.match(dashboardRefresh, /finally \{[\s\S]*Dialogs\.\$hideProgress/,
  'Dashboard progress must close from finally.');
assert.match(dashboardSource, /await this\.refresh\(\{ progress: true \}\)/,
  'The built-in Dashboard refresh action must use the shared progress option.');

const triggerSource = readSource('trigger.ts');
assert.match(
  triggerSource,
  /export interface TriggerRefreshOptions \{\s*progress\?: boolean;\s*\}/,
  'Trigger.refresh() must expose optional progress.',
);

const triggerRefreshStart = triggerSource.indexOf('  async refresh(options: TriggerRefreshOptions = {})');
const triggerRenderStart = triggerSource.indexOf('  render(props: any, context: any)', triggerRefreshStart);
assert.notEqual(triggerRefreshStart, -1, 'Unable to locate Trigger.refresh().');
assert.notEqual(triggerRenderStart, -1, 'Unable to locate the end of Trigger.refresh().');
const triggerRefresh = triggerSource.slice(triggerRefreshStart, triggerRenderStart);
assert.match(triggerRefresh, /await this\.initialize\(\)/,
  'Trigger.refresh() must refresh access, headers, and search-field configuration.');
assert.match(triggerRefresh, /await this\.refreshResults\(\)/,
  'Trigger.refresh() must delegate current table loading to refreshResults().');
assert.doesNotMatch(triggerRefresh, /await this\.loadItems\(/,
  'Trigger.refresh() must not duplicate the result-only loading implementation.');
assert.match(triggerRefresh, /this\.forceRender\(\)/,
  'Trigger.refresh() must rerender side and action buttons.');
assert.match(triggerRefresh, /this\.refreshPromise \|\|/,
  'Overlapping Trigger refresh calls must share one operation.');
assert.match(triggerRefresh, /finally \{[\s\S]*Dialogs\.\$hideProgress/,
  'Trigger progress must close from finally.',
);

const resultsRefreshStart = triggerSource.indexOf('  async refreshResults(options: TriggerRefreshOptions = {})');
assert.notEqual(resultsRefreshStart, -1, 'Unable to locate Trigger.refreshResults().');
const resultsRefresh = triggerSource.slice(resultsRefreshStart, triggerRefreshStart);
assert.match(resultsRefresh, /page: this\.tableOptions\.value\.page \|\| 1/,
  'Trigger.refreshResults() must preserve the current result page.');
assert.match(resultsRefresh, /selectedFilterFields: this\.selectedSearchFields\.value \|\| \[\]/,
  'Trigger.refreshResults() must preserve selected search filters.');
assert.match(resultsRefresh, /await this\.loadItems\(/,
  'Trigger.refreshResults() must reload data through the existing loader.');
assert.doesNotMatch(resultsRefresh, /this\.initialize\(\)|this\.forceRender\(\)/,
  'Result-only refresh must not rebuild Trigger configuration or rendered factories.');
assert.match(resultsRefresh, /this\.resultsRefreshPromise \|\|/,
  'Overlapping result-only refresh calls must share one table request.');
assert.match(resultsRefresh, /if \(options\.progress\)[\s\S]*Dialogs\.\$showProgress/,
  'Result-only progress must be opt-in.');
assert.match(resultsRefresh, /finally \{[\s\S]*Dialogs\.\$hideProgress/,
  'Result-only progress must always close from finally.');

console.log('Trigger and Dashboard refresh lifecycle contracts passed.');
