import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ManagerOptions, SocketOptions } from 'socket.io-client';
import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakLoginOptions } from 'keycloak-js';
import type { Application, Service } from '../declarations';
type EventListener = (data?: any) => void;
declare class SimpleEventEmitter {
    private events;
    on(name: string, listener: EventListener, reference?: string | symbol): this;
    once(name: string, listener: EventListener, reference?: string | symbol): this;
    emit(name: string, data?: any): this | undefined;
    removeListener(name: string, listenerToRemove?: EventListener): void;
    clearListeners(reference?: string | symbol): void;
}
export interface AxiosServiceParams {
    query?: any;
    headers?: Record<string, any>;
    axios?: AxiosRequestConfig;
}
export type AxiosService<T = any> = Service<T>;
export interface AxiosApiOptions {
    useSocket?: boolean;
    socketURL?: string;
    socketEvent?: string;
    socketOptions?: Partial<ManagerOptions & SocketOptions>;
    socketAuthMode?: 'auth' | 'query';
    axiosConfig?: AxiosRequestConfig;
    queryMode?: 'rawquery-header' | 'params';
    authPath?: string | false;
    refreshAuthPath?: string | false;
    authCreateMethod?: 'get' | 'post' | 'put';
    authRefreshMethod?: 'get' | 'patch' | 'post' | 'put';
    tokenHeader?: string;
    tokenPrefix?: string;
}
export interface AxiosKeycloakClientConfig {
    keycloakConfig: KeycloakConfig;
    keycloakInit: KeycloakInitOptions;
    loginRedirectUri?: string;
    logoutRedirectUri?: string;
    minValidity?: number;
    withVueRouter?: boolean;
    vueRouterLink?: string;
    scope?: string;
}
export type KeycloakClientConfig = AxiosKeycloakClientConfig;
declare class AxiosKeycloakClient {
    private readonly app;
    private readonly config;
    keycloak: Keycloak;
    private readonly loginRedirectUri;
    private readonly logoutRedirectUri;
    private readonly minValidity;
    private readonly withVueRouter;
    private readonly vueRouterLink;
    private readonly scope;
    private initialized;
    private refreshPromise?;
    private currentUser;
    private currentToken?;
    constructor(app: AxiosApplication, config: AxiosKeycloakClientConfig);
    get user(): any;
    get token(): string | undefined;
    private get storage();
    private ensureInitialized;
    private getStoredLoginParams;
    private setStoredLoginParams;
    private setStoredRedirect;
    private syncCurrentUser;
    onAuthSuccess(): Promise<void>;
    onAuthLogout(): Promise<void>;
    onAuthError(error?: any): void;
    onTokenExpired(): Promise<void>;
    private refreshToken;
    getToken(): Promise<string | undefined>;
    reAuthenticate(): Promise<void>;
    hasPermission(options?: any): boolean;
    login(redirectUri?: string, params?: any, options?: KeycloakLoginOptions): void;
    logout(redirectUri?: string): void;
    authenticated(): boolean | undefined;
    vueRouterComponent(timeout?: number): {
        render: () => string;
        mounted(): void;
    };
    configureVueRouter(router: any, timeout?: number): void;
    makeURL(path: string, origin?: string): string;
}
export declare class AxiosApplication extends SimpleEventEmitter implements Application {
    readonly client: AxiosInstance;
    readonly authentication: AxiosKeycloakClient;
    readonly keycloak: Keycloak;
    readonly queryMode: 'rawquery-header' | 'params';
    readonly authPath: string | false;
    readonly refreshAuthPath: string | false;
    readonly authCreateMethod: 'get' | 'post' | 'put';
    readonly authRefreshMethod: 'get' | 'patch' | 'post' | 'put';
    private readonly services;
    private readonly tokenHeader;
    private readonly tokenPrefix;
    private readonly socketEnabled;
    private readonly socketURL?;
    private readonly socketEvent;
    private readonly socketOptions?;
    private readonly socketAuthMode;
    private socket?;
    authenticate: AxiosKeycloakClient['login'];
    login: AxiosKeycloakClient['login'];
    logout: AxiosKeycloakClient['logout'];
    reAuthenticate: AxiosKeycloakClient['reAuthenticate'];
    authenticated: AxiosKeycloakClient['authenticated'];
    hasPermission: AxiosKeycloakClient['hasPermission'];
    accountManagement: Keycloak['accountManagement'];
    register: Keycloak['register'];
    hasRealmRole: Keycloak['hasRealmRole'];
    hasResourceRole: Keycloak['hasResourceRole'];
    loadUserInfo: Keycloak['loadUserInfo'];
    loadUserProfile: Keycloak['loadUserProfile'];
    get user(): any;
    get token(): string | undefined;
    constructor(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, options?: AxiosApiOptions);
    private configureInterceptors;
    private configureSocket;
    private resolveSocketURL;
    private buildSocketAuth;
    connectSocket(forceReconnect?: boolean): Promise<void>;
    disconnectSocket(): void;
    private dispatchSocketMessage;
    private parseSocketMessage;
    private parseSocketEnvelope;
    private parseSocketEventName;
    service<T = any>(path: string): Service<T>;
}
export declare class AxiosApi {
    static instance: AxiosApplication;
    static setup(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions): AxiosApplication;
}
export {};
