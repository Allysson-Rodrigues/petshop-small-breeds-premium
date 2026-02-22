import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

declare global {
	// biome-ignore lint/style/noNamespace: Node global cache for Prisma singleton
	namespace NodeJS {
		interface Global {
			prisma?: PrismaClient;
		}
	}
}

const globalForPrisma = globalThis as typeof globalThis & {
	prisma?: PrismaClient;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
