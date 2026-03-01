export class AppError extends Error {
	constructor(
		public readonly message: string,
		public readonly statusCode = 400,
	) {
		super(message);
		this.name = "AppError";
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
		this.name = "UnauthorizedError";
	}
}

export class NotFoundError extends AppError {
	constructor(item = "Resource") {
		super(`${item} not found`, 404);
		this.name = "NotFoundError";
	}
}

export class ServerError extends AppError {
	constructor(message = "Internal server error") {
		super(message, 500);
		this.name = "ServerError";
	}
}

export class InputValidationError extends AppError {
	constructor(message: string) {
		super(message, 422);
		this.name = "InputValidationError";
	}
}
