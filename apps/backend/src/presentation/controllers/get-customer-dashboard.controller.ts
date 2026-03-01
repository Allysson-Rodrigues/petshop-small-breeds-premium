import { UnauthorizedError } from "../../domain/errors/app-error.js";
import type { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class GetCustomerDashboardController implements Controller {
	constructor(
		private readonly getDashboardUseCase: GetCustomerDashboardUseCase,
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { userId } = httpRequest;
		if (!userId) {
			throw new UnauthorizedError("Invalid or missing User ID");
		}

		const dashboardData = await this.getDashboardUseCase.execute(userId);
		return {
			statusCode: 200,
			body: dashboardData,
		};
	}
}
