/**
 * Checks whether a function node is inside a promise callback (then/catch).
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is inside a promise callback.
 */
function isInsidePromise(node)
{
	const isFunctionExpression =
		node.type === "FunctionExpression" ||
		node.type === "ArrowFunctionExpression";
	const parent = node.parent || {};
	const callee = parent.callee || {};
	const name = (callee.property && callee.property.name) || "";
	const parentIsPromise = name === "then" || name === "catch";

	return isFunctionExpression && parentIsPromise;
}

export default isInsidePromise;
