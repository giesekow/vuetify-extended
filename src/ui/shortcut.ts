export function normalizeShortcut(shortcut?: string) {
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
    if (['ctrl', 'control'].includes(token)) {
      ctrl = true;
      continue;
    }

    if (['alt', 'option'].includes(token)) {
      alt = true;
      continue;
    }

    if (token === 'shift') {
      shift = true;
      continue;
    }

    if (['cmd', 'command', 'meta'].includes(token)) {
      meta = true;
      continue;
    }

    key = normalizeShortcutKey(token);
  }

  if (!key) {
    return undefined;
  }

  return `${ctrl ? 'ctrl+' : ''}${alt ? 'alt+' : ''}${shift ? 'shift+' : ''}${meta ? 'meta+' : ''}${key}`;
}

export function normalizeShortcutFromEvent(ev: KeyboardEvent) {
  const key = normalizeShortcutKey(ev.key);
  if (!key) {
    return undefined;
  }

  return `${ev.ctrlKey ? 'ctrl+' : ''}${ev.altKey ? 'alt+' : ''}${ev.shiftKey ? 'shift+' : ''}${ev.metaKey ? 'meta+' : ''}${key}`;
}

export function normalizeButtonShortcut(shortcut?: string) {
  const normalized = normalizeShortcut(shortcut);
  if (!normalized) {
    return undefined;
  }

  const parts = normalized.split('+');
  const key = parts[parts.length - 1];
  if (!isFunctionKey(key)) {
    return undefined;
  }

  if (parts.includes('meta')) {
    return undefined;
  }

  return normalized;
}

export function normalizeButtonShortcutFromEvent(ev: KeyboardEvent) {
  const normalized = normalizeShortcutFromEvent(ev);
  if (!normalized) {
    return undefined;
  }

  const parts = normalized.split('+');
  const key = parts[parts.length - 1];
  if (!isFunctionKey(key)) {
    return undefined;
  }

  if (parts.includes('meta')) {
    return undefined;
  }

  return normalized;
}

export interface ButtonShortcutDescriptor {
  normalized: string;
  key: string;
  label: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
}

export function describeButtonShortcut(shortcut?: string): ButtonShortcutDescriptor | undefined {
  const normalized = normalizeButtonShortcut(shortcut);
  if (!normalized) {
    return undefined;
  }

  const parts = normalized.split('+');
  const key = parts[parts.length - 1];

  return {
    normalized,
    key: key.toUpperCase(),
    label: parts.map((part) => formatShortcutPart(part)).join('+'),
    ctrl: parts.includes('ctrl'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
  };
}

function isFunctionKey(key?: string) {
  return !!key && /^f([1-9]|1[0-2])$/.test(key);
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

export function formatButtonShortcut(shortcut?: string) {
  return describeButtonShortcut(shortcut)?.label;
}

function formatShortcutPart(part: string) {
  if (/^f([1-9]|1[0-2])$/.test(part)) {
    return part.toUpperCase();
  }

  const labels: Record<string, string> = {
    ctrl: 'Ctrl',
    alt: 'Alt',
    shift: 'Shift',
    meta: 'Meta',
  };

  return labels[part] || (part.charAt(0).toUpperCase() + part.slice(1));
}
