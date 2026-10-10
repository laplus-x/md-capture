# Release Version Policy

## Authority

`package.json` `version` is the single source of truth for the application version.

## Semantic Versioning

This project follows Semantic Versioning 2.0.0.

- **PATCH** `x.y.Z+1` – backward-compatible bug fixes, documentation, internal refactors with no user impact.
- **MINOR** `x.Y+1.0` – backward-compatible functionality, new features.
- **MAJOR** `X+1.0.0` – incompatible changes to the extension API, manifest, or user interface.

Version decisions are manual. Do not use automated version bumping.

## Consistency Rules

Before a release tag is accepted:

1. `package.json` version == `wxt.config.ts` manifest `version`
2. Git tag == `v<package.json version>`
3. Generated `manifest.json` version == `package.json` version
4. Changelog contains a non-empty section for that version

Validation is enforced by the Release GitHub Actions workflow:

- Tag must match `v*`
- Tag version must equal `package.json` version
- Manifest version must match
- Changelog entry must exist and contain at least one bullet
- Quality gates must pass

## Rejection Conditions

Release is rejected if:

- Version mismatch between package.json, manifest, or tag
- Changelog section missing or empty
- Version format invalid for Chrome manifest `major.minor.patch`
- Version already published as a Git tag / GitHub Release

## Manual Steps

Version is selected manually during release preparation. Update `package.json` and `wxt.config.ts` together, update `CHANGELOG.md`, run `npm run verify`, commit, and push tag `vX.Y.Z`.

No silent rewrites of version values are permitted.
