import type { FeathersApplication } from '../declarations';
import type { KeycloakClientConfig } from 'feathers-keycloak-connect-client';
export interface SocketIOOptions {
    transports?: string[];
    timeout?: number;
    useSocket?: boolean;
}
export type FeathersKeycloakClientConfig = KeycloakClientConfig;
export declare class FeathersApi {
    static instance: FeathersApplication;
    static setup(apiURL: any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions): FeathersApplication;
}
