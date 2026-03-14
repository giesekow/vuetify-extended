# Fullscreen Utilities

Full-screen utility widgets built on `UIBase`. These are intended for pre-app or out-of-band states such as access-denied pages, branded splash/loading screens, or temporary full-page status displays.

## Source

- [src/ui/fullscreen.ts](../../src/ui/fullscreen.ts)

## Highlights

- Both widgets extend `UIBase`, so they expose `.component` and can also be shown through `AppManager.showUI(...)`.
- They render as full-viewport surfaces and do not depend on the normal `AppMain` header/footer shell.
- They support the same `setDefault(...)` pattern used elsewhere in the library.

## `AccessDeniedScreen`

Use `AccessDeniedScreen` when the user is authenticated but not allowed to enter the workspace or a specific tenant/app context.

### `AccessDeniedScreenParams`

```ts
export interface AccessDeniedScreenParams {
  title?: string;
  subtitle?: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  logo?: string;
  logoAlt?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  cardColor?: string;
  textColor?: string;
  titleColor?: string;
  maxWidth?: string | number;
  minHeight?: string | number;
  actionText?: string;
}
```

### `AccessDeniedScreenOptions`

```ts
export interface AccessDeniedScreenOptions {
  action?: (screen: AccessDeniedScreen) => Promise<void> | void;
}
```

### Notes

- `actionText` only renders a button when `options.action` is provided.
- `logo` and `backgroundImage` both accept normal URLs or data URLs.
- The default visual treatment is a dark blocked-access surface with a shield icon.

### Example

```ts
const screen = new AccessDeniedScreen(
  {
    title: 'Workspace Access Required',
    subtitle: 'Authorization Needed',
    message: 'Your account is valid, but this tenant is not available for the current role.',
    actionText: 'Return Home',
  },
  {
    action: () => AppManager.back(),
  },
)

AppManager.showUI(screen)
```

## `SplashScreen`

Use `SplashScreen` for branded startup/loading sequences while the host app initializes data, session state, or shell configuration.

### `SplashScreenParams`

```ts
export interface SplashScreenParams {
  title?: string;
  subtitle?: string;
  message?: string;
  icon?: string;
  iconColor?: string;
  logo?: string;
  logoAlt?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundOverlay?: string;
  cardColor?: string;
  textColor?: string;
  titleColor?: string;
  maxWidth?: string | number;
  minHeight?: string | number;
  loadingText?: string;
  progress?: number;
  indeterminate?: boolean;
  progressColor?: string;
  progressSize?: string | number;
}
```

### Notes

- Defaults to an indeterminate progress indicator.
- Set `indeterminate: false` together with `progress` to render a determinate circular progress state.
- `logo` can be used instead of `icon` for brand-first splash screens.

### Example

```ts
const splash = new SplashScreen({
  title: 'Vuetify Extended',
  subtitle: 'Demo Workspace',
  message: 'Loading services, shell widgets, mailbox data, and keyboard bindings.',
  loadingText: 'Preparing the workspace…',
  logo: 'data:image/svg+xml;base64,...',
  progressColor: 'success',
})

h(splash.component)
```

## Defaults

Both widgets support global defaults:

```ts
AccessDeniedScreen.setDefault({
  backgroundColor: '#0f172a',
})

SplashScreen.setDefault({
  progressColor: 'primary',
})
```
