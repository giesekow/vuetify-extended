import { EventEmitter } from "../ui/lib";
export interface MasterOptions {
    type?: string;
    id?: any;
    idField?: any;
    parent?: Master;
}
export declare class Master extends EventEmitter {
    private data;
    private itemId?;
    private itemType?;
    private parent?;
    private idField?;
    private validates;
    constructor(options?: MasterOptions);
    get $type(): any;
    set $type(value: any);
    get $id(): any;
    set $id(value: any);
    set $data(data: any);
    get $data(): any;
    get $hasParent(): boolean;
    set $parent(parent: Master | undefined);
    get $parent(): Master | undefined;
    addValidation(name: string, callback: any): void;
    removeValidation(name: string): void;
    validate(data: any): Promise<any>;
    $set(key: string, data: any): void;
    $get(key: string, def?: any): any;
    $has(key: string, options?: any): boolean;
    $getCollectionObject(key: string, id: any, idField?: string): any;
    $setCollectionObject(key: string, id: any, data: any, idField?: string): boolean;
    $removeCollectionObject(key: string, ids: any, idField?: string): boolean;
    $addCollectionObject(key: string, item: any): void;
    toJSON(): any;
    private saveSub;
    private loadSub;
    private removeSub;
    private save;
    private load;
    private remove;
    $save(mode?: any): Promise<boolean | string>;
    $remove(): Promise<void>;
    $load(): Promise<void>;
    $reset(data?: any, id?: any): Promise<void>;
}
