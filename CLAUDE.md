# Project Context

md-capture is a Chrome Manifest V3 extension built with WXT. The extension converts the active tab's URL to Markdown using the public service `https://markdown.new/`.

- Framework: WXT 0.19.0, TypeScript, ES Modules
- Entry points: `entrypoints/popup/` (HTML/CSS/TS popup), `entrypoints/background.ts` (no-op service worker used only for Playwright extension ID discovery)
- Manifest is generated from `wxt.config.ts`; version is sourced from `package.json`. Do not edit manifest version manually.
- Permissions: `activeTab`, host `https://markdown.new/*`

## Development Rules

- Inspect `wxt.config.ts`, `package.json`, `entrypoints/` and test configs before changing build or runtime behavior.
- Preserve package manager npm and Node >=20. Do not change module type.
- Do not add production background functionality; `entrypoints/background.ts` must remain no-op.
- Do not change production API semantics: popup uses GET `https://markdown.new/<url>` with `Accept: text/markdown`. Do not switch to POST.
- Prefer small, evidence-based changes. Verify with `npm run check` before committing.
- Conventional Commits are enforced; Release Please manages version bumps. Never create tags manually.

## Testing Rules

- Unit tests: `npm test` runs Vitest with WXT integration. Config in `vitest.config.ts`. Current `tests/` directory is empty; infrastructure exists for future unit tests.
- E2E tests: `npm run test:e2e` runs Playwright against real Chrome extension build.
  - Playwright launches Chromium with `--load-extension=.output/chrome-mv3`
  - Extension ID is resolved via `context.serviceWorkers()` in `e2e/fixtures.ts`; background worker is required for discovery.
  - Tests mock `chrome.tabs.query` via `page.addInitScript` and intercept `**/markdown.new/**` via `context.route` for deterministic responses.
  - Do not rely on live `markdown.new` service.
- Screenshots and artifacts are written to `test-results/screenshots/`. Playwright HTML report is at `playwright-report/`.
- Run `npm run build` before E2E tests if extension files changed.
- Run regression checks after changes: `npm run check && npm run build`.

## Evidence and Completion Rules

- Report actual commands executed and their results. Distinguish executed checks from unexecuted checks.
- Do not claim test success without running `npm test` or `npm run test:e2e`.
- Do not automatically approve changed screenshot baselines; inspect visually.
- Document environmental limitations, e.g., clipboard permissions cannot be granted to `chrome-extension://` origins in Playwright; clipboard is mocked.
- When correcting visual defects, record observed problem, change made, and post-correction result.

## Command Reference

- `npm run dev` – start WXT dev server on port 3000
- `npm run build` – build to `.output/chrome-mv3`
- `npm run typecheck` – TypeScript check
- `npm run lint` – ESLint
- `npm run format:check` – Prettier check
- `npm test` – Vitest unit tests
- `npm run test:e2e` – Playwright E2E tests
- `npm run check` – typecheck + lint + format:check + test
- `npm run verify` – check + build
