# Shell Widgets

Reusable shell-friendly widgets for app titles, environment tags, status badges, standalone shell action icons, and account/user presentation.

## Source

- [src/ui/shell.ts](../../src/ui/shell.ts)

## Highlights

- Designed to slot directly into `AppMain` header/footer regions.
- `UserArea` is a dropdown account widget with avatar support, account-copy feedback, and custom async menu entries.
- All shell widgets support shared mobile visibility and mobile placement controls through `AppMain`.

## Shared Mobile Visibility

All shell widgets in this file support:

```ts
export interface ShellResponsiveVisibilityParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
}
```

Behavior:
- `hideOnMobile: true` hides the widget completely on mobile shell layouts.
- `hideOnNonMobile: true` hides the widget on non-mobile shell layouts.
- `mobileLocation: 'header'` keeps the widget in the compact mobile header.
- `mobileLocation: 'drawer'` moves the widget into the mobile right-side header drawer.
- If `hideOnMobile` is `true`, `mobileLocation` has no effect because the widget is not shown on mobile.
- If `mobileLocation` is omitted, `AppMain` falls back to its built-in compact-header priority rules.

## Reference

### `AppTitleBlockParams`

```ts
export interface AppTitleBlockParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
  title?: string;
  subtitle?: string;
  overline?: string;
  icon?: string;
  image?: string;
  color?: string;
  align?: 'left'|'center'|'right';
}
```

### `EnvironmentTagParams`

```ts
export interface EnvironmentTagParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
  text?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}
```

### `StatusBadgeParams`

```ts
export interface StatusBadgeParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
  text?: string;
  icon?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}
```

### `ShellIconActionParams`

```ts
export interface ShellIconActionParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
  icon?: string;
  title?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
  iconSize?: string | number;
  badge?: string | number;
  badgeColor?: string;
  disabled?: boolean;
}
```

### `ShellIconActionOptions`

```ts
export interface ShellIconActionOptions {
  onClicked?: (widget: ShellIconAction) => Promise<void> | void;
}
```

### `UserAreaParams`

```ts
export interface UserAreaParams {
  hideOnMobile?: boolean;
  hideOnNonMobile?: boolean;
  mobileLocation?: 'header' | 'drawer';
  name?: string;
  subtitle?: string;
  email?: string;
  accountId?: string;
  initials?: string;
  icon?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarColor?: string;
  align?: 'left'|'right';
  menuWidth?: string | number;
  copyIcon?: string;
  copiedIcon?: string;
  copiedDuration?: number;
}
```

### `UserAreaOptions`

```ts
export interface UserAreaOptions {
  buttons?: (userArea: UserArea) => Promise<UserAreaMenuEntry[]> | UserAreaMenuEntry[];
}
```

### `AppTitleBlock`

```ts
export class AppTitleBlock extends UIBase {
  // see source for full implementation
}
```

### `EnvironmentTag`

```ts
export class EnvironmentTag extends UIBase {
  // see source for full implementation
}
```

### `StatusBadge`

```ts
export class StatusBadge extends UIBase {
  // see source for full implementation
}
```

### `ShellIconAction`

```ts
export class ShellIconAction extends UIBase {
  // see source for full implementation
}
```

### `UserArea`

```ts
export class UserArea extends UIBase {
  // see source for full implementation
}
```

## Mobile Placement Example

```ts
headerStart: () => [
  new AppTitleBlock({
    title: 'Workspace',
    subtitle: 'Reusable shell widgets',
    overline: 'Demo',
    mobileLocation: 'drawer',
  }),
],
headerEnd: () => [
  new MailboxBell({
    title: 'Open mailbox',
    mobileLocation: 'header',
  }),
  new UserArea({
    name: 'Admin User',
    mobileLocation: 'header',
  }),
  new ShellIconAction({
    icon: 'mdi-help-circle-outline',
    title: 'Help',
    mobileLocation: 'drawer',
  }),
],
```

## Key Methods

- `render()`
