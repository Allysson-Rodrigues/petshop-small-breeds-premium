import type { Appointment } from "../entities/appointment.entity.js";

export interface AppointmentRepository {
	findByUserId(userId: string): Promise<Appointment[]>;
	create(appointment: Omit<Appointment, "id" | "status">): Promise<Appointment>;
}
