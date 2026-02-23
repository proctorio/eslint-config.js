# @proctorio/eslint-config

[![npm version](https://img.shields.io/npm/v/@proctorio/eslint-config.svg)](https://www.npmjs.com/package/@proctorio/eslint-config)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)

Proctorio's opinionated ESLint configuration for JavaScript and TypeScript projects. Built for **ESLint v10 flat config** with strict code quality standards.

**This is a strict config.** It enforces Allman brace style, tab indentation, mandatory JSDoc, PascalCase filenames, and many other non-standard rules. Adopting it on an existing codebase will produce significant lint errors. Review the rules below before adopting.

## Installation

**JavaScript projects:**

```bash
npm install --save-dev @proctorio/eslint-config eslint
```

**TypeScript projects:**

```bash
npm install --save-dev @proctorio/eslint-config eslint typescript-eslint
```

Plugin dependencies (JSDoc, Unicorn, Belgradian, etc.) are bundled. `eslint` is a required peer dependency (exact version `10.0.0`). `typescript-eslint` is an optional peer dependency, only needed for TypeScript projects.

Promise rules and the no-eslint-disable rule are inlined from their original packages to eliminate dependency conflicts.

## Setup

### JavaScript

Create an `eslint.config.js` file in your project root:

```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default proctorioConfig;
```

### TypeScript

```javascript
import proctorioConfig from "@proctorio/eslint-config/typescript";

export default proctorioConfig;
```

The TypeScript config extends the base JavaScript config and adds:
- TypeScript parser and `typescript-eslint` recommended rules
- Disables 8 JSDoc rules that conflict with TypeScript (type annotations, descriptions, tag names, jsdoc requirement)
- Disables `unicorn/filename-case` (TypeScript projects often use lowercase)
- Disables `belgradian/member-prefix-rule` (TypeScript does not use Hungarian naming)
- Disables `complexity`, `max-depth`, `no-await-in-loop`, `require-await`, `require-unicode-regexp`, `radix`
- Disables `no-undefined`, `no-continue`, `class-methods-use-this`, `no-process-env`, `global-require`, `no-new`
- Replaces `no-unused-vars` with `@typescript-eslint/no-unused-vars` (ignores `_` prefixed args)
- Disables `no-undef` (TypeScript handles this)
- Ignores `*.js`, `*.mjs`, `*.cjs`, `dist/`, `build/`, `coverage/`, `node_modules/` by default
- Relaxes `@typescript-eslint/no-explicit-any` and `no-non-null-assertion` in test files

### Extending with Custom Rules

```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default [
  ...proctorioConfig,
  {
    rules: {
      // Your overrides here
    }
  }
];
```

## Rules

This configuration enforces several rules that differ from common JavaScript conventions. These choices reflect Proctorio's coding standards.

### Allman Brace Style

`"brace-style": ["error", "allman", { "allowSingleLine": true }]`

Opening braces on a new line, contrary to the popular 1TBS used by most JavaScript projects.

```javascript
// Correct (Allman)
function example()
{
	return 42;
}

// Incorrect (1TBS)
function example() {
	return 42;
}
```

### Tab Indentation

`"indent": ["error", "tab", {...}]`

Tabs required instead of spaces. Most JavaScript projects use 2 or 4 spaces. Tabs allow developers to configure display width to their own preference.

### PascalCase Filenames

`"unicorn/filename-case": ["error", { "case": "pascalCase" }]`

Files must use PascalCase naming. Overrides exist for test mocks (snake_case), scripts (kebab-case), and JSON files (kebab-case).

```
Correct:   UserService.js, HttpClient.js, DataModel.js
Incorrect: userService.js, http-client.js, data_model.js
```

### Mandatory JSDoc

`"jsdoc/require-jsdoc": ["error", { require: { FunctionDeclaration, MethodDefinition, ClassDeclaration, ArrowFunctionExpression, FunctionExpression } }]`

JSDoc is required on all function types and class declarations. Descriptions must be complete sentences. A hyphen is required before each `@param` description.

```javascript
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

### Closure-Mode JSDoc

JSDoc is set to `"closure"` mode with strict type enforcement:
- Use `Object` not `object` for types
- Wildcard `*` types are banned
- `any` types are banned
- Description style is set to `"tag"` (requires `@description` tag rather than the first line being treated as a description)

### No ESLint Disable Comments

`"no-eslint-disable/no-eslint-disable": "error"`

All `eslint-disable` comments are banned. Fix the code instead of disabling the rule.

### Promise Handling

`"promise/catch-or-return": ["error", { terminationMethod: ["catch", "finally"] }]`

Promises must be terminated with `.catch()` or `.finally()`. Additionally: `promise/always-return` requires a return in `.then()`, `promise/no-return-wrap` prevents unnecessary `Promise.resolve()`/`Promise.reject()` wrapping, and `promise/param-names` enforces consistent `resolve`/`reject` naming.

### Double Quotes

`"quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }]`

Double quotes required. Single quotes allowed only to avoid escaping. Template literals are not allowed as simple strings.

### Newline Before Return

`"newline-before-return": "error"`

A blank line is required before every `return` statement. ESLint deprecated this rule but has not removed it. Proctorio continues to enforce it.

### Expiring TODO Comments

`"unicorn/expiring-todo-comments": ["error", { "terms": ["todo", "fixme", "xxx"] }]`

TODO, FIXME, and XXX comments must include an expiration date or issue reference.

```javascript
// Correct
// TODO [2026-12-31]: Refactor this function
// TODO [#123]: Fix performance issue

// Incorrect
// TODO: fix this later
```

### Member Prefix Rule (Belgradian)

`"belgradian/member-prefix-rule": "error"`

Enforces Hungarian-style `m_` prefix on member and global variables (pattern: `^m_[a-z]+[A-Z]*\S*`). ALL_CAPS constants are exempt. Disabled in the TypeScript config.

### Other Notable Rules

These rules are less common and may surprise developers adopting this config:

| Rule | Effect |
|---|---|
| `require-unicode-regexp` | All regexps must use the `u` flag |
| `no-sync` | Bans synchronous methods (`fs.readFileSync`, etc.) |
| `no-continue` | Bans `continue` statements |
| `no-eq-null` | Bans `== null` comparisons |
| `no-process-env` | Bans `process.env` access |
| `no-process-exit` | Bans `process.exit()` |
| `linebreak-style` | Requires Unix line endings (LF) |
| `require-await` | Async functions must contain `await` |
| `no-await-in-loop` | Bans `await` inside loops |

### Parser Settings

- **`ecmaVersion: 2020`** — ES2020 syntax supported. ES2021+ features like `??=` or `||=` will not parse.
- **`sourceType: "module"`** — All files are treated as ES modules. CommonJS `require()` calls may produce warnings.

## File Overrides

### Test Mock Files (`**/test/mocks/*.mock.js`)
- Filename case: snake_case
- JSDoc not required
- `no-negated-condition` and `no-nested-ternary` disabled

### Script Files (`**/src/scripts/*.js`)
- Filename case: kebab-case
- JSDoc not required
- `no-negated-condition` and `no-nested-ternary` disabled

### JSON Files (`*.json`)
- Filename case: kebab-case

### Test Files (`test/*.Test.js`, `test/**/*.test.js`)
- JSDoc not required
- `should` and `expect` ignored for unused variable checks
- `complexity` and `unicorn/prefer-add-event-listener` disabled
- `promise/no-callback-in-promise` disabled

## Ignored Directories

- `**/tools/**`
- `**/build/**`
- `**/lib/**`
- `**/rollup.config.*.js`
- `**/src/_data/eleventyComputed.js`
- `**/external/**`

## Globals

This config provides globals for:

- **Browser** — `window`, `document`, etc.
- **Node.js** — `process`, `__dirname`, `require`, etc.
- **Web Extensions** — `chrome`, `browser` (also set as explicit `readonly`)
- **Jest** — `describe`, `it`, `test`, `expect`, `beforeEach`, etc. (via `globals.jest`)
- **`globalThis`** — set as `readonly`

## Migration from `.eslintrc` (ESLint v8/v9)

ESLint v9 introduced flat config as the default, and v10 continues it. If you're migrating from the old `.eslintrc` JSON format:

**Before:**
```json
{
  "extends": "@proctorio/eslint-config"
}
```

**After:**
```javascript
import proctorioConfig from "@proctorio/eslint-config";

export default proctorioConfig;
```

Config file changes from `.eslintrc.json` to `eslint.config.js`, format changes from JSON to ES modules, and the config is now an array of configuration objects.

## Development

This package uses [Vitest](https://vitest.dev/) for testing:

```bash
npm test              # Run all tests
npm run test:coverage # Run tests with coverage (80% threshold)
npm run test:watch    # Run tests in watch mode
```

## Requirements

- **Node.js:** >= 18.0.0
- **ESLint:** 10.0.0 (exact — pinned peer dependency)
- **Package Type:** ESM

## License

[Unlicense](https://unlicense.org/)

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint Flat Config Guide](https://eslint.org/docs/latest/use/configure/configuration-files)
- [JSDoc Reference](https://jsdoc.app/)
- [Changelog](CHANGELOG.md)