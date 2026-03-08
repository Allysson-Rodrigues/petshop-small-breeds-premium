import "dotenv/config";
import { pathToFileURL } from "node:url";
import app from "./app.js";
import { getPort } from "./main/config/env.js";

const PORT = getPort();
const entrypointUrl = process.argv[1]
	? pathToFileURL(process.argv[1]).href
	: null;

if (entrypointUrl === import.meta.url) {
	app.listen(PORT, "0.0.0.0", () => {
		console.log(`Server running on http://0.0.0.0:${PORT}`);
		console.log(`Environment: ${process.env.NODE_ENV ?? "development"}`);
	});
}

// Vercel Serverless exporter
export default app;
