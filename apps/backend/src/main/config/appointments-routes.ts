import { Router } from "express";
import {
	createAppointmentSchema,
	updateAppointmentStatusSchema,
} from "../../domain/schemas/validation.js";
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
	ensureAppointmentAccess,
	ensureAppointmentPetAccess,
	loadCurrentUser,
} from "../middlewares/dashboard-access.js";
import { validateBody } from "../middlewares/validate-body.js";
import {
	appointmentRepository,
	createAppointmentController,
	petRepository,
	userRepository,
} from "./dashboard-context.js";

const router = Router();

router.use(authMiddleware, loadCurrentUser(userRepository));

router.get(
	"/appointments",
	adaptAsyncHandler(async (_req, res) => {
		const currentUser = res.locals.currentUser as { id: string; role: string };
		const appointments =
			currentUser.role === "admin"
				? await appointmentRepository.findAll()
				: await appointmentRepository.findByUserId(currentUser.id);
		res.json(appointments);
	}),
);

router.post(
	"/appointments",
	validateBody(createAppointmentSchema),
	ensureAppointmentPetAccess(petRepository),
	adaptRoute(createAppointmentController),
);

router.put(
	"/appointments/:id",
	validateBody(updateAppointmentStatusSchema),
	ensureAppointmentAccess(appointmentRepository),
	adaptAsyncHandler(async (req, res) => {
		const updatedAppointment = await appointmentRepository.updateStatus(
			String(req.params.id),
			(
				req.body as {
					status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
				}
			).status,
		);
		res.json(updatedAppointment);
	}),
);

router.delete(
	"/appointments/:id",
	ensureAppointmentAccess(appointmentRepository),
	adaptAsyncHandler(async (req, res) => {
		await appointmentRepository.delete(String(req.params.id));
		res.json({ message: "Appointment deleted" });
	}),
);

export default router;
