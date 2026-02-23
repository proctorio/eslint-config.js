/**
 * Rule: no-callback-in-promise
 * Avoids calling callback functions inside of a promise.
 * Adapted from eslint-plugin-promise (MIT License).
 */

import hasPromiseCallback from "./lib/HasPromiseCallback.js";
import isInsidePromise from "./lib/IsInsidePromise.js";
import isCallback from "./lib/IsCallback.js";

const CB_BLACKLIST = ["callback", "cb", "next", "done"];
const TIMEOUT_WHITELIST = [
	"setImmediate",
	"setTimeout",
	"requestAnimationFrame",
	"nextTick",
];

/**
 * Checks if a function node is inside a timeout/scheduling call.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is inside a timeout call.
 */
const isInsideTimeout = (node) =>
{
	const isFunctionExpression =
		node.type === "FunctionExpression" ||
		node.type === "ArrowFunctionExpression";
	const parent = node.parent || {};
	const callee = parent.callee || {};
	const name = (callee.property && callee.property.name) || callee.name || "";
	const parentIsTimeout = TIMEOUT_WHITELIST.includes(name);

	return isFunctionExpression && parentIsTimeout;
};

const noCallbackInPromise = {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Disallow calling `cb()` inside of a `then()` (use [util.callbackify][] instead).",
		},
		messages: {
			callback: "Avoid calling back inside of a promise.",
		},
		schema: [
			{
				type: "object",
				properties: {
					exceptions: {
						type: "array",
						items: {
							type: "string",
						},
					},
					timeoutsErr: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
	},
	create(context)
	{
		const { timeoutsErr = false } = context.options[0] || {};

		return {
			CallExpression(node)
			{
				const options = context.options[0] || {};
				const exceptions = options.exceptions || [];
				if (!isCallback(node, exceptions))
				{
					const name = node.arguments?.[0]?.name;
					if (hasPromiseCallback(node))
					{
						const callingName = node.callee.name || node.callee.property?.name;
						if (
							!exceptions.includes(name) &&
							CB_BLACKLIST.includes(name) &&
							(timeoutsErr || !TIMEOUT_WHITELIST.includes(callingName))
						)
						{
							context.report({
								node: node.arguments[0],
								messageId: "callback",
							});
						}

						return;
					}
					if (!timeoutsErr)
					{
						return;
					}

					if (!name)
					{
						return;
					}
				}

				const ancestors = context.sourceCode.getAncestors(node);
				if (
					ancestors.some(isInsidePromise) &&
					(timeoutsErr || !ancestors.some(isInsideTimeout))
				)
				{
					context.report({
						node,
						messageId: "callback",
					});
				}
			},
		};
	},
};

export default noCallbackInPromise;
