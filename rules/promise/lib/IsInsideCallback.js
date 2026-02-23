import isInsidePromise from "./IsInsidePromise.js";

/**
 * Checks whether a function node is inside a callback (error-first pattern).
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is inside a callback function.
 */
function isInsideCallback(node)
{
	const isFunction =
		node.type === "FunctionExpression" ||
		node.type === "ArrowFunctionExpression" ||
		node.type === "FunctionDeclaration";

	// it's totally fine to use promises inside promises
	if (isInsidePromise(node)) return false;

	const name = node.params && node.params[0] && node.params[0].name;
	const firstArgIsError = name === "err" || name === "error";

	return isFunction && firstArgIsError;
}

export default isInsideCallback;
