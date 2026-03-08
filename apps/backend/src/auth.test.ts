import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./infrastructure/prisma/client.js";
import { resetAndSeedDatabase } from "./test/database.js";

describe("Auth Integration Tests", () => {
	beforeEach(async () => {
		await resetAndSeedDatabase();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("should register a new user", async () => {
		const credentials = {
			name: "Test User",
			email: `test-${Date.now()}@example.com`,
			password: "password123",
		};

		const response = await request(app)
			.post("/api/auth/register")
			.send(credentials);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.email).toBe(credentials.email);
	});

	it("should login with registered user", async () => {
		const credentials = {
			name: "Test User",
			email: `test-${Date.now()}@example.com`,
			password: "password123",
		};

		await request(app).post("/api/auth/register").send(credentials);

		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email,
			password: credentials.password,
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.user.email).toBe(credentials.email);
	});

	it("should login with mixed-case email", async () => {
		const credentials = {
			name: "Test User",
			email: `test-${Date.now()}@example.com`,
			password: "password123",
		};

		await request(app).post("/api/auth/register").send(credentials);

		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email.toUpperCase(),
			password: credentials.password,
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body.user.email).toBe(credentials.email);
	});

	it("should fail to login with wrong password", async () => {
		const credentials = {
			email: "cliente@petshop.com",
			password: "cliente123",
		};

		const response = await request(app).post("/api/auth/login").send({
			email: credentials.email,
			password: "wrong-password",
		});

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty("message", "Invalid credentials");
	});

	it("should return 409 when email is already registered", async () => {
		const credentials = {
			name: "Cliente Demo",
			email: "cliente@petshop.com",
			password: "cliente123",
		};

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
		expect(response.body.message).toContain("Invalid name");
		expect(response.body.message).toContain("Invalid email");
		expect(response.body.message).toContain(
			"Password must have at least 6 characters",
		);
	});

	it("should return the current authenticated user on /auth/me", async () => {
		const loginResponse = await request(app).post("/api/auth/login").send({
			email: "admin@petshop.com",
			password: "admin123",
		});

		const response = await request(app)
			.get("/api/auth/me")
			.set("Authorization", `Bearer ${loginResponse.body.token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject({
			email: "admin@petshop.com",
			role: "admin",
		});
		expect(response.body).not.toHaveProperty("password");
	});

	it("should return 401 on /auth/me without a valid token", async () => {
		const response = await request(app)
			.get("/api/auth/me")
			.set("Authorization", "Bearer invalid-token");

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty("message", "Token invalid");
	});
});
