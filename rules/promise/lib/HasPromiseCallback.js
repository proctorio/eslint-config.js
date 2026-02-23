/**
 * Checks whether a node has a promise callback (then/catch).
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node has a promise callback.
 */
function hasPromiseCallback(node)
{
	if (node.type !== "CallExpression") return false;
	if (node.callee.type !== "MemberExpression") return false;
	const propertyName = node.callee.property.name;

	return propertyName === "then" || propertyName === "catch";
}

export default hasPromiseCallback;
