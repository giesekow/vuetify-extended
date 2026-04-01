# AppMain

Top-level application shell and stack host for menus, reports, collections, shell regions, backgrounds, and FAB quick actions.

## Source

- [src/ui/appmain.ts](../../src/ui/appmain.ts)

## Highlights

- Supports header/footer shell regions and background layers.
- Maintains the active UI stack and exposes reactive `stackRef` and `activeItemRef`.
- Resolves global and per-screen FAB configuration.
- Supports mobile shell behavior including `mobileTitle`, `mobileLogo`, and shell widget routing between the compact header and right-side drawer.

## Reference

### `AppParams`

```ts
export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: string;
  mobileTitle?: string;
  mobileLogo?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: string;
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
  udfs?: (app: AppMain, objectType: string|string[], query: any) => Promise<any[]>;
  makeUDF?: (app: AppMain, options: any) => Field|undefined;
  fabButtons?: AppFabButtonsFactory;
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

### `AppScreenParams`

```ts
export interface AppScreenParams {
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: string;
  fabShortcut?: string;
  fabButtons?: AppFabButtonsFactory;
  [key: string]: any;
}
```

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
