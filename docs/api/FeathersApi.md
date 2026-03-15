# FeathersApi

Feathers + Keycloak client wrapper that normalizes auth, socket access, and reactive refs to match the axios-backed client.

## Source

- [src/feathers-api/index.ts](../../src/feathers-api/index.ts)

## Highlights

- Wraps the Feathers application returned by the keycloak/socket setup.
- Exposes `apiURL`, `apiURLRef`, `setApiURL(...)`, `user`, `token`, socket helpers, and the same reactive auth/socket refs as the axios client.
- Keeps `Api.instance` shape consistent across both supported backends.

## Reference

### `SocketIOOptions`

```ts
export interface SocketIOOptions {
  transports?: string[];
  timeout?: number;
  useSocket?: boolean;
}
```

### `FeathersApi`

```ts
export class FeathersApi {
  // see source for full implementation
}
```

## Key Methods

- `static setup(apiURL: any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions)`
- `instance.setApiURL(newURL: string)`

## Runtime URL Switching

`setApiURL(newURL)` updates `apiURLRef` and reconfigures the active Feathers transport so future service calls use the new base URL.

- In REST mode, existing services are rebound to the new REST base URL.
- In socket mode, a new socket connection is created for the new URL and existing services are rebound to it. Custom listeners registered through `onSocket(...)` are reattached automatically.
