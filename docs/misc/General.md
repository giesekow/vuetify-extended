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
  def?: string | number | { $numberDecimal: string };
  thouSep?: string;
  decimalSep?: string;
  excessDigits?: 'round' | 'reject' | 'preserve';
}
```

### Exact decimal helpers

`$famt(...)` accepts a decimal string, a finite JavaScript number, or `{ $numberDecimal: string }`. It formats the value using string operations, so exact string and `$numberDecimal` inputs do not pass through JavaScript `Number`.

```ts
$famt('90071992547409.93', { decimalPlaces: 2 })
// '90,071,992,547,409.93'

$famt({ $numberDecimal: '1234.5' }, {
  decimalPlaces: 2,
  thouSep: ' ',
  decimalSep: ',',
})
// '1 234,50'

$famt(123.456, { decimalPlaces: 2 })
// '123.46'
```

For number inputs, `$famt` formats the value represented by the number using `number.toString()`. It cannot restore precision that was lost before the call. Pass a string or `$numberDecimal` value for exact journal amounts. Scientific notation produced by `Number.toString()` is expanded before formatting.

`excessDigits` controls values whose fractional digits exceed `decimalPlaces`:

- `round` is the default and performs deterministic decimal-string rounding.
- `reject` returns the configured `def`, or an empty string when no valid default exists.
- `preserve` keeps all fractional digits.

`decimalPlaces` defaults to `2` and must be an integer from `0` through `100`. Invalid configurations throw `RangeError` instead of allocating an unbounded padding string.

`toDecimal(...)` is intentionally stricter and accepts only a decimal string or `{ $numberDecimal: string }`. It pads values with fewer decimal places and throws for number inputs, empty or invalid values, and excess fractional digits.

```ts
toDecimal('123', 2)
// { $numberDecimal: '123.00' }

toDecimal('90071992547409.93', 2)
// { $numberDecimal: '90071992547409.93' }

toDecimal('123.456', 2)
// RangeError
```

`$amt(...)` remains a JavaScript-number conversion helper. Do not use it for exact decimal storage, journal calculations, or values that may exceed JavaScript number precision.

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
- `parseExactDecimal`
- `normalizeExactDecimal`
- `roundExactDecimal`
- `compareExactDecimals`
- `resolveDecimalPlaces`
- `arrayToObject`
- `dateRangeToPeriod`
- `sortArray`
- `computeFunctionalCodeAsync`
- `computeFunctionalCode`
- `renderMathInHtml`
- `$moment`
