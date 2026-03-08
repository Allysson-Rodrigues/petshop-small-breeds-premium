import type { NextFunction, Request, Response } from "express";

/**
 * Middleware factory: checks that the authenticated user has the required role.
 * Must be placed AFTER authMiddleware.
 */
export const requireRole = (...allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.auth) {
			return res.status(401).json({ message: "Authentication required" });
		}

		if (!allowedRoles.includes(req.auth.role)) {
			return res
				.status(403)
				.json({ message: "Forbidden: insufficient permissions" });
		}

		return next();
	};
};
