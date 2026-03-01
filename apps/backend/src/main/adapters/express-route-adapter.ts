import type { NextFunction, Request, Response } from "express";
import type { Controller } from "../../presentation/protocols/controller.js";
import type { HttpRequest } from "../../presentation/protocols/http.js";

export const adaptRoute = (controller: Controller) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const rawUserId = req.headers["x-user-id"];
			const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

			const httpRequest: HttpRequest = {
				body: req.body,
				params: req.params,
				query: req.query,
				headers: req.headers,
				userId,
			};
			const httpResponse = await controller.handle(httpRequest);
			res.status(httpResponse.statusCode).json(httpResponse.body || {});
		} catch (error) {
			next(error);
		}
	};
};

export const adaptAsyncHandler = (
	fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
