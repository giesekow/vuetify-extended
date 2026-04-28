# AxiosApi

Axios-based Keycloak client with service-style CRUD wrappers, optional Socket.IO realtime routing, and reactive auth state refs.

## Source

- [src/axios-api/index.ts](../../src/axios-api/index.ts)

## Highlights

- Supports host-configurable auth sync endpoints, including `GET` endpoints like `auth/me`.
- Can route Socket.IO envelopes into `service(path).on(...)` events.
- Mirrors `params.query` into normal URL query params even when `queryMode` is `rawquery-header`, while still preserving the legacy rawquery header.
- Exposes `apiURL`, `apiURLRef`, `setApiURL(...)`, `user`, `token`, `userRef`, `tokenRef`, `authenticatedRef`, `permissionsRef`, and `socketConnectedRef` on the application instance.
- Normalizes server error payloads into `error.message`, including common NestJS response shapes such as `{ message, error, statusCode }`.

## Reference

### `AxiosApiOptions`

```ts
export interface AxiosApiOptions {
  useSocket?: boolean;
  socketURL?: string;
  socketEvent?: string;
  socketOptions?: Partial<ManagerOptions & SocketOptions>;
  socketAuthMode?: 'auth' | 'query';
  axiosConfig?: AxiosRequestConfig;
  queryMode?: 'rawquery-header' | 'params';
  authPath?: string | false;
  refreshAuthPath?: string | false;
  authCreateMethod?: 'get' | 'post' | 'put';
  authRefreshMethod?: 'get' | 'patch' | 'post' | 'put';
  tokenHeader?: string;
  tokenPrefix?: string;
}
```

### `AxiosServiceParams`

```ts
export interface AxiosServiceParams {
  query?: any;
  headers?: Record<string, any>;
  axios?: AxiosRequestConfig;
}
```

`query` is always mirrored into normal axios URL params. If `queryMode` is `rawquery-header`, the same payload is also sent in the legacy `rawquery` header for servers that still depend on it.

### `AxiosApi`

```ts
export class AxiosApi {
  // see source for full implementation
}
```

### `AxiosApplication`

```ts
export class AxiosApplication extends SimpleEventEmitter implements Application {
  // see source for full implementation
}
```

## Key Methods

- `static setup(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions)`
- `instance.setApiURL(newURL: string)`

## Shared Service Surface

Services returned by `AxiosApi.instance.service(path)` support:

- CRUD:
  `find`, `findOne`, `findAll`, `count`, `get`, `create`, `update`, `patch`, `remove`
- events:
  `on`, `once`, `off`, `removeListener`, `emit`

That means axios-backed services can participate in the same `.on(...)` / `.off(...)` style runtime patterns used elsewhere in the library.

## Runtime URL Switching

`setApiURL(newURL)` updates `client.defaults.baseURL`, updates `apiURLRef`, and makes future axios service calls use the new base URL immediately.

If Socket.IO is enabled and `socketURL` was not configured explicitly, the socket endpoint is treated as derived from the API URL. In that case `setApiURL(...)` replaces the socket connection and reconnects it against the new base URL. Custom listeners registered through `onSocket(...)` are reattached to the replacement socket automatically.

If `socketURL` was configured explicitly, `setApiURL(...)` only changes the HTTP API base. The socket target remains unchanged.

## Error Behavior

Axios errors are normalized before being rethrown from the client interceptor.

Practical result:

- if the server returns a NestJS-style payload such as:
  `{ message: 'Validation failed', error: 'Bad Request', statusCode: 400 }`
- or:
  `{ message: ['Name is required', 'Email is invalid'], statusCode: 400 }`

then existing UI code that reads `error.message` receives the useful server message instead of the generic axios text `Request failed with status code 400`.

Normalized extra fields may also be available on the thrown error:

- `error.statusCode`
- `error.data`
- `error.errorType`
