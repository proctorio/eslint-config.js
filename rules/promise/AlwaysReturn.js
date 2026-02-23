/**
 * Rule: always-return
 * Requires returning inside each then() to create readable and reusable Promise chains.
 * Adapted from eslint-plugin-promise (MIT License).
 */

/**
 * Checks if a node is a function with a block statement body.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is a function with a block body.
 */
function isFunctionWithBlockStatement(node)
{
	if (node.type === "FunctionExpression")
	{
		return true;
	}
	if (node.type === "ArrowFunctionExpression")
	{
		return node.body.type === "BlockStatement";
	}

	return false;
}

/**
 * Checks if a node is a member call with a specific method name.
 *
 * @param {string} memberName - The member method name to match.
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is a matching member call.
 */
function isMemberCall(memberName, node)
{
	return (
		node.type === "CallExpression" &&
		node.callee.type === "MemberExpression" &&
		!node.callee.computed &&
		node.callee.property.type === "Identifier" &&
		node.callee.property.name === memberName
	);
}

/**
 * Checks if a node is the first argument of its parent call.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is the first argument.
 */
function isFirstArgument(node)
{
	return Boolean(
		node.parent && node.parent.arguments && node.parent.arguments[0] === node,
	);
}

/**
 * Checks if a node is an inline then() function expression.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @returns {boolean} Whether the node is an inline then() callback.
 */
function isInlineThenFunctionExpression(node)
{
	return (
		isFunctionWithBlockStatement(node) &&
		isMemberCall("then", node.parent) &&
		isFirstArgument(node)
	);
}

/**
 * Returns the last element of an array.
 *
 * @param {Array} arr - The array to peek.
 * @returns {*} The last element.
 */
function peek(arr)
{
	return arr[arr.length - 1];
}

/**
 * Checks if the then() callback is the last in the promise chain.
 *
 * @param {import("estree").Node} node - The inline then() function node.
 * @returns {boolean} Whether this is the last callback in the chain.
 */
function isLastCallback(node)
{
	let target = node.parent;
	let parent = target.parent;
	while (parent)
	{
		if (parent.type === "ExpressionStatement")
		{
			return true;
		}
		if (parent.type === "UnaryExpression")
		{
			return parent.operator === "void";
		}
		let nextTarget = null;
		if (parent.type === "SequenceExpression")
		{
			if (peek(parent.expressions) !== target)
			{
				return true;
			}
			nextTarget = parent;
		}
		else if (
			parent.type === "ChainExpression" ||
			parent.type === "AwaitExpression"
		)
		{
			nextTarget = parent;
		}
		else if (parent.type === "MemberExpression")
		{
			if (
				parent.parent &&
				(isMemberCall("catch", parent.parent) ||
					isMemberCall("finally", parent.parent))
			)
			{
				nextTarget = parent.parent;
			}
		}
		if (nextTarget)
		{
			target = nextTarget;
			parent = target.parent;
			continue;
		}

		return false;
	}

	return false;
}

/**
 * Gets the root object name for a MemberExpression or Identifier.
 *
 * @param {import("estree").Node} node - The AST node.
 * @returns {string|undefined} The root object name.
 */
function getRootObjectName(node)
{
	if (node.type === "Identifier")
	{
		return node.name;
	}
	if (node.type === "MemberExpression")
	{
		return getRootObjectName(node.object);
	}

	return undefined;
}

/**
 * Checks if a statement is an assignment to an ignored variable.
 *
 * @param {import("estree").Node} node - The AST node to check.
 * @param {Array<string>} ignoredVars - Variable names to ignore.
 * @returns {boolean} Whether the node is an ignored assignment.
 */
function isIgnoredAssignment(node, ignoredVars)
{
	if (node.type !== "ExpressionStatement") return false;
	const expr = node.expression;
	if (expr.type !== "AssignmentExpression") return false;
	const left = expr.left;
	const rootName = getRootObjectName(left);

	return ignoredVars.includes(rootName);
}

const alwaysReturn = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Require returning inside each `then()` to create readable and reusable Promise chains.",
		},
		schema: [
			{
				type: "object",
				properties: {
					ignoreLastCallback: {
						type: "boolean",
					},
					ignoreAssignmentVariable: {
						type: "array",
						items: {
							type: "string",
							pattern: "^[\\w$]+$",
						},
						uniqueItems: true,
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			thenShouldReturnOrThrow: "Each then() should return a value or throw",
		},
	},
	create(context)
	{
		const options = context.options[0] || {};
		const ignoreLastCallback = !!options.ignoreLastCallback;
		const ignoreAssignmentVariable = options.ignoreAssignmentVariable || [
			"globalThis",
		];

		const funcInfoStack = [];

		/**
		 * Marks the current branch as having a return or throw.
		 *
		 * @returns {void}
		 */
		function markCurrentBranchAsGood()
		{
			const funcInfo = peek(funcInfoStack);
			const currentBranchID = peek(funcInfo.branchIDStack);
			if (funcInfo.branchInfoMap[currentBranchID])
			{
				funcInfo.branchInfoMap[currentBranchID].good = true;
			}
		}

		return {
			"ReturnStatement:exit": markCurrentBranchAsGood,
			"ThrowStatement:exit": markCurrentBranchAsGood,
			"ExpressionStatement > CallExpression > MemberExpression[object.name=\"process\"][property.name=\"exit\"]:exit":
				markCurrentBranchAsGood,
			"ExpressionStatement > CallExpression > MemberExpression[object.name=\"process\"][property.name=\"abort\"]:exit":
				markCurrentBranchAsGood,

			onCodePathSegmentStart(segment, node)
			{
				const funcInfo = peek(funcInfoStack);
				funcInfo.branchIDStack.push(segment.id);
				funcInfo.branchInfoMap[segment.id] = { good: false, node };
			},

			onCodePathSegmentEnd()
			{
				const funcInfo = peek(funcInfoStack);
				funcInfo.branchIDStack.pop();
			},

			onCodePathStart()
			{
				funcInfoStack.push({
					branchIDStack: [],
					branchInfoMap: {},
				});
			},

			onCodePathEnd(path, node)
			{
				const funcInfo = funcInfoStack.pop();

				if (!isInlineThenFunctionExpression(node))
				{
					return;
				}

				if (ignoreLastCallback && isLastCallback(node))
				{
					return;
				}

				if (
					ignoreAssignmentVariable.length &&
					isLastCallback(node) &&
					node.body?.type === "BlockStatement"
				)
				{
					for (const statement of node.body.body)
					{
						if (isIgnoredAssignment(statement, ignoreAssignmentVariable))
						{
							return;
						}
					}
				}

				path.finalSegments.forEach((segment) =>
				{
					const id = segment.id;
					const branch = funcInfo.branchInfoMap[id];
					if (!branch.good)
					{
						context.report({
							messageId: "thenShouldReturnOrThrow",
							node: branch.node,
						});
					}
				});
			},
		};
	},
};

export default alwaysReturn;
