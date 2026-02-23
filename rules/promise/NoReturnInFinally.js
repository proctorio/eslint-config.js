/**
 * Rule: no-return-in-finally
 * Disallows return statements in finally().
 * Adapted from eslint-plugin-promise (MIT License).
 */

import isPromise from "./lib/IsPromise.js";

const noReturnInFinally = {
	meta: {
		type: "problem",
		docs: {
			description: "Disallow return statements in `finally()`.",
		},
		schema: [],
		messages: {
			avoidReturnInFinally: "No return in finally",
		},
	},
	create(context)
	{
		return {
			CallExpression(node)
			{
				if (isPromise(node))
				{
					if (
						node.callee &&
						node.callee.property &&
						node.callee.property.name === "finally"
					)
					{
						if (
							node.arguments &&
							node.arguments[0] &&
							node.arguments[0].body &&
							node.arguments[0].body.body
						)
						{
							if (
								node.arguments[0].body.body.some((statement) =>
								{
									return statement.type === "ReturnStatement";
								})
							)
							{
								context.report({
									node: node.callee.property,
									messageId: "avoidReturnInFinally",
								});
							}
						}
					}
				}
			},
		};
	},
};

export default noReturnInFinally;
