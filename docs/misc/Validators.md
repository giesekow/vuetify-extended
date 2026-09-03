# Validators

Validation helper collection exported as `$v`.

## Source

- [src/misc/validators.ts](../../src/misc/validators.ts)

## Highlights

- Used by fields/forms for reusable validation rules.
- Resolves built-in messages through the configured i18n adapter.
- Returns normal strings on failure, so helpers remain compatible when passed directly to Vuetify `rules`.

## Reference

## Exported Helpers

- `$v`

## Helpers And Translation Keys

| Helper | Translation key | Values |
| --- | --- | --- |
| `isRequired()` | `ve.validation.required` | none |
| `range(min, max, converter?)` | `ve.validation.min` / `ve.validation.max` | `{ min }` / `{ max }` |
| `min(value, converter?)` | `ve.validation.min` | `{ min }` |
| `max(value, converter?)` | `ve.validation.max` | `{ max }` |
| `gt(value, converter?)` | `ve.validation.greaterThan` | `{ value }` |
| `gte(value, converter?)` | `ve.validation.greaterThanOrEqual` | `{ value }` |
| `lt(value, converter?)` | `ve.validation.lessThan` | `{ value }` |
| `lte(value, converter?)` | `ve.validation.lessThanOrEqual` | `{ value }` |
| `eq(value, converter?)` | `ve.validation.equal` | `{ value }` |
| `neq(value, converter?)` | `ve.validation.notEqual` | `{ value }` |
| `in(values)` | `ve.validation.oneOf` | `{ values }` |
| `nin(values)` | `ve.validation.notOneOf` | `{ values }` |
| `includes(value)` | `ve.validation.includes` | `{ value }` |
| `excludes(value)` | `ve.validation.excludes` | `{ value }` |
| `maxLen(value)` | `ve.validation.maxLength` | `{ max }` |
| `minLen(value)` | `ve.validation.minLength` | `{ min }` |
| `regex(pattern)` | `ve.validation.regex` | `{ pattern }` |

```ts
const nameRules = [
  $v.isRequired(),
  $v.minLen(3),
  $v.maxLen(80),
]
```

Applications can replace the wording globally by defining these keys in the adapter used by `createVuetifyExtendedApp({ i18n })`. See [Built-In Translation Keys](../runtime/BuiltInTranslationKeys.md#vevalidation).
