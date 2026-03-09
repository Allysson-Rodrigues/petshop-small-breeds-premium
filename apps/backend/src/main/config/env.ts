import type { CookieOptions } from "express";

const normalizeList = (value: string | undefined): string[] => {
	if (!value) return [];
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
};

const escapeRegex = (value: string): string =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const wildcardToRegex = (pattern: string): RegExp =>
	new RegExp(`^${pattern.split("*").map(escapeRegex).join(".*")}$`);

export const getPort = (): number => {
	const port = process.env.PORT;
	return port ? Number(port) : 3000;
};

export const getJwtSecret = (): string => {
	const secret = process.env.JWT_SECRET;
	if (secret) return secret;

	if (process.env.NODE_ENV === "test") {
		return "test-jwt-secret";
	}

	throw new Error(
		"JWT_SECRET is required. Define JWT_SECRET in the backend environment.",
	);
};

export const getAuthCookieName = (): string => {
	return process.env.AUTH_COOKIE_NAME?.trim() || "petshop_session";
};

export const getAuthCookieDomain = (): string | undefined => {
	const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();
	return domain ? domain : undefined;
};

export const getAuthCookieMaxAgeMs = (): number => {
	const rawValue = process.env.AUTH_COOKIE_MAX_AGE_MS?.trim();
	if (!rawValue) {
		return 24 * 60 * 60 * 1000;
	}

	const parsedValue = Number(rawValue);
	if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
		throw new Error(
			"AUTH_COOKIE_MAX_AGE_MS must be a positive number when configured.",
		);
	}

	return parsedValue;
};

export const getAuthCookieSameSite = (): CookieOptions["sameSite"] => {
	const rawValue = process.env.AUTH_COOKIE_SAME_SITE?.trim().toLowerCase();
	if (!rawValue) {
		return "lax";
	}

	if (rawValue === "lax" || rawValue === "strict" || rawValue === "none") {
		return rawValue;
	}

	throw new Error(
		'AUTH_COOKIE_SAME_SITE must be one of "lax", "strict" or "none".',
	);
};

export const isProductionEnvironment = (): boolean =>
	process.env.NODE_ENV === "production";

export const shouldUseSecureAuthCookie = (): boolean => {
	const sameSite = getAuthCookieSameSite();
	const rawValue = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();

	if (sameSite === "none") {
		return true;
	}

	if (rawValue === "true") {
		return true;
	}

	if (rawValue === "false") {
		return false;
	}

	return isProductionEnvironment();
};

export const isRateLimitEnforced = (): boolean =>
	process.env.NODE_ENV === "production" ||
	process.env.ENABLE_RATE_LIMIT === "true";

export const getAllowedCorsOrigins = (): string[] => {
	const configuredOrigins = normalizeList(process.env.CORS_ORIGIN);
	if (configuredOrigins.length > 0) {
		return configuredOrigins;
	}

	if (process.env.NODE_ENV === "production") {
		throw new Error(
			"CORS_ORIGIN is required in production. Use a comma-separated list of allowed origins.",
		);
	}

	return [
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	];
};

export const isCorsOriginAllowed = (
	origin: string | undefined,
	allowedOrigins: string[],
): boolean => {
	if (!origin) {
		return true;
	}

	return allowedOrigins.some((allowedOrigin) => {
		if (allowedOrigin.includes("*")) {
			return wildcardToRegex(allowedOrigin).test(origin);
		}

		return allowedOrigin === origin;
	});
};
