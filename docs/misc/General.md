# General Utilities

Mixed utility module for dates, numbers, files, dynamic computation helpers, formatting, and small shared helpers.

## Source

- [src/misc/general.ts](../../src/misc/general.ts)

## Highlights

- Exports a wide range of helpers used across forms, validators, imports, and formatting.
- Includes `SimpleDate` / `SimpleTime` plus currency/date/file helper functions.
- When `arrayToObject(...)` is called without `options.key`, it uses the shared id fallback: global `Master` id field, then `_id`, then `id`.

## Reference

### `SimpleDateParams`

```ts
export interface SimpleDateParams {
  year: number,
  month: number,
  day: number,
}
```

### `fAmtOptions`

```ts
export interface fAmtOptions {
  decimalPlaces?: number;
  showZeros?: boolean;
  def?: number;
  thouSep?: string;
  decimalSep?: string;
}
```

### `arrayToObjectOptions`

```ts
export interface arrayToObjectOptions {
  key?: string;
  select?: string|string[];
  fullObject?: boolean;
  asObject?: boolean;
  format?: (item: any) => any;
}
```

### `computeFunctionOptions`

```ts
export interface computeFunctionOptions {
  params?: any[];
  data?: any;
  defaultValue?: any;
}
```

### `SimpleDate`

```ts
export class SimpleDate {
  // see source for full implementation
}
```

Common return shapes:

- `toString()` / `toShortString()`
  Returns an ISO-like date string: `"YYYY-MM-DD"`
- `toCompactNumber()`
  Returns a calendar-encoded number: `YYYYMMDD`
  Example: August 5, 2026 -> `20260805`
- `toNumber()`
  Returns the library's day-count integer representation
  This is not `YYYYMMDD`, and it is not Unix milliseconds
  It represents the number of days since the Unix epoch used internally by `SimpleDate`
- `toSeconds()`
  Returns Unix seconds at the start of the represented day
- `toMilliseconds()`
  Returns Unix milliseconds at the start of the represented day

### `SimpleTime`

```ts
export class SimpleTime {
  // see source for full implementation
}
```

Common return shapes:

- `toString()`
  Returns a time string in `HH:mm` format
- `toCompactNumber()`
  Returns a compact numeric time in `HHMM` form
  Example: `09:15` -> `915`, `14:30` -> `1430`
- `toNumber()`
  Returns the library's internal minutes-since-midnight integer
  Example: `14:30` -> `870`

## Exported Helpers

- `sleep`
- `selectFile`
- `fileToBase64`
- `selectExcelFile`
- `$amt`
- `$famt`
- `$zFill`
- `toDecimal`
- `arrayToObject`
- `dateRangeToPeriod`
- `sortArray`
- `computeFunctionalCodeAsync`
- `computeFunctionalCode`
- `renderMathInHtml`
- `$moment`
