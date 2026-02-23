import type { JwtPayload } from "jsonwebtoken";

export interface Encrypter {
	encrypt(payload: Record<string, unknown>): Promise<string>;
	decrypt(token: string): Promise<JwtPayload | string>;
}
