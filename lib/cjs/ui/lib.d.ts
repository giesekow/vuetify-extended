import { Application } from '../declarations';
export interface CustomEventHandler {
    isOnce: boolean;
    ref?: string | symbol;
    callback: EventListener;
}
export interface OnHandler {
    [key: string]: EventListener;
}
export declare class EventEmitter {
    private _events;
    on(name: string, listener: EventListener, reference?: string | symbol): void;
    once(name: string, listener: EventListener, reference?: string | symbol): void;
    removeListener(name: string, listenerToRemove?: EventListener): void;
    clearListeners(reference?: string | symbol): void;
    emit(name: string, data?: any): void;
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
