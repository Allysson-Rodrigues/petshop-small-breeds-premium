export class DuplicateEmailError extends Error {
	constructor() {
		super("Email already registered");
		this.name = "DuplicateEmailError";
	}
}

export class InvalidCredentialsError extends Error {
	constructor() {
		super("Invalid credentials");
		this.name = "InvalidCredentialsError";
	}
}

export class InputValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InputValidationError";
	}
}
