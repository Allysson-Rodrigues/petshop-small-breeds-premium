import {
	createResolvedAuthState,
	shouldRefreshSessionOnAuthSync,
} from "./auth-state";

describe("AuthProvider", () => {
	it("aplica estado autenticado quando recebe um usuario sincronizado localmente", () => {
		expect(
			createResolvedAuthState({
				email: "admin@petshop.com",
				id: "user-1",
				name: "Admin Geral",
				role: "admin",
			}),
		).toEqual({
			status: "authenticated",
			user: {
				email: "admin@petshop.com",
				id: "user-1",
				name: "Admin Geral",
				role: "admin",
			},
		});
	});

	it("mantem estado nao autenticado quando nao ha usuario local", () => {
		expect(createResolvedAuthState(null)).toEqual({
			status: "unauthenticated",
			user: null,
		});
	});

	it("so exige refresh para eventos remotos ou sem origem declarada", () => {
		expect(
			shouldRefreshSessionOnAuthSync({
				source: "local",
			}),
		).toBe(false);
		expect(
			shouldRefreshSessionOnAuthSync({
				source: "remote",
			}),
		).toBe(true);
		expect(shouldRefreshSessionOnAuthSync()).toBe(true);
	});
});
