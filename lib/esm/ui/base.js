var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Fragment, cloneVNode, defineComponent, h, ref, watch, onUnmounted, onMounted } from 'vue';
import { EventEmitter } from './lib';
export class BaseComponent extends EventEmitter {
    constructor() {
        super(...arguments);
        this.dataStore = {};
        this.forceRenderListeners = new Set();
    }
    get $makeRef() {
        return ref;
    }
    get $h() {
        return h;
    }
    get $watch() {
        return watch;
    }
    $get(key, def = null) {
        return this.dataStore[key] === undefined ? def : this.dataStore[key];
    }
    $set(key, value) {
        this.dataStore[key] = value;
    }
    $remove(key) {
        delete this.dataStore[key];
    }
    props() {
        return [];
    }
    render(props, context) {
        return h('div');
    }
    setup(props, context) {
    }
    forceRender() {
        this.forceRenderListeners.forEach((listener) => listener());
    }
    get component() {
        return defineComponent({
            props: this.props(),
            setup: (props, context) => {
                const renderVersion = ref(0);
                const rerender = () => {
                    renderVersion.value += 1;
                };
                context.expose({ $this: this });
                this.setup(props, context);
                onMounted(() => {
                    this.forceRenderListeners.add(rerender);
                    this.mounted();
                    this.attachEventListeners();
                });
                onUnmounted(() => {
                    this.forceRenderListeners.delete(rerender);
                    this.unmounted();
                    this.removeEventListeners();
                    this.destructor();
                });
                return () => {
                    const version = renderVersion.value;
                    const content = this.render(props, context);
                    if (Array.isArray(content)) {
                        return h(Fragment, { key: version }, content);
                    }
                    if (!content) {
                        return undefined;
                    }
                    return cloneVNode(content, Object.assign(Object.assign({}, context.attrs), { key: version }), true);
                };
            },
        });
    }
    destructor() { }
    mounted() { }
    unmounted() { }
    attachEventListeners() { }
    removeEventListeners() { }
}
export class UIBase extends BaseComponent {
    constructor() {
        super();
        this.uid = Symbol('id');
    }
    get $master() {
        if (this.master)
            return this.master;
        if (this.parent)
            return this.parent.$master;
    }
    get $id() {
        return this.uid;
    }
    get $parent() {
        return this.parent;
    }
    setParent(parent) {
        this.parent = parent;
    }
    setMaster(master) {
        this.master = master;
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
