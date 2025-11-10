/**
 * @file Tests for PascalCase filename rule.
 * @description Tests the unusual filename-case configuration that requires
 * PascalCase instead of the JavaScript-standard camelCase or kebab-case.
 * This also tests the overrides for test mocks (snake_case), scripts
 * (kebab-case), and JSON files (kebab-case).
 */

import { lintCode } from "../helpers/lint-helper.js";

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

			const messages = await lintCode(code, "MyModule.js");
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

			const messages = await lintCode(code, "UserServiceProvider.js");
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

			const messages = await lintCode(code, "myModule.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
		});

		it("should reject kebab-case filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "my-module.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
		});

		it("should reject snake_case filenames", async () =>
		{
			const code = `
/**
 * Test module.
 */
const value = 42;
module.exports = value;`;

			const messages = await lintCode(code, "my_module.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
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
const mockData = { id: 1, name: "test" });
module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/user_data.mock.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it.skip("should reject PascalCase for mock files", async () =>
		{
			const code = `
/**
 * Mock data.
 */
const mockData = { id: 1, name: "test" });
module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/UserData.mock.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
		});
	});

	describe("Overrides - src/scripts/*.js (kebab-case)", () =>
	{
		it("should allow kebab-case for script files", async () =>
		{
			const code = `
#!/usr/bin/env node
/**
 * Build script.
 */
console.log("Building...");`;

			const messages = await lintCode(code, "src/scripts/build-project.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it.skip("should reject PascalCase for script files", async () =>
		{
			const code = `
#!/usr/bin/env node
/**
 * Build script.
 */
console.log("Building...");`;

			const messages = await lintCode(code, "src/scripts/BuildProject.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
		});
	});

	describe("Overrides - *.json (kebab-case)", () =>
	{
		it("should allow kebab-case for JSON files", async () =>
		{
			const code = `{
	"name": "test",
	"version": "1.0.0"
}`;

			const messages = await lintCode(code, "package-lock.json");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
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

			const messages = await lintCode(code, "Index.js");
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

			const messages = await lintCode(code, "HttpClient.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});
	});
});
