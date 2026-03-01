import { type Request, type Response, Router } from "express";
import { CreateAppointmentUseCase } from "../../domain/use-cases/create-appointment.use-case.js";
import { CreatePetUseCase } from "../../domain/use-cases/create-pet.use-case.js";
import { GetCustomerDashboardUseCase } from "../../domain/use-cases/get-customer-dashboard.use-case.js";
import { PrismaAppointmentRepository } from "../../infrastructure/prisma/prisma-appointment.repository.js";
import { PrismaPetRepository } from "../../infrastructure/prisma/prisma-pet.repository.js";
import { PrismaProductRepository } from "../../infrastructure/prisma/prisma-product.repository.js";
import { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";
import { CreateAppointmentController } from "../../presentation/controllers/create-appointment.controller.js";
import { CreatePetController } from "../../presentation/controllers/create-pet.controller.js";
import { GetCustomerDashboardController } from "../../presentation/controllers/get-customer-dashboard.controller.js";
import { adaptRoute } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Repositories
const petRepository = new PrismaPetRepository();
const appointmentRepository = new PrismaAppointmentRepository();
const userRepository = new PrismaUserRepository();
const productRepository = new PrismaProductRepository();

// ── Dashboard (existing) ─────────────────────────────────────
const getDashboardUseCase = new GetCustomerDashboardUseCase(
	petRepository,
	appointmentRepository,
);
const getDashboardController = new GetCustomerDashboardController(
	getDashboardUseCase,
);

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

// ── Pets CRUD ─────────────────────────────────────────────────
router.get("/pets", authMiddleware, async (req: Request, res: Response) => {
	try {
		const userId = req.headers["x-user-id"] as string;
		const pets = await petRepository.findByUserId(userId);
		res.json(pets);
	} catch (_error) {
		res.status(500).json({ message: "Failed to fetch pets" });
	}
});

router.put("/pets/:id", authMiddleware, async (req: Request, res: Response) => {
	try {
		const pet = await petRepository.update(String(req.params.id), req.body);
		res.json(pet);
	} catch (_error) {
		res.status(500).json({ message: "Failed to update pet" });
	}
});

router.delete(
	"/pets/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			await petRepository.delete(String(req.params.id));
			res.json({ message: "Pet deleted" });
		} catch (_error) {
			res.status(500).json({ message: "Failed to delete pet" });
		}
	},
);

// ── Appointments CRUD ─────────────────────────────────────────
router.get(
	"/appointments",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const userId = req.headers["x-user-id"] as string;
			const appointments = await appointmentRepository.findByUserId(userId);
			res.json(appointments);
		} catch (_error) {
			res.status(500).json({ message: "Failed to fetch appointments" });
		}
	},
);

router.put(
	"/appointments/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const { status } = req.body;
			const appointment = await appointmentRepository.updateStatus(
				String(req.params.id),
				status,
			);
			res.json(appointment);
		} catch (_error) {
			res.status(500).json({ message: "Failed to update appointment" });
		}
	},
);

router.delete(
	"/appointments/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			await appointmentRepository.delete(String(req.params.id));
			res.json({ message: "Appointment deleted" });
		} catch (_error) {
			res.status(500).json({ message: "Failed to delete appointment" });
		}
	},
);

// ── Clients (Users) CRUD ──────────────────────────────────────
router.get("/clients", authMiddleware, async (_req: Request, res: Response) => {
	try {
		const users = await userRepository.findAll();
		const safeUsers = users.map(({ password: _, ...user }) => ({
			...user,
			petsCount: 0,
		}));
		res.json(safeUsers);
	} catch (_error) {
		res.status(500).json({ message: "Failed to fetch clients" });
	}
});

router.put(
	"/clients/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const { password: _, ...data } = req.body;
			const user = await userRepository.update(String(req.params.id), data);
			const { password: __, ...safeUser } = user;
			res.json(safeUser);
		} catch (_error) {
			res.status(500).json({ message: "Failed to update client" });
		}
	},
);

router.delete(
	"/clients/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			await userRepository.delete(String(req.params.id));
			res.json({ message: "Client deleted" });
		} catch (_error) {
			res.status(500).json({ message: "Failed to delete client" });
		}
	},
);

// ── Products (Inventory) CRUD ─────────────────────────────────
router.get(
	"/products",
	authMiddleware,
	async (_req: Request, res: Response) => {
		try {
			const products = await productRepository.findAll();
			res.json(products);
		} catch (_error) {
			res.status(500).json({ message: "Failed to fetch products" });
		}
	},
);

router.post(
	"/products",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const product = await productRepository.create(req.body);
			res.status(201).json(product);
		} catch (_error) {
			res.status(500).json({ message: "Failed to create product" });
		}
	},
);

router.put(
	"/products/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			const product = await productRepository.update(
				String(req.params.id),
				req.body,
			);
			res.json(product);
		} catch (_error) {
			res.status(500).json({ message: "Failed to update product" });
		}
	},
);

router.delete(
	"/products/:id",
	authMiddleware,
	async (req: Request, res: Response) => {
		try {
			await productRepository.delete(String(req.params.id));
			res.json({ message: "Product deleted" });
		} catch (_error) {
			res.status(500).json({ message: "Failed to delete product" });
		}
	},
);

export default router;
