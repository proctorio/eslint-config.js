/**
 * Set of known Promise static method names.
 *
 * @type {Set<string>}
 */
const PROMISE_STATICS = new Set([
	"all",
	"allSettled",
	"any",
	"race",
	"reject",
	"resolve",
	"withResolvers",
]);

export default PROMISE_STATICS;
