import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		testMatch: ["**/test/**/*.test.js"],
		coverage: {
			include: ["rules/**/*.js"],
			thresholds: {
				branches: 80,
				functions: 80,
				lines: 80,
				statements: 80
			}
		}
	}
});
