import { Router } from "express";
import { adaptRoute } from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/require-role.js";
import {
	getAdminDashboardController,
	getCustomerDashboardController,
} from "../dependencies.js";

const router = Router();

router.get(
	"/customer",
	authMiddleware,
	adaptRoute(getCustomerDashboardController),
);
router.get(
	"/admin",
	authMiddleware,
	requireRole("admin"),
	adaptRoute(getAdminDashboardController),
);

export default router;
