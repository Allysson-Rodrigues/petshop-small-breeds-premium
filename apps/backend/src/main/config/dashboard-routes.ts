import { Router } from "express";
import { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import { PrismaAppointmentRepository } from "../../infrastructure/prisma/prisma-appointment.repository.js";
import { PrismaPetRepository } from "../../infrastructure/prisma/prisma-pet.repository.js";
import { CreateAppointmentController } from "../../presentation/controllers/create-appointment.controller.js";
import { CreatePetController } from "../../presentation/controllers/create-pet.controller.js";
import { GetCustomerDashboardController } from "../../presentation/controllers/get-customer-dashboard.controller.js";
import { adaptRoute } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

const petRepository = new PrismaPetRepository();
const appointmentRepository = new PrismaAppointmentRepository();

// Dashboard
const getDashboardUseCase = new GetCustomerDashboardUseCase(
	petRepository,
	appointmentRepository,
);
const getDashboardController = new GetCustomerDashboardController(
	getDashboardUseCase,
);

// Actions
const createPetUseCase = new CreatePetUseCase(petRepository);
const createPetController = new CreatePetController(createPetUseCase);

const createAppointmentUseCase = new CreateAppointmentUseCase(
	appointmentRepository,
);
const createAppointmentController = new CreateAppointmentController(
	createAppointmentUseCase,
);

router.get("/customer", authMiddleware, adaptRoute(getDashboardController));
router.post("/pets", authMiddleware, adaptRoute(createPetController));
router.post(
	"/appointments",
	authMiddleware,
	adaptRoute(createAppointmentController),
);

export default router;
