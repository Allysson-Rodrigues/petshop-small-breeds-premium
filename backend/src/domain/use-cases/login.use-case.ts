import type { UserRepository } from "../repositories/user.repository.js";
import type { Encrypter } from "../services/encrypter.js";
import type { Hasher } from "../services/hasher.js";

export interface LoginParams {
	email: string;
	password: string;
}

export interface LoginResult {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export class LoginUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly hasher: Hasher,
		private readonly encrypter: Encrypter,
	) {}

	async execute(params: LoginParams): Promise<LoginResult> {
		const user = await this.userRepository.findByEmail(params.email);
		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isPasswordValid = await this.hasher.compare(
			params.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new Error("Invalid credentials");
		}

		const token = await this.encrypter.encrypt({ id: user.id });
		return {
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		};
	}
}
