# vuetify-extended Documentation

This folder collects project-level documentation for `vuetify-extended`.

## Contents

- [API Reference](./api/Index.md)
  Detailed backend/client reference for the shared `Api` facade, `AxiosApi`, and `FeathersApi`.

- [UI Reference](./ui/Index.md)
  Detailed reference pages for the class-based UI layer: app shell, menus, forms, reports, dialogs, fields, and shell widgets.

- [Misc Reference](./misc/Index.md)
  Detailed reference pages for shared helpers such as Excel, validators, print support, and general utilities.

- [Architecture](./architecture.md)
  A deep look at the library structure, data flow, runtime lifecycle, and design tradeoffs.

- [General Information](./general-information.md)
  A practical reference covering modules, exported factories, conventions, build outputs, and maintenance notes.

- [Test App](../test/README.md)
  A manual Vue 3 + Vuetify playground for exercising the library in a running app.

- [Starter Template](../starter-template/README.md)
  A git-package starter app that mirrors the playground structure for host applications.

## Recommended Reading Order

1. Start with the root [`README.md`](../README.md) for setup and everyday usage.
2. Read [Architecture](./architecture.md) to understand how the library is organized internally.
3. Use [API Reference](./api/Index.md) and [UI Reference](./ui/Index.md) when you need module-level details for params, options, and runtime behavior.
4. Use [Misc Reference](./misc/Index.md) for shared helper functions such as Excel, validation, and print utilities.
5. Use [General Information](./general-information.md) as a quick reference while extending the library.
6. Use [Test App](../test/README.md) when you want to manually verify UI workflows.
7. Use [Starter Template](../starter-template/README.md) when you want a clean package-based host app starting point.

## Scope

These docs describe the code currently present in this repository:

- TypeScript-first UI composition on top of Vue 3 and Vuetify 3
- A shared API facade with both Feathers and axios-backed Keycloak integrations
- A setup/bootstrap layer for API, defaults, dialogs, and app-shell wiring
- Class-based screen, form, field, selector, dialog, and menu composition
- Keyboard-first workflow helpers for menus, selectors, dialogs, forms, and reports
- Optional `AppMain` header/footer shell scaffolding, structured regions, background layers, and FAB quick actions
- Global dialogs, notifications, and mailbox-style inbox flows
- Reusable shell widgets such as title blocks, environment tags, status badges, user areas, and mailbox bells
- Rich messagebox rendering with attachments and incremental history loading
- Build outputs published under `lib/cjs` and `lib/esm`
