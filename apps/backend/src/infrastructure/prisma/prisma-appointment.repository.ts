import type { Appointment } from "../../domain/entities/appointment.entity.js";
import type { AppointmentRepository } from "../../domain/repositories/appointment.repository.js";
import { prisma } from "./client.js";

export class PrismaAppointmentRepository implements AppointmentRepository {
	private prisma = prisma;

	async findAll(): Promise<Appointment[]> {
		const appointments = await this.prisma.appointment.findMany({
			orderBy: { date: "desc" },
		});
		return appointments as unknown as Appointment[];
	}

	async findById(id: string): Promise<Appointment | null> {
		const appointment = await this.prisma.appointment.findUnique({
			where: { id },
		});
		return (appointment as Appointment | null) ?? null;
	}

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

	async updateStatus(id: string, status: string): Promise<Appointment> {
		const updated = await this.prisma.appointment.update({
			where: { id },
			data: { status },
		});
		return updated as unknown as Appointment;
	}

	async delete(id: string): Promise<void> {
		await this.prisma.appointment.delete({ where: { id } });
	}
}
