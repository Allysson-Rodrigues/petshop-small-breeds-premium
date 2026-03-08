import { Router } from "express";
import { NotFoundError } from "../../../domain/errors/app-error.js";
import {
	createProductSchema,
	updateProductSchema,
} from "../../../domain/schemas/validation.js";
import { adaptAsyncHandler } from "../../adapters/express-route-adapter.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/require-role.js";
import { compactObject } from "../../utils/compact-object.js";
import { parseSchema } from "../../utils/validation.js";
import { productRepository } from "../dependencies.js";

const router = Router();

router.get(
	"/",
	authMiddleware,
	adaptAsyncHandler(async (_req, res) => {
		const products = await productRepository.findAll();
		res.json(products);
	}),
);

router.post(
	"/",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const product = await productRepository.create(
			parseSchema(createProductSchema, req.body),
		);
		res.status(201).json(product);
	}),
);

router.put(
	"/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const productId = String(req.params.id);
		const existingProduct = await productRepository.findById(productId);

		if (!existingProduct) {
			throw new NotFoundError("Product");
		}

		const product = await productRepository.update(
			productId,
			compactObject(parseSchema(updateProductSchema, req.body)),
		);
		res.json(product);
	}),
);

router.delete(
	"/:id",
	authMiddleware,
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		const productId = String(req.params.id);
		const existingProduct = await productRepository.findById(productId);

		if (!existingProduct) {
			throw new NotFoundError("Product");
		}

		await productRepository.delete(productId);
		res.json({ message: "Product deleted" });
	}),
);

export default router;
