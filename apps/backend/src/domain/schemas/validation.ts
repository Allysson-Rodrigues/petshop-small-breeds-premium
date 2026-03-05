import { z } from "zod";
import { ProductCategory } from "../entities/product.entity.js";

// ── Pet Schemas ───────────────────────────────────────────────
export const createPetSchema = z.object({
	name: z.string().min(1, "Pet name is required").max(100),
	breed: z.string().min(1, "Breed is required").max(100),
	age: z.number().int().min(0).max(30),
});

export const updatePetSchema = z
	.object({
		name: z.string().min(1, "Pet name is required").max(100).optional(),
		breed: z.string().min(1, "Breed is required").max(100).optional(),
		age: z.number().int().min(0).max(30).optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});

// ── Appointment Schemas ───────────────────────────────────────
export const createAppointmentSchema = z.object({
	date: z.string().datetime({ message: "Invalid ISO date" }),
	type: z.string().min(1, "Appointment type is required").max(50),
	petId: z.string().uuid("Invalid petId"),
});

export const updateAppointmentStatusSchema = z.object({
	status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"], {
		message: "Invalid status",
	}),
});

// ── Client Schemas ────────────────────────────────────────────
export const updateClientSchema = z
	.object({
		name: z.string().min(1).max(100),
		email: z.string().email(),
		role: z.enum(["client", "admin"]),
	})
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});

// ── Product Schemas ───────────────────────────────────────────
export const createProductSchema = z.object({
	name: z.string().min(1, "Product name is required").max(200),
	description: z.string().min(1).max(1000),
	price: z.number().positive("Price must be positive"),
	category: z.nativeEnum(ProductCategory, { message: "Invalid category" }),
	stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const updateProductSchema = z.object({
	name: z.string().min(1).max(200).optional(),
	description: z.string().min(1).max(1000).optional(),
	price: z.number().positive().optional(),
	category: z.nativeEnum(ProductCategory).optional(),
	stock: z.number().int().min(0).optional(),
});
