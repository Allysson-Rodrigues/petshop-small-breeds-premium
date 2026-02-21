import type { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

export class CreateAppointmentController implements Controller {
	constructor(
		private readonly createAppointmentUseCase: CreateAppointmentUseCase,
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const userId = (httpRequest.headers as any)?.["x-user-id"];
			const { date, type, petId } = httpRequest.body as any;
			console.log("[CreateApp] Request payload:", {
				date,
				type,
				petId,
				userId,
			});

			if (!userId)
				return { statusCode: 401, body: { message: "Unauthorized" } };
			if (!date || !type || !petId)
				return { statusCode: 400, body: { message: "Missing params" } };

			const appointment = await this.createAppointmentUseCase.execute({
				date: new Date(date),
				type,
				userId: userId as string,
				petId,
			});

			console.log("[CreateApp] Success:", appointment.id);

			return {
				statusCode: 201,
				body: appointment,
			};
		} catch (error: any) {
			return {
				statusCode: 500,
				body: { message: error.message },
			};
		}
	}
}
