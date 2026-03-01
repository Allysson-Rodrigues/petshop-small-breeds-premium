import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, {
	type Application,
	type NextFunction,
	type Request,
	type Response,
} from "express";
import authRoutes from "./main/config/auth-routes.js";
import dashboardRoutes from "./main/config/dashboard-routes.js";
import { getAllowedCorsOrigins } from "./main/config/env.js";
import healthRoutes from "./main/config/health-routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();
const allowedCorsOrigins = getAllowedCorsOrigins();

app.use(
	cors({
		origin: allowedCorsOrigins,
		credentials: true,
	}),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

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
	console.error(`[ERROR] ${err.message}`);
	res.status(500).json({ message: "Internal server error" });
});

export default app;
