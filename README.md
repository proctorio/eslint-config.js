# @proctorio/eslint-config

This package provides Proctorio's .eslintrc as an extensible shared config.

## Usage

Install the package:

```
npm install --save-dev eslint@8.52.0 eslint-plugin-belgradian@2.4.3 eslint-plugin-chai-expect@3.0.0 eslint-plugin-jsdoc@46.8.2 eslint-plugin-mocha@10.2.0 eslint-plugin-no-eslint-disable@1.0.1 eslint-plugin-promise@6.1.1 eslint-plugin-unicorn@49.0.0 @proctorio/eslint-config
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