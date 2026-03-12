import {
  AxiosApi,
  AxiosApplication,
  type AxiosApiOptions,
  type AxiosKeycloakClientConfig,
} from '../axios-api';
import type { Application } from '../declarations';
import {
  FeathersApi,
  type SocketIOOptions,
  type FeathersKeycloakClientConfig,
} from '../feathers-api';

export class Api {
  static instance: Application;

  static setInstance(instance: Application): Application {
    Api.instance = instance;
    return Api.instance;
  }

  static setup(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions): Application {
    return Api.useFeathers(apiURL, keycloakConfig, soptions);
  }

  static useFeathers(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions) {
    const instance = FeathersApi.setup(apiURL, keycloakConfig, soptions);
    Api.setInstance(instance);
    return instance;
  }

  static useAxios(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions): AxiosApplication {
    const instance = AxiosApi.setup(apiURL, keycloakConfig, soptions);
    Api.setInstance(instance);
    return instance;
  }
}
