import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const assertDemoSeedAllowed = () => {
	if (process.env.NODE_ENV === "test") {
		return;
	}

	if (process.env.NODE_ENV === "production") {
		throw new Error("Demo seed is disabled in production environments.");
	}

	if (
		process.env.NODE_ENV !== "development" ||
		process.env.ALLOW_DEMO_SEED !== "true"
	) {
		throw new Error(
			"Demo seed is allowed only in test or in development with ALLOW_DEMO_SEED=true.",
		);
	}
};

export async function seedDatabase(prisma: PrismaClient) {
	assertDemoSeedAllowed();

	const adminEmail = "admin@petshop.com";
	const adminPassword = "admin123";
	const clientEmail = "cliente@petshop.com";
	const clientPassword = "cliente123";
	const secondClientEmail = "cliente2@petshop.com";
	const secondClientPassword = "cliente456";
	const adminPetId = "8dcf359c-3c88-4af7-b6df-8b4e3c4ac001";
	const clientPetId = "f0ce2da1-3f49-4f01-a3bb-2af7e2c2b002";
	const secondClientPetId = "5e9fcb46-7b92-4fd4-a7c8-0bb6dbe2d004";
	const adminAppointmentId = "7ef6db95-a48d-4a75-a6bd-fb4d07fa1001";
	const clientAppointmentId = "2f9fdcc1-2a6a-4a54-9a6b-0f54f289c003";
	const secondClientAppointmentId = "f0f4fdcc-0b3d-46db-94a2-8e943e5bd005";

	const [
		adminHashedPassword,
		clientHashedPassword,
		secondClientHashedPassword,
	] = await Promise.all([
		bcrypt.hash(adminPassword, 12),
		bcrypt.hash(clientPassword, 12),
		bcrypt.hash(secondClientPassword, 12),
	]);

	await prisma.appointment.deleteMany();
	await prisma.pet.deleteMany();
	await prisma.user.deleteMany({
		where: {
			email: {
				notIn: [adminEmail, clientEmail, secondClientEmail],
			},
		},
	});

	await prisma.user.upsert({
		where: { email: adminEmail },
		update: {
			password: adminHashedPassword,
			role: "admin",
		},
		create: {
			name: "Admin Geral",
			email: adminEmail,
			password: adminHashedPassword,
			role: "admin",
		},
	});

	await prisma.user.upsert({
		where: { email: clientEmail },
		update: {
			password: clientHashedPassword,
			role: "client",
		},
		create: {
			name: "Cliente Demo",
			email: clientEmail,
			password: clientHashedPassword,
			role: "client",
		},
	});

	await prisma.user.upsert({
		where: { email: secondClientEmail },
		update: {
			password: secondClientHashedPassword,
			role: "client",
		},
		create: {
			name: "Cliente Premium",
			email: secondClientEmail,
			password: secondClientHashedPassword,
			role: "client",
		},
	});

	console.log("Demo users created/updated:", [
		adminEmail,
		clientEmail,
		secondClientEmail,
	]);

	const products = [
		{
			name: "Ração Premium Cães",
			description: "Ração de alta qualidade para cães",
			price: 89.9,
			category: "FOOD",
			stock: 50,
		},
		{
			name: "Coleira de Couro",
			description: "Coleira resistente e elegante",
			price: 45.0,
			category: "ACCESSORY",
			stock: 12,
		},
		{
			name: "Brinquedo de Corda",
			description: "Diversão garantida para seu pet",
			price: 25.5,
			category: "ACCESSORY",
			stock: 3,
		},
	];

	for (const product of products) {
		await prisma.product.upsert({
			where: { id: `prod-${product.name.replace(/\s+/g, "-").toLowerCase()}` },
			update: product,
			create: {
				id: `prod-${product.name.replace(/\s+/g, "-").toLowerCase()}`,
				...product,
			},
		});
	}

	const [adminUser, clientUser, secondClientUser] = await Promise.all([
		prisma.user.findUnique({ where: { email: adminEmail } }),
		prisma.user.findUnique({ where: { email: clientEmail } }),
		prisma.user.findUnique({ where: { email: secondClientEmail } }),
	]);

	if (adminUser) {
		const pet = await prisma.pet.upsert({
			where: { id: adminPetId },
			update: {},
			create: {
				id: adminPetId,
				name: "Rex",
				breed: "Shih Tzu",
				age: 3,
				userId: adminUser.id,
			},
		});

		await prisma.appointment.upsert({
			where: { id: adminAppointmentId },
			update: {},
			create: {
				id: adminAppointmentId,
				date: new Date(),
				type: "BATH",
				status: "PENDING",
				userId: adminUser.id,
				petId: pet.id,
			},
		});
	}

	if (clientUser) {
		const pet = await prisma.pet.upsert({
			where: { id: clientPetId },
			update: {},
			create: {
				id: clientPetId,
				name: "Julie",
				breed: "Maltês",
				age: 3,
				userId: clientUser.id,
			},
		});

		await prisma.appointment.upsert({
			where: { id: clientAppointmentId },
			update: {},
			create: {
				id: clientAppointmentId,
				date: new Date(),
				type: "GROOM",
				status: "PENDING",
				userId: clientUser.id,
				petId: pet.id,
			},
		});
	}

	if (secondClientUser) {
		const pet = await prisma.pet.upsert({
			where: { id: secondClientPetId },
			update: {},
			create: {
				id: secondClientPetId,
				name: "Theo",
				breed: "Pug",
				age: 2,
				userId: secondClientUser.id,
			},
		});

		await prisma.appointment.upsert({
			where: { id: secondClientAppointmentId },
			update: {},
			create: {
				id: secondClientAppointmentId,
				date: new Date(),
				type: "CHECKUP",
				status: "PENDING",
				userId: secondClientUser.id,
				petId: pet.id,
			},
		});
	}

	console.log("Demo seed completed successfully.");
}
