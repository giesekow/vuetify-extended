// For more information about this file see https://dove.feathersjs.com/guides/cli/typescript.html
import type { Application as FeathersApplication } from '@feathersjs/feathers'

// Extend Application to include EventEmitter methods
export interface PatchedApplication extends FeathersApplication {
  on(event: string, listener: (...args: any[]) => void): this;
  once(event: string, listener: (...args: any[]) => void): this;
}

export type Application = PatchedApplication

// The context for hook functions - can be typed with a service class
declare module '@feathersjs/feathers' {
    interface ServiceAddons {
        findOne(params: any): Promise<any>;
        findAll(params: any): Promise<any[]>;
        count(params: any): Promise<number>;
    }
}
