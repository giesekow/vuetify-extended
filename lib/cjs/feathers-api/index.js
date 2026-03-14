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
const find_one_1 = __importDefault(require("./find-one"));
const count_1 = __importDefault(require("./count"));
const find_all_1 = __importDefault(require("./find-all"));
class FeathersApi {
    static setup(apiURL, keycloakConfig, soptions) {
        const appCreator = feathers_1.feathers;
        const client = appCreator();
        if (soptions === null || soptions === void 0 ? void 0 : soptions.useSocket) {
            const socket = (0, socket_io_client_1.default)(apiURL, { transports: (soptions === null || soptions === void 0 ? void 0 : soptions.transports) || ['websocket'], timeout: (soptions === null || soptions === void 0 ? void 0 : soptions.timeout) || 6 * 1000 });
            client.configure((0, socketio_client_1.default)(socket));
        }
        else {
            const restClient = (0, rest_client_1.default)(apiURL);
            client.configure(restClient.axios(axios_1.default));
        }
        client.configure((0, feathers_keycloak_connect_client_1.AuthConfigure)(keycloakConfig));
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
