# @proctorio/eslint-config

This package provides Proctorio's .eslintrc as an extensible shared config.

## Usage

Install the package:

```
npm install --save-dev eslint@7.32.0 eslint-plugin-belgradian@2.4.3 eslint-plugin-chai-expect@3.0.0 eslint-plugin-jsdoc@37.0.3 eslint-plugin-mocha@9.0.0 eslint-plugin-no-eslint-disable@1.0.1 eslint-plugin-promise@5.1.1 eslint-plugin-tailwindcss@1.17.2 eslint-plugin-unicorn@39.0.0 @proctorio/eslint-config
```

Add this configuration to your `.eslintrc` file:

```js
{
    "extends": "@proctorio/eslint-config"
}
```

OR in your `package.json` file:

```js
"eslintConfig": {
    "extends": "@proctorio/eslint-config"
}
```