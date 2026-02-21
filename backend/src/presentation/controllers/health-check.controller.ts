import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class HealthCheckController implements Controller {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		return {
			statusCode: 200,
			body: {
				status: "UP",
				uptime: process.uptime(),
				timestamp: new Date().toISOString(),
			},
		};
	}
}
