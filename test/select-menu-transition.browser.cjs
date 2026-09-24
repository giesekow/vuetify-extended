const assert = require('node:assert/strict');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
 const results = [];
 for (const engine of (process.env.BROWSERS || 'chromium,firefox,webkit').split(',')) {
  const browser = await playwright[engine].launch();
  try {
   for (const kind of ['select', 'local', 'server']) for (const transition of ['', 'false', 'fade-transition']) {
    const page = await browser.newPage();
    page.setDefaultTimeout(15000);
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.addInitScript(() => {
     window.browserErrors = []; window.browserStage = 'boot';
     window.addEventListener('error', event => window.browserErrors.push({ stage: window.browserStage, message: event.message }));
     window.addEventListener('unhandledrejection', event => window.browserErrors.push({ stage: window.browserStage, message: String(event.reason) }));
    });
    await page.goto(`${process.env.SELECT_TEST_URL || 'http://127.0.0.1:4193'}/select-menu-transition.html?kind=${kind}&transition=${transition}`);
    await page.waitForFunction(() => typeof window.openPreview === 'function');
    await page.evaluate(() => { window.browserStage = 'outer-dialog'; window.openPreview(); });
    await page.evaluate(() => { window.browserStage = 'child-dialog'; });
    await page.getByRole('dialog').locator('button').filter({ has: page.locator('.mdi-plus') }).click();
    const field = page.getByRole('combobox', { name: 'Placeholder', exact: true });
    await field.locator('..').click({ trial: true });
    for (let i = 0; i < 3; i++) {
     await page.evaluate(() => { window.browserStage = 'select'; });
     await field.focus();
     if (kind === 'server') await field.fill('mes');
     else await field.press('Enter');
     await page.getByRole('option', { name: 'message', exact: true }).click();
     await page.waitForTimeout(350);
    }
    await page.evaluate(() => { window.browserStage = 'save-close'; });
    await page.getByRole('textbox', { name: 'Test value', exact: true }).fill('Transient');
    const child = page.getByRole('dialog').filter({ has: page.getByRole('textbox', { name: 'Test value', exact: true }) });
    await child.getByRole('button', { name: 'Save', exact: true }).first().click();
    assert.equal(await child.getByRole('textbox', { name: 'Test value', exact: true }).inputValue(), '');
    await child.getByRole('button', { name: 'Cancel', exact: true }).first().click();
    await page.getByText('Transient', { exact: true }).waitFor();
    await page.waitForTimeout(350);
    const windowErrors = await page.evaluate(() => window.browserErrors);
    const result = { engine, kind, transition: transition || 'default', pageErrors, windowErrors };
    results.push(result); console.log(JSON.stringify(result));
    // Default observations are retained for reproduction, never suppressed.

    await page.close();
   }
  } finally { await browser.close(); }
 }
 if (process.env.SELECT_RESULTS) require('node:fs').writeFileSync(process.env.SELECT_RESULTS, JSON.stringify(results, null, 2) + '\n');
 assert.deepEqual(results.filter(r => r.transition !== 'default' && (r.pageErrors.length || r.windowErrors.length)), [], 'Configured transitions must have no runtime errors');
})().catch(error => { console.error(error); process.exitCode = 1; });
