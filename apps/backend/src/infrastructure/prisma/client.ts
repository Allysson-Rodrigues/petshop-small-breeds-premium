import "dotenv/config";
import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./create-client.js";

declare global {
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
	createPrismaClient({
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
