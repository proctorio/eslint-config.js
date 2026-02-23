/**
 * Inline no-eslint-disable plugin.
 * Replaces eslint-plugin-no-eslint-disable with an inlined rule implementation.
 * Original rule adapted from eslint-plugin-no-eslint-disable (MIT License).
 */

const DISABLE_REGEX = /eslint-disable(?:-next-line|-line)?(?:\s|$)/u;

const noEslintDisableRule = {
	meta: {
		type: "problem",
		docs: {
			description: "Disallow eslint-disable comments.",
		},
		messages: {
			forbidden: "Disabling ESLint rules via comments is not allowed at line {{line}}:{{column}}.",
		},
	},
	create(context)
	{
		const comments = context.sourceCode.getAllComments();
		for (const comment of comments)
		{
			if (DISABLE_REGEX.test(comment.value))
			{
				context.report({
					loc: comment.loc,
					messageId: "forbidden",
					data: {
						line: String(comment.loc.start.line),
						column: String(comment.loc.start.column),
					},
				});
			}
		}

		return {};
	},
};

const noEslintDisablePlugin = {
	rules: {
		"no-eslint-disable": noEslintDisableRule,
	},
};

export default noEslintDisablePlugin;
