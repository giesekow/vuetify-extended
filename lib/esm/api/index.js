import { AxiosApi, } from '../axios-api';
import { FeathersApi, } from '../feathers-api';
export class Api {
    static setInstance(instance) {
        Api.instance = instance;
        return Api.instance;
    }
    static setup(apiURL, keycloakConfig, soptions) {
        return Api.useFeathers(apiURL, keycloakConfig, soptions);
    }
    static useFeathers(apiURL, keycloakConfig, soptions) {
        const instance = FeathersApi.setup(apiURL, keycloakConfig, soptions);
        Api.setInstance(instance);
        return instance;
    }
    static useAxios(apiURL, keycloakConfig, soptions) {
        const instance = AxiosApi.setup(apiURL, keycloakConfig, soptions);
        Api.setInstance(instance);
        return instance;
    }
}
export const $API = Api;
