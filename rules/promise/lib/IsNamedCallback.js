const DEFAULT_CALLBACKS = ["done", "cb", "callback", "next"];

/**
 * Checks whether a name matches a known callback function name.
 *
 * @param {string} potentialCallbackName - The name to check.
 * @param {Array<string>} exceptions - Names to exclude from the callback list.
 * @returns {boolean} Whether the name is a known callback name.
 */
function isNamedCallback(potentialCallbackName, exceptions)
{
	const callbacks = DEFAULT_CALLBACKS.filter((item) =>
	{
		return !exceptions.includes(item);
	});

	return callbacks.some((trueCallbackName) =>
	{
		return potentialCallbackName === trueCallbackName;
	});
}

export default isNamedCallback;
