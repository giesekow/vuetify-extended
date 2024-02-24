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
exports.$PT = exports.Part = void 0;
const base_1 = require("./base");
const components_1 = require("vuetify/components");
const field_1 = require("./field");
class Part extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.childrenInstances = [];
        this.cnt = 0;
        this.params = this.$makeRef(params || {});
        this.options = options || {};
        if (options === null || options === void 0 ? void 0 : options.master)
            this.setMaster(options === null || options === void 0 ? void 0 : options.master);
    }
    get $refs() {
        const items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            if (this.childrenInstances[i] instanceof field_1.Field) {
                const ref = this.childrenInstances[i].$ref;
                if (ref && ref !== '') {
                    items[ref] = this.childrenInstances[i];
                }
            }
        }
        return items;
    }
    get $prefs() {
        const items = {};
        for (let i = 0; i < this.childrenInstances.length; i++) {
            if (this.childrenInstances[i] instanceof Part) {
                const ref = this.childrenInstances[i].$ref;
                if (ref && ref !== '') {
                    items[ref] = this.childrenInstances[i];
                }
            }
        }
        return items;
    }
    get $ref() {
        return this.params.value.ref;
    }
    get $readonly() {
        if (this.params.value.readonly === true || this.params.value.readonly === false)
            return this.params.value.readonly;
        if (this.$parent && this.$parent.$readonly)
            return this.$parent.$readonly;
        return this.params.value.readonly;
    }
    get $parentReport() {
        return this.$parent ? this.$parent.$parentReport : undefined;
    }
    setParams(params) {
        this.params.value = Object.assign(Object.assign({}, this.params.value), params);
    }
    get $params() {
        return this.params.value;
    }
    props() {
        return [];
    }
    topChildren(props, context) {
        return [];
    }
    bottomChildren(props, context) {
        return [];
    }
    children(props, context) {
        return [];
    }
    render(props, context) {
        const h = this.$h;
        if (this.params.value.invisible) {
            return;
        }
        return h(components_1.VCol, {
            cols: this.params.value.cols || 12,
            lg: this.params.value.lg,
            xs: this.params.value.xs,
            md: this.params.value.md,
            xl: this.params.value.xl,
            xxl: this.params.value.xxl,
            sm: this.params.value.sm
        }, () => this.build(props, context));
    }
    build(props, context) {
        this.childrenInstances.forEach((instance) => {
            instance.removeEventListeners();
        });
        this.childrenInstances = [];
        return this.$h(components_1.VRow, {
            justify: this.params.value.justify,
            align: this.params.value.align,
            dense: this.params.value.dense,
            alignContent: this.params.value.alignContent,
        }, () => {
            const top = this.options.topChildren ? this.options.topChildren(props, context) : this.topChildren(props, context);
            const ch = this.options.children ? this.options.children(props, context) : this.children(props, context);
            const bot = this.options.bottomChildren ? this.options.bottomChildren(props, context) : this.bottomChildren(props, context);
            this.childrenInstances = top.concat(ch).concat(bot);
            this.childrenInstances.forEach((instance) => {
                instance.setParent(this);
            });
            return this.childrenInstances.map((instance) => this.$h(instance.component));
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.params.value.invisible)
                return undefined;
            if (this.options.validate) {
                const v = yield this.options.validate(this);
                if (typeof v === 'string')
                    return v;
            }
            for (let i = 0; i < this.childrenInstances.length; i++) {
                const v = yield this.childrenInstances[i].validate();
                if (typeof v === 'string')
                    return v;
            }
        });
    }
    setup(props, context) {
        if (this.options.setup)
            this.options.setup(this);
        this.handleOn('setup', this);
    }
    handleOn(event, data) {
        if (this.options.on) {
            const events = this.options.on(this);
            if (events[event]) {
                events[event](data);
            }
        }
        this.emit(event, data);
    }
}
exports.Part = Part;
const $PT = (params, options) => new Part(params || {}, options || {});
exports.$PT = $PT;
