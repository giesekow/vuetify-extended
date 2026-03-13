export function normalizeShortcut(shortcut, options) {
    const parsed = parseShortcutString(shortcut);
    if (!(parsed === null || parsed === void 0 ? void 0 : parsed.key)) {
        return undefined;
    }
    return buildNormalizedShortcut(normalizeParsedShortcut(parsed, options));
}
export function normalizeShortcutFromEvent(ev, options) {
    const key = normalizeShortcutKey(ev.key);
    if (!key) {
        return undefined;
    }
    return buildNormalizedShortcut(normalizeParsedShortcut({
        ctrl: ev.ctrlKey,
        alt: ev.altKey,
        shift: ev.shiftKey,
        meta: ev.metaKey,
        key,
    }, options));
}
export function normalizeButtonShortcut(shortcut, options) {
    const normalized = normalizeShortcut(shortcut, options);
    if (!normalized) {
        return undefined;
    }
    const parts = normalized.split('+');
    const key = parts[parts.length - 1];
    if (!isFunctionKey(key)) {
        return undefined;
    }
    return normalized;
}
export function normalizeButtonShortcutFromEvent(ev, options) {
    const normalized = normalizeShortcutFromEvent(ev, options);
    if (!normalized) {
        return undefined;
    }
    const parts = normalized.split('+');
    const key = parts[parts.length - 1];
    if (!isFunctionKey(key)) {
        return undefined;
    }
    return normalized;
}
export function describeShortcut(shortcut, options) {
    const normalized = normalizeShortcut(shortcut, options);
    if (!normalized) {
        return undefined;
    }
    return createShortcutDescriptor(normalized);
}
export function describeButtonShortcut(shortcut, options) {
    const normalized = normalizeButtonShortcut(shortcut, options);
    if (!normalized) {
        return undefined;
    }
    return createShortcutDescriptor(normalized);
}
function createShortcutDescriptor(normalized) {
    const parts = normalized.split('+');
    const key = parts[parts.length - 1];
    const mac = isMacOS();
    return {
        normalized,
        key: /^f([1-9]|1[0-2])$/.test(key) ? key.toUpperCase() : formatShortcutKeyLabel(key),
        label: parts.map((part) => formatShortcutPart(part, mac)).join('+'),
        ctrl: parts.includes('ctrl'),
        alt: parts.includes('alt'),
        shift: parts.includes('shift'),
        meta: parts.includes('meta'),
    };
}
function parseShortcutString(shortcut) {
    if (!shortcut) {
        return undefined;
    }
    const tokens = shortcut
        .split('+')
        .map((token) => token.trim().toLowerCase())
        .filter((token) => token !== '');
    if (tokens.length === 0) {
        return undefined;
    }
    let ctrl = false;
    let alt = false;
    let shift = false;
    let meta = false;
    let key;
    for (const token of tokens) {
        if (["ctrl", "control"].includes(token)) {
            ctrl = true;
            continue;
        }
        if (["alt", "option"].includes(token)) {
            alt = true;
            continue;
        }
        if (token === 'shift') {
            shift = true;
            continue;
        }
        if (["cmd", "command", "meta"].includes(token)) {
            meta = true;
            continue;
        }
        key = normalizeShortcutKey(token);
    }
    return { ctrl, alt, shift, meta, key };
}
function normalizeParsedShortcut(parsed, options) {
    const useCmdForCtrlOnMac = (options === null || options === void 0 ? void 0 : options.cmdForCtrlOnMac) !== false;
    const mac = isMacOS();
    let ctrl = parsed.ctrl;
    let alt = parsed.alt;
    let shift = parsed.shift;
    let meta = parsed.meta;
    const key = parsed.key;
    if (!key) {
        throw new Error('Shortcut key is required');
    }
    if (mac) {
        if (useCmdForCtrlOnMac && ctrl && !meta) {
            meta = true;
            ctrl = false;
        }
    }
    else if (meta) {
        ctrl = true;
        meta = false;
    }
    return { ctrl, alt, shift, meta, key };
}
function buildNormalizedShortcut(parsed) {
    const parts = [];
    if (parsed.ctrl)
        parts.push('ctrl');
    if (parsed.alt)
        parts.push('alt');
    if (parsed.shift)
        parts.push('shift');
    if (parsed.meta)
        parts.push('meta');
    parts.push(parsed.key);
    return parts.join('+');
}
function isFunctionKey(key) {
    return !!key && /^f([1-9]|1[0-2])$/.test(key);
}
function isMacOS() {
    var _a;
    if (typeof navigator === 'undefined') {
        return false;
    }
    const platform = ((_a = navigator.userAgentData) === null || _a === void 0 ? void 0 : _a.platform) || navigator.platform || navigator.userAgent || '';
    return /mac/i.test(platform);
}
export function normalizeShortcutKey(key) {
    if (!key) {
        return undefined;
    }
    const normalized = key.trim().toLowerCase();
    const aliases = {
        esc: 'escape',
        return: 'enter',
        ' ': 'space',
        spacebar: 'space',
        left: 'arrowleft',
        right: 'arrowright',
        up: 'arrowup',
        down: 'arrowdown',
        del: 'delete',
    };
    return aliases[normalized] || normalized;
}
export function shouldIgnoreShortcutTarget(target) {
    if (!(target instanceof HTMLElement)) {
        return false;
    }
    if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
        return true;
    }
    return false;
}
export function formatButtonShortcut(shortcut, options) {
    var _a;
    return (_a = describeButtonShortcut(shortcut, options)) === null || _a === void 0 ? void 0 : _a.label;
}
export function formatShortcut(shortcut, options) {
    var _a;
    return (_a = describeShortcut(shortcut, options)) === null || _a === void 0 ? void 0 : _a.label;
}
function formatShortcutPart(part, mac) {
    if (/^f([1-9]|1[0-2])$/.test(part)) {
        return part.toUpperCase();
    }
    const labels = {
        ctrl: 'Ctrl',
        alt: 'Alt',
        shift: 'Shift',
        meta: mac ? 'Cmd' : 'Ctrl',
    };
    return labels[part] || formatShortcutKeyLabel(part);
}
function formatShortcutKeyLabel(part) {
    return part.length === 1 ? part.toUpperCase() : (part.charAt(0).toUpperCase() + part.slice(1));
}
