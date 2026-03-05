import bcrypt from "bcrypt";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./app.js";
import { prisma } from "./infrastructure/prisma/client.js";

const registerUser = async (suffix: string) => {
	const credentials = {
		name: `User ${suffix}`,
		email: `user-${suffix}@example.com`,
		password: "password123",
	};

	await request(app).post("/api/auth/register").send(credentials).expect(201);
	return credentials;
};

const login = async (email: string, password: string) => {
	const response = await request(app)
		.post("/api/auth/login")
		.send({ email, password })
		.expect(200);

	return response.body.token as string;
};

const createPet = async (token: string, suffix: string) => {
	const response = await request(app)
		.post("/api/dashboard/pets")
		.set("Authorization", `Bearer ${token}`)
		.send({
			name: `Pet ${suffix}`,
			breed: "Shih Tzu",
			age: 2,
		})
		.expect(201);

	return response.body as { id: string };
};

describe("Dashboard authorization", () => {
	it("blocks appointment creation for a pet owned by another user", async () => {
		const ownerA = await registerUser(`owner-a-${Date.now()}`);
		const ownerB = await registerUser(`owner-b-${Date.now()}`);
		const [tokenA, tokenB] = await Promise.all([
			login(ownerA.email, ownerA.password),
			login(ownerB.email, ownerB.password),
		]);
		const petB = await createPet(tokenB, `b-${Date.now()}`);

		const response = await request(app)
			.post("/api/dashboard/appointments")
			.set("Authorization", `Bearer ${tokenA}`)
			.send({
				date: new Date(Date.now() + 86_400_000).toISOString(),
				type: "BATH",
				petId: petB.id,
			});

		expect(response.statusCode).toBe(403);
		expect(response.body.message).toBe("Forbidden: not the pet owner");
	});

	it("allows owners to manage their appointments, blocks other clients, and lets admins see all appointments", async () => {
		const ownerA = await registerUser(`owner-c-${Date.now()}`);
		const ownerB = await registerUser(`owner-d-${Date.now()}`);
		const adminEmail = `admin-${Date.now()}@example.com`;
		const adminPassword = "password123";

		await prisma.user.create({
			data: {
				name: "Admin Test",
				email: adminEmail,
				password: await bcrypt.hash(adminPassword, 12),
				role: "admin",
			},
		});

		const [tokenA, tokenB, adminToken] = await Promise.all([
			login(ownerA.email, ownerA.password),
			login(ownerB.email, ownerB.password),
			login(adminEmail, adminPassword),
		]);

		const petB = await createPet(tokenB, `owner-${Date.now()}`);
		const appointmentResponse = await request(app)
			.post("/api/dashboard/appointments")
			.set("Authorization", `Bearer ${tokenB}`)
			.send({
				date: new Date(Date.now() + 172_800_000).toISOString(),
				type: "GROOM",
				petId: petB.id,
			})
			.expect(201);

		const appointmentId = appointmentResponse.body.id as string;

		await request(app)
			.put(`/api/dashboard/appointments/${appointmentId}`)
			.set("Authorization", `Bearer ${tokenA}`)
			.send({ status: "COMPLETED" })
			.expect(403);

		await request(app)
			.delete(`/api/dashboard/appointments/${appointmentId}`)
			.set("Authorization", `Bearer ${tokenA}`)
			.expect(403);

		const ownerUpdateResponse = await request(app)
			.put(`/api/dashboard/appointments/${appointmentId}`)
			.set("Authorization", `Bearer ${tokenB}`)
			.send({ status: "COMPLETED" })
			.expect(200);

		expect(ownerUpdateResponse.body.status).toBe("COMPLETED");

		const adminAppointmentsResponse = await request(app)
			.get("/api/dashboard/appointments")
			.set("Authorization", `Bearer ${adminToken}`)
			.expect(200);

		expect(
			adminAppointmentsResponse.body.some(
				(appointment: { id: string }) => appointment.id === appointmentId,
			),
		).toBe(true);
	});
});
