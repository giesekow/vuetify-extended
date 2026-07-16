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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppManager = void 0;
const lib_1 = require("./lib");
const runtime_1 = require("./runtime");
class AppManager {
    static set(key, value) {
        AppManager.appData[key] = value;
    }
    static get(key) {
        return AppManager.appData[key];
    }
    static clear() {
        AppManager.appData = {};
    }
    static init() {
        AppManager.channel = new lib_1.EventEmitter();
    }
    static get $app() {
        return AppManager.app;
    }
    static get initialized() {
        return !!AppManager.channel;
    }
    static setApp(app) {
        if (AppManager.app) {
            AppManager.app.clearListeners();
        }
        AppManager.emit('before-app-set', app);
        AppManager.app = app;
        AppManager.app.on('close', (data) => AppManager.emit('close', data));
        AppManager.emit('app-set', AppManager.app);
    }
    static setPrinter(printer) {
        AppManager.emit('before-printer-set', printer);
        AppManager.printer = printer;
        AppManager.emit('printer-set', AppManager.printer);
    }
    static get $printer() {
        return AppManager.printer;
    }
    static on(name, listener, reference) {
        if (AppManager.channel)
            AppManager.channel.on(name, listener, reference);
    }
    static emit(name, data) {
        if (AppManager.channel)
            AppManager.channel.emit(name, data);
    }
    static once(name, listener, reference) {
        if (AppManager.channel)
            AppManager.channel.once(name, listener, reference);
    }
    static clearListeners(reference) {
        if (AppManager.channel)
            AppManager.channel.clearListeners(reference);
    }
    static removeListener(name, listenerToRemove) {
        if (AppManager.channel)
            AppManager.channel.removeListener(name, listenerToRemove);
    }
    static registerScreen(key, entry) {
        const normalized = Object.assign(Object.assign({}, entry), { key });
        AppManager.navigationRegistry.set(key, normalized);
        return normalized;
    }
    static unregisterScreen(key) {
        AppManager.navigationRegistry.delete(key);
    }
    static resolveScreenRegistration(key) {
        if (!key) {
            return undefined;
        }
        return AppManager.navigationRegistry.get(key);
    }
    static attachNavigation(item, template) {
        (0, runtime_1.setNavigationTemplate)(item, template);
        return item;
    }
    static isDevelopmentMode() {
        var _a;
        try {
            return typeof process !== 'undefined' ? ((_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) !== 'production' : true;
        }
        catch (_error) {
            return true;
        }
    }
    static warnNavigation(message, meta) {
        if (!AppManager.isDevelopmentMode() || typeof console === 'undefined' || typeof console.warn !== 'function') {
            return;
        }
        console.warn(`[vuetify-extended] ${message}`, meta || {});
    }
    static canAccessResolvedScreen(item, entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const candidate = item;
            if (typeof (candidate === null || candidate === void 0 ? void 0 : candidate.access) !== 'function') {
                return true;
            }
            if (entry.type === 'menu') {
                return yield candidate.access();
            }
            if (entry.type === 'report' || entry.type === 'collection' || entry.type === 'trigger') {
                return yield candidate.access(entry.mode);
            }
            return yield candidate.access(entry.mode);
        });
    }
    static normalizeScreenParams(params, fallbackType) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const navigation = params === null || params === void 0 ? void 0 : params.navigation;
        if (!navigation) {
            return params || {};
        }
        return Object.assign(Object.assign({}, (params || {})), { navigation, navigationKey: (_a = navigation.key) !== null && _a !== void 0 ? _a : params === null || params === void 0 ? void 0 : params.navigationKey, navigationType: (_c = (_b = navigation.type) !== null && _b !== void 0 ? _b : params === null || params === void 0 ? void 0 : params.navigationType) !== null && _c !== void 0 ? _c : fallbackType, navigationTitle: (_d = navigation.title) !== null && _d !== void 0 ? _d : params === null || params === void 0 ? void 0 : params.navigationTitle, navigationParams: (_e = navigation.params) !== null && _e !== void 0 ? _e : params === null || params === void 0 ? void 0 : params.navigationParams, navigationState: (_f = navigation.state) !== null && _f !== void 0 ? _f : params === null || params === void 0 ? void 0 : params.navigationState, navigationMenuRestorePath: (_g = navigation.menuRestorePath) !== null && _g !== void 0 ? _g : params === null || params === void 0 ? void 0 : params.navigationMenuRestorePath, persistState: (_h = navigation.persist) !== null && _h !== void 0 ? _h : params === null || params === void 0 ? void 0 : params.persistState, excludeFromRestore: (_j = navigation.excludeFromRestore) !== null && _j !== void 0 ? _j : params === null || params === void 0 ? void 0 : params.excludeFromRestore });
    }
    static prepareScreenTarget(type, target, params) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedParams = AppManager.normalizeScreenParams(params, type);
            const navigation = normalizedParams.navigation;
            const key = normalizedParams.navigationKey;
            const template = typeof target === 'function' ? undefined : (0, runtime_1.getNavigationTemplate)(target);
            const effectiveKey = key || (template === null || template === void 0 ? void 0 : template.key);
            const registration = AppManager.resolveScreenRegistration(effectiveKey);
            const effectiveType = normalizedParams.navigationType || (template === null || template === void 0 ? void 0 : template.type) || type;
            const persistState = (_b = (_a = normalizedParams.persistState) !== null && _a !== void 0 ? _a : template === null || template === void 0 ? void 0 : template.persistState) !== null && _b !== void 0 ? _b : true;
            let excludeFromRestore = (_d = (_c = normalizedParams.excludeFromRestore) !== null && _c !== void 0 ? _c : template === null || template === void 0 ? void 0 : template.excludeFromRestore) !== null && _d !== void 0 ? _d : false;
            if (typeof target === 'function') {
                const factory = target;
                if (effectiveKey) {
                    if (registration && registration.type !== effectiveType) {
                        AppManager.warnNavigation('Navigation key is being re-registered with a different screen type. The new registration will replace the previous one.', {
                            key: effectiveKey,
                            previousType: registration.type,
                            nextType: effectiveType,
                        });
                    }
                    AppManager.registerScreen(effectiveKey, {
                        type: effectiveType,
                        create: factory,
                        serializeState: navigation === null || navigation === void 0 ? void 0 : navigation.serializeState,
                        restoreState: navigation === null || navigation === void 0 ? void 0 : navigation.restoreState,
                        persistState,
                        excludeFromRestore,
                        title: navigation === null || navigation === void 0 ? void 0 : navigation.resolveTitle,
                    });
                }
                const entry = effectiveKey || normalizedParams.navigationParams !== undefined || normalizedParams.navigationState !== undefined
                    ? {
                        id: (0, runtime_1.createNavigationId)(),
                        type: effectiveType,
                        key: effectiveKey,
                        title: normalizedParams.navigationTitle ? (0, runtime_1.resolveUIText)(normalizedParams.navigationTitle) : undefined,
                        mode: normalizedParams.mode,
                        params: normalizedParams.navigationParams,
                        state: normalizedParams.navigationState,
                        menuRestorePath: normalizedParams.navigationMenuRestorePath,
                        persistState,
                        excludeFromRestore,
                    }
                    : undefined;
                const item = yield factory(entry);
                if (!item) {
                    return { item: undefined, params: normalizedParams };
                }
                if (effectiveKey) {
                    AppManager.attachNavigation(item, {
                        key: effectiveKey,
                        type: effectiveType,
                        persistState,
                        excludeFromRestore,
                    });
                }
                return { item, params: normalizedParams };
            }
            if (effectiveKey && !registration) {
                excludeFromRestore = true;
                normalizedParams.excludeFromRestore = true;
                AppManager.warnNavigation('Navigation key was provided for a shown instance, but no screen factory is registered for refresh restore. The screen will behave normally in-session, but it will be excluded from refresh/resume restore.', {
                    type: effectiveType,
                    key: effectiveKey,
                });
            }
            if (effectiveKey) {
                AppManager.attachNavigation(target, {
                    key: effectiveKey,
                    type: effectiveType,
                    persistState,
                    excludeFromRestore,
                });
            }
            return { item: target, params: normalizedParams };
        });
    }
    static cacheNavigationItem(entryId, item) {
        AppManager.navigationItemCache.set(entryId, item);
    }
    static clearNavigationCache(entryId) {
        if (!entryId) {
            AppManager.navigationItemCache.clear();
            return;
        }
        AppManager.navigationItemCache.delete(entryId);
    }
    static resolveNavigationEntry(entry) {
        return __awaiter(this, void 0, void 0, function* () {
            const cached = AppManager.navigationItemCache.get(entry.id);
            if (cached) {
                if (entry.state !== undefined) {
                    const registration = AppManager.resolveScreenRegistration(entry.key);
                    if (registration === null || registration === void 0 ? void 0 : registration.restoreState) {
                        yield registration.restoreState(cached, entry.state, entry);
                    }
                    else if (typeof (cached === null || cached === void 0 ? void 0 : cached.restoreNavigationState) === 'function') {
                        yield cached.restoreNavigationState(entry.state, entry);
                    }
                }
                return cached;
            }
            const registration = AppManager.resolveScreenRegistration(entry.key);
            if (!registration) {
                return undefined;
            }
            const item = yield registration.create(entry);
            if (!item) {
                return undefined;
            }
            const allowed = yield AppManager.canAccessResolvedScreen(item, entry);
            if (!allowed) {
                AppManager.clearNavigationCache(entry.id);
                return undefined;
            }
            AppManager.attachNavigation(item, {
                key: registration.key,
                type: registration.type,
                persistState: registration.persistState,
                excludeFromRestore: registration.excludeFromRestore,
            });
            AppManager.cacheNavigationItem(entry.id, item);
            if (entry.state !== undefined) {
                if (registration.restoreState) {
                    yield registration.restoreState(item, entry.state, entry);
                }
                else if (typeof (item === null || item === void 0 ? void 0 : item.restoreNavigationState) === 'function') {
                    yield item.restoreNavigationState(entry.state, entry);
                }
            }
            return item;
        });
    }
    static buildNavigationEntry(type, item, params, existingEntry) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __awaiter(this, void 0, void 0, function* () {
            const template = (0, runtime_1.getNavigationTemplate)(item);
            const key = (existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.key) || (params === null || params === void 0 ? void 0 : params.navigationKey) || (template === null || template === void 0 ? void 0 : template.key);
            const registration = AppManager.resolveScreenRegistration(key);
            const persistState = (_d = (_c = (_b = (_a = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.persistState) !== null && _a !== void 0 ? _a : params === null || params === void 0 ? void 0 : params.persistState) !== null && _b !== void 0 ? _b : template === null || template === void 0 ? void 0 : template.persistState) !== null && _c !== void 0 ? _c : registration === null || registration === void 0 ? void 0 : registration.persistState) !== null && _d !== void 0 ? _d : true;
            const excludeFromRestore = (_h = (_g = (_f = (_e = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.excludeFromRestore) !== null && _e !== void 0 ? _e : params === null || params === void 0 ? void 0 : params.excludeFromRestore) !== null && _f !== void 0 ? _f : template === null || template === void 0 ? void 0 : template.excludeFromRestore) !== null && _g !== void 0 ? _g : registration === null || registration === void 0 ? void 0 : registration.excludeFromRestore) !== null && _h !== void 0 ? _h : false;
            const mode = (_k = (_j = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.mode) !== null && _j !== void 0 ? _j : params === null || params === void 0 ? void 0 : params.mode) !== null && _k !== void 0 ? _k : (_l = item === null || item === void 0 ? void 0 : item.$params) === null || _l === void 0 ? void 0 : _l.mode;
            const title = (_s = (_q = (_o = (_m = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.title) !== null && _m !== void 0 ? _m : params === null || params === void 0 ? void 0 : params.navigationTitle) !== null && _o !== void 0 ? _o : (_p = registration === null || registration === void 0 ? void 0 : registration.title) === null || _p === void 0 ? void 0 : _p.call(registration, item, existingEntry || {
                id: '',
                type,
                key,
                mode,
                persistState,
                excludeFromRestore,
            })) !== null && _q !== void 0 ? _q : (_r = item === null || item === void 0 ? void 0 : item.$params) === null || _r === void 0 ? void 0 : _r.title) !== null && _s !== void 0 ? _s : (_t = item === null || item === void 0 ? void 0 : item.$params) === null || _t === void 0 ? void 0 : _t.text;
            let state = params === null || params === void 0 ? void 0 : params.navigationState;
            if (state === undefined) {
                try {
                    const draftEntry = existingEntry || {
                        id: '',
                        type,
                        key,
                        mode,
                        persistState,
                        excludeFromRestore,
                    };
                    if (registration === null || registration === void 0 ? void 0 : registration.serializeState) {
                        state = yield registration.serializeState(item, draftEntry);
                    }
                    else if (typeof (item === null || item === void 0 ? void 0 : item.serializeNavigationState) === 'function') {
                        state = yield item.serializeNavigationState(draftEntry);
                    }
                }
                catch (_error) {
                    state = undefined;
                }
            }
            if (state === undefined) {
                state = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.state;
            }
            return {
                id: (existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.id) || (0, runtime_1.createNavigationId)(),
                type: (existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.type) || (template === null || template === void 0 ? void 0 : template.type) || type,
                key,
                title: title ? String(title) : undefined,
                mode,
                params: (_u = params === null || params === void 0 ? void 0 : params.navigationParams) !== null && _u !== void 0 ? _u : existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.params,
                state,
                menuRestorePath: (_v = existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.menuRestorePath) !== null && _v !== void 0 ? _v : params === null || params === void 0 ? void 0 : params.navigationMenuRestorePath,
                persistState,
                excludeFromRestore,
            };
        });
    }
    static showMenu(menu, params) {
        if (AppManager.app) {
            AppManager.app.$showMenu(menu, params);
            return true;
        }
        return false;
    }
    static showLeftMenu(menu, params) {
        if (AppManager.app) {
            AppManager.app.$showLeftMenu(menu, params);
            return true;
        }
        return false;
    }
    static showRightMenu(menu, params) {
        if (AppManager.app) {
            AppManager.app.$showRightMenu(menu, params);
            return true;
        }
        return false;
    }
    static hideLeftMenu() {
        if (AppManager.app) {
            AppManager.app.$hideLeftMenu();
            return true;
        }
        return false;
    }
    static hideRightMenu() {
        if (AppManager.app) {
            AppManager.app.$hideRightMenu();
            return true;
        }
        return false;
    }
    static clearLeftMenu() {
        if (AppManager.app) {
            AppManager.app.$clearLeftMenu();
            return true;
        }
        return false;
    }
    static clearRightMenu() {
        if (AppManager.app) {
            AppManager.app.$clearRightMenu();
            return true;
        }
        return false;
    }
    static toggleLeftMenu() {
        if (AppManager.app) {
            AppManager.app.$toggleLeftMenu();
            return true;
        }
        return false;
    }
    static toggleRightMenu() {
        if (AppManager.app) {
            AppManager.app.$toggleRightMenu();
            return true;
        }
        return false;
    }
    static refreshLeftMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            if (AppManager.app) {
                yield AppManager.app.$refreshLeftMenu();
                return true;
            }
            return false;
        });
    }
    static refreshRightMenu() {
        return __awaiter(this, void 0, void 0, function* () {
            if (AppManager.app) {
                yield AppManager.app.$refreshRightMenu();
                return true;
            }
            return false;
        });
    }
    static getUDFs(objectType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AppManager.app) {
                return yield AppManager.app.$getUDFs(objectType);
            }
            return [];
        });
    }
    static makeUDF(options, mode) {
        if (AppManager.app) {
            return AppManager.app.$makeUDF(options, mode);
        }
    }
    static showCollection(collection, params, replace) {
        if (AppManager.app) {
            AppManager.app.$showCollection(collection, params, replace);
            return true;
        }
        return false;
    }
    static showTrigger(trigger, params, replace) {
        if (AppManager.app) {
            AppManager.app.$showTrigger(trigger, params, replace);
            return true;
        }
        return false;
    }
    static showReport(report, params, replace) {
        if (AppManager.app) {
            AppManager.app.$showReport(report, params, replace);
            return true;
        }
        return false;
    }
    static showDialog(dialog, params) {
        if (AppManager.app) {
            AppManager.app.$showDialog(dialog, params);
            return true;
        }
        return false;
    }
    static showSelector(selector, params) {
        if (AppManager.app) {
            AppManager.app.$showSelector(selector, params);
            return true;
        }
        return false;
    }
    static showUI(ui, params, replace) {
        if (AppManager.app) {
            AppManager.app.$showUI(ui, params, replace);
            return true;
        }
        return false;
    }
    static reload() {
        if (AppManager.app) {
            AppManager.app.$reload();
            return true;
        }
        return false;
    }
    static back() {
        if (AppManager.app)
            AppManager.app.$back();
    }
    static syncNavigationState(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AppManager.app) {
                yield AppManager.app.syncCurrentNavigationState(options);
                return true;
            }
            return false;
        });
    }
    static supportsHistory() {
        var _a;
        return !!((_a = AppManager.app) === null || _a === void 0 ? void 0 : _a.$supportsBrowserHistory);
    }
    static goBackWithFallback(fallback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (AppManager.app && typeof AppManager.app.$goBackWithFallback === 'function') {
                yield AppManager.app.$goBackWithFallback(fallback);
                return;
            }
            yield fallback();
        });
    }
    static backHistorySilently() {
        if (AppManager.app && typeof AppManager.app.$backBrowserHistorySilently === 'function') {
            return !!AppManager.app.$backBrowserHistorySilently();
        }
        return false;
    }
}
exports.AppManager = AppManager;
AppManager.appData = {};
AppManager.navigationRegistry = new Map();
AppManager.navigationItemCache = new Map();
