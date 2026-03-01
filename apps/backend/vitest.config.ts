import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: false,
		include: ["src/**/*.test.ts"],
		coverage: {
			provider: "v8",
			include: ["src/domain/**/*.ts"],
			exclude: ["src/domain/**/*.test.ts", "src/domain/**/index.ts"],
			thresholds: {
				statements: 70,
				branches: 60,
				functions: 70,
				lines: 70,
			},
		},
	},
});
