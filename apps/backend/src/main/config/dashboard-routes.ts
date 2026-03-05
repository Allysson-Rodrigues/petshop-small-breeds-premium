import { Router } from "express";
import type { Product } from "../../domain/entities/product.entity.js";
import type { User } from "../../domain/entities/user.entity.js";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../domain/errors/app-error.js";
import {
	createAppointmentSchema,
	createProductSchema,
	updateAppointmentStatusSchema,
	updateClientSchema,
	updatePetSchema,
	updateProductSchema,
} from "../../domain/schemas/validation.js";
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
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/require-role.js";

const router = Router();

// Repositories
const petRepository = new PrismaPetRepository();
const appointmentRepository = new PrismaAppointmentRepository();
const userRepository = new PrismaUserRepository();
const productRepository = new PrismaProductRepository();

// ── Dashboard ─────────────────────────────────────────────────
const getDashboardUseCase = new GetCustomerDashboardUseCase(
	petRepository,
	appointmentRepository,
);
const getDashboardController = new GetCustomerDashboardController(
	getDashboardUseCase,
);

const getAdminDashboardUseCase = new GetAdminDashboardUseCase(
	petRepository,
	appointmentRepository,
	userRepository,
	productRepository,
);
const getAdminDashboardController = new GetAdminDashboardController(
	getAdminDashboardUseCase,
);

const createPetUseCase = new CreatePetUseCase(petRepository);
const createPetController = new CreatePetController(createPetUseCase);

const createAppointmentUseCase = new CreateAppointmentUseCase(
	appointmentRepository,
);
const createAppointmentController = new CreateAppointmentController(
	createAppointmentUseCase,
);
const createAppointmentRoute = adaptRoute(createAppointmentController);

router.get("/customer", authMiddleware, adaptRoute(getDashboardController));
router.get(
	"/admin",
	authMiddleware,
	requireRole("admin"),
	adaptRoute(getAdminDashboardController),
);
router.post("/pets", authMiddleware, adaptRoute(createPetController));
router.post(
	"/appointments",
	authMiddleware,
	adaptAsyncHandler(async (req, _res, next) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}

		const parsed = createAppointmentSchema.safeParse(req.body);
		if (!parsed.success) {
			return next();
		}

		const [user, pet] = await Promise.all([
			userRepository.findById(userId),
			petRepository.findById(parsed.data.petId),
		]);

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		if (user.role !== "admin" && pet.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the pet owner");
		}

		next();
	}),
	createAppointmentRoute,
);

// ── Pets CRUD ─────────────────────────────────────────────────
router.get(
	"/pets",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}
		const user = await userRepository.findById(userId);

		const pets =
			user?.role === "admin"
				? await petRepository.findAll()
				: await petRepository.findByUserId(userId);
		res.json(pets);
	}),
);

router.put(
	"/pets/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}
		const user = await userRepository.findById(userId);
		const petId = String(req.params.id);
		const pet = await petRepository.findById(petId);

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		if (user?.role !== "admin" && pet.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the pet owner");
		}

		const parsed = updatePetSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(422).json({
				message: "Validation error",
				errors: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const updatedPet = await petRepository.update(
			petId,
			parsed.data as Partial<
				Omit<import("../../domain/entities/pet.entity.js").Pet, "id">
			>,
		);
		res.json(updatedPet);
	}),
);

router.delete(
	"/pets/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}
		const user = await userRepository.findById(userId);
		const petId = String(req.params.id);
		const pet = await petRepository.findById(petId);

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		if (user?.role !== "admin" && pet.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the pet owner");
		}

		await petRepository.delete(petId);
		res.json({ message: "Pet deleted" });
	}),
);

// ── Appointments CRUD ─────────────────────────────────────────
router.get(
	"/appointments",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}

		const user = await userRepository.findById(userId);
		const appointments =
			user?.role === "admin"
				? await appointmentRepository.findAll()
				: await appointmentRepository.findByUserId(userId);
		res.json(appointments);
	}),
);

router.put(
	"/appointments/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}

		const [user, appointment] = await Promise.all([
			userRepository.findById(userId),
			appointmentRepository.findById(String(req.params.id)),
		]);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (user?.role !== "admin" && appointment.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the appointment owner");
		}

		const parsed = updateAppointmentStatusSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(422).json({
				message: "Validation error",
				errors: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const updatedAppointment = await appointmentRepository.updateStatus(
			String(req.params.id),
			parsed.data.status,
		);
		res.json(updatedAppointment);
	}),
);

router.delete(
	"/appointments/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const userId = req.auth?.userId;
		if (!userId) {
			throw new UnauthorizedError();
		}

		const [user, appointment] = await Promise.all([
			userRepository.findById(userId),
			appointmentRepository.findById(String(req.params.id)),
		]);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (user?.role !== "admin" && appointment.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the appointment owner");
		}

		await appointmentRepository.delete(String(req.params.id));
		res.json({ message: "Appointment deleted" });
	}),
);

// ── Clients (Users) — Admin only ─────────────────────────────
router.get(
	"/clients",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (_req, res) => {
		const [users, pets] = await Promise.all([
			userRepository.findAll(),
			petRepository.findAll(),
		]);
		const safeUsers = users
			.filter((user) => user.role !== "admin")
			.map(({ password: _, ...user }) => ({
				...user,
				petsCount: pets.filter((pet) => pet.userId === user.id).length,
			}));
		res.json(safeUsers);
	}),
);

router.put(
	"/clients/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const parsed = updateClientSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(422).json({
				message: "Validation error",
				errors: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const user = await userRepository.update(
			String(req.params.id),
			parsed.data as Partial<Omit<User, "id" | "createdAt">>,
		);
		const { password: _, ...safeUser } = user;
		res.json(safeUser);
	}),
);

router.delete(
	"/clients/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		await userRepository.delete(String(req.params.id));
		res.json({ message: "Client deleted" });
	}),
);

// ── Products (Inventory) — Admin for writes, auth for reads ──
router.get(
	"/products",
	authMiddleware,
	adaptAsyncHandler(async (_req, res) => {
		const products = await productRepository.findAll();
		res.json(products);
	}),
);

router.post(
	"/products",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const parsed = createProductSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(422).json({
				message: "Validation error",
				errors: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const product = await productRepository.create(
			parsed.data as Omit<Product, "id">,
		);
		res.status(201).json(product);
	}),
);

router.put(
	"/products/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const parsed = updateProductSchema.safeParse(req.body);
		if (!parsed.success) {
			res.status(422).json({
				message: "Validation error",
				errors: parsed.error.flatten().fieldErrors,
			});
			return;
		}

		const product = await productRepository.update(
			String(req.params.id),
			parsed.data as Partial<Omit<Product, "id">>,
		);
		res.json(product);
	}),
);

router.delete(
	"/products/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		await productRepository.delete(String(req.params.id));
		res.json({ message: "Product deleted" });
	}),
);

export default router;
