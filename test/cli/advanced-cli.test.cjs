const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const cliEntry = path.join(repoRoot, 'lib', 'cjs', 'cli', 'index.js');

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function runCli(cwd, args) {
  return spawnSync(process.execPath, [cliEntry, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function assertSuccess(result, context) {
  assert.equal(
    result.status,
    0,
    `${context} failed.\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
  );
}

function main() {
  const cwd = makeTempDir('ve-cli-advanced-');
  writeFile(path.join(cwd, 'src/main.ts'), `import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { initializeBootstrap } from './bootstrap';

const vuetify = createVuetify({
  components,
  directives,
});

const bootstrap = initializeBootstrap();

const Root = defineComponent({
  name: 'FixtureRoot',
  setup() {
    return () => [
      h(bootstrap.component || 'div'),
      h(bootstrap.dialogs || 'div'),
      h(bootstrap.notifications || 'div'),
    ];
  },
});

createApp(Root).use(vuetify).use(bootstrap.plugin || { install() {} }).mount('#app');
`);
  writeFile(path.join(cwd, 'src/bootstrap/index.ts'), 'export function initializeBootstrap() { return { component: "div", dialogs: "div", notifications: "div", plugin: { install() {} } }; }\n');
  writeFile(path.join(cwd, 'src/bootstrap/header.ts'), `import { AppTitleBlock, EnvironmentTag, StatusBadge, type AppMain, type AppShellContent } from 'vuetify-extended';

export function buildHeaderStart(app: AppMain): AppShellContent[] {
  return [
    new AppTitleBlock({
      title: app.$params.title || 'Workspace',
      subtitle: 'Starter subtitle',
      overline: 'Workspace',
      icon: 'mdi-view-dashboard-outline',
      color: 'primary',
    }),
  ];
}

export function buildHeaderCenter(_app: AppMain): AppShellContent[] {
  return [
    new EnvironmentTag({
      text: 'Starter',
      color: 'info',
      variant: 'outlined',
    }),
  ];
}

export function buildHeaderEnd(_app: AppMain): AppShellContent[] {
  return [
    new StatusBadge({
      text: 'Ready',
      icon: 'mdi-check-circle-outline',
      color: 'success',
      variant: 'tonal',
    }),
  ];
}
`);
  writeFile(path.join(cwd, 'src/api/index.ts'), `${''}`);
  writeFile(path.join(cwd, 'src/menu/index.ts'), `import { $MN } from 'vuetify-extended';
// vuetify-ext:menu-imports

export function createMainMenu() {
  return $MN(
    {
      title: 'Workspace',
    },
    {
      children: async () => [
        // vuetify-ext:menu-items
      ],
    },
  );
}
`);

  let result = runCli(cwd, ['create', 'page', 'report', 'people', '-y', '--title', 'People Workspace', '--object-type', 'people']);
  assertSuccess(result, 'create page report');

  const reportSource = fs.readFileSync(path.join(cwd, 'src/pages/people/report.ts'), 'utf8');
  const formSource = fs.readFileSync(path.join(cwd, 'src/pages/people/form.ts'), 'utf8');
  assert.match(reportSource, /\$RP\(/);
  assert.match(formSource, /\$FM\(/);
  assert.match(formSource, /\$FD\(/);

  result = runCli(cwd, ['create', 'field', 'people', '--non-interactive', '--label', 'Email', '--storage', 'email', '--cols', '6', '--required', 'true']);
  assertSuccess(result, 'create field');
  const fieldSource = fs.readFileSync(path.join(cwd, 'src/pages/people/form.ts'), 'utf8');
  assert.match(fieldSource, /\/\/ vuetify-ext:field:email/);

  result = runCli(cwd, ['create', 'part', 'people', '--non-interactive', '--title', 'More Details']);
  assertSuccess(result, 'create part');
  const partSource = fs.readFileSync(path.join(cwd, 'src/pages/people/form.ts'), 'utf8');
  assert.match(partSource, /\/\/ vuetify-ext:part:2:fields/);

  result = runCli(cwd, ['create', 'dashboard', 'ops', '--non-interactive', '--title', 'Ops Dashboard']);
  assertSuccess(result, 'create dashboard');
  const dashboardSource = fs.readFileSync(path.join(cwd, 'src/pages/ops/dashboard.ts'), 'utf8');
  assert.match(dashboardSource, /\$DB\(/);
  assert.match(dashboardSource, /dashboard-widgets/);

  result = runCli(cwd, ['create', 'page', 'trigger', 'finder', '-y', '--title', 'Finder Trigger', '--object-type', 'people']);
  assertSuccess(result, 'create page trigger');
  const triggerSource = fs.readFileSync(path.join(cwd, 'src/pages/finder/trigger.ts'), 'utf8');
  assert.match(triggerSource, /\$TG\(/);

  result = runCli(cwd, ['create', 'dashboard-widget', 'ops', '--non-interactive', '--type', 'chart', '--title', 'Revenue Trend']);
  assertSuccess(result, 'create dashboard-widget');
  const dashboardAfterWidget = fs.readFileSync(path.join(cwd, 'src/pages/ops/dashboard.ts'), 'utf8');
  assert.match(dashboardAfterWidget, /\$DCHW\(/);

  result = runCli(cwd, ['create', 'route', 'people-route', '--non-interactive', '--page', 'people', '--target', 'report', '--path', '/people', '--title', 'People Route']);
  assertSuccess(result, 'create route');
  const routeSource = fs.readFileSync(path.join(cwd, 'src/routes/people-route.ts'), 'utf8');
  const routesIndexSource = fs.readFileSync(path.join(cwd, 'src/routes/index.ts'), 'utf8');
  assert.match(routeSource, /AppManager\.showReport/);
  assert.match(routeSource, /navigation:\s*\{/);
  assert.match(routeSource, /key:\s*['"]routes\.people-route\.report\.display['"]/);
  assert.match(routesIndexSource, /peopleRoute/);

  result = runCli(cwd, ['create', 'dialog-form', 'quick-edit', '--non-interactive', '--title', 'Quick Edit']);
  assertSuccess(result, 'create dialog-form');
  const dialogFormSource = fs.readFileSync(path.join(cwd, 'src/dialogs/quick-edit.ts'), 'utf8');
  assert.match(dialogFormSource, /\$DF\(/);

  result = runCli(cwd, ['create', 'trigger-field', 'finder', '--non-interactive', '--label', 'Status', '--storage', 'status', '--type', 'select', '--cols', '6']);
  assertSuccess(result, 'create trigger-field');
  const triggerAfterField = fs.readFileSync(path.join(cwd, 'src/pages/finder/trigger.ts'), 'utf8');
  assert.match(triggerAfterField, /trigger-field:status/);
  assert.match(triggerAfterField, /searchFields:/);

  result = runCli(cwd, ['create', 'trigger-action', 'finder', '--non-interactive', '--text', 'Bulk Approve', '--icon', 'mdi-check', '--color', 'success']);
  assertSuccess(result, 'create trigger-action');
  const triggerAfterAction = fs.readFileSync(path.join(cwd, 'src/pages/finder/trigger.ts'), 'utf8');
  assert.match(triggerAfterAction, /\$BN\(/);
  assert.match(triggerAfterAction, /trigger-action:bulk-approve/);

  result = runCli(cwd, ['create', 'report-action', 'people', '--non-interactive', '--text', 'Summary', '--icon', 'mdi-information-outline', '--color', 'primary']);
  assertSuccess(result, 'create report-action');
  const reportAfterAction = fs.readFileSync(path.join(cwd, 'src/pages/people/report.ts'), 'utf8');
  assert.match(reportAfterAction, /report-action:summary/);
  assert.match(reportAfterAction, /\$BN\(/);

  result = runCli(cwd, ['create', 'dashboard-data-source', 'ops', '--non-interactive', '--name', 'dashboard-data']);
  assertSuccess(result, 'create dashboard-data-source');
  const dashboardDataSource = fs.readFileSync(path.join(cwd, 'src/pages/ops/dashboard-data.ts'), 'utf8');
  assert.match(dashboardDataSource, /loadOpsDashboardSnapshot/);

  result = runCli(cwd, ['create', 'asset-service', 'assets', '--non-interactive', '--path', 'assets']);
  assertSuccess(result, 'create asset-service');
  const assetServiceSource = fs.readFileSync(path.join(cwd, 'src/api/assets.ts'), 'utf8');
  assert.match(assetServiceSource, /uploadAssets/);
  assert.match(assetServiceSource, /fileToBase64/);

  result = runCli(cwd, ['create', 'autocomplete-source', 'people-autocomplete', '--non-interactive', '--service-path', 'people', '--label-field', 'name', '--value-field', '_id']);
  assertSuccess(result, 'create autocomplete-source');
  const autocompleteSource = fs.readFileSync(path.join(cwd, 'src/api/people-autocomplete.ts'), 'utf8');
  assert.match(autocompleteSource, /searchPeopleAutocomplete/);
  assert.match(autocompleteSource, /resolvePeopleAutocompleteValue/);

  writeFile(path.join(cwd, 'src/bootstrap/header.ts'), `import type { AppMain } from './index';

export function buildHeaderStart(_app: AppMain) {
  return [
  ];
}

export function buildHeaderCenter(_app: AppMain) {
  return [
  ];
}

export function buildHeaderEnd(_app: AppMain) {
  return [
  ];
}
`);

  result = runCli(cwd, ['create', 'header-item', '--non-interactive', '--kind', 'action', '--region', 'end', '--text', 'Open Help', '--icon', 'mdi-help-circle-outline', '--color', 'secondary']);
  assertSuccess(result, 'create header-item');
  const headerSource = fs.readFileSync(path.join(cwd, 'src/bootstrap/header.ts'), 'utf8');
  assert.match(headerSource, /import \{ \$ATB, \$ENV, \$SIA, \$STB, \$USR \} from 'vuetify-extended';/);
  assert.match(headerSource, /\$SIA\(/);
  assert.match(headerSource, /header-item:end:action:open-help/);

  result = runCli(cwd, ['bootstrap', 'theme', '--non-interactive', '--mode', 'dark']);
  assertSuccess(result, 'bootstrap theme');
  const themeSource = fs.readFileSync(path.join(cwd, 'src/bootstrap/theme.ts'), 'utf8');
  const mainSource = fs.readFileSync(path.join(cwd, 'src/main.ts'), 'utf8');
  assert.match(themeSource, /createVuetifyThemeOptions/);
  assert.match(mainSource, /theme: createVuetifyThemeOptions\(\)/);

  result = runCli(cwd, ['create', 'service', 'users', '--non-interactive']);
  assertSuccess(result, 'create service');
  assert.ok(fs.existsSync(path.join(cwd, 'src/api/users.ts')));
  const serviceSource = fs.readFileSync(path.join(cwd, 'src/api/users.ts'), 'utf8');
  assert.match(serviceSource, /export type UsersId = string \| number;/);
  assert.match(serviceSource, /export interface UsersEntity/);
  assert.match(serviceSource, /export interface UsersCreateData/);
  assert.match(serviceSource, /export interface UsersPatchData/);
  assert.match(serviceSource, /export interface UsersQuery/);
  assert.match(serviceSource, /export interface UsersParams/);
  assert.match(serviceSource, /export async function getUsers\(id: UsersId, params\?: UsersParams\): Promise<UsersEntity>/);

  result = runCli(cwd, ['create', 'validator', 'order-code', '--non-interactive']);
  assertSuccess(result, 'create validator');
  assert.ok(fs.existsSync(path.join(cwd, 'src/validators/order-code.ts')));

  result = runCli(cwd, ['add', 'menu-item', 'ops', '--non-interactive', '--target', 'dashboard', '--text', 'Ops Dashboard']);
  assertSuccess(result, 'add menu-item alias');
  const menuSource = fs.readFileSync(path.join(cwd, 'src/menu/index.ts'), 'utf8');
  assert.match(menuSource, /\$MI\(/);
  assert.match(menuSource, /action:\s*'ui'/);
  assert.match(menuSource, /ui:\s*async\s*\(\)\s*=>\s*createOpsDashboard\(\)/);
  assert.match(menuSource, /navigation:\s*\(\)\s*=>\s*\(\{/);
  assert.match(menuSource, /key:\s*['"]pages\.ops\.ui['"]/);

  result = runCli(cwd, ['create', 'sub-menu', 'settings', '--non-interactive', '--title', 'Settings', '--text', 'Settings Hub', '--sub-text', 'Open workspace settings tools.', '--icon', 'mdi-cog-outline', '--color', 'secondary']);
  assertSuccess(result, 'create sub-menu');
  const subMenuSource = fs.readFileSync(path.join(cwd, 'src/menu/settings.ts'), 'utf8');
  const menuAfterSubMenu = fs.readFileSync(path.join(cwd, 'src/menu/index.ts'), 'utf8');
  assert.match(subMenuSource, /export function createSettingsMenu/);
  assert.match(subMenuSource, /vuetify-ext:menu-items/);
  assert.match(menuAfterSubMenu, /createSettingsMenu/);
  assert.match(menuAfterSubMenu, /action: 'menu'/);

  result = runCli(cwd, ['create', 'menu-item', 'people', '--non-interactive', '--target', 'report', '--text', 'People Report', '--menu-file', 'src/menu/settings.ts']);
  assertSuccess(result, 'create menu-item in submenu');
  const subMenuAfterItem = fs.readFileSync(path.join(cwd, 'src/menu/settings.ts'), 'utf8');
  assert.match(subMenuAfterItem, /createPeopleReport/);
  assert.match(subMenuAfterItem, /vuetify-ext:menu-item:report:people/);

  writeFile(path.join(cwd, 'src/pages/legacy/form.ts'), `import { Field, Form, Part } from 'vuetify-extended';
export function createLegacyForm() {
  return new Form({ title: 'Legacy', mode: 'display' }, { children: () => [ new Part({ cols: 12 }, { children: () => [ new Field({ label: 'Legacy', storage: 'legacy' }) ] }) ] });
}
`);
  writeFile(path.join(cwd, 'src/pages/legacy/report.ts'), `import { Report } from 'vuetify-extended';
import { createLegacyForm } from './form';
export function createLegacyReport(mode = 'display') {
  return new Report({ title: 'Legacy', forms: 1, mode }, { form: async (_props, _context, _index) => createLegacyForm() });
}
`);
  writeFile(path.join(cwd, 'src/pages/legacy/index.ts'), `export { createLegacyForm } from './form';
export { createLegacyReport } from './report';
`);
  writeFile(path.join(cwd, 'src/menu/legacy-trigger.ts'), `import { AppManager } from 'vuetify-extended';
export async function openLegacyTrigger(trigger) {
  AppManager.showUI(trigger);
}
`);

  result = runCli(cwd, ['migrate', '--apply']);
  assertSuccess(result, 'migrate');
  const legacyReport = fs.readFileSync(path.join(cwd, 'src/pages/legacy/report.ts'), 'utf8');
  const legacyForm = fs.readFileSync(path.join(cwd, 'src/pages/legacy/form.ts'), 'utf8');
  const migratedTrigger = fs.readFileSync(path.join(cwd, 'src/menu/legacy-trigger.ts'), 'utf8');
  assert.match(legacyReport, /report-form-imports/);
  assert.match(legacyForm, /form-parts/);
  assert.match(migratedTrigger, /AppManager\.showTrigger\(trigger\)/);

  result = runCli(cwd, ['doctor']);
  assertSuccess(result, 'doctor');

  process.stdout.write('Advanced CLI tests passed.\n');
}

main();
