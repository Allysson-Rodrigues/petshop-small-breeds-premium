import { Router } from "express";
import { HealthCheckController } from "../../presentation/controllers/health-check.controller.js";
import { adaptRoute } from "../adapters/express-route-adapter.js";

const router = Router();
const healthCheckController = new HealthCheckController();

router.get("/health", adaptRoute(healthCheckController));

export default router;
