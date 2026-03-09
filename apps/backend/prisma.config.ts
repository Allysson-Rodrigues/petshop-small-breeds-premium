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
		// `prisma generate` in CI quality/install steps does not need a live database.
		url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
	},
});
