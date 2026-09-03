const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const runtime = require(path.join(root, 'lib/cjs/ui/runtime.js'));
const { $v } = require(path.join(root, 'lib/cjs/misc/validators.js'));

const seenKeys = new Set();
runtime.setVuetifyExtendedI18n({
  t: (key, values) => {
    seenKeys.add(key);
    if (key === 'app.validation.code') {
      return `Code requires ${values.count} characters`;
    }
    return `${key}:${JSON.stringify(values || {})}`;
  },
});

const descriptor = {
  key: 'app.validation.code',
  fallback: 'Code requires {count} characters',
  values: { count: 6 },
};
assert.equal(runtime.isUIValidationMessage(descriptor), true);
assert.equal(runtime.resolveUIValidationMessage(descriptor), 'Code requires 6 characters');
assert.equal(runtime.isUIValidationMessage(true), false);

assert.notEqual($v.isRequired()(''), true);
assert.notEqual($v.range(2, 4)(1), true);
assert.notEqual($v.range(2, 4)(5), true);
assert.notEqual($v.max(4)(5), true);
assert.notEqual($v.min(2)(1), true);
assert.notEqual($v.gt(2)(2), true);
assert.notEqual($v.lt(2)(2), true);
assert.notEqual($v.gte(2)(1), true);
assert.notEqual($v.lte(2)(3), true);
assert.notEqual($v.neq(2)(2), true);
assert.notEqual($v.eq(2)(3), true);
assert.notEqual($v.in(['a', 'b'])('c'), true);
assert.notEqual($v.nin(['a', 'b'])('a'), true);
assert.notEqual($v.includes('a')(['b']), true);
assert.notEqual($v.excludes('a')(['a']), true);
assert.notEqual($v.maxLen(2)('abc'), true);
assert.notEqual($v.minLen(3)('ab'), true);
assert.notEqual($v.regex('^a$')('b'), true);

for (const key of [
  've.validation.required',
  've.validation.max',
  've.validation.min',
  've.validation.greaterThan',
  've.validation.lessThan',
  've.validation.greaterThanOrEqual',
  've.validation.lessThanOrEqual',
  've.validation.notEqual',
  've.validation.equal',
  've.validation.oneOf',
  've.validation.notOneOf',
  've.validation.includes',
  've.validation.excludes',
  've.validation.maxLength',
  've.validation.minLength',
  've.validation.regex',
]) {
  assert.equal(seenKeys.has(key), true, `${key} was not resolved through the i18n adapter`);
}

const field = fs.readFileSync(path.join(root, 'src/ui/field.ts'), 'utf8');
const form = fs.readFileSync(path.join(root, 'src/ui/form.ts'), 'utf8');
const report = fs.readFileSync(path.join(root, 'src/ui/report.ts'), 'utf8');
const part = fs.readFileSync(path.join(root, 'src/ui/part.ts'), 'utf8');
const master = fs.readFileSync(path.join(root, 'src/master/master.ts'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'src/ui/dashboard.ts'), 'utf8');
const dialogForm = fs.readFileSync(path.join(root, 'src/ui/dialogform.ts'), 'utf8');
const selector = fs.readFileSync(path.join(root, 'src/ui/selector.ts'), 'utf8');
const trigger = fs.readFileSync(path.join(root, 'src/ui/trigger.ts'), 'utf8');

assert.match(field, /validate\?: \(field: Field\) => Promise<UIValidationResult>\|UIValidationResult/);
assert.match(field, /isUIValidationMessage\(result\) \? resolveUIText\(result\) : result/);
assert.match(field, /'ve\.validation\.fileMaxSize'/);
assert.match(form, /validate\?: \(form: Form\) => Promise<UIValidationResult>\|UIValidationResult/);
assert.match(form, /const validationFailed = isUIValidationMessage\(vres\)/);
assert.match(form, /const report = this\.\$parentReport;[\s\S]*await report\.validate\(this\)/);
assert.match(report, /validate\?: \(report: Report, form: Form, index: number\) => Promise<UIValidationResult>\|UIValidationResult/);
assert.match(report, /async validate\(form: Form, index: number = this\.currentIndex\.value\): Promise<UIValidationResult>/);
assert.match(report, /this\.options\.validate\(this, form, index\)/);
assert.match(
  report,
  /async forceSave\(\) \{\s*await this\.currentForm\?\.\$save\(\);\s*\}/,
  'Report.forceSave() must use the active Form save and validation pipeline.',
);
assert.doesNotMatch(
  report,
  /async forceSave\(\) \{\s*(?:await )?this\.save\(\)/,
  'Report.forceSave() must not bypass Form and Report validation.',
);

const formValidateStart = form.indexOf('  async validate (): Promise<UIValidationResult>');
const formValidateEnd = form.indexOf('\n  async saved()', formValidateStart);
const formValidateSource = form.slice(formValidateStart, formValidateEnd);
const ownValidationIndex = formValidateSource.indexOf('this.options.validate(this)');
const childValidationIndex = formValidateSource.indexOf('this.childrenInstances[i].validate()');
const reportValidationIndex = formValidateSource.indexOf('report.validate(this)');
assert.ok(
  ownValidationIndex >= 0 && ownValidationIndex < childValidationIndex && childValidationIndex < reportValidationIndex,
  'Report validation must run after the active form and its children.',
);
assert.match(
  formValidateSource,
  /if \(report\) \{[\s\S]*report\.validate\(this\)/,
  'Standalone forms must skip report-level validation.',
);
assert.match(part, /validate\?: \(part: Part\) => Promise<UIValidationResult>\|UIValidationResult/);
assert.match(master, /addValidation\(name: string, callback: \(data: any\) => Promise<UIValidationResult>\|UIValidationResult\)/);
assert.match(master, /key: 've\.validation\.error'/);

for (const [name, source] of [
  ['Dashboard', dashboard],
  ['DialogForm', dialogForm],
  ['Selector', selector],
  ['Trigger', trigger],
]) {
  assert.match(source, /async validate\s*\(\s*\): Promise<UIValidationResult>/, `${name} validation must support UIText results`);
}

runtime.setVuetifyExtendedI18n(undefined);
console.log('Localized validation contracts passed.');
