import { PrinterBase } from "../misc";
import { AppMain } from "./appmain";
import type { AppScreenParams } from "./appmain";
import { ReportMode, UIBase } from "./base";
import { Collection } from "./collection";
import { DialogForm } from "./dialogform";
import { Field } from "./field";
import { EventEmitter } from "./lib";
import { Menu } from "./menu";
import { Report } from "./report";
import { Selector } from "./selector";
import { Trigger } from "./trigger";
import { createNavigationId, getNavigationTemplate, resolveUIText, setNavigationTemplate, type InlineNavigationOptions, type NavigationEntry, type NavigationPersistIntent, type NavigationRegistryEntry, type NavigationScreenFactory, type NavigationScreenType } from "./runtime";



export class AppManager {
  
  private static app: AppMain
  private static printer: PrinterBase
  private static channel: EventEmitter
  private static appData: any = {}
  private static navigationRegistry = new Map<string, NavigationRegistryEntry<any>>();
  private static navigationItemCache = new Map<string, UIBase>();

  static set(key: string|symbol, value: any) {
    AppManager.appData[key] = value;
  }

  static get(key: string|symbol): any {
    return AppManager.appData[key];
  }

  static clear(): void {
    AppManager.appData = {};
  }

  static init() {
    AppManager.channel = new EventEmitter();
  }

  static get $app(): AppMain|undefined {
    return AppManager.app;
  }

  static get initialized(): boolean {
    return !!AppManager.channel;
  }

  static setApp(app: AppMain) {
    if (AppManager.app) {
      AppManager.app.clearListeners();
    }
    AppManager.emit('before-app-set', app);
    AppManager.app = app;
    AppManager.app.on('close', (data) => AppManager.emit('close', data));
    AppManager.emit('app-set', AppManager.app);
  }

  static setPrinter(printer: PrinterBase) {
    AppManager.emit('before-printer-set', printer);
    AppManager.printer = printer;
    AppManager.emit('printer-set', AppManager.printer);
  }

  static get $printer(): PrinterBase {
    return AppManager.printer;
  }

  static on(name: string, listener: EventListener, reference?: string|symbol) {
    if (AppManager.channel) AppManager.channel.on(name, listener, reference);
  }

  static emit(name: string, data?: any) {
    if (AppManager.channel) AppManager.channel.emit(name, data);
  }

  static once(name: string, listener: EventListener, reference?: string|symbol) {
    if (AppManager.channel) AppManager.channel.once(name, listener, reference);
  }

  static clearListeners(reference?: string|symbol) {
    if (AppManager.channel) AppManager.channel.clearListeners(reference);
  }

  static removeListener(name: string, listenerToRemove?: EventListener) {
    if (AppManager.channel) AppManager.channel.removeListener(name, listenerToRemove);
  }

  static registerScreen<T extends UIBase>(key: string, entry: Omit<NavigationRegistryEntry<T>, 'key'> | NavigationRegistryEntry<T>) {
    const normalized: NavigationRegistryEntry<T> = {
      ...(entry as NavigationRegistryEntry<T>),
      key,
    };
    AppManager.navigationRegistry.set(key, normalized as NavigationRegistryEntry<any>);
    return normalized;
  }

  static unregisterScreen(key: string) {
    AppManager.navigationRegistry.delete(key);
  }

  static resolveScreenRegistration(key?: string) {
    if (!key) {
      return undefined;
    }
    return AppManager.navigationRegistry.get(key);
  }

  static attachNavigation<T extends UIBase>(
    item: T,
    template: {
      key?: string;
      type?: NavigationScreenType;
      persistState?: NavigationPersistIntent;
      excludeFromRestore?: boolean;
    },
  ) {
    setNavigationTemplate(item, template);
    return item;
  }

  private static isDevelopmentMode() {
    try {
      return typeof process !== 'undefined' ? process.env?.NODE_ENV !== 'production' : true;
    } catch (_error) {
      return true;
    }
  }

  private static warnNavigation(message: string, meta?: Record<string, any>) {
    if (!AppManager.isDevelopmentMode() || typeof console === 'undefined' || typeof console.warn !== 'function') {
      return;
    }

    console.warn(`[vuetify-extended] ${message}`, meta || {});
  }

  private static async canAccessResolvedScreen(item: UIBase, entry: NavigationEntry) {
    const candidate = item as any;
    if (typeof candidate?.access !== 'function') {
      return true;
    }

    if (entry.type === 'menu') {
      return await candidate.access();
    }

    if (entry.type === 'report' || entry.type === 'collection' || entry.type === 'trigger') {
      return await candidate.access(entry.mode);
    }

    return await candidate.access(entry.mode);
  }

  static normalizeScreenParams(params?: AppScreenParams, fallbackType?: NavigationScreenType): AppScreenParams {
    const navigation = params?.navigation as InlineNavigationOptions<any> | undefined;
    if (!navigation) {
      return params || {};
    }

    return {
      ...(params || {}),
      navigation,
      navigationKey: navigation.key ?? params?.navigationKey,
      navigationType: navigation.type ?? params?.navigationType ?? fallbackType,
      navigationTitle: navigation.title ?? params?.navigationTitle,
      navigationParams: navigation.params ?? params?.navigationParams,
      navigationState: navigation.state ?? params?.navigationState,
      navigationMenuRestorePath: navigation.menuRestorePath ?? params?.navigationMenuRestorePath,
      persistState: navigation.persist ?? params?.persistState,
      excludeFromRestore: navigation.excludeFromRestore ?? params?.excludeFromRestore,
    };
  }

  static async prepareScreenTarget<T extends UIBase>(
    type: NavigationScreenType,
    target: T | NavigationScreenFactory<T>,
    params?: AppScreenParams,
  ): Promise<{ item?: T; params: AppScreenParams }> {
    const normalizedParams = AppManager.normalizeScreenParams(params, type);
    const navigation = normalizedParams.navigation as InlineNavigationOptions<T> | undefined;
    const key = normalizedParams.navigationKey;
    const template = typeof target === 'function' ? undefined : getNavigationTemplate(target);
    const effectiveKey = key || template?.key;
    const registration = AppManager.resolveScreenRegistration(effectiveKey);
    const effectiveType = normalizedParams.navigationType || template?.type || type;
    const persistState = normalizedParams.persistState ?? template?.persistState ?? true;
    let excludeFromRestore = normalizedParams.excludeFromRestore ?? template?.excludeFromRestore ?? false;

    if (typeof target === 'function') {
      const factory = target as NavigationScreenFactory<T>;
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
          serializeState: navigation?.serializeState,
          restoreState: navigation?.restoreState,
          persistState,
          excludeFromRestore,
          title: navigation?.resolveTitle,
        });
      }

      const entry: NavigationEntry | undefined = effectiveKey || normalizedParams.navigationParams !== undefined || normalizedParams.navigationState !== undefined
        ? {
            id: createNavigationId(),
            type: effectiveType,
            key: effectiveKey,
            title: normalizedParams.navigationTitle ? resolveUIText(normalizedParams.navigationTitle) : undefined,
            mode: normalizedParams.mode,
            params: normalizedParams.navigationParams,
            state: normalizedParams.navigationState,
            menuRestorePath: normalizedParams.navigationMenuRestorePath,
            persistState,
            excludeFromRestore,
          }
        : undefined;

      const item = await factory(entry);
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
  }

  static cacheNavigationItem(entryId: string, item: UIBase) {
    AppManager.navigationItemCache.set(entryId, item);
  }

  static clearNavigationCache(entryId?: string) {
    if (!entryId) {
      AppManager.navigationItemCache.clear();
      return;
    }

    AppManager.navigationItemCache.delete(entryId);
  }

  static async resolveNavigationEntry(entry: NavigationEntry): Promise<UIBase | undefined> {
    const cached = AppManager.navigationItemCache.get(entry.id);
    if (cached) {
      if (entry.state !== undefined) {
        const registration = AppManager.resolveScreenRegistration(entry.key);
        if (registration?.restoreState) {
          await registration.restoreState(cached as any, entry.state, entry);
        } else if (typeof (cached as any)?.restoreNavigationState === 'function') {
          await (cached as any).restoreNavigationState(entry.state, entry);
        }
      }
      return cached;
    }

    const registration = AppManager.resolveScreenRegistration(entry.key);
    if (!registration) {
      return undefined;
    }

    const item = await registration.create(entry);
    if (!item) {
      return undefined;
    }

    const allowed = await AppManager.canAccessResolvedScreen(item as UIBase, entry);
    if (!allowed) {
      AppManager.clearNavigationCache(entry.id);
      return undefined;
    }

    AppManager.attachNavigation(item as UIBase, {
      key: registration.key,
      type: registration.type,
      persistState: registration.persistState,
      excludeFromRestore: registration.excludeFromRestore,
    });
    AppManager.cacheNavigationItem(entry.id, item as UIBase);
    if (entry.state !== undefined) {
      if (registration.restoreState) {
        await registration.restoreState(item as any, entry.state, entry);
      } else if (typeof (item as any)?.restoreNavigationState === 'function') {
        await (item as any).restoreNavigationState(entry.state, entry);
      }
    }

    return item as UIBase;
  }

  static async buildNavigationEntry(
    type: NavigationScreenType,
    item: UIBase,
    params?: any,
    existingEntry?: NavigationEntry,
  ): Promise<NavigationEntry> {
    const template = getNavigationTemplate(item);
    const key = existingEntry?.key || params?.navigationKey || template?.key;
    const registration = AppManager.resolveScreenRegistration(key);
    const persistState = existingEntry?.persistState ?? params?.persistState ?? template?.persistState ?? registration?.persistState ?? true;
    const excludeFromRestore = existingEntry?.excludeFromRestore ?? params?.excludeFromRestore ?? template?.excludeFromRestore ?? registration?.excludeFromRestore ?? false;
    const mode = existingEntry?.mode ?? params?.mode ?? (item as any)?.$params?.mode;
    const title = existingEntry?.title
      ?? params?.navigationTitle
      ?? registration?.title?.(item as any, existingEntry || {
        id: '',
        type,
        key,
        mode,
        persistState,
        excludeFromRestore,
      } as NavigationEntry)
      ?? (item as any)?.$params?.title
      ?? (item as any)?.$params?.text;

    let state = params?.navigationState;
    if (state === undefined) {
      try {
        const draftEntry = existingEntry || {
          id: '',
          type,
          key,
          mode,
          persistState,
          excludeFromRestore,
        } as NavigationEntry;

        if (registration?.serializeState) {
          state = await registration.serializeState(item as any, draftEntry);
        } else if (typeof (item as any)?.serializeNavigationState === 'function') {
          state = await (item as any).serializeNavigationState(draftEntry);
        }
      } catch (_error) {
        state = undefined;
      }
    }

    if (state === undefined) {
      state = existingEntry?.state;
    }

    return {
      id: existingEntry?.id || createNavigationId(),
      type: existingEntry?.type || template?.type || type,
      key,
      title: title ? String(title) : undefined,
      mode,
      params: params?.navigationParams ?? existingEntry?.params,
      state,
      menuRestorePath: existingEntry?.menuRestorePath ?? params?.navigationMenuRestorePath,
      persistState,
      excludeFromRestore,
    };
  }

  static showMenu(menu: Menu | NavigationScreenFactory<Menu>, params?: AppScreenParams): Boolean {
    if (AppManager.app) {
      AppManager.app.$showMenu(menu, params);
      return true;
    }
    return false;
  }

  static showLeftMenu(menu: Menu | NavigationScreenFactory<Menu>, params?: AppScreenParams) {
    if (AppManager.app) {
      AppManager.app.$showLeftMenu(menu, params);
      return true;
    }
    return false;
  }

  static showRightMenu(menu: Menu | NavigationScreenFactory<Menu>, params?: AppScreenParams) {
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

  static async refreshLeftMenu() {
    if (AppManager.app) {
      await AppManager.app.$refreshLeftMenu();
      return true;
    }
    return false;
  }

  static async refreshRightMenu() {
    if (AppManager.app) {
      await AppManager.app.$refreshRightMenu();
      return true;
    }
    return false;
  }

  static async getUDFs(objectType: string|string[]): Promise<any[]> {
    if (AppManager.app) {
      return await AppManager.app.$getUDFs(objectType);
    }

    return [];
  }

  static makeUDF(options: any, mode?: ReportMode): Field|undefined {
    if (AppManager.app) {
      return AppManager.app.$makeUDF(options, mode);
    }
  }
  
  static showCollection(collection: Collection | NavigationScreenFactory<Collection>, params?: AppScreenParams, replace?: boolean) {
    if (AppManager.app) {
      AppManager.app.$showCollection(collection, params, replace);
      return true;
    }
    return false;
  }

  static showTrigger(trigger: Trigger | NavigationScreenFactory<Trigger>, params?: AppScreenParams, replace?: boolean) {
    if (AppManager.app) {
      AppManager.app.$showTrigger(trigger, params, replace);
      return true;
    }
    return false;
  }
  
  static showReport(report: Report | NavigationScreenFactory<Report>, params?: AppScreenParams, replace?: boolean) {
    if (AppManager.app) {
      AppManager.app.$showReport(report, params, replace);
      return true;
    }
    return false;
  }

  static showDialog(dialog: DialogForm, params?: any) {
    if (AppManager.app) {
      AppManager.app.$showDialog(dialog, params);
      return true;
    }
    return false;
  }

  static showSelector(selector: Selector, params?: any) {
    if (AppManager.app) {
      AppManager.app.$showSelector(selector, params);
      return true;
    }
    return false;
  }

  static showUI(ui: UIBase | NavigationScreenFactory<UIBase>, params?: AppScreenParams, replace?: boolean) {
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
    if(AppManager.app) AppManager.app.$back();
  }

  static async syncNavigationState(options?: { replaceHistory?: boolean; skipHistory?: boolean }) {
    if (AppManager.app) {
      await AppManager.app.syncCurrentNavigationState(options);
      return true;
    }
    return false;
  }

  static supportsHistory() {
    return !!AppManager.app?.$supportsBrowserHistory;
  }

  static async goBackWithFallback(fallback: () => Promise<void> | void) {
    if (AppManager.app && typeof (AppManager.app as any).$goBackWithFallback === 'function') {
      await (AppManager.app as any).$goBackWithFallback(fallback);
      return;
    }

    await fallback();
  }

  static backHistorySilently() {
    if (AppManager.app && typeof (AppManager.app as any).$backBrowserHistorySilently === 'function') {
      return !!(AppManager.app as any).$backBrowserHistorySilently();
    }

    return false;
  }
}
