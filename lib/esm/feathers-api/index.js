import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { AuthConfigure } from 'feathers-keycloak-connect-client';
import { shallowRef } from 'vue';
import findOne from './find-one';
import count from './count';
import findAll from './find-all';
export class FeathersApi {
    static setup(apiURL, keycloakConfig, soptions) {
        var _a, _b, _c, _d, _e, _f;
        const appCreator = feathers;
        const client = appCreator();
        const usesSocket = (soptions === null || soptions === void 0 ? void 0 : soptions.useSocket) === true;
        let socket = undefined;
        const socketListeners = new Map();
        const normalizeApiURL = (value) => (typeof value === 'string' && value.length > 0 ? value : undefined);
        const buildServiceBase = (baseURL, serviceName) => {
            const normalizedName = String(serviceName).replace(/^\/+/, '');
            if (!baseURL) {
                return `/${normalizedName}`;
            }
            return `${baseURL.replace(/\/+$/, '')}/${normalizedName}`;
        };
        const apiURLRef = shallowRef(normalizeApiURL(apiURL));
        const userRef = shallowRef(null);
        const tokenRef = shallowRef(undefined);
        const authenticatedRef = shallowRef(undefined);
        const permissionsRef = shallowRef([]);
        const socketConnectedRef = shallowRef(false);
        const attachCustomSocketListeners = (currentSocket) => {
            if (!currentSocket) {
                return;
            }
            for (const [event, listeners] of socketListeners.entries()) {
                for (const listener of listeners) {
                    currentSocket.on(event, listener);
                }
            }
        };
        const bindSocketState = (currentSocket) => {
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
        const replaceSocket = (nextApiURL) => {
            var _a;
            const previousSocket = socket;
            if (previousSocket) {
                (_a = previousSocket.removeAllListeners) === null || _a === void 0 ? void 0 : _a.call(previousSocket);
                previousSocket.disconnect();
            }
            socketConnectedRef.value = false;
            if (!nextApiURL) {
                socket = undefined;
                return;
            }
            socket = io(nextApiURL, {
                transports: (soptions === null || soptions === void 0 ? void 0 : soptions.transports) || ['websocket'],
                timeout: (soptions === null || soptions === void 0 ? void 0 : soptions.timeout) || 6 * 1000,
            });
            bindSocketState(socket);
        };
        const updateExistingServices = (nextApiURL) => {
            for (const [serviceName, service] of Object.entries(client.services || {})) {
                if (!service || typeof service !== 'object') {
                    continue;
                }
                const mutableService = service;
                if (usesSocket) {
                    mutableService.connection = socket;
                }
                else {
                    mutableService.base = buildServiceBase(nextApiURL, serviceName);
                }
            }
        };
        const configureTransport = (nextApiURL) => {
            const normalizedURL = normalizeApiURL(nextApiURL);
            apiURLRef.value = normalizedURL;
            if (usesSocket) {
                replaceSocket(normalizedURL);
                if (socket) {
                    client.configure(socketio(socket));
                }
            }
            else {
                const restClient = rest(normalizedURL);
                client.configure(restClient.axios(axios));
            }
            updateExistingServices(normalizedURL);
        };
        configureTransport(apiURL);
        client.configure(AuthConfigure(keycloakConfig));
        userRef.value = (_b = (_a = client.authentication) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : null;
        tokenRef.value = (_c = client.keycloak) === null || _c === void 0 ? void 0 : _c.token;
        authenticatedRef.value = (_d = client.keycloak) === null || _d === void 0 ? void 0 : _d.authenticated;
        permissionsRef.value = ((_f = (_e = client.authentication) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.permissions) || [];
        socketConnectedRef.value = !!(socket === null || socket === void 0 ? void 0 : socket.connected);
        client.on('authSuccess', (payload) => {
            var _a, _b, _c, _d, _e, _f, _g;
            userRef.value = (_c = (_a = payload === null || payload === void 0 ? void 0 : payload.user) !== null && _a !== void 0 ? _a : (_b = client.authentication) === null || _b === void 0 ? void 0 : _b.user) !== null && _c !== void 0 ? _c : null;
            tokenRef.value = (_d = payload === null || payload === void 0 ? void 0 : payload.token) !== null && _d !== void 0 ? _d : (_e = client.keycloak) === null || _e === void 0 ? void 0 : _e.token;
            authenticatedRef.value = (_f = client.keycloak) === null || _f === void 0 ? void 0 : _f.authenticated;
            permissionsRef.value = ((_g = userRef.value) === null || _g === void 0 ? void 0 : _g.permissions) || [];
        }, Symbol('feathers-user-ref-auth-success'));
        client.on('token-refreshed', (payload) => {
            var _a, _b, _c, _d, _e, _f, _g;
            userRef.value = (_c = (_a = payload === null || payload === void 0 ? void 0 : payload.user) !== null && _a !== void 0 ? _a : (_b = client.authentication) === null || _b === void 0 ? void 0 : _b.user) !== null && _c !== void 0 ? _c : null;
            tokenRef.value = (_d = payload === null || payload === void 0 ? void 0 : payload.token) !== null && _d !== void 0 ? _d : (_e = client.keycloak) === null || _e === void 0 ? void 0 : _e.token;
            authenticatedRef.value = (_f = client.keycloak) === null || _f === void 0 ? void 0 : _f.authenticated;
            permissionsRef.value = ((_g = userRef.value) === null || _g === void 0 ? void 0 : _g.permissions) || [];
        }, Symbol('feathers-user-ref-token-refreshed'));
        client.on('authLogout', () => {
            var _a;
            userRef.value = null;
            tokenRef.value = undefined;
            authenticatedRef.value = (_a = client.keycloak) === null || _a === void 0 ? void 0 : _a.authenticated;
            permissionsRef.value = [];
            socketConnectedRef.value = false;
        }, Symbol('feathers-user-ref-auth-logout'));
        Object.defineProperty(client, 'user', {
            get() {
                var _a;
                return (_a = client.authentication) === null || _a === void 0 ? void 0 : _a.user;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(client, 'token', {
            get() {
                var _a;
                return (_a = client.keycloak) === null || _a === void 0 ? void 0 : _a.token;
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
        client.setApiURL = (nextApiURL) => {
            configureTransport(nextApiURL);
            return client;
        };
        client.onSocket = (event, listener) => {
            var _a;
            if (!socketListeners.has(event)) {
                socketListeners.set(event, new Set());
            }
            (_a = socketListeners.get(event)) === null || _a === void 0 ? void 0 : _a.add(listener);
            socket === null || socket === void 0 ? void 0 : socket.on(event, listener);
            return client;
        };
        client.offSocket = (event, listener) => {
            const listeners = socketListeners.get(event);
            if (listener) {
                listeners === null || listeners === void 0 ? void 0 : listeners.delete(listener);
                if (listeners && listeners.size === 0) {
                    socketListeners.delete(event);
                }
            }
            else {
                socketListeners.delete(event);
            }
            if (!socket) {
                return client;
            }
            if (listener) {
                socket.off(event, listener);
            }
            else {
                socket.off(event);
            }
            return client;
        };
        client.emitSocket = (event, ...args) => {
            socket === null || socket === void 0 ? void 0 : socket.emit(event, ...args);
            return client;
        };
        client.configure(findOne());
        client.configure(findAll());
        client.configure(count());
        if (!usesSocket) {
            client.hooks({
                before: {
                    all: [
                        (context) => {
                            if (context.params.query) {
                                context.params.headers.rawquery = JSON.stringify(context.params.query);
                                delete context.params.query;
                            }
                        }
                    ]
                }
            });
        }
        FeathersApi.instance = client;
        return FeathersApi.instance;
    }
}
