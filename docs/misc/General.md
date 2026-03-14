# General Utilities

Mixed utility module for dates, numbers, files, dynamic computation helpers, formatting, and small shared helpers.

## Source

- [src/misc/general.ts](../../src/misc/general.ts)

## Highlights

- Exports a wide range of helpers used across forms, validators, imports, and formatting.
- Includes `SimpleDate` / `SimpleTime` plus currency/date/file helper functions.

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

### `SimpleTime`

```ts
export class SimpleTime {
  // see source for full implementation
}
```

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
