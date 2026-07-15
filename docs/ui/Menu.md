# Menu

Card-based application/menu screen with menu items, keyboard shortcuts, active-card navigation, and nested menu/back behavior.

## Source

- [src/ui/menu.ts](../../src/ui/menu.ts)

## Highlights

- Supports shortcut labels, keyboard card selection, and Enter/Space activation.
- Nested menus support Escape-to-back.
- Menu items can render shortcuts in text or compact form.
- Menu item actions can open `report`, `collection`, `trigger`, `menu`, or generic `ui` targets.
- Menu items can pass grouped `navigation`, `showParams`, and `replace` metadata into the underlying `AppManager.show...(...)` call.

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
  action?: 'report'|'collection'|'trigger'|'ui'|'function'|'menu';
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
  report?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Report | NavigationScreenFactory<Report> | undefined>|Report | NavigationScreenFactory<Report> | undefined;
  collection?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Collection | NavigationScreenFactory<Collection> | undefined>|Collection | NavigationScreenFactory<Collection> | undefined;
  trigger?: (menuItem: MenuItem, mode?: ReportMode) => Promise<Trigger | NavigationScreenFactory<Trigger> | undefined>|Trigger | NavigationScreenFactory<Trigger> | undefined;
  ui?: (menuItem: MenuItem, mode?: ReportMode) => Promise<UIBase | NavigationScreenFactory<UIBase> | undefined>|UIBase | NavigationScreenFactory<UIBase> | undefined;
  menu?:(menuItem: MenuItem, mode?: ReportMode) => Promise<Menu | NavigationScreenFactory<Menu> | undefined>|Menu | NavigationScreenFactory<Menu> | undefined;
  navigation?: (menuItem: MenuItem, mode?: ReportMode) => Promise<InlineNavigationOptions<any> | undefined> | InlineNavigationOptions<any> | undefined;
  showParams?: (menuItem: MenuItem, mode?: ReportMode) => Promise<AppScreenParams | undefined> | AppScreenParams | undefined;
  replace?: (menuItem: MenuItem, mode?: ReportMode) => Promise<boolean | undefined> | boolean | undefined;
  callback?: (menuItem: MenuItem, mode?: ReportMode) => Promise<void>|void;
  setup?: (menuItem: MenuItem) => void;
  on?: (menuItem: MenuItem) => OnHandler;
}
```

## Navigation-Aware Menu Items

Menu item actions now plug directly into the same navigation model used by `AppManager.showReport(...)`, `showCollection(...)`, `showTrigger(...)`, `showMenu(...)`, and `showUI(...)`.

That means a menu item can provide:

- a direct instance for simple use cases
- a factory for restore-aware navigation
- grouped `navigation` metadata
- `showParams` for FAB/screen-shell params
- `replace` when the action should replace the current history entry

Preferred example:

```ts
$MI(
  {
    action: 'report',
    mode: 'edit',
    text: 'Customer Workspace',
  },
  {
    report: async (_item, mode) => (entry) =>
      buildCustomerReport({
        objectId: entry?.params?.customerId,
        mode: (entry?.mode as 'create' | 'edit' | 'display') || mode || 'edit',
      }),
    navigation: () => ({
      key: 'reports.customer',
      params: { customerId },
      persist: true,
    }),
    showParams: () => ({
      fabIcon: 'mdi-account',
      fabLabel: 'Customer Tools',
    }),
  },
)
```

Notes:

- If `navigation.key` is present, the menu action will prefer a factory-backed navigation path automatically.
- Returning a factory is still the clearest option for screens that should restore with custom `serializeState` / `restoreState`.
- `showParams` is merged with `navigation` and passed to the final `AppManager.show...(...)` call.

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
