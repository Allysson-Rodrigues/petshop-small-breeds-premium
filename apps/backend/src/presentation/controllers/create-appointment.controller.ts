import { InputValidationError, UnauthorizedError } from "../../domain/errors/app-error.js";
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
		const { userId } = httpRequest;
		const body = (httpRequest.body ?? {}) as CreateAppointmentRequestBody;
		const { date, type, petId } = body;

		if (!userId) {
			throw new UnauthorizedError();
		}

		if (!date || !type || !petId) {
			throw new InputValidationError("Date, Type and Pet ID are required");
		}

		const parsedDate = new Date(date);
		if (Number.isNaN(parsedDate.getTime())) {
			throw new InputValidationError("Invalid date format");
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
	}
}
