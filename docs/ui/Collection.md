# Collection

Collection-oriented workflow screen for browsing/editing grouped data with buttons, reports, selectors, and nested actions.

## Source

- [src/ui/collection.ts](../../src/ui/collection.ts)

## Highlights

- Designed for list/detail and grouped workflow screens.
- Shares the same class-based composition pattern as reports and triggers.

## Reference

### `CollectionParams`

```ts
export interface CollectionParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  idField?: string;
  objectType?: string;
  selectionOnly?: boolean;
  multiple?: boolean;
  mode?: 'create'|'edit'|'display';
}
```

### `CollectionOptions`

```ts
export interface CollectionOptions {
  access?: (collection: Collection, mode: any) => Promise<boolean|undefined>|boolean|undefined;
  report?: (collection: Collection) => Promise<Report|undefined>|Report|undefined;
  trigger?: (collection: Collection) => Promise<Trigger|undefined>|Trigger|undefined;
  selector?: (collection: Collection) => Promise<Selector|undefined>|Selector|undefined;
  setup?: (collection: Collection) => void;
  on?: (collection: Collection) => OnHandler;
}
```

### `Collection`

```ts
export class Collection extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `render(props: any, context: any)`
