import io from 'socket.io-client';
import { feathers } from '@feathersjs/feathers';
import type { Application } from '../declarations';
import socketio from '@feathersjs/socketio-client';
import rest from '@feathersjs/rest-client';
import axios from 'axios';
import { AuthConfigure } from 'feathers-keycloak-connect-client'
import type { KeycloakClientConfig } from 'feathers-keycloak-connect-client'
import findOne from './find-one';
import count from './count';
import findAll from './find-all';

export interface SocketIOOptions {
  transports?: string[];
  timeout?: number;
  useSocket?: boolean;
}

export class Api {
  static instance: Application;

  static setup(apiURL:any, keycloakConfig: KeycloakClientConfig, soptions?: SocketIOOptions) {
    const appCreator: any = feathers
    const client: any = appCreator()

    if (soptions?.useSocket) {
      const socket = io(apiURL, { transports: soptions?.transports || ['websocket'], timeout: soptions?.timeout || 6*1000});
      client.configure(socketio(socket));
    } else {
      const restClient = rest(apiURL);
      client.configure(restClient.axios(axios));
    }
    
    client.configure(AuthConfigure(keycloakConfig));
    client.configure(findOne());
    client.configure(findAll());
    client.configure(count());

    if (!soptions?.useSocket){
      client.hooks({
        before: {
          all: [
            (context: any) => {
              if (context.params.query) {
                context.params.headers.rawquery = JSON.stringify(context.params.query);
                delete context.params.query;
              }
    
            }
          ]
        }
      })
    }

    Api.instance = client;
  }
}