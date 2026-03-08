import type { NextFunction, Request, Response } from "express";
import {
	ForbiddenError,
	UnauthorizedError,
} from "../../domain/errors/app-error.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";

const userRepository = new PrismaUserRepository();

/**
 * Middleware factory: checks that the authenticated user has the required role.
 * Must be placed AFTER authMiddleware.
 */
export const requireRole = (...allowedRoles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.auth?.userId;
		if (!userId) {
			return next(new UnauthorizedError("Authentication required"));
		}

		try {
			const user =
				(res.locals.currentUser as { role?: string } | undefined) ??
				(await userRepository.findById(userId));

			if (!user) {
				return next(new UnauthorizedError("User not found"));
			}

			if (!allowedRoles.includes(user.role ?? "")) {
				return next(new ForbiddenError("Forbidden: insufficient permissions"));
			}

			return next();
		} catch (error) {
			return next(error);
		}
	};
};
