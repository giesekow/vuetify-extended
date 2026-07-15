# Navigation

This guide explains how navigation works in `AppMain` and `AppManager`.

It focuses on:

- browser history integration
- device back integration
- serializable navigation entries
- how to register screens so they can be restored later

## The Navigation Model

`AppMain` owns the active stack.

`AppManager` is the global coordinator that pushes screens into that stack.

When you show a screen, the runtime now stores a serialized navigation description alongside the live UI object.

That serialized description is what makes browser back/forward and refresh restoration possible.

## What Happens When You Show A Screen

When you call one of these:

- `AppManager.showMenu(...)`
- `AppManager.showReport(...)`
- `AppManager.showTrigger(...)`
- `AppManager.showCollection(...)`
- `AppManager.showUI(...)`

the runtime:

1. pushes the live UI object into the current `AppMain` stack
2. builds a `NavigationEntry`
3. syncs browser history if enabled
4. saves persistence state if persistence is enabled

## Preferred Navigation Shape

For new code, prefer grouped navigation metadata:

```ts
AppManager.showReport(
  (entry) => buildInvoiceReport(entry?.params?.mode, entry?.params?.invoiceId),
  {
    navigation: {
      key: 'reports.invoice-edit',
      params: {
        invoiceId,
        mode: 'edit',
      },
      persist: true,
    },
  },
)
```

The runtime still accepts older flat navigation fields for backward compatibility:

- `navigationKey`
- `navigationType`
- `navigationTitle`
- `navigationParams`
- `navigationState`
- `persistState`
- `excludeFromRestore`

### `navigationKey`

Use this when the screen should be reconstructable later.

Example:

```ts
AppManager.showReport(report, {
  navigationKey: 'reports.customer-edit',
  navigationParams: {
    objectId: customerId,
    mode: 'edit',
  },
});
```

The key is looked up later through `AppManager.registerScreen(...)`.

In grouped form, this becomes `navigation.key`.

### `navigationParams`

Use this for the minimum data needed to recreate the screen.

Good examples:

- `objectId`
- `mode`
- `tab`
- active filter ids
- a date range

Avoid putting large runtime objects here.

### `navigationState`

Use this for extra serializable screen state that should be restored after construction.

Good examples:

- current step in a report
- expanded section ids
- current page/filter state

If the screen can derive everything from `navigationParams`, you may not need `navigationState`.

In grouped form, these become `navigation.params` and `navigation.state`.

### `persistState`

Use this to decide whether extra serialized screen state should be saved and restored.

Meaning:

- `true` or omitted
  Restore the screen and persist its extra restorable state.
- `false`
  Restore the screen entry, but rebuild it from base `navigationParams` only.
- `'local'`
  Restore the screen and request longer-lived persistence intent for its extra state.

`'default'` is still accepted as a compatibility alias for the normal/default behavior.

In grouped form, this becomes `navigation.persist`.

### `excludeFromRestore`

Use this only for truly transient screens.

Meaning:

- omitted or `false`
  The entry remains eligible for refresh/resume restore.
- `true`
  The entry is omitted from refresh/resume restore snapshots.

In grouped form, this becomes `navigation.excludeFromRestore`.

## Registering Restorable Screens

If a screen should restore from browser history or persisted snapshots, register it.

Example:

```ts
AppManager.registerScreen('reports.customer-edit', {
  type: 'report',
  create: async (entry) => {
    return buildCustomerReport(entry.params?.mode, entry.params?.objectId);
  },
  serializeState: async (report) => {
    return {
      currentStep: report.currentStepRef.value,
    };
  },
  restoreState: async (report, state) => {
    if (typeof state?.currentStep === 'number') {
      report.currentStepRef.value = state.currentStep;
    }
  },
});
```

## Factory-Based Navigation

`showMenu(...)`, `showReport(...)`, `showTrigger(...)`, `showCollection(...)`, and `showUI(...)` now accept either:

- a concrete UI instance
- a factory function `(entry) => instance`

For restoreable screens, prefer the factory form.

Why:

- it gives the runtime a stable reconstruction path
- it lets `AppManager` auto-register navigation definitions when `navigation.key` is supplied
- it removes repetitive manual wiring for simple restoreable flows

Example:

```ts
AppManager.showCollection(
  (entry) => buildOrdersCollection(entry?.params?.workspaceId),
  {
    navigation: {
      key: 'collections.orders',
      params: { workspaceId },
      persist: false,
    },
  },
)
```

If a factory is used with `navigation.key` and no registration exists yet, the runtime can register it automatically for later restore.

If an already-created instance is used with `navigation.key` but no registration exists, the screen still works for the current session, but refresh/resume restore is intentionally disabled for that entry.

## When Restoration Works Best

Navigation restoration works best when:

- the screen can be recreated from a small serializable descriptor
- the screen fetches fresh server data as needed
- any extra UI state is also serializable

Examples of good candidates:

- report edit screens
- triggers with saved filters
- collections with active record ids
- dashboards with filter/date-range state

Examples of weaker candidates:

- screens built around temporary closures only
- screens depending on non-serializable objects
- screens whose state lives only in ad-hoc external variables

## Browser Back And Forward

When history is enabled:

- forward navigation uses browser history state
- browser back tries to restore the previous stack entry
- browser forward tries to restore the next stack entry

This makes the host app behave more like a first-class web application instead of a disconnected single-page shell.

## Device Back

In Capacitor-style environments, the same navigation model is used.

The runtime hooks the device back button into the same `AppMain.$back()` flow instead of inventing a separate mobile-only navigation architecture.

That means:

- web back and device back behave consistently
- the app still uses one stack model
- the difference is only the environment adapter

## `replace: true`

Use replace navigation when the new screen should replace the current stack/history state instead of adding another entry.

Typical cases:

- swapping one splash/loading screen for the real screen
- replacing a temporary screen after login/bootstrap
- redirect-style workflows

## Good Host-App Pattern

```ts
AppManager.registerScreen('reports.invoice-edit', {
  type: 'report',
  create: async (entry) => buildInvoiceReport(entry.params?.mode, entry.params?.invoiceId),
});

AppManager.showReport(buildInvoiceReport('edit', invoiceId), {
  navigationKey: 'reports.invoice-edit',
  navigationParams: {
    invoiceId,
    mode: 'edit',
  },
});
```

Modern equivalent:

```ts
AppManager.showReport(
  (entry) => buildInvoiceReport(entry?.params?.mode, entry?.params?.invoiceId),
  {
    navigation: {
      key: 'reports.invoice-edit',
      params: {
        invoiceId,
        mode: 'edit',
      },
      persist: true,
    },
  },
)
```

## Practical Rules

- Use `navigation.key` for any screen that should survive back/forward or refresh restore.
- Keep `navigation.params` small and serializable.
- Put reconstructable identity in `navigation.params`, not in closures.
- Use `navigation.state` only for extra UI state that cannot be derived from params alone.
- Use `navigation.persist: false` when the screen should come back in its initial/default UI state.
- Use `navigation.excludeFromRestore: true` only when the screen should disappear completely after refresh/resume.
- Use `replace: true` deliberately, not by default.

## Common Mistakes

- Navigating to important screens without `navigation.key`.
- Passing large live objects in `navigation.params`.
- Expecting an unregistered custom UI object to restore automatically after refresh.
- Using `navigation.state` for business data that really belongs in your backend or `Master`.
