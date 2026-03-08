import { z } from "zod";
import { InputValidationError } from "../../domain/errors/app-error.js";
import type { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

const loginSchema = z.object({
	email: z.string().email("Formato de email inválido").trim().toLowerCase(),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").trim(),
});

export class LoginController implements Controller {
	constructor(private readonly loginUseCase: LoginUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		// O Zod faz o parsing seguro, removendo a necessidade de if/else manuais
		const result = loginSchema.safeParse(httpRequest.body ?? {});

		if (!result.success) {
			// Pega as mensagens de erro geradas pelo Zod e junta em uma string
			const errorMessage = result.error.errors.map(e => e.message).join(", ");
			throw new InputValidationError(errorMessage);
		}

		// result.data agora é fortemente tipado como { email: string, password: string }
		const { email, password } = result.data;

		const loginResult = await this.loginUseCase.execute({ email, password });
		
		return {
			statusCode: 200,
			body: loginResult,
		};
	}
}
