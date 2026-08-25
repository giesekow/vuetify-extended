const assert = require('node:assert/strict');
const { EventEmitter } = require('../lib/cjs/ui/lib.js');

const emitter = new EventEmitter();
const context = { origin: 'user' };
let persistentArgs;
let onceCalls = 0;

emitter.on('changed', (...args) => {
  persistentArgs = args;
});
emitter.once('changed', (value, receivedContext) => {
  assert.equal(value, 'first');
  assert.equal(receivedContext, context);
  onceCalls += 1;
});

emitter.emit('changed', 'first', context);
assert.deepEqual(persistentArgs, ['first', context]);
assert.equal(onceCalls, 1);

emitter.emit('changed', 'second', { origin: 'programmatic' });
assert.deepEqual(persistentArgs, ['second', { origin: 'programmatic' }]);
assert.equal(onceCalls, 1);

console.log('UI event emitter variadic payload contracts passed.');
