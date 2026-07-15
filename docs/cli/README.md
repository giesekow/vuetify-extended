# CLI

This section documents the `vuetify-ext` package CLI.

The CLI is intended to reduce the setup cost for host apps and, over time, provide repeatable scaffolding for common `vuetify-extended` workflows.

## Current Scope

The first implemented command is:

```bash
vuetify-ext bootstrap app
```

This command scaffolds the recommended `vuetify-extended` host-app bootstrap into the current Vue application.

## Command Reference

### `vuetify-ext bootstrap app`

Bootstraps the current Vue app to use:

- `createVuetifyExtendedApp(...)`
- `AppMain`
- the shared dialogs root
- the shared notifications root

The command is interactive by default.

During the interactive flow it can ask for:

- backend type
- API URL
- Keycloak URL
- Keycloak realm
- Keycloak client ID
- Keycloak `onLoad` mode
- optional realtime/socket settings

For automation or CI-style usage, prompts can be disabled with `--non-interactive` and the same values can be supplied through command-line flags.

#### Supported Entry Files

The command currently detects one of:

- `src/main.ts`
- `src/main.js`

If neither exists, the command exits with an error.

#### Generated Files

The command creates a starter folder structure:

- `src/api/index.ts` or `src/api/index.js`
- `src/bootstrap/index.ts` or `src/bootstrap/index.js`
- `src/bootstrap/header.ts` or `src/bootstrap/header.js`
- `src/bootstrap/footer.ts` or `src/bootstrap/footer.js`
- `src/menu/index.ts` or `src/menu/index.js`
- `src/pages/home/index.ts` or `src/pages/home/index.js`
- `src/pages/home/form.ts` or `src/pages/home/form.js`

It also rewrites the detected `src/main.*` entry file.

#### Generated Structure

```text
src/
  api/
    index.ts
  bootstrap/
    index.ts
    header.ts
    footer.ts
  menu/
    index.ts
  pages/
    home/
      index.ts
      form.ts
```

`src/api/index.*`

- exports `createApiConfig()`
- is the intended place for runtime API configuration
- can later grow into service-specific helpers or API modules

`src/bootstrap/index.*`

- exports `createMainApp()`
- exports `initializeBootstrap(...)`
- wraps `createVuetifyExtendedApp(...)`
- assembles the shell, menu, API config, dialogs, and notifications

`src/bootstrap/header.*`

- contains the starter header section factories
- is the intended place for header shell widgets and layout logic

`src/bootstrap/footer.*`

- contains the starter footer section factories
- is the intended place for footer shell widgets and layout logic

`src/menu/index.*`

- exports `createMainMenu()`
- is the intended root menu definition
- can later import additional submenu builders from other files

`src/pages/home/index.*`

- exports the starter page entrypoint
- demonstrates the recommended `pages/<page-name>/index.*` convention
- is the place where the main page report/trigger/collection definition should live

`src/pages/home/form.*`

- contains the starter form used by the page
- demonstrates how larger pages can split logic into extra files

`src/main.*`

- creates Vuetify
- imports the shared package CSS
- mounts:
  - `bootstrap.component`
  - `bootstrap.dialogs`
  - `bootstrap.notifications`
- installs:
  - `vuetify`
  - `bootstrap.plugin`

#### What The Command Preserves

The current implementation preserves common existing setup pieces from the original `main` entry:

- extra non-bootstrap imports
- common `app.use(...)` plugin registrations
- the existing mount selector such as `'#app'` or `'#shell'`
- simple top-level prelude code that appears before the old mount path

Examples of preserved plugin registrations:

- `router`
- `pinia`
- other `app.use(...)` style plugins

#### What The Command Changes

The command intentionally changes the host app to the recommended `vuetify-extended` shell/bootstrap path.

In practice that means the old direct `createApp(App).mount(...)` root flow is replaced by a new root component that renders:

- `bootstrap.component`
- `bootstrap.dialogs`
- `bootstrap.notifications`

This is expected behavior.

#### Flags

```bash
vuetify-ext bootstrap app --dry-run
vuetify-ext bootstrap app --force
vuetify-ext bootstrap app --non-interactive --backend axios --api-url http://127.0.0.1:3000/v1 --keycloak-url http://127.0.0.1:8081 --keycloak-realm foodman --keycloak-client-id foodman-admin-app
```

`--dry-run`

- shows which files would be written
- does not modify the project

`--force`

- overwrites existing generated bootstrap files
- allows regeneration when bootstrap files already exist

`--non-interactive`

- disables follow-up prompts
- expects the necessary backend/API information to come from flags

Supported automation flags:

- `--backend <none|axios|feathers>`
- `--api-url <url>`
- `--keycloak-url <url>`
- `--keycloak-realm <realm>`
- `--keycloak-client-id <clientId>`
- `--keycloak-on-load <login-required|check-sso>`
- `--use-socket <true|false>`
- axios-specific:
  - `--socket-url <url>`
  - `--socket-event <event>`
  - `--socket-auth-mode <auth|query>`
  - `--auth-path <path>`
  - `--refresh-auth-path <path>`
  - `--auth-create-method <get|post|put>`
  - `--auth-refresh-method <get|post|put|patch>`

#### Typical Flow

1. Run:

```bash
vuetify-ext bootstrap app
```

2. Answer the interactive bootstrap prompts, or rerun with `--non-interactive` plus flags if you want an unattended scaffold.

3. Open `src/api/index.*`

- confirm the generated backend configuration
- refine API, Keycloak, or socket settings if needed

4. Open `src/bootstrap/index.*`

- refine the main `AppMain` shell configuration
- adjust dialog and notification defaults

5. Open `src/menu/index.*` and `src/pages/home/index.*`

- shape the root menu
- replace the starter page with the first real page module

6. Start the host app and verify the shell renders correctly.

## Notes And Current Limits

This first version is intentionally focused and conservative.

Current assumptions:

- the host app has a standard `src/main.ts` or `src/main.js`
- the host app uses a recognizable Vue bootstrap pattern
- the host app can move to the `AppMain` shell-driven root
- the recommended project structure is:
  - `src/api`
  - `src/bootstrap`
  - `src/menu`
  - `src/pages/<page-name>`

Current non-goals:

- deeply analyzing arbitrary custom render trees
- preserving every possible `main.ts` coding style
- generating reports, triggers, selectors, dashboards, or forms

Those can be added in later CLI subcommands.

## Planned Growth

This file is intended to grow as the CLI grows.

Likely future sections:

- `vuetify-ext make report`
- `vuetify-ext make trigger`
- `vuetify-ext make dashboard`
- `vuetify-ext make collection`
- `vuetify-ext add menu-item`
- CLI conventions, overwrite rules, and project detection rules
