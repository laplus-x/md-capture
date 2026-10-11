import { defineConfig } from 'vitest/config';
import { WxtVitest } from 'wxt/testing';

export default defineConfig({
  // WXT bundles its own vite copy whose types differ from the root vite; the cast is type-only.
  plugins: [(await WxtVitest()) as any],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // No unit tests exist yet; E2E coverage lives in e2e/. Prevents exit 1 on empty matches.
    passWithNoTests: true,
  },
});
