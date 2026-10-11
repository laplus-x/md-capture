import { test, expect } from './fixtures';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('popup renders and screenshot is captured', async ({ context, extensionId }) => {
  const popupUrl = `chrome-extension://${extensionId}/popup.html`;
  const page = await context.newPage();
  await page.goto(popupUrl);

  await expect(page.locator('.toolbar')).toBeVisible();
  await expect(page.locator('#convert-btn')).toBeVisible();
  await expect(page.locator('#status')).toBeVisible();
  await expect(page.locator('#output')).toBeVisible();

  const screenshotsDir = path.resolve(__dirname, '../test-results/screenshots');
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const screenshotPath = path.join(screenshotsDir, 'popup-initial.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await page.close();
});
