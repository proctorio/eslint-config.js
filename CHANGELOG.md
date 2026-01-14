# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- ESLint v9.37.0 flat config format support
- Full ES Module (ESM) support with `"type": "module"`
- 91+ unit tests with >80% coverage requirements

### Changed
- Migrated from Mocha/Chai/c8 to Jest 30.2.0 for testing
- Updated all plugin dependencies to latest stable versions

### Removed
- Removed `eslint-plugin-chai-expect`
- Removed `eslint-plugin-mocha`

## [2.6.0] - 2025-06-15

### Changed
- Upgraded to ESLint 9.27.0
- Updated all plugins to ESLint 9 compatible versions

### Added
- Added security.txt

### Removed
- Removed `eslint-plugin-chai-expect`

## [2.5.12] - 2025-05-01

### Removed
- Removed Tailwind CSS plugin support

## [2.5.11] - 2024-10-15

### Changed
- Updated to support ES2020 syntax

[3.2.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.1.0&targetVersion=GT3.2.0
[3.1.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT3.0.0&targetVersion=GT3.1.0
[3.0.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.6.0&targetVersion=GT3.0.0
[2.6.0]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.5.12&targetVersion=GT2.6.0
[2.5.12]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/branchCompare?baseVersion=GT2.5.11&targetVersion=GT2.5.12
[2.5.11]: https://dev.azure.com/echovoice/Open/_git/eslint-config.js/commits?itemVersion=GT2.5.11
