const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const decimalSource = fs.readFileSync(path.join(root, 'src/misc/decimal.ts'), 'utf8');
const compiled = ts.transpileModule(decimalSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const decimalModule = { exports: {} };
vm.runInNewContext(compiled, { module: decimalModule, exports: decimalModule.exports });

const {
  compareExactDecimals,
  normalizeExactDecimal,
  parseExactDecimal,
  resolveDecimalPlaces,
  roundExactDecimal,
} = decimalModule.exports;

function sourceGeneralUtilities(names) {
  const input = fs.readFileSync(path.join(root, 'src/misc/general.ts'), 'utf8');
  const ast = ts.createSourceFile('general.ts', input, ts.ScriptTarget.Latest, true);
  const declarations = ast.statements.filter(node => ts.isVariableStatement(node)
    && node.declarationList.declarations.some(item => names.includes(item.name.getText(ast))));
  assert.equal(declarations.length, names.length);
  const js = ts.transpileModule(
    `${declarations.map(node => node.getText(ast).replace(/^export\s+/, '')).join('\n')}\n({ ${names.join(', ')} });`,
    { compilerOptions: { target: ts.ScriptTarget.ES2020 } },
  ).outputText;
  return vm.runInNewContext(js, {
    normalizeExactDecimal,
    parseExactDecimal,
    resolveDecimalPlaces,
    roundExactDecimal,
  });
}

function sourceFieldClass(names) {
  const input = fs.readFileSync(path.join(root, 'src/ui/field.ts'), 'utf8');
  const ast = ts.createSourceFile('field.ts', input, ts.ScriptTarget.Latest, true);
  const declaration = ast.statements.find(node => ts.isClassDeclaration(node) && node.name?.text === 'Field');
  const methods = declaration.members
    .filter(node => names.includes(node.name?.getText(ast)))
    .map(node => node.getText(ast));
  assert.equal(methods.length, names.length);
  const js = ts.transpileModule(`class Subject {${methods.join('\n')}}\nSubject;`, {}).outputText;
  return vm.runInNewContext(js, {
    compareExactDecimals,
    normalizeExactDecimal,
    resolveDecimalPlaces,
  });
}

assert.equal(resolveDecimalPlaces(undefined), 2);
assert.equal(resolveDecimalPlaces(0), 0, 'Zero decimal places must not fall back to two.');
assert.throws(() => resolveDecimalPlaces(-1), error => error?.name === 'RangeError');
assert.throws(() => resolveDecimalPlaces(1.5), error => error?.name === 'RangeError');
assert.throws(() => resolveDecimalPlaces(101), error => error?.name === 'RangeError');
assert.throws(() => resolveDecimalPlaces(Number.POSITIVE_INFINITY), error => error?.name === 'RangeError');

assert.deepEqual(JSON.parse(JSON.stringify(normalizeExactDecimal('90071992547409.93', 2))), {
  value: '90071992547409.93',
  valid: true,
  empty: false,
  exceedsScale: false,
  scale: 2,
});
assert.equal(normalizeExactDecimal({ $numberDecimal: '90071992547409.93' }, 2).value, '90071992547409.93');
assert.equal(normalizeExactDecimal('123', 0).value, '123');
assert.equal(normalizeExactDecimal('123', 2).value, '123.00');
assert.equal(normalizeExactDecimal('-.5', 2).value, '-0.50');
assert.equal(normalizeExactDecimal('-0.00', 2).value, '0.00');
assert.equal(normalizeExactDecimal(1e21, 2).value, '1000000000000000000000.00');
assert.equal(normalizeExactDecimal(1e-7, 8).value, '0.00000010');

const excess = normalizeExactDecimal('123.456', 2);
assert.equal(excess.value, '123.456', 'Excess precision must remain visible instead of being rounded.');
assert.equal(excess.exceedsScale, true);
assert.equal(normalizeExactDecimal('not-a-decimal', 2).valid, false);
assert.equal(parseExactDecimal('1e3'), undefined, 'Journal decimals require plain decimal notation.');

assert.equal(compareExactDecimals('90071992547409.93', '90071992547409.92'), 1);
assert.equal(compareExactDecimals('-90071992547409.93', '-90071992547409.92'), -1);
assert.equal(compareExactDecimals('1.2', '1.20'), 0);
assert.equal(compareExactDecimals('0.00000000000000000001', '0'), 1);
assert.equal(roundExactDecimal('99.995', 2).value, '100.00');
assert.equal(roundExactDecimal('0.999', 2).value, '1.00');
assert.equal(roundExactDecimal('-1.235', 2).value, '-1.24');
assert.equal(roundExactDecimal('-0.004', 2).value, '0.00');
assert.equal(roundExactDecimal('-0.005', 2).value, '-0.01');

const { $famt, toDecimal } = sourceGeneralUtilities(['$famt', 'toDecimal']);
assert.equal($famt('90071992547409.93', { decimalPlaces: 2 }), '90,071,992,547,409.93');
assert.equal($famt({ $numberDecimal: '90071992547409.93' }, { decimalPlaces: 2 }), '90,071,992,547,409.93');
assert.equal($famt(123.456, { decimalPlaces: 2 }), '123.46');
assert.equal($famt(-1234.5, { decimalPlaces: 2 }), '-1,234.50');
assert.equal($famt(90071992547409.93, { decimalPlaces: 2 }), '90,071,992,547,409.94',
  'Number input must reflect the value already represented by JavaScript.');
assert.equal($famt(1e21, { decimalPlaces: 0 }), '1,000,000,000,000,000,000,000');
assert.equal($famt(1e-7, { decimalPlaces: 8, showZeros: true }), '0.00000010');
assert.equal($famt('123', { decimalPlaces: 0 }), '123');
assert.equal($famt('123.456', { decimalPlaces: 2, excessDigits: 'preserve' }), '123.456');
assert.equal($famt('123.456', { decimalPlaces: 2, excessDigits: 'reject' }), '');
assert.equal($famt('123.456', { decimalPlaces: 2, excessDigits: 'reject', def: '9' }), '9.00');
assert.equal($famt(Number.NaN, { decimalPlaces: 2, def: '9' }), '9.00');
assert.equal($famt(Number.POSITIVE_INFINITY, { decimalPlaces: 2 }), '');
assert.equal($famt('0', { decimalPlaces: 2 }), '');
assert.equal($famt('0', { decimalPlaces: 2, showZeros: true }), '0.00');
assert.equal($famt('1234.5', { decimalPlaces: 2, thouSep: ' ', decimalSep: ',' }), '1 234,50');
assert.equal($famt('1234.5', { decimalPlaces: 2, thouSep: '$&' }), '1$&234.50');
assert.equal($famt('1234.5', { decimalPlaces: 2, thouSep: '', decimalSep: '' }), '1,234.50');

assert.deepEqual(JSON.parse(JSON.stringify(toDecimal('90071992547409.93', 2))), {
  $numberDecimal: '90071992547409.93',
});
assert.deepEqual(JSON.parse(JSON.stringify(toDecimal('123', 0))), { $numberDecimal: '123' });
assert.deepEqual(JSON.parse(JSON.stringify(toDecimal('+001.2', 2))), { $numberDecimal: '1.20' });
assert.deepEqual(JSON.parse(JSON.stringify(toDecimal({ $numberDecimal: '1.2' }, 2))), { $numberDecimal: '1.20' });
assert.throws(() => toDecimal(123.45, 2), error => error?.name === 'TypeError');
assert.throws(() => toDecimal('', 2), error => error?.name === 'TypeError');
assert.throws(() => toDecimal('123.456', 2), error => error?.name === 'RangeError');

const Field = sourceFieldClass([
  '$value',
  'decimalPlaces',
  'validateDecimalValue',
  'decimalComparisonRule',
  'preprocess',
  'postprocess',
]);
const field = new Field();
field.params = { value: { type: 'decimal', decimalPlaces: 2 } };
field.modelValue = { value: '90071992547409.93' };
field.$uiText = (key, fallback, values) => `${key}:${fallback}:${JSON.stringify(values || {})}`;

assert.equal(field.$value, '90071992547409.93');
assert.deepEqual(JSON.parse(JSON.stringify(field.postprocess('90071992547409.93'))), {
  $numberDecimal: '90071992547409.93',
});
assert.equal(field.postprocess(''), '');
assert.equal(field.postprocess(null), null);
assert.deepEqual(JSON.parse(JSON.stringify(field.postprocess(['1.20', '-2.30']))), [
  { $numberDecimal: '1.20' },
  { $numberDecimal: '-2.30' },
]);
assert.equal(field.preprocess({ $numberDecimal: '90071992547409.93' }), '90071992547409.93');
assert.equal(field.validateDecimalValue('123.45'), undefined);
assert.match(field.validateDecimalValue('123.456'), /^ve\.validation\.decimalPlaces:/);
assert.match(field.validateDecimalValue(['1.20', '2.345']), /^ve\.validation\.decimalPlaces:/);
assert.match(field.validateDecimalValue('invalid'), /^ve\.validation\.decimal:/);

field.params.value.decimalPlaces = 0;
assert.equal(field.$value, '90071992547409.93', 'Over-scale values must remain unchanged for correction.');
assert.deepEqual(JSON.parse(JSON.stringify(field.postprocess('123'))), { $numberDecimal: '123' });

const maxRule = field.decimalComparisonRule(
  '90071992547409.93',
  'lte',
  've.validation.max',
  'Value cannot exceed {max}',
  { max: '90071992547409.93' },
);
assert.equal(maxRule('90071992547409.93'), true);
assert.match(maxRule('90071992547409.94'), /^ve\.validation\.max:/);

const fieldSource = fs.readFileSync(path.join(root, 'src/ui/field.ts'), 'utf8');
assert.doesNotMatch(fieldSource, /decimalPlaces \|\| 2/);
assert.doesNotMatch(fieldSource, /Number\(val\.\$numberDecimal\)/);
assert.match(fieldSource, /if \(val\?\.\$numberDecimal !== undefined\) return val\.\$numberDecimal/);
assert.match(fieldSource, /'ve\.validation\.decimalPlaces'/);
assert.match(fieldSource, /compareExactDecimals\(candidate, expected\)/);
assert.match(fieldSource, /case 'decimal':\s*return this\.buildText\(props, context, 'text'\)/);
assert.match(fieldSource, /inputmode: this\.params\.value\.type === 'decimal' \? 'decimal' : undefined/);

const generalSource = fs.readFileSync(path.join(root, 'src/misc/general.ts'), 'utf8');
assert.doesNotMatch(generalSource, /const v = \$amt\(amount/);
assert.doesNotMatch(generalSource, /Number\(value \|\| 0\)\.toFixed/);
assert.match(generalSource, /excessDigits\?: DecimalExcessDigits/);

console.log('Exact decimal Field and utility normalization, formatting, and validation contracts passed.');
