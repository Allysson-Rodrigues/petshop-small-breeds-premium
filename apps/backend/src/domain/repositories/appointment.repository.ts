import type { Appointment } from "../entities/appointment.entity.js";

export interface AppointmentRepository {
	findAll(): Promise<Appointment[]>;
	findById(id: string): Promise<Appointment | null>;
	findByUserId(userId: string): Promise<Appointment[]>;
	create(appointment: Omit<Appointment, "id" | "status">): Promise<Appointment>;
	updateStatus(id: string, status: string): Promise<Appointment>;
	delete(id: string): Promise<void>;
}
