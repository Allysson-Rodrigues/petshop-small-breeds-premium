import { Router } from "express";
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRateLimiter } from "../middlewares/rate-limiter.js";
import { clearAuthCookie, setAuthCookie } from "../utils/session-cookie.js";
import {
	getCurrentUserController,
	loginController,
	registerController,
} from "./dependencies.js";

const router = Router();

router.post("/register", authRateLimiter, adaptRoute(registerController));
router.post(
	"/login",
	authRateLimiter,
	adaptAsyncHandler(async (req, res) => {
		const httpResponse = await loginController.handle({
			body: req.body,
			params: req.params,
			query: req.query,
			headers: req.headers,
			userId: req.auth?.userId,
		});
		const body = httpResponse.body as {
			token: string;
			user: Record<string, unknown>;
		};

		setAuthCookie(res, body.token);
		res.status(httpResponse.statusCode).json({
			user: body.user,
		});
	}),
);
router.post(
	"/logout",
	adaptAsyncHandler(async (_req, res) => {
		clearAuthCookie(res);
		res.status(200).json({ ok: true });
	}),
);
router.get("/me", authMiddleware, adaptRoute(getCurrentUserController));

export default router;
