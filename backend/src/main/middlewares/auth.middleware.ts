import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "secret";

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

	jwt.verify(token, secret, (err: any, decoded: any) => {
		if (err) {
			return res.status(401).json({ message: "Token invalid" });
		}

		req.headers["x-user-id"] = decoded.id;
		return next();
	});
};
