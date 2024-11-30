import type { Application } from '../declarations';
import type { KeycloakClientConfig } from 'feathers-keycloak-connect-client';
export interface SocketIOOptions {
    transports?: string[];
    timeout?: number;
    useSocket?: boolean;
}
export declare class Api {
    static instance: Application;
    static setup(apiURL: any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions): void;
}
