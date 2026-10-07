const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { EventEmitter } = require('node:events');
class TestEmitter extends EventEmitter { get $np() { return require('nested-property'); } }
const source = fs.readFileSync(require.resolve('../src/master/master.ts'), 'utf8');
const moduleValue = { exports: {} };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, {
  exports: moduleValue.exports,
  require: name => name === '../ui/lib' ? { EventEmitter: TestEmitter } : name === '../ui/runtime' ? {} : require(name),
});
const { Master } = moduleValue.exports;
for (const [name, mutate, expected] of [
  ['remove by ID', m => m.$removeCollectionObject('rows', 'a', 'featureId'), ['b']],
  ['remove index zero', m => m.$removeCollectionObject('rows', 0), ['b']],
  ['remove multiple IDs', m => m.$removeCollectionObject('rows', ['a', 'b'], 'featureId'), []],
  ['remove descending indexes', m => m.$removeCollectionObject('rows', [1, 0]), []],
  ['replace', m => m.$setCollectionObject('rows', 'a', { featureId: 'c' }, 'featureId'), ['c', 'b']],
  ['append', m => m.$addCollectionObject('rows', { featureId: 'c' }), ['a', 'b', 'c']],
]) {
  const m = new Master();
  const rows = [{ featureId: 'a' }, { featureId: 'b' }];
  m.$set('rows', rows);
  let fieldValue = rows;
  let refreshes = 0;
  m.on('changed', () => {
    const next = m.$get('rows');
    if (JSON.stringify(next) !== JSON.stringify(fieldValue)) {
      fieldValue = next;
      refreshes++;
    }
  });
  mutate(m);
  assert.equal(refreshes, 1, name + ': Field must observe the collection transition');
  assert.deepEqual(rows.map(r => r.featureId), ['a', 'b'], name + ': previous snapshot remains intact');
  assert.equal(JSON.stringify(fieldValue.map(r => r.featureId)), JSON.stringify(expected));
}
console.log('Collection mutations preserve previous snapshots and refresh Field state.');
