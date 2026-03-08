import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	esbuild: {
		jsx: "automatic",
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./src/setupTests.ts",
		css: true,
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
	},
});
