export interface ShortcutNormalizationOptions {
  cmdForCtrlOnMac?: boolean;
}

export interface ShortcutDescriptor {
  normalized: string;
  key: string;
  label: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export interface ButtonShortcutDescriptor {
  normalized: string;
  key: string;
  label: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

interface ParsedShortcut {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  key?: string;
}

export function normalizeShortcut(shortcut?: string, options?: ShortcutNormalizationOptions) {
  const parsed = parseShortcutString(shortcut);
  if (!parsed?.key) {
    return undefined;
  }

  return buildNormalizedShortcut(normalizeParsedShortcut(parsed, options));
}

export function normalizeShortcutFromEvent(ev: KeyboardEvent, options?: ShortcutNormalizationOptions) {
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

export function normalizeButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions) {
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

export function normalizeButtonShortcutFromEvent(ev: KeyboardEvent, options?: ShortcutNormalizationOptions) {
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

export function describeShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): ShortcutDescriptor | undefined {
  const normalized = normalizeShortcut(shortcut, options);
  if (!normalized) {
    return undefined;
  }

  return createShortcutDescriptor(normalized);
}

export function describeButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions): ButtonShortcutDescriptor | undefined {
  const normalized = normalizeButtonShortcut(shortcut, options);
  if (!normalized) {
    return undefined;
  }

  return createShortcutDescriptor(normalized);
}

function createShortcutDescriptor(normalized: string) {
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

function parseShortcutString(shortcut?: string): ParsedShortcut | undefined {
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
  let key: string | undefined;

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

function normalizeParsedShortcut(parsed: ParsedShortcut, options?: ShortcutNormalizationOptions): Required<ParsedShortcut> {
  const useCmdForCtrlOnMac = options?.cmdForCtrlOnMac !== false;
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
  } else if (meta) {
    ctrl = true;
    meta = false;
  }

  return { ctrl, alt, shift, meta, key };
}

function buildNormalizedShortcut(parsed: Required<ParsedShortcut>) {
  const parts: string[] = [];
  if (parsed.ctrl) parts.push('ctrl');
  if (parsed.alt) parts.push('alt');
  if (parsed.shift) parts.push('shift');
  if (parsed.meta) parts.push('meta');
  parts.push(parsed.key);
  return parts.join('+');
}

function isFunctionKey(key?: string) {
  return !!key && /^f([1-9]|1[0-2])$/.test(key);
}

function isMacOS() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const platform = (navigator as any).userAgentData?.platform || navigator.platform || navigator.userAgent || '';
  return /mac/i.test(platform);
}

export function normalizeShortcutKey(key?: string) {
  if (!key) {
    return undefined;
  }

  const normalized = key.trim().toLowerCase();
  const aliases: Record<string, string> = {
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

export function shouldIgnoreShortcutTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.closest('input, textarea, select, [contenteditable="true"], .monaco-editor, .ace_editor, .tox, .ProseMirror')) {
    return true;
  }

  return false;
}

export function formatButtonShortcut(shortcut?: string, options?: ShortcutNormalizationOptions) {
  return describeButtonShortcut(shortcut, options)?.label;
}

export function formatShortcut(shortcut?: string, options?: ShortcutNormalizationOptions) {
  return describeShortcut(shortcut, options)?.label;
}

function formatShortcutPart(part: string, mac: boolean) {
  if (/^f([1-9]|1[0-2])$/.test(part)) {
    return part.toUpperCase();
  }

  const labels: Record<string, string> = {
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
    meta: mac ? 'Cmd' : 'Ctrl',
  };

  return labels[part] || formatShortcutKeyLabel(part);
}

function formatShortcutKeyLabel(part: string) {
  return part.length === 1 ? part.toUpperCase() : (part.charAt(0).toUpperCase() + part.slice(1));
}
