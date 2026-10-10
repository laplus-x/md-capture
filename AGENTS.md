# md-capture

## Project

- Chrome Manifest V3 extension.
- Framework: WXT 0.19.0.
- Language: TypeScript, ESM.
- Runtime: Node.js >=20.
- Package manager: npm.
- Purpose: Convert the active tab URL to Markdown with `https://markdown.new/`.

## Commands

Check `package.json` before you change or document a command.

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Start the WXT dev server on port 3000.                    |
| `npm run build`        | Build the Chrome extension. Output: `.output/chrome-mv3`. |
| `npm run typecheck`    | Run TypeScript checks.                                    |
| `npm run lint`         | Run ESLint.                                               |
| `npm run format:check` | Check formatting with Prettier.                           |
| `npm test`             | Run Vitest.                                               |
| `npm run test:e2e`     | Run Playwright E2E tests.                                 |
| `npm run check`        | Run typecheck, lint, format check, and unit tests.        |
| `npm run verify`       | Run checks and build the extension.                       |

Check the CI configuration for the actual CI steps.

## Architecture

- Popup: `entrypoints/popup/`.
- Background worker: `entrypoints/background.ts`.
- WXT configuration: `wxt.config.ts`.
- Package scripts and version: `package.json`.

WXT generates the extension manifest from its configuration. The manifest version comes from `package.json`. Do not edit generated files.

The extension uses these permissions:

- `activeTab`
- Host access to `https://markdown.new/*`

### API Contract

Preserve the current request behavior:

- Method: `GET`
- Endpoint: `https://markdown.new/<url>`
- Header: `Accept: text/markdown`

Preserve URL handling and UI states. Do not change the method or production API behavior to simplify tests.

## Development Rules

- Inspect the relevant source and configuration before you change code.
- Use the existing architecture and npm lockfile.
- Make small changes that match the task.
- Do not add features or refactor unrelated code.
- Do not add background behavior without a product requirement.
- Update documentation when verified changes make it inaccurate.

## Testing

### Unit Tests

- Configuration: `vitest.config.ts`.
- Discovery pattern: `tests/**/*.test.ts`.
- Test runner: Vitest with WXT integration.

Check the test results. If no tests are discovered, report this. Do not claim test coverage without evidence.

### E2E Tests

- Configuration: `playwright.config.ts`.
- Test directory: `e2e/`.
- Fixture: `e2e/fixtures.ts`.

Playwright loads the built extension as an unpacked extension. It uses `--disable-extensions-except` and `--load-extension=.output/chrome-mv3`.

Check whether Playwright builds the extension before testing. If not, build it from the current source first.

The fixture gets the extension ID from `context.serviceWorkers()`. The no-op background worker supports this process.

Before you change or remove the worker, inspect the fixture and test the effect on extension loading, ID discovery, and E2E tests. Update `docs/test-background-worker.md` when this dependency changes.

### Test Mocks

- `page.addInitScript` mocks `chrome.tabs.query` to set the active tab URL.
- Clipboard behavior is mocked where configured.
- `context.route` intercepts requests matching `**/markdown.new/**`.

These mocks test application behavior. They do not test the live service or real clipboard integration.

Report only tests that exist and ran successfully.

### Test Artifacts

- Screenshots: `test-results/screenshots/`.
- HTML report: `playwright-report/`, if enabled by the reporter.

Check the test configuration before you change artifact paths or handling.

Keep test results separate from reviewed visual baselines. Do not approve or overwrite baselines only because screenshots changed.

## Verification

Run checks that match the change.

- Code changes: run the relevant tests and static checks.
- UI changes: run the extension E2E tests and inspect screenshots when possible.
- Full verification: run `npm run verify`.

For UI changes, use DOM inspection and style measurements as supporting evidence. They do not replace visual inspection.

Do not claim a check passed unless it ran successfully.

Report:

- Checks that passed.
- Checks that failed.
- Checks that did not run.
- Environment limits.
- Unresolved issues.

For visual fixes, record the defect, the change, and the result under equivalent conditions. A changed screenshot does not prove an improvement.

Do not add product features to work around an environment limit without justification.

## Development Workflow

- Commit messages follow Conventional Commits.
- Commitlint checks commit messages.
- Release Please manages version bumps and changelogs.
- Do not create release tags manually.
- Build the extension before loading `.output/chrome-mv3` in Chrome.
- ESLint and Prettier enforce code style.
- Both exclude `.wxt/**`, `node_modules/**`, and `.output/**`, according to the current configuration.

## Important Files

| File                             | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| `wxt.config.ts`                  | WXT and manifest configuration.          |
| `package.json`                   | Scripts, dependencies, and version.      |
| `vitest.config.ts`               | Unit-test configuration.                 |
| `playwright.config.ts`           | E2E configuration and browser arguments. |
| `e2e/fixtures.ts`                | Extension context and ID discovery.      |
| `docs/test-background-worker.md` | Background worker test dependency.       |

When documentation conflicts with source configuration, follow the verified source. Update the documentation after you confirm a change.
