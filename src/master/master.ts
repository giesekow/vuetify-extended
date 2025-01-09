import { EventEmitter } from "../ui/lib";

export interface MasterOptions {
  type?: string;
  id?: any;
  idField?: any;
  parent?: Master;

}

export class Master extends EventEmitter {
  private data: any = {}
  private itemId?: any;
  private itemType?: any;
  private parent?: Master;
  private idField?: any;
  private validates: any[] = [];
  private postprocesses: any[] = [];
  private preprocesses: any[] = [];

  constructor(options?: MasterOptions) {
    super();
    this.itemId = options?.id;
    this.itemType = options?.type;
    this.parent = options?.parent;
    this.idField = options?.idField || "_id";
  }

  get $type() {
    return this.itemType;
  }

  set $type(value: any) {
    this.itemType = value;
  }

  get $id() {
    return this.itemId;
  }

  set $id(value: any) {
    this.itemId = value;
  }

  set $data(data: any) {
    this.data = {...data};
    this.emit('changed', {});
  }

  get $data() {
    return this.data;
  }

  get $hasParent() {
    return this.parent ? true: false;
  }

  set $parent(parent: Master|undefined) {
    this.parent = parent;
  }

  get $parent(): Master|undefined {
    return this.parent;
  }

  addValidation(name: string, callback: any) {
    this.validates.push({name, callback});
  }

  removeValidation(name: string) {
    this.validates = this.validates.filter((v: any) => v.name !== name);
  }

  async validate(data: any): Promise<any> {
    for (let v = 0; v < this.validates.length; v++) {
      const r: any = await this.validates[v].callback(data);
      if (typeof r === "string") {
        return r;
      }
    }
    return true;
  }

  addPreprocess(name: string, callback: (master: Master, data: any) => Promise<any|undefined>|any|undefined) {
    this.preprocesses.push({name, callback});
  }

  addPostprocess(name: string, callback: (master: Master, data: any) => Promise<any|undefined>|any|undefined) {
    this.postprocesses.push({name, callback});
  }

  removePreprocess(name: string) {
    this.preprocesses = this.preprocesses.filter((v: any) => v.name !== name);
  }

  removePostprocess(name: string) {
    this.postprocesses = this.postprocesses.filter((v: any) => v.name !== name);
  }

  async preprocess(data: any) {
    let d: any = {...(data || {})};

    for (let v = 0; v < this.preprocesses.length; v++) {
      const r: any = await this.preprocesses[v].callback(d);
      if (r) d = r;
    }
    return d;
  }

  async postprocess(data: any) {
    let d: any = {...(data || {})};

    for (let v = 0; v < this.postprocesses.length; v++) {
      const r: any = await this.postprocesses[v].callback(d);
      if (r) d = r;
    }
    return d;
  }

  $set(key: string, data: any): void {
    this.emit('before-changed', {key, data})
    this.$np.set(this.data, key, data);
    this.emit('changed', {key, data});
    this.emit(`changed:${key}`, data);
  }

  $get (key: string, def?: any): any {
    const v = this.$np.get(this.data, key)
    return v === undefined ? (def === undefined ? v : def) : v;
  }

  $has (key: string, options?: any): boolean  {
    return this.$np.has(this.data, key, options);
  }

  $getCollectionObject(key: string, id: any, idField?: string): any {
    if (typeof id === "number") return this.$get(`${key}.${id}`);
    if (!id) return null;
    let items: any = this.$has(key) ? this.$get(key) : [];
    if (!Array.isArray(items)) items = [items];
    const kf: string = idField || "_id";
    const item = items.filter((i: any) => {
      const iid = this.$np.get(i, kf);
      return (iid || iid === 0) && iid.toString() === id.toString();
    })[0];
    return item;
  }

  $setCollectionObject(key: string, id: any, data: any, idField?: string): boolean {
    let items: any[] = this.$has(key) ? this.$get(key) : [];
    if (!Array.isArray(items)) items = [items];

    if (typeof id === "number") {
      if (id < items.length) {
        items.splice(id, 1, data);
        this.$set(key, items);
        return true;
      }
    }

    if (!id) return false;
    
    const kf: string = idField || "_id";
    const item = items.filter((i: any) => {
      const iid = this.$np.get(i, kf);
      return (iid || iid === 0) && iid.toString() === id.toString();
    })[0];

    if (item) {
      const index = items.indexOf(item);
      items.splice(index, 1, data);
      this.$set(key, items);
      return true;
    }

    return false;
  }

  $removeCollectionObject(key: string, ids: any, idField?: string): boolean {
    let items: any = this.$has(key) ? this.$get(key) : [];
    if (!Array.isArray(items)) items = [items];

    if(!Array.isArray(ids)) {
      const id = ids;
      if (typeof id === "number") {
        if (items.length > id) {
          items.splice(id, 1);
          this.$set(key, items);
          return true;
        }
        return false;
      }

      if (!id) return false;
      const kf: string = idField || "_id";
      
      const item = items.filter((i: any) => {
        const iid = this.$np.get(i, kf);
        return (iid || iid === 0) && iid.toString() === id.toString();
      })[0];
  
      if (item) {
        const index = items.indexOf(item);
        items.splice(index, 1);
        this.$set(key, items);
        return true;
      }
    } else {
      for (const id of ids) {

        if (typeof id === "number") {
          if (items.length > id) {
            items.splice(id, 1);
            this.$set(key, items);
            continue;
          } else {
            continue;
          }
        }
        if (!id) continue;
        
        const kf: string = idField || "_id";
        
        const item = items.filter((i: any) => {
          const iid = this.$np.get(i, kf);
          return iid && iid.toString() === id.toString();
        })[0];
    
        if (item) {
          const index = items.indexOf(item);
          items.splice(index, 1);    
          continue;
        }
      }

      this.$set(key, items);
      return true;
    }

    return false;
  }

  $addCollectionObject(key: string, item: any): void {
    let items: any = this.$has(key) ? this.$get(key) : [];
    if (!Array.isArray(items)) items = [items];
    items.push(item)
    this.$set(key, items);
  }

  toJSON() {
    return this.data;
  }

  private async saveSub() {
    try {
      const val: any = await this.validate(this.$data);
      if (typeof val === "string") {
        throw new Error(`Validation Error: ${val}`);
      }
      if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
        this.emit("before-saved", {type: this.itemType, id: this.itemId, idField: this.idField});
        const data: any = this.$data;
        if (this.parent.$setCollectionObject(this.itemType, this.itemId, data, this.idField)) {
          this.emit("saved", {type: this.itemType, id: this.itemId, idField: this.idField});
        } else {
          throw new Error('Unable to save object, Object does not exist');
        }
      } else if (this.parent && (this.itemType || this.itemType === "") && !(this.itemId || this.itemId === 0)) {
        this.emit("before-save", {store: this.itemType, id: this.itemId, idField: this.idField});
        const data: any = this.$data;
        this.parent.$addCollectionObject(this.itemType, data);
        this.emit("saved", {store: this.itemType, id: this.itemId, idField: this.idField});
      }
    } catch (error) {
      this.emit("error", {error, action: "save"});
    }
  }

  private async loadSub() {
    try {
      if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
        this.emit("before-loaded", {store: this.itemType, id: this.itemId, idField: this.idField});
        const data: any = this.parent.$getCollectionObject(this.itemType, this.itemId, this.idField);
        await this.$reset(data, this.itemId);
        this.emit("loaded", {store: this.itemType, id: this.itemId, idField: this.idField});
      }
    } catch (error) {
      this.emit("error", {error, action: "load"});
    }
  }

  private async removeSub() {
    try {
      if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
        this.emit("before-removed", {store: this.itemType, id: this.itemId, idField: this.idField});
        if (this.parent.$removeCollectionObject(this.itemType, this.itemId, this.idField)) {
          this.emit("removed", {store: this.itemType, id: this.itemId, idField: this.idField});
        } else {
          throw new Error('Unable to remove object, Object does not exist');
        }
      }
    } catch (error) {
      this.emit("error", {error, action: "remove"});
    }
  }

  private async save(mode?: string) {
    this.emit("before-saved", {type: this.itemType, id: this.itemId});

    if (this.itemType && (this.itemId || mode === "create")) {
      const postprocessedData = await this.postprocess(this.data);
      const data: any = mode === "create" ? await this.$app.service(this.itemType).create(postprocessedData) : await this.$app.service(this.itemType).patch(this.itemId, postprocessedData);
      this.data = data;
    }

    this.emit("saved", {type: this.itemType, id: this.itemId});
    this.emit("changed", {});
  }

  private async load() {
    this.emit("before-loaded", {type: this.itemType, id: this.itemId});
    
    if (this.itemType && this.itemId) {
      const data: any = await this.$app.service(this.itemType).get(this.itemId);
      await this.$reset(data, this.itemId);
    }

    this.emit("loaded", {type: this.itemType, id: this.itemId});
  }

  private async remove() {
    this.emit("before-removed", {type: this.itemType, id: this.itemId});

    const data: any = {};
    this.data = data;

    this.emit("removed", {type: this.itemType, id: this.itemId});
  }

  async $save(mode?: any): Promise<boolean|string> {
    try {
      const val: any = await this.validate(this.data);
      if (typeof val === "string") {
        throw new Error(`Validation Error: ${val}`);
      }

      if (this.$hasParent) {
        await this.saveSub();
      } else {
        await this.save(mode);
      }
      return true;
    } catch (error) {
      this.emit("error", {error, action: "save"});
      return (error as any).message;
    }
  }

  async $remove() {
    try {
      if (this.itemId || this.itemId === 0) {
        if (this.$hasParent) {
          await this.removeSub();
        } else {
          await this.remove();
        }
      }
    } catch (error) {
      this.emit("error", {error, action: "remove"});
    }
  }

  async $load() {
    try {
      
      if (this.$hasParent) {
        await this.loadSub();
      } else {
        await this.load();
      }
    } catch (error) {
      this.emit("error", {error, action: "load"});
    }
  }

  async $reset(data?: any, id?: any) {
    this.emit("before-reset", {data: data || {}, id});
    this.data = await this.preprocess(data);
    this.itemId = id;
    this.emit("reset", {data: this.data, id: this.itemId});
  }
}