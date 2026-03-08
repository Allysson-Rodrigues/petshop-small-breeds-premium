import { Router } from "express";
import {
	createProductSchema,
	updateProductSchema,
} from "../../domain/schemas/validation.js";
import { adaptAsyncHandler } from "../adapters/express-route-adapter.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/require-role.js";
import { validateBody } from "../middlewares/validate-body.js";
import { productRepository } from "./dashboard-context.js";

const router = Router();

router.use(authMiddleware);

router.get(
	"/products",
	adaptAsyncHandler(async (_req, res) => {
		const products = await productRepository.findAll();
		res.json(products);
	}),
);

router.post(
	"/products",
	requireRole("admin"),
	validateBody(createProductSchema),
	adaptAsyncHandler(async (req, res) => {
		const product = await productRepository.create(req.body);
		res.status(201).json(product);
	}),
);

router.put(
	"/products/:id",
	requireRole("admin"),
	validateBody(updateProductSchema),
	adaptAsyncHandler(async (req, res) => {
		const product = await productRepository.update(
			String(req.params.id),
			req.body,
		);
		res.json(product);
	}),
);

router.delete(
	"/products/:id",
	requireRole("admin"),
	adaptAsyncHandler(async (req, res) => {
		await productRepository.delete(String(req.params.id));
		res.json({ message: "Product deleted" });
	}),
);

export default router;
