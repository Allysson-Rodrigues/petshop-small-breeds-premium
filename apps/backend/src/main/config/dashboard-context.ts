import { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import { GetAdminDashboardUseCase } from "../../domain/use-cases/get-admin-dashboard.use-case.js";
import { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import { PrismaAppointmentRepository } from "../../infrastructure/prisma/prisma-appointment.repository.js";
import { PrismaPetRepository } from "../../infrastructure/prisma/prisma-pet.repository.js";
import { PrismaProductRepository } from "../../infrastructure/prisma/prisma-product.repository.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { CreateAppointmentController } from "../../presentation/controllers/create-appointment.controller.js";
import { CreatePetController } from "../../presentation/controllers/create-pet.controller.js";
import { GetAdminDashboardController } from "../../presentation/controllers/get-admin-dashboard.controller.js";
import { GetCustomerDashboardController } from "../../presentation/controllers/get-customer-dashboard.controller.js";

export const petRepository = new PrismaPetRepository();
export const appointmentRepository = new PrismaAppointmentRepository();
export const userRepository = new PrismaUserRepository();
export const productRepository = new PrismaProductRepository();

export const getDashboardController = new GetCustomerDashboardController(
	new GetCustomerDashboardUseCase(petRepository, appointmentRepository),
);

export const getAdminDashboardController = new GetAdminDashboardController(
	new GetAdminDashboardUseCase(
		petRepository,
		appointmentRepository,
		userRepository,
		productRepository,
	),
);

export const createPetController = new CreatePetController(
	new CreatePetUseCase(petRepository),
);

export const createAppointmentController = new CreateAppointmentController(
	new CreateAppointmentUseCase(appointmentRepository),
);
