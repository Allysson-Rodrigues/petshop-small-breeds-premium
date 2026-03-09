import request from "supertest";
import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
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

	afterEach(() => {
		vi.unstubAllEnvs();
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
		expect(response.headers["set-cookie"]).toBeTruthy();
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
		expect(response.headers["set-cookie"]).toBeTruthy();
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
		expect(response.body).toMatchObject({
			status: "error",
			code: "INVALID_CREDENTIALS_ERROR",
			message: "Invalid credentials",
		});
		expect(response.body.requestId).toBeTruthy();
		expect(response.headers["x-request-id"]).toBeTruthy();
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
			.set("Cookie", loginResponse.headers["set-cookie"]);

		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject({
			email: "admin@petshop.com",
			role: "admin",
		});
		expect(response.body).not.toHaveProperty("password");
	});

	it("should return 401 on /auth/me without a valid token", async () => {
		const response = await request(app).get("/api/auth/me");

		expect(response.statusCode).toBe(401);
		expect(response.body).toMatchObject({
			status: "error",
			code: "AUTH_REQUIRED",
			message: "Authentication required",
		});
		expect(response.body.requestId).toBeTruthy();
	});

	it("should clear the auth cookie on logout", async () => {
		const loginResponse = await request(app).post("/api/auth/login").send({
			email: "admin@petshop.com",
			password: "admin123",
		});

		const logoutResponse = await request(app)
			.post("/api/auth/logout")
			.set("Cookie", loginResponse.headers["set-cookie"]);

		expect(logoutResponse.statusCode).toBe(200);
		expect(logoutResponse.body).toEqual({ ok: true });
		expect(logoutResponse.headers["set-cookie"]).toBeTruthy();
	});

	it("should create a public booking request", async () => {
		const response = await request(app)
			.post("/api/public/booking-requests")
			.send({
				petName: "Luna",
				petBreed: "Shih Tzu",
				serviceType: "spa",
				preferredDate: "2030-12-20T12:00:00.000Z",
				preferredPeriod: "manha",
				ownerName: "Maria Souza",
				ownerEmail: "maria@example.com",
				ownerPhone: "(11) 99999-9999",
				notes: "Pet idoso e sensível a barulhos.",
			});

		expect(response.statusCode).toBe(201);
		expect(response.body.protocol).toHaveLength(8);
		expect(response.body.status).toBe("PENDING");
	});

	it("should rate limit repeated public booking requests when enabled", async () => {
		vi.stubEnv("ENABLE_RATE_LIMIT", "true");

		const payload = {
			petName: "Luna",
			petBreed: "Shih Tzu",
			serviceType: "spa",
			preferredDate: "2030-12-20T12:00:00.000Z",
			preferredPeriod: "manha",
			ownerName: "Maria Souza",
			ownerEmail: "maria@example.com",
		};

		for (let attempt = 0; attempt < 5; attempt += 1) {
			const response = await request(app)
				.post("/api/public/booking-requests")
				.send(payload);

			expect(response.statusCode).toBe(201);
		}

		const limitedResponse = await request(app)
			.post("/api/public/booking-requests")
			.send(payload);

		expect(limitedResponse.statusCode).toBe(429);
		expect(limitedResponse.body).toMatchObject({
			status: "error",
			code: "PUBLIC_BOOKING_RATE_LIMITED",
			message: "Too many booking requests. Try again later.",
		});
		expect(limitedResponse.body.requestId).toBeTruthy();
	});

	it("should allow admins to list public booking requests", async () => {
		await request(app).post("/api/public/booking-requests").send({
			petName: "Luna",
			petBreed: "Shih Tzu",
			serviceType: "spa",
			preferredDate: "2030-12-20T12:00:00.000Z",
			preferredPeriod: "manha",
			ownerName: "Maria Souza",
			ownerEmail: "maria@example.com",
		});

		const loginResponse = await request(app).post("/api/auth/login").send({
			email: "admin@petshop.com",
			password: "admin123",
		});

		const response = await request(app)
			.get("/api/dashboard/booking-requests")
			.set("Cookie", loginResponse.headers["set-cookie"]);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					ownerEmail: "maria@example.com",
					petName: "Luna",
					status: "PENDING",
				}),
			]),
		);
		expect(response.body[0]).toEqual(
			expect.objectContaining({
				ownerEmail: "maria@example.com",
				petName: "Luna",
				status: "PENDING",
			}),
		);
	});

	it("should allow admins to update a public booking request status", async () => {
		const createResponse = await request(app)
			.post("/api/public/booking-requests")
			.send({
				petName: "Luna",
				petBreed: "Shih Tzu",
				serviceType: "spa",
				preferredDate: "2030-12-20T12:00:00.000Z",
				preferredPeriod: "manha",
				ownerName: "Maria Souza",
				ownerEmail: "maria@example.com",
			});

		const loginResponse = await request(app).post("/api/auth/login").send({
			email: "admin@petshop.com",
			password: "admin123",
		});

		const response = await request(app)
			.put(`/api/dashboard/booking-requests/${createResponse.body.id}`)
			.set("Cookie", loginResponse.headers["set-cookie"])
			.send({
				status: "CONTACTED",
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toMatchObject({
			id: createResponse.body.id,
			status: "CONTACTED",
		});
	});
});
