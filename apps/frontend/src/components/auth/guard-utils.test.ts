import {
	resolveGuestRouteDecision,
	resolveProtectedRouteDecision,
} from "./guard-utils";

describe("guard-utils", () => {
	it("returns loader while a protected route is bootstrapping", () => {
		expect(
			resolveProtectedRouteDecision({
				isAuthenticated: false,
				isBootstrapping: true,
				currentPath: "/dashboard",
			}),
		).toEqual({ kind: "loader" });
	});

	it("redirects guests away from protected routes", () => {
		expect(
			resolveProtectedRouteDecision({
				isAuthenticated: false,
				isBootstrapping: false,
				currentPath: "/dashboard?tab=overview",
			}),
		).toEqual({
			kind: "redirect",
			to: "/login",
			from: "/dashboard?tab=overview",
		});
	});

	it("allows authenticated users into protected routes", () => {
		expect(
			resolveProtectedRouteDecision({
				isAuthenticated: true,
				isBootstrapping: false,
				currentPath: "/dashboard",
			}),
		).toEqual({ kind: "content" });
	});

	it("redirects authenticated users away from guest routes", () => {
		expect(
			resolveGuestRouteDecision({
				isAuthenticated: true,
				isBootstrapping: false,
			}),
		).toEqual({
			kind: "redirect",
			to: "/dashboard",
		});
	});
});
