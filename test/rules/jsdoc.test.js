/**
 * @file Tests for mandatory JSDoc rules.
 * @description Tests the unusual JSDoc requirements that mandate JSDoc
 * comments on ALL functions (including arrow functions) and require
 * complete sen		const errors = await getErrorsForRule(code, "jsdoc/check-types");

		expect(errors.length).toBeGreaterThan(0);ces in descriptions. This is much stricter than
 * standard JavaScript practices.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("JSDoc Requirements - Unusual Rules", () =>
{
	describe("require-jsdoc - Mandatory on all functions", () =>
	{
		it("should require JSDoc on function declarations", async () =>
		{
			const code = `
function test()
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should require JSDoc on method definitions", async () =>
		{
			const code = `
/**
 * Test class.
 */
class MyClass
{
	doSomething()
	{
		return 42;
	}
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should require JSDoc on arrow functions", async () =>
		{
			const code = `
const test = () =>
{
	return 42;
};`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should require JSDoc on function expressions", async () =>
		{
			const code = `
const test = function()
{
	return 42;
};`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should require JSDoc on class declarations", async () =>
		{
			const code = `
class MyClass
{
	/**
	 * Constructor.
	 */
	constructor()
	{
		this.value = 42;
	}
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should allow functions with proper JSDoc", async () =>
		{
			const code = `
/**
 * Test function that does something.
 *
 * @returns {number} The result value.
 */
function test()
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});
	});

	describe("jsdoc/require-description-complete-sentence - Complete sentences required", () =>
	{
		it("should reject JSDoc without complete sentences", async () =>
		{
			const code = `
/**
 * Test function
 *
 * @returns {number} Result
 */
function test()
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-description-complete-sentence");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should reject JSDoc with missing periods", async () =>
		{
			const code = `
/**
 * Test function that does something
 *
 * @returns {number} The result value
 */
function test()
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-description-complete-sentence");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should allow JSDoc with proper complete sentences", async () =>
		{
			const code = `
/**
 * Test function that does something important.
 *
 * @returns {number} The result value.
 */
function test()
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});

		it("should allow multi-sentence descriptions", async () =>
		{
			const code = `
/**
 * Test function that does something. It performs multiple operations.
 *
 * @param {string} input - The input value. Must be non-empty.
 * @returns {number} The result value. Always positive.
 */
function test(input)
{
	return input.length;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});
	});

	describe("Closure mode type checking", () =>
	{
		it("should reject wildcard types (*)", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {*} value - Any value.
 * @returns {number} The result.
 */
function test(value)
{
	return 42;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/check-types");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should require proper type annotations", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {string} name - The name value.
 * @param {number} age - The age value.
 * @returns {Object} The person object.
 */
function createPerson(name, age)
{
	return { name, age });
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});

		it("should enforce hyphen before param description", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {string} name The name value.
 * @returns {string} The result.
 */
function test(name)
{
	return name;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-hyphen-before-param-description");

			expect(errors.length).toBeGreaterThan(0);
		});

		it("should allow proper hyphenated param descriptions", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @param {string} name - The name value.
 * @returns {string} The result.
 */
function test(name)
{
	return name;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});
	});

	describe("JSDoc completeness", () =>
	{
		it("should require all parameters to be documented", async () =>
		{
			const code = `
/**
 * Test function.
 *
 * @returns {string} The result.
 */
function test(name, age)
{
	return name;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-param");

			expect(errors.length).toBeGreaterThan(0);
		});

	test("should require return type documentation", async () =>
	{
		const code = `
/**
 * Test function.
 *
 * @param {string} name - The name value.
 * @return Description without type.
 */
function test(name)
{
	return name;
}`;

		const errors = await getErrorsForRule(code, "jsdoc/require-returns-type");

		expect(errors.length).toBeGreaterThan(0);
	});		it("should allow complete JSDoc with all required elements", async () =>
		{
			const code = `
/**
 * Creates a formatted greeting message.
 *
 * @param {string} name - The person's name.
 * @param {number} age - The person's age.
 * @returns {string} The formatted greeting message.
 */
function createGreeting(name, age)
{
	return \`Hello \${name}, you are \${age} years old.\`;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});
	});

	describe("Edge cases", () =>
	{
		it("should handle arrow functions with JSDoc", async () =>
		{
			const code = `
/**
 * Doubles a number.
 *
 * @param {number} x - The input number.
 * @returns {number} The doubled value.
 */
const double = (x) => x * 2;`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});

		it("should handle class methods with JSDoc", async () =>
		{
			const code = `
/**
 * User class.
 */
class User
{
	/**
	 * Constructor.
	 *
	 * @param {string} name - The user's name.
	 */
	constructor(name)
	{
		this.name = name;
	}

	/**
	 * Gets the user's name.
	 *
	 * @returns {string} The user's name.
	 */
	getName()
	{
		return this.name;
	}
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});

		it("should handle async functions with JSDoc", async () =>
		{
			const code = `
/**
 * Fetches user data asynchronously.
 *
 * @param {number} userId - The user ID.
 * @returns {Promise<Object>} The user data.
 */
async function fetchUser(userId)
{
	const response = await fetch(\`/api/users/\${userId}\`;

	return response.json(;
}`;

			const errors = await getErrorsForRule(code, "jsdoc/require-jsdoc");

			expect(errors).toHaveLength(0);
		});
	});
});
