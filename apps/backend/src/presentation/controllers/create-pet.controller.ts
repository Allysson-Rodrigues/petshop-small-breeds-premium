import { InputValidationError, UnauthorizedError } from "../../domain/errors/app-error.js";
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
		const { userId } = httpRequest;
		const body = (httpRequest.body ?? {}) as CreatePetRequestBody;
		const { name, breed, age } = body;
		const parsedAge = Number(age);

		if (!userId) {
			throw new UnauthorizedError();
		}

		if (!name || !breed || Number.isNaN(parsedAge)) {
			throw new InputValidationError("Name, Breed and a valid Age are required");
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
	}
}
