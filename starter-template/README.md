# Starter Template

This starter template mirrors the local `test/` playground, but it consumes `vuetify-extended` from the GitHub package instead of importing the workspace source directly.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## What It Includes

- Vue 3 + Vuetify 3 + Vite
- `createVuetifyExtendedApp(...)` bootstrap usage
- `src/bootstrap.ts` for app/bootstrap wiring so `main.ts` stays clean
- Dialogs and notifications roots mounted from the package
- In-memory demo API and seeded demo data
- Demo screens for menus, reports, triggers, mailbox, notifications, and shell widgets

## Package Source

This template installs the library from:

```text
git+https://github.com/giesekow/vuetify-extended.git
```

If you want to pin a tag or branch, update `starter-template/package.json` accordingly.
