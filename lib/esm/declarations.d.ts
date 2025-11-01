import type { Application as FeathersApplication } from '@feathersjs/feathers';
export interface PatchedApplication extends FeathersApplication {
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
}
export type Application = PatchedApplication;
declare module '@feathersjs/feathers' {
    interface ServiceAddons {
        findOne(params: any): Promise<any>;
        findAll(params: any): Promise<any[]>;
        count(params: any): Promise<number>;
    }
}
