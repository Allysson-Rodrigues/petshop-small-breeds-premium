import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app.js";

describe("Auth Integration Tests", () => {
	const credentials = {
		name: "Test User",
		email: `test-${Date.now()}@example.com`,
		password: "password123",
	};

	it("should register a new user", async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send(credentials);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.email).toBe(credentials.email);
	});

	it("should login with registered user", async () => {
		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email,
			password: credentials.password,
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.user.email).toBe(credentials.email);
	});

	it("should login with mixed-case email", async () => {
		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email.toUpperCase(),
			password: credentials.password,
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.user.email).toBe(credentials.email);
	});

	it("should fail to login with wrong password", async () => {
		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email,
			password: "wrong-password",
		});

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty("message", "Invalid credentials");
	});

	it("should return 409 when email is already registered", async () => {
		const response = await request(app)
			.post("/api/auth/register")
			.send(credentials);

		expect(response.statusCode).toBe(409);
		expect(response.body).toHaveProperty("message", "Email already registered");
	});

	it("should return 422 for invalid registration payload", async () => {
		const response = await request(app).post("/api/auth/register").send({
			name: "A",
			email: "invalid-email",
			password: "123",
		});

		expect(response.statusCode).toBe(422);
		expect(response.body).toHaveProperty("message", "Invalid name");
	});
});
