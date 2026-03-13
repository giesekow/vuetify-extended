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
