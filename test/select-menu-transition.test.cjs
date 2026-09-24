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
   resolvedLabel: () => 'Choice', resolvedHint: () => '', resolvedPlaceholder: () => '', rules: () => [],
   isServerAutocomplete: () => server, autocompleteLoadMoreMode: () => 'scroll',
   autocompleteNoDataText: () => 'Empty', autocompleteTableSelectedText: () => 'Selected',
   onAutocompleteListScroll: event => { field.lastScroll = event; },
   scheduleServerAutocompleteSearch: value => { field.lastSearch = value; },
  });
  const node = kind === 'select' ? field.buildSelect() : kind.startsWith('table') ? field.buildAutocompleteTable().children[0] : field.buildAutocomplete();
  assert.equal(Object.hasOwn(node.props, 'transition'), transition !== undefined, kind);
  assert.equal(node.props.transition, transition, kind);
  assert.equal(node.props.items, field.selectItems.value);
  if (server) {
   assert.equal(node.props.menuProps.contentClass, 'server-options');
   assert.equal(node.props.noFilter, true);
   assert.equal(node.props.search, 'query');
   node.props['onUpdate:search']('next'); assert.equal(field.lastSearch, 'next');
   node.props.listProps.onScrollPassive('scroll'); assert.equal(field.lastScroll, 'scroll');
   assert.equal(typeof node.children['append-item'], 'function');
  } else assert.equal(node.props.menuProps, undefined);
  // Re-render after clearing the option must restore the default contract.
  field.params.value.menuTransition = undefined;
  const reset = kind === 'select' ? field.buildSelect() : kind.startsWith('table') ? field.buildAutocompleteTable().children[0] : field.buildAutocomplete();
  assert.equal(Object.hasOwn(reset.props, 'transition'), false);
  cases++;
 }
}
console.log(`${cases} select/autocomplete transition cases passed, including default restoration and server menu/search/scroll preservation.`);
const config = ts.readConfigFile(require.resolve('../tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, require('node:path').resolve(__dirname, '..'));
const program = ts.createProgram([require.resolve('./select-menu-transition.types.ts')], { ...parsed.options, noEmit: true });
const diagnostics = ts.getPreEmitDiagnostics(program);
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
 getCanonicalFileName: file => file, getCurrentDirectory: () => process.cwd(), getNewLine: () => '\n',
}));
console.log('FieldParams transition type contract passed.');
