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
			if (error instanceof Error) {
				if (
					error.name === "DuplicateEmailError" ||
					error.message.includes("already registered")
				) {
					return {
						statusCode: 409,
						body: { message: "Email already registered" },
					};
				}

				if (error.name === "InputValidationError") {
					return {
						statusCode: 422,
						body: { message: error.message },
					};
				}
			}

			// Prisma unique constraint violation
			if (
				typeof error === "object" &&
				error !== null &&
				"code" in error &&
				(error as { code: string }).code === "P2002"
			) {
				return {
					statusCode: 409,
					body: { message: "Email already registered" },
				};
			}

			return {
				statusCode: 500,
				body: { message: "Unable to register user" },
			};
		}
	}
}
