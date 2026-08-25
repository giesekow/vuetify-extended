import { Application } from '../declarations';
export interface CustomEventHandler {
    isOnce: boolean;
    ref?: string | symbol;
    callback: UIEventListener;
}
export type UIEventListener = (...args: any[]) => any;
export interface OnHandler {
    [key: string]: UIEventListener;
}
export declare class EventEmitter {
    private _events;
    on(name: string, listener: UIEventListener, reference?: string | symbol): void;
    once(name: string, listener: UIEventListener, reference?: string | symbol): void;
    removeListener(name: string, listenerToRemove?: UIEventListener): void;
    clearListeners(reference?: string | symbol): void;
    emit(name: string, ...args: any[]): void;
    get $np(): {
        get(object: any, property: string): any;
        has(object: any, property: string, options?: {
            own: boolean;
        } | undefined): boolean;
        set(object: any, property: string, value: any): any;
        isInNestedProperty(object: any, property: string, objectInPath: any, options?: {
            validPath: boolean;
        } | undefined): boolean;
        ObjectPrototypeMutationError: ErrorConstructor;
    };
    get $app(): Application;
}
