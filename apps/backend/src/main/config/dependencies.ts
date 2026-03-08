import { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import { GetAdminDashboardUseCase } from "../../domain/use-cases/get-admin-dashboard.use-case.js";
import { GetCurrentUserUseCase } from "../../domain/use-cases/get-current-user.use-case.js";
import { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import { LoginUseCase } from "../../domain/use-cases/login.use-case.js";
import { RegisterUserUseCase } from "../../domain/use-cases/register-user.use-case.js";
import { JwtEncrypter } from "../../infrastructure/auth/jwt-encrypter.js";
import { BcryptHasher } from "../../infrastructure/cryptography/bcrypt-hasher.js";
import { PrismaAppointmentRepository } from "../../infrastructure/prisma/prisma-appointment.repository.js";
import { PrismaPetRepository } from "../../infrastructure/prisma/prisma-pet.repository.js";
import { PrismaProductRepository } from "../../infrastructure/prisma/prisma-product.repository.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { CreateAppointmentController } from "../../presentation/controllers/create-appointment.controller.js";
import { CreatePetController } from "../../presentation/controllers/create-pet.controller.js";
import { GetAdminDashboardController } from "../../presentation/controllers/get-admin-dashboard.controller.js";
import { GetCurrentUserController } from "../../presentation/controllers/get-current-user.controller.js";
import { GetCustomerDashboardController } from "../../presentation/controllers/get-customer-dashboard.controller.js";
import { LoginController } from "../../presentation/controllers/login.controller.js";
import { RegisterController } from "../../presentation/controllers/register.controller.js";
import { getJwtSecret } from "./env.js";

export const userRepository = new PrismaUserRepository();
export const petRepository = new PrismaPetRepository();
export const appointmentRepository = new PrismaAppointmentRepository();
export const productRepository = new PrismaProductRepository();

const hasher = new BcryptHasher();
const encrypter = new JwtEncrypter(getJwtSecret());

export const registerUserUseCase = new RegisterUserUseCase(
	userRepository,
	hasher,
);
export const loginUseCase = new LoginUseCase(userRepository, hasher, encrypter);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
export const createPetUseCase = new CreatePetUseCase(petRepository);
export const createAppointmentUseCase = new CreateAppointmentUseCase(
	appointmentRepository,
);
export const getCustomerDashboardUseCase = new GetCustomerDashboardUseCase(
	petRepository,
	appointmentRepository,
);
export const getAdminDashboardUseCase = new GetAdminDashboardUseCase(
	petRepository,
	appointmentRepository,
	userRepository,
	productRepository,
);

export const registerController = new RegisterController(registerUserUseCase);
export const loginController = new LoginController(loginUseCase);
export const getCurrentUserController = new GetCurrentUserController(
	getCurrentUserUseCase,
);
export const createPetController = new CreatePetController(createPetUseCase);
export const createAppointmentController = new CreateAppointmentController(
	createAppointmentUseCase,
);
export const getCustomerDashboardController =
	new GetCustomerDashboardController(getCustomerDashboardUseCase);
export const getAdminDashboardController = new GetAdminDashboardController(
	getAdminDashboardUseCase,
);
