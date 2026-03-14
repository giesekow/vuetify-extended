# Base

Foundational runtime classes shared by all UI objects. `UIBase` provides reactivity helpers, event emission, parent/child links, and rendering integration.

## Source

- [src/ui/base.ts](../../src/ui/base.ts)

## Highlights

- Every UI class in the library extends `UIBase`.
- Provides the shared lifecycle, event, and ref utilities that higher-level classes rely on.

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
