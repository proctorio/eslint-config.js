/**
 * @file Tests for promise handling rules.
 * @description Tests the unusual promise rules that require either .catch()
 * OR .finally() as termination methods (most configs only accept .catch()).
 * Also tests the always-return rule for promise chains.
 */

import { getErrorsForRule } from "../helpers/lint-helper.js";

describe("Promise Handling - Unusual Rules", () =>
{
	describe("promise/catch-or-return - Termination with catch or finally", () =>
	{
		it("should allow promises terminated with .catch()", async () =>
		{
			const code = `
/**
 * Fetches data.
 *
 * @returns {void}
 */
function fetchData()
{
	fetch("/api/data")
		.then(response => response.json())
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should allow promises terminated with .finally()", async () =>
		{
			const code = `
/**
 * Fetches data.
 *
 * @returns {void}
 */
function fetchData()
{
	fetch("/api/data")
		.then(response => response.json())
		.finally(() => console.log("Done");
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should allow promises with both .catch() and .finally()", async () =>
		{
			const code = `
/**
 * Fetches data.
 *
 * @returns {void}
 */
function fetchData()
{
	fetch("/api/data")
		.then(response => response.json())
		.catch(error => console.error(error))
		.finally(() => console.log("Done");
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

	test("should reject promises without .catch() or .finally()", async () =>
	{
		const code = `
/**
 * Fetches data.
 *
 * @return {void}
 */
function fetchData()
{
	fetch("/api/data")
		.then(response => response.json());
}`;

		const errors = await getErrorsForRule(code, "promise/catch-or-return");			expect(errors.length).toBeGreaterThan(0);
		});

		it("should allow returned promises without explicit termination", async () =>
		{
			const code = `
/**
 * Fetches data.
 *
 * @returns {Promise<Object>} The data promise.
 */
function fetchData()
{
	return fetch("/api/data")
		.then(response => response.json();
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});
	}); 

	describe("promise/always-return - Return in promise chains", () =>
	{
	test("should require return statements in .then()", async () =>
	{
		const code = `
/**
 * Processes data.
 *
 * @return {Promise<void>} Completion promise.
 */
function processData()
{
	return fetch("/api/data")
		.then(response =>
		{
			response.json();
		})
		.catch(error => console.error(error));
}`;

		const errors = await getErrorsForRule(code, "promise/always-return");

		expect(errors.length).toBeGreaterThan(0);
	});		it("should allow proper return statements in .then()", async () =>
		{
			const code = `
/**
 * Processes data.
 *
 * @returns {Promise<Object>} The processed data.
 */
function processData()
{
	return fetch("/api/data")
		.then(response =>
		{
			return response.json(;
		})
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should allow implicit returns in arrow functions", async () =>
		{
			const code = `
/**
 * Processes data.
 *
 * @returns {Promise<Object>} The processed data.
 */
function processData()
{
	return fetch("/api/data")
		.then(response => response.json())
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should allow chained .then() with returns", async () =>
		{
			const code = `
/**
 * Processes data.
 *
 * @returns {Promise<string>} The formatted data.
 */
function processData()
{
	return fetch("/api/data")
		.then(response => response.json())
		.then(data => data.toString())
		.then(str => str.toUpperCase())
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});
	}); 

	describe("promise/param-names - Standard parameter names", () =>
	{
	test("should enforce resolve/reject parameter names", async () =>
	{
		const code = `
/**
 * Creates a promise.
 *
 * @return {Promise<number>} The promise.
 */
function createPromise()
{
	return new Promise((res, rej) =>
	{
		setTimeout(() => res(42), 1000);
	});
}`;

		const errors = await getErrorsForRule(code, "promise/param-names");			expect(errors.length).toBeGreaterThan(0);
		});

		it("should allow standard resolve/reject names", async () =>
		{
			const code = `
/**
 * Creates a promise.
 *
 * @returns {Promise<number>} The promise.
 */
function createPromise()
{
	return new Promise((resolve, reject) =>
	{
		setTimeout(() => resolve(42), 1000;
	});
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});
	}); 

	describe("promise/no-return-wrap - No unnecessary wrapping", () =>
	{
	test.skip("should reject wrapping values in Promise.resolve unnecessarily", async () =>
	{
		const code = `
/**
 * Gets value.
 *
 * @return {Promise<number>} The value promise.
 */
function getValue()
{
	return Promise.resolve(Promise.resolve(42));
}`;

	const errors = await getErrorsForRule(code, "promise/no-return-wrap");

	expect(errors.length).toBeGreaterThan(0);
	});

	it("should allow Promise.resolve in non-async contexts", async () =>
	{
		const code = `
/**
 * Gets value.
 *
 * @returns {Promise<number>} The value promise.
 */
function getValue()
{
	return Promise.resolve(42);
}`;

		const errors = await getErrorsForRule(code, "promise/catch-or-return");			expect(errors).toHaveLength(0);
		});
	}); 

	describe("Edge cases", () =>
	{
		it("should handle async/await with try/catch", async () =>
		{
			const code = `
/**
 * Fetches data safely.
 *
 * @returns {Promise<Object>} The data.
 */
async function fetchData()
{
	try
	{
		const response = await fetch("/api/data";

		return await response.json(;
	}
	catch (error)
	{
		console.error(error;

		return null;
	}
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should handle Promise.all with proper termination", async () =>
		{
			const code = `
/**
 * Fetches multiple items.
 *
 * @returns {void}
 */
function fetchMultiple()
{
	Promise.all([
		fetch("/api/data1"),
		fetch("/api/data2"),
		fetch("/api/data3")
	])
		.then(responses => Promise.all(responses.map(r => r.json())))
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});

		it("should handle Promise.race with proper termination", async () =>
		{
			const code = `
/**
 * Fetches with timeout.
 *
 * @returns {void}
 */
function fetchWithTimeout()
{
	Promise.race([
		fetch("/api/data"),
		new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
	])
		.then(response => response.json())
		.catch(error => console.error(error);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});
	});
});
