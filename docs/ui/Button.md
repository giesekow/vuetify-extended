# Button

Reusable action object that renders Vuetify buttons, keyboard shortcut hints, compact shortcut notation, and optional tooltips.

## Source

- [src/ui/button.ts](../../src/ui/button.ts)

## Highlights

- Supports per-button or default shortcut rendering and platform-aware Command/Ctrl behavior.
- Can render icon-only or text buttons and is reused across forms, menus, FABs, notifications, mailbox, and shell widgets.

## Reference

### `ButtonParams`

```ts
export interface ButtonParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  disabled?: boolean;
  icon?: string;
  iconOnly?: boolean;
  appendIcon?: boolean;
  elevation?: string|number;
  color?: string;
  class?: string;
  text?: string;
  tooltip?: string;
  tooltipLocation?: 'top' | 'bottom' | 'start' | 'end';
  shortcut?: string;
  shortcutDisplay?: 'text'|'compact';
  shortcutFontSize?: string | number;
  shortcutShiftIcon?: string;
  cmdForCtrlOnMac?: boolean;
  flat?: boolean;
  loading?: boolean;
  rounded?: string | number | boolean;
  size?: string | number;
  block?: boolean;
  width?: string | number;
  position?: 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky';
  density?: 'default' | 'comfortable' | 'compact';
  variant?: "flat" | "text" | "outlined" | "plain" | "elevated" | "tonal";
}
```

### `ButtonOptions`

```ts
export interface ButtonOptions {
  master?: Master;
  onClicked?: (button: Button) => void;
  setup?: (button: Button) => void;
  on?: (button: Button) => OnHandler
}
```

### `Button`

```ts
export class Button extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: ButtonParams, reset?: boolean)`
- `render(props: any, context: any)`
- `triggerShortcut()`
