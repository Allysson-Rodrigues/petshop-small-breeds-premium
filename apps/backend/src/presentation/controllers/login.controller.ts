import { InputValidationError } from "../../domain/errors/app-error.js";
import type { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface LoginRequestBody {
	email?: string;
	password?: string;
}

export class LoginController implements Controller {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const body = (httpRequest.body ?? {}) as LoginRequestBody;
		const email = body.email?.trim().toLowerCase() ?? "";
		const password = body.password?.trim() ?? "";

		if (!email || !password) {
			throw new InputValidationError("Email and Password are required");
		}

		const result = await this.loginUseCase.execute({ email, password });
		return {
			statusCode: 200,
			body: result,
		};
	}
}
