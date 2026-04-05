import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import type { FeathersApplication } from '../declarations';
import socketio from '@feathersjs/socketio-client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { AuthConfigure } from 'feathers-keycloak-connect-client'
import type { KeycloakClientConfig } from 'feathers-keycloak-connect-client'
import { shallowRef } from 'vue';
import findOne from './find-one';
import count from './count';
import findAll from './find-all';

export interface SocketIOOptions {
  transports?: string[];
  timeout?: number;
  useSocket?: boolean;
}

export type FeathersKeycloakClientConfig = KeycloakClientConfig;

function extractFeathersClientErrorMessage(error: any): string | undefined {
  const responseData = error?.response?.data;
  const data = error?.data || responseData;

  if (Array.isArray(error?.message)) {
    const items = error.message.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
    if (items.length) {
      return items.join('\n');
    }
  }

  if (typeof error?.message === 'string' && error.message.trim().length > 0) {
    return error.message;
  }

  if (typeof data === 'string' && data.trim().length > 0) {
    return data;
  }

  if (Array.isArray(data?.message)) {
    const items = data.message
      .map((item: any) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item.message === 'string') {
          return item.message;
        }

        return undefined;
      })
      .filter((item: string | undefined): item is string => !!item && item.trim().length > 0);

    if (items.length) {
      return items.join('\n');
    }
  }

  if (typeof data?.message === 'string' && data.message.trim().length > 0) {
    return data.message;
  }

  if (Array.isArray(data?.errors)) {
    const items = data.errors
      .map((item: any) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item.message === 'string') {
          return item.message;
        }

        return undefined;
      })
      .filter((item: string | undefined): item is string => !!item && item.trim().length > 0);

    if (items.length) {
      return items.join('\n');
    }
  }

  if (typeof data?.error === 'string' && data.error.trim().length > 0) {
    return data.error;
  }

  return undefined;
}

function normalizeFeathersClientError(error: any) {
  if (!error || typeof error !== 'object') {
    return error;
  }

  const responseData = error?.response?.data;
  const data = error.data || responseData;
  const message = extractFeathersClientErrorMessage(error);

  if (message && error.message !== message) {
    error.originalMessage = error.message;
    error.message = message;
  }

  if (data !== undefined && error.data === undefined) {
    error.data = data;
  }

  if (error.statusCode === undefined) {
    error.statusCode = error.code ?? error.status ?? data?.statusCode ?? error?.response?.status;
  }

  if (error.errorType === undefined && typeof data?.error === 'string') {
    error.errorType = data.error;
  }

  return error;
}

export class FeathersApi {
  static instance: FeathersApplication;

  static setup(apiURL: any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions): FeathersApplication {
    const appCreator: any = feathers;
    const client: any = appCreator();
    const usesSocket = soptions?.useSocket === true;
    let socket: any = undefined;
    const socketListeners = new Map<string, Set<(...args: any[]) => void>>();

    const normalizeApiURL = (value: any) => (typeof value === 'string' && value.length > 0 ? value : undefined);
    const buildServiceBase = (baseURL: string | undefined, serviceName: string) => {
      const normalizedName = String(serviceName).replace(/^\/+/, '');
      if (!baseURL) {
        return `/${normalizedName}`;
      }

      return `${baseURL.replace(/\/+$/, '')}/${normalizedName}`;
    };

    const apiURLRef = shallowRef<string | undefined>(normalizeApiURL(apiURL));
    const userRef = shallowRef<any>(null);
    const tokenRef = shallowRef<string | undefined>(undefined);
    const authenticatedRef = shallowRef<boolean | undefined>(undefined);
    const permissionsRef = shallowRef<any[]>([]);
    const socketConnectedRef = shallowRef<boolean>(false);

    const attachCustomSocketListeners = (currentSocket: any) => {
      if (!currentSocket) {
        return;
      }

      for (const [event, listeners] of socketListeners.entries()) {
        for (const listener of listeners) {
          currentSocket.on(event, listener);
        }
      }
    };

    const bindSocketState = (currentSocket: any) => {
      if (!currentSocket) {
        return;
      }

      currentSocket.on('connect', () => {
        if (socket !== currentSocket) {
          return;
        }

        socketConnectedRef.value = true;
      });

      currentSocket.on('disconnect', () => {
        if (socket !== currentSocket) {
          return;
        }

        socketConnectedRef.value = false;
      });

      currentSocket.on('connect_error', () => {
        if (socket !== currentSocket) {
          return;
        }

        socketConnectedRef.value = false;
      });

      attachCustomSocketListeners(currentSocket);
    };

    const replaceSocket = (nextApiURL: string | undefined) => {
      const previousSocket = socket;
      if (previousSocket) {
        previousSocket.removeAllListeners?.();
        previousSocket.disconnect();
      }

      socketConnectedRef.value = false;

      if (!nextApiURL) {
        socket = undefined;
        return;
      }

      socket = io(nextApiURL, {
        transports: soptions?.transports || ['websocket'],
        timeout: soptions?.timeout || 6 * 1000,
      });

      bindSocketState(socket);
    };

    const updateExistingServices = (nextApiURL: string | undefined) => {
      for (const [serviceName, service] of Object.entries(client.services || {})) {
        if (!service || typeof service !== 'object') {
          continue;
        }

        const mutableService = service as any;
        if (usesSocket) {
          mutableService.connection = socket;
        } else {
          mutableService.base = buildServiceBase(nextApiURL, serviceName);
        }
      }
    };

    const configureTransport = (nextApiURL: any) => {
      const normalizedURL = normalizeApiURL(nextApiURL);
      apiURLRef.value = normalizedURL;

      if (usesSocket) {
        replaceSocket(normalizedURL);
        if (socket) {
          client.configure(socketio(socket));
        }
      } else {
        const restClient = rest(normalizedURL);
        client.configure(restClient.axios(axios));
      }

      updateExistingServices(normalizedURL);
    };

    configureTransport(apiURL);
    client.configure(AuthConfigure(keycloakConfig));

    userRef.value = client.authentication?.user ?? null;
    tokenRef.value = client.keycloak?.token;
    authenticatedRef.value = client.keycloak?.authenticated;
    permissionsRef.value = client.authentication?.user?.permissions || [];
    socketConnectedRef.value = !!socket?.connected;

    client.on('authSuccess', (payload: any) => {
      userRef.value = payload?.user ?? client.authentication?.user ?? null;
      tokenRef.value = payload?.token ?? client.keycloak?.token;
      authenticatedRef.value = client.keycloak?.authenticated;
      permissionsRef.value = userRef.value?.permissions || [];
    }, Symbol('feathers-user-ref-auth-success'));

    client.on('token-refreshed', (payload: any) => {
      userRef.value = payload?.user ?? client.authentication?.user ?? null;
      tokenRef.value = payload?.token ?? client.keycloak?.token;
      authenticatedRef.value = client.keycloak?.authenticated;
      permissionsRef.value = userRef.value?.permissions || [];
    }, Symbol('feathers-user-ref-token-refreshed'));

    client.on('authLogout', () => {
      userRef.value = null;
      tokenRef.value = undefined;
      authenticatedRef.value = client.keycloak?.authenticated;
      permissionsRef.value = [];
      socketConnectedRef.value = false;
    }, Symbol('feathers-user-ref-auth-logout'));

    Object.defineProperty(client, 'user', {
      get() {
        return client.authentication?.user;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'token', {
      get() {
        return client.keycloak?.token;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'userRef', {
      get() {
        return userRef;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'tokenRef', {
      get() {
        return tokenRef;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'authenticatedRef', {
      get() {
        return authenticatedRef;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'permissionsRef', {
      get() {
        return permissionsRef;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'socketConnectedRef', {
      get() {
        return socketConnectedRef;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'socket', {
      get() {
        return socket;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'apiURL', {
      get() {
        return apiURLRef.value;
      },
      enumerable: true,
      configurable: true,
    });

    Object.defineProperty(client, 'apiURLRef', {
      get() {
        return apiURLRef;
      },
      enumerable: true,
      configurable: true,
    });

    client.setApiURL = (nextApiURL: string) => {
      configureTransport(nextApiURL);
      return client;
    };

    client.onSocket = (event: string, listener: (...args: any[]) => void) => {
      if (!socketListeners.has(event)) {
        socketListeners.set(event, new Set());
      }

      socketListeners.get(event)?.add(listener);
      socket?.on(event, listener);
      return client;
    };

    client.offSocket = (event: string, listener?: (...args: any[]) => void) => {
      const listeners = socketListeners.get(event);
      if (listener) {
        listeners?.delete(listener);
        if (listeners && listeners.size === 0) {
          socketListeners.delete(event);
        }
      } else {
        socketListeners.delete(event);
      }

      if (!socket) {
        return client;
      }

      if (listener) {
        socket.off(event, listener);
      } else {
        socket.off(event);
      }

      return client;
    };

    client.emitSocket = (event: string, ...args: any[]) => {
      socket?.emit(event, ...args);
      return client;
    };
    client.configure(findOne());
    client.configure(findAll());
    client.configure(count());

    client.hooks({
      error: {
        all: [
          (context: any) => {
            context.error = normalizeFeathersClientError(context.error);
            return context;
          }
        ]
      }
    });

    if (!usesSocket) {
      client.hooks({
        before: {
          all: [
            (context: any) => {
              if (context.params.query) {
                context.params.headers.rawquery = JSON.stringify(context.params.query);
                delete context.params.query;
              }
            }
          ]
        }
      });
    }

    FeathersApi.instance = client as FeathersApplication;
    return FeathersApi.instance;
  }
}
