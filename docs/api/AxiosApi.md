# AxiosApi

Axios-based Keycloak client with service-style CRUD wrappers, optional Socket.IO realtime routing, and reactive auth state refs.

## Source

- [src/axios-api/index.ts](../../src/axios-api/index.ts)

## Highlights

- Supports host-configurable auth sync endpoints, including `GET` endpoints like `auth/me`.
- Can route Socket.IO envelopes into `service(path).on(...)` events.
- Exposes `user`, `token`, `userRef`, `tokenRef`, `authenticatedRef`, `permissionsRef`, and `socketConnectedRef` on the application instance.

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
