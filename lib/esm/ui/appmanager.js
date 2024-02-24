var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "./lib";
export class AppManager {
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
        AppManager.channel = new EventEmitter();
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
    static showMenu(menu, params) {
        if (AppManager.app) {
            AppManager.app.$showMenu(menu, params);
            return true;
        }
        return false;
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
    static showCollection(collection, params) {
        if (AppManager.app) {
            AppManager.app.$showCollection(collection, params);
            return true;
        }
        return false;
    }
    static showReport(report, params) {
        if (AppManager.app) {
            AppManager.app.$showReport(report, params);
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
    static showUI(ui, params) {
        if (AppManager.app) {
            AppManager.app.$showUI(ui, params);
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
}
AppManager.appData = {};
