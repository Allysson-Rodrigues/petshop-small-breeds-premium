import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: false,
		include: ["src/app.test.ts", "src/auth.test.ts", "src/dashboard-authz.test.ts"],
		setupFiles: ["./src/test/load-integration-env.ts"],
	},
});
