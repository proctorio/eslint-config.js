/**
 * Checks whether an expression node is part of a promise chain.
 *
 * @param {import("estree").Node} expression - The AST expression node.
 * @returns {boolean} Whether the expression is a promise.
 */

import PROMISE_STATICS from "./PromiseStatics.js";

/**
 * Determines if the given expression represents a Promise call.
 *
 * @param {import("estree").Node} expression - The AST node to check.
 * @returns {boolean} Whether the expression is a promise call.
 */
function isPromise(expression)
{
	return (
		// hello.then()
		(expression.type === "CallExpression" &&
			expression.callee.type === "MemberExpression" &&
			expression.callee.property.name === "then") ||
		// hello.catch()
		(expression.type === "CallExpression" &&
			expression.callee.type === "MemberExpression" &&
			expression.callee.property.name === "catch") ||
		// hello.finally()
		(expression.type === "CallExpression" &&
			expression.callee.type === "MemberExpression" &&
			expression.callee.property.name === "finally") ||
		// somePromise.ANYTHING()
		(expression.type === "CallExpression" &&
			expression.callee.type === "MemberExpression" &&
			isPromise(expression.callee.object)) ||
		// Promise.STATIC_METHOD()
		(expression.type === "CallExpression" &&
			expression.callee.type === "MemberExpression" &&
			expression.callee.object.type === "Identifier" &&
			expression.callee.object.name === "Promise" &&
			PROMISE_STATICS.has(expression.callee.property.name) &&
			expression.callee.property.name !== "withResolvers")
	);
}

export default isPromise;
