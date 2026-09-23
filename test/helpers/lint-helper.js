/**
 * @file ESLint testing utilities.
 * @description Provides helper functions for testing ESLint configurations
 * and rules. This module simplifies the process of verifying that code
 * samples pass or fail linting according to our config.
 */

import { ESLint } from "eslint";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import config from "../../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates an ESLint instance with the config from index.js.
 *
 * @param {Object} [overrideConfig] - Extra flat-config blocks appended after
 * the project config, for tests that need to vary one setting.
 * @returns {ESLint} ESLint instance configured with the project config.
 */
function createLinter(overrideConfig)
{
	const extra = overrideConfig && Object.keys(overrideConfig).length > 0 ? [overrideConfig] : [];
	const linter = new ESLint({
		overrideConfigFile: true,
		overrideConfig: [...config, ...extra]
	});

	return linter;
}

/**
 * Asserts that a lint result actually exercised the rules.
 *
 * Two results look identical to `expect(errors).toHaveLength(0)` but mean
 * nothing: a sample that does not parse (a fatal message suppresses every
 * rule) and a path excluded by the config's `ignores` (no rule runs at all).
 * 24 tests in this suite were passing the first way, and one was passing the
 * second way, before 2026-09-22 - including while the config was shipping the
 * change that broke every build in the org. Fail loudly instead: a test that
 * never ran the rule is a broken test, never a green one.
 *
 * @param {Object} result - The ESLint result object for a single file.
 * @param {string} filename - The path the sample was linted as.
 * @param {string} code - The sample, for the failure message.
 * @returns {void}
 */
function assertRulesRan(result, filename, code)
{
	const fatal = result.messages.filter(message => message.fatal);

	if (fatal.length > 0)
	{
		throw new Error(
			`Sample for "${filename}" does not parse: ${fatal[0].message} (line ${fatal[0].line}).\n` +
			"Rules never run on unparseable code, so this test would pass for the wrong reason.\n" +
			`Code:\n${code}`
		);
	}

	const ignored = result.messages.some(message => /File ignored/.test(message.message));

	if (ignored)
	{
		throw new Error(
			`Sample for "${filename}" was not linted: ${result.messages[0].message}\n` +
			"The path matches an `ignores` entry in the config, so no rule ran and " +
			"any assertion of \"no errors\" here is meaningless. Pick a path the " +
			"config actually lints."
		);
	}
}

/**
 * Lints a code string and returns the results.
 *
 * @param {string} code - The code to lint.
 * @param {string} [filename="test.js"] - The filename to use for linting context.
 * @param {Object} [overrideConfig] - Optional config overrides.
 * @returns {Promise<Array>} Array of linting messages.
 */
async function lintCode(code, filename = "test.js", overrideConfig = {})
{
	const eslint = createLinter(overrideConfig);
	// Convert to absolute path if it's a relative path - needed for flat config overrides
	const filePath = filename.startsWith("/") ? filename : join(process.cwd(), filename);
	const results = await eslint.lintText(code, { filePath: filePath, warnIgnored: true });

	assertRulesRan(results[0], filename, code);

	return results[0].messages;
}

/**
 * Asserts that code has no linting errors.
 *
 * @param {string} code - The code to lint.
 * @param {string} [filename="test.js"] - The filename to use for linting context.
 * @param {Object} [overrideConfig] - Optional config overrides.
 * @returns {Promise<void>} Resolves if code is valid, rejects if there are errors.
 */
async function assertValid(code, filename = "test.js", overrideConfig = {})
{
	const messages = await lintCode(code, filename, overrideConfig);
	const errors = messages.filter(msg => msg.severity === 2);

	if (errors.length > 0)
	{
		const errorDetails = errors.map(e => `  ${e.ruleId}: ${e.message} (line ${e.line})`).join("\n");

		throw new Error(`Expected code to be valid, but got ${errors.length} error(s):\n${errorDetails}\n\nCode:\n${code}`);
	}
}

/**
 * Asserts that code has linting errors for specific rules.
 *
 * @param {string} code - The code to lint.
 * @param {Array<string>} ruleIds - The rule IDs that should trigger errors.
 * @param {string} [filename="test.js"] - The filename to use for linting context.
 * @param {Object} [overrideConfig] - Optional config overrides.
 * @returns {Promise<void>} Resolves if expected errors are found, rejects otherwise.
 */
async function assertInvalid(code, ruleIds, filename = "test.js", overrideConfig = {})
{
	const messages = await lintCode(code, filename, overrideConfig);
	const errors = messages.filter(msg => msg.severity === 2);

	if (errors.length === 0)
	{
		throw new Error(`Expected code to have errors for rules [${ruleIds.join(", ")}], but got no errors.\n\nCode:\n${code}`);
	}

	const foundRuleIds = errors.map(e => e.ruleId);
	const missingRules = ruleIds.filter(id => !foundRuleIds.includes(id));

	if (missingRules.length > 0)
	{
		const errorDetails = errors.map(e => `  ${e.ruleId}: ${e.message} (line ${e.line})`).join("\n");

		throw new Error(`Expected errors for rules [${missingRules.join(", ")}], but only got:\n${errorDetails}\n\nCode:\n${code}`);
	}
}

/**
 * Gets all error messages for a specific rule.
 *
 * @param {string} code - The code to lint.
 * @param {string} ruleId - The rule ID to filter messages for.
 * @param {string} [filename="test.js"] - The filename to use for linting context.
 * @returns {Promise<Array>} Array of error messages for the specified rule.
 */
async function getErrorsForRule(code, ruleId, filename = "test.js")
{
	const messages = await lintCode(code, filename);

	return messages.filter(msg => msg.ruleId === ruleId && msg.severity === 2);
}

/**
 * Gets all messages (errors and warnings) for a specific rule.
 *
 * @param {string} code - The code to lint.
 * @param {string} ruleId - The rule ID to filter messages for.
 * @param {string} [filename="test.js"] - The filename to use for linting context.
 * @returns {Promise<Array>} Array of all messages for the specified rule.
 */
async function getMessagesForRule(code, ruleId, filename = "test.js")
{
	const messages = await lintCode(code, filename);

	return messages.filter(msg => msg.ruleId === ruleId);
}

export {
	assertRulesRan,
	createLinter,
	lintCode,
	assertValid,
	assertInvalid,
	getErrorsForRule,
	getMessagesForRule
};
