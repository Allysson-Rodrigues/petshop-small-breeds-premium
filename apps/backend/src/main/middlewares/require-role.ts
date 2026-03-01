import type { NextFunction, Request, Response } from "express";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";

const userRepository = new PrismaUserRepository();

/**
 * Middleware factory: checks that the authenticated user has the required role.
 * Must be placed AFTER authMiddleware (needs x-user-id header).
 */
export const requireRole = (...allowedRoles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.headers["x-user-id"] as string | undefined;
		if (!userId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		const user = await userRepository.findById(userId);
		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		if (!allowedRoles.includes(user.role)) {
			return res
				.status(403)
				.json({ message: "Forbidden: insufficient permissions" });
		}

		return next();
	};
};
