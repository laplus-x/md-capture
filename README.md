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

Releases are managed by Release Please with Conventional Commits.

1. Write commits using Conventional Commits, e.g.:
   - `feat:` → MINOR bump
   - `fix:` → PATCH bump
   - `feat!:` or `fix!:` with breaking change → MAJOR bump
2. Merge changes to `main`. Release Please analyzes commits since last release.
3. Release Please opens or updates a Release PR that:
   - Bumps `package.json` version
   - Updates `CHANGELOG.md`
   - Manifest version is derived from `package.json` via `wxt.config.ts`
4. Review the Release PR, ensure CI passes, then merge.
5. On merge, Release Please creates Git tag `v<version>` and GitHub Release with notes.
6. Post-release workflow triggered on `release`:
   - Checks out tag
   - Runs quality gates
   - Builds with WXT
   - Validates manifest version matches package version
   - Packages `.output/chrome-mv3` into `md-capture-v<version>.zip`
   - Uploads ZIP to the existing GitHub Release

Manual version bumps are not required. Do not create tags manually.
