import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { getJwtSecret } from "../config/env.js";
import { sendErrorResponse } from "../utils/error-response.js";
import { readCookie } from "../utils/session-cookie.js";

const secret = getJwtSecret();
const userRepository = new PrismaUserRepository();

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const rejectRequest = (code: string, message: string) => {
		console.warn(`[AUTH][${req.requestId ?? "unknown"}] ${code}: ${message}`);

		return sendErrorResponse(res, {
			statusCode: 401,
			code,
			type: "UnauthorizedError",
			message,
		});
	};

	void (async () => {
		const cookieToken = readCookie(req.headers.cookie);
		const authHeader = req.headers.authorization;
		let token = cookieToken;

		if (!token && authHeader) {
			const parts = authHeader.split(" ");

			if (parts.length !== 2) {
				return rejectRequest("AUTH_TOKEN_ERROR", "Token error");
			}

			const [scheme, bearerToken] = parts;

			if (!scheme || !/^Bearer$/i.test(scheme)) {
				return rejectRequest("AUTH_TOKEN_MALFORMATTED", "Token malformatted");
			}

			token = bearerToken ?? null;
		}

		if (!token) {
			return rejectRequest("AUTH_REQUIRED", "Authentication required");
		}

		try {
			const decoded = jwt.verify(token, secret);
			if (
				typeof decoded !== "object" ||
				decoded === null ||
				!("id" in decoded)
			) {
				return rejectRequest("AUTH_TOKEN_INVALID", "Token invalid");
			}

			const userId = decoded.id;
			if (typeof userId !== "string") {
				return rejectRequest("AUTH_TOKEN_INVALID", "Token invalid");
			}

			const user = await userRepository.findById(userId);

			if (!user) {
				return rejectRequest("AUTH_USER_NOT_FOUND", "User not found");
			}

			req.auth = {
				userId,
				role: user.role,
				email: user.email,
				name: user.name,
			};
			return next();
		} catch {
			return rejectRequest("AUTH_TOKEN_INVALID", "Token invalid");
		}
	})().catch(next);
};
