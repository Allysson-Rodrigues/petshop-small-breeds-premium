import "express";
import type { UserRole } from "../domain/entities/user.entity.js";

declare module "express-serve-static-core" {
	interface Request {
		auth?: {
			userId: string;
			role: UserRole;
			email: string;
			name: string;
		};
		requestId?: string;
	}
}
