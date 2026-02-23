import type { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface CreatePetRequestBody {
	name?: string;
	breed?: string;
	age?: number | string;
}

export class CreatePetController implements Controller {
	constructor(private readonly createPetUseCase: CreatePetUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const rawUserId = httpRequest.headers?.["x-user-id"];
			const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
			const body = (httpRequest.body ?? {}) as CreatePetRequestBody;
			const { name, breed, age } = body;
			const parsedAge = Number(age);

			if (!userId) {
				return { statusCode: 401, body: { message: "Unauthorized" } };
			}

			if (!name || !breed || Number.isNaN(parsedAge)) {
				return { statusCode: 400, body: { message: "Missing params" } };
			}

			const pet = await this.createPetUseCase.execute({
				name,
				breed,
				age: parsedAge,
				userId,
			});

			return {
				statusCode: 201,
				body: pet,
			};
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Unable to create pet";

			return {
				statusCode: 500,
				body: { message },
			};
		}
	}
}
