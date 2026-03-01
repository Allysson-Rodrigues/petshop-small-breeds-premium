import { InputValidationError } from "../../domain/errors/app-error.js";
import type { RegisterUserUseCase } from "../../domain/use-cases/register-user.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface RegisterRequestBody {
	name?: string;
	email?: string;
	password?: string;
}

export class RegisterController implements Controller {
	constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const body = (httpRequest.body ?? {}) as RegisterRequestBody;
		const name = body.name?.trim() ?? "";
		const email = body.email?.trim() ?? "";
		const password = body.password?.trim() ?? "";

		if (!name || !email || !password) {
			throw new InputValidationError("Name, Email and Password are required");
		}

		const user = await this.registerUserUseCase.execute({
			name,
			email,
			password,
		});

		const { password: _password, ...safeUser } = user;

		return {
			statusCode: 201,
			body: safeUser,
		};
	}
}
