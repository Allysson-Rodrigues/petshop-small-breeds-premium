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
		const token = await loginAsClient();

		const response = await request(app)
			.get("/api/dashboard/admin")
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(403);
	});

	it("should block a client from editing another client's pet", async () => {
		const clientToken = await loginAsClient();
		const otherClientPets = await request(app)
			.get("/api/dashboard/pets")
			.set("Authorization", `Bearer ${await loginAsSecondClient()}`);
		const otherPet = otherClientPets.body[0];

		const response = await request(app)
			.put(`/api/dashboard/pets/${otherPet.id}`)
			.set("Authorization", `Bearer ${clientToken}`)
			.send({ name: "Intruso" });

		expect(response.statusCode).toBe(403);
		expect(response.body.message).toBe("Forbidden: not the pet owner");
	});

	it("should allow a client to create an appointment for their own pet", async () => {
		const token = await loginAsClient();
		const petsResponse = await request(app)
			.get("/api/dashboard/pets")
			.set("Authorization", `Bearer ${token}`);
		const ownPet = petsResponse.body[0];

		const response = await request(app)
			.post("/api/dashboard/appointments")
			.set("Authorization", `Bearer ${token}`)
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

	it("should block a client from creating products", async () => {
		const token = await loginAsClient();

		const response = await request(app)
			.post("/api/dashboard/products")
			.set("Authorization", `Bearer ${token}`)
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
		const token = await loginAsAdmin();

		const createResponse = await request(app)
			.post("/api/dashboard/products")
			.set("Authorization", `Bearer ${token}`)
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
			.set("Authorization", `Bearer ${token}`)
			.send({ stock: 12 });

		expect(updateResponse.statusCode).toBe(200);
		expect(updateResponse.body.stock).toBe(12);
	});
});
