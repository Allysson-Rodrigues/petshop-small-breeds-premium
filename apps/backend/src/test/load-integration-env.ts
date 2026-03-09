import { config } from "dotenv";

process.env.NODE_ENV = "test";

config({ path: ".env.test.local", override: false });
config({ path: ".env.test", override: false });

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

if (!databaseUrl || !/^postgres(ql)?:\/\//.test(databaseUrl)) {
	throw new Error(
		"Integration tests require a dedicated PostgreSQL DATABASE_URL or TEST_DATABASE_URL. Configure .env.test(.local) or pass the variable explicitly before running npm run test:integration.",
	);
}

process.env.DATABASE_URL = databaseUrl;
process.env.JWT_SECRET ??= "test-jwt-secret";
process.env.CORS_ORIGIN ??=
	"http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:4273,http://localhost:4273";
