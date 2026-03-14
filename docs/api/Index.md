# API Reference

The API layer provides a shared facade plus two backend implementations: a Feathers client and an axios-based client. Both are normalized to expose the same auth, socket, and reactive state surface.

## Pages

- [Api](./Api.md)
  Shared facade that selects the active backend implementation and exposes `Api.instance` for the rest of the library.
- [AxiosApi](./AxiosApi.md)
  Axios-based Keycloak client with service-style CRUD wrappers, optional Socket.IO realtime routing, and reactive auth state refs.
- [FeathersApi](./FeathersApi.md)
  Feathers + Keycloak client wrapper that normalizes auth, socket access, and reactive refs to match the axios-backed client.
