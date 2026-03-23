# Base

Foundational runtime classes shared by all UI objects. `UIBase` provides reactivity helpers, event emission, parent/child links, rendering integration, and a shared `forceRender()` hook.

## Source

- [src/ui/base.ts](../../src/ui/base.ts)

## Highlights

- Every UI class in the library extends `UIBase`.
- `BaseComponent` bridges class instances into Vue `defineComponent(...)` wrappers.
- `UIBase` adds parent/master wiring used throughout the screen/widget layer.
- `forceRender()` is now available on all `UIBase` descendants for explicit remount-style rerendering.

## Reference

### `BaseComponent`

```ts
export class BaseComponent extends EventEmitter {
  // see source for full implementation
}
```

### `UIBase`

```ts
export class UIBase extends BaseComponent {
  // see source for full implementation
}
```

## Key Methods

- `render(props: any, context: any)`
  Main render hook used by the generated Vue wrapper component.
- `setup(props: any, context: any)`
  One-time setup hook for the class instance.
- `mounted()` / `unmounted()`
  Lifecycle hooks called from the Vue wrapper.
- `attachEventListeners()` / `removeEventListeners()`
  Shared place for DOM/global listeners.
- `setParent(parent: UIBase)`
  Connects a child UI object to its owner.
- `setMaster(master: Master)`
  Attaches a `Master` instance directly to the UI object.
- `forceRender()`
  Forces the UI object to rerender through the shared base wrapper.

## `forceRender()`

### What it does

`forceRender()` increments an internal reactive render version inside `BaseComponent`. The shared wrapper component reads that version and renders through a keyed `Fragment`, which causes Vue to remount that UI instance's rendered subtree.

### Practical effect

When you call:

```ts
someUi.forceRender()
```

Vue will:

- run that UI object's `render(...)` method again
- recreate the VNodes it returns
- remount the rendered subtree below that UI instance

### Scope

- `parentUi.forceRender()` rerenders the parent UI and the subtree it renders beneath it.
- `childUi.forceRender()` rerenders only that child subtree.
- It does not affect unrelated screens or widgets elsewhere in the app.

### When to use it

Use `forceRender()` when reactive refs alone are not enough, for example:

- the UI swaps internal child instances but Vue is keeping the old subtree alive
- a widget needs a remount rather than a simple reactive update
- you need a shared fallback instead of adding screen-specific render keys everywhere

### Preferred pattern

Reactive refs are still the first choice when normal data changes should update the UI. `forceRender()` is best treated as an escape hatch for explicit remounting.

## Example

```ts
const report = new Report({ title: 'Edit Profile' })

// later, after replacing internal child state
report.forceRender()
```

## Notes

- `forceRender()` is inherited by all `UIBase` descendants such as `Menu`, `Report`, `Collection`, `Selector`, `Dashboard`, `Field`, and shell widgets.
- Because it remounts the keyed subtree, child component lifecycle hooks run again for that subtree.
