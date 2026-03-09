import { Router } from "express";
import { createBookingRequestSchema } from "../../domain/schemas/validation.js";
import { prisma } from "../../infrastructure/prisma/client.js";
import { adaptAsyncHandler } from "../adapters/express-route-adapter.js";
import { publicBookingRateLimiter } from "../middlewares/rate-limiter.js";
import { parseSchema } from "../utils/validation.js";

const router = Router();

router.post(
	"/booking-requests",
	publicBookingRateLimiter,
	adaptAsyncHandler(async (req, res) => {
		const bookingRequestInput = parseSchema(
			createBookingRequestSchema,
			req.body,
		);
		const bookingRequest = await prisma.bookingRequest.create({
			data: {
				petName: bookingRequestInput.petName,
				petBreed: bookingRequestInput.petBreed,
				serviceType: bookingRequestInput.serviceType,
				preferredDate: new Date(bookingRequestInput.preferredDate),
				preferredPeriod: bookingRequestInput.preferredPeriod,
				ownerName: bookingRequestInput.ownerName,
				ownerEmail: bookingRequestInput.ownerEmail,
				ownerPhone: bookingRequestInput.ownerPhone || null,
				notes: bookingRequestInput.notes || null,
			},
		});

		res.status(201).json({
			id: bookingRequest.id,
			status: bookingRequest.status,
			protocol: bookingRequest.id.slice(0, 8).toUpperCase(),
			message: "Booking request created",
		});
	}),
);

export default router;
