import type { Application as FeathersApplication, Service as FeathersService, ServiceAddons as FeathersServiceAddons } from '@feathersjs/feathers';
/**
 * Extend the Service interface to include EventEmitter methods
 */
export interface Service<T = any> extends FeathersService<T> {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
}
export interface PatchedApplication extends FeathersApplication {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
    service<T = any>(path: string): Service<T> & FeathersServiceAddons;
}
export type Application = PatchedApplication;
declare module '@feathersjs/feathers' {
    interface ServiceAddons {
        findOne(params: any): Promise<any>;
        findAll(params: any): Promise<any[]>;
        count(params: any): Promise<number>;
    }
}
