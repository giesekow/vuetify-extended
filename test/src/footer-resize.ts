import { createApp, defineComponent, h, ref } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '../../src/css/index.css';
import { AppMain, createVuetifyExtendedApp } from '../../src';

const visible = ref(true);
const shell = new AppMain({ showFooter: false }, {
  footer: () => visible.value ? h('div', { id: 'footer-content' }, 'Footer content') : undefined,
});
const runtime = createVuetifyExtendedApp({ app: shell });
const root = createApp(defineComponent({ setup: () => () => h(runtime.component) }));
root.use(createVuetify({ components, directives })).use(runtime.plugin).mount('#app');
(window as any).footerTest = {
  show: (value: boolean) => { visible.value = value; },
  unmount: () => root.unmount(),
};
