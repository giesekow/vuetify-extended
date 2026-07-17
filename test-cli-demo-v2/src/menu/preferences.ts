import { $MI, $MN } from 'vuetify-extended';
import { createHomeReport } from '../pages/home';

export function createPreferencesMenu() {
  return $MN(
    {
      title: { key: 'menus.preferences.title', fallback: 'Preferences' },
      cols: 12,
      width: 360,
    },
    {
      children: async () => [
        $MI(
          {
            action: 'report',
            mode: 'display',
            text: { key: 'menus.preferences.home.text', fallback: 'Home Preferences' },
            subText: { key: 'menus.preferences.home.subText', fallback: 'Open a nested submenu leaf item.' },
            icon: 'mdi-tune-variant',
            color: 'primary',
          },
          {
            report: async (_menuItem, mode) => createHomeReport(mode || 'display'),
            navigation: () => ({
              key: 'pages.home.report.display',
              persist: true,
            }),
          },
        ),
      ],
    },
  );
}
