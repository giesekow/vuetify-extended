# Runtime Improvements Design Notes

This document records the current design decisions for three related runtime improvements:

1. multi-language UI support
2. browser/device history integration
3. persisted `AppMain` / `AppManager` navigation state across refresh and app resume

The goal of this document is to give implementation-ready direction without changing runtime code yet.

## Why These Three Features Belong Together

These features touch the same part of the runtime:

- `AppMain` is the mounted shell and stack host
- `AppManager` is the global coordinator that pushes screens into the active shell
- many screens and widgets expose user-visible text that should eventually be translated
- browser history and device back behavior must reflect the same internal stack
- persisted state must serialize the same navigation model used by history integration

The architectural rule is:

- renderable UI instances stay runtime objects
- navigation, history, and persistence operate on lightweight serialized descriptors
- localization is resolved through a shared runtime adapter instead of hardcoding translations inside individual widgets

## 1. Multi-Language UI Support

### Problem

Today most UI text is passed as plain strings directly to:

- `Field`
- `Button`
- `Form`
- `Report`
- `Trigger`
- `MenuItem`
- `Dialogs`
- dashboard widgets
- shell widgets such as `AppTitleBlock`, `EnvironmentTag`, `StatusBadge`, and `UserArea`

This works for single-language applications but makes it hard to:

- switch locale reactively
- share one translation strategy across all widgets
- localize built-in labels such as `Save`, `Cancel`, `Close`, `Next`, `Previous`, and validation errors
- support RTL layout hints and locale-aware formatting consistently

### Decision

The library will add a global i18n adapter instead of coupling the runtime to one specific translation package.

The adapter will be configured once during bootstrap and reused throughout the UI layer.

### Planned Adapter Shape

```ts
interface VuetifyExtendedI18nAdapter {
  localeRef?: Ref<string>;
  t?: (key: string, values?: Record<string, any>) => string;
  formatDate?: (value: any, options?: any) => string;
  formatNumber?: (value: number, options?: any) => string;
  formatCurrency?: (value: number, options?: any) => string;
  isRTL?: (locale?: string) => boolean;
}
```

This will most likely be exposed through a setup-level helper such as:

```ts
setVuetifyExtendedI18n(...)
```

or as part of:

```ts
configureVuetifyExtendedDefaults(...)
```

### Planned UI Text Contract

User-visible text params should gradually support three forms:

```ts
type UIText =
  | string
  | {
      key: string;
      fallback?: string;
      values?: Record<string, any>;
    }
  | (() => string);
```

### Meaning

- `string`
  Backwards-compatible literal text.
- `{ key, fallback, values }`
  Translation-aware text resolved through the global adapter.
- `() => string`
  Dynamic text resolved at render time.

### Resolution Rules

The shared resolver should behave like this:

1. if the value is a plain string, return it unchanged
2. if the value is a function, execute it
3. if the value is a translation object:
   - call the configured `t(key, values)` if available
   - if the translation result is empty, use `fallback`
   - if no adapter exists, use `fallback || key`

This keeps translation support additive and non-breaking.

### Scope of First Implementation

The first implementation should cover all common runtime text surfaces:

- button text
- field labels, placeholders, hints, helper text, and empty states
- report titles and action buttons
- trigger titles and action buttons
- selector and collection text
- dashboard titles, subtitles, labels, empty-state messages, and widget captions
- shell widgets and profile/menu labels
- `Dialogs` built-in titles and buttons
- built-in validation and common runtime messages

### Formatting Hooks

The i18n adapter should also expose locale-aware formatting hooks for:

- dates
- times
- numbers
- currencies

This avoids each widget inventing its own formatting strategy.

### RTL Direction

Locale support is not complete without direction support.

The adapter should therefore also expose:

- current locale through `localeRef`
- an RTL test such as `isRTL(locale)`

This can later be used to influence:

- shell alignment
- field and label layout
- drawer placement
- dashboard and table alignment defaults

### Implementation Guidance

- keep plain strings working everywhere
- centralize resolution in shared helpers on `UIBase` or a nearby runtime utility
- do not force a dependency on `vue-i18n`
- do not require translation keys for every string
- make locale changes reactive when `localeRef` changes

### Explicit Non-Goals for the First Iteration

- automatic translation extraction
- compile-time translation tooling
- automatic machine translation
- full RTL redesign of every widget on day one

## 2. History Navigation Integration

### Problem

Applications built with `AppMain` often behave like single-page workflows:

- menus open reports
- reports open collections
- collections open triggers
- dashboards and dialogs sit inside the same shell

Internally, `AppMain` keeps a stack, but browser back/forward buttons do not yet map cleanly to that stack.

This leads to two usability problems:

- browser back/forward feels disconnected from the app workflow
- device back behavior in Capacitor/mobile contexts is not formally aligned with the same navigation model

### Decision

History integration will be built on serialized navigation entries rather than persisted live UI instances.

### Planned Navigation Entry Shape

```ts
interface NavigationEntry {
  id: string;
  type: 'menu' | 'report' | 'trigger' | 'collection' | 'dashboard' | 'dialog' | 'ui';
  key: string;
  title?: string;
  mode?: 'create' | 'edit' | 'display';
  params?: any;
  state?: any;
}
```

### Meaning

- `id`
  Unique stack/history entry id.
- `type`
  Kind of screen being restored.
- `key`
  Registry key used to reconstruct the screen.
- `title`
  Optional metadata for debugging, analytics, and future document-title support.
- `mode`
  Screen mode when applicable.
- `params`
  Serializable route/navigation params.
- `state`
  Optional serializable screen state snapshot.

### Source of Truth

The `AppMain` stack will remain the source of truth.

Browser history and device back adapters will mirror the stack instead of replacing it.

This means:

- `AppManager.showReport(...)` pushes a new stack entry and updates history
- `AppManager.showTrigger(...)` pushes a new stack entry and updates history
- `AppManager.showCollection(...)` pushes a new stack entry and updates history
- `AppManager.showUI(...)` may also participate when the screen is registered and serializable
- browser `popstate` requests restoration of a prior stack state
- in-app back actions should keep browser history in sync rather than mutating only the internal stack

### Screen Registry Requirement

History and persistence cannot reliably restore arbitrary UI instances.

A registry is therefore required.

### Planned Registry Shape

```ts
interface NavigationRegistryEntry {
  key: string;
  type: NavigationEntry['type'];
  create: (entry: NavigationEntry) => Promise<any> | any;
}
```

Planned runtime helpers will likely look like:

```ts
AppManager.registerScreen(...)
AppManager.unregisterScreen(...)
AppManager.resolveScreen(...)
```

### Why the Registry Is Required

The browser and storage layers can only restore:

- a report named `people-report`
- a trigger named `people-trigger`
- a dashboard named `ops-dashboard`

They cannot restore:

- ad-hoc closures
- Vue refs
- in-memory callbacks
- class instances containing non-serializable runtime state

### Web History Behavior

For normal browser environments:

- `history.pushState(...)` should be used for forward navigation
- `history.replaceState(...)` should be used when replacing the current screen
- `popstate` should trigger stack restoration

The browser history payload should remain small and refer to the same serialized navigation entry shape.

### Capacitor / Device Back Behavior

In Capacitor or similar device shells, browser history is not enough.

A separate environment adapter should intercept hardware back behavior and map it into `AppMain.$back()`.

The same navigation entry shape is still used. Only the back-button environment integration changes.

The default design direction is:

- web uses browser history integration
- Capacitor adds hardware back integration
- both environments share the same `NavigationEntry` and registry model

### First Iteration Scope

The first history-aware implementation should support:

- `Menu`
- `Report`
- `Trigger`
- `Collection`
- `Dashboard`

Dialogs may be added later once the base stack model is stable.

### Explicit Non-Goals for the First Iteration

- full vue-router replacement
- arbitrary deep-link URL routing for every screen
- serializing completely custom unregistered `UIBase` instances
- supporting every modal/dialog edge case on day one

## 3. Persisted Stack Across Refresh or App Resume

### Problem

When the web page refreshes, the current `AppMain` stack is lost and the app returns to its initial screen, usually the main menu.

This is also relevant for device shells such as Capacitor, where an app may:

- be backgrounded
- be resumed later
- be restarted by the system

Without persistence, users lose workflow context.

### Decision

Persistence will reuse the same serialized navigation model used by history integration.

Live UI instances will not be persisted.

### Planned Snapshot Shape

```ts
interface AppSnapshot {
  version: 1;
  savedAt: number;
  stack: NavigationEntry[];
}
```

This snapshot will represent:

- the current stack order
- serializable screen params
- optional serializable per-screen state

### Storage Adapter Strategy

Persistence will use a pluggable storage adapter rather than hardcoding one browser-only solution.

### Planned Adapter Shape

```ts
interface NavigationPersistenceAdapter {
  load(): Promise<AppSnapshot | undefined>;
  save(snapshot: AppSnapshot): Promise<void>;
  clear(): Promise<void>;
}
```

### Recommended `storageMode`

The library should support a declarative storage mode option with runtime auto-detection.

### Planned Modes

```ts
type NavigationStorageMode =
  | 'web-session'
  | 'web-local'
  | 'capacitor-preferences'
  | 'custom';
```

### Default Behavior

Recommended default behavior:

- if Capacitor is detected, default to `capacitor-preferences`
- otherwise default to `web-session`

This is the preferred decision because:

- `sessionStorage` is a good default for normal browser workflows
- Capacitor `Preferences` is more reliable than relying purely on WebView session semantics
- the snapshot model stays the same across environments

### What Should Be Persisted

Safe candidates for persistence:

- screen type
- screen key
- report/trigger/dashboard mode
- object id
- current report step
- small `Master` payloads when explicitly allowed
- filter state or selected ids when explicitly allowed

### What Must Not Be Persisted by Default

- raw class instances
- Vue refs
- `File` objects
- large base64 uploads
- sockets
- auth/session provider objects
- arbitrary callbacks
- large query result tables

### Per-Screen Persistence Hooks

Not every screen should persist the same amount of state.

Some screens will need only:

- `objectId`
- `mode`
- `currentStep`

Others may want selected filters or partial form drafts.

The planned model therefore includes optional per-screen serialization hooks.

### Planned Hook Direction

```ts
serializeState?: () => any;
restoreState?: (state: any) => Promise<void> | void;
persistState?: boolean | 'default' | 'local';
excludeFromRestore?: boolean;
```

These hooks should be available on the registry-backed screen descriptors rather than being hardwired into storage directly.

### Meaning

- `false`
  Do not persist extra screen state for this entry.
- `true`
  Persist using the active app-level default storage behavior.
- `'default'`
  Explicitly persist using the active app-level default storage behavior.
- `'local'`
  Request longer-lived persistence intent than the default session-style browser behavior.

This override is intentionally storage-intent only.

It should not replace the app-level adapter selection logic.

That means:

- the application still decides the actual adapter through `storageMode`
- browser environments may interpret `'local'` as `localStorage`
- Capacitor environments may interpret `'local'` as the longer-lived device-backed persistence option
- screens should not choose low-level adapter implementations directly

### Lifecycle Events That Should Save State

Persistence should be updated when:

- the active stack changes
- the active screen is replaced
- a restorable screen updates meaningful state
- the app is backgrounded or paused
- the browser unload lifecycle occurs

Saving can be debounced for frequent state updates, but major navigation changes should save immediately.

### Restore Strategy

Restore should happen during app bootstrap:

1. initialize the shell
2. initialize the navigation registry
3. load the last snapshot from the selected adapter
4. restore only entries whose keys are registered
5. if restore fails, fall back safely to the main menu or configured startup screen

This ensures refresh persistence does not leave the app stuck in an unrecoverable state.

### Capacitor-Specific Persistence Notes

The same snapshot format should be used in both browser and Capacitor environments.

The difference is the adapter:

- browser defaults to `sessionStorage`
- browser can optionally use `localStorage`
- Capacitor should use `@capacitor/preferences` by default

This means Capacitor does not need a separate navigation architecture.

It only needs:

- a different persistence adapter
- a hardware-back adapter

### Relationship Between History and Persistence

These systems must not drift apart.

The implementation should therefore follow this model:

- `AppMain` stack is authoritative
- history mirrors the stack for interactive back/forward behavior
- persistence mirrors the stack for refresh/resume behavior
- both history and persistence use the same `NavigationEntry`
- both rely on the same registry for reconstruction

### Recommended Implementation Order

The most stable order is:

1. shared navigation entry type
2. screen registry
3. browser/device history integration
4. persistence adapter with `storageMode` and Capacitor auto-detection
5. screen state serialization hooks
6. global i18n adapter and text resolution rollout

This order reduces regressions because:

- history and persistence depend on the same serialized entry shape
- i18n is mostly orthogonal once the runtime coordination model is clear

## Final Decisions Recorded Here

The following choices are now considered the preferred direction for implementation:

- use a global, library-level i18n adapter instead of requiring one specific translation package
- support text as `string | translation-object | function`
- keep `AppMain` stack as the source of truth
- represent history/persistence state with serializable navigation entries
- require a registry for restoring reports, triggers, collections, dashboards, menus, and other supported screens
- default persistence to `web-session` in browser environments
- auto-detect Capacitor and default persistence to `capacitor-preferences`
- treat persistence as an adapter problem, not a separate mobile-only navigation architecture
- persist only lightweight serializable state by default

## Remaining Decisions to Confirm During Implementation

These are not blockers for documentation, but they should be finalized when coding begins:

- exact public setup API name for configuring the i18n adapter
- exact public API name for registering restorable screens
- whether root-level browser back on the first screen should:
  - do nothing
  - return to the startup menu
  - allow the browser to leave the app context
- whether dialogs should join history/persistence in phase 1 or phase 2
- whether per-screen persistence hooks live on:
  - screen classes
  - registry entries
  - or both

At the moment, the preferred direction is:

- phase 1 excludes dialog history restoration
- per-screen persistence hooks should live primarily on registry entries or registry-backed descriptors
