import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl =
	"postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=public";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		// Prisma ORM v7 reads the datasource URL from config instead of schema.prisma.
		// Keep a fallback so `prisma generate` can run during CI install/build steps.
		url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
	},
});
