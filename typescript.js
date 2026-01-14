/**
 * TypeScript-specific ESLint configuration.
 * Extends the base @proctorio/eslint-config with TypeScript support.
 * @type {import("eslint").Linter.Config[]}
 */

import proctorioConfig from "./index.js";
import tseslint from "typescript-eslint";

/**
 * TypeScript configuration that extends the base Proctorio config.
 * Disables JSDoc rules that conflict with TypeScript's type system.
 */
export default [
	...proctorioConfig,

	// TypeScript parser and recommended rules
	...tseslint.configs.recommended,

	// TypeScript-specific overrides
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: {
					allowDefaultProject: ["*.ts", "*.tsx"]
				}
			}
		},
		rules: {
			// JSDoc rules that conflict with TypeScript's type annotations
			"jsdoc/require-param-type": "off",
			"jsdoc/require-returns-type": "off",
			"jsdoc/check-tag-names": "off",
			"jsdoc/require-param-description": "off",
			"jsdoc/require-description": "off",
			"jsdoc/require-description-complete-sentence": "off",
			"jsdoc/require-jsdoc": "off",
			"jsdoc/no-undefined-types": "off",

			// Rules that TypeScript handles better
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-undef": "off",

			// Complexity rules - TypeScript often requires more verbose code
			"complexity": "off",
			"max-depth": "off",

			// Async patterns common in TypeScript
			"no-await-in-loop": "off",
			"require-await": "off",

			// TypeScript-specific patterns
			"no-undefined": "off",
			"no-continue": "off",
			"class-methods-use-this": "off",

			// Filename case - TypeScript projects often use lowercase
			"unicorn/filename-case": "off",

			// Common patterns in TypeScript that shouldn't require changes
			"no-process-env": "off",
			"global-require": "off",
			"require-unicode-regexp": "off",
			"radix": "off",
			"no-new": "off",

			// Member naming - TypeScript doesn't use Hungarian notation
			"belgradian/member-prefix-rule": "off"
		}
	},

	// Override for TypeScript test files
	{
		files: ["**/*.test.ts", "**/*.spec.ts", "**/test/**/*.ts", "**/tests/**/*.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"no-new": "off"
		}
	}
];
