import { createVuetifyExtendedApp } from 'vuetify-extended';
import { createMainApp } from './app';

export const bootstrap = createVuetifyExtendedApp({
  api: {
    type: 'axios',
    apiURL: 'http://127.0.0.1:3000/v1',
    keycloakConfig: {
      keycloakConfig: {
        url: 'http://127.0.0.1:8081',
        realm: 'foodman',
        clientId: 'foodman-admin-app'
      },
      keycloakInit: {
        onLoad: 'login-required'
      },
    },
    options: {
      useSocket: true,
      socketURL: 'http://127.0.0.1:3000/v1',
      socketAuthMode: 'auth',
      socketEvent: 'domain-event',
      authPath: 'auth/me',
      refreshAuthPath: 'auth/me',
      authCreateMethod: 'get',
      authRefreshMethod: 'get'
    }
  },
  app: createMainApp(),
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
