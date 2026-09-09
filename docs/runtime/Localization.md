# Localization

This guide explains how to wire translation into `vuetify-extended` applications in a way that is practical, reactive, and easy to maintain.

It focuses on four things:

- how the library expects translated text to be passed
- how to register the global i18n adapter
- how to structure translation-aware UI definitions
- two concrete setup patterns:
  - a `vue-i18n` integration
  - a lightweight custom adapter without `vue-i18n`

Also read:

- [Built-In Translation Keys](./BuiltInTranslationKeys.md)
  Exhaustive reference for the library-owned `ve.*` keys that you can override globally.

## The Core Idea

The runtime does not force one translation package.

Instead, the host app registers one shared adapter. All major runtime surfaces then resolve text through that adapter.

That means:

- you can use `vue-i18n`
- you can use a custom translation service
- you can start with a very small in-memory solution and grow later
- locale switching can be reactive if you provide a reactive `localeRef`

## Public Text Contract

Most user-visible params now accept:

```ts
type UIText =
  | string
  | {
      key: string;
      fallback?: string;
      values?: Record<string, any>;
    }
  | (() => string)
```

### Meaning

- `string`
  Fixed plain text. Good for demos, prototypes, and single-language apps.
- `{ key, fallback, values }`
  Translation-aware descriptor. This is the preferred form for reusable app UI.
- `() => string`
  Dynamic text evaluated at render time.

### Table column titles

All library-owned table renderers accept the same `UIText` contract for column titles. This includes Field types `table`, `viewtable`, `servertable`, `reporttable`, `collection`, and table-formatted `autocomplete` fields, plus Trigger result tables and Dashboard table widgets.

Field and Trigger tables use the exported `UITableHeader` type. Dashboard tables use `DashboardTableColumn`, whose `title` has the same `UIText` type:

```ts
import { $l, type UITableHeader } from 'vuetify-extended';

const headers: UITableHeader[] = [
  { title: $l('orders.columns.name', 'Name'), key: 'name' },
  {
    title: $l('orders.columns.fulfilment', 'Fulfilment'),
    children: [
      { title: $l('orders.columns.status', 'Status'), key: 'status' },
      { title: () => currentAmountLabel.value, key: 'amount', align: 'end' },
    ],
  },
];
```

Plain strings remain unchanged. Descriptor and callback titles are resolved recursively for `UITableHeader` groups that use `children`; Dashboard columns remain flat. Resolution happens during rendering, so changing the registered `localeRef` updates visible titles without rebuilding the source definitions. All other Vuetify and library-specific header properties are preserved, and the source header array is not mutated.

## The Global Adapter Shape

The runtime adapter shape is:

```ts
interface VuetifyExtendedI18nAdapter {
  localeRef?: Ref<string>;
  t?: (key: string, values?: Record<string, any>) => string;
  formatDate?: (value: any, options?: any) => string;
  formatNumber?: (value: number, options?: any) => string;
  formatCurrency?: (value: number, options?: any) => string;
  isRTL?: (locale?: string) => boolean;
}
```

Register it through the bootstrap layer:

```ts
createVuetifyExtendedApp({
  i18n: {
    localeRef,
    t: (key, values) => ...,
    formatDate: (value, options) => ...,
    formatNumber: (value, options) => ...,
    formatCurrency: (value, options) => ...,
    isRTL: (locale) => ...,
  },
});
```

Important:

- `i18n` is a top-level `createVuetifyExtendedApp(...)` option
- it is not nested under `setup`
- once registered, the same adapter is used by fields, buttons, reports, triggers, dialogs, selectors, dashboards, shell widgets, and other runtime surfaces

## Recommended Translation Helper

Most host apps benefit from a tiny helper:

```ts
export function txt(key: string, fallback: string, values?: Record<string, any>) {
  return { key, fallback, values };
}
```

Then your screen code stays clean:

```ts
$FD({
  label: txt('customer.fields.name.label', 'Name'),
  hint: txt('customer.fields.name.hint', 'Enter the customer name'),
  storage: 'name',
})
```

## Built-In Library Keys

The library itself uses a built-in `ve.*` namespace for shared UI chrome, generic actions, prompts, empty states, and status messages.

Examples:

- `ve.common.save`
- `ve.common.cancel`
- `ve.common.confirm`
- `ve.common.close`
- `ve.common.next`
- `ve.common.prev`
- `ve.mode.create`
- `ve.mode.edit`
- `ve.mode.display`

The built-in catalog now also includes feature and infrastructure namespaces such as:

- `ve.app.*` for app shell and side-navigation chrome
- `ve.dialog.*` for prompt and preview dialog wording
- `ve.field.*` for autocomplete, upload, preview, and asset helper text
- `ve.fullscreen.*` for splash and access-denied screens
- `ve.shell.*` and `ve.user.*` for shell accessibility and user-menu helper text
- `ve.shortcut.*` for modifier names
- `ve.editor.*` for the rich HTML editor toolbar, prompts, table actions, and video actions
- `ve.validation.*` for required, range, comparison, list, length, regex, file-size, and Master validation messages

## Translation-Aware Validation

Field, part, form, report, dashboard-child, and Master validation flows accept the same text contract as visible labels:

```ts
type UIValidationResult = UIText | true | undefined | void;
```

Return `true` or `undefined` for success. Return a string or `UIText` for an error. Keyed descriptors support normal interpolation:

```ts
validate: (field) => field.$value
  ? undefined
  : $l(
      'pages.people.validation.nameRequired',
      '{field} is required.',
      { field: $t('pages.people.fields.name', 'Name') },
    )
```

`FieldOptions.rules(...)` also accepts translated validation values; the field resolves descriptors before giving the result to Vuetify. Standard `FieldParams.required`, `FieldParams.validation`, and `$v` rules use the documented `ve.validation.*` keys, which applications may override globally.

`ReportOptions.validate(report, form, index)` uses the same result type. It is useful for translated workflow-wide rules and runs after active-form validation but before confirmation, step advancement, or persistence.

Recommended rule:

- Override `ve.common.*` and `ve.mode.*` once at the app level.
- Keep your own screen/business labels under app-owned keys such as `pages.customer.*` or `menus.admin.*`.
- Override feature-specific `ve.report.*`, `ve.dashboard.*`, `ve.trigger.*`, and similar keys only when you want to customize library-owned wording for that feature.

For the complete list, see [Built-In Translation Keys](./BuiltInTranslationKeys.md).

## Use Case 1: `vue-i18n` Integration

This is the recommended setup when the host app already uses `vue-i18n` or wants a standard Vue ecosystem translation stack.

### What This Gives You

- one shared locale for both your own app and `vuetify-extended`
- reactive language switching
- one translation file structure
- locale-aware date/number/currency formatting

### Example Translation Files

```ts
// src/i18n/messages.ts
export const messages = {
  en: {
    'app.title': 'My App',
    'pages.people.report.title': 'People Workspace',
    'pages.people.form.title': 'People Form',
    'pages.people.form.fields.name.label': 'Name',
    'pages.people.form.fields.email.label': 'Email',
    've.common.close': 'Close',
    've.common.save': 'Save',
  },
  fr: {
    'app.title': 'Mon application',
    'pages.people.report.title': 'Espace personnes',
    'pages.people.form.title': 'Formulaire personnes',
    'pages.people.form.fields.name.label': 'Nom',
    'pages.people.form.fields.email.label': 'E-mail',
    've.common.close': 'Fermer',
    've.common.save': 'Enregistrer',
  },
};
```

### Example Bootstrap

```ts
// src/main.ts
import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import { createI18n } from 'vue-i18n';
import { createVuetifyExtendedApp } from 'vuetify-extended';
import { messages } from './i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

const vuetify = createVuetify();

const bootstrap = createVuetifyExtendedApp({
  i18n: {
    localeRef: i18n.global.locale,
    t: (key, values) => i18n.global.t(key, values as any),
    formatDate: (value, options) =>
      new Intl.DateTimeFormat(i18n.global.locale.value, options).format(new Date(value)),
    formatNumber: (value, options) =>
      new Intl.NumberFormat(i18n.global.locale.value, options).format(value),
    formatCurrency: (value, options) =>
      new Intl.NumberFormat(i18n.global.locale.value, {
        style: 'currency',
        currency: 'EUR',
        ...(options || {}),
      }).format(value),
    isRTL: (locale) => ['ar', 'fa', 'he', 'ur'].some((prefix) =>
      String(locale || '').toLowerCase().startsWith(prefix)
    ),
  },
  app: {
    params: {
      title: { key: 'app.title', fallback: 'My App' },
      showHeader: true,
    },
  },
});

const Root = defineComponent({
  name: 'HostRoot',
  setup() {
    return () => [
      h(bootstrap.component),
      h(bootstrap.dialogs),
      h(bootstrap.notifications),
    ];
  },
});

createApp(Root)
  .use(vuetify)
  .use(i18n)
  .use(bootstrap.plugin)
  .mount('#app');
```

### Example Screen Definition

```ts
// src/pages/people/report.ts
import { $FD, $FM, $PT, $RP } from 'vuetify-extended';

const txt = (key: string, fallback: string, values?: Record<string, any>) => ({
  key,
  fallback,
  values,
});

export function createPeopleReport() {
  return () =>
    $RP(
      {
        title: txt('pages.people.report.title', 'People Workspace'),
        forms: 1,
        mode: 'display',
      },
      {
        form: async () =>
          $FM(
            {
              title: txt('pages.people.form.title', 'People Form'),
              mode: 'display',
            },
            {
              children: () => [
                $PT(
                  { cols: 12, dense: true },
                  {
                    children: () => [
                      $FD({
                        label: txt('pages.people.form.fields.name.label', 'Name'),
                        storage: 'name',
                        cols: 6,
                      }),
                      $FD({
                        label: txt('pages.people.form.fields.email.label', 'Email'),
                        storage: 'email',
                        cols: 6,
                      }),
                    ],
                  },
                ),
              ],
            },
          ),
      },
    );
}
```

### How Language Switching Works

Because `localeRef` points to `i18n.global.locale`, changing the locale updates the adapter source immediately:

```ts
i18n.global.locale.value = 'fr';
```

The runtime will then resolve new text using French translations for:

- your `UIText` descriptors
- built-in runtime labels such as dialog buttons and paging text
- formatting hooks such as numbers, currencies, and dates

### Notes For Teams Using `vue-i18n`

- Prefer keyed descriptors for all app chrome you define in reports, forms, menus, and shell widgets.
- Keep backend record data separate from translation descriptors.
- Always provide a `fallback` so missing keys do not produce a blank UI.
- Use one shared `txt(...)` helper instead of repeating object literals everywhere.

## Use Case 2: Lightweight Custom Adapter Without `vue-i18n`

This is useful when:

- the host app does not want `vue-i18n`
- you only need a simple dictionary-based translation layer
- you want to integrate an existing in-house translation service

### What This Gives You

- no dependency on `vue-i18n`
- complete control over translation lookup
- a very small implementation footprint

### Example Lightweight Translation Store

```ts
// src/i18n/index.ts
import { ref } from 'vue';

export const localeRef = ref('en');

const messages: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'My App',
    'pages.people.report.title': 'People Workspace',
    'pages.people.form.fields.name.label': 'Name',
  },
  de: {
    'app.title': 'Meine App',
    'pages.people.report.title': 'Personenbereich',
    'pages.people.form.fields.name.label': 'Name',
  },
};

export function translate(key: string, values?: Record<string, any>) {
  let text = messages[localeRef.value]?.[key] || key;

  for (const [name, value] of Object.entries(values || {})) {
    text = text.replace(new RegExp(`\\{${name}\\}`, 'g'), String(value));
  }

  return text;
}

export function isRTL(locale?: string) {
  return ['ar', 'fa', 'he', 'ur'].some((prefix) =>
    String(locale || localeRef.value).toLowerCase().startsWith(prefix)
  );
}
```

### Example Bootstrap

```ts
// src/main.ts
import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import { createVuetifyExtendedApp } from 'vuetify-extended';
import { localeRef, translate, isRTL } from './i18n';

const vuetify = createVuetify();

const bootstrap = createVuetifyExtendedApp({
  i18n: {
    localeRef,
    t: (key, values) => translate(key, values),
    formatDate: (value, options) =>
      new Intl.DateTimeFormat(localeRef.value, options).format(new Date(value)),
    formatNumber: (value, options) =>
      new Intl.NumberFormat(localeRef.value, options).format(value),
    formatCurrency: (value, options) =>
      new Intl.NumberFormat(localeRef.value, {
        style: 'currency',
        currency: localeRef.value === 'de' ? 'EUR' : 'USD',
        ...(options || {}),
      }).format(value),
    isRTL,
  },
  app: {
    params: {
      title: { key: 'app.title', fallback: 'My App' },
    },
  },
});

const Root = defineComponent({
  setup() {
    return () => [
      h(bootstrap.component),
      h(bootstrap.dialogs),
      h(bootstrap.notifications),
    ];
  },
});

createApp(Root)
  .use(vuetify)
  .use(bootstrap.plugin)
  .mount('#app');
```

### Example Language Switch

```ts
import { localeRef } from './i18n';

localeRef.value = 'de';
```

That is enough for the runtime to start resolving:

- `UIText` descriptors using German keys
- formatting through German locale rules
- any runtime text that goes through the shared adapter

### Example UI Definitions

Exactly the same `UIText` descriptors work here too:

```ts
$FD({
  label: { key: 'pages.people.form.fields.name.label', fallback: 'Name' },
  storage: 'name',
});
```

That is one of the main design benefits of the adapter approach:

- your screen definitions do not care whether the host uses `vue-i18n`
- only the adapter wiring changes

## What The Runtime Translates Automatically

Once the adapter is configured, the runtime already resolves a growing set of built-in UI text for you, including:

- shell titles and header/footer labels
- built-in form, report, trigger, and selector action labels
- common dialog buttons and utility messages
- dashboard loading, empty-state, paging, and menu labels
- mailbox built-in labels
- field helper text, placeholders, and upload-related labels

This is library chrome.

## What You Still Need To Translate Yourself

You still own translation of:

- your report titles
- your field labels
- your business-specific empty-state text
- item titles, row labels, and messages loaded from your backend
- free-form data values such as invoice names or product descriptions

## Important Distinction: Library Text vs Application Data

This object:

```ts
{ title: 'Invoice overdue' }
```

is application data, not library chrome.

The runtime will render it exactly as provided unless you translate it before passing it into the UI or store localized values per locale yourself.

## Practical Rules

- Prefer `{ key, fallback }` for reusable screens.
- Prefer plain strings only for demos, prototypes, or intentionally fixed text.
- Always provide `fallback`.
- Keep one global adapter for the whole app.
- Translate backend data before rendering if that data is locale-dependent.
- Do not pass raw translation keys as plain strings and expect automatic lookup.

## Common Mistakes

- Passing `'users.fields.firstName'` as a plain string instead of `{ key: 'users.fields.firstName', fallback: 'First Name' }`.
- Registering the adapter under a non-existent `setup.i18n` path instead of the real top-level `i18n` option.
- Omitting `fallback` and then struggling to diagnose missing keys.
- Mixing already-translated strings and untranslated backend data without a clear project rule.
- Re-implementing translation lookups per report/form instead of using one shared adapter.
