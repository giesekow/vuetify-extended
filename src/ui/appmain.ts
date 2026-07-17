import { VNode, Ref, ShallowRef, isVNode, nextTick, shallowRef } from "vue";
import { MenuTarget, ReportMode, UIBase } from "./base";
import { Menu, prepareMenuReplayTarget } from "./menu";
import { Report } from "./report";
import { Collection } from "./collection";
import { Selector } from "./selector";
import { Trigger } from "./trigger";
import { sleep } from "../misc";
import { Dialogs } from "./dialogs";
import { Field } from "./field";
import { Button } from "./button";
import { AppManager } from "./appmanager";
import { Api } from "../api";
import { DialogForm } from "./dialogform";
import { normalizeButtonShortcut, normalizeButtonShortcutFromEvent } from "./shortcut";
import { VApp, VAppBar, VAppBarTitle, VBtn, VCard, VCardText, VFooter, VMain, VMenu, VNavigationDrawer, VDivider, VContainer, VInput, VTextField } from 'vuetify/components';
import { Master } from "../master";
import { attachCapacitorBackButton, createNavigationPersistenceAdapter, createNavigationId, detectCapacitorEnvironment, isValidSnapshot, makeSerializable, navigationStorageKey, resolveDefaultNavigationStorageMode, type AppNavigationOptions, type AppSnapshot, type InlineNavigationOptions, type NavigationEntry, type NavigationMenuRestoreStep, type NavigationPersistenceAdapter, type NavigationScreenFactory, type NavigationScreenType, type NavigationStorageMode, type UIText } from "./runtime";

export interface AppParams {
  ref?: string;
  udfQuery?: any;
  title?: UIText;
  mobileTitle?: UIText;
  mobileLogo?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showFab?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: UIText;
  fabShortcut?: string;
  headerLayout?: 'balanced'|'auto'|'stacked';
  footerLayout?: 'balanced'|'auto'|'stacked';
  headerStartWidth?: string|number;
  headerCenterWidth?: string|number;
  headerEndWidth?: string|number;
  footerStartWidth?: string|number;
  footerCenterWidth?: string|number;
  footerEndWidth?: string|number;
  backgroundColor?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundOverlay?: string;
}

export type AppShellContent = UIBase | VNode | string | number | boolean | null | undefined;

export interface AppOptions {
  menu?: (app: AppMain) => Promise<Menu|undefined>|Menu|undefined;
  home?: (app: AppMain) => Promise<AppHomeTarget | undefined> | AppHomeTarget | undefined;
  beforeLoad?: (app: AppMain) => Promise<void> | void;
  loaded?: (app: AppMain) => Promise<void> | void;
  ready?: (app: AppMain) => Promise<void> | void;
  leftNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  rightNav?: (app: AppMain) => Promise<Menu | undefined> | Menu | undefined;
  leftNavOptions?: AppSideNavOptions;
  rightNavOptions?: AppSideNavOptions;
  udfs?: (app: AppMain, objectType: string|string[], query: any) => Promise<any[]>;
  makeUDF?: (app: AppMain, options: any) => Field|undefined;
  fabButtons?: AppFabButtonsFactory;
  navigation?: AppNavigationOptions;
  header?: (app: AppMain) => AppShellContent | AppShellContent[];
  footer?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  headerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerStart?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerCenter?: (app: AppMain) => AppShellContent | AppShellContent[];
  footerEnd?: (app: AppMain) => AppShellContent | AppShellContent[];
}

export type AppFabButtonsFactory = Button[] | ((app: AppMain, item?: UIBase, stackItem?: AppStackItem) => Button[]);
export type AppMenuTarget = Menu | NavigationScreenFactory<Menu>;
export type AppReportTarget = Report | NavigationScreenFactory<Report>;
export type AppCollectionTarget = Collection | NavigationScreenFactory<Collection>;
export type AppTriggerTarget = Trigger | NavigationScreenFactory<Trigger>;
export type AppUITarget = UIBase | NavigationScreenFactory<UIBase>;

export type AppHomeTarget =
  | { type: 'menu'; target: AppMenuTarget; params?: AppScreenParams; }
  | { type: 'report'; target: AppReportTarget; params?: AppScreenParams; }
  | { type: 'collection'; target: AppCollectionTarget; params?: AppScreenParams; }
  | { type: 'trigger'; target: AppTriggerTarget; params?: AppScreenParams; }
  | { type: 'ui'; target: AppUITarget; params?: AppScreenParams; };

export interface AppSideNavOptions {
  enabled?: boolean;
  side?: 'left' | 'right';
  mode?: 'persistent' | 'temporary' | 'rail';
  width?: number | string;
  open?: boolean;
  overlay?: boolean;
  breakpoint?: number;
  autoCloseOnNavigate?: boolean;
  mobileMode?: 'temporary' | 'rail';
  submenuMode?: 'screen' | 'inline';
  accordion?: boolean;
  showToggleButton?: boolean;
  toggleIcon?: string;
  toggleColor?: string;
  toggleVariant?: string;
  toggleTooltip?: UIText;
}

export interface AppScreenParams {
  showFab?: boolean;
  hideSideNavs?: boolean;
  fabIcon?: string;
  fabColor?: string;
  fabPosition?: 'bottom-right'|'bottom-left';
  fabDirection?: 'up'|'left';
  fabLabel?: UIText;
  fabShortcut?: string;
  fabButtons?: AppFabButtonsFactory;
  navigationKey?: string;
  navigationType?: NavigationScreenType;
  navigationTitle?: UIText;
  navigationParams?: any;
  navigationState?: any;
  navigationMenuRestorePath?: NavigationMenuRestoreStep[];
  persistState?: boolean | 'default' | 'local';
  excludeFromRestore?: boolean;
  navigation?: InlineNavigationOptions<any>;
  [key: string]: any;
}

export interface AppStackItem {
  type: "menu"|"report"|"trigger"|"collection"|"selector"|"ui";
  item: UIBase,
  params: AppScreenParams,
  navigation?: NavigationEntry
}

type AppSideNavSide = 'left' | 'right';
type AppSideNavSource = 'contextual' | 'runtime' | 'configured' | undefined;

interface AppSideNavTargetState {
  target?: MenuTarget;
  params?: AppScreenParams;
  source?: AppSideNavSource;
  token?: unknown;
}

type AppLifecycleEventName = 'beforeLoad' | 'loaded' | 'ready';

export class AppMain extends UIBase {
  private params: Ref<AppParams>;
  private options: AppOptions;

  private stack: Array<AppStackItem>;
  private stackRefState: Ref<Array<AppStackItem>>;
  private activeItemRefState: Ref<AppStackItem | undefined>;
  private loaded: Ref<boolean>;
  private index: Ref<number>;
  private selectors: Array<Selector>;
  private selectorCount: Ref<number>;
  private dialogs: Array<DialogForm>;
  private dialogCount: Ref<number>;
  private selectorFocusTargets: Map<symbol, HTMLElement>;
  private dialogFocusTargets: Map<symbol, HTMLElement>;
  private fabButtonInstances: Array<Button>;
  private fabOpen: Ref<boolean>;
  private shortcutHandler?: (ev: KeyboardEvent) => void;
  private compactShellLayout: Ref<boolean>;
  private shellLayoutMediaQuery?: MediaQueryList;
  private shellLayoutMediaHandler?: ((ev: MediaQueryListEvent) => void) | undefined;
  private mobileHeaderDrawerOpen: Ref<boolean>;
  private footerHeight: Ref<number>;
  private footerElement?: HTMLElement;
  private footerResizeObserver?: ResizeObserver;
  private viewportWidth: Ref<number>;
  private leftSideMenu: ShallowRef<Menu | undefined>;
  private rightSideMenu: ShallowRef<Menu | undefined>;
  private leftSideMenuOpen: Ref<boolean>;
  private rightSideMenuOpen: Ref<boolean>;
  private leftSideMenuSource: AppSideNavSource;
  private rightSideMenuSource: AppSideNavSource;
  private leftSideMenuState?: AppSideNavTargetState;
  private rightSideMenuState?: AppSideNavTargetState;
  private leftSideMenuTouched = false;
  private rightSideMenuTouched = false;
  private leftSideMenuRuntime?: AppSideNavTargetState;
  private rightSideMenuRuntime?: AppSideNavTargetState;
  private leftSideMenuRuntimeRevision = 0;
  private rightSideMenuRuntimeRevision = 0;
  private leftSideMenuSuppressedToken?: unknown;
  private rightSideMenuSuppressedToken?: unknown;
  private navigationPersistence?: NavigationPersistenceAdapter;
  private navigationOptions: AppNavigationOptions;
  private browserNavigationAttached = false;
  private ignoreNextPopState = false;
  private restoringNavigation = false;
  private pendingManagedBackToken?: symbol;
  private pendingManagedBackFallback?: () => Promise<void> | void;
  private pendingManagedBackTimer?: ReturnType<typeof setTimeout>;
  private detachCapacitorBackHandler?: () => void;
  private readonly boundPopStateHandler = (ev: PopStateEvent) => {
    void this.onPopState(ev);
  };
  private readonly boundPersistenceFlushHandler = () => {
    void this.syncCurrentNavigationState();
  };
  private readonly boundVisibilityHandler = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      void this.syncCurrentNavigationState();
    }
  };
  private static defaultParams: AppParams = {
    showHeader: false,
    showFooter: false,
    showFab: false,
    fabIcon: 'mdi-plus',
    fabColor: 'primary',
    fabPosition: 'bottom-right',
    fabDirection: 'up',
    fabLabel: { key: 've.app.quickActions', fallback: 'Quick Actions' },
    fabShortcut: undefined,
    headerLayout: 'balanced',
    footerLayout: 'balanced',
  };

  constructor(params?: AppParams, options?: AppOptions) {
    super();
    this.params = this.$makeRef({...AppMain.defaultParams, ...(params || {})});
    this.options = options || {};
    this.stack = [];
    this.stackRefState = this.$makeRef([]);
    this.activeItemRefState = this.$makeRef(undefined);
    this.loaded = this.$makeRef(false);
    this.index = this.$makeRef(-1);
    this.selectorCount = this.$makeRef(0);
    this.dialogCount = this.$makeRef(0);
    this.selectors = [];
    this.dialogs = [];
    this.selectorFocusTargets = new Map();
    this.dialogFocusTargets = new Map();
    this.fabButtonInstances = [];
    this.fabOpen = this.$makeRef(false);
    this.compactShellLayout = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth < 960 : false);
    this.mobileHeaderDrawerOpen = this.$makeRef(false);
    this.footerHeight = this.$makeRef(0);
    this.viewportWidth = this.$makeRef(typeof window !== 'undefined' ? window.innerWidth : 1280);
    this.leftSideMenu = shallowRef();
    this.rightSideMenu = shallowRef();
    this.leftSideMenuOpen = this.$makeRef(false);
    this.rightSideMenuOpen = this.$makeRef(false);
    this.leftSideMenuSource = undefined;
    this.rightSideMenuSource = undefined;
    this.navigationOptions = {
      enabled: false,
      history: true,
      persist: true,
      restoreOnLoad: true,
      storageMode: resolveDefaultNavigationStorageMode(),
      storageKey: navigationStorageKey(),
      ...(options?.navigation || {}),
    };
  }

  static setDefault(value: AppParams, reset?: boolean): void {
    if (reset) {
      AppMain.defaultParams = value;
    } else {
      AppMain.defaultParams = {...AppMain.defaultParams, ...value};
    }
  }

  get $ref() {
    return this.params.value.ref;
  }

  setParams(params: AppParams) {
    this.params.value = {...this.params.value, ...params};
  }

  setOptions(options: Partial<AppOptions>) {
    if (!options) {
      return;
    }

    const navigation = options.navigation;
    const rest = { ...options };
    delete (rest as any).navigation;

    this.options = {
      ...this.options,
      ...rest,
      ...(navigation ? { navigation } : {}),
    };

    if (navigation) {
      this.navigationOptions = {
        ...this.navigationOptions,
        ...navigation,
      };
    }

    if (this.loaded.value) {
      void this.refreshSideMenus();
    }
  }

  get $params(): AppParams {
    return this.params.value;
  }

  get stackRef() {
    return this.stackRefState;
  }

  get activeItemRef() {
    return this.activeItemRefState;
  }

  get $supportsBrowserHistory() {
    return this.supportsBrowserHistory();
  }

  get $navigationEnabled() {
    return this.navigationEnabled();
  }

  private syncStackRefs() {
    this.stackRefState.value = [...this.stack];
    this.activeItemRefState.value = this.getActiveStackItem();
  }

  private navigationEnabled() {
    return this.navigationOptions.enabled === true;
  }

  private supportsBrowserHistory() {
    return this.navigationEnabled() && this.navigationOptions.history !== false && typeof window !== 'undefined' && !!window.history;
  }

  private supportsPersistence() {
    return this.navigationEnabled() && this.navigationOptions.persist !== false;
  }

  private getSideNavOptions(side: AppSideNavSide): AppSideNavOptions {
    const raw = side === 'left' ? this.options.leftNavOptions : this.options.rightNavOptions;
    return {
      enabled: true,
      side,
      mode: side === 'left' ? 'persistent' : 'temporary',
      width: side === 'left' ? 320 : 340,
      autoCloseOnNavigate: true,
      mobileMode: 'temporary',
      ...(raw || {}),
    };
  }

  private sideNavMenuRef(side: AppSideNavSide) {
    return side === 'left' ? this.leftSideMenu : this.rightSideMenu;
  }

  private sideNavOpenRef(side: AppSideNavSide) {
    return side === 'left' ? this.leftSideMenuOpen : this.rightSideMenuOpen;
  }

  private sideNavState(side: AppSideNavSide) {
    return side === 'left' ? this.leftSideMenuState : this.rightSideMenuState;
  }

  private setSideNavState(side: AppSideNavSide, state?: AppSideNavTargetState) {
    if (side === 'left') {
      this.leftSideMenuState = state;
    } else {
      this.rightSideMenuState = state;
    }
  }

  private suppressedSideNavToken(side: AppSideNavSide) {
    return side === 'left' ? this.leftSideMenuSuppressedToken : this.rightSideMenuSuppressedToken;
  }

  private setSuppressedSideNavToken(side: AppSideNavSide, token?: unknown) {
    if (side === 'left') {
      this.leftSideMenuSuppressedToken = token;
    } else {
      this.rightSideMenuSuppressedToken = token;
    }
  }

  private setSideNavSource(side: AppSideNavSide, source: AppSideNavSource) {
    if (side === 'left') {
      this.leftSideMenuSource = source;
    } else {
      this.rightSideMenuSource = source;
    }
  }

  private setSideNavTouched(side: AppSideNavSide, value: boolean) {
    if (side === 'left') {
      this.leftSideMenuTouched = value;
    } else {
      this.rightSideMenuTouched = value;
    }
  }

  private isSideNavTouched(side: AppSideNavSide) {
    return side === 'left' ? this.leftSideMenuTouched : this.rightSideMenuTouched;
  }

  private isSideNavMobile(side: AppSideNavSide) {
    return this.viewportWidth.value <= (this.getSideNavOptions(side).breakpoint || 959);
  }

  private isSideNavTemporary(side: AppSideNavSide) {
    const options = this.getSideNavOptions(side);
    if (this.isSideNavMobile(side)) {
      return options.mobileMode !== 'rail';
    }

    return options.mode === 'temporary';
  }

  private defaultSideNavOpen(side: AppSideNavSide) {
    const options = this.getSideNavOptions(side);
    if (options.open !== undefined) {
      return options.open;
    }

    if (this.isSideNavMobile(side)) {
      return false;
    }

    return side === 'left' && options.mode !== 'temporary';
  }

  private setSideNavOpen(side: AppSideNavSide, value: boolean, touched: boolean = true) {
    if (touched) {
      this.setSideNavTouched(side, true);
    }

    this.sideNavOpenRef(side).value = value;
    if (value && this.isSideNavMobile(side)) {
      this.sideNavOpenRef(side === 'left' ? 'right' : 'left').value = false;
    }
  }

  private shouldRenderSideNav(side: AppSideNavSide) {
    return this.getSideNavOptions(side).enabled !== false;
  }

  private async resolveConfiguredSideNavTarget(side: AppSideNavSide): Promise<MenuTarget | undefined> {
    const resolver = side === 'left' ? this.options.leftNav : this.options.rightNav;
    if (!resolver) {
      return undefined;
    }

    return await resolver(this);
  }

  private async resolveContextualRightMenuState(): Promise<AppSideNavTargetState> {
    const activeItem = this.getActiveStackItem()?.item;
    if (!activeItem) {
      return {};
    }

    if (activeItem instanceof Collection) {
      const report = activeItem.$currentReport;
      const trigger = activeItem.$currentTrigger;
      if (report?.$currentForm) {
        const formTarget = await report.$currentForm.getRightMenuTarget();
        if (formTarget) {
          return {
            target: formTarget,
            source: 'contextual',
            token: report.$currentForm.$id,
          };
        }
      }

      if (report) {
        const reportTarget = await report.getRightMenuTarget();
        if (reportTarget) {
          return {
            target: reportTarget,
            source: 'contextual',
            token: report.$id,
          };
        }
      }

      if (trigger) {
        const triggerTarget = await trigger.getRightMenuTarget();
        if (triggerTarget) {
          return {
            target: triggerTarget,
            source: 'contextual',
            token: trigger.$id,
          };
        }
      }

      return {};
    }

    if (activeItem instanceof Report) {
      if (activeItem.$currentForm) {
        const formTarget = await activeItem.$currentForm.getRightMenuTarget();
        if (formTarget) {
          return {
            target: formTarget,
            source: 'contextual',
            token: activeItem.$currentForm.$id,
          };
        }
      }

      const reportTarget = await activeItem.getRightMenuTarget();
      if (reportTarget) {
        return {
          target: reportTarget,
          source: 'contextual',
          token: activeItem.$id,
        };
      }

      return {};
    }

    if (!activeItem || typeof activeItem.getRightMenuTarget !== 'function') {
      return {};
    }

    const target = await activeItem.getRightMenuTarget();
    if (!target) {
      return {};
    }

    return {
      target,
      source: 'contextual',
      token: activeItem.$id,
    };
  }

  private async resolveSideNavTarget(side: AppSideNavSide): Promise<AppSideNavTargetState> {
    if (side === 'right') {
      const contextualState = await this.resolveContextualRightMenuState();
      if (contextualState.target) {
        return contextualState;
      }
    }

    const runtimeState = side === 'left' ? this.leftSideMenuRuntime : this.rightSideMenuRuntime;
    if (runtimeState?.target) {
      return runtimeState;
    }

    const configuredTarget = await this.resolveConfiguredSideNavTarget(side);
    if (configuredTarget) {
      return {
        target: configuredTarget,
        source: 'configured',
        token: side === 'left' ? this.options.leftNav : this.options.rightNav,
      };
    }

    return {};
  }

  private applySideNavPresentation(menu: Menu) {
    menu.setParent(this);
    menu.setParams({
      presentation: 'side-nav',
      hideBackButton: true,
    });
  }

  private async resolveSideNavMenu(side: AppSideNavSide, forceReload: boolean = false) {
    if (!this.shouldRenderSideNav(side)) {
      this.sideNavMenuRef(side).value = undefined;
      this.sideNavOpenRef(side).value = false;
      this.setSideNavSource(side, undefined);
      this.setSideNavState(side, undefined);
      this.setSideNavTouched(side, false);
      return;
    }

    const resolvedState = await this.resolveSideNavTarget(side);
    const suppressedToken = this.suppressedSideNavToken(side);
    if (suppressedToken !== undefined && resolvedState.token !== undefined && suppressedToken === resolvedState.token) {
      this.sideNavMenuRef(side).value = undefined;
      this.sideNavOpenRef(side).value = false;
      this.setSideNavSource(side, undefined);
      this.setSideNavState(side, undefined);
      this.setSideNavTouched(side, false);
      return;
    }

    if (suppressedToken !== undefined && resolvedState.token !== suppressedToken) {
      this.setSuppressedSideNavToken(side, undefined);
    }

    if (!resolvedState.target) {
      this.sideNavMenuRef(side).value = undefined;
      this.sideNavOpenRef(side).value = false;
      this.setSideNavSource(side, undefined);
      this.setSideNavState(side, undefined);
      this.setSideNavTouched(side, false);
      return;
    }

    const prepared = await AppManager.prepareScreenTarget('menu', resolvedState.target as any, resolvedState.params);
    const menu = prepared.item;
    if (!menu) {
      this.sideNavMenuRef(side).value = undefined;
      this.sideNavOpenRef(side).value = false;
      this.setSideNavSource(side, undefined);
      this.setSideNavState(side, undefined);
      this.setSideNavTouched(side, false);
      return;
    }

    const allowed = typeof (menu as any)?.access === 'function' ? await (menu as any).access() : true;
    if (!allowed) {
      this.sideNavMenuRef(side).value = undefined;
      this.sideNavOpenRef(side).value = false;
      this.setSideNavSource(side, undefined);
      this.setSideNavState(side, undefined);
      this.setSideNavTouched(side, false);
      return;
    }

    this.applySideNavPresentation(menu);

    const current = this.sideNavMenuRef(side).value;
    const sameMenuInstance = current?.$id === menu.$id;
    this.sideNavMenuRef(side).value = menu;
    this.setSideNavSource(side, resolvedState.source);
    this.setSideNavState(side, resolvedState);

    if (!this.isSideNavTouched(side)) {
      this.sideNavOpenRef(side).value = this.defaultSideNavOpen(side);
    }

    if (sameMenuInstance || forceReload) {
      await menu.$reload();
    }
  }

  private async refreshSideMenus(forceReload: boolean = false) {
    await this.resolveSideNavMenu('left', forceReload);
    await this.resolveSideNavMenu('right', forceReload);
  }

  private closeTemporarySideNavsOnNavigate() {
    (['left', 'right'] as AppSideNavSide[]).forEach((side) => {
      const options = this.getSideNavOptions(side);
      if (options.autoCloseOnNavigate === false) {
        return;
      }

      if (this.isSideNavTemporary(side)) {
        this.sideNavOpenRef(side).value = false;
      }
    });
  }

  private clearSideNav(side: AppSideNavSide) {
    const currentState = this.sideNavState(side);
    if (currentState?.token !== undefined) {
      this.setSuppressedSideNavToken(side, currentState.token);
    }

    if (side === 'left') {
      this.leftSideMenuRuntime = undefined;
    } else {
      this.rightSideMenuRuntime = undefined;
    }

    this.sideNavMenuRef(side).value = undefined;
    this.sideNavOpenRef(side).value = false;
    this.setSideNavSource(side, undefined);
    this.setSideNavState(side, undefined);
    this.setSideNavTouched(side, false);
  }

  private async ensureNavigationPersistence() {
    if (this.navigationPersistence) {
      return this.navigationPersistence;
    }

    if (this.navigationOptions.persistence) {
      this.navigationPersistence = this.navigationOptions.persistence;
      return this.navigationPersistence;
    }

    this.navigationPersistence = await createNavigationPersistenceAdapter(
      this.navigationOptions.storageMode || resolveDefaultNavigationStorageMode(),
      this.navigationOptions.storageKey,
    );
    return this.navigationPersistence;
  }

  private shouldIncludePersistedEntry(entry: NavigationEntry | undefined, _index: number) {
    if (!entry || entry.excludeFromRestore === true) {
      return false;
    }

    if (entry.type === 'menu') {
      return true;
    }

    if (entry.key) {
      return true;
    }

    return false;
  }

  private createSnapshot(includeExcludedFromRestore: boolean = false, includeTransientState: boolean = false): AppSnapshot {
    return {
      version: 1,
      savedAt: Date.now(),
      stack: this.stack
        .map((entry, index) => ({ navigation: entry.navigation, index }))
        .filter(({ navigation, index }) => includeExcludedFromRestore || this.shouldIncludePersistedEntry(navigation, index))
        .map(({ navigation }) => navigation)
        .filter((entry): entry is NavigationEntry => !!entry)
        .map((entry) => ({
          ...entry,
          params: makeSerializable(entry.params),
          state: includeTransientState ? makeSerializable(entry.state) : this.createPersistedEntryState(entry),
        })),
    };
  }

  private createPersistedEntryState(entry: NavigationEntry) {
    const serializedState = makeSerializable(entry.state);
    if (entry.persistState !== false) {
      return serializedState;
    }

    if (entry.type === 'collection' && serializedState && typeof serializedState === 'object') {
      return {
        restoreMode: 'shallow',
        currentObject: (serializedState as any).currentObject,
        prevState: (serializedState as any).prevState,
        selectedIds: makeSerializable((serializedState as any).selectedIds),
        currentIndex: (serializedState as any).currentIndex,
      };
    }

    return undefined;
  }

  private createBrowserState() {
    return {
      __veNavigation: true,
      snapshot: this.createSnapshot(true, true),
    };
  }

  private serializeSnapshotEntry(entry?: NavigationEntry) {
    if (!entry) {
      return undefined;
    }

    return JSON.stringify({
      type: entry.type,
      key: entry.key,
      mode: entry.mode,
      params: makeSerializable(entry.params),
      state: makeSerializable(entry.state),
      menuRestorePath: makeSerializable(entry.menuRestorePath),
    });
  }

  private shouldRewindBrowserHistoryAfterRestore(snapshot: AppSnapshot) {
    if (!this.supportsBrowserHistory() || typeof window === 'undefined') {
      return false;
    }

    const browserSnapshot = window.history.state?.snapshot;
    if (!browserSnapshot || !isValidSnapshot(browserSnapshot)) {
      return false;
    }

    const restoredActive = snapshot.stack[snapshot.stack.length - 1];
    const browserActive = browserSnapshot.stack[browserSnapshot.stack.length - 1];
    if (!restoredActive || !browserActive) {
      return false;
    }

    if (restoredActive.type !== 'collection' || browserActive.type !== 'collection') {
      return false;
    }

    if ((restoredActive.key || '') !== (browserActive.key || '')) {
      return false;
    }

    if (browserActive.mode !== 'edit' && browserActive.mode !== 'display') {
      return false;
    }

    const restoredState = restoredActive.state as any;
    const browserState = browserActive.state as any;

    if (restoredState?.restoreMode !== 'shallow') {
      return false;
    }

    if (browserState?.currentObject !== 'report') {
      return false;
    }

    return true;
  }

  private rewindBrowserHistorySilently() {
    if (!this.supportsBrowserHistory() || typeof window === 'undefined') {
      return false;
    }

    this.ignoreNextPopState = true;
    window.history.back();
    return true;
  }

  private async syncNavigationPersistence() {
    if (!this.supportsPersistence() || this.restoringNavigation) {
      return;
    }

    const adapter = await this.ensureNavigationPersistence();
    const snapshot = this.createSnapshot(false);
    if (snapshot.stack.length === 0) {
      await adapter.clear();
      return;
    }

    await adapter.save(snapshot);
  }

  async syncCurrentNavigationState(options?: { replaceHistory?: boolean; skipHistory?: boolean }) {
    if (!this.navigationEnabled()) {
      this.syncStackRefs();
      return;
    }

    for (const entry of this.stack) {
      if (entry.navigation) {
        entry.navigation = await this.buildNavigationEntry(entry.navigation.type, entry.item, entry.params, entry.navigation);
      }
    }

    this.syncStackRefs();
    await this.syncNavigationPersistence();

    if (options && !options.skipHistory) {
      this.syncBrowserHistory(options?.replaceHistory);
    }
  }

  private syncBrowserHistory(replace?: boolean) {
    if (!this.supportsBrowserHistory() || this.restoringNavigation) {
      return;
    }

    const state = this.createBrowserState();
    try {
      if (replace) {
        window.history.replaceState(state, '', window.location.href);
      } else {
        window.history.pushState(state, '', window.location.href);
      }
    } catch (_error) {
      //
    }
  }

  private async afterStackChanged(options?: { replaceHistory?: boolean; skipHistory?: boolean }) {
    this.syncStackRefs();
    if (this.navigationEnabled()) {
      await this.syncNavigationPersistence();
    }

    if (!options?.skipHistory) {
      this.syncBrowserHistory(options?.replaceHistory);
    }
  }

  private buildNavigationTitle(item: UIBase, params?: AppScreenParams) {
    return params?.navigationTitle
      ? this.$text(params.navigationTitle)
      : this.$text((item as any)?.$params?.title || (item as any)?.$params?.text || '');
  }

  private async buildNavigationEntry(type: NavigationScreenType, item: UIBase, params?: AppScreenParams, existingEntry?: NavigationEntry) {
    if (!this.navigationEnabled()) {
      return undefined;
    }

    const entry = await AppManager.buildNavigationEntry(type, item, {
      ...(params || {}),
      navigationTitle: this.buildNavigationTitle(item, params),
      navigationParams: params?.navigationParams,
      navigationState: params?.navigationState,
      navigationMenuRestorePath: params?.navigationMenuRestorePath,
      persistState: params?.persistState,
      excludeFromRestore: params?.excludeFromRestore,
      navigationKey: params?.navigationKey,
      mode: (item as any)?.$params?.mode,
    }, existingEntry);

    if (!entry.id) {
      entry.id = createNavigationId();
    }

    AppManager.cacheNavigationItem(entry.id, item);
    return entry;
  }

  private async rebuildStackFromEntries(entries: NavigationEntry[]) {
    const nextStack: AppStackItem[] = [];

    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      let item = await AppManager.resolveNavigationEntry(entry);
      const previousStackItem = nextStack[nextStack.length - 1];

      if (!item && entry.type === 'menu' && previousStackItem?.item instanceof Menu && entry.menuRestorePath?.length) {
        const replayStep = entry.menuRestorePath[entry.menuRestorePath.length - 1];
        const preparedReplay = await prepareMenuReplayTarget(previousStackItem.item, replayStep);
        if (preparedReplay?.target) {
          const replayParams: AppScreenParams = {
            ...(preparedReplay.params || {}),
            ...(entry.params || {}),
            navigationKey: entry.key,
            navigationType: entry.type,
            navigationTitle: entry.title,
            navigationParams: entry.params,
            navigationState: entry.state,
            navigationMenuRestorePath: entry.menuRestorePath,
            persistState: entry.persistState,
            excludeFromRestore: entry.excludeFromRestore,
            navigation: {
              ...((preparedReplay.params || {}).navigation || {}),
              key: entry.key,
              type: entry.type,
              title: entry.title,
              params: entry.params,
              state: entry.state,
              menuRestorePath: entry.menuRestorePath,
              persist: entry.persistState,
              excludeFromRestore: entry.excludeFromRestore,
            },
          };
          const replayResolved = await AppManager.prepareScreenTarget('menu', preparedReplay.target, replayParams);
          item = replayResolved.item;
          if (item && typeof (item as any)?.access === 'function') {
            const allowed = await (item as any).access();
            if (!allowed) {
              item = undefined;
            }
          }
          if (item && preparedReplay.mode && (item as any)?.$params) {
            (item as any).$params.mode = preparedReplay.mode;
          }
        }
      }

      if (!item && index === 0 && entry.type === 'menu') {
        item = await this.menu();
      }
      if (!item) {
        return false;
      }

      if (item instanceof Menu && previousStackItem?.item instanceof Menu) {
        item.setParent(previousStackItem.item);
      }
      if (item instanceof Menu) {
        item.setReplayPath(entry.menuRestorePath || []);
      }

      nextStack.push({
        type: entry.type === 'dashboard' ? 'ui' : (entry.type as AppStackItem['type']),
        item,
        params: {
          ...(entry.params || {}),
          navigationKey: entry.key,
          navigationTitle: entry.title,
          navigationParams: entry.params,
          navigationState: entry.state,
          navigationMenuRestorePath: entry.menuRestorePath,
          persistState: entry.persistState,
          excludeFromRestore: entry.excludeFromRestore,
        },
        navigation: entry,
      });
    }

    this.stack.forEach((entry) => entry.item.removeEventListeners());
    this.stack = nextStack;
    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.syncNavigationPersistence();
    return true;
  }

  private async restoreFromSnapshot(snapshot?: AppSnapshot) {
    if (!snapshot || !isValidSnapshot(snapshot) || snapshot.stack.length === 0) {
      return false;
    }

    this.restoringNavigation = true;
    try {
      const restored = await this.rebuildStackFromEntries(snapshot.stack);
      return restored;
    } finally {
      this.restoringNavigation = false;
    }
  }

  private async restorePersistedNavigation() {
    if (!this.supportsPersistence() || this.navigationOptions.restoreOnLoad === false) {
      return false;
    }

    const adapter = await this.ensureNavigationPersistence();
    const snapshot = await adapter.load();
    const restored = await this.restoreFromSnapshot(snapshot);
    if (restored && snapshot && this.shouldRewindBrowserHistoryAfterRestore(snapshot)) {
      this.rewindBrowserHistorySilently();
    }
    return restored;
  }

  private async onPopState(ev: PopStateEvent) {
    if (this.ignoreNextPopState) {
      this.ignoreNextPopState = false;
      return;
    }

    const snapshot = ev.state?.snapshot;
    if (!snapshot || !isValidSnapshot(snapshot)) {
      if (this.pendingManagedBackToken) {
        await this.runPendingManagedBackFallback();
      }
      return;
    }

    this.clearPendingManagedBack();
    await this.restoreFromSnapshot(snapshot);
  }

  private clearPendingManagedBack() {
    this.pendingManagedBackToken = undefined;
    this.pendingManagedBackFallback = undefined;
    if (this.pendingManagedBackTimer) {
      clearTimeout(this.pendingManagedBackTimer);
      this.pendingManagedBackTimer = undefined;
    }
  }

  private async runPendingManagedBackFallback() {
    const fallback = this.pendingManagedBackFallback;
    this.clearPendingManagedBack();
    if (fallback) {
      await fallback();
    }
  }

  private async requestManagedHistoryBack(fallback: () => Promise<void> | void) {
    if (!this.supportsBrowserHistory() || typeof window === 'undefined') {
      await fallback();
      return;
    }

    this.clearPendingManagedBack();
    const token = Symbol('managed-back');
    this.pendingManagedBackToken = token;
    this.pendingManagedBackFallback = fallback;
    this.pendingManagedBackTimer = setTimeout(() => {
      if (this.pendingManagedBackToken === token) {
        void this.runPendingManagedBackFallback();
      }
    }, 150);

    window.history.back();
  }

  private async popCurrentStackItemLocally(item?: UIBase) {
    const target = item || this.getActiveStackItem()?.item;
    if (!target) {
      return;
    }

    const ui = this.stack.find((inst) => inst.item.$id === target.$id);
    if (!ui) {
      return;
    }

    const index = this.stack.indexOf(ui);
    if (index < 0) {
      return;
    }

    this.stack.splice(index, 1);
    ui.item.clearListeners(this.$id);
    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.afterStackChanged({ replaceHistory: true, skipHistory: true });
  }

  props() {
    return []
  }

  async menu(): Promise<Menu|undefined> {
    if (this.options.menu) {
      return await this.options.menu(this);
    }
  }

  async home(): Promise<AppHomeTarget | undefined> {
    if (this.options.home) {
      return await this.options.home(this);
    }
  }

  private async emitLifecycleEvent(name: AppLifecycleEventName) {
    const callback = this.options[name];
    if (typeof callback === 'function') {
      await callback(this);
    }

    this.emit(name, this);
    AppManager.emit(name, this);
  }

  private async showHomeTarget(target: AppHomeTarget, replaceHistory: boolean = true) {
    if (target.type === 'menu') {
      await this.$showMenu(target.target, target.params, replaceHistory);
      return;
    }

    if (target.type === 'report') {
      await this.$showReport(target.target, target.params, false);
      if (replaceHistory) {
        await this.syncCurrentNavigationState({ replaceHistory: true });
      }
      return;
    }

    if (target.type === 'collection') {
      await this.$showCollection(target.target, target.params, false);
      if (replaceHistory) {
        await this.syncCurrentNavigationState({ replaceHistory: true });
      }
      return;
    }

    if (target.type === 'trigger') {
      await this.$showTrigger(target.target, target.params, false);
      if (replaceHistory) {
        await this.syncCurrentNavigationState({ replaceHistory: true });
      }
      return;
    }

    await this.$showUI(target.target, target.params, false);
    if (replaceHistory) {
      await this.syncCurrentNavigationState({ replaceHistory: true });
    }
  }

  render(props: any, context: any): VNode| VNode[] |undefined {
    const h = this.$h;

    if (!this.loaded.value) {
      this.loadApp();
      return undefined;
    }

    const content = this.renderStackContent();
    const header = this.renderShellRegion('header');
    const footer = this.renderShellRegion('footer');
    const headerBar = this.renderShellBar('header');
    const footerBar = this.renderShellBar('footer');
    const showHeader = this.params.value.showHeader || !!headerBar || !!header;
    const showFooter = this.params.value.showFooter || !!footerBar || !!footer;
    const hideSideNavs = this.shouldHideSideNavsForActiveItem();
    const sideNavDrawers = hideSideNavs
      ? []
      : (['left', 'right'] as AppSideNavSide[])
          .map((side) => this.renderSideNavDrawer(side))
          .filter((drawer): drawer is VNode => !!drawer);

    if (!showHeader && !showFooter && sideNavDrawers.length === 0) {
      return this.wrapWithFab(content, showFooter);
    }

    return h(
      VApp,
      {
        class: ['vuetify-extended-app-shell'],
      },
      () => [
        ...(showHeader ? [
          h(
            VAppBar,
            {
              elevation: 2,
              density: 'comfortable',
            },
            () => h(
              'div',
              {
                style: {
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  boxSizing: 'border-box',
                },
              },
              [headerBar || header || h(VAppBarTitle, {}, () => this.$text(this.params.value.title, this.$uiText('ve.app.title', 'Application')))]
            )
          ),
        ] : []),
        h(
          VMain,
          {
            class: ['vuetify-extended-app-main'],
            style: this.mainShellStyle(),
          },
          () => h(
            'div',
            {
              style: this.mainShellContentStyle(showFooter),
            },
            [
              ...(this.params.value.backgroundOverlay ? [
                h('div', { style: this.mainShellOverlayStyle() })
              ] : []),
              h(
                'div',
                {
                  style: {
                    position: 'relative',
                    zIndex: 1,
                    minHeight: '100%',
                  },
                },
                this.wrapWithFab(content, showFooter) as any
              ),
            ]
          )
        ),
        ...(showFooter ? [
          h(
            VFooter,
            {
              app: true,
              elevation: 2,
              class: ['px-4', 'py-2'],
              ref: (el: Element | any) => this.setFooterElement(el),
            },
            () => footerBar || footer || ''
          ),
        ] : []),
        ...sideNavDrawers
      ]
    );
  }

  private renderStackContent(): VNode | VNode[] | undefined {
    const h = this.$h;

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      const item = this.stack[this.index.value].item;
      const itemNode = this.wrapStackItemContent(item, h(item.component));
      if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
        return [
          itemNode,
          ...this.selectors.map((s) => h(s.component)),
          ...this.dialogs.map((d) => h(d.component))
        ];
      }
      return itemNode;
    }

    if (this.selectorCount.value > 0 || this.dialogCount.value > 0) {
      return [
        ...this.selectors.map((s) => h(s.component)),
        ...this.dialogs.map((d) => h(d.component))
      ];
    }

    return undefined;
  }

  private wrapStackItemContent(item: UIBase, node: VNode) {
    const h = this.$h;

    if (item instanceof Menu) {
      return h('div', {
        style: {
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        },
      }, [node]);
    }

    return node;
  }

  private wrapWithFab(content: VNode | VNode[] | undefined, showFooter: boolean = false) {
    const h = this.$h;
    const fab = this.renderFabActions(showFooter);
    const leftNavToggle = this.renderTemporarySideNavToggle('left');
    const rightNavToggle = this.renderTemporaryRightNavToggle();
    if (!fab) {
      if (!leftNavToggle && !rightNavToggle) {
        return content;
      }

      const nodes = Array.isArray(content) ? content : (content ? [content] : []);
      return [
        ...nodes,
        ...(leftNavToggle ? [leftNavToggle] : []),
        ...(rightNavToggle ? [rightNavToggle] : []),
      ];
    }

    const nodes = Array.isArray(content) ? content : (content ? [content] : []);
    return [
      ...nodes,
      fab,
      ...(leftNavToggle ? [leftNavToggle] : []),
      ...(rightNavToggle ? [rightNavToggle] : []),
    ];
  }

  private getActiveStackItem(): AppStackItem | undefined {
    if (this.index.value < 0 || this.index.value >= this.stack.length) {
      return undefined;
    }
    return this.stack[this.index.value];
  }

  private resolveActiveScreenConfig(active: AppStackItem | undefined = this.getActiveStackItem()) {
    const itemParams = ((active?.item as any)?.$params || {}) as Record<string, any>;
    const itemScreen = ((active?.item as any)?.$screenParams || (active?.item as any)?.$appScreenParams || {}) as AppScreenParams;
    const baseScreen: AppScreenParams = {};

    if (typeof itemParams.hideSideNavs === 'boolean') {
      baseScreen.hideSideNavs = itemParams.hideSideNavs;
    }

    return {
      ...itemScreen,
      ...baseScreen,
      ...(active?.params || {}),
    } as AppScreenParams;
  }

  private shouldHideSideNavsForActiveItem() {
    return this.resolveActiveScreenConfig().hideSideNavs === true;
  }

  private resolveFabConfig() {
    const active = this.getActiveStackItem();
    const screen = this.resolveActiveScreenConfig(active);
    return {
      showFab: screen.showFab ?? this.params.value.showFab,
      fabIcon: screen.fabIcon ?? this.params.value.fabIcon,
      fabColor: screen.fabColor ?? this.params.value.fabColor,
      fabPosition: screen.fabPosition ?? this.params.value.fabPosition,
      fabDirection: screen.fabDirection ?? this.params.value.fabDirection,
      fabLabel: screen.fabLabel ?? this.params.value.fabLabel,
      fabShortcut: screen.fabShortcut ?? this.params.value.fabShortcut,
      fabButtons: screen.fabButtons ?? this.options.fabButtons,
      active,
    };
  }

  private resolveFabButtonSource(source: AppFabButtonsFactory | undefined, active?: AppStackItem) {
    if (!source) {
      return [];
    }

    if (typeof source === 'function') {
      return source(this, active?.item, active) || [];
    }

    return source || [];
  }

  private buildFabButtons() {
    this.fabButtonInstances.forEach((instance) => instance.removeEventListeners());
    const config = this.resolveFabConfig();
    this.fabButtonInstances = this.resolveFabButtonSource(config.fabButtons, config.active);
    this.fabButtonInstances.forEach((instance) => instance.setParent(this));
    return {
      buttons: this.fabButtonInstances.filter((instance) => !instance.$params.invisible),
      config,
    };
  }

  private renderFabActions(showFooter: boolean = false) {
    const { buttons, config } = this.buildFabButtons();
    if (!config.showFab || buttons.length === 0) {
      return undefined;
    }

    const h = this.$h;
    const right = config.fabPosition !== 'bottom-left';
    const location = right ? 'top end' : 'top start';

    return h('div', {
      style: {
        position: 'fixed',
        right: right ? '24px' : undefined,
        left: right ? undefined : '24px',
        bottom: showFooter ? `${this.footerHeight.value + 24}px` : '24px',
        zIndex: 1200,
      },
    }, [
      h(VMenu, {
        modelValue: this.fabOpen.value,
        'onUpdate:modelValue': (value: boolean) => { this.fabOpen.value = value; },
        location,
        offset: 12,
        closeOnContentClick: true,
      }, {
        activator: ({ props: activatorProps }: any) => h(VBtn, {
          ...activatorProps,
          color: config.fabColor,
          icon: config.fabIcon,
          size: 'large',
          elevation: 8,
          title: this.$text(config.fabLabel),
          'aria-label': this.$text(config.fabLabel),
          style: {
            borderRadius: '999px',
          },
        }),
        default: () => h(VCard, {
          elevation: 8,
          style: {
            width: 'min(calc(100vw - 32px), 280px)',
            maxWidth: 'calc(100vw - 32px)',
          },
        }, () => h(VCardText, {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
          },
        }, () => buttons.map((button) => h('div', { style: { display: 'flex', width: '100%' } }, [h(button.component, { style: { width: '100%' } })])))),
      }),
    ]);
  }

  private shouldShowTemporarySideNavToggle(side: AppSideNavSide) {
    const options = this.getSideNavOptions(side);
    if (this.shouldHideSideNavsForActiveItem()) {
      return false;
    }

    if (!this.shouldRenderSideNav(side)) {
      return false;
    }

    if (!this.isSideNavTemporary(side)) {
      return false;
    }

    if (options.showToggleButton === false) {
      return false;
    }

    if (this.sideNavMenuRef(side).value) {
      return true;
    }

    return side === 'left' ? !!this.options.leftNav : !!this.options.rightNav;
  }

  private renderTemporarySideNavToggle(side: AppSideNavSide) {
    if (!this.shouldShowTemporarySideNavToggle(side)) {
      return undefined;
    }

    const options = this.getSideNavOptions(side);
    const h = this.$h;
    const tooltip = this.$text(
      options.toggleTooltip,
      this.$uiText(
        side === 'left' ? 've.app.openLeftNav' : 've.app.openRightNav',
        side === 'left' ? 'Open navigation panel' : 'Open tools panel',
      ),
    );
    const onClick = side === 'left'
      ? () => { void this.$toggleLeftMenu(); }
      : () => { void this.$toggleRightMenu(); };

    return h('div', {
      style: {
        position: 'fixed',
        top: 'calc(var(--v-layout-top, 0px) + 16px)',
        left: side === 'left' ? '24px' : undefined,
        right: side === 'right' ? '24px' : undefined,
        zIndex: 1195,
      },
    }, [
      h(VBtn, {
        icon: options.toggleIcon || (side === 'left' ? 'mdi-menu' : 'mdi-tune'),
        color: options.toggleColor || 'primary',
        variant: options.toggleVariant || 'elevated',
        elevation: 8,
        size: 'default',
        title: tooltip,
        'aria-label': tooltip,
        onClick,
        style: {
          borderRadius: '999px',
        },
      } as any),
    ]);
  }

  private renderTemporaryRightNavToggle() {
    return this.renderTemporarySideNavToggle('right');
  }

  private triggerComponentShortcut(target: any, ev: KeyboardEvent) {
    if (!target) {
      return false;
    }

    if (typeof target.triggerButtonShortcut === 'function') {
      return !!target.triggerButtonShortcut(ev);
    }

    return false;
  }

  private triggerActiveScreenShortcut(ev: KeyboardEvent) {
    const activeItem = this.getActiveStackItem()?.item as any;
    const currentForm = activeItem?.currentForm;

    if (this.triggerComponentShortcut(currentForm, ev)) {
      return true;
    }

    if (ev.defaultPrevented) {
      return true;
    }

    if (this.triggerComponentShortcut(activeItem, ev)) {
      return true;
    }

    return ev.defaultPrevented;
  }

  private triggerFabButtonShortcut(ev: KeyboardEvent) {
    if (!this.fabOpen.value || ev.repeat) {
      return false;
    }

    const { buttons } = this.buildFabButtons();
    for (const button of buttons) {
      if (button.$params.disabled || button.$readonly) {
        continue;
      }

      const eventShortcut = normalizeButtonShortcutFromEvent(ev, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
      if (!eventShortcut) {
        continue;
      }

      const shortcut = normalizeButtonShortcut(button.$params.shortcut, { cmdForCtrlOnMac: button.$params.cmdForCtrlOnMac });
      if (!shortcut || shortcut !== eventShortcut) {
        continue;
      }

      ev.preventDefault();
      this.fabOpen.value = false;
      button.triggerShortcut();
      return true;
    }

    return false;
  }

  private triggerFabShortcut(ev: KeyboardEvent) {
    if (ev.repeat) {
      return false;
    }

    const config = this.resolveFabConfig();
    if (!config.showFab) {
      return false;
    }

    const eventShortcut = normalizeButtonShortcutFromEvent(ev);
    if (!eventShortcut) {
      return false;
    }

    const shortcut = normalizeButtonShortcut(config.fabShortcut);
    if (!shortcut || shortcut !== eventShortcut) {
      return false;
    }

    ev.preventDefault();
    this.fabOpen.value = !this.fabOpen.value;
    return true;
  }

  private onAppKeydown(ev: KeyboardEvent) {
    if (ev.defaultPrevented || Dialogs.hasBlockingDialog()) {
      return;
    }

    if (this.triggerActiveScreenShortcut(ev)) {
      return;
    }

    if (ev.defaultPrevented) {
      return;
    }

    if (this.triggerFabButtonShortcut(ev)) {
      return;
    }

    this.triggerFabShortcut(ev);
  }

  private renderShellRegion(region: 'header' | 'footer'): VNode | VNode[] | undefined {
    const render = region === 'header' ? this.options.header : this.options.footer;
    if (!render) {
      return undefined;
    }

    const content = render(this);
    return this.normalizeShellContent(content);
  }

  private renderShellBar(region: 'header' | 'footer'): VNode | undefined {
    const start = this.renderShellBarSection(region, 'Start');
    const center = this.renderShellBarSection(region, 'Center');
    const end = this.renderShellBarSection(region, 'End');

    if (!start && !center && !end) {
      return undefined;
    }

    const h = this.$h;
    const layout = this.getResolvedShellLayout(region);

    return h('div', {
      style: this.getShellBarContainerStyle(region, layout),
    }, [
      h('div', { style: this.getShellBarSectionStyle(region, 'Start', layout) }, start ? (Array.isArray(start) ? start : [start]) : []),
      h('div', { style: this.getShellBarSectionStyle(region, 'Center', layout) }, center ? (Array.isArray(center) ? center : [center]) : []),
      h('div', { style: this.getShellBarSectionStyle(region, 'End', layout) }, end ? (Array.isArray(end) ? end : [end]) : []),
    ]);
  }

  private renderShellBarSection(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End'): VNode | VNode[] | undefined {
    if (this.compactShellLayout.value && region === 'header' && section === 'Start') {
      return this.renderMobileHeaderBrand();
    }

    if (this.compactShellLayout.value && region === 'header' && section === 'Center') {
      return undefined;
    }

    const items = this.compactShellLayout.value && region === 'header' && section === 'End'
      ? this.getCompactHeaderActionItems()
      : this.getShellBarSectionItems(region, section);
    if (items.length === 0) {
      return undefined;
    }

    const responsive = this.renderCompactShellOverflow(region, section, items);
    if (responsive) {
      return responsive;
    }

    return this.normalizeShellContent(items);
  }

  private getShellBarSectionItems(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End'): AppShellContent[] {
    const key = `${region}${section}` as keyof AppOptions;
    const render = this.options[key] as ((app: AppMain) => AppShellContent | AppShellContent[]) | undefined;
    if (!render) {
      return [];
    }

    const content = render(this);
    return Array.isArray(content) ? content : [content];
  }

  private getCompactHeaderActionItems(): AppShellContent[] {
    return [
      ...this.getShellBarSectionItems('header', 'Start'),
      ...this.getShellBarSectionItems('header', 'Center'),
      ...this.getShellBarSectionItems('header', 'End'),
    ];
  }

  private getShellLayout(region: 'header' | 'footer') {
    return (region === 'header' ? this.params.value.headerLayout : this.params.value.footerLayout) || 'balanced';
  }

  private getResolvedShellLayout(region: 'header' | 'footer') {
    const layout = this.getShellLayout(region);
    if (this.compactShellLayout.value && layout !== 'stacked') {
      if (region === 'header') {
        return 'auto' as const;
      }
      return 'stacked' as const;
    }
    return layout;
  }

  private getShellWidthValue(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End') {
    const key = `${region}${section}Width` as keyof AppParams;
    return this.params.value[key] as string | number | undefined;
  }

  private normalizeCssSize(value?: string | number) {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    return typeof value === 'number' ? `${value}px` : value;
  }

  private getShellBarContainerStyle(region: 'header' | 'footer', layout: 'balanced'|'auto'|'stacked') {
    if (layout === 'stacked') {
      return {
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: '10px',
      };
    }

    const startWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Start')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');
    const centerWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'Center')) || 'auto';
    const endWidth = this.normalizeCssSize(this.getShellWidthValue(region, 'End')) || (layout === 'auto' ? 'auto' : 'minmax(0, 1fr)');

    return {
      width: '100%',
      minHeight: '100%',
      display: 'grid',
      gridTemplateColumns: `${startWidth} ${centerWidth} ${endWidth}`,
      alignItems: 'center',
      gap: '16px',
    };
  }

  private getShellBarSectionStyle(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End', layout: 'balanced'|'auto'|'stacked') {
    const justifyContent = section === 'Start' ? 'flex-start' : section === 'Center' ? 'center' : 'flex-end';
    const width = this.normalizeCssSize(this.getShellWidthValue(region, section));
    const compactHeaderSection = this.compactShellLayout.value && region === 'header';

    return {
      minWidth: 0,
      width: layout === 'stacked' ? '100%' : width,
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent,
      gap: '12px',
      flexWrap: compactHeaderSection ? 'nowrap' : 'wrap',
    };
  }

  private mainShellStyle() {
    const image = this.params.value.backgroundImage;
    const gradient = this.params.value.backgroundGradient;
    const backgroundImage = [gradient, image ? `url(${image})` : undefined].filter(Boolean).join(', ');

    return {
      backgroundColor: this.params.value.backgroundColor,
      backgroundImage: backgroundImage || undefined,
      backgroundSize: this.params.value.backgroundSize || (image ? 'cover' : undefined),
      backgroundPosition: this.params.value.backgroundPosition || (image ? 'center center' : undefined),
      backgroundRepeat: this.params.value.backgroundRepeat || (image ? 'no-repeat' : undefined),
      backgroundAttachment: this.params.value.backgroundAttachment,
    };
  }

  private mainShellContentStyle(showFooter: boolean) {
    const activeItem = this.getActiveStackItem()?.item;
    const reserveFooterSpace = showFooter && !(activeItem instanceof Menu);

    return {
      position: 'relative',
      minHeight: '100%',
      paddingBottom: reserveFooterSpace ? '72px' : undefined,
      boxSizing: 'border-box',
    };
  }

  private mainShellOverlayStyle() {
    return {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: this.params.value.backgroundOverlay,
      zIndex: 0,
    };
  }

  private normalizeShellContent(content: AppShellContent | AppShellContent[]): VNode | VNode[] | undefined {
    const items = Array.isArray(content) ? content : [content];
    const rendered = items
      .map((item) => this.normalizeShellItem(item))
      .filter((item): item is VNode => !!item);

    if (rendered.length === 0) {
      return undefined;
    }

    return rendered.length === 1 ? rendered[0] : rendered;
  }

  private renderMobileHeaderBrand() {
    if (!this.compactShellLayout.value) {
      return undefined;
    }

    const title = this.$text(this.params.value.mobileTitle || this.params.value.title, this.$uiText('ve.app.title', 'Application'));
    const logo = this.params.value.mobileLogo;
    const h = this.$h;

    return h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: 0,
        height: '100%',
      },
    }, [
      ...(logo ? [h('img', {
        src: logo,
        alt: title,
        style: {
          width: '28px',
          height: '28px',
          objectFit: 'contain',
          flexShrink: 0,
          borderRadius: '8px',
        },
      })] : []),
      h('div', {
        style: {
          minWidth: 0,
          fontSize: '0.95rem',
          fontWeight: '700',
          lineHeight: '1.2',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      }, title),
    ]);
  }

  private renderCompactShellOverflow(region: 'header' | 'footer', section: 'Start' | 'Center' | 'End', items: AppShellContent[]) {
    if (!this.compactShellLayout.value || region !== 'header' || section !== 'End') {
      return undefined;
    }

    const entries = items
      .map((item, index) => ({
        index,
        item,
        node: this.normalizeShellItem(item),
        priority: this.mobileShellPriority(item),
      }))
      .filter((entry): entry is { index: number; item: AppShellContent; node: VNode; priority: number } => !!entry.node);

    if (entries.length === 0) {
      return undefined;
    }

    const visible = entries
      .filter((entry) => this.resolveMobileShellLocation(entry.item) === 'header')
      .sort((a, b) => a.index - b.index);
    const visibleIndexes = new Set(visible.map((entry) => entry.index));
    const overflow = entries.filter((entry) => !visibleIndexes.has(entry.index)).sort((a, b) => a.index - b.index);

    const h = this.$h;
    return h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '8px',
        width: '100%',
        height: '100%',
        minWidth: 0,
      },
    }, [
      ...visible.map((entry) => h('div', {
        style: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }, [entry.node])),
      ...(overflow.length > 0 ? [h('div', {
        style: {
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }, [h(VBtn, {
        icon: 'mdi-menu',
        variant: 'text',
        size: 'default',
        title: this.$uiText('ve.app.openHeaderMenu', 'Open header menu'),
        'aria-label': this.$uiText('ve.app.openHeaderMenu', 'Open header menu'),
        style: {
          height: '40px',
          width: '40px',
          minWidth: '40px',
        },
        onClick: () => {
          this.mobileHeaderDrawerOpen.value = true;
        },
      })])] : []),
    ]);
  }

  private resolveMobileShellLocation(item: AppShellContent): 'header' | 'drawer' {
    if (item instanceof UIBase) {
      const params = (item as any).$params || {};
      if (params.mobileLocation === 'header' || params.mobileLocation === 'drawer') {
        return params.mobileLocation;
      }
    }

    return this.mobileShellPriority(item) >= 90 ? 'header' : 'drawer';
  }

  private mobileShellPriority(item: AppShellContent) {
    if (item instanceof UIBase) {
      const type = item.constructor?.name;
      if (type === 'UserArea') return 100;
      if (type === 'MailboxBell') return 90;
      if (type === 'ShellIconAction') return 70;
      if (type === 'StatusBadge') return 30;
      if (type === 'EnvironmentTag') return 20;
      if (type === 'AppTitleBlock') return 10;
      return 50;
    }

    if (typeof item === 'string' || typeof item === 'number') {
      return 10;
    }

    return 40;
  }

  private shouldHideShellItem(item: AppShellContent) {
    if (!(item instanceof UIBase)) {
      return false;
    }

    const params = (item as any).$params || {};
    if (this.compactShellLayout.value && params.hideOnMobile) {
      return true;
    }

    if (!this.compactShellLayout.value && params.hideOnNonMobile) {
      return true;
    }

    return false;
  }

  private renderCompactHeaderDrawer(showHeader: boolean) {
    if (!showHeader || !this.compactShellLayout.value) {
      return undefined;
    }

    const sections = (['Start', 'Center', 'End'] as const)
      .map((section) => this.getShellBarSectionItems('header', section)
        .filter((item) => this.resolveMobileShellLocation(item) === 'drawer')
        .map((item) => this.normalizeShellItem(item))
        .filter((item): item is VNode => !!item))
      .filter((items) => items.length > 0);

    if (sections.length === 0) {
      return undefined;
    }

    const h = this.$h;
    const sectionNodes: VNode[] = [];
    sections.forEach((nodes: VNode[], index: number) => {
      if (index > 0) {
        sectionNodes.push(h(VDivider));
      }

      sectionNodes.push(h('div', {
        style: {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minWidth: 0,
        },
      }, nodes.map((node: VNode) => h('div', {
        style: {
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          minWidth: 0,
        },
      }, [node]))));
    });

    return h(VNavigationDrawer, {
      modelValue: this.mobileHeaderDrawerOpen.value,
      'onUpdate:modelValue': (value: boolean) => {
        this.mobileHeaderDrawerOpen.value = value;
      },
      location: 'right',
      temporary: true,
      width: 320,
      scrim: true,
    }, () => h('div', {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
    }, [
      h('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          gap: '12px',
        },
      }, [
        h('div', {
          style: {
            fontSize: '1rem',
            fontWeight: '700',
          },
        }, this.$uiText('ve.app.headerMenu', 'Header Menu')),
        h(VBtn, {
          icon: 'mdi-close',
          variant: 'text',
          size: 'small',
          'aria-label': this.$uiText('ve.app.closeHeaderMenu', 'Close header menu'),
          onClick: () => {
            this.mobileHeaderDrawerOpen.value = false;
          },
        }),
      ]),
      h(VDivider),
      h(VCardText, {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          padding: '16px',
        },
      }, () => sectionNodes),
    ]));
  }

  private normalizeShellItem(item: AppShellContent): VNode | undefined {
    const h = this.$h;

    if (item === null || item === undefined || item === false) {
      return undefined;
    }

    if (this.shouldHideShellItem(item)) {
      return undefined;
    }

    if (item instanceof UIBase) {
      return h(item.component);
    }

    if (isVNode(item)) {
      return item;
    }

    return h('span', {}, String(item));
  }

  private renderSideNavDrawer(side: AppSideNavSide) {
    const menu = this.sideNavMenuRef(side).value;
    if (!menu) {
      return undefined;
    }

    const options = this.getSideNavOptions(side);
    const mobile = this.isSideNavMobile(side);
    const temporary = this.isSideNavTemporary(side);
    const permanent = !temporary;
    const rail = !temporary && (mobile ? options.mobileMode === 'rail' : options.mode === 'rail');
    const width = typeof options.width === 'number'
      ? options.width
      : options.width !== undefined && options.width !== null && options.width !== ''
        ? options.width
        : (side === 'left' ? 320 : 340);
    const h = this.$h;

    return h(
      VNavigationDrawer,
      {
        modelValue: this.sideNavOpenRef(side).value,
        'onUpdate:modelValue': (value: boolean) => {
          this.setSideNavOpen(side, value);
        },
        location: side,
        temporary,
        permanent,
        rail,
        width,
        scrim: temporary || options.overlay === true,
        app: true,
      } as any,
      () => h(
        'div',
        {
          style: {
            height: '100%',
            minHeight: 0,
          },
        },
        [h(menu.component, {
          key: `${side}-${String(menu.$id)}`,
          sideNavShowCloseButton: temporary,
          sideNavSubmenuMode: options.submenuMode || 'screen',
          sideNavAccordion: options.accordion === true,
          sideNavCloseTooltip: this.$uiText(
            side === 'left' ? 've.app.closeLeftNav' : 've.app.closeRightNav',
            side === 'left' ? 'Close navigation panel' : 'Close tools panel',
          ),
          sideNavOnClose: () => {
            this.setSideNavOpen(side, false);
          },
        })],
      ),
    );
  }

  private async activateCurrentItem(index: number = this.index.value) {
    this.syncStackRefs();
    this.fabOpen.value = false;
    this.mobileHeaderDrawerOpen.value = false;
    this.closeTemporarySideNavsOnNavigate();
    if (index < 0 || index >= this.stack.length) {
      await this.refreshSideMenus();
      return;
    }

    if (index > 0 && this.stack.length > 0) {
      this.stack[index-1].item.clearListeners(this.$id);
    }

    if (index < this.stack.length) {
      this.stack[index].item.clearListeners(this.$id);
      this.stack[index].item.on('cancel', (item: any) => this.onCancel(item), this.$id);
      this.stack[index].item.on('finished', (item: any) => this.onCancel(item), this.$id);
      this.stack[index].item.on('right-menu-changed', () => {
        void this.$refreshRightMenu();
      }, this.$id);
      await this.stack[index].item.show();
    }

    await this.refreshSideMenus();
  }

  async $reload() {
    await this.loadApp(false);
  }

  async $goBackWithFallback(fallback: () => Promise<void> | void) {
    await this.requestManagedHistoryBack(fallback);
  }

  $backBrowserHistorySilently() {
    if (!this.supportsBrowserHistory() || typeof window === 'undefined') {
      return false;
    }

    this.ignoreNextPopState = true;
    window.history.back();
    return true;
  }

  private async loadApp(preferRestore: boolean = true) {
    await this.emitLifecycleEvent('beforeLoad');
    this.fabOpen.value = false;
    this.mobileHeaderDrawerOpen.value = false;
    this.leftSideMenu.value = undefined;
    this.rightSideMenu.value = undefined;
    this.leftSideMenuOpen.value = false;
    this.rightSideMenuOpen.value = false;
    this.leftSideMenuSource = undefined;
    this.rightSideMenuSource = undefined;
    this.leftSideMenuState = undefined;
    this.rightSideMenuState = undefined;
    this.leftSideMenuTouched = false;
    this.rightSideMenuTouched = false;
    this.leftSideMenuRuntime = undefined;
    this.rightSideMenuRuntime = undefined;
    this.leftSideMenuRuntimeRevision = 0;
    this.rightSideMenuRuntimeRevision = 0;
    this.leftSideMenuSuppressedToken = undefined;
    this.rightSideMenuSuppressedToken = undefined;
    Dialogs.$showProgress({})
    try {
      const menu = await this.menu();
      const home = await this.home();

      this.stack.forEach((entry) => {
        entry.item.removeEventListeners();
      });

      this.stack = [];
      this.selectors = [];
      this.index.value = -1;
      this.selectorCount.value = 0;
      this.dialogs = [];
      this.dialogCount.value = 0;

      let restored = false;
      if (preferRestore) {
        restored = await this.restorePersistedNavigation();
      }

      if (!restored && home) {
        await this.showHomeTarget(home, true);
      } else if (!restored && menu) {
        await this.$showMenu(menu, undefined, true);
      } else if (restored) {
        this.syncBrowserHistory(true);
      }

      this.loaded.value = true;
      Dialogs.$hideProgress();
      await this.emitLifecycleEvent('loaded');
      await nextTick();
      await this.emitLifecycleEvent('ready');
    } catch (error) {
      Dialogs.$hideProgress();
      throw error;
    }
  }

  async $getUDFs(objectType: string|string[]): Promise<any[]> {
    if (this.options.udfs) return await this.options.udfs(this, objectType, this.params.value.udfQuery || {});

    try {
      const items = await Api.instance.service('udfs').findAll({query: {$sort: {sort: 1}, inactive: {$ne: true}, ...(this.params.value.udfQuery ? this.params.value.udfQuery : {}), objectTypes: {$in: Array.isArray(objectType) ? objectType : [objectType]}}});
      return items
    } catch (error) {
      return [];
    }
  }

  $makeUDF (options: any, mode?: ReportMode): Field|undefined {
    if (this.options.makeUDF) return this.options.makeUDF(this, options);

    const ftype: any = options.fieldType;
    if (!ftype) return;

    const fieldMaps: any = {}
    const itemId = Master.getItemId(options, Master.getDefaultIdField())

    return new Field({
      type: fieldMaps[ftype] || ftype,
      label: options.fieldLabel,
      hint: options.hint,
      placeholder: options.placeholder,
      icon: options.icon,
      required: options.isRequired,
      multiple: options.multiple || false,
      storage: `udfs.${itemId}`,
      cols: options.gridSize?.cols,
      xs: options.gridSize?.xs,
      sm: options.gridSize?.sm,
      md: options.gridSize?.md,
      lg: options.gridSize?.lg,
      xl: options.gridSize?.xl,
      xxl: options.gridSize?.xxl,
      ...(options.defaultValue || options.defaultValue === 0  ? {default: options.defaultValue}: {}),
      ...(options.fieldType === 'text' && options.isAutoGen && mode && ['create', 'edit'].includes(mode) ? {
        readonly: !options.autoGenInfo?.enableEdit,
        hint: { key: 've.field.autoGenerated', fallback: 'Is Auto Generated' },
        default: { key: 've.field.autoGeneratedPlaceholder', fallback: '<AUTO>' },
      } : {})
    }, {
      selectOptions: () => options.options || []
    })
  }

  async $showMenu(menu: Menu | NavigationScreenFactory<Menu>, params?: AppScreenParams, replaceHistory?: boolean) {
    const resolved = await AppManager.prepareScreenTarget('menu', menu, params);
    if (!resolved.item) {
      return;
    }

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    const navigation = await this.buildNavigationEntry('menu', resolved.item, resolved.params || {});
    resolved.item.setReplayPath(navigation?.menuRestorePath || []);

    this.stack.push({
      type: "menu",
      item: resolved.item,
      params: resolved.params || {},
      navigation,
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.afterStackChanged({ replaceHistory });
  }

  async $showLeftMenu(menu: MenuTarget, params?: AppScreenParams) {
    this.leftSideMenuRuntimeRevision += 1;
    this.leftSideMenuRuntime = {
      target: menu,
      params,
      source: 'runtime',
      token: this.leftSideMenuRuntimeRevision,
    };
    this.setSuppressedSideNavToken('left', undefined);
    this.setSideNavTouched('left', false);
    await this.resolveSideNavMenu('left', true);
    if (this.leftSideMenu.value) {
      this.setSideNavOpen('left', true);
    }
  }

  async $showRightMenu(menu: MenuTarget, params?: AppScreenParams) {
    this.rightSideMenuRuntimeRevision += 1;
    this.rightSideMenuRuntime = {
      target: menu,
      params,
      source: 'runtime',
      token: this.rightSideMenuRuntimeRevision,
    };
    this.setSuppressedSideNavToken('right', undefined);
    this.setSideNavTouched('right', false);
    await this.resolveSideNavMenu('right', true);
    if (this.rightSideMenu.value) {
      this.setSideNavOpen('right', true);
    }
  }

  $hideLeftMenu() {
    this.setSideNavOpen('left', false);
  }

  $hideRightMenu() {
    this.setSideNavOpen('right', false);
  }

  $clearLeftMenu() {
    this.clearSideNav('left');
  }

  $clearRightMenu() {
    this.clearSideNav('right');
  }

  async $refreshLeftMenu() {
    await this.resolveSideNavMenu('left', true);
  }

  async $refreshRightMenu() {
    await this.resolveSideNavMenu('right', true);
  }

  async $toggleLeftMenu() {
    if (!this.leftSideMenu.value) {
      await this.resolveSideNavMenu('left', true);
    }
    if (this.leftSideMenu.value) {
      this.setSideNavOpen('left', !this.leftSideMenuOpen.value);
    }
  }

  async $toggleRightMenu() {
    if (!this.rightSideMenu.value) {
      await this.resolveSideNavMenu('right', true);
    }
    if (this.rightSideMenu.value) {
      this.setSideNavOpen('right', !this.rightSideMenuOpen.value);
    }
  }

  async $showReport(report: Report | NavigationScreenFactory<Report>, params?: AppScreenParams, replace?: boolean) {
    const resolved = await AppManager.prepareScreenTarget('report', report, params);
    if (!resolved.item) {
      return;
    }

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop(undefined, true)

    const navigation = await this.buildNavigationEntry('report', resolved.item, resolved.params || {});

    this.stack.push({
      type: "report",
      item: resolved.item,
      params: resolved.params || {},
      navigation,
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.afterStackChanged({ replaceHistory: !!replace });
  }

  async $showCollection(collection: Collection | NavigationScreenFactory<Collection>, params?: AppScreenParams, replace?: boolean) {
    const resolved = await AppManager.prepareScreenTarget('collection', collection, params);
    if (!resolved.item) {
      return;
    }

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop(undefined, true)

    const navigation = await this.buildNavigationEntry('collection', resolved.item, resolved.params || {});

    this.stack.push({
      type: "collection",
      item: resolved.item,
      params: resolved.params || {},
      navigation,
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    this.stack[this.index.value].navigation = await this.buildNavigationEntry('collection', resolved.item, resolved.params || {}, this.stack[this.index.value].navigation);
    await this.afterStackChanged({ replaceHistory: !!replace });
  }

  async $showTrigger(trigger: Trigger | NavigationScreenFactory<Trigger>, params?: AppScreenParams, replace?: boolean) {
    const resolved = await AppManager.prepareScreenTarget('trigger', trigger, params);
    if (!resolved.item) {
      return;
    }

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop(undefined, true)

    const navigation = await this.buildNavigationEntry('trigger', resolved.item, resolved.params || {});

    this.stack.push({
      type: "trigger",
      item: resolved.item,
      params: resolved.params || {},
      navigation,
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.afterStackChanged({ replaceHistory: !!replace });
  }

  async $showUI(ui: UIBase | NavigationScreenFactory<UIBase>, params?: AppScreenParams, replace?: boolean) {
    const resolved = await AppManager.prepareScreenTarget('ui', ui, params);
    if (!resolved.item) {
      return;
    }

    if (this.index.value >= 0 && this.index.value < this.stack.length) {
      this.stack[this.index.value].item.removeEventListeners();
    }

    if (replace) await this.$pop(undefined, true)

    const navType = resolved.params?.navigationType || resolved.params?.navigationEntry?.type || 'ui';
    const navigation = await this.buildNavigationEntry(navType, resolved.item, resolved.params || {});

    this.stack.push({
      type: "ui",
      item: resolved.item,
      params: resolved.params || {},
      navigation,
    })

    this.index.value = this.stack.length - 1;
    await this.activateCurrentItem();
    await this.afterStackChanged({ replaceHistory: !!replace });
  }

  async $showSelector(selector: Selector, params?: any) {
    const target = this.captureActiveElement();
    if (target) {
      this.selectorFocusTargets.set(selector.$id, target);
    }
    this.selectors.push(selector)
    this.selectorCount.value = this.selectors.length;
    await sleep(100);
    selector.on('cancel', () => this.onSelectorCancel(selector), this.$id);
    selector.attachEventListeners()
    selector.show();
  }

  async $showDialog(dialog: DialogForm, params?: any) {
    const target = this.captureActiveElement();
    if (target) {
      this.dialogFocusTargets.set(dialog.$id, target);
    }
    this.dialogs.push(dialog)
    this.dialogCount.value = this.dialogs.length;
    await sleep(100);
    dialog.on('cancel', () => this.onDialogCancel(dialog), this.$id);
    dialog.attachEventListeners()
    dialog.show();
  }

  async $back() {
    if (this.selectors.length > 0) {
      this.selectors[this.selectors.length - 1].forceCancel();
      return;
    }

    if (this.dialogs.length > 0) {
      this.dialogs[this.dialogs.length - 1].forceCancel();
      return;
    }

    if (this.stack.length > 0) {
      const active = this.getActiveStackItem()?.item as any;
      if (active && typeof active.canHandleBack === 'function' && await active.canHandleBack()) {
        const handled = typeof active.handleBack === 'function' ? await active.handleBack() : false;
        if (handled) {
          return;
        }
      }
    }

    if (this.stack.length > 1 && this.supportsBrowserHistory()) {
      await this.requestManagedHistoryBack(async () => {
        await this.popCurrentStackItemLocally();
      });
    } else if (this.stack.length > 1) {
      this.stack[this.stack.length-1].item.forceCancel();
    } else {
      this.emit('close', this);
    }
  }

  async $pop(count?: number, skipHistory: boolean = false) {
    if (count === 0) return;
    const rem = count || 1;
    if (rem < this.stack.length) {
      this.index.value -= rem;
      for (let i = 0; i < rem; i++) {
        const info = this.stack.pop();
        if (info) {
          info.item.removeEventListeners();
        }
      }
      await this.activateCurrentItem();
      await this.afterStackChanged({ replaceHistory: true, skipHistory });
    } else if (rem >= this.stack.length) {
      await this.loadApp(false);
    }
  }

  private async onCancel(item: UIBase) {
    this.fabOpen.value = false;
    if (this.supportsBrowserHistory() && this.stack.length > 1) {
      await this.requestManagedHistoryBack(async () => {
        await this.popCurrentStackItemLocally(item);
      });
      return;
    }
    await this.popCurrentStackItemLocally(item);
  }

  private async onSelectorCancel(item: UIBase) {
    const ui = this.selectors.filter((inst) => inst.$id === item.$id)[0];
    if (ui) {
      const index = this.selectors.indexOf(ui);
      if (index >= 0) {
        this.selectors.splice(index, 1);
        ui.clearListeners(this.$id);
        this.selectorCount.value = this.selectors.length;
        await this.restoreFocus(this.selectorFocusTargets.get(ui.$id));
        this.selectorFocusTargets.delete(ui.$id);
      }
    }
  }

  private async onDialogCancel(item: UIBase) {
    const ui = this.dialogs.filter((inst) => inst.$id === item.$id)[0];
    if (ui) {
      const index = this.dialogs.indexOf(ui);
      if (index >= 0) {
        this.dialogs.splice(index, 1);
        ui.clearListeners(this.$id);
        this.dialogCount.value = this.dialogs.length;
        await this.restoreFocus(this.dialogFocusTargets.get(ui.$id));
        this.dialogFocusTargets.delete(ui.$id);
      }
    }
  }

  private captureActiveElement(): HTMLElement|undefined {
    if (typeof document === 'undefined' || typeof HTMLElement === 'undefined') {
      return undefined;
    }

    const active = document.activeElement;
    if (active instanceof HTMLElement && active !== document.body) {
      return active;
    }
    return undefined;
  }

  private async restoreFocus(target?: HTMLElement) {
    if (!target) {
      return;
    }

    await sleep(50);
    if (target.isConnected && typeof target.focus === 'function') {
      target.focus();
    }
  }

  attachEventListeners() {
    super.attachEventListeners();
    this.attachShellLayoutBreakpoint();
    if (typeof window !== 'undefined' && !this.shortcutHandler) {
      this.shortcutHandler = (ev: KeyboardEvent) => this.onAppKeydown(ev);
      window.addEventListener('keydown', this.shortcutHandler);
    }
    if (typeof window !== 'undefined' && !this.browserNavigationAttached && this.supportsBrowserHistory()) {
      this.browserNavigationAttached = true;
      window.addEventListener('popstate', this.boundPopStateHandler);
      if (!window.history.state?.__veNavigation) {
        this.syncBrowserHistory(true);
      }
    }
    if (typeof window !== 'undefined' && this.navigationEnabled()) {
      window.addEventListener('beforeunload', this.boundPersistenceFlushHandler);
      window.addEventListener('pagehide', this.boundPersistenceFlushHandler);
      document.addEventListener('visibilitychange', this.boundVisibilityHandler);
    }
    if (detectCapacitorEnvironment() && !this.detachCapacitorBackHandler) {
      void attachCapacitorBackButton(async () => {
        await this.$back();
      }).then((detach) => {
        this.detachCapacitorBackHandler = detach;
      });
    }
  }

  removeEventListeners() {
    super.removeEventListeners();
    this.detachShellLayoutBreakpoint();
    this.disconnectFooterObserver();
    if (typeof window !== 'undefined' && this.shortcutHandler) {
      window.removeEventListener('keydown', this.shortcutHandler);
      this.shortcutHandler = undefined;
    }
    if (typeof window !== 'undefined' && this.browserNavigationAttached) {
      window.removeEventListener('popstate', this.boundPopStateHandler);
      this.browserNavigationAttached = false;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.boundPersistenceFlushHandler);
      window.removeEventListener('pagehide', this.boundPersistenceFlushHandler);
      document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    }
    if (this.detachCapacitorBackHandler) {
      this.detachCapacitorBackHandler();
      this.detachCapacitorBackHandler = undefined;
    }
  }

  private syncShellLayoutBreakpoint(matches?: boolean) {
    this.viewportWidth.value = typeof window !== 'undefined' ? window.innerWidth : this.viewportWidth.value;
    this.compactShellLayout.value = matches ?? (typeof window !== 'undefined' ? window.innerWidth < 960 : false);
    if (!this.compactShellLayout.value) {
      this.mobileHeaderDrawerOpen.value = false;
    }
  }

  private attachShellLayoutBreakpoint() {
    if (typeof window === 'undefined' || this.shellLayoutMediaQuery) {
      return;
    }

    this.shellLayoutMediaQuery = window.matchMedia('(max-width: 959px)');
    this.syncShellLayoutBreakpoint(this.shellLayoutMediaQuery.matches);
    this.shellLayoutMediaHandler = (ev: MediaQueryListEvent) => {
      this.syncShellLayoutBreakpoint(ev.matches);
    };

    if (typeof this.shellLayoutMediaQuery.addEventListener === 'function') {
      this.shellLayoutMediaQuery.addEventListener('change', this.shellLayoutMediaHandler);
    } else {
      this.shellLayoutMediaQuery.addListener(this.shellLayoutMediaHandler);
    }
  }

  private detachShellLayoutBreakpoint() {
    if (!this.shellLayoutMediaQuery || !this.shellLayoutMediaHandler) {
      this.shellLayoutMediaQuery = undefined;
      this.shellLayoutMediaHandler = undefined;
      return;
    }

    if (typeof this.shellLayoutMediaQuery.removeEventListener === 'function') {
      this.shellLayoutMediaQuery.removeEventListener('change', this.shellLayoutMediaHandler);
    } else {
      this.shellLayoutMediaQuery.removeListener(this.shellLayoutMediaHandler);
    }

    this.shellLayoutMediaQuery = undefined;
    this.shellLayoutMediaHandler = undefined;
  }

  private setFooterElement(el: Element | any) {
    const root = el instanceof HTMLElement ? el : el?.$el;
    const element = root instanceof HTMLElement ? root : undefined;
    if (element === this.footerElement) {
      this.updateFooterHeight();
      return;
    }

    this.disconnectFooterObserver();
    this.footerElement = element;
    this.updateFooterHeight();

    if (typeof ResizeObserver !== 'undefined' && this.footerElement) {
      this.footerResizeObserver = new ResizeObserver(() => this.updateFooterHeight());
      this.footerResizeObserver.observe(this.footerElement);
    }
  }

  private updateFooterHeight() {
    this.footerHeight.value = this.footerElement?.offsetHeight || 0;
  }


  private disconnectFooterObserver() {
    if (this.footerResizeObserver) {
      this.footerResizeObserver.disconnect();
      this.footerResizeObserver = undefined;
    }

    this.footerElement = undefined;
    this.footerHeight.value = 0;
  }

}

export const $APP = (params?: AppParams, options?: AppOptions) => new AppMain(params || {}, options || {});
