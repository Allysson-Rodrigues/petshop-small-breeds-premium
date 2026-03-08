import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rate-limiter.js";
import {
	getCurrentUserController,
	loginController,
	registerController,
} from "./dependencies.js";

const router = Router();

if (process.env.NODE_ENV === "production") {
	router.use(authRateLimiter);
}

router.post("/register", adaptRoute(registerController));
router.post("/login", adaptRoute(loginController));
router.get("/me", authMiddleware, adaptRoute(getCurrentUserController));

export default router;
