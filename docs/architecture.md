# Architecture

## Purpose

`vuetify-extended` is a TypeScript-first UI toolkit built on top of Vue 3 and Vuetify 3. Its main goal is to let application developers define screens, forms, and UI behavior in TypeScript classes instead of Vue SFC templates.

The library is not a thin wrapper around Vuetify components. It adds:

- A class-based component model
- A shared data model called `Master`
- Screen orchestration primitives such as `Report`, `Form`, `Collection`, `Selector`, and `MailboxView`
- An application shell and navigation stack via `AppMain` and `AppManager`
- Optional header/footer framing around `AppMain` for full-app layouts, background layers, and FAB quick actions
- Integrated utility support for printing, export, document/image upload, code editing, maps, charts, rich HTML, notifications, and mailbox-style inbox flows

## Architectural Style

The architecture is composed of four main layers.

### 1. UI Composition Layer

This is the class-based rendering system in `src/ui`.

- `UIBase` is the common parent for renderable UI classes.
- `Field` is the smallest major input/display primitive.
- `Part` groups fields and nested parts into grid rows and columns.
- `Form` wraps parts and action buttons inside a card layout.
- `Report` manages one or more forms as a workflow.
- `Menu`, `Selector`, `Collection`, `Trigger`, and `DialogForm` support navigation and workflow variations.
- `AppMain` hosts the currently active screen stack.

### 2. Data Model Layer

This is handled by `src/master/master.ts`.

- `Master` stores object state as plain data.
- Fields bind to `Master` through nested storage paths such as `address.city`.
- `Master` exposes validation, preprocess, postprocess, save, load, and collection mutation helpers.
- UI objects listen to `Master` events and re-sync themselves when the model changes.

### 3. Backend Integration Layer

This is handled by three related modules:

- `src/api` contains the shared `Api` facade
- `src/feathers-api` contains the Feathers implementation
- `src/axios-api` contains the axios implementation

The facade can switch `Api.instance` between compatible backends:

- `Api.useFeathers(...)`
- `Api.useAxios(...)`
- `Api.setInstance(...)`

The Feathers implementation supports:

- REST or Socket.IO transports
- Keycloak support through `feathers-keycloak-connect-client`
- helper service methods such as `findOne`, `findAll`, and `count`

The axios implementation supports:

- a Feathers-like `service(path)` interface
- Keycloak token acquisition and refresh through `keycloak-js`
- bearer-token injection through axios interceptors
- optional Socket.IO realtime routing into `service(path).on(...)` listeners

### 4. Utility Layer

This is handled by `src/misc`.

- Date/time helpers
- File selection and base64 conversion
- Excel export helpers
- Printer integration helpers
- Validation helpers
- Generic utility functions used by fields, reports, and triggers

### 5. Setup Layer

This is handled by `src/setup`.

- `createVuetifyExtendedApp(...)` provides a higher-level bootstrap path
- `configureVuetifyExtendedDefaults(...)` applies project-wide UI defaults
- `validateVuetifyExtendedSetup(...)` checks the most common bootstrap mistakes

This layer does not replace the lower-level primitives. It packages them into a cleaner host-app entrypoint and now works cleanly with the optional `AppMain` header/footer shell.

## High-Level Runtime View

The runtime model looks like this:

```text
AppMain
  -> Menu / Report / Collection / Selector / DialogForm / arbitrary UIBase
      -> Report
          -> Form
              -> Part
                  -> Field
                      -> Master
                          -> Api facade / active backend service
```

Supporting globals:

- `AppManager`: singleton-style runtime coordinator
- `Dialogs`: singleton-style global confirm/snackbar/progress state
- `Notifications`: singleton-style non-blocking toast state
- `Mailbox`: delegated mailbox store/loader/view coordinator
- `EventEmitter`: shared event abstraction used by most classes

Shell additions:

- `AppMain` can optionally render a `VApp` / `VAppBar` / `VMain` / `VFooter` frame
- host apps can inject header/footer content through `header(app)` and `footer(app)` callbacks
- structured shell regions (`headerStart`, `headerCenter`, `headerEnd`, and footer equivalents) make it easier to compose shell widgets
- the shell supports configurable background layers and an optional FAB action launcher

Supporting bootstrap helpers:

- `createVuetifyExtendedApp(...)`
- `createVuetifyExtendedPlugin(...)`
- `configureVuetifyExtendedDefaults(...)`
- `validateVuetifyExtendedSetup(...)`

The bootstrap layer now expects both the dialogs root and the notifications root to be rendered when using the convenience bootstrap path.

## Core Building Blocks

## `BaseComponent` and `UIBase`

`BaseComponent` bridges class instances to Vue's `defineComponent` API.

Responsibilities:

- Exposes `ref`, `h`, and `watch`
- Provides a `component` getter that returns a Vue component definition
- Wires `setup`, `mounted`, `unmounted`, `attachEventListeners`, `removeEventListeners`, and `destructor`

`UIBase` extends this with:

- Parent-child relationships
- `Master` lookup through the parent chain
- An instance identity symbol
- `show`, `hide`, and `forceCancel` hooks for higher-level flow control

This is the foundation that lets the rest of the library stay class-based while still rendering in Vue.

## `Master`

`Master` is the central state object for object editing and viewing.

Responsibilities:

- Store current object data
- Expose nested-path `get` and `set`
- Track object type and id
- Run validation callbacks
- Run preprocess and postprocess callbacks
- Save/load/remove data
- Handle nested collection objects
- Emit change and lifecycle events

### Why `Master` matters

The library avoids local field state as the primary source of truth. Fields mirror values into `Master`, and screens work against that shared model. This gives you:

- A single place to inspect current data
- Cross-field coordination without a global store framework
- Save/load logic independent of visual layout
- Nested collection editing support

## `Field`

`Field` is the most important UI class in the library.

Responsibilities:

- Hold field configuration and runtime state
- Bind one value to one `Master` storage path
- Render a concrete widget based on `type`
- Load options, table data, charts, or collections lazily
- Apply validation rules
- Emit change and focus events
- Support many advanced field modes

Supported field categories include:

- Text inputs: `text`, `password`, `textarea`
- Choice inputs: `select`, `autocomplete`, `listselect`, `boolean`
- Date/time inputs: `date`, `datetime`, `time`
- Numeric inputs: `integer`, `float`, `decimal`
- Files/media: `image`, `document`
- Rich content: `html`, `htmlview`, `code`, `label`, `messagingbox`
- Data display: `table`, `viewtable`, `servertable`, `reporttable`
- Rich integrations: `chart`, `map`, `collection`, `button`, `color`

Some of the heavier field renderers are now split into `src/ui/widgets/field-rich-widgets.ts` so `Field` can keep orchestration responsibilities while richer widget implementations evolve in a more isolated module.

### Binding model

Each field can point to a storage path, for example:

```ts
$FD({
  type: 'text',
  label: 'First Name',
  storage: 'profile.firstName',
})
```

When the field changes:

1. The field preprocesses/postprocesses the input
2. It writes the result to `Master.$set(storage, value)`
3. It emits local events
4. Other listeners can respond

When `Master` changes:

1. The field hears `changed`, `loaded`, or `reset`
2. The field recalculates its displayed value
3. The field updates its own reactive `modelValue`

This pattern is the heart of the library.

## `Part`

`Part` is a layout container that renders a `VCol` containing a `VRow`.

Responsibilities:

- Group multiple fields or nested parts
- Provide responsive grid configuration
- Collect descendant field refs and child part refs
- Propagate `readonly` and `Master` through the hierarchy

Think of `Part` as the structural layout node between `Form` and `Field`.

## `Form`

`Form` represents a card-style editing/viewing unit.

Responsibilities:

- Render title, subtitle, body, and button zones
- Host one or more `Part` trees
- Provide validation across child parts
- Trigger save, previous-step, and cancel flows
- Load user-defined fields (UDFs)
- Respect access and readonly behavior

Forms are usually what a `Report` shows at any given step.

## `Report`

`Report` is the high-level workflow container for object editing or viewing.

Responsibilities:

- Own or inherit a `Master`
- Handle access rules for screen, print, and export
- Create forms on demand
- Load the current object through `Master`
- Coordinate multi-form navigation
- Keep previous-step navigation separate from true cancellation
- Provide print/export actions
- Emit lifecycle events such as `loaded`, `saved`, and `finished`

Reports are the main screen-level abstraction for CRUD-style work.

### Multi-step action model

In the current report design:

- `Cancel` exits the report
- `Prev` moves back one step when a previous form exists
- `Next` advances to the next step
- `Save` or `Finish` completes the final step
- A final successful save emits `finished`, which `AppMain` treats as a close signal for the active report screen

`Report` can also require confirmation before exit by setting `confirmOnCancel: true`.

The report layer also owns keyboard-oriented workflow behavior:

- `Escape` triggers `Prev` when available, otherwise `Cancel`
- `Ctrl+S` and `Meta+S` trigger the current primary action
- side actions can live in a left or right rail through `sideButtons(...)`
- `sideButtonWidth` controls the width of that rail and its matching small-screen dropdown card
- focus is pushed into the active form when a report step becomes visible

## `Menu`

`Menu` renders a responsive list of `MenuItem` cards. Each item can open:

- Another `Menu`
- A `Report`
- A `Collection`
- A custom callback

This gives the library a lightweight in-app navigation model without introducing a full router dependency. The current menu implementation also supports visible card-selection state plus arrow-key navigation and activation.

## `Selector`

`Selector` is a dialog-based record picker.

Responsibilities:

- Load available options from a service or a callback
- Render a `VAutocomplete`
- Return a selected object or id
- Support single or multiple selection
- Support keyboard confirmation and cancel behavior

Selectors are often used inside collection flows and secondary workflows.

The current selector/dialog model also includes:

- `persistent` configuration with a default of `true`
- focus capture and restore through `AppMain`
- `Enter` to confirm in `Selector`
- `Escape` to cancel in `Selector` and `DialogForm`
- confirm dialog key handling for `Enter` / `Y` and `Escape` / `N`

## `Collection`

`Collection` orchestrates a selector/trigger/report flow for collection editing.

Possible flow:

1. Show a `Trigger` or `Selector`
2. Pick one or many objects
3. Open a `Report` for each selection
4. Continue until editing completes or the flow is cancelled

This is a higher-level controller rather than a single visual widget.

## `DialogForm`

`DialogForm` wraps a `Form` in a `VDialog`.

It is useful when:

- A workflow should stay inside the current screen
- You want save/cancel handling inside a modal
- A full `Report` would be too heavy

Like `Selector`, `DialogForm` now exposes a `persistent` parameter and participates in the shell-level focus restore behavior managed by `AppMain`.

## `AppMain` and `AppManager`

`AppMain` is the shell that holds the active UI stack.

Responsibilities:

- Load the initial menu
- Push and pop `Menu`, `Report`, `Collection`, or generic `UIBase` instances
- Show selectors and dialogs as overlay flows
- Route cancel events back into stack management
- Route report `finished` events back into stack management
- Provide dynamic UDF loading and conversion

`AppManager` is the static coordinator around `AppMain`.

Responsibilities:

- Hold the current app instance
- Hold printer integration
- Expose a shared event channel
- Offer convenience methods like `showReport`, `showMenu`, `showDialog`, `back`, and `reload`

This split gives the library a singleton-like application API while keeping the actual shell instance in `AppMain`. `AppMain` now also owns optional shell framing, global FAB presentation, and the entry point used by shell widgets such as `MailboxBell`.

## Setup Responsibilities

The current setup model has two layers.

Low-level bootstrap:

- configure `Api`
- call `AppManager.init()`
- create `AppMain`
- call `AppManager.setApp(...)`
- render `Dialogs.rootComponent()` at the root

High-level bootstrap:

- call `createVuetifyExtendedApp(...)`
- render `bootstrap.component`
- render `bootstrap.dialogs`
- optionally install `bootstrap.plugin`

The high-level path is now the recommended starting point for host applications because it keeps setup ordering in one place.

## Keyboard Model

Keyboard support is intentionally layered rather than global.

- `Menu` supports item-level shortcuts through `MenuItem.shortcut`
- if multiple menu items claim the same shortcut, the first visible item wins
- nested menus use `Escape` as a back action when no explicit item shortcut handles it
- overlay flows such as `Selector` and `DialogForm` handle their own confirm/cancel shortcuts
- form/report flows handle `Escape`, `Ctrl+S`, and `Meta+S`

This keeps shortcuts close to the workflow object that owns the action, which reduces accidental cross-screen interference.

## Messagebox Rendering Strategy

The `messagingbox` field has started to move toward a richer conversation model.

Current behavior includes:

- sender grouping
- day separators
- timestamps
- system-message rendering
- attachment rendering
- incremental rendering for longer histories

For long histories, the current phase uses incremental prepend rather than true virtualization:

- render only the latest chunk first
- show a `Load earlier messages` control at the top
- preserve scroll position when older messages are prepended

This is a good fit for variable-height message rows, HTML content, and attachments, all of which are harder to virtualize safely than fixed-height tables.

## Event Model

Most classes extend or use `EventEmitter`.

Common patterns:

- `setup`
- `changed`
- `focus-changed`
- `cancel`
- `saved`
- `loaded`
- `selected`
- `before-*` and `after-*`

The event model is heavily used for decoupling:

- Parents react to child save/cancel events
- Forms and reports expose hooks without subclassing everything
- `Master` emits data changes that fields subscribe to

## Data Flow

## Read Flow

```text
Api / parent collection / default values
  -> Master data
  -> Field updateValue()
  -> component-specific widget props
  -> user sees current value
```

## Write Flow

```text
user input
  -> Field.valueChanged()
  -> Field postprocess
  -> Master.$set(storage, value)
  -> Master emits changed events
  -> interested fields/forms update
```

## Save Flow

```text
Form save button
  -> Form validation
  -> Master.validate()
  -> Master.postprocess()
  -> Feathers service create/patch
  -> Master updates stored data
  -> Form/Report saved events
```

## Navigation Flow

```text
MenuItem click / AppManager.showReport()
  -> AppMain pushes UI item
  -> AppMain renders top of stack
  -> user cancels
  -> AppMain removes UI item from stack
  -> previous item becomes active
```

## Dialog and Notification Flow

There are two dialog systems:

- `DialogForm` for form-based modal workflows
- `Dialogs` for global confirm/snackbar/progress UI

`Dialogs` is stateful and static. You render its components once near the application root and then call static methods such as:

- `Dialogs.$confirm(...)`
- `Dialogs.$success(...)`
- `Dialogs.$error(...)`
- `Dialogs.$warning(...)`
- `Dialogs.$showProgress(...)`

## Extensibility Model

The library prefers constructor-time options and event callbacks over subclass-heavy inheritance.

Common extension points:

- `setup`
- `on`
- `validate`
- `access`
- `changed`
- `format`
- `load`
- `items`
- `headers`
- `form`
- `report`
- `menu`

This produces a fairly composable API, even though the codebase is class-based.

## `Notifications` and `Mailbox`

The runtime now includes two non-form feedback/inbox systems alongside `Dialogs`:

- `Notifications` is a non-blocking toast manager with a mounted root component, queued cards, optional action buttons, and configurable opaque/translucent surface styling.
- `Mailbox` is a delegated inbox abstraction. The library owns the mailbox UI and interaction model, while the host app supplies `load`, `viewItem`, unread counting, and optional mutation handlers.

`MailboxView` extends `UIBase`, so it can be opened through `AppManager.showUI(...)` and behaves like other stack-based screens. `MailboxBell` is a shell widget that simply opens `MailboxView` and shows the unread badge in the shell.

## API Backend Strategy

The project now uses an adapter-style API abstraction.

### Shared contract

The UI layer only depends on a small common surface:

- `Api.instance.service(path)`
- service methods like `findAll`, `findOne`, `count`, `get`, `create`, `patch`, and `remove`
- auth helpers such as `login`, `logout`, and `reAuthenticate`

This lets the UI remain backend-agnostic as long as the active client satisfies the shared contract.

### Feathers path

`FeathersApi` remains the most natural fit for Feathers-based applications:

- richer native Feathers compatibility
- service mixin helpers
- socket support

### Axios path

`AxiosApi` is intended for general-purpose HTTP APIs that still want:

- the same `Api.instance.service(...)` style
- Keycloak-backed bearer auth
- backend swapping without changing the UI layer

## Packaging and Distribution

The project ships:

- Source under `src/`
- Shared facade under `src/api`
- axios backend under `src/axios-api`
- Feathers backend under `src/feathers-api`
- manual playground under `test/`
- ESM output under `lib/esm`
- CJS output under `lib/cjs`
- shared CSS copied into both output trees

The package root re-exports:

- `ui`
- `api`
- `axios-api`
- `feathers-api`
- `master`
- `misc`

## Strengths of the Design

- Strong TypeScript-first workflow
- Centralized data model for forms
- Very flexible field system
- Good fit for metadata-driven CRUD applications
- Reduced need for Vue SFC authoring
- Built-in accommodation for selection flows, collections, printing, and exports

## Tradeoffs and Constraints

- Large central classes, especially `Field`, increase maintenance cost
- Lifecycle and event wiring are more manual than idiomatic Composition API Vue
- The architecture is opinionated around Feathers + Keycloak-backed business apps
- Static coordinators (`AppManager`, `Dialogs`) simplify usage but increase global coupling
- The project currently does not include an automated test suite, but it does include a manual `test/` playground for UI verification

## Good Fit

This architecture fits best when you want:

- Business CRUD applications
- Dynamic forms
- Metadata-driven UIs
- Strong TypeScript control over screen assembly
- Reusable screen primitives that can be composed programmatically

## Less Ideal Fit

This architecture is less ideal for:

- Highly custom visual experiences driven primarily by templates
- Apps that already rely heavily on idiomatic Vue Composition API patterns
- Situations where fine-grained tree-shaking of many field integrations is critical

## Summary

`vuetify-extended` is best understood as an application framework built on Vuetify, not just a component helper package. Its center of gravity is:

- `Master` for state
- `Field` for binding and rendering
- `Form` and `Report` for screen composition
- `AppMain` and `AppManager` for orchestration

Once that model clicks, the rest of the codebase becomes much easier to navigate and extend.
