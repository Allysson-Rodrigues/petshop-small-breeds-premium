import type { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class LoginController implements Controller {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const { email, password } = httpRequest.body as any;
			console.log("[LoginController] Attempting login for:", email);

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
		} catch (error: any) {
			return {
				statusCode: 401,
				body: { message: error.message },
			};
		}
	}
}
