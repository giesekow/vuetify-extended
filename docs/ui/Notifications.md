# Notifications

Global non-blocking notification/toast manager with queueing, auto-dismiss, actions, and configurable surface styling.

## Source

- [src/ui/notifications.ts](../../src/ui/notifications.ts)

## Highlights

- Mounted once through `Notifications.rootComponent()`.
- Supports opaque or translucent surfaces and action buttons.

## Reference

### `NotificationOptions`

```ts
export interface NotificationOptions {
  successColor?: string;
  errorColor?: string;
  warningColor?: string;
  infoColor?: string;
  defaultTimeout?: number;
  successTimeout?: number;
  errorTimeout?: number;
  warningTimeout?: number;
  infoTimeout?: number;
  location?: NotificationLocation;
  maxVisible?: number;
  surfaceStyle?: NotificationSurfaceStyle;
  surfaceOpacity?: number;
  surfaceBlur?: string | number;
}
```

### `Notifications`

```ts
export class Notifications {
  // see source for full implementation
}
```

## Key Methods

- `static rootComponent()`
- `static setDefault(options: NotificationOptions, reset?: boolean)`
- `static $push(payload: NotificationPayload)`
- `static $info(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {})`
- `static $success(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {})`
- `static $warning(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {})`
- `static $error(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {})`
- `static clear()`
