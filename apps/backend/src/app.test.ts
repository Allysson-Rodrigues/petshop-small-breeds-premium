import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app.js";

describe("Health Check Integration", () => {
	it("should return 200 and status UP on GET /api/health", async () => {
		const response = await request(app).get("/api/health");
		expect(response.status).toBe(200);
		expect(response.body.status).toBe("UP");
		expect(response.body).toHaveProperty("uptime");
		expect(response.body).toHaveProperty("timestamp");
		expect(response.headers["x-request-id"]).toBeTruthy();
	});

	it("should return 200 on root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toContain("PetShop Small Breeds");
		expect(response.headers["x-request-id"]).toBeTruthy();
	});
});
