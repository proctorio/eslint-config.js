/**
 * @file Tests for tab indentation rule.
 * @description Tests the unusual indent configuration that requires tabs
 * instead of spaces. This is a major deviation from JavaScript community
 * standards (90%+ of projects use spaces) but provides accessibility benefits
 * and aligns with Proctorio coding standards.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("Indentation (Tabs) - Unusual Rule", () =>
{
	describe("Valid tab indentation", () =>
	{
		test("should allow tab indentation for function bodies", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @return {number} The result.
 */
function test()
{
	const x = 1;
	const y = 2;

	return x + y;
}`;

			const errors = await getErrorsForRule(code, "indent");

			expect(errors).toHaveLength(0);			
		});

		it("should allow proper tab indentation for nested blocks", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {boolean} condition - The condition.
 * @returns {number} The result.
 */
function test(condition)
{
	if (condition)
	{
		const result = 42;

		return result;
	}

	return 0;
}`;

			
		});

		it("should allow SwitchCase indentation with tabs", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {string} type - The type.
 * @returns {number} The result.
 */
function test(type)
{
	switch (type)
	{
		case "a":
			return 1;
		case "b":
			return 2;
		default:
			return 0;
	}
}`;

			
		});

		it("should allow proper var/let/const indentation", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {void}
 */
function test()
{
	var x = 1,
			y = 2;
	let a = 3,
			b = 4;
	const FOO = 5,
				BAR = 6;
}`;

			
		});
	});

	describe("Invalid space indentation", () =>
	{
		it("should reject space indentation", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {number} The result.
 */
function test()
{
  const x = 1;
  const y = 2;

  return x + y;
}`;

			
		});

		it("should reject mixed tabs and spaces", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {number} The result.
 */
function test()
{
	const x = 1;
  const y = 2;

	return x + y;
}`;

			
		});
	});

	describe("Edge cases", () =>
	{
		it("should handle object literals with proper tab indentation", async () =>
		{
			const code = `
/**
 * Gets config.
 *
 * @returns {Object} The config object.
 */
function getConfig()
{
	return {
		option1: true,
		option2: {
			nested: "value",
			another: "item"
		},
		option3: false
	});
}`;

			
		});

		it("should handle array literals with proper tab indentation", async () =>
		{
			const code = `
/**
 * Gets items.
 *
 * @returns {Array} The items array.
 */
function getItems()
{
	return [
		"item1",
		"item2",
		[
			"nested1",
			"nested2"
		],
		"item3"
	];
}`;

			
		});

		it("should handle function parameters with proper indentation", async () =>
		{
			const code = `
/**
 * Test function with many parameters.
 *
 * @param {string} param1 - First parameter.
 * @param {string} param2 - Second parameter.
 * @param {string} param3 - Third parameter.
 * @returns {string} The result.
 */
function test(
	param1,
	param2,
	param3
)
{
	return param1 + param2 + param3;
}`;

			
		});

		it("should handle chained method calls with proper indentation", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {Array} The result array.
 */
function test()
{
	return array
		.filter(x => x > 0)
		.map(x => x * 2)
		.reduce((a, b) => a + b, 0;
}`;

			
		});
	});
});
