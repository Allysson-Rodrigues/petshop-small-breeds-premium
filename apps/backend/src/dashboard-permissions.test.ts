import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./infrastructure/prisma/client.js";
import { resetAndSeedDatabase } from "./test/database.js";
import {
	loginAsAdmin,
	loginAsClient,
	loginAsSecondClient,
} from "./test/http-helpers.js";

describe("Dashboard permissions", () => {
	beforeEach(async () => {
		await resetAndSeedDatabase();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	it("should block a client from accessing the admin dashboard", async () => {
		const cookies = await loginAsClient();

		const response = await request(app)
			.get("/api/dashboard/admin")
			.set("Cookie", cookies);

		expect(response.statusCode).toBe(403);
	});

	it("should block a client from editing another client's pet", async () => {
		const clientCookies = await loginAsClient();
		const otherClientPets = await request(app)
			.get("/api/dashboard/pets")
			.set("Cookie", await loginAsSecondClient());
		const otherPet = otherClientPets.body[0];

		const response = await request(app)
			.put(`/api/dashboard/pets/${otherPet.id}`)
			.set("Cookie", clientCookies)
			.send({ name: "Intruso" });

		expect(response.statusCode).toBe(403);
		expect(response.body.message).toBe("Forbidden: not the pet owner");
	});

	it("should allow a client to create an appointment for their own pet", async () => {
		const cookies = await loginAsClient();
		const petsResponse = await request(app)
			.get("/api/dashboard/pets")
			.set("Cookie", cookies);
		const ownPet = petsResponse.body[0];

		const response = await request(app)
			.post("/api/dashboard/appointments")
			.set("Cookie", cookies)
			.send({
				petId: ownPet.id,
				type: "CHECKUP",
				date: "2030-12-20T10:00:00.000Z",
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toMatchObject({
			petId: ownPet.id,
			type: "CHECKUP",
			status: "PENDING",
		});
	});

	it("should reject invalid pet payloads with 422", async () => {
		const cookies = await loginAsClient();
		const invalidPayloads = [
			{ name: "Rex", breed: "Poodle", age: -1 },
			{ name: "Rex", breed: "Poodle", age: 31 },
			{ name: "   ", breed: "Poodle", age: 4 },
			{ name: "Rex", breed: "   ", age: 4 },
			{ name: "Rex", breed: "Poodle", age: 4, color: "black" },
		];

		for (const payload of invalidPayloads) {
			const response = await request(app)
				.post("/api/dashboard/pets")
				.set("Cookie", cookies)
				.send(payload);

			expect(response.statusCode).toBe(422);
			expect(response.body.message).toBe("Validation error");
			expect(response.body.errors).toBeTruthy();
		}
	});

	it("should block a client from creating products", async () => {
		const cookies = await loginAsClient();

		const response = await request(app)
			.post("/api/dashboard/products")
			.set("Cookie", cookies)
			.send({
				name: "Produto inválido",
				description: "Não deveria ser criado por cliente",
				price: 49.9,
				category: "FOOD",
				stock: 4,
			});

		expect(response.statusCode).toBe(403);
	});

	it("should allow an admin to create and update products", async () => {
		const cookies = await loginAsAdmin();

		const createResponse = await request(app)
			.post("/api/dashboard/products")
			.set("Cookie", cookies)
			.send({
				name: "Produto Premium",
				description: "Criado em teste automatizado",
				price: 149.9,
				category: "ACCESSORY",
				stock: 8,
			});

		expect(createResponse.statusCode).toBe(201);

		const updateResponse = await request(app)
			.put(`/api/dashboard/products/${createResponse.body.id}`)
			.set("Cookie", cookies)
			.send({ stock: 12 });

		expect(updateResponse.statusCode).toBe(200);
		expect(updateResponse.body.stock).toBe(12);
	});

	it("should reject role escalation through the clients endpoint", async () => {
		const cookies = await loginAsAdmin();
		const client = await prisma.user.findUnique({
			where: { email: "cliente@petshop.com" },
		});

		if (!client) {
			throw new Error("Expected seeded client user to exist");
		}

		const response = await request(app)
			.put(`/api/dashboard/clients/${client.id}`)
			.set("Cookie", cookies)
			.send({
				name: "Cliente Promovido",
				role: "admin",
			});

		expect(response.statusCode).toBe(422);
		expect(response.body.message).toBe("Validation error");
		expect(response.body.errors._form).toBeTruthy();

		const updatedClient = await prisma.user.findUnique({
			where: { id: client.id },
		});

		expect(updatedClient?.role).toBe("client");
	});
});
