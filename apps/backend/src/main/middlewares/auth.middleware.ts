import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors/app-error.js";
import { getJwtSecret } from "../config/env.js";

const secret = getJwtSecret();

export const authMiddleware = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return next(new UnauthorizedError("No token provided"));
	}

	const parts = authHeader.split(" ");

	if (parts.length !== 2) {
		return next(new UnauthorizedError("Token error"));
	}

	const [scheme, token] = parts;

	if (!scheme || !/^Bearer$/i.test(scheme)) {
		return next(new UnauthorizedError("Token malformatted"));
	}

	if (!token) {
		return next(new UnauthorizedError("Token error"));
	}

	try {
		const decoded = jwt.verify(token, secret);
		if (typeof decoded !== "object" || decoded === null || !("id" in decoded)) {
			return next(new UnauthorizedError("Token invalid"));
		}

		const userId = decoded.id;
		if (typeof userId !== "string") {
			return next(new UnauthorizedError("Token invalid"));
		}

		req.auth = { userId };
		return next();
	} catch {
		return next(new UnauthorizedError("Token invalid"));
	}
};
