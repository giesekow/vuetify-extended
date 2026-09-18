const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');

function subject(file, names, globals = {}) {
  const source = fs.readFileSync(require.resolve('../src/ui/' + file + '.ts'), 'utf8');
  const ast = ts.createSourceFile(file + '.ts', source, ts.ScriptTarget.Latest, true);
  const cls = ast.statements.find(node => ts.isClassDeclaration(node));
  const methods = cls.members
    .filter(node => names.includes(node.name?.getText(ast)))
    .map(node => node.getText(ast));

  assert.equal(methods.length, names.length);
  const js = ts.transpileModule('class Subject {' + methods.join('\n') + '}\nSubject;', {}).outputText;
  return vm.runInNewContext(js, globals);
}

function reportRenderSubject() {
  const h = (component, props, children) => ({
    component,
    props,
    children: typeof children === 'function' ? children() : children,
  });
  const components = {
    VContainer: 'VContainer',
    VLayout: 'VLayout',
    VRow: 'VRow',
    VCol: 'VCol',
    VCard: 'VCard',
    VDivider: 'VDivider',
  };
  const Report = subject('report', ['render'], components);
  const report = new Report();
  report.$h = h;
  report.loaded = true;
  report.lastProps = undefined;
  report.lastContext = undefined;
  report.initializing = { value: true };
  report.currentIndex = { value: 0 };
  report.currentFormRenderKey = { value: 1 };
  report.hasAccess = { value: true };
  report.params = {
    value: {
      fluid: true,
      verticalAlign: 'center',
      horizontalAlign: 'center',
    },
  };
  report.wrapWithSideButtons = (_props, _context, content) => content;
  report.buildTitle = () => 'title';
  report.buildTopActions = () => 'top-actions';
  report.buildBody = () => 'body';
  report.buildBottomActions = () => 'bottom-actions';
  report.buildProgressHeader = () => undefined;
  return report;
}

(async () => {
  let releaseLoad;
  const loading = new Promise(resolve => { releaseLoad = resolve; });
  const Report = subject('report', ['initialize']);
  const report = new Report();
  report.initializing = { value: true };
  report.hasAccess = { value: true };
  report.runAccess = async () => {};
  report.resolveFormCount = async () => {};
  report.prepareForm = async () => {};
  report.loadObject = () => loading;
  let focused = false;
  report.focusCurrentForm = async () => {
    assert.equal(report.initializing.value, false);
    focused = true;
  };

  const pending = report.initialize({}, {});
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(report.initializing.value, true);
  assert.equal(focused, false);
  releaseLoad();
  await pending;
  assert.equal(report.initializing.value, false);
  assert.equal(focused, true);

  const denied = new Report();
  denied.initializing = { value: true };
  denied.hasAccess = { value: false };
  denied.runAccess = async () => {};
  denied.resolveFormCount = async () => { throw new Error('Access-denied reports must not prepare forms'); };
  await denied.initialize({}, {});
  assert.equal(denied.initializing.value, false);

  const failed = new Report();
  failed.initializing = { value: true };
  failed.hasAccess = { value: true };
  failed.runAccess = async () => {};
  failed.resolveFormCount = async () => {};
  failed.prepareForm = async () => {};
  failed.loadObject = async () => { throw new Error('load failed'); };
  failed.focusCurrentForm = async () => { throw new Error('Failed initialization must not focus'); };
  await assert.rejects(() => failed.initialize({}, {}), /load failed/);
  assert.equal(failed.initializing.value, false);

  const loadingRender = reportRenderSubject();
  Object.defineProperty(loadingRender, 'currentForm', {
    get() { throw new Error('The form must not render while initialization is pending'); },
  });
  assert.equal(loadingRender.render({}, {}).component, 'VContainer');

  const readyRender = reportRenderSubject();
  readyRender.initializing.value = false;
  readyRender.currentForm = { component: 'CurrentForm' };
  const rendered = readyRender.render({}, {});
  assert.match(JSON.stringify(rendered), /CurrentForm/);

  const chosen = {};
  const document = { activeElement: chosen };
  const Form = subject('form', ['focusPrimaryInput'], { document, nextTick: async () => {} });
  const form = new Form();
  form.cardRoot = { value: { contains: element => element === chosen } };
  form.focusSpecialFieldTarget = async () => { throw new Error('Must preserve chosen control'); };
  await form.focusPrimaryInput();

  document.activeElement = null;
  let focusCount = 0;
  form.focusSpecialFieldTarget = async () => false;
  form.findFocusTarget = () => ({ focus: () => { focusCount += 1; } });
  await form.focusPrimaryInput();
  assert.equal(focusCount, 1);

  document.activeElement = null;
  form.focusSpecialFieldTarget = async () => {
    document.activeElement = chosen;
    return false;
  };
  await form.focusPrimaryInput();
  assert.equal(focusCount, 1);

  let resumeReportFocus;
  const FocusReport = subject('report', ['focusCurrentForm'], {
    sleep: () => new Promise(resolve => { resumeReportFocus = resolve; }),
  });
  const changing = new FocusReport();
  changing.currentForm = { focusPrimaryInput: async () => { throw new Error('Stale focus'); } };
  const queuedReportFocus = changing.focusCurrentForm();
  changing.currentForm = {};
  resumeReportFocus();
  await queuedReportFocus;

  let sleepImpl = async () => {};
  const editorDocument = { activeElement: null };
  const Field = subject('field', ['focusHtmlEditor', 'focusPrimaryInput'], {
    document: editorDocument,
    window: {},
    sleep: (...args) => sleepImpl(...args),
  });
  const field = new Field();
  field.$readonly = false;
  field.params = { value: { invisible: false, type: 'html' } };
  const body = {
    isConnected: true,
    contains: element => element === body,
    focus: () => { editorDocument.activeElement = body; },
  };
  let editorFocusCount = 0;
  const editor = {
    getBody: () => body,
    focus: () => { editorFocusCount += 1; },
  };
  field.htmlEditor = editor;

  const initialControl = {};
  editorDocument.activeElement = initialControl;
  assert.equal(await field.focusPrimaryInput(), true);
  assert.equal(editorFocusCount, 1);

  let resumeEditorFocus;
  sleepImpl = () => new Promise(resolve => { resumeEditorFocus = resolve; });
  editorDocument.activeElement = initialControl;
  const queuedEditorFocus = field.focusPrimaryInput();
  await Promise.resolve();
  editorDocument.activeElement = chosen;
  resumeEditorFocus();
  assert.equal(await queuedEditorFocus, false);
  assert.equal(editorFocusCount, 1);

  let resumeReplacedEditor;
  sleepImpl = () => new Promise(resolve => { resumeReplacedEditor = resolve; });
  editorDocument.activeElement = initialControl;
  const queuedReplacedEditor = field.focusPrimaryInput();
  await Promise.resolve();
  field.htmlEditor = { getBody: () => body, focus: () => { editorFocusCount += 1; } };
  resumeReplacedEditor();
  assert.equal(await queuedReplacedEditor, false);
  assert.equal(editorFocusCount, 1);

  console.log('Report initial-load gating and focus-preservation regressions passed.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
