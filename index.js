module.exports = {
	"env": {
		"webextensions": true,
		"browser": true,
		"mocha": true,
		"node": true,
		"es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
		"belgradian",
		"chai-expect",
		"jsdoc",
		"mocha",
		"no-eslint-disable",
		"promise",
		"tailwindcss",
		"unicorn"
	],
	"globals": {
        "globalThis": "readonly",
		"chrome": "readonly",
        "browser": "readonly",
		"expect": "readonly",
		"should": "readonly"
    },
	"settings": {
		"jsdoc": {
			"mode":"closure",
			"preferredTypes": {
				object: "Object",
				"*": false,
				"any": false
			}
		}
	},
	"ignorePatterns": ["/tools", "/build", "/lib", "/rollup.config.*.js", "/src/_data/eleventyComputed.js", "**/external/*"],
    "rules": {
		"belgradian/member-prefix-rule": "error",
		"tailwindcss/classnames-order": "warn",
    	"tailwindcss/no-custom-classname": "warn",
    	"tailwindcss/no-contradicting-classname": "error",
        "jsdoc/check-examples": "off",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/no-undefined-types": "error",
        "jsdoc/require-description": ["error", {"descriptionStyle": "tag"}],
        "jsdoc/require-description-complete-sentence": "error",
        "jsdoc/require-example": "off",
        "jsdoc/require-hyphen-before-param-description": "error",
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/valid-types": "error",
        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": ["error", { terminationMethod: ['catch', 'finally'] }],
        "promise/no-native": "off",
        "promise/no-nesting": "off",
        "promise/no-promise-in-callback": "warn",
        "promise/no-callback-in-promise": "warn",
        "promise/avoid-new": "off",
        "promise/no-new-statics": "error",
        "promise/no-return-in-finally": "warn",
		"promise/valid-params": "warn",
		"no-eslint-disable/no-eslint-disable": "error",
        "unicorn/catch-error-name": [
            "error",
            {
                "name": "error"
            }
        ],
        "unicorn/explicit-length-check": "off",
        "unicorn/filename-case": [
            "error",
            {
                "case": "pascalCase"
            }
        ],
        "unicorn/no-abusive-eslint-disable": "error",
        "unicorn/no-process-exit": "error",
        "unicorn/throw-new-error": "error",
        "unicorn/number-literal-case": "error",
        "unicorn/escape-case": "error",
		"unicorn/no-array-instanceof": "error",
        "unicorn/no-new-buffer": "error",
        "unicorn/no-hex-escape": "error",
        "unicorn/custom-error-definition": "off",
        "unicorn/prefer-starts-ends-with": "error",
        "unicorn/prefer-string-slice": "error",
        "unicorn/prefer-text-content": "error",
        "unicorn/prefer-type-error": "error",
        "unicorn/no-fn-reference-in-iterator": "off",
        "unicorn/import-index": ["error", {"ignoreImports": true}],
        "unicorn/new-for-builtins": "error",
        "unicorn/regex-shorthand": "error",
        "unicorn/prefer-spread": "error",
        "unicorn/error-message": "off",
        "unicorn/no-unsafe-regex": "off",
        "unicorn/prefer-add-event-listener": "error",
		"unicorn/no-console-spaces": "off",
		"unicorn/expiring-todo-comments": [
			"error",
			{
				"terms": [
					"todo",
					"fixme",
					"xxx"
				]
			}
		],
		"unicorn/better-regex": "error",
        "no-unreadable-array-destructuring": "off",
        "accessor-pairs": "error",
        "array-bracket-newline": "off",
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "array-callback-return": "error",
        "array-element-newline": "off",
        "arrow-body-style": "error",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "arrow-spacing": [
            "error",
            {
                "after": true,
                "before": true
            }
        ],
        "block-scoped-var": "error",
        "block-spacing": "error",
        "brace-style": ["error", "allman", { "allowSingleLine": true }],
        "callback-return": "error",
        "camelcase": "off",
        "capitalized-comments": "off",
        "class-methods-use-this": "error",
        "comma-dangle": "error",
        "comma-spacing": [2, { before: false, after: true }],
        "comma-style": [
            "error",
            "last"
        ],
        "complexity": "error",
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "consistent-return": "off",
        "consistent-this": "error",
        "curly": "off",
        "default-case": "error",
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": [
            "error",
            {
                "allowKeywords": true
            }
        ],
        "eol-last": "off",
        "eqeqeq": "off",
        "func-call-spacing": "error",
        "func-name-matching": "error",
        "func-names": "off",
        "func-style": "off",
        "function-paren-newline": "error",
        "generator-star-spacing": "error",
        "global-require": "error",
        "guard-for-in": "error",
        "handle-callback-err": "error",
        "id-blacklist": "error",
        "id-length": "off",
        "id-match": "error",
        "implicit-arrow-linebreak": "off",
        "indent": ["error", "tab", 
            { 
                "SwitchCase": 1,
                "VariableDeclarator": { "var": 2, "let": 2, "const": 3 }, 
                "outerIIFEBody": 1, 
                "MemberExpression": 1,
                "FunctionDeclaration": {"parameters": "first"},
                "FunctionExpression": {"parameters": "first"},
                "CallExpression": {"arguments": "first"},
                "ArrayExpression": "first",
                "ObjectExpression": "first",
                "ImportDeclaration": "first",
                "flatTernaryExpressions": true,
                "ignoreComments": false
            }],
        "indent-legacy": "off",
        "init-declarations": "off",
        "jsx-quotes": "error",
        "key-spacing": "off",
        "keyword-spacing": [
            "error",
            {
                "after": true,
                "before": true
            }
        ],
        "line-comment-position": "off",
        "linebreak-style": [
            "error",
            "unix"
        ],
		"lines-around-comment": ["error", 
		{ 
			"beforeBlockComment": true,
			"beforeLineComment": true,
			"allowBlockStart": true,
			"allowClassStart": true,
			"allowObjectStart": true,
			"allowArrayStart": true
		}],
        "lines-around-directive": "error",
        "lines-between-class-members": [
            "error",
            "always"
        ],
        "max-classes-per-file": "off",
        "max-depth": "error",
        "max-len": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-nested-callbacks": "error",
        "max-params": "off",
        "max-statements": "off",
        "max-statements-per-line": "error",
        "multiline-comment-style": "off",
        "new-cap": "error",
        "new-parens": "off",
        "newline-after-var": "off",
        "newline-before-return": "error",
        "newline-per-chained-call": "off",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-async-promise-executor": "error",
        "no-await-in-loop": "error",
        "no-bitwise": "off",
        "no-buffer-constructor": "error",
        "no-caller": "error",
        "no-catch-shadow": "off",
        "no-confusing-arrow": "error",
        "no-console": "off",
        "no-continue": "error",
        "no-div-regex": "error",
        "no-duplicate-imports": "error",
        "no-else-return": "off",
        "no-empty-function": "off",
        "no-eq-null": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-extra-label": "error",
        "no-extra-parens": "off",
        "no-floating-decimal": "error",
        "no-implicit-coercion": "error",
        "no-implicit-globals": "error",
        "no-implied-eval": "error",
        "no-inline-comments": "off",
        "no-invalid-this": "off",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-lonely-if": "off",
        "no-loop-func": "error",
        "no-magic-numbers": "off",
        "no-misleading-character-class": "error",
        "no-mixed-operators": "off",
        "no-mixed-requires": "error",
        "no-multi-assign": "off",
        "no-multi-spaces": "off",
        "no-multi-str": "error",
        "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
        "no-native-reassign": "error",
        "no-negated-condition": "error",
        "no-negated-in-lhs": "error",
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-require": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "off",
        "no-path-concat": "error",
        "no-plusplus": "off",
        "no-process-env": "error",
        "no-process-exit": "error",
        "no-proto": "error",
        "no-prototype-builtins": "error",
        "no-restricted-globals": "error",
        "no-restricted-imports": "error",
        "no-restricted-modules": "error",
        "no-restricted-properties": "error",
        "no-restricted-syntax": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow": "off",
        "no-shadow-restricted-names": "error",
        "no-spaced-func": "error",
        "no-sync": "error",
        "no-tabs": "off",
        "no-template-curly-in-string": "error",
        "no-ternary": "off",
        "no-throw-literal": "off",
        "no-trailing-spaces": "off",
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-underscore-dangle": "off",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-use-before-define": "off",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "off",
        "no-var": "off",
        "no-void": "error",
        "no-warning-comments": "off",
        "no-whitespace-before-property": "error",
        "no-with": "error",
        "nonblock-statement-body-position": [
            "error",
            "any"
        ],
        "object-curly-newline": "error",
        "object-curly-spacing": "off",
        "object-property-newline": "error",
        "object-shorthand": "error",
        "one-var": "off",
        "one-var-declaration-per-line": "off",
        "operator-assignment": [
            "error",
            "always"
        ],
        "operator-linebreak": "error",
        "padded-blocks": "off",
        "padding-line-between-statements": "error",
        "prefer-arrow-callback": "off",
        "prefer-const": "off",
        "prefer-destructuring": "off",
        "prefer-numeric-literals": "error",
        "prefer-object-spread": "off",
        "prefer-promise-reject-errors": "off",
        "prefer-reflect": "off",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "off",
        "quote-props": "off",
        "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": false }],
        "radix": [
            "error",
            "always"
        ],
        "require-atomic-updates": "error",
        "require-await": "error",
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true,
                "ArrowFunctionExpression": true,
                "FunctionExpression": true
            }
        }],
        "require-unicode-regexp": "error",
        "rest-spread-spacing": "error",
        "semi": [
            "error", 
            "always"
        ],
        "semi-spacing": "off",
        "semi-style": [
            "error",
            "last"
        ],
        "sort-imports": "off",
        "sort-keys": "off",
        "sort-vars": "off",
        "space-before-blocks": "off",
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": [
            "error",
            "never"
        ],
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": ["error", "always"],
        "strict": "off",
        "switch-colon-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": "error",
        "template-tag-spacing": "error",
        "unicode-bom": [
            "error",
            "never"
        ],
        "valid-jsdoc": "off",
        "vars-on-top": "error",
        "wrap-regex": "error",
        "yield-star-spacing": "error"
	},
	"overrides": [
	{
		"files": ["test/mocks/*.mock.js"],
		"rules": 
    	{
        	"unicorn/filename-case": 
        	[
            	"error",
            	{
                	"case": "snakeCase"
            	}
			],
			"require-jsdoc": "off",
			"no-negated-condition":"off",
			"no-nested-ternary": "off"
    	}
	},
	{
		"files": ["src/scripts/*.js"],
		"rules": 
    	{
        	"unicorn/filename-case": 
        	[
            	"error",
            	{
                	"case": "kebabCase"
            	}
			],
			"require-jsdoc": "off",
			"no-negated-condition":"off",
			"no-nested-ternary": "off"
    	}
	},
	{
		"files": ["*.json"],
		"rules": 
    	{
        	"unicorn/filename-case": 
        	[
            	"error",
            	{
                	"case": "kebabCase"
            	}
			]
    	}
	},
	{
		"files": ["test/*.Test.js"],
		"rules": 
		{
			"no-unused-vars": 
			[
				"error",
				{
					"varsIgnorePattern": "should|expect"
				}
			],
			"chai-expect/missing-assertion": "error",
			"chai-expect/terminating-properties": "error",
			"mocha/no-exclusive-tests": "error",
			"mocha/no-skipped-tests": "error",
			"mocha/no-pending-tests": "error",
			"mocha/no-identical-title": "error",
			"promise/no-callback-in-promise": "off",
			"complexity": "off",
			"unicorn/prefer-add-event-listener": "off",
			"require-jsdoc": "off"
    	}
	}]
};