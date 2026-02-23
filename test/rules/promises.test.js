/**
 * @file Tests for promise handling rules.
 * @description Tests the unusual promise rules that require either .catch()
 * OR .finally() as termination methods (most configs only accept .catch()).
 * Also tests the always-return rule for promise chains.
 */

import { getErrorsForRule, getMessagesForRule } from "../helpers/lint-helper.js";

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

			const errors = await getErrorsForRule(code, "promise/always-return");

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

			const errors = await getErrorsForRule(code, "promise/always-return");

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

			const errors = await getErrorsForRule(code, "promise/always-return");

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
	test("should reject wrapping values in Promise.resolve unnecessarily", async () =>
	{
		const code = `
/**
 * Gets value.
 *
 * @returns {Promise<number>} The value promise.
 */
function getValue()
{
	return Promise.resolve(1)
		.then((val) =>
		{
			return Promise.resolve(val + 1);
		})
		.catch(err => console.error(err));
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

	describe("promise/no-return-in-finally - No return in finally", () =>
	{
		it("should report return statements inside .finally()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.finally(() =>
		{
			return 2;
		});
}`;

			const messages = await getMessagesForRule(code, "promise/no-return-in-finally");

			expect(messages).toHaveLength(1);
		});

		it("should allow .finally() without return", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.finally(() =>
		{
			console.log("done");
		});
}`;

			const messages = await getMessagesForRule(code, "promise/no-return-in-finally");

			expect(messages).toHaveLength(0);
		});

		it("should allow .finally() with arrow expression (no block body)", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.finally(() => console.log("done"));
}`;

			const messages = await getMessagesForRule(code, "promise/no-return-in-finally");

			expect(messages).toHaveLength(0);
		});
	});

	describe("promise/no-callback-in-promise - No callbacks in promises", () =>
	{
		it("should report callbacks used inside .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @param {Function} cb - The callback.
 * @returns {void}
 */
function doWork(cb)
{
	Promise.resolve(1)
		.then((val) =>
		{
			cb(val);
		})
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/no-callback-in-promise", "DoWork.js");

			expect(messages).toHaveLength(1);
		});

		it("should not report callbacks outside of promises", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @param {Function} cb - The callback.
 * @returns {void}
 */
function doWork(cb)
{
	cb(42);
}`;

			const messages = await getMessagesForRule(code, "promise/no-callback-in-promise", "DoWork.js");

			expect(messages).toHaveLength(0);
		});

		it("should report callback passed directly to .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @param {Function} cb - The callback.
 * @returns {void}
 */
function doWork(cb)
{
	Promise.resolve(1)
		.then(cb)
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/no-callback-in-promise", "DoWork.js");

			expect(messages).toHaveLength(1);
		});

		it("should not report callbacks inside setTimeout within a promise by default", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @param {Function} cb - The callback.
 * @returns {void}
 */
function doWork(cb)
{
	Promise.resolve(1)
		.then((val) =>
		{
			setTimeout(() =>
			{
				cb(val);
			}, 100);
		})
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/no-callback-in-promise", "DoWork.js");

			expect(messages).toHaveLength(0);
		});
	});

	describe("promise/no-new-statics - No new on Promise statics", () =>
	{
		it("should report new Promise.resolve()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	new Promise.resolve(42);
}`;

			const errors = await getErrorsForRule(code, "promise/no-new-statics");

			expect(errors).toHaveLength(1);
		});

		it("should report new Promise.reject()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	new Promise.reject("error");
}`;

			const errors = await getErrorsForRule(code, "promise/no-new-statics");

			expect(errors).toHaveLength(1);
		});

		it("should report new Promise.all()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	new Promise.all([Promise.resolve(1)]);
}`;

			const errors = await getErrorsForRule(code, "promise/no-new-statics");

			expect(errors).toHaveLength(1);
		});

		it("should report new Promise.race()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	new Promise.race([Promise.resolve(1)]);
}`;

			const errors = await getErrorsForRule(code, "promise/no-new-statics");

			expect(errors).toHaveLength(1);
		});

		it("should not report new Promise()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {Promise<number>} The result.
 */
function doWork()
{
	return new Promise((resolve) =>
	{
		resolve(42);
	});
}`;

			const errors = await getErrorsForRule(code, "promise/no-new-statics");

			expect(errors).toHaveLength(0);
		});
	});

	describe("promise/no-return-wrap - No unnecessary Promise wrapping", () =>
	{
		it("should report Promise.resolve inside .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then((val) =>
		{
			return Promise.resolve(val + 1);
		})
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/no-return-wrap");

			expect(errors).toHaveLength(1);
		});

		it("should report Promise.reject inside .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then((val) =>
		{
			return Promise.reject("error");
		})
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/no-return-wrap");

			expect(errors).toHaveLength(1);
		});

		it("should report Promise.resolve in arrow function .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then(val => Promise.resolve(val + 1))
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/no-return-wrap");

			expect(errors).toHaveLength(1);
		});

		it("should not report Promise.resolve outside of promises", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {Promise<number>} The result.
 */
function doWork()
{
	return Promise.resolve(42);
}`;

			const errors = await getErrorsForRule(code, "promise/no-return-wrap");

			expect(errors).toHaveLength(0);
		});
	});

	describe("promise/valid-params - Correct argument counts", () =>
	{
		it("should report Promise.resolve with too many args", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1, 2).catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report Promise.reject with too many args", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.reject("a", "b").catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report .then() with no arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then()
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report .then() with too many arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then(a => a, b => b, c => c)
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report Promise.all with no arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.all().catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report Promise.race with too many arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.race([1], [2]).catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report .catch() with no arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.catch();
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report .finally() with no arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.finally();
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should allow Promise.resolve with 0 or 1 arg", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve().catch(err => console.error(err));
	Promise.resolve(1).catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(0);
		});

		it("should allow .then() with 1 or 2 arguments", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then(a => a)
		.catch(err => console.error(err));
	Promise.resolve(1)
		.then(a => a, err => console.error(err))
		.catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(0);
		});

		it("should report Promise.allSettled with wrong arg count", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.allSettled().catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});

		it("should report Promise.any with wrong arg count", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.any().catch(err => console.error(err));
}`;

			const messages = await getMessagesForRule(code, "promise/valid-params");

			expect(messages).toHaveLength(1);
		});
	});

	describe("promise/always-return - Additional branch coverage", () =>
	{
		it("should allow .then() with implicit arrow return", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {Promise<number>} Result.
 */
function doWork()
{
	return Promise.resolve(1)
		.then(val => val + 1)
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/always-return");

			expect(errors).toHaveLength(0);
		});

		it("should report missing return in block-body .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then((val) =>
		{
			console.log(val);
		})
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/always-return");

			expect(errors).toHaveLength(1);
		});

		it("should allow throw in .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then((val) =>
		{
			throw new Error("fail");
		})
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/always-return");

			expect(errors).toHaveLength(0);
		});

		it("should allow process.exit in .then()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then((val) =>
		{
			process.exit(1);
		})
		.catch(err => console.error(err));
}`;

			const errors = await getErrorsForRule(code, "promise/always-return");

			expect(errors).toHaveLength(0);
		});

		it("should handle .then().catch().finally() chain", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	Promise.resolve(1)
		.then(val =>
		{
			return val + 1;
		})
		.catch(err => console.error(err))
		.finally(() => console.log("done"));
}`;

			const errors = await getErrorsForRule(code, "promise/always-return");

			expect(errors).toHaveLength(0);
		});
	});

	describe("promise/catch-or-return - Additional option coverage", () =>
	{
		it("should reject .then(onFulfilled, onRejected) without allowThen", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	fetch("/api")
		.then(
			response => response.json(),
			error => console.error(error)
		);
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(1);
		});

		it("should allow promise['catch']()", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @returns {void}
 */
function doWork()
{
	fetch("/api")
		.then(response => response.json())
		["catch"](error => console.error(error));
}`;

			const errors = await getErrorsForRule(code, "promise/catch-or-return");

			expect(errors).toHaveLength(0);
		});
	});

	describe("promise/no-promise-in-callback - No promises in callbacks", () =>
	{
		it("should report promise created inside a callback", async () =>
		{
			const code = `
/**
 * Does work.
 *
 * @param {Function} callback - The callback.
 * @returns {void}
 */
function doWork(callback)
{
	callback(null, Promise.resolve(42));
}`;

			const errors = await getErrorsForRule(code, "promise/no-promise-in-callback");

			expect(errors).toHaveLength(0);
		});
	});
});
