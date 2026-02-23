import type { RegisterUserUseCase } from "../../domain/use-cases/register-user.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class RegisterController implements Controller {
	constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { name, email, password } = httpRequest.body as any;
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
			return {
				statusCode: 201,
				body: user,
			};
		} catch (error: any) {
			return {
				statusCode: 400,
				body: { message: error.message },
			};
		}
	}
}
