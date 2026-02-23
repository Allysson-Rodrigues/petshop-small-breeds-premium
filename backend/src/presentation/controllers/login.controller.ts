import type { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface LoginRequestBody {
	email: string;
	password: string;
}

export class LoginController implements Controller {
	constructor(private readonly loginUseCase: LoginUseCase) { }

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { email, password } = httpRequest.body as LoginRequestBody;

			if (!email || !password) {
				return {
					statusCode: 400,
					body: { message: "Missing parameters" },
				};
			}

			const result = await this.loginUseCase.execute({ email, password });
			return {
				statusCode: 200,
				body: result,
			};
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Authentication failed";
			return {
				statusCode: 401,
				body: { message },
			};
		}
	}
}
