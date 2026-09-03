const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dialogs = fs.readFileSync(path.join(root, 'src/ui/dialogs.ts'), 'utf8');
const dialogForm = fs.readFileSync(path.join(root, 'src/ui/dialogform.ts'), 'utf8');
const selector = fs.readFileSync(path.join(root, 'src/ui/selector.ts'), 'utf8');
const setup = fs.readFileSync(path.join(root, 'src/setup/index.ts'), 'utf8');

for (const property of ['width', 'maxWidth', 'minWidth', 'height', 'maxHeight', 'minHeight']) {
  assert.match(dialogForm, new RegExp(`${property}\\?: number\\|string`), `DialogSizeParams must expose ${property}`);
}

assert.match(dialogs, /interface ConfirmParams extends DialogSizeParams/);
assert.match(dialogs, /interface InfoParams extends DialogSizeParams/);
assert.match(dialogs, /interface PromptParams extends DialogSizeParams/);
assert.match(dialogs, /interface ImagePreviewParams extends DialogSizeParams/);
assert.match(dialogs, /interface IframeParams extends DialogSizeParams/);

for (const kind of ['Confirm', 'Info', 'Prompt', 'ImagePreview', 'Iframe', 'DocumentPreview']) {
  assert.match(dialogs, new RegExp(`static set${kind}Default\\(`), `Dialogs.set${kind}Default must exist`);
}

assert.match(dialogs, /static async \$confirm\(text: UIText, title\?: UIText, params\?: ConfirmParams\)/);
assert.match(dialogs, /const resolvedParams = \{\.\.\.Dialogs\.confirmDefaults, \.\.\.\(params \|\| \{\}\)\}/);
assert.match(dialogs, /Dialogs\.confirmParams\.value = resolvedParams/);
assert.match(dialogs, /Dialogs\.promptDefaults = Dialogs\.mergePromptParams\(Dialogs\.promptDefaults, value\)/);
assert.match(dialogs, /private static mergePromptParams\(base: PromptParams, override: PromptParams\)/);
assert.match(dialogs, /const resolvedParams = \{\.\.\.Dialogs\.iframeDefaults, \.\.\.\(params \|\| \{\}\)\}/);
assert.match(dialogs, /const resolvedParams = \{\.\.\.Dialogs\.documentPreviewDefaults, \.\.\.\(params \|\| \{\}\)\}/);

for (const property of ['width', 'maxWidth', 'minWidth', 'height', 'maxHeight', 'minHeight']) {
  assert.match(dialogForm, new RegExp(`${property}: [^\\n]*this\\.params\\.value\\.${property}`), `DialogForm must render ${property}`);
  assert.match(selector, new RegExp(`this\\.params\\.value\\.${property}`), `Selector must render ${property}`);
}

const bootstrapDefaults = [
  ['confirm', 'Confirm'],
  ['info', 'Info'],
  ['prompt', 'Prompt'],
  ['imagePreview', 'ImagePreview'],
  ['iframe', 'Iframe'],
  ['documentPreview', 'DocumentPreview'],
];

for (const [key, method] of bootstrapDefaults) {
  assert.match(setup, new RegExp(`${key}\\?:`), `VuetifyExtendedDefaults must expose ${key}`);
  assert.match(setup, new RegExp(`Dialogs\\.set${method}Default\\(defaults\\.${key}, reset\\)`), `bootstrap must apply ${key} defaults`);
}

console.log('Dialog sizing and defaults tests passed.');
