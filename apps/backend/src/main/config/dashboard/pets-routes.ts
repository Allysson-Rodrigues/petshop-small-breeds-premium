import { Router } from "express";
import {
	ForbiddenError,
	NotFoundError,
} from "../../../domain/errors/app-error.js";
import { updatePetSchema } from "../../../domain/schemas/validation.js";
import {
	adaptAsyncHandler,
	adaptRoute,
} from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getAuthContext } from "../../utils/auth-context.js";
import { compactObject } from "../../utils/compact-object.js";
import { parseSchema } from "../../utils/validation.js";
import { createPetController, petRepository } from "../dependencies.js";

const router = Router();

const assertPetAccess = (userId: string, role: string, ownerId: string) => {
	if (role !== "admin" && ownerId !== userId) {
		throw new ForbiddenError("Forbidden: not the pet owner");
	}
};

router.get(
	"/",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const pets =
			role === "admin"
				? await petRepository.findAll()
				: await petRepository.findByUserId(userId);
		res.json(pets);
	}),
);

router.post("/", authMiddleware, adaptRoute(createPetController));

router.put(
	"/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const petId = String(req.params.id);
		const pet = await petRepository.findById(petId);

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		assertPetAccess(userId, role, pet.userId);

		const updatedPet = await petRepository.update(
			petId,
			compactObject(parseSchema(updatePetSchema, req.body)),
		);
		res.json(updatedPet);
	}),
);

router.delete(
	"/:id",
	authMiddleware,
	adaptAsyncHandler(async (req, res) => {
		const { userId, role } = getAuthContext(req);
		const petId = String(req.params.id);
		const pet = await petRepository.findById(petId);

		if (!pet) {
			throw new NotFoundError("Pet");
		}

		assertPetAccess(userId, role, pet.userId);

		await petRepository.delete(petId);
		res.json({ message: "Pet deleted" });
	}),
);

export default router;
