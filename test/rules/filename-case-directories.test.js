/**
 * @file Tests that unicorn/filename-case governs FILE names only.
 * @description Regression cover for the 2026-09-17 incident. Bumping
 * eslint-plugin-unicorn 63.0.0 -> 74.0.0 (config 4.0.17) changed no rule in
 * this config, but unicorn 74 added directory-name checking to filename-case
 * and defaulted it ON (`options.checkDirectories !== false`). unicorn 63 had
 * no such option.
 *
 * Our house style is PascalCase *files* inside conventionally lowercase
 * *directories* (src/, test/, scripts/). With directory checking on, every
 * file in every repo errored with
 *
 *   Directory name `src` is not in pascal case. Rename it to `Src`
 *
 * which took down every JS build in the org until the templates were pinned
 * back to 4.0.14.
 *
 * The pre-existing filename-case suite passed the whole time, because every
 * assertion for the default (pascalCase) group linted a file at the repo root
 * - "MyModule.js" - where there is no intervening directory to check. The only
 * tests that used a nested path belonged to the snakeCase and kebabCase
 * override groups, where lowercase directory names happen to be valid for
 * those cases anyway. So the suite had no way to see the change.
 *
 * Everything here therefore lints at a realistic repository path. Tests that
 * assert file-name behaviour must not lint at the repo root.
 */

import { createLinter, lintCode } from "../helpers/lint-helper.js";
import { join } from "path";

const VALID_MODULE = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

const VALID_MOCK = `
/**
 * Mock data.
 */
const mockData = { id: 1, name: "test" };
module.exports = mockData;`;

const VALID_SCRIPT = `#!/usr/bin/env node
/**
 * Build script.
 */
globalThis.console.log("Building...");`;

/**
 * Returns the unicorn/filename-case errors for a path.
 *
 * @param {string} code - The code to lint.
 * @param {string} path - Repository-relative path to lint as.
 * @returns {Promise<Array>} The filename-case messages.
 */
async function filenameErrors(code, path)
{
	const messages = await lintCode(code, path);

	return messages.filter(m => m.ruleId === "unicorn/filename-case");
}

describe("filename-case governs file names, not directory names", () =>
{
	describe("Directories are never case-checked", () =>
	{
		// Each entry is a path whose DIRECTORY segments would fail the case
		// style that applies to the file, while the file name itself is valid.
		const cases = [
			["pascalCase group, lowercase src/", VALID_MODULE, "src/MyModule.js"],
			["pascalCase group, nested lowercase", VALID_MODULE, "src/components/widgets/MyModule.js"],
			["pascalCase group, kebab directory", VALID_MODULE, "src/my-components/MyModule.js"],
			["pascalCase group, snake directory", VALID_MODULE, "src/my_components/MyModule.js"],
			// Not `lib/` - that is in the config's global `ignores`, so nothing
			// would be linted and the case would prove nothing.
			["pascalCase group, app/", VALID_MODULE, "app/MyModule.js"],
			["snakeCase group, mocks under test/", VALID_MOCK, "test/mocks/user_data.mock.js"],
			["snakeCase group, PascalCase ancestor", VALID_MOCK, "MyApp/test/mocks/user_data.mock.js"],
			["kebabCase group, scripts under src/", VALID_SCRIPT, "src/scripts/build-project.js"],
			["kebabCase group, PascalCase ancestor", VALID_SCRIPT, "MyApp/src/scripts/build-project.js"]
		];

		for (const [label, code, path] of cases)
		{
			it(`should not flag the directory: ${label} (${path})`, async () =>
			{
				const errors = await filenameErrors(code, path);

				expect(errors).toHaveLength(0);
			});
		}
	});

	describe("File names are still enforced inside directories", () =>
	{
		// The old suite only ever checked bad file names at the repo root, so
		// it could not tell "directory checking is off" from "the rule is off".
		const cases = [
			["camelCase in src/", VALID_MODULE, "src/myModule.js", "pascal case"],
			["kebab-case in src/", VALID_MODULE, "src/my-module.js", "pascal case"],
			["snake_case in src/", VALID_MODULE, "src/my_module.js", "pascal case"],
			["PascalCase mock", VALID_MOCK, "test/mocks/UserData.mock.js", "snake case"],
			["PascalCase script", VALID_SCRIPT, "src/scripts/BuildProject.js", "kebab case"]
		];

		for (const [label, code, path, expected] of cases)
		{
			it(`should still flag the file name: ${label} (${path})`, async () =>
			{
				const errors = await filenameErrors(code, path);

				expect(errors.length).toBeGreaterThan(0);
				expect(errors[0].message).toContain(expected);
				// The message must be about the file, not a directory - a
				// directory complaint here would mean checkDirectories is back.
				expect(errors[0].message).not.toContain("Directory name");
			});
		}
	});

	describe("Fleet layout contract", () =>
	{
		// The shared pipeline templates in Plumbing/core-templates lint a
		// hardcoded lowercase `src/`. If this block fails, those templates -
		// and therefore every JS PR build in the org - are broken.
		const fleetFiles = [
			"src/Index.js",
			"src/CalculateMetrics.js",
			"src/UserAgentParse.js",
			"src/CloseCodeMessages.js",
			"src/FrameSuspicionAnalyzer.js"
		];

		for (const path of fleetFiles)
		{
			it(`should accept the standard template layout: ${path}`, async () =>
			{
				const errors = await filenameErrors(VALID_MODULE, path);

				expect(errors).toHaveLength(0);
			});
		}
	});

	describe("checkDirectories stays explicitly disabled", () =>
	{
		// Asserting the resolved options - not just behaviour - so that a
		// future plugin bump that flips another default, or a well-meaning
		// edit that drops the flag, fails here with an obvious cause.
		const groups = [
			["base pascalCase", "src/MyModule.js", "pascalCase"],
			["test mocks", "test/mocks/user_data.mock.js", "snakeCase"],
			["src scripts", "src/scripts/build-project.js", "kebabCase"]
		];

		for (const [label, path, expectedCase] of groups)
		{
			it(`should pin checkDirectories:false for the ${label} group`, async () =>
			{
				const linter = createLinter();
				const resolved = await linter.calculateConfigForFile(join(process.cwd(), path));
				const entry = resolved.rules["unicorn/filename-case"];

				expect(entry).toBeDefined();

				const [severity, options] = entry;

				expect(severity).toBe(2);
				expect(options.case).toBe(expectedCase);
				expect(options.checkDirectories).toBe(false);
			});
		}
	});
});
