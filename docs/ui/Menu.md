# Menu

Card-based application/menu screen with menu items, keyboard shortcuts, active-card navigation, and nested menu/back behavior.

## Source

- [src/ui/menu.ts](../../src/ui/menu.ts)

## Highlights

- Supports shortcut labels, keyboard card selection, and Enter/Space activation.
- Nested menus support Escape-to-back.
- Menu items can render shortcuts in text or compact form.

## Reference

### `MenuParams`

```ts
export interface MenuParams {
  ref?: string;
  title?: string;
  maxWidth?: number|string;
  minWidth?: number|string;
  width?: number|string;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  containerXs?: number|string|undefined;
  containerSm?: number|string|undefined;
  containerMd?: number|string|undefined;
  containerLg?: number|string|undefined;
  containerCols?: number|string|undefined;
  containerXl?: number|string|undefined;
  containerXxl?: number|string|undefined;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
  keyboardNavigation?: boolean;
}
```

### `MenuOptions`

```ts
export interface MenuOptions {
  access?: (menu: Menu) => Promise<boolean|undefined>|boolean|undefined;
  children?: (menu: Menu) => Promise<MenuItem[]>|MenuItem[];
  setup?: (menu: Menu) => void;
  on?: (menu: Menu) => OnHandler;
}
```

### `MenuItemParams`

```ts
export interface MenuItemParams {
  action?: 'report'|'collection'|'function'|'menu';
  mode?: ReportMode;
  text?: string;
  subText?: string;
  shortcut?: string;
  shortcutDisplay?: 'text'|'compact';
  shortcutFontSize?: string | number;
  shortcutShiftIcon?: string;
  cmdForCtrlOnMac?: boolean;
  icon?: string;
  color?: string;
  textColor?: string;
}
```

### `MenuItemOptions`

```ts
export interface MenuItemOptions {
  access?: (menuItem: MenuItem, mode?: ReportMode) => Promise<boolean|undefined>|boolean|undefined;
  report?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Report|undefined>|Report|undefined;
  collection?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Collection|undefined>|Collection|undefined;
  menu?:(menuItem: MenuItem, mode?: ReportMode) => Promise<Menu|undefined>|Menu|undefined;
  callback?: (menuItem: MenuItem, mode?: ReportMode) => Promise<void>|void;
  setup?: (menuItem: MenuItem) => void;
  on?: (menuItem: MenuItem) => OnHandler;
}
```

### `Menu`

```ts
export class Menu extends UIBase {
  // see source for full implementation
}
```

### `MenuItem`

```ts
export class MenuItem extends EventEmitter {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: MenuParams, reset?: boolean)`
- `render(props: any, context: any)`
- `static setDefault(value: MenuItemParams, reset?: boolean)`
