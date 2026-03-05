import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/env.js";

const secret = getJwtSecret();

export const authMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "No token provided" });
	}

	const parts = authHeader.split(" ");

	if (parts.length !== 2) {
		return res.status(401).json({ message: "Token error" });
	}

	const [scheme, token] = parts;

	if (!scheme || !/^Bearer$/i.test(scheme)) {
		return res.status(401).json({ message: "Token malformatted" });
	}

	if (!token) {
		return res.status(401).json({ message: "Token error" });
	}

	try {
		const decoded = jwt.verify(token, secret);
		if (typeof decoded !== "object" || decoded === null || !("id" in decoded)) {
			return res.status(401).json({ message: "Token invalid" });
		}

		const userId = decoded.id;
		if (typeof userId !== "string") {
			return res.status(401).json({ message: "Token invalid" });
		}

		req.auth = { userId };
		return next();
	} catch {
		return res.status(401).json({ message: "Token invalid" });
	}
};
