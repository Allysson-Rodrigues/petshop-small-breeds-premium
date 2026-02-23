import jwt from "jsonwebtoken";
import type { Encrypter } from "../../domain/services/encrypter.js";

export class JwtEncrypter implements Encrypter {
	constructor(private readonly secret: string) {}

	async encrypt(payload: Record<string, unknown>): Promise<string> {
		return jwt.sign(payload, this.secret, { expiresIn: "1d" });
	}

	async decrypt(token: string): Promise<jwt.JwtPayload | string> {
		return jwt.verify(token, this.secret);
	}
}
