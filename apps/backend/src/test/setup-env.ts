import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(currentDir, "../../.env.test");

config({ path: envPath, override: true });

process.env.NODE_ENV = "test";
process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.DATABASE_URL ??=
	"postgresql://postgres:postgres@127.0.0.1:5432/petshop?schema=test";
process.env.CORS_ORIGIN ??=
	"http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:4273,http://localhost:4273";
