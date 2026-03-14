var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from "../ui/lib";
export class Master extends EventEmitter {
    constructor(options) {
        super();
        this.data = {};
        this.validates = [];
        this.postprocesses = [];
        this.preprocesses = [];
        const resolvedOptions = Object.assign(Object.assign({}, Master.defaultOptions), (options || {}));
        this.itemId = resolvedOptions.id;
        this.itemType = resolvedOptions.type;
        this.parent = resolvedOptions.parent;
        this.idField = resolvedOptions.idField || '_id';
    }
    static setDefault(value, reset) {
        if (reset) {
            Master.defaultOptions = Object.assign({}, value);
        }
        else {
            Master.defaultOptions = Object.assign(Object.assign({}, Master.defaultOptions), value);
        }
        if (!Master.defaultOptions.idField) {
            Master.defaultOptions.idField = '_id';
        }
    }
    get $type() {
        return this.itemType;
    }
    set $type(value) {
        this.itemType = value;
    }
    get $id() {
        return this.itemId;
    }
    set $id(value) {
        this.itemId = value;
    }
    get $idField() {
        return this.idField;
    }
    set $idField(value) {
        this.idField = value;
    }
    set $data(data) {
        this.data = Object.assign({}, data);
        this.emit('changed', {});
    }
    get $data() {
        return this.data;
    }
    get $hasParent() {
        return this.parent ? true : false;
    }
    set $parent(parent) {
        this.parent = parent;
    }
    get $parent() {
        return this.parent;
    }
    addValidation(name, callback) {
        this.validates.push({ name, callback });
    }
    removeValidation(name) {
        this.validates = this.validates.filter((v) => v.name !== name);
    }
    validate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let v = 0; v < this.validates.length; v++) {
                const r = yield this.validates[v].callback(data);
                if (typeof r === "string") {
                    return r;
                }
            }
            return true;
        });
    }
    addPreprocess(name, callback) {
        this.preprocesses.push({ name, callback });
    }
    addPostprocess(name, callback) {
        this.postprocesses.push({ name, callback });
    }
    removePreprocess(name) {
        this.preprocesses = this.preprocesses.filter((v) => v.name !== name);
    }
    removePostprocess(name) {
        this.postprocesses = this.postprocesses.filter((v) => v.name !== name);
    }
    preprocess(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = Object.assign({}, (data || {}));
            for (let v = 0; v < this.preprocesses.length; v++) {
                const r = yield this.preprocesses[v].callback(d);
                if (r)
                    d = r;
            }
            return d;
        });
    }
    postprocess(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = Object.assign({}, (data || {}));
            for (let v = 0; v < this.postprocesses.length; v++) {
                const r = yield this.postprocesses[v].callback(d);
                if (r)
                    d = r;
            }
            return d;
        });
    }
    $set(key, data) {
        this.emit('before-changed', { key, data });
        this.$np.set(this.data, key, data);
        this.emit('changed', { key, data });
        this.emit(`changed:${key}`, data);
    }
    $get(key, def) {
        const v = this.$np.get(this.data, key);
        return v === undefined ? (def === undefined ? v : def) : v;
    }
    $has(key, options) {
        return this.$np.has(this.data, key, options);
    }
    $getCollectionObject(key, id, idField) {
        if (typeof id === "number")
            return this.$get(`${key}.${id}`);
        if (!id)
            return null;
        let items = this.$has(key) ? this.$get(key) : [];
        if (!Array.isArray(items))
            items = [items];
        const kf = idField || "_id";
        const item = items.filter((i) => {
            const iid = this.$np.get(i, kf);
            return (iid || iid === 0) && iid.toString() === id.toString();
        })[0];
        return item;
    }
    $setCollectionObject(key, id, data, idField) {
        let items = this.$has(key) ? this.$get(key) : [];
        if (!Array.isArray(items))
            items = [items];
        if (typeof id === "number") {
            if (id < items.length) {
                items.splice(id, 1, data);
                this.$set(key, items);
                return true;
            }
        }
        if (!id)
            return false;
        const kf = idField || "_id";
        const item = items.filter((i) => {
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
    $removeCollectionObject(key, ids, idField) {
        let items = this.$has(key) ? this.$get(key) : [];
        if (!Array.isArray(items))
            items = [items];
        if (!Array.isArray(ids)) {
            const id = ids;
            if (typeof id === "number") {
                if (items.length > id) {
                    items.splice(id, 1);
                    this.$set(key, items);
                    return true;
                }
                return false;
            }
            if (!id)
                return false;
            const kf = idField || "_id";
            const item = items.filter((i) => {
                const iid = this.$np.get(i, kf);
                return (iid || iid === 0) && iid.toString() === id.toString();
            })[0];
            if (item) {
                const index = items.indexOf(item);
                items.splice(index, 1);
                this.$set(key, items);
                return true;
            }
        }
        else {
            for (const id of ids) {
                if (typeof id === "number") {
                    if (items.length > id) {
                        items.splice(id, 1);
                        this.$set(key, items);
                        continue;
                    }
                    else {
                        continue;
                    }
                }
                if (!id)
                    continue;
                const kf = idField || "_id";
                const item = items.filter((i) => {
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
    $addCollectionObject(key, item) {
        let items = this.$has(key) ? this.$get(key) : [];
        if (!Array.isArray(items))
            items = [items];
        items.push(item);
        this.$set(key, items);
    }
    toJSON() {
        return this.data;
    }
    saveSub() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const val = yield this.validate(this.$data);
                if (typeof val === "string") {
                    throw new Error(`Validation Error: ${val}`);
                }
                if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
                    this.emit("before-saved", { type: this.itemType, id: this.itemId, idField: this.idField });
                    const data = this.$data;
                    if (this.parent.$setCollectionObject(this.itemType, this.itemId, data, this.idField)) {
                        this.emit("saved", { type: this.itemType, id: this.itemId, idField: this.idField });
                    }
                    else {
                        throw new Error('Unable to save object, Object does not exist');
                    }
                }
                else if (this.parent && (this.itemType || this.itemType === "") && !(this.itemId || this.itemId === 0)) {
                    this.emit("before-save", { store: this.itemType, id: this.itemId, idField: this.idField });
                    const data = this.$data;
                    this.parent.$addCollectionObject(this.itemType, data);
                    this.emit("saved", { store: this.itemType, id: this.itemId, idField: this.idField });
                }
            }
            catch (error) {
                this.emit("error", { error, action: "save" });
            }
        });
    }
    loadSub() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
                    this.emit("before-loaded", { store: this.itemType, id: this.itemId, idField: this.idField });
                    const data = this.parent.$getCollectionObject(this.itemType, this.itemId, this.idField);
                    yield this.$reset(data, this.itemId);
                    this.emit("loaded", { store: this.itemType, id: this.itemId, idField: this.idField });
                }
            }
            catch (error) {
                this.emit("error", { error, action: "load" });
            }
        });
    }
    removeSub() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.parent && (this.itemType || this.itemType === "") && (this.itemId || this.itemId === 0)) {
                    this.emit("before-removed", { store: this.itemType, id: this.itemId, idField: this.idField });
                    if (this.parent.$removeCollectionObject(this.itemType, this.itemId, this.idField)) {
                        this.emit("removed", { store: this.itemType, id: this.itemId, idField: this.idField });
                    }
                    else {
                        throw new Error('Unable to remove object, Object does not exist');
                    }
                }
            }
            catch (error) {
                this.emit("error", { error, action: "remove" });
            }
        });
    }
    save(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("before-saved", { type: this.itemType, id: this.itemId });
            if (this.itemType && (this.itemId || mode === "create")) {
                const postprocessedData = yield this.postprocess(this.data);
                const data = mode === "create" ? yield this.$app.service(this.itemType).create(postprocessedData) : yield this.$app.service(this.itemType).patch(this.itemId, postprocessedData);
                this.data = data;
            }
            this.emit("saved", { type: this.itemType, id: this.itemId });
            this.emit("changed", {});
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("before-loaded", { type: this.itemType, id: this.itemId });
            if (this.itemType && this.itemId) {
                const data = yield this.$app.service(this.itemType).get(this.itemId);
                yield this.$reset(data, this.itemId);
            }
            this.emit("loaded", { type: this.itemType, id: this.itemId });
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("before-removed", { type: this.itemType, id: this.itemId });
            const data = {};
            this.data = data;
            this.emit("removed", { type: this.itemType, id: this.itemId });
        });
    }
    $save(mode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const val = yield this.validate(this.data);
                if (typeof val === "string") {
                    throw new Error(`Validation Error: ${val}`);
                }
                if (this.$hasParent) {
                    yield this.saveSub();
                }
                else {
                    yield this.save(mode);
                }
                return true;
            }
            catch (error) {
                this.emit("error", { error, action: "save" });
                return error.message;
            }
        });
    }
    $remove() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.itemId || this.itemId === 0) {
                    if (this.$hasParent) {
                        yield this.removeSub();
                    }
                    else {
                        yield this.remove();
                    }
                }
            }
            catch (error) {
                this.emit("error", { error, action: "remove" });
            }
        });
    }
    $load() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.$hasParent) {
                    yield this.loadSub();
                }
                else {
                    yield this.load();
                }
            }
            catch (error) {
                this.emit("error", { error, action: "load" });
            }
        });
    }
    $reset(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit("before-reset", { data: data || {}, id });
            this.data = yield this.preprocess(data);
            this.itemId = id;
            this.emit("reset", { data: this.data, id: this.itemId });
        });
    }
}
Master.defaultOptions = {
    idField: '_id',
};
