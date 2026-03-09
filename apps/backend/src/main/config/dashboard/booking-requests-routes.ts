import { Router } from "express";
import { NotFoundError } from "../../../domain/errors/app-error.js";
import { updateBookingRequestStatusSchema } from "../../../domain/schemas/validation.js";
import { prisma } from "../../../infrastructure/prisma/client.js";
import { adaptAsyncHandler } from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/require-role.js";
import { parseSchema } from "../../utils/validation.js";

const router = Router();

router.get(
	"/",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (_req, res) => {
		const bookingRequests = await prisma.bookingRequest.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		res.json(bookingRequests);
	}),
);

router.put(
	"/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const bookingRequestId = String(req.params.id);
		const bookingRequest = await prisma.bookingRequest.findUnique({
			where: {
				id: bookingRequestId,
			},
		});

		if (!bookingRequest) {
			throw new NotFoundError("Booking request");
		}

		const { status } = parseSchema(updateBookingRequestStatusSchema, req.body);
		const updatedBookingRequest = await prisma.bookingRequest.update({
			data: {
				status,
			},
			where: {
				id: bookingRequestId,
			},
		});

		res.json(updatedBookingRequest);
	}),
);

export default router;
