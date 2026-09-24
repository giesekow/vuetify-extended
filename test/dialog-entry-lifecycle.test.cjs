const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../src/ui/dialog-lifecycle.ts'), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText, { exports: exportsObject, require: () => ({ nextTick: () => Promise.resolve() }) });
const { finishDialogEntry } = exportsObject;
const animation = (finished, endTime = 225, playState = 'running') => ({
  finished, playState, effect: { getComputedTiming: () => ({ endTime }) },
});
async function main() {
  assert.equal(await finishDialogEntry(), true, 'unmounted/no-animation entry needs no delay');
  assert.equal(await finishDialogEntry({ getAnimations: () => [] }), true, 'reduced motion needs no delay');
  let finishScale, settled = false;
  const scale = new Promise(resolve => { finishScale = resolve; });
  const pending = finishDialogEntry({ getAnimations: () => [animation(scale), animation(Promise.resolve())] });
  pending.then(() => { settled = true; });
  await Promise.resolve(); await Promise.resolve();
  assert.equal(settled, false, 'after-enter alone cannot release a still-running scale animation');
  finishScale();
  assert.equal(await pending, true);
  let cancel;
  const cancelled = new Promise((_, reject) => { cancel = reject; });
  const cancelledEntry = finishDialogEntry({ getAnimations: () => [animation(cancelled)] });
  await Promise.resolve();
  cancel(new Error('Animation cancelled'));
  assert.equal(await cancelledEntry, false, 'cancelled entry must not open a stale popup');
  const forever = new Promise(() => {});
  assert.equal(await finishDialogEntry({ getAnimations: () => [animation(forever, Infinity), animation(forever, 225, 'paused')] }), true, 'unrelated infinite/paused effects do not block entry');
  console.log('Native dialog entry completion, cancellation and reduced-motion contracts passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
