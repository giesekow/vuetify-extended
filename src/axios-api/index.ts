import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { io, Socket, ManagerOptions, SocketOptions } from 'socket.io-client';
import Keycloak, {
  KeycloakConfig,
  KeycloakInitOptions,
  KeycloakLoginOptions,
} from 'keycloak-js';
import type { Application, Service } from '../declarations';

type EventListener = (data?: any) => void;

interface EventRecord {
  callback: EventListener;
  isOnce: boolean;
  ref?: string | symbol;
}

class SimpleEventEmitter {
  private events: { [key: string]: EventRecord[] } = {};

  on(name: string, listener: EventListener, reference?: string | symbol) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push({ callback: listener, isOnce: false, ref: reference });
    return this;
  }

  once(name: string, listener: EventListener, reference?: string | symbol) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push({ callback: listener, isOnce: true, ref: reference });
    return this;
  }

  emit(name: string, data?: any) {
    if (!this.events[name]) {
      return;
    }

    const called: EventListener[] = [];
    for (const listener of this.events[name]) {
      if (!called.includes(listener.callback)) {
        listener.callback(data);
        called.push(listener.callback);
      }
    }

    this.events[name] = this.events[name].filter((listener) => !listener.isOnce);
    return this;
  }

  removeListener(name: string, listenerToRemove?: EventListener) {
    if (!this.events[name]) {
      return;
    }

    if (!listenerToRemove) {
      this.events[name] = [];
      return;
    }

    this.events[name] = this.events[name].filter((listener) => listener.callback !== listenerToRemove);
  }

  clearListeners(reference?: string | symbol) {
    if (!reference) {
      this.events = {};
      return;
    }

    for (const name of Object.keys(this.events)) {
      this.events[name] = this.events[name].filter((listener) => listener.ref !== reference);
    }
  }
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

interface AxiosApiRequestConfig extends InternalAxiosRequestConfig {
  _veRetry?: boolean;
}

interface AxiosSocketEnvelope {
  service?: string;
  path?: string;
  event?: string;
  type?: string;
  data?: any;
  payload?: any;
  item?: any;
}

function ensurePath(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}

function joinPath(path: string, id?: any): string {
  const normalizedPath = ensurePath(path);
  if (id === undefined || id === null || id === '') {
    return `/${normalizedPath}`;
  }

  return `/${normalizedPath}/${encodeURIComponent(String(id))}`;
}

function getArrayResult(data: any): any[] {
  const result = data?.data || data;
  if (Array.isArray(result)) {
    return result;
  }

  return Array.isArray(result?.data) ? result.data : [];
}

function getSingleResult(data: any): any {
  const result = data?.data || data;
  if (Array.isArray(result)) {
    return result[0];
  }

  return result;
}

class AxiosServiceClient<T = any> extends SimpleEventEmitter implements AxiosService<T> {
  constructor(private readonly app: AxiosApplication, private readonly path: string) {
    super();
  }

  private buildConfig(params?: AxiosServiceParams): AxiosRequestConfig {
    const config: AxiosRequestConfig = {
      ...(params?.axios || {}),
      headers: {
        ...((params?.axios?.headers as Record<string, any>) || {}),
        ...(params?.headers || {}),
      },
    };

    const query = params?.query;
    if (query) {
      if (this.app.queryMode === 'params') {
        config.params = { ...(config.params || {}), ...query };
      } else {
        config.headers = {
          ...(config.headers || {}),
          rawquery: JSON.stringify(query),
        };
      }
    }

    return config;
  }

  async find(params?: AxiosServiceParams): Promise<any> {
    const response = await this.app.client.get(joinPath(this.path), this.buildConfig(params));
    return response.data;
  }

  async findOne(params?: AxiosServiceParams): Promise<T | undefined> {
    const query = { ...(params?.query || {}), $limit: 1 };
    const data = await this.find({ ...(params || {}), query });
    return getSingleResult(data);
  }

  async findAll(params?: AxiosServiceParams): Promise<T[]> {
    const query = { ...(params?.query || {}), $paginate: false };
    const data = await this.find({ ...(params || {}), query });
    return getArrayResult(data);
  }

  async count(params?: AxiosServiceParams): Promise<number> {
    const query = { ...(params?.query || {}), $limit: 0 };
    const data = await this.find({ ...(params || {}), query });
    return Number(data?.total || data?.data?.total || 0);
  }

  async get(id: any, params?: AxiosServiceParams): Promise<T> {
    const response = await this.app.client.get(joinPath(this.path, id), this.buildConfig(params));
    return response.data;
  }

  async create(data: any, params?: AxiosServiceParams): Promise<T> {
    const response = await this.app.client.post(joinPath(this.path), data, this.buildConfig(params));
    return response.data;
  }

  async update(id: any, data: any, params?: AxiosServiceParams): Promise<T> {
    const response = await this.app.client.put(joinPath(this.path, id), data, this.buildConfig(params));
    return response.data;
  }

  async patch(id: any, data: any, params?: AxiosServiceParams): Promise<T> {
    const response = await this.app.client.patch(joinPath(this.path, id), data, this.buildConfig(params));
    return response.data;
  }

  async remove(id: any, params?: AxiosServiceParams): Promise<T> {
    const response = await this.app.client.delete(joinPath(this.path, id), this.buildConfig(params));
    return response.data;
  }
}

class AxiosKeycloakClient {
  keycloak: Keycloak;
  private readonly loginRedirectUri: string;
  private readonly logoutRedirectUri: string;
  private readonly minValidity: number;
  private readonly withVueRouter: boolean;
  private readonly vueRouterLink: string;
  private readonly scope: string;
  private initialized: Promise<boolean>;
  private refreshPromise?: Promise<string | undefined>;
  private currentUser: any = null;
  private currentToken?: string;

  constructor(private readonly app: AxiosApplication, private readonly config: AxiosKeycloakClientConfig) {
    this.keycloak = new Keycloak(config.keycloakConfig);
    this.loginRedirectUri = config.loginRedirectUri || '/';
    this.logoutRedirectUri = config.logoutRedirectUri || '/';
    this.minValidity = config.minValidity || 5;
    this.withVueRouter = config.withVueRouter || false;
    this.vueRouterLink = config.vueRouterLink || '/auth';
    this.scope = config.scope || '';

    this.keycloak.onAuthSuccess = () => {
      void this.onAuthSuccess();
    };
    this.keycloak.onTokenExpired = () => {
      void this.onTokenExpired();
    };
    this.keycloak.onAuthError = (errorData) => {
      this.onAuthError(errorData);
    };
    this.keycloak.onAuthLogout = () => {
      void this.onAuthLogout();
    };

    this.initialized = this.keycloak
      .init(config.keycloakInit)
      .then(async (authenticated) => {
        if (authenticated && this.keycloak.token) {
          void this.onAuthSuccess();
        }
        return authenticated;
      })
      .catch((error) => {
        this.onAuthError(error);
        return false;
      });
  }

  get user(): any {
    return this.currentUser;
  }

  get token(): string | undefined {
    return this.currentToken;
  }

  private get storage() {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window.sessionStorage;
  }

  private async ensureInitialized() {
    await this.initialized;
  }

  private getStoredLoginParams(): any {
    const storage = this.storage;
    if (!storage) {
      return null;
    }

    const raw = storage.getItem('keycloak-loginParams');
    if (!raw) {
      return null;
    }

    try {
      const data = JSON.parse(raw);
      return data?.params || null;
    } catch (error) {
      return null;
    }
  }

  private setStoredLoginParams(params?: any) {
    const storage = this.storage;
    if (!storage) {
      return;
    }

    storage.setItem('keycloak-loginParams', JSON.stringify({ params }));
  }

  private setStoredRedirect(redirectUri?: string) {
    const storage = this.storage;
    if (!storage || !redirectUri) {
      return;
    }

    storage.setItem('keycloak-currentRedirect', redirectUri);
  }

  private async syncCurrentUser(mode: 'create' | 'refresh', token?: string) {
    const authPath = mode === 'create' ? this.app.authPath : this.app.refreshAuthPath;
    if (!authPath || !token) {
      return this.currentUser;
    }

    const service = this.app.service(authPath);
    if (mode === 'create') {
      const method = this.app.authCreateMethod;
      if (method === 'get') {
        this.currentUser = await service.get(null);
      } else if (method === 'put') {
        this.currentUser = await service.update(null, { access_token: token });
      } else {
        this.currentUser = await service.create({ access_token: token });
      }
      return this.currentUser;
    }

    const refreshMethod = this.app.authRefreshMethod;
    if (refreshMethod === 'get') {
      this.currentUser = await service.get(null);
    } else if (refreshMethod === 'post') {
      this.currentUser = await service.create({ access_token: token });
    } else if (refreshMethod === 'put') {
      this.currentUser = await service.update(null, { access_token: token });
    } else {
      this.currentUser = await service.patch(null, { access_token: token });
    }

    return this.currentUser;
  }

  async onAuthSuccess() {
    this.currentToken = this.keycloak.token;

    try {
      if (this.currentToken) {
        await this.syncCurrentUser('create', this.currentToken);
      }
    } catch (error) {
      this.currentUser = null;
    }

    this.app.emit('authSuccess', {
      user: this.currentUser,
      token: this.currentToken,
      params: this.getStoredLoginParams(),
    });
  }

  async onAuthLogout() {
    this.currentUser = null;
    this.currentToken = undefined;
    this.app.emit('authLogout');
  }

  onAuthError(error?: any) {
    this.app.emit('authError', {
      error: error instanceof Error ? error : new Error('Unable to authenticate user!'),
      params: this.getStoredLoginParams(),
    });
  }

  async onTokenExpired() {
    await this.refreshToken(true);
  }

  private async refreshToken(force = false): Promise<string | undefined> {
    await this.ensureInitialized();

    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      if (!this.keycloak.authenticated) {
        this.currentToken = undefined;
        return undefined;
      }

      const shouldRefresh = force || !!this.keycloak.token;
      if (!shouldRefresh) {
        this.currentToken = this.keycloak.token;
        return this.currentToken;
      }

      try {
        const refreshed = await this.keycloak.updateToken(this.minValidity);
        this.currentToken = this.keycloak.token;

        if (refreshed && this.currentToken) {
          try {
            await this.syncCurrentUser('refresh', this.currentToken);
          } catch (error) {
            // Ignore auth sync errors and still return the refreshed token.
          }

          this.app.emit('token-refreshed', {
            user: this.currentUser,
            token: this.currentToken,
            params: this.getStoredLoginParams(),
          });
        }

        return this.currentToken;
      } catch (error) {
        this.currentToken = undefined;
        throw error;
      } finally {
        this.refreshPromise = undefined;
      }
    })();

    return this.refreshPromise;
  }

  async getToken(): Promise<string | undefined> {
    await this.ensureInitialized();

    if (!this.keycloak.authenticated) {
      this.currentToken = undefined;
      return undefined;
    }

    if (!this.keycloak.token) {
      this.currentToken = undefined;
      return undefined;
    }

    if (this.keycloak.isTokenExpired(this.minValidity)) {
      return this.refreshToken(true);
    }

    this.currentToken = this.keycloak.token;
    return this.currentToken;
  }

  async reAuthenticate(): Promise<void> {
    await this.refreshToken(true);
  }

  hasPermission(options?: any): boolean {
    const data = this.currentUser?.permissions || [];
    const permissions = Array.isArray(options) ? options : options ? [options] : [];

    if (permissions.length === 0) {
      return true;
    }

    for (const permission of permissions) {
      if (typeof permission === 'string') {
        const [resource, scope] = permission.split(':');
        const matched = data.find((item: any) => item.rsname && item.rsname.toString() === resource.toString());
        if (!matched) {
          continue;
        }

        if (!scope) {
          return true;
        }

        const scopes = (matched.scopes || []).map((item: any) => item.toString());
        if (scopes.includes(scope) || scope === '*') {
          return true;
        }
        continue;
      }

      if (permission?.resource) {
        const resources = Array.isArray(permission.resource) ? permission.resource : [permission.resource];
        const scopes = permission.scope ? (Array.isArray(permission.scope) ? permission.scope : [permission.scope]) : [];

        for (const resource of resources) {
          const matched = data.find((item: any) => item.rsname && item.rsname.toString() === resource.toString());
          if (!matched) {
            continue;
          }

          if (scopes.length === 0) {
            return true;
          }

          const resourceScopes = (matched.scopes || []).map((item: any) => item.toString());
          if (scopes.some((scope: any) => resourceScopes.includes(scope.toString()) || scope === '*')) {
            return true;
          }
        }
      }
    }

    return false;
  }

  login(redirectUri?: string, params?: any, options?: KeycloakLoginOptions) {
    this.setStoredLoginParams(params);

    if (!this.keycloak.authenticated) {
      if (this.withVueRouter && this.vueRouterLink) {
        const routerRedirect = this.makeURL(this.vueRouterLink);
        this.setStoredRedirect(redirectUri || this.loginRedirectUri);
        void this.keycloak.login({
          scope: this.scope || undefined,
          ...(options || {}),
          redirectUri: routerRedirect,
        });
      } else {
        const resolvedRedirect = this.makeURL(redirectUri || this.loginRedirectUri);
        void this.keycloak.login({
          ...(options || {}),
          scope: options?.scope || this.scope || undefined,
          redirectUri: resolvedRedirect,
        });
      }

      return;
    }

    void this.onAuthSuccess();
  }

  logout(redirectUri?: string) {
    const resolvedRedirect = this.makeURL(redirectUri || this.logoutRedirectUri);
    void this.keycloak.logout({ redirectUri: resolvedRedirect });
  }

  authenticated(): boolean | undefined {
    return this.keycloak.authenticated;
  }

  vueRouterComponent(timeout?: number) {
    return {
      render: () => '',
      mounted() {
        if (typeof window === 'undefined') {
          return;
        }

        const redirect = window.sessionStorage.getItem('keycloak-currentRedirect');
        if (redirect) {
          setTimeout(() => {
            (this as any).$router.replace(redirect);
          }, timeout || 1000);
        }
      },
    };
  }

  configureVueRouter(router: any, timeout?: number) {
    router.addRoute({
      path: this.vueRouterLink,
      name: 'Keycloak-Authentication',
      component: this.vueRouterComponent(timeout),
    });
  }

  makeURL(path: string, origin?: string): string {
    if (path.includes('://')) {
      return path;
    }

    if (origin) {
      return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    return `${location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}

export class AxiosApplication extends SimpleEventEmitter implements Application {
  readonly client: AxiosInstance;
  readonly authentication: AxiosKeycloakClient;
  readonly keycloak: Keycloak;
  readonly queryMode: 'rawquery-header' | 'params';
  readonly authPath: string | false;
  readonly refreshAuthPath: string | false;
  readonly authCreateMethod: 'get' | 'post' | 'put';
  readonly authRefreshMethod: 'get' | 'patch' | 'post' | 'put';
  private readonly services: Map<string, AxiosServiceClient<any>> = new Map();
  private readonly tokenHeader: string;
  private readonly tokenPrefix: string;
  private readonly socketEnabled: boolean;
  private readonly socketURL?: string;
  private readonly socketEvent: string;
  private readonly socketOptions?: Partial<ManagerOptions & SocketOptions>;
  private readonly socketAuthMode: 'auth' | 'query';
  socket?: Socket;

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

  get user(): any {
    return this.authentication.user;
  }

  get token(): string | undefined {
    return this.authentication.token;
  }

  onSocket(event: string, listener: (...args: any[]) => void) {
    this.socket?.on(event, listener);
    return this;
  }

  offSocket(event: string, listener?: (...args: any[]) => void) {
    if (!this.socket) {
      return this;
    }

    if (listener) {
      this.socket.off(event, listener);
    } else {
      this.socket.off(event);
    }

    return this;
  }

  emitSocket(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
    return this;
  }

  constructor(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, options?: AxiosApiOptions) {
    super();

    this.queryMode = options?.queryMode || 'rawquery-header';
    this.authPath = options?.authPath === undefined ? 'auth' : options.authPath;
    this.refreshAuthPath = options?.refreshAuthPath === undefined ? this.authPath : options.refreshAuthPath;
    this.authCreateMethod = options?.authCreateMethod || 'post';
    this.authRefreshMethod = options?.authRefreshMethod || 'patch';
    this.tokenHeader = options?.tokenHeader || 'Authorization';
    this.tokenPrefix = options?.tokenPrefix || 'Bearer';
    this.socketEnabled = options?.useSocket === true;
    this.socketURL = options?.socketURL;
    this.socketEvent = options?.socketEvent || 'service-event';
    this.socketOptions = options?.socketOptions;
    this.socketAuthMode = options?.socketAuthMode || 'auth';

    this.client = axios.create({
      baseURL: apiURL,
      ...(options?.axiosConfig || {}),
    });

    this.authentication = new AxiosKeycloakClient(this, keycloakConfig);
    this.keycloak = this.authentication.keycloak;

    this.authenticate = this.authentication.login.bind(this.authentication);
    this.login = this.authentication.login.bind(this.authentication);
    this.logout = this.authentication.logout.bind(this.authentication);
    this.reAuthenticate = this.authentication.reAuthenticate.bind(this.authentication);
    this.authenticated = this.authentication.authenticated.bind(this.authentication);
    this.hasPermission = this.authentication.hasPermission.bind(this.authentication);
    this.accountManagement = this.keycloak.accountManagement.bind(this.keycloak);
    this.register = this.keycloak.register.bind(this.keycloak);
    this.hasRealmRole = this.keycloak.hasRealmRole.bind(this.keycloak);
    this.hasResourceRole = this.keycloak.hasResourceRole.bind(this.keycloak);
    this.loadUserInfo = this.keycloak.loadUserInfo.bind(this.keycloak);
    this.loadUserProfile = this.keycloak.loadUserProfile.bind(this.keycloak);

    this.configureInterceptors();
    this.configureSocket();
  }

  private configureInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      const token = await this.authentication.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers[this.tokenHeader] = `${this.tokenPrefix} ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const responseStatus = error.response?.status;
        const config = error.config as AxiosApiRequestConfig | undefined;

        if (!config || config._veRetry || responseStatus !== 401 || !this.authenticated()) {
          throw error;
        }

        config._veRetry = true;

        try {
          await this.reAuthenticate();
          const token = await this.authentication.getToken();
          if (token) {
            config.headers = config.headers || {};
            config.headers[this.tokenHeader] = `${this.tokenPrefix} ${token}`;
          }

          return this.client.request(config);
        } catch (refreshError) {
          throw refreshError;
        }
      }
    );
  }

  private configureSocket() {
    if (!this.socketEnabled) {
      return;
    }

    const socketTarget = this.resolveSocketURL();
    this.socket = io(socketTarget, {
      autoConnect: false,
      ...(this.socketOptions || {}),
    });

    this.socket.on('connect', () => {
      this.emit('socket:connect', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.emit('socket:disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.emit('socket:error', error);
    });

    this.socket.on(this.socketEvent, (payload: AxiosSocketEnvelope) => {
      this.dispatchSocketMessage(this.socketEvent, payload);
    });

    this.socket.onAny((eventName: string, payload: any) => {
      if (eventName === this.socketEvent) {
        return;
      }

      this.dispatchSocketMessage(eventName, payload);
    });

    this.on('authSuccess', () => {
      void this.connectSocket();
    }, Symbol('axios-socket-auth-success'));
    this.on('token-refreshed', () => {
      void this.connectSocket(true);
    }, Symbol('axios-socket-token-refresh'));
    this.on('authLogout', () => {
      this.disconnectSocket();
    }, Symbol('axios-socket-auth-logout'));

    void this.connectSocket();
  }

  private resolveSocketURL() {
    if (this.socketURL) {
      return this.socketURL;
    }

    const baseURL = this.client.defaults.baseURL;
    if (typeof baseURL === 'string' && baseURL.length > 0) {
      return baseURL;
    }

    if (typeof location !== 'undefined') {
      return location.origin;
    }

    return undefined as any;
  }

  private async buildSocketAuth() {
    const token = await this.authentication.getToken();
    if (!token) {
      return {};
    }

    const authToken = `${this.tokenPrefix} ${token}`;
    if (this.socketAuthMode === 'query') {
      return { query: { token: authToken } };
    }

    return { auth: { token: authToken } };
  }

  async connectSocket(forceReconnect = false) {
    if (!this.socketEnabled || !this.socket) {
      return;
    }

    const authConfig = await this.buildSocketAuth();
    if (this.socketAuthMode === 'query') {
      this.socket.io.opts.query = { ...(this.socket.io.opts.query || {}), ...((authConfig as any).query || {}) };
    } else {
      this.socket.auth = { ...(this.socket.auth || {}), ...((authConfig as any).auth || {}) };
    }

    if (forceReconnect && this.socket.connected) {
      this.socket.disconnect();
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnectSocket() {
    if (!this.socketEnabled || !this.socket) {
      return;
    }

    this.socket.disconnect();
  }

  private dispatchSocketMessage(eventName: string, payload: any) {
    const routed = this.parseSocketMessage(eventName, payload);
    if (!routed) {
      return;
    }

    const service = this.service(routed.service) as AxiosServiceClient<any>;
    service.emit(routed.event, routed.data);
    this.emit('socket:event', routed);
  }

  private parseSocketMessage(eventName: string, payload: any) {
    const direct = this.parseSocketEnvelope(payload);
    if (direct) {
      return direct;
    }

    const fromEvent = this.parseSocketEventName(eventName, payload);
    if (fromEvent) {
      return fromEvent;
    }

    return undefined;
  }

  private parseSocketEnvelope(payload: any) {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    const service = payload.service || payload.path;
    const event = payload.event || payload.type;
    if (!service || !event) {
      return undefined;
    }

    return {
      service: ensurePath(String(service)),
      event: String(event),
      data: payload.data ?? payload.payload ?? payload.item ?? payload,
    };
  }

  private parseSocketEventName(eventName: string, payload: any) {
    const trimmed = (eventName || '').trim();
    if (!trimmed || trimmed === this.socketEvent) {
      return undefined;
    }

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      const event = parts.pop();
      const service = parts.join(':');
      if (service && event) {
        return { service: ensurePath(service), event, data: payload };
      }
    }

    const tokens = trimmed.split(/\s+/);
    if (tokens.length >= 2) {
      const event = tokens.pop();
      const service = tokens.join(' ');
      if (service && event) {
        return { service: ensurePath(service), event, data: payload };
      }
    }

    return undefined;
  }

  service<T = any>(path: string): Service<T> {
    const normalizedPath = ensurePath(path);
    if (!this.services.has(normalizedPath)) {
      this.services.set(normalizedPath, new AxiosServiceClient<T>(this, normalizedPath));
    }

    return this.services.get(normalizedPath) as Service<T>;
  }
}

export class AxiosApi {
  static instance: AxiosApplication;

  static setup(apiURL: any, keycloakConfig: AxiosKeycloakClientConfig, soptions?: AxiosApiOptions) {
    AxiosApi.instance = new AxiosApplication(apiURL, keycloakConfig, soptions);
    return AxiosApi.instance;
  }
}
