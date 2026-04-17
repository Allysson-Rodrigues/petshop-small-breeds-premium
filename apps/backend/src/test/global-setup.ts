import { execFileSync } from "node:child_process";
import net from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ensurePostgresReachable = async (databaseUrl: string) => {
	const url = new URL(databaseUrl);
	const host = url.hostname;
	const port = Number(url.port || "5432");

	await new Promise<void>((resolvePromise, rejectPromise) => {
		const socket = net.createConnection({ host, port });
		const timeout = setTimeout(() => {
			socket.destroy();
			rejectPromise(
				new Error(
					`Cannot reach PostgreSQL at ${host}:${port}. Start the local database with \`npm run db:up\` before running backend tests.`,
				),
			);
		}, 5_000);

		socket.once("connect", () => {
			clearTimeout(timeout);
			socket.end();
			resolvePromise();
		});

		socket.once("error", (error) => {
			clearTimeout(timeout);
			rejectPromise(
				new Error(
					`Cannot reach PostgreSQL at ${host}:${port}. Start the local database with \`npm run db:up\` before running backend tests. Original error: ${error.message}`,
				),
			);
		});
	});
};

const extractCommandOutput = (error: unknown) => {
	if (!(error instanceof Error)) {
		return "";
	}

	const candidate = error as Error & {
		stdout?: Buffer | string;
		stderr?: Buffer | string;
	};
	const stdout = candidate.stdout?.toString().trim();
	const stderr = candidate.stderr?.toString().trim();
	return [stdout, stderr].filter(Boolean).join("\n");
};

export default async function globalSetup() {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const backendDir = resolve(currentDir, "../..");

	await import("./load-integration-env.js");

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) {
		throw new Error(
			"Missing DATABASE_URL after loading test environment. Check apps/backend/.env.test.",
		);
	}

	await ensurePostgresReachable(databaseUrl);

	try {
		execFileSync(
			"npx",
			["prisma", "db", "push", "--schema=./prisma/schema.prisma"],
			{
				cwd: backendDir,
				env: process.env,
				stdio: "pipe",
			},
		);
	} catch (error) {
		const details = extractCommandOutput(error);
		throw new Error(
			details
				? `Prisma test setup failed while syncing the schema.\n${details}`
				: "Prisma test setup failed while syncing the schema. Confirm DATABASE_URL and local PostgreSQL availability.",
		);
	}
}
