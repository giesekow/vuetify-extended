const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '../src/ui/appmain.ts'), 'utf8');

const compactOverflowStart = source.indexOf('  private renderCompactShellOverflow(');
const resolveLocationStart = source.indexOf('  private resolveMobileShellLocation(', compactOverflowStart);
assert.notEqual(compactOverflowStart, -1, 'Unable to locate the mobile header overflow renderer.');
assert.notEqual(resolveLocationStart, -1, 'Unable to locate the end of the mobile header overflow implementation.');
const mobileOverflowSource = source.slice(compactOverflowStart, resolveLocationStart);

assert.match(mobileOverflowSource, /overflow\.length > 0[\s\S]*icon: 'mdi-menu'/,
  'The mobile overflow toggle must only render for effective overflow content.');
assert.match(mobileOverflowSource, /items[\s\S]{0,80}\.filter\(\(item\) => !this\.shouldHideShellItem\(item\)\)[\s\S]{0,80}\.map/,
  'Mobile-hidden shell items must be removed before overflow and hamburger visibility are calculated.');
assert.match(mobileOverflowSource, /this\.mobileHeaderDrawerOpen\.value = true/,
  'The overflow toggle must open the mobile header drawer.');
assert.match(mobileOverflowSource, /private renderMobileHeaderDrawer\(\)/,
  'The toggle must have a corresponding drawer renderer.');
assert.match(mobileOverflowSource, /if \(sections\.length === 0\) \{\s*return undefined;/,
  'The mobile header drawer must not exist without drawer-bound header content.');
assert.match(mobileOverflowSource, /VNavigationDrawer[\s\S]*location: 'right'[\s\S]*temporary: true/,
  'Mobile header overflow must render as a temporary right-side Vuetify drawer.');
assert.match(mobileOverflowSource, /mobileHeaderDrawerOpen\.value = false/,
  'The mobile header drawer must provide a close action.');
assert.match(source, /\.\.\.\(mobileHeaderDrawer \? \[mobileHeaderDrawer\] : \[\]\)/,
  'AppMain must mount the mobile header drawer inside VApp.');

const sideNavToggleStart = source.indexOf('  private shouldShowTemporarySideNavToggle(');
const sideNavToggleEnd = source.indexOf('  private renderTemporarySideNavToggle(', sideNavToggleStart);
assert.notEqual(sideNavToggleStart, -1, 'Unable to locate temporary side-navigation toggle visibility.');
assert.notEqual(sideNavToggleEnd, -1, 'Unable to locate the end of temporary side-navigation toggle visibility.');
const sideNavToggleSource = source.slice(sideNavToggleStart, sideNavToggleEnd);
assert.match(sideNavToggleSource, /return !!this\.sideNavMenuRef\(side\)\.value;/,
  'A temporary side-navigation toggle must require a successfully resolved menu.');
assert.doesNotMatch(sideNavToggleSource, /!!this\.options\.(leftNav|rightNav)/,
  'A configured resolver that returns no menu must not leave an orphan mobile toggle.');

console.log('Mobile header overflow drawer contracts passed.');
