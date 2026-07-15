# AppManager

Static coordinator used by host apps and library internals to initialize, register, and switch the current `AppMain` screen stack.

## Source

- [src/ui/appmanager.ts](../../src/ui/appmanager.ts)

## Highlights

- Provides `showMenu`, `showReport`, `showTrigger`, `showCollection`, and `showUI` entry points.
- Acts as the bridge between independent UI objects and the mounted `AppMain` instance.
- Exposes app/setup state used by bootstrap validation.
- Provides the registry and serialization bridge used by `AppMain` history/persistence restore.

Practical guides:

- [Navigation](../runtime/Navigation.md)
- [Persistence](../runtime/Persistence.md)

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
- `static showMenu(menuOrFactory, params?: any)`
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

Backward-compatible flat navigation fields such as `navigationKey` and `navigationParams` are still accepted, but grouped `navigation` is preferred.

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
