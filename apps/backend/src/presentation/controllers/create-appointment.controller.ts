import type { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import type { Controller } from "../protocols/controller.js";
import type { HttpRequest, HttpResponse } from "../protocols/http.js";

interface CreateAppointmentRequestBody {
	date?: string;
	type?: string;
	petId?: string;
}

export class CreateAppointmentController implements Controller {
	constructor(
		private readonly createAppointmentUseCase: CreateAppointmentUseCase,
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const rawUserId = httpRequest.headers?.["x-user-id"];
			const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;
			const body = (httpRequest.body ?? {}) as CreateAppointmentRequestBody;
			const { date, type, petId } = body;

			if (!userId) {
				return { statusCode: 401, body: { message: "Unauthorized" } };
			}

			if (!date || !type || !petId) {
				return { statusCode: 400, body: { message: "Missing params" } };
			}

			const parsedDate = new Date(date);
			if (Number.isNaN(parsedDate.getTime())) {
				return { statusCode: 400, body: { message: "Invalid date" } };
			}

			const appointment = await this.createAppointmentUseCase.execute({
				date: parsedDate,
				type,
				userId,
				petId,
			});

			return {
				statusCode: 201,
				body: appointment,
			};
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Unable to create appointment";

			return {
				statusCode: 500,
				body: { message },
			};
		}
	}
}
