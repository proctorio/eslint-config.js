/**
 * @file Tests for config overrides.
 * @description Tests that file-specific overrides work correctly for
 * test mocks, scripts, JSON files, and test files.
 */

import { lintCode, getErrorsForRule } from "../helpers/lint-helper.js";

describe("Config Overrides", () =>
{
	describe("test/mocks/*.mock.js - Relaxed rules", () =>
	{
		it("should not require JSDoc for mock files", async () =>
		{
			const code = `
const mockData = {
	id: 1,
	name: "Test User",
	email: "test@example.com"
});

module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/user_data.mock.js");
			const jsdocErrors = messages.filter(m => m.ruleId === "require-jsdoc");

			expect(jsdocErrors).toHaveLength(0);
		});

		it("should allow snake_case filenames for mocks", async () =>
		{
			const code = `
const mockData = { value: 42 });
module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/test_mock_data.mock.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should allow no-negated-condition in mocks", async () =>
		{
			const code = `
const value = 42;
if (!condition)
{
	doSomething(;
}
module.exports = value;`;

			const messages = await lintCode(code, "test/mocks/conditional.mock.js");
			const negatedErrors = messages.filter(m => m.ruleId === "no-negated-condition");

			expect(negatedErrors).toHaveLength(0);
		});

		it("should allow nested ternaries in mocks", async () =>
		{
			const code = `
const status = error ? "error" : loading ? "loading" : "success";
module.exports = { status };`;

			const messages = await lintCode(code, "test/mocks/status.mock.js");
			const ternaryErrors = messages.filter(m => m.ruleId === "no-nested-ternary");

			expect(ternaryErrors).toHaveLength(0);
		});
	});

	describe("src/scripts/*.js - Script-specific rules", () =>
	{
		it("should not require JSDoc for script files", async () =>
		{
			const code = `
#!/usr/bin/env node
const fs = require("fs";

function build()
{
	fs.writeFileSync("output.txt", "Built!";
}

build();`;

			const messages = await lintCode(code, "src/scripts/build-project.js");
			const jsdocErrors = messages.filter(m => m.ruleId === "require-jsdoc");

			expect(jsdocErrors).toHaveLength(0);
		});

		it("should allow kebab-case filenames for scripts", async () =>
		{
			const code = `
#!/usr/bin/env node
console.log("Running...");`;

			const messages = await lintCode(code, "src/scripts/run-tests.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should allow no-negated-condition in scripts", async () =>
		{
			const code = `
#!/usr/bin/env node
if (!process.env.NODE_ENV)
{
	console.error("NODE_ENV not set";
	process.exit(1;
}`;

			const messages = await lintCode(code, "src/scripts/check-env.js");
			const negatedErrors = messages.filter(m => m.ruleId === "no-negated-condition");

			expect(negatedErrors).toHaveLength(0);
		});
	});

	describe("*.json - JSON file rules", () =>
	{
		it("should allow kebab-case for JSON files", async () =>
		{
			const code = `{
	"name": "test-package",
	"version": "1.0.0"
}`;

			const messages = await lintCode(code, "test-config.json");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});
	});

	describe("test/*.Test.js - Test file rules", () =>
	{
		it("should not require JSDoc for test files", async () =>
		{
			const code = `
describe("MyModule", function()
{
	it("should do something", function()
	{
		expect(true).to.be.true;
	});
});`;

			const messages = await lintCode(code, "test/MyModule.Test.js");
			const jsdocErrors = messages.filter(m => m.ruleId === "require-jsdoc");

			expect(jsdocErrors).toHaveLength(0);
		});

		it("should allow unused 'should' and 'expect' variables", async () =>
		{
			const code = `
const should = require("chai").should(;
const expect = require("chai").expect;

describe("MyModule", function()
{
	it("should do something", function()
	{
		const value = 42;
		value.should.equal(42;
	});
});`;

			const messages = await lintCode(code, "test/MyModule.Test.js");
			const unusedErrors = messages.filter(m => 
				m.ruleId === "no-unused-vars" && 
				(m.message.includes("should") || m.message.includes("expect"))
			);

		expect(unusedErrors).toHaveLength(0);
	});		it("should not require complexity limits in tests", async () =>
		{
			const code = `
describe("Complex test", function()
{
	it("should handle many conditions", function()
	{
		let result = 0;
		if (a) result++;
		if (b) result++;
		if (c) result++;
		if (d) result++;
		if (e) result++;
		if (f) result++;
		if (g) result++;
		if (h) result++;
		if (i) result++;
		if (j) result++;
		expect(result).toBeGreaterThan(0);
	});
});`;

			const messages = await lintCode(code, "test/Complex.Test.js");
			const complexityErrors = messages.filter(m => m.ruleId === "complexity");

			expect(complexityErrors).toHaveLength(0);
		});
	});

	describe("Default rules outside overrides", () =>
	{
		it("should enforce JSDoc for regular files", async () =>
		{
			const code = `
function test()
{
	return 42;
}`;

		const messages = await lintCode(code, "src/MyModule.js");
		const jsdocErrors = messages.filter(m => m.ruleId === "jsdoc/require-jsdoc");			expect(jsdocErrors.length).toBeGreaterThan(0);
		});

		it("should enforce PascalCase for regular files", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {number} The result.
 */
function test()
{
	return 42;
}`;

			const messages = await lintCode(code, "src/myModule.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors.length).toBeGreaterThan(0);
		});
	});
});
