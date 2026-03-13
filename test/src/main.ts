import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '../../src/css/index.css';
import './demo.css';
import { createVuetifyExtendedApp } from '../../src';
import { createDemoApp, installDemoApi } from './demos';

const bootstrap = createVuetifyExtendedApp({
  api: {
    type: 'instance',
    instance: installDemoApi(),
  },
  app: createDemoApp(),
  dialogs: {
    progressSize: 96,
    progressWidth: 10,
    successTimeout: 2400,
    warningTimeout: 3200,
    errorTimeout: 4200,
  },
  notifications: {
    location: 'top-right',
    maxVisible: 4,
    defaultTimeout: 3600,
  },
});

const vuetify = createVuetify({
  components,
  directives,
});

const Root = defineComponent({
  name: 'VuetifyExtendedTestApp',
  setup() {
    return () => [
      h(bootstrap.component),
      h(bootstrap.dialogs),
      h(bootstrap.notifications),
    ];
  },
});

createApp(Root).use(vuetify).use(bootstrap.plugin).mount('#app');
bootstrap.validate({ warn: true });
