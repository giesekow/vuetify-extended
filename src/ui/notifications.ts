import { Ref, defineComponent, h, markRaw, onMounted, onUnmounted, ref } from "vue";
import { VBtn, VCard, VCardActions, VCardText, VCardTitle, VIcon, VSpacer } from 'vuetify/components';
import { Button } from "./button";
import { AppManager } from "./appmanager";

export type NotificationLocation = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type NotificationSurfaceStyle = 'opaque' | 'translucent';

export interface NotificationOptions {
  successColor?: string;
  errorColor?: string;
  warningColor?: string;
  infoColor?: string;
  defaultTimeout?: number;
  successTimeout?: number;
  errorTimeout?: number;
  warningTimeout?: number;
  infoTimeout?: number;
  location?: NotificationLocation;
  maxVisible?: number;
  surfaceStyle?: NotificationSurfaceStyle;
  surfaceOpacity?: number;
  surfaceBlur?: string | number;
}

export interface NotificationItem {
  id: number;
  title?: string;
  text: string;
  color?: string;
  icon?: string;
  timeout?: number;
  closable?: boolean;
  persistent?: boolean;
  location?: NotificationLocation;
  actions?: Button[];
}

export interface NotificationPayload {
  title?: string;
  text: string;
  color?: string;
  icon?: string;
  timeout?: number;
  closable?: boolean;
  persistent?: boolean;
  location?: NotificationLocation;
  actions?: Button[];
}

export class Notifications {
  private static items: Ref<NotificationItem[]> = ref([]);
  private static options: Ref<NotificationOptions> = ref({
    location: 'top-right',
    maxVisible: 4,
    defaultTimeout: 4000,
    surfaceStyle: 'opaque',
  });
  private static rootMounted = false;
  private static timers = new Map<number, ReturnType<typeof setTimeout>>();
  private static nextId = 1;

  static setOptions(options: NotificationOptions) {
    Notifications.options.value = { ...Notifications.options.value, ...options };
  }

  static setDefault(options: NotificationOptions, reset?: boolean) {
    if (reset) {
      Notifications.options.value = { ...options };
      return;
    }

    Notifications.setOptions(options);
  }

  static get rootIsMounted(): boolean {
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

  private static renderRoot() {
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

  private static renderItem(item: NotificationItem) {
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
        }, () => item.actions!.map((button) => hNode('div', { style: { display: 'flex' } }, [hNode(button.component)]))),
      ] : []),
    ]);
  }

  private static containerStyle() {
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

  private static normalizeActions(actions?: Button[]) {
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

  private static enqueue(payload: NotificationPayload) {
    const item: NotificationItem = {
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

  private static scheduleDismiss(item: NotificationItem) {
    Notifications.clearTimer(item.id);

    if (item.persistent) {
      return;
    }

    const timeout = item.timeout ?? Notifications.options.value.defaultTimeout ?? 4000;
    if (!timeout || timeout <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      Notifications.dismiss(item.id);
    }, timeout);

    Notifications.timers.set(item.id, timer);
  }

  private static clearTimer(id: number) {
    const timer = Notifications.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      Notifications.timers.delete(id);
    }
  }

  static dismiss(id: number) {
    Notifications.clearTimer(id);
    Notifications.items.value = Notifications.items.value.filter((item) => item.id !== id);
  }

  static clear() {
    for (const id of Notifications.timers.keys()) {
      Notifications.clearTimer(id);
    }
    Notifications.items.value = [];
  }

  static $push(payload: NotificationPayload) {
    return Notifications.enqueue(payload);
  }

  static $info(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {}) {
    return Notifications.enqueue({
      text,
      color: payload.color || Notifications.options.value.infoColor || 'info',
      icon: payload.icon || 'mdi-information-outline',
      timeout: payload.timeout ?? Notifications.options.value.infoTimeout,
      ...payload,
    });
  }

  static $success(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {}) {
    return Notifications.enqueue({
      text,
      color: payload.color || Notifications.options.value.successColor || 'success',
      icon: payload.icon || 'mdi-check-circle-outline',
      timeout: payload.timeout ?? Notifications.options.value.successTimeout,
      ...payload,
    });
  }

  static $warning(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {}) {
    return Notifications.enqueue({
      text,
      color: payload.color || Notifications.options.value.warningColor || 'warning',
      icon: payload.icon || 'mdi-alert-outline',
      timeout: payload.timeout ?? Notifications.options.value.warningTimeout,
      ...payload,
    });
  }

  static $error(text: string, payload: Partial<Omit<NotificationPayload, 'text'>> = {}) {
    return Notifications.enqueue({
      text,
      color: payload.color || Notifications.options.value.errorColor || 'error',
      icon: payload.icon || 'mdi-alert-circle-outline',
      timeout: payload.timeout ?? Notifications.options.value.errorTimeout,
      ...payload,
    });
  }
}
