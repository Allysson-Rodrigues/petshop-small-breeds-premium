import type { Appointment } from "../../domain/entities/appointment.entity.js";
import type { AppointmentRepository } from "../../domain/repositories/appointment.repository.ts";
import { prisma } from "./client.js";

export class PrismaAppointmentRepository implements AppointmentRepository {
	private prisma = prisma;

	async findByUserId(userId: string): Promise<Appointment[]> {
		const appointments = await this.prisma.appointment.findMany({
			where: { userId },
			orderBy: { date: "desc" },
		});
		return appointments as unknown as Appointment[];
	}

	async create(
		appointment: Omit<Appointment, "id" | "status">,
	): Promise<Appointment> {
		const createdAppointment = await this.prisma.appointment.create({
			data: {
				date: appointment.date,
				type: appointment.type,
				userId: appointment.userId,
				petId: appointment.petId,
			},
		});
		return createdAppointment as unknown as Appointment;
	}
}
