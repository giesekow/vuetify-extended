# CLI

This section documents the `vuetify-ext` package CLI.

The CLI is meant to reduce setup friction and give teams a repeatable way to scaffold the recommended `vuetify-extended` project structure.

## Current Commands

The CLI currently supports:

```bash
vuetify-ext bootstrap app
vuetify-ext bootstrap theme
vuetify-ext create page
vuetify-ext create route
vuetify-ext create report
vuetify-ext create dialog-form
vuetify-ext create form
vuetify-ext create field
vuetify-ext create trigger-field
vuetify-ext create part
vuetify-ext create trigger-action
vuetify-ext create trigger
vuetify-ext create report-action
vuetify-ext create dashboard
vuetify-ext create dashboard-widget
vuetify-ext create dashboard-data-source
vuetify-ext create collection
vuetify-ext create service
vuetify-ext create asset-service
vuetify-ext create autocomplete-source
vuetify-ext create validator
vuetify-ext create menu-item
vuetify-ext create sub-menu
vuetify-ext create header-item
vuetify-ext add menu-item
vuetify-ext doctor
vuetify-ext migrate
```

`create` also supports the alias `make`.

Example:

```bash
vuetify-ext make report people
```

## Interaction Model

The CLI is interactive by default.

That means:

- if required values are missing, the command asks follow-up questions
- the prompts use sensible defaults where possible
- the same commands can be automated with `--non-interactive`

Shared flags across CLI commands:

- `--dry-run`
- `--force`
- `--interactive`
- `--yes`
- `-y`
- `--non-interactive`

`--dry-run`

- shows what would be written or updated
- does not modify the project

`--force`

- allows overwriting scaffolded files that already exist

`--non-interactive`

- disables prompts
- expects required values through flags or positional arguments

`--yes` / `-y`

- shorthand alias for `--non-interactive`
- useful for automation and repeated scaffold commands

## Recommended Project Structure

The CLI is built around this structure:

```text
src/
  api/
    index.ts
    users.ts
    assets.ts
    people-autocomplete.ts
  bootstrap/
    index.ts
    header.ts
    footer.ts
    theme.ts
  dialogs/
    quick-edit.ts
    index.ts
  menu/
    index.ts
    settings.ts
  routes/
    index.ts
    people-route.ts
  pages/
    home/
      index.ts
      form.ts
    people/
      index.ts
      form.ts
      report.ts
      trigger.ts
      collection.ts
      dashboard-data.ts
  validators/
    index.ts
    order-code.ts
```

The important conventions are:

- `src/pages/<page-name>/index.*` is the page entrypoint
- extra page files such as `form.*`, `report.*`, `trigger.*`, and `collection.*` live beside that index
- `src/menu/index.*` is the main menu definition
- `src/routes/index.*` is the route descriptor registry when you use `create route`
- `src/dialogs/index.*` is the reusable dialog-form registry when you use `create dialog-form`
- `src/bootstrap/index.*` is the shell/app bootstrap entry
- `src/bootstrap/header.*` and `src/bootstrap/theme.*` are patch targets for shell and theme commands
- `src/api/index.*` is the runtime API configuration entry

This structure is what later CLI subcommands can safely build on.

## Shorthand Generation Style

Generated code now prefers the library shorthand helpers wherever they exist.

Examples:

- `$FD(...)` instead of `new Field(...)`
- `$PT(...)` instead of `new Part(...)`
- `$FM(...)` instead of `new Form(...)`
- `$RP(...)` instead of `new Report(...)`
- `$TG(...)` instead of `new Trigger(...)`
- `$COL(...)` instead of `new Collection(...)`
- `$MN(...)` and `$MI(...)` instead of `new Menu(...)` and `new MenuItem(...)`
- dashboard scaffolds use `$DB(...)` and the widget shorthands such as `$DMW(...)`, `$DTW(...)`, and `$DLW(...)`

## Translation-Aware Output

Generated UI code now prefers translation-aware text descriptors for runtime-facing text surfaces that support `UIText`.

That means scaffolded code often emits values like:

```ts
{ key: 'pages.people.report.title', fallback: 'People Workspace' }
```

instead of hard-coding a raw string directly into:

- report titles
- form titles
- field labels
- menu item text and sub text
- header/footer shell text
- action button labels
- starter dialog messages

This keeps the generated code immediately usable without translations while also making it ready for the shared runtime i18n adapter.

The generated `fallback` text is what users see until they provide matching translation keys through the app’s configured i18n adapter.

Not every nested data structure in every scaffold is translation-aware yet. Where a runtime item type still only accepts plain strings, the scaffold keeps emitting literal strings until that widget contract is widened.

## `vuetify-ext bootstrap app`

Bootstraps the current Vue app to use:

- `createVuetifyExtendedApp(...)`
- `AppMain`
- the shared dialogs root
- the shared notifications root
- the recommended `src/api`, `src/bootstrap`, `src/menu`, and `src/pages` structure

### Supported Entry Files

The command currently detects one of:

- `src/main.ts`
- `src/main.js`

If neither exists, it exits with an error.

### Interactive Questions

When run interactively, the command can ask for:

- backend type
- API URL
- Keycloak URL
- Keycloak realm
- Keycloak client ID
- Keycloak `onLoad`
- optional socket/realtime settings
- axios auth endpoint settings

### Generated Files

`bootstrap app` creates:

- `src/api/index.ts` or `src/api/index.js`
- `src/bootstrap/index.ts` or `src/bootstrap/index.js`
- `src/bootstrap/header.ts` or `src/bootstrap/header.js`
- `src/bootstrap/footer.ts` or `src/bootstrap/footer.js`
- `src/menu/index.ts` or `src/menu/index.js`
- `src/pages/home/index.ts` or `src/pages/home/index.js`
- `src/pages/home/form.ts` or `src/pages/home/form.js`

It also rewrites the detected `src/main.*`.

### What It Preserves

The bootstrap flow preserves common parts of the old `main.*` file where possible:

- extra non-bootstrap imports
- common `app.use(...)` registrations
- the existing mount selector
- simple top-level prelude code before the old mount path

### Automation Flags

```bash
vuetify-ext bootstrap app --non-interactive --backend axios --api-url http://127.0.0.1:3000/v1 --keycloak-url http://127.0.0.1:8081 --keycloak-realm workspace --keycloak-client-id workspace-admin
```

Supported backend flags:

- `--backend <none|axios|feathers>`
- `--api-url <url>`
- `--keycloak-url <url>`
- `--keycloak-realm <realm>`
- `--keycloak-client-id <clientId>`
- `--keycloak-on-load <login-required|check-sso>`
- `--use-socket <true|false>`

Axios-specific flags:

- `--socket-url <url>`
- `--socket-event <event>`
- `--socket-auth-mode <auth|query>`
- `--auth-path <path>`
- `--refresh-auth-path <path>`
- `--auth-create-method <get|post|put>`
- `--auth-refresh-method <get|post|put|patch>`

## `vuetify-ext bootstrap theme`

Creates `src/bootstrap/theme.*` and patches `src/main.*` so `createVuetify(...)` uses a shared theme helper.

The generated theme module includes:

- `getThemeMode()`
- `setThemeMode(mode)`
- `toggleThemeMode()`
- `createVuetifyThemeOptions()`

This command is useful after `bootstrap app` when you want a standard light/dark starting point without hand-wiring the Vuetify theme block.

### Non-Interactive Usage

```bash
vuetify-ext bootstrap theme --non-interactive --mode dark
```

Supported flags:

- `--mode <light|dark>`

## `vuetify-ext create report`

Scaffolds a starter report page under `src/pages/<name>/`.

### Generated Files

- `src/pages/<name>/form.*`
- `src/pages/<name>/report.*`
- `src/pages/<name>/index.*`

### Interactive Questions

- page/folder name
- report title
- object type
- default mode
- number of forms/steps

### Non-Interactive Usage

```bash
vuetify-ext create report people --non-interactive --title "People Workspace" --object-type people --mode display --forms 1
```

Supported flags:

- `--name <page-folder>`
- `--title <title>`
- `--object-type <objectType>`
- `--mode <create|edit|display>`
- `--forms <number>`

### Scaffold Shape

The generated report:

- creates a starter `Form`
- exports `create<Name>Report(mode)` as a navigation-aware factory creator
- returns a screen factory from `create<Name>Report(mode)` instead of returning a `Report` instance directly
- wires the starter form into a `Report` inside that returned factory
- exports both from the page index
- defaults to a centered, fluid layout that matches the library’s current report pattern

## `vuetify-ext create trigger`

Scaffolds a starter trigger page under `src/pages/<name>/`.

### Generated Files

- `src/pages/<name>/trigger.*`
- `src/pages/<name>/index.*`

### Interactive Questions

- page/folder name
- trigger title
- object type
- id field
- default mode
- whether multiple row selection should be enabled

### Non-Interactive Usage

```bash
vuetify-ext create trigger people --non-interactive --title "People Search" --object-type people --id-field _id --mode edit --multiple true
```

Supported flags:

- `--name <page-folder>`
- `--title <title>`
- `--object-type <objectType>`
- `--id-field <field>`
- `--mode <create|edit|display>`
- `--multiple <true|false>`

### Scaffold Shape

The generated trigger includes:

- starter headers
- a small in-memory dataset
- a simple search filter in `load(...)`
- a reminder label telling the user to replace the starter logic with real API loading

This keeps the trigger runnable even before backend integration is wired in.

## `vuetify-ext create form`

Adds a new step form to an existing report page and patches the existing report to include it in the multi-form flow.

### Generated And Updated Files

- creates `src/pages/<page>/form-<step>.*`
- updates `src/pages/<page>/report.*`
- updates `src/pages/<page>/index.*`

### Interactive Questions

- page/folder name
- form step number
- form title

### Non-Interactive Usage

```bash
vuetify-ext create form people --non-interactive --step 2 --title "People Contact Details"
```

Supported flags:

- `--page <page-folder>`
- `--step <number>`
- `--title <title>`

When omitted in non-interactive mode:

- `--step` defaults to the next available report step
- `--title` defaults from the report title plus the new step number

### Patch Behavior

The command expects the page to already contain the standard report scaffold:

- `src/pages/<page>/report.*`
- `src/pages/<page>/form.*`
- `create<PageName>Report`
- `create<PageName>Form`

When patching succeeds, it will:

- increment the report `forms` count
- add the new form import
- extend the indexed `form(...)` resolver
- export the new form factory from the page index

The command is intentionally conservative: it fails with a clear error if the report cannot be patched safely.

## `vuetify-ext create page`

High-level page scaffolder that wraps the lower-level page commands.

Supported page types:

- `report`
- `trigger`
- `collection`
- `dashboard`

Useful flags:

- `--type <report|trigger|collection|dashboard>`
- `--name <page-folder>`
- `--title <title>`
- `--with-menu-item <true|false>`

Type-specific flags:

- report: `--object-type`, `--mode`, `--forms`
- trigger: `--object-type`, `--mode`, `--id-field`, `--multiple`
- collection: `--object-type`, `--mode`, `--id-field`, `--multiple`, `--with-report`, `--with-trigger`
- dashboard: `--theme <light|dark>`

Example:

```bash
vuetify-ext create page report people --non-interactive --title "People Workspace" --object-type people --mode display
```

## `vuetify-ext create route`

Scaffolds a reusable route descriptor under `src/routes/`.

This command intentionally generates lightweight route metadata rather than a hard dependency on `vue-router`. The generated `open()` handler resolves a page factory and opens it through `AppManager`.

Generated route openers also include grouped navigation configuration:

- `navigation: { key, persist }`
- route keys follow `routes.<route-name>.<target>.<mode>` for report/trigger/collection
- dashboards use `routes.<route-name>.ui`

### Generated Files

- `src/routes/<name>.*`
- `src/routes/index.*`

### Supported flags

- `--name <route-name>`
- `--title <title>`
- `--path <route-path>`
- `--page <page-folder>`
- `--target <report|trigger|collection|dashboard>`
- `--mode <create|edit|display>`

### Example

```bash
vuetify-ext create route people-route --non-interactive --page people --target report --path /people --title "People Route"
```

## `vuetify-ext create dialog-form`

Creates a reusable dialog-based form factory under `src/dialogs/`.

### Generated Files

- `src/dialogs/<name>.*`
- `src/dialogs/index.*`

### Supported flags

- `--name <dialog-name>`
- `--title <title>`
- `--mode <create|edit|display>`

### Example

```bash
vuetify-ext create dialog-form quick-edit --non-interactive --title "Quick Edit"
```

## `vuetify-ext create field`

Adds a new `$FD(...)` field into a scaffolded form file.

The command targets a specific page, form step, and part marker.

Supported flags:

- `--page <page-folder>`
- `--step <number>`
- `--part <number>`
- `--label <label>`
- `--storage <key>`
- `--type <field-type>`
- `--cols <number>`
- `--required <true|false>`

Example:

```bash
vuetify-ext create field people --non-interactive --label "Email" --storage email --cols 6 --required true
```

## `vuetify-ext create trigger-field`

Adds a reusable filter field into a trigger `searchFields` block.

If the trigger does not yet expose a `searchFields` block, the command adds one and inserts a scaffold marker so later calls stay predictable.

### Supported flags

- `--page <page-folder>`
- `--label <label>`
- `--storage <key>`
- `--type <field-type>`
- `--cols <number>`

### Example

```bash
vuetify-ext create trigger-field finder --non-interactive --label "Status" --storage status --type select --cols 6
```

## `vuetify-ext create part`

Adds a new `$PT(...)` section into a scaffolded form file.

Supported flags:

- `--page <page-folder>`
- `--step <number>`
- `--title <title>`
- `--cols <number>`

Example:

```bash
vuetify-ext create part people --non-interactive --title "Billing Details"
```

## `vuetify-ext create trigger-action`

Adds a side action button into an existing trigger.

The generated action uses `$BN(...)`, emits a trigger-local `side-action` event slug, and shows a starter success notification so the action is immediately visible during development.

### Supported flags

- `--page <page-folder>`
- `--text <label>`
- `--icon <mdi-icon>`
- `--color <vuetify-color>`
- `--variant <button-variant>`
- `--shortcut <shortcut>`

### Example

```bash
vuetify-ext create trigger-action finder --non-interactive --text "Bulk Approve" --icon mdi-check --color success
```

## `vuetify-ext create report-action`

Adds a side action button into an existing report.

Just like `create trigger-action`, this command normalizes the `sideButtons(...)` block when needed and inserts a button scaffold that emits a `side-action` event slug on the report instance.

### Supported flags

- `--page <page-folder>`
- `--text <label>`
- `--icon <mdi-icon>`
- `--color <vuetify-color>`
- `--variant <button-variant>`
- `--shortcut <shortcut>`

### Example

```bash
vuetify-ext create report-action people --non-interactive --text "Summary" --icon mdi-information-outline --color primary
```

## `vuetify-ext create dashboard`

Scaffolds a dashboard page under `src/pages/<name>/`.

Generated files:

- `src/pages/<name>/dashboard.*`
- `src/pages/<name>/index.*`

Supported flags:

- `--name <page-folder>`
- `--title <title>`
- `--theme <light|dark>`
- `--with-menu-item <true|false>`

The generated dashboard includes:

- dashboard section markers for widget patching
- starter metric and list widgets
- a header menu item example
- shorthand widget constructors

## `vuetify-ext create dashboard-widget`

Adds a widget into an existing scaffolded dashboard file.

Supported widget types:

- `metric`
- `table`
- `list`
- `progress`
- `chart`
- `trend`
- `timeline`
- `action-list`
- `alert`
- `empty-state`
- `stat-grid`
- `map`
- `calendar`
- `tabs`

Supported flags:

- `--page <page-folder>`
- `--type <widget-type>`
- `--section <top|main|bottom>`
- `--title <title>`
- `--subtitle <subtitle>`

## `vuetify-ext create dashboard-data-source`

Creates a page-local dashboard snapshot loader beside an existing dashboard page.

Generated files:

- `src/pages/<page>/<name>.*`
- updates `src/pages/<page>/index.*`

Supported flags:

- `--page <page-folder>`
- `--name <file-name>`

Example:

```bash
vuetify-ext create dashboard-data-source ops --non-interactive --name dashboard-data
```

## `vuetify-ext create service`

Scaffolds a reusable API service helper under `src/api/`.

Generated files:

- `src/api/<name>.*`
- updates `src/api/index.*`

TypeScript generation now includes a lightweight typed shape by default:

- `<Name>Id`
- `<Name>Entity`
- `<Name>CreateData`
- `<Name>PatchData`
- `<Name>Query`
- `<Name>Params`

These are intentionally generic starter types so teams can refine them to match the backend contract without starting from `any` everywhere.

Supported flags:

- `--name <file-name>`
- `--path <service-path>`

## `vuetify-ext create asset-service`

Scaffolds an asset-focused API helper under `src/api/`.

The generated helper includes starter functions for:

- base64 conversion
- upload
- metadata lookup
- remove
- download URL resolution

Supported flags:

- `--name <file-name>`
- `--path <service-path>`

Example:

```bash
vuetify-ext create asset-service assets --non-interactive --path assets
```

## `vuetify-ext create autocomplete-source`

Scaffolds server-side autocomplete helpers under `src/api/`.

The generated source includes:

- `search<Name>Autocomplete(...)`
- `resolve<Name>AutocompleteValue(...)`
- a normalized result shape with `items`, `page`, `pageSize`, `total`, and `hasMore`

Supported flags:

- `--name <file-name>`
- `--service-path <service-path>`
- `--label-field <field>`
- `--value-field <field>`

Example:

```bash
vuetify-ext create autocomplete-source people-autocomplete --non-interactive --service-path people --label-field name --value-field _id
```

## `vuetify-ext create validator`

Scaffolds a reusable validator module under `src/validators/`.

Generated files:

- `src/validators/<name>.*`
- updates `src/validators/index.*`

Supported flags:

- `--name <file-name>`
- `--kind <field|rule-array>`

## `vuetify-ext create collection`

Scaffolds a starter collection workflow under `src/pages/<name>/`.

### Generated Files

Always:

- `src/pages/<name>/collection.*`
- `src/pages/<name>/index.*`

Optionally, depending on flags or prompt answers:

- `src/pages/<name>/form.*`
- `src/pages/<name>/report.*`
- `src/pages/<name>/trigger.*`

### Interactive Questions

- page/folder name
- companion report title
- object type
- id field
- default mode
- whether multiple selection should be enabled
- whether to scaffold a companion report
- whether to scaffold a companion trigger

### Non-Interactive Usage

```bash
vuetify-ext create collection people --non-interactive --title "People Workspace" --object-type people --id-field _id --mode edit --multiple true --with-report true --with-trigger true
```

Supported flags:

- `--name <page-folder>`
- `--title <title>`
- `--object-type <objectType>`
- `--id-field <field>`
- `--mode <create|edit|display>`
- `--multiple <true|false>`
- `--with-report <true|false>`
- `--with-trigger <true|false>`

### Scaffold Shape

The generated collection:

- wires a `Collection` to companion `report` and `trigger` factories
- uses the same page-folder naming convention as the standalone commands
- updates `index.*` exports so imports stay clean

If `--with-report false` or `--with-trigger false` is used, the corresponding file must already exist.
It must also export the expected standard factory name:

- `create<PageName>Report`
- `create<PageName>Trigger`

## `vuetify-ext create menu-item`

Adds a starter page-opening item into `src/menu/index.*`.

This command is meant to work especially well with the page structure created by `bootstrap app` and the other `create` commands.

### Supported Targets

- `report`
- `trigger`
- `collection`
- `dashboard`

### Interactive Questions

- target page folder
- target type
- menu card text
- menu card sub text
- icon
- color
- default mode

### Non-Interactive Usage

```bash
vuetify-ext create menu-item people --non-interactive --target report --text "People Workspace" --sub-text "Open the people report." --icon mdi-account-group --color primary --mode display
```

Supported flags:

- `--page <page-folder>`
- `--target <report|trigger|collection|dashboard>`
- `--text <label>`
- `--sub-text <text>`
- `--icon <mdi-icon>`
- `--color <vuetify-color>`
- `--mode <create|edit|display>`
- `--menu-file <relative-or-absolute-path>`

### Patch Behavior

The command:

- updates `src/menu/index.*`
- inserts missing helper markers when needed
- adds the needed page import
- adds a menu card entry

Before patching the menu, the command verifies that `src/pages/<page>/index.*` exists and exports the expected standard factory:

- `create<PageName>Report`
- `create<PageName>Trigger`
- `create<PageName>Collection`
- `create<PageName>Dashboard`

The generated menu item now uses the native action that matches the target:

- report -> `action: 'report'`
- trigger -> `action: 'trigger'`
- collection -> `action: 'collection'`
- dashboard -> `action: 'ui'`

The generated callback returns the page factory, not a pre-built instance.

The generated menu item also includes grouped navigation metadata:

- `navigation: () => ({ key, persist })`
- the key follows the standard page convention such as `pages.people.report.display`
- the menu stack path always pushes forward instead of replacing history

`vuetify-ext add menu-item` is a direct alias for the same command.

## `vuetify-ext create sub-menu`

Creates a reusable submenu file under `src/menu/<name>.*` and immediately adds a card to a parent menu so it is reachable in the UI.

This gives teams a clean way to split large menu trees into smaller, focused menu modules.

### Generated and Updated Files

- creates `src/menu/<name>.*`
- updates the chosen parent menu file

By default, the parent menu is `src/menu/index.*`.

### Scaffold Shape

The generated submenu file:

- exports `create<Name>Menu()`
- uses `$MN(...)`
- includes the standard menu markers
- starts with an empty `children: async () => [ ... ]` block so later CLI menu-item commands can patch it safely

### Interactive Questions

- submenu file name
- submenu title
- parent menu card text
- parent menu card sub text
- icon
- color
- parent menu (`main` or another menu slug)

### Non-Interactive Usage

```bash
vuetify-ext create sub-menu settings --non-interactive --title "Settings" --text "Settings" --sub-text "Open workspace settings tools." --icon mdi-cog-outline --color secondary
```

Supported flags:

- `--name <menu-file-name>`
- `--title <title>`
- `--text <label>`
- `--sub-text <text>`
- `--icon <mdi-icon>`
- `--color <vuetify-color>`
- `--parent <main|menu-name>`
- `--menu-file <relative-or-absolute-path>`

### Parent Menu Patch Behavior

The command:

- locates the parent menu file
- inserts the submenu import
- adds a new `$MI(...)` entry with `action: 'menu'`
- wires `menu: async () => create<Name>Menu()`

If you pass `--parent analytics`, the command looks for `src/menu/analytics.ts` or `src/menu/analytics.js`.

If you pass `--menu-file`, that file is used as the parent menu instead of `--parent`.

### Adding Items Into the Submenu

After the submenu exists, you can target it with the existing menu-item command:

```bash
vuetify-ext create menu-item audit-log --target report --text "Audit Log" --menu-file src/menu/settings.ts
```

## `vuetify-ext create header-item`

Adds a reusable shell widget entry into `src/bootstrap/header.*`.

The command normalizes the bootstrap header file with region markers and then inserts a widget into one of:

- `buildHeaderStart(...)`
- `buildHeaderCenter(...)`
- `buildHeaderEnd(...)`

Supported item kinds:

- `title`
- `environment`
- `status`
- `action`
- `user`

Supported flags:

- `--kind <title|environment|status|action|user>`
- `--region <start|center|end>`
- `--text <label>`
- `--subtitle <text>`
- `--overline <text>`
- `--icon <mdi-icon>`
- `--color <vuetify-color>`

Example:

```bash
vuetify-ext create header-item --non-interactive --kind action --region end --text "Open Help" --icon mdi-help-circle-outline --color secondary
```

## `vuetify-ext doctor`

Runs a structural health check on the current app scaffold.

The doctor currently checks for:

- recommended `src/pages`, `src/menu`, `src/bootstrap`, and `src/api` entry files
- missing standard page exports
- report files that could be migrated to add report markers
- form files that could be migrated to add form markers
- dashboard files that could be migrated to add dashboard markers

Exit behavior:

- exits `0` when the structure is clean
- exits `1` when structural problems or migration opportunities are found

## `vuetify-ext migrate`

Applies safe CLI-focused scaffold migrations.

Current migration actions include:

- add report form markers where possible
- add form part/field markers where possible
- add dashboard section markers where possible
- normalize page `index.*` exports
- replace `AppManager.showUI(trigger)` with `AppManager.showTrigger(trigger)` in source files

Default behavior is preview-only.

Use:

```bash
vuetify-ext migrate --apply
```

## Typical Workflow

A common end-to-end flow is:

1. Bootstrap the host app:

```bash
vuetify-ext bootstrap app
```

2. Create the first page:

```bash
vuetify-ext create report people
```

or:

```bash
vuetify-ext create trigger people
```

or:

```bash
vuetify-ext create collection people
```

or:

```bash
vuetify-ext create dashboard operations
```

3. Register the page in the menu:

```bash
vuetify-ext create menu-item people --target report
```

4. Replace the starter fields, dummy rows, and placeholder labels with your real business logic.

## Notes And Limits

Current assumptions:

- the project uses the recommended `src/pages/<page-name>/` convention
- the main menu is defined in `src/menu/index.ts` or `src/menu/index.js`
- generated page factories follow the naming convention:
  - `create<PageName>Form`
  - `create<PageName>Report`
  - `create<PageName>Trigger`
  - `create<PageName>Collection`

Current limits:

- `create menu-item` patches the recommended menu structure, not arbitrary custom menu architectures
- route scaffolds generate lightweight navigation descriptors, not `vue-router` `RouteRecordRaw` objects
- trigger/report action scaffolders currently focus on side-action buttons
- the generated trigger uses starter in-memory rows and should be replaced for production use

## Planned Growth

Good next candidates for future CLI commands are:

- `vuetify-ext create selector`
- `vuetify-ext create mailbox-view`
- `vuetify-ext create notification-template`
- `vuetify-ext create footer-item`
- `vuetify-ext create dashboard-binding`
