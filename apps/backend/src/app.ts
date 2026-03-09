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
import {
	getAllowedCorsOrigins,
	isCorsOriginAllowed,
} from "./main/config/env.js";
import healthRoutes from "./main/config/health-routes.js";
import publicRoutes from "./main/config/public-routes.js";
import { requestIdMiddleware } from "./main/middlewares/request-id.js";
import {
	normalizeErrorCode,
	sendErrorResponse,
} from "./main/utils/error-response.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const allowedCorsOrigins = getAllowedCorsOrigins();

app.use(helmet());
app.use(requestIdMiddleware);

app.use(
	cors({
		origin: (origin, callback) => {
			if (isCorsOriginAllowed(origin, allowedCorsOrigins)) {
				return callback(null, true);
			}

			return callback(new AppError("CORS origin not allowed", 403));
		},
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
app.use("/api/public", publicRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global error handler — prevents stack traces leaking to client
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
	const statusCode = err instanceof AppError ? err.statusCode : 500;
	const message = err.message || "Internal server error";
	const details = err instanceof AppError ? err.details : undefined;
	const code =
		err instanceof AppError
			? normalizeErrorCode(err.name)
			: "INTERNAL_SERVER_ERROR";
	const requestId = req.requestId ?? "unknown";

	if (statusCode === 500) {
		console.error(
			`[CRITICAL][${requestId}][${code}] ${err.stack || err.message}`,
		);
	} else {
		console.warn(
			`[APP_ERROR][${requestId}][${code}] ${err.name}: ${err.message}`,
		);
	}

	return sendErrorResponse(res, {
		statusCode,
		code,
		type: err.name,
		message,
		errors: details,
	});
});

export default app;
