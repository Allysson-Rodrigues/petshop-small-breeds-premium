import rateLimit from "express-rate-limit";

/** Brute-force protection: max 10 requests per minute per IP on auth endpoints. */
export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { status: "error", message: "Too many requests. Try again later." },
});
