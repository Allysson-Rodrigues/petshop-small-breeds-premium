import type { Appointment } from "../entities/appointment.entity.js";
import type { Pet } from "../entities/pet.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { PetRepository } from "../repositories/pet.repository.js";

interface DashboardData {
	pets: Pet[];
	appointments: Appointment[];
	stats: {
		totalPets: number;
		totalAppointments: number;
		nextAppointment: Date | null;
	};
}

export class GetCustomerDashboardUseCase {
	constructor(
		private readonly petRepository: PetRepository,
		private readonly appointmentRepository: AppointmentRepository,
	) {}

	async execute(userId: string): Promise<DashboardData> {
		const [pets, appointments] = await Promise.all([
			this.petRepository.findByUserId(userId),
			this.appointmentRepository.findByUserId(userId),
		]);

		const nextAppointment =
			appointments
				.filter((a) => new Date(a.date) > new Date())
				.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
				)[0]?.date || null;

		return {
			pets,
			appointments,
			stats: {
				totalPets: pets.length,
				totalAppointments: appointments.length,
				nextAppointment,
			},
		};
	}
}
