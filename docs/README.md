# vuetify-extended Documentation

This folder collects project-level documentation for `vuetify-extended`.

## Contents

- [Architecture](./architecture.md)
  A deep look at the library structure, data flow, runtime lifecycle, and design tradeoffs.

- [General Information](./general-information.md)
  A practical reference covering modules, exported factories, conventions, build outputs, and maintenance notes.

- [Test App](../test/README.md)
  A manual Vue 3 + Vuetify playground for exercising the library in a running app.

## Recommended Reading Order

1. Start with the root [`README.md`](../README.md) for setup and everyday usage.
2. Read [Architecture](./architecture.md) to understand how the library is organized internally.
3. Use [General Information](./general-information.md) as a quick reference while extending the library.
4. Use [Test App](../test/README.md) when you want to manually verify UI workflows.

## Scope

These docs describe the code currently present in this repository:

- TypeScript-first UI composition on top of Vue 3 and Vuetify 3
- A shared API facade with both Feathers and axios-backed Keycloak integrations
- A setup/bootstrap layer for API, defaults, dialogs, and app-shell wiring
- Class-based screen, form, field, selector, dialog, and menu composition
- Keyboard-first workflow helpers for menus, selectors, dialogs, forms, and reports
- Rich messagebox rendering with attachments and incremental history loading
- Build outputs published under `lib/cjs` and `lib/esm`
