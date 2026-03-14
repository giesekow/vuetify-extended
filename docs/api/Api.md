# Api

Shared facade that selects the active backend implementation and exposes `Api.instance` for the rest of the library.

## Source

- [src/api/index.ts](../../src/api/index.ts)

## Highlights

- `Api.setup(...)` defaults to the Feathers-backed client.
- `Api.useFeathers(...)` and `Api.useAxios(...)` install a concrete backend and set `Api.instance`.
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
