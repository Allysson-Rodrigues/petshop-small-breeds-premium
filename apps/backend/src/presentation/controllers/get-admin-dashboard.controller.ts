import type { GetAdminDashboardUseCase } from "../../domain/use-cases/get-admin-dashboard.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class GetAdminDashboardController implements Controller {
	constructor(
		private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase,
	) {}

	async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
		const data = await this.getAdminDashboardUseCase.execute();
		return {
			statusCode: 200,
			body: data,
		};
	}
}
