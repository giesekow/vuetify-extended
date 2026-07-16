# Side Navigation

This document captures the agreed architecture for adding left/right side navigation to `vuetify-extended`.

Status:

- implemented
- available in `AppMain`, `AppManager`, `Menu`, `Form`, `Report`, `Trigger`, and `Collection`
- demonstrated in `test-cli-demo-v2`

This page is intentionally written as both:

- a decision record for the chosen behavior
- a practical usage guide for the implemented feature set

## Goals

The side navigation system should:

- reuse the existing `Menu` / `MenuItem` system instead of introducing a second navigation definition model
- support a left navigation area, a right navigation area, or both at the same time
- remain responsive across desktop, tablet, and mobile layouts
- allow a global shell-level left/right menu to be set imperatively
- allow the right menu to be owned automatically by the currently active page/workflow
- restore previous/global right-menu state automatically when contextual ownership ends
- avoid treating side drawers as stack-history entries
- define clear precedence between app-configured fallback menus and imperatively shown shell menus
- define what is explicitly out of scope for overlays such as selectors and dialog forms

## Core Decisions

## 1. Reuse the existing `Menu` system

We will not create a separate "drawer menu" object model.

Instead:

- side navigation will render normal `Menu` instances
- those menus will still use normal `MenuItem` definitions
- all existing menu actions should continue to work:
  - `menu`
  - `report`
  - `trigger`
  - `collection`
  - `ui`
  - `function`

This keeps one menu mental model across:

- screen-based menus
- left shell navigation
- right contextual tool menus

## 2. Left and right menus are shell state, not stack state

Side navigation must not become part of the `AppMain` content stack.

That means:

- opening a left or right menu should not push browser history
- closing a left or right menu should not pop browser history
- browser/device back should continue to operate on content screens, not shell drawers

The content stack remains:

- `menu`
- `report`
- `trigger`
- `collection`
- `selector`
- generic `ui`

Left/right side menus remain shell chrome owned by `AppMain`.

## 3. Support both left and right sides

The architecture should support:

- left only
- right only
- both at the same time

Recommended semantic roles:

- `left`
  primary app/workspace navigation
- `right`
  contextual tools, inspector, filters, page-local actions

This role distinction is important even though both use the same `Menu` class.

## 4. Right menu must support contextual ownership

This is the most important workflow decision.

The right menu should support two layers:

- global shell-level right menu
- contextual right menu owned by the active workflow/page

Priority order:

1. active `Form` right menu
2. active `Report` right menu
3. active `Trigger` right menu
4. active `Collection` delegated child right menu
5. global right menu set through `AppManager.showRightMenu(...)`

This gives the most natural behavior:

- a `Report` can define a default tools menu
- an active `Form` step can override that report-level menu
- when the step changes, the tools update automatically
- when the report closes, the previous/global right menu is restored automatically

## 5. Page ownership should be declarative first, imperative second

The preferred model is declarative ownership by `Report`, `Form`, and `Trigger`.

Imperative APIs are still needed, but they should be the shell fallback layer rather than the primary page-tool mechanism.

So we want both:

- declarative:
  - `report.rightMenu(...)`
  - `form.rightMenu(...)`
  - `trigger.rightMenu(...)`
- imperative:
  - `AppManager.showRightMenu(...)`
  - `AppManager.hideRightMenu()`
  - `AppManager.refreshRightMenu()`

The declarative contextual menu always wins while its owner is active.

## 6. Global fallback precedence must be explicit

We need two fallback layers for shell menus:

- app-configured fallback menus from `AppOptions.leftNav` / `AppOptions.rightNav`
- runtime shell overrides from `AppManager.showLeftMenu(...)` / `AppManager.showRightMenu(...)`

Planned precedence:

## Left side

1. runtime shell left menu set through `AppManager.showLeftMenu(...)`
2. configured app fallback left menu from `AppOptions.leftNav`

## Right side

1. contextual owner menu from active `Form` / `Report` / `Trigger` / `Collection`
2. runtime shell right menu set through `AppManager.showRightMenu(...)`
3. configured app fallback right menu from `AppOptions.rightNav`

This makes the shell rules predictable:

- app options provide stable defaults
- imperative shell APIs can override those defaults for the current session
- contextual ownership still takes priority over everything else on the right side

## Proposed Public API

## `AppOptions`

Implemented additions:

```ts
export interface AppOptions {
  leftNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  rightNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  leftNavOptions?: AppSideNavOptions;
  rightNavOptions?: AppSideNavOptions;
}
```

## `AppSideNavOptions`

Implemented type:

```ts
export interface AppSideNavOptions {
  enabled?: boolean;
  side?: 'left' | 'right';
  mode?: 'persistent' | 'temporary' | 'rail';
  width?: number | string;
  open?: boolean;
  overlay?: boolean;
  breakpoint?: number;
  autoCloseOnNavigate?: boolean;
  mobileMode?: 'temporary' | 'rail';
}
```

Notes:

- `enabled`
  Defaults to enabled behavior. Set `false` to suppress rendering for that side entirely.
- `mode`
  Determines desktop/tablet rendering style.
- `mobileMode`
  Determines small-screen fallback behavior.
- `autoCloseOnNavigate`
  Especially useful for the right contextual tools drawer.

## `AppManager`

Implemented additions:

```ts
AppManager.showLeftMenu(menuOrFactory, options?)
AppManager.showRightMenu(menuOrFactory, options?)
AppManager.hideLeftMenu()
AppManager.hideRightMenu()
AppManager.clearLeftMenu()
AppManager.clearRightMenu()
AppManager.toggleLeftMenu()
AppManager.toggleRightMenu()
AppManager.refreshLeftMenu()
AppManager.refreshRightMenu()
```

These delegate into matching `AppMain` methods.

`showLeftMenu(...)` and `showRightMenu(...)` are shell overrides.

They should:

- replace the current shell-level menu source for that side
- not push navigation history
- not interfere with contextual right-menu ownership
- restore naturally to the configured app fallback when cleared

`hideLeftMenu()` / `hideRightMenu()` close the currently visible drawer but keep its resolved menu source intact.

`clearLeftMenu()` / `clearRightMenu()` remove the currently resolved side menu entirely for the current source/owner while keeping the side-nav system enabled. A later `showLeftMenu(...)`, `showRightMenu(...)`, or a new contextual owner can make the drawer appear again.

## `AppMain`

Implemented additions:

```ts
$showLeftMenu(menuOrFactory, options?)
$showRightMenu(menuOrFactory, options?)
$hideLeftMenu()
$hideRightMenu()
$clearLeftMenu()
$clearRightMenu()
$toggleLeftMenu()
$toggleRightMenu()
$refreshLeftMenu()
$refreshRightMenu()
```

## `Menu`

Implemented `MenuParams` additions used by shell drawers:

```ts
export interface MenuParams {
  presentation?: 'screen' | 'side-nav';
  hideTitle?: boolean;
  hideBackButton?: boolean;
}
```

Behavior:

- `presentation: 'screen'`
  Normal full-page menu rendering.
- `presentation: 'side-nav'`
  Drawer-friendly rendering used by `AppMain` side navigation.
- `hideBackButton: true`
  Prevents screen-style back affordances inside shell drawers.

`AppMain` applies `presentation: 'side-nav'` and `hideBackButton: true` automatically when a `Menu` is rendered in a left/right drawer.

Keyboard note:

- full-screen menus keep their global keyboard navigation and shortcuts
- side-nav menus intentionally do not attach global keyboard handlers, so they do not interfere with active form/report field input in the main content area

## Workflow Ownership API

Implemented declarative ownership hooks:

```ts
export interface FormOptions {
  rightMenu?: (form: Form) => Promise<Menu | NavigationScreenFactory<Menu> | undefined>
    | Menu
    | NavigationScreenFactory<Menu>
    | undefined;
}

export interface ReportOptions {
  rightMenu?: (report: Report) => Promise<Menu | NavigationScreenFactory<Menu> | undefined>
    | Menu
    | NavigationScreenFactory<Menu>
    | undefined;
}

export interface TriggerOptions {
  rightMenu?: (trigger: Trigger) => Promise<Menu | NavigationScreenFactory<Menu> | undefined>
    | Menu
    | NavigationScreenFactory<Menu>
    | undefined;
}
```

Resolution order:

1. active `Form.rightMenu`
2. active `Report.rightMenu`
3. active `Trigger.rightMenu`
4. active `Collection` delegated child
5. runtime `AppManager.showRightMenu(...)`
6. configured app fallback `rightNav`

## Example

Bootstrap-level shell drawers:

```ts
new AppMain(
  {
    title: 'Workspace',
    showHeader: true,
  },
  {
    menu: async () => createMainMenu(),
    leftNav: async () => createMainMenu(),
    rightNav: async () => createWorkspaceToolsMenu(),
    leftNavOptions: {
      enabled: true,
      mode: 'persistent',
      width: 320,
      open: true,
    },
    rightNavOptions: {
      enabled: true,
      mode: 'temporary',
      width: 320,
    },
  },
)
```

Contextual report/form ownership:

```ts
$RP(
  { title: 'People Workspace', forms: 2, mode: 'display' },
  {
    rightMenu: async () => createPeopleReportTools(),
    form: async (_props, _context, index) => {
      if (index === 0) return createPeopleForm('display')
      if (index === 1) {
        return $FM(
          { title: 'Contact Details', mode: 'display' },
          {
            rightMenu: async () => createContactStepTools(),
            children: () => [/* fields */],
          },
        )
      }
      return undefined
    },
  },
)
```

In that example:

- the report tools menu shows on step 1
- the form tools menu overrides it on step 2
- when the report closes, the shell falls back to the runtime/global right menu automatically

## `Menu`

The existing `Menu` class needs a second presentation mode so it can render naturally inside a drawer.

Planned additions to `MenuParams`:

```ts
export interface MenuParams {
  presentation?: 'screen' | 'side-nav';
  hideTitle?: boolean;
  hideBackButton?: boolean;
}
```

Meaning:

- `screen`
  Current full-page behavior.
- `side-nav`
  Drawer-friendly behavior.

The `side-nav` mode should:

- avoid full-page vertical centering assumptions
- remove page-style spacing that belongs only to stack menus
- render well inside a `VNavigationDrawer`
- optionally hide title/back when being used as shell navigation

Important semantic rule:

- a `MenuItem` with `action: 'menu'` inside side navigation still performs normal content/workflow navigation unless the host explicitly replaces the side menu through shell APIs

So side navigation reuses menu actions, but does not redefine what those actions mean.

## Contextual Right Menu API

The planned declarative ownership points are:

## `FormOptions`

```ts
export interface FormOptions {
  rightMenu?: (form: Form) => Promise<Menu | NavigationScreenFactory<Menu> | undefined> | Menu | NavigationScreenFactory<Menu> | undefined;
}
```

## `ReportOptions`

```ts
export interface ReportOptions {
  rightMenu?: (report: Report) => Promise<Menu | NavigationScreenFactory<Menu> | undefined> | Menu | NavigationScreenFactory<Menu> | undefined;
}
```

## `TriggerOptions`

```ts
export interface TriggerOptions {
  rightMenu?: (trigger: Trigger) => Promise<Menu | NavigationScreenFactory<Menu> | undefined> | Menu | NavigationScreenFactory<Menu> | undefined;
}
```

This is intentionally similar to the current `sideButtons` pattern on reports and triggers.

Any later `UIBase` subclass may also opt into contextual right-menu ownership by overriding the shared hook described below, but `Form`, `Report`, `Trigger`, and `Collection` are the required first-pass owners.

## Ownership Resolution Rules

The right menu should resolve from the active content tree rather than from ad-hoc imperative bookkeeping.

Planned resolution chain:

1. active `Form`
2. parent `Report`
3. active `Trigger`
4. active `Collection` delegated child
5. global shell-level right menu

This means we should add a shared method on `UIBase`, for example:

```ts
async getRightMenuTarget(): Promise<Menu | NavigationScreenFactory<Menu> | undefined>
```

Default implementation:

- returns `undefined`

Overrides:

- `Form`
  returns its own `options.rightMenu(this)` when provided
- `Report`
  first checks the active form; if no form-level menu exists, returns its own report-level menu
- `Trigger`
  returns its own trigger-level menu
- `Collection`
  proxies to its currently active internal child (`trigger` or `report`)

This shared hook means contextual ownership is not permanently restricted to reports/forms/triggers. It only means those are the first built-in workflow types we plan to wire by default.

## `Collection` Behavior

This point is important enough to call out separately.

`Collection` often swaps between:

- an internal trigger
- an internal report

without changing the top-level `AppMain` stack entry.

So the collection itself must expose the right menu of whichever child is currently visible.

Expected behavior:

- if collection is showing its trigger, trigger right menu is used
- if collection is showing its report, report/form right menu is used
- if neither provides a contextual menu, fall back to global right menu

Without this delegation, the shell would not reflect the current workflow state correctly.

## Responsiveness

The side menus must be responsive, and `AppMain` should own that behavior centrally.

Recommended behavior:

## Desktop

- left nav may be `persistent` or `rail`
- right nav may be `persistent`, `rail`, or `temporary`
- both sides may be visible at the same time

## Tablet

- left nav should usually downgrade to `rail` or `temporary`
- right nav should usually downgrade to `temporary`

## Mobile

- both left and right nav should render as temporary drawers/overlays
- neither side should remain persistently open by default
- only one side drawer should be open at a time by default
- opening one temporary drawer on mobile should close the other temporary drawer automatically

This responsive behavior should not be implemented per page. `AppMain` should adapt based on viewport width and drawer options.

## Navigation and History Rules

Side menus should not participate in browser or device history as content entries.

That means:

- `AppManager.showLeftMenu(...)` does not call `AppMain.$showMenu(...)`
- `AppManager.showRightMenu(...)` does not create a navigation stack entry
- browser/device back should not close side drawers unless we later add an optional shell-back mode explicitly

The side menus are shell state only.

Refresh/resume behavior for first pass:

- side-menu open/closed state should not be persisted
- app-configured fallback menus should rebuild naturally from bootstrap
- imperative shell overrides are runtime-only unless a later feature explicitly persists them

## Automatic Refresh Points

`AppMain` should reevaluate contextual right-menu ownership when:

- the active stack entry changes
- a report step/form changes
- a collection internally switches between trigger/report
- a trigger or report explicitly asks for a menu refresh

Planned explicit refresh helpers:

- `AppMain.$refreshRightMenu()`
- `AppManager.refreshRightMenu()`
- `AppMain.$refreshLeftMenu()`
- `AppManager.refreshLeftMenu()`

These are useful when the active page remains the same, but the menu contents should change due to local business state.

Examples:

- a form field selection enables/disables tool actions
- a trigger row selection changes
- a report tab/state changes without leaving the page

## Rendering Model

`AppMain` should host:

- left drawer
- main content stack
- right drawer

Likely structure:

```text
VApp
  VAppBar
  left VNavigationDrawer
    Menu(presentation: 'side-nav')
  VMain
    active stack item
  right VNavigationDrawer
    Menu(presentation: 'side-nav')
  VFooter
```

The mobile header drawer that already exists should remain a separate shell feature and should not be confused with the new left/right application side navigation drawers.

Access and lifecycle rules:

- side-menu `Menu` instances should still honor normal `menu.access()` checks before becoming visible
- when a resolved left/right shell menu is replaced, its event listeners should be detached just like other managed UI instances
- when a contextual owner changes, the previously resolved contextual menu instance should be cleaned up before the replacement is mounted

## Implementation Steps

This is the agreed implementation order.

## Phase 1. Add drawer state to `AppMain`

Files:

- `src/ui/appmain.ts`

Add:

- left drawer refs/state
- right drawer refs/state
- left/right shell menu target storage
- configured fallback left/right menu target storage
- left/right resolved menu instances
- left/right drawer open/close/toggle methods

## Phase 2. Add global shell APIs

Files:

- `src/ui/appmain.ts`
- `src/ui/appmanager.ts`
- `docs/ui/AppMain.md`
- `docs/ui/AppManager.md`

Add:

- `showLeftMenu`
- `showRightMenu`
- `hideLeftMenu`
- `hideRightMenu`
- `toggleLeftMenu`
- `toggleRightMenu`
- `refreshLeftMenu`
- `refreshRightMenu`

These should operate only on shell state.

Also define and implement the precedence rules between:

- configured fallback menus
- imperative shell override menus
- contextual right-menu ownership

## Phase 3. Add `Menu` side-nav presentation

Files:

- `src/ui/menu.ts`
- `docs/ui/Menu.md`

Add:

- `presentation?: 'screen' | 'side-nav'`
- drawer-friendly rendering path
- optional title/back suppression

This phase should preserve current full-screen menu behavior unchanged.

This phase should also make sure drawer rendering does not force the current full-screen menu spacing, alignment, and height assumptions into side navigation.

## Phase 4. Add contextual right-menu ownership

Files:

- `src/ui/base.ts`
- `src/ui/form.ts`
- `src/ui/report.ts`
- `src/ui/trigger.ts`
- `src/ui/collection.ts`

Add:

- shared right-menu resolution hook on `UIBase`
- `FormOptions.rightMenu`
- `ReportOptions.rightMenu`
- `TriggerOptions.rightMenu`
- `Collection` delegation to its active internal child

Explicit first-pass exclusion:

- `Selector`
- `DialogForm`

These are overlay/dialog workflows and should not own side navigation in phase 1.

## Phase 5. Connect `AppMain` reevaluation

Files:

- `src/ui/appmain.ts`
- possibly small hooks in `report.ts` / `collection.ts`

Make `AppMain` reevaluate the active contextual right menu when:

- stack changes
- current form changes
- collection internal mode changes
- explicit refresh is requested

## Phase 6. Responsive behavior

Files:

- `src/ui/appmain.ts`

Add:

- desktop/tablet/mobile mode rules for left/right drawers
- drawer width handling
- temporary/persistent/rail handling
- optional auto-close on navigate for temporary drawers
- mobile rule that only one temporary side drawer is open at a time

## Phase 7. Demo and docs

Files:

- `test-cli-demo-v2/...`
- docs pages for `AppMain`, `AppManager`, `Menu`, `Report`, `Form`, `Trigger`

Add:

- left global workspace nav demo
- right contextual tools demo
- report-level and form-level override demo
- collection delegated menu demo

## Non-Goals For First Pass

To keep the first implementation tight, we should explicitly avoid:

- making side drawers part of browser history
- introducing a brand-new side-nav tree model unrelated to `Menu`
- supporting arbitrary nested expander behavior beyond what current menus already support
- trying to persist left/right drawer open state as part of navigation restore
- unifying mobile header drawer with left/right app side navigation in the first pass
- giving `Selector` or `DialogForm` contextual ownership of side menus in the first pass

## Example Target Usage

Global shell setup:

```ts
new AppMain(
  {
    title: 'Workspace',
    showHeader: true,
  },
  {
    menu: async () => createMainMenu(),
    leftNav: async () => createMainMenu(),
    rightNav: async () => createWorkspaceToolsMenu(),
    leftNavOptions: {
      enabled: true,
      mode: 'persistent',
      width: 300,
    },
    rightNavOptions: {
      enabled: true,
      mode: 'temporary',
      width: 320,
      autoCloseOnNavigate: true,
    },
  },
)
```

Contextual report-level tools:

```ts
$RP(
  {
    title: $l('pages.orders.report.title', 'Orders'),
  },
  {
    rightMenu: async (report) => {
      return createOrdersToolsMenu(report);
    },
  },
)
```

Contextual form override:

```ts
$FM(
  {
    title: $l('pages.orders.forms.pricing.title', 'Pricing'),
  },
  {
    rightMenu: async (form) => {
      return createPricingToolsMenu(form);
    },
  },
)
```

Imperative fallback:

```ts
AppManager.showRightMenu(createWorkspaceToolsMenu())
```

With these rules:

- the active form menu overrides the report menu
- the report menu overrides the global right menu
- when the form/report closes, the previous fallback is restored automatically

## Summary

The agreed architecture is:

- use the current `Menu` / `MenuItem` model
- add shell-managed left and right drawers in `AppMain`
- keep left/right side menus out of stack history
- support both global and contextual right-menu ownership
- let `Form` override `Report` naturally
- let `Collection` proxy to its active internal child
- keep responsiveness centralized in `AppMain`

This gives us a strong shell-navigation architecture without fragmenting the existing menu system.
