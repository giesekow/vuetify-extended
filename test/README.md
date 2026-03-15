# Test App

This folder contains a manual Vue 3 + Vuetify playground for `vuetify-extended`.

It is meant to exercise the library's main UI building blocks in one place:

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

The app uses a small in-memory API adapter instead of a live backend, so reports, triggers, selectors, and save flows can run locally.

The playground now boots through `createVuetifyExtendedApp(...)`, so it exercises the recommended setup path as well as the UI widgets themselves.

## Run

From the repository root, install the main library dependencies if needed:

```bash
npm install
```

Then install the test app tooling and start the playground:

```bash
cd test
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:4174`.

## Notes

- The test app imports the local library source from `../src`.
- It uses the high-level setup helper plus `Dialogs.rootComponent()` instead of wiring every dialog component manually.
- It intentionally does not change the package build or publish flow.
- Map and polygon-map demos are included. To enable them, set `VITE_GOOGLE_MAPS_API_KEY` in `test/.env`. A repo-root `.env` is also accepted as a fallback.
