import type { User } from "../../domain/entities/user.entity.js";

export type SafeUser = Omit<User, "password">;

export const toSafeUser = ({
	password: _password,
	...safeUser
}: User): SafeUser => safeUser;
