import nestedproperty from 'nested-property';
import { Api } from '../api';

export interface CustomEventHandler {
  isOnce: boolean;
  ref?: string|symbol;
  callback: EventListener;
}

export interface OnHandler {
  [key: string]: EventListener
}

export class EventEmitter {
  private _events: { [key: string] : CustomEventHandler[] } = {};

  on (name: string, listener: EventListener, reference?: string|symbol) {
    if (!this._events[name]) {
      this._events[name] = [];
    }

    this._events[name].push({isOnce: false, callback: listener, ref: reference});
  }

  once (name: string, listener: EventListener, reference?: string|symbol) {
    if (!this._events[name]) {
      this._events[name] = [];
    }
    this._events[name].push({isOnce: true, callback: listener, ref: reference});
  }

  removeListener (name: string, listenerToRemove?: EventListener) {
    if (!listenerToRemove && this._events[name]) {
      this._events[name] = [];
    } else if (this._events[name]) {
      const filterListeners = (listener: CustomEventHandler) => listener.callback !== listenerToRemove;
      this._events[name] = this._events[name].filter(filterListeners);
    }
  }

  clearListeners(reference?: string|symbol) {
    if (!reference) {
      this._events = {};
    } else {
      for (const name of Object.keys(this._events)) {
        this._events[name] = this._events[name].filter((d: CustomEventHandler) => d.ref != reference);
      }
    }
  }

  emit (name: string, data?: any) {
    if (this._events[name]) {
      const calledCallbacks: any[] = [];
      for (let i = 0; i < this._events[name].length; i++) {
        const currentCallback: any = this._events[name][i].callback;
        if (!calledCallbacks.includes(currentCallback)) currentCallback(data);
        calledCallbacks.push(currentCallback);
      }

      const filterListeners = (listener: CustomEventHandler) => !listener.isOnce;
      this._events[name] = this._events[name].filter(filterListeners);
    }
  }

  get $np () {
    return nestedproperty;
  }

  get $app() {
    return Api.instance
  }
}