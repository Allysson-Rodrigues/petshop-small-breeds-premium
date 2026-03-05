import type { NextFunction, Request, Response } from "express";
import type { Controller } from "../../presentation/protocols/controller.js";
import type { HttpRequest } from "../../presentation/protocols/http.js";

export const adaptRoute = (controller: Controller) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const httpRequest: HttpRequest = {
				body: req.body,
				params: req.params,
				query: req.query,
				headers: req.headers,
				userId: req.auth?.userId,
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
