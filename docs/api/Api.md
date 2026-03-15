# Api

Shared facade that selects the active backend implementation and exposes `Api.instance` for the rest of the library.

## Source

- [src/api/index.ts](../../src/api/index.ts)

## Highlights

- `Api.setup(...)` defaults to the Feathers-backed client.
- `Api.useFeathers(...)` and `Api.useAxios(...)` install a concrete backend and set `Api.instance`.
- `Api.instance.apiURL`, `Api.instance.apiURLRef`, and `Api.instance.setApiURL(...)` are available across both backends.
- `$API` is exported as a convenience alias for `Api`.

## Reference

### `Api`

```ts
export class Api {
  // see source for full implementation
}
```

## Key Methods

- `static setup(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions)`
- `static useFeathers(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions)`
- `static useAxios(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions)`
- `static setInstance(instance: Application)`

## Shared Runtime Surface

Once a backend is configured, `Api.instance` now provides:

- `apiURL`
- `apiURLRef`
- `setApiURL(newURL)`

`apiURLRef` is useful for reactive binding in shell widgets or diagnostics panels. `setApiURL(newURL)` updates the live backend so future requests use the new base URL.
