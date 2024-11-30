import { Application as FeathersApplication } from '@feathersjs/feathers';
export type Application = FeathersApplication;
declare module '@feathersjs/feathers' {
    interface ServiceAddons {
        findOne(params: any): Promise<any>;
        findAll(params: any): Promise<any[]>;
        count(params: any): Promise<number>;
    }
}
