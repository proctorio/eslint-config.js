# @proctorio/eslint-config

[![npm version](https://img.shields.io/npm/v/@proctorio/eslint-config.svg)](https://www.npmjs.com/package/@proctorio/eslint-config)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Proctorio's opinionated ESLint configuration for JavaScript projects. Built for **ESLint v9+ flat config** with strict code quality standards.

## Features

- ✅ **ESLint v9+ Flat Config** - Modern configuration format
- 📝 **Mandatory JSDoc** - Complete documentation on all functions
- 🎨 **Allman Brace Style** - Opening braces on new lines
- ↹ **Tab Indentation** - Accessibility-friendly formatting
- 📦 **PascalCase Filenames** - Consistent module naming
- 🚫 **No Disable Comments** - Enforced code quality standards
- 🔍 **Strict Promise Handling** - Proper error handling required
- 📅 **Expiring TODO Comments** - Prevents technical debt accumulation

## Installation

```bash
npm install --save-dev @proctorio/eslint-config eslint
```

All plugins and parser dependencies are bundled - just install eslint alongside the config.

### JavaScript Projects

Create an `eslint.config.js` file in your project root:

```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default proctorioConfig;
```

### TypeScript Projects

For TypeScript projects, use the TypeScript-specific export:

```javascript
import proctorioConfig from "@proctorio/eslint-config/typescript";

export default proctorioConfig;
```

The TypeScript config automatically:
- Enables TypeScript parser and recommended rules
- Disables JSDoc type rules (TypeScript handles types)
- Relaxes filename case for TypeScript conventions
- Configures proper unused variable handling

### Extending with Custom Rules

```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default [
  ...proctorioConfig,
  {
    // Your custom rules here
    rules: {
      // Override or add rules
    }
  }
];
```

## Non-Standard Rules

This configuration enforces several rules that differ from common JavaScript conventions. These choices reflect Proctorio's coding standards and priorities.

### 1. Allman Brace Style (Non-standard)

**Rule:** `"brace-style": ["error", "allman", { "allowSingleLine": true }]`

Opening braces must be on a new line (Allman style), contrary to the popular "1TBS" (One True Brace Style) used by Airbnb and most JavaScript projects.

**Why:** Proctorio house style preference for visual clarity and consistency with other languages.

```javascript
// ✅ Correct (Allman)
function example()
{
	return 42;
}

// ❌ Incorrect (1TBS)
function example() {
	return 42;
}
```

### 2. Tab Indentation (Non-standard)

**Rule:** `"indent": ["error", "tab", {...}]`

Tabs required for indentation instead of spaces. Over 90% of JavaScript projects use spaces (typically 2 or 4).

**Why:** Accessibility - developers can configure tab width to their preference. Also aligns with Proctorio coding standards.

### 3. PascalCase Filenames (Non-standard)

**Rule:** `"unicorn/filename-case": ["error", { "case": "pascalCase" }]`

Files must use PascalCase naming. Most JavaScript projects use camelCase or kebab-case.

**Why:** Proctorio naming convention for modules, treating files as importable units similar to classes.

```
✅ Correct: UserService.js, HttpClient.js, DataModel.js
❌ Incorrect: userService.js, http-client.js, data_model.js
```

**Exceptions via overrides:**
- `test/mocks/*.mock.js` - snake_case allowed
- `src/scripts/*.js` - kebab-case allowed
- `*.json` - kebab-case allowed

### 4. Mandatory JSDoc on All Functions (Stricter than standard)

**Rule:** `"jsdoc/require-jsdoc": ["error", {...}]`

JSDoc required on ALL function types: declarations, expressions, arrow functions, methods, and class declarations.

**Why:** Code documentation standards for maintainability in large teams. Airbnb and most configs make JSDoc optional.

```javascript
// ✅ Correct
/**
 * Calculates the sum of two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	return a + b;
}
```

### 5. JSDoc Complete Sentences Required (Stricter than standard)

**Rule:** `"jsdoc/require-description-complete-sentence": "error"`

All JSDoc descriptions must be complete sentences with proper capitalization and punctuation.

**Why:** Professional documentation standards. Most configs exclude this as "too demanding."

### 6. No ESLint Disable Comments Allowed (Unique)

**Rule:** `"no-eslint-disable/no-eslint-disable": "error"`

Prevents developers from using `eslint-disable` comments to bypass linting rules.

**Why:** Enforces consistent code quality across all codebases. Prevents "quick fixes" that accumulate technical debt.

### 7. Closure JSDoc Mode with Strict Types (Non-standard)

**Rule:** JSDoc mode set to `"closure"` with banned `*` and `any` types

Uses Google Closure Compiler JSDoc syntax instead of the more common TypeScript mode. Prohibits wildcard (`*`) and `any` types.

**Why:** Stricter type checking requirements for better code safety.

### 8. Promise Termination Methods (Non-standard)

**Rule:** `"promise/catch-or-return": ["error", { terminationMethod: ['catch', 'finally'] }]`

Promises must be terminated with either `.catch()` or `.finally()`. Standard configs usually only require `.catch()`.

**Why:** More flexible promise handling patterns while still ensuring proper error handling.

```javascript
// ✅ Correct
fetchData()
	.then(process)
	.catch(handleError);

// ✅ Also correct
fetchData()
	.then(process)
	.finally(cleanup);
```

### 9. Newline Before Return (Deprecated by many)

**Rule:** `"newline-before-return": "error"`

Requires a blank line before return statements. This rule is deprecated in favor of `padding-line-between-statements` but still works.

**Why:** Visual separation for readability.

### 10. Expiring TODO Comments (Stricter than standard)

**Rule:** `"unicorn/expiring-todo-comments": ["error", { "terms": ["todo", "fixme", "xxx"] }]`

TODO/FIXME comments must include expiration dates or issue references.

**Why:** Prevents technical debt accumulation by requiring accountability for temporary code.

```javascript
// ✅ Correct
// TODO [2025-12-31]: Refactor this function
// TODO [#123]: Fix performance issue

// ❌ Incorrect
// TODO: fix this later
```

### 11. Custom Member Prefix Rule (Proprietary)

**Rule:** `"belgradian/member-prefix-rule": "error"`

Enforces Proctorio-specific naming conventions via proprietary `eslint-plugin-belgradian`.

**Why:** Internal Proctorio coding standards for member naming patterns.

### 12. Double Quotes Required (With escape exception)

**Rule:** `"quotes": ["error", "double", { "avoidEscape": true }]`

Double quotes required for strings, but single quotes allowed when avoiding escapes.

**Why:** Consistency with other languages and readability.

## File Structure Overrides

The config includes special rules for specific file types:

### Test Mock Files (`test/mocks/*.mock.js`)
- **Filename case:** snake_case allowed
- **JSDoc:** Not required
- Allows more flexible code patterns for test data

### Script Files (`src/scripts/*.js`)
- **Filename case:** kebab-case allowed
- **JSDoc:** Not required
- Suitable for build scripts and utilities

### JSON Files (`*.json`)
- **Filename case:** kebab-case allowed

### Test Files (`test/**/*.test.js`)
- **JSDoc:** Not required
- **Unused vars:** `should` and `expect` ignored
- More relaxed rules for test assertions

## Ignored Directories

The following directories are ignored by default:

- `**/tools/**`
- `**/build/**`
- `**/lib/**`
- `**/rollup.config.*.js`
- `**/src/_data/eleventyComputed.js`
- `**/external/**`

## Supported Environments

This config sets up globals for:

- **Browser** - Window, document, etc.
- **Node.js** - process, __dirname, require, etc.
- **Web Extensions** - Chrome and browser APIs
- **Testing** - Jest globals (describe, it, test, expect, etc.)

## Testing Your Code

To lint your project:

```bash
npx eslint .
```

To lint with automatic fixes:

```bash
npx eslint . --fix
```

## Package.json Script Example

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
```

## Migration from Old Config

If you're migrating from the old `.eslintrc` format:

### Before (ESLint v8)

```json
{
  "extends": "@proctorio/eslint-config"
}
```

### After (ESLint v9+)

```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default proctorioConfig;
```

**Key changes:**
- File changed from `.eslintrc.json` to `eslint.config.js`
- Format changed from JSON to ES modules
- Config is now an array of configuration objects

## Development

### Running Tests

This package includes comprehensive unit tests:

```bash
npm test              # Run all tests
npm run test:coverage # Run tests with coverage
npm run test:watch    # Run tests in watch mode
```

### Test Coverage

Minimum coverage thresholds:
- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

## Requirements

- **Node.js:** >= 18.0.0
- **ESLint:** 9.37.0
- **Package Type:** ESM (ES Modules)

## License

[Unlicense](http://unlicense.org/) - This is free and unencumbered software released into the public domain.

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint Flat Config Guide](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [JSDoc Specification](https://jsdoc.app/)
- [Google Closure Compiler](https://developers.google.com/closure/compiler/)
- [Changelog](CHANGELOG.md)

---

**Made with Proctorio**
