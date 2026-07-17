#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_app_1 = require("./bootstrap-app");
const create_ui_1 = require("./create-ui");
const advanced_ui_1 = require("./advanced-ui");
const productivity_ui_1 = require("./productivity-ui");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        const command = args[0];
        const subcommand = args[1];
        if (!command || isHelpToken(command)) {
            printHelp();
            process.exitCode = 0;
            return;
        }
        if (args.some((arg) => isHelpToken(arg))) {
            printScopedHelp(command, subcommand);
            process.exitCode = 0;
            return;
        }
        if (command === 'bootstrap' && subcommand === 'app') {
            const parsed = parseNamedArgs(args.slice(2));
            const exitCode = yield (0, bootstrap_app_1.runBootstrapAppCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                apiAnswers: buildApiAnswersFromArgs(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
            });
            process.exitCode = exitCode;
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'report') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateReportCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'route') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateRouteCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'dialog-form') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateDialogFormCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'page') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreatePageCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'form') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateFormCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'field') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreateFieldCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'trigger-field') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateTriggerFieldCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'trigger-action') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateTriggerActionCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'report-action') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateReportActionCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'part') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreatePartCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'trigger') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateTriggerCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'dashboard') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreateDashboardCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'dashboard-widget') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreateDashboardWidgetCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'dashboard-data-source') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateDashboardDataSourceCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'collection') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateCollectionCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'service') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreateServiceCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'asset-service') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateAssetServiceCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'autocomplete-source') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateAutocompleteSourceCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'validator') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, advanced_ui_1.runCreateValidatorCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'menu-item') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateMenuItemCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && subcommand === 'header-item') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runCreateHeaderItemCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if ((command === 'create' || command === 'make') && (subcommand === 'sub-menu' || subcommand === 'submenu')) {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateSubMenuCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if (command === 'add' && subcommand === 'menu-item') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, create_ui_1.runCreateMenuItemCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if (command === 'doctor') {
            const parsed = parseNamedArgs(args.slice(1));
            process.exitCode = yield (0, advanced_ui_1.runDoctorCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if (command === 'bootstrap' && subcommand === 'theme') {
            const parsed = parseNamedArgs(args.slice(2));
            process.exitCode = yield (0, productivity_ui_1.runBootstrapThemeCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: parsed.values,
                positionals: parsed.positionals,
            });
            return;
        }
        if (command === 'migrate') {
            const parsed = parseNamedArgs(args.slice(1));
            process.exitCode = yield (0, advanced_ui_1.runMigrateCommand)({
                cwd: process.cwd(),
                dryRun: hasFlag(parsed, 'dry-run'),
                force: hasFlag(parsed, 'force'),
                interactive: resolveInteractiveMode(parsed),
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                values: Object.assign(Object.assign({}, parsed.values), (hasFlag(parsed, 'apply') ? { apply: 'true' } : {})),
                positionals: parsed.positionals,
            });
            return;
        }
        process.stderr.write(`[vuetify-ext] Unknown command: ${args.join(' ')}\n\n`);
        printHelp();
        process.exitCode = 1;
    });
}
function printHelp() {
    process.stdout.write(`vuetify-ext

Usage:
  vuetify-ext bootstrap app [options]
  vuetify-ext bootstrap theme [options]
  vuetify-ext create page [type] [name] [options]
  vuetify-ext create route [name] [options]
  vuetify-ext create report [name] [options]
  vuetify-ext create dialog-form [name] [options]
  vuetify-ext create form [page] [options]
  vuetify-ext create field [page] [options]
  vuetify-ext create trigger-field [page] [options]
  vuetify-ext create part [page] [options]
  vuetify-ext create trigger-action [page] [options]
  vuetify-ext create trigger [name] [options]
  vuetify-ext create report-action [page] [options]
  vuetify-ext create dashboard [name] [options]
  vuetify-ext create dashboard-widget [page] [options]
  vuetify-ext create dashboard-data-source [page] [options]
  vuetify-ext create collection [name] [options]
  vuetify-ext create service [name] [options]
  vuetify-ext create asset-service [name] [options]
  vuetify-ext create autocomplete-source [name] [options]
  vuetify-ext create validator [name] [options]
  vuetify-ext create menu-item [page] [options]
  vuetify-ext create sub-menu [name] [options]
  vuetify-ext create header-item [options]
  vuetify-ext add menu-item [page] [options]
  vuetify-ext doctor [options]
  vuetify-ext migrate [options]

Commands:
  bootstrap app   Scaffold the recommended Vuetify Extended app bootstrap into the current Vue project
  bootstrap theme Scaffold reusable light/dark Vuetify theme helpers and patch src/main.*
  create page     Scaffold a report, trigger, collection, or dashboard page from one entry command
  create route    Scaffold a reusable route descriptor under src/routes/
  create report   Scaffold a starter report page under src/pages/<name>/
  create dialog-form Scaffold a reusable dialog-based form under src/dialogs/
  create form     Add a new form step to an existing multi-form report page
  create field    Add a field into a scaffolded form part using $FD(...)
  create trigger-field Add a reusable filter field into a trigger searchFields block
  create part     Add a new Part section into a scaffolded form using $PT(...)
  create trigger-action Add a side action button into an existing trigger
  create trigger  Scaffold a starter trigger page under src/pages/<name>/
  create report-action Add a side action button into an existing report
  create dashboard Scaffold a starter dashboard page under src/pages/<name>/
  create dashboard-widget Add a widget to an existing scaffolded dashboard page
  create dashboard-data-source Scaffold a dashboard snapshot loader beside a dashboard page
  create collection Scaffold a starter collection workflow under src/pages/<name>/
  create service  Scaffold a reusable API service helper under src/api/
  create asset-service Scaffold an asset upload/download helper under src/api/
  create autocomplete-source Scaffold server-side autocomplete helpers under src/api/
  create validator Scaffold a reusable validator module under src/validators/
  create menu-item Add a page-opening item to src/menu/index.*
  create sub-menu Create src/menu/<name>.* and add it to a parent menu
  create header-item Add a shell widget entry into src/bootstrap/header.*
  add menu-item   Alias for create menu-item
  doctor          Inspect the current app for missing structure, exports, or migration opportunities
  migrate         Apply safe scaffold migrations such as markers and normalized exports

Interaction:
  The CLI is interactive by default.
  Use --non-interactive to suppress prompts and pass values through flags.

Core flags:
  --dry-run                 Show which files would be created or updated without writing them
  --force                   Overwrite existing Vuetify Extended bootstrap files
  --interactive             Force interactive mode
  --yes, -y                 Alias for non-interactive mode
  --non-interactive         Disable prompts and use only command-line values

Create report/trigger/collection flags:
  --name <page-folder>
  --title <title>
  --type <report|trigger|collection|dashboard>
  --object-type <objectType>
  --mode <create|edit|display>
  --id-field <field>
  --multiple <true|false>
  --forms <number>
  --with-report <true|false>
  --with-trigger <true|false>
  --with-menu-item <true|false>

Create form flags:
  --page <page-folder>
  --step <number>
  --title <title>

Create route flags:
  --name <route-name>
  --title <title>
  --path <route-path>
  --page <page-folder>
  --target <report|trigger|collection|dashboard>
  --mode <create|edit|display>

Create dialog-form flags:
  --name <dialog-name>
  --title <title>
  --mode <create|edit|display>

Create field flags:
  --page <page-folder>
  --step <number>
  --part <number>
  --label <label>
  --storage <key>
  --type <field-type>
  --cols <number>
  --required <true|false>

Create trigger-field flags:
  --page <page-folder>
  --label <label>
  --storage <key>
  --type <field-type>
  --cols <number>

Create part flags:
  --page <page-folder>
  --step <number>
  --title <title>
  --cols <number>

Create trigger-action/report-action flags:
  --page <page-folder>
  --text <label>
  --icon <mdi-icon>
  --color <vuetify-color>
  --variant <button-variant>
  --shortcut <shortcut>

Create dashboard flags:
  --name <page-folder>
  --title <title>
  --theme <light|dark>
  --with-menu-item <true|false>

Create dashboard-widget flags:
  --page <page-folder>
  --type <metric|table|list|progress|chart|trend|timeline|action-list|alert|empty-state|stat-grid|map|calendar|tabs>
  --section <top|main|bottom>
  --title <title>
  --subtitle <subtitle>

Create dashboard-data-source flags:
  --page <page-folder>
  --name <file-name>

Create service flags:
  --name <file-name>
  --path <service-path>

Create asset-service flags:
  --name <file-name>
  --path <service-path>

Create autocomplete-source flags:
  --name <file-name>
  --service-path <service-path>
  --label-field <field>
  --value-field <field>

Create validator flags:
  --name <file-name>
  --kind <field|rule-array>

Create menu-item flags:
  --page <page-folder>
  --target <report|trigger|collection|dashboard>
  --mode <create|edit|display>
  --text <label>
  --sub-text <text>
  --icon <mdi-icon>
  --color <vuetify-color>
  --menu-file <relative-or-absolute-path>

Create sub-menu flags:
  --name <menu-file-name>
  --title <title>
  --text <label>
  --sub-text <text>
  --icon <mdi-icon>
  --color <vuetify-color>
  --parent <main|menu-name>
  --menu-file <relative-or-absolute-path>

Create header-item flags:
  --kind <title|environment|status|action|user>
  --region <start|center|end>
  --text <label>
  --subtitle <text>
  --overline <text>
  --icon <mdi-icon>
  --color <vuetify-color>

Bootstrap theme flags:
  --mode <light|dark>

Migrate flags:
  --apply                   Write migration changes instead of previewing them

API flags:
  --backend <none|axios|feathers>
  --api-url <url>
  --keycloak-url <url>
  --keycloak-realm <realm>
  --keycloak-client-id <clientId>
  --keycloak-on-load <login-required|check-sso>
  --use-socket <true|false>

Axios-specific flags:
  --socket-url <url>
  --socket-event <event>
  --socket-auth-mode <auth|query>
  --auth-path <path>
  --refresh-auth-path <path>
  --auth-create-method <get|post|put>
  --auth-refresh-method <get|post|put|patch>
`);
}
function isHelpToken(value) {
    return value === '--help' || value === '-h';
}
function normalizeHelpSegment(value) {
    return isHelpToken(value) ? undefined : value;
}
function printScopedHelp(command, subcommand) {
    const normalizedCommand = normalizeHelpSegment(command);
    const normalizedSubcommand = normalizeHelpSegment(subcommand);
    if (!normalizedCommand) {
        printHelp();
        return;
    }
    if (normalizedCommand === 'bootstrap' && !normalizedSubcommand) {
        process.stdout.write(`vuetify-ext bootstrap

Usage:
  vuetify-ext bootstrap app [options]
  vuetify-ext bootstrap theme [options]

Commands:
  app    Scaffold the recommended Vuetify Extended app bootstrap into the current Vue project
  theme  Scaffold reusable light/dark Vuetify theme helpers and patch src/main.*

Shared flags:
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive

Run:
  vuetify-ext bootstrap app --help
  vuetify-ext bootstrap theme --help
`);
        return;
    }
    if ((normalizedCommand === 'create' || normalizedCommand === 'make') && !normalizedSubcommand) {
        process.stdout.write(`vuetify-ext create

Usage:
  vuetify-ext create <command> [options]

Create commands:
  page
  route
  report
  dialog-form
  form
  field
  trigger-field
  part
  trigger-action
  trigger
  report-action
  dashboard
  dashboard-widget
  dashboard-data-source
  collection
  service
  asset-service
  autocomplete-source
  validator
  menu-item
  sub-menu
  header-item

Shared flags:
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive

Run:
  vuetify-ext create report --help
  vuetify-ext create autocomplete-source --help
  vuetify-ext create sub-menu --help
`);
        return;
    }
    const leafHelp = {
        'bootstrap app': `vuetify-ext bootstrap app

Usage:
  vuetify-ext bootstrap app [options]

Core flags:
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive

API flags:
  --backend <none|axios|feathers>
  --api-url <url>
  --keycloak-url <url>
  --keycloak-realm <realm>
  --keycloak-client-id <clientId>
  --keycloak-on-load <login-required|check-sso>
  --use-socket <true|false>

Axios-specific flags:
  --socket-url <url>
  --socket-event <event>
  --socket-auth-mode <auth|query>
  --auth-path <path>
  --refresh-auth-path <path>
  --auth-create-method <get|post|put>
  --auth-refresh-method <get|post|put|patch>
`,
        'bootstrap theme': `vuetify-ext bootstrap theme

Usage:
  vuetify-ext bootstrap theme [options]

Flags:
  --mode <light|dark>
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive
`,
        'create page': `vuetify-ext create page

Usage:
  vuetify-ext create page [type] [name] [options]

Flags:
  --name <page-folder>
  --title <title>
  --type <report|trigger|collection|dashboard>
  --with-menu-item <true|false>
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive
`,
        'create route': `vuetify-ext create route

Usage:
  vuetify-ext create route [name] [options]

Flags:
  --name <route-name>
  --title <title>
  --path <route-path>
  --page <page-folder>
  --target <report|trigger|collection|dashboard>
  --mode <create|edit|display>
`,
        'create report': `vuetify-ext create report

Usage:
  vuetify-ext create report [name] [options]

Flags:
  --name <page-folder>
  --title <title>
  --object-type <objectType>
  --mode <create|edit|display>
  --forms <number>
  --with-menu-item <true|false>
`,
        'create dialog-form': `vuetify-ext create dialog-form

Usage:
  vuetify-ext create dialog-form [name] [options]

Flags:
  --name <dialog-name>
  --title <title>
  --mode <create|edit|display>
`,
        'create form': `vuetify-ext create form

Usage:
  vuetify-ext create form [page] [options]

Flags:
  --page <page-folder>
  --step <number>
  --title <title>
`,
        'create field': `vuetify-ext create field

Usage:
  vuetify-ext create field [page] [options]

Flags:
  --page <page-folder>
  --step <number>
  --part <number>
  --label <label>
  --storage <key>
  --type <field-type>
  --cols <number>
  --required <true|false>
`,
        'create trigger-field': `vuetify-ext create trigger-field

Usage:
  vuetify-ext create trigger-field [page] [options]

Flags:
  --page <page-folder>
  --label <label>
  --storage <key>
  --type <field-type>
  --cols <number>
`,
        'create part': `vuetify-ext create part

Usage:
  vuetify-ext create part [page] [options]

Flags:
  --page <page-folder>
  --step <number>
  --title <title>
  --cols <number>
`,
        'create trigger-action': `vuetify-ext create trigger-action

Usage:
  vuetify-ext create trigger-action [page] [options]

Flags:
  --page <page-folder>
  --text <label>
  --icon <mdi-icon>
  --color <vuetify-color>
  --variant <button-variant>
  --shortcut <shortcut>
`,
        'create trigger': `vuetify-ext create trigger

Usage:
  vuetify-ext create trigger [name] [options]

Flags:
  --name <page-folder>
  --title <title>
  --object-type <objectType>
  --mode <create|edit|display>
  --id-field <field>
  --multiple <true|false>
  --with-menu-item <true|false>
`,
        'create report-action': `vuetify-ext create report-action

Usage:
  vuetify-ext create report-action [page] [options]

Flags:
  --page <page-folder>
  --text <label>
  --icon <mdi-icon>
  --color <vuetify-color>
  --variant <button-variant>
  --shortcut <shortcut>
`,
        'create dashboard': `vuetify-ext create dashboard

Usage:
  vuetify-ext create dashboard [name] [options]

Flags:
  --name <page-folder>
  --title <title>
  --theme <light|dark>
  --with-menu-item <true|false>
`,
        'create dashboard-widget': `vuetify-ext create dashboard-widget

Usage:
  vuetify-ext create dashboard-widget [page] [options]

Flags:
  --page <page-folder>
  --type <metric|table|list|progress|chart|trend|timeline|action-list|alert|empty-state|stat-grid|map|calendar|tabs>
  --section <top|main|bottom>
  --title <title>
  --subtitle <subtitle>
`,
        'create dashboard-data-source': `vuetify-ext create dashboard-data-source

Usage:
  vuetify-ext create dashboard-data-source [page] [options]

Flags:
  --page <page-folder>
  --name <file-name>
`,
        'create collection': `vuetify-ext create collection

Usage:
  vuetify-ext create collection [name] [options]

Flags:
  --name <page-folder>
  --title <title>
  --object-type <objectType>
  --id-field <field>
  --mode <create|edit|display>
  --multiple <true|false>
  --with-report <true|false>
  --with-trigger <true|false>
`,
        'create service': `vuetify-ext create service

Usage:
  vuetify-ext create service [name] [options]

Flags:
  --name <file-name>
  --path <service-path>
`,
        'create asset-service': `vuetify-ext create asset-service

Usage:
  vuetify-ext create asset-service [name] [options]

Flags:
  --name <file-name>
  --path <service-path>
`,
        'create autocomplete-source': `vuetify-ext create autocomplete-source

Usage:
  vuetify-ext create autocomplete-source [name] [options]

Flags:
  --name <file-name>
  --service-path <service-path>
  --label-field <field>
  --value-field <field>

Generated helper contract:
  search<Name>Autocomplete(...) returns { data, skip, limit, total }
  Raw array responses are normalized into the same dictionary shape.
`,
        'create validator': `vuetify-ext create validator

Usage:
  vuetify-ext create validator [name] [options]

Flags:
  --name <file-name>
  --kind <field|rule-array>
`,
        'create menu-item': `vuetify-ext create menu-item

Usage:
  vuetify-ext create menu-item [page] [options]

Flags:
  --page <page-folder>
  --target <report|trigger|collection|dashboard>
  --mode <create|edit|display>
  --text <label>
  --sub-text <text>
  --icon <mdi-icon>
  --color <vuetify-color>
  --menu-file <relative-or-absolute-path>
`,
        'create sub-menu': `vuetify-ext create sub-menu

Usage:
  vuetify-ext create sub-menu [name] [options]

Flags:
  --name <menu-file-name>
  --title <title>
  --text <label>
  --sub-text <text>
  --icon <mdi-icon>
  --color <vuetify-color>
  --parent <main|menu-name>
  --menu-file <relative-or-absolute-path>
`,
        'create submenu': `vuetify-ext create sub-menu

Usage:
  vuetify-ext create sub-menu [name] [options]

Flags:
  --name <menu-file-name>
  --title <title>
  --text <label>
  --sub-text <text>
  --icon <mdi-icon>
  --color <vuetify-color>
  --parent <main|menu-name>
  --menu-file <relative-or-absolute-path>
`,
        'create header-item': `vuetify-ext create header-item

Usage:
  vuetify-ext create header-item [options]

Flags:
  --kind <title|environment|status|action|user>
  --region <start|center|end>
  --text <label>
  --subtitle <text>
  --overline <text>
  --icon <mdi-icon>
  --color <vuetify-color>
`,
        'add menu-item': `vuetify-ext add menu-item

Usage:
  vuetify-ext add menu-item [page] [options]

Alias:
  Exact alias of "vuetify-ext create menu-item"
`,
        'doctor': `vuetify-ext doctor

Usage:
  vuetify-ext doctor [options]

Flags:
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive
`,
        'migrate': `vuetify-ext migrate

Usage:
  vuetify-ext migrate [options]

Flags:
  --apply
  --dry-run
  --force
  --interactive
  --yes, -y
  --non-interactive
`,
    };
    const normalizedHelpCommand = normalizedCommand === 'make' ? 'create' : normalizedCommand;
    const key = normalizedSubcommand ? `${normalizedHelpCommand} ${normalizedSubcommand}` : normalizedHelpCommand;
    const help = leafHelp[key];
    if (help) {
        process.stdout.write(help);
        return;
    }
    printHelp();
}
function parseNamedArgs(args) {
    const flags = new Set();
    const values = {};
    const positionals = [];
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (arg === '-y') {
            flags.add('yes');
            continue;
        }
        if (!arg.startsWith('--')) {
            positionals.push(arg);
            continue;
        }
        const trimmed = arg.slice(2);
        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex >= 0) {
            const name = trimmed.slice(0, equalsIndex);
            const value = trimmed.slice(equalsIndex + 1);
            values[name] = value;
            flags.add(name);
            continue;
        }
        const next = args[index + 1];
        if (next && !next.startsWith('--')) {
            values[trimmed] = next;
            flags.add(trimmed);
            index += 1;
            continue;
        }
        flags.add(trimmed);
    }
    return { flags, values, positionals };
}
function hasFlag(parsed, name) {
    return parsed.flags.has(name);
}
function resolveInteractiveMode(parsed) {
    if (hasFlag(parsed, 'yes') ||
        hasFlag(parsed, 'non-interactive') ||
        hasFlag(parsed, 'non-interractive') ||
        hasFlag(parsed, 'non--interactive') ||
        hasFlag(parsed, 'non--interractive')) {
        return false;
    }
    return true;
}
function buildApiAnswersFromArgs(parsed) {
    const values = parsed.values;
    return {
        backend: values['backend'],
        apiURL: values['api-url'],
        keycloakURL: values['keycloak-url'],
        keycloakRealm: values['keycloak-realm'],
        keycloakClientId: values['keycloak-client-id'],
        keycloakOnLoad: values['keycloak-on-load'],
        useSocket: parseOptionalBoolean(values['use-socket']),
        socketURL: values['socket-url'],
        socketEvent: values['socket-event'],
        socketAuthMode: values['socket-auth-mode'],
        authPath: values['auth-path'],
        refreshAuthPath: values['refresh-auth-path'],
        authCreateMethod: values['auth-create-method'],
        authRefreshMethod: values['auth-refresh-method'],
    };
}
function parseOptionalBoolean(value) {
    if (value === undefined) {
        return undefined;
    }
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) {
        return true;
    }
    if (['false', '0', 'no', 'n'].includes(normalized)) {
        return false;
    }
    return undefined;
}
void main();
