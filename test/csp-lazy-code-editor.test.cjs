const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'widgets', 'field-rich-widgets.ts'),
  'utf8',
);
const fieldSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'ui', 'field.ts'),
  'utf8',
);
const printSource = fs.readFileSync(
  path.resolve(__dirname, '..', 'src', 'misc', 'print.ts'),
  'utf8',
);

assert.doesNotMatch(
  source,
  /^import \{ VAceEditor \} from 'vue3-ace-editor';$/m,
  'Ace must not be imported eagerly into applications that do not render code fields.',
);
assert.match(source, /defineAsyncComponent\(async \(\) =>/);
assert.match(source, /await import\('vue3-ace-editor'\)/);
assert.doesNotMatch(source, /worker-(json|javascript|html)'/);
assert.doesNotMatch(fieldSource, /import\s+\*\s+as\s+webtex\s+from\s+['"]webtex['"]/);
assert.match(fieldSource, /await\s+import\(['"]webtex['"]\)/);
assert.doesNotMatch(printSource, /^import\s+ejs\s+from\s+['"]ejs\/ejs\.min\.js['"]/m);
assert.match(printSource, /await\s+import\(['"]ejs\/ejs\.min\.js['"]\)/);

console.log('CSP-safe optional rich-field and template boundaries passed.');
