import { UnauthorizedError } from "../../domain/errors/app-error.js";
import type { GetCurrentUserUseCase } from "../../domain/use-cases/get-current-user.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class GetCurrentUserController implements Controller {
	constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		if (!httpRequest.userId) {
			throw new UnauthorizedError("Authentication required");
		}

		const user = await this.getCurrentUserUseCase.execute(httpRequest.userId);

		return {
			statusCode: 200,
			body: user,
		};
	}
}
