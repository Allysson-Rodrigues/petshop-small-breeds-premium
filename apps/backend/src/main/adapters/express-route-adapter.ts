import type { Request, Response } from "express";
import type { Controller } from "../../presentation/protocols/controller.js";
import type { HttpRequest } from "../../presentation/protocols/http.js";

export const adaptRoute = (controller: Controller) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
			body: req.body,
			params: req.params,
			query: req.query,
			headers: req.headers,
		};
		const httpResponse = await controller.handle(httpRequest);
		res.status(httpResponse.statusCode).json(httpResponse.body || {});
	};
};
