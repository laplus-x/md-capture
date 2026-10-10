# md-capture

Chrome Manifest V3 extension built with WXT that converts the current webpage to Markdown via https://markdown.new/

## Development conventions

- ESM: `"type": "module"` in package.json. All project sources use ES modules with `.ts` extensions.
- TypeScript: Source in `entrypoints/` and `src/` is TypeScript with strict checks via WXT tsconfig.
- Quality gates: lint, format check, type check, tests, build.

## Scripts

```bash
npm run dev          # WXT dev server
npm run build        # production build -> .output/chrome-mv3
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run format:check # prettier --check
npm run format:write # prettier --write
npm test             # vitest
npm run check        # typecheck + lint + format:check + test
```

## Load in Chrome

```bash
npm run build
```

Load unpacked `.output/chrome-mv3` in `chrome://extensions`.

## User flow

Click icon → popup auto-converts active tab → Markdown displayed selectable → Copy button copies explicitly.

Tests cover request construction, URL validation, success, 429, invalid URL without live service.

## Release procedure

Releases are manual tag-based and validated by GitHub Actions.

1. Update `CHANGELOG.md` – add a new version heading under `## [Unreleased]` or create it. Do not leave the `Unreleased` section empty.
2. Update `package.json` version and `wxt.config.ts` manifest version to the same value.
3. Run local quality gates:
   ```bash
   npm run check
   npm run build
   ```
4. Commit changes:
   ```bash
   git add CHANGELOG.md package.json wxt.config.ts
   git commit -m "chore: release vX.Y.Z"
   ```
5. Create and push tag:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
6. GitHub Actions `Release` workflow runs automatically:
   - Validates tag vs package.json vs manifest version
   - Validates Changelog entry exists and is non-empty
   - Runs lint, format check, typecheck, tests, build
   - Packages `.output/chrome-mv3` into `md-capture-vX.Y.Z.zip`
   - Creates GitHub Release with notes extracted from `CHANGELOG.md`

Do not publish a release if any validation fails. Tagging is manual and reviewable.
