import type { Appointment } from "../entities/appointment.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";

interface CreateAppointmentParams {
	date: Date;
	type: string;
	userId: string;
	petId: string;
}

export class CreateAppointmentUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute(params: CreateAppointmentParams): Promise<Appointment> {
		return this.appointmentRepository.create(params);
	}
}
