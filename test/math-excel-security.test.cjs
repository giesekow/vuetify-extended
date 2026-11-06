const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const packageVersion = relativePath => JSON.parse(
  fs.readFileSync(path.join(root, 'node_modules', relativePath, 'package.json'), 'utf8'),
).version;

assert.equal(packageVersion('katex'), '0.18.2', 'KaTeX must resolve to the reviewed patched release.');

const excelEntry = require.resolve('exceljs');
const excelUuidPackage = require.resolve('uuid/package.json', {
  paths: [path.dirname(excelEntry)],
});
assert.equal(
  JSON.parse(fs.readFileSync(excelUuidPackage, 'utf8')).version,
  '11.1.1',
  'ExcelJS must resolve the patched CommonJS-compatible UUID release.',
);

const katex = require('katex');
const inheritedTrust = Object.create({ trust: true });
inheritedTrust.throwOnError = false;
const untrustedLink = katex.renderToString(String.raw`\href{https://example.invalid}{unsafe}`, inheritedTrust);
assert.doesNotMatch(
  untrustedLink,
  /<a\b/i,
  'An inherited trust option must not enable KaTeX link rendering.',
);

const generalSource = fs.readFileSync(path.join(root, 'src/misc/general.ts'), 'utf8');
const generalAst = ts.createSourceFile('general.ts', generalSource, ts.ScriptTarget.Latest, true);
const escapeDeclaration = generalAst.statements.find(node => ts.isVariableStatement(node)
  && node.declarationList.declarations.some(item => item.name.getText(generalAst) === 'escapeMathError'));
assert.ok(escapeDeclaration, 'The math error escaping boundary must remain defined.');
const escapeScript = ts.transpileModule(
  `${escapeDeclaration.getText(generalAst).replace(/^export\s+/, '')}\nescapeMathError;`,
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } },
).outputText;
const escapeMathError = vm.runInNewContext(escapeScript);
assert.equal(
  escapeMathError('<img src=x onerror="alert(1)">&\''),
  '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;',
);

const fieldSource = fs.readFileSync(path.join(root, 'src/ui/field.ts'), 'utf8');
assert.equal(
  (fieldSource.match(/trust: false/g) || []).length,
  2,
  'Both field-level KaTeX paths must explicitly disable trusted commands.',
);
assert.equal(
  (generalSource.match(/trust: false/g) || []).length,
  2,
  'Both general KaTeX paths must explicitly disable trusted commands.',
);
assert.equal(
  (fieldSource.match(/class="katex-error">\$\{escapeMathError\(math\)\}/g) || []).length,
  2,
  'Both field-level KaTeX error paths must escape the rejected expression.',
);
assert.equal(
  (generalSource.match(/class="katex-error">\$\{escapeMathError\(math\)\}/g) || []).length,
  2,
  'Both general KaTeX error paths must escape the rejected expression.',
);

const Excel = require('exceljs');

(async () => {
  const workbook = new Excel.Workbook();
  const sheet = workbook.addWorksheet('Security');
  sheet.getCell('A1').value = 1;
  sheet.addConditionalFormatting({
    ref: 'A1',
    rules: [{
      type: 'expression',
      formulae: ['A1>0'],
      style: { font: { bold: true } },
    }],
  });

  const output = await workbook.xlsx.writeBuffer();
  assert.ok(output.byteLength > 0, 'ExcelJS must write a workbook with UUID-backed formatting.');

  const roundTrip = new Excel.Workbook();
  await roundTrip.xlsx.load(output);
  assert.equal(roundTrip.getWorksheet('Security').getCell('A1').value, 1);
  console.log('KaTeX trust/error handling and ExcelJS/UUID compatibility passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
