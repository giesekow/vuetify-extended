import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import 'vuetify-extended/lib/esm/css/index.css';
import { bootstrap } from './bootstrap';

const vuetify = createVuetify({
  components,
  directives,
});

const Root = defineComponent({
  name: 'VuetifyExtendedStarterTemplate',
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
