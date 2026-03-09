import { defineConfig } from "@playwright/test";

const frontendPort = 4273;
const backendPort = 3300;
const frontendUrl = `http://127.0.0.1:${frontendPort}`;
const backendUrl = `http://127.0.0.1:${backendPort}`;
const databaseUrl =
	process.env.E2E_DATABASE_URL ??
	process.env.DATABASE_URL ??
	"postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=e2e";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
	expect: {
		timeout: 10_000,
	},
	use: {
		baseURL: frontendUrl,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
		reducedMotion: "reduce",
	},
	webServer: [
		{
			command: "npm --prefix ../backend run start:test",
			url: `${backendUrl}/api/health`,
			reuseExistingServer: false,
			timeout: 120000,
			env: {
				...process.env,
				PORT: String(backendPort),
				NODE_ENV: "test",
				JWT_SECRET: process.env.JWT_SECRET ?? "test-jwt-secret",
				CORS_ORIGIN: frontendUrl,
				DATABASE_URL: databaseUrl,
			},
		},
		{
			command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${frontendPort}`,
			url: frontendUrl,
			reuseExistingServer: false,
			timeout: 120000,
			env: {
				...process.env,
				API_PROXY_TARGET: backendUrl,
			},
		},
	],
});
