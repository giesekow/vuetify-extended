# AppManager

Static coordinator used by host apps and library internals to initialize, register, and switch the current `AppMain` screen stack.

## Source

- [src/ui/appmanager.ts](../../src/ui/appmanager.ts)

## Highlights

- Provides `showMenu`, `showReport`, `showCollection`, and `showUI` entry points.
- Acts as the bridge between independent UI objects and the mounted `AppMain` instance.
- Exposes app/setup state used by bootstrap validation.

## Reference

### `AppManager`

```ts
export class AppManager {
  // see source for full implementation
}
```

## Key Methods

- `static init()`
- `static setApp(app: AppMain)`
- `static showMenu(menu: Menu, params?: any)`
- `static showReport(report: Report, params?: any, replace?: boolean)`
- `static showCollection(collection: Collection, params?: any, replace?: boolean)`
- `static showUI(ui: UIBase, params?: any, replace?: boolean)`
