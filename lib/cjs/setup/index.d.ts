import type { App as VueApp, Component, Plugin } from 'vue';
import type { Application } from '../declarations';
import { AxiosApiOptions, AxiosKeycloakClientConfig } from '../axios-api';
import { FeathersKeycloakClientConfig, SocketIOOptions } from '../feathers-api';
import { AppMain, type AppOptions, type AppParams } from '../ui/appmain';
import { type ButtonParams } from '../ui/button';
import { type CollectionParams } from '../ui/collection';
import { type DialogParams } from '../ui/dialogform';
import { DialogOptions } from '../ui/dialogs';
import { type FieldParams } from '../ui/field';
import { type FormParams } from '../ui/form';
import { type MenuItemParams, type MenuParams } from '../ui/menu';
import { type PartParams } from '../ui/part';
import { type ReportParams } from '../ui/report';
import { type SelectorParams } from '../ui/selector';
import { type TriggerParams } from '../ui/trigger';
export interface VuetifyExtendedDefaults {
    app?: AppParams;
    button?: ButtonParams;
    collection?: CollectionParams;
    dialogForm?: DialogParams;
    field?: FieldParams;
    form?: FormParams;
    menu?: MenuParams;
    menuItem?: MenuItemParams;
    part?: PartParams;
    report?: ReportParams;
    selector?: SelectorParams;
    trigger?: TriggerParams;
}
export type VuetifyExtendedApiConfig = {
    type: 'feathers';
    apiURL: any;
    keycloakConfig: FeathersKeycloakClientConfig;
    options?: SocketIOOptions;
} | {
    type: 'axios';
    apiURL: any;
    keycloakConfig: AxiosKeycloakClientConfig;
    options?: AxiosApiOptions;
} | {
    type: 'instance';
    instance: Application;
};
export interface VuetifyExtendedAppFactoryOptions {
    api?: VuetifyExtendedApiConfig;
    defaults?: VuetifyExtendedDefaults;
    dialogs?: DialogOptions;
    app?: AppMain | {
        params?: AppParams;
        options?: AppOptions;
    };
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
}
export interface VuetifyExtendedBootstrap {
    appMain: AppMain;
    component: Component;
    dialogs: Component;
    install: (app: VueApp) => VueApp;
    plugin: Plugin;
    validate: (options?: {
        requireApi?: boolean;
        warn?: boolean;
    }) => VuetifyExtendedSetupStatus;
}
export declare function configureVuetifyExtendedDefaults(defaults: VuetifyExtendedDefaults, reset?: boolean): void;
export declare function validateVuetifyExtendedSetup(options?: {
    requireApi?: boolean;
    warn?: boolean;
}): VuetifyExtendedSetupStatus;
export declare function createVuetifyExtendedApp(options?: VuetifyExtendedAppFactoryOptions): VuetifyExtendedBootstrap;
export declare function createVuetifyExtendedPlugin(options?: VuetifyExtendedAppFactoryOptions): Plugin;
