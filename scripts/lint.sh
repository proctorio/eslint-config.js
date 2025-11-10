#!/usr/bin/env bash
./node_modules/.bin/eslint \
	--config ./node_modules/@proctorio/eslint-config/index.js \
	--ignore-pattern /tools \
	--ignore-pattern /build \
	--ignore-pattern /lib \
	--ignore-pattern /rollup.config.*.js \
	--ignore-pattern "**/external/*" \
	--no-inline-config \
	--no-eslintrc \
	--format junit \
	--output-file "$1.test_output/eslint.xml" \
	"$2**/*.js"