import rateLimit from "express-rate-limit";

/** Brute-force protection is enforced only in production. */
export const authRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	skip: () => process.env.NODE_ENV !== "production",
	standardHeaders: true,
	legacyHeaders: false,
	message: { status: "error", message: "Too many requests. Try again later." },
});
