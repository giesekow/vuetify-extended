const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.resolve(__dirname, '../src/ui/menu.ts'),
  'utf8',
);

assert.doesNotMatch(
  source,
  /role:\s*['"]button['"][\s\S]{0,400}['"]aria-selected['"]:/,
  'menu cards must not expose aria-selected on role=button',
);
assert.match(
  source,
  /['"]aria-current['"]:[\s\S]{0,180}['"]page['"]/,
  'the active menu card must expose aria-current=page',
);

console.log('Menu card accessibility contract passed.');
