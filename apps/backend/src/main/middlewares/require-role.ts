import type { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/error-response.js";

/**
 * Middleware factory: checks that the authenticated user has the required role.
 * Must be placed AFTER authMiddleware.
 */
export const requireRole = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.auth) {
			return sendErrorResponse(res, {
				statusCode: 401,
				code: "AUTH_REQUIRED",
				type: "UnauthorizedError",
				message: "Authentication required",
			});
		}

		if (!allowedRoles.includes(req.auth.role)) {
			return sendErrorResponse(res, {
				statusCode: 403,
				code: "AUTH_FORBIDDEN",
				type: "ForbiddenError",
				message: "Forbidden: insufficient permissions",
			});
		}

		return next();
	};
};
