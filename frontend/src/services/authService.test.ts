import { beforeEach, describe, expect, it, vi } from "vitest";
import { authService } from "./authService";

describe("authService", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it("should login successfully with admin credentials", async () => {
        const result = await authService.login("admin@petshop.com", "admin123");
        expect(result).toBe(true);
        expect(localStorage.getItem("auth_token")).toBe("simulated_jwt_token_admin_456");
        expect(authService.getUser()?.role).toBe("admin");
    });

    it("should fail login with wrong credentials", async () => {
        const result = await authService.login("wrong@email.com", "wrongpass");
        expect(result).toBe(false);
        expect(localStorage.getItem("auth_token")).toBeNull();
    });

    it("should register a new user correctly", async () => {
        const registered = await authService.register("Test User", "test@test.com", "pass123");
        expect(registered).toBe(true);

        const loginResult = await authService.login("test@test.com", "pass123");
        expect(loginResult).toBe(true);
        expect(authService.getUser()?.name).toBe("Test User");
        expect(authService.getUser()?.role).toBe("client");
    });

    it("should fail to register an existing user", async () => {
        await authService.register("User 1", "dup@test.com", "pass123");
        const registeredAgain = await authService.register("User 2", "dup@test.com", "pass456");
        expect(registeredAgain).toBe(false);
    });

    it("should handle logout correctly", async () => {
        await authService.login("admin@petshop.com", "admin123");
        expect(authService.isAuthenticated()).toBe(true);

        authService.logout();
        expect(authService.isAuthenticated()).toBe(false);
        expect(authService.getUser()).toBeNull();
    });

    it("should return false for invalid login inputs", async () => {
        const result = await authService.login("", "");
        expect(result).toBe(false);
    });
});
