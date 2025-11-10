#!/usr/bin/env node

/**
 * @file Generates install.sh from package.json peerDependencies.
 * @description This script reads the peerDependencies from package.json and
 * generates an install.sh script with the exact versions specified. This
 * ensures that the install script stays in sync with the package.json and
 * reduces manual maintenance.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generates the install.sh script content.
 *
 * @returns {void}
 */
function generateInstallScript()
{
	const packageJsonPath = path.join(__dirname, "..", "package.json");
	const installShPath = path.join(__dirname, "install.sh");

	// Read package.json
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
	const peerDeps = packageJson.peerDependencies;

	if (!peerDeps)
	{
		console.error("No peerDependencies found in package.json");
		process.exit(1);
	}

	// Generate install command
	const packages = Object.entries(peerDeps)
		.map(([name, version]) => `\t${name}@${version}`)
		.join(" \\\n");

	const scriptContent = `#!/usr/bin/env bash
# This file is auto-generated from package.json peerDependencies
# Do not edit manually - run 'npm run prepare' to regenerate

npm install --save-dev \\
${packages}
`;

	// Write install.sh
	fs.writeFileSync(installShPath, scriptContent, { mode: 0o755 });

	console.log("✅ Generated scripts/install.sh from package.json peerDependencies");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`)
{
	generateInstallScript();
}

export { generateInstallScript };
