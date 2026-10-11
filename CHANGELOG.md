# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to Semantic Versioning.

## 1.0.0 (2026-10-11)


### Features

* establish development toolchain and release version policy ([5a84b67](https://github.com/laplus-x/md-capture/commit/5a84b6778d552f1626b963ba2187d4e19792df90))
* integrate official release-please for versioning and releases ([1d446d2](https://github.com/laplus-x/md-capture/commit/1d446d2b67096ebb5fc775920c58a8e1f572d5df))
* migrate to Oxlint and Oxfmt ([476509e](https://github.com/laplus-x/md-capture/commit/476509e94151a2131bf2f1ebe74c5cf8bbd45384))
* **popup:** structural UI redesign for info density ([94aa9ee](https://github.com/laplus-x/md-capture/commit/94aa9eed8cde422ce61bef427085b2e10106ad28))
* **test:** add conversion E2E coverage with deterministic mocks and visual evidence ([06b736a](https://github.com/laplus-x/md-capture/commit/06b736a80bf9b049bbe595c787cd5ed95d30f0e0))
* **test:** add WXT unit and Playwright E2E testing environment ([45561b9](https://github.com/laplus-x/md-capture/commit/45561b9689a872df8b25ae1b8bd0c6f53bb149f8))


### Bug Fixes

* **package.json:** update scripts to oxlint/oxfmt and remove eslint deps ([f231538](https://github.com/laplus-x/md-capture/commit/f2315388eabfd13925dd9629bec4c51309fed1f1))
* pin WXT dev server port to avoid CSP violation ([16d4ff2](https://github.com/laplus-x/md-capture/commit/16d4ff2c2929634445799b2f0bbfd5292a04a25b))
* resolve format, typecheck, and test blockers ([a716857](https://github.com/laplus-x/md-capture/commit/a716857ed9e0b5950fccfeb894e9ba516e8e2e6e))

## [Unreleased]

### Added

- Initial release planning

## [1.0.0] - 2026-10-10

### Added

- Chrome MV3 extension built with WXT
- Popup UI to convert current tab to Markdown via markdown.new
- ESM + TypeScript source structure
- Local quality gates: lint, format check, typecheck, tests, build
- GitHub Actions CI workflow

### Changed

- Standardized on ES Modules and TypeScript

### Fixed

- N/A
