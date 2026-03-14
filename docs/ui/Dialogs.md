# Dialogs

Global modal/dialog manager for alerts, confirms, progress, prompts, and other blocking overlays.

## Source

- [src/ui/dialogs.ts](../../src/ui/dialogs.ts)

## Highlights

- Expose one mounted root and static helpers such as `$confirm(...)`.
- Confirm dialogs support keyboard shortcuts like Enter/Y for yes and Escape/N for no.

## Reference

### `DialogOptions`

```ts
export interface DialogOptions {
  confirmColor?: string|undefined;
  successColor?: string|undefined;
  errorColor?: string|undefined;
  warningColor?: string|undefined;
  progressColor?: string|undefined;
  successTimeout?: number|undefined;
  errorTimeout?: number|undefined;
  warningTimeout?: number|undefined;
  progressSize?: number|undefined;
  progressWidth?: number|undefined;
}
```

### `Dialogs`

```ts
export class Dialogs {
  // see source for full implementation
}
```

## Key Methods

- `static rootComponent()`
- `static $warning(text: string)`
- `static $error(text: string)`
