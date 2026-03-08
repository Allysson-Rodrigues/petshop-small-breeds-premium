import { authService } from "./authService";

const createToken = (expiresInSeconds: number) => {
	const payload = btoa(
		JSON.stringify({
			exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
		}),
	)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "");

	return `header.${payload}.signature`;
};

describe("authService", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.restoreAllMocks();
	});

	it("hydrates the current user from /auth/me on bootstrap", async () => {
		localStorage.setItem("auth_token", createToken(3600));
		localStorage.setItem(
			"auth_user",
			JSON.stringify({
				id: "admin-id",
				name: "Admin Geral",
				email: "admin@petshop.com",
				role: "admin",
			}),
		);

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
	});

	it("clears expired tokens immediately", () => {
		localStorage.setItem("auth_token", createToken(-120));
		localStorage.setItem(
			"auth_user",
			JSON.stringify({
				id: "client-id",
				name: "Cliente Demo",
				email: "cliente@petshop.com",
				role: "client",
			}),
		);

		const session = authService.getSession();

		expect(session).toBeNull();
		expect(localStorage.getItem("auth_token")).toBeNull();
		expect(authService.consumeNotice()).toBe(
			"Sua sessão expirou. Faça login novamente.",
		);
	});

	it("drops the local session when /auth/me returns 401", async () => {
		localStorage.setItem("auth_token", createToken(3600));
		localStorage.setItem(
			"auth_user",
			JSON.stringify({
				id: "client-id",
				name: "Cliente Demo",
				email: "cliente@petshop.com",
				role: "client",
			}),
		);

		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						message: "Token invalid",
					}),
					{ status: 401 },
				),
			),
		);

		const session = await authService.bootstrapSession();

		expect(session).toBeNull();
		expect(localStorage.getItem("auth_token")).toBeNull();
		expect(authService.consumeNotice()).toBe(
			"Sua sessão expirou. Faça login novamente.",
		);
	});
});
