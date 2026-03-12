import type { Application, Service } from '../../src/declarations';

type Listener = (...args: any[]) => void;
type Store = Record<string, any[]>;

class TinyEmitter {
  private events: Record<string, Array<{ listener: Listener; once: boolean }>> = {};

  on(event: string, listener: Listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ listener, once: false });
  }

  once(event: string, listener: Listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push({ listener, once: true });
  }

  emit(event: string, ...args: any[]) {
    const listeners = this.events[event] || [];
    this.events[event] = listeners.filter((entry) => !entry.once);
    listeners.forEach((entry) => entry.listener(...args));
  }
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function readPath(source: any, path: string) {
  return path.split('.').reduce((current, part) => (current == null ? current : current[part]), source);
}

function writePath(source: any, path: string, value: any) {
  const parts = path.split('.');
  let current = source;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[parts[parts.length - 1]] = value;
}

function isOperatorObject(value: any) {
  if (!value || Array.isArray(value) || typeof value !== 'object') {
    return false;
  }
  return Object.keys(value).some((key) => key.startsWith('$'));
}

function matchesCondition(actual: any, expected: any): boolean {
  if (isOperatorObject(expected)) {
    if ('$regex' in expected) {
      const expression = new RegExp(expected.$regex, expected.$options || '');
      return expression.test(String(actual ?? ''));
    }
    if ('$in' in expected) {
      const source = Array.isArray(actual) ? actual : [actual];
      return source.some((value) => expected.$in.includes(value));
    }
    if ('$ne' in expected) {
      return actual !== expected.$ne;
    }
    if ('$eq' in expected) {
      return actual === expected.$eq;
    }
  }

  if (Array.isArray(expected)) {
    return expected.includes(actual);
  }

  return actual === expected;
}

function matchesQuery(item: any, query: Record<string, any>) {
  return Object.entries(query).every(([key, value]) => {
    if (['$limit', '$skip', '$sort', '$paginate', '$select'].includes(key)) {
      return true;
    }

    if (key === '$or') {
      return Array.isArray(value) ? value.some((entry) => matchesQuery(item, entry)) : true;
    }

    if (key === '$and') {
      return Array.isArray(value) ? value.every((entry) => matchesQuery(item, entry)) : true;
    }

    return matchesCondition(readPath(item, key), value);
  });
}

function sortItems(items: any[], sort: Record<string, 1 | -1> | undefined) {
  if (!sort) {
    return items;
  }

  const entries = Object.entries(sort);
  return [...items].sort((left, right) => {
    for (const [path, direction] of entries) {
      const leftValue = readPath(left, path);
      const rightValue = readPath(right, path);
      if (leftValue === rightValue) {
        continue;
      }
      if (leftValue == null) {
        return direction === 1 ? -1 : 1;
      }
      if (rightValue == null) {
        return direction === 1 ? 1 : -1;
      }
      if (leftValue > rightValue) {
        return direction === 1 ? 1 : -1;
      }
      if (leftValue < rightValue) {
        return direction === 1 ? -1 : 1;
      }
    }
    return 0;
  });
}

function selectFields(items: any[], fields: string[] | undefined) {
  if (!fields || fields.length === 0) {
    return items;
  }

  return items.map((item) => {
    const selected: any = {};
    if (item._id !== undefined) {
      selected._id = item._id;
    }
    fields.forEach((field) => {
      writePath(selected, field, readPath(item, field));
    });
    return selected;
  });
}

class MemoryService extends TinyEmitter implements Service<any> {
  constructor(private readonly path: string, private readonly store: Store) {
    super();
  }

  private records() {
    if (!this.store[this.path]) {
      this.store[this.path] = [];
    }
    return this.store[this.path];
  }

  private nextId() {
    return `${this.path}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  private normalize(params?: any) {
    const query = clone(params?.query || {});
    const limit = query.$limit ?? 10;
    const skip = query.$skip ?? 0;
    const paginate = query.$paginate !== false;
    const sort = query.$sort;
    const select = query.$select;
    delete query.$limit;
    delete query.$skip;
    delete query.$paginate;
    delete query.$sort;
    delete query.$select;

    let items = this.records().filter((item) => matchesQuery(item, query));
    items = sortItems(items, sort);
    const total = items.length;
    const paged = paginate ? (limit < 0 ? items : items.slice(skip, skip + limit)) : items;
    const selected = selectFields(paged, select);

    return {
      items: selected.map((item) => clone(item)),
      total,
      limit,
      skip,
      paginate,
    };
  }

  async find(params?: any) {
    const result = this.normalize(params);
    if (!result.paginate) {
      return result.items;
    }
    return {
      total: result.total,
      limit: result.limit,
      skip: result.skip,
      data: result.items,
    };
  }

  async findOne(params?: any) {
    const items = await this.findAll(params);
    return items[0];
  }

  async findAll(params?: any) {
    const result = await this.find({
      ...params,
      query: {
        ...(params?.query || {}),
        $paginate: false,
      },
    });
    return Array.isArray(result) ? result : result.data || [];
  }

  async count(params?: any) {
    return this.normalize(params).total;
  }

  async get(id: any) {
    const item = this.records().find((entry) => String(entry._id) === String(id));
    if (!item) {
      throw new Error(`Record not found in ${this.path}: ${id}`);
    }
    return clone(item);
  }

  async create(data: any) {
    const item = clone(data || {});
    if (item._id === undefined || item._id === null || item._id === '') {
      item._id = this.nextId();
    }
    this.records().push(item);
    this.emit('created', clone(item));
    return clone(item);
  }

  async update(id: any, data: any) {
    const index = this.records().findIndex((entry) => String(entry._id) === String(id));
    if (index < 0) {
      throw new Error(`Record not found in ${this.path}: ${id}`);
    }
    const next = { ...clone(data), _id: id };
    this.records().splice(index, 1, next);
    this.emit('updated', clone(next));
    return clone(next);
  }

  async patch(id: any, data: any) {
    const index = this.records().findIndex((entry) => String(entry._id) === String(id));
    if (index < 0) {
      throw new Error(`Record not found in ${this.path}: ${id}`);
    }
    const next = { ...this.records()[index], ...clone(data), _id: id };
    this.records().splice(index, 1, next);
    this.emit('patched', clone(next));
    return clone(next);
  }

  async remove(id: any) {
    const index = this.records().findIndex((entry) => String(entry._id) === String(id));
    if (index < 0) {
      throw new Error(`Record not found in ${this.path}: ${id}`);
    }
    const [removed] = this.records().splice(index, 1);
    this.emit('removed', clone(removed));
    return clone(removed);
  }
}

export class MemoryApi extends TinyEmitter implements Application {
  private services = new Map<string, MemoryService>();
  authentication = { strategy: 'memory' };
  keycloak = undefined;

  constructor(private readonly store: Store) {
    super();
  }

  service<T = any>(path: string): Service<T> {
    if (!this.services.has(path)) {
      this.services.set(path, new MemoryService(path, this.store));
    }
    return this.services.get(path)! as Service<T>;
  }

  async authenticated() {
    return true;
  }

  async authenticate() {
    return { accessToken: 'memory-token' };
  }

  async login() {
    return { accessToken: 'memory-token' };
  }

  async logout() {
    return true;
  }

  async reAuthenticate() {
    return { accessToken: 'memory-token' };
  }

  async accountManagement() {
    return true;
  }

  async register() {
    return true;
  }

  hasRealmRole() {
    return true;
  }

  hasResourceRole() {
    return true;
  }

  async loadUserInfo() {
    return { preferred_username: 'demo-user' };
  }

  async loadUserProfile() {
    return { username: 'demo-user' };
  }

  hasPermission() {
    return true;
  }
}
