# AppManager

Static coordinator used by host apps and library internals to initialize, register, and switch the current `AppMain` screen stack.

## Source

- [src/ui/appmanager.ts](../../src/ui/appmanager.ts)

## Highlights

- Provides `showMenu`, `showReport`, `showTrigger`, `showCollection`, and `showUI` entry points.
- Provides shell-level `showLeftMenu` / `showRightMenu` APIs for drawer navigation.
- Acts as the bridge between independent UI objects and the mounted `AppMain` instance.
- Exposes app/setup state used by bootstrap validation.
- Provides the registry and serialization bridge used by `AppMain` history/persistence restore.
- Normalizes grouped `navigation: { ... }` metadata and auto-registration behavior for factory-based screens.
- Emits app lifecycle events such as `beforeLoad`, `loaded`, and `ready` for global startup observers.

Practical guides:

- [Navigation](../runtime/Navigation.md)
- [Persistence](../runtime/Persistence.md)
- [Side Navigation](../runtime/SideNavigation.md)

## Reference

### `AppManager`

```ts
export class AppManager {
  // see source for full implementation
}
```

## Key Methods

- `static init()`
- `static setApp(app: AppMain)`
- `static on(name, listener, reference?)`
- `static once(name, listener, reference?)`
- `static emit(name, data?)`
- `static showMenu(menuOrFactory, params?: any)`
- `static showLeftMenu(menuOrFactory, params?: any)`
- `static showRightMenu(menuOrFactory, params?: any)`
- `static hideLeftMenu()`
- `static hideRightMenu()`
- `static clearLeftMenu()`
- `static clearRightMenu()`
- `static toggleLeftMenu()`
- `static toggleRightMenu()`
- `static refreshLeftMenu()`
- `static refreshRightMenu()`
- `static showReport(reportOrFactory, params?: any, replace?: boolean)`
- `static showTrigger(triggerOrFactory, params?: any, replace?: boolean)`
- `static showCollection(collectionOrFactory, params?: any, replace?: boolean)`
- `static showUI(uiOrFactory, params?: any, replace?: boolean)`
- `static registerScreen(key, entry)`
- `static unregisterScreen(key)`
- `static resolveScreenRegistration(key)`
- `static attachNavigation(item, template)`
- `static prepareScreenTarget(type, target, params?)`
- `static buildNavigationEntry(type, item, params?, existingEntry?)`
- `static resolveNavigationEntry(entry)`
- `static cacheNavigationItem(entryId, item)`
- `static clearNavigationCache(entryId?)`

## App Lifecycle Events

`AppManager` exposes three global startup lifecycle events emitted by the active `AppMain`:

- `beforeLoad`
  Fired when `AppMain` begins its startup/reload sequence.
- `loaded`
  Fired after the startup target has been resolved and the app has entered the loaded state.
- `ready`
  Fired after `loaded` and one Vue `nextTick()`, making it the best hook for “the shell is mounted and stable”.

Example:

```ts
AppManager.on('beforeLoad', (app) => {
  console.log('App is starting', app)
})

AppManager.on('loaded', (app) => {
  console.log('Startup target resolved', app)
})

AppManager.on('ready', (app) => {
  console.log('App is ready for post-mount work', app)
})
```

Ordering guarantee:

1. matching `AppOptions` callback on `AppMain`
2. matching `AppManager.on(...)` / `AppManager.once(...)` listeners

## Deep-Link Use Case

One of the best uses for these global app lifecycle events is deep-link handling.

Recommended approach:

1. use `beforeLoad` to inspect the incoming URL, route, query, or host-app intent
2. normalize that into a small pending instruction
3. use `ready` to execute the final `AppManager.showReport(...)`, `showTrigger(...)`, `showCollection(...)`, or `showUI(...)`

This is usually better than navigating immediately during bootstrap because it avoids races with:

- `home` startup behavior
- persisted navigation restore
- shell rendering
- side navigation and header/footer setup
- translation adapter initialization

Example:

```ts
let pendingDeepLink: undefined | { type: 'trigger'; workspaceId: string }

AppManager.on('beforeLoad', () => {
  const params = new URLSearchParams(window.location.search)
  const workspaceId = params.get('workspace')
  if (workspaceId) {
    pendingDeepLink = { type: 'trigger', workspaceId }
  }
})

AppManager.on('ready', () => {
  if (!pendingDeepLink) {
    return
  }

  const deepLink = pendingDeepLink
  pendingDeepLink = undefined

  if (deepLink.type === 'trigger') {
    AppManager.showTrigger(
      (entry) => createAuditTrigger(entry?.mode || 'edit')(entry),
      {
        navigation: {
          key: 'pages.audit.trigger.edit',
          params: { workspaceId: deepLink.workspaceId },
          persist: true,
        },
      },
    )
  }
})
```

If the host app already has its own router or native deep-link bridge, you can still use the same lifecycle pattern: capture intent early, execute library screen navigation in `ready`.

## Navigation Registry

`AppManager` now owns the screen registry used to restore screens from serialized navigation entries.

Typical flow:

1. register a screen factory with `registerScreen(...)`
2. navigate using `showReport(...)`, `showTrigger(...)`, `showCollection(...)`, or `showUI(...)` and provide navigation metadata
3. `AppMain` stores a serializable `NavigationEntry`
4. on browser back/forward or persisted restore, `AppManager.resolveNavigationEntry(...)` recreates the UI object through the registered factory

Minimal shape:

```ts
AppManager.registerScreen('reports.customer-edit', {
  type: 'report',
  create: async (entry) => {
    return buildCustomerReport(entry.params?.mode, entry.params?.objectId)
  },
  serializeState: async (report, entry) => {
    return {
      currentStep: report.currentStepRef.value,
    }
  },
  restoreState: async (report, state) => {
    if (state?.currentStep) {
      // host-controlled restore logic
    }
  },
  persistState: true,
})
```

## Preferred Navigation-First Usage

For new code, `AppManager.show...(...)` works best with:

- a factory function instead of a pre-created instance
- grouped navigation metadata under `params.navigation`

Example:

```ts
AppManager.showTrigger(
  (entry) => buildAuditTrigger(entry?.params?.workspaceId),
  {
    navigation: {
      key: 'triggers.audit',
      params: { workspaceId },
      persist: true,
    },
  },
)
```

Behavior:

- if `navigation.key` is present and a registration already exists, it is reused
- if `navigation.key` is present and the target is a factory, `AppManager` auto-registers or refreshes the screen definition for restore
- if `navigation.key` is present but the target is only an instance and no registration exists, the screen still works in-session but is excluded from refresh/resume restore and a dev warning is emitted
- when the same key is registered again, the newest registration wins

Backward-compatible flat navigation fields such as `navigationKey` and `navigationParams` are still accepted, but grouped `navigation` is preferred.

Grouped `navigation` also supports inline restore helpers:

- `serializeState`
- `restoreState`
- `resolveTitle`
- `persist`
- `excludeFromRestore`

These map into the same internal registration/entry model used by explicit `registerScreen(...)`.

## What `buildNavigationEntry(...)` Does

When `AppMain` pushes a screen, it asks `AppManager.buildNavigationEntry(...)` to normalize:

- entry id
- screen type
- registry key
- title
- mode
- serializable params
- serializable state
- persistence intent

This keeps stack history and persistence snapshots consistent across screen types.
