import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCookieOptions } from "./main/utils/session-cookie.js";

describe("session cookie config", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("uses sane defaults when optional env vars are not configured", () => {
		const cookieOptions = buildCookieOptions();

		expect(cookieOptions).toMatchObject({
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			secure: false,
			maxAge: 24 * 60 * 60 * 1000,
		});
		expect(cookieOptions.domain).toBeUndefined();
	});

	it("supports stricter production cookie settings via env vars", () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.stubEnv("AUTH_COOKIE_DOMAIN", ".petshop.example");
		vi.stubEnv("AUTH_COOKIE_SAME_SITE", "none");
		vi.stubEnv("AUTH_COOKIE_MAX_AGE_MS", "3600000");

		const cookieOptions = buildCookieOptions();

		expect(cookieOptions).toMatchObject({
			httpOnly: true,
			path: "/",
			sameSite: "none",
			secure: true,
			maxAge: 3600000,
			domain: ".petshop.example",
		});
	});
});
