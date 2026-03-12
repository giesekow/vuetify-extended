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
- It intentionally does not change the package build or publish flow.
- A few field types with external runtime requirements, such as Google Maps, are easy to add later but are not forced in this first playground.
