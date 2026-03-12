# vuetify-extended

`vuetify-extended` is a TypeScript-first extension layer on top of Vue 3 and Vuetify 3. It lets you define forms, reports, selectors, dialogs, menus, and workflow-driven UI in TypeScript classes instead of relying primarily on Vue SFC templates.

This repository contains both the source code under `src/` and the published build outputs under `lib/`.

## What the Library Provides

- A class-based UI abstraction for Vue 3
- A shared object model called `Master`
- High-level screen primitives such as `Form`, `Report`, `Collection`, and `Selector`
- A stack-based application shell with `AppMain` and `AppManager`
- A shared `Api` facade that can target Feathers or axios-backed clients
- Helpers for printing, export, validation, file handling, charts, maps, HTML editing, and code editing

## Who This Library Fits Best

This library is a strong fit when you want:

- business CRUD/report screens
- metadata-driven forms
- TypeScript-defined UI composition
- reusable report and collection workflows
- a common object model shared across many fields

It is less focused on template-heavy, animation-heavy, or design-system-first frontends.

## Documentation Map

- [docs/README.md](./docs/README.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/general-information.md](./docs/general-information.md)
- [test/README.md](./test/README.md)

## Installation

Install the package and its expected peer/runtime stack in your host app.

```bash
npm install vuetify-extended vue vuetify
```

If your app uses the richer features in this library, it will also need the relevant runtime dependencies already declared by the package, such as Feathers, TinyMCE, ApexCharts, and Google Maps support.

## Build Output

The package publishes:

- ESM: `lib/esm`
- CJS: `lib/cjs`

The root package entrypoints are:

- `main`: `./lib/cjs/index.js`
- `module`: `./lib/esm/index.js`

## Importing CSS

The library ships a small shared stylesheet that supports table and editor-related behavior.

Import it from your application:

```ts
import 'vuetify-extended/lib/esm/css/index.css'
```

Also import the usual Vuetify styles in your host app:

```ts
import 'vuetify/styles'
```

## Main Concepts

The fastest way to understand the library is this:

1. `Master` holds the data.
2. `Field` binds a value to a `Master` path.
3. `Part` arranges fields in a Vuetify grid.
4. `Form` groups parts into a saveable card.
5. `Report` turns one or more forms into a workflow.
6. `AppMain` hosts the visible screen stack.
7. `AppManager` exposes app-level runtime helpers.

## Main Exports

From the package root you get:

```ts
export * from './ui'
export * from './api'
export * from './axios-api'
export * from './feathers-api'
export * from './master'
export * from './misc'
```

The most commonly used exports are:

- `Api`
- `AxiosApi`
- `FeathersApi`
- `Master`
- `AppMain`
- `AppManager`
- `Dialogs`
- `Field`
- `Part`
- `Form`
- `Report`
- `Menu`
- `MenuItem`
- `Selector`
- `DialogForm`
- `Collection`

## Convenience Factories

These short aliases are useful when defining UI entirely in TypeScript:

- `$FD`: `Field`
- `$PT`: `Part`
- `$FM`: `Form`
- `$BN`: `Button`
- `$RP`: `Report`
- `$TG`: `Trigger`
- `$SL`: `Selector`
- `$DF`: `DialogForm`
- `$COL`: `Collection`
- `$MN`: `Menu`
- `$MI`: `MenuItem`
- `$APP`: `AppMain`

## Getting Started

## 1. Configure the API layer

The library now exposes a shared `Api` facade plus two concrete backends:

- `Api.useFeathers(...)`
- `Api.useAxios(...)`

`Api.setup(...)` is still available as the backwards-compatible shortcut for `Api.useFeathers(...)`.

### Feathers backend

If your app will load or save data through Feathers services, you can keep using:

```ts
import { Api } from 'vuetify-extended'

Api.setup('https://api.example.com', {
  url: 'https://sso.example.com',
  realm: 'example',
  clientId: 'frontend',
})
```

You can use REST or Socket.IO. The optional third argument controls transport behavior.

```ts
Api.setup('https://api.example.com', keycloakConfig, {
  useSocket: true,
  transports: ['websocket'],
  timeout: 6000,
})
```

Or explicitly:

```ts
Api.useFeathers('https://api.example.com', keycloakConfig, {
  useSocket: true,
})
```

### Axios backend

If you want the general-purpose axios implementation with the same `Api.instance.service(...)` shape:

```ts
import { Api } from 'vuetify-extended'

Api.useAxios('https://api.example.com', {
  keycloakConfig: {
    url: 'https://sso.example.com',
    realm: 'example',
    clientId: 'frontend',
  },
  keycloakInit: {
    onLoad: 'check-sso',
    pkceMethod: 'S256',
  },
})
```

You can also configure a backend directly and then assign it:

```ts
import { Api, AxiosApi, FeathersApi } from 'vuetify-extended'

const axiosClient = AxiosApi.setup(apiURL, axiosKeycloakConfig)
Api.setInstance(axiosClient)

const feathersClient = FeathersApi.setup(apiURL, feathersKeycloakConfig)
Api.setInstance(feathersClient)
```

## 2. Initialize `AppManager`

```ts
import { AppManager } from 'vuetify-extended'

AppManager.init()
```

## 3. Build your application shell

Create an `AppMain` instance and provide the initial menu.

```ts
import { $APP, $MN, $MI } from 'vuetify-extended'

const mainMenu = $MN(
  { title: 'Demo App' },
  {
    children: async () => [
      $MI(
        {
          text: 'People',
          subText: 'Open the people workflow',
          icon: 'mdi-account-group',
          color: 'primary',
        },
        {
          callback: async () => {
            console.log('Replace with a report, collection, or nested menu')
          },
        }
      ),
    ],
  }
)

const appShell = $APP({}, { menu: async () => mainMenu })
AppManager.setApp(appShell)
```

## 4. Mount Vue and Vuetify

You render the `AppMain` component like any other Vue component. If you use `Dialogs`, also render those global dialog/snackbar components once at the root.

```ts
import { createApp, defineComponent, h } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import 'vuetify-extended/lib/esm/css/index.css'
import { Dialogs } from 'vuetify-extended'

const ConfirmDialog = Dialogs.confirmComponent()
const SuccessSnackbar = Dialogs.successComponent()
const ErrorSnackbar = Dialogs.errorComponent()
const WarningSnackbar = Dialogs.warningComponent()
const ProgressOverlay = Dialogs.progressComponent()

const Root = defineComponent({
  setup() {
    return () => [
      h(appShell.component),
      h(ConfirmDialog),
      h(SuccessSnackbar),
      h(ErrorSnackbar),
      h(WarningSnackbar),
      h(ProgressOverlay),
    ]
  },
})

createApp(Root).use(createVuetify()).mount('#app')
```

## Manual Playground

This repository also includes a manual Vue 3 + Vuetify playground under [`test/`](./test/).

It exercises the main UI primitives in a running app, including:

- `AppMain`
- `Menu`
- `Report`
- `Form`
- `Part`
- `Field`
- `Selector`
- `Trigger`
- `DialogForm`
- `Collection`
- shared `Dialogs`

The playground uses a local in-memory API adapter, so report, selector, trigger, and collection flows can be tested without a live backend.

## Your First Report

The most common usage pattern is:

- create a `Master`
- create a `Report`
- return a `Form`
- inside the form, return `Part` objects
- inside each part, return `Field` objects

Example:

```ts
import { Master, $RP, $FM, $PT, $FD } from 'vuetify-extended'

const personMaster = new Master({ type: 'people' })

const personReport = $RP(
  {
    objectType: 'people',
    title: 'Person',
    mode: 'create',
  },
  {
    master: personMaster,
    form: async () =>
      $FM(
        {
          title: 'Person',
          mode: 'create',
        },
        {
          children: () => [
            $PT(
              {
                cols: 12,
                dense: true,
              },
              {
                children: () => [
                  $FD({
                    ref: 'firstName',
                    type: 'text',
                    label: 'First Name',
                    storage: 'firstName',
                    required: true,
                    cols: 6,
                  }),
                  $FD({
                    ref: 'lastName',
                    type: 'text',
                    label: 'Last Name',
                    storage: 'lastName',
                    required: true,
                    cols: 6,
                  }),
                  $FD({
                    ref: 'email',
                    type: 'text',
                    label: 'Email',
                    storage: 'email',
                    cols: 6,
                  }),
                  $FD({
                    ref: 'active',
                    type: 'boolean',
                    label: 'Active',
                    storage: 'active',
                    cols: 6,
                    default: true,
                  }),
                ],
              }
            ),
          ],
        }
      ),
  }
)
```

To show it:

```ts
import { AppManager } from 'vuetify-extended'

AppManager.showReport(personReport)
```

## How Binding Works

The `storage` property is the most important field setting.

```ts
$FD({
  type: 'text',
  label: 'City',
  storage: 'address.city',
})
```

That means:

- the field reads from `master.$get('address.city')`
- when the field changes, it writes through `master.$set('address.city', value)`

Because `Master` uses nested-property semantics, deeply nested structures work naturally.

## Working with `Master`

`Master` is the shared state container for object editing.

Typical use:

```ts
const master = new Master({
  type: 'people',
  id: '123',
})
```

Useful operations:

```ts
master.$set('profile.name', 'Ada')
master.$get('profile.name')
master.$addCollectionObject('phones', { label: 'Work', number: '1234' })
await master.$load()
await master.$save('create')
await master.$remove()
```

You can also attach validation and processing hooks:

```ts
master.addValidation('email-check', async (data) => {
  if (!data.email) return 'Email is required'
  return true
})

master.addPreprocess('trim-names', async (data) => {
  return {
    ...data,
    firstName: data.firstName?.trim(),
    lastName: data.lastName?.trim(),
  }
})
```

## Common Field Types

The field system is broad. Common types include:

- `text`
- `password`
- `textarea`
- `select`
- `autocomplete`
- `listselect`
- `boolean`
- `integer`
- `float`
- `decimal`
- `date`
- `datetime`
- `time`
- `html`
- `htmlview`
- `code`
- `image`
- `document`
- `chart`
- `map`
- `table`
- `viewtable`
- `servertable`
- `reporttable`
- `collection`

Example choice field:

```ts
$FD(
  {
    type: 'select',
    label: 'Status',
    storage: 'status',
    itemTitle: 'label',
    itemValue: 'value',
  },
  {
    selectOptions: async () => [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
    ],
  }
)
```

Example validation:

```ts
$FD({
  type: 'integer',
  label: 'Age',
  storage: 'age',
  required: true,
  validation: {
    min: { value: 0 },
    max: { value: 120 },
  },
})
```

## Default Field Parameters

You can define global default field params through the field factory:

```ts
import { $FD } from 'vuetify-extended'

$FD.setDefault({
  variant: 'outlined',
  clearable: true,
})
```

This is useful when you want consistent defaults across a whole app.

## Building Layouts with `Part`

`Part` is a grid container. It is the normal place to group fields into rows and responsive columns.

```ts
$PT(
  { cols: 12, dense: true },
  {
    children: () => [
      $FD({ type: 'text', label: 'Name', storage: 'name', cols: 8 }),
      $FD({ type: 'boolean', label: 'Enabled', storage: 'enabled', cols: 4 }),
    ],
  }
)
```

You can nest parts to build more complex layouts.

## Form Behavior

`Form` is usually responsible for:

- validation
- rendering action buttons
- delegating save to `Master`
- collecting child refs

`Form` also supports a dedicated `prevButton` action. This is primarily used by multi-step reports so previous-step navigation does not replace true cancel behavior.

Useful hooks:

- `validate`
- `saved`
- `afterSaved`
- `cancel`
- `canCancel`
- `access`
- `setup`
- `on`

Example:

```ts
$FM(
  { title: 'Settings', mode: 'edit' },
  {
    validate: async (form) => {
      if (!form.$master?.$get('email')) {
        return 'Email is required'
      }
      return true
    },
    saved: async () => {
      console.log('Saved')
    },
  }
)
```

## Report Behavior

`Report` is the main screen-level workflow object.

Use it when you need:

- an object editing page
- a multi-step workflow
- print/export
- access checks
- integration with the app shell

Useful hooks:

- `form`
- `hasForm`
- `access`
- `saved`
- `cancel`
- `beforePrint`
- `printTemplate`
- `beforeExport`
- `exportTemplate`
- `loaded`

In multi-step reports, the default action model is now:

- `Cancel` exits the report
- `Prev` moves to the previous form when one exists
- `Next` advances to the next form
- `Save` or `Finish` completes the last step

If you want a confirmation prompt before exit, set `confirmOnCancel: true`:

```ts
const report = $RP({
  title: 'Person',
  mode: 'edit',
  confirmOnCancel: true,
})
```

## Menus

Menus are useful as a home screen or nested navigation tree.

```ts
const homeMenu = $MN(
  { title: 'Home' },
  {
    children: async () => [
      $MI(
        {
          text: 'Create Person',
          subText: 'Open the create report',
          icon: 'mdi-account-plus',
          color: 'primary',
        },
        {
          report: async () => personReport,
        }
      ),
    ],
  }
)
```

## Selectors

Selectors open inside a dialog and let the user choose one or many objects.

```ts
const personSelector = $SL(
  {
    title: 'Select Person',
    objectType: 'people',
    textField: 'name',
    idField: '_id',
    returnObject: true,
  },
  {
    selected: async (item) => {
      console.log('Selected', item)
    },
  }
)

AppManager.showSelector(personSelector)
```

## Dialog Forms

Use `DialogForm` when you want a modal wrapper around a `Form`.

```ts
const dialog = $DF(
  { mode: 'create', closeOnSave: true },
  {
    form: async () =>
      $FM(
        { title: 'Quick Entry', mode: 'create' },
        {
          children: () => [
            $PT({}, {
              children: () => [
                $FD({ type: 'text', label: 'Name', storage: 'name' }),
              ],
            }),
          ],
        }
      ),
  }
)

AppManager.showDialog(dialog)
```

## Collections

`Collection` handles flows where the user:

- selects or triggers a group of objects
- opens a report for one or many selected items
- returns to the previous flow when finished

It is especially useful for batch edit or selection-driven workflows.

## App-Level Navigation

The app shell uses `AppMain`, but most calling code should use `AppManager`.

Useful methods:

```ts
AppManager.showMenu(menu)
AppManager.showReport(report)
AppManager.showCollection(collection)
AppManager.showSelector(selector)
AppManager.showDialog(dialogForm)
AppManager.showUI(customUi)
AppManager.back()
AppManager.reload()
```

## Global Dialogs and Notifications

The `Dialogs` class gives you reusable global UI for confirmation, success, warning, error, and progress.

Example:

```ts
const confirmed = await Dialogs.$confirm('Delete this record?', 'Confirm delete')

if (confirmed) {
  Dialogs.$showProgress({ text: 'Deleting...' })
  try {
    // do work
    Dialogs.$success('Record deleted')
  } catch (error) {
    Dialogs.$error('Delete failed')
  } finally {
    Dialogs.$hideProgress()
  }
}
```

Remember that the `Dialogs` component set must be rendered at the app root for these methods to show UI.

## Shared Service Helpers

Both supported backends expose the same service-oriented surface through `Api.instance.service(path)`.

Common helper methods include:

- `findOne(params)`
- `findAll(params)`
- `count(params)`

Example:

```ts
const people = await Api.instance.service('people').findAll({
  query: { active: true },
})

const firstPerson = await Api.instance.service('people').findOne({
  query: { email: 'ada@example.com' },
})

const total = await Api.instance.service('people').count({
  query: { active: true },
})
```

## Utility Helpers

The `misc` module includes several generally useful helpers.

Examples:

```ts
import {
  sleep,
  SimpleDate,
  SimpleTime,
  selectFile,
  fileToBase64,
} from 'vuetify-extended'

await sleep(250)

const date = new SimpleDate('2026-03-12')
const time = new SimpleTime('09:30')

const files = await selectFile('image/*')
const base64 = await fileToBase64(files[0], 500)
```

## Suggested Project Structure in a Host App

One workable structure is:

```text
src/
  app/
    bootstrap.ts
    app-shell.ts
  reports/
    people-report.ts
    invoice-report.ts
  forms/
    person-form.ts
  menus/
    main-menu.ts
  selectors/
    person-selector.ts
  fields/
    shared-fields.ts
```

The library works best when you split screen factories into small TypeScript modules rather than placing everything in one giant file.

## Tips for Working Effectively with the Library

- Treat `Master` as the source of truth, not the field widget.
- Keep field `storage` paths stable and explicit.
- Prefer small `Part` trees over very large single layout blocks.
- Use the `options` callbacks instead of subclassing unless you need a reusable custom class.
- Mount the `Dialogs` components once at the root.
- Use factory aliases like `$FD`, `$PT`, and `$FM` to keep definitions readable.
- If you rely on saving/loading, ensure `Api.useFeathers(...)`, `Api.useAxios(...)`, or `Api.setup(...)` runs before user workflows begin.

## Current Limitations

Based on the current repository state:

- There is no real automated test suite yet.
- `src/ui/field.ts` is the largest and most central file, so field-related changes need careful review.
- The architecture uses some global/static coordinators, which makes bootstrap order important.

## Developing This Repository

Useful scripts:

```bash
npm run build
npm run build-esm
npm run build-cjs
```

The `build` script compiles TypeScript and copies `src/css` into both distribution targets.

## Summary

`vuetify-extended` is best viewed as a TypeScript-driven application framework built on Vuetify. Its center is the combination of:

- `Master` for state
- `Field` for binding
- `Form` and `Report` for workflows
- `AppMain` and `AppManager` for app orchestration

If you learn those pieces first, the rest of the library becomes much easier to use and extend.
