import type { Appointment } from "../entities/appointment.entity.js";

export interface AppointmentRepository {
	findAll(): Promise<Appointment[]>;
	findByUserId(userId: string): Promise<Appointment[]>;
	create(appointment: Omit<Appointment, "id" | "status">): Promise<Appointment>;
	updateStatus(id: string, status: string): Promise<Appointment>;
	delete(id: string): Promise<void>;
}
