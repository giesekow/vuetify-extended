import { h } from 'vue';
import {
  AppMain,
  Button,
  Dialogs,
  Notifications,
  MailboxBell,
  AppTitleBlock,
  EnvironmentTag,
  StatusBadge,
  UserArea,
} from 'vuetify-extended';
import { buildHomeMenu } from './menu'


export function createMainApp() {
  return new AppMain(
    {
      ref: 'demo-app',
      title: 'Vuetify Extended Demo Workspace',
      showHeader: true,
      showFooter: true,
      showFab: true,
      fabIcon: 'mdi-lightning-bolt',
      fabColor: 'primary',
      fabLabel: 'Quick Actions',
      fabShortcut: 'CTRL+SHIFT+F8',
      backgroundColor: '#dfe7ef',
      backgroundGradient: 'linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(219,231,242,0.74) 45%, rgba(199,219,237,0.82) 100%)',
      backgroundImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundOverlay: 'linear-gradient(180deg, rgba(247,250,252,0.78) 0%, rgba(237,243,248,0.88) 100%)',
    },
    {
      menu: async () => buildHomeMenu(),
      udfs: async () => [],
      fabButtons: () => [
        new Button(
          { text: 'Quick Success', color: 'success', variant: 'elevated', icon: 'mdi-check-circle-outline', shortcut: 'F11', shortcutDisplay: 'compact', tooltip: 'Push a success notification using the global FAB quick-action set.' },
          { onClicked: () => Notifications.$success('Quick action executed successfully.', { title: 'FAB Action' }) },
        ),
        new Button(
          { text: 'Quick Warning', color: 'warning', variant: 'elevated', icon: 'mdi-alert-outline', shortcut: 'SHIFT+F11', shortcutDisplay: 'compact' },
          { onClicked: () => Notifications.$warning('Quick action warning example.', { title: 'FAB Action' }) },
        ),
        new Button(
          { text: 'Quick Confirm', color: 'primary', variant: 'outlined', icon: 'mdi-help-circle-outline', shortcut: 'ALT+F11', shortcutDisplay: 'compact' },
          { onClicked: async () => { await Dialogs.$confirm('Run the quick confirm action?'); } },
        ),
      ],
      headerStart: (app) => [
        h(new AppTitleBlock({
          title: app.$params.title || 'Vuetify Extended',
          subtitle: 'Reusable shell widgets in the AppMain header',
          overline: 'Workspace',
          icon: 'mdi-view-dashboard-outline',
          color: '#0f3d63',
        }).component),
      ],
      headerCenter: () => [
        h(new EnvironmentTag({ text: 'Demo', color: 'warning' }).component),
        h(new StatusBadge({ text: 'Shell Active', icon: 'mdi-check-circle-outline', color: 'success' }).component),
      ],
      headerEnd: () => [
        h(new MailboxBell({ color: 'primary', badgeColor: 'error', title: 'Open Team Mailbox', viewWidth: 980 }).component),
        h(new UserArea({ name: 'Alex Builder', subtitle: 'UI Engineer', avatarColor: 'primary' }).component),
      ],
      footerStart: () => [
        h(new StatusBadge({ text: 'Vuetify Extended Test App', icon: 'mdi-flask-outline', color: 'primary', variant: 'outlined' }).component),
      ],
      footerCenter: () => [
        h(new EnvironmentTag({ text: 'Header + Footer + Background', color: 'info', variant: 'outlined' }).component),
      ],
      footerEnd: () => [
        h(new StatusBadge({ text: 'Workflow Shell', icon: 'mdi-view-grid-plus-outline', color: 'secondary', variant: 'tonal' }).component),
      ],
    },
  );
}
