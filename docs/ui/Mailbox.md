# Mailbox

Host-delegated mailbox/inbox system with a stack-based mailbox screen, header bell widget, pagination, unread state, and item actions.

## Source

- [src/ui/mailbox.ts](../../src/ui/mailbox.ts)

## Highlights

- The library owns the UI and local reactive cache, while the host app provides `load`, `viewItem`, and persistence handlers.
- Exposes `itemsRef`, `loadingRef`, `hasMoreRef`, and `unreadCountRef`.
- `MailboxView` extends `UIBase`, so the inbox fits naturally into `AppManager` stack navigation.

## Reference

### `MailboxOptions`

```ts
export interface MailboxOptions {
  title?: string;
  pageSize?: number;
  load?: (params: MailboxLoadParams) => Promise<MailboxPage | MailboxItem[]> | MailboxPage | MailboxItem[];
  viewItem?: (item: MailboxItem) => Promise<Report | undefined> | Report | undefined;
  markRead?: (item: MailboxItem) => Promise<void> | void;
  markReadMany?: (items: MailboxItem[]) => Promise<void> | void;
  markUnread?: (item: MailboxItem) => Promise<void> | void;
  remove?: (item: MailboxItem) => Promise<void> | void;
  removeMany?: (items: MailboxItem[]) => Promise<void> | void;
  loadUnreadCount?: () => Promise<number> | number;
}
```

### `MailboxLoadParams`

```ts
export interface MailboxLoadParams {
  page: number;
  pageSize: number;
  cursor?: any;
  refresh?: boolean;
}
```

### `MailboxViewParams`

```ts
export interface MailboxViewParams {
  title?: string;
  width?: string | number;
  pageSize?: number;
  reloadOnShow?: boolean;
  horizontalAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'center' | 'end' | 'start' | 'space-around' | 'space-between' | 'space-evenly' | 'stretch';
  fluid?: boolean;
  listMaxHeight?: string | number;
}
```

### `MailboxBellParams`

```ts
export interface MailboxBellParams {
  icon?: string;
  color?: string;
  variant?: 'flat'|'text'|'outlined'|'plain'|'elevated'|'tonal';
  badgeColor?: string;
  maxBadge?: number;
  title?: string;
  viewWidth?: string | number;
}
```

### `Mailbox`

```ts
export class Mailbox {
  // see source for full implementation
}
```

### `MailboxView`

```ts
export class MailboxView extends UIBase {
  // see source for full implementation
}
```

### `MailboxBell`

```ts
export class MailboxBell extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static configure(options: MailboxOptions, reset?: boolean)`
- `static push(item: MailboxItem)`
- `static setUnread(count: number)`
