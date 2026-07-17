# AppMain

Top-level application shell and stack host for menus, reports, collections, shell regions, backgrounds, and FAB quick actions.

## Source

- [src/ui/appmain.ts](../../src/ui/appmain.ts)

## Highlights

- Supports header/footer shell regions and background layers.
- Maintains the active UI stack and exposes reactive `stackRef` and `activeItemRef`.
- Resolves global and per-screen FAB configuration.
- Supports mobile shell behavior including `mobileTitle`, `mobileLogo`, and shell widget routing between the compact header and right-side drawer.
- Can integrate browser history with the internal stack so browser back/forward mirrors `AppMain` navigation.
- Can persist restorable stack snapshots across refresh/resume through configurable storage adapters.
- Supports global text localization through the shared `UIText`/i18n runtime used across shell titles, buttons, dialogs, forms, reports, and triggers.
- Supports left/right side navigation drawers backed by normal `Menu` instances.

Practical guides:

- [Localization](../runtime/Localization.md)
- [Navigation](../runtime/Navigation.md)
- [Persistence](../runtime/Persistence.md)
- [Side Navigation](../runtime/SideNavigation.md)

## Reference

### `AppParams`

```ts
export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: UIText;
  mobileTitle?: UIText;
  mobileLogo?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: UIText;
  fabShortcut?: string;
  headerLayout?: 'balanced'|'auto'|'stacked';
  footerLayout?: 'balanced'|'auto'|'stacked';
  headerStartWidth?: string|number;
  headerCenterWidth?: string|number;
  headerEndWidth?: string|number;
  footerStartWidth?: string|number;
  footerCenterWidth?: string|number;
  footerEndWidth?: string|number;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundOverlay?: string;
}
```

### `AppOptions`

```ts
export interface AppOptions {
  menu?: (app: AppMain) => Promise<Menu|undefined>|Menu|undefined;
  home?: (app: AppMain) => Promise<AppHomeTarget | undefined> | AppHomeTarget | undefined;
  beforeLoad?: (app: AppMain) => Promise<void> | void;
  loaded?: (app: AppMain) => Promise<void> | void;
  ready?: (app: AppMain) => Promise<void> | void;
  leftNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  rightNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  leftNavOptions?: AppSideNavOptions;
  rightNavOptions?: AppSideNavOptions;
  udfs?: (app: AppMain, objectType: string|string[], query: any) => Promise<any[]>;
  makeUDF?: (app: AppMain, options: any) => Field|undefined;
  fabButtons?: AppFabButtonsFactory;
  navigation?: AppNavigationOptions;
  header?: (app: AppMain) => AppShellContent | AppShellContent[];
  footer?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
}
```

Lifecycle hooks:

- `beforeLoad`
  Runs at the start of `AppMain` startup/reload before the startup screen is resolved.
- `loaded`
  Runs after startup navigation/home/menu resolution has completed and `AppMain` has marked itself loaded.
- `ready`
  Runs after `loaded` and one Vue `nextTick()`, so it is the closest app-level equivalent to “mounted and visually stable”.

Order:

1. `beforeLoad(...)` option callback
2. `app.on('beforeLoad', ...)` listeners on the same `AppMain` instance
3. `AppManager.on('beforeLoad', ...)` listeners
4. startup screen resolution / restore
5. `loaded(...)` option callback
6. `app.on('loaded', ...)` listeners on the same `AppMain` instance
7. `AppManager.on('loaded', ...)` listeners
8. Vue `nextTick()`
9. `ready(...)` option callback
10. `app.on('ready', ...)` listeners on the same `AppMain` instance
11. `AppManager.on('ready', ...)` listeners

The option callbacks always run before the event listeners. Instance-level `app.on(...)` listeners run before the global `AppManager.on(...)` listeners.

Example:

```ts
const app = new AppMain(
  { title: 'Workspace' },
  {
    beforeLoad: async (app) => {
      console.log('beforeLoad option', app)
    },
    loaded: async (app) => {
      console.log('loaded option', app)
    },
    ready: async (app) => {
      console.log('ready option', app)
    },
  },
)

app.on('beforeLoad', () => {
  console.log('beforeLoad instance event')
})

app.on('loaded', () => {
  console.log('loaded instance event')
})

app.on('ready', () => {
  console.log('ready instance event')
})
```

## Lifecycle Hook Use Cases

These app-level hooks are useful when work must happen around startup rather than inside an individual report, trigger, or collection.

Typical uses:

- prepare global shell state before startup
- run telemetry or diagnostics once the shell is ready
- trigger startup notifications
- restore host-app integration state
- execute deep-link navigation after the shell is stable

### Deep-Link Example

Deep links are one of the strongest use cases for `beforeLoad` and `ready`.

Recommended pattern:

1. inspect and normalize the incoming URL or external intent in `beforeLoad`
2. store a lightweight pending deep-link instruction
3. execute the actual `AppManager.show...(...)` navigation in `ready`

This avoids races where:

- the deep link fires before `AppMain` is fully initialized
- startup `home` or restore logic overrides your intended screen
- shell features such as side navigation, dialogs, or translation are not ready yet

Example:

```ts
let pendingDeepLink: undefined | { type: 'report'; id: string }

const app = new AppMain(
  { title: 'Workspace', showHeader: true, showFooter: true },
  {
    beforeLoad: async () => {
      const path = window.location.pathname
      const match = path.match(/^\\/orders\\/([^/]+)$/)
      if (match) {
        pendingDeepLink = { type: 'report', id: match[1] }
      }
    },
    ready: async () => {
      if (!pendingDeepLink) {
        return
      }

      const deepLink = pendingDeepLink
      pendingDeepLink = undefined

      if (deepLink.type === 'report') {
        AppManager.showReport(
          (entry) => createOrdersReport(entry?.mode || 'display')(entry),
          {
            navigation: {
              key: 'pages.orders.report.display',
              params: { orderId: deepLink.id },
              persist: true,
            },
          },
        )
      }
    },
  },
)
```

If your app already uses a router, capacitor `appUrlOpen`, or another host navigation system, the same pattern still applies: capture intent early, then execute screen navigation from `ready`.

`home` is the preferred way to define the default main-area screen for a shell that uses left/right side navigation.

- `menu`
  Defines the classic full-screen root menu. It is still supported and is used as the fallback initial screen when `home` is not configured.
- `home`
  Defines the initial main-area screen shown on a fresh app load when navigation restore does not take over. This can be a `menu`, `report`, `collection`, `trigger`, or generic `ui` target.

```ts
export type AppHomeTarget =
  | { type: 'menu'; target: Menu | NavigationScreenFactory<Menu>; params?: AppScreenParams; }
  | { type: 'report'; target: Report | NavigationScreenFactory<Report>; params?: AppScreenParams; }
  | { type: 'collection'; target: Collection | NavigationScreenFactory<Collection>; params?: AppScreenParams; }
  | { type: 'trigger'; target: Trigger | NavigationScreenFactory<Trigger>; params?: AppScreenParams; }
  | { type: 'ui'; target: UIBase | NavigationScreenFactory<UIBase>; params?: AppScreenParams; };
```

Startup precedence:

1. restore persisted navigation when restore succeeds
2. otherwise show `home` when configured
3. otherwise show `menu` when configured
4. otherwise render an empty shell

Example:

```ts
new AppMain(
  { title: 'Workspace', showHeader: true, showFooter: true },
  {
    home: async () => ({
      type: 'report',
      target: createHomeReport('display'),
      params: {
        navigation: {
          key: 'pages.home.report.display',
          persist: true,
        },
      },
    }),
    menu: async () => createRootMenu(),
    leftNav: async () => createMainMenu(),
    rightNav: async () => createShellToolsMenu(),
  },
)
```

Example with a dashboard or other generic `UIBase` screen:

```ts
new AppMain(
  { title: 'Workspace', showHeader: true, showFooter: true },
  {
    home: async () => ({
      type: 'ui',
      target: createOperationsDashboard(),
      params: {
        navigation: {
          key: 'pages.ops.ui',
          persist: true,
        },
        hideSideNavs: false,
      },
    }),
    menu: async () => createRootMenu(),
    leftNav: async () => createMainMenu(),
    rightNav: async () => createShellToolsMenu(),
  },
)
```

Use `type: 'ui'` when the home screen is a dashboard, landing page, custom shell view, or any other `UIBase` that is not one of the dedicated workflow types.

### `AppSideNavOptions`

```ts
export interface AppSideNavOptions {
  enabled?: boolean;
  side?: 'left' | 'right';
  mode?: 'persistent' | 'temporary' | 'rail';
  width?: number | string;
  open?: boolean;
  overlay?: boolean;
  breakpoint?: number;
  autoCloseOnNavigate?: boolean;
  mobileMode?: 'temporary' | 'rail';
}
```

Nested drawer menu options:

```ts
export interface AppSideNavOptions {
  submenuMode?: 'screen' | 'inline';
  accordion?: boolean;
}
```

Meaning:

- `submenuMode: 'screen'`
  Keeps the current behavior for submenu items in drawers. A menu item with `action: 'menu'` opens the child menu in the main content area.
- `submenuMode: 'inline'`
  Side-nav tree behavior. A menu item with `action: 'menu'` expands its child menu inside the drawer under the parent item.
- `accordion`
  Tree-expansion rule for inline submenus. Only applies when `submenuMode === 'inline'`.
  - `true`
    Keep one expanded branch per drawer level.
  - `false`
    Allow multiple expanded branches.

### `AppScreenParams`

```ts
export interface AppScreenParams {
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: UIText;
  fabShortcut?: string;
  fabButtons?: AppFabButtonsFactory;
  navigationKey?: string;
  navigationType?: NavigationScreenType;
  navigationTitle?: UIText;
  navigationParams?: any;
  navigationState?: any;
  persistState?: boolean | 'default' | 'local';
  excludeFromRestore?: boolean;
  navigation?: InlineNavigationOptions<any>;
  [key: string]: any;
}
```

`AppScreenParams` supports both:

- grouped navigation metadata through `navigation`
- legacy flat navigation fields such as `navigationKey` and `navigationParams`

For new code, prefer the grouped `navigation` object because it keeps navigation concerns together and maps more cleanly to restoreable screen definitions.

### `AppNavigationOptions`

```ts
export interface AppNavigationOptions {
  enabled?: boolean;
  history?: boolean;
  persist?: boolean;
  restoreOnLoad?: boolean;
  storageMode?: 'web-session' | 'web-local' | 'capacitor-preferences' | 'custom';
  storageKey?: string;
  persistence?: NavigationPersistenceAdapter;
}
```

Meaning:

- `enabled`
  Master switch for the runtime navigation system. When `false` or omitted, `AppMain` behaves like the classic in-app stack only: no serialized navigation entries, no browser-history syncing, and no refresh/resume restoration.
- `history`
  Enables browser `pushState` / `replaceState` / `popstate` integration once navigation itself is enabled.
- `persist`
  Enables snapshot persistence for refresh/resume restore once navigation itself is enabled.
- `restoreOnLoad`
  Restores the last saved snapshot during bootstrap before falling back to the root menu.
- `storageMode`
  Selects the built-in persistence backend. Browser defaults to `web-session`; Capacitor defaults to `capacitor-preferences`.
- `storageKey`
  Persistence key used by the selected adapter.
- `persistence`
  Fully custom adapter implementing `load/save/clear`.

Default behavior:

- `enabled` defaults to `false`
- `history` defaults to `true`
- `persist` defaults to `true`
- `restoreOnLoad` defaults to `true`

This means history/persistence are configured but dormant until the host app explicitly opts navigation in with `enabled: true`.

### `AppMain`

```ts
export class AppMain extends UIBase {
  // see source for full implementation
}
```

## Mobile Shell Behavior

When `AppMain` is in compact/mobile shell mode:

- the left side of the header renders `mobileLogo` and `mobileTitle`
- shell widgets can stay in the compact header or move into the right-side drawer
- visibility and placement are driven by each shell widget's own params

Shell widget rules:
- `hideOnMobile: true`
  The widget is hidden on mobile and `mobileLocation` is ignored.
- `hideOnNonMobile: true`
  The widget is hidden on non-mobile layouts.
- `mobileLocation: 'header'`
  The widget stays in the compact header row.
- `mobileLocation: 'drawer'`
  The widget is rendered in the right-side mobile header drawer.
- if `mobileLocation` is not provided, `AppMain` falls back to its built-in compact-header priority behavior

Drawer behavior:
- drawer items are grouped by original section:
  - `headerStart`
  - `headerCenter`
  - `headerEnd`
- non-empty groups are separated with divider lines

Example:

```ts
new AppMain(
  {
    title: 'Vuetify Extended Demo Workspace',
    mobileTitle: 'VE Demo',
    mobileLogo: 'data:image/svg+xml,...',
    showHeader: true,
  },
  {
    headerStart: () => [
      new AppTitleBlock({
        title: 'Workspace',
        subtitle: 'Reusable shell widgets',
        mobileLocation: 'drawer',
      }),
    ],
    headerEnd: () => [
      new MailboxBell({
        title: 'Open mailbox',
        mobileLocation: 'header',
      }),
      new UserArea({
        name: 'Administrator User',
        mobileLocation: 'header',
      }),
      new ShellIconAction({
        icon: 'mdi-help-circle-outline',
        title: 'Help',
        mobileLocation: 'drawer',
      }),
    ],
  },
)
```

## Key Methods

- `render(props: any, context: any)`
- `$showMenu(menu, params?, replaceHistory?)`
- `$showLeftMenu(menuOrFactory, params?)`
- `$showRightMenu(menuOrFactory, params?)`
- `$hideLeftMenu()`
- `$hideRightMenu()`
- `$clearLeftMenu()`
- `$clearRightMenu()`
- `$toggleLeftMenu()`
- `$toggleRightMenu()`
- `$refreshLeftMenu()`
- `$refreshRightMenu()`
- `$showReport(report, params?, replace?)`
- `$showTrigger(trigger, params?, replace?)`
- `$showCollection(collection, params?, replace?)`
- `$showUI(ui, params?, replace?)`
- `$back()`
- `$pop(count?, skipHistory?)`
- `$reload()`
- `syncCurrentNavigationState()`
- `setOptions(options)`

Each `$show...(...)` method accepts either:

- a concrete UI instance for simple immediate navigation
- a factory function `(entry) => instance` for navigation-aware and restoreable flows

For screens that should survive browser back/forward or refresh/resume restore, prefer the factory form.

Notes:

- `home` is a bootstrap/startup option, not a separate runtime stack API
- if you need to navigate later from user code, continue to use `AppManager.showReport(...)`, `showCollection(...)`, `showTrigger(...)`, `showMenu(...)`, or `showUI(...)`
- use `type: 'ui'` for dashboards and other `UIBase` screens that are not one of the dedicated workflow types

## Side-Nav Tree Behavior

For left/right drawers, the submenu behavior is:

- only `MenuItem.action === 'menu'` is eligible for inline drawer expansion
- `report`, `collection`, `trigger`, `ui`, and `function` actions keep their current main-area behavior
- inline expansion is shell UI state only and is not added to browser history
- inline expansion does not replace the current stack item in `AppMain`

This keeps side-nav submenu trees useful without changing the existing screen-navigation meaning of menu items.

Notes:

- public `AppManager.showMenu(...)` is push-only and does not expose a replace flag
- internal `AppMain.$showMenu(...)` still accepts `replaceHistory` for bootstrap/history bookkeeping

## Navigation Behavior

`AppMain` is now the authoritative runtime stack host for both interactive navigation and restore.

Behavior:

- when `navigation.enabled !== true`, `AppMain` only manages the live in-memory stack
- when `navigation.enabled === true`, pushing a report/trigger/collection/menu/UI screen builds a `NavigationEntry`
- browser history is only updated when `navigation.enabled === true` and `history !== false`
- `replace: true` replaces the current browser history state instead of pushing a new one
- browser back/forward triggers stack restoration through serialized `NavigationEntry` snapshots
- hardware/device back in Capacitor delegates to the same `AppMain.$back()` flow
- persistence snapshots are only saved when `navigation.enabled === true` and `persist !== false`
- unload/background lifecycle events also flush persistence when enabled
- when persistence restore fails or no snapshot exists, `AppMain` falls back to the root menu

History and persistence intentionally share the same serialized navigation entry model, but they are not identical:

- browser history includes the full current stack, including entries marked non-persistable
- persistence restores reconstructable entries by default
- `persistState === false` prevents extra serialized state from being saved/restored for that entry
- `excludeFromRestore === true` removes the entry from refresh/resume restoration

That keeps browser back/forward complete within the current session while allowing refresh/resume to rebuild the stack structure without forcing every screen to restore in-progress UI state.

## Restorable Screens

For a screen to restore cleanly after refresh/resume, it should be navigated with:

- `navigation.key`
  Registry key that can resolve the screen later.
- `navigation.params`
  Small serializable reconstruction params such as `objectId`, `mode`, current filters, or selected tab.
- `navigation.state`
  Optional extra restoreable state when you want to supply it directly.
- `navigation.persist`
  Controls whether extra serialized screen state is saved and restored. Default behavior is effectively `true`.
- `navigation.excludeFromRestore`
  Set this to `true` only for screens that should disappear completely on refresh/resume.

Legacy flat fields still work, but grouped `navigation` is preferred for new code.

Typical examples:

- report edit screen
  Persist `navigation.key`, `objectId`, and `mode`.
- trigger screen
  Persist `navigation.key` plus active search/filter params.
- custom dashboard
  Persist `navigation.key` plus current widget filter state.

Preferred example:

```ts
AppManager.showReport(
  (entry) => buildCustomerReport(
    (entry?.mode as 'create' | 'edit' | 'display') ?? 'edit',
    entry?.params?.customerId,
  ),
  {
    navigation: {
      key: 'reports.customer',
      params: { customerId },
      persist: true,
    },
  },
)
```
