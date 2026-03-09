import type { CookieOptions, Response } from "express";
import {
	getAuthCookieDomain,
	getAuthCookieMaxAgeMs,
	getAuthCookieName,
	getAuthCookieSameSite,
	shouldUseSecureAuthCookie,
} from "../config/env.js";

export const buildCookieOptions = (): CookieOptions => {
	const domain = getAuthCookieDomain();

	return {
		httpOnly: true,
		sameSite: getAuthCookieSameSite(),
		secure: shouldUseSecureAuthCookie(),
		path: "/",
		maxAge: getAuthCookieMaxAgeMs(),
		...(domain ? { domain } : {}),
	};
};

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
