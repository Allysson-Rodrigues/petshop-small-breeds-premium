import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import helmet from "helmet";
import { AppError } from "./domain/errors/app-error.js";
import authRoutes from "./main/config/auth-routes.js";
import dashboardRoutes from "./main/config/dashboard-routes.js";
import { getAllowedCorsOrigins } from "./main/config/env.js";
import healthRoutes from "./main/config/health-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const allowedCorsOrigins = getAllowedCorsOrigins();

// Security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
// CSP disabled to prevent blocking external resources like Google Fonts/Icons during dev.
app.use(
	helmet({
		contentSecurityPolicy: false,
	}),
);

app.use(
	cors({
		origin: allowedCorsOrigins,
		credentials: true,
	}),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "../public"), { maxAge: "1d" }));

// Root endpoint serves the Dashboard
app.get("/", (_req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Modular routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global error handler — prevents stack traces leaking to client
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err.message || "Internal server error";

	if (statusCode === 500) {
		console.error(`[CRITICAL] ${err.stack || err.message}`);
	} else {
		console.warn(`[APP_ERROR] ${err.name}: ${err.message}`);
	}

	res.status(statusCode).json({
		status: "error",
		type: err.name,
		message,
	});
});

export default app;
