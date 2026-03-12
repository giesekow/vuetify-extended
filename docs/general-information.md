# General Information

## Overview

`vuetify-extended` is a library for building Vue 3 + Vuetify 3 user interfaces entirely in TypeScript. Instead of writing most UI in `.vue` single-file components, you compose screens using classes and helper factories.

The library is especially oriented toward:

- CRUD/reporting screens
- Form-heavy business applications
- Feathers-backed applications
- axios-backed applications that want the same service-oriented UI contract
- Apps that prefer programmatic UI assembly

## Repository Layout

```text
src/
  api/         Shared Api facade
  axios-api/   Axios-backed API implementation with Keycloak support
  css/         Shared stylesheet shipped with the package
  feathers-api/ Feathers client bootstrap and service helpers
  master/      Shared data model and persistence abstraction
  misc/        Utility helpers
  ui/          Class-based UI toolkit
  declarations Shared app/service contract plus Feathers typing support

lib/
  cjs/         CommonJS build output
  esm/         ES module build output
```

## Main Public Modules

## `ui`

The `ui` module provides the renderable building blocks.

Key exports:

- `Field`
- `Part`
- `Form`
- `Report`
- `Button`
- `Menu`
- `MenuItem`
- `Selector`
- `DialogForm`
- `Collection`
- `Trigger`
- `Dialogs`
- `AppMain`
- `AppManager`

## `master`

The `master` module exports:

- `Master`

This is the shared data model used by forms and reports.

## `api`

The `api` module exports:

- `Api`

This is the shared facade. It does not implement a backend by itself. Instead it manages `Api.instance` and lets you choose a compatible backend with:

- `Api.setup(...)`
- `Api.useFeathers(...)`
- `Api.useAxios(...)`
- `Api.setInstance(...)`

`Api.setup(...)` remains the backwards-compatible Feathers shortcut.

## `feathers-api`

The `feathers-api` module exports:

- `FeathersApi`

It contains the Feathers-specific implementation, Keycloak integration via `feathers-keycloak-connect-client`, and Feathers helper mixins such as `findOne`, `findAll`, and `count`.

## `axios-api`

The `axios-api` module exports:

- `AxiosApi`
- `AxiosApplication`

It contains the axios-specific implementation with:

- a Feathers-like `service(path)` API
- Keycloak token management through `keycloak-js`
- request/refresh handling through axios interceptors

## `misc`

The `misc` module exports utility helpers for:

- validation
- amount formatting
- Excel generation
- printing
- HTML conversion
- general utilities such as `sleep`, `SimpleDate`, `SimpleTime`, `selectFile`, and `fileToBase64`

## Convenience Factories

The library includes short factory aliases for many classes.

| Alias | Creates |
| --- | --- |
| `$FD` | `Field` |
| `$PT` | `Part` |
| `$FM` | `Form` |
| `$BN` | `Button` |
| `$RP` | `Report` |
| `$TG` | `Trigger` |
| `$SL` | `Selector` |
| `$DF` | `DialogForm` |
| `$COL` | `Collection` |
| `$MN` | `Menu` |
| `$MI` | `MenuItem` |
| `$APP` | `AppMain` |

The alias style makes large TypeScript-defined screens shorter and easier to read.

## Core Conventions

## 1. `params` describe configuration

Almost every UI class accepts:

- a `params` object
- an `options` object

Typical split:

- `params`: visual state, flags, dimensions, mode, labels, storage keys
- `options`: functions, behavior hooks, event handlers, data loaders

## 2. `storage` binds a field to `Master`

Fields use nested-property paths such as:

- `name`
- `address.city`
- `udfs.someFieldId`

These paths determine where values are read from and written to in the `Master` data object.

## 3. `mode` drives screen behavior

Common mode values:

- `create`
- `edit`
- `display`

Mode affects:

- readonly behavior
- screen titles
- save flow
- access checks
- collection/report workflow behavior

## 4. `setup` and `on` are common extension points

Instead of subclassing everything, the library often expects behavior through:

- `setup`
- event handler maps via `on`
- callback options like `validate`, `saved`, `access`, `format`, `items`

## 5. Access rules are first-class

Many objects allow `access(...)` functions so screens can decide at runtime whether a user can:

- view
- edit
- print
- export

## Data Persistence Model

The library supports two main persistence styles.

## Remote object persistence

When `Master` has:

- an object type
- an object id or create mode
- a configured `Api.instance`

it can load and save through the active backend service implementation.

## In-memory nested persistence

When a `Master` has a parent, it can manage collection items inside the parent data object without immediate server calls.

This is used for:

- nested collection editing
- subforms
- staged editing before final save

## UI Patterns Present in the Library

Common usage patterns include:

- single-record forms
- multi-step reports
- selection dialogs
- collection editing workflows
- menu-driven navigation
- print and export flows
- UDF-backed dynamic fields

## Notable Integrations

The dependency list shows this package is designed for rich enterprise-style screens. Integrations include:

- Vuetify 3
- Vue 3
- Feathers client
- Socket.IO
- axios
- Keycloak auth
- TinyMCE
- Ace Editor
- ApexCharts
- Google Maps
- `@vuepic/vue-datepicker`
- KaTeX and WebTeX
- ExcelJS

## CSS

The package ships a small shared stylesheet under:

- `lib/esm/css/index.css`
- `lib/cjs/css/index.css`

It covers:

- dense tables
- bordered tables
- report-table behavior
- editor z-index fixes
- select label fixes

Host applications should import the CSS if they use these features.

## Build and Publish

Available npm scripts:

- `npm run build`
- `npm run build-esm`
- `npm run build-cjs`

Build behavior:

- TypeScript compiles source to `lib/esm` and `lib/cjs`
- `src/css` is copied into both outputs

Package entrypoints:

- `main`: `./lib/cjs/index.js`
- `module`: `./lib/esm/index.js`

## Typing Notes

The project includes:

- a shared `Application` / `Service` contract used by the UI layer
- Feathers typing support and declaration augmentation for helper service methods
- local `@types` shims under `src/@types`

This allows the UI layer to treat Feathers and axios-backed clients through the same core interface while still preserving Feathers-specific helper typing.

## Important Practical Notes

## Global APIs

Some functionality relies on global/static state:

- `Api.instance`
- `AppManager`
- `Dialogs`

This is convenient, but it means bootstrap order matters.

Recommended order:

1. `Api.useFeathers(...)`, `Api.useAxios(...)`, or `Api.setup(...)`
2. `AppManager.init()`
3. Create the `AppMain` instance
4. `AppManager.setApp(appMain)`
5. Mount Vue and render the app shell plus `Dialogs` components

## Backend Selection

Recommended choices:

- Use `Api.useFeathers(...)` if your backend already follows Feathers patterns or you need Socket.IO support.
- Use `Api.useAxios(...)` if you want a more general HTTP client while keeping the same UI-facing `service(path)` shape.
- Use `Api.setInstance(...)` if you need to construct a backend implementation manually before assigning it.

## Large Core Files

A few files carry a lot of responsibility:

- `src/ui/field.ts`
- `src/ui/trigger.ts`
- `src/ui/report.ts`
- `src/ui/form.ts`

This makes the library powerful, but these files deserve extra care when refactoring.

## Testing Status

The repository currently has no implemented automated test suite. The `test` script is still a placeholder.

For future maintenance, the highest-value tests would likely cover:

- `Master` save/load/collection behavior
- field-to-master synchronization
- form/report validation and save flows
- selector/collection workflows

## Suggested Mental Model

If you are new to the codebase, think in this order:

1. `Master` holds the data
2. `Field` binds the data
3. `Part` arranges fields
4. `Form` groups parts into a saveable unit
5. `Report` turns forms into a workflow
6. `AppMain` and `AppManager` host the whole application

## Recommended Extension Strategy

When adding new behavior, prefer:

- small option callbacks
- explicit event hooks
- new helper methods
- thin wrappers around existing `Field`, `Form`, or `Report` patterns

Prefer avoiding:

- deep inheritance chains
- direct mutation of unrelated internal refs
- adding more global state when instance-local state will do

## Summary

`vuetify-extended` is a focused application framework for TypeScript-driven Vuetify development. It is at its best when you want your UI to be:

- programmatic
- metadata-friendly
- form-centric
- tightly integrated with a shared object model

For day-to-day usage, use the root `README.md`. For internals, use the architecture document in this folder.
