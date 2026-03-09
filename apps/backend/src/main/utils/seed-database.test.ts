import { afterEach, describe, expect, it } from "vitest";
import { assertDemoSeedAllowed } from "./seed-database.js";

const originalNodeEnv = process.env.NODE_ENV;
const originalAllowDemoSeed = process.env.ALLOW_DEMO_SEED;

afterEach(() => {
	if (originalNodeEnv === undefined) {
		delete process.env.NODE_ENV;
	} else {
		process.env.NODE_ENV = originalNodeEnv;
	}

	if (originalAllowDemoSeed === undefined) {
		delete process.env.ALLOW_DEMO_SEED;
	} else {
		process.env.ALLOW_DEMO_SEED = originalAllowDemoSeed;
	}
});

describe("assertDemoSeedAllowed", () => {
	it("allows seed in test", () => {
		process.env.NODE_ENV = "test";
		delete process.env.ALLOW_DEMO_SEED;

		expect(() => assertDemoSeedAllowed()).not.toThrow();
	});

	it("allows seed in development only when explicitly enabled", () => {
		process.env.NODE_ENV = "development";
		process.env.ALLOW_DEMO_SEED = "true";

		expect(() => assertDemoSeedAllowed()).not.toThrow();
	});

	it("rejects seed in development without explicit opt-in", () => {
		process.env.NODE_ENV = "development";
		delete process.env.ALLOW_DEMO_SEED;

		expect(() => assertDemoSeedAllowed()).toThrow(
			"Demo seed is allowed only in test or in development with ALLOW_DEMO_SEED=true.",
		);
	});

	it("rejects seed in production", () => {
		process.env.NODE_ENV = "production";
		process.env.ALLOW_DEMO_SEED = "true";

		expect(() => assertDemoSeedAllowed()).toThrow(
			"Demo seed is disabled in production environments.",
		);
	});
});
