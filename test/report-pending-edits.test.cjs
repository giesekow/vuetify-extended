const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function subject(file, names, globals = {}) {
  const source = fs.readFileSync(require.resolve('../src/ui/' + file + '.ts'), 'utf8');
  const ast = ts.createSourceFile(file + '.ts', source, ts.ScriptTarget.Latest, true);
  const cls = ast.statements.find(n => ts.isClassDeclaration(n));
  const methods = cls.members.filter(n => names.includes(n.name?.getText(ast))).map(n => n.getText(ast));
  assert.equal(methods.length, names.length);
  const js = ts.transpileModule('class Subject {' + methods.join('\n') + '}\nSubject;', {}).outputText;
  return vm.runInNewContext(js, globals);
}
(async () => {
  let release;
  const loading = new Promise(resolve => release = resolve);
  const Report = subject('report', ['initialize']);
  const report = new Report();
  report.initializing = {value:true}; report.hasAccess = {value:true};
  report.runAccess = async()=>{}; report.resolveFormCount=async()=>{};
  report.prepareForm=async()=>{}; report.loadObject=()=>loading;
  let focused=false;report.focusCurrentForm=async()=>{assert.equal(report.initializing.value,false);focused=true;};
  const pending=report.initialize({},{}); await Promise.resolve();await Promise.resolve();
  assert.equal(report.initializing.value,true);assert.equal(focused,false);
  release();await pending;assert.equal(report.initializing.value,false);assert.equal(focused,true);

  const chosen={}; const document={activeElement:chosen};
  const Form=subject('form',['focusPrimaryInput'],{document,nextTick:async()=>{}});
  const form=new Form(); form.cardRoot={value:{contains:el=>el===chosen}};
  form.focusSpecialFieldTarget=async()=>{throw Error('Must preserve chosen control');};
  await form.focusPrimaryInput();
  document.activeElement=null;let focusCount=0;
  form.focusSpecialFieldTarget=async()=>false;
  form.findFocusTarget=()=>({focus:()=>{focusCount++;}});
  await form.focusPrimaryInput();assert.equal(focusCount,1);
  document.activeElement=null;
  form.focusSpecialFieldTarget=async()=>{document.activeElement=chosen;return false;};
  await form.focusPrimaryInput();assert.equal(focusCount,1);

  let resume;const FocusReport=subject('report',['focusCurrentForm'],{sleep:()=>new Promise(r=>resume=r)});
  const changing=new FocusReport();changing.currentForm={focusPrimaryInput:async()=>{throw Error('Stale focus');}};
  const queued=changing.focusCurrentForm();changing.currentForm={};resume();await queued;
  const source=fs.readFileSync(require.resolve('../src/ui/report.ts'),'utf8');
  assert.match(source,/if \(this.initializing.value \|\| this.currentIndex.value === -1/);
  assert.match(source,/if \(!this.initializing.value\) this.focusCurrentForm\(\)/);
  console.log('Report initial-load gating, focus preservation and stale-focus regressions passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
