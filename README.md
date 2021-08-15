# @proctorio/eslint-config

This package provides Proctorio's .eslintrc as an extensible shared config.

## Usage

Install the package:

```
npm install --save-dev eslint@7.32.0 eslint-plugin-chai-expect@2.2.0 eslint-plugin-jsdoc@36.0.7 eslint-plugin-mocha@9.0.0 eslint-plugin-no-eslint-disable@1.0.1 eslint-plugin-promise@5.1.0 eslint-plugin-tailwindcss@1.14.1 eslint-plugin-unicorn@35.0.0 @proctorio/eslint-config
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