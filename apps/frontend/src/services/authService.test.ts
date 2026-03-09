import { authService } from "./authService";

describe("authService", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.restoreAllMocks();
	});

	it("hydrates the current user from /auth/me on bootstrap", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						id: "admin-id",
						name: "Admin Geral",
						email: "admin@petshop.com",
						role: "admin",
					}),
					{ status: 200 },
				),
			),
		);

		const session = await authService.bootstrapSession();

		expect(session).not.toBeNull();
		expect(session?.user.email).toBe("admin@petshop.com");
		expect(authService.getUser()?.email).toBe("admin@petshop.com");
	});

	it("returns null on bootstrap when the server has no valid session", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						message: "Authentication required",
					}),
					{ status: 401 },
				),
			),
		);

		const session = await authService.bootstrapSession();

		expect(session).toBeNull();
		expect(authService.getUser()).toBeNull();
		expect(localStorage.getItem("auth_token")).toBeNull();
		expect(localStorage.getItem("auth_user")).toBeNull();
	});

	it("logs in without persisting auth data in web storage", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						user: {
							id: "client-id",
							name: "Cliente Demo",
							email: "cliente@petshop.com",
							role: "client",
						},
					}),
					{ status: 200 },
				),
			),
		);

		const result = await authService.login("cliente@petshop.com", "cliente123");

		expect(result.ok).toBe(true);
		expect(authService.getUser()?.email).toBe("cliente@petshop.com");
		expect(localStorage.getItem("auth_token")).toBeNull();
		expect(localStorage.getItem("auth_user")).toBeNull();
	});

	it("clears the in-memory session on logout", async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						user: {
							id: "client-id",
							name: "Cliente Demo",
							email: "cliente@petshop.com",
							role: "client",
						},
					}),
					{ status: 200 },
				),
			)
			.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

		vi.stubGlobal("fetch", fetchMock);

		await authService.login("cliente@petshop.com", "cliente123");
		await authService.logout();

		expect(authService.getUser()).toBeNull();
		expect(fetchMock).toHaveBeenLastCalledWith(
			"/api/auth/logout",
			expect.objectContaining({
				credentials: "include",
				method: "POST",
			}),
		);
	});
});
