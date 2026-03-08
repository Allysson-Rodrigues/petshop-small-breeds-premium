import { Router } from "express";
import {
	ForbiddenError,
	NotFoundError,
} from "../../../domain/errors/app-error.js";
import {
	createAppointmentSchema,
	updateAppointmentStatusSchema,
} from "../../../domain/schemas/validation.js";
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAuthContext } from "../../utils/auth-context.js";
import { parseSchema } from "../../utils/validation.js";
import {
	appointmentRepository,
	createAppointmentController,
	petRepository,
} from "../dependencies.js";

const router = Router();

router.get(
	"/",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const appointments =
			role === "admin"
				? await appointmentRepository.findAll()
				: await appointmentRepository.findByUserId(userId);
		res.json(appointments);
	}),
);

router.post(
	"/",
	authMiddleware,
	adaptAsyncHandler(async (req, _res, next) => {
		const { userId, role } = getAuthContext(req);
		const appointmentInput = parseSchema(createAppointmentSchema, req.body);
		const pet = await petRepository.findById(appointmentInput.petId);

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		if (role !== "admin" && pet.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the pet owner");
		}

		next();
	}),
	adaptRoute(createAppointmentController),
);

router.put(
	"/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const appointmentId = String(req.params.id);
		const appointment = await appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (role !== "admin" && appointment.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the appointment owner");
		}

		const { status } = parseSchema(updateAppointmentStatusSchema, req.body);
		const updatedAppointment = await appointmentRepository.updateStatus(
			appointmentId,
			status,
		);
		res.json(updatedAppointment);
	}),
);

router.delete(
	"/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const appointmentId = String(req.params.id);
		const appointment = await appointmentRepository.findById(appointmentId);

		if (!appointment) {
			throw new NotFoundError("Appointment");
		}

		if (role !== "admin" && appointment.userId !== userId) {
			throw new ForbiddenError("Forbidden: not the appointment owner");
		}

		await appointmentRepository.delete(appointmentId);
		res.json({ message: "Appointment deleted" });
	}),
);

export default router;
