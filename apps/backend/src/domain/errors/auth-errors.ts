export class DuplicateEmailError extends Error {
	constructor() {
		super("Email already registered");
		this.name = "DuplicateEmailError";
	}
}

export class InputValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InputValidationError";
	}
}
