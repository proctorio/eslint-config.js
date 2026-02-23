import isNamedCallback from "./IsNamedCallback.js";

/**
 * Checks whether a node is a callback call expression.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @param {Array<string>} exceptions - Callback names to exclude.
 * @returns {boolean} Whether the node is a callback call.
 */
function isCallback(node, exceptions)
{
	const isCallExpression = node.type === "CallExpression";
	const callee = node.callee || {};
	const nameIsCallback = isNamedCallback(callee.name, exceptions);

	return isCallExpression && nameIsCallback;
}

export default isCallback;
