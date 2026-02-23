/**
 * Checks whether a CallExpression is a member call on a named object.
 *
 * @param {string} objectName - The name of the object to check.
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is a member call on the named object.
 */
function isMemberCallWithObjectName(objectName, node)
{
	return (
		node.type === "CallExpression" &&
		node.callee.type === "MemberExpression" &&
		((node.callee.object.type === "Identifier" &&
			node.callee.object.name === objectName) ||
			isMemberCallWithObjectName(objectName, node.callee.object))
	);
}

export default isMemberCallWithObjectName;
