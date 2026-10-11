# Git Hooks

Hooks are managed by [Husky](https://typicode.github.io/husky/) and live in `.husky/`. They are installed automatically by the `prepare` script in `package.json` when dependencies are installed, which sets `core.hooksPath` to `.husky/_`.

## Hooks

| Hook            | What it runs                                                                                                                                                                                | Failure behavior                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pre-commit`    | `npx --no-install lint-staged` (config: `.lintstagedrc.json`): `oxfmt --write` then `oxlint` on staged JavaScript/TypeScript files, `oxfmt --write` on staged JSON/Markdown/YAML/HTML files | Oxlint errors block the commit. Formatter changes are written back and included in the staged files. Oxlint warnings do not block, matching `npm run lint` in CI. |
| `pre-push`      | In order: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`                                                                                                           | The first failing check exits non-zero and blocks the push.                                                                                                       |
| `post-checkout` | On branch checkout only (`$3` = 1): compares the checkout range for `package.json`, lockfiles, and `wxt.config.ts`                                                                          | Prints a reminder to run `npm install` and/or `npx wxt prepare`. File checkouts (`$3` = 0) do nothing.                                                            |
| `post-merge`    | Compares `ORIG_HEAD..HEAD` for `package.json` and lockfiles                                                                                                                                 | Prints a reminder to run `npm install`.                                                                                                                           |
| `commit-msg`    | `npx --no-install commitlint --edit` (pre-existing hook, unchanged)                                                                                                                         | Non-conventional commit messages are rejected.                                                                                                                    |

## Scope decisions

- `pre-commit` only inspects staged files through `lint-staged`, so commits stay fast. Full type checks, tests, and builds are not run at commit time.
- `pre-push` mirrors the CI quality gates: lint, format check, type check, unit tests. The production build and E2E tests are not run here; CI runs the build, and E2E tests require a local Chrome build setup.
- Post-operation hooks (`post-checkout`, `post-merge`) only print reminders. They never install dependencies, regenerate files, or modify the working tree.
- `post-merge` watches dependency manifests and lockfiles only, as specified. `post-checkout` additionally watches `wxt.config.ts` because the generated `.wxt/` directory (used by `npm run typecheck`) is derived from it.

## Notes

- Skipped paths: both tools apply their ignore patterns (`.oxfmtrc.json`, `oxlint.json`) even when files are passed explicitly, so staged files under ignored paths are not reformatted or linted.
- Lockfiles (for example `package-lock.json`) are excluded by `oxfmt` itself; `--no-error-on-unmatched-pattern` keeps `lint-staged` from failing when every staged file is skipped this way.
- To bypass hooks occasionally, use `git commit --no-verify` or `git push --no-verify`. `HUSKY=0` disables all hooks for a command.
