/**
 * @file Tests for miscellaneous unusual rules.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("Miscellaneous Unusual Rules", () =>
{
	describe("newline-before-return", () =>
	{
		test("should require newline before return", async () =>
		{
			const code = `function test(x) { const r = x * 2; return r; }`;
			const errors = await getErrorsForRule(code, "newline-before-return");
			expect(errors.length).toBeGreaterThan(0);
		});

		test("should allow newline before return", async () =>
		{
			const code = `function test(x) { const r = x * 2;\n\nreturn r; }`;
			const errors = await getErrorsForRule(code, "newline-before-return");
			expect(errors).toHaveLength(0);
		});
	});

	describe("quotes", () =>
	{
		test("should reject single quotes", async () =>
		{
			const code = `const s = 'hello';`;
			const errors = await getErrorsForRule(code, "quotes");
			expect(errors.length).toBeGreaterThan(0);
		});

		test("should allow double quotes", async () =>
		{
			const code = `const s = "hello";`;
			const errors = await getErrorsForRule(code, "quotes");
			expect(errors).toHaveLength(0);
		});
	});
});
