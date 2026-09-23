/**
 * @file Tests for PascalCase filename rule.
 * @description Tests the unusual filename-case configuration that requires
 * PascalCase instead of the JavaScript-standard camelCase or kebab-case.
 * This also tests the overrides for test mocks (snake_case), scripts
 * (kebab-case), and JSON files (kebab-case).
 *
 * Every assertion lints at a realistic repository path - `src/MyModule.js`,
 * not `MyModule.js`. Linting at the repo root leaves no directory segment for
 * the rule to look at, which is how the 2026-09-17 breakage got past this
 * suite: unicorn 74 began case-checking directory names by default and this
 * file did not notice. See filename-case-directories.test.js.
 */

import { createLinter, lintCode } from "../helpers/lint-helper.js";
import { join } from "path";

describe("Filename Case (PascalCase) - Unusual Rule", () =>
{
	describe("Valid PascalCase filenames", () =>
	{
		it("should allow PascalCase filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "src/MyModule.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should allow PascalCase with multiple words", async () =>
		{
			const code = `
/**
 * User service module.
 */
class UserService
{
	/**
	 * Constructor.
	 */
	constructor()
	{
		this.users = [];
	}
}
module.exports = UserService;`;

			const messages = await lintCode(code, "src/services/UserServiceProvider.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});
	});

	describe("Invalid non-PascalCase filenames", () =>
	{
		it("should reject camelCase filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "src/myModule.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
			expect(filenameErrors[0].message).not.toContain("Directory name");
		});

		it("should reject kebab-case filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "src/my-module.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
			expect(filenameErrors[0].message).not.toContain("Directory name");
		});

		it("should reject snake_case filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "src/my_module.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
			expect(filenameErrors[0].message).not.toContain("Directory name");
		});
	});

	describe("Overrides - test/mocks/*.mock.js (snake_case)", () =>
	{
		it("should allow snake_case for mock files", async () =>
		{
			const code = `
/**
 * Mock data.
 */
const mockData = { id: 1, name: "test" };
module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/user_data.mock.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should reject PascalCase for mock files", async () =>
		{
			const code = `
/**
 * Mock data.
 */
const mockData = { id: 1, name: "test" };
module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/UserData.mock.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
			expect(filenameErrors[0].message).toContain("snake case");
		});
	});

	describe("Overrides - src/scripts/*.js (kebab-case)", () =>
	{
		// The shebang has to sit at offset 0 or it is a syntax error, which
		// suppresses every rule and makes these tests pass for no reason.
		it("should allow kebab-case for script files", async () =>
		{
			const code = `#!/usr/bin/env node
/**
 * Build script.
 */
globalThis.console.log("Building...");`;

			const messages = await lintCode(code, "src/scripts/build-project.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should reject PascalCase for script files", async () =>
		{
			const code = `#!/usr/bin/env node
/**
 * Build script.
 */
globalThis.console.log("Building...");`;

			const messages = await lintCode(code, "src/scripts/BuildProject.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
			expect(filenameErrors[0].message).toContain("kebab case");
		});
	});

	describe("Overrides - *.json (kebab-case)", () =>
	{
		// Asserted through the resolved config, not by linting: this config
		// ships no JSON language, so a JSON sample only ever yields a parse
		// error. See the note on the override in index.js.
		it("should resolve kebab-case for JSON files", async () =>
		{
			const linter = createLinter();
			const resolved = await linter.calculateConfigForFile(join(process.cwd(), "package-lock.json"));
			const [severity, options] = resolved.rules["unicorn/filename-case"];

			expect(severity).toBe(2);
			expect(options.case).toBe("kebabCase");
		});
	});

	describe("Edge cases", () =>
	{
		it("should allow single-word PascalCase", async () =>
		{
			const code = `
/**
 * Index module.
 */
module.exports = {};`;

			const messages = await lintCode(code, "src/Index.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should allow acronyms in PascalCase", async () =>
		{
			const code = `
/**
 * HTTP client module.
 */
class HttpClient
{
	/**
	 * Constructor.
	 */
	constructor()
	{
		this.timeout = 5000;
	}
}
module.exports = HttpClient;`;

			const messages = await lintCode(code, "src/net/HttpClient.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});
	});
});
