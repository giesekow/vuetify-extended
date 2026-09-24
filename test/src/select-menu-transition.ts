import { createApp, defineComponent, h } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '../../src/css/index.css';
import { AppMain, AppManager, Master, $DF, $FM, $PT, $FD, createVuetifyExtendedApp } from '../../src';

const query = new URLSearchParams(location.search);
const kind = query.get('kind') || 'select';
const transition = query.get('transition');
const transitionParams = transition === 'false' ? { menuTransition: false as const } : transition ? { menuTransition: transition } : {};
const items = [{ id: 'message', name: 'message' }, { id: 'subject', name: 'subject' }];
const shell = new AppMain({ showFooter: false }, {});
const runtime = createVuetifyExtendedApp({ app: shell });
const root = createApp(defineComponent({ setup: () => () => h(runtime.component) }));
root.use(createVuetify({ components, directives })).use(runtime.plugin).mount('#app');
(window as any).openPreview = () => {
 const master = new Master(); master.$data = { testValues: [] };
 AppManager.showDialog($DF({ mode: 'create', closeOnSave: true }, {
 master,
 form: () => $FM({ title: 'Preview values', width: 820, mode: 'create', auto: true, sub: true }, {
 master,
 children: () => [$PT({ cols: 12, dense: true }, { children: () => [
 $FD({ storage: 'testValues', label: 'Preview values', type: 'collection', idField: 'placeholderCode', default: [], cols: 12, height: 300 }, {
 headers: () => [{ title: 'Placeholder', key: 'placeholderCode' }, { title: 'Test value', key: 'value' }],
 form: () => $FM({ title: 'Preview value', width: 680 }, { children: () => [
 $PT({ cols: 12, dense: true }, { children: () => [
 $FD({ storage: 'placeholderCode', label: 'Placeholder', type: kind === 'select' ? 'select' : 'autocomplete', serverSearch: kind === 'server', required: true, cols: 12, md: 4, lg: 4, ...transitionParams }, kind === 'server' ? {
 autocompleteSearch: async () => ({ items, total: items.length }),
 } : { selectOptions: () => items }),
 $FD({ storage: 'value', label: 'Test value', required: true, cols: 12, md: 8, lg: 8 }),
 ] }),
 ] }),
 }),
 ] })],
 }),
 }));
};
