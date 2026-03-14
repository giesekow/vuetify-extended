"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeathersApi = void 0;
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const feathers_1 = require("@feathersjs/feathers");
const socketio_client_1 = __importDefault(require("@feathersjs/socketio-client"));
const rest_client_1 = __importDefault(require("@feathersjs/rest-client"));
const axios_1 = __importDefault(require("axios"));
const feathers_keycloak_connect_client_1 = require("feathers-keycloak-connect-client");
const vue_1 = require("vue");
const find_one_1 = __importDefault(require("./find-one"));
const count_1 = __importDefault(require("./count"));
const find_all_1 = __importDefault(require("./find-all"));
class FeathersApi {
    static setup(apiURL, keycloakConfig, soptions) {
        var _a, _b, _c, _d, _e, _f;
        const appCreator = feathers_1.feathers;
        const client = appCreator();
        let socket = undefined;
        if (soptions === null || soptions === void 0 ? void 0 : soptions.useSocket) {
            socket = (0, socket_io_client_1.default)(apiURL, { transports: (soptions === null || soptions === void 0 ? void 0 : soptions.transports) || ['websocket'], timeout: (soptions === null || soptions === void 0 ? void 0 : soptions.timeout) || 6 * 1000 });
            client.configure((0, socketio_client_1.default)(socket));
        }
        else {
            const restClient = (0, rest_client_1.default)(apiURL);
            client.configure(restClient.axios(axios_1.default));
        }
        client.configure((0, feathers_keycloak_connect_client_1.AuthConfigure)(keycloakConfig));
        const userRef = (0, vue_1.shallowRef)((_b = (_a = client.authentication) === null || _a === void 0 ? void 0 : _a.user) !== null && _b !== void 0 ? _b : null);
        const tokenRef = (0, vue_1.shallowRef)((_c = client.keycloak) === null || _c === void 0 ? void 0 : _c.token);
        const authenticatedRef = (0, vue_1.shallowRef)((_d = client.keycloak) === null || _d === void 0 ? void 0 : _d.authenticated);
        const permissionsRef = (0, vue_1.shallowRef)(((_f = (_e = client.authentication) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.permissions) || []);
        const socketConnectedRef = (0, vue_1.shallowRef)(!!(socket === null || socket === void 0 ? void 0 : socket.connected));
        socket === null || socket === void 0 ? void 0 : socket.on('connect', () => {
            socketConnectedRef.value = true;
        });
        socket === null || socket === void 0 ? void 0 : socket.on('disconnect', () => {
            socketConnectedRef.value = false;
        });
        socket === null || socket === void 0 ? void 0 : socket.on('connect_error', () => {
            socketConnectedRef.value = false;
        });
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
        client.onSocket = (event, listener) => {
            socket === null || socket === void 0 ? void 0 : socket.on(event, listener);
            return client;
        };
        client.offSocket = (event, listener) => {
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
        client.configure((0, find_one_1.default)());
        client.configure((0, find_all_1.default)());
        client.configure((0, count_1.default)());
        if (!(soptions === null || soptions === void 0 ? void 0 : soptions.useSocket)) {
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
exports.FeathersApi = FeathersApi;
