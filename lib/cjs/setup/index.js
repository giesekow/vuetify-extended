"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVuetifyExtendedPlugin = exports.createVuetifyExtendedApp = exports.validateVuetifyExtendedSetup = exports.configureVuetifyExtendedDefaults = void 0;
const api_1 = require("../api");
const appmain_1 = require("../ui/appmain");
const appmanager_1 = require("../ui/appmanager");
const button_1 = require("../ui/button");
const collection_1 = require("../ui/collection");
const dialogform_1 = require("../ui/dialogform");
const dialogs_1 = require("../ui/dialogs");
const notifications_1 = require("../ui/notifications");
const field_1 = require("../ui/field");
const form_1 = require("../ui/form");
const mailbox_1 = require("../ui/mailbox");
const menu_1 = require("../ui/menu");
const part_1 = require("../ui/part");
const report_1 = require("../ui/report");
const selector_1 = require("../ui/selector");
const shell_1 = require("../ui/shell");
const trigger_1 = require("../ui/trigger");
const master_1 = require("../master");
function configureApi(config) {
    if (!config) {
        return;
    }
    if (config.type === 'instance') {
        api_1.Api.setInstance(config.instance);
        return;
    }
    if (config.type === 'axios') {
        api_1.Api.useAxios(config.apiURL, config.keycloakConfig, config.options);
        return;
    }
    api_1.Api.useFeathers(config.apiURL, config.keycloakConfig, config.options);
}
function createAppMain(options, overrides) {
    if (options instanceof appmain_1.AppMain) {
        return options;
    }
    return new appmain_1.AppMain(options === null || options === void 0 ? void 0 : options.params, Object.assign(Object.assign({}, ((options === null || options === void 0 ? void 0 : options.options) || {})), (overrides || {})));
}
function configureVuetifyExtendedDefaults(defaults, reset) {
    if (defaults.app)
        appmain_1.AppMain.setDefault(defaults.app, reset);
    if (defaults.appTitleBlock)
        shell_1.AppTitleBlock.setDefault(defaults.appTitleBlock, reset);
    if (defaults.button)
        button_1.Button.setDefault(defaults.button, reset);
    if (defaults.collection)
        collection_1.Collection.setDefault(defaults.collection, reset);
    if (defaults.dialogForm)
        dialogform_1.DialogForm.setDefault(defaults.dialogForm, reset);
    if (defaults.environmentTag)
        shell_1.EnvironmentTag.setDefault(defaults.environmentTag, reset);
    if (defaults.field)
        field_1.Field.setDefault(defaults.field, reset);
    if (defaults.form)
        form_1.Form.setDefault(defaults.form, reset);
    if (defaults.mailboxBell)
        mailbox_1.MailboxBell.setDefault(defaults.mailboxBell, reset);
    if (defaults.mailboxView)
        mailbox_1.MailboxView.setDefault(defaults.mailboxView, reset);
    if (defaults.master)
        master_1.Master.setDefault(defaults.master, reset);
    if (defaults.menu)
        menu_1.Menu.setDefault(defaults.menu, reset);
    if (defaults.menuItem)
        menu_1.MenuItem.setDefault(defaults.menuItem, reset);
    if (defaults.notifications)
        notifications_1.Notifications.setDefault(defaults.notifications, reset);
    if (defaults.part)
        part_1.Part.setDefault(defaults.part, reset);
    if (defaults.report)
        report_1.Report.setDefault(defaults.report, reset);
    if (defaults.selector)
        selector_1.Selector.setDefault(defaults.selector, reset);
    if (defaults.statusBadge)
        shell_1.StatusBadge.setDefault(defaults.statusBadge, reset);
    if (defaults.trigger)
        trigger_1.Trigger.setDefault(defaults.trigger, reset);
    if (defaults.userArea)
        shell_1.UserArea.setDefault(defaults.userArea, reset);
}
exports.configureVuetifyExtendedDefaults = configureVuetifyExtendedDefaults;
function validateVuetifyExtendedSetup(options) {
    const requireApi = (options === null || options === void 0 ? void 0 : options.requireApi) !== false;
    const issues = [];
    const apiConfigured = !!api_1.Api.instance;
    const appManagerInitialized = appmanager_1.AppManager.initialized;
    const appConfigured = !!appmanager_1.AppManager.$app;
    const dialogsMounted = dialogs_1.Dialogs.rootIsMounted;
    const notificationsMounted = notifications_1.Notifications.rootIsMounted;
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
    const status = {
        valid: issues.length === 0,
        issues,
        apiConfigured,
        appManagerInitialized,
        appConfigured,
        dialogsMounted,
        notificationsMounted,
    };
    if ((options === null || options === void 0 ? void 0 : options.warn) !== false && issues.length > 0 && typeof console !== 'undefined') {
        console.warn('[vuetify-extended] Setup validation reported issues:\n- ' + issues.join('\n- '));
    }
    return status;
}
exports.validateVuetifyExtendedSetup = validateVuetifyExtendedSetup;
function createVuetifyExtendedApp(options = {}) {
    if (options.defaults) {
        configureVuetifyExtendedDefaults(options.defaults);
    }
    if (options.dialogs) {
        dialogs_1.Dialogs.setOptions(options.dialogs);
    }
    if (options.notifications) {
        notifications_1.Notifications.setOptions(options.notifications);
    }
    configureApi(options.api);
    appmanager_1.AppManager.init();
    const appMain = createAppMain(options.app, Object.assign(Object.assign(Object.assign({}, (options.menu ? { menu: options.menu } : {})), (options.udfs ? { udfs: options.udfs } : {})), (options.makeUDF ? { makeUDF: options.makeUDF } : {})));
    appmanager_1.AppManager.setApp(appMain);
    const DialogRoot = dialogs_1.Dialogs.rootComponent();
    const NotificationRoot = notifications_1.Notifications.rootComponent();
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
        notifications: NotificationRoot,
        install(app) {
            app.component('VuetifyExtendedAppMain', appMain.component);
            app.component('VuetifyExtendedDialogs', DialogRoot);
            app.component('VuetifyExtendedNotifications', NotificationRoot);
            app.provide('vuetify-extended', bootstrap);
            app.config.globalProperties.$vuetifyExtended = bootstrap;
            app.config.globalProperties.$appManager = appmanager_1.AppManager;
            app.config.globalProperties.$dialogs = dialogs_1.Dialogs;
            app.config.globalProperties.$notifications = notifications_1.Notifications;
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
exports.createVuetifyExtendedApp = createVuetifyExtendedApp;
function createVuetifyExtendedPlugin(options = {}) {
    return createVuetifyExtendedApp(options).plugin;
}
exports.createVuetifyExtendedPlugin = createVuetifyExtendedPlugin;
