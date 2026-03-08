import type { SafeUser } from "../../main/utils/safe-user.js";
import { toSafeUser } from "../../main/utils/safe-user.js";
import { UnauthorizedError } from "../errors/app-error.js";
import type { UserRepository } from "../repositories/user.repository.js";

export class GetCurrentUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(userId: string): Promise<SafeUser> {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		return toSafeUser(user);
	}
}
