import type { CookieOptions, Response } from "express";
import { getAuthCookieName, isProductionEnvironment } from "../config/env.js";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const buildCookieOptions = (): CookieOptions => ({
	httpOnly: true,
	sameSite: "lax",
	secure: isProductionEnvironment(),
	path: "/",
	maxAge: ONE_DAY_IN_MS,
});

export const setAuthCookie = (response: Response, token: string) => {
	response.cookie(getAuthCookieName(), token, buildCookieOptions());
};

export const clearAuthCookie = (response: Response) => {
	response.clearCookie(getAuthCookieName(), {
		...buildCookieOptions(),
		maxAge: undefined,
	});
};

export const readCookie = (
	cookieHeader: string | undefined,
	cookieName = getAuthCookieName(),
): string | null => {
	if (!cookieHeader) {
		return null;
	}

	const cookies = cookieHeader
		.split(";")
		.map((part) => part.trim())
		.filter(Boolean);

	for (const cookie of cookies) {
		const [rawName, ...rawValueParts] = cookie.split("=");
		if (rawName !== cookieName) {
			continue;
		}

		const rawValue = rawValueParts.join("=");
		if (!rawValue) {
			return null;
		}

		try {
			return decodeURIComponent(rawValue);
		} catch {
			return rawValue;
		}
	}

	return null;
};
