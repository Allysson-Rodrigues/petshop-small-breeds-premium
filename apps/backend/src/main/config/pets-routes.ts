import { Router } from "express";
import { updatePetSchema } from "../../domain/schemas/validation.js";
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
	ensurePetAccess,
	loadCurrentUser,
} from "../middlewares/dashboard-access.js";
import { validateBody } from "../middlewares/validate-body.js";
import {
	createPetController,
	petRepository,
	userRepository,
} from "./dashboard-context.js";

const router = Router();

router.use(authMiddleware, loadCurrentUser(userRepository));

router.get(
	"/pets",
	adaptAsyncHandler(async (_req, res) => {
		const currentUser = res.locals.currentUser as { id: string; role: string };
		const pets =
			currentUser.role === "admin"
				? await petRepository.findAll()
				: await petRepository.findByUserId(currentUser.id);
		res.json(pets);
	}),
);

router.post("/pets", adaptRoute(createPetController));

router.put(
	"/pets/:id",
	validateBody(updatePetSchema),
	ensurePetAccess(petRepository),
	adaptAsyncHandler(async (req, res) => {
		const updatedPet = await petRepository.update(
			String(req.params.id),
			req.body,
		);
		res.json(updatedPet);
	}),
);

router.delete(
	"/pets/:id",
	ensurePetAccess(petRepository),
	adaptAsyncHandler(async (req, res) => {
		await petRepository.delete(String(req.params.id));
		res.json({ message: "Pet deleted" });
	}),
);

export default router;
