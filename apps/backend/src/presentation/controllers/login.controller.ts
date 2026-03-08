import { z } from "zod";
import { InputValidationError } from "../../domain/errors/app-error.js";
import type { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

const loginSchema = z.object({
	email: z.string().email("Formato de email inválido").trim().toLowerCase(),
	password: z
		.string()
		.min(6, "A senha deve ter pelo menos 6 caracteres")
		.trim(),
});

export class LoginController implements Controller {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const result = loginSchema.safeParse(httpRequest.body ?? {});

		if (!result.success) {
			const errorMessage = result.error.issues
				.map((issue) => issue.message)
				.join(", ");
			throw new InputValidationError(errorMessage);
		}

		const { email, password } = result.data;
		const loginResult = await this.loginUseCase.execute({ email, password });

		return {
			statusCode: 200,
			body: loginResult,
		};
	}
}
