/**
 * Checks whether a given node is a new Promise() call.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is a Promise constructor call.
 */
function isPromiseConstructor(node)
{
	return (
		node.type === "NewExpression" &&
		node.callee.type === "Identifier" &&
		node.callee.name === "Promise"
	);
}

/**
 * Checks whether the given node is new Promise(() => {}) with an inline executor.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is a Promise constructor with an inline executor.
 */
function isPromiseConstructorWithInlineExecutor(node)
{
	return (
		isPromiseConstructor(node) &&
		node.arguments.length === 1 &&
		(node.arguments[0].type === "FunctionExpression" ||
			node.arguments[0].type === "ArrowFunctionExpression")
	);
}

export { isPromiseConstructor, isPromiseConstructorWithInlineExecutor };
