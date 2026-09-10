# Prompt teardown regression

## Problem

With Vuetify 4.1.2 and Vue 3.5.38, submitting or cancelling a
`Dialogs.$prompt` could throw:

```text
TypeError: Cannot read properties of null (reading 'activatorEl')
vuetify/lib/components/VDialog/VDialog.js:61
```

The prompt cleared its rendered DialogForm immediately after setting its
active model to false. Vuetify's focus watcher resumes after a Vue tick and
expects the overlay ref to still exist.

## Fix and behaviour

- `DialogForm.hide()` now waits for the leave event while keeping the dialog
  mounted. A never-mounted dialog can still close without waiting for an event.
- Programmatic dialogs use the CSS dialog transition rather than an activator
  geometry-based transition, avoiding invalid scaling for zero-sized targets.
- `Dialogs.$prompt` restores the element focused before the prompt after close if
  it is still connected. Shell-managed `DialogForm` instances continue to use
  `AppMain` as their single focus-restoration owner.
- Prompt resolution/unmounting follows completed hide. Delayed callbacks cannot
  close or resolve a newer prompt. Only the latest concurrent prompt request is
  mounted after lazy imports.
- If the dialog is externally unmounted and Vuetify cannot emit `afterLeave`, the
  root-ref cleanup completes the pending hide instead of leaving it unresolved.
- No console-error suppression, private Vuetify mutation or timer delay is used.

Awaiting `hide()` now means the close transition has completed, not just that
the active model was changed. Keep the DialogForm component mounted while
awaiting it, then remove it.

## Verification

`npm test` includes the lifecycle regression, ESM/CJS builds and the existing
dialog, field, refresh, validation, accessibility, widget and CLI suites.

An isolated NimTree Admin browser harness aliases the package entrypoint to this
branch's built ESM output, with the consumer's normal Vue/Vuetify instances.
The test opens a plain prompt, fills a synthetic value, submits, reopens and
cancels, then reopens and submits again. It checks visible close, focus return,
page errors and invalid animation-keyframe warnings. No authenticated API or
campaign mutation is involved.

The unpatched 1.0.6 package produced three null-activator exceptions. The patched
build passes desktop Chromium and a 390px mobile Chromium viewport.
The consumer regression is `nimtree-admin/e2e/prompt-close.spec.ts`.
The package version and consumer dependency pin are intentionally unchanged;
release and adoption follow review.
