import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL ?? "prisma/dev.db";
// For Prisma 7 adapter, we pass the URL in the config object
const sqlitePath = databaseUrl.replace(/^file:/, "");
const finalPath = sqlitePath === "./dev.db" ? "prisma/dev.db" : sqlitePath;

const adapter = new PrismaBetterSqlite3({
	url: finalPath,
});

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
	new PrismaClient({
		adapter,
		log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
