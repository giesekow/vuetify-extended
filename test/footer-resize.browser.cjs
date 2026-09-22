// npm install --no-save playwright (or point PLAYWRIGHT_MODULE at an existing installation).
// Run the test Vite server first; see footer-resize.md.
const assert = require('node:assert/strict');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  for (const engine of (process.env.BROWSERS || 'chromium,firefox,webkit').split(',')) {
    const browser = await playwright[engine].launch();
    try {
      const page = await browser.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${process.env.FOOTER_TEST_URL || 'http://localhost:4190'}/footer-resize.html`);
      await page.waitForSelector('#footer-content');
      const settled = async () => {
        await page.waitForFunction(() => {
          const footer = document.querySelector('footer');
          const main = document.querySelector('.v-main');
          return footer && main && Math.abs(parseFloat(getComputedStyle(main).paddingBottom) - footer.getBoundingClientRect().height) < 1;
        });
        // Allow a rendering opportunity for any queued observer loop error.
        await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
        assert.deepEqual(errors, []);
      };
      await settled();
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 800 });
        for (const height of [100, 24, 160, 26]) {
          await page.locator('#footer-content').evaluate((el, height) => { el.style.height = `${height}px`; }, height);
          await settled();
        }
        await page.locator('#footer-content').evaluate(el => {
          el.style.height = 'auto';
          el.textContent = 'Responsive footer content that wraps naturally. '.repeat(15);
        });
        await settled();
      }
      await page.evaluate(() => window.footerTest.show(false));
      await page.waitForFunction(() => !document.querySelector('footer'));
      await page.evaluate(() => window.footerTest.show(true));
      await page.waitForSelector('#footer-content');
      await settled();
      await page.evaluate(() => window.footerTest.unmount());
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      assert.deepEqual(errors, []);
      console.log(`${engine}: footer startup, grow/shrink, wrapping, resize, hide/show and unmount passed`);
    } finally { await browser.close(); }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
