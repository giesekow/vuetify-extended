import { $MI, Api, AxiosApi, Menu, Notifications } from 'vuetify-extended';


export function buildHomeMenu() {
  return new Menu(
    {
      title: 'vuetify-extended Playground',
      cols: 12,
      width: 380,
    },
    {
      children: async () => [
        $MI({text: 'Hi', icon: 'mdi-apple-keyboard-command', shortcut: 'CMD+H', shortcutDisplay: 'compact', action: 'function'}, {
          callback(menuItem, mode) {
            Notifications.$success('Home activated')
            console.log(Api.instance.user)
          },
        }),
        $MI({text: 'Hello', color: 'secondary', icon: 'mdi-apple-keyboard-command', shortcut: 'CMD+H', shortcutDisplay: 'compact', action: 'function'}, {
          callback(menuItem, mode) {
            Notifications.$info('Hello activated')
          },
        })
      ],
    },
  );
}
