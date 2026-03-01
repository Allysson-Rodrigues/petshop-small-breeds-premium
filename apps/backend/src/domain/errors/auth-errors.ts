import { AppError } from "./app-error.js";

export class DuplicateEmailError extends AppError {
	constructor() {
		super("Email already registered", 409);
		this.name = "DuplicateEmailError";
	}
}

export class InvalidCredentialsError extends AppError {
	constructor() {
		super("Invalid credentials", 401);
		this.name = "InvalidCredentialsError";
	}
}
