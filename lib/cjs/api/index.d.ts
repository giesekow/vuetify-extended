import feathers from '@feathersjs/feathers';
import { KeycloakClientConfig } from 'feathers-keycloak-connect-client';
export interface SocketIOOptions {
    transports?: string[];
    timeout?: number;
    useSocket?: boolean;
}
export declare class Api {
    static instance: feathers.Application;
    static setup(apiURL: any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions): void;
}
