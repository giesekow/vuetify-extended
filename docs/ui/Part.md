# Part

Reusable section/grouping primitive for composing forms and reports from smaller labelled blocks.

## Source

- [src/ui/part.ts](../../src/ui/part.ts)

## Highlights

- Useful for splitting larger form/report layouts into named sections.
- Shares the same class-based render pattern and params/options model.

## Reference

### `PartParams`

```ts
export interface PartParams {
  ref?: string;
  readonly?: boolean;
  invisible?: boolean;
  xs?: number|string|undefined;
  sm?: number|string|undefined;
  md?: number|string|undefined;
  lg?: number|string|undefined;
  cols?: number|string|undefined;
  xl?: number|string|undefined;
  xxl?: number|string|undefined;
  alignContent?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  dense?: boolean | undefined;
  justify?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" | undefined;
  align?: "center" | "end" | "start" | "stretch" | "baseline" | undefined;
}
```

### `PartOptions`

```ts
export interface PartOptions {
  master?: Master;
  validate?: (part: Part) => Promise<string|undefined>|string|undefined;
  topChildren?: (props: any, context: any) => Array<Part|Field>;
  bottomChildren?: (props: any, context: any) => Array<Part|Field>;
  children?: (props: any, context: any) => Array<Part|Field>;
  setup?: (part: Part) => void;
  on?: (part: Part) => OnHandler;
}
```

### `Part`

```ts
export class Part extends UIBase {
  // see source for full implementation
}
```

## Key Methods

- `static setDefault(value: PartParams, reset?: boolean)`
- `render(props: any, context: any)`
