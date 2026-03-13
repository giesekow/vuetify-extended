import { Api } from '../api';
import { AppMain } from '../ui/appmain';
import { AppManager } from '../ui/appmanager';
import { Button } from '../ui/button';
import { Collection } from '../ui/collection';
import { DialogForm } from '../ui/dialogform';
import { Dialogs } from '../ui/dialogs';
import { Field } from '../ui/field';
import { Form } from '../ui/form';
import { Menu, MenuItem } from '../ui/menu';
import { Part } from '../ui/part';
import { Report } from '../ui/report';
import { Selector } from '../ui/selector';
import { Trigger } from '../ui/trigger';
function configureApi(config) {
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
function createAppMain(options, overrides) {
    if (options instanceof AppMain) {
        return options;
    }
    return new AppMain(options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.options) || {})), (overrides || {})));
}
export function configureVuetifyExtendedDefaults(defaults, reset) {
    if (defaults.app)
        AppMain.setDefault(defaults.app, reset);
    if (defaults.button)
        Button.setDefault(defaults.button, reset);
    if (defaults.collection)
        Collection.setDefault(defaults.collection, reset);
    if (defaults.dialogForm)
        DialogForm.setDefault(defaults.dialogForm, reset);
    if (defaults.field)
        Field.setDefault(defaults.field, reset);
    if (defaults.form)
        Form.setDefault(defaults.form, reset);
    if (defaults.menu)
        Menu.setDefault(defaults.menu, reset);
    if (defaults.menuItem)
        MenuItem.setDefault(defaults.menuItem, reset);
    if (defaults.part)
        Part.setDefault(defaults.part, reset);
    if (defaults.report)
        Report.setDefault(defaults.report, reset);
    if (defaults.selector)
        Selector.setDefault(defaults.selector, reset);
    if (defaults.trigger)
        Trigger.setDefault(defaults.trigger, reset);
}
export function validateVuetifyExtendedSetup(options) {
    const requireApi = (options === null || options === void 0 ? void 0 : options.requireApi) !== false;
    const issues = [];
    const apiConfigured = !!Api.instance;
    const appManagerInitialized = AppManager.initialized;
    const appConfigured = !!AppManager.$app;
    const dialogsMounted = Dialogs.rootIsMounted;
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
    const status = {
        valid: issues.length === 0,
        issues,
        apiConfigured,
        appManagerInitialized,
        appConfigured,
        dialogsMounted,
    };
    if ((options === null || options === void 0 ? void 0 : options.warn) !== false && issues.length > 0 && typeof console !== 'undefined') {
        console.warn('[vuetify-extended] Setup validation reported issues:\n- ' + issues.join('\n- '));
    }
    return status;
}
export function createVuetifyExtendedApp(options = {}) {
    if (options.defaults) {
        configureVuetifyExtendedDefaults(options.defaults);
    }
    if (options.dialogs) {
        Dialogs.setOptions(options.dialogs);
    }
    configureApi(options.api);
    AppManager.init();
    const appMain = createAppMain(options.app, Object.assign(Object.assign(Object.assign({}, (options.menu ? { menu: options.menu } : {})), (options.udfs ? { udfs: options.udfs } : {})), (options.makeUDF ? { makeUDF: options.makeUDF } : {})));
    AppManager.setApp(appMain);
    const DialogRoot = Dialogs.rootComponent();
    const validate = (settings) => {
        var _a, _b;
        return validateVuetifyExtendedSetup({
            requireApi: (_b = (_a = settings === null || settings === void 0 ? void 0 : settings.requireApi) !== null && _a !== void 0 ? _a : options.requireApi) !== null && _b !== void 0 ? _b : true,
            warn: settings === null || settings === void 0 ? void 0 : settings.warn,
        });
    };
    const bootstrap = {
        appMain,
        component: appMain.component,
        dialogs: DialogRoot,
        install(app) {
            app.component('VuetifyExtendedAppMain', appMain.component);
            app.component('VuetifyExtendedDialogs', DialogRoot);
            app.provide('vuetify-extended', bootstrap);
            app.config.globalProperties.$vuetifyExtended = bootstrap;
            app.config.globalProperties.$appManager = AppManager;
            app.config.globalProperties.$dialogs = Dialogs;
            return app;
        },
        plugin: {
            install(app) {
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
export function createVuetifyExtendedPlugin(options = {}) {
    return createVuetifyExtendedApp(options).plugin;
}
