import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		fileParallelism: false,
		setupFiles: ["./src/test/setup-env.ts"],
		globalSetup: ["./src/test/global-setup.ts"],
		include: ["./src/**/*.test.ts"],
	},
});
