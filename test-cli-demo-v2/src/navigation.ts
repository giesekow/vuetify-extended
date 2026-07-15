import { AppManager, type NavigationEntry } from 'vuetify-extended';
import { createHomeReport } from './pages/home';
import { createPeopleReport } from './pages/people';
import { createFinderTrigger } from './pages/finder';
import { createOrdersCollection } from './pages/orders';
import { createOpsDashboard } from './pages/ops';

type DemoMode = 'create' | 'edit' | 'display';

function resolveMode(entry: NavigationEntry | undefined, fallback: DemoMode): DemoMode {
  const mode = entry?.mode;
  return mode === 'create' || mode === 'edit' || mode === 'display' ? mode : fallback;
}

export function registerDemoScreens() {
  AppManager.registerScreen('pages.home.report.display', {
    type: 'report',
    create: (entry) => createHomeReport(resolveMode(entry, 'display'))(entry),
  });

  AppManager.registerScreen('pages.people.report.display', {
    type: 'report',
    create: (entry) => createPeopleReport(resolveMode(entry, 'display'))(entry),
  });

  AppManager.registerScreen('pages.finder.trigger.edit', {
    type: 'trigger',
    create: (entry) => createFinderTrigger(resolveMode(entry, 'edit'))(entry),
  });

  AppManager.registerScreen('pages.orders.collection.edit', {
    type: 'collection',
    create: (entry) => createOrdersCollection(resolveMode(entry, 'edit'))(entry),
  });

  AppManager.registerScreen('pages.ops.ui', {
    type: 'ui',
    create: (entry) => createOpsDashboard()(entry),
  });
}
