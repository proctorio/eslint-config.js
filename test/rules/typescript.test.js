/**
 * Tests for TypeScript configuration.
 */

import { describe, test, expect, beforeAll } from "@jest/globals";
import { ESLint } from "eslint";
import { join } from "path";

describe("TypeScript Configuration", () =>
{
	/** @type {(code: string, filename?: string) => Promise<Array>} */
	let lintCode;

	beforeAll(async() =>
	{
		const typescriptConfig = (await import("../../typescript.js")).default;

		/**
		 * Lint code with TypeScript config.
		 *
		 * @param {string} code - Code to lint.
		 * @param {string} [filename] - Filename for context.
		 * @returns {Promise<Array>} Lint messages.
		 */
		lintCode = async(code, filename = "test.ts") =>
		{
			const eslint = new ESLint({
				overrideConfigFile: true,
				overrideConfig: typescriptConfig
			});
			const filePath = filename.startsWith("/") ? filename : join(process.cwd(), filename);
			const results = await eslint.lintText(code, { filePath });

			return results[0].messages;
		};
	});

	describe("Type Annotations Replace JSDoc", () =>
	{
		test("allows functions without JSDoc type annotations", async() =>
		{
			const code = `
function add(a: number, b: number): number {
	return a + b;
}
`;
			const results = await lintCode(code, "test.ts");
			const jsdocErrors = results.filter(r => r.ruleId?.startsWith("jsdoc/"));
			expect(jsdocErrors).toHaveLength(0);
		});

		test("allows arrow functions without JSDoc", async() =>
		{
			const code = `
const multiply = (a: number, b: number): number => a * b;
`;
			const results = await lintCode(code, "test.ts");
			const jsdocErrors = results.filter(r => r.ruleId?.startsWith("jsdoc/"));
			expect(jsdocErrors).toHaveLength(0);
		});

		test("allows class methods without JSDoc", async() =>
		{
			const code = `
class Calculator {
	add(a: number, b: number): number {
		return a + b;
	}
}
`;
			const results = await lintCode(code, "test.ts");
			const jsdocErrors = results.filter(r => r.ruleId?.startsWith("jsdoc/"));
			expect(jsdocErrors).toHaveLength(0);
		});
	});

	describe("TypeScript-Specific Patterns", () =>
	{
		test("allows async methods without await", async() =>
		{
			const code = `
class Service {
	async getData(): Promise<string> {
		return "data";
	}
}
`;
			const results = await lintCode(code, "test.ts");
			const awaitErrors = results.filter(r => r.ruleId === "require-await");
			expect(awaitErrors).toHaveLength(0);
		});

		test("allows undefined values", async() =>
		{
			const code = `
function getValue(): string | undefined {
	return undefined;
}
`;
			const results = await lintCode(code, "test.ts");
			const undefinedErrors = results.filter(r => r.ruleId === "no-undefined");
			expect(undefinedErrors).toHaveLength(0);
		});

		test("allows lowercase filename", async() =>
		{
			const code = `const x = 1;`;
			const results = await lintCode(code, "my-service.ts");
			const filenameErrors = results.filter(r => r.ruleId === "unicorn/filename-case");
			expect(filenameErrors).toHaveLength(0);
		});

		test("catches unused variables with TypeScript rule", async() =>
		{
			const code = `
const unused = 1;
`;
			const results = await lintCode(code, "test.ts");
			const unusedErrors = results.filter(r => r.ruleId === "@typescript-eslint/no-unused-vars");
			expect(unusedErrors.length).toBeGreaterThan(0);
		});

		test("allows underscore-prefixed unused params", async() =>
		{
			const code = `
export function handler(_event: Event): void {
	console.log("handled");
}
`;
			const results = await lintCode(code, "test.ts");
			const unusedErrors = results.filter(r => r.ruleId === "@typescript-eslint/no-unused-vars");
			expect(unusedErrors).toHaveLength(0);
		});
	});

	describe("Test File Overrides", () =>
	{
		test("allows explicit any in test files", async() =>
		{
			const code = `
const mock: any = { foo: "bar" };
`;
			const results = await lintCode(code, "service.test.ts");
			const anyErrors = results.filter(r => r.ruleId === "@typescript-eslint/no-explicit-any");
			expect(anyErrors).toHaveLength(0);
		});

		test("allows non-null assertion in test files", async() =>
		{
			const code = `
const value: string | null = null;
const definite = value!;
`;
			const results = await lintCode(code, "service.test.ts");
			const assertionErrors = results.filter(r => r.ruleId === "@typescript-eslint/no-non-null-assertion");
			expect(assertionErrors).toHaveLength(0);
		});
	});
});
