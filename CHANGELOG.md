# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- JSON files are no longer linted. 4.0.19 changed the JSON override's glob from
  `*.json` to `**/*.json` on the premise that the block was inert without a
  JSON language. It was not: a config object that matches a file makes ESLint
  lint it, and with no JSON language the default JavaScript parser ran on every
  `src/**/*.json` in every consumer - `Parsing error: Unexpected token :` at
  line 2 of locales, manifests and `serve.json` (proctorio.com 178800,
  proctoriox.com 178801, herald 178785). The override is removed: this config
  declares no JSON language, so it must not match JSON at all, which is what
  4.0.14 did in effect (the bare `*.json` matched only the repository root,
  and consumers lint `src/`). The test now lints a real tree with a JSON file
  in it instead of asserting resolved options.
- `peerDependencies.eslint` is now `^10.4.0` instead of an exact version. It had
  been exact for the whole life of the package (9.37.0, 10.0.0, then 10.10.0 via
  the same grouped bump that brought unicorn 74). Consumers pin their own eslint
  and the shared PR pipeline installs this config into their tree, so an exact
  peer made `npm install` fail with ERESOLVE for every consumer not on precisely
  that version (Independent/mosaic.js, eslint 10.0.0, build 178689, 2026-09-27).
  The floor is 10.4.0, not 10.0.0, because eslint-plugin-unicorn 74 declares
  `eslint >=10.4` and npm resolves the bundled plugins' peers as well as ours.
- `peerDependencies.typescript-eslint` is now `>=8.56.0`. 8.56.0 is the first
  release whose own eslint peer admits ESLint 10; the old `>=8.0.0` accepted
  versions that could never install next to this config.

- The published tarball is now whitelisted (`files`): `index.js`, `typescript.js`,
  `rules/`, `SECURITY.md`, `security.txt` plus the files npm always includes.
  4.0.19 shipped `test-results.xml` (the junit output of its own test run),
  `ci.yml`, `vitest.config.js` and `scripts/` to npm, because the reporter added
  for CI writes into the package root and nothing restricted the pack.

### Changed
- Added `test/package-shape.test.js`: the eslint peer must be a caret range on
  one major, a subset of every bundled plugin's own eslint peer range, and
  satisfied by the eslint the suite runs on; every bundled plugin must be pinned
  exactly and match what is installed. A grouped dependency bump can no longer
  tighten the peer, or bump a plugin past the peer, without a red test.
- `semver` added as a dev dependency for that test.

## [4.0.19] - 2026-09-23

### Added
- `ci.yml`, the pipeline the build definition `eslint-config.js CI` has pointed
  at since it was created without the file ever existing — so it had never
  produced a single build. Nothing ran the test suite on a change to this repo;
  it ran only inside `.github/workflows/publish.yml`, on a release tag, which is
  after the decision to ship. That is how the unicorn 63 → 74 bump reached the
  fleet. Now wired as a blocking build validation policy on `main`.
- `.github/workflows/test.yml`, which gates pull requests on the GitHub mirror.
  That is where dependabot raises its bumps, and `sync.yml` imports GitHub-side
  merges with `skip_ci: false`, so a merge there publishes to npm on its own.
- JUnit and Cobertura output from `vitest.config.js`, so both pipelines report
  per-test detail instead of a bare exit code.

### Fixed
- `unicorn/filename-case` now sets `checkDirectories: false` on all four of its
  configurations. eslint-plugin-unicorn 74 added directory-name checking and
  defaulted it on, so from 4.0.17 every consuming repo failed with
  ``Directory name `src` is not in pascal case. Rename it to `Src` `` — the house
  style is PascalCase *files* in conventionally lowercase *directories*, and the
  shared pipeline templates lint a hardcoded `src/`. This restores the semantics
  the config has always had; it was never a deliberate change.
- `engines.node` corrected from `>=18.0.0` to `^22.22.2 || >=24.15.0`. The
  declared range was three majors below what the pinned plugins actually
  require (eslint-plugin-jsdoc 64.3.9 needs `^22.22.2 || >=24.15.0`), so Node 20
  build agents installed the package and only failed later, at config load.
- The `*.json` override glob is now `**/*.json`. In flat config a bare `*.json`
  matches only the repository root, so nested JSON resolved to no rule at all.
  Note this override remains inert until a consumer supplies a JSON language;
  the package ships none.

### Changed
- Test suite no longer reports false greens. 24 tests were linting code samples
  containing syntax errors: a parse error suppresses every rule message, so
  `expect(errors).toHaveLength(0)` passed regardless of what the config did. One
  further test linted a path inside the global `ignores`. All samples repaired,
  and `lintCode` now throws when a sample fails to parse or when the path is
  ignored, rather than returning an empty message list.
- `unicorn/filename-case` tests lint at realistic nested paths (`src/MyModule.js`)
  instead of the repository root (`MyModule.js`). Linting at the root left no
  directory segment to check, which is why the suite reported 133 passed on the
  exact version that broke every JS build in the org.
- Added `test/rules/filename-case-directories.test.js`, which asserts both the
  behaviour and the resolved rule options, so a future plugin bump that flips a
  default fails here with an obvious cause.
- Two `it.skip` tests re-enabled; they had been skipped because their samples
  never parsed.
- `createLinter` now honours its `overrideConfig` argument, which it previously
  accepted and discarded.

## [4.0.0] - 2026-02-21

### Changed
- Upgraded from ESLint 9 to ESLint 10
- Upgraded `@eslint/js` to 10.0.1
- Migrated test runner from Jest to Vitest 4.0.18 to eliminate transitive vulnerabilities (glob/minimatch)
- Moved `typescript-eslint` to `peerDependencies` to avoid shipping minimatch vulnerabilities
- Inlined `eslint-plugin-promise` as `rules/promise/` to eliminate peer dependency conflicts with ESLint 10
- Inlined `eslint-plugin-no-eslint-disable` as `rules/NoEslintDisable.js` — original package was unmaintained
- Added `@vitest/coverage-v8` for code coverage with 80% threshold on branches, functions, lines, statements

### Removed
- Removed `eslint-plugin-promise` npm dependency (rules inlined)
- Removed `eslint-plugin-no-eslint-disable` npm dependency (rule inlined)
- Removed Jest and all Jest-related dependencies

### Security
- `npm audit --omit=dev` now reports 0 vulnerabilities

## [3.3.0] - 2026-01-13

### Added
- Standard ignores in TypeScript config (dist/, build/, coverage/, node_modules/, *.js)
- Projects can now use `--config ./node_modules/@proctorio/eslint-config/typescript.js` without creating a local config file

### Changed
- Zero-config setup for TypeScript projects - no `eslint.config.js` needed

## [3.2.0] - 2026-01-13

### Changed
- Bundle all plugin dependencies for simpler installation
- Only `eslint` remains as peer dependency - all plugins auto-install
- Simplified installation: `npm install --save-dev @proctorio/eslint-config eslint`

### Removed
- Removed `generate-install.js` script (no longer needed with bundled deps)

## [3.1.0] - 2026-01-10

### Added
- TypeScript support via `@proctorio/eslint-config/typescript` export
- TypeScript parser and recommended rules included

### Changed
- JSDoc type rules disabled for TypeScript (TypeScript handles types)
- Relaxed filename case rules for TypeScript conventions

## [3.0.0] - 2025-11-15

### Added
- ESLint v9 flat config format support
- Full ES Module (ESM) support with `"type": "module"`
- 91+ unit tests with >80% coverage requirements

### Changed
- Migrated from Mocha/Chai/c8 to Jest for testing
- Updated all plugin dependencies to latest stable versions

### Removed
- Removed `eslint-plugin-mocha`

## [2.6.0] - 2025-06-15

### Added
- Added security.txt

### Changed
- Upgraded to ESLint 9.27.0
- Updated all plugins to ESLint 9 compatible versions

### Removed
- Removed `eslint-plugin-chai-expect`

## [2.5.12] - 2025-05-01

### Removed
- Removed Tailwind CSS plugin support

## [2.5.11] - 2024-10-15

### Changed
- Updated to support ES2020 syntax

[4.0.19]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT4.0.0&targetVersion=GT4.0.19
[4.0.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.3.0&targetVersion=GT4.0.0
[3.3.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.2.0&targetVersion=GT3.3.0
[3.2.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.1.0&targetVersion=GT3.2.0
[3.1.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.0.0&targetVersion=GT3.1.0
[3.0.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.6.0&targetVersion=GT3.0.0
[2.6.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.5.12&targetVersion=GT2.6.0
[2.5.12]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.5.11&targetVersion=GT2.5.12
[2.5.11]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/commits?itemVersion=GT2.5.11