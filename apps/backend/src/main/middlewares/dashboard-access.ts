import type { NextFunction, Request, Response } from "express";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../domain/errors/app-error.js";
import type { PrismaAppointmentRepository } from "../../infrastructure/prisma/prisma-appointment.repository.js";
import type { PrismaPetRepository } from "../../infrastructure/prisma/prisma-pet.repository.js";
import type { PrismaUserRepository } from "../../infrastructure/prisma/prisma-user.repository.js";

type LocalsWithCurrentUser = Response["locals"] & {
	currentUser?: { id: string; role: string };
	pet?: { id: string; userId: string };
	appointment?: { id: string; userId: string };
};

export const loadCurrentUser =
	(userRepository: PrismaUserRepository) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.auth?.userId;
			if (!userId) {
				return next(new UnauthorizedError());
			}

			const user = await userRepository.findById(userId);
			if (!user) {
				return next(new UnauthorizedError("User not found"));
			}

			(res.locals as LocalsWithCurrentUser).currentUser = user;
			return next();
		} catch (error) {
			return next(error);
		}
	};

export const ensurePetAccess =
	(petRepository: PrismaPetRepository) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const currentUser = (res.locals as LocalsWithCurrentUser).currentUser;
			if (!currentUser) {
				return next(new UnauthorizedError("User not loaded"));
			}

			const pet = await petRepository.findById(String(req.params.id));
			if (!pet) {
				return next(new NotFoundError("Pet"));
			}

			if (currentUser.role !== "admin" && pet.userId !== currentUser.id) {
				return next(new ForbiddenError("Forbidden: not the pet owner"));
			}

			(res.locals as LocalsWithCurrentUser).pet = pet;
			return next();
		} catch (error) {
			return next(error);
		}
	};

export const ensureAppointmentAccess =
	(appointmentRepository: PrismaAppointmentRepository) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const currentUser = (res.locals as LocalsWithCurrentUser).currentUser;
			if (!currentUser) {
				return next(new UnauthorizedError("User not loaded"));
			}

			const appointment = await appointmentRepository.findById(
				String(req.params.id),
			);
			if (!appointment) {
				return next(new NotFoundError("Appointment"));
			}

			if (
				currentUser.role !== "admin" &&
				appointment.userId !== currentUser.id
			) {
				return next(new ForbiddenError("Forbidden: not the appointment owner"));
			}

			(res.locals as LocalsWithCurrentUser).appointment = appointment;
			return next();
		} catch (error) {
			return next(error);
		}
	};

export const ensureAppointmentPetAccess =
	(petRepository: PrismaPetRepository) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const currentUser = (res.locals as LocalsWithCurrentUser).currentUser;
			if (!currentUser) {
				return next(new UnauthorizedError("User not loaded"));
			}

			const petId = String((req.body as { petId: string }).petId);
			const pet = await petRepository.findById(petId);
			if (!pet) {
				return next(new NotFoundError("Pet"));
			}

			if (currentUser.role !== "admin" && pet.userId !== currentUser.id) {
				return next(new ForbiddenError("Forbidden: not the pet owner"));
			}

			(res.locals as LocalsWithCurrentUser).pet = pet;
			return next();
		} catch (error) {
			return next(error);
		}
	};
