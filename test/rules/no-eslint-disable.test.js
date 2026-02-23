/**
 * @file Tests for no-eslint-disable rule.
 * @description Tests the inlined no-eslint-disable rule that bans
 * eslint-disable comments in all forms.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("no-eslint-disable/no-eslint-disable", () =>
{
	it("should report eslint-disable-next-line comments", async () =>
	{
		const code = `
/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	// eslint-disable-next-line no-unused-vars
	const result = a + b;

	return result;
}`;

		const errors = await getErrorsForRule(code, "no-eslint-disable/no-eslint-disable");

		expect(errors).toHaveLength(1);
	});

	it("should report eslint-disable block comments", async () =>
	{
		const code = `
/* eslint-disable no-unused-vars */
/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	return a + b;
}`;

		const errors = await getErrorsForRule(code, "no-eslint-disable/no-eslint-disable");

		expect(errors).toHaveLength(1);
	});

	it("should report eslint-disable-line comments", async () =>
	{
		const code = `
/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	const result = a + b; // eslint-disable-line no-unused-vars

	return result;
}`;

		const errors = await getErrorsForRule(code, "no-eslint-disable/no-eslint-disable");

		expect(errors).toHaveLength(1);
	});

	it("should not report code without eslint-disable comments", async () =>
	{
		const code = `
/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	return a + b;
}`;

		const errors = await getErrorsForRule(code, "no-eslint-disable/no-eslint-disable");

		expect(errors).toHaveLength(0);
	});

	it("should not report regular comments", async () =>
	{
		const code = `
/**
 * Adds two numbers.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum.
 */
function add(a, b)
{
	// This is a regular comment
	/* Another regular comment */

	return a + b;
}`;

		const errors = await getErrorsForRule(code, "no-eslint-disable/no-eslint-disable");

		expect(errors).toHaveLength(0);
	});
});
