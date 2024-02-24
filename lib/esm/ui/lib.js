import nestedproperty from 'nested-property';
import { Api } from '../api';
export class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(name, listener, reference) {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push({ isOnce: false, callback: listener, ref: reference });
    }
    once(name, listener, reference) {
        if (!this._events[name]) {
            this._events[name] = [];
        }
        this._events[name].push({ isOnce: true, callback: listener, ref: reference });
    }
    removeListener(name, listenerToRemove) {
        if (!listenerToRemove && this._events[name]) {
            this._events[name] = [];
        }
        else if (this._events[name]) {
            const filterListeners = (listener) => listener.callback !== listenerToRemove;
            this._events[name] = this._events[name].filter(filterListeners);
        }
    }
    clearListeners(reference) {
        if (!reference) {
            this._events = {};
        }
        else {
            for (const name of Object.keys(this._events)) {
                this._events[name] = this._events[name].filter((d) => d.ref != reference);
            }
        }
    }
    emit(name, data) {
        if (this._events[name]) {
            const calledCallbacks = [];
            for (let i = 0; i < this._events[name].length; i++) {
                const currentCallback = this._events[name][i].callback;
                if (!calledCallbacks.includes(currentCallback))
                    currentCallback(data);
                calledCallbacks.push(currentCallback);
            }
            const filterListeners = (listener) => !listener.isOnce;
            this._events[name] = this._events[name].filter(filterListeners);
        }
    }
    get $np() {
        return nestedproperty;
    }
    get $app() {
        return Api.instance;
    }
}
