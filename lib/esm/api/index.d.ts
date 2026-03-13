import { AxiosApplication, type AxiosApiOptions, type AxiosKeycloakClientConfig } from '../axios-api';
import type { Application } from '../declarations';
import { type SocketIOOptions, type FeathersKeycloakClientConfig } from '../feathers-api';
export declare class Api {
    static instance: Application;
    static setInstance(instance: Application): Application;
    static setup(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions): Application;
    static useFeathers(apiURL: any, keycloakConfig: FeathersKeycloakClientConfig, soptions?: SocketIOOptions): import("../declarations").FeathersApplication;
    static useAxios(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions): AxiosApplication;
}
export declare const $API: typeof Api;
