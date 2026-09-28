/**
 * @file Guards the shape of package.json itself.
 *
 * `peerDependencies.eslint` was an exact version (9.37.0, then 10.0.0, then
 * 10.10.0) for the whole life of this package. Consumers pin their own eslint,
 * and the shared PR pipeline installs this config into the consumer's tree, so
 * an exact peer meant every consumer not on precisely that version failed
 * `npm install` with ERESOLVE. The move 10.0.0 -> 10.10.0 arrived inside a
 * grouped dependency bump and took Independent/mosaic.js down on 2026-09-27
 * (build 178689).
 *
 * The range cannot simply be `^10.0.0` either: the bundled plugins carry their
 * own eslint peer ranges (eslint-plugin-unicorn 74 says `>=10.4`), and npm
 * resolves those too. So the contract is: our eslint peer must be a subset of
 * every bundled plugin's eslint peer, the eslint we test on must satisfy it,
 * and every bundled plugin must be pinned exactly so the subset check is
 * checking the plugin that actually ships.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import semver from "semver";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");

/**
 * Read a bundled dependency's package.json from disk. Several of the plugins
 * (unicorn, jsdoc) publish an `exports` map that does not expose
 * `./package.json`, so `require("<plugin>/package.json")` throws for them.
 * @param {string} name package name
 * @returns {object} its parsed package.json
 */
function bundledPackageJson(name)
{
	const entry = require.resolve(name);
	const root = entry.slice(0, entry.lastIndexOf(`/node_modules/${name}/`) + `/node_modules/${name}/`.length);
	return JSON.parse(readFileSync(`${root}package.json`, "utf8"));
}

describe("package.json shape", () =>
{
	const peer = pkg.peerDependencies.eslint;

	describe("peerDependencies.eslint", () =>
	{
		it("is a caret range on one major, not an exact version", () =>
		{
			expect(semver.valid(peer)).toBeNull();
			expect(peer).toMatch(/^\^\d+\.\d+\.\d+$/u);
		});

		it("is satisfied by the eslint the tests run on", () =>
		{
			expect(semver.satisfies(pkg.devDependencies.eslint, peer)).toBe(true);
		});

		it.each(Object.keys(pkg.dependencies))("is a subset of the eslint peer range declared by %s", (name) =>
		{
			const pluginPeer = bundledPackageJson(name).peerDependencies?.eslint;
			if (pluginPeer === undefined)
			{
				return;
			}
			expect(semver.subset(peer, pluginPeer)).toBe(true);
		});
	});

	describe("peerDependencies.typescript-eslint", () =>
	{
		it("is satisfied by the typescript-eslint the tests run on", () =>
		{
			expect(semver.satisfies(pkg.devDependencies["typescript-eslint"], pkg.peerDependencies["typescript-eslint"])).toBe(true);
		});

		it("does not admit versions whose own eslint peer excludes our eslint peer", () =>
		{
			const installed = bundledPackageJson("typescript-eslint");
			expect(semver.subset(peer, installed.peerDependencies.eslint)).toBe(true);
		});
	});

	describe("files (the published tarball)", () =>
	{
		// 4.0.19 shipped test-results.xml, ci.yml, vitest.config.js and scripts/ to
		// npm: the junit reporter added for CI wrote its file into the package root
		// and nothing whitelisted the tarball. Every export target must be listed,
		// and the list must be a whitelist, not absent.
		it("is a whitelist that covers every export target", () =>
		{
			expect(Array.isArray(pkg.files)).toBe(true);
			for (const target of Object.values(pkg.exports))
			{
				expect(pkg.files).toContain(target.replace(/^\.\//u, ""));
			}
			expect(pkg.files).toContain("rules/");
		});

		it("lists nothing that belongs to the test or CI tooling", () =>
		{
			for (const entry of pkg.files)
			{
				expect(entry).not.toMatch(/test|ci\.yml|vitest|scripts/u);
			}
		});
	});

	describe("dependencies (the bundled plugins)", () =>
	{
		it.each(Object.entries(pkg.dependencies))("%s is pinned exactly (%s)", (name, version) =>
		{
			expect(semver.valid(version)).toBe(version);
			expect(bundledPackageJson(name).version).toBe(version);
		});
	});
});
