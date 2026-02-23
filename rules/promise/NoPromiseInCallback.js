/**
 * Rule: no-promise-in-callback
 * Discourages using promises inside of callbacks.
 * Adapted from eslint-plugin-promise (MIT License).
 */

import isPromise from "./lib/IsPromise.js";
import isInsideCallback from "./lib/IsInsideCallback.js";

const noPromiseInCallback = {
	meta: {
		type: "suggestion",
		docs: {
			description: "Disallow using promises inside of callbacks.",
		},
		schema: [],
		messages: {
			avoidPromiseInCallback: "Avoid using promises inside of callbacks.",
		},
	},
	create(context)
	{
		return {
			CallExpression(node)
			{
				if (!isPromise(node)) return;

				// if returning the promise, it's probably not really a callback
				if (node.parent.type === "ReturnStatement") return;

				if (context.sourceCode.getAncestors(node).some(isInsideCallback))
				{
					context.report({
						node: node.callee,
						messageId: "avoidPromiseInCallback",
					});
				}
			},
		};
	},
};

export default noPromiseInCallback;
