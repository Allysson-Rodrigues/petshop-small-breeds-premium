import {
	DuplicateEmailError,
	InputValidationError,
} from "../../domain/errors/auth-errors.js";
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
		try {
			const body = (httpRequest.body ?? {}) as RegisterRequestBody;
			const name = body.name?.trim() ?? "";
			const email = body.email?.trim() ?? "";
			const password = body.password?.trim() ?? "";

			if (!name || !email || !password) {
				return {
					statusCode: 422,
					body: { message: "Missing parameters" },
				};
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
		} catch (error: unknown) {
			if (error instanceof DuplicateEmailError) {
				return {
					statusCode: 409,
					body: { message: error.message },
				};
			}

			if (error instanceof InputValidationError) {
				return {
					statusCode: 422,
					body: { message: error.message },
				};
			}

			return {
				statusCode: 500,
				body: { message: "Unable to register user" },
			};
		}
	}
}
