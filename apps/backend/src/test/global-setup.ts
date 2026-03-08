import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

export default async function globalSetup() {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const backendDir = resolve(currentDir, "../..");
	const envPath = resolve(backendDir, ".env.test");

	config({ path: envPath, override: true });

	process.env.NODE_ENV = "test";
	process.env.JWT_SECRET ??= "test-jwt-secret";
	process.env.DATABASE_URL ??=
		"postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=test";

	execSync(
		"npx prisma db push --skip-generate --schema=./prisma/schema.prisma",
		{
			cwd: backendDir,
			env: process.env,
			stdio: "inherit",
		},
	);
}
