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
		console.log(`[LoginUseCase] Tentativa de login para: ${params.email}`);
		const user = await this.userRepository.findByEmail(params.email);
		if (!user) {
			console.log(`[LoginUseCase] Usuário não encontrado: ${params.email}`);
			throw new Error("Invalid credentials");
		}

		console.log(`[LoginUseCase] Usuário encontrado. Comparando senhas...`);
		const isPasswordValid = await this.hasher.compare(
			params.password,
			user.password,
		);

		if (!isPasswordValid) {
			console.log(`[LoginUseCase] Senha inválida para: ${params.email}`);
			throw new Error("Invalid credentials");
		}

		console.log(
			`[LoginUseCase] Login bem-sucedido para: ${params.email}. Gerando token...`,
		);
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
