import { z } from "zod";
import { InputValidationError } from "../../domain/errors/app-error.js";
import type { RegisterUserUseCase } from "../../domain/use-cases/register-user.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

const registerSchema = z.object({
	name: z.string().trim().min(2, "Invalid name"),
	email: z.string().trim().toLowerCase().email("Invalid email"),
	password: z
		.string()
		.trim()
		.min(6, "Password must have at least 6 characters"),
});

export class RegisterController implements Controller {
	constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const result = registerSchema.safeParse(httpRequest.body ?? {});
		if (!result.success) {
			const errorMessage = result.error.issues
				.map((issue) => issue.message)
				.join(", ");
			throw new InputValidationError(errorMessage);
		}

		const { name, email, password } = result.data;
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
