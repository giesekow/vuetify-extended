"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$API = exports.Api = void 0;
const axios_api_1 = require("../axios-api");
const feathers_api_1 = require("../feathers-api");
class Api {
    static setInstance(instance) {
        Api.instance = instance;
        return Api.instance;
    }
    static setup(apiURL, keycloakConfig, soptions) {
        return Api.useFeathers(apiURL, keycloakConfig, soptions);
    }
    static useFeathers(apiURL, keycloakConfig, soptions) {
        const instance = feathers_api_1.FeathersApi.setup(apiURL, keycloakConfig, soptions);
        Api.setInstance(instance);
        return instance;
    }
    static useAxios(apiURL, keycloakConfig, soptions) {
        const instance = axios_api_1.AxiosApi.setup(apiURL, keycloakConfig, soptions);
        Api.setInstance(instance);
        return instance;
    }
}
exports.Api = Api;
exports.$API = Api;
