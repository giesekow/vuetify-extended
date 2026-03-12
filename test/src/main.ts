import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '../../src/css/index.css';
import './demo.css';
import { AppManager, Dialogs } from '../../src';
import { createDemoApp, installDemoApi } from './demos';

installDemoApi();
AppManager.init();

const appMain = createDemoApp();
AppManager.setApp(appMain);

Dialogs.setOptions({
  progressSize: 96,
  progressWidth: 10,
  successTimeout: 2400,
  warningTimeout: 3200,
  errorTimeout: 4200,
});

const vuetify = createVuetify({
  components,
  directives,
});

const Root = defineComponent({
  name: 'VuetifyExtendedTestApp',
  setup() {
    return () => [
      h(appMain.component),
      h(Dialogs.confirmComponent()),
      h(Dialogs.successComponent()),
      h(Dialogs.errorComponent()),
      h(Dialogs.warningComponent()),
      h(Dialogs.progressComponent()),
    ];
  },
});

createApp(Root).use(vuetify).mount('#app');
