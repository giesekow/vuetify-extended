import { VNode, defineComponent, h, ref, watch, onUnmounted, onMounted } from 'vue';
import { EventEmitter } from './lib';
import { Master } from '../master';

export class BaseComponent extends EventEmitter {
  private dataStore: any = {};

  get $makeRef() {
    return ref;
  }

  get $h() {
    return h;
  }

  get $watch() {
    return watch;
  }

  $get(key: any, def: any = null): any {
    return this.dataStore[key] === undefined ? def : this.dataStore[key]
  }

  $set(key: any, value: any) {
    this.dataStore[key] = value
  }

  $remove(key: any) {
    delete this.dataStore[key];
  }

  props () {
    return [];
  }

  render(props: any, context: any): VNode|VNode[]|undefined {
    return h('div');
  }

  setup(props: any, context: any) {
  }

  get component () {
    return defineComponent({
      props: this.props(),
      setup: (props, context) => {

        context.expose({$this: this});

        this.setup(props, context);

        onMounted(() => {
          this.mounted();
          this.attachEventListeners();
        });
    
        onUnmounted(() => {
          this.unmounted();
          this.removeEventListeners();
          this.destructor();
        })
        
        return () => this.render(props, context);
      },
    })
  }

  destructor() {}

  mounted() {}

  unmounted() {}

  attachEventListeners() {}

  removeEventListeners() {}
}

export type ReportMode = "display"|"edit"|"create";

export class UIBase extends BaseComponent {

  private parent!: UIBase;
  private master?: Master;
  private uid: symbol;

  constructor() {
    super();
    this.uid = Symbol('id');
  }

  get $master(): Master|undefined {
    if (this.master) return this.master;
    if (this.parent) return this.parent.$master;
  }

  get $id(): symbol {
    return this.uid;
  }

  get $parent (): BaseComponent {
    return this.parent;
  }

  setParent(parent: UIBase) {
    this.parent = parent;
  }

  setMaster(master: Master) {
    this.master = master;
  }

  async show() {}

  async hide() {}

  async forceCancel() {}
}