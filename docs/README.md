# vuetify-extended Documentation

This folder collects project-level documentation for `vuetify-extended`.

## Contents

- [CLI Reference](./cli/README.md)
  Dedicated reference for the `vuetify-ext` scaffolding CLI and future subcommands.

- [API Reference](./api/Index.md)
  Detailed backend/client reference for the shared `Api` facade, `AxiosApi`, and `FeathersApi`.

- [UI Reference](./ui/Index.md)
  Detailed reference pages for the class-based UI layer: app shell, menus, forms, reports, dialogs, fields, and shell widgets.

- [Misc Reference](./misc/Index.md)
  Detailed reference pages for shared helpers such as Excel, validators, print support, and general utilities.

- [Architecture](./architecture.md)
  A deep look at the library structure, data flow, runtime lifecycle, and design tradeoffs.

- [Runtime Guides](./runtime/README.md)
  Practical usage guides for localization, browser/device history, persisted shell restoration, and the planned side-navigation architecture.

- [Runtime Improvements Design Notes](./runtime-improvements.md)
  Design rationale behind localization, history integration, and persisted `AppMain` / `AppManager` navigation state.

- [General Information](./general-information.md)
  A practical reference covering modules, exported factories, conventions, build outputs, and maintenance notes.

- [Test App](../test/README.md)
  A manual Vue 3 + Vuetify playground for exercising the library in a running app.

- [Starter Template](../starter-template/README.md)
  A git-package starter app that mirrors the playground structure for host applications.

## Recommended Reading Order

1. Start with the root [`README.md`](../README.md) for setup and everyday usage.
2. Read [CLI Reference](./cli/README.md) if you want to scaffold a new host app bootstrap through `vuetify-ext`.
3. Read [Architecture](./architecture.md) to understand how the library is organized internally.
4. Read [Runtime Guides](./runtime/README.md) if you are integrating localization, browser/device navigation, or state restoration into a host app.
5. Read [Runtime Improvements Design Notes](./runtime-improvements.md) if you need the lower-level design rationale behind those runtime features.
6. Use [API Reference](./api/Index.md) and [UI Reference](./ui/Index.md) when you need module-level details for params, options, and runtime behavior.
   The most detailed deep-reference pages are currently [Field](./ui/Field.md) and [Dashboard](./ui/Dashboard.md).
7. Use [Misc Reference](./misc/Index.md) for shared helper functions such as Excel, validation, and print utilities.
8. Use [General Information](./general-information.md) as a quick reference while extending the library.
9. Use [Test App](../test/README.md) when you want to manually verify UI workflows.
10. Use [Starter Template](../starter-template/README.md) when you want a clean package-based host app starting point.

## Scope

These docs describe the code currently present in this repository:

- TypeScript-first UI composition on top of Vue 3 and Vuetify 4
- A shared API facade with both Feathers and axios-backed Keycloak integrations
- A setup/bootstrap layer for API, defaults, dialogs, and app-shell wiring
- A growing package CLI for setup and scaffolding
- Class-based screen, form, field, selector, dialog, and menu composition
- Keyboard-first workflow helpers for menus, selectors, dialogs, forms, and reports
- Optional `AppMain` header/footer shell scaffolding, structured regions, background layers, FAB quick actions, and full-screen utility screens
- Global dialogs, notifications, and mailbox-style inbox flows
- Reusable shell widgets such as title blocks, environment tags, status badges, shell action icons, user areas, and mailbox bells
- Rich messagebox rendering with attachments and incremental history loading
- Build outputs published under `lib/cjs` and `lib/esm`
