import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Request, Response } from "express";
import type { Controller } from "../../presentation/protocols/controller.js";
import type { HttpRequest } from "../../presentation/protocols/http.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const adaptRoute = (controller: Controller) => {
	return async (req: Request, res: Response) => {
		const httpRequest: HttpRequest = {
			body: req.body,
			params: req.params,
			query: req.query,
			headers: req.headers,
		};
		const httpResponse = await controller.handle(httpRequest);

		// Content Negotiation for Pro Max Dashboard
		if (req.accepts("html") && !req.accepts("json")) {
			return res
				.status(httpResponse.statusCode)
				.sendFile(path.join(__dirname, "../../../public/api-response.html"));
		}

		res.status(httpResponse.statusCode).json(httpResponse.body || {});
	};
};
