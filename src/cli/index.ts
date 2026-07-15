#!/usr/bin/env node
import { type BootstrapApiAnswers, runBootstrapAppCommand } from './bootstrap-app';
import {
  runCreateCollectionCommand,
  runCreateFormCommand,
  runCreateMenuItemCommand,
  runCreateReportCommand,
  runCreateSubMenuCommand,
  runCreateTriggerCommand,
} from './create-ui';
import {
  runCreateDashboardCommand as runCreateDashboardCommandAdvanced,
  runCreateDashboardWidgetCommand as runCreateDashboardWidgetCommandAdvanced,
  runCreateFieldCommand as runCreateFieldCommandAdvanced,
  runCreatePageCommand as runCreatePageCommandAdvanced,
  runCreatePartCommand as runCreatePartCommandAdvanced,
  runCreateServiceCommand as runCreateServiceCommandAdvanced,
  runCreateValidatorCommand as runCreateValidatorCommandAdvanced,
  runDoctorCommand as runDoctorCommandAdvanced,
  runMigrateCommand as runMigrateCommandAdvanced,
} from './advanced-ui';
import {
  runBootstrapThemeCommand,
  runCreateAssetServiceCommand,
  runCreateAutocompleteSourceCommand,
  runCreateDashboardDataSourceCommand,
  runCreateDialogFormCommand,
  runCreateHeaderItemCommand,
  runCreateReportActionCommand,
  runCreateRouteCommand,
  runCreateTriggerActionCommand,
  runCreateTriggerFieldCommand,
} from './productivity-ui';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const subcommand = args[1];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    process.exitCode = 0;
    return;
  }

  if (command === 'bootstrap' && subcommand === 'app') {
    const parsed = parseNamedArgs(args.slice(2));
    const exitCode = await runBootstrapAppCommand({
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
    process.exitCode = await runCreateReportCommand({
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
    process.exitCode = await runCreateRouteCommand({
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
    process.exitCode = await runCreateDialogFormCommand({
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
    process.exitCode = await runCreatePageCommandAdvanced({
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
    process.exitCode = await runCreateFormCommand({
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
    process.exitCode = await runCreateFieldCommandAdvanced({
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
    process.exitCode = await runCreateTriggerFieldCommand({
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
    process.exitCode = await runCreateTriggerActionCommand({
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
    process.exitCode = await runCreateReportActionCommand({
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
    process.exitCode = await runCreatePartCommandAdvanced({
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
    process.exitCode = await runCreateTriggerCommand({
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
    process.exitCode = await runCreateDashboardCommandAdvanced({
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
    process.exitCode = await runCreateDashboardWidgetCommandAdvanced({
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
    process.exitCode = await runCreateDashboardDataSourceCommand({
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
    process.exitCode = await runCreateCollectionCommand({
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
    process.exitCode = await runCreateServiceCommandAdvanced({
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
    process.exitCode = await runCreateAssetServiceCommand({
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
    process.exitCode = await runCreateAutocompleteSourceCommand({
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
    process.exitCode = await runCreateValidatorCommandAdvanced({
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
    process.exitCode = await runCreateMenuItemCommand({
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
    process.exitCode = await runCreateHeaderItemCommand({
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
    process.exitCode = await runCreateSubMenuCommand({
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
    process.exitCode = await runCreateMenuItemCommand({
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
    process.exitCode = await runDoctorCommandAdvanced({
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
    process.exitCode = await runBootstrapThemeCommand({
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
    process.exitCode = await runMigrateCommandAdvanced({
      cwd: process.cwd(),
      dryRun: hasFlag(parsed, 'dry-run'),
      force: hasFlag(parsed, 'force'),
      interactive: resolveInteractiveMode(parsed),
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr,
      values: {
        ...parsed.values,
        ...(hasFlag(parsed, 'apply') ? { apply: 'true' } : {}),
      },
      positionals: parsed.positionals,
    });
    return;
  }

  process.stderr.write(`[vuetify-ext] Unknown command: ${args.join(' ')}\n\n`);
  printHelp();
  process.exitCode = 1;
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

function parseNamedArgs(args: string[]) {
  const flags = new Set<string>();
  const values: Record<string, string> = {};
  const positionals: string[] = [];

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

function hasFlag(parsed: { flags: Set<string> }, name: string): boolean {
  return parsed.flags.has(name);
}

function resolveInteractiveMode(parsed: { flags: Set<string> }): boolean {
  if (
    hasFlag(parsed, 'yes') ||
    hasFlag(parsed, 'non-interactive') ||
    hasFlag(parsed, 'non-interractive') ||
    hasFlag(parsed, 'non--interactive') ||
    hasFlag(parsed, 'non--interractive')
  ) {
    return false;
  }

  return true;
}

function buildApiAnswersFromArgs(parsed: { flags: Set<string>; values: Record<string, string> }): Partial<BootstrapApiAnswers> {
  const values = parsed.values;

  return {
    backend: values['backend'] as BootstrapApiAnswers['backend'] | undefined,
    apiURL: values['api-url'],
    keycloakURL: values['keycloak-url'],
    keycloakRealm: values['keycloak-realm'],
    keycloakClientId: values['keycloak-client-id'],
    keycloakOnLoad: values['keycloak-on-load'] as BootstrapApiAnswers['keycloakOnLoad'] | undefined,
    useSocket: parseOptionalBoolean(values['use-socket']),
    socketURL: values['socket-url'],
    socketEvent: values['socket-event'],
    socketAuthMode: values['socket-auth-mode'] as BootstrapApiAnswers['socketAuthMode'] | undefined,
    authPath: values['auth-path'],
    refreshAuthPath: values['refresh-auth-path'],
    authCreateMethod: values['auth-create-method'] as BootstrapApiAnswers['authCreateMethod'] | undefined,
    authRefreshMethod: values['auth-refresh-method'] as BootstrapApiAnswers['authRefreshMethod'] | undefined,
  };
}

function parseOptionalBoolean(value: string | undefined): boolean | undefined {
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
