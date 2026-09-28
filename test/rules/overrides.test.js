/**
 * @file Tests for config overrides.
 * @description Tests that file-specific overrides work correctly for
 * test mocks, scripts, JSON files, and test files.
 */

import { createLinter, lintCode, getErrorsForRule } from "../helpers/lint-helper.js";
import { join, relative } from "path";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { ESLint } from "eslint";
import config from "../../index.js";

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
};

module.exports = mockData;`;

			const messages = await lintCode(code, "test/mocks/user_data.mock.js");
			const jsdocErrors = messages.filter(m => m.ruleId === "require-jsdoc");

			expect(jsdocErrors).toHaveLength(0);
		});

		it("should allow snake_case filenames for mocks", async () =>
		{
			const code = `
const mockData = { value: 42 };
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
	doSomething();
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
			const code = `#!/usr/bin/env node
const fs = require("fs");

function build()
{
	fs.writeFileSync("output.txt", "Built!");
}

build();`;

			const messages = await lintCode(code, "src/scripts/build-project.js");
			const jsdocErrors = messages.filter(m => m.ruleId === "require-jsdoc");

			expect(jsdocErrors).toHaveLength(0);
		});

		it("should allow kebab-case filenames for scripts", async () =>
		{
			const code = `#!/usr/bin/env node
console.log("Running...");`;

			const messages = await lintCode(code, "src/scripts/run-tests.js");
			const filenameErrors = messages.filter(m => m.ruleId === "unicorn/filename-case");

			expect(filenameErrors).toHaveLength(0);
		});

		it("should allow no-negated-condition in scripts", async () =>
		{
			const code = `#!/usr/bin/env node
if (!process.env.NODE_ENV)
{
	console.error("NODE_ENV not set");
	process.exit(1);
}`;

			const messages = await lintCode(code, "src/scripts/check-env.js");
			const negatedErrors = messages.filter(m => m.ruleId === "no-negated-condition");

			expect(negatedErrors).toHaveLength(0);
		});
	});

	describe("*.json - JSON files are not linted", () =>
	{
		// 4.0.19 gave the JSON override the glob `**/*.json` on the premise that
		// the block was inert without a JSON language. It was not: a config
		// object that matches a file makes ESLint lint it, and with no JSON
		// language the default JavaScript parser ran on every src/**/*.json in
		// every consumer - `Parsing error: Unexpected token :` at line 2
		// (proctorio.com 178800, proctoriox.com 178801, herald 178785: locales,
		// manifests, serve.json). This config declares no JSON language, so it
		// must not match JSON files at all. Lint a real tree, not a sample.
		it("does not lint JSON under src/ when a directory is passed", async () =>
		{
			const dir = mkdtempSync(join(tmpdir(), "eslint-config-json-"));
			try
			{
				mkdirSync(join(dir, "src", "data"), { recursive: true });
				writeFileSync(join(dir, "src", "data", "Thing.json"), "{\n\t\"name\": \"thing\"\n}\n");
				writeFileSync(join(dir, "src", "Thing.js"), "export const Thing = 1;\n");
				const linter = new ESLint({ cwd: dir, overrideConfigFile: true, overrideConfig: config });
				const results = await linter.lintFiles(["src/"]);

				expect(results.map(r => relative(dir, r.filePath))).toEqual([join("src", "Thing.js")]);
				expect(results[0].messages).toHaveLength(0);
			}
			finally
			{
				rmSync(dir, { recursive: true, force: true });
			}
		});

		it("resolves no configuration for a JSON path", async () =>
		{
			const linter = createLinter();

			await expect(linter.calculateConfigForFile(join(process.cwd(), "src", "data", "Thing.json"))).resolves.toBeUndefined();
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
const should = require("chai").should();
const expect = require("chai").expect;

describe("MyModule", function()
{
	it("should do something", function()
	{
		const value = 42;
		value.should.equal(42);
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
