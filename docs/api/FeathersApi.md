# FeathersApi

Feathers + Keycloak client wrapper that normalizes auth, socket access, and reactive refs to match the axios-backed client.

## Source

- [src/feathers-api/index.ts](../../src/feathers-api/index.ts)

## Highlights

- Wraps the Feathers application returned by the keycloak/socket setup.
- Exposes `user`, `token`, socket helpers, and the same reactive auth/socket refs as the axios client.
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
