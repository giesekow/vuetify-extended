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
const documentMock = { activeElement: focusTarget, body: new Element() };

function load(file, dependencies) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname, '../src/ui', file), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    HTMLElement: Element,
    document: documentMock,
    require(name) {
      if (name in dependencies) return dependencies[name];
      throw new Error('Unexpected dependency: ' + name);
    },
  });
  return exports;
}

const vue = {
  ref: value => ({ value }),
  shallowRef: value => ({ value }),
  markRaw: value => value,
  nextTick: () => Promise.resolve(),
};

class UIBase {
  $makeRef(value) { return { value }; }
  setMaster() {}
  emit() {}
  get $h() {
    return (component, props, slots) => ({ component, props, slots });
  }
}

const { DialogForm } = load('dialogform.ts', {
  vue,
  'vuetify/components': {},
  './base': { UIBase },
  '../master': { Master: class {} },
  './form': {},
  './lib': {},
  './runtime': {},
});

class MockMaster {
  constructor(params = {}) {
    this.$type = params.type;
    this.$id = params.id;
    this.$idField = params.idField;
    this.$parent = params.parent;
    this.$data = {};
  }

  $get(key) { return this.$data[key]; }
}

class MockField {
  constructor(params, options) {
    this.params = params;
    this.options = options;
  }
}

class MockForm {
  constructor(params, options) {
    this.params = params;
    this.options = options;
  }
}

class MockDialogForm {
  static instances = [];

  constructor(params, options) {
    this.params = params;
    this.options = options;
    this.component = {};
    this.hideResult = Promise.resolve();
    this.hideCalls = 0;
    this.cleaned = 0;
    MockDialogForm.instances.push(this);
  }

  show() { this.shown = true; }
  hide() {
    this.hideCalls++;
    return this.hideResult;
  }
  removeEventListeners() { this.cleaned++; }
  clearListeners() { this.cleaned++; }
}

const { Dialogs } = load('dialogs.ts', {
  vue,
  'vuetify/components': {},
  '../master': { Master: MockMaster },
  './button': {},
  './runtime': {},
  './dialogform': { DialogForm: MockDialogForm },
  './form': { Form: MockForm },
  './field': { Field: MockField },
});

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

async function flush() {
  await new Promise(resolve => setImmediate(resolve));
}

async function testDialogFormLeaveLifecycle() {
  const dialog = new DialogForm();
  dialog.loaded = true;
  const rendered = dialog.render({}, {});
  assert.equal(rendered.props.transition, 'dialog-transition');
  assert.equal(typeof rendered.props.onAfterLeave, 'function');
  dialog.dialogRoot.value = new Element();
  await dialog.show();

  let closed = false;
  const closing = dialog.hide().then(() => { closed = true; });
  const duplicate = dialog.hide();
  await Promise.resolve();
  assert.equal(closed, false, 'mounted dialog must survive until afterLeave');
  rendered.props.onAfterLeave();
  await Promise.all([closing, duplicate]);
  assert.equal(closed, true);
  assert.equal(focusTarget.focused, 0, 'DialogForm must not duplicate AppMain focus restoration');

  const externallyUnmounted = new DialogForm();
  externallyUnmounted.dialogRoot.value = new Element();
  await externallyUnmounted.show();
  const unmountedClosing = externallyUnmounted.hide();
  await Promise.resolve();
  externallyUnmounted.setDialogRoot(undefined);
  await unmountedClosing;

  const neverMounted = new DialogForm();
  await neverMounted.show();
  await neverMounted.hide();

  let cancelFinished = false;
  const cancellable = new DialogForm(undefined, {
    cancel: async () => {
      await Promise.resolve();
      cancelFinished = true;
    },
  });
  await cancellable.show();
  await cancellable.forceCancel();
  assert.equal(cancelFinished, true, 'forceCancel must await the async cancel lifecycle');
}

async function testOnlyLatestConcurrentPromptMounts() {
  const first = Dialogs.$prompt({ title: 'First' });
  const second = Dialogs.$prompt({ title: 'Second' });

  assert.equal(await first, undefined);
  await flush();
  assert.equal(MockDialogForm.instances.length, 1, 'only the latest concurrent request should mount');
  const active = MockDialogForm.instances[0];
  assert.equal(active.shown, true);

  await active.options.cancel();
  assert.equal(await second, undefined);
  assert.equal(active.cleaned, 2);
  assert.equal(focusTarget.focused, 1, 'the public prompt API restores focus once');
}

async function testPromptReplacementWaitsForLeave() {
  const originalPromise = Dialogs.$prompt({ title: 'Original' });
  await flush();
  const original = MockDialogForm.instances[1];
  const leave = deferred();
  original.hideResult = leave.promise;

  const replacementPromise = Dialogs.$prompt({ title: 'Replacement' });
  await flush();
  assert.equal(MockDialogForm.instances.length, 2, 'replacement must wait for the active prompt to leave');
  assert.equal(focusTarget.focused, 1, 'replacement must not focus the page between prompts');

  leave.resolve();
  assert.equal(await originalPromise, undefined);
  await flush();
  assert.equal(MockDialogForm.instances.length, 3);
  const replacement = MockDialogForm.instances[2];
  assert.equal(replacement.shown, true);

  await replacement.options.cancel();
  assert.equal(await replacementPromise, undefined);
  assert.equal(focusTarget.focused, 2, 'the original external target is restored after replacement closes');
}

async function testStaleCloseCannotTearDownReplacement() {
  const leave = deferred();
  let resolved = 0;
  const old = {
    hide: () => leave.promise,
    removeEventListeners: () => {},
    clearListeners: () => {},
  };
  const newer = {};

  Dialogs.promptForm.value = old;
  Dialogs.promptResolver = () => resolved++;
  const pending = Dialogs.closePrompt('old', old);
  Dialogs.promptForm.value = newer;
  const newResolver = () => {};
  Dialogs.promptResolver = newResolver;
  leave.resolve();
  await pending;

  assert.equal(Dialogs.promptForm.value, newer);
  assert.equal(Dialogs.promptResolver, newResolver);
  assert.equal(resolved, 0, 'a stale close cannot resolve the replacement promise');

  Dialogs.promptForm.value = undefined;
  Dialogs.promptResolver = undefined;
  Dialogs.promptReturnFocus = undefined;
}

async function main() {
  await testDialogFormLeaveLifecycle();
  await testOnlyLatestConcurrentPromptMounts();
  await testPromptReplacementWaitsForLeave();
  await testStaleCloseCannotTearDownReplacement();
  console.log('Prompt close lifecycle tests passed.');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
