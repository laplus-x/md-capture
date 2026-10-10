import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extensionPath = path.resolve(__dirname, '../.output/chrome-mv3');

export const test = base.extend<{ 
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    await new Promise(r => setTimeout(r, 1000));
    const serviceWorkers = context.serviceWorkers();
    if (serviceWorkers.length > 0) {
      const extensionId = serviceWorkers[0].url().split('/')[2];
      await use(extensionId);
      return;
    }
    throw new Error('Extension ID not found');
  },
});

export const expect = test.expect;
