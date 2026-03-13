import { PrinterBase } from "../misc";
import { AppMain } from "./appmain";
import { ReportMode, UIBase } from "./base";
import { Collection } from "./collection";
import { DialogForm } from "./dialogform";
import { Field } from "./field";
import { EventEmitter } from "./lib";
import { Menu } from "./menu";
import { Report } from "./report";
import { Selector } from "./selector";



export class AppManager {
  
  private static app: AppMain
  private static printer: PrinterBase
  private static channel: EventEmitter
  private static appData: any = {}

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

  static showMenu(menu: Menu, params?: any): Boolean {
    if (AppManager.app) {
      AppManager.app.$showMenu(menu, params);
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
  
  static showCollection(collection: Collection, params?: any, replace?: boolean) {
    if (AppManager.app) {
      AppManager.app.$showCollection(collection, params, replace);
      return true;
    }
    return false;
  }
  
  static showReport(report: Report, params?: any, replace?: boolean) {
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

  static showUI(ui: UIBase, params?: any, replace?: boolean) {
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
}
