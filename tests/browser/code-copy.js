/**
 * Browser regression checks against a local phpBB topic with two code blocks.
 * Input: COPYLINKS_TEST_URL; optional COPYLINKS_SCREENSHOT output path.
 * Requires Playwright and a running board with Copy Links enabled.
 */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async function () {
	if (!process.env.COPYLINKS_TEST_URL) {
		console.log('Usage: COPYLINKS_TEST_URL=http://localhost:PORT/viewtopic.php?t=ID node tests/browser/code-copy.js');
		return;
	}
	const browser = await chromium.launch({headless: !process.env.DISPLAY});
	try {
		const context = await browser.newContext();
		await context.addInitScript(function () {
			window.copiedTexts = [];
			Object.defineProperty(navigator, 'clipboard', {
				configurable: true,
				value: {writeText: async function (text) { window.copiedTexts.push(text); }}
			});
		});
		const page = await context.newPage();
		const errors = [];
		page.on('pageerror', error => errors.push(error.message));
		await page.goto(process.env.COPYLINKS_TEST_URL);
		const buttons = page.locator('.copylinks-code');
		await buttons.first().waitFor();
		assert.ok(await buttons.count() >= 2, 'fixture needs two code blocks');
		assert.equal(await page.locator('.codebox p a[onclick*="selectCode("]').count(), 0, 'Select all is replaced when JavaScript runs');
		assert.equal(await buttons.count(), await page.locator('.codebox pre > code').count());
		const expected = await page.locator('.codebox pre > code').allInnerTexts();
		const first = buttons.first();
		await first.click();
		await page.waitForFunction(() => document.getElementById('copylinks-status').textContent === 'The code has been copied.');
		assert.equal(await first.textContent(), 'Copied!');
		assert.equal(await page.evaluate(() => window.copiedTexts[0]), expected[0]);
		assert.ok(await first.evaluate(button => button === document.activeElement));
		await first.press('Enter');
		await first.press('Space');
		await page.waitForFunction(() => window.copiedTexts.length === 3);
		assert.deepEqual(await page.evaluate(() => window.copiedTexts), [expected[0], expected[0], expected[0]]);
		await buttons.nth(1).click();
		await page.waitForFunction(() => window.copiedTexts.length === 4);
		assert.equal(await page.evaluate(() => window.copiedTexts[3]), expected[1]);
		await page.waitForFunction(() => Array.from(document.querySelectorAll('.copylinks-code')).every(button => button.textContent === 'Copy code'));

		// Existing heading copying still uses the configured output format.
		await page.locator('h2.topic-title > a').click();
		await page.waitForFunction(() => window.copiedTexts.length === 5);
		const headingCopy = await page.evaluate(() => window.copiedTexts[4]);
		const plain = await page.locator('#copylinks-status').getAttribute('data-plain-url');
		assert.ok(plain === '1' ? /^https?:\/\//.test(headingCopy) : /^\[url=/.test(headingCopy));

		// Denied and missing APIs select the code in place for manual copying.
		for (const mode of ['denied', 'missing', 'insecure']) {
			await page.evaluate(mode => {
				Object.defineProperty(window, 'isSecureContext', {configurable: true, value: mode !== 'insecure'});
				Object.defineProperty(navigator, 'clipboard', {configurable: true, value: mode === 'missing' ? undefined : {
					writeText: () => Promise.reject(new Error('Clipboard denied'))
				}});
			}, mode);
			await first.click();
			await page.waitForFunction(() => document.getElementById('copylinks-status').textContent === 'Automatic copying failed. The code is selected; copy it manually.');
			assert.equal(await page.evaluate(() => window.getSelection().toString()), expected[0].replace(/\n$/, ''));
			assert.equal(await first.textContent(), 'Copy manually');
			assert.equal(await first.getAttribute('class'), 'copylinks-code');
			assert.ok(await first.evaluate(button => button === document.activeElement));
		}
		await page.evaluate(() => {
			Object.defineProperty(window, 'isSecureContext', {configurable: true, value: true});
			Object.defineProperty(navigator, 'clipboard', {configurable: true, value: {
				writeText: async text => { window.copiedTexts.push(text); }
			}});
			window.getSelection().removeAllRanges();
		});
		await first.click();
		await page.waitForFunction(() => document.querySelector('.copylinks-code').textContent === 'Copied!');
		assert.equal(await page.evaluate(() => window.copiedTexts[5]), expected[0]);
		await page.waitForFunction(() => document.querySelector('.copylinks-code').textContent === 'Copy code');
		await page.setViewportSize({width: 320, height: 740});
		await first.focus();
		await first.press('Tab');
		await page.keyboard.press('Shift+Tab');
		assert.ok(await first.evaluate(button => button === document.activeElement));
		assert.notEqual(await first.evaluate(button => getComputedStyle(button).outlineStyle), 'none');
		assert.ok(await first.evaluate(button => {
			const rect = button.getBoundingClientRect();
			return rect.left >= 0 && rect.right <= window.innerWidth;
		}));
		assert.match(await first.ariaSnapshot(), /button "Copy code"/);
		if (process.env.COPYLINKS_SCREENSHOT) {
			await page.locator('.codebox').first().screenshot({path: process.env.COPYLINKS_SCREENSHOT});
		}
		assert.deepEqual(errors, []);
		const noJS = await browser.newContext({javaScriptEnabled: false});
		const plainPage = await noJS.newPage();
		await plainPage.goto(process.env.COPYLINKS_TEST_URL);
		assert.equal(await plainPage.locator('.copylinks-code').count(), 0);
		assert.ok(await plainPage.locator('.codebox p a[onclick*="selectCode("]').count() >= 2);
		assert.equal(await plainPage.getByRole('link', {name: 'Select all', exact: true}).count(), expected.length);
		assert.deepEqual(await plainPage.locator('.codebox pre > code').allTextContents(), expected);
		await noJS.close();
		console.log('PASS: exact code, multiple blocks, Enter/Space, repeat feedback, one code control, heading format, denied/missing/insecure clipboard selection fallback and recovery, focus, 320px layout, accessible name, no-JS Select all and content.');
	} finally {
		await browser.close();
	}
})().catch(error => { console.error(error); process.exitCode = 1; });
