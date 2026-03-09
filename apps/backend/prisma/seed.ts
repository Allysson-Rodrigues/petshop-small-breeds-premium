import { PrismaClient } from "@prisma/client";
import { pathToFileURL } from "node:url";
import {
	assertDemoSeedAllowed,
	seedDatabase,
} from "../src/main/utils/seed-database.js";

const prisma = new PrismaClient();

async function main() {
	assertDemoSeedAllowed();
	await seedDatabase(prisma);
}

const entrypointUrl = process.argv[1]
  ? pathToFileURL(process.argv[1]).href
  : null;

if (entrypointUrl === import.meta.url) {
	main()
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}
