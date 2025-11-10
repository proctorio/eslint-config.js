/**
 * @file Tests for Allman brace style rule.
 * @description Tests the unusual brace-style configuration that uses Allman
 * style (braces on new lines) instead of the JavaScript-standard 1TBS style.
 * This tests one of our key deviations from common JavaScript practices.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("Brace Style (Allman) - Unusual Rule", () =>
{
	describe("Valid Allman style", () =>
	{
		test("should allow Allman style with braces on new lines", async () =>
		{
			const code = `
function test()
{
	if (true)
	{
		return 1;
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});

		test("should allow Allman style for classes", async () =>
		{
			const code = `
/**
 * Test class.
 */
class MyClass
{
	/**
	 * Constructor.
	 */
	constructor()
	{
		this.value = 42;
	}

	/**
	 * Gets value.
	 *
	 * @return {number} The value.
	 */
	getValue()
	{
		return this.value;
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});

		test("should allow single-line blocks (allowSingleLine: true)", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {boolean} flag - The flag.
 * @return {number} The result.
 */
function test(flag)
{
	if (flag) { return 1; }

	return 0;
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});

		test("should allow Allman style for try-catch", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @return {void}
 */
function test()
{
	try
	{
		doSomething();
	}
	catch (error)
	{
		handleError(error);
	}
	finally
	{
		cleanup();
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});
	});

	describe("Invalid 1TBS or K&R style", () =>
	{
		test("should reject 1TBS style (opening brace on same line)", async () =>
		{
			const code = `
function test() {
	if (true) {
		return 1;
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors.length).toBeGreaterThan(0);
		});

		test("should reject K&R style for control structures", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {boolean} condition - The condition.
 * @return {number} The result.
 */
function test(condition)
{
	if (condition) {
		return 1;
	}

	return 0;
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors.length).toBeGreaterThan(0);
		});

		test("should reject mixed brace styles", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @return {void}
 */
function test()
{
	if (true) {
		doSomething();
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors.length).toBeGreaterThan(0);
		});
	});

	describe("Edge cases", () =>
	{
		test("should handle nested blocks with Allman style", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @return {void}
 */
function test()
{
	if (true)
	{
		while (condition)
		{
			for (let i = 0; i < 10; i++)
			{
				doSomething(i);
			}
		}
	}
}`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});

		test("should handle arrow functions with block bodies", async () =>
		{
			const code = `
/**
 * Creates a handler.
 *
 * @return {Function} The handler function.
 */
const createHandler = () =>
{
	return (x) =>
	{
		return x * 2;
	};
};`;

			const errors = await getErrorsForRule(code, "brace-style");

			expect(errors).toHaveLength(0);
		});
	});
});
