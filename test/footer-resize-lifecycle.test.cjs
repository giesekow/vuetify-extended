const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../src/ui/appmain.ts'), 'utf8');
const start = source.indexOf('  private setFooterElement(');
const end = source.indexOf('\n}\n', start);
assert.ok(start > 0 && end > start);
// Execute the actual lifecycle methods, without loading unrelated browser UI.
const compiled = ts.transpileModule(`class Footer {
  footerHeight = { value: 0 };
  ${source.slice(start, end)}
}; globalThis.Footer = Footer;`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText;
let next = 0;
const frames = new Map();
const observers = [];
class Element { constructor(height) { this.offsetHeight = height; } }
const context = {
  HTMLElement: Element,
  requestAnimationFrame: callback => { frames.set(++next, callback); return next; },
  cancelAnimationFrame: id => frames.delete(id),
  ResizeObserver: class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(element) { this.element = element; }
    disconnect() { this.disconnected = true; }
  },
};
vm.runInNewContext(compiled, context);
const footer = new context.Footer();
const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(cb => cb()); };
const first = new Element(42);
footer.setFooterElement(first);
assert.equal(footer.footerHeight.value, 0, 'measurement waits until the next frame');
observers[0].callback(); observers[0].callback();
assert.equal(frames.size, 1, 'notifications coalesce');
first.offsetHeight = 84;
flush();
assert.equal(footer.footerHeight.value, 84, 'latest intrinsic size is measured');
footer.setFooterElement(first);
assert.equal(frames.size, 0, 'unchanged refs do not create a measurement/render loop');
first.offsetHeight = 30;
observers[0].callback(); flush();
assert.equal(footer.footerHeight.value, 30, 'shrinking is supported');
observers[0].callback();
footer.setFooterElement(null);
assert.equal(frames.size, 0, 'removal cancels pending measurement');
assert.equal(footer.footerHeight.value, 0);
assert.equal(observers[0].disconnected, true);
observers[0].callback();
assert.equal(frames.size, 0, 'late notification after removal is harmless');
footer.setFooterElement(new Element(50));
footer.setFooterElement(new Element(70));
assert.equal(frames.size, 1, 'replacement cancels the previous frame');
flush();
assert.equal(footer.footerHeight.value, 70);
footer.disconnectFooterObserver();
assert.equal(frames.size, 0);
assert.match(source, /VFooter,[\s\S]*height: this.footerHeight.value,[\s\S]*style: \{ height: 'auto' \}/,
  'VFooter gets explicit reserved height while preserving intrinsic CSS sizing');
console.log('Footer resize lifecycle contracts passed.');
