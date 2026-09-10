const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

class Element {
  isConnected = true;
  focused = 0;
  focus() { this.focused++; }
}
const focusTarget = new Element();
function load(file, dependencies) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/ui', file), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    exports, HTMLElement: Element, document: { activeElement: focusTarget },
    require(name) {
      if (name in dependencies) return dependencies[name];
      throw new Error('Unexpected dependency: ' + name);
    },
  });
  return exports;
}
const vue = {
  ref: value => ({ value }), shallowRef: value => ({ value }),
  nextTick: () => Promise.resolve(),
};
const { DialogForm } = load('dialogform.ts', {
  vue, 'vuetify/components': {},
  './base': { UIBase: class { $makeRef(value) { return { value }; } setMaster() {} } },
  '../master': { Master: class {} }, './form': {}, './lib': {}, './runtime': {},
});
const { Dialogs } = load('dialogs.ts', {
  vue, 'vuetify/components': {}, '../master': {}, './button': {}, './runtime': {},
});

async function main() {
  const dialog = new DialogForm();
  dialog.dialogRoot.value = new Element();
  await dialog.show();
  let closed = false;
  const closing = dialog.hide().then(() => { closed = true; });
  const duplicate = dialog.hide();
  await Promise.resolve();
  assert.equal(closed, false, 'mounted dialog must survive until afterLeave');
  dialog.finishLeave();
  await Promise.all([closing, duplicate]);
  assert.equal(closed, true);
  assert.equal(focusTarget.focused, 1, 'restore focus once');
  await dialog.show();
  dialog.finishLeave();
  const second = dialog.hide();
  dialog.finishLeave();
  await second;
  const unmounted = new DialogForm();
  await unmounted.show();
  await unmounted.hide();

  let leave;
  let resolved = 0;
  let cleaned = 0;
  const old = {
    hide: () => new Promise(resolve => { leave = resolve; }),
    removeEventListeners: () => cleaned++,
    clearListeners: () => cleaned++,
  };
  Dialogs.promptForm.value = old;
  Dialogs.promptResolver = () => resolved++;
  const pending = Dialogs.closePrompt('saved', old);
  assert.equal(Dialogs.promptForm.value, old);
  assert.equal(resolved, 0, 'do not resolve before leave');
  leave();
  await pending;
  assert.equal(Dialogs.promptForm.value, undefined);
  assert.equal(resolved, 1);
  assert.equal(cleaned, 2);
  const newer = {};
  Dialogs.promptForm.value = newer;
  await Dialogs.closePrompt('stale', old);
  assert.equal(Dialogs.promptForm.value, newer, 'stale callbacks cannot close a replacement');
  Dialogs.promptForm.value = old;
  Dialogs.promptResolver = () => resolved++;
  const replacedWhileLeaving = Dialogs.closePrompt('old', old);
  Dialogs.promptForm.value = newer;
  const newResolver = () => {};
  Dialogs.promptResolver = newResolver;
  leave();
  await replacedWhileLeaving;
  assert.equal(Dialogs.promptForm.value, newer);
  assert.equal(Dialogs.promptResolver, newResolver);
  assert.equal(resolved, 1, 'a stale close cannot resolve the replacement promise');
  console.log('Prompt close lifecycle tests passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
