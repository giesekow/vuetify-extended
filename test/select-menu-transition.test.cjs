const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require.resolve('../src/ui/field.ts'), 'utf8');
const method = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const context = {
  VSelect: 'select', VAutocomplete: 'autocomplete', VBtn: 'button', VIcon: 'icon', VCard: 'card', VDataTable: 'table',
  Master: { resolveItemValueField: () => 'id' }, resolveUITableHeaders: value => value,
};
vm.createContext(context);
vm.runInContext(ts.transpileModule(`class Field {
${method('  get $popupReady()', '  private popupLifecycleProps(')}
${method('  onFocusChanged(', '  mounted(')}
${method('  private popupLifecycleProps(', '  buildSelect(')}
${method('  buildSelect(', '  buildRadioSelect(')}
${method('  private autocompleteServerInputProps(', '  private buildAutocompleteLoadMoreItem(')}
${method('  buildAutocomplete(', '  private richWidgetContext(')}
}; globalThis.Field = Field;`, { compilerOptions: { target: ts.ScriptTarget.ES2020 } }).outputText, context);
let cases = 0;
for (const kind of ['select', 'local', 'server', 'table-local', 'table-server']) {
 for (const transition of [undefined, false, 'fade-transition']) {
  const server = kind.includes('server');
  const field = Object.assign(new context.Field(), {
   $h: (type, props, children) => ({ type, props, children }),
   params: { value: transition === undefined ? {} : { menuTransition: transition } },
   modelValue: { value: [] }, selectItems: { value: [{ id: 'one', name: 'One' }] },
   autocompleteLoading: { value: false }, optionLoading: { value: false },
   autocompleteSearchText: { value: 'query' }, autocompleteMenuClass: 'server-options',
   autocompleteTablePendingItem: { value: null }, autocompleteTableHeaders: { value: [] },
   autocompleteTableSelectedKeys: { value: [] },
   modelBinding: () => ({ modelValue: 'one' }), inputIconProps: () => ({}),
   popupLifecycleProps: () => ({}),
   resolvedLabel: () => 'Choice', resolvedHint: () => '', resolvedPlaceholder: () => '', rules: () => [],
   isServerAutocomplete: () => server, autocompleteLoadMoreMode: () => 'scroll',
   autocompleteNoDataText: () => 'Empty', autocompleteTableSelectedText: () => 'Selected',
   onAutocompleteListScroll: event => { field.lastScroll = event; },
   scheduleServerAutocompleteSearch: value => { field.lastSearch = value; },
  });
  const node = kind === 'select' ? field.buildSelect() : kind.startsWith('table') ? field.buildAutocompleteTable().children[0] : field.buildAutocomplete();
  const popupProps = kind === 'select' ? node.props : (node.props.menuProps || {});
  assert.equal(Object.hasOwn(popupProps, 'transition'), transition !== undefined, kind);
  assert.equal(popupProps.transition, transition, kind);
  if (kind !== 'select') assert.equal(Object.hasOwn(node.props, 'transition'), false);
  assert.equal(node.props.items, field.selectItems.value);
  if (server) {
   assert.equal(node.props.menuProps.contentClass, 'server-options');
   assert.equal(node.props.noFilter, true);
   assert.equal(node.props.search, 'query');
   node.props['onUpdate:search']('next'); assert.equal(field.lastSearch, 'next');
   node.props.listProps.onScrollPassive('scroll'); assert.equal(field.lastScroll, 'scroll');
   assert.equal(typeof node.children['append-item'], 'function');
  } else if (kind === 'select' || transition === undefined) assert.equal(node.props.menuProps, undefined);
  // Re-render after clearing the option must restore the default contract.
  field.params.value.menuTransition = undefined;
  const reset = kind === 'select' ? field.buildSelect() : kind.startsWith('table') ? field.buildAutocompleteTable().children[0] : field.buildAutocomplete();
  assert.equal(Object.hasOwn(reset.props, 'transition'), false);
  assert.equal(Object.hasOwn(reset.props.menuProps || {}, 'transition'), false);
  if (server) assert.equal(reset.props.menuProps.contentClass, 'server-options');
  cases++;
 }
}
console.log(`${cases} select/autocomplete transition cases passed, including default restoration and server menu/search/scroll preservation.`);
// Exercise pending user intent independently of popup styling/prop forwarding.
const { ref } = require('vue');
const outerOwner = { $popupReady: false, $popupGeneration: 1 };
const owner = { $popupReady: false, $popupGeneration: 1, $parent: outerOwner };
const field = Object.assign(new context.Field(), {
  $parent: { $parent: owner }, popupRequest: ref(),
  params: ref({ type: 'select' }), handleOn: () => {}, isServerAutocomplete: () => false,
});
let popup = field.popupLifecycleProps();
assert.equal(popup.menu, false);
popup['onUpdate:menu'](true);
assert.equal(field.popupLifecycleProps().menu, false, 'entry must hold the opening request');
owner.$popupReady = true;
assert.equal(field.popupLifecycleProps().menu, false, 'a nested dialog must also wait for outer entry');
outerOwner.$popupReady = true;
assert.equal(field.popupLifecycleProps().menu, true, 'after-enter replays the request once every owner is ready');
outerOwner.$popupReady = false;
outerOwner.$popupGeneration++;
outerOwner.$popupReady = true;
assert.equal(field.popupLifecycleProps().menu, false, 'outer dialog reopen cannot replay stale user intent');
field.popupLifecycleProps()['onUpdate:menu'](true);
assert.equal(field.popupLifecycleProps().menu, true, 'fresh intent captures every enclosing dialog generation');
owner.$parent = undefined;
field.onFocusChanged(false);
assert.equal(field.popupLifecycleProps().menu, false, 'removing an enclosing dialog invalidates its popup request');
field.popupLifecycleProps()['onUpdate:menu'](true);
field.onFocusChanged(false);
assert.equal(field.popupLifecycleProps().menu, true, 'native focus transfer into an open popup must not discard its request');
field.popupLifecycleProps()['onUpdate:menu'](false);
assert.equal(field.popupLifecycleProps().menu, false, 'native selection/close clears the request');
owner.$popupReady = false;
field.popupLifecycleProps()['onUpdate:menu'](true);
field.onFocusChanged(false);
owner.$popupReady = true;
assert.equal(field.popupLifecycleProps().menu, false, 'blur cancels a pending request');
owner.$popupReady = false;
field.popupLifecycleProps()['onUpdate:menu'](true);
field.popupLifecycleProps().onKeydown({ key: 'Escape' });
owner.$popupReady = true;
assert.equal(field.popupLifecycleProps().menu, false, 'escape cancels a pending request');
field.popupLifecycleProps()['onUpdate:menu'](true);
owner.$popupGeneration++;
assert.equal(field.popupLifecycleProps().menu, false, 'reopen cannot replay stale user intent');
field.$parent = { $popupReady: true, $popupGeneration: owner.$popupGeneration };
assert.equal(field.popupLifecycleProps().menu, false, 'moving between dialogs cannot replay user intent');
field.$parent = undefined;
assert.equal(Object.keys(field.popupLifecycleProps()).length, 0, 'outside dialogs Vuetify retains menu ownership');
console.log('Dialog popup request, replay, close, escape, reopen and owner-change cases passed.');
const collection = Object.assign(new context.Field(), {
  params: ref({ type: 'collection' }), collectionDialog: ref(false),
  collectionPopupReady: ref(false), collectionPopupGeneration: 0,
});
assert.equal(collection.$popupReady, false);
collection.openCollectionDialog();
assert.equal(collection.$popupGeneration, 1);
assert.equal(collection.$popupReady, false);
collection.collectionPopupReady.value = true;
assert.equal(collection.$popupReady, true);
collection.collectionDialog.value = false;
assert.equal(collection.$popupReady, false);
collection.openCollectionDialog();
assert.equal(collection.$popupGeneration, 2);
assert.equal(collection.$popupReady, false);
collection.params.value.type = 'select';
assert.equal(collection.$popupReady, undefined, 'ordinary fields do not own a dialog');
const config = ts.readConfigFile(require.resolve('../tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, require('node:path').resolve(__dirname, '..'));
const program = ts.createProgram([require.resolve('./select-menu-transition.types.ts')], { ...parsed.options, noEmit: true });
const diagnostics = ts.getPreEmitDiagnostics(program);
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
 getCanonicalFileName: file => file, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n',
}));
console.log('FieldParams transition type contract passed.');
const browserSource = fs.readFileSync(require.resolve('./select-menu-transition.browser.cjs'), 'utf8');
assert.doesNotMatch(browserSource, /transition\s*!==\s*['"]default['"]/, 'default transitions must not be excluded from browser failures');
assert.match(browserSource, /results\.filter\(r => r\.pageErrors\.length \|\| r\.windowErrors\.length\)/);
console.log('Browser transition suite enforces captured errors for every transition mode.');
