# AppMain

Top-level application shell and stack host for menus, reports, collections, shell regions, backgrounds, and FAB quick actions.

## Source

- [src/ui/appmain.ts](../../src/ui/appmain.ts)

## Highlights

- Supports header/footer shell regions and background layers.
- Maintains the active UI stack and exposes reactive `stackRef` and `activeItemRef`.
- Resolves global and per-screen FAB configuration.

## Reference

### `AppParams`

```ts
export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: string;
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

## Key Methods

- `render(props: any, context: any)`
