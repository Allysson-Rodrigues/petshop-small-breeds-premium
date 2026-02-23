const normalizeList = (value: string | undefined): string[] => {
	if (!value) return [];
	return value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
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
