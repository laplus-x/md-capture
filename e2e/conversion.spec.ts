import { test, expect } from './fixtures';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.resolve(__dirname, '../test-results/screenshots');

async function mockTabs(popup, url = 'https://example.com') {
  await popup.addInitScript(() => {
    // Override chrome.tabs.query for deterministic testing
    const mockTabs = [{ id: 1, url: 'https://example.com', active: true, currentWindow: true }];
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      Object.defineProperty(chrome.tabs, 'query', {
        value: async () => mockTabs,
        configurable: true,
      });
    }
    // Mock clipboard for deterministic tests
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      Object.defineProperty(navigator.clipboard, 'writeText', {
        value: async (text) => { /* no-op */ },
        configurable: true,
      });
    }
  });
}

test.describe('Markdown conversion workflow', () => {
  test('successful conversion renders markdown', async ({ context, extensionId }) => {
    // Setup deterministic response
    let requestUrl = '';
    await context.route('**/markdown.new/**', async route => {
      requestUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'text/markdown',
        body: '# Test Markdown\n\nThis is a **test** conversion.',
      });
    });

    // Open a page to provide active tab URL
    const page = await context.newPage();
    await page.goto('https://example.com');

    // Open popup
    const popup = await context.newPage();
    await mockTabs(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    // Wait for conversion to complete
    await expect(popup.locator('#status')).toContainText('Conversion succeeded');
    await expect(popup.locator('#output')).toHaveValue(/Test Markdown/);

    // Verify request
    expect(requestUrl).toContain('markdown.new');
    expect(requestUrl).toContain('example.com');

    // Screenshot
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await popup.screenshot({ path: path.join(screenshotsDir, 'conversion-success.png') });

    await popup.close();
    await page.close();
  });

  test('error state shows on failed conversion', async ({ context, extensionId }) => {
    await context.route('**/markdown.new/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'text/plain',
        body: 'Internal Server Error',
      });
    });

    const page = await context.newPage();
    await page.goto('https://example.com');

    const popup = await context.newPage();
    await mockTabs(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(popup.locator('#status')).toContainText('Request failed with 500');
    await expect(popup.locator('#retry-btn')).toBeVisible();

    fs.mkdirSync(screenshotsDir, { recursive: true });
    await popup.screenshot({ path: path.join(screenshotsDir, 'conversion-error.png') });

    await popup.close();
    await page.close();
  });

  test('retry recovers after error', async ({ context, extensionId }) => {
    let callCount = 0;
    await context.route('**/markdown.new/**', async route => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({ status: 500, body: 'Error' });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'text/markdown',
          body: '# Recovered',
        });
      }
    });

    const page = await context.newPage();
    await page.goto('https://example.com');

    const popup = await context.newPage();
    await mockTabs(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(popup.locator('#status')).toContainText('Request failed with 500');
    await popup.locator('#retry-btn').click();
    await expect(popup.locator('#status')).toContainText('Conversion succeeded');
    await expect(popup.locator('#output')).toHaveValue(/Recovered/);

    fs.mkdirSync(screenshotsDir, { recursive: true });
    await popup.screenshot({ path: path.join(screenshotsDir, 'conversion-retry.png') });

    await popup.close();
    await page.close();
  });

  test('copy requires explicit action and shows feedback', async ({ context, extensionId }) => {
    await context.route('**/markdown.new/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'text/markdown',
        body: '# Copy Test',
      });
    });

    const page = await context.newPage();
    await page.goto('https://example.com');

    const popup = await context.newPage();
    await mockTabs(popup);
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(popup.locator('#status')).toContainText('Conversion succeeded');
    const copyBtn = popup.locator('#copy-btn');
    await expect(copyBtn).toBeEnabled();

    await copyBtn.click();
    await expect(popup.locator('#status')).toContainText('Copied to clipboard');

    fs.mkdirSync(screenshotsDir, { recursive: true });
    await popup.screenshot({ path: path.join(screenshotsDir, 'conversion-copy.png') });

    await popup.close();
    await page.close();
  });
});
