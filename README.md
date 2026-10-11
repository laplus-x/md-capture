# md-capture

Chrome Manifest V3 extension built with WXT that converts the current webpage to Markdown via `https://markdown.new/`.

## Project Overview

md-capture provides a popup UI that automatically converts the active tab URL to Markdown when opened. The user can view the Markdown output and copy it explicitly via a Copy button.

User workflow:
1. Open the extension popup
2. Popup queries the active tab URL via `chrome.tabs.query`
3. GET `https://markdown.new/<url>` with `Accept: text/markdown`
4. Display Markdown in a read-only textarea with loading / success / error states
5. Copy button copies the rendered Markdown and shows feedback

## Features and Limitations

Implemented:
- Popup with toolbar, status indicator, Markdown output, Convert / Retry / Copy controls
- Automatic conversion on popup open
- Loading, success, error states with retry
- Request timeout 30s, rate-limit handling for 429
- Permissions: `activeTab` and host `https://markdown.new/*`

Limitations:
- Conversion depends on external `markdown.new` service
- Clipboard write is mocked in tests; real clipboard requires user gesture
- No background functionality beyond no-op service worker for test discovery
- No visual regression baselines established

## Technology Stack

- WXT 0.19.0 for Chrome MV3 build
- TypeScript, ES Modules
- Vitest with `wxt/testing` for unit tests
- Playwright for E2E tests against real extension build

## Prerequisites and Installation

- Node >=20
- npm
- Chrome browser for manual testing

```bash
npm install
```

## Development Workflow

Start WXT dev server:

```bash
npm run dev
```

Dev server runs on port 3000. Load unpacked extension from `.output/chrome-mv3` after build.

### Git hooks

Husky runs quality hooks on commit, push, checkout, and merge. `pre-commit` formats and lints staged files, `pre-push` runs lint, format check, typecheck, and unit tests, and the post-operation hooks remind you when dependencies may need updates. See `docs/git-hooks.md` for details and failure behavior.

## Build and Production Usage

Build production extension:

```bash
npm run build
```

Output: `.output/chrome-mv3`

Load in Chrome:
1. Open `chrome://extensions`
2. Enable Developer mode
3. Load unpacked extension from `.output/chrome-mv3`

Manifest version is derived from `package.json` via `wxt.config.ts`.

## Testing

### Unit testing

```bash
npm test
```

Vitest config in `vitest.config.ts` uses `WxtVitest`. Environment: node. Include: `tests/**/*.test.ts`. Currently no unit tests exist; infrastructure is ready.

### E2E testing

```bash
npm run test:e2e
```

Playwright loads the built extension with `--load-extension=.output/chrome-mv3` and resolves extension ID via service worker.

Tests in `e2e/`:
- `e2e/popup.spec.ts` – popup renders and screenshot captured
- `e2e/conversion.spec.ts` – deterministic conversion workflow
  - Successful conversion renders markdown
  - Error state shows on failed conversion
  - Retry recovers after error
  - Copy requires explicit action and shows feedback

Tests mock `chrome.tabs.query` via `page.addInitScript` to return a fixed URL and intercept `**/markdown.new/**` via `context.route` for deterministic success / error responses. Clipboard API is mocked.

Run `npm run build` before E2E if extension code changed.

## Test Artifacts

- Test results: `test-results/`
- Screenshots: `test-results/screenshots/`
  - `popup-initial.png`
  - `conversion-success.png`
  - `conversion-error.png`
  - `conversion-retry.png`
  - `conversion-copy.png`
- Playwright HTML report: `playwright-report/`
- Build output: `.output/chrome-mv3` (gitignored)

Screenshots are generated on each run; they are not version-controlled baselines.

## Troubleshooting

- Build fails: ensure Node >=20 and run `npm ci`
- Playwright cannot find extension ID: ensure `entrypoints/background.ts` exists (no-op service worker required for discovery) and run `npm run build` first
- Chromium launch fails: check that `.output/chrome-mv3` exists and is a valid unpacked extension
- E2E assertions fail with "No valid tab URL": tests mock `chrome.tabs.query`; do not change mock without updating `e2e/conversion.spec.ts`
- Missing screenshots: ensure `test-results/screenshots` is writable and tests completed without early exit

## Release

Releases are managed by Release Please with Conventional Commits. Do not create tags manually. Merge to `main` triggers Release PR; after merge, tag `v<version>` and release are created automatically.
