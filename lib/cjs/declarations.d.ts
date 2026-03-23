import type { Application as BaseFeathersApplication, Service as BaseFeathersService, ServiceAddons as FeathersServiceAddons } from '@feathersjs/feathers';
import type Keycloak from 'keycloak-js';
import type { Socket } from 'socket.io-client';
import type { ShallowRef } from 'vue';
import type { KeycloakClient as FeathersKeycloakClient } from 'feathers-keycloak-connect-client';
export interface Service<T = any> {
    on(event: string, listener: (...args: any[]) => void): any;
    once(event: string, listener: (...args: any[]) => void): any;
    off(event: string, listener?: (...args: any[]) => void): any;
    removeListener(event: string, listener?: (...args: any[]) => void): any;
    emit(event: string, ...args: any[]): any;
    find(params?: any): Promise<any>;
    findOne(params?: any): Promise<T | undefined>;
    findAll(params?: any): Promise<T[]>;
    count(params?: any): Promise<number>;
    get(id: any, params?: any): Promise<T>;
    create(data: any, params?: any): Promise<T>;
    update(id: any, data: any, params?: any): Promise<T>;
    patch(id: any, data: any, params?: any): Promise<T>;
    remove(id: any, params?: any): Promise<T>;
}
export interface Application {
    on(event: string, listener: (...args: any[]) => void): any;
    once(event: string, listener: (...args: any[]) => void): any;
    off(event: string, listener?: (...args: any[]) => void): any;
    removeListener(event: string, listener?: (...args: any[]) => void): any;
    emit(event: string, ...args: any[]): any;
    service<T = any>(path: string): Service<T>;
    authentication?: any;
    keycloak?: Keycloak;
    socket?: Socket | undefined;
    apiURL?: string | undefined;
    apiURLRef?: ShallowRef<string | undefined>;
    setApiURL?: (url: string) => any;
    user?: any;
    userRef?: ShallowRef<any>;
    token?: string | undefined;
    tokenRef?: ShallowRef<string | undefined>;
    authenticatedRef?: ShallowRef<boolean | undefined>;
    permissionsRef?: ShallowRef<any[]>;
    socketConnectedRef?: ShallowRef<boolean>;
    authenticated?: (...args: any[]) => any;
    authenticate?: (...args: any[]) => any;
    login?: (...args: any[]) => any;
    logout?: (...args: any[]) => any;
    reAuthenticate?: (...args: any[]) => any;
    accountManagement?: (...args: any[]) => any;
    register?: (...args: any[]) => any;
    hasRealmRole?: (...args: any[]) => any;
    hasResourceRole?: (...args: any[]) => any;
    loadUserInfo?: (...args: any[]) => any;
    loadUserProfile?: (...args: any[]) => any;
    hasPermission?: (...args: any[]) => any;
    onSocket?: (event: string, listener: (...args: any[]) => void) => any;
    offSocket?: (event: string, listener?: (...args: any[]) => void) => any;
    emitSocket?: (event: string, ...args: any[]) => any;
}
/**
 * Extend the Feathers service shape with the helper methods used by the library.
 */
export interface FeathersService<T = any> extends BaseFeathersService<T> {
    on(event: string, listener: (...args: any[]) => void): any;
    once(event: string, listener: (...args: any[]) => void): any;
    off(event: string, listener?: (...args: any[]) => void): any;
    removeListener(event: string, listener?: (...args: any[]) => void): any;
    emit(event: string, ...args: any[]): any;
    findOne(params?: any): Promise<T | undefined>;
    findAll(params?: any): Promise<T[]>;
    count(params?: any): Promise<number>;
}
/**
 * Extend the Feathers application shape to include auth helpers used by the library.
 */
export interface FeathersApplication extends BaseFeathersApplication {
    on(event: string, listener: (...args: any[]) => void): any;
    once(event: string, listener: (...args: any[]) => void): any;
    off(event: string, listener?: (...args: any[]) => void): any;
    removeListener(event: string, listener?: (...args: any[]) => void): any;
    emit(event: string, ...args: any[]): any;
    service<T = any>(path: string): FeathersService<T> & FeathersServiceAddons;
    authentication: FeathersKeycloakClient;
    keycloak: Keycloak;
    socket: Socket | undefined;
    apiURL: string | undefined;
    apiURLRef: ShallowRef<string | undefined>;
    setApiURL: (url: string) => FeathersApplication;
    user: any;
    userRef: ShallowRef<any>;
    token: string | undefined;
    tokenRef: ShallowRef<string | undefined>;
    authenticatedRef: ShallowRef<boolean | undefined>;
    permissionsRef: ShallowRef<any[]>;
    socketConnectedRef: ShallowRef<boolean>;
    authenticated: FeathersKeycloakClient['authenticated'];
    authenticate: FeathersKeycloakClient['login'];
    login: FeathersKeycloakClient['login'];
    logout: FeathersKeycloakClient['logout'];
    reAuthenticate: FeathersKeycloakClient['reAuthenticate'];
    accountManagement: Keycloak['accountManagement'];
    register: Keycloak['register'];
    hasRealmRole: Keycloak['hasRealmRole'];
    hasResourceRole: Keycloak['hasResourceRole'];
    loadUserInfo: Keycloak['loadUserInfo'];
    loadUserProfile: Keycloak['loadUserProfile'];
    hasPermission: FeathersKeycloakClient['hasPermission'];
    onSocket: (event: string, listener: (...args: any[]) => void) => any;
    offSocket: (event: string, listener?: (...args: any[]) => void) => any;
    emitSocket: (event: string, ...args: any[]) => any;
}
export type PatchedApplication = FeathersApplication;
declare module '@feathersjs/feathers' {
    interface ServiceAddons {
        findOne(params: any): Promise<any>;
        findAll(params: any): Promise<any[]>;
        count(params: any): Promise<number>;
    }
}
