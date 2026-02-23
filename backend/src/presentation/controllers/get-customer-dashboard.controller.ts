import type { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class GetCustomerDashboardController implements Controller {
	constructor(
		private readonly getDashboardUseCase: GetCustomerDashboardUseCase,
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const headers = httpRequest.headers as Record<string, string> | undefined;
			const userId = headers?.["x-user-id"];
			if (!userId || typeof userId !== "string") {
				return {
					statusCode: 401,
					body: { message: "Unauthorized: Invalid or missing User ID" },
				};
			}

			const dashboardData = await this.getDashboardUseCase.execute(userId);
			return {
				statusCode: 200,
				body: dashboardData,
			};
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Failed to load dashboard";
			return {
				statusCode: 500,
				body: { message },
			};
		}
	}
}
