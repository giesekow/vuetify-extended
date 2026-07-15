import { ref, watch } from 'vue';
import type { VuetifyExtendedI18nAdapter } from 'vuetify-extended';

type LocaleCode = 'en' | 'de';
const LOCALE_STORAGE_KEY = 'vuetify-extended-cli-demo-v2-locale';

const messages: Record<LocaleCode, Record<string, string>> = {
  en: {
    've.common.cancel': 'Cancel',
    've.common.close': 'Close',
    've.common.confirm': 'Confirm',
    've.common.download': 'Download',
    've.common.edit': 'Edit',
    've.common.export': 'Export',
    've.common.finish': 'Finish',
    've.common.next': 'Next',
    've.common.no': 'No',
    've.common.open': 'Open',
    've.common.prev': 'Prev',
    've.common.print': 'Print',
    've.common.remove': 'Remove',
    've.common.save': 'Save',
    've.common.view': 'View',
    've.common.yes': 'Yes',
    've.mode.create': 'Create',
    've.mode.edit': 'Edit',
    've.mode.display': 'Display',
    've.report.progress': 'Progress',
    've.report.stepOf': 'Step {current} of {total}',
    'bootstrap.app.title': 'CLI Demo Workspace',
    'bootstrap.header.title': 'CLI Demo Workspace',
    'bootstrap.header.subtitle': 'Navigation + translation smoke test',
    'bootstrap.header.overline': 'Workspace',
    'bootstrap.header.environment': 'English',
    'bootstrap.header.status': 'Ready',
    'bootstrap.header.end.action.title': 'Toggle Language',
    'bootstrap.header.end.action.clicked': 'Toggle Language clicked.',
    'bootstrap.header.end.action.changed': 'Language switched.',
    'bootstrap.header.end.user.action.language': 'Switch Language',
    'bootstrap.header.end.user.action.language.changed': 'Language switched.',
    'bootstrap.header.end.user.action.theme': 'Switch to Dark Mode',
    'bootstrap.header.end.user.action.theme.dark': 'Switch to Dark Mode',
    'bootstrap.header.end.user.action.theme.light': 'Switch to Light Mode',
    'bootstrap.header.end.user.action.theme.changed.dark': 'Dark mode enabled.',
    'bootstrap.header.end.user.action.theme.changed.light': 'Light mode enabled.',
    'bootstrap.menu.title': 'Workspace',
    'menus.settings.title': 'Settings',
    'menus.settings.entry.text': 'Settings',
    'menus.settings.entry.subText': 'Open workspace settings tools.',
    'pages.home.report.title': 'Home',
    'pages.home.menu.report.display.text': 'Home',
    'pages.home.menu.report.display.subText': 'Starter page entry from src/pages/home.',
    'pages.people.report.title': 'People Workspace',
    'pages.people.menu.report.display.text': 'People',
    'pages.people.menu.report.display.subText': 'Open the people report.',
    'pages.finder.trigger.title': 'Finder Trigger',
    'pages.finder.menu.trigger.edit.text': 'Finder',
    'pages.finder.menu.trigger.edit.subText': 'Search and act on records.',
    'pages.orders.menu.collection.edit.text': 'Orders',
    'pages.orders.menu.collection.edit.subText': 'Open the orders workflow.',
    'pages.ops.dashboard.title': 'Operations Dashboard',
    'pages.ops.menu.dashboard.display.text': 'Operations',
    'pages.ops.menu.dashboard.display.subText': 'Open the operations dashboard.',
    'pages.people.report.actions.summary.success': 'Summary clicked.',
    'pages.finder.trigger.actions.bulk-approve.success': 'Bulk Approve clicked.',
  },
  de: {
    've.common.cancel': 'Abbrechen',
    've.common.close': 'Schliessen',
    've.common.confirm': 'Bestaetigen',
    've.common.download': 'Herunterladen',
    've.common.edit': 'Bearbeiten',
    've.common.export': 'Exportieren',
    've.common.finish': 'Fertig',
    've.common.next': 'Weiter',
    've.common.no': 'Nein',
    've.common.open': 'Oeffnen',
    've.common.prev': 'Zurueck',
    've.common.print': 'Drucken',
    've.common.remove': 'Entfernen',
    've.common.save': 'Speichern',
    've.common.view': 'Anzeigen',
    've.common.yes': 'Ja',
    've.mode.create': 'Erstellen',
    've.mode.edit': 'Bearbeiten',
    've.mode.display': 'Anzeigen',
    've.report.progress': 'Fortschritt',
    've.report.stepOf': 'Schritt {current} von {total}',
    'bootstrap.app.title': 'CLI-Demo Arbeitsbereich',
    'bootstrap.header.title': 'CLI-Demo Arbeitsbereich',
    'bootstrap.header.subtitle': 'Navigation + Uebersetzung Schnelltest',
    'bootstrap.header.overline': 'Arbeitsbereich',
    'bootstrap.header.environment': 'Deutsch',
    'bootstrap.header.status': 'Bereit',
    'bootstrap.header.end.action.title': 'Sprache wechseln',
    'bootstrap.header.end.action.clicked': 'Sprache wechseln geklickt.',
    'bootstrap.header.end.action.changed': 'Sprache gewechselt.',
    'bootstrap.header.end.user.action.language': 'Sprache wechseln',
    'bootstrap.header.end.user.action.language.changed': 'Sprache gewechselt.',
    'bootstrap.header.end.user.action.theme': 'Zum dunklen Modus wechseln',
    'bootstrap.header.end.user.action.theme.dark': 'Zum dunklen Modus wechseln',
    'bootstrap.header.end.user.action.theme.light': 'Zum hellen Modus wechseln',
    'bootstrap.header.end.user.action.theme.changed.dark': 'Dunkler Modus aktiviert.',
    'bootstrap.header.end.user.action.theme.changed.light': 'Heller Modus aktiviert.',
    'bootstrap.menu.title': 'Arbeitsbereich',
    'menus.settings.title': 'Einstellungen',
    'menus.settings.entry.text': 'Einstellungen',
    'menus.settings.entry.subText': 'Werkzeugbereich fuer Einstellungen oeffnen.',
    'pages.home.report.title': 'Start',
    'pages.home.menu.report.display.text': 'Start',
    'pages.home.menu.report.display.subText': 'Starterseite aus src/pages/home.',
    'pages.people.report.title': 'Personen Arbeitsbereich',
    'pages.people.menu.report.display.text': 'Personen',
    'pages.people.menu.report.display.subText': 'Den Personenbericht oeffnen.',
    'pages.finder.trigger.title': 'Suchausloeser',
    'pages.finder.menu.trigger.edit.text': 'Suche',
    'pages.finder.menu.trigger.edit.subText': 'Datensaetze suchen und bearbeiten.',
    'pages.orders.menu.collection.edit.text': 'Bestellungen',
    'pages.orders.menu.collection.edit.subText': 'Den Bestellungsworkflow oeffnen.',
    'pages.ops.dashboard.title': 'Betriebsdashboard',
    'pages.ops.menu.dashboard.display.text': 'Betrieb',
    'pages.ops.menu.dashboard.display.subText': 'Das Betriebsdashboard oeffnen.',
    'pages.people.report.actions.summary.success': 'Zusammenfassung angeklickt.',
    'pages.finder.trigger.actions.bulk-approve.success': 'Sammelfreigabe angeklickt.',
  },
};

function loadStoredLocale(): LocaleCode {
  if (typeof window === 'undefined') {
    return 'en';
  }

  try {
    const value = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return value === 'de' || value === 'en' ? value : 'en';
  } catch (_error) {
    return 'en';
  }
}

export const localeRef = ref<LocaleCode>(loadStoredLocale());

watch(localeRef, (value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, value);
  } catch (_error) {
    //
  }
}, { immediate: true });

export function translate(key: string, values?: Record<string, any>) {
  const template = messages[localeRef.value]?.[key];
  if (!template) {
    return undefined;
  }

  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, token) => {
    const value = values[token];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function toggleLocale() {
  localeRef.value = localeRef.value === 'en' ? 'de' : 'en';
  return localeRef.value;
}

export const demoI18n: VuetifyExtendedI18nAdapter = {
  localeRef,
  t: (key, values) => translate(key, values) || '',
  formatDate: (value, options) => new Intl.DateTimeFormat(localeRef.value, options).format(new Date(value)),
  formatNumber: (value, options) => new Intl.NumberFormat(localeRef.value, options).format(value),
  formatCurrency: (value, options) =>
    new Intl.NumberFormat(localeRef.value, {
      style: 'currency',
      currency: localeRef.value === 'de' ? 'EUR' : 'USD',
      ...(options || {}),
    }).format(value),
  isRTL: () => false,
};
