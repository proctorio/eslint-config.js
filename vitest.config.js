import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		testMatch: ["**/test/**/*.test.js"],

		// "default" keeps the console output; "junit" writes the file the CI
		// pipeline publishes. Without it a failing test shows up only as a
		// non-zero exit code with no per-test detail on the build.
		reporters: ["default", "junit"],
		outputFile: {
			junit: "test-results.xml"
		},
		coverage: {
			include: ["rules/**/*.js"],

			// cobertura is what the ADO coverage task consumes; text keeps the
			// summary in the build log.
			reporter: ["text", "cobertura", "html"],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80
			}
		}
	}
});
