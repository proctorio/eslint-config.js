/**
 * Inline promise rules plugin.
 * Replaces eslint-plugin-promise with inlined rule implementations.
 * Original rules adapted from eslint-plugin-promise (MIT License).
 */

import alwaysReturn from "./AlwaysReturn.js";
import catchOrReturn from "./CatchOrReturn.js";
import noReturnWrap from "./NoReturnWrap.js";
import paramNames from "./ParamNames.js";
import noPromiseInCallback from "./NoPromiseInCallback.js";
import noCallbackInPromise from "./NoCallbackInPromise.js";
import noNewStatics from "./NoNewStatics.js";
import noReturnInFinally from "./NoReturnInFinally.js";
import validParams from "./ValidParams.js";

const promisePlugin = {
	rules: {
		"always-return": alwaysReturn,
		"catch-or-return": catchOrReturn,
		"no-return-wrap": noReturnWrap,
		"param-names": paramNames,
		"no-promise-in-callback": noPromiseInCallback,
		"no-callback-in-promise": noCallbackInPromise,
		"no-new-statics": noNewStatics,
		"no-return-in-finally": noReturnInFinally,
		"valid-params": validParams,
	},
};

export default promisePlugin;
