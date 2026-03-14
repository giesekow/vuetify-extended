# Shell Widgets

Reusable shell-friendly widgets for app titles, environment tags, status badges, and account/user presentation.

## Source

- [src/ui/shell.ts](../../src/ui/shell.ts)

## Highlights

- Designed to slot directly into `AppMain` header/footer regions.
- `UserArea` is a dropdown account widget with avatar support, account-copy feedback, and custom async menu entries.

## Reference

### `AppTitleBlockParams`

```ts
export interface AppTitleBlockParams {
  title?: string;
  subtitle?: string;
  overline?: string;
  icon?: string;
  color?: string;
  align?: 'left'|'center'|'right';
}
```

### `EnvironmentTagParams`

```ts
export interface EnvironmentTagParams {
  text?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}
```

### `StatusBadgeParams`

```ts
export interface StatusBadgeParams {
  text?: string;
  icon?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  size?: 'x-small'|'small'|'default'|'large'|'x-large';
}
```

### `UserAreaParams`

```ts
export interface UserAreaParams {
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

### `UserArea`

```ts
export class UserArea extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `render()`
