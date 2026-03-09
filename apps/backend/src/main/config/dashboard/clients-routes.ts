import { Router } from "express";
import {
	ForbiddenError,
	NotFoundError,
} from "../../../domain/errors/app-error.js";
import { updateClientSchema } from "../../../domain/schemas/validation.js";
import { adaptAsyncHandler } from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/require-role.js";
import { compactObject } from "../../utils/compact-object.js";
import { toSafeUser } from "../../utils/safe-user.js";
import { parseSchema } from "../../utils/validation.js";
import { petRepository, userRepository } from "../dependencies.js";

const router = Router();

router.get(
	"/",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (_req, res) => {
		const users = await userRepository.findClients();
		const petsCountByOwnerId = await petRepository.countByOwnerIds(
			users.map((user) => user.id),
		);

		const safeUsers = users.map((user) => ({
			...toSafeUser(user),
			petsCount: petsCountByOwnerId[user.id] ?? 0,
		}));

		res.json(safeUsers);
	}),
);

router.put(
	"/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const clientId = String(req.params.id);
		const existingUser = await userRepository.findById(clientId);

		if (!existingUser) {
			throw new NotFoundError("Client");
		}

		if (existingUser.role === "admin") {
			throw new ForbiddenError("Admin users cannot be edited from clients");
		}

		const user = await userRepository.update(
			clientId,
			compactObject(parseSchema(updateClientSchema, req.body)),
		);

		res.json(toSafeUser(user));
	}),
);

router.delete(
	"/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const clientId = String(req.params.id);
		const existingUser = await userRepository.findById(clientId);

		if (!existingUser) {
			throw new NotFoundError("Client");
		}

		if (existingUser.role === "admin") {
			throw new ForbiddenError("Admin users cannot be deleted from clients");
		}

		await userRepository.delete(clientId);
		res.json({ message: "Client deleted" });
	}),
);

export default router;
