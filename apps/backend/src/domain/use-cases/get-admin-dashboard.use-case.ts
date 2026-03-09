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
		const [
			totalPets,
			totalAppointments,
			totalClients,
			totalProducts,
			lowStockItems,
			recentPets,
		] = await Promise.all([
			this.petRepository.countAll(),
			this.appointmentRepository.countAll(),
			this.userRepository.countClients(),
			this.productRepository.countAll(),
			this.productRepository.countLowStock(5),
			this.petRepository.findRecent(5),
		]);

		return {
			stats: {
				totalPets,
				totalAppointments,
				totalClients,
				totalProducts,
				lowStockItems,
			},
			recentPets,
		};
	}
}
