# UI Reference

The UI layer is class-based and centers around `UIBase` descendants that render menus, forms, reports, dialogs, shell regions, and supporting widgets.

## Pages

- [AppMain](./AppMain.md)
  Top-level application shell and stack host for menus, reports, collections, shell regions, backgrounds, and FAB quick actions.
- [AppManager](./AppManager.md)
  Static coordinator used by host apps and library internals to initialize, register, and switch the current `AppMain` screen stack.
- [Base](./Base.md)
  Foundational runtime classes shared by all UI objects. `UIBase` provides reactivity helpers, event emission, parent/child links, and rendering integration.
- [Button](./Button.md)
  Reusable action object that renders Vuetify buttons, keyboard shortcut hints, compact shortcut notation, and optional tooltips.
- [Collection](./Collection.md)
  Collection-oriented workflow screen for browsing/editing grouped data with buttons, reports, selectors, and nested actions.
- [DialogForm](./DialogForm.md)
  Form wrapper that runs inside a dialog surface and reuses the same field/form/button model as the rest of the library.
- [Dialogs](./Dialogs.md)
  Global modal/dialog manager for alerts, confirms, progress, prompts, and other blocking overlays.
- [Field](./Field.md)
  Most flexible input/display primitive in the library. `Field` covers text inputs, selects, editors, tables, charts, single-point maps, multi-marker maps, editable line/circle/rectangle/polygon geometry maps, display-only heatmaps/clustered marker maps/mixed GeoJSON maps, collections, messaging UI, and file/image/document display.
- [Form](./Form.md)
  Composable form container that hosts fields, action buttons, validation, save/cancel flows, and keyboard-first behavior.
- [Fullscreen](./Fullscreen.md)
  Full-screen utility widgets for access-denied and splash/loading states that can be used through `.component` or the normal UI stack.
- [Mailbox](./Mailbox.md)
  Host-delegated mailbox/inbox system with a stack-based mailbox screen, header bell widget, pagination, unread state, and item actions.
- [Menu](./Menu.md)
  Card-based application/menu screen with menu items, keyboard shortcuts, active-card navigation, and nested menu/back behavior.
- [Notifications](./Notifications.md)
  Global non-blocking notification/toast manager with queueing, auto-dismiss, actions, and configurable surface styling.
- [Part](./Part.md)
  Reusable section/grouping primitive for composing forms and reports from smaller labelled blocks.
- [Report](./Report.md)
  Multi-step workflow screen for create/edit/reporting tasks with forms, navigation, progress, side buttons, and finish/cancel behavior.
- [Selector](./Selector.md)
  Selection-oriented screen/dialog pattern for choosing one or more items from a list or service source.
- [Shell Widgets](./ShellWidgets.md)
  Reusable shell-friendly widgets for app titles, environment tags, status badges, and account/user presentation.
- [Trigger](./Trigger.md)
  Action-oriented workflow screen for search/query/trigger tasks with form controls, result tables, and side buttons.
