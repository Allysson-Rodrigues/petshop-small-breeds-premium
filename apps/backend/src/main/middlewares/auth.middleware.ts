import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { getJwtSecret } from "../config/env.js";
import { readCookie } from "../utils/session-cookie.js";

const secret = getJwtSecret();
const userRepository = new PrismaUserRepository();

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	void (async () => {
		const cookieToken = readCookie(req.headers.cookie);
		const authHeader = req.headers.authorization;
		let token = cookieToken;

		if (!token && authHeader) {
			const parts = authHeader.split(" ");

			if (parts.length !== 2) {
				return res.status(401).json({ message: "Token error" });
			}

			const [scheme, bearerToken] = parts;

			if (!scheme || !/^Bearer$/i.test(scheme)) {
				return res.status(401).json({ message: "Token malformatted" });
			}

			token = bearerToken ?? null;
		}

		if (!token) {
			return res.status(401).json({ message: "Authentication required" });
		}

		try {
			const decoded = jwt.verify(token, secret);
			if (
				typeof decoded !== "object" ||
				decoded === null ||
				!("id" in decoded)
			) {
				return res.status(401).json({ message: "Token invalid" });
			}

			const userId = decoded.id;
			if (typeof userId !== "string") {
				return res.status(401).json({ message: "Token invalid" });
			}

			const user = await userRepository.findById(userId);

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			req.auth = {
				userId,
				role: user.role,
				email: user.email,
				name: user.name,
			};
			return next();
		} catch {
			return res.status(401).json({ message: "Token invalid" });
		}
	})().catch(next);
};
