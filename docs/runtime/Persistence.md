# Persistence

This guide explains how `AppMain` stack persistence works across:

- browser refresh
- browser tab resume
- Capacitor/device app resume

It focuses on what gets saved, what should not be saved, and how to choose storage behavior.

## The Core Rule

Persistence stores serialized navigation entries, not live UI instances.

This is the most important concept.

The runtime does not attempt to save actual class instances such as:

- `Report`
- `Trigger`
- `Collection`
- `Dashboard`
- arbitrary `UIBase` objects

Instead, it saves the information needed to rebuild them.

## When Persistence Runs

When enabled, persistence is updated after:

- stack changes
- major navigation updates
- unload/background lifecycle events

On load, `AppMain` can attempt to restore the most recent saved snapshot before falling back to the root menu.

## App-Level Configuration

Persistence is configured through `AppNavigationOptions`:

```ts
navigation: {
  history: true,
  persist: true,
  restoreOnLoad: true,
  storageMode: 'web-session',
}
```

Meaning:

- `persist`
  Enables saving snapshots.
- `restoreOnLoad`
  Attempts to restore the saved stack during bootstrap.
- `storageMode`
  Chooses the underlying storage backend.

## Storage Modes

Supported public modes:

- `'web-session'`
- `'web-local'`
- `'capacitor-preferences'`
- `'custom'`

### Recommended Choices

Use `'web-session'` when:

- you want restore during the current browser session
- you do not want long-lived persistence across fully closed browser sessions

Use `'web-local'` when:

- you want longer-lived browser persistence
- it is acceptable for users to return to the same stack later

Use `'capacitor-preferences'` when:

- your host app runs in Capacitor/device environments
- you want durable app-level restore behavior

Use `'custom'` when:

- you need a project-specific persistence adapter
- your storage/security constraints differ from the built-in modes

## Default Behavior

The runtime chooses a sensible default:

- browser environments default to `web-session`
- Capacitor environments default to `capacitor-preferences`

This gives most apps reasonable behavior without custom setup.

## What Should Go Into Persisted State

Persist:

- screen identity
- ids
- modes
- filter params
- tab index
- current step
- small serializable UI state

Do not persist:

- large fetched datasets unless truly necessary
- non-serializable objects
- open network handles
- DOM references
- file objects
- functions or closures

## `persistState`

Each screen entry can influence persistence with:

```ts
persistState?: boolean | 'local'
```

### Meaning

- `false`
  Keep the entry in the restored stack, but do not save or restore its extra serialized screen state.
- `true`
  Save and restore the entry's extra serialized screen state using normal app-level persistence behavior.
- `'local'`
  Request longer-lived intent than short session-only behavior.

`'default'` is also still accepted as a backwards-compatible alias for the normal/default behavior.

The final adapter still decides what `'local'` means technically, but this gives the screen a clear persistence intent.

## `excludeFromRestore`

Each screen entry can also opt out of refresh/resume restoration entirely:

```ts
excludeFromRestore?: boolean
```

### Meaning

- `false` or omitted
  Include the entry in refresh/resume restore snapshots when it is reconstructable.
- `true`
  Remove the entry from refresh/resume restore snapshots entirely.

## Important Difference: History vs Persistence

History and persistence share the same entry model, but they are not identical.

The runtime deliberately keeps this distinction:

- browser history includes non-persisted entries inside the current session
- persisted snapshots include reconstructable entries by default
- `persistState === false` suppresses extra saved state only
- `excludeFromRestore === true` removes the entry entirely from refresh/resume restore

This is important because some screens are useful for session navigation but unsafe or noisy to restore after a refresh.

Examples:

- temporary splash/transition screens
- ephemeral helper screens
- non-restorable transient UIs

## Typical Good Pattern

```ts
AppManager.showReport(
  (entry) => buildOrderReport(entry?.params?.mode, entry?.params?.orderId),
  {
    navigation: {
      key: 'reports.order-edit',
      params: {
        orderId,
        mode: 'edit',
      },
      persist: true,
      serializeState: async (report) => ({
        currentStep: report.currentStepRef.value,
      }),
      restoreState: async (report, state) => {
        if (typeof state?.currentStep === 'number') {
          report.currentStepRef.value = state.currentStep;
        }
      },
    },
  },
);
```

This grouped `navigation` form is the preferred modern style.

Backward-compatible flat fields such as `navigationKey`, `navigationParams`, and `persistState` still work, but new host code should prefer the grouped object.

## When To Use `navigation.persist: false`

Use `navigation.persist: false` for screens that should come back after refresh, but should reopen in a clean/default UI state.

Examples:

- a report form where the screen should reopen but field edits should not be restored
- a trigger where filters can be reconstructed from params but transient row-selection state should reset
- a collection/report that should restore workflow position but not in-progress local edits

## When To Use `navigation.excludeFromRestore: true`

Use `navigation.excludeFromRestore: true` for screens that should not come back at all after refresh/resume.

Examples:

- a one-time success page
- an onboarding transition screen
- a temporary chooser screen with no stable identity
- a screen that depends on non-restorable runtime-only context

## When To Use `navigation.persist: 'local'`

Use `navigation.persist: 'local'` when a screen is valuable enough to survive longer than a session-style browser restore.

Examples:

- a long-running report workflow
- a dashboard with user-selected long-lived filters
- a device-based business flow resumed later in the day

## Custom Persistence Adapter

If built-in storage is not enough, provide your own adapter:

```ts
navigation: {
  persistence: {
    async load() {
      return myStore.loadSnapshot();
    },
    async save(snapshot) {
      await myStore.saveSnapshot(snapshot);
    },
    async clear() {
      await myStore.clearSnapshot();
    },
  },
}
```

Use this when:

- storage must be encrypted
- storage must be scoped per tenant/workspace
- persistence must integrate with a native container or enterprise store

## Practical Rules

- Register every important restorable screen.
- Persist identities and small state, not live objects.
- Treat persistence as workflow recovery, not full in-memory serialization.
- Use `navigation.persist: false` when the screen should restore but its extra UI state should reset.
- Use `navigation.excludeFromRestore: true` only when the screen should disappear entirely on refresh/resume.
- Use a custom adapter only when the built-in modes are genuinely insufficient.

## Common Mistakes

- Expecting unregistered screens to restore automatically.
- Persisting too much state instead of refetching on restore.
- Storing runtime-only objects inside `navigation.params` or `navigation.state`.
- Forgetting that browser history and persisted restore intentionally have slightly different inclusion rules.
