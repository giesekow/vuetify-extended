import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { AuthConfigure } from 'feathers-keycloak-connect-client';
import findOne from './find-one';
import count from './count';
import findAll from './find-all';
export class FeathersApi {
    static setup(apiURL, keycloakConfig, soptions) {
        const appCreator = feathers;
        const client = appCreator();
        let socket = undefined;
        if (soptions === null || soptions === void 0 ? void 0 : soptions.useSocket) {
            socket = io(apiURL, { transports: (soptions === null || soptions === void 0 ? void 0 : soptions.transports) || ['websocket'], timeout: (soptions === null || soptions === void 0 ? void 0 : soptions.timeout) || 6 * 1000 });
            client.configure(socketio(socket));
        }
        else {
            const restClient = rest(apiURL);
            client.configure(restClient.axios(axios));
        }
        client.configure(AuthConfigure(keycloakConfig));
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
        client.configure(findOne());
        client.configure(findAll());
        client.configure(count());
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
