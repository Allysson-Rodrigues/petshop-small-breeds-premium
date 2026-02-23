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
			const { name, email, password } = body;

			if (!name || !email || !password) {
				return {
					statusCode: 400,
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
			const message =
				error instanceof Error ? error.message : "Unable to register user";

			return {
				statusCode: 400,
				body: { message },
			};
		}
	}
}
