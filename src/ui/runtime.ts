import type { Ref } from 'vue';

import type { ScreenMode } from './base';

export interface UITextDescriptor {
  key: string;
  fallback?: string;
  values?: Record<string, any>;
}

export type UIText = string | UITextDescriptor | (() => string);

export interface VuetifyExtendedI18nAdapter {
  localeRef?: Ref<string>;
  t?: (key: string, values?: Record<string, any>) => string;
  formatDate?: (value: any, options?: any) => string;
  formatNumber?: (value: number, options?: any) => string;
  formatCurrency?: (value: number, options?: any) => string;
  isRTL?: (locale?: string) => boolean;
}

let i18nAdapter: VuetifyExtendedI18nAdapter | undefined;

export function setVuetifyExtendedI18n(adapter?: VuetifyExtendedI18nAdapter) {
  i18nAdapter = adapter;
}

export function getVuetifyExtendedI18n() {
  return i18nAdapter;
}

export function isUITextDescriptor(value: any): value is UITextDescriptor {
  return !!value && typeof value === 'object' && !Array.isArray(value) && typeof value.key === 'string';
}

export function interpolateUITextTemplate(template?: string, values?: Record<string, any>) {
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

export function $l(key: string, fallback?: string, values?: Record<string, any>): UITextDescriptor {
  return {
    key,
    fallback,
    ...(values ? { values } : {}),
  };
}

export function $t(key: string, fallback?: string, values?: Record<string, any>) {
  return resolveUIText($l(key, fallback, values), fallback || key);
}

export function resolveUIText(value: UIText | undefined | null, fallback: string = ''): string {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === 'function') {
    try {
      const resolved = value();
      return resolved === undefined || resolved === null ? fallback : String(resolved);
    } catch (_error) {
      return fallback;
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (isUITextDescriptor(value)) {
    const adapter = getVuetifyExtendedI18n();
    const locale = adapter?.localeRef?.value;
    void locale;

    if (adapter?.t) {
      try {
        const translated = adapter.t(value.key, value.values);
        if (translated !== undefined && translated !== null && String(translated).trim() !== '') {
          return interpolateUITextTemplate(String(translated), value.values);
        }
      } catch (_error) {
        //
      }
    }

    return interpolateUITextTemplate(value.fallback || value.key || fallback, value.values);
  }

  return String(value);
}

export function formatDateText(value: any, options?: any) {
  const adapter = getVuetifyExtendedI18n();
  const locale = adapter?.localeRef?.value;
  void locale;
  if (adapter?.formatDate) {
    return adapter.formatDate(value, options);
  }
  return value;
}

export function formatNumberText(value: number, options?: any) {
  const adapter = getVuetifyExtendedI18n();
  const locale = adapter?.localeRef?.value;
  void locale;
  if (adapter?.formatNumber) {
    return adapter.formatNumber(value, options);
  }
  return String(value);
}

export function formatCurrencyText(value: number, options?: any) {
  const adapter = getVuetifyExtendedI18n();
  const locale = adapter?.localeRef?.value;
  void locale;
  if (adapter?.formatCurrency) {
    return adapter.formatCurrency(value, options);
  }
  return String(value);
}

export function isRTLLocale(locale?: string) {
  const adapter = getVuetifyExtendedI18n();
  const activeLocale = locale || adapter?.localeRef?.value;
  if (adapter?.isRTL) {
    return !!adapter.isRTL(activeLocale);
  }
  return false;
}

export type NavigationScreenType = 'menu' | 'report' | 'trigger' | 'collection' | 'dashboard' | 'dialog' | 'selector' | 'ui';
export type NavigationStorageMode = 'web-session' | 'web-local' | 'capacitor-preferences' | 'custom';
export type NavigationPersistIntent = boolean | 'default' | 'local';

export interface NavigationMenuRestoreStep {
  index: number;
  text?: string;
  action?: string;
}

export interface NavigationEntry {
  id: string;
  type: NavigationScreenType;
  key?: string;
  title?: string;
  mode?: ScreenMode;
  params?: any;
  state?: any;
  menuRestorePath?: NavigationMenuRestoreStep[];
  persistState?: NavigationPersistIntent;
  excludeFromRestore?: boolean;
}

export type NavigationScreenFactory<T = any> = (entry?: NavigationEntry) => Promise<T | undefined> | T | undefined;

export interface InlineNavigationOptions<T = any> {
  key?: string;
  type?: NavigationScreenType;
  title?: UIText;
  params?: any;
  state?: any;
  menuRestorePath?: NavigationMenuRestoreStep[];
  persist?: NavigationPersistIntent;
  excludeFromRestore?: boolean;
  serializeState?: (item: T, entry: NavigationEntry) => Promise<any> | any;
  restoreState?: (item: T, state: any, entry: NavigationEntry) => Promise<void> | void;
  resolveTitle?: (item: T, entry: NavigationEntry) => string | undefined;
}

export interface AppSnapshot {
  version: 1;
  savedAt: number;
  stack: NavigationEntry[];
}

export interface NavigationPersistenceAdapter {
  load(): Promise<AppSnapshot | undefined>;
  save(snapshot: AppSnapshot): Promise<void>;
  clear(): Promise<void>;
}

export interface NavigationRegistryEntry<T = any> {
  key: string;
  type: NavigationScreenType;
  create: (entry: NavigationEntry) => Promise<T | undefined> | T | undefined;
  serializeState?: (item: T, entry: NavigationEntry) => Promise<any> | any;
  restoreState?: (item: T, state: any, entry: NavigationEntry) => Promise<void> | void;
  persistState?: NavigationPersistIntent;
  excludeFromRestore?: boolean;
  title?: (item: T, entry: NavigationEntry) => string | undefined;
}

export interface AppNavigationOptions {
  enabled?: boolean;
  history?: boolean;
  persist?: boolean;
  restoreOnLoad?: boolean;
  storageMode?: NavigationStorageMode;
  storageKey?: string;
  persistence?: NavigationPersistenceAdapter;
}

type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
};

const DEFAULT_STORAGE_KEY = 'vuetify-extended-navigation-stack';
const NAV_TEMPLATE_KEY = Symbol('vuetify-extended.navigation-template');
const NAV_WINDOW_SCOPE_ID_KEY = '__veWindowScopeId';

export interface NavigationTemplate {
  key?: string;
  type?: NavigationScreenType;
  persistState?: NavigationPersistIntent;
  excludeFromRestore?: boolean;
}

export function setNavigationTemplate(target: any, template: NavigationTemplate) {
  if (!target) {
    return;
  }
  (target as any)[NAV_TEMPLATE_KEY] = {
    ...((target as any)[NAV_TEMPLATE_KEY] || {}),
    ...template,
  };
}

export function getNavigationTemplate(target: any): NavigationTemplate | undefined {
  if (!target) {
    return undefined;
  }
  return (target as any)[NAV_TEMPLATE_KEY];
}

function randomId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createNavigationId() {
  return randomId();
}

export function navigationStorageKey(value?: string) {
  return value || DEFAULT_STORAGE_KEY;
}

function getBrowserNavigationType() {
  const performanceApi = (globalThis as any)?.performance;
  try {
    const entries = performanceApi?.getEntriesByType?.('navigation');
    const type = entries?.[0]?.type;
    if (typeof type === 'string') {
      return type;
    }
  } catch (_error) {
    //
  }

  const legacyType = performanceApi?.navigation?.type;
  if (legacyType === 1) {
    return 'reload';
  }
  if (legacyType === 0) {
    return 'navigate';
  }
  return undefined;
}

function resolveWindowScopedNavigationStorageKey(baseKey: string) {
  if (typeof window === 'undefined' || !window.history) {
    return baseKey;
  }

  const currentState = window.history.state;
  const existingScopeId = typeof currentState?.[NAV_WINDOW_SCOPE_ID_KEY] === 'string'
    ? currentState[NAV_WINDOW_SCOPE_ID_KEY]
    : undefined;
  const navigationType = getBrowserNavigationType();
  const scopeId = navigationType === 'reload' && existingScopeId
    ? existingScopeId
    : randomId();

  try {
    window.history.replaceState(
      {
        ...(typeof currentState === 'object' && currentState !== null ? currentState : {}),
        [NAV_WINDOW_SCOPE_ID_KEY]: scopeId,
      },
      '',
      window.location.href,
    );
  } catch (_error) {
    //
  }

  return `${baseKey}::${scopeId}`;
}

function safeWindowStorage(name: 'sessionStorage' | 'localStorage'): StorageLike | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const storage = window[name];
    const probeKey = '__ve_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    return storage;
  } catch (_error) {
    return undefined;
  }
}

function createWebStorageAdapter(storage: StorageLike | undefined, key: string): NavigationPersistenceAdapter {
  return {
    async load() {
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
      } catch (_error) {
        return undefined;
      }
    },
    async save(snapshot: AppSnapshot) {
      if (!storage) {
        return;
      }

      try {
        storage.setItem(key, JSON.stringify(snapshot));
      } catch (_error) {
        //
      }
    },
    async clear() {
      if (!storage) {
        return;
      }

      try {
        storage.removeItem(key);
      } catch (_error) {
        //
      }
    },
  };
}

async function optionalImport(specifier: string): Promise<any | undefined> {
  try {
    const importer = new Function('s', 'return import(s);') as (value: string) => Promise<any>;
    return await importer(specifier);
  } catch (_error) {
    return undefined;
  }
}

function resolveCapacitorPreferencesPlugin() {
  const capacitor = (globalThis as any)?.Capacitor;
  const plugins = capacitor?.Plugins;
  return plugins?.Preferences;
}

async function createCapacitorPreferencesAdapter(key: string): Promise<NavigationPersistenceAdapter> {
  const plugin = resolveCapacitorPreferencesPlugin();
  if (plugin?.get && plugin?.set && plugin?.remove) {
    return {
      async load() {
        try {
          const result = await plugin.get({ key });
          const parsed = result?.value ? JSON.parse(result.value) : undefined;
          return isValidSnapshot(parsed) ? parsed : undefined;
        } catch (_error) {
          return undefined;
        }
      },
      async save(snapshot: AppSnapshot) {
        try {
          await plugin.set({ key, value: JSON.stringify(snapshot) });
        } catch (_error) {
          //
        }
      },
      async clear() {
        try {
          await plugin.remove({ key });
        } catch (_error) {
          //
        }
      },
    };
  }

  const module = await optionalImport('@capacitor/preferences');
  const Preferences = module?.Preferences;
  if (Preferences?.get && Preferences?.set && Preferences?.remove) {
    return {
      async load() {
        try {
          const result = await Preferences.get({ key });
          const parsed = result?.value ? JSON.parse(result.value) : undefined;
          return isValidSnapshot(parsed) ? parsed : undefined;
        } catch (_error) {
          return undefined;
        }
      },
      async save(snapshot: AppSnapshot) {
        try {
          await Preferences.set({ key, value: JSON.stringify(snapshot) });
        } catch (_error) {
          //
        }
      },
      async clear() {
        try {
          await Preferences.remove({ key });
        } catch (_error) {
          //
        }
      },
    };
  }

  return createWebStorageAdapter(safeWindowStorage('localStorage'), key);
}

export function detectCapacitorEnvironment() {
  const capacitor = (globalThis as any)?.Capacitor;
  if (!capacitor) {
    return false;
  }

  try {
    if (typeof capacitor.isNativePlatform === 'function') {
      return !!capacitor.isNativePlatform();
    }
  } catch (_error) {
    //
  }

  const platform = typeof capacitor.getPlatform === 'function' ? capacitor.getPlatform() : undefined;
  return !!platform && platform !== 'web';
}

export function resolveDefaultNavigationStorageMode(): NavigationStorageMode {
  return detectCapacitorEnvironment() ? 'capacitor-preferences' : 'web-session';
}

export async function createNavigationPersistenceAdapter(
  mode: NavigationStorageMode,
  key?: string,
): Promise<NavigationPersistenceAdapter> {
  const baseStorageKey = navigationStorageKey(key);
  const scopedStorageKey = resolveWindowScopedNavigationStorageKey(baseStorageKey);

  if (mode === 'web-local') {
    return createWebStorageAdapter(safeWindowStorage('localStorage'), scopedStorageKey);
  }

  if (mode === 'capacitor-preferences') {
    return createCapacitorPreferencesAdapter(baseStorageKey);
  }

  if (mode === 'custom') {
    return createWebStorageAdapter(
      safeWindowStorage('sessionStorage'),
      scopedStorageKey,
    );
  }

  return createWebStorageAdapter(
    safeWindowStorage('sessionStorage'),
    scopedStorageKey,
  );
}

export async function attachCapacitorBackButton(handler: () => Promise<void> | void) {
  const module = await optionalImport('@capacitor/app');
  const App = module?.App;
  if (!App?.addListener) {
    return () => undefined;
  }

  try {
    const listener = await App.addListener('backButton', () => {
      void handler();
    });
    return () => {
      try {
        listener?.remove?.();
      } catch (_error) {
        //
      }
    };
  } catch (_error) {
    return () => undefined;
  }
}

export function isValidSnapshot(value: any): value is AppSnapshot {
  return !!value && value.version === 1 && Array.isArray(value.stack);
}

export function isNavigationEntry(value: any): value is NavigationEntry {
  return !!value && typeof value === 'object' && typeof value.id === 'string' && typeof value.type === 'string';
}

export function makeSerializable<T = any>(value: T): T | undefined {
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
  } catch (_error) {
    return undefined;
  }
}

export function resolvePersistIntent(intent: NavigationPersistIntent | undefined, defaultValue: NavigationPersistIntent = 'default') {
  if (intent === undefined) {
    return defaultValue;
  }
  return intent;
}
