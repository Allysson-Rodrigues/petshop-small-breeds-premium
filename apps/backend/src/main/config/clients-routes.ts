import { Router } from "express";
import { updateClientSchema } from "../../domain/schemas/validation.js";
import { adaptAsyncHandler } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/require-role.js";
import { validateBody } from "../middlewares/validate-body.js";
import { petRepository, userRepository } from "./dashboard-context.js";

const router = Router();

router.use(authMiddleware, requireRole("admin"));

router.get(
	"/clients",
	adaptAsyncHandler(async (_req, res) => {
		const [users, pets] = await Promise.all([
			userRepository.findAll(),
			petRepository.findAll(),
		]);
		const safeUsers = users
			.filter((user) => user.role !== "admin")
			.map(({ password: _password, ...user }) => ({
				...user,
				petsCount: pets.filter((pet) => pet.userId === user.id).length,
			}));
		res.json(safeUsers);
	}),
);

router.put(
	"/clients/:id",
	validateBody(updateClientSchema),
	adaptAsyncHandler(async (req, res) => {
		const user = await userRepository.update(String(req.params.id), req.body);
		const { password: _password, ...safeUser } = user;
		res.json(safeUser);
	}),
);

router.delete(
	"/clients/:id",
	adaptAsyncHandler(async (req, res) => {
		await userRepository.delete(String(req.params.id));
		res.json({ message: "Client deleted" });
	}),
);

export default router;
