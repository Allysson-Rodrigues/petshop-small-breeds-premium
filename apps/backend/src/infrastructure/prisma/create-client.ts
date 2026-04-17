import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const resolveDatabaseUrl = () => {
	const databaseUrl = process.env.DATABASE_URL;

	if (!databaseUrl) {
		throw new Error(
			"Missing DATABASE_URL while initializing Prisma Client. Configure the environment before starting the backend or seeding the database.",
		);
	}

	return databaseUrl;
};

const resolveDatabaseSchema = (databaseUrl: string) => {
	const schema = new URL(databaseUrl).searchParams.get("schema");

	return schema && schema.length > 0 ? schema : "public";
};

export const createPrismaClient = (options?: Prisma.PrismaClientOptions) => {
	const connectionString = resolveDatabaseUrl();
	const adapter = new PrismaPg(
		new Pool({
			connectionString,
		}),
		{
			schema: resolveDatabaseSchema(connectionString),
		},
	);

	return new PrismaClient({
		...options,
		adapter,
	});
};
