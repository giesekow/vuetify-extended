"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosApi = exports.AxiosApplication = void 0;
const axios_1 = __importDefault(require("axios"));
const socket_io_client_1 = require("socket.io-client");
const keycloak_js_1 = __importDefault(require("keycloak-js"));
class SimpleEventEmitter {
    constructor() {
        this.events = {};
    }
    on(name, listener, reference) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push({ callback: listener, isOnce: false, ref: reference });
        return this;
    }
    once(name, listener, reference) {
        if (!this.events[name]) {
            this.events[name] = [];
        }
        this.events[name].push({ callback: listener, isOnce: true, ref: reference });
        return this;
    }
    emit(name, data) {
        if (!this.events[name]) {
            return;
        }
        const called = [];
        for (const listener of this.events[name]) {
            if (!called.includes(listener.callback)) {
                listener.callback(data);
                called.push(listener.callback);
            }
        }
        this.events[name] = this.events[name].filter((listener) => !listener.isOnce);
        return this;
    }
    removeListener(name, listenerToRemove) {
        if (!this.events[name]) {
            return;
        }
        if (!listenerToRemove) {
            this.events[name] = [];
            return;
        }
        this.events[name] = this.events[name].filter((listener) => listener.callback !== listenerToRemove);
    }
    clearListeners(reference) {
        if (!reference) {
            this.events = {};
            return;
        }
        for (const name of Object.keys(this.events)) {
            this.events[name] = this.events[name].filter((listener) => listener.ref !== reference);
        }
    }
}
function ensurePath(path) {
    return path.replace(/^\/+|\/+$/g, '');
}
function joinPath(path, id) {
    const normalizedPath = ensurePath(path);
    if (id === undefined || id === null || id === '') {
        return `/${normalizedPath}`;
    }
    return `/${normalizedPath}/${encodeURIComponent(String(id))}`;
}
function getArrayResult(data) {
    const result = (data === null || data === void 0 ? void 0 : data.data) || data;
    if (Array.isArray(result)) {
        return result;
    }
    return Array.isArray(result === null || result === void 0 ? void 0 : result.data) ? result.data : [];
}
function getSingleResult(data) {
    const result = (data === null || data === void 0 ? void 0 : data.data) || data;
    if (Array.isArray(result)) {
        return result[0];
    }
    return result;
}
class AxiosServiceClient extends SimpleEventEmitter {
    constructor(app, path) {
        super();
        this.app = app;
        this.path = path;
    }
    buildConfig(params) {
        var _a;
        const config = Object.assign(Object.assign({}, ((params === null || params === void 0 ? void 0 : params.axios) || {})), { headers: Object.assign(Object.assign({}, (((_a = params === null || params === void 0 ? void 0 : params.axios) === null || _a === void 0 ? void 0 : _a.headers) || {})), ((params === null || params === void 0 ? void 0 : params.headers) || {})) });
        const query = params === null || params === void 0 ? void 0 : params.query;
        if (query) {
            if (this.app.queryMode === 'params') {
                config.params = Object.assign(Object.assign({}, (config.params || {})), query);
            }
            else {
                config.headers = Object.assign(Object.assign({}, (config.headers || {})), { rawquery: JSON.stringify(query) });
            }
        }
        return config;
    }
    find(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.get(joinPath(this.path), this.buildConfig(params));
            return response.data;
        });
    }
    findOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign(Object.assign({}, ((params === null || params === void 0 ? void 0 : params.query) || {})), { $limit: 1 });
            const data = yield this.find(Object.assign(Object.assign({}, (params || {})), { query }));
            return getSingleResult(data);
        });
    }
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign(Object.assign({}, ((params === null || params === void 0 ? void 0 : params.query) || {})), { $paginate: false });
            const data = yield this.find(Object.assign(Object.assign({}, (params || {})), { query }));
            return getArrayResult(data);
        });
    }
    count(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = Object.assign(Object.assign({}, ((params === null || params === void 0 ? void 0 : params.query) || {})), { $limit: 0 });
            const data = yield this.find(Object.assign(Object.assign({}, (params || {})), { query }));
            return Number((data === null || data === void 0 ? void 0 : data.total) || ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.total) || 0);
        });
    }
    get(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.get(joinPath(this.path, id), this.buildConfig(params));
            return response.data;
        });
    }
    create(data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.post(joinPath(this.path), data, this.buildConfig(params));
            return response.data;
        });
    }
    update(id, data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.put(joinPath(this.path, id), data, this.buildConfig(params));
            return response.data;
        });
    }
    patch(id, data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.patch(joinPath(this.path, id), data, this.buildConfig(params));
            return response.data;
        });
    }
    remove(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.app.client.delete(joinPath(this.path, id), this.buildConfig(params));
            return response.data;
        });
    }
}
class AxiosKeycloakClient {
    constructor(app, config) {
        this.app = app;
        this.config = config;
        this.currentUser = null;
        this.keycloak = new keycloak_js_1.default(config.keycloakConfig);
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
            .then((authenticated) => __awaiter(this, void 0, void 0, function* () {
            if (authenticated && this.keycloak.token) {
                void this.onAuthSuccess();
            }
            return authenticated;
        }))
            .catch((error) => {
            this.onAuthError(error);
            return false;
        });
    }
    get user() {
        return this.currentUser;
    }
    get token() {
        return this.currentToken;
    }
    get storage() {
        if (typeof window === 'undefined') {
            return undefined;
        }
        return window.sessionStorage;
    }
    ensureInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initialized;
        });
    }
    getStoredLoginParams() {
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
            return (data === null || data === void 0 ? void 0 : data.params) || null;
        }
        catch (error) {
            return null;
        }
    }
    setStoredLoginParams(params) {
        const storage = this.storage;
        if (!storage) {
            return;
        }
        storage.setItem('keycloak-loginParams', JSON.stringify({ params }));
    }
    setStoredRedirect(redirectUri) {
        const storage = this.storage;
        if (!storage || !redirectUri) {
            return;
        }
        storage.setItem('keycloak-currentRedirect', redirectUri);
    }
    syncCurrentUser(mode, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const authPath = mode === 'create' ? this.app.authPath : this.app.refreshAuthPath;
            if (!authPath || !token) {
                return this.currentUser;
            }
            const service = this.app.service(authPath);
            if (mode === 'create') {
                const method = this.app.authCreateMethod;
                if (method === 'get') {
                    this.currentUser = yield service.get(null);
                }
                else if (method === 'put') {
                    this.currentUser = yield service.update(null, { access_token: token });
                }
                else {
                    this.currentUser = yield service.create({ access_token: token });
                }
                return this.currentUser;
            }
            const refreshMethod = this.app.authRefreshMethod;
            if (refreshMethod === 'get') {
                this.currentUser = yield service.get(null);
            }
            else if (refreshMethod === 'post') {
                this.currentUser = yield service.create({ access_token: token });
            }
            else if (refreshMethod === 'put') {
                this.currentUser = yield service.update(null, { access_token: token });
            }
            else {
                this.currentUser = yield service.patch(null, { access_token: token });
            }
            return this.currentUser;
        });
    }
    onAuthSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentToken = this.keycloak.token;
            try {
                if (this.currentToken) {
                    yield this.syncCurrentUser('create', this.currentToken);
                }
            }
            catch (error) {
                this.currentUser = null;
            }
            this.app.emit('authSuccess', {
                user: this.currentUser,
                token: this.currentToken,
                params: this.getStoredLoginParams(),
            });
        });
    }
    onAuthLogout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentUser = null;
            this.currentToken = undefined;
            this.app.emit('authLogout');
        });
    }
    onAuthError(error) {
        this.app.emit('authError', {
            error: error instanceof Error ? error : new Error('Unable to authenticate user!'),
            params: this.getStoredLoginParams(),
        });
    }
    onTokenExpired() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshToken(true);
        });
    }
    refreshToken(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureInitialized();
            if (this.refreshPromise) {
                return this.refreshPromise;
            }
            this.refreshPromise = (() => __awaiter(this, void 0, void 0, function* () {
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
                    const refreshed = yield this.keycloak.updateToken(this.minValidity);
                    this.currentToken = this.keycloak.token;
                    if (refreshed && this.currentToken) {
                        try {
                            yield this.syncCurrentUser('refresh', this.currentToken);
                        }
                        catch (error) {
                            // Ignore auth sync errors and still return the refreshed token.
                        }
                        this.app.emit('token-refreshed', {
                            user: this.currentUser,
                            token: this.currentToken,
                            params: this.getStoredLoginParams(),
                        });
                    }
                    return this.currentToken;
                }
                catch (error) {
                    this.currentToken = undefined;
                    throw error;
                }
                finally {
                    this.refreshPromise = undefined;
                }
            }))();
            return this.refreshPromise;
        });
    }
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureInitialized();
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
        });
    }
    reAuthenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshToken(true);
        });
    }
    hasPermission(options) {
        var _a;
        const data = ((_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.permissions) || [];
        const permissions = Array.isArray(options) ? options : options ? [options] : [];
        if (permissions.length === 0) {
            return true;
        }
        for (const permission of permissions) {
            if (typeof permission === 'string') {
                const [resource, scope] = permission.split(':');
                const matched = data.find((item) => item.rsname && item.rsname.toString() === resource.toString());
                if (!matched) {
                    continue;
                }
                if (!scope) {
                    return true;
                }
                const scopes = (matched.scopes || []).map((item) => item.toString());
                if (scopes.includes(scope) || scope === '*') {
                    return true;
                }
                continue;
            }
            if (permission === null || permission === void 0 ? void 0 : permission.resource) {
                const resources = Array.isArray(permission.resource) ? permission.resource : [permission.resource];
                const scopes = permission.scope ? (Array.isArray(permission.scope) ? permission.scope : [permission.scope]) : [];
                for (const resource of resources) {
                    const matched = data.find((item) => item.rsname && item.rsname.toString() === resource.toString());
                    if (!matched) {
                        continue;
                    }
                    if (scopes.length === 0) {
                        return true;
                    }
                    const resourceScopes = (matched.scopes || []).map((item) => item.toString());
                    if (scopes.some((scope) => resourceScopes.includes(scope.toString()) || scope === '*')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    login(redirectUri, params, options) {
        this.setStoredLoginParams(params);
        if (!this.keycloak.authenticated) {
            if (this.withVueRouter && this.vueRouterLink) {
                const routerRedirect = this.makeURL(this.vueRouterLink);
                this.setStoredRedirect(redirectUri || this.loginRedirectUri);
                void this.keycloak.login(Object.assign(Object.assign({ scope: this.scope || undefined }, (options || {})), { redirectUri: routerRedirect }));
            }
            else {
                const resolvedRedirect = this.makeURL(redirectUri || this.loginRedirectUri);
                void this.keycloak.login(Object.assign(Object.assign({}, (options || {})), { scope: (options === null || options === void 0 ? void 0 : options.scope) || this.scope || undefined, redirectUri: resolvedRedirect }));
            }
            return;
        }
        void this.onAuthSuccess();
    }
    logout(redirectUri) {
        const resolvedRedirect = this.makeURL(redirectUri || this.logoutRedirectUri);
        void this.keycloak.logout({ redirectUri: resolvedRedirect });
    }
    authenticated() {
        return this.keycloak.authenticated;
    }
    vueRouterComponent(timeout) {
        return {
            render: () => '',
            mounted() {
                if (typeof window === 'undefined') {
                    return;
                }
                const redirect = window.sessionStorage.getItem('keycloak-currentRedirect');
                if (redirect) {
                    setTimeout(() => {
                        this.$router.replace(redirect);
                    }, timeout || 1000);
                }
            },
        };
    }
    configureVueRouter(router, timeout) {
        router.addRoute({
            path: this.vueRouterLink,
            name: 'Keycloak-Authentication',
            component: this.vueRouterComponent(timeout),
        });
    }
    makeURL(path, origin) {
        if (path.includes('://')) {
            return path;
        }
        if (origin) {
            return `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
        }
        return `${location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
    }
}
class AxiosApplication extends SimpleEventEmitter {
    get user() {
        return this.authentication.user;
    }
    get token() {
        return this.authentication.token;
    }
    onSocket(event, listener) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.on(event, listener);
        return this;
    }
    offSocket(event, listener) {
        if (!this.socket) {
            return this;
        }
        if (listener) {
            this.socket.off(event, listener);
        }
        else {
            this.socket.off(event);
        }
        return this;
    }
    emitSocket(event, ...args) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.emit(event, ...args);
        return this;
    }
    constructor(apiURL, keycloakConfig, options) {
        super();
        this.services = new Map();
        this.queryMode = (options === null || options === void 0 ? void 0 : options.queryMode) || 'rawquery-header';
        this.authPath = (options === null || options === void 0 ? void 0 : options.authPath) === undefined ? 'auth' : options.authPath;
        this.refreshAuthPath = (options === null || options === void 0 ? void 0 : options.refreshAuthPath) === undefined ? this.authPath : options.refreshAuthPath;
        this.authCreateMethod = (options === null || options === void 0 ? void 0 : options.authCreateMethod) || 'post';
        this.authRefreshMethod = (options === null || options === void 0 ? void 0 : options.authRefreshMethod) || 'patch';
        this.tokenHeader = (options === null || options === void 0 ? void 0 : options.tokenHeader) || 'Authorization';
        this.tokenPrefix = (options === null || options === void 0 ? void 0 : options.tokenPrefix) || 'Bearer';
        this.socketEnabled = (options === null || options === void 0 ? void 0 : options.useSocket) === true;
        this.socketURL = options === null || options === void 0 ? void 0 : options.socketURL;
        this.socketEvent = (options === null || options === void 0 ? void 0 : options.socketEvent) || 'service-event';
        this.socketOptions = options === null || options === void 0 ? void 0 : options.socketOptions;
        this.socketAuthMode = (options === null || options === void 0 ? void 0 : options.socketAuthMode) || 'auth';
        this.client = axios_1.default.create(Object.assign({ baseURL: apiURL }, ((options === null || options === void 0 ? void 0 : options.axiosConfig) || {})));
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
    configureInterceptors() {
        this.client.interceptors.request.use((config) => __awaiter(this, void 0, void 0, function* () {
            const token = yield this.authentication.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers[this.tokenHeader] = `${this.tokenPrefix} ${token}`;
            }
            return config;
        }));
        this.client.interceptors.response.use((response) => response, (error) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const responseStatus = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
            const config = error.config;
            if (!config || config._veRetry || responseStatus !== 401 || !this.authenticated()) {
                throw error;
            }
            config._veRetry = true;
            try {
                yield this.reAuthenticate();
                const token = yield this.authentication.getToken();
                if (token) {
                    config.headers = config.headers || {};
                    config.headers[this.tokenHeader] = `${this.tokenPrefix} ${token}`;
                }
                return this.client.request(config);
            }
            catch (refreshError) {
                throw refreshError;
            }
        }));
    }
    configureSocket() {
        if (!this.socketEnabled) {
            return;
        }
        const socketTarget = this.resolveSocketURL();
        this.socket = (0, socket_io_client_1.io)(socketTarget, Object.assign({ autoConnect: false }, (this.socketOptions || {})));
        this.socket.on('connect', () => {
            var _a;
            this.emit('socket:connect', (_a = this.socket) === null || _a === void 0 ? void 0 : _a.id);
        });
        this.socket.on('disconnect', (reason) => {
            this.emit('socket:disconnect', reason);
        });
        this.socket.on('connect_error', (error) => {
            this.emit('socket:error', error);
        });
        this.socket.on(this.socketEvent, (payload) => {
            this.dispatchSocketMessage(this.socketEvent, payload);
        });
        this.socket.onAny((eventName, payload) => {
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
    resolveSocketURL() {
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
        return undefined;
    }
    buildSocketAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.authentication.getToken();
            if (!token) {
                return {};
            }
            const authToken = `${this.tokenPrefix} ${token}`;
            if (this.socketAuthMode === 'query') {
                return { query: { token: authToken } };
            }
            return { auth: { token: authToken } };
        });
    }
    connectSocket(forceReconnect = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.socketEnabled || !this.socket) {
                return;
            }
            const authConfig = yield this.buildSocketAuth();
            if (this.socketAuthMode === 'query') {
                this.socket.io.opts.query = Object.assign(Object.assign({}, (this.socket.io.opts.query || {})), (authConfig.query || {}));
            }
            else {
                this.socket.auth = Object.assign(Object.assign({}, (this.socket.auth || {})), (authConfig.auth || {}));
            }
            if (forceReconnect && this.socket.connected) {
                this.socket.disconnect();
            }
            if (!this.socket.connected) {
                this.socket.connect();
            }
        });
    }
    disconnectSocket() {
        if (!this.socketEnabled || !this.socket) {
            return;
        }
        this.socket.disconnect();
    }
    dispatchSocketMessage(eventName, payload) {
        const routed = this.parseSocketMessage(eventName, payload);
        if (!routed) {
            return;
        }
        const service = this.service(routed.service);
        service.emit(routed.event, routed.data);
        this.emit('socket:event', routed);
    }
    parseSocketMessage(eventName, payload) {
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
    parseSocketEnvelope(payload) {
        var _a, _b, _c;
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
            data: (_c = (_b = (_a = payload.data) !== null && _a !== void 0 ? _a : payload.payload) !== null && _b !== void 0 ? _b : payload.item) !== null && _c !== void 0 ? _c : payload,
        };
    }
    parseSocketEventName(eventName, payload) {
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
    service(path) {
        const normalizedPath = ensurePath(path);
        if (!this.services.has(normalizedPath)) {
            this.services.set(normalizedPath, new AxiosServiceClient(this, normalizedPath));
        }
        return this.services.get(normalizedPath);
    }
}
exports.AxiosApplication = AxiosApplication;
class AxiosApi {
    static setup(apiURL, keycloakConfig, soptions) {
        AxiosApi.instance = new AxiosApplication(apiURL, keycloakConfig, soptions);
        return AxiosApi.instance;
    }
}
exports.AxiosApi = AxiosApi;
