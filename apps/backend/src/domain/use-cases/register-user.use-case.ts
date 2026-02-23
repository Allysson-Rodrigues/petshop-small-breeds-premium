import type { User } from "../entities/user.entity.js";
import {
	DuplicateEmailError,
	InputValidationError,
} from "../errors/auth-errors.js";
import type { UserRepository } from "../repositories/user.repository.js";
import type { Hasher } from "../services/hasher.js";

export interface RegisterUserParams {
	name: string;
	email: string;
	password: string;
}

export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
	) {}

	async execute(params: RegisterUserParams): Promise<User> {
		const normalizedName = params.name.trim();
		const normalizedEmail = params.email.trim().toLowerCase();
		const normalizedPassword = params.password.trim();

		if (!normalizedName || normalizedName.length < 2) {
			throw new InputValidationError("Invalid name");
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(normalizedEmail)) {
			throw new InputValidationError("Invalid email");
		}

		if (normalizedPassword.length < 6) {
			throw new InputValidationError(
				"Password must have at least 6 characters",
			);
		}

		const existingUser = await this.userRepository.findByEmail(normalizedEmail);
		if (existingUser) {
			throw new DuplicateEmailError();
		}

		const hashedPassword = await this.hasher.hash(normalizedPassword);
		return this.userRepository.create({
			name: normalizedName,
			email: normalizedEmail,
			password: hashedPassword,
		});
	}
}
