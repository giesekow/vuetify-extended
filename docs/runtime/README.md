# Runtime Guides

Practical user-facing guides for the shared runtime features that sit above the low-level UI classes:

- localization / translation
- browser and device history integration
- persisted `AppMain` / `AppManager` navigation state

These pages explain how to use the features from a host application point of view.

If you want the original design rationale and architectural tradeoffs behind these features, also read:

- [Runtime Improvements Design Notes](../runtime-improvements.md)

## Pages

- [Localization](./Localization.md)
  How to structure translated text, configure the runtime i18n adapter, and pass `UIText` through the library.
  Includes full examples for both `vue-i18n` and a lightweight custom adapter.

- [Built-In Translation Keys](./BuiltInTranslationKeys.md)
  Exhaustive reference for the library's built-in `ve.*` translation keys, including the normalized `ve.common.*` action labels and feature-specific namespaces.

- [Navigation](./Navigation.md)
  How browser history, device back behavior, `navigationKey`, `navigationParams`, and screen restoration fit together.

- [Persistence](./Persistence.md)
  How refresh/resume restoration works, what should be persisted, and how to choose the right `storageMode`.

## Recommended Reading Order

1. Read [Localization](./Localization.md) if you are introducing multiple languages or locale-aware formatting.
2. Read [Navigation](./Navigation.md) before building a workflow that relies on browser back, device back, or screen restoration.
3. Read [Persistence](./Persistence.md) when you want users to resume workflows after refresh, reload, or app resume.
4. Use [AppMain](../ui/AppMain.md) and [AppManager](../ui/AppManager.md) as API reference once the concepts are clear.
