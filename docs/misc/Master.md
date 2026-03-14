# Master

`Master` is the shared data model and persistence abstraction used across forms, reports, and collection-style editing flows.

## Source

- [src/master/master.ts](../../src/master/master.ts)

## Highlights

- Stores the current object data and emits change events used by fields and forms.
- Supports `setDefault(...)`, so host apps can define a global `idField`.
- Centralizes shared id resolution helpers used throughout the runtime.

## `MasterOptions`

```ts
export interface MasterOptions {
  type?: string;
  id?: any;
  idField?: any;
  parent?: Master;
}
```

## Global Defaults

```ts
Master.setDefault({
  idField: 'id',
})
```

## Shared ID Resolution

Throughout the runtime, ids are resolved in this order:

1. explicit local `idField` or `itemValue`
2. global `Master.setDefault({ idField: ... })`
3. `_id`
4. `id`

That means Mongo-style objects and SQL-style `{ id: ... }` objects can both work without rewriting every field, selector, or table.

## Key Static Helpers

- `Master.getDefaultIdField()`
- `Master.getIdFieldCandidates(idField?)`
- `Master.resolveItemValueField(items?, idField?)`
- `Master.getItemId(item, idField?)`
- `Master.matchesItemId(item, id, idField?)`

## Practical Notes

- `Collection`, `Selector`, `Trigger`, `Field`, and table widgets now use these helpers for fallback behavior.
- `arrayToObject(...)` in [`src/misc/general.ts`](../../src/misc/general.ts) also uses the same id-field fallback when `options.key` is omitted.
