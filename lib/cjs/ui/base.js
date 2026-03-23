"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIBase = exports.BaseComponent = void 0;
const vue_1 = require("vue");
const lib_1 = require("./lib");
class BaseComponent extends lib_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.dataStore = {};
        this.renderVersion = (0, vue_1.ref)(0);
    }
    get $makeRef() {
        return vue_1.ref;
    }
    get $h() {
        return vue_1.h;
    }
    get $watch() {
        return vue_1.watch;
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
        return (0, vue_1.h)('div');
    }
    setup(props, context) {
    }
    forceRender() {
        this.renderVersion.value += 1;
    }
    get component() {
        return (0, vue_1.defineComponent)({
            props: this.props(),
            setup: (props, context) => {
                context.expose({ $this: this });
                this.setup(props, context);
                (0, vue_1.onMounted)(() => {
                    this.mounted();
                    this.attachEventListeners();
                });
                (0, vue_1.onUnmounted)(() => {
                    this.unmounted();
                    this.removeEventListeners();
                    this.destructor();
                });
                return () => {
                    const version = this.renderVersion.value;
                    const content = this.render(props, context);
                    if (Array.isArray(content)) {
                        return (0, vue_1.h)(vue_1.Fragment, { key: version }, content);
                    }
                    if (!content) {
                        return undefined;
                    }
                    return (0, vue_1.cloneVNode)(content, Object.assign(Object.assign({}, context.attrs), { key: version }), true);
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
exports.BaseComponent = BaseComponent;
class UIBase extends BaseComponent {
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
exports.UIBase = UIBase;
