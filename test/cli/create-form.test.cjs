const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const cliEntry = path.join(repoRoot, 'lib', 'cjs', 'cli', 'index.js');
const { __testing } = require(path.join(repoRoot, 'lib', 'cjs', 'cli', 'create-ui.js'));

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function runCli(cwd, args, input = '') {
  return spawnSync(process.execPath, [cliEntry, ...args], {
    cwd,
    input,
    encoding: 'utf8',
  });
}

function assertSuccess(result, context) {
  assert.equal(
    result.status,
    0,
    `${context} failed.\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`,
  );
}

function testNonInteractiveLegacyReportPatch() {
  const cwd = makeTempDir('ve-cli-form-legacy-');
  writeFile(path.join(cwd, 'src/pages/people/form.ts'), `export function createPeopleForm(mode = "display") {
  return { mode };
}
`);
  writeFile(path.join(cwd, 'src/pages/people/report.ts'), `import { Report } from "vuetify-extended";
import { createPeopleForm } from "./form";

export function createPeopleReport(mode = "display") {
  return (entry) => {
    const resolvedMode = (entry && entry.mode) || mode;
    return new Report(
      {
        title: "People Workspace",
        objectType: "people",
        forms: 1,
        mode: resolvedMode,
      },
      {
        form: async (_props, _context, _index) => createPeopleForm(resolvedMode),
      },
    );
  };
}
`);
  writeFile(path.join(cwd, 'src/pages/people/index.ts'), `export { createPeopleForm } from "./form";
export { createPeopleReport } from "./report";
`);

  const result = runCli(cwd, ['create', 'form', 'people', '--non-interactive', '--step', '2', '--title', 'People Contact Details']);
  assertSuccess(result, 'non-interactive create form');

  const reportSource = fs.readFileSync(path.join(cwd, 'src/pages/people/report.ts'), 'utf8');
  const indexSource = fs.readFileSync(path.join(cwd, 'src/pages/people/index.ts'), 'utf8');
  const formSource = fs.readFileSync(path.join(cwd, 'src/pages/people/form-2.ts'), 'utf8');

  assert.match(reportSource, /forms:\s*2/);
  assert.match(reportSource, /createPeopleForm2/);
  assert.match(reportSource, /if \(index === 1\) return createPeopleForm2\(resolvedMode\);/);
  assert.match(indexSource, /export \{ createPeopleForm2 \} from '\.\/form-2';|export \{ createPeopleForm2 \} from "\.\/form-2";/);
  assert.match(formSource, /export function createPeopleForm2/);
}

function testInteractiveUsesExistingPageExtensionForDefaults() {
  const cwd = makeTempDir('ve-cli-form-mixed-ext-');
  writeFile(path.join(cwd, 'src/main.ts'), 'export {};\n');
  writeFile(path.join(cwd, 'src/pages/orders/form.js'), `export function createOrdersForm(mode = "display") {
  return { mode };
}
`);
  writeFile(path.join(cwd, 'src/pages/orders/form-2.js'), `export function createOrdersForm2(mode = "display") {
  return { mode };
}
`);
  writeFile(path.join(cwd, 'src/pages/orders/form-3.js'), `export function createOrdersForm3(mode = "display") {
  return { mode };
}
`);
  writeFile(path.join(cwd, 'src/pages/orders/report.js'), `import { Report } from "vuetify-extended";
import { createOrdersForm } from "./form";
// vuetify-ext:report-form-imports
import { createOrdersForm2 } from "./form-2";
import { createOrdersForm3 } from "./form-3";

export function createOrdersReport(mode = "display") {
  return new Report(
    {
      title: "Legacy Orders Workspace",
      objectType: "orders",
      forms: 3,
      mode,
    },
    {
      form: async (_props, _context, index) => {
        // vuetify-ext:report-form-resolver
        if (index === 0) return createOrdersForm(mode);
        if (index === 1) return createOrdersForm2(mode);
        if (index === 2) return createOrdersForm3(mode);
        return undefined;
      },
    },
  );
}
`);
  writeFile(path.join(cwd, 'src/pages/orders/index.js'), `export { createOrdersForm } from "./form";
export { createOrdersForm2 } from "./form-2";
export { createOrdersForm3 } from "./form-3";
export { createOrdersReport } from "./report";
`);

  const context = __testing.resolveFormStepPageContext(cwd, 'orders', '.ts');
  assert.equal(context.pageExt, '.js');
  assert.equal(path.basename(context.reportFile), 'report.js');
  assert.equal(context.currentForms, 3);
  assert.equal(context.reportTitle, 'Legacy Orders Workspace');
}

function main() {
  testNonInteractiveLegacyReportPatch();
  testInteractiveUsesExistingPageExtensionForDefaults();
  process.stdout.write('CLI create form tests passed.\n');
}

main();
