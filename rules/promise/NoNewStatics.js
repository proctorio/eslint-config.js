/**
 * Rule: no-new-statics
 * Disallows calling new on a Promise static method.
 * Adapted from eslint-plugin-promise (MIT License).
 */

import PROMISE_STATICS from "./lib/PromiseStatics.js";

const noNewStatics = {
	meta: {
		type: "problem",
		docs: {
			description: "Disallow calling `new` on a Promise static method.",
		},
		fixable: "code",
		schema: [],
		messages: {
			avoidNewStatic: "Avoid calling 'new' on 'Promise.{{ name }}()'",
		},
	},
	create(context)
	{
		return {
			NewExpression(node)
			{
				if (
					node.callee.type === "MemberExpression" &&
					node.callee.object.name === "Promise" &&
					PROMISE_STATICS.has(node.callee.property.name)
				)
				{
					context.report({
						node,
						messageId: "avoidNewStatic",
						data: { name: node.callee.property.name },
						fix(fixer)
						{
							return fixer.replaceTextRange(
								[node.range[0], node.range[0] + "new ".length],
								"",
							);
						},
					});
				}
			},
		};
	},
};

export default noNewStatics;
