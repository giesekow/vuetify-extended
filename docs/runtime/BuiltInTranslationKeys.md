# Built-In Translation Keys

This page documents the built-in translation keys currently used by `vuetify-extended`.

These keys are the library's own default UI vocabulary. A host application can override any of them through the global i18n adapter configured in `createVuetifyExtendedApp({ i18n: ... })`.

## Strategy

The library follows two rules:

- Use `ve.common.*` for reusable labels that appear across multiple screens or widgets.
- Use feature-specific namespaces such as `ve.report.*` or `ve.dashboard.*` only when the wording is contextual and should remain scoped to that feature.

### Recommended Override Pattern

Override generic button and action labels in one place through `ve.common.*`:

```ts
const messages = {
  en: {
    've.common.save': 'Save',
    've.common.cancel': 'Cancel',
    've.common.confirm': 'Confirm',
    've.common.close': 'Close',
  },
  fr: {
    've.common.save': 'Enregistrer',
    've.common.cancel': 'Annuler',
    've.common.confirm': 'Confirmer',
    've.common.close': 'Fermer',
  },
};
```

This keeps translations consistent across forms, reports, selectors, prompts, preview dialogs, editors, shell menus, and other shared UI surfaces.

## `ve.common.*`

Generic shared UI labels:

- `ve.common.accessDenied`
- `ve.common.actions`
- `ve.common.apply`
- `ve.common.cancel`
- `ve.common.close`
- `ve.common.confirm`
- `ve.common.download`
- `ve.common.edit`
- `ve.common.export`
- `ve.common.finish`
- `ve.common.insert`
- `ve.common.loading`
- `ve.common.name`
- `ve.common.next`
- `ve.common.no`
- `ve.common.open`
- `ve.common.prev`
- `ve.common.print`
- `ve.common.redo`
- `ve.common.refresh`
- `ve.common.remove`
- `ve.common.save`
- `ve.common.undo`
- `ve.common.view`
- `ve.common.yes`

## `ve.mode.*`

Shared mode labels used by forms and reports:

- `ve.mode.create`
- `ve.mode.display`
- `ve.mode.edit`

## `ve.validation.*`

Shared validation messages used by `FieldParams.required`, `FieldParams.validation`, the exported `$v` helpers, file-size checks, and `Master` validation errors:

- `ve.validation.equal`
- `ve.validation.error`
- `ve.validation.excludes`
- `ve.validation.fileMaxSize`
- `ve.validation.greaterThan`
- `ve.validation.greaterThanOrEqual`
- `ve.validation.includes`
- `ve.validation.lessThan`
- `ve.validation.lessThanOrEqual`
- `ve.validation.max`
- `ve.validation.maxLength`
- `ve.validation.min`
- `ve.validation.minLength`
- `ve.validation.notEqual`
- `ve.validation.notOneOf`
- `ve.validation.oneOf`
- `ve.validation.regex`
- `ve.validation.required`

Interpolation values:

- `ve.validation.equal`, `notEqual`, `greaterThan`, `greaterThanOrEqual`, `lessThan`, `lessThanOrEqual`, `includes`, and `excludes`: `{ value }`
- `ve.validation.max` and `maxLength`: `{ max }`
- `ve.validation.min` and `minLength`: `{ min }`
- `ve.validation.oneOf` and `notOneOf`: `{ values }`
- `ve.validation.regex`: `{ pattern }`
- `ve.validation.fileMaxSize`: `{ file }`, `{ max }`
- `ve.validation.error`: `{ message }`

`FieldParams.validation.range` uses `ve.validation.min` or `ve.validation.max`, depending on which boundary failed.

## `ve.app.*`

`AppMain` shell and navigation labels:

- `ve.app.closeLeftNav`
- `ve.app.closeRightNav`
- `ve.app.closeSideNav`
- `ve.app.openHeaderMenu`
- `ve.app.openLeftNav`
- `ve.app.openRightNav`
- `ve.app.quickActions`
- `ve.app.title`

Notes:

- `ve.app.closeLeftNav` and `ve.app.closeRightNav` are used by side navigation close buttons.
- `ve.app.closeSideNav` is the shared fallback used by side-navigation menu close buttons when no side-specific close tooltip is supplied.
- `ve.app.openLeftNav` and `ve.app.openRightNav` are used by temporary side navigation toggle buttons.
- The compact-header overflow drawer uses `ve.app.quickActions` for its title and `ve.common.close` for its close control. The older `ve.app.headerMenu` / `ve.app.closeHeaderMenu` wording is not part of the runtime key set.

## `ve.field.pagination.*`

First-class `pagination` field labels:

- `ve.field.pagination.itemsPerPage`
- `ve.field.pagination.navigation`
- `ve.field.pagination.nextPage`
- `ve.field.pagination.pageOf`
- `ve.field.pagination.previousPage`
- `ve.field.pagination.range`
- `ve.field.pagination.setItemsPerPage`
- `ve.field.pagination.zeroItems`

Interpolation values:

- `ve.field.pagination.pageOf`: `{ page }`, `{ total }`
- `ve.field.pagination.range`: `{ start }`, `{ end }`, `{ total }`
- `ve.field.pagination.setItemsPerPage`: `{ limit }`

The visible previous/next button text uses `ve.common.prev` and `ve.common.next`.

## `ve.dialog.*`

Dialog-specific labels that are still contextual to dialogs rather than generic actions:

- `ve.dialog.confirmTitle`
- `ve.dialog.infoTitle`
- `ve.dialog.promptTitle`
- `ve.dialog.promptValue`
- `ve.dialog.preview.closePreview`
- `ve.dialog.preview.documentFallback`
- `ve.dialog.preview.moreActions`
- `ve.dialog.preview.resetZoom`
- `ve.dialog.preview.zoomIn`
- `ve.dialog.preview.zoomOut`

Notes:

- Generic button texts inside dialogs use `ve.common.*`.
- Example:
  - prompt save button => `ve.common.confirm`
  - prompt cancel button => `ve.common.cancel`
  - preview close/open/download => `ve.common.close`, `ve.common.open`, `ve.common.download`

## `ve.field.*`

Field-specific helper text, uploads, previews, and asset messages:

- `ve.field.assetLabel`
- `ve.field.assetResolveFailed`
- `ve.field.assetUploadFailed`
- `ve.field.autoGenerated`
- `ve.field.autoGeneratedPlaceholder`
- `ve.field.autocomplete.add`
- `ve.field.autocomplete.items`
- `ve.field.autocomplete.loadMore`
- `ve.field.autocomplete.loadingMore`
- `ve.field.autocomplete.noMatches`
- `ve.field.autocomplete.removeSelected`
- `ve.field.autocomplete.selected`
- `ve.field.autocomplete.selectedItems`
- `ve.field.autocomplete.typeMinChars`
- `ve.field.fileIndexedLabel`
- `ve.field.fileLabel`
- `ve.field.fileProcessFailed`
- `ve.field.fileSelectFailed`
- `ve.field.fileUpload.clearSelected`
- `ve.field.fileUpload.unsupportedType`
- `ve.field.fileUpload.uploadSelected`
- `ve.field.locationIndexed`
- `ve.field.preview`

Notes:

- `ve.field.locationIndexed` supports interpolation values:
  - `{ label }`
  - `{ index }`
- `ve.field.fileIndexedLabel` supports interpolation values:
  - `{ index }`
- `ve.field.fileUpload.unsupportedType` supports interpolation values:
  - `{ names }`
- `ve.field.autocomplete.selected` supports interpolation values:
  - `{ count }`
  - `{ label }`
- `ve.field.autocomplete.removeSelected` supports interpolation values:
  - `{ count }`

## `ve.form.*`

Form-specific messages that are not just generic button labels:

- `ve.form.confirmSave`
- `ve.form.fieldRequired`
- `ve.form.saved`
- `ve.form.unableToSave`
- `ve.form.validationSummaryTitle`

Notes:

- Generic form button labels use `ve.common.prev`, `ve.common.cancel`, and `ve.common.save`.

## `ve.report.*`

Report-specific runtime messages:

- `ve.report.confirmCancel`
- `ve.report.confirmDiscardChanges`
- `ve.report.progress`
- `ve.report.stepOf`

Notes:

- `ve.report.stepOf` supports interpolation values:
  - `{ current }`
  - `{ total }`
- Generic report button labels use `ve.common.cancel`, `ve.common.next`, `ve.common.prev`, `ve.common.save`, `ve.common.finish`, `ve.common.print`, and `ve.common.export`.

## `ve.selector.*`

Selector-specific runtime messages:

- `ve.selector.loadingOptions`
- `ve.selector.noRecords`
- `ve.selector.searchPlaceholder`

Notes:

- Generic selector buttons use `ve.common.cancel` and `ve.common.confirm`.

## `ve.trigger.*`

Trigger-specific runtime messages:

- `ve.trigger.confirmRemoveSelected`
- `ve.trigger.enterSearchPrompt`
- `ve.trigger.filterPlaceholder`
- `ve.trigger.itemsRemoved`
- `ve.trigger.itemsSelected`
- `ve.trigger.loadingResults`
- `ve.trigger.noMatchingRecords`
- `ve.trigger.resultsFound`
- `ve.trigger.searchGuidance`
- `ve.trigger.searchPlaceholder`
- `ve.trigger.unableToRemoveItems`
- `ve.trigger.undefinedItemId`

Notes:

- `ve.trigger.itemsRemoved` supports interpolation values:
  - `{ count }`
- `ve.trigger.itemsSelected` supports interpolation values:
  - `{ count }`
- `ve.trigger.resultsFound` supports interpolation values:
  - `{ count }`
- Generic trigger buttons use `ve.common.remove`, `ve.common.view`, `ve.common.edit`, `ve.common.cancel`, `ve.common.print`, and `ve.common.export`.

## `ve.dashboard.*`

Dashboard labels and empty states:

- `ve.dashboard.actions.empty`
- `ve.dashboard.alerts.empty`
- `ve.dashboard.calendar.more`
- `ve.dashboard.chart.empty`
- `ve.dashboard.chart.noValues`
- `ve.dashboard.chart.total`
- `ve.dashboard.close`
- `ve.dashboard.emptyState.title`
- `ve.dashboard.list.empty`
- `ve.dashboard.map.empty`
- `ve.dashboard.menu.empty`
- `ve.dashboard.menu.label`
- `ve.dashboard.menu.loading`
- `ve.dashboard.progress.empty`
- `ve.dashboard.refresh`
- `ve.dashboard.stats.empty`
- `ve.dashboard.table.empty`
- `ve.dashboard.table.pageOf`
- `ve.dashboard.table.range`
- `ve.dashboard.table.searchPlaceholder`
- `ve.dashboard.table.zeroItems`
- `ve.dashboard.tabs.empty`
- `ve.dashboard.timeline.empty`

Notes:

- `ve.dashboard.calendar.more` supports interpolation values:
  - `{ count }`
- `ve.dashboard.table.pageOf` supports interpolation values:
  - `{ page }`
  - `{ totalPages }`
- `ve.dashboard.table.range` supports interpolation values:
  - `{ start }`
  - `{ end }`
  - `{ total }`
- Dashboard table pagination labels use `ve.common.prev` and `ve.common.next`.

## `ve.mailbox.*`

Mailbox-specific labels:

- `ve.mailbox.clearSelection`
- `ve.mailbox.clearUnreadBadge`
- `ve.mailbox.confirmDeleteSelected`
- `ve.mailbox.deleteSelected`
- `ve.mailbox.empty`
- `ve.mailbox.loadFailed`
- `ve.mailbox.loadMore`
- `ve.mailbox.loadedStatus`
- `ve.mailbox.loading`
- `ve.mailbox.markRead`
- `ve.mailbox.markSelectedRead`
- `ve.mailbox.markUnread`
- `ve.mailbox.moreAvailableSuffix`
- `ve.mailbox.open`
- `ve.mailbox.selectedCount`
- `ve.mailbox.title`
- `ve.mailbox.unreadCount`

Notes:

- `ve.mailbox.loadedStatus` supports interpolation values:
  - `{ shown }`
  - `{ total }`
- `ve.mailbox.moreAvailableSuffix` supports interpolation values:
  - `{ count }`
- `ve.mailbox.selectedCount` supports interpolation values:
  - `{ count }`
- `ve.mailbox.unreadCount` supports interpolation values:
  - `{ count }`
- Generic mailbox toolbar buttons use `ve.common.refresh`, `ve.common.close`, and `ve.common.remove`.

## `ve.fullscreen.*`

Fullscreen access-denied and splash-screen labels:

- `ve.fullscreen.accessDenied.message`
- `ve.fullscreen.accessDenied.subtitle`
- `ve.fullscreen.accessDenied.title`
- `ve.fullscreen.logoAlt`
- `ve.fullscreen.splash.loadingText`
- `ve.fullscreen.splash.message`
- `ve.fullscreen.splash.subtitle`
- `ve.fullscreen.splash.title`

## `ve.shell.*`

Shell widget helper and accessibility text:

- `ve.shell.actionAriaLabel`
- `ve.shell.appTitleImageAlt`

## `ve.user.*`

User-area helper and accessibility text:

- `ve.user.accountId`
- `ve.user.accountIdCopied`
- `ve.user.avatarAlt`
- `ve.user.copied`
- `ve.user.copyAccountId`
- `ve.user.menuActionAriaLabel`
- `ve.user.openMenu`

## `ve.shortcut.*`

Shortcut modifier labels:

- `ve.shortcut.alt`
- `ve.shortcut.cmd`
- `ve.shortcut.ctrl`
- `ve.shortcut.shift`

## `ve.editor.*`

Rich HTML editor toolbar, prompts, block styles, table actions, video actions, and fullscreen labels:

- `ve.editor.align.center`
- `ve.editor.align.justify`
- `ve.editor.align.left`
- `ve.editor.align.right`
- `ve.editor.block.blockQuote`
- `ve.editor.block.codeBlock`
- `ve.editor.block.codeShort`
- `ve.editor.block.heading`
- `ve.editor.block.paragraph`
- `ve.editor.block.quoteShort`
- `ve.editor.block.taskList`
- `ve.editor.block.taskShort`
- `ve.editor.clearFormatting`
- `ve.editor.formula.block`
- `ve.editor.formula.inline`
- `ve.editor.fullscreen.close`
- `ve.editor.fullscreen.open`
- `ve.editor.image.insert`
- `ve.editor.insertHorizontalRule`
- `ve.editor.link.editTitle`
- `ve.editor.link.insertOrEdit`
- `ve.editor.link.insertTitle`
- `ve.editor.link.label`
- `ve.editor.link.placeholder`
- `ve.editor.link.promptText`
- `ve.editor.link.remove`
- `ve.editor.list.bulleted`
- `ve.editor.list.numbered`
- `ve.editor.mark.bold`
- `ve.editor.mark.inlineCode`
- `ve.editor.mark.italic`
- `ve.editor.mark.strikeThrough`
- `ve.editor.mark.underline`
- `ve.editor.moreActions`
- `ve.editor.source.apply`
- `ve.editor.source.cancel`
- `ve.editor.source.switchToHtml`
- `ve.editor.table.actions`
- `ve.editor.table.addColumnAfter`
- `ve.editor.table.addColumnBefore`
- `ve.editor.table.addRowAfter`
- `ve.editor.table.addRowBefore`
- `ve.editor.table.cellAlignCenter`
- `ve.editor.table.cellAlignLeft`
- `ve.editor.table.cellAlignRight`
- `ve.editor.table.cellJustify`
- `ve.editor.table.columns`
- `ve.editor.table.columnsPrompt`
- `ve.editor.table.deleteColumn`
- `ve.editor.table.deleteRow`
- `ve.editor.table.deleteTable`
- `ve.editor.table.insertTitle`
- `ve.editor.table.mergeCells`
- `ve.editor.table.mergeOrSplit`
- `ve.editor.table.prefixedAction`
- `ve.editor.table.rows`
- `ve.editor.table.rowsPrompt`
- `ve.editor.table.shortLabel`
- `ve.editor.table.splitCell`
- `ve.editor.table.toggleHeaderCell`
- `ve.editor.table.toggleHeaderColumn`
- `ve.editor.table.toggleHeaderRow`
- `ve.editor.toolbar.alignment`
- `ve.editor.toolbar.blockStyle`
- `ve.editor.video.customWidth`
- `ve.editor.video.embeddedTitle`
- `ve.editor.video.insertTitle`
- `ve.editor.video.prefixedAction`
- `ve.editor.video.promptText`
- `ve.editor.video.resizePrompt`
- `ve.editor.video.resizeTitle`
- `ve.editor.video.shortLabel`
- `ve.editor.video.size`
- `ve.editor.video.unsupportedUrl`
- `ve.editor.video.urlLabel`
- `ve.editor.video.urlPlaceholder`
- `ve.editor.video.vimeoTitle`
- `ve.editor.video.width100`
- `ve.editor.video.width50`
- `ve.editor.video.width75`
- `ve.editor.video.widthPercent`
- `ve.editor.video.youtubeTitle`

Notes:

- `ve.editor.block.heading` supports interpolation values:
  - `{ level }`
- `ve.editor.table.prefixedAction` supports interpolation values:
  - `{ title }`
- `ve.editor.video.prefixedAction` supports interpolation values:
  - `{ title }`
- Most toolbar buttons combine these editor keys with shared `ve.common.*` keys such as `ve.common.undo`, `ve.common.redo`, `ve.common.insert`, and `ve.common.apply`.

## What Is Not Part Of The Public Translation Catalog

The following categories are intentionally not documented as host-facing translation keys:

- CLI-only placeholder strings such as `ve.replace`
- non-UI internal persistence metadata
- runtime helper interfaces that happen to store already-resolved display strings

If a key is listed on this page, you can safely override it through the global app i18n adapter. If it is not listed here, it should be treated as either app-owned text or internal runtime state rather than part of the library's built-in translation contract.

## Stability Guidance

These built-in keys are intended to be developer-facing and safe to override.

Recommended practice:

1. Treat `ve.common.*` and `ve.mode.*` as your baseline shared vocabulary.
2. Override feature-specific keys only when you want to customize library wording for that feature.
3. Prefer your own app/page keys for business-specific labels and titles.
4. Use `ve.*` keys for library-provided chrome, built-in actions, prompts, empty states, status messages, and accessibility text.

## Related Pages

- [Localization](./Localization.md)
- [Runtime Guides Index](./README.md)
- [AppMain](../ui/AppMain.md)
- [Dialogs](../ui/Dialogs.md)
- [Field](../ui/Field.md)
- [Dashboard](../ui/Dashboard.md)
