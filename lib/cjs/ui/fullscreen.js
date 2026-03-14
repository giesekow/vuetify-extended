"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$SplashScreen = exports.$AccessDeniedScreen = exports.SplashScreen = exports.AccessDeniedScreen = void 0;
const base_1 = require("./base");
const components_1 = require("vuetify/components");
function toCssSize(value, fallback) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    return typeof value === 'number' ? `${value}px` : value;
}
function buildBackgroundStyle(params) {
    return {
        minHeight: toCssSize(params.minHeight, '100vh'),
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        backgroundColor: params.backgroundColor || '#eef3f8',
        backgroundImage: [params.backgroundOverlay, params.backgroundGradient, params.backgroundImage ? `url(${params.backgroundImage})` : undefined]
            .filter(Boolean)
            .join(', ') || undefined,
        backgroundSize: params.backgroundImage ? 'auto, auto, cover' : undefined,
        backgroundPosition: params.backgroundImage ? 'center, center, center' : undefined,
        backgroundRepeat: params.backgroundImage ? 'no-repeat, no-repeat, no-repeat' : undefined,
    };
}
function buildHeroBlock(ui, params, trailing) {
    const h = ui.$h;
    const content = [];
    if (params.logo) {
        content.push(h('img', {
            src: params.logo,
            alt: params.logoAlt || params.title || 'logo',
            style: {
                width: '96px',
                height: '96px',
                objectFit: 'contain',
                marginBottom: '8px',
            },
        }));
    }
    else if (params.icon) {
        content.push(h('div', {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '88px',
                height: '88px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.18)',
                marginBottom: '8px',
                backdropFilter: 'blur(6px)',
            },
        }, [
            h(components_1.VIcon, {
                size: 52,
                color: params.iconColor || 'white',
            }, () => params.icon || ''),
        ]));
    }
    if (params.subtitle) {
        content.push(h('div', {
            style: {
                fontSize: '0.86rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                opacity: '0.76',
                marginBottom: '8px',
                color: params.textColor || 'inherit',
            },
        }, params.subtitle));
    }
    if (params.title) {
        content.push(h('div', {
            style: {
                fontSize: '2rem',
                lineHeight: '1.15',
                fontWeight: '800',
                color: params.titleColor || params.textColor || 'inherit',
                marginBottom: params.message ? '10px' : '0',
            },
        }, params.title));
    }
    if (params.message) {
        content.push(h('div', {
            style: {
                fontSize: '1rem',
                lineHeight: '1.55',
                opacity: '0.84',
                maxWidth: '42ch',
                color: params.textColor || 'inherit',
            },
        }, params.message));
    }
    if (trailing && trailing.length) {
        content.push(...trailing);
    }
    return h(components_1.VCard, {
        elevation: 12,
        rounded: 'xl',
        color: params.cardColor || 'rgba(15, 23, 42, 0.72)',
        style: {
            width: '100%',
            maxWidth: toCssSize(params.maxWidth, '720px'),
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
        },
    }, () => h(components_1.VCardText, {
        style: {
            padding: '36px 32px',
            textAlign: 'center',
            color: params.textColor || 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0px',
        },
    }, () => content));
}
class AccessDeniedScreen extends base_1.UIBase {
    constructor(params, options) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, AccessDeniedScreen.defaultParams), (params || {})));
        this.options = options || {};
    }
    static setDefault(value, reset) {
        AccessDeniedScreen.defaultParams = reset ? value : Object.assign(Object.assign({}, AccessDeniedScreen.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('cancel', this);
        });
    }
    render() {
        const h = this.$h;
        const trailing = [];
        if (this.$params.actionText && this.options.action) {
            trailing.push(h('div', { style: { marginTop: '22px' } }, [
                h(components_1.VBtn, {
                    color: 'primary',
                    variant: 'elevated',
                    size: 'large',
                    onClick: () => { var _a, _b; return (_b = (_a = this.options).action) === null || _b === void 0 ? void 0 : _b.call(_a, this); },
                }, () => this.$params.actionText || ''),
            ]));
        }
        return h('div', {
            style: buildBackgroundStyle(this.$params),
        }, [
            buildHeroBlock(this, this.$params, trailing),
        ]);
    }
}
exports.AccessDeniedScreen = AccessDeniedScreen;
AccessDeniedScreen.defaultParams = {
    title: 'Access Denied',
    subtitle: 'Restricted Workspace',
    message: 'You do not currently have permission to access this application. Please contact your administrator if you believe this is unexpected.',
    icon: 'mdi-shield-lock-outline',
    iconColor: 'error',
    backgroundColor: '#0f172a',
    backgroundGradient: 'radial-gradient(circle at top, rgba(59,130,246,0.22), transparent 42%), linear-gradient(160deg, #0f172a 0%, #111827 52%, #1e293b 100%)',
    cardColor: 'rgba(15, 23, 42, 0.74)',
    textColor: 'white',
    titleColor: 'white',
    maxWidth: 720,
    minHeight: '100vh',
    actionText: undefined,
};
class SplashScreen extends base_1.UIBase {
    constructor(params) {
        super();
        this.params = this.$makeRef(Object.assign(Object.assign({}, SplashScreen.defaultParams), (params || {})));
    }
    static setDefault(value, reset) {
        SplashScreen.defaultParams = reset ? value : Object.assign(Object.assign({}, SplashScreen.defaultParams), value);
    }
    get $params() {
        return this.params.value;
    }
    forceCancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.emit('cancel', this);
        });
    }
    render() {
        const h = this.$h;
        const trailing = [
            h('div', {
                style: {
                    marginTop: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                },
            }, [
                h(components_1.VProgressCircular, {
                    color: this.$params.progressColor || 'primary',
                    indeterminate: this.$params.indeterminate !== false,
                    modelValue: this.$params.indeterminate === false ? Number(this.$params.progress || 0) : undefined,
                    width: 6,
                    size: toCssSize(this.$params.progressSize, '72px'),
                }),
                ...(this.$params.loadingText ? [h('div', {
                        style: {
                            fontSize: '0.96rem',
                            fontWeight: '600',
                            letterSpacing: '0.01em',
                            color: this.$params.textColor || '#0f172a',
                        },
                    }, this.$params.loadingText)] : []),
            ]),
        ];
        return h('div', {
            style: buildBackgroundStyle(this.$params),
        }, [
            buildHeroBlock(this, this.$params, trailing),
        ]);
    }
}
exports.SplashScreen = SplashScreen;
SplashScreen.defaultParams = {
    title: 'Loading Workspace',
    subtitle: 'Preparing Application',
    message: 'Please wait while the application initializes your session and loads the required data.',
    icon: 'mdi-rocket-launch-outline',
    iconColor: 'primary',
    backgroundColor: '#f4f7fb',
    backgroundGradient: 'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 40%), linear-gradient(180deg, #f8fbff 0%, #edf3f9 100%)',
    cardColor: 'rgba(255,255,255,0.82)',
    textColor: '#0f172a',
    titleColor: '#0f172a',
    maxWidth: 720,
    minHeight: '100vh',
    loadingText: 'Loading…',
    indeterminate: true,
    progressColor: 'primary',
    progressSize: 72,
};
const $AccessDeniedScreen = (params, options) => new AccessDeniedScreen(params || {}, options || {});
exports.$AccessDeniedScreen = $AccessDeniedScreen;
const $SplashScreen = (params) => new SplashScreen(params || {});
exports.$SplashScreen = $SplashScreen;
