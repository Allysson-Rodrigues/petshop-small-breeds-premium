import type { User } from "../entities/user.entity.js";
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
		const existingUser = await this.userRepository.findByEmail(params.email);
		if (existingUser) {
			throw new Error("Email already registered");
		}

		const hashedPassword = await this.hasher.hash(params.password);
		return this.userRepository.create({
			name: params.name,
			email: params.email,
			password: hashedPassword,
		});
	}
}
