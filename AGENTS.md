# md-capture – Agent Notes

## What it is
Chrome Manifest V3 extension built with WXT. Converts current tab to Markdown via `https://markdown.new/`. ESM, TypeScript, Node >=20.

## Key commands
- `npm run dev` – WXT dev server, dev server on port 3000 per `wxt.config.ts`
- `npm run build` – production build → `.output/chrome-mv3`
- `npm run typecheck` – `tsc --noEmit -p .wxt/tsconfig.json`
- `npm run lint` – `eslint . --ext .ts`
- `npm run format:check` – prettier check
- `npm test` – Vitest, config `vitest.config.ts` with `WxtVitest`, environment node, includes `tests/**/*.test.ts`
- `npm run test:e2e` – Playwright, config `playwright.config.ts`, test dir `e2e`
- `npm run check` – typecheck → lint → format:check → test
- `npm run verify` – check → build

Quality gate order matters. CI runs lint, format:check, typecheck, tests, build.

## Architecture
- Entry points: `entrypoints/popup/` – `index.html`, `main.ts`, `style.css`
- Background: `entrypoints/background.ts` exists only for test discovery, no-op via `defineBackground`. Required for Playwright `context.serviceWorkers()` extensionId resolution. Does not change product contract.
- Manifest version is derived from `package.json` version in `wxt.config.ts`. Do not edit manifest version manually.
- Permissions: `activeTab`, host `https://markdown.new/*`

## Testing quirks
- Playwright loads unpacked extension with `--disable-extensions-except` and `--load-extension=.output/chrome-mv3`. Extension ID is obtained from service worker.
- E2E tests mock `chrome.tabs.query` via `page.addInitScript` to return a deterministic URL and mock `navigator.clipboard.writeText`. Do not rely on live `markdown.new`.
- Requests to `**/markdown.new/**` are intercepted with `context.route` for deterministic success / error / retry scenarios.
- Screenshots saved to `test-results/screenshots`.
- `e2e/fixtures.ts` provides `context` and `extensionId`. Do not change fixture discovery without also handling background worker requirement.

## Dev workflow conventions
- Conventional Commits enforced via commitlint. Release Please manages version bumps and changelog. No manual tags.
- Load extension in Chrome via unpacked `.output/chrome-mv3` after `npm run build`.
- Code style: ESLint + Prettier. Ignores `.wxt/**`, `node_modules/**`, `.output/**`.
- Do not add production background functionality. Keep background no-op.

## Important files
- `wxt.config.ts` – manifest version sync, dev port
- `package.json` – version source of truth
- `playwright.config.ts` – extension load args
- `e2e/fixtures.ts` – extension ID discovery
- `docs/test-background-worker.md` – why background worker exists

Prefer executable sources over docs. If `README.md` conflicts with scripts/config, trust scripts/config.
