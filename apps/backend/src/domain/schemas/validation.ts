import { z } from "zod";
import { ProductCategory } from "../entities/product.entity.js";

const nonEmptyTrimmedString = (field: string, max: number) =>
	z.string().trim().min(1, `${field} is required`).max(max);

// ── Pet Schemas ───────────────────────────────────────────────
export const createPetSchema = z
	.object({
		name: nonEmptyTrimmedString("Pet name", 100),
		breed: nonEmptyTrimmedString("Breed", 100),
		age: z.coerce.number().int().min(0).max(30),
	})
	.strict();

export const updatePetSchema = z
	.object({
		name: nonEmptyTrimmedString("Pet name", 100).optional(),
		breed: nonEmptyTrimmedString("Breed", 100).optional(),
		age: z.coerce.number().int().min(0).max(30).optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});

// ── Appointment Schemas ───────────────────────────────────────
export const createAppointmentSchema = z
	.object({
		date: z.string().datetime({ message: "Invalid ISO date" }),
		type: nonEmptyTrimmedString("Appointment type", 50),
		petId: z.string().uuid("Invalid petId"),
	})
	.strict();

export const updateAppointmentStatusSchema = z
	.object({
		status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"], {
			message: "Invalid status",
		}),
	})
	.strict();

export const createBookingRequestSchema = z
	.object({
		petName: nonEmptyTrimmedString("Pet name", 100),
		petBreed: nonEmptyTrimmedString("Pet breed", 100),
		serviceType: nonEmptyTrimmedString("Service type", 80),
		preferredDate: z.string().datetime({ message: "Invalid ISO date" }),
		preferredPeriod: z.enum(["manha", "tarde"], {
			message: "Invalid preferred period",
		}),
		ownerName: nonEmptyTrimmedString("Owner name", 120),
		ownerEmail: z.string().trim().toLowerCase().email("Invalid email"),
		ownerPhone: z
			.string()
			.trim()
			.max(40, "Phone must have at most 40 characters")
			.optional()
			.or(z.literal("")),
		notes: z
			.string()
			.trim()
			.max(1000, "Notes must have at most 1000 characters")
			.optional()
			.or(z.literal("")),
	})
	.strict();

export const updateBookingRequestStatusSchema = z
	.object({
		status: z.enum(["PENDING", "CONTACTED", "APPROVED", "REJECTED"], {
			message: "Invalid booking request status",
		}),
	})
	.strict();

// ── Client Schemas ────────────────────────────────────────────
export const updateClientSchema = z
	.object({
		name: nonEmptyTrimmedString("Name", 100),
		email: z.string().trim().toLowerCase().email(),
	})
	.partial()
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});

// ── Product Schemas ───────────────────────────────────────────
export const createProductSchema = z
	.object({
		name: nonEmptyTrimmedString("Product name", 200),
		description: nonEmptyTrimmedString("Description", 1000),
		price: z.coerce.number().positive("Price must be positive"),
		category: z.nativeEnum(ProductCategory, { message: "Invalid category" }),
		stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
	})
	.strict();

export const updateProductSchema = z
	.object({
		name: nonEmptyTrimmedString("Product name", 200).optional(),
		description: nonEmptyTrimmedString("Description", 1000).optional(),
		price: z.coerce.number().positive().optional(),
		category: z.nativeEnum(ProductCategory).optional(),
		stock: z.coerce.number().int().min(0).optional(),
	})
	.strict()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field is required",
	});
