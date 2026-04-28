# FeathersApi

Feathers + Keycloak client wrapper that normalizes auth, socket access, and reactive refs to match the axios-backed client.

## Source

- [src/feathers-api/index.ts](../../src/feathers-api/index.ts)

## Highlights

- Wraps the Feathers application returned by the keycloak/socket setup.
- Exposes `apiURL`, `apiURLRef`, `setApiURL(...)`, `user`, `token`, socket helpers, and the same reactive auth/socket refs as the axios client.
- Keeps `Api.instance` shape consistent across both supported backends.
- Normalizes error payloads into `error.message` through a global Feathers error hook so UI code sees useful backend messages.

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

## Shared Service Surface

Services returned by the Feathers client continue to support the normal Feathers method set plus the helper methods used throughout the library:

- CRUD:
  `find`, `findOne`, `findAll`, `count`, `get`, `create`, `update`, `patch`, `remove`
- events:
  `on`, `once`, `off`, `removeListener`, `emit`

## Runtime URL Switching

`setApiURL(newURL)` updates `apiURLRef` and reconfigures the active Feathers transport so future service calls use the new base URL.

- In REST mode, existing services are rebound to the new REST base URL.
- In socket mode, a new socket connection is created for the new URL and existing services are rebound to it. Custom listeners registered through `onSocket(...)` are reattached automatically.

## Error Behavior

The Feathers client now applies a global error hook that normalizes common backend payload shapes into `error.message`.

This is especially useful when:

- the backend returns array-based validation messages
- the backend returns a REST error payload shaped like `{ message, error, statusCode }`

Practical result:

- existing UI code that reads `error.message` gets the meaningful backend message instead of a generic transport-level message

Normalized extra fields may also be available on the thrown error:

- `error.statusCode`
- `error.data`
- `error.errorType`
