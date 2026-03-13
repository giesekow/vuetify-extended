import { defineComponent, h, markRaw, onMounted, onUnmounted, ref } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VIcon, VSpacer } from 'vuetify/components';
import { AppManager } from "./appmanager";
export class Notifications {
    static setOptions(options) {
        Notifications.options.value = Object.assign(Object.assign({}, Notifications.options.value), options);
    }
    static setDefault(options, reset) {
        if (reset) {
            Notifications.options.value = Object.assign({}, options);
            return;
        }
        Notifications.setOptions(options);
    }
    static get rootIsMounted() {
        return Notifications.rootMounted;
    }
    static rootComponent() {
        return defineComponent({
            name: 'VuetifyExtendedNotifications',
            setup: () => {
                onMounted(() => {
                    Notifications.rootMounted = true;
                });
                onUnmounted(() => {
                    Notifications.rootMounted = false;
                });
                return () => Notifications.renderRoot();
            },
        });
    }
    static renderRoot() {
        const hNode = h;
        const visible = Notifications.items.value.slice(0, Math.max(Notifications.options.value.maxVisible || 4, 1));
        if (visible.length === 0) {
            return undefined;
        }
        return hNode('div', {
            class: ['vuetify-extended-notifications'],
            style: Notifications.containerStyle(),
        }, visible.map((item) => Notifications.renderItem(item)));
    }
    static renderItem(item) {
        const hNode = h;
        const surfaceStyle = Notifications.options.value.surfaceStyle || 'opaque';
        const blurValue = Notifications.options.value.surfaceBlur;
        const opacityValue = Notifications.options.value.surfaceOpacity;
        const resolvedBlur = surfaceStyle === 'translucent'
            ? (blurValue !== undefined ? (typeof blurValue === 'number' ? `${blurValue}px` : blurValue) : '6px')
            : (blurValue !== undefined ? (typeof blurValue === 'number' ? `${blurValue}px` : blurValue) : undefined);
        const resolvedOpacity = opacityValue !== undefined
            ? opacityValue
            : (surfaceStyle === 'translucent' ? 0.98 : 1);
        return hNode(VCard, {
            key: item.id,
            color: item.color,
            variant: 'elevated',
            elevation: 10,
            rounded: 'lg',
            style: {
                width: 'min(360px, calc(100vw - 32px))',
                overflow: 'hidden',
                pointerEvents: 'auto',
                opacity: resolvedOpacity,
                backdropFilter: resolvedBlur ? `blur(${resolvedBlur})` : undefined,
            },
        }, () => [
            hNode(VCardTitle, {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    paddingBottom: item.title ? '4px' : '0px',
                },
            }, () => [
                ...(item.icon ? [hNode(VIcon, { icon: item.icon, size: 20 })] : []),
                hNode('span', {
                    style: {
                        fontSize: '0.95rem',
                        fontWeight: 600,
                    },
                }, item.title || 'Notification'),
                hNode(VSpacer),
                ...(item.closable === false ? [] : [
                    hNode(VBtn, {
                        icon: 'mdi-close',
                        size: 'small',
                        variant: 'text',
                        onClick: () => Notifications.dismiss(item.id),
                    }),
                ]),
            ]),
            hNode(VCardText, {
                style: {
                    paddingTop: item.title ? '0px' : '16px',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                },
            }, () => item.text),
            ...(item.actions && item.actions.length > 0 ? [
                hNode(VCardActions, {
                    style: {
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end',
                        flexWrap: 'wrap',
                        paddingTop: '0px',
                    },
                }, () => item.actions.map((button) => hNode('div', { style: { display: 'flex' } }, [hNode(button.component)]))),
            ] : []),
        ]);
    }
    static containerStyle() {
        const location = Notifications.options.value.location || 'top-right';
        const top = location.startsWith('top') ? '20px' : undefined;
        const bottom = location.startsWith('bottom') ? '20px' : undefined;
        const left = location.endsWith('left') ? '20px' : undefined;
        const right = location.endsWith('right') ? '20px' : undefined;
        return {
            position: 'fixed',
            top,
            bottom,
            left,
            right,
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: location.endsWith('left') ? 'flex-start' : 'flex-end',
            pointerEvents: 'none',
        };
    }
    static normalizeActions(actions) {
        if (!actions || actions.length === 0) {
            return undefined;
        }
        return actions.map((button) => {
            if (AppManager.$app) {
                button.setParent(AppManager.$app);
            }
            return markRaw(button);
        });
    }
    static enqueue(payload) {
        const item = {
            id: Notifications.nextId++,
            title: payload.title,
            text: payload.text,
            color: payload.color,
            icon: payload.icon,
            timeout: payload.timeout,
            closable: payload.closable !== false,
            persistent: payload.persistent,
            location: payload.location,
            actions: Notifications.normalizeActions(payload.actions),
        };
        Notifications.items.value = [item, ...Notifications.items.value];
        Notifications.scheduleDismiss(item);
        return item.id;
    }
    static scheduleDismiss(item) {
        var _a, _b;
        Notifications.clearTimer(item.id);
        if (item.persistent) {
            return;
        }
        const timeout = (_b = (_a = item.timeout) !== null && _a !== void 0 ? _a : Notifications.options.value.defaultTimeout) !== null && _b !== void 0 ? _b : 4000;
        if (!timeout || timeout <= 0) {
            return;
        }
        const timer = setTimeout(() => {
            Notifications.dismiss(item.id);
        }, timeout);
        Notifications.timers.set(item.id, timer);
    }
    static clearTimer(id) {
        const timer = Notifications.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            Notifications.timers.delete(id);
        }
    }
    static dismiss(id) {
        Notifications.clearTimer(id);
        Notifications.items.value = Notifications.items.value.filter((item) => item.id !== id);
    }
    static clear() {
        for (const id of Notifications.timers.keys()) {
            Notifications.clearTimer(id);
        }
        Notifications.items.value = [];
    }
    static $push(payload) {
        return Notifications.enqueue(payload);
    }
    static $info(text, payload = {}) {
        var _a;
        return Notifications.enqueue(Object.assign({ text, color: payload.color || Notifications.options.value.infoColor || 'info', icon: payload.icon || 'mdi-information-outline', timeout: (_a = payload.timeout) !== null && _a !== void 0 ? _a : Notifications.options.value.infoTimeout }, payload));
    }
    static $success(text, payload = {}) {
        var _a;
        return Notifications.enqueue(Object.assign({ text, color: payload.color || Notifications.options.value.successColor || 'success', icon: payload.icon || 'mdi-check-circle-outline', timeout: (_a = payload.timeout) !== null && _a !== void 0 ? _a : Notifications.options.value.successTimeout }, payload));
    }
    static $warning(text, payload = {}) {
        var _a;
        return Notifications.enqueue(Object.assign({ text, color: payload.color || Notifications.options.value.warningColor || 'warning', icon: payload.icon || 'mdi-alert-outline', timeout: (_a = payload.timeout) !== null && _a !== void 0 ? _a : Notifications.options.value.warningTimeout }, payload));
    }
    static $error(text, payload = {}) {
        var _a;
        return Notifications.enqueue(Object.assign({ text, color: payload.color || Notifications.options.value.errorColor || 'error', icon: payload.icon || 'mdi-alert-circle-outline', timeout: (_a = payload.timeout) !== null && _a !== void 0 ? _a : Notifications.options.value.errorTimeout }, payload));
    }
}
Notifications.items = ref([]);
Notifications.options = ref({
    location: 'top-right',
    maxVisible: 4,
    defaultTimeout: 4000,
    surfaceStyle: 'opaque',
});
Notifications.rootMounted = false;
Notifications.timers = new Map();
Notifications.nextId = 1;
