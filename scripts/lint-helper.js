#!/usr/bin/env node

/**
 * @file Lint helper script that prevents config overrides.
 * @description This script is used to run ESLint with strict settings that
 * prevent users from adding inline config or eslint-disable comments. It
 * enforces the shared config without exceptions, which is critical for
 * maintaining consistent code quality across all projects using this config.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__dirname);

/**
 * Runs ESLint with strict no-override flags.
 *
 * @returns {void}
 */
function runLint()
{
	const args = process.argv.slice(2);
	
	if (args.length < 2)
	{
		console.error("Usage: npm run lint:helper <output-file-without-extension> <path-to-lint>");
		console.error("Example: npm run lint:helper ./output/result src");
		process.exit(1);
	}

	const [outputBase, pathToLint] = args;
	const outputFile = `${outputBase}.test_output/eslint.xml`;

	// Ensure we're using the local eslint binary
	const eslintBin = path.join(__dirname, "..", "node_modules", ".bin", "eslint");
	const configPath = path.join(__dirname, "..", "index.js");

	const eslintArgs = [
		"--config", configPath,
		"--ignore-pattern", "/tools",
		"--ignore-pattern", "/build",
		"--ignore-pattern", "/lib",
		"--ignore-pattern", "/rollup.config.*.js",
		"--ignore-pattern", "**/external/*",
		"--no-inline-config",
		"--no-eslintrc",
		"--format", "junit",
		"--output-file", outputFile,
		`${pathToLint}**/*.js`
	];

	console.log(`Running ESLint with strict no-override mode...`);
	console.log(`Output will be written to: ${outputFile}`);

	const eslint = spawn(eslintBin, eslintArgs, { stdio: "inherit" });

	eslint.on("exit", (code) =>
	{
		if (code === 0)
		{
			console.log("✅ Linting completed successfully");
		}
		else
		{
			console.error(`❌ Linting failed with exit code ${code}`);
		}

		process.exit(code);
	});
}

// Run if executed directly
if (require.main === module)
{
	runLint();
}

module.exports = { runLint };
