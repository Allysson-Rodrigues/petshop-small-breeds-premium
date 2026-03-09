import { UnauthorizedError } from "../../domain/errors/app-error.js";
import type { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface CreatePetRequestBody {
	name: string;
	breed: string;
	age: number;
}

export class CreatePetController implements Controller {
	constructor(private readonly createPetUseCase: CreatePetUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { userId } = httpRequest;
		const { name, breed, age } =
			httpRequest.body as unknown as CreatePetRequestBody;

		if (!userId) {
			throw new UnauthorizedError();
		}

		const pet = await this.createPetUseCase.execute({
			name,
			breed,
			age,
			userId,
		});

		return {
			statusCode: 201,
			body: pet,
		};
	}
}
