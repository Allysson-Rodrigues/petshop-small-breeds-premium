import type { Request } from "express";
import { UnauthorizedError } from "../../domain/errors/app-error.js";

export const getAuthContext = (request: Request) => {
	if (!request.auth) {
		throw new UnauthorizedError("Authentication required");
	}

	return request.auth;
};
