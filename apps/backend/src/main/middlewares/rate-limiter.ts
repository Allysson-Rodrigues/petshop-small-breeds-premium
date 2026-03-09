import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { isRateLimitEnforced } from "../config/env.js";
import { sendErrorResponse } from "../utils/error-response.js";

const createRateLimitHandler =
	(code: string, message: string) => (request: Request, response: Response) => {
		console.warn(
			`[RATE_LIMIT][${request.requestId ?? "unknown"}] ${code} on ${request.method} ${request.originalUrl}`,
		);

		return sendErrorResponse(response, {
			statusCode: 429,
			code,
			type: "RateLimitError",
			message,
		});
	};

/** Brute-force protection is enforced only in production. */
export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	skip: () => !isRateLimitEnforced(),
	standardHeaders: true,
	legacyHeaders: false,
	handler: createRateLimitHandler(
		"AUTH_RATE_LIMITED",
		"Too many authentication attempts. Try again later.",
	),
});

export const publicBookingRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	skip: () => !isRateLimitEnforced(),
	standardHeaders: true,
	legacyHeaders: false,
	handler: createRateLimitHandler(
		"PUBLIC_BOOKING_RATE_LIMITED",
		"Too many booking requests. Try again later.",
	),
});
