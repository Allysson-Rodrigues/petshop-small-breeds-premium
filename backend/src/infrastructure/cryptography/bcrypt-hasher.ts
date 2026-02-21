import bcrypt from "bcrypt";
import type { Hasher } from "../../domain/services/hasher.js";

export class BcryptHasher implements Hasher {
	private readonly salt = 12;

	async hash(plainText: string): Promise<string> {
		return bcrypt.hash(plainText, this.salt);
	}

	async compare(plainText: string, hashedText: string): Promise<boolean> {
		return bcrypt.compare(plainText, hashedText);
	}
}
