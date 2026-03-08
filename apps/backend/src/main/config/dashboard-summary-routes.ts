import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/require-role.js";
import {
	getAdminDashboardController,
	getDashboardController,
} from "./dashboard-context.js";

const router = Router();

router.get("/customer", authMiddleware, adaptRoute(getDashboardController));
router.get(
	"/admin",
	authMiddleware,
	requireRole("admin"),
	adaptRoute(getAdminDashboardController),
);

export default router;
