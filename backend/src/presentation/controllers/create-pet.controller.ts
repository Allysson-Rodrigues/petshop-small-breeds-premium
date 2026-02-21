import type { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class CreatePetController implements Controller {
	constructor(private readonly createPetUseCase: CreatePetUseCase) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const userId = (httpRequest.headers as any)?.["x-user-id"];
			const { name, breed, age } = httpRequest.body as any;
			console.log("[CreatePet] Request payload:", { name, breed, age, userId });

			if (!userId)
				return { statusCode: 401, body: { message: "Unauthorized" } };
			if (!name || !breed || !age)
				return { statusCode: 400, body: { message: "Missing params" } };

			const pet = await this.createPetUseCase.execute({
				name,
				breed,
				age: Number(age),
				userId: userId as string,
			});

			console.log("[CreatePet] Success:", pet.id);

			console.log("[CreatePet] Success:", pet.id);

			return {
				statusCode: 201,
				body: pet,
			};
		} catch (error: any) {
			return {
				statusCode: 500,
				body: { message: error.message },
			};
		}
	}
}
