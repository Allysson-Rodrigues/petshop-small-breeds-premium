import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "./authService";

describe("authService", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
	});

	it("should login successfully using backend auth endpoint", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						token: "jwt-token-123",
						user: {
							id: "user-1",
							name: "Admin Geral",
							email: "admin@petshop.com",
						},
					}),
					{ status: 200, headers: { "Content-Type": "application/json" } },
				),
			),
		);

		const result = await authService.login("admin@petshop.com", "admin123");

		expect(result.ok).toBe(true);
		expect(localStorage.getItem("auth_token")).toBe("jwt-token-123");
		expect(authService.getUser()?.role).toBe("admin");
	});

	it("should fail login when backend returns unauthorized", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ message: "Invalid credentials" }), {
					status: 401,
					headers: { "Content-Type": "application/json" },
				}),
			),
		);

		const result = await authService.login("wrong@email.com", "wrongpass");

		expect(result.ok).toBe(false);
		expect(localStorage.getItem("auth_token")).toBeNull();
	});

	it("should register a new user via backend endpoint", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response(null, { status: 201 })),
		);

		const registered = await authService.register(
			"Test User",
			"test@test.com",
			"pass123",
		);

		expect(registered.ok).toBe(true);
	});

	it("should fail to register an existing user when backend rejects", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(JSON.stringify({ message: "Email already registered" }), {
					status: 400,
					headers: { "Content-Type": "application/json" },
				}),
			),
		);

		const registeredAgain = await authService.register(
			"User 2",
			"dup@test.com",
			"pass456",
		);

		expect(registeredAgain.ok).toBe(false);
	});

	it("should handle logout correctly", () => {
		authService.saveSession("jwt-token", {
			name: "Client",
			email: "client@test.com",
			role: "client",
		});
		expect(authService.isAuthenticated()).toBe(true);

		authService.logout();
		expect(authService.isAuthenticated()).toBe(false);
		expect(authService.getUser()).toBeNull();
	});

	it("should fail login for invalid inputs", async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal("fetch", fetchMock);
		const result = await authService.login("", "");

		expect(result.ok).toBe(false);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
