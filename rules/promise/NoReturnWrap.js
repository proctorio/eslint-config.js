/**
 * Rule: no-return-wrap
 * Prevents unnecessary wrapping of results in Promise.resolve or Promise.reject.
 * Adapted from eslint-plugin-promise (MIT License).
 */

import isPromise from "./lib/IsPromise.js";

/**
 * Checks if a node is inside a promise callback by walking ancestors.
 *
 * @param {import("eslint").Rule.RuleContext} context - The rule context.
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is inside a promise.
 */
function isInPromise(context, node)
{
	let functionNode = context.sourceCode.getAncestors(node)
		.filter((ancestor) =>
		{
			return (
				ancestor.type === "ArrowFunctionExpression" ||
				ancestor.type === "FunctionExpression"
			);
		})
		.reverse()[0];

	while (
		functionNode &&
		functionNode.parent &&
		functionNode.parent.type === "MemberExpression" &&
		functionNode.parent.object === functionNode &&
		functionNode.parent.property.type === "Identifier" &&
		functionNode.parent.property.name === "bind" &&
		functionNode.parent.parent &&
		functionNode.parent.parent.type === "CallExpression" &&
		functionNode.parent.parent.callee === functionNode.parent
	)
	{
		functionNode = functionNode.parent.parent;
	}

	return functionNode && functionNode.parent && isPromise(functionNode.parent);
}

const noReturnWrap = {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Disallow wrapping values in `Promise.resolve` or `Promise.reject` when not needed.",
		},
		messages: {
			resolve: "Avoid wrapping return values in Promise.resolve",
			reject: "Expected throw instead of Promise.reject",
		},
		schema: [
			{
				type: "object",
				properties: {
					allowReject: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
	},
	create(context)
	{
		const options = context.options[0] || {};
		const allowReject = options.allowReject;

		/**
		 * Checks a call expression and reports if it wraps unnecessarily.
		 *
		 * @param {import("estree").CallExpression} callExpression - The call expression with callee.
		 * @param {import("estree").Node} node - The node to report on.
		 * @returns {void}
		 */
		function checkCallExpression({ callee }, node)
		{
			if (
				isInPromise(context, node) &&
				callee.type === "MemberExpression" &&
				callee.object.name === "Promise"
			)
			{
				if (callee.property.name === "resolve")
				{
					context.report({ node, messageId: "resolve" });
				}
				else if (!allowReject && callee.property.name === "reject")
				{
					context.report({ node, messageId: "reject" });
				}
			}
		}

		return {
			ReturnStatement(node)
			{
				if (node.argument && node.argument.type === "CallExpression")
				{
					checkCallExpression(node.argument, node);
				}
			},
			"ArrowFunctionExpression > CallExpression"(node)
			{
				checkCallExpression(node, node);
			},
		};
	},
};

export default noReturnWrap;
