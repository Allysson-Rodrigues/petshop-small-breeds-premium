import { prisma } from "../infrastructure/prisma/client.js";
import { seedDatabase } from "../main/utils/seed-database.js";

export const clearDatabase = async () => {
	await prisma.appointment.deleteMany();
	await prisma.pet.deleteMany();
	await prisma.product.deleteMany();
	await prisma.breed.deleteMany();
	await prisma.user.deleteMany();
};

export const resetAndSeedDatabase = async () => {
	await clearDatabase();
	await seedDatabase(prisma);
};
