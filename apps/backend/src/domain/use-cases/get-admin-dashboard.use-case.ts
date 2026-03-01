import type { Pet } from "../entities/pet.entity.js";
import type { AppointmentRepository } from "../repositories/appointment.repository.js";
import type { PetRepository } from "../repositories/pet.repository.js";
import type { ProductRepository } from "../repositories/product.repository.js";
import type { UserRepository } from "../repositories/user.repository.js";

interface AdminDashboardData {
	stats: {
		totalPets: number;
		totalAppointments: number;
		totalClients: number;
		totalProducts: number;
		lowStockItems: number;
	};
	recentPets: Pet[];
}

export class GetAdminDashboardUseCase {
	constructor(
		private readonly petRepository: PetRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly userRepository: UserRepository,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(): Promise<AdminDashboardData> {
		const [pets, appointments, users, products] = await Promise.all([
			this.petRepository.findAll(),
			this.appointmentRepository.findAll(),
			this.userRepository.findAll(),
			this.productRepository.findAll(),
		]);

		const lowStockItems = products.filter((p) => p.stock <= 5).length;

		return {
			stats: {
				totalPets: pets.length,
				totalAppointments: appointments.length,
				totalClients: users.length,
				totalProducts: products.length,
				lowStockItems,
			},
			recentPets: pets.slice(0, 5),
		};
	}
}
