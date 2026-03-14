import type { App as VueApp, Component, Plugin } from 'vue';
import type { Application } from '../declarations';
import { Api } from '../api';
import {
  AxiosApiOptions,
  AxiosKeycloakClientConfig,
} from '../axios-api';
import {
  FeathersKeycloakClientConfig,
  SocketIOOptions,
} from '../feathers-api';
import { AppMain, type AppOptions, type AppParams } from '../ui/appmain';
import { AppManager } from '../ui/appmanager';
import { Button, type ButtonParams } from '../ui/button';
import { Collection, type CollectionParams } from '../ui/collection';
import { DialogForm, type DialogParams } from '../ui/dialogform';
import { DialogOptions, Dialogs } from '../ui/dialogs';
import { NotificationOptions, Notifications } from '../ui/notifications';
import { Field, type FieldParams } from '../ui/field';
import { Form, type FormParams } from '../ui/form';
import { MailboxBell, MailboxView, type MailboxBellParams, type MailboxViewParams } from '../ui/mailbox';
import { Menu, MenuItem, type MenuItemParams, type MenuParams } from '../ui/menu';
import { Part, type PartParams } from '../ui/part';
import { Report, type ReportParams } from '../ui/report';
import { Selector, type SelectorParams } from '../ui/selector';
import { AppTitleBlock, EnvironmentTag, StatusBadge, UserArea, type AppTitleBlockParams, type EnvironmentTagParams, type StatusBadgeParams, type UserAreaParams } from '../ui/shell';
import { Trigger, type TriggerParams } from '../ui/trigger';
import { Master, type MasterOptions } from '../master';

export interface VuetifyExtendedDefaults {
  app?: AppParams;
  appTitleBlock?: AppTitleBlockParams;
  button?: ButtonParams;
  collection?: CollectionParams;
  dialogForm?: DialogParams;
  environmentTag?: EnvironmentTagParams;
  field?: FieldParams;
  form?: FormParams;
  mailboxBell?: MailboxBellParams;
  mailboxView?: MailboxViewParams;
  master?: MasterOptions;
  menu?: MenuParams;
  menuItem?: MenuItemParams;
  notifications?: NotificationOptions;
  part?: PartParams;
  report?: ReportParams;
  selector?: SelectorParams;
  statusBadge?: StatusBadgeParams;
  trigger?: TriggerParams;
  userArea?: UserAreaParams;
}

export type VuetifyExtendedApiConfig =
  | {
      type: 'feathers';
      apiURL: any;
      keycloakConfig: FeathersKeycloakClientConfig;
      options?: SocketIOOptions;
    }
  | {
      type: 'axios';
      apiURL: any;
      keycloakConfig: AxiosKeycloakClientConfig;
      options?: AxiosApiOptions;
    }
  | {
      type: 'instance';
      instance: Application;
    };

export interface VuetifyExtendedAppFactoryOptions {
  api?: VuetifyExtendedApiConfig;
  defaults?: VuetifyExtendedDefaults;
  dialogs?: DialogOptions;
  notifications?: NotificationOptions;
  app?: AppMain | { params?: AppParams; options?: AppOptions };
  menu?: AppOptions['menu'];
  udfs?: AppOptions['udfs'];
  makeUDF?: AppOptions['makeUDF'];
  validateSetup?: boolean;
  requireApi?: boolean;
}

export interface VuetifyExtendedSetupStatus {
  valid: boolean;
  issues: string[];
  apiConfigured: boolean;
  appManagerInitialized: boolean;
  appConfigured: boolean;
  dialogsMounted: boolean;
  notificationsMounted: boolean;
}

export interface VuetifyExtendedBootstrap {
  appMain: AppMain;
  component: Component;
  dialogs: Component;
  notifications: Component;
  install: (app: VueApp) => VueApp;
  plugin: Plugin;
  validate: (options?: { requireApi?: boolean; warn?: boolean }) => VuetifyExtendedSetupStatus;
}

function configureApi(config?: VuetifyExtendedApiConfig) {
  if (!config) {
    return;
  }

  if (config.type === 'instance') {
    Api.setInstance(config.instance);
    return;
  }

  if (config.type === 'axios') {
    Api.useAxios(config.apiURL, config.keycloakConfig, config.options);
    return;
  }

  Api.useFeathers(config.apiURL, config.keycloakConfig, config.options);
}

function createAppMain(options?: VuetifyExtendedAppFactoryOptions['app'], overrides?: Partial<AppOptions>) {
  if (options instanceof AppMain) {
    return options;
  }

  return new AppMain(options?.params, {
    ...(options?.options || {}),
    ...(overrides || {}),
  });
}

export function configureVuetifyExtendedDefaults(defaults: VuetifyExtendedDefaults, reset?: boolean) {
  if (defaults.app) AppMain.setDefault(defaults.app, reset);
  if (defaults.appTitleBlock) AppTitleBlock.setDefault(defaults.appTitleBlock, reset);
  if (defaults.button) Button.setDefault(defaults.button, reset);
  if (defaults.collection) Collection.setDefault(defaults.collection, reset);
  if (defaults.dialogForm) DialogForm.setDefault(defaults.dialogForm, reset);
  if (defaults.environmentTag) EnvironmentTag.setDefault(defaults.environmentTag, reset);
  if (defaults.field) Field.setDefault(defaults.field, reset);
  if (defaults.form) Form.setDefault(defaults.form, reset);
  if (defaults.mailboxBell) MailboxBell.setDefault(defaults.mailboxBell, reset);
  if (defaults.mailboxView) MailboxView.setDefault(defaults.mailboxView, reset);
  if (defaults.master) Master.setDefault(defaults.master, reset);
  if (defaults.menu) Menu.setDefault(defaults.menu, reset);
  if (defaults.menuItem) MenuItem.setDefault(defaults.menuItem, reset);
  if (defaults.notifications) Notifications.setDefault(defaults.notifications, reset);
  if (defaults.part) Part.setDefault(defaults.part, reset);
  if (defaults.report) Report.setDefault(defaults.report, reset);
  if (defaults.selector) Selector.setDefault(defaults.selector, reset);
  if (defaults.statusBadge) StatusBadge.setDefault(defaults.statusBadge, reset);
  if (defaults.trigger) Trigger.setDefault(defaults.trigger, reset);
  if (defaults.userArea) UserArea.setDefault(defaults.userArea, reset);
}

export function validateVuetifyExtendedSetup(options?: { requireApi?: boolean; warn?: boolean }): VuetifyExtendedSetupStatus {
  const requireApi = options?.requireApi !== false;
  const issues: string[] = [];
  const apiConfigured = !!Api.instance;
  const appManagerInitialized = AppManager.initialized;
  const appConfigured = !!AppManager.$app;
  const dialogsMounted = Dialogs.rootIsMounted;
  const notificationsMounted = Notifications.rootIsMounted;

  if (requireApi && !apiConfigured) {
    issues.push('Api.instance is not configured. Call Api.useFeathers(...), Api.useAxios(...), Api.setup(...), or createVuetifyExtendedApp({ api: ... }).');
  }

  if (!appManagerInitialized) {
    issues.push('AppManager has not been initialized. Call AppManager.init() or use createVuetifyExtendedApp(...).');
  }

  if (!appConfigured) {
    issues.push('AppManager has no active AppMain instance. Call AppManager.setApp(...) or use createVuetifyExtendedApp(...).');
  }

  if (!dialogsMounted) {
    issues.push('Dialogs.rootComponent() is not mounted. Render the dialog root once at the application root.');
  }

  if (!notificationsMounted) {
    issues.push('Notifications.rootComponent() is not mounted. Render the notification root once at the application root.');
  }

  const status: VuetifyExtendedSetupStatus = {
    valid: issues.length === 0,
    issues,
    apiConfigured,
    appManagerInitialized,
    appConfigured,
    dialogsMounted,
    notificationsMounted,
  };

  if (options?.warn !== false && issues.length > 0 && typeof console !== 'undefined') {
    console.warn('[vuetify-extended] Setup validation reported issues:\n- ' + issues.join('\n- '));
  }

  return status;
}

export function createVuetifyExtendedApp(options: VuetifyExtendedAppFactoryOptions = {}): VuetifyExtendedBootstrap {
  if (options.defaults) {
    configureVuetifyExtendedDefaults(options.defaults);
  }

  if (options.dialogs) {
    Dialogs.setOptions(options.dialogs);
  }

  if (options.notifications) {
    Notifications.setOptions(options.notifications);
  }

  configureApi(options.api);
  AppManager.init();

  const appMain = createAppMain(options.app, {
    ...(options.menu ? { menu: options.menu } : {}),
    ...(options.udfs ? { udfs: options.udfs } : {}),
    ...(options.makeUDF ? { makeUDF: options.makeUDF } : {}),
  });

  AppManager.setApp(appMain);

  const DialogRoot = Dialogs.rootComponent();
  const NotificationRoot = Notifications.rootComponent();
  const validate = (settings?: { requireApi?: boolean; warn?: boolean }) =>
    validateVuetifyExtendedSetup({
      requireApi: settings?.requireApi ?? options.requireApi ?? true,
      warn: settings?.warn,
    });

  const bootstrap: VuetifyExtendedBootstrap = {
    appMain,
    component: appMain.component,
    dialogs: DialogRoot,
    notifications: NotificationRoot,
    install(app: VueApp) {
      app.component('VuetifyExtendedAppMain', appMain.component);
      app.component('VuetifyExtendedDialogs', DialogRoot);
      app.component('VuetifyExtendedNotifications', NotificationRoot);
      app.provide('vuetify-extended', bootstrap);
      (app.config.globalProperties as any).$vuetifyExtended = bootstrap;
      (app.config.globalProperties as any).$appManager = AppManager;
      (app.config.globalProperties as any).$dialogs = Dialogs;
      (app.config.globalProperties as any).$notifications = Notifications;
      return app;
    },
    plugin: {
      install(app: VueApp) {
        bootstrap.install(app);
      },
    },
    validate,
  };

  if (options.validateSetup) {
    validate({ warn: true });
  }

  return bootstrap;
}

export function createVuetifyExtendedPlugin(options: VuetifyExtendedAppFactoryOptions = {}): Plugin {
  return createVuetifyExtendedApp(options).plugin;
}
