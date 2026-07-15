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
exports.resolvePersistIntent = exports.makeSerializable = exports.isNavigationEntry = exports.isValidSnapshot = exports.attachCapacitorBackButton = exports.createNavigationPersistenceAdapter = exports.resolveDefaultNavigationStorageMode = exports.detectCapacitorEnvironment = exports.navigationStorageKey = exports.createNavigationId = exports.getNavigationTemplate = exports.setNavigationTemplate = exports.isRTLLocale = exports.formatCurrencyText = exports.formatNumberText = exports.formatDateText = exports.resolveUIText = exports.$t = exports.$l = exports.interpolateUITextTemplate = exports.isUITextDescriptor = exports.getVuetifyExtendedI18n = exports.setVuetifyExtendedI18n = void 0;
let i18nAdapter;
function setVuetifyExtendedI18n(adapter) {
    i18nAdapter = adapter;
}
exports.setVuetifyExtendedI18n = setVuetifyExtendedI18n;
function getVuetifyExtendedI18n() {
    return i18nAdapter;
}
exports.getVuetifyExtendedI18n = getVuetifyExtendedI18n;
function isUITextDescriptor(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value) && typeof value.key === 'string';
}
exports.isUITextDescriptor = isUITextDescriptor;
function interpolateUITextTemplate(template, values) {
    if (!template) {
        return '';
    }
    if (!values) {
        return template;
    }
    return template.replace(/\{(\w+)\}/g, (_match, token) => {
        const value = values[token];
        return value === undefined || value === null ? '' : String(value);
    });
}
exports.interpolateUITextTemplate = interpolateUITextTemplate;
function $l(key, fallback, values) {
    return Object.assign({ key,
        fallback }, (values ? { values } : {}));
}
exports.$l = $l;
function $t(key, fallback, values) {
    return resolveUIText($l(key, fallback, values), fallback || key);
}
exports.$t = $t;
function resolveUIText(value, fallback = '') {
    var _a;
    if (value === undefined || value === null) {
        return fallback;
    }
    if (typeof value === 'function') {
        try {
            const resolved = value();
            return resolved === undefined || resolved === null ? fallback : String(resolved);
        }
        catch (_error) {
            return fallback;
        }
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    if (isUITextDescriptor(value)) {
        const adapter = getVuetifyExtendedI18n();
        const locale = (_a = adapter === null || adapter === void 0 ? void 0 : adapter.localeRef) === null || _a === void 0 ? void 0 : _a.value;
        void locale;
        if (adapter === null || adapter === void 0 ? void 0 : adapter.t) {
            try {
                const translated = adapter.t(value.key, value.values);
                if (translated !== undefined && translated !== null && String(translated).trim() !== '') {
                    return interpolateUITextTemplate(String(translated), value.values);
                }
            }
            catch (_error) {
                //
            }
        }
        return interpolateUITextTemplate(value.fallback || value.key || fallback, value.values);
    }
    return String(value);
}
exports.resolveUIText = resolveUIText;
function formatDateText(value, options) {
    var _a;
    const adapter = getVuetifyExtendedI18n();
    const locale = (_a = adapter === null || adapter === void 0 ? void 0 : adapter.localeRef) === null || _a === void 0 ? void 0 : _a.value;
    void locale;
    if (adapter === null || adapter === void 0 ? void 0 : adapter.formatDate) {
        return adapter.formatDate(value, options);
    }
    return value;
}
exports.formatDateText = formatDateText;
function formatNumberText(value, options) {
    var _a;
    const adapter = getVuetifyExtendedI18n();
    const locale = (_a = adapter === null || adapter === void 0 ? void 0 : adapter.localeRef) === null || _a === void 0 ? void 0 : _a.value;
    void locale;
    if (adapter === null || adapter === void 0 ? void 0 : adapter.formatNumber) {
        return adapter.formatNumber(value, options);
    }
    return String(value);
}
exports.formatNumberText = formatNumberText;
function formatCurrencyText(value, options) {
    var _a;
    const adapter = getVuetifyExtendedI18n();
    const locale = (_a = adapter === null || adapter === void 0 ? void 0 : adapter.localeRef) === null || _a === void 0 ? void 0 : _a.value;
    void locale;
    if (adapter === null || adapter === void 0 ? void 0 : adapter.formatCurrency) {
        return adapter.formatCurrency(value, options);
    }
    return String(value);
}
exports.formatCurrencyText = formatCurrencyText;
function isRTLLocale(locale) {
    var _a;
    const adapter = getVuetifyExtendedI18n();
    const activeLocale = locale || ((_a = adapter === null || adapter === void 0 ? void 0 : adapter.localeRef) === null || _a === void 0 ? void 0 : _a.value);
    if (adapter === null || adapter === void 0 ? void 0 : adapter.isRTL) {
        return !!adapter.isRTL(activeLocale);
    }
    return false;
}
exports.isRTLLocale = isRTLLocale;
const DEFAULT_STORAGE_KEY = 'vuetify-extended-navigation-stack';
const NAV_TEMPLATE_KEY = Symbol('vuetify-extended.navigation-template');
function setNavigationTemplate(target, template) {
    if (!target) {
        return;
    }
    target[NAV_TEMPLATE_KEY] = Object.assign(Object.assign({}, (target[NAV_TEMPLATE_KEY] || {})), template);
}
exports.setNavigationTemplate = setNavigationTemplate;
function getNavigationTemplate(target) {
    if (!target) {
        return undefined;
    }
    return target[NAV_TEMPLATE_KEY];
}
exports.getNavigationTemplate = getNavigationTemplate;
function randomId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function createNavigationId() {
    return randomId();
}
exports.createNavigationId = createNavigationId;
function navigationStorageKey(value) {
    return value || DEFAULT_STORAGE_KEY;
}
exports.navigationStorageKey = navigationStorageKey;
function safeWindowStorage(name) {
    if (typeof window === 'undefined') {
        return undefined;
    }
    try {
        const storage = window[name];
        const probeKey = '__ve_probe__';
        storage.setItem(probeKey, '1');
        storage.removeItem(probeKey);
        return storage;
    }
    catch (_error) {
        return undefined;
    }
}
function createWebStorageAdapter(storage, key) {
    return {
        load() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!storage) {
                    return undefined;
                }
                try {
                    const raw = storage.getItem(key);
                    if (!raw) {
                        return undefined;
                    }
                    const parsed = JSON.parse(raw);
                    return isValidSnapshot(parsed) ? parsed : undefined;
                }
                catch (_error) {
                    return undefined;
                }
            });
        },
        save(snapshot) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!storage) {
                    return;
                }
                try {
                    storage.setItem(key, JSON.stringify(snapshot));
                }
                catch (_error) {
                    //
                }
            });
        },
        clear() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!storage) {
                    return;
                }
                try {
                    storage.removeItem(key);
                }
                catch (_error) {
                    //
                }
            });
        },
    };
}
function optionalImport(specifier) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const importer = new Function('s', 'return import(s);');
            return yield importer(specifier);
        }
        catch (_error) {
            return undefined;
        }
    });
}
function resolveCapacitorPreferencesPlugin() {
    const capacitor = globalThis === null || globalThis === void 0 ? void 0 : globalThis.Capacitor;
    const plugins = capacitor === null || capacitor === void 0 ? void 0 : capacitor.Plugins;
    return plugins === null || plugins === void 0 ? void 0 : plugins.Preferences;
}
function createCapacitorPreferencesAdapter(key) {
    return __awaiter(this, void 0, void 0, function* () {
        const plugin = resolveCapacitorPreferencesPlugin();
        if ((plugin === null || plugin === void 0 ? void 0 : plugin.get) && (plugin === null || plugin === void 0 ? void 0 : plugin.set) && (plugin === null || plugin === void 0 ? void 0 : plugin.remove)) {
            return {
                load() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield plugin.get({ key });
                            const parsed = (result === null || result === void 0 ? void 0 : result.value) ? JSON.parse(result.value) : undefined;
                            return isValidSnapshot(parsed) ? parsed : undefined;
                        }
                        catch (_error) {
                            return undefined;
                        }
                    });
                },
                save(snapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield plugin.set({ key, value: JSON.stringify(snapshot) });
                        }
                        catch (_error) {
                            //
                        }
                    });
                },
                clear() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield plugin.remove({ key });
                        }
                        catch (_error) {
                            //
                        }
                    });
                },
            };
        }
        const module = yield optionalImport('@capacitor/preferences');
        const Preferences = module === null || module === void 0 ? void 0 : module.Preferences;
        if ((Preferences === null || Preferences === void 0 ? void 0 : Preferences.get) && (Preferences === null || Preferences === void 0 ? void 0 : Preferences.set) && (Preferences === null || Preferences === void 0 ? void 0 : Preferences.remove)) {
            return {
                load() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const result = yield Preferences.get({ key });
                            const parsed = (result === null || result === void 0 ? void 0 : result.value) ? JSON.parse(result.value) : undefined;
                            return isValidSnapshot(parsed) ? parsed : undefined;
                        }
                        catch (_error) {
                            return undefined;
                        }
                    });
                },
                save(snapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield Preferences.set({ key, value: JSON.stringify(snapshot) });
                        }
                        catch (_error) {
                            //
                        }
                    });
                },
                clear() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield Preferences.remove({ key });
                        }
                        catch (_error) {
                            //
                        }
                    });
                },
            };
        }
        return createWebStorageAdapter(safeWindowStorage('localStorage'), key);
    });
}
function detectCapacitorEnvironment() {
    const capacitor = globalThis === null || globalThis === void 0 ? void 0 : globalThis.Capacitor;
    if (!capacitor) {
        return false;
    }
    try {
        if (typeof capacitor.isNativePlatform === 'function') {
            return !!capacitor.isNativePlatform();
        }
    }
    catch (_error) {
        //
    }
    const platform = typeof capacitor.getPlatform === 'function' ? capacitor.getPlatform() : undefined;
    return !!platform && platform !== 'web';
}
exports.detectCapacitorEnvironment = detectCapacitorEnvironment;
function resolveDefaultNavigationStorageMode() {
    return detectCapacitorEnvironment() ? 'capacitor-preferences' : 'web-session';
}
exports.resolveDefaultNavigationStorageMode = resolveDefaultNavigationStorageMode;
function createNavigationPersistenceAdapter(mode, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const storageKey = navigationStorageKey(key);
        if (mode === 'web-local') {
            return createWebStorageAdapter(safeWindowStorage('localStorage'), storageKey);
        }
        if (mode === 'capacitor-preferences') {
            return createCapacitorPreferencesAdapter(storageKey);
        }
        if (mode === 'custom') {
            return createWebStorageAdapter(safeWindowStorage('sessionStorage'), storageKey);
        }
        return createWebStorageAdapter(safeWindowStorage('sessionStorage'), storageKey);
    });
}
exports.createNavigationPersistenceAdapter = createNavigationPersistenceAdapter;
function attachCapacitorBackButton(handler) {
    return __awaiter(this, void 0, void 0, function* () {
        const module = yield optionalImport('@capacitor/app');
        const App = module === null || module === void 0 ? void 0 : module.App;
        if (!(App === null || App === void 0 ? void 0 : App.addListener)) {
            return () => undefined;
        }
        try {
            const listener = yield App.addListener('backButton', () => {
                void handler();
            });
            return () => {
                var _a;
                try {
                    (_a = listener === null || listener === void 0 ? void 0 : listener.remove) === null || _a === void 0 ? void 0 : _a.call(listener);
                }
                catch (_error) {
                    //
                }
            };
        }
        catch (_error) {
            return () => undefined;
        }
    });
}
exports.attachCapacitorBackButton = attachCapacitorBackButton;
function isValidSnapshot(value) {
    return !!value && value.version === 1 && Array.isArray(value.stack);
}
exports.isValidSnapshot = isValidSnapshot;
function isNavigationEntry(value) {
    return !!value && typeof value === 'object' && typeof value.id === 'string' && typeof value.type === 'string';
}
exports.isNavigationEntry = isNavigationEntry;
function makeSerializable(value) {
    if (value === undefined) {
        return undefined;
    }
    try {
        return JSON.parse(JSON.stringify(value, (_key, currentValue) => {
            if (typeof currentValue === 'function' || typeof currentValue === 'symbol') {
                return undefined;
            }
            return currentValue;
        }));
    }
    catch (_error) {
        return undefined;
    }
}
exports.makeSerializable = makeSerializable;
function resolvePersistIntent(intent, defaultValue = 'default') {
    if (intent === undefined) {
        return defaultValue;
    }
    return intent;
}
exports.resolvePersistIntent = resolvePersistIntent;
